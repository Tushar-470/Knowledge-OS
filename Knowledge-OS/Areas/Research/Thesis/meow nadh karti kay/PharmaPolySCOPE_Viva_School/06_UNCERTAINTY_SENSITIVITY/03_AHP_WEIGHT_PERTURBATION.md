# MODULE 06 - DOCUMENT 03: AHP WEIGHT PERTURBATION & BLOCKING

## 1. What is it? / Why does it exist? / Problem solved
The AHP Weight Perturbation & Blocking mechanism tracks how subjective noise introduced into the pairwise comparison matrix propagates through the Consistency Ratio (CR) governance filter. When the log-space noise pushes an AHP matrix beyond logical transitivity (defined as $CR \ge 0.08$), the PharmaPolySCOPE engine intercepts it and completely BLOCKS the replicate from entering the SP-PRP-TOPSIS evaluation. This ensures that the Monte Carlo output is not polluted by mathematically nonsensical parallel universes.

### Layer A: Literature / Theory
In classical AHP (Saaty, 1980), the Consistency Ratio measures how much a pairwise matrix deviates from perfect transitivity (e.g., if A>B and B>C, then A must be >C). The standard threshold is $CR < 0.10$. Matrices exceeding this are considered random and invalid.

### Layer B: PharmaPolySCOPE Implementation (v2.0.0-SP-PRP-TOPSIS-MC)
We use a stricter threshold of $CR < 0.08$. The perturbed matrix from `_perturb_ahp_matrix_log_space` enters `solve_ahp_preference()`. If $CR \ge 0.08$, an `AHPConsistencyViolationError` is thrown, catching the replicate and tallying it as `AHP_CR_BLOCKED`.
Production numbers out of 10,000 replicates: 1,396 blocked by AHP CR, 4 by Eigengap, Total = 1,400.

### Layer C: Rationale for Choices
Why $\sigma_{ahp}=0.15$? This exploratory computational parameter induces $\approx \pm 16\%$ multiplicative variation on pairwise judgments. For the Indomethacin baseline, it causes approximately 14% blocking because 0.15 pushes about 14% of the stochastically generated matrices just over the 0.08 consistency cliff. If we used a larger sigma, say 0.5, nearly all would fail CR, making the engine unevaluable. This demonstrates the strict governance coupling: MC provides noise, AHP engine acts as a strict structural filter.

## 2. Beginner Explanation (Level 1)
Imagine you are comparing fruits. You say Apples are better than Bananas, Bananas are better than Cherries. But then, due to the random noise we inject, you accidentally say Cherries are MUCH better than Apples. This makes no logical sense. The AHP Consistency Ratio (CR) acts as a lie-detector. When the Monte Carlo random noise creates a contradictory universe like this, the CR goes above 0.08, and the engine immediately deletes that universe (Blocks it). Out of 10,000 universes, about 1,400 were too contradictory and got blocked.

## 3. Technical Explanation (Level 2)
The baseline matrix $A_0$ is perturbed into $A_{sampled}$ via log-space Gaussian noise. `solve_ahp_preference()` in `ahp.py` computes the principal eigenvalue $\lambda_{max}$ of $A_{sampled}$. For a $4 \times 4$ matrix, Consistency Index $CI = (\lambda_{max} - 4) / 3$. The Consistency Ratio is $CR = CI / RI_4$, where $RI_4 = 0.89$ (hardcoded). 
If $CR \ge 0.08$, the pipeline raises an `AHPConsistencyViolationError`. The `MonteCarloEngine` catches this, registers `AHP_CR_BLOCKED`, and iterates. Therefore, the 8,600 valid replicates form a conditioned probability space $\mathcal{X}_{valid} = \{ x \in \mathcal{X} \mid CR(A^{(m)}) < 0.08 \}$.

## 4. Mathematics & Derivations
**CR Formulation:**
For a $4 \times 4$ matrix, perfect consistency implies $\lambda_{max} = n = 4$.
$CI = (\lambda_{max} - n) / (n - 1) = (\lambda_{max} - 4) / 3$.
$CR = CI / RI_4$. Since $RI_4 = 0.89$:
$CR = (\lambda_{max} - 4) / (3 \times 0.89) = (\lambda_{max} - 4) / 2.67$.
Threshold $CR \ge 0.08 \implies (\lambda_{max} - 4) \ge 0.2136 \implies \lambda_{max} \ge 4.2136$.
Any perturbed matrix with $\lambda_{max} \ge 4.2136$ is blocked.

## 5. Hand-Calculable Example
Take a perfectly consistent matrix (all 1s, so $\lambda_{max}=4, CR=0$).
Perturb one entry $a_{12}$ by log-noise $+0.20 \implies a_{12} = \exp(0.20) \approx 1.22$, $a_{21} = \exp(-0.20) \approx 0.82$.
The matrix is now slightly inconsistent. By computing the row geometric means and normalizing to find the dominant eigenvector $w$, we can approximate $\lambda_{max} \approx 4.015$.
$CR = (4.015 - 4) / 2.67 = 0.0056 < 0.08$. This replicate is valid.
If noise was $+1.5$, $\lambda_{max}$ would jump $> 4.3$, $CR > 0.08$, blocking it.

## 6. Actual Production Example
**Indomethacin Validation Distribution:**
- Total replicates: 10,000
- Blocked by `AHP_CR_BLOCKED`: 1,396 (13.96%)
- Blocked by `EIGENGAP_BLOCKED`: 4 (0.04%)
- Valid replicates: 8,600
- K-distribution among valid: K=1: 0%, K=2: 2.12%, K=3: 90.78%, K=4: 7.10%
- Stability distribution: STABLE: 85.55%, WARNING: 0.45%, BLOCKED: 0.04%.
The AHP CR mechanism is the DOMINANT blocking mechanism.

## 7. Exact Implementation Trace
- Perturbed matrix enters `solve_ahp_preference()` in `ahp.py`.
- Hardcoded $RI_4 = 0.89$ in `ahp.py`.
- Evaluates $\lambda_{max}$, calculates $CI$ and $CR$.
- CR check: `if CR >= 0.08:` raise `AHPConsistencyViolationError`.
- Catch in `uncertainty.py` replicate loop: increments `N_blocked`, records block reason.
- Governance stats calculated at end of loop.

## 8. Inputs / Processing / Outputs
**Inputs:** Perturbed AHP matrices $(10000, 4, 4)$.
**Processing:** Eigendecomposition to find $\lambda_{max}$, compute $CR$, conditional thresholding.
**Outputs:** 8,600 valid replicates pushed to `VariableKEngine.evaluate()`, 1,400 tallied as blocked and discarded.

## 9. Assumptions / Limitations / Failure Modes
**Assumption:** $RI_4 = 0.89$ strictly accurately reflects the average random CI for a $4 \times 4$ matrix.
**Limitation:** It strictly enforces transitivity, which may discard mildly novel but logically distinct human weighting configurations.
**Failure Mode:** If the base matrix $A_0$ is already near the $CR=0.08$ boundary, even tiny perturbations will cause $>50\%$ of replicates to be blocked, severely shrinking $N_{valid}$.

## 10. Alternatives and Why This Method Was Used
**Alternative:** Normalizing the AHP matrix without CR checks.
**Why Rejected:** If we allow $CR > 0.08$, the resulting priority weights $W$ become structurally meaningless. The resulting SP-PRP-TOPSIS tensor $M_K = V_K^T W V_K$ would be projecting the physical scores onto an illogical subjective geometry. We enforce strict governance.

## 11. Common Misconceptions
- **Misconception:** "1,396 blocked replicates means the Monte Carlo engine failed 14% of the time." **Correction:** The engine succeeded perfectly. It successfully identified and filtered out 1,396 universes that were logically contradictory.
- **Misconception:** "$RI_4$ is $0.90$." **Correction:** Standard Saaty is $0.90$, but PharmaPolySCOPE uses the more precise computational hardcode of $RI_4 = 0.89$ in `ahp.py`.

## 12. 1-Minute, 5-Minute, and Board Explanations
**1-Minute:** The random noise can sometimes make the expert weights logically contradict themselves. When this happens (CR >= 0.08), we throw that replicate away. This happened 14% of the time.
**5-Minute:** Our perturbation model uses $\sigma_{ahp}=0.15$. Because the AHP matrix is highly sensitive to intransitivity, this specific noise level pushes exactly 13.96% of our generated matrices over the strict $CR < 0.08$ threshold. The pipeline automatically catches these `AHPConsistencyViolationError`s and blocks them. The remaining 86% form our valid simulation space.
**Board Explanation:** Write A > B, B > C. Show how noise can flip C > A. Write $\lambda_{max} \ge 4.2136$. Draw a funnel with 10k entering, 1396 spilling out the side labeled "CR >= 0.08", 4 spilling out labeled "Eigengap", 8600 hitting the target.

## 13. Things Never To Claim
- NEVER claim that blocked replicates are included in the top-1 frequency calculation.
- NEVER claim $RI_4$ is anything other than 0.89.
- NEVER claim that AHP CR is the *only* blocking mechanism (Eigengap blocked 4).

## 14. Cross-References
- **Module 04 (AHP):** The fundamental mathematics of the Consistency Ratio.
- **Module 06 (Document 02):** The log-space perturbation model that causes these CR failures.

---
## 40 Viva Q&A

### Basic (10)
1. **Q:** What does CR stand for? **A:** Consistency Ratio.
2. **Q:** What is the hardcoded $RI_4$ value? **A:** 0.89.
3. **Q:** What is the CR blocking threshold? **A:** $CR \ge 0.08$.
4. **Q:** How many replicates were blocked by CR out of 10,000? **A:** 1,396.
5. **Q:** How many were blocked by Eigengap? **A:** 4.
6. **Q:** What exception is raised for CR failure? **A:** `AHPConsistencyViolationError`.
7. **Q:** What happens to blocked replicates? **A:** Discarded, excluded from valid ratio.
8. **Q:** What is the valid replicate count? **A:** 8,600.
9. **Q:** What is the value of $\lambda_{max}$ for a perfectly consistent 4x4 matrix? **A:** 4.0.
10. **Q:** Where is $RI_4$ hardcoded? **A:** In `ahp.py`.

### Intermediate (10)
11. **Q:** At what exact $\lambda_{max}$ does a 4x4 matrix get blocked? **A:** $\lambda_{max} \ge 4.2136$.
12. **Q:** Why does $\sigma_{ahp}=0.15$ cause ~14% blocking? **A:** Because it translates to roughly a 16% multiplicative shift, enough to push boundary transitivity over the edge.
13. **Q:** What happens if the baseline matrix is already at CR=0.07? **A:** A massive percentage (potentially >50%) of replicates will get blocked because it takes very little noise to cross 0.08.
14. **Q:** What was the percentage of K=3 in valid replicates? **A:** 90.78%.
15. **Q:** Is the 1,396 blocking a flaw or a feature? **A:** A feature; it demonstrates that the strict governance filter actively functions.
16. **Q:** How is the valid ratio calculated? **A:** $N_{valid} / N_{generated}$.
17. **Q:** What happens to $M_K$ for a blocked replicate? **A:** It is never computed.
18. **Q:** What is $CI$? **A:** Consistency Index, $CI = (\lambda_{max} - n) / (n - 1)$.
19. **Q:** What is the formula for CR? **A:** $CR = CI / RI$.
20. **Q:** Does score perturbation cause CR blocking? **A:** No, CR depends purely on the AHP matrix.

### Difficult (10)
21. **Q:** Prove $\lambda_{max} \ge 4.2136$ blocks the matrix. **A:** $0.08 = ((\lambda_{max} - 4)/3) / 0.89$. $0.08 \times 3 \times 0.89 = 0.2136$. $\lambda_{max} = 4.2136$.
22. **Q:** If $RI_4$ was Saaty's original 0.90, how would the block threshold change? **A:** The threshold would be looser: $\lambda_{max} \ge 4.216$. We use a stricter 0.89.
23. **Q:** How do Eigengap blocks differ from CR blocks? **A:** Eigengap occurs later during `VariableKEngine.evaluate()` when the score correlation matrix $R_m$ fails spectral separation. CR happens during AHP resolution.
24. **Q:** Can an AHP matrix have $\lambda_{max} < 4.0$? **A:** No, by Frobenius-Perron theorem, the principal eigenvalue of a positive reciprocal matrix is $\ge n$.
25. **Q:** What defines the conditioned probability space $\mathcal{X}_{valid}$? **A:** The intersection of bounds on scores [0,1] and the non-linear manifold of AHP matrices satisfying $CR < 0.08$.
26. **Q:** Why is the blocking step critical for the $M_K$ tensor? **A:** Because logically inconsistent expert weights ($CR \ge 0.08$) create an undefined, distorted subjective topology, ruining the Mahalanobis inner product.
27. **Q:** Do we record the exact reason for every block? **A:** Yes, the Monte Carlo loop tallies `AHP_CR_BLOCKED`, `EIGENGAP_BLOCKED`, etc.
28. **Q:** What happens if the valid ratio drops to 0? **A:** Zero-valid policy triggers, returning `UNEVALUABLE_ALL_BLOCKED`.
29. **Q:** Is the 8,600 valid count dependent on the random seed? **A:** Yes, changing the seed from 42 would slightly alter this exact count due to different MC paths.
30. **Q:** How does a K=1 distribution equal 0%? **A:** Because the intrinsic dimensionality of our 4 physical diagnostic criteria always strongly resists collapsing to a single vector.

### Hostile / Challenging (10)
31. **Q:** "Losing 1,400 replicates means your simulation is horribly inefficient." **A:** Generating and discarding a 4x4 matrix takes microseconds. Rejecting illogical universes is a core UQ requirement, not an inefficiency.
32. **Q:** "You arbitrary changed Saaty's 0.90 to 0.89 to rig the results." **A:** 0.89 is derived from 100,000 simulations of random 4x4 reciprocal matrices. It is the precise computational average CI, standard in modern literature, unlike Saaty's 1980 heuristic.
33. **Q:** "The threshold should be 0.10, 0.08 is too strict and ruins variance." **A:** The strict 0.08 acts as a tight governance filter to guarantee that the subjective manifold $M_K$ remains highly rigorous.
34. **Q:** "You just throw away data that doesn't fit your hypothesis." **A:** We throw away synthetic, stochastically generated matrices that violate mathematical transitivity laws. It is algorithmic hygiene, not data manipulation.
35. **Q:** "Since score perturbations don't affect CR, you're missing their interaction effect." **A:** Scores and subjective weights are independent prior assumptions. Their interaction occurs *in* the $C_L$ projection space, not in the prior formulation.
36. **Q:** "Eigengap only blocked 4, so it's a completely useless filter." **A:** It is rare but fatal when it happens. 4 blocks means it successfully prevented 4 mathematically singular projections that would have caused NaN explosions.
37. **Q:** "If CR block rate was 99%, the UQ would still be valid." **A:** No, a 99% block rate would trigger our `WARNING` or `UNEVALUABLE` states due to severe depletion of the sample size.
38. **Q:** "This blocking distorts the log-normal distribution you tried to create." **A:** Correct, it strictly limits the heavy tails of the log-normal distribution, exactly mapping the boundary between logic and absurdity in expert weights.
39. **Q:** "Why compute CI at all? Just use the eigenvector." **A:** The principal eigenvector exists for ANY positive matrix, even utter nonsense. CI acts as the critical diagnostic of consistency, measuring how far a matrix deviates from perfect transitivity. Without it, we would blindly trust eigenvectors derived from logically contradictory comparisons.
40. **Q:** "Your validation run says STABLE is 85.55%. That doesn't match 8600." **A:** 86% is the valid ratio (8600/10000). STABLE is the specific status code for candidates across those 8600 replicates, mathematically related but conceptually distinct.
