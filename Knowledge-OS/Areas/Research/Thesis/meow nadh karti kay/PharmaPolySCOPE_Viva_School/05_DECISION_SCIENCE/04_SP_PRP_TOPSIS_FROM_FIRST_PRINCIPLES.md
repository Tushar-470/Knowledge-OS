# 04_SP_PRP_TOPSIS_FROM_FIRST_PRINCIPLES

## What is it? / Why does it exist? / Problem solved
Subspace-Projected Reference-Point TOPSIS (SP-PRP-TOPSIS) is the foundational multi-criteria decision analysis engine for the v2.0.0 methodology of PharmaPolySCOPE. 
It exists to overcome the vulnerabilities inherent in classical multi-criteria methods when evaluating pharmaceutical polymer candidates. Specifically, when we have correlated criteria (like $s_{HSP}$ and $s_{\chi}$) that operate on differing variances, classical TOPSIS produces unstable results. 
By projecting into an orthogonal subspace (PCA) and applying a physical AHP metric tensor to absolute references, SP-PRP-TOPSIS yields mathematically robust and physically meaningful rankings without rank-reversal artifacts.

## Layers
- **Layer A (Literature):** TOPSIS measures distance to an ideal and anti-ideal solution. PCA orthogonalizes the feature space. AHP assigns weights to criteria.
- **Layer B (Implementation):** `VariableKEngine.evaluate()` (engine.py line 58) executes an 11-step pipeline. It standardizes (ddof=0), projects via $V_K$, constructs $M_K = V_K^T W V_K$, and calculates quadratic-form distances.
- **Layer C (Rationale):** Classical Hwang-Yoon TOPSIS uses the empirical max/min of the cohort. This causes rank-reversal if a candidate is added or removed. SP-PRP-TOPSIS uses absolute physical anchors ([1,1,1,1] and [0,0,0,0]) to guarantee stability.

## Beginner explanation (Level 1)
Think of judging a decathlon. If you evaluate athletes based purely on "who is the fastest in this specific race," the standard changes every time someone new enters. Instead, we define an "absolute perfect athlete" (the ideal) and an "absolute worst athlete" (the anti-ideal). 
Then, because some events overlap (like 100m dash and 200m dash), we combine them into independent super-events to prevent double-counting. We weigh these super-events according to physical importance. Finally, we measure how close each athlete is to the perfect standard and how far they are from the worst standard to find our top-ranked computational candidate.

## Technical explanation (Level 2)
The v2.0.0 SP-PRP-TOPSIS pipeline begins with cohort standardization using population parameters (ddof=0). Principal Component Analysis (PCA) decomposes this space, and we dynamically select $K$ components to form the projection matrix $V_K$. 
A 4x4 Analytical Hierarchy Process (AHP) matrix generates the criteria weight matrix $W$. 
Because we operate in a truncated subspace, we cannot use Euclidean distance. We project the weights to form the metric tensor: $M_K = V_K^T W V_K$, which is the positive-definite quadratic-form metric induced by the physical AHP weighting in the PCA subspace.
We define physical absolute anchors $s_+ = [1,1,1,1]$ and $s_- = [0,0,0,0]$. We standardize them using the cohort's $\mu$ and $\sigma$, and project them into the subspace ($t_+, t_-$). Distances are computed via the quadratic form induced by $M_K$. The closeness coefficient $C_L$ dictates the ranking.

> [!IMPORTANT]
> **Deterministic vs. Stochastic Architecture Boundary:**
> - **Deterministic SP-PRP-TOPSIS (`VariableKEngine.evaluate()`):** Solves a single deterministic $n \times 4$ decision matrix to produce invariant closeness coefficients $C_L$ and ordinal ranks. It does NOT generate selection frequencies or probability distributions.
> - **Monte Carlo Uncertainty Wrapper (`MonteCarloEngine.run()`):** Re-executes the deterministic engine over 10,000 perturbed replicates to produce empirical computational top-1 selection frequencies ($p_{top1}$) and sensitivity metrics. Top-1 frequency is a property of the stochastic wrapper, not the deterministic decision algorithm.

## Mathematics
1. **Standardization:** For data matrix $X \in \mathbb{R}^{N \times 4}$, $Z = \frac{X - \mu}{\sigma}$ (using ddof=0).
2. **Subspace Projection:** SVD yields $V$. We select $K$ columns for $V_K$. $T = Z V_K$.
3. **Metric Tensor:** $M_K = V_K^T W V_K$, where $W$ is a diagonal matrix of AHP weights.
4. **Reference Anchors:** $s_+ = \vec{1}$, $s_- = \vec{0}$.
5. **Standardized Anchors:** $z_{\pm} = \frac{s_{\pm} - \mu}{\sigma}$.
6. **Projected Anchors:** $t_{\pm} = z_{\pm} V_K$.
7. **Distance:** $D_{\pm}(T_i) = \sqrt{ \max(0, (T_i - t_{\pm}) M_K (T_i - t_{\pm})^T ) }$.
8. **Closeness:** $C_L = \frac{D_-}{D_+ + D_-}$.

## Hand-calculable example (Pedagogical Toy Demonstration)
> [!NOTE]
> **Pedagogical Note:** This hand calculation demonstrates the mathematical pipeline on a minimal 3-candidate, 2-criterion toy problem ($K=1$). It uses rounded figures to illustrate step-by-step arithmetic.

1. **Toy Raw Decision Matrix $X$ (3 candidates, 2 criteria):**
   $$X = \begin{bmatrix} 0.8 & 0.9 \\ 0.4 & 0.5 \\ 0.2 & 0.1 \end{bmatrix}$$
2. **Cohort Population Moments ($ddof=0$):**
   $$\mu = [0.467, 0.500], \quad \sigma = [0.249, 0.327]$$
3. **Standardization of Candidate 1 ($X_1 = [0.8, 0.9]$):**
   $$Z_1 = \left[ \frac{0.8 - 0.467}{0.249}, \; \frac{0.9 - 0.500}{0.327} \right] = [1.337, \; 1.223]$$
4. **Subspace Basis ($K=1$):**
   $$V_1 = \begin{bmatrix} 0.7071 \\ 0.7071 \end{bmatrix}$$
5. **Subspace Metric Tensor Construction ($W = \text{diag}(0.6, 0.4)$):**
   $$M_1 = V_1^T W V_1 = \begin{bmatrix} 0.7071 & 0.7071 \end{bmatrix} \begin{bmatrix} 0.6 & 0 \\ 0 & 0.4 \end{bmatrix} \begin{bmatrix} 0.7071 \\ 0.7071 \end{bmatrix} = 0.500$$
   Here $M_1$ is the positive-definite quadratic-form metric induced by the physical AHP weighting in the PCA subspace.
6. **Reference Point Standardization & Projection:**
   - Physical Ideal $s_+ = [1.0, 1.0] \implies z_+ = \left[ \frac{1-0.467}{0.249}, \frac{1-0.500}{0.327} \right] = [2.141, 1.529]$
     $$t_+ = z_+ V_1 = 2.141(0.7071) + 1.529(0.7071) \approx 2.595 \approx 2.60$$
   - Physical Anti-Ideal $s_- = [0.0, 0.0] \implies z_- = \left[ \frac{0-0.467}{0.249}, \frac{0-0.500}{0.327} \right] = [-1.876, -1.529]$
     $$t_- = z_- V_1 = -1.876(0.7071) - 1.529(0.7071) \approx -2.408$$
7. **Candidate 1 Projection ($T_1$):**
   $$T_1 = Z_1 V_1 = 1.337(0.7071) + 1.223(0.7071) = 0.9454 + 0.8648 = 1.810$$
8. **Quadratic Distance & Closeness Calculation:**
   - Ideal Distance:
     $$\Delta t_+ = T_1 - t_+ = 1.810 - 2.595 = -0.785$$
     $$q_+ = (\Delta t_+)^T M_1 (\Delta t_+) = (-0.785)^2 \times 0.500 = 0.6162 \times 0.500 = 0.3081 \implies D_+ = \sqrt{0.3081} \approx 0.555$$
   - Anti-Ideal Distance:
     $$\Delta t_- = T_1 - t_- = 1.810 - (-2.408) = 4.218$$
     $$q_- = (\Delta t_-)^T M_1 (\Delta t_-) = (4.218)^2 \times 0.500 = 17.7915 \times 0.500 = 8.8958 \implies D_- = \sqrt{8.8958} \approx 2.983$$
   - Closeness Coefficient $C_L$:
     $$C_L = \frac{D_-}{D_+ + D_-} = \frac{2.983}{0.555 + 2.983} = \frac{2.983}{3.538} \approx 0.843$$
Candidate 1 achieves $C_L = 0.843$, emerging as the top-ranked computational candidate under this pedagogical projection.

## Actual production example
For the deterministic baseline evaluation of the Indomethacin cohort under methodology 2.0.0-SP-PRP-TOPSIS (`VariableKEngine.evaluate()`):
- The 4-criterion input matrix $S$ (5 polymers $\times$ 4 criteria) is standardized with $ddof=0$.
- Spectral decomposition yields eigenvalues $\lambda = [2.090866, 1.167895, 0.739775, 0.001464]$, selecting $K=3$ dynamically (cumulative variance $99.96\% \ge 95\%$).
- Subspace stability governance evaluates boundary eigengap $\delta_3 = \lambda_3 - \lambda_4 = 0.7383 \ge 0.10$ (Status: STABLE).
- Authoritative $4 \times 4$ AHP pairwise comparison matrix yields $\lambda_{max} = 4.131937, CI = 0.043979$, and $CR = 0.049415 < 0.08$ ($RI_4 = 0.89$), generating physical weights $w_{phys} = [0.4077, 0.3244, 0.0922, 0.1757]$.
- Positive-definite quadratic-form metric tensor $M_K = V_K^T W V_K$ is constructed in $\mathbb{R}^{3 \times 3}$.
- Absolute anchors $s^+ = [1,1,1,1]$ and $s^- = [0,0,0,0]$ are standardized and projected to $t_+, t_- \in \mathbb{R}^3$.
- Deterministic Evaluation Results:
  - Rank 1: Soluplus (POL-005-2026), $C_L = 0.68643508$ ($D^+ = 4.182604, D^- = 9.156273$)
  - Rank 2: HPMC E5 (POL-006-2026), $C_L = 0.67314649$ ($D^+ = 4.196084, D^- = 8.641728$)
  - Rank 3: PVP-VA 64 (POL-002-2026), $C_L = 0.60624689$ ($D^+ = 5.082374, D^- = 7.825140$)
  - Rank 4: PVP K30 (POL-001-2026), $C_L = 0.58758390$ ($D^+ = 5.344023, D^- = 7.613821$)
  - Rank 5: Eudragit E PO (POL-007-2026), $C_L = 0.54561620$ ($D^+ = 5.671239, D^- = 6.809926$)
(Note: When this deterministic model is placed inside `MonteCarloEngine.run()` across 10,000 perturbed replicates, Soluplus achieves an empirical computational top-1 selection frequency of $55.51\%$, and HPMC E5 achieves $42.00\%$).

## Exact implementation trace
- `VariableKEngine.evaluate()` orchestrated in `engine.py` (line 58)
- `standardize_cohort()` -> `standardization.py` (line 15)
- `decompose_spectral()` -> `pca.py` (line 52)
- `evaluate_subspace_stability()` -> `stability.py` (line 38)
- `solve_ahp_preference()` -> `ahp.py` (line 22)
- `construct_metric_tensor()` -> `metrics.py` (line 21)
- `project_reference_points()` -> `metrics.py` (line 133)
- `compute_distances_and_closeness()` -> `metrics.py` (line 172)
- `audit_truncation_discrepancy()` -> `diagnostics.py` (line 40)
- Provenance sealing -> `provenance.py`

## Inputs / Processing / Outputs
- **Inputs:** Candidate matrix $X$, 4x4 AHP criteria pairwise comparison matrix, absolute bounds [0,0,0,0] and [1,1,1,1].
- **Processing:** PCA dimensionality reduction, computation of $M_K$, geometric quadratic form distance calculation.
- **Outputs:** An array of $C_L$ values, strict deterministic rankings (1-based), and discrepancy/provenance metadata.

## Assumptions / Limitations / Failure modes
- **Assumption:** The criteria map linearly onto physical desirability bounded by [0,1].
- **Limitation:** The method uses a linear PCA projection. Highly non-linear structural correlations in the criteria are flattened into orthogonal vectors.
- **Failure modes:** If the cohort has near-zero variance across all criteria, standardization will fail (division by zero) or $D_+ + D_-$ will trigger a `DegenerateReferenceCoincidenceError`.

## Alternatives and why this method was used
Classical Hwang-Yoon TOPSIS uses Euclidean distance and relative empirical anchors. We explicitly rejected this because (1) Euclidean distance double-counts correlated criteria like $s_{HSP}$ and $s_{\chi}$, and (2) empirical anchors cause rank-reversal. We rejected Mahalanobis distance because it ignores the domain-expert AHP weights $W$.

## Common misconceptions
- **Misconception:** "It's just TOPSIS on principal components." 
  **Reality:** No. Classical TOPSIS applied to PCs would still use relative anchors and Euclidean distance. SP-PRP-TOPSIS uses a projected metric tensor $M_K = V_K^T W V_K$ and absolute projected anchors.
- **Misconception:** "The ranking predicts the formulation will work."
  **Reality:** Never claim this. It only identifies the computational top-1 frequency under the specified uncertainty model.

## One-minute, five-minute, and board explanations
- **One-minute:** SP-PRP-TOPSIS mathematically ranks polymers by finding how close they are to a theoretically perfect polymer in a statistically simplified, independent subspace, avoiding the instability of comparing polymers only to each other.
- **Five-minute:** Pharmaceutical criteria overlap. We use PCA to isolate independent signals. But we don't treat all signals equally; we weight them using AHP. By building a metric tensor $M_K$, we warp the geometry of the PCA space to respect those physical weights. We then measure the distance from each polymer to an absolute physical ideal [1,1,1,1]. The ratio of these distances gives the final ranking.
- **Board:** Draw the raw 4D space with a correlated point cloud. Draw the mapping via $V_K$ to a 2D plane. Show the point $[1,1,1,1]$ mapping to a point $t_+$. Draw elliptical distance contours originating from $t_+$, defined by $M_K$.

## Things never to claim
- NEVER use the phrase "best polymer". You must use "top-ranked computational candidate".
- NEVER say "probability of success". $C_L$ is a geometric closeness coefficient, not a probability.
- DO NOT call the method "classical Hwang-Yoon TOPSIS".
- NEVER say "optimal polymer".
- NEVER substitute Euclidean distance into the formulas.

## Cross-references to other modules
- Module 02 (AHP) for how $W$ is derived and $RI_4=0.89$ is established.
- Module 03 (PCA) for how $V_K$ is computed.
- Module 04 for the Monte Carlo $N_{generated} = 10,000$ sampling scheme.

## 40 Viva Q&A

### Basic (1-10)
1. **What does SP-PRP-TOPSIS stand for?**
   Subspace-Projected Reference-Point TOPSIS.
2. **What is its primary function?**
   To rank polymer candidates mathematically based on multiple criteria.
3. **Where does the pipeline start in the code?**
   In `VariableKEngine.evaluate()` at line 58 of `engine.py`.
4. **What is the first step of the pipeline?**
   Standardizing the cohort using `ddof=0` (population standard deviation).
5. **How many criteria are used in the v2 model?**
   4 criteria, utilizing a 4x4 AHP matrix.
6. **What is $s_{HSP}$?**
   The compatibility diagnostic.
7. **What is the mathematical output of this method?**
   The closeness coefficient, $C_L$.
8. **What does a higher $C_L indicate?**
   It indicates the candidate is mathematically closer to the ideal and further from the anti-ideal.
9. **Who is the top-ranked computational candidate for Indomethacin?**
   Soluplus.
10. **What version of the methodology introduced this exact pipeline?**
    Methodology version 2.0.0-SP-PRP-TOPSIS.

### Intermediate (11-20)
11. **Why do we use PCA before applying TOPSIS?**
    - **Direct Answer:** To transform correlated physical criteria into an orthogonal, decorrelated coordinate system before evaluating geometric distances.
    - **Reasoning:** In solid dispersion screening, thermodynamic criteria such as $s_{HSP}$ and $s_{\chi}$ exhibit high mutual correlation ($r \approx 0.85$) because both stem from cohesive energy density differences. If TOPSIS is applied directly to these correlated criteria, the thermodynamic dimension is double-counted, artificially overwhelming the independent kinetic stabilization criterion ($s_{GT}$). PCA decorrelates the criteria, enabling dimensionally balanced evaluation.
    - **Implementation Trace:** Performed via `decompose_spectral()` (`src/asd_mcda/v2/pca.py:52`) as Step 2 of `VariableKEngine.evaluate()`.
    - **Viva Defense Sentence:** *"Applying PCA prior to TOPSIS orthogonalizes the collinear thermodynamic criteria, preventing collinear parameters from dominating the ranking at the expense of kinetic stabilization."*
12. **How does dynamic $K$ differ from v1.5?**
    v1.5 used a fixed $K=2$ (PC1 and PC2), whereas v2.0 selects $K$ dynamically based on variance.
13. **What is the metric tensor $M_K$?**
    - **Direct Answer:** $M_K$ is the positive-definite quadratic-form metric induced by the physical AHP weighting in the PCA subspace, defined as $M_K = V_K^T W V_K \in \mathbb{R}^{K \times K}$.
    - **Reasoning:** Because PCA rotates the original coordinate axes into orthogonal eigenvectors, standard diagonal AHP weights $W = \text{diag}(w_{phys})$ cannot be directly applied in the subspace. Pre- and post-multiplying $W$ by the projection basis $V_K$ mathematically projects the physical preference metric into the reduced space, ensuring that distances in $\mathbb{R}^K$ faithfully reflect expert physical priorities.
    - **Implementation Trace:** Constructed by `construct_metric_tensor()` (`src/asd_mcda/v2/metrics.py:21`), with symmetry and positive definiteness strictly validated.
    - **Viva Defense Sentence:** *"$M_K = V_K^T W V_K$ ensures that our spatial distance metric in the PCA subspace honors the physical preference weights elicited from domain experts."*
14. **Why do we standardize the ideal reference point?**
    So it occupies the exact same geometric space as the standardized cohort matrix $Z$.
15. **What is $s_{GT}$?**
    The model-predicted glass-transition margin.
16. **How does `audit_truncation_discrepancy()` work?**
    It evaluates the signed discrepancy $\Delta D^2 = d_{full}^2 - d_K^2$ caused by dimensional truncation.
17. **What random index is used for the 4x4 AHP matrix?**
    $RI_4 = 0.89$, hardcoded in `ahp.py`.
18. **How are ties broken deterministically?**
    By sorting $C_L$ descending, and breaking ties alphabetically by `polymer_id` using `epsilon_rank = 1e-12`.
19. **What exception is raised if the distance to both anchors is near zero?**
    `DegenerateReferenceCoincidenceError`.
20. **Why do we use absolute physical anchors instead of empirical max/min?**
    - **Direct Answer:** To eliminate rank reversal and ground candidate evaluation in immutable thermodynamic boundary states.
    - **Reasoning:** Classical Hwang–Yoon TOPSIS defines anchors as the empirical max and min of the cohort. Introducing a new alternative (e.g., an exceptionally poor polymer) shifts the anti-ideal, rescales all relative distances, and can invert the ranking of existing polymers. Absolute anchors ($s^+=[1,1,1,1]$ and $s^-=[0,0,0,0]$) remain physically invariant regardless of cohort membership.
    - **Implementation Trace:** Defined in `src/asd_mcda/v2/standardization.py:78-79` and projected in `src/asd_mcda/v2/metrics.py:160-161`.
    - **Viva Defense Sentence:** *"Absolute physical anchors decouple candidate evaluation from cohort composition, providing mathematical immunity against classical rank-reversal pathologies."*

### Difficult (21-30)
21. **Derive the expression for the metric tensor $M_K$.**
    In the full $p$-dimensional space, weighted squared distance is $(x-y)^T W (x-y)$. Under the projection approximation $x \approx t V_K^T$, this becomes $(t V_K^T - u V_K^T) W (V_K t^T - V_K u^T) = (t-u) V_K^T W V_K (t-u)^T$. Thus, $M_K = V_K^T W V_K$.
22. **Explain the impact of `ddof=0` on the projection geometry.**
    Using `ddof=0` computes the true population variance for the $N_{generated} = 10,000$ points, ensuring the scaling strictly bounds the generated statistical universe without sample bias.
23. **What happens if $q_+$ evaluates to $-1e-15$?**
    Floating point inaccuracies are handled by $\max(0, q_+)$. If it is significantly negative ($< -1e-12$), it raises a `MateriallyNegativeQuadraticFormError`.
24. **Why is it critical that $W$ is diagonal in the original space?**
    Because the AHP matrix assigns independent physical weights to the criteria. The correlation is handled entirely by $V_K$, so $W$ must not mix the original axes.
25. **How does the algorithm handle negative eigenvalues in the distance metric?**
    $M_K$ is symmetric positive semi-definite by construction (since $W$ is positive diagonal), so theoretical negative distances are mathematically impossible barring numerical error.
26. **Explain the difference between $C_L$ and probability of success.**
    $C_L$ is purely a geometric ratio $D_- / (D_+ + D_-)$. It maps mathematical distance under a specific AHP model, completely lacking empirical clinical or formulation validation.
27. **What is provenance sealing?**
    The process in `provenance.py` where all matrices ($Z, V_K, M_K, T$) are cryptographically hashed to guarantee an auditable paper trail of the calculation.
28. **How does truncation discrepancy differ from standard PCA reconstruction loss?**
    Standard PCA loss measures variance lost in $X$. Truncation discrepancy $\Delta D^2$ measures the specific geometric distortion of the distance from the candidate to the ideal anchor.
29. **Why is it invalid to call this 'classical Hwang-Yoon TOPSIS'?**
    Hwang-Yoon is defined strictly by empirical relative anchors and Euclidean/Minkowski metrics. Our methodology violates both foundational premises.
30. **What is the exact function signature for distance computation?**
    `compute_distances_and_closeness()` found at `metrics.py` line 172.

### Hostile/Challenging (31-40)
31. **Challenge:** You are basically guessing the winning polymer by throwing math at the wall.
    **Response:** Incorrect. We never claim an "optimal polymer". We strictly compute the top-ranked computational candidate using physical thermodynamics principles ($s_{\chi}, s_{GT}$) mapped through a robust $M_K$ tensor.
32. **Challenge:** Soluplus is your definitive top formulation choice, right?
    **Response:** I will never claim it is the "best polymer". It is simply the top-ranked computational candidate under the 4-criterion model.
33. **Challenge:** Why overcomplicate this? Just use Euclidean distance.
    **Response:** Using Euclidean distance ignores the physical correlation between diagnostics (e.g., $s_{HSP}$ and $s_{\chi}$) and overrides the domain-expert AHP weights, fundamentally invalidating the physics of the model.
34. **Challenge:** Your absolute anchors [1,1,1,1] are arbitrary and unscientific.
    **Response:** They are not arbitrary. The underlying physical scoring functions are strictly normalized to map to [0,1], meaning a score of 1 represents the theoretical maximum phase boundary limit or interaction margin.
35. **Challenge:** You just ran PCA and took PC1/PC2, which is basic.
    **Response:** That was the v1.5 frozen methodology. The v2.0.0-SP-PRP-TOPSIS uses dynamic $K$ selection and a sophisticated projected metric tensor, addressing the limitations of the older framework.
36. **Challenge:** If I add a terrible polymer to the cohort, your Soluplus ranking will change. Rank reversal!
    **Response:** Incorrect. Because we use absolute anchors instead of cohort min/max, the geometric position of the ideal does not shift relative to the cohort envelope. Any slight shift is purely due to statistical re-standardization of the covariance matrix, not classical rank reversal.
37. **Challenge:** $C_L=0.6864$ means a 68.6% probability of formulation success.
    **Response:** Absolutely false. $C_L$ is a spatial closeness coefficient. It has zero interpretability as a clinical or experimental probability.
38. **Challenge:** $N_{generated} = 2,000$ is too small for Monte Carlo stability.
    **Response:** The production model uses $N_{generated} = 10,000$, ensuring robust convergence of the covariance matrix and stability in the $V_K$ eigenspace.
39. **Challenge:** AHP weights are completely subjective, so the metric tensor is garbage.
    **Response:** AHP weights are derived from expert elicitation and mathematically validated using the consistency ratio ($CR < 0.1$) against $RI_4 = 0.89$. It provides an auditable assumption of preference, not arbitrary guessing.
40. **Challenge:** You cannot prove your metric tensor is valid.
    **Response:** The metric tensor $M_K = V_K^T W V_K$ is mathematically provable as the exact low-rank quadratic form equivalent of weighted full-space distance, bounded by the truncation discrepancy audit in `diagnostics.py`.
