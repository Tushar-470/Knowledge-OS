# 04_HAND_CALCULATION_WHITEBOARD_DRILLS

---

## Cross-Reference
**Pedagogical Target:** PhD Whiteboard Preparation & Real-Time Manual Calculation Drills  
**Authoritative Curriculum Alignment:**
- `04_MATHEMATICS` (Formulas for Statistics, PCA, Eigengap)
- `05_DECISION_SCIENCE` (Formulas for AHP, Metric Tensor, Closeness)
- `10_REVERSE_ENGINEERING/01_REVERSE_ENGINEERING_METHODOLOGY.md` (Bidirectional flow)
- `10_REVERSE_ENGINEERING/02_INDOMETHACIN_FULL_NUMERICAL_TRACE.md` (Production numbers)

---

## 1. Structure of a Viva Whiteboard Drill

In a doctoral defense, an examiner may hand you a dry-erase marker and say:  
*"Step up to the board and calculate this transformation manually."*

To survive this hostile test, you must never hesitate or perform trial-and-error algebra. Every drill in this document follows the standard 6-part examination template:
1. **Examiner Question:** The exact verbal prompt posed by the examiner.
2. **Given Data:** The input numbers provided on the board.
3. **Student's Board Work Space:** The exact steps, equations, and intermediate numbers you must write on the board.
4. **Worked Solution:** Complete algebraic and arithmetic solution.
5. **Common Traps & Mistakes:** Pitfalls that cause candidates to fail the drill.
6. **Viva Defense Summary Sentence:** The punchy, authoritative concluding remark to deliver when capping the marker.

> **DATA NOTICE:**  
> To make hand calculation feasible during an oral exam without a scientific calculator, Levels 1–4, 7–8, and 11 utilize clean, pedagogical toy numbers. These are explicitly marked:  
> `[PEDAGOGICAL EXAMPLE — NOT PRODUCTION DATA]`  
> Levels 5, 6, 9, 10, and 12 utilize actual production parameters from PharmaPolySCOPE v2.

---

## LEVEL 1: Descriptive Statistics & Population Variance ($ddof=0$)

### 1. Examiner Question
*"Calculate the cohort mean and standard deviation for this criterion across these 4 candidate polymers. Explain why your denominator is 4 and not 3."*

### 2. Given Data `[PEDAGOGICAL EXAMPLE — NOT PRODUCTION DATA]`
A single criterion column across $n=4$ polymers:
$$x = [0.80, 0.60, 0.40, 0.20]$$

### 3. Student's Board Work Space
$$\mu = \frac{1}{n} \sum_{i=1}^n x_i$$
$$\sigma = \sqrt{\frac{1}{n} \sum_{i=1}^n (x_i - \mu)^2} \quad (ddof=0)$$

### 4. Worked Solution
1. **Compute Mean:**
   $$\mu = \frac{0.80 + 0.60 + 0.40 + 0.20}{4} = \frac{2.00}{4} = \mathbf{0.50}$$
2. **Compute Squared Deviations:**
   - $(0.80 - 0.50)^2 = (+0.30)^2 = 0.09$
   - $(0.60 - 0.50)^2 = (+0.10)^2 = 0.01$
   - $(0.40 - 0.50)^2 = (-0.10)^2 = 0.01$
   - $(0.20 - 0.50)^2 = (-0.30)^2 = 0.09$
3. **Compute Population Variance:**
   $$\sigma^2 = \frac{0.09 + 0.01 + 0.01 + 0.09}{4} = \frac{0.20}{4} = 0.05$$
4. **Compute Population Standard Deviation:**
   $$\sigma = \sqrt{0.05} \approx \mathbf{0.2236}$$

### 5. Common Traps & Mistakes
- **Trap:** Dividing by $n-1 = 3$ (sample standard deviation, Bessel's correction).
- **Correction:** In PharmaPolySCOPE, the candidate cohort of 5 approved polymers *is* the entire population under screening evaluation, not a sample drawn from an infinite polymer universe. Bessel's correction is statistically invalid here.

### 6. Viva Defense Summary Sentence
*"Because our screening library constitutes the finite, complete population of evaluated candidates, we strictly specify population variance with $ddof=0$ as implemented in `standardize_cohort()`."*

---

## LEVEL 2: Manual Standardization ($Z$-Score) & Physical Anchors

### 1. Examiner Question
*"Standardize candidate score $s_1 = 0.80$ using your mean $\mu = 0.50$ and $\sigma = 0.20$. Then show me the standardized coordinates for the physical ideal anchor."*

### 2. Given Data `[PEDAGOGICAL EXAMPLE — NOT PRODUCTION DATA]`
- $\mu = 0.50$, $\sigma = 0.20$
- Candidate raw score: $s_1 = 0.80$
- Physical ideal boundary: $s^+ = 1.00$

### 3. Student's Board Work Space
$$z_1 = \frac{s_1 - \mu}{\sigma}, \quad z^+ = \frac{1.0 - \mu}{\sigma}$$

### 4. Worked Solution
1. **Candidate Standardization:**
   $$z_1 = \frac{0.80 - 0.50}{0.20} = \frac{0.30}{0.20} = \mathbf{+1.50}$$
2. **Physical Ideal Anchor:**
   $$z^+ = \frac{1.00 - 0.50}{0.20} = \frac{0.50}{0.20} = \mathbf{+2.50}$$
3. **Physical Anti-Ideal Anchor (for completeness):**
   $$z^- = \frac{0.00 - 0.50}{0.20} = \frac{-0.50}{0.20} = \mathbf{-2.50}$$

### 5. Common Traps & Mistakes
- Setting the ideal anchor to the maximum observed candidate score ($\max(s)$) rather than the physical boundary ($1.00$). In SP-PRP-TOPSIS, reference points are fixed to physical absolute limits ($[0, 1]$), preventing candidate-rank reversal when new polymers enter the cohort.

### 6. Viva Defense Summary Sentence
*"We map the physical absolute anchors $s^+=1.0$ and $s^-=0.0$ into standardized space to ensure the evaluation framework is rebaselined without leaking external candidate data."*

---

## LEVEL 3: Constructing an Empirical Correlation Matrix $R$

### 1. Examiner Question
*"Given two standardized criteria vectors $z_1$ and $z_2$ across 4 polymers, compute their correlation coefficient $R_{12}$ on the board."*

### 2. Given Data `[PEDAGOGICAL EXAMPLE — NOT PRODUCTION DATA]`
- Polymer 1: $z_{1,1} = 1.5, z_{2,1} = 1.0$
- Polymer 2: $z_{1,2} = 0.5, z_{2,2} = 1.0$
- Polymer 3: $z_{1,3} = -0.5, z_{2,3} = -1.0$
- Polymer 4: $z_{1,4} = -1.5, z_{2,4} = -1.0$

### 3. Student's Board Work Space
$$R_{12} = \frac{1}{n} z_1^T z_2 = \frac{1}{n} \sum_{i=1}^n z_{1,i} z_{2,i}$$

### 4. Worked Solution
1. **Compute Element-Wise Products:**
   - $1.5 \times 1.0 = 1.5$
   - $0.5 \times 1.0 = 0.5$
   - $(-0.5) \times (-1.0) = 0.5$
   - $(-1.5) \times (-1.0) = 1.5$
2. **Sum of Products:**
   $$\sum_{i=1}^4 z_{1,i} z_{2,i} = 1.5 + 0.5 + 0.5 + 1.5 = 4.0$$
3. **Divide by Population Size $n=4$:**
   $$R_{12} = \frac{4.0}{4} = \mathbf{1.00}$$

### 5. Common Traps & Mistakes
- Forgetting that when vectors are already standardized ($\mu=0, \sigma=1$ with $ddof=0$), the Pearson correlation coefficient is simply the normalized dot product $\frac{1}{n} z_1^T z_2$.

### 6. Viva Defense Summary Sentence
*"Because criteria are already standardized using population moments, the correlation matrix is computed exactly as $R = \frac{1}{n} Z^T Z$, identically matching the spectral decomposition input in `asd_mcda/v2/pca.py`."*

---

## LEVEL 4: $2 \times 2$ Eigenvalue and Eigenvector Extraction

### 1. Examiner Question
*"Find the eigenvalues and eigenvectors for this $2 \times 2$ correlation matrix, and apply sign canonicalization."*

### 2. Given Data `[PEDAGOGICAL EXAMPLE — NOT PRODUCTION DATA]`
$$R = \begin{bmatrix} 1.0 & 0.8 \\ 0.8 & 1.0 \end{bmatrix}$$

### 3. Student's Board Work Space
$$\det(R - \lambda I) = (1 - \lambda)^2 - (0.8)^2 = 0$$

### 4. Worked Solution
1. **Characteristic Equation:**
   $$(1 - \lambda)^2 - 0.64 = 0 \Longrightarrow 1 - \lambda = \pm 0.8$$
   $$\lambda_1 = 1 + 0.8 = \mathbf{1.80}, \quad \lambda_2 = 1 - 0.8 = \mathbf{0.20}$$
   *(Check trace: $\lambda_1 + \lambda_2 = 1.80 + 0.20 = 2.0 = \text{Trace}(R)$).*
2. **Eigenvector for $\lambda_1 = 1.80$:**
   $$(R - 1.8 I) v_1 = \begin{bmatrix} -0.8 & 0.8 \\ 0.8 & -0.8 \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix} \Longrightarrow x = y$$
   Normalizing ($x^2 + y^2 = 1$):
   $$v_1 = \begin{bmatrix} 1/\sqrt{2} \\ 1/\sqrt{2} \end{bmatrix} \approx \begin{bmatrix} 0.7071 \\ 0.7071 \end{bmatrix}$$
3. **Eigenvector for $\lambda_2 = 0.20$:**
   $$(R - 0.2 I) v_2 = \begin{bmatrix} 0.8 & 0.8 \\ 0.8 & 0.8 \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix} \Longrightarrow x = -y$$
   $$v_2 = \begin{bmatrix} -1/\sqrt{2} \\ 1/\sqrt{2} \end{bmatrix} \approx \begin{bmatrix} -0.7071 \\ 0.7071 \end{bmatrix}$$
4. **Sign Canonicalization (`canonicalize_eigenvector_sign`):**
   - For $v_1$: components are positive $\rightarrow$ keep $v_1 = [0.7071, 0.7071]^T$.
   - For $v_2$: absolute values are tied ($|-0.7071| = |0.7071|$). Tie-breaking rule picks lowest index ($j=0$), which is $-0.7071 < 0 \rightarrow$ **flip sign**:
     $$v_2^{\text{canon}} = -v_2 = \begin{bmatrix} +0.7071 \\ -0.7071 \end{bmatrix}$$

### 5. Common Traps & Mistakes
- Neglecting eigenvector sign canonicalization. Arbitrary software packages output arbitrary signs depending on LAPACK routines, which would destroy bitwise numerical reproducibility if not canonicalized.

### 6. Viva Defense Summary Sentence
*"We resolve eigenvector sign indeterminacy using deterministic sign canonicalization with 0-indexed lowest-index tie breaking, guaranteeing that identical correlation matrices yield identical projection axes across all operating systems."*

---

## LEVEL 5: Dynamic $K$ Determination

### 1. Examiner Question
*"Here are the 4 eigenvalues for Indomethacin. Walk me through the dynamic $K$ selection rule and state the retained dimensionality."*

### 2. Given Data `[PRODUCTION DATA]`
$$\Lambda = (\lambda_1 = 2.090866, \lambda_2 = 1.167895, \lambda_3 = 0.739775, \lambda_4 = 0.001464)$$
$$\text{Threshold } \tau = 0.95, \quad p = 4$$

### 3. Student's Board Work Space
$$K = \min\left\{ k \in \{1, \dots, p\} : \frac{\sum_{j=1}^k \lambda_j}{p} \ge 0.95 \right\}$$

### 4. Worked Solution
1. **Sum of all eigenvalues:**
   $$\sum_{j=1}^4 \lambda_j = 2.090866 + 1.167895 + 0.739775 + 0.001464 = 4.000000 = p$$
2. **Test $k=1$:**
   $$\text{CumVar}(1) = \frac{2.090866}{4.0} = 0.522716 = 52.27\% < 95\% \quad (\text{FAIL})$$
3. **Test $k=2$:**
   $$\text{CumVar}(2) = \frac{2.090866 + 1.167895}{4.0} = \frac{3.258761}{4.0} = 0.814690 = 81.47\% < 95\% \quad (\text{FAIL})$$
4. **Test $k=3$:**
   $$\text{CumVar}(3) = \frac{3.258761 + 0.739775}{4.0} = \frac{3.998536}{4.0} = 0.999634 = \mathbf{99.9634\% \ge 95\%} \quad (\mathbf{PASS})$$
5. **Conclusion:**
   $$\mathbf{K = 3}$$

### 5. Common Traps & Mistakes
- **Examiner Trap:** *"Why didn't you stop at $K=2$ since $81.5\%$ is high enough for social science?"*
- **Correction:** Our engineering contract specifies $\tau = 0.95$ because chemical screening cannot afford to discard nearly $20\%$ of physical criteria variance. Stopping at $K=2$ for Indomethacin discards PC3, which accounts for $18.49\%$ of the variance.

### 6. Viva Defense Summary Sentence
*"The VariableKEngine dynamically selects $K=3$ for Indomethacin because $K=2$ captures only $81.47\%$, whereas $K=3$ achieves $99.9634\%$ cumulative explained variance, fully satisfying our $\ge 95\%$ governance standard."*

---

## LEVEL 6: Eigengap Subspace Stability Classification

### 1. Examiner Question
*"Calculate the eigengap $\delta_K$ for Indomethacin and apply the project's governance thresholds."*

### 2. Given Data `[PRODUCTION DATA]`
$$\lambda_3 = 0.73977471, \quad \lambda_4 = 0.00146428, \quad K=3$$
Governance thresholds:
- $\delta_K \ge 0.10 \Longrightarrow \text{STABLE}$
- $0.03 \le \delta_K < 0.10 \Longrightarrow \text{WARNING}$
- $\delta_K < 0.03 \Longrightarrow \text{BLOCKED}$ (`DegenerateSubspaceBlockedError`)

### 3. Student's Board Work Space
$$\delta_K = \lambda_K - \lambda_{K+1}$$

### 4. Worked Solution
1. **Calculate Spectral Difference:**
   $$\delta_3 = \lambda_3 - \lambda_4 = 0.73977471 - 0.00146428 = \mathbf{0.73831043}$$
2. **Apply Classification:**
   $$0.73831043 \ge 0.10 \Longrightarrow \mathbf{STABLE}$$

### 5. Common Traps & Mistakes
- **Examiner Trap:** *"What if $K=4$? What is $\delta_4$?"*
- **Correction:** When $K=p=4$, all principal components are retained. There is no discarded subspace ($K+1$ does not exist), so by definition $\delta_4 = +\infty$ and the status is unconditionally `STABLE`.

### 6. Viva Defense Summary Sentence
*"With an eigengap of $\delta_3 = 0.738310 \gg 0.10$, Indomethacin sits deep in the `STABLE` zone, guaranteeing via the Davis-Kahan theorem that the retained 3-dimensional evaluation subspace is robust against input noise."*

---

## LEVEL 7: AHP Principal Eigenvector & Consistency Ratio

### 1. Examiner Question
*"Show how the consistency ratio of a $4 \times 4$ AHP matrix is calculated, given $\lambda_{\max} = 4.131937$ and $RI_4 = 0.89$."*

### 2. Given Data `[PRODUCTION DATA]`
- Matrix size: $n = 4$
- Principal eigenvalue: $\lambda_{\max} = 4.13193707$
- Random Index: $RI_4 = 0.89$ (hardcoded in `ahp.py`)
- Acceptance threshold: $CR < 0.08$

### 3. Student's Board Work Space
$$CI = \frac{\lambda_{\max} - n}{n - 1}, \quad CR = \frac{CI}{RI_4}$$

### 4. Worked Solution
1. **Consistency Index ($CI$):**
   $$CI = \frac{4.13193707 - 4}{4 - 1} = \frac{0.13193707}{3} = \mathbf{0.04397902}$$
2. **Consistency Ratio ($CR$):**
   $$CR = \frac{0.04397902}{0.89} = \mathbf{0.04941463}$$
3. **Governance Evaluation:**
   $$CR = 0.049415 < 0.08 \Longrightarrow \mathbf{ACCEPTED}$$

### 5. Common Traps & Mistakes
- **Trap:** Using $RI_4 = 0.90$ from literature textbooks.
- **Correction:** Production `src/asd_mcda/v2/ahp.py` explicitly hardcodes $RI_4 = 0.89$. Using $0.90$ produces $CR = 0.048866$, which fails numerical audit against the production validation artifact.
- **Trap:** Claiming that $CR < 0.08$ proves the weights are "scientifically true".
- **Correction:** $CR$ measures only the internal transitivity and consistency of expert preferences, not empirical biological validity.

### 6. Viva Defense Summary Sentence
*"The AHP matrix achieves $CR = 0.049415$, satisfying our strict $CR < 0.08$ consistency gate, which guarantees transitivity of pairwise judgements without asserting empirical infallibility."*

---

## LEVEL 8: Metric Tensor Construction ($M_K = V_K^T W V_K$)

### 1. Examiner Question
*"Calculate the $(0,0)$ entry of the metric tensor $M_K$ given basis vector $v_1$ and diagonal weights $W$."*

### 2. Given Data `[PEDAGOGICAL EXAMPLE — NOT PRODUCTION DATA]`
- $v_1 = [0.60, 0.60, 0.40, 0.30]^T$
- $W = \text{diag}(0.40, 0.30, 0.10, 0.20)$

### 3. Student's Board Work Space
$$M_{K, (0,0)} = v_1^T W v_1 = \sum_{j=1}^4 w_j v_{1,j}^2$$

### 4. Worked Solution
1. **Compute weighted squared components:**
   - $w_1 v_{1,1}^2 = 0.40 \times (0.60)^2 = 0.40 \times 0.36 = 0.1440$
   - $w_2 v_{1,2}^2 = 0.30 \times (0.60)^2 = 0.30 \times 0.36 = 0.1080$
   - $w_3 v_{1,3}^2 = 0.10 \times (0.40)^2 = 0.10 \times 0.16 = 0.0160$
   - $w_4 v_{1,4}^2 = 0.20 \times (0.30)^2 = 0.20 \times 0.09 = 0.0180$
2. **Sum to obtain $M_{K, (0,0)}$:**
   $$M_{K, (0,0)} = 0.1440 + 0.1080 + 0.0160 + 0.0180 = \mathbf{0.2860}$$

### 5. Common Traps & Mistakes
- Assuming $M_K$ is diagonal. Because the eigenvectors $V_K$ are orthogonal with respect to the identity matrix $I$, they are **not** orthogonal with respect to the weight matrix $W$. Therefore, $M_K$ has non-zero off-diagonal covariance entries.

### 6. Viva Defense Summary Sentence
*"The metric tensor $M_K = V_K^T W V_K$ pulls the physical criterion weights into the PCA subspace, creating a generalized quadratic form that respects both empirical correlation geometry and expert preference."*

---

## LEVEL 9: Quadratic Form Distance Calculation

### 1. Examiner Question
*"Given difference vector $\Delta t = [2.0, -1.0]$ in a 2D subspace and metric tensor $M_K = \begin{bmatrix} 0.30 & 0.05 \\ 0.05 & 0.10 \end{bmatrix}$, calculate the distance $D$."*

### 2. Given Data `[PEDAGOGICAL EXAMPLE — NOT PRODUCTION DATA]`
$$\Delta t = \begin{bmatrix} 2.0 \\ -1.0 \end{bmatrix}, \quad M_K = \begin{bmatrix} 0.30 & 0.05 \\ 0.05 & 0.10 \end{bmatrix}$$

### 3. Student's Board Work Space
$$D = \sqrt{\Delta t^T M_K \Delta t}$$

### 4. Worked Solution
1. **Matrix-Vector Product $M_K \Delta t$:**
   $$\begin{bmatrix} 0.30 & 0.05 \\ 0.05 & 0.10 \end{bmatrix} \begin{bmatrix} 2.0 \\ -1.0 \end{bmatrix} = \begin{bmatrix} (0.30)(2.0) + (0.05)(-1.0) \\ (0.05)(2.0) + (0.10)(-1.0) \end{bmatrix} = \begin{bmatrix} 0.60 - 0.05 \\ 0.10 - 0.10 \end{bmatrix} = \begin{bmatrix} 0.55 \\ 0.00 \end{bmatrix}$$
2. **Inner Product $\Delta t^T (M_K \Delta t)$:**
   $$\Delta t^T \begin{bmatrix} 0.55 \\ 0.00 \end{bmatrix} = (2.0)(0.55) + (-1.0)(0.00) = \mathbf{1.10}$$
3. **Square Root:**
   $$D = \sqrt{1.10} \approx \mathbf{1.0488}$$

### 5. Common Traps & Mistakes
- Forgetting the off-diagonal terms $2 \Delta t_1 \Delta t_2 M_{12}$.
- Taking the square root before finishing the matrix multiplication.

### 6. Viva Defense Summary Sentence
*"The quadratic form evaluates distance along the elliptical contours defined by $M_K$, properly penalizing deviations in directions where expert criteria weights are concentrated."*

---

## LEVEL 10: Manual Relative Closeness $C_L$ & Ranking

### 1. Examiner Question
*"A candidate polymer has $D^+ = 4.1826$ to the ideal reference and $D^- = 9.1563$ to the anti-ideal reference. Calculate its closeness $C_L$ and explain the physical interpretation."*

### 2. Given Data `[PRODUCTION DATA — SOLUPLUS FOR INDOMETHACIN]`
- $D^+ = 4.182604$
- $D^- = 9.156273$

### 3. Student's Board Work Space
$$C_L = \frac{D^-}{D^+ + D^-}$$

### 4. Worked Solution
1. **Compute Denominator:**
   $$D^+ + D^- = 4.182604 + 9.156273 = 13.338877$$
2. **Compute Ratio:**
   $$C_L = \frac{9.156273}{13.338877} = \mathbf{0.686435}$$

### 5. Common Traps & Mistakes
- **Inverting the Ratio:** Writing $C_L = \frac{D^+}{D^+ + D^-}$.
- **Interpretation Error:** Saying $C_L = 0.6864$ means "Soluplus has a $68.6\%$ chance of successful formulation."
- **Correction:** $C_L$ is a relative geometric closeness coefficient bounded in $[0, 1]$. Higher values mean the candidate is closer to the physical ideal and farther from the physical anti-ideal in the standardized, preference-weighted PCA subspace.

### 6. Viva Defense Summary Sentence
*"Soluplus achieves $C_L = 0.686435$, making it the top-ranked computational candidate by virtue of maximizing relative geometric proximity to the ideal reference point."*

---

## LEVEL 11: Reverse-Engineering Challenge (Subspace Coordinate Recovery)

### 1. Examiner Question
*"I give you candidate coordinates $t_0 = [1.7385, -1.2179, -0.6586]$ in the 3D PCA subspace. Can you recover the original standardized vector $z_0$ across all 4 criteria?"*

### 2. Given Data `[PRODUCTION DATA]`
- $t_0 = [1.738516, -1.217864, -0.658644]$
- $V_K$ ($4 \times 3$ retained eigenvector matrix)

### 3. Student's Board Work Space
$$\hat{z}_0 = t_0 V_K^T = \sum_{k=1}^3 t_{0,k} v_k^T$$
$$z_0 = \hat{z}_0 + \epsilon v_4$$

### 4. Worked Solution
1. **Back-project into $\mathbb{R}^4$:**
   $$\hat{z}_0 = 1.738516 \cdot v_1 + (-1.217864) \cdot v_2 + (-0.658644) \cdot v_3$$
   Multiplying through gives:
   $$\hat{z}_0 = [1.444697, 1.368364, -0.151778, -0.976527]$$
2. **Evaluate Inversion Exactness:**
   - The true standardized vector is $z_0 = [1.464848, 1.347948, -0.153270, -0.976845]$.
   - The difference is $z_0 - \hat{z}_0 = [0.020151, -0.020405, -0.001491, -0.000318]$.
   - This difference is strictly along the discarded 4th eigenvector $v_4$:
     $$\|z_0 - \hat{z}_0\| = 0.028714 = \sqrt{\lambda_4 \text{ loading}}$$
3. **Conclusion:**
   We can recover $\hat{z}_0$ with $99.9634\%$ variance fidelity, but the exact $z_0$ cannot be reconstructed without knowing the discarded 4th coordinate ($t_{0,4}$).

### 5. Common Traps & Mistakes
- Claiming that $V_K^T$ is the true matrix inverse of $V_K$. Since $V_K$ is $4 \times 3$, $V_K^T V_K = I_3$, but $V_K V_K^T \ne I_4$. It is an orthogonal projection operator onto the 3D subspace, not the identity matrix.

### 6. Viva Defense Summary Sentence
*"Because dimensionality reduction from $p=4$ to $K=3$ discards the orthogonal null space $v_4$, back-projection recovers the optimal least-squares reconstruction $\hat{z}_0$ capturing $99.9634\%$ of the variance, with the exact residual bounded by the discarded eigenvalue $\lambda_4 = 0.001464$."*

---

## LEVEL 12: Hostile Examiner Grand Challenge

### 1. Examiner Question
*"Here is the standardized vector for a polymer: $z = [1.465, 1.348, -0.153, -0.977]$. In two minutes, outline the complete chain of calculations that converts this vector into a final closeness score $C_L$ under your v2 architecture."*

### 2. Given Data `[PRODUCTION DATA — SOLUPLUS]`
- Candidate vector $z \in \mathbb{R}^4$
- Pipeline parameters: $V_K \in \mathbb{R}^{4 \times 3}$, $w_{\text{phys}} \in \mathbb{R}^4$, $z^+, z^- \in \mathbb{R}^4$

### 3. Student's Board Work Space
```
Step 1: Subspace Projection ──────> t = z @ V_K  (1x3 vector)
Step 2: Anchor Projections ───────> t+ = z+ @ V_K,  t- = z- @ V_K
Step 3: Subspace Metric Tensor ───> M_K = V_K^T @ diag(w_phys) @ V_K  (3x3)
Step 4: Quadratic Differences ────> Delta t+ = t - t+,  Delta t- = t - t-
Step 5: Quadratic Distances ──────> D+ = sqrt(Delta t+^T @ M_K @ Delta t+)
                                    D- = sqrt(Delta t-^T @ M_K @ Delta t-)
Step 6: Closeness Ratio ──────────> C_L = D- / (D+ + D-)
```

### 4. Worked Solution
1. **Subspace Coordinates:** Multiply $z$ ($1 \times 4$) by $V_K$ ($4 \times 3$) to project into orthogonal principal axes:
   $$t = [1.7385, -1.2179, -0.6586]$$
2. **Anchor Projection:** Project the standardized physical ideal ($z^+ = [5.186, 2.676, 11.173, 1.249]$) and anti-ideal ($z^- = [-13.160, -4.961, -5.631, -0.977]$) through the same basis:
   $$t^+ = [2.6326, -8.0313, 9.3137], \quad t^- = [-10.8404, 7.1706, -5.4822]$$
3. **Metric Tensor:** Apply $M_K = V_K^T W V_K$ to weight the subspace differences by the physical AHP priorities.
4. **Distance Evaluation:** Compute quadratic form square roots:
   $$D^+ = 4.1826, \quad D^- = 9.1563$$
5. **Closeness Synthesis:**
   $$C_L = \frac{9.1563}{4.1826 + 9.1563} = \mathbf{0.6864}$$

### 5. Common Traps & Mistakes
- Attempting to calculate Euclidean distances directly on $z$ in 4D space without projecting onto $V_K$. That would be classical TOPSIS, which ignores criteria collinearity.
- Applying AHP weights directly to the PCA coordinates ($t_k$) instead of using the metric tensor $M_K$. AHP weights belong to physical criteria, not principal components.

### 6. Viva Defense Summary Sentence
*"By projecting into the orthogonal PCA subspace $V_K$ and evaluating distances via the metric tensor $M_K = V_K^T W V_K$, SP-PRP-TOPSIS simultaneously eliminates criteria collinearity and respects expert pharmaceutical weighting, yielding a robust closeness of $C_L = 0.686435$."*

---

*End of Document 04 — Hand Calculation Whiteboard Drills*
