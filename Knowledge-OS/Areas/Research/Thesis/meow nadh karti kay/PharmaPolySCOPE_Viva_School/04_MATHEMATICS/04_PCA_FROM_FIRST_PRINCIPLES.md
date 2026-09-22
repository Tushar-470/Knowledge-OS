# 04_PCA_FROM_FIRST_PRINCIPLES
---
## Cross-Reference
**Prerequisite knowledge:** 01_DESCRIPTIVE_STATISTICS.md, 02_STANDARDIZATION.md, 03_LINEAR_ALGEBRA.md
**Used later by:** 05_DYNAMIC_K_SELECTION.md
**Related source code:** `src/asd_mcda/v2/pca.py`
**Related tests:** `tests/v2/`
**Related validation artifact:** `scientific_validation_results.json`
**Related viva attack:** Part 9

---
## Part 1: Beginner Understanding [BEGINNER]
Principal Component Analysis (PCA) is a mathematical way of summarizing data. 
Imagine taking a 3D object like a teapot and shining a flashlight on it to cast a shadow on the wall. If you shine it from the front, you might see the spout and handle clearly (high information). If you shine it from the top, you just see a circle (low information). PCA mathematically finds the "best angles" to shine the flashlight so that the shadow captures the absolute maximum amount of information (variance) possible, allowing us to drop less important dimensions without losing much detail.

In PharmaPolySCOPE, our polymers have 4 scores (`s_HSP`, `s_chi`, `s_desc`, `s_GT`). But these scores aren't entirely independent. `s_HSP` and `s_chi` both measure thermodynamic miscibility based on Hansen Solubility Parameters. They are highly correlated. PCA discovers this correlation and merges them into a single "direction" of variance. 

---
## Part 2: Technical Development [TECHNICAL]
### Motivation
- `s_HSP` and `s_chi` are both derived from HSP components $\rightarrow$ highly correlated.
- `s_GT` depends mainly on polymer $T_g \rightarrow$ often uncorrelated with thermodynamics.
- Correlated criteria mean redundant information; uncorrelated directions mean independent information.
- PCA finds the orthogonal directions of maximum variance.

### Step 1: Standardized Matrix $Z$
Start with the standardized matrix $Z$ of shape $(n \times p)$, where $n=5$ and $p=4$.
Each column has mean = 0, standard deviation = 1.

### Step 2: Empirical Correlation Matrix $R$
$R = \frac{1}{n} Z^T Z$
Since $Z$ is already zero-mean and unit-variance, $R$ is directly the empirical correlation matrix.
Proof: $R_{jk} = \frac{1}{n} \sum Z_{ij} Z_{ik} = \frac{1}{n} \sum \frac{(S_{ij} - \mu_j)}{\sigma_j} \frac{(S_{ik} - \mu_k)}{\sigma_k} = \frac{\text{cov}(S_j, S_k)}{\sigma_j \sigma_k} = \rho(S_j, S_k)$
The diagonal of $R$ is identically 1 (because total variance per standardized column is 1). Trace of $R = p = 4$.

### Step 3: Symmetric Eigendecomposition
$R = V \Lambda V^T$
- $\Lambda = \text{diag}(\lambda_1, \lambda_2, \lambda_3, \lambda_4)$ where $\lambda_1 \ge \lambda_2 \ge \lambda_3 \ge \lambda_4 \ge 0$.
- $V$ is orthogonal; columns are eigenvectors.
- Total variance = $\sum \lambda_k = 4$.
- Variance explained by PC $k$ = $\lambda_k / 4$.

### Step 4: Sign Canonicalization
Eigenvectors are defined up to a sign flip (if $Av = \lambda v$, then $A(-v) = \lambda(-v)$). Different math libraries or OS architectures might yield flipped signs. To ensure reproducibility:
- Find the element of maximum absolute value in $v$.
- If it is negative, multiply the entire vector $v$ by -1.
- Tie-break: lowest index within $1e-12$ tolerance.

### Step 5: Dynamic $K$ Selection
Instead of hardcoding the number of components, we dynamically select $K$:
$K = \min\{k : \sum_{i=1}^k \lambda_i / p \ge 0.95\}$

### Step 6: Projection
$V_K$ is the $p \times K$ matrix containing the first $K$ eigenvectors.
$T = Z V_K$ projects the $n \times p$ matrix $Z$ into the $n \times K$ subspace.

---
## Part 3: Worked Example [EXAMPLE]

### [HYPOTHETICAL — NOT PRODUCTION VALUES]
Imagine a dataset with 3 polymers, 2 criteria, perfectly standardized:
$Z = \begin{bmatrix} 1.22 & 0.41 \\ 0.00 & -0.82 \\ -1.22 & 0.41 \end{bmatrix}$
$R = \frac{1}{3} Z^T Z = \begin{bmatrix} 0.9923 & 0 \\ 0 & 0.3362 \end{bmatrix}$
Eigenvalues: $\lambda_1 = 0.9923, \lambda_2 = 0.3362$.
Total var = 2.
Cumvar at $K=1$: $0.9923/2 = 0.496 < 0.95$.
Cumvar at $K=2$: $(0.9923+0.3362)/2 \approx 0.664 < 0.95 \rightarrow K=2=p$.
(This demonstrates a degenerate case where all PCs are needed).

### [PRODUCTION VALUES]
**Indomethacin validation (scientific_validation_results.json):**
Eigenvalues (sorted desc): `[2.0908657741533783, 1.1678952418522826, 0.7397747065453792, 0.0014642774489659338]`
Total variance = 4.0.
Variance explained: `[52.27%, 29.20%, 18.49%, 0.037%]`
Cumulative: `[52.27%, 81.47%, 99.96%, 100%]`
$K$ selection: $K=3$ (First $k$ where cumvar $\ge 95\%$).

---
## Part 4: v1.5 vs v2 Comparison [VERSIONING]
**v1.5:** Hardcoded $K=2$ regardless of variance captured. For Indomethacin, $K=2$ captured only 81.47% of variance, meaning ~18.5% of the thermodynamic signal was blindly discarded, corrupting the rankings.
**v2:** Dynamic $K$. For Indomethacin, it selects $K=3$, capturing 99.96%. The 6 legacy v1.5 tests fail precisely because v2 correctly identifies the need for $K=3$.

---
## Part 5: PharmaPolySCOPE Implementation [IMPLEMENTATION]
### Implementation Trace
- **Concept:** Spectral decomposition and K-selection.
- **Input:** $Z$ (shape 5x4)
- **Function:** `decompose_spectral(Z, variance_threshold=0.95)`
- **File:** `src/asd_mcda/v2/pca.py`
- **Computation:**
  1. $R = (Z^T Z) / float(n)$
  2. `eigvals, eigvecs = scipy.linalg.eigh(R)`
  3. Sort descending. Clip negatives to 0.0.
  4. Call `canonicalize_eigenvector_sign(v)`.
  5. Compute `cum_var_curve = np.cumsum(eigvals) / p`.
  6. Select $K$ based on `threshold - 1e-12`.
- **Output:** eigenvalues, $V$ matrix, $K$, cumulative variance.
- **Next stage:** $K$ and eigenvalues are passed to `evaluate_subspace_stability`.

---
## Part 6: Assumptions and Limitations [LIMITATIONS]
- **Assumption:** The relationships between criteria are linear.
- **Assumption:** High variance corresponds to high signal. (In our domain, this is true: variance equals discriminability among polymers).
- **Limitation:** PCA is sensitive to standardization; if not properly standardized, features with larger ranges dominate.

---
## Part 7: Viva Questions [VIVA]
### A. 10 Basic Q&A
1. **What does PCA stand for?** Principal Component Analysis.
2. **What is its main goal?** Dimensionality reduction by capturing maximum variance.
3. **What matrix does PCA decompose in our pipeline?** The empirical correlation matrix $R$.
4. **How many principal components are there initially?** 4 (same as the number of criteria $p$).
5. **What do eigenvalues represent here?** The amount of variance captured by each principal component.
6. **What is the sum of all eigenvalues?** $p = 4$.
7. **What is the threshold for K selection?** 95% (0.95).
8. **What was the flaw in v1.5?** Hardcoded $K=2$.
9. **What is $K$ for Indomethacin?** $K=3$.
10. **What is sign canonicalization?** Forcing a consistent sign for eigenvectors to ensure reproducibility.

### B. 10 Intermediate Q&A
11. **Why use $R$ instead of the raw covariance matrix?** $R$ is the covariance of the standardized matrix, ensuring fair weighting of all criteria.
12. **Why is clipping negative eigenvalues to 0 necessary?** Floating point inaccuracies can result in eigenvalues like $-1e-16$. Variance cannot be negative.
13. **How is cumulative variance calculated?** By taking the running sum of eigenvalues and dividing by $p$.
14. **Why did v1.5 tests fail?** Because v1.5 assumed $K=2$ was enough, missing 18.5% variance for Indomethacin. v2's $K=3$ changes the distance calculations.
15. **What happens if $K=p$ is required?** The algorithm gracefully retains all 4 dimensions, doing no reduction, but standardizing the orthogonal space.
16. **How does PCA handle highly correlated criteria like $s_{HSP}$ and $s_{chi}$?** It aligns a principal component along their joint axis, capturing their shared variance efficiently.
17. **Why use $1/n$ instead of $1/(n-1)$ in $R$?** We use population statistics because the 5 polymers are the full cohort.
18. **What happens to the $Z$ matrix when projected by $V_K$?** It becomes the scores matrix $T$ in the PCA subspace.
19. **Can the variance threshold be met at $K=1$?** Yes, if the criteria are extremely highly correlated.
20. **Is $V_K$ orthogonal?** Yes, its columns are mutually orthogonal unit vectors.

### C. 10 Difficult Q&A
21. **Derive the variance of the first principal component.** The PC is $t = Z v$. Var$(t) = \frac{1}{n} t^T t = \frac{1}{n} v^T Z^T Z v = v^T R v$. Since $Rv = \lambda v$, Var$(t) = v^T \lambda v = \lambda v^T v = \lambda$.
22. **Why does canonicalization check the maximum absolute element instead of just the first element?** If the first element is near zero, its sign is subject to random floating-point noise. The max absolute element is mathematically the most stable pivot.
23. **Why do you use `eigh` instead of `svd` directly on Z?** For a tiny $5\times4$ matrix, `eigh` on the $4\times4$ $R$ matrix is trivially fast and conceptually maps perfectly to the variance formulation.
24. **If two eigenvalues are identical, what happens to their eigenvectors?** They form a degenerate subspace where any orthogonal rotation is also a valid eigenvector set. (This rarely happens in empirical physical data).
25. **Prove that the sum of eigenvalues equals trace(R).** The trace of a matrix is invariant under cyclic permutation. $R = V \Lambda V^T \rightarrow \text{trace}(V \Lambda V^T) = \text{trace}(\Lambda V^T V) = \text{trace}(\Lambda I) = \sum \lambda_i$.
26. **What is the effect of the $1e-12$ tolerance in the threshold check `>= 0.95 - 1e-12`?** It prevents a float like $0.9499999999999999$ from being incorrectly rejected as $<0.95$ due to binary representation limits.
27. **What is the geometrical meaning of the PCA subspace?** It is the hyperplane of dimension $K$ that minimizes the sum of squared orthogonal distances from the data points to the plane.
28. **How does K=3 impact the downstream metric tensor $M_K$?** $M_K$ becomes a $3\times3$ matrix instead of a $2\times2$ matrix, incorporating weights appropriately projected from the 4D physical space.
29. **Can an outlier dictate the first principal component?** Yes. Since PCA uses squared deviations, a massive outlier will heavily influence the direction of maximum variance.
30. **Why doesn't PCA guarantee physical interpretability of the axes?** PCs are linear combinations of all criteria. "PC1" isn't "thermodynamics"—it's a mathematical blend, which is why we map distances back to physical ideals.

### D. 10 Hostile Q&A
31. **You claim your PCA is "first principles", yet you rely on scipy.eigh. Defend this.** "First principles" refers to the architectural design and algebraic derivations (ddof=0, canonicalization, tracking geometric stability), not rewriting basic BLAS routines in Python.
32. **If your $s_{HSP}$ and $s_{chi}$ are highly correlated, why not just drop one?** Because discarding data is statistically destructive. The slight differences between them contain nuances (e.g., dispersion vs hydrogen bonding). PCA retains the shared signal without discarding the nuance.
33. **With $N=5$, is your covariance matrix statistically reliable?** We are not doing inferential statistics; we are not predicting population parameters. We are performing algebraic dimensionality reduction on a known, closed finite space.
34. **If $K=3$ for Indomethacin and $K=2$ for Ibuprofen, your metric space changes dimensions between drugs. Isn't that comparing apples and oranges?** The physical space is always 4D. The rank of the *information* in that space depends on the drug. Adapting the topology to the drug's specific correlation structure is exactly why v2 is superior to v1.5's rigid $K=2$.
35. **Your sign canonicalization takes the lowest index on ties. That's arbitrary.** It is an arbitrary tie-breaker designed solely to guarantee deterministic execution across platforms. Determinism is a hard requirement for validation.
36. **What if your total variance isn't exactly $4.0$?** It is mathematically guaranteed to be exactly $p$ by the formulation of $Z^T Z / n$. Any deviation is strictly floating point noise, which is negligible ($\approx 10^{-16}$).
37. **Why not use kernel PCA?** Unnecessary complexity. Non-linear relationships in MCDA physical compatibility scores lack theoretical justification and ruin metric tensor interpretability.
38. **At $K=3$, you keep a component with 18.49% variance. Isn't that mostly noise?** No, in a 4-parameter physical model, an 18% variance axis is a major structural feature, likely representing the independent `s_GT` signal.
39. **Could your dynamic K selection cause rank-reversals if a new polymer is added?** Yes. Adding a candidate changes the empirical covariance, which is a known and accepted property of relative MCDA methods like TOPSIS.
40. **How do you defend the 95% threshold against reviewers wanting 90% or 99%?** 95% is the standard heuristic for conservative variance retention. The MC testing shows this threshold yields geometrically stable subspaces in >99% of valid replications.

### E. Common Mistakes
- Misinterpreting PCs as physical parameters instead of mathematical vectors.
- Using sample variance ($1/(n-1)$) for $Z$, causing trace($R$) $\ne p$.
### F. Things You Must Never Claim
- Never claim PCs represent pure physical criteria.
- Never claim PCA removes outliers.
