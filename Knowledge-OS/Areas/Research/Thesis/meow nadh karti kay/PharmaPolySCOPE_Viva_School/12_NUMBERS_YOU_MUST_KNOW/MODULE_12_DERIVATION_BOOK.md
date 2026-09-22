# MODULE 12 — DERIVATION BOOK
# Formal Mathematical Derivations & Step-by-Step Numerical Proofs

**Document ID:** `MODULE_12_DERIVATION_BOOK`  
**Module:** Module 12 — Numbers You Must Know (`12_NUMBERS_YOU_MUST_KNOW/`)  
**Phase:** Phase 9 Execution & Forensic Repair (Module 11 → Module 12 Handoff)  
**Auditor:** Forensic Computational-Science Architect & PhD Methodology Auditor  
**Date:** September 23, 2026  
**Status:** **AUTHORITATIVE DERIVATION CANON (REPAIRED & SOURCE-LOCKED)**  

---

## 1. Overview & Verification Standards

This derivation book provides the complete mathematical, algebraic, and numerical derivations for key calculated metrics in the PharmaPolySCOPE v2 framework. 

Each entry is explicitly classified by derivation type:
- **Direct Algebraic Proof:** Rigorous matrix/algebraic proof holding under all conditions.
- **Direct Algebraic Derivation:** Direct closed-form algebraic evaluation of an output from inputs.
- **Numerical Verification & Threshold Check:** Verification of numerical algorithms against predefined stopping rules.
- **Numerical Consistency Check:** Numerical verification of conservation or normalization properties.
- **Independently Recomputed Value:** Step-by-step arithmetic recomputation verifying code outputs.

---

## 2. Derivation Catalog

### Derivation 1: Cumulative Explained Variance & Dynamic $K$ Selection (Indomethacin)
**Derivation Type:** Numerical Verification & Threshold Evaluation

#### Inputs
- Number of criteria: $p = 4$.
- Sample correlation matrix eigenvalues from `numpy.linalg.eigh(R)`:
  $$\lambda_1 = 2.0908657741533783$$
  $$\lambda_2 = 1.1678952418522826$$
  $$\lambda_3 = 0.7397747065453792$$
  $$\lambda_4 = 0.0014642774489659338$$
- Dynamic selection threshold: $	au_{	ext{var}} = 0.95$ ($95.0\%$).

#### Governing Equation
$$	ext{cum\_var}(K) = rac{\sum_{k=1}^K \lambda_k}{\sum_{j=1}^p \lambda_j} = rac{1}{p} \sum_{k=1}^K \lambda_k \quad (	ext{since } 	ext{Tr}(R) = p = 4)$$

#### Step-by-Step Substitution
1. **Total Eigenvalue Sum Check:**
   $$\sum_{j=1}^4 \lambda_j = 2.09086577 + 1.16789524 + 0.73977471 + 0.00146428 = 4.000000000000006 pprox 4.0$$
2. **Evaluation for $K=1$:**
   $$	ext{cum\_var}(1) = rac{2.09086577}{4.0} = 0.52271644 \quad (52.27\% < 95.0\% \implies 	ext{REJECT})$$
3. **Evaluation for $K=2$:**
   $$\sum_{k=1}^2 \lambda_k = 2.0908657741533783 + 1.1678952418522826 = 3.2587610160056609$$
   $$	ext{cum\_var}(2) = rac{3.2587610160056609}{4.0} = 0.8146902540014152 \quad (81.47\% < 95.0\% \implies 	ext{REJECT})$$
4. **Evaluation for $K=3$:**
   $$\sum_{k=1}^3 \lambda_k = 3.2587610160056609 + 0.7397747065453792 = 3.9985357225510401$$
   $$	ext{cum\_var}(3) = rac{3.9985357225510401}{4.0} = 0.99963393063776 \quad (99.9634\% \ge 95.0\% \implies 	ext{ACCEPT})$$

#### Result
The minimal integer $K$ satisfying $	ext{cum\_var}(K) \ge 0.95$ is strictly **$K = 3$**, capturing **$99.9634\%$** of cohort variance.

---

### Derivation 2: Boundary Eigengap & Stability Classification (Indomethacin)
**Derivation Type:** Independently Recomputed Value & Governance Gate Check

#### Inputs
- Retained subspace dimension: $K = 3$.
- Ambient criterion dimension: $p = 4$.
- Third eigenvalue: $\lambda_3 = 0.7397747065453792$.
- Fourth eigenvalue: $\lambda_4 = 0.0014642774489659338$.
- Governance thresholds: $\delta_{	ext{block}} = 0.03, \delta_{	ext{warn}} = 0.10$.

#### Governing Equation
$$\delta_K = egin{cases} \lambda_K - \lambda_{K+1} & 	ext{if } K < p \ +\infty & 	ext{if } K = p \end{cases}$$

#### Step-by-Step Substitution
$$\delta_3 = \lambda_3 - \lambda_4 = 0.7397747065453792 - 0.0014642774489659338 = 0.7383104290964133$$

#### Governance Evaluation
1. Is $\delta_3 < 0.03$? No ($0.7383 
ot< 0.03$).
2. Is $0.03 \le \delta_3 < 0.10$? No ($0.7383 
ot< 0.10$).
3. Is $\delta_3 \ge 0.10$? **Yes** ($0.73831043 \ge 0.10$).

#### Result
Boundary eigengap $\delta_3 = \mathbf{0.73831043}$ ($pprox 0.7383$). Subspace stability classification is certified strictly as **`STABLE`**.

---

### Derivation 3: AHP Consistency Index ($CI$) & Consistency Ratio ($CR$)
**Derivation Type:** Direct Algebraic Derivation

#### Inputs
- Matrix order: $n = 4$.
- Authoritative pairwise comparison matrix:
  $$A = egin{bmatrix} 1.0 & 2.0 & 3.0 & 2.0 \ 0.5 & 1.0 & 5.0 & 2.0 \ 1/3 & 0.2 & 1.0 & 0.5 \ 0.5 & 0.5 & 2.0 & 1.0 \end{bmatrix}$$
- Principal eigenvalue from power iteration: $\lambda_{\max} = 4.131937073898666$.
- Saaty Random Index for $n=4$: $RI_4 = 0.89$.
- Governance gate: $CR < 0.08$.

#### Governing Equations
$$CI = rac{\lambda_{\max} - n}{n - 1} = rac{\lambda_{\max} - 4}{3}$$
$$CR = rac{CI}{RI_4} = rac{CI}{0.89}$$

#### Step-by-Step Substitution
1. **Consistency Index ($CI$):**
   $$CI = rac{4.131937073898666 - 4.0}{3} = rac{0.131937073898666}{3} = 0.04397902463288853$$
2. **Consistency Ratio ($CR$):**
   $$CR = rac{0.04397902463288853}{0.89} = 0.04941463441897588$$

#### Governance Evaluation
$$CR = 0.049415 < 0.080000 \implies \mathbf{ACCEPTED}$$

#### Result
$CI = \mathbf{0.043979}$, $CR = \mathbf{0.049415}$. The preference matrix satisfies the strict 0.08 consistency threshold, verifying mathematical transitivity.

---

### Derivation 4: AHP Weight Normalization ($\sum w_i = 1$)
**Derivation Type:** Numerical Consistency Check

#### Inputs
- Unnormalized principal eigenvector $v$:
  $$v = [0.49079989, 0.39058145, 0.11095393, 0.21155986]^T$$

#### Governing Equation
$$w_i = rac{v_i}{\sum_{j=1}^4 v_j}$$

#### Step-by-Step Substitution
1. **Sum of Vector Elements:**
   $$\sum_{j=1}^4 v_j = 0.49079989 + 0.39058145 + 0.11095393 + 0.21155986 = 1.20389513$$
2. **Component Weights:**
   $$w(s_{	ext{HSP}}) = rac{0.49079989}{1.20389513} = 0.40767478396983764 \quad (40.77\%)$$
   $$w(s_\chi) = rac{0.39058145}{1.20389513} = 0.32443340865551623 \quad (32.44\%)$$
   $$w(s_{	ext{desc}}) = rac{0.11095393}{1.20389513} = 0.09216133794843878 \quad (9.22\%)$$
   $$w(s_{	ext{GT}}) = rac{0.21155986}{1.20389513} = 0.17573046942620724 \quad (17.57\%)$$
3. **Normalization Check:**
   $$\sum_{i=1}^4 w_i = 0.40767478 + 0.32443341 + 0.09216134 + 0.17573047 = 1.0000000000000000$$

#### Result
The weights form a valid probability vector on the 3-simplex $\Delta^3$. These weights represent decision-theoretic preference across the four screening criteria.

---

### Derivation 5: Relative Closeness Score ($C_L$) for Top Candidates
**Derivation Type:** Direct Algebraic Derivation & Recomputation

#### Inputs
- Positive ideal quadratic distance $D^+$ and anti-ideal distance $D^-$:
  - **Soluplus (`POL-005-2026`):** $D^+ = 4.18260400161078$, $D^- = 9.156273493466944$
  - **HPMC E5 (`POL-006-2026`):** $D^+ = 4.196083764580734$, $D^- = 8.641727853990561$

#### Governing Equation
$$C_L(i) = rac{D_i^-}{D_i^+ + D_i^-}$$

#### Step-by-Step Substitution
1. **Soluplus ($C_L$):**
   $$	ext{Denominator} = D^+ + D^- = 4.18260400161078 + 9.156273493466944 = 13.338877495077724$$
   $$C_L(	ext{Soluplus}) = rac{9.156273493466944}{13.338877495077724} = 0.6864350839750771$$
2. **HPMC E5 ($C_L$):**
   $$	ext{Denominator} = D^+ + D^- = 4.196083764580734 + 8.641727853990561 = 12.837811618571295$$
   $$C_L(	ext{HPMC E5}) = rac{8.641727853990561}{12.837811618571295} = 0.6731464918436223$$
3. **Closeness Score Separation:**
   $$\Delta C_L = C_L(	ext{Soluplus}) - C_L(	ext{HPMC E5}) = 0.68643508 - 0.67314649 = 0.01328859$$

#### Result
Soluplus achieves **Rank 1** with $C_L = \mathbf{0.68643508}$ ($pprox 0.6864$), narrowly leading HPMC E5 at $C_L = \mathbf{0.67314649}$ ($pprox 0.6731$) by $\Delta C_L = 0.0133$.

---

### Derivation 6: Replicate Conservation in Monte Carlo Uncertainty
**Derivation Type:** Discrete Integer Conservation Check

#### Inputs
- Total replicate budget: $N_{	ext{generated}} = 10,000$.
- Blocked replicates: $N_{	ext{blocked}} = 1,400$.
  - AHP consistency blocks ($CR \ge 0.08$): $1,396$.
  - Subspace stability blocks ($\delta_K < 0.03$): $4$.
  - Other block reasons: $0$.

#### Governing Equations
$$N_{	ext{generated}} = N_{	ext{valid}} + N_{	ext{blocked}}$$
$$N_{	ext{blocked}} = N_{	ext{AHP\_CR}} + N_{	ext{EIGENGAP}} + N_{	ext{OTHER}}$$
$$	ext{valid\_ratio} = rac{N_{	ext{valid}}}{N_{	ext{generated}}}$$

#### Step-by-Step Substitution
1. **Total Block Sum:**
   $$N_{	ext{blocked}} = 1396 + 4 + 0 = 1400$$
2. **Valid Replicate Calculation:**
   $$N_{	ext{valid}} = N_{	ext{generated}} - N_{	ext{blocked}} = 10000 - 1400 = 8600$$
3. **Valid Ratio:**
   $$	ext{valid\_ratio} = rac{8600}{10000} = 0.8600 \quad (86.00\%)$$
4. **Dominant Block Proportion:**
   $$rac{N_{	ext{AHP\_CR}}}{N_{	ext{blocked}}} = rac{1396}{1400} = 0.997143 \quad (99.71\%)$$

#### Result
The replicate distribution strictly conserves the sample population ($10,000 = 8,600 + 1,400$), proving that $99.71\%$ of blocked runs are filtered by AHP preference intransitivity.

---

### Derivation 7: Full-Space Metric Reduction Identity ($K = p = 4$)
**Derivation Type:** Direct Algebraic Proof

#### Proposition
When all $p$ principal components are retained ($K = p = 4$), the projected SP-PRP-TOPSIS quadratic distance collapses identically to the unrotated weighted Euclidean distance.

#### Proof
1. In $p=4$ dimensions, the complete eigenvector matrix $V_4 \in \mathbb{R}^{4 	imes 4}$ is an orthogonal matrix satisfying:
   $$V_4 V_4^T = V_4^T V_4 = I_4$$
2. The projected metric tensor is:
   $$M_4 = V_4^T W V_4, \quad 	ext{where } W = 	ext{diag}(w)$$
3. The projected coordinate difference is:
   $$\Delta t_i = t_i - t^+ = (z_i - z^+) V_4$$
4. The squared quadratic distance in the subspace is:
   $$(D_i^+)^2 = \Delta t_i^T M_4 \Delta t_i$$
5. Substituting $M_4$ and $\Delta t_i$:
   $$(D_i^+)^2 = \left( (z_i - z^+) V_4 ight) \left( V_4^T W V_4 ight) \left( V_4^T (z_i - z^+)^T ight)$$
   $$(D_i^+)^2 = (z_i - z^+) \left( V_4 V_4^T ight) W \left( V_4 V_4^T ight) (z_i - z^+)^T$$
6. Since $V_4 V_4^T = I_4$:
   $$(D_i^+)^2 = (z_i - z^+) I_4 W I_4 (z_i - z^+)^T = (z_i - z^+) W (z_i - z^+)^T$$
   $$(D_i^+)^2 = \sum_{j=1}^4 w_j (z_{ij} - z_j^+)^2$$

#### Result
This proves algebraically that at $K=p=4$, SP-PRP-TOPSIS distance is identically equal to the unrotated weighted Euclidean distance. In Phase 8 CF-04, numerical verification confirmed $|C_{L,	ext{CF04}} - C_{L,	ext{CF01}}| < 10^{-15}$, establishing this reduction identity.
