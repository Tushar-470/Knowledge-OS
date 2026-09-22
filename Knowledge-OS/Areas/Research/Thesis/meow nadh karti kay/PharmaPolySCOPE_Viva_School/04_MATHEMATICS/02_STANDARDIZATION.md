# 02_STANDARDIZATION
---
## Cross-Reference
**Prerequisite knowledge:** Mean, Standard Deviation, Vectors (01_DESCRIPTIVE_STATISTICS.md)
**Used later by:** 04_PCA_FROM_FIRST_PRINCIPLES.md
**Related source code:** `src/asd_mcda/v2/standardization.py`
**Related tests:** `tests/v2/`
**Related validation artifact:** `scientific_validation_results.json`
**Related viva attack:** Part 9

---
## Part 1: Beginner Understanding [BEGINNER]
If you are comparing exam scores in Math (scored out of 100) and swimming times (measured in seconds, say 30s to 50s), the "spread" of the numbers is completely different. If you just feed these raw numbers into a model, Math will dominate simply because the numbers and their spread are larger. 

Standardization levels the playing field. It forces every criteria to speak the same language: "How many standard deviations are you away from the average?" By standardizing, every criterion has an average of 0 and a standard deviation of 1.

---
## Part 2: Technical Development [TECHNICAL]
### Why Standardize?
PCA seeks directions of maximum variance. If variables are not standardized, PCA will naively align its principal components with variables that naturally have larger scales or broader spreads. Standardizing makes all criteria contribute fairly.

### Z-score Formula
$Z_{ij} = \frac{S_{ij} - \mu_j}{\sigma_j}$
After standardization, the matrix $Z$ has column means identically equal to 0 and column standard deviations identically equal to 1.

### Population Moments (ddof=0)
- $\mu_j = \frac{1}{n} \sum_{i} S_{ij}$
- $\sigma_j = \sqrt{\frac{1}{n} \sum_{i} (S_{ij} - \mu_j)^2}$

### Physical Ideals
To perform TOPSIS later, we need reference points in the same space as the candidates.
- Physical ideal $s+ = [1,1,1,1]$ (Best possible profile)
- Physical anti-ideal $s- = [0,0,0,0]$ (Worst possible profile)

Since candidate scores are standardized, these reference points must be standardized using the exact same $\mu$ and $\sigma$:
$z+ = \frac{1.0 - \mu}{\sigma}$
$z- = \frac{0.0 - \mu}{\sigma}$

### Zero-Variance Guardrail
If $\sigma_j \le 1e-15$, the code raises a `ZeroVarianceStandardizationError`.
Physical meaning: If all 5 polymers score identically on a criterion, that criterion provides zero discriminatory information. Division by zero in the Z-score formula is mathematically impossible.

---
## Part 3: Worked Example [EXAMPLE]

### [HYPOTHETICAL — NOT PRODUCTION VALUES]
3 polymers × 2 criteria:
$S = \begin{bmatrix} 0.80 & 0.60 \\ 0.50 & 0.90 \\ 0.20 & 0.30 \end{bmatrix}$

$\mu_1 = (0.80+0.50+0.20)/3 = 0.500$
$\mu_2 = (0.60+0.90+0.30)/3 = 0.600$

$\sigma_1^2 = [(0.80-0.5)^2+(0.50-0.5)^2+(0.20-0.5)^2]/3 = [0.09+0+0.09]/3 = 0.060$
$\sigma_1 = 0.245$

$\sigma_2^2 = [(0.60-0.6)^2+(0.90-0.6)^2+(0.30-0.6)^2]/3 = [0+0.09+0.09]/3 = 0.060$
$\sigma_2 = 0.245$

$Z_A = [(0.80-0.5)/0.245, (0.60-0.6)/0.245] = [1.225, 0.000]$
$Z_B = [(0.50-0.5)/0.245, (0.90-0.6)/0.245] = [0.000, 1.225]$
$Z_C = [(0.20-0.5)/0.245, (0.30-0.6)/0.245] = [-1.225, -1.225]$

$z+ = [(1.0-0.5)/0.245, (1.0-0.6)/0.245] = [2.041, 1.633]$
$z- = [(0.0-0.5)/0.245, (0.0-0.6)/0.245] = [-2.041, -2.449]$
Verify: column means of Z = [0,0]; column stds of Z = [1,1] ✓

### [PRODUCTION VALUES]
Indomethacin raw S matrix (source: `scientific_validation_results.json`).
Note: The actual Z values are intermediate computations and not output in the validation JSON. The standardizer transforms the provided 5x4 matrix strictly according to the formula.

---
## Part 4: v1.5 vs v2 Comparison [VERSIONING]
v1.5 lacked the strict `1e-15` tolerance bounds and read-only defensive copies, risking in-place mutation of scores. v2 ensures the physical ideal and anti-ideal are rigorously projected into the exact same standardized coordinate system.

---
## Part 5: PharmaPolySCOPE Implementation [IMPLEMENTATION]
### Implementation Trace
- **Concept:** Zero-mean, unit-variance standardization.
- **Input:** $S$ (scores matrix)
- **Function:** `standardize_cohort(scores: np.ndarray)`
- **File:** `src/asd_mcda/v2/standardization.py`
- **Computation:** 
  `Z = (scores - mu) / sigma`
  `z_plus = (1.0 - mu) / sigma`
  `z_minus = (0.0 - mu) / sigma`
  `ZeroVarianceStandardizationError` triggered if `sigma[j] <= 1e-15`.
- **Output:** Read-only defensive copies of `Z, z_plus, z_minus, mu, sigma`.
- **Next stage:** $Z$ is passed to PCA decomposition.

---
## Part 6: Assumptions and Limitations [LIMITATIONS]
- **Assumption:** Every variable deserves equal weighting at the statistical level before PCA.
- **Limitation:** Standardization destroys the original units, meaning absolute differences in raw scores are abstracted away into relative statistical deviations.

---
## Part 7: Viva Questions [VIVA]
### A. 10 Basic Q&A
1. **What is standardizing?** Transforming data to have mean=0 and std=1.
2. **Why do we do it?** To prevent criteria with large natural ranges from dominating PCA.
3. **What is the Z-score formula?** $Z = (x - \mu) / \sigma$.
4. **What is $s+$?** The physical ideal $[1,1,1,1]$.
5. **What is $s-$?** The physical anti-ideal $[0,0,0,0]$.
6. **Why do we standardize $s+$?** So it exists in the same coordinate space as the standardized polymers.
7. **What is the mean of a standardized column?** Exactly 0.
8. **What is the standard deviation of a standardized column?** Exactly 1.
9. **What triggers a ZeroVarianceError?** When a column's standard deviation is $\le 1e-15$.
10. **What does zero variance mean physically?** No discriminatory power.

### B. 10 Intermediate Q&A
11. **How does standardization affect the correlation matrix?** It makes the correlation matrix identical to the covariance matrix of the standardized data.
12. **Why are outputs read-only?** To prevent downstream mutations from corrupting the state.
13. **Are outliers mitigated by standardization?** No, Z-scores just express outliers in standard deviations.
14. **Why use 1.0 and 0.0 for $s+ / s-$ instead of empirical max/min?** To maintain the objective absolute bounds of the physical desirability model.
15. **Does standardizing change the shape of the data distribution?** No, it just shifts and scales it.
16. **Why a 1e-15 threshold?** It accounts for floating-point arithmetic imprecision.
17. **What happens if you standardize using ddof=1 instead?** The $Z$ scores will have slightly smaller magnitudes, which is technically incorrect for a complete population.
18. **Why not just min-max scaling?** Min-max scaling does not guarantee unit variance, so PCA would still be biased.
19. **What is a "defensive copy"?** Creating a new array memory block so modifications don't reflect on the original.
20. **Is standardizing invertible?** Yes, $x = Z\sigma + \mu$.

### C. 10 Difficult Q&A
21. **Prove that the sum of squared Z-scores for a column equals $n$.** $\sum Z_i^2 = \sum \frac{(x_i-\mu)^2}{\sigma^2} = \frac{n\sigma^2}{\sigma^2} = n$.
22. **What is the condition number of the standard deviation matrix?** Not strictly defined unless it's a diagonal matrix $D$; if so, it's $\max(\sigma)/\min(\sigma)$.
23. **If you append $s+$ to the dataset and THEN standardize, what happens?** You corrupt the empirical geometry of the actual candidates. $s+$ must be standardized using the candidates' $\mu$ and $\sigma$.
24. **How does centering affect the rank of the matrix?** Mean-centering can reduce the rank by 1 since the sum of rows becomes the zero vector.
25. **Is standardizing a linear transformation?** Yes, strictly affine: scaling and shifting.
26. **What's the relationship between Mahalanobis distance and standardized Euclidean distance?** If features are uncorrelated, Mahalanobis distance simplifies to standardized Euclidean distance.
27. **What if all values are 1.0?** `ZeroVarianceStandardizationError` will be thrown.
28. **Does the choice of axis in `np.mean` matter?** Yes, `axis=0` calculates column-wise means; `axis=1` would incorrectly mix different physical criteria.
29. **Why is variance zero bounded below?** Standard deviation is $\sqrt{\text{variance}}$, which must be $\ge 0$.
30. **Explain the physical meaning of a negative Z-score.** The polymer performs below the cohort average for that criterion.

### D. 10 Hostile Q&A
31. **Why not use theoretical limits to calculate $\mu$ and $\sigma$?** Because PCA is an analysis of the *empirical* covariance structure of the cohort, not a theoretical space.
32. **If $s+$ is $[1,1,1,1]$, couldn't $z+$ be negative?** Yes, theoretically, if $\mu_j > 1.0$, but since our scores are strictly bounded in $[0,1]$, $\mu_j$ cannot exceed 1.0. The lowest $z+$ can be is 0 (if all scores are exactly 1, but this would trigger zero variance).
33. **What if standardizing amplifies noise in a very low-variance criterion?** That is exactly what happens. It's a fundamental limitation of PCA. If variance is physical signal, standardizing artificially inflates noise.
34. **Prove your code doesn't leak memory with defensive copies.** Python's garbage collector handles local variables; returning `Z.copy()` guarantees isolation without leaks as long as references aren't kept globally.
35. **Your 1e-15 threshold is arbitrary. Why not 1e-10?** 1e-15 aligns with standard double-precision float $\epsilon$ bounds, preventing catastrophic cancellation while not blocking legitimate tiny variances.
36. **Are you standardizing the raw values or the physical scores?** The physical scores $S$, which are already transformed by desirability functions.
37. **Can Z-scores be larger than 3?** Yes, depending on the sample size and distribution (though for $n=5$, max magnitude is bounded by $\approx \frac{n-1}{\sqrt{n}}$).
38. **If $z+$ is not perfectly orthogonal to the data, doesn't it bias TOPSIS?** $z+$ doesn't need to be orthogonal; it just needs to exist in the same metric space.
39. **Why did v1.5 fail at this?** v1.5 lacked the strict immutability checks, potentially allowing PCA to mutate $Z$ and cascade errors.
40. **What if a criterion is completely irrelevant?** PCA will simply assign it to a principal component. Standardizing doesn't judge relevance; it just equalizes scale.

### E. Common Mistakes
- Trying to calculate $z+$ using empirical maximums instead of physical maximums (1.0).
- Forgetting to standardize the anti-ideal.
### F. Things You Must Never Claim
- Never claim $Z$ matrix values are bounded in $[-1, 1]$.
- Never claim that standardizing removes correlation (it only scales).
