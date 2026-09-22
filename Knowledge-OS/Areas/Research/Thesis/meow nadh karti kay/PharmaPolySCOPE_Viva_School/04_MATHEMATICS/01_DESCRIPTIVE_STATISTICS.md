# 01_DESCRIPTIVE_STATISTICS
---
## Cross-Reference
**Prerequisite knowledge:** Basic arithmetic, understanding of matrices (rows and columns).
**Used later by:** 02_STANDARDIZATION.md, 04_PCA_FROM_FIRST_PRINCIPLES.md
**Related source code:** `src/asd_mcda/v2/standardization.py`
**Related tests:** `tests/v2/`
**Related validation artifact:** `scientific_validation_results.json`
**Related viva attack:** Part 9

---
## Part 1: Beginner Understanding [BEGINNER]
Imagine you have a classroom of five students, and you measure their heights and weights. The students are your "observations" and the heights and weights are your "variables". Data is simply a collection of these observations. 

In PharmaPolySCOPE, our "students" are the 5 polymers (Soluplus, HPMC E5, PVP-VA64, PVP K30, Eudragit E PO), and our "variables" are the 4 criteria (s_HSP, s_chi, s_desc, s_GT). 

When we want to understand how a specific variable behaves, we look at its average (mean) and how much the individual students differ from that average (variance/standard deviation). Furthermore, we want to know if being taller means being heavier—this is where covariance and correlation come in, measuring how two variables move together. We measure the *entire* classroom, so we are calculating the statistics for the whole population, not just a sample.

---
## Part 2: Technical Development [TECHNICAL]
### Definitions
- **Data:** A structured collection of observations and variables. Measurement data comes from physical devices; computed data (like in PharmaPolySCOPE) comes from models.
- **Scalar:** A single number (e.g., 4.2).
- **Vector:** An ordered list of numbers (e.g., [1.1, 2.2, 3.3]).
- **Matrix:** A table of numbers (e.g., our 5x4 S matrix).

### Population vs Sample
PharmaPolySCOPE uses population statistics (degrees of freedom, ddof=0) because the 5 polymers we analyze represent the *entire* cohort of interest. We are not inferring properties of a larger unobserved set of polymers from these 5. 

### Mean ($\mu$)
The arithmetic average of a variable over all $n$ observations.
$\mu = \frac{1}{n} \sum_{i=1}^{n} x_i$
It shares the same units as the underlying data.

### Deviation, Variance ($\sigma^2$), and Standard Deviation ($\sigma$)
- **Deviation:** $x_i - \mu$
- **Variance (Population, ddof=0):** $\sigma^2 = \frac{1}{n} \sum_{i=1}^{n} (x_i - \mu)^2$
- **Standard Deviation:** $\sigma = \sqrt{\sigma^2}$ (Same units as data).

*Note: Sample variance divides by $(n-1)$ (ddof=1) to correct for bias in estimating a larger population. We strictly use ddof=0.*

### Covariance and Correlation
- **Covariance:** $\text{cov}(X,Y) = \frac{1}{n} \sum_{i=1}^{n} (x_i - \mu_X)(y_i - \mu_Y)$. Measures linear co-movement.
- **Correlation:** $\rho(X,Y) = \frac{\text{cov}(X,Y)}{\sigma_X \sigma_Y}$. Normalizes covariance to $[-1, 1]$. Dimensionless, measures strength of linear relationship.

---
## Part 3: Worked Example [EXAMPLE]

### [HYPOTHETICAL — NOT PRODUCTION VALUES]
3 observations × 2 criteria:
$X = [4, 7, 1]$, $Y = [2, 8, 5]$, $n=3$
$\mu_X = (4+7+1)/3 = 12/3 = 4.000$
$\mu_Y = (2+8+5)/3 = 15/3 = 5.000$
$\sigma_X^2 = [(4-4)^2+(7-4)^2+(1-4)^2]/3 = [0+9+9]/3 = 6.000$; $\sigma_X = 2.449$
$\sigma_Y^2 = [(2-5)^2+(8-5)^2+(5-5)^2]/3 = [9+9+0]/3 = 6.000$; $\sigma_Y = 2.449$
$\text{cov}(X,Y) = [(4-4)(2-5)+(7-4)(8-5)+(1-4)(5-5)]/3 = [0+9+0]/3 = 3.000$
$\rho(X,Y) = 3.000 / (2.449 \times 2.449) = 3.000 / 5.997 = 0.500$

### [PRODUCTION VALUES]
Indomethacin raw S matrix (source: `scientific_validation_results.json`):
5 polymers × 4 criteria -> 5×4 score matrix S.
Each column $j$ has a mean $\mu_j$ and standard deviation $\sigma_j$ calculated over the 5 polymers using population formulas (ddof=0).
(Mean and std values are computed dynamically via `standardize_cohort()`).

---
## Part 4: v1.5 vs v2 Comparison [VERSIONING]
In v1.5, standard deviation calculations occasionally lacked strict population definitions (mixed ddof usage in external libraries). v2 rigorously enforces ddof=0 across all numpy calls.

---
## Part 5: PharmaPolySCOPE Implementation [IMPLEMENTATION]
### Implementation Trace
- **Concept:** Calculate column-wise means and standard deviations.
- **Input:** Raw S matrix (shape 5x4).
- **Function:** `standardize_cohort(scores: np.ndarray)`
- **File:** `src/asd_mcda/v2/standardization.py`
- **Computation:** 
  `mu = np.mean(scores, axis=0)`
  `sigma = np.sqrt(np.mean((scores-mu)**2, axis=0))`
- **Output:** Array of means and standard deviations (length 4 each).
- **Next stage:** Used for Z-score transformation.

---
## Part 6: Assumptions and Limitations [LIMITATIONS]
- **Assumption:** Mean and variance are sufficient descriptors.
- **Limitation:** Correlation only measures *linear* dependencies.

---
## Part 7: Viva Questions [VIVA]

### A. 10 Basic Q&A
1. **What is a matrix?** A rectangular table of scalars.
2. **What does $n$ represent here?** The number of observations (5 polymers).
3. **What is the mean?** The arithmetic average of a vector.
4. **Why do we measure variance?** To quantify how spread out the data points are from the mean.
5. **What are the units of standard deviation?** The same units as the underlying data.
6. **What is covariance?** A measure of how two variables move together linearly.
7. **What is correlation?** Normalized covariance, scaled between -1 and 1.
8. **What does a correlation of 0 mean?** No linear relationship.
9. **How many criteria are in the S matrix?** 4.
10. **Are the values in the S matrix bounded?** Yes, between 0 and 1.

### B. 10 Intermediate Q&A
11. **Why do we use ddof=0?** Because the 5 polymers constitute our entire population of interest.
12. **What is the difference between $\sigma^2$ and $\sigma$?** $\sigma^2$ is variance (squared units), $\sigma$ is standard deviation.
13. **How does standard deviation affect PCA?** Standardizing ensures PCA doesn't artificially favor criteria.
14. **Can covariance be negative?** Yes.
15. **What happens if a column has zero variance?** All polymers scored identically.
16. **Why is `axis=0` used in `np.mean`?** To compute the mean across rows.
17. **How is deviation calculated?** By subtracting the mean.
18. **Why square the deviations for variance?** To ensure deviations don't cancel out.
19. **What does $\rho = 1$ indicate?** Perfect positive linear relationship.
20. **Is correlation sensitive to scale?** No.

### C. 10 Difficult Q&A
21. **Derive why sample variance uses $n-1$.** Bessel's correction corrects for the bias of estimating mean from the sample.
22. **Prove that $\text{cov}(X,X) = \text{var}(X)$.** By definition, covariance of X with itself simplifies to variance.
23. **If $Y = aX + b$, what is $\rho(X,Y)$?** 1 if $a > 0$, -1 if $a < 0$.
24. **How do outliers affect covariance?** They inflate it drastically.
25. **Why can't correlation capture $Y=X^2$ effectively?** Symmetrical deviations cancel out.
26. **What is the max variance for [0,1] bounded data?** 0.25.
27. **What is the geometric interpretation of correlation?** Cosine of the angle between mean-centered vectors.
28. **How compute covariance matrix?** $(1/n) X^T X$ for mean-centered X.
29. **Why population variance here?** The space is fully empirically defined.
30. **Condition for positive definite covariance?** Linearly independent columns, $n > p$.

### D. 10 Hostile Q&A
31. **Why not ddof=1?** We are not estimating a sample of a larger cohort.
32. **Is $n=5$ enough for PCA?** Yes, to resolve up to 4 components.
33. **Did you test for normality?** Not needed; PCA is algebraic.
34. **Why not median absolute deviation?** We want linear variance to capture physical differences.
35. **Could you be missing non-linear relationships?** Yes, but PCA is strictly linear.
36. **Zero variance?** Blocked by `ZeroVarianceStandardizationError`.
37. **Does correlation exactly reach 1?** Floating point may limit exactness.
38. **Why keep highly correlated variables?** PCA naturally handles them.
39. **Why not rank correlation?** Discards thermodynamic magnitude.
40. **Complex numbers?** Impossible in our physical bounds.

### E. Common Mistakes
- Using `ddof=1`.
- Confusing covariance and correlation.
### F. Things You Must Never Claim
- Never claim the 5 polymers are a "sample".
- Never claim variables are normally distributed.
