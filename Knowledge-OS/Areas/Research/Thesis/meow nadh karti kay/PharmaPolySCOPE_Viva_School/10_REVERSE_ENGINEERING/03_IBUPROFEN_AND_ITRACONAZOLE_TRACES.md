# 03_IBUPROFEN_AND_ITRACONAZOLE_TRACES

---

## Cross-Reference
**Case Studies:** 
- Ibuprofen Cohort (`DRG-0001`)
- Itraconazole Cohort (`ITR-001-2026`)

**Authoritative Production Source Code:**
- `src/asd_mcda/v2/standardization.py`
- `src/asd_mcda/v2/pca.py`
- `src/asd_mcda/v2/stability.py`
- `src/asd_mcda/v2/ahp.py`
- `src/asd_mcda/v2/metrics.py`
- `src/asd_mcda/v2/engine.py`

**Validation Artifact:**
- `results/validation/v2_scientific_validation/scientific_validation_results.json`

---

## 1. Pedagogical Objective: Variable-$K$ Dimensional Adaptation

The primary mathematical breakthrough of PharmaPolySCOPE v2 over legacy v1.5 is **Dynamic $K$ Selection**. Legacy v1.5 hardcoded a fixed 2-dimensional evaluation subspace ($K=2$) for all drugs regardless of their physical data geometry.

In contrast, v2 lets the data dictate the subspace dimensionality:
- **Indomethacin:** Requires $K=3$ to satisfy $\tau_{\text{var}} \ge 0.95$ ($99.9634\%$ variance).
- **Ibuprofen:** Requires only $K=2$ to satisfy $\tau_{\text{var}} \ge 0.95$ ($96.1008\%$ variance).
- **Itraconazole:** Requires only $K=2$ to satisfy $\tau_{\text{var}} \ge 0.95$ ($96.1936\%$ variance).

This document traces the complete numerical pipeline for Ibuprofen and Itraconazole, demonstrating how the identical software architecture dynamically contracts from a $3 \times 3$ metric tensor space to a $2 \times 2$ metric tensor space.

> **CRITICAL VIVA PRINCIPLE (NON-COMPARABILITY OF RAW $C_L$):**  
> Candidates and examiners must **never** compare raw closeness scores $C_L$ across different drugs. Because each drug defines its own unique cohort standardization moments $(\mu, \sigma)$ and its own unique eigenvector basis $V_K$, the resulting evaluation subspaces are distinct non-isometric Riemannian manifolds. A closeness score of $0.5502$ for Eudragit E PO with Ibuprofen cannot be compared to $0.6864$ for Soluplus with Indomethacin.

---

## 2. Part I: Ibuprofen Numerical Trace (`DRG-0001`)

### 1. Chemical Identity & Descriptors
```
Chemical Name:      Ibuprofen
Canonical SMILES:   CC(C)Cc1ccc(C(C)C(=O)O)cc1
InChIKey:           HEFNNWSXXWATRW-UHFFFAOYSA-N
Molecular Weight:   206.285 g/mol
LogP:               3.073200
HBD: 1,  HBA: 1,  TPSA: 37.30 A^2,  RotBonds: 4,  AromRings: 1
Molar Volume V_m:   195.53 cm^3/mol (from rho_cryst = 1.055 g/cm^3, rho_amorphous = 1.03 g/cm^3)
HSP:                delta_d = 17.86, delta_p = 2.21, delta_h = 7.16, R_o = 7.50 MPa^1/2
Thermal:            T_g = 244.15 K (-29.0 deg C), T_m = 349.15 K (76.0 deg C)
```

### 2. Raw Decision Matrix $S$ ($5 \times 4$)
Row order: Soluplus, HPMC E5, PVP-VA64, PVP K30, Eudragit E PO.

| Candidate | $s_{\text{HSP}}$ | $s_{\chi}$ | $s_{\text{desc}}$ | $s_{\text{GT}}$ |
|:---|:---:|:---:|:---:|:---:|
| Soluplus | $0.52484809$ | $0.39898802$ | $0.36367359$ | $0.61353825$ |
| HPMC E5 | $0.44826697$ | $0.18964346$ | $0.26292000$ | $1.00000000$ |
| PVP-VA64 | $0.55503758$ | $0.47293419$ | $0.39969171$ | $0.91126623$ |
| PVP K30 | $0.49518716$ | $0.32161075$ | $0.48301000$ | $1.00000000$ |
| Eudragit E PO | $0.75171611$ | $0.83589748$ | $0.31062000$ | $0.37557140$ |

### 3. Population Moments & Standardized Anchors ($ddof=0$)
- **$\mu$:** $[0.55501118, 0.44381478, 0.36398306, 0.78007518]$
- **$\sigma$:** $[0.10447551, 0.21731174, 0.07550377, 0.24710431]$
- **$z^+$ (Ideal):** $[4.25925619, 2.55938337, 8.42364402, 0.89000844]$
- **$z^-$ (Anti-Ideal):** $[-5.31234559, -2.04229532, -4.82072709, -3.15686524]$

### 4. Standardized Matrix $Z$ ($5 \times 4$)
$$Z = \begin{bmatrix}
-0.28870942 & -0.20627844 & -0.00409874 & -0.67395420 \\
-1.02171317 & -1.16961340 & -1.33851676 &  0.89000844 \\
 0.00025267 &  0.13399843 &  0.47293863 &  0.53091367 \\
-0.57261244 & -0.56234320 &  1.57643676 &  0.89000844 \\
 1.88278235 &  1.80423661 & -0.70675988 & -1.63697635
\end{bmatrix}$$

### 5. Empirical Correlation Matrix $R$ ($4 \times 4$)
$$R = \begin{bmatrix}
 1.00000000 &  0.99471676 & -0.17289569 & -0.86126359 \\
 0.99471676 &  1.00000000 & -0.10637873 & -0.85695627 \\
-0.17289569 & -0.10637873 &  1.00000000 &  0.32451084 \\
-0.86126359 & -0.85695627 &  0.32451084 &  1.00000000
\end{bmatrix}$$

### 6. Spectral Decomposition & Dynamic $K=2$
- **Eigenvalues:** $\Lambda = (2.87398799, 0.97004203, 0.15316445, 0.00280554)$
- **Cumulative Variance:**
  - $k=1$: $71.8497\% < 95\%$
  - $k=2$: $96.1008\% \ge 95\% \Longrightarrow \mathbf{K = 2}$ (cum var = $0.961007503610$)
- **Boundary Eigengap:**
  $$\delta_2 = \lambda_2 - \lambda_3 = 0.97004203 - 0.15316445 = \mathbf{0.81687758 \ge 0.10} \Longrightarrow \text{STABLE}$$

### 7. Retained Subspace Basis $V_K$ ($4 \times 2$)
$$V_K = \begin{bmatrix}
 0.57556184 &  0.14967060 \\
 0.57050800 &  0.21632766 \\
-0.18192631 &  0.96279978 \\
-0.55691299 &  0.06177543
\end{bmatrix}$$

### 8. $2 \times 2$ Metric Tensor $M_K$
Constructed with physical weights $w_{\text{phys}} = [0.407675, 0.324433, 0.092161, 0.175730]$:
$$M_K = V_K^T W V_K = \begin{bmatrix}
0.29820088 & 0.05297121 \\
0.05297121 & 0.11041793
\end{bmatrix}$$

### 9. Projected Coordinates & Distances
- **Projected Ideal $t^+$:** $[1.88347437, 9.35643956]$
- **Projected Anti-Ideal $t^-$:** $[-1.58761223, -6.07333333]$

| Candidate | $t_{i,1}$ | $t_{i,2}$ | $D_i^+$ (to Ideal) | $D_i^-$ (to Anti-Ideal) | $C_L$ | Ibuprofen Rank |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Eudragit E PO** | $3.15321952$ | $-0.10948978$ | $\mathbf{3.01683630}$ | $\mathbf{3.69118701}$ | $\mathbf{0.55026449}$ | **Rank 1** |
| **PVP-VA64** | $-0.30511979$ | $0.51716877$ | $3.47924433$ | $2.48634381$ | $0.41678100$ | **Rank 2** |
| **PVP K30** | $-1.43284725$ | $1.36542385$ | $3.62464529$ | $2.49781985$ | $0.40797617$ | **Rank 3** |
| **Soluplus** | $0.09222567$ | $-0.13341485$ | $3.56393524$ | $2.40716031$ | $0.40313545$ | **Rank 4** |
| **HPMC E5** | $-1.50747814$ | $-1.63968798$ | $4.55306105$ | $1.48662888$ | $0.24614324$ | **Rank 5** |

*(Exact reconciliation with `scientific_validation_results.json`).*

---

## 3. Part II: Itraconazole Numerical Trace (`ITR-001-2026`)

### 1. Chemical Identity & Descriptors
```
Chemical Name:      Itraconazole
Canonical SMILES:   CCC(C)n1ncn(-c2ccc(N3CCN(c4ccc(OC[C@H]5CO[C@](Cn6cncn6)(c6ccc(Cl)cc6Cl)O5)cc4)CC3)cc2)c1=O
InChIKey:           VHVPQPYKVGDNFY-ZPGVKDDISA-N
Molecular Weight:   705.647 g/mol
LogP:               5.577300
HBD: 0,  HBA: 9,  TPSA: 104.70 A^2,  RotBonds: 11,  AromRings: 5
Molar Volume V_m:   555.59 cm^3/mol (from rho_cryst = 1.27 g/cm^3, rho_amorphous = 1.22 g/cm^3)
HSP:                delta_d = 18.50, delta_p = 11.20, delta_h = 10.50, R_o = 8.00 MPa^1/2
Thermal:            T_g = 330.65 K (57.5 deg C), T_m = 438.15 K (165.0 deg C)
```

### 2. Raw Decision Matrix $S$ ($5 \times 4$)
Row order: Soluplus, HPMC E5, PVP-VA64, PVP K30, Eudragit E PO.

| Candidate | $s_{\text{HSP}}$ | $s_{\chi}$ | $s_{\text{desc}}$ | $s_{\text{GT}}$ |
|:---|:---:|:---:|:---:|:---:|
| Soluplus | $0.82004775$ | $0.72130369$ | $0.47646967$ | $0.00000000$ |
| HPMC E5 | $0.82311285$ | $0.73071684$ | $0.39468000$ | $0.80807292$ |
| PVP-VA64 | $0.72407825$ | $0.34477793$ | $0.46467267$ | $0.04098091$ |
| PVP K30 | $0.75568975$ | $0.48631127$ | $0.44894333$ | $0.81447051$ |
| Eudragit E PO | $0.50172171$ | $0.00000000$ | $0.50655333$ | $0.00000000$ |

### 3. Population Moments & Standardized Anchors ($ddof=0$)
- **$\mu$:** $[0.72493006, 0.45662195, 0.45826380, 0.33270487]$
- **$\sigma$:** $[0.11786064, 0.27095325, 0.03697072, 0.39103986]$
- **$z^+$ (Ideal):** $[2.33385731, 2.00543209, 14.65311494, 1.70646329]$
- **$z^-$ (Anti-Ideal):** $[-6.15073934, -1.68524256, -12.39531557, -0.85082084]$

### 4. Standardized Matrix $Z$ ($5 \times 4$)
$$Z = \begin{bmatrix}
 0.80703450 &  0.97685217 &  0.49244033 & -0.85082084 \\
 0.83304050 &  1.01159495 & -1.71984206 &  1.21565096 \\
-0.00722727 & -0.41278077 &  0.17335017 & -0.74602102 \\
 0.26098363 &  0.10957354 & -0.25210459 &  1.23201174 \\
-1.89383136 & -1.68523989 &  1.30615615 & -0.85082084
\end{bmatrix}$$

### 5. Empirical Correlation Matrix $R$ ($4 \times 4$)
$$R = \begin{bmatrix}
 1.00000000 &  0.97083652 & -0.71519183 &  0.45285497 \\
 0.97083652 &  1.00000000 & -0.71182103 &  0.45507914 \\
-0.71519183 & -0.71182103 &  1.00000000 & -0.81218526 \\
 0.45285497 &  0.45507914 & -0.81218526 &  1.00000000
\end{bmatrix}$$

### 6. Spectral Decomposition & Dynamic $K=2$
- **Eigenvalues:** $\Lambda = (3.07419496, 0.77354809, 0.12317630, 0.02908064)$
- **Cumulative Variance:**
  - $k=1$: $76.8549\% < 95\%$
  - $k=2$: $96.1936\% \ge 95\% \Longrightarrow \mathbf{K = 2}$ (cum var = $0.961935763534$)
- **Boundary Eigengap:**
  $$\delta_2 = \lambda_2 - \lambda_3 = 0.77354809 - 0.12317630 = \mathbf{0.65037178 \ge 0.10} \Longrightarrow \text{STABLE}$$

### 7. Retained Subspace Basis $V_K$ ($4 \times 2$)
$$V_K = \begin{bmatrix}
-0.51806935 & -0.45121245 \\
-0.51780337 & -0.45049079 \\
 0.52570997 & -0.30700249 \\
-0.43256608 &  0.70655209
\end{bmatrix}$$

### 8. $2 \times 2$ Metric Tensor $M_K$
$$M_K = V_K^T W V_K = \begin{bmatrix}
0.25475654 & 0.10239433 \\
0.10239433 & 0.24525417
\end{bmatrix}$$

### 9. Projected Coordinates & Distances
- **Projected Ideal $t^+$:** $[4.71761899, -5.24932283]$
- **Projected Anti-Ideal $t^-$:** $[-2.08918663, 6.73870377]$

| Candidate | $t_{i,1}$ | $t_{i,2}$ | $D_i^+$ (to Ideal) | $D_i^-$ (to Anti-Ideal) | $C_L$ | Itraconazole Rank |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Soluplus** | $-0.29699863$ | $-1.55653556$ | $\mathbf{2.44099155}$ | $\mathbf{3.82752493}$ | $\mathbf{0.61059502}$ | **Rank 1** |
| **PVP-VA64** | $0.63131758$ | $-0.39110741$ | $2.44478676$ | $3.22189273$ | $0.56856802$ | **Rank 2** |
| **Eudragit E PO** | $2.90845233$ | $0.61156220$ | $2.66212050$ | $3.04948597$ | $0.53391038$ | **Rank 3** |
| **HPMC E5** | $-2.38536647$ | $0.55532431$ | $3.55994817$ | $3.12641760$ | $0.46758100$ | **Rank 4** |
| **PVP K30** | $-0.85740481$ | $0.78075646$ | $3.15459351$ | $2.75489521$ | $0.46618165$ | **Rank 5** |

*(Exact reconciliation with `scientific_validation_results.json`).*

---

## 4. Architectural Synthesis: Cross-Cohort Structural Comparison

The table below contrasts the mathematical and physical structure across all three validated drug cohorts:

| Architectural Property | Indomethacin (`IND-001`) | Ibuprofen (`DRG-0001`) | Itraconazole (`ITR-001`) |
|:---|:---:|:---:|:---:|
| **Chemical Class** | BCS Class II (Acidic) | BCS Class II (Lipophilic Acid) | BCS Class II (Weakly Basic) |
| **Molecular Weight** | $357.8\text{ g/mol}$ | $206.3\text{ g/mol}$ | $705.6\text{ g/mol}$ |
| **Molar Volume $V_m$** | $273.0\text{ cm}^3/\text{mol}$ | $195.5\text{ cm}^3/\text{mol}$ | $555.6\text{ cm}^3/\text{mol}$ |
| **Eigenvalues $(\lambda_1, \lambda_2, \lambda_3, \lambda_4)$** | $(2.091, 1.168, 0.740, 0.001)$ | $(2.874, 0.970, 0.153, 0.003)$ | $(3.074, 0.774, 0.123, 0.029)$ |
| **Dynamic Retained $K$** | **$K = 3$** | **$K = 2$** | **$K = 2$** |
| **Cumulative Variance** | **$99.9634\%$** | **$96.1008\%$** | **$96.1936\%$** |
| **Boundary Eigengap $\delta_K$** | $\delta_3 = 0.738310$ | $\delta_2 = 0.816878$ | $\delta_2 = 0.650372$ |
| **Stability Classification** | `STABLE` ($\ge 0.10$) | `STABLE` ($\ge 0.10$) | `STABLE` ($\ge 0.10$) |
| **Metric Tensor Dim ($M_K$)** | **$3 \times 3$ Matrix** | **$2 \times 2$ Matrix** | **$2 \times 2$ Matrix** |
| **Top-Ranked Polymer** | **Soluplus** ($C_L = 0.6864$) | **Eudragit E PO** ($C_L = 0.5503$) | **Soluplus** ($C_L = 0.6106$) |
| **Second-Ranked Polymer** | **HPMC E5** ($C_L = 0.6731$) | **PVP-VA64** ($C_L = 0.4168$) | **PVP-VA64** ($C_L = 0.5686$) |

### Viva Master Defense: Why Dynamic $K$ Rescued Indomethacin
In a viva defense, the candidate can draw directly on this comparative table:
> *"If PharmaPolySCOPE had retained the fixed $K=2$ model of v1.5, Ibuprofen ($96.10\%$) and Itraconazole ($96.19\%$) would have functioned adequately. However, for Indomethacin, $K=2$ captures only $81.47\%$ of the variance, discarding an enormous $18.49\%$ of physical criteria information located in PC3 ($\lambda_3 = 0.7398$). Under v1.5, Indomethacin suffered from artificial subspace truncation. The v2 VariableKEngine dynamically elevated Indomethacin to $K=3$, capturing $99.9634\%$ of the variance while confirming $\delta_3 = 0.738310 \gg 0.10$ stability. This proves the fundamental superiority of data-driven subspace dimensionality."*

---

*End of Document 03 — Ibuprofen and Itraconazole Traces*
