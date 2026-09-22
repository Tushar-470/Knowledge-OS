# 03_LINEAR_ALGEBRA
---
## Cross-Reference
**Prerequisite knowledge:** Arithmetic, basic vectors (01, 02)
**Used later by:** 04_PCA_FROM_FIRST_PRINCIPLES.md, 05_DYNAMIC_K_SELECTION.md
**Related source code:** `src/asd_mcda/v2/pca.py`, `src/asd_mcda/v2/ahp.py`
**Related tests:** `tests/v2/`
**Related validation artifact:** `scientific_validation_results.json`
**Related viva attack:** Part 9

---
## Part 1: Beginner Understanding [BEGINNER]
Think of a vector as an arrow pointing somewhere in space. A matrix is a machine that can stretch, squish, or rotate that arrow. Linear algebra is the study of these arrows (vectors) and machines (matrices). 

In our project, the 5 polymers have scores on 4 criteria. That means every polymer is an arrow in a 4-dimensional space. PCA (which we learn next) tries to find a new set of coordinate axes (new arrows) that best describe where the polymer arrows are pointing. To do this, we need to understand dot products (how arrows project onto one another) and eigenvectors (special arrows that a matrix machine only stretches, but doesn't rotate).

---
## Part 2: Technical Development [TECHNICAL]
### 1. Scalars, Vectors, Matrices
- **Scalar:** A single number (e.g., 3.14).
- **Vector:** An ordered list of scalars. Column vector: $[a; b; c]$. Row vector: $[a, b, c]$. Geometric interpretation: arrow from origin to $(a,b,c)$.
- **Matrix:** Rectangular array of scalars. $A = [a_{ij}]$.

### 2. Transpose and Dot Product
- **Transpose:** $A^T$ swaps rows and columns. $(A^T)_{ij} = A_{ji}$.
- **Dot product (Inner Product):** $u \cdot v = \sum u_i v_i$.
  Geometrically: $|u||v|\cos(\theta)$. If $u \cdot v = 0$, $u$ and $v$ are orthogonal (perpendicular).

### 3. Matrix Multiplication
$(AB)_{ij} = \sum_k A_{ik} B_{kj}$. Requires $A$ to be $(m \times k)$ and $B$ to be $(k \times n)$.

### 4. Special Matrices
- **Symmetric matrix:** $A = A^T$. Our empirical correlation matrix $R$ is always symmetric.
- **Diagonal matrix:** Only diagonal entries non-zero.
- **Identity matrix ($I$):** Diagonal ones, zeros elsewhere. $AI = IA = A$.

### 5. Quadratic Form
$x^T A x$. $A$ is $(n \times n)$, $x$ is $(n \times 1) \rightarrow$ scalar result. Represents a weighted sum of squared and cross-products.

### 6. Eigenvalues and Eigenvectors
$A v = \lambda v$.
$v$ = eigenvector (non-zero vector that $A$ only scales, not rotates).
$\lambda$ = eigenvalue (the scaling factor).

### 7. Spectral Theorem
For a real symmetric matrix (like $R$), all eigenvalues are real and eigenvectors are orthogonal.

### 8. Basis and Projection
- **Basis:** A set of linearly independent vectors that spans the space.
- **Projection:** $\text{proj} = (a \cdot u) u$ (if $u$ is a unit vector).
In PCA, $t_i = V_K^T z_i$ projects polymer $i$ from 4D criterion space into K-dim PCA subspace.

---
## Part 3: Worked Example [EXAMPLE]

### [HYPOTHETICAL — NOT PRODUCTION VALUES]
**Matrix Multiplication:**
$A = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}, B = \begin{bmatrix} 5 & 6 \\ 7 & 8 \end{bmatrix}$
$(AB)_{11} = 1\times5 + 2\times7 = 19$
$(AB)_{12} = 1\times6 + 2\times8 = 22$
$(AB)_{21} = 3\times5 + 4\times7 = 43$
$(AB)_{22} = 3\times6 + 4\times8 = 50$
$AB = \begin{bmatrix} 19 & 22 \\ 43 & 50 \end{bmatrix}$

**Quadratic Form:**
$x=[1,2]^T, A=\begin{bmatrix} 2 & 0 \\ 0 & 3 \end{bmatrix}$
$x^T A x = [1,2] \begin{bmatrix} 2 & 0 \\ 0 & 3 \end{bmatrix} \begin{bmatrix} 1 \\ 2 \end{bmatrix} = [1,2] \begin{bmatrix} 2 \\ 6 \end{bmatrix} = 1(2) + 2(6) = 14$

**Eigenvalues/Vectors:**
$A = \begin{bmatrix} 3 & 1 \\ 1 & 3 \end{bmatrix}$
$\det(A - \lambda I) = 0 \rightarrow (3-\lambda)^2 - 1 = 0 \rightarrow 3-\lambda = \pm 1$
$\lambda_1 = 4, \lambda_2 = 2$.
For $\lambda_1=4: \begin{bmatrix} -1 & 1 \\ 1 & -1 \end{bmatrix} v = 0 \rightarrow v_1 = [1,1]^T / \sqrt{2}$.
For $\lambda_2=2: \begin{bmatrix} 1 & 1 \\ 1 & 1 \end{bmatrix} v = 0 \rightarrow v_2 = [1,-1]^T / \sqrt{2}$.
$v_1 \cdot v_2 = (1(1) + 1(-1))/2 = 0 \rightarrow$ Orthogonal.

### [PRODUCTION VALUES]
Connect to PharmaPolySCOPE:
$M_K = V_K^T W V_K$ is a quadratic-form-based metric tensor.
$D_+ = \sqrt{(t - t_+)^T M_K (t - t_+)}$ = weighted Mahalanobis-like distance.

---
## Part 4: v1.5 vs v2 Comparison [VERSIONING]
v1.5 used generic distance metrics. v2 uses strict quadratic form constructions ($M_K$) for geometrically rigorous distance calculations within the PCA subspace.

---
## Part 5: PharmaPolySCOPE Implementation [IMPLEMENTATION]
### Implementation Trace
- **Concept:** Eigen decomposition of a matrix.
- **Input:** $R$ (empirical correlation matrix) OR $A$ (AHP pairwise matrix).
- **Function:** `scipy.linalg.eigh(R)` (symmetric) or `np.linalg.eig(A)` (non-symmetric).
- **File:** `pca.py` and `ahp.py`
- **Computation:** Computes roots of characteristic polynomial.
- **Output:** `eigvals`, `eigvecs`.
- **Next stage:** Sorting and truncation for PCA; dominant vector extraction for AHP.

---
## Part 6: Assumptions and Limitations [LIMITATIONS]
- **Assumption:** Spectral theorem strictly applies to real symmetric matrices.
- **Limitation:** Floating-point precision (e.g., $1e-12$ tolerance needed for zero comparisons).

---
## Part 7: Viva Questions [VIVA]
### A. 10 Basic Q&A
1. **What is a scalar?** A single number.
2. **What is a dot product?** The sum of the products of corresponding entries of two sequences of numbers.
3. **What does orthogonality mean?** Vectors are perpendicular (dot product is zero).
4. **What is an identity matrix?** A matrix with 1s on the diagonal, 0s elsewhere.
5. **What is a transpose?** Flipping a matrix over its diagonal.
6. **What is an eigenvector?** A vector whose direction doesn't change when a linear transformation is applied.
7. **What is an eigenvalue?** The scaling factor of an eigenvector.
8. **What does it mean for a matrix to be symmetric?** $A = A^T$.
9. **What is projection?** Dropping a perpendicular from a point to a line/plane.
10. **What is a quadratic form?** An expression of the form $x^T A x$.

### B. 10 Intermediate Q&A
11. **Why is the correlation matrix symmetric?** Because $\text{cov}(X,Y) = \text{cov}(Y,X)$.
12. **Why do we use `eigh` instead of `eig` for PCA?** `eigh` is optimized for symmetric matrices and guarantees real outputs.
13. **Why do we use `eig` for AHP?** The AHP matrix is reciprocal, not symmetric.
14. **What does the Spectral Theorem guarantee?** Real eigenvalues and orthogonal eigenvectors for real symmetric matrices.
15. **What is a metric tensor?** A matrix used to define distances and angles in a space.
16. **How do you normalize a vector?** Divide it by its magnitude.
17. **What is the trace of a matrix?** The sum of its diagonal elements.
18. **How does the trace relate to eigenvalues?** Trace equals the sum of eigenvalues.
19. **What is the determinant's role in finding eigenvalues?** We solve $\det(A - \lambda I) = 0$.
20. **What is a basis?** A set of linearly independent vectors that span a space.

### C. 10 Difficult Q&A
21. **Prove that eigenvectors of a symmetric matrix corresponding to distinct eigenvalues are orthogonal.** Let $Ax = \lambda x$ and $Ay = \mu y$. $\lambda x^T y = (Ax)^T y = x^T A^T y = x^T A y = x^T (\mu y) = \mu x^T y$. If $\lambda \ne \mu$, $x^T y = 0$.
22. **What is a positive semi-definite matrix?** A matrix where $x^T A x \ge 0$ for all $x$. The correlation matrix is one.
23. **What happens geometrically when an eigenvalue is 0?** The matrix squishes space into a lower dimension.
24. **How does AHP reciprocity ($a_{ij} = 1/a_{ji}$) affect eigenvalues?** It leads to a dominant real eigenvalue $\ge n$, with others being 0 or complex conjugates.
25. **Why does $M_K = V_K^T W V_K$ define a valid metric?** If $W$ has positive weights, $M_K$ is symmetric positive definite.
26. **Explain the Mahalanobis distance.** It measures distance relative to the covariance structure, transforming ellipsoidal contours to spherical.
27. **What is the condition number of a matrix?** The ratio of the largest to smallest singular value.
28. **How do orthogonal matrices behave with inversion?** $V^{-1} = V^T$.
29. **What is singular value decomposition (SVD)?** A generalization of eigendecomposition for non-square matrices.
30. **Why don't we use SVD directly on $Z$ instead of `eigh` on $Z^T Z$?** SVD is theoretically equivalent ($V$ from SVD is identical), but `eigh` on the $4\times4$ covariance matrix is incredibly fast and explicitly exposes the eigenvalues as variance.

### D. 10 Hostile Q&A
31. **Why trust floating point for exact orthogonality?** We don't. We use $1e-12$ tolerances.
32. **Can quadratic forms be negative?** Not if the matrix is positive semi-definite, which $W$ and $R$ mathematically are.
33. **You claim your distance is Mahalanobis-like, but you don't use the inverse covariance matrix. Why?** Standard PCA implicitly decorrelates, so the subspace covariance is diagonal. $W$ applies domain weighting on top of that, unlike pure statistical Mahalanobis.
34. **If your AHP matrix isn't symmetric, aren't its eigenvalues complex?** Yes, but the dominant one guaranteed by Perron-Frobenius theorem is purely real.
35. **Did you prove linear independence of your criteria?** No, that's literally what PCA is for: handling linear dependence.
36. **What if the AHP eigenvector has negative components?** Perron-Frobenius guarantees the principal eigenvector for a positive matrix has strictly positive components.
37. **Why use a metric tensor at all instead of simple Euclidean distance?** Euclidean distance ignores the domain-assigned importance weights ($W$) derived from AHP.
38. **Is $V_K V_K^T$ the identity matrix?** No, $V_K^T V_K = I$ (size $K\times K$), but $V_K V_K^T$ is a projection matrix (size $p\times p$).
39. **Could your eigenvectors randomly flip signs between runs?** Yes, which is why we enforce sign canonicalization.
40. **How do you handle defective matrices?** Real symmetric matrices and strictly positive reciprocal matrices are never defective.

### E. Common Mistakes
- Confusing $V V^T$ with $V^T V$ for truncated matrices.
- Trying to use `eigh` on non-symmetric matrices.
### F. Things You Must Never Claim
- Never claim the AHP matrix is symmetric.
- Never claim that projection preserves distance (it reduces it).
