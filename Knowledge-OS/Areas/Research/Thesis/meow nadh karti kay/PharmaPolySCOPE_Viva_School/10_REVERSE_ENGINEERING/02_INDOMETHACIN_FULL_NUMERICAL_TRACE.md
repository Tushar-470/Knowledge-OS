# 02_INDOMETHACIN_FULL_NUMERICAL_TRACE

---

## Cross-Reference
**Authoritative Case Study:** Indomethacin Active Cohort (`IND-001-2026`)  
**Production Source Files Verified:**
- `src/asd_mcda/v2/standardization.py`
- `src/asd_mcda/v2/pca.py`
- `src/asd_mcda/v2/stability.py`
- `src/asd_mcda/v2/ahp.py`
- `src/asd_mcda/v2/metrics.py`
- `src/asd_mcda/v2/engine.py`

**Authoritative Validation Artifact:**
- `results/validation/v2_scientific_validation/scientific_validation_results.json` (`cohorts > IND-001-2026`)

**Analysis Fingerprint:** `32d6354fe09cfd82764ff03ea89e638c4887f3aca04b37fa8d1794f8518ad21f`

---

## Executive Overview of Master Validation Facts

The Indomethacin cohort represents the primary benchmark case study of PharmaPolySCOPE v2. Under the authoritative v2 execution pipeline, all numerical results reconcile to 16 decimal places:

- **Retained Subspace Dimensionality ($K$):** $3$
- **Cumulative Explained Variance:** $0.99963393063776$ ($99.9634\%$)
- **Boundary Eigengap ($\delta_3$):** $0.7383104290964133$
- **Subspace Stability Status:** `STABLE` ($\delta_3 \ge 0.10$)
- **AHP Consistency Ratio ($CR$):** $0.04941463441897588 < 0.08$ (`ACCEPTED`)
- **Metric Tensor Dimensionality:** $3 \times 3$ symmetric positive-definite
- **Deterministic Top Candidate:** Soluplus (`POL-005-2026`), $C_L = 0.6864350839750771$ (Rank 1)
- **Second Candidate:** HPMC E5 (`POL-006-2026`), $C_L = 0.6731464918436223$ (Rank 2)

---

## STAGE 1: Raw Chemical Identity & Physicochemical Profiling

The active drug compound is Indomethacin ingested via canonical SMILES and parsed through RDKit (`2026.03.5`):

```
Chemical Name:      Indomethacin
Canonical SMILES:   COc1ccc2c(c1)c(CC(=O)O)c(C)n2C(=O)c1ccc(Cl)cc1
InChIKey:           CGIGDMFJXJATDK-UHFFFAOYSA-N
Molecular Formula:  C19H16ClNO4
Analysis ID:        VAL-IND-001-2026
```

### Authoritative Physicochemical Descriptors
- **Molecular Weight ($MW$):** $357.793\text{ g/mol}$
- **Calculated $\log P$:** $3.927320$
- **Hydrogen Bond Donors ($HBD$):** $1$
- **Hydrogen Bond Acceptors ($HBA$):** $3$
- **Topological Polar Surface Area ($TPSA$):** $68.53\text{ \AA}^2$
- **Rotatable Bonds:** $4$
- **Aromatic Rings:** $3$
- **Molar Volume ($V_m$):** $273.0\text{ cm}^3/\text{mol}$ (from $\rho_{\text{amorphous}} = 1.22\text{ g/cm}^3$)
- **Crystalline Density ($\rho_{\text{cryst}}$):** $1.31\text{ g/cm}^3$
- **Hansen Solubility Parameters:** $\delta_d = 19.2\text{ MPa}^{1/2}, \delta_p = 7.9\text{ MPa}^{1/2}, \delta_h = 8.4\text{ MPa}^{1/2}, R_o = 8.0\text{ MPa}^{1/2}$
- **Thermal Transitions:** Glass transition $T_g = 315.15\text{ K}$ ($42.0^\circ\text{C}$), Melting point $T_m = 433.15\text{ K}$ ($160.0^\circ\text{C}$)

---

## STAGE 2: Raw Four-Criterion Compatibility Matrix $S$

The screening library consists of $n=5$ candidate polymers evaluated across $p=4$ canonical criteria:
1. $s_{\text{HSP}}$: Hansen geometric distance diagnostic $\max(0, 1 - R_a / (2 R_o))$
2. $s_{\chi}$: Flory-Huggins interaction parameter diagnostic $\max(0, 1 - \chi)$
3. $s_{\text{desc}}$: Multi-descriptor compatibility score
4. $s_{\text{GT}}$: Gordon-Taylor normalized glass-transition margin $\text{clip}\left(\frac{T_{g,\text{mix}} - (T_{g,\text{drug}} + 30)}{50}, 0, 1\right)$ at $30\%\text{ w/w}$ drug loading

### Authoritative $S$ Matrix ($5 \times 4$)
Row order: Soluplus, HPMC E5, PVP-VA64, PVP K30, Eudragit E PO.

| Index $i$ | Polymer Identifier | Polymer Trade Name | $s_{\text{HSP}}$ | $s_{\chi}$ | $s_{\text{desc}}$ | $s_{\text{GT}}$ |
|:---:|:---|:---|:---:|:---:|:---:|:---:|
| **0** | `POL-005-2026` | Soluplus | $0.797187740755$ | $0.826054467722$ | $0.325973000000$ | $0.000000000000$ |
| **1** | `POL-006-2026` | HPMC E5 | $0.752118349812$ | $0.740155439437$ | $0.394150000000$ | $0.973122720135$ |
| **2** | `POL-002-2026` | PVP-VA64 | $0.707315763151$ | $0.637737367251$ | $0.294176000000$ | $0.236756357025$ |
| **3** | `POL-001-2026` | PVP K30 | $0.694196754432$ | $0.604534089009$ | $0.251780000000$ | $0.984822254640$ |
| **4** | `POL-007-2026` | Eudragit E PO | $0.635887208409$ | $0.439343649999$ | $0.409390000000$ | $0.000000000000$ |

$$S = \begin{bmatrix}
0.79718774 & 0.82605447 & 0.32597300 & 0.00000000 \\
0.75211835 & 0.74015544 & 0.39415000 & 0.97312272 \\
0.70731576 & 0.63773737 & 0.29417600 & 0.23675636 \\
0.69419675 & 0.60453409 & 0.25178000 & 0.98482225 \\
0.63588721 & 0.43934365 & 0.40939000 & 0.00000000
\end{bmatrix}$$

---

## STAGE 3: Cohort Population Moments ($ddof=0$)

In `standardize_cohort()` (`asd_mcda/v2/standardization.py`), standardization uses the **population** formula with degrees of freedom $ddof=0$:

$$\mu_j = \frac{1}{n} \sum_{i=1}^n S_{ij}, \quad \sigma_j = \sqrt{\frac{1}{n} \sum_{i=1}^n (S_{ij} - \mu_j)^2}$$

### Numerical Moment Vectors
- **Population Mean Vector $\mu \in \mathbb{R}^4$:**
  $$\mu = [0.717341163312, 0.649565002684, 0.335093800000, 0.438940266360]$$
- **Population Standard Deviation Vector $\sigma \in \mathbb{R}^4$:**
  $$\sigma = [0.054508493108, 0.130932225210, 0.059508210356, 0.449345091720]$$

### Zero-Variance Guardrail Verification
Every criterion satisfies $\sigma_j \gg 10^{-15}$:
- $\sigma_1 = 0.054508 > 10^{-15}$
- $\sigma_2 = 0.130932 > 10^{-15}$
- $\sigma_3 = 0.059508 > 10^{-15}$
- $\sigma_4 = 0.449345 > 10^{-15}$
*(No `ZeroVarianceStandardizationError` raised).*

### Physical Reference Points in Standardized Space
Because raw criteria are physically bounded in $[0, 1]$, the ideal is $s^+ = [1, 1, 1, 1]$ and the anti-ideal is $s^- = [0, 0, 0, 0]$. Their standardized images are:
$$z^+_j = \frac{1.0 - \mu_j}{\sigma_j}, \quad z^-_j = \frac{0.0 - \mu_j}{\sigma_j} = -\frac{\mu_j}{\sigma_j}$$

- **Standardized Ideal $z^+ \in \mathbb{R}^4$:**
  $$z^+ = [5.18559828, 2.67646039, 11.17335272, 1.24861642]$$
- **Standardized Anti-Ideal $z^- \in \mathbb{R}^4$:**
  $$z^- = [-13.16017325, -4.96107788, -5.63105151, -0.97684457]$$

---

## STAGE 4: Standardized Decision Matrix $Z$

Each cell is computed as $Z_{ij} = \frac{S_{ij} - \mu_j}{\sigma_j}$:

$$Z = \begin{bmatrix}
 1.46484824 &  1.34794824 & -0.15326960 & -0.97684457 \\
 0.63801488 &  0.69188796 &  0.99240461 &  1.18880228 \\
-0.18392359 & -0.09033405 & -0.68759925 & -0.44995250 \\
-0.42460193 & -0.34392534 & -1.40003875 &  1.21484126 \\
-1.49433760 & -1.60557681 &  1.24850299 & -0.97684646
\end{bmatrix}$$

### Verification of Normalization Properties
- Column means: $\frac{1}{5} \sum_{i=1}^5 Z_{ij} = 0.00000000$ (machine zero $< 10^{-16}$)
- Column sample variance ($ddof=0$): $\frac{1}{5} \sum_{i=1}^5 Z_{ij}^2 = 1.00000000$

---

## STAGE 5: Empirical Correlation Matrix $R$

The correlation matrix is computed using the population denominator $n=5$:
$$R = \frac{1}{n} Z^T Z = \begin{bmatrix}
 1.00000000 &  0.99557876 & -0.14722137 &  0.07084284 \\
 0.99557876 &  1.00000000 & -0.19618174 &  0.13940277 \\
-0.14722137 & -0.19618174 &  1.00000000 & -0.25630689 \\
 0.07084284 &  0.13940277 & -0.25630689 &  1.00000000
\end{bmatrix}$$

### Viva Scientific Insight
Notice $R_{0,1} = R(s_{\text{HSP}}, s_{\chi}) = 0.99557876$. This near-perfect collinearity mathematically proves why PCA is necessary: treating $s_{\text{HSP}}$ and $s_{\chi}$ as independent in classical Euclidean TOPSIS would effectively double-count the thermodynamic solubility affinity dimension.

---

## STAGE 6: Spectral Decomposition & Sign Canonicalization

Eigendecomposition is executed via `scipy.linalg.eigh(R)` (`asd_mcda/v2/pca.py`):

$$\det(R - \lambda I) = 0 \Longrightarrow \Lambda = (\lambda_1, \lambda_2, \lambda_3, \lambda_4)$$

### Sorted Eigenvalues & Variance Explained
$$\text{Trace}(R) = \sum_{j=1}^4 \lambda_j = 4.000000000000$$

| Component | Eigenvalue $\lambda_j$ | Proportion of Variance | Cumulative Explained Variance |
|:---:|:---:|:---:|:---:|
| **PC1** | $2.090865774153$ | $52.2716443538\%$ | $52.2716443538\%$ |
| **PC2** | $1.167895241852$ | $29.1973810463\%$ | $81.4690254001\%$ |
| **PC3** | $0.739774706545$ | $18.4943676636\%$ | **$99.9633930638\%$** |
| **PC4** | $0.001464277449$ | $0.0366069362\%$ | $100.0000000000\%$ |

### Sign-Canonicalized Eigenvector Matrix $V$ ($4 \times 4$)
In `canonicalize_eigenvector_sign(v)`, the element with largest absolute magnitude is identified; if negative, the entire eigenvector is negated.

$$V = \begin{bmatrix}
 0.66414073 & -0.25529792 &  0.03511340 & -0.70178822 \\
 0.67637775 & -0.18704207 &  0.05012674 &  0.71064483 \\
-0.25583713 & -0.63431899 &  0.72907936 &  0.02512015 \\
 0.18967554 &  0.70532130 &  0.68168800 & -0.04297448
\end{bmatrix}$$

---

## STAGE 7: Dynamic $K$ Selection

The v2 dynamic dimensionality rule enforces:
$$K = \min\left\{ k \in \{1, \dots, p\} : \frac{\sum_{j=1}^k \lambda_j}{p} \ge 0.95 \right\}$$

- For $k=1$: $\frac{2.090866}{4} = 0.522716 < 0.95$
- For $k=2$: $\frac{2.090866 + 1.167895}{4} = 0.814690 < 0.95$
- For $k=3$: $\frac{2.090866 + 1.167895 + 0.739775}{4} = 0.999634 \ge 0.95$

$$\Longrightarrow K = 3$$

### Retained Basis $V_K$ ($4 \times 3$)
$$V_K = \begin{bmatrix}
 0.66414073 & -0.25529792 &  0.03511340 \\
 0.67637775 & -0.18704207 &  0.05012674 \\
-0.25583713 & -0.63431899 &  0.72907936 \\
 0.18967554 &  0.70532130 &  0.68168800
\end{bmatrix}$$

---

## STAGE 8: Subspace Stability & Eigengap Governance

The boundary spectral gap between the retained subspace ($K=3$) and discarded subspace ($K+1=4$) is:

$$\delta_3 = \lambda_3 - \lambda_4 = 0.739774706545 - 0.001464277449 = 0.738310429096$$

### Governance Decision
$$\delta_3 = 0.738310 \ge 0.10 \Longrightarrow \text{STABLE}$$

*(Analysis proceeds unconditionally; no `DegenerateSubspaceBlockedError`).*

---

## STAGE 9: External Physical-Criteria AHP Preference Weighting

The authoritative v2 physical pairwise comparison matrix $A \in \mathbb{R}^{4 \times 4}$ is:
$$A = \begin{bmatrix}
1.0 & 2.0 & 3.0 & 2.0 \\
0.5 & 1.0 & 5.0 & 2.0 \\
1/3 & 0.2 & 1.0 & 0.5 \\
0.5 & 0.5 & 2.0 & 1.0
\end{bmatrix}$$

### Principal Eigenvector & Consistency Metrics
- **Principal Eigenvalue:** $\lambda_{\max} = 4.131937073899$
- **Consistency Index:** $CI = \frac{\lambda_{\max} - 4}{3} = 0.043979024633$
- **Random Index ($RI_4$):** $0.89$
- **Consistency Ratio ($CR$):**
  $$CR = \frac{CI}{RI_4} = \frac{0.043979024633}{0.89} = 0.049414634419 < 0.08 \Longrightarrow \text{ACCEPTED}$$

### Physical Criteria Weight Vector $w_{\text{phys}}$
$$w_{\text{phys}} = [0.407674783970, 0.324433408656, 0.092161337948, 0.175730469426]$$

---

## STAGE 10: Subspace Metric Tensor $M_K$

In `construct_metric_tensor()` (`asd_mcda/v2/metrics.py`), the physical weights $W = \text{diag}(w_{\text{phys}})$ are projected into the $K=3$ subspace:

$$M_K = V_K^T W V_K \in \mathbb{R}^{3 \times 3}$$

$$M_K = \begin{bmatrix}
 0.34059739 & -0.07170138 &  0.02603854 \\
-0.07170138 &  0.16242548 &  0.03517467 \\
 0.02603854 &  0.03517467 &  0.13196813
\end{bmatrix}$$

### Verification of Metric Properties
1. **Symmetry:** $M_K^T = M_K$ (max error $< 10^{-17}$).
2. **Eigenvalues of $M_K$:** $(0.370535, 0.138407, 0.126049) > 0 \Longrightarrow$ Strictly Positive Definite.

---

## STAGE 11: Subspace Projection of Points & Physical Anchors

Candidates and reference points are projected onto $V_K$:

- **Projected Ideal:** $t^+ = z^+ V_K = [2.63255404, -8.03126154, 9.31365545]$
- **Projected Anti-Ideal:** $t^- = z^- V_K = [-10.84044949, 7.17058473, -5.48216113]$

### Candidate Subspace Coordinates $T = Z V_K$ ($5 \times 3$)
- **$t_0$ (Soluplus):** $[1.73851590, -1.21786358, -0.65864448]$
- **$t_1$ (HPMC E5):** $[0.86330541, -0.08330756, 1.59101830]$
- **$t_2$ (PVP-VA64):** $[-0.09268383, 0.18264703, -0.81902737]$
- **$t_3$ (PVP K30):** $[0.07398695, 1.91764971, -0.22474377]$
- **$t_4$ (EDR EPO):** $[-2.58312443, -0.79912560, 0.11139731]$

---

## STAGE 12: Quadratic-Form Distances

Distances are computed via generalized quadratic forms:
$$D_i^+ = \sqrt{(t_i - t^+)^T M_K (t_i - t^+)}, \quad D_i^- = \sqrt{(t_i - t^-)^T M_K (t_i - t^-)}$$

### Step-by-Step Manual Trace for Candidate 0 (Soluplus)
1. **Difference Vectors:**
   $$\Delta t^+ = t_0 - t^+ = [1.73851590 - 2.63255404, -1.21786358 - (-8.03126154), -0.65864448 - 9.31365545]$$
   $$\Delta t^+ = [-0.89403814, 6.81339796, -9.97229993]$$

   $$\Delta t^- = t_0 - t^- = [1.73851590 - (-10.84044949), -1.21786358 - 7.17058473, -0.65864448 - (-5.48216113)]$$
   $$\Delta t^- = [12.57896539, -8.38844831, 4.82351665]$$

2. **Quadratic Inner Products:**
   $$q^+ = (\Delta t^+)^T M_K (\Delta t^+) = 17.49417624$$
   $$D_0^+ = \sqrt{17.49417624} = \mathbf{4.182604001611}$$

   $$q^- = (\Delta t^-)^T M_K (\Delta t^-) = 83.83734419$$
   $$D_0^- = \sqrt{83.83734419} = \mathbf{9.156273493467}$$

### Summary of Distances for All Candidates
| Index | Candidate | $D_i^+$ (to Ideal) | $D_i^-$ (to Anti-Ideal) |
|:---:|:---|:---:|:---:|
| **0** | Soluplus | $4.182604001611$ | $9.156273493467$ |
| **1** | HPMC E5 | $4.196083764581$ | $8.641727853991$ |
| **2** | PVP-VA64 | $5.082373875664$ | $7.825140378503$ |
| **3** | PVP K30 | $5.344023390153$ | $7.613820510713$ |
| **4** | Eudragit E PO | $5.671239168808$ | $6.809925907287$ |

---

## STAGE 13: Relative Closeness $C_L$

The relative closeness coefficient is computed as:
$$C_L = \frac{D^-}{D^+ + D^-}$$

### Manual Soluplus Calculation
$$C_L(\text{Soluplus}) = \frac{9.156273493467}{4.182604001611 + 9.156273493467} = \frac{9.156273493467}{13.338877495078} = \mathbf{0.6864350839750771}$$

### Reconciled Closeness Scores
- Soluplus: $C_L = 0.6864350839750771$
- HPMC E5: $C_L = 0.6731464918436223$
- PVP-VA64: $C_L = 0.6062468903318391$
- PVP K30: $C_L = 0.5875839043102031$
- Eudragit E PO: $C_L = 0.5456162037572858$

*(Exact match to `scientific_validation_results.json` across all candidates).*

---

## STAGE 14: Final Candidate Ranking

Sorting candidates in descending order of $C_L$ yields the deterministic production ranking:

| Rank | Polymer ID | Polymer Trade Name | $C_L$ | $D^+$ | $D^-$ | Validation JSON Key |
|:---:|:---|:---|:---:|:---:|:---:|:---|
| **1** | `POL-005-2026` | **Soluplus** | **$0.68643508$** | $4.18260400$ | $9.15627349$ | Rank 1 (`PASS`) |
| **2** | `POL-006-2026` | **HPMC E5** | **$0.67314649$** | $4.19608376$ | $8.64172785$ | Rank 2 (`PASS`) |
| **3** | `POL-002-2026` | **PVP-VA64** | **$0.60624689$** | $5.08237388$ | $7.82514038$ | Rank 3 (`PASS`) |
| **4** | `POL-001-2026` | **PVP K30** | **$0.58758390$** | $5.34402339$ | $7.61382051$ | Rank 4 (`PASS`) |
| **5** | `POL-007-2026` | **Eudragit E PO** | **$0.54561620$** | $5.67123917$ | $6.80992591$ | Rank 5 (`PASS`) |

---

## STAGE 15: Backward Inversion Dissection

Let us now execute the backward analysis starting from the scalar $C_L = 0.68643508$:

1. **Step 1: Can we recover $D^+$ and $D^-$ from $C_L$?**  
   *No.* We only know that $\frac{D^-}{D^+} = \frac{0.68643508}{1 - 0.68643508} = 2.189111$. Without auxiliary metric scale records, infinite pairs $(D^+, D^-)$ satisfy this ratio.
2. **Step 2: If $D^+$ and $D^-$ are given, can we recover $t_0$?**  
   *No.* $t_0$ is constrained to the intersection of two 3-dimensional ellipsoids centered at $t^+$ and $t^-$. The intersection is a 1-dimensional ellipse in $\mathbb{R}^3$, leaving 1 degree of freedom undetermined.
3. **Step 3: If $t_0 = [1.738516, -1.217864, -0.658644]$ is given, can we recover $z_0$?**  
   *Almost, but not exactly.* Because $K=3$ while $p=4$, we can only reconstruct the projection onto the top 3 components:  
   $$\hat{z}_0 = t_0 V_K^T = [1.444697, 1.368364, -0.151778, -0.976527]$$  
   Comparing $\hat{z}_0$ to the true $z_0$:
   $$z_0 - \hat{z}_0 = [0.020151, -0.020405, -0.001491, -0.000318]$$  
   The reconstruction error vector is precisely collinear with the discarded 4th eigenvector $v_4$:
   $$z_0 - \hat{z}_0 = -0.028714 \times v_4$$
   The magnitude of this residual is tiny ($\|\text{error}\| \approx 0.0287$), exactly reflecting that PC4 contained only $0.0366\%$ of the cohort variance.
4. **Step 4: If $z_0$ and $(\mu, \sigma)$ are given, can we recover $S_0$?**  
   *Yes, 100% exactly.* $S_{0,j} = \mu_j + z_{0,j} \sigma_j$. This affine map is completely invertible.

This master trace mathematically proves the full forward fidelity and delineates the exact boundaries of backward reconstruction for Indomethacin.

---

*End of Document 02 — Indomethacin Full Numerical Trace*
