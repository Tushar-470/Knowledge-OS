# 01_REVERSE_ENGINEERING_METHODOLOGY

---

## Cross-Reference
**Prerequisite knowledge:** 
- `04_MATHEMATICS` (Descriptive Statistics, Standardization, Linear Algebra, PCA, Dynamic K, Eigengap Governance)
- `05_DECISION_SCIENCE` (AHP, Metric Tensor, SP-PRP-TOPSIS, Closeness Formula)
- `07_SOFTWARE_ARCHITECTURE` (VariableKEngine, Data Flow, Stateless Execution)
- `08_VALIDATION_REPRODUCIBILITY` (Multi-cohort validation study, Class B limitations)
- `09_VIVA_ATTACK_FILES` (Hostile defense principles, Q&A attack strategies)

**Primary source code:**
- `src/asd_mcda/v2/standardization.py`
- `src/asd_mcda/v2/pca.py`
- `src/asd_mcda/v2/stability.py`
- `src/asd_mcda/v2/ahp.py`
- `src/asd_mcda/v2/metrics.py`
- `src/asd_mcda/v2/engine.py`

**Validation artifact:**
- `results/validation/v2_scientific_validation/scientific_validation_results.json`

---

## 1. What Reverse Engineering Means in PharmaPolySCOPE

In commercial software, "reverse engineering" typically refers to decompiling binaries, intercepting network packets, or recovering obfuscated source code. In the **PharmaPolySCOPE Viva School**, reverse engineering has a completely distinct, mathematically rigorous meaning:

> **Definition (Computational Reverse Engineering):**  
> The systematic bidirectional dissection of the decision pipeline, demonstrating that every reported scalar output (such as candidate closeness $C_L$, eigengap $\delta_K$, or ranking) is deterministically traceable through every intermediate linear-algebraic transformation back to raw physicochemical inputs (SMILES and polymer profiles), while rigorously delineating which mathematical transformations are uniquely invertible and which entail non-invertible information reduction.

In a PhD viva examination, examiners frequently test whether the candidate treats their software as a **black box**. An examiner will challenge:
- *"You report that Soluplus achieved a closeness of $0.686435$ for Indomethacin. Where did that number come from?"*
- *"If I give you this final closeness scalar, can you recover the original solubility parameters?"*
- *"Prove to me on this whiteboard that your metric tensor $M_K$ actually projects the AHP weights into the PCA subspace without destroying criterion independence."*

To answer these challenges authoritatively, the candidate must master both the **Forward Execution Pipeline** (how inputs become outputs) and the **Backward Decomposition Pipeline** (how outputs map back to inputs, and why certain steps cannot be mathematically inverted).

---

## 2. The Forward Pipeline: Mathematical Transformation Chain

The forward pipeline is a strictly deterministic Directed Acyclic Graph (DAG) executed by `VariableKEngine.evaluate()` in `asd_mcda/v2/engine.py`:

```
[Level 0: Raw Chemical Ingestion]
SMILES (Drug) + Polymer Data Structure
   │
   ▼ validate_chemical_structure(), compute_2d_descriptors() [chemistry.py]
[Level 1: Molecular Descriptors]
MW, LogP, HBD, HBA, TPSA, RotBonds, AromRings, V_m, HSP (delta_d, delta_p, delta_h), Tg, Tm, rho
   │
   ▼ compute_compatibility_matrix() [matrix.py, hsp_model.py, flory_huggins.py, gordon_taylor.py]
[Level 2: Raw Decision Matrix S]
S in R^{n x 4}, where columns are [s_HSP, s_chi, s_desc, s_GT], all in [0, 1]
   │
   ▼ standardize_cohort(S) [standardization.py] (ddof=0)
[Level 3: Standardized Space & Physical Anchors]
mu in R^4, sigma in R^4 (sigma_j >= 1e-8)
Z = (S - mu) / sigma in R^{n x 4}
z+ = (1 - mu) / sigma in R^4 (Physical Ideal)
z- = (0 - mu) / sigma in R^4 (Physical Anti-Ideal)
   │
   ▼ decompose_spectral(Z, tau=0.95) [pca.py]
[Level 4: Correlation Matrix & Spectral Decomposition]
R = (1/n) * Z^T @ Z in R^{4 x 4}
scipy.linalg.eigh(R) -> eigenvalues lambda_1 >= lambda_2 >= lambda_3 >= lambda_4 >= 0
sign canonicalization -> V in R^{4 x 4} (columns are canonical eigenvectors)
Dynamic K = min { k : sum_{i=1}^k lambda_i / 4 >= 0.95 }
V_K in R^{4 x K} (retained subspace basis)
   │
   ▼ evaluate_subspace_stability(eigenvalues, K) [stability.py]
[Level 5: Subspace Stability Governance]
delta_K = lambda_K - lambda_{K+1}
Governance gate: delta_K >= 0.10 (STABLE), [0.03, 0.10) (WARNING), < 0.03 (BLOCKED)
   │
   ▼ solve_ahp_preference(A) [ahp.py]
[Level 6: External Physical Preference Weighting]
A in R^{4 x 4} (pairwise comparison matrix, reciprocity error < 1e-12)
Principal eigenvector w_phys in R^4 (sum w_j = 1, w_j > 0)
Consistency: lambda_max, CI = (lambda_max - 4)/3, CR = CI / 0.89 < 0.08
   │
   ▼ construct_metric_tensor(V_K, w_phys) [metrics.py]
[Level 7: Subspace Metric Tensor]
W = diag(w_phys) in R^{4 x 4}
M_K = V_K^T @ W @ V_K in R^{K x K} (Symmetric Positive-Definite)
   │
   ▼ project_reference_points(z+, z-, V_K) & T = Z @ V_K [metrics.py]
[Level 8: Projected Geometry]
t_i = z_i @ V_K in R^K (Candidate coordinates, i=1..n)
t+ = z+ @ V_K in R^K (Projected physical ideal)
t- = z- @ V_K in R^K (Projected physical anti-ideal)
   │
   ▼ compute_distances_and_closeness(Z, z+, z-, V_K, M_K) [metrics.py]
[Level 9: Quadratic Form Distances & Relative Closeness]
D_i+ = sqrt( (t_i - t+)^T @ M_K @ (t_i - t+) )
D_i- = sqrt( (t_i - t-)^T @ M_K @ (t_i - t-) )
C_L_i = D_i- / (D_i+ + D_i-) in [0, 1]
   │
   ▼ argsort(-C_L) with deterministic tie-breaking [metrics.py]
[Level 10: Deterministic Candidate Ranking]
Rank 1 to n (1 = top-ranked computational candidate)
```

---

## 3. The Backward Pipeline: Deconstruction and Inversion Analysis

The backward pipeline asks: **Given an output at Level $L$, how far back up the chain can we uniquely travel?**

```
Final Scalar C_L
   │
   ▼ [Underdetermined: 1 equation, 2 unknowns (D+, D-)]
Distances D+, D-
   │
   ▼ [Underdetermined: 2 scalar norms, K coordinate differences in R^K]
Projected Subspace Coordinates t_i, t+, t-
   │
   ▼ [Requires Auxiliary Knowledge of V_K and W]
Subspace Metric Tensor M_K = V_K^T W V_K
   │
   ▼ [Information-Loss Boundary: Rank K < p]
Standardized Matrix Z in R^{n x 4}
   │
   ▼ [Bijective / Invertible given mu and sigma]
Raw Decision Matrix S in R^{n x 4}
   │
   ▼ [Non-invertible: Many molecules share identical descriptors]
Raw Chemical SMILES
```

### Mathematical Breakdown of Invertibility at Each Boundary

#### Boundary 1: $C_L \longrightarrow (D^+, D^-)$
- **Forward:** $C_L = \frac{D^-}{D^+ + D^-}$.
- **Backward:** Rearranging gives $D^- = \frac{C_L}{1 - C_L} D^+$.
- **Inversion Status: UNDERDETERMINED (Degree of Freedom = 1).**
- A single closeness value $C_L = 0.686435$ defines only the *ratio* $\frac{D^-}{D^+} \approx 2.18911$, but does not fix the absolute scale of the distances. Any pair $(k \cdot D^+, k \cdot D^-)$ for $k > 0$ produces the exact same $C_L$. To recover the exact distances, one must retain at least one distance scalar or the metric scale factor.

#### Boundary 2: $(D^+, D^-) \longrightarrow (t_i - t^+, t_i - t^-)$
- **Forward:** $D_i^+ = \sqrt{(t_i - t^+)^T M_K (t_i - t^+)}$.
- **Backward:** An ellipsoid equation in $\mathbb{R}^K$.
- **Inversion Status: UNDERDETERMINED (Degree of Freedom = $K - 1$).**
- Given a scalar distance $D_i^+$, the vector difference $t_i - t^+$ is constrained only to the surface of a $K$-dimensional ellipsoid centered at $t^+$. It cannot be uniquely localized to a single vector without auxiliary angular or coordinate data.

#### Boundary 3: $T = Z V_K \longrightarrow Z$
- **Forward:** Projection from $\mathbb{R}^{n \times 4}$ into $\mathbb{R}^{n \times K}$.
- **Backward:** $Z = T V_K^T + Z_{\perp}$, where $Z_{\perp} V_K = 0$.
- **Inversion Status: STRICT INFORMATION LOSS when $K < p$.**
- When $K < 4$ (e.g., $K=3$ for Indomethacin, $K=2$ for Ibuprofen), the transformation discards $p - K$ orthogonal dimensions corresponding to the discarded eigenvectors $V_{\perp} = [v_{K+1}, \dots, v_p]$.
- **Exact Reconstruction Condition:** $Z$ can be uniquely reconstructed from $T$ **if and only if** $K = p = 4$ (full rank retention, where $V_K V_K^T = I_4$). When $K < p$, reconstructing $Z$ from $T$ alone recovers only the projection $\hat{Z} = T V_K^T$, with residual discrepancy $\|Z - \hat{Z}\|_F^2 = \sum_{j=K+1}^p \lambda_j$.

#### Boundary 4: $Z \longrightarrow S$
- **Forward:** $Z_{ij} = \frac{S_{ij} - \mu_j}{\sigma_j}$.
- **Backward:** $S_{ij} = \mu_j + Z_{ij} \sigma_j$.
- **Inversion Status: BIJECTIVE (EXACT RECONSTRUCTION) given $(\mu, \sigma)$.**
- If the cohort moments $\mu \in \mathbb{R}^4$ and $\sigma \in \mathbb{R}^4$ are known, the mapping between $Z$ and $S$ is an invertible affine transformation with zero information loss.

#### Boundary 5: $S \longrightarrow \text{SMILES}$
- **Forward:** SMILES $\rightarrow$ RDKit graph $\rightarrow$ physicochemical properties $\rightarrow$ compatibility models ($s_{\text{HSP}}, s_{\chi}, s_{\text{desc}}, s_{\text{GT}}$).
- **Backward:** Compatibility criteria $\rightarrow$ chemical structure.
- **Inversion Status: ILL-POSED / MULTI-VALUED.**
- Countless distinct chemical structures can yield identical compatibility criteria against a specific polymer cohort. One cannot uniquely invert scalar solubility parameters and molecular weights back into a 2D chemical graph without an exhaustive molecular generator.

---

## 4. Why Both Directions Matter in a PhD Viva

Examiners structure their viva attacks across both directions to probe distinct layers of doctoral competence:

| Direction | Examiner's Objective | What the Candidate Must Demonstrate |
|---|---|---|
| **Forward** | Tests implementation correctness and mechanistic knowledge | Ability to trace data flow without software; manual reproduction of intermediate matrices; defense of parameter choices ($ddof=0$, $\tau=0.95$, $CR < 0.08$). |
| **Backward** | Tests theoretical depth and mathematical maturity | Understanding information theory, subspace projections, null spaces, loss of dimensionality, and why "reversing the calculation" requires auxiliary state. |

A student who only understands the forward pipeline sounds like an **operator** who knows how to run a tool. A student who understands both the forward and backward pipelines demonstrates the **epistemic authority of an author and computational scientist**.

---

## 5. Mathematical Taxonomy: Four Types of Reconstruction

When discussing reverse engineering, the candidate must use precise mathematical vocabulary:

```
                            RECONSTRUCTION TAXONOMY
                                       │
     ┌──────────────────┬──────────────┴─────┬──────────────────┐
     ▼                  ▼                    ▼                  ▼
1. EXACT          2. NUMERICAL          3. APPROXIMATE     4. UNDERDETERMINED
   RECONSTRUCTION    RECONCILIATION        RECONSTRUCTION     INVERSION
   (Algebraically    (Independent          (Least-squares /   (Mathematically
    Invertible)       Verification)         Subspace Proj.)    Ill-Posed)
```

1. **Exact Reconstruction (Bijective Mapping):**
   A mathematical step where an exact inverse function exists.  
   *Example:* Mapping standardized criteria $Z$ back to raw criteria $S$ via $S = \mu + Z \odot \sigma$.
2. **Numerical Reconciliation (Fidelity Verification):**
   Recalculating a forward pipeline from authoritative source inputs using independent mathematical code (or manual arithmetic) and confirming that the outputs match frozen validation artifacts to machine precision ($|x_{\text{calc}} - x_{\text{frozen}}| < 10^{-12}$).
3. **Approximate Reconstruction (Subspace Back-Projection):**
   Reconstructing full-dimensional criteria from a truncated subspace using the pseudo-inverse or transpose of the orthogonal basis: $\hat{Z} = T_K V_K^T$. The error is bounded by the uncaptured variance $\sum_{j=K+1}^p \lambda_j$.
4. **Underdetermined Inversion (Information Loss):**
   Attempting to invert a many-to-one mapping without auxiliary data.  
   *Example:* Deducing $D^+$ and $D^-$ from $C_L$ alone, or reconstructing 20 matrix elements from 1 scalar closeness score.

---

## 6. Full Pipeline Observability Matrix

The table below classifies every mathematical entity in PharmaPolySCOPE by its observability and reconstructibility:

| Stage | Entity | Symbol | Shape / Type | Classification | Reconstructible from Output? |
|---|---|---|---|---|---|
| **0** | Chemical SMILES | — | String | Directly Observed | No (Ill-posed) |
| **1** | Molecular Descriptors | $MW, TPSA, \dots$ | 8 Floats | Derived from SMILES | No |
| **1** | Molar Volume | $V_m$ | Float ($\text{cm}^3/\text{mol}$) | Derived / Empirical | No |
| **2** | Raw Compatibility Matrix | $S$ | $n \times 4$ | Derived Criteria | Exact given $Z, \mu, \sigma$ |
| **3** | Cohort Population Mean | $\mu$ | $1 \times 4$ | Derived Moment | Auxiliary record needed |
| **3** | Cohort Population Std | $\sigma$ | $1 \times 4$ ($ddof=0$) | Derived Moment | Auxiliary record needed |
| **3** | Standardized Matrix | $Z$ | $n \times 4$ | Derived Normalized | Exact if $K=p$; Approximate if $K<p$ |
| **3** | Physical Ideal / Anti-Ideal | $z^+, z^-$ | $1 \times 4$ | Derived Anchors | Exact given $\mu, \sigma$ |
| **4** | Correlation Matrix | $R$ | $4 \times 4$ | Derived Covariance | Exact from $Z$; Invertible from $V \Lambda V^T$ |
| **4** | Eigenvalues | $\Lambda = (\lambda_1..\lambda_4)$ | 4 Floats | Spectral Property | Directly verified |
| **4** | Eigenvectors | $V$ | $4 \times 4$ | Orthogonal Basis | Bijective from $R$ up to sign |
| **4** | Canonical Eigenvectors | $V$ | $4 \times 4$ | Canonicalized Basis | Deterministic |
| **5** | Dynamic Dimensionality | $K$ | Integer $\in \{1..4\}$ | Governance Choice | Directly recorded |
| **5** | Eigengap | $\delta_K$ | Float | Stability Metric | Exact from eigenvalues |
| **6** | AHP Preference Matrix | $A$ | $4 \times 4$ | Externally Supplied | Observed input |
| **6** | Physical Criteria Weights | $w_{\text{phys}}$ | $1 \times 4$ | Principal Eigenvector | Exact from $A$ |
| **6** | Consistency Ratio | $CR$ | Float | Governance Metric | Exact from $\lambda_{\max}$ |
| **7** | Metric Tensor | $M_K = V_K^T W V_K$ | $K \times K$ | Quadratic Form Tensor | Exact from $V_K$ and $w_{\text{phys}}$ |
| **8** | Subspace Coordinates | $t_i = z_i V_K$ | $n \times K$ | Projected Points | Exact from $Z$ and $V_K$ |
| **8** | Projected Ideal Anchors | $t^+, t^-$ | $1 \times K$ | Projected Anchors | Exact from $z^+, z^-, V_K$ |
| **9** | Quadratic Distances | $D_i^+, D_i^-$ | $n$ Pairs | Metric Norms | Exact from $t_i, t^{\pm}, M_K$ |
| **9** | Closeness Coefficients | $C_L$ | $n \times 1$ | Relative Closeness | Exact from $D^+, D^-$ |
| **10**| Deterministic Ranks | $\text{Rank}$ | $n$ Integers | Permutation | Exact from $C_L$ |

---

## 7. Viva Defense Protocols: Handling Examiner Inversion Traps

### Examiner Trap 1: "Take this closeness score of 0.6864 and tell me what the drug's logP was."
- **Flawed Response:** *"I can run the backward equations and compute the logP."* (FATAL: Claims impossible inversion).
- **Authoritative Defense:**  
  *"That inversion is mathematically impossible because the pipeline is a non-injective projection. $C_L$ is a single scalar that aggregates four orthogonal physicochemical criteria across a 5-polymer cohort. Multiple stages discard information: the Gordon-Taylor margin clips negative values, PCA discards orthogonal variance when $K < 4$, and the closeness formula maps two distance metrics to a single ratio. A final closeness score cannot uniquely recover input molecular descriptors without retaining the intermediate coordinate records."*

### Examiner Trap 2: "If your PCA discards the 4th principal component for Indomethacin, how do you know you didn't discard the most important chemical criterion?"
- **Flawed Response:** *"PCA proved that the 4th criterion wasn't important."* (FATAL: Confuses components with criteria).
- **Authoritative Defense:**  
  *"PCA does not discard criteria; it discards an orthogonal direction of variance in the standardized 4-dimensional space. Every one of the four physical criteria ($s_{\text{HSP}}, s_{\chi}, s_{\text{desc}}, s_{\text{GT}}$) has non-zero loadings across all principal components. In the Indomethacin cohort, retaining $K=3$ captures $99.9634\%$ of the total cohort variance, leaving only $0.0366\%$ variance in PC4. Furthermore, our eigengap governance check confirms $\delta_3 = 0.738310 \gg 0.10$, proving that PC4 is separated from the retained subspace by a massive spectral gap and its omission does not destabilize the evaluation subspace."*

### Examiner Trap 3: "Why can't I just use standard Euclidean distance in your PCA subspace?"
- **Flawed Response:** *"Because SP-PRP-TOPSIS uses a metric tensor to make it more advanced."*
- **Authoritative Defense:**  
  *"Standard Euclidean distance in the PCA subspace would implicitly assume that the principal axes are equally weighted. However, expert pharmaceutical priorities are defined over the physical criteria ($w_{\text{phys}}$), not over abstract principal components. The metric tensor $M_K = V_K^T W V_K$ rigorously pulls the physical criteria weight matrix $W = \text{diag}(w_{\text{phys}})$ into the $K$-dimensional subspace. If we used Euclidean distance, we would lose the expert preference structure entirely."*

---

*End of Document 01 — Reverse Engineering Methodology*
