# Module 05: Decision Science - 03_METRIC_TENSOR

## 1. What is it? / Why does it exist? / Problem solved
The subspace metric tensor $M_K$ defines the geometry of our distance calculations in the SP-PRP-TOPSIS framework. Classical TOPSIS uses Euclidean distance, which treats all criteria as independent. However, our physical criteria (like $s_{HSP}$ and $s_{chi}$) are highly correlated. The metric tensor projects our AHP physical weights into a decorrelated Principal Component Analysis (PCA) subspace, creating a custom geometry where distance accurately reflects weighted, independent physical phenomena.

## 2. Beginner explanation (Level 1)
Think of a map grid where North-South and East-West are stretched differently. If you just use a ruler (Euclidean distance), your measurements are wrong. A metric tensor is a mathematical tool that corrects the ruler. We start with weights for our physical criteria, but because the criteria overlap, we project the data into a new "shadow" space (PCA subspace). The metric tensor tells us exactly how to measure distances in this shadow space using our original physical weights.

## 3. Technical explanation (Level 2)
In the methodology `v2.0.0-SP-PRP-TOPSIS`, the distance between an alternative $x$ and an ideal point $x^*$ in the PCA subspace is given by a quadratic form: $d^2 = \delta^T M_K \delta$, where $\delta = x - x^*$. The tensor is constructed via $M_K = V_K^T W V_K$, where $V_K \in \mathbb{R}^{p \times K}$ is the orthogonal basis matrix from PCA, and $W = \text{diag}(w_{phys})$ is the diagonal matrix of AHP weights. While $W$ is diagonal in the original space, $M_K$ is generally dense, mapping the non-isotropic weighting structure into the reduced subspace.

## 4. Mathematics
Let $V_K$ be a $4 \times K$ matrix.
Weight matrix $W \in \mathbb{R}^{4 \times 4}$, $W = \text{diag}(w_1, w_2, w_3, w_4)$.
Metric Tensor $M_K \in \mathbb{R}^{K \times K}$:
$M_K = V_K^T W V_K$
Symmetry enforcement: $M_K \leftarrow 0.5(M_K + M_K^T)$
The distance $d(u,v)$ in subspace $\mathbb{R}^K$:
$d = \sqrt{(u-v)^T M_K (u-v)}$

## 5. Hand-calculable example
Toy example: 2 criteria, 1 principal component ($K=1$).
Weights: $w_{phys} = [0.6, 0.4]$, so $W = \text{diag}(0.6, 0.4)$.
Let $V_K$ be a $2 \times 1$ column vector: $V_K = \begin{bmatrix} 0.8 \\ 0.6 \end{bmatrix}$.
$M_K = V_K^T W V_K = \begin{bmatrix} 0.8 & 0.6 \end{bmatrix} \begin{bmatrix} 0.6 & 0 \\ 0 & 0.4 \end{bmatrix} \begin{bmatrix} 0.8 \\ 0.6 \end{bmatrix}$
$M_K = \begin{bmatrix} 0.8 & 0.6 \end{bmatrix} \begin{bmatrix} 0.48 \\ 0.24 \end{bmatrix} = (0.8 \times 0.48) + (0.6 \times 0.24) = 0.384 + 0.144 = 0.528$.
Since $K=1$, $M_K$ is a scalar. A subspace distance of $\delta=2$ becomes $d^2 = 2 \times 0.528 \times 2 = 2.112$.

## 6. Actual production example
For Indomethacin, $p=4$, and the VariableKEngine selects $K=3$.
$W = \text{diag}(0.4077, 0.3244, 0.0922, 0.1757)$.
$V_K$ is a $4 \times 3$ matrix.
$M_K = V_K^T W V_K$ results in a $3 \times 3$ dense symmetric matrix.
Positive definiteness is verified by ensuring all eigenvalues of $M_K > 10^{-12}$.
The tensor and $W$ matrix are returned as read-only numpy arrays to prevent downstream mutation.

## 7. Exact implementation trace
- Function: `construct_metric_tensor()` in `metrics.py` (line 21).
- Default mode: `semantic_mode = 'standardized_space'` sets $W = \text{diag}(w_{phys})$ (lines 98-99).
- Tensor calculation: `M_K = V_arr.T @ W @ V_arr` (line 112).
- Symmetry enforcement: `M_K = 0.5 * (M_K + M_K.T)` (line 115).
- Pos-def check: `np.linalg.eigvalsh`, min eigval > 1e-12 (lines 118-122).
- Raises `NonPositiveDefiniteMetricError` if pos-def check fails.
- Raises `RankDeficientSubspaceError` if $V_K$ lacks column rank (lines 76-79).
- Raises `InvalidWeightVectorError` if weights $\le 0$ or sum $\neq 1$ (lines 87-95).

## 8. Inputs / Processing / Outputs
**Inputs**: $V_K$ (orthonormal basis $p \times K$), $w_{phys}$ (1D array of length $p$), `semantic_mode` string.
**Processing**: Validates inputs, constructs $W$, calculates $V_K^T W V_K$, enforces symmetry, checks positive definiteness.
**Outputs**: Tuple `(M_K, W)`, both set to read-only (`array.flags.writeable = False`).

## 9. Assumptions / Limitations / Failure modes
- **Assumptions**: $V_K$ provides a valid orthonormal basis for the reduced space.
- **Limitations**: $M_K$ defines a flat geometry (constant tensor); it does not handle curved manifolds.
- **Failure modes**: If PCA yields a rank-deficient $V_K$, or if extreme weights cause numerical underflow in eigenvalues, it violently raises custom Exceptions to halt execution.

## 10. Alternatives and why this method was used
We could use Classical Hwang-Yoon TOPSIS (Euclidean distance on weighted original matrix). However, calculating distance in the original space double-counts highly correlated criteria (e.g., $s_{HSP}$ and $s_{chi}$). We project into the PCA space to orthogonalize the features, but we MUST map our physical weights into that space via $M_K$. A simple Euclidean distance in PCA space would imply equal weighting of components, destroying the physical AHP preferences.

## 11. Common misconceptions
- **Misconception**: $M_K$ is just a diagonal matrix of weights. **Correction**: $M_K$ is DENSE because the projection $V_K$ mixes the axes.
- **Misconception**: We use classical TOPSIS. **Correction**: DO NOT call SP-PRP-TOPSIS "classical Hwang-Yoon TOPSIS". We use a projected metric tensor.

## 12. 40 Viva Q&A
### Basic (10)
1. **Q**: What does $M_K$ stand for, and what mathematical object does it represent?
    - **Direct Answer:** $M_K$ is the positive-definite quadratic-form metric induced by the physical AHP weighting in the PCA subspace, formulated as $M_K = V_K^T W V_K \in \mathbb{R}^{K \times K}$.
    - **Reasoning:** In SP-PRP-TOPSIS, candidate evaluation occurs in the decorrelated PCA subspace $\mathbb{R}^K$. To evaluate distances in this reduced subspace while respecting the physical AHP criteria weights $W = \text{diag}(w_{phys})$, the full-space inner product $\langle z_1, z_2 \rangle_W = z_1^T W z_2$ must be projected onto the subspace: $(V_K t_1)^T W (V_K t_2) = t_1^T (V_K^T W V_K) t_2 = t_1^T M_K t_2$.
    - **Implementation Trace:** Constructed by `construct_metric_tensor()` in `src/asd_mcda/v2/metrics.py:21`, enforcing symmetry ($M_K = 0.5(M_K + M_K^T)$) and verifying positive definiteness via `np.linalg.eigvalsh(M_K) > 10^{-12}`.
    - **Viva Defense Sentence:** *"$M_K$ is the exact mathematical operator that enables us to calculate distances in a decorrelated PCA subspace without losing the physical preference weights elicited from domain experts."*
2. **Q**: What is the formula for $M_K$? **A**: $M_K = V_K^T W V_K$.
3. **Q**: What is $W$? **A**: A diagonal matrix of the physical AHP weights.
4. **Q**: What is $V_K$? **A**: The orthonormal basis matrix from PCA.
5. **Q**: Is $M_K$ a diagonal matrix? **A**: No, it is generally dense.
6. **Q**: What module is this implemented in? **A**: `metrics.py`.
7. **Q**: What is the default semantic mode? **A**: `'standardized_space'`.
8. **Q**: Are the outputs writable? **A**: No, they are strictly read-only.
9. **Q**: What shape is $M_K$ for Indomethacin ($K=3$)? **A**: 3x3.
10. **Q**: What does the tensor calculate? **A**: Weighted distances in the reduced PCA subspace.

### Intermediate (10)
11. **Q**: How is symmetry enforced? **A**: `M_K = 0.5 * (M_K + M_K.T)`.
12. **Q**: Why enforce symmetry manually? **A**: To eliminate floating-point asymmetrical artifacts before downstream operations.
13. **Q**: How is positive definiteness checked? **A**: Minimum eigenvalue of $M_K$ must be $> 10^{-12}$.
14. **Q**: What solver checks the eigenvalues here? **A**: `np.linalg.eigvalsh`.
15. **Q**: Why `eigvalsh` here but not in AHP? **A**: Because $M_K$ is mathematically guaranteed to be symmetric, unlike reciprocal AHP matrices.
16. **Q**: What error is raised if the tensor is not positive definite? **A**: `NonPositiveDefiniteMetricError`.
17. **Q**: What happens if weights don't sum to 1? **A**: `InvalidWeightVectorError`.
18. **Q**: What happens if $V_K$ has linearly dependent columns? **A**: `RankDeficientSubspaceError`.
19. **Q**: How is distance calculated using $M_K$? **A**: $d^2 = \delta^T M_K \delta$.
20. **Q**: What does SP-PRP-TOPSIS stand for? **A**: Subspace-Projected Physical-Reference-Point TOPSIS.

### Difficult (10)
21. **Q**: Why does classical TOPSIS fail when applied directly to the four physical solid dispersion criteria?
    - **Direct Answer:** Classical TOPSIS evaluates Euclidean distances across highly collinear physical criteria, double-counting overlapping thermodynamic interactions and distorting candidate rankings.
    - **Reasoning:** Thermodynamic descriptors $s_{HSP}$ and $s_{\chi}$ exhibit high mutual correlation ($r \approx 0.85$) because both capture cohesive energy density differences. Classical Euclidean distance assumes orthogonal coordinate axes; applying it directly treats collinear thermodynamic axes as independent, artificially inflating the weight of miscibility while diluting the kinetic stabilization margin ($s_{GT}$) and descriptor alignment ($s_{desc}$).
    - **Implementation Trace:** `VariableKEngine.evaluate()` (`src/asd_mcda/v2/engine.py:58`) decorrelates criteria via `decompose_spectral()` (`pca.py:52`) and applies $M_K = V_K^T W V_K$ (`metrics.py:21`).
    - **Viva Defense Sentence:** *"Classical TOPSIS fails because it treats oblique, collinear physical criteria as an orthonormal Cartesian frame, creating severe double-counting bias in candidate ranking."*
22. **Q**: Prove $M_K$ is positive definite if $w_{phys} > 0$ and $V_K$ has full column rank. **A**: For any $x \neq 0$, $x^T M_K x = x^T V_K^T W V_K x = (V_K x)^T W (V_K x)$. Since $V_K$ is full rank, $V_K x \neq 0$. Since $W$ has strictly positive diagonal entries, the quadratic form is strictly positive.
23. **Q**: What does a dense off-diagonal element in $M_K$ represent? **A**: The geometric coupling between two principal components induced by the non-uniform physical weights in the original space.
24. **Q**: How does v2 differ from v1.5 here? **A**: v1.5 applied AHP directly to PC1/PC2. v2 derives AHP for physical space and maps it via the tensor.
25. **Q**: Can the tensor handle $K > p$? **A**: No, PCA components $K$ cannot exceed original dimensions $p$.
26. **Q**: Why set `array.flags.writeable = False`? **A**: To prevent Monte Carlo perturbation loops from accidentally altering the base tensor state.
27. **Q**: What is the threshold for checking weights sum to 1? **A**: Floating point tolerance (usually around $10^{-7}$).
28. **Q**: What happens to $M_K$ if all weights are equal ($w_i = 1/p$)? **A**: $W = (1/p)I$. Then $M_K = (1/p) V_K^T V_K = (1/p) I_K$, reducing back to scaled Euclidean space.
29. **Q**: Why is `semantic_mode` an argument? **A**: To allow future extensions where weights might map to a Mahalanobis space, though currently only 'standardized_space' is used.
30. **Q**: How does $M_K$ relate to the Mahalanobis distance? **A**: Mahalanobis uses the inverse covariance matrix to decorrelate. $M_K$ uses PCA to decorrelate and $W$ to apply expert judgment; they are topologically related but conceptually distinct.

### Hostile / Challenging (10)
31. **Q**: Your metric tensor is just weighted Euclidean distance. Why the fancy name? **A**: It is definitively NOT Euclidean distance. The basis transformation $V_K$ makes the subspace non-orthogonal with respect to the weight matrix, requiring a full quadratic form tensor to resolve.
32. **Q**: Why use $M_K$ at all? Just weight the data before PCA. **A**: Weighting before PCA alters the variance structure, causing the PCA to maximize variance of the weights rather than the physical variance of the polymers.
33. **Q**: I can just substitute classical TOPSIS and get the same ranking. **A**: False. Classical TOPSIS will skew towards $s_{chi}$ and $s_{HSP}$, completely drowning out $s_{GT}$, destroying predictive accuracy.
34. **Q**: $10^{-12}$ for positive definiteness is too small, you'll get numerical instability. **A**: It is a mathematically sufficient bound given the double-precision float limits and the prior orthonormalization of $V_K$.
35. **Q**: You claim this fixes collinearity, but PCA doesn't fix non-linear correlations. **A**: True, PCA only decorrelates linear covariance. However, polymer thermodynamic diagnostics in our local evaluation space exhibit primarily linear collinearity.
36. **Q**: Why isn't `metrics.py` dynamically determining $K$? **A**: Separation of concerns. `VariableKEngine` determines $K$; `metrics.py` simply executes the geometric mapping for a given $K$.
37. **Q**: You just copied this from a physics textbook. **A**: The mathematical form of a metric tensor is standard, but its application mapping AHP physical domain heuristics into a PCA reduced chemical descriptor space is a novel framework.
38. **Q**: Is the tensor invariant to scale changes in the original matrix? **A**: No. It assumes the input matrix has already been standardized ($Z$-scores), which is strictly enforced upstream.
39. **Q**: What if $V_K$ is not perfectly orthogonal due to precision errors? **A**: `np.linalg.svd` guarantees orthogonality to machine precision, and the symmetry/definiteness checks catch catastrophic degradations.
40. **Q**: You call it SP-PRP-TOPSIS. Why not just say PCA-TOPSIS? **A**: Because PCA-TOPSIS typically implies Euclidean distance on components. We use Physical-Reference-Point mapping via the tensor, making the distinction scientifically critical.

## 13. One-minute, five-minute, and board explanations
**1-Minute**: Because our 4 polymer criteria overlap, we project them into a "shadow" space (PCA) to make them independent. But we still need to apply our AHP physical weights. The metric tensor $M_K$ is the math tool that translates our physical weights into this new shadow space so we can measure distances correctly.
**5-Minute**: If you measure distance in standard Euclidean space, you double-count overlapping physics (like dispersive HSP and interaction chi). We fix this by projecting into a PCA subspace. However, simply using a ruler in this subspace ignores our AHP weights. We calculate a metric tensor $M_K = V_K^T W V_K$ to redefine how distance is measured, ensuring that a 40.8% weight on HSP mathematically survives the transition into the decorrelated space.
**Board**: Write $d^2 = \delta^T M_K \delta$. Show $M_K = V_K^T W V_K$. Emphasize that $W$ is a diagonal $4 \times 4$ matrix, $V_K$ is $4 \times K$, and $M_K$ is a dense $K \times K$ matrix. Show that if $W = I$, then $M_K = I$, meaning it reduces to normal Euclidean space only if weights are equal.

## 14. Things never to claim
- NEVER substitute Euclidean distance or classical TOPSIS for $M_K$.
- NEVER claim that $M_K$ is a diagonal matrix.
- NEVER claim we weight the data *before* PCA.

## 15. Cross-references to other modules
- See Module 02 for AHP weight derivation.
- See Module 01 for the overall VariableKEngine pipeline.
