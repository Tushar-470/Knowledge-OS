# MODULE 06 - DOCUMENT 04: PCA PROJECTION & REPRESENTATION IN MC

## 1. What is it? / Why does it exist? / Problem solved
In the Monte Carlo engine, each of the valid parallel universes generates a slightly different set of candidate scores. Because these scores shift, the underlying correlation matrix $R_m$ shifts. Consequently, the intrinsic dimensionality of the data (K) can dynamically change from replicate to replicate. This document explains why PCA must be re-run freshly for every replicate, how K changes (between 2, 3, and 4), and how we mathematically handle the fact that the projected metric tensor $M_K$ changes its very shape depending on K.

### Layer A: Literature / Theory
Typically, dimensionality reduction models (like standard PCA) determine components on the original dataset and freeze them. During Monte Carlo, naive implementations reuse these frozen eigenvectors to save compute time.

### Layer B: PharmaPolySCOPE Implementation (v2.0.0-SP-PRP-TOPSIS-MC)
PharmaPolySCOPE **strictly re-evaluates PCA** via `VariableKEngine.evaluate()` for every replicate (lines 281-290 in `uncertainty.py`). The correlation matrix $R_m = Z_m^T Z_m / n$ is distinct every time.
This results in a dynamic K distribution: K=2 (2.12%), K=3 (90.78%), K=4 (7.10%). 

### Layer C: Rationale for Choices
Why re-run PCA? Because freezing eigenvectors would break the mathematical coupling between the input scores and the projection space. If scores shift, their true variance directions shift. 
Why does K change? Sometimes the noise aligns the criteria making them more correlated (K=2). Sometimes it scatters them (K=4).
Why the label "DESCRIPTIVE SUMMARY ONLY"? Because $M_K$ is a $K \times K$ tensor. A 2x2 distance is geometrically fundamentally different from a 3x3 distance. Averaging $C_L$ across different K spaces is mathematically meaningless. We primarily rely on conditional closeness $C_L|(K=k)$.

## 2. Beginner Explanation (Level 1)
Imagine taking a 3D picture of a house, but sometimes the house looks perfectly flat (2D). In our Monte Carlo, we create 10,000 universes with slight score changes. Sometimes these changes make the data look 2D (K=2), usually 3D (K=3, 91%), and sometimes 4D (K=4).
Because we are measuring "closeness" to an ideal target in these spaces, we can't simply average a 2D distance with a 3D distance. It's like comparing the length of a line to the volume of a cube. So, we clearly separate the results into conditional buckets (e.g., "Here is the closeness when the universe was 3D").

## 3. Technical Explanation (Level 2)
For replicate $m$, the perturbed score matrix $S_m$ is standardized to $Z_m$. The correlation matrix is computed as $R_m = Z_m^T Z_m / n$. The spectral decomposition of $R_m$ yields eigenvalues $\lambda_{m,i}$. The Kaiser criterion ($>1.0$) or 85% variance rule dynamically selects $K_m \in [1,4]$. 
The projection matrix $V_{K_m}$ is $4 \times K_m$. The resulting SP-PRP-TOPSIS metric tensor $M_{K_m} = V_{K_m}^T W_m V_{K_m}$ is a strictly $K_m \times K_m$ matrix. 
Because $K_m$ is a random variable dependent on the perturbation, the distance function $C_{L,m}$ operates in spaces of varying dimension. Therefore, the `CandidateMCOutputRecord` explicitly maps frequencies and metrics conditioned on K, and attaches `DESCRIPTIVE_CLOSENESS_LABEL` to the naively pooled average.

## 4. Mathematics & Derivations
**Correlation Matrix Shift:**
$S_m = S_0 + \epsilon_S$.
$Z_m = (S_m - \mu_{S_m}) / \sigma_{S_m}$.
$R_m = \frac{1}{n} Z_m^T Z_m$.
Let $\lambda_1, \lambda_2, \lambda_3, \lambda_4$ be eigenvalues of $R_m$.
If $\lambda_1 + \lambda_2 \ge 0.85 \times \text{Tr}(R_m)$, then $K=2$.
If it takes $\lambda_3$ to cross 85%, $K=3$.

**Tensor Shape Incompatibility:**
$M_{K=2} = (4 \times 2)^T (4 \times 4) (4 \times 2) = (2 \times 4) (4 \times 4) (4 \times 2) = 2 \times 2$.
$M_{K=3} = 3 \times 3$.
The Mahalanobis inner products $\langle x, y \rangle_M = x^T M y$ exist in $\mathbb{R}^2$ vs $\mathbb{R}^3$. Averaging them violates metric compatibility — distances computed under different $M_K$ tensors are not commensurable.

## 5. Hand-Calculable Example (Pedagogical Toy Demonstration)
> [!IMPORTANT]
> **Pedagogical Warning:** An 85% variance cutoff is used in this toy example ONLY to demonstrate the numerical mechanics of dynamic dimension switching ($K=2 \leftrightarrow K=3$) on simple paper-and-pencil eigenvalues. 
> **Production PharmaPolySCOPE strictly enforces `variance_threshold = 0.95` (95%)** in `decompose_spectral()` (`src/asd_mcda/v2/pca.py:52`), which for the baseline Indomethacin system retains $K=3$ with 99.96% cumulative explained variance.

- **Toy Replicate 1 (Correlation Matrix $R_1$):**
  Eigenvalues: $[2.1, 1.4, 0.4, 0.1]$. Trace $= 4.0$.
  Pedagogical 85% threshold target: $0.85 \times 4.0 = 3.40$.
  Cumulative check: $\lambda_1 + \lambda_2 = 2.1 + 1.4 = 3.50 \ge 3.40 \implies K=2$.
  Metric tensor $M_{K=2} = V_{K=2}^T W V_{K=2}$ has shape $2 \times 2$.
- **Toy Replicate 2 (Perturbed Correlation Matrix $R_2$):**
  Eigenvalues: $[2.0, 1.3, 0.6, 0.1]$. Trace $= 4.0$.
  Cumulative check at $K=2$: $\lambda_1 + \lambda_2 = 2.0 + 1.3 = 3.30 < 3.40$ (Insufficient).
  Cumulative check at $K=3$: $\lambda_1 + \lambda_2 + \lambda_3 = 2.0 + 1.3 + 0.6 = 3.90 \ge 3.40 \implies K=3$.
  Metric tensor $M_{K=3} = V_{K=3}^T W V_{K=3}$ has shape $3 \times 3$.

## 6. Actual Production Example
In the Indomethacin pipeline:
Valid replicates: 8,600.
- 0 replicates evaluated K=1.
- 182 replicates evaluated K=2 (2.12%).
- 7,807 replicates evaluated K=3 (90.78%).
- 611 replicates evaluated K=4 (7.10%).
Because K=3 dominates, the computational top-1 frequency mostly relies on the 3D topological projection, but explicitly respects the shifts to 2D and 4D.

## 7. Exact Implementation Trace
- Loop calls `VariableKEngine.evaluate()` in `uncertainty.py` (lines 281-290) fresh.
- `decompose_spectral()` executes entirely from scratch.
- `CandidateMCOutputRecord` stores conditional arrays (`conditional_closeness`).
- `phase5_models.py` (lines 29-31) defines `DESCRIPTIVE_CLOSENESS_LABEL = 'DESCRIPTIVE SUMMARY ONLY — NOT GEOMETRICALLY INVARIANT ACROSS VARIABLE-K SPACES'`.

## 8. Inputs / Processing / Outputs
**Inputs:** Perturbed scores $S_m$, valid AHP matrix $W_m$.
**Processing:** Fresh standardization, $R_m$ calculation, eigendecomposition, dynamic K selection, $M_K$ construction, TOPSIS calculation.
**Outputs:** 8,600 distinct $C_L$ vectors, grouped strictly by their corresponding K value for valid statistical aggregation.

## 9. Assumptions / Limitations / Failure Modes
**Assumption:** The 85% variance threshold (or Kaiser >1.0) remains the mathematically optimal cutoff in perturbed universes.
**Limitation:** Comparing candidates across different K-spaces requires conditional reasoning, complicating purely linear interpretations.
**Failure Mode:** `EIGENGAP_BLOCKED` (4 replicates). If eigenvalues are identically equal (multiplicity > 1 at the boundary), spectral separation fails, eigenvectors are non-unique, and the projection space is mathematically singular. The engine correctly blocks these.

## 10. Alternatives and Why This Method Was Used
**Alternative:** Freeze K=2 and PCA eigenvectors from the baseline matrix (v1.5 method).
**Why Rejected:** Freezing components means we project stochastically altered data onto static axes. This vastly underestimates the variance of the model and breaks the definition of PCA. We enforce strict recalculation to find the *true* metric tensor $M_K$ for every universe.

## 11. Common Misconceptions
- **Misconception:** "The MC engine averages all 10,000 $C_L$ values." **Correction:** Averaging $C_L$ across variable K spaces is topologically invalid. We track conditional closeness, and the pooled average carries a strict "DESCRIPTIVE SUMMARY ONLY" warning.
- **Misconception:** "The 4 eigengap failures are crashes." **Correction:** They are mathematically correct rejections of singular correlation matrices.

## 12. 1-Minute, 5-Minute, and Board Explanations
**1-Minute:** Every time we change the scores, the "shape" of the data changes. Sometimes it's 2D, mostly 3D. Because you can't compare 2D math to 3D math, we strictly separate the results by dimension.
**5-Minute:** We completely re-run the PCA math for every single one of the 8,600 valid replicates. The noise causes the criteria to correlate differently, shifting K between 2, 3, and 4. The SP-PRP-TOPSIS tensor $M_K$ changes shape entirely (2x2 vs 3x3). So, we calculate "conditional closeness" rather than naive averages, mathematically respecting the dimensionality changes.
**Board Explanation:** Draw $R_m$ shifting. Show $K=2 \to M_K = 2 \times 2$. Show $K=3 \to M_K = 3 \times 3$. Write big text: DO NOT AVERAGE THESE. Write `DESCRIPTIVE_CLOSENESS_LABEL`.

## 13. Things Never To Claim
- NEVER claim that $C_L$ is geometrically invariant across different K values.
- NEVER claim we reuse or cache PCA results in the Monte Carlo engine.
- NEVER substitute Euclidean distance; the changing tensor $M_K = V_K^T W V_K$ is fundamental.

## 14. Cross-References
- **Module 05 (Variable K):** The core baseline mechanics of how $K$ is selected.
- **Module 03 (SP-PRP-TOPSIS):** How $M_K$ defines the topological space.

---
## 40 Viva Q&A

### Basic (10)
1. **Q:** Why do we re-run PCA for each replicate? **A:** Because score perturbations alter the correlation matrix $R_m$, changing the variance directions.
2. **Q:** What percentage of replicates chose K=3? **A:** 90.78%.
3. **Q:** What percentage chose K=2? **A:** 2.12%.
4. **Q:** What shape is $M_K$ when K=3? **A:** $3 \times 3$.
5. **Q:** Can we geometrically average a K=2 closeness with a K=3 closeness? **A:** No, they exist in different topological spaces.
6. **Q:** What label is applied to pooled closeness? **A:** `DESCRIPTIVE_CLOSENESS_LABEL`.
7. **Q:** How many replicates failed due to eigengap issues? **A:** 4.
8. **Q:** Where is the evaluate method called fresh? **A:** `uncertainty.py`, lines 281-290.
9. **Q:** What does $R_m$ stand for? **A:** The perturbed score correlation matrix.
10. **Q:** Is the v1.5 fixed K=2 approach used here? **A:** No, v2 uses dynamic Variable K.

### Intermediate (10)
11. **Q:** How is $R_m$ calculated? **A:** $Z_m^T Z_m / n$.
12. **Q:** Why did 7.10% of replicates jump to K=4? **A:** The noise scattered the criteria variances enough that 3 components could no longer capture 85% of the total variance.
13. **Q:** What happens mathematically if eigenvalues are exactly equal at the K boundary? **A:** Eigengap separation fails, eigenvectors become non-unique (invariant subspace), and the replicate is correctly blocked.
14. **Q:** Why is conditional closeness superior to pooled? **A:** It preserves mathematical invariance within a stable dimension.
15. **Q:** In what file is the descriptive closeness label defined? **A:** `phase5_models.py`.
16. **Q:** Does changing K alter the size of $V_K$? **A:** Yes, $V_K$ becomes $4 \times 2$, $4 \times 3$, or $4 \times 4$.
17. **Q:** If K=4, what happens to the PCA projection? **A:** It becomes an identity rotation; no dimensionality reduction occurs, but SP-PRP-TOPSIS weighting via $M_K$ still rigorously applies.
18. **Q:** Does AHP perturbation affect K selection? **A:** No, K selection relies purely on $R_m$ (unweighted scores).
19. **Q:** How does standardizing $S_m$ into $Z_m$ help? **A:** It ensures the correlation matrix has 1s on the diagonal (trace = 4).
20. **Q:** Is $M_K$ diagonal? **A:** No, $M_K = V_K^T W V_K$ contains off-diagonal elements reflecting coupled criteria.

### Difficult (10)
21. **Q:** Write the exact descriptive text label. **A:** 'DESCRIPTIVE SUMMARY ONLY — NOT GEOMETRICALLY INVARIANT ACROSS VARIABLE-K SPACES'.
22. **Q:** Prove that $M_K$ for K=3 is a $3 \times 3$ matrix. **A:** $V_K$ is $4 \times 3$. $W$ is $4 \times 4$. $V_K^T (3 \times 4) \times W (4 \times 4) \times V_K (4 \times 3) \to 3 \times 3$.
23. **Q:** Why did the architect strictly forbid PCA caching? **A:** Because projecting perturbed data $Z_m$ onto a static $V_0$ misaligns the variance axes, systematically underestimating the topological dispersion.
24. **Q:** What theorem dictates the non-uniqueness of eigenvectors without an eigengap? **A:** The Spectral Theorem for symmetric matrices (eigenvectors corresponding to repeated eigenvalues form a multi-dimensional eigenspace, not distinct 1D rays).
25. **Q:** How does a shift from K=3 to K=2 impact the computational top-1 frequency calculation? **A:** The ranking for that specific replicate uses the 2D $C_L$. If Polymer A is top-ranked in 2D, it receives the vote. The final frequency simply counts votes regardless of K.
26. **Q:** Does the variable K shift cause discontinuities in the UQ output? **A:** Yes, the $C_L$ mapping is fundamentally piecewise due to discrete K jumps.
27. **Q:** If $Z_m$ is $n \times 4$, what is $n$? **A:** The number of polymer candidates (e.g., 20).
28. **Q:** How does $M_K$ act as a projected metric tensor? **A:** It defines the inner product $\langle x, y \rangle_M = x^T M_K y$ in the reduced $K$-dimensional space, fully integrating subjective AHP weights into the geometry.
29. **Q:** What is the primary difference in UQ evaluation between baseline v1.5.0-FOUR-CRITERION-FREEZE and v2.0.0? **A:** v1.5.0 forced static K=2 and purely Euclidean topology, completely ignoring variable dimensionality and $M_K$ metric tensor distortions.
30. **Q:** Does calculating $M_K$ dynamically bottleneck the simulation? **A:** Marginally, but for $n \sim 20$ and $4 \times 4 matrices, the $O(n^3)$ cost is trivial compared to the forensic guarantee of correctness.

### Hostile / Challenging (10)
31. **Q:** "You just average the closeness anyway at the end, so the descriptive label is a cop-out." **A:** We do NOT average it to determine the ranking. The ranking relies strictly on the top-1 vote frequency (a counting metric, perfectly invariant). The pooled $C_L$ is merely provided as metadata with a strict warning.
32. **Q:** "Re-running PCA 10,000 times is terrible software engineering." **A:** It is perfect scientific engineering. Caching PCA would violate the topological coupling, resulting in mathematically invalid projections.
33. **Q:** "Since K=3 is 91%, you should have just frozen it at K=3." **A:** Freezing it suppresses the 9% of universes where the phase space structurally shifts. That 9% is critical tail-risk data in rigorous Uncertainty Quantification.
34. **Q:** "Your eigengap block is just hiding a bug in your eigenvalue solver." **A:** Standard solvers like `numpy.linalg.eigh` return arbitrary orthogonal bases for repeated eigenvalues. This causes chaotic $C_L$ outputs. Blocking it correctly handles the mathematical singularity.
35. **Q:** "Changing matrix sizes (2x2 vs 3x3) means your code is wildly unstable." **A:** The code is perfectly stable. It rigorously isolates the spaces using conditional bucketing, demonstrating rigorous control over non-linear manifold shifts.
36. **Q:** "You claim v1.5 used classical TOPSIS, but here you say it used Euclidean K=2." **A:** I never claimed v1.5 used classical TOPSIS. Classical Hwang-Yoon TOPSIS does not use PCA projection at all. v1.5 used a static PCA K=2 projection with Euclidean geometry.
37. **Q:** "If $C_L$ isn't geometrically invariant, the top-1 frequency isn't either." **A:** A ranking (ordinal index) is invariant. Whether Polymer A wins in a 2D space or a 3D space, it receives 1 vote. The argmax function maps to a discrete integer space, bypassing geometric scaling issues.
38. **Q:** "You're overcomplicating it. Just use K=4 always and avoid dimensionality reduction." **A:** K=4 retains 100% of the noise, specifically the lowest-variance noise which is predominantly measurement error. PCA structurally filters that out.
39. **Q:** "If K changes, then the 'ideal solution' coordinates change, rendering TOPSIS meaningless." **A:** The ideal targets are dynamically recalculated *within* that specific K-space for that replicate. It is entirely self-consistent.
40. **Q:** "I bet your conditional closeness arrays are full of NaNs for K=1 and K=2." **A:** K=1 is fully empty (0%), K=2 has 182 valid entries without NaNs. The structured records handle this cleanly via jagged arrays or masked dataframes.
