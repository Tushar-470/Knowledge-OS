# MODULE 06 - DOCUMENT 02: MONTE CARLO PERTURBATION MODEL

## 1. What is it? / Why does it exist? / Problem solved
The Monte Carlo Perturbation Model defines the mathematical rules for generating the "parallel universes" of input data during the 10,000 replicate simulation. In PharmaPolySCOPE, uncertainty is injected at two discrete loci: the candidate scores (representing physical property uncertainty, e.g., $s_{HSP}$, $s_{GT}$) and the AHP pairwise comparisons (representing expert subjectivity). The perturbation model exists to ensure these variations respect physical and mathematical realities (scores must remain in [0,1], AHP matrices must remain reciprocal and positive).

### Layer A: Literature / Theory
In literature, additive Gaussian noise is commonly used. However, simple Gaussian noise fails when bounds are absolute (like a 0-1 score scale). Moreover, for multiplicative relative importance weights (AHP), additive noise destroys the fundamental ratio scale.

### Layer B: PharmaPolySCOPE Implementation (v2.0.0-SP-PRP-TOPSIS-MC)
The methodology implements two distinct noise models:
1. **Truncated Normal on [0, 1]** for scores ($\sigma = 0.05$).
2. **Log-space Gaussian Noise** for AHP pairwise weights ($\sigma_{ahp} = 0.15$).

### Layer C: Rationale for Choices
Why Log-space for AHP? AHP values are multiplicative ratios ($a_{ij} = w_i/w_j$). Perturbing in log-space ($q_{ij} = \ln(a_{ij})$) ensures the perturbation respects the ratio scale: $\exp(\ln(a) + \epsilon) = a \cdot \exp(\epsilon)$. It also enforces analytical reciprocity: $a_{ji} = 1/a_{ij}$. In finite-precision IEEE 754 float64 arithmetic, the implementation verifies that the reciprocity deviation $|a_{ji} a_{ij} - 1.0|$ is bounded above by $10^{-12}$ (via `reciprocity_tolerance = 1e-12` in `ahp.py`), raising `AHPNonReciprocalError` if violated. Truncated normal for scores ensures we never feed biologically impossible negative scores or $>1.0$ scores into the engine.

## 2. Beginner Explanation (Level 1)
Think of the scores (0 to 1) like grades on a test. We know the grades might be off by about 5% ($\sigma=0.05$). But a grade cannot be over 100% or under 0%. So we use a "Truncated Normal" which clusters guesses around the original score but strictly cuts off at 0 and 1.
For the AHP weights, they are comparisons (e.g., "A is twice as important as B"). If we randomly added 0.5, we might accidentally make "B twice as important as A" in a non-symmetrical way. Instead, we use "Log-space perturbation". This means we perturb the *ratios* properly, ensuring that if A vs B becomes 2.5, B vs A automatically and perfectly becomes 1/2.5.

## 3. Technical Explanation (Level 2)
The score perturbation is handled by `_sample_truncated_normal_scores()` which applies `scipy.stats.truncnorm.rvs`. It generates samples from a Gaussian $N(s_0, \sigma^2)$ conditioned on $X \in [0, 1]$. The shape parameter boundaries $a$ and $b$ dynamically shift based on the base score $s_0$.
The AHP perturbation is handled by `_perturb_ahp_matrix_log_space()`. For the 6 upper-triangular elements of the $4 \times 4$ AHP matrix, we project into the log-domain: $q = \ln(a)$. We add $N(0, \sigma_{ahp}^2)$, then project back: $a_{sampled} = \exp(q + \epsilon)$. The lower triangular entries are populated via exact analytical reciprocity $a_{ji} = a_{ij}^{-1}$. The diagonal is clamped to $1.0$.

## 4. Mathematics & Derivations
**Truncated Normal Bounds:**
Given base score $s_0$ and std $\sigma=0.05$:
$a = (0.0 - s_0) / \sigma$
$b = (1.0 - s_0) / \sigma$
Sample $x \sim \text{TruncNorm}(\mu=s_0, \sigma, a, b)$.
Defensive clamp: $\max(0.0, \min(1.0, x))$.

**Log-Space AHP:**
$q_{ij} = \ln(a_{ij})$
$q_{sampled} = q_{ij} + \mathcal{N}(0, \sigma_{ahp}^2)$
$a_{sampled} = \exp(q_{sampled})$
Reciprocity deviation $|a_{ji} a_{ij} - 1.0|$ is bounded above by $10^{-12}$ in finite-precision floating-point arithmetic because $a_{ji} = \exp(-q_{sampled}) = 1 / a_{sampled}$, verified by `ahp.py:65`.

## 5. Hand-Calculable Example
**Score:** $s = 0.8$, $\sigma = 0.05$. 
$a = (0 - 0.8) / 0.05 = -16$. $b = (1 - 0.8) / 0.05 = 4$.
Sample 3 standard normal deviates: $z_1 = 0.5, z_2 = -1.0, z_3 = 2.0$. (All fall in $[-16, 4]$).
Samples: $x_1 = 0.8 + 0.05(0.5) = 0.825$. $x_2 = 0.8 - 0.05(1) = 0.75$. $x_3 = 0.8 + 0.05(2) = 0.90$.

**AHP:** $a = 2.0$, $\sigma_{ahp} = 0.15$.
$q_{base} = \ln(2.0) \approx 0.693$.
Sample $\epsilon_1 = +0.10$.
$q_{sampled} = 0.693 + 0.10 = 0.793$.
$a_{sampled} = \exp(0.793) \approx 2.21$.
Reciprocal $a_{ji} = 1/2.21 \approx 0.452$.

## 6. Actual Production Example
In the production engine, for 10,000 replicates, `_sample_truncated_normal_scores()` produces an output tensor of shape `(10000, n, 4)`. `_perturb_ahp_matrix_log_space()` produces an output tensor of shape `(10000, 4, 4)`. The AHP loop iterates over the 6 specific upper-triangular index pairs: `(0,1), (0,2), (0,3), (1,2), (1,3), (2,3)`.

## 7. Exact Implementation Trace
- `_sample_truncated_normal_scores()` in `uncertainty.py` (line 49).
- `sigma_score = 0.05` default (line 162).
- TruncNorm a and b parameters (lines 77-78).
- `scipy.stats.truncnorm.rvs()` execution (lines 79-86).
- Defensive clamp to `[0.0, 1.0]` (line 88).
- `_perturb_ahp_matrix_log_space()` in `uncertainty.py` (line 92).
- `sigma_ahp = 0.15` default (line 163).
- 6 upper-triangular pairs (line 127).
- Log-space addition (lines 129-133), exp transform (line 134), analytical reciprocity (line 136).
- Diagonal fixed at 1.0 (lines 118-119).

## 8. Inputs / Processing / Outputs
**Inputs:** Base array shapes `(n, 4)` and `(4, 4)`. Default sigmas $0.05$ and $0.15$.
**Processing:** Vectorized sampling for scores. Loop-based upper-triangular sampling and reflective copying for AHP matrices.
**Outputs:** 3D tensors of generated matrices ready to be evaluated by the MC loop.

## 9. Assumptions / Limitations / Failure Modes
**Assumption:** The baseline physical scores and AHP weights represent the median of the underlying probability distributions.
**Limitation:** It assumes the uncertainty on different scores is uncorrelated (no covariance matrix between criteria).
**Failure Mode:** If the log-space standard deviation $\sigma_{ahp}$ is set too high (e.g., > 0.5), it will cause massive deviations that instantly violate the Consistency Ratio (CR $\ge 0.08$), blocking nearly 100% of replicates.

## 10. Alternatives and Why This Method Was Used
**Alternative:** Dirichlet distribution for AHP weights.
**Why Rejected:** AHP fundamentally operates on pairwise ratio judgments, not a normalized vector space. Perturbing pairwise comparisons in log-space respects the cognitive origin of the Saaty scale. Dirichlet operates on the final weights, which bypasses the crucial CR check phase entirely.

## 11. Common Misconceptions
- **Misconception:** "We add random numbers to AHP weights." **Correction:** We multiply them by random log-normal factors to preserve scale invariance.
- **Misconception:** "Truncated normal is just a normal distribution where we throw away bad values." **Correction:** No, `truncnorm.rvs` properly rescales the probability density function so the area remains 1, keeping the standard deviation mathematically precise relative to the bounds.

## 12. 1-Minute, 5-Minute, and Board Explanations
**1-Minute:** We use a truncated bell curve to jiggle the candidate scores so they never exceed 0-1. For the AHP matrix, we jiggle the values in log-space so the reciprocal ratios remain perfectly balanced.
**5-Minute:** Additive noise destroys ratio matrices. If you add 0.5 to A/B, you can't simply subtract 0.5 from B/A without breaking mathematical reciprocity. So, we map AHP values to logs, add Gaussian noise there, and exponentiate them back. This perfectly preserves $a_{ji} = 1/a_{ij}$. Score perturbations just use standard truncated normals with a 0.05 sigma.
**Board Explanation:** Write out an AHP matrix. Show $a_{12} = 2$, $a_{21} = 0.5$. Show what happens with additive noise vs log-space noise. Show the truncated normal curve cutting sharply at 0 and 1.

## 13. Things Never To Claim
- NEVER claim we perturb the final normalized weights (we perturb the pairwise matrix).
- NEVER claim we use additive noise for AHP.
- NEVER claim the $s_{GT}$ diagnostic uses a different perturbation sigma than $s_{HSP}$ (all use 0.05).

## 14. Cross-References
- **Module 04 (AHP):** Why exactly $a_{ji} = 1/a_{ij}$ is required for the eigenvalue calculation.
- **Module 06 (Document 03):** How the $\sigma_{ahp}=0.15$ causes CR failure in 14% of replicates.

---
## 40 Viva Q&A

### Basic (10)
1. **Q:** What distribution is used for score perturbation? **A:** Truncated Normal on [0, 1].
2. **Q:** What is the default sigma for score perturbation? **A:** 0.05.
3. **Q:** What is the default sigma for AHP perturbation? **A:** 0.15 in log-space.
4. **Q:** Why log-space for AHP? **A:** To respect the multiplicative ratio scale.
5. **Q:** How many upper-triangular pairs are perturbed in AHP? **A:** 6.
6. **Q:** What function samples the truncated normal? **A:** `scipy.stats.truncnorm.rvs`.
7. **Q:** What happens to the AHP diagonal? **A:** It is strictly set to 1.0.
8. **Q:** What shape is the output of score perturbation? **A:** (10000, n, 4).
9. **Q:** What does the defensive clamp do? **A:** Ensures scores absolutely cannot exceed the [0,1] bounds.
10. **Q:** Does AHP perturbation maintain reciprocity? **A:** Yes, exactly via $a_{ji} = 1/a_{ij}$.

### Intermediate (10)
11. **Q:** Why not just throw away out-of-bounds normal samples? **A:** Rejection sampling is slow and statistically biases the variance. `truncnorm` properly scales the PDF.
12. **Q:** How does a log-space perturbation affect a value of 1.0? **A:** $\ln(1)=0$. It adds noise around 0, then exponentiates, resulting in a log-normal distribution around 1.
13. **Q:** If $q_{sampled} = \ln(2) + 0.1$, what is the reciprocal? **A:** $\exp(-(\ln(2)+0.1))$.
14. **Q:** What are the 6 pairs explicitly perturbed? **A:** (0,1), (0,2), (0,3), (1,2), (1,3), (2,3).
15. **Q:** What happens to the standard deviation if a base score is 0.99? **A:** The `truncnorm` distribution becomes heavily right-skewed, but constrained at 1.0.
16. **Q:** Why is $\sigma_{ahp}$ 0.15? **A:** It is an exploratory computational parameter that induces $\approx \pm 16\%$ multiplicative variation on the Saaty scale, providing a meaningful stress test of the AHP pairwise comparisons without overwhelming the consistency filter.
17. **Q:** Where is the defensive clamp located? **A:** `uncertainty.py`, line 88.
18. **Q:** Does the score perturbation have covariance? **A:** No, variables are perturbed independently.
19. **Q:** How is the $b$ parameter calculated for `truncnorm`? **A:** $b = (1.0 - base) / \sigma_{score}$.
20. **Q:** Are the lower triangular AHP entries sampled? **A:** No, they are analytically derived from the perturbed upper triangular entries.

### Difficult (10)
21. **Q:** Derive the exact floating point stability guarantee for $a_{ji}$. **A:** By computing $a_{sampled}$ and strictly executing $a_{ji} = 1.0 / a_{sampled}$, precision loss from $\exp$ is isolated.
22. **Q:** If we perturbed final priority weights instead of the pairwise matrix, what critical validation step would we skip? **A:** The Consistency Ratio (CR) check. We would bypass the structural logic of the decision.
23. **Q:** Why does $\sigma=0.05$ map appropriately to the $s_{\chi}$ phase-boundary diagnostic? **A:** Because typical Flory-Huggins interaction parameter estimates from group contribution have an error margin approximating $5\%-10\%$ in normalized score space.
24. **Q:** What happens to AHP consistency if $\sigma_{ahp}$ is raised to 0.5? **A:** Almost 100% of generated matrices will violate the $CR \ge 0.08$ threshold and be blocked.
25. **Q:** Explain the role of the PCG64 bit generator in these specific perturbations. **A:** It provides independent streams of high-quality pseudo-random numbers without the correlation artifacts seen in older generators.
26. **Q:** How does the pipeline ensure the diagonal never drifts? **A:** Hardcoded `np.fill_diagonal(matrix, 1.0)` at lines 118-119.
27. **Q:** Is the truncated normal mean equal to the mode? **A:** No, near the boundaries (0 or 1), the truncation shifts the mean away from the mode.
28. **Q:** How does log-space noise behave asymmetrically in real space? **A:** $+0.15$ logs gives $\times 1.16$, while $-0.15$ logs gives $\times 0.86$. The mean in real space shifts slightly upwards due to Jensen's inequality.
29. **Q:** Does v1.5 use this exact perturbation model? **A:** Yes, the perturbation model itself is independent of the projection topology (SP-PRP-TOPSIS).
30. **Q:** What shape is the $a$ parameter matrix? **A:** $(n, 4)$, matching the base scores.

### Hostile / Challenging (10)
31. **Q:** "You just guessed 0.05 and 0.15. That makes your whole UQ arbitrary." **A:** They are exploratory computational sensitivity parameters chosen to probe plausible variation ranges. 0.05 absolute SD tests $\pm 5\%$ local neighborhoods in normalized scores. 0.15 in log-space tests $\approx \pm 16\%$ multiplicative variation on pairwise comparisons. The values define a standardized stress test, not an arbitrary guess.
32. **Q:** "Adding noise to scores makes the top-1 frequency artificially low." **A:** It accurately reflects the fragility of the model. If it drops, the ranking was an artifact of point-estimate precision.
33. **Q:** "Log-space perturbation is mathematically unnecessary, you could just bound additive noise." **A:** Bounded additive noise mathematically destroys ratio scaling. $2 \pm 0.5$ creates reciprocals $1/2.5 = 0.4$ and $1/1.5 = 0.66$, completely skewing the eigenvector solution.
34. **Q:** "Truncated normal distorts the mean, so you're actively biasing the simulation." **A:** We *must* distort the mean near boundaries. A score of 0.99 physically cannot vary symmetrically up to 1.04. The physical limit dictates the distribution.
35. **Q:** "Why not perturb all 16 entries of the AHP matrix to be safe?" **A:** That physically violates the definition of a pairwise comparison matrix where $a_{ii}=1$ and $a_{ji} = 1/a_{ij}$.
36. **Q:** "If $\sigma_{ahp}$ causes 14% blocking, your $\sigma_{ahp}$ is wrong." **A:** The 14% block rate is specific to this Indomethacin baseline with $\sigma_{ahp}=0.15$. It indicates the computational stress level at which our governance filter begins rejecting structurally inconsistent matrices, confirming the filter is actively protecting the ensemble.
37. **Q:** "The clamp at line 88 is a hack because your truncnorm implementation is broken." **A:** Truncnorm relies on floating point representations which can occasionally yield $1.0000000000000002$ due to precision limits. The clamp is standard defensive engineering.
38. **Q:** "Your model assumes zero covariance between the 4 criteria, which is physically naive." **A:** While criteria like $s_{HSP}$ and $s_{\chi}$ have underlying thermodynamic links, their derived *scores* are structured as orthogonal heuristic diagnostic proxies.
39. **Q:** "AHP is outdated; using fuzzy logic would eliminate the need for this log-space trick." **A:** Fuzzy AHP relies on triangular numbers which introduce worse boundary artifacts. Log-space Gaussian strictly maintains classical Saaty eigenvalue axioms.
40. **Q:** "You claim the error is $< 10^{-12}$, prove it." **A:** Analytical construction sets $a_{ji} = 1.0 / a_{ij}$. Under IEEE 754 64-bit float division (machine epsilon $\approx 2.2 \times 10^{-16}$), rounding error is minimal, and the implementation in `ahp.py` explicitly verifies that reciprocity deviation $|a_{ji} a_{ij} - 1.0|$ is bounded above by the tolerance $10^{-12}$.