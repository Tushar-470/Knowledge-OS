# MODULE 14: SOURCE LOCK & NUMERICAL RECONCILIATION AUDIT
# Forensic Evidence Grounding Across Authoritative Sources

**Document ID:** `MODULE_14_SOURCE_LOCK`  
**Module:** Module 14 — Board Explanations (Preview) (`14_BOARD_EXPLANATIONS/`)  
**Curriculum Phase:** Phase A — Planning & Source-Lock Architecture  
**Author:** Forensic Computational-Science Architect & PhD Methodology Auditor  
**Date:** September 24, 2026  
**Status:** PLANNING ONLY — SOURCE-LOCKED  

---

## 1. Authoritative Source Inventory & Precedence

Every equation, algorithm, numerical value, exception, and whiteboard script instruction in Module 14 is locked against the canonical hierarchy of truth established in Phase 9:

| Tier | Source Artifact | File Path / Commit / Identifier | Evidentiary Role |
| :---: | :--- | :--- | :--- |
| **Tier 1** | Active v2 Production Code | `src/asd_mcda/v2/`, commit `285c3d7` (engine established at `220ba4c`) | Supreme authority for algorithms, equations, exceptions, and constants |
| **Tier 1** | Engine Adapter & API | `backend/services/engine_adapter.py` | Authoritative v2 AHP matrix hardcoded definition & version metadata |
| **Tier 2** | Scientific Validation JSON | `results/validation/v2_scientific_validation/scientific_validation_results.json` | Supreme authority for machine-precision float64 outputs |
| **Tier 3** | Historical Config & Models | `config/ahp/default_matrix.json`, `src/asd_mcda/compatibility/matrix.py` | Four-criterion baseline and legacy v1.5 contrast |
| **Tier 4** | Quantitative Master Ledger | `12_NUMBERS_YOU_MUST_KNOW/MODULE_12_MASTER_QUANTITATIVE_LEDGER.md` | Authoritative dual-tier precision reference (`NUM-001` to `NUM-090`) |
| **Tier 4** | Master Forbidden Canon | `13_DO_NOT_SAY_THIS_IN_VIVA/MODULE_13_MASTER_FORBIDDEN_CANON.md` | Authoritative epistemic boundary constraints (`FC-01` to `FC-36`) |

### 1.1 Source Revision Policy & Provenance
```text
SOURCE_REVISION_POLICY = "The audited production repository revision is commit 285c3d7 (HEAD of main), which incorporates the v2 scientific validation study (committed at 1ca63d1) and engine metadata alignment. The core computational engine (src/asd_mcda/v2/) is byte-for-byte identical between 220ba4c and 285c3d7."
```

---

## 2. Four-Category Evidence Taxonomy

To prevent conflation between code facts and verbal presentation, all evidence is categorized into four distinct classes:
- **Category A (Implementation Fact):** Code structures, AST constants, mathematical definitions, exception types, hardcoded tolerances.
- **Category B (Numerical Result):** Deterministic floating-point outputs from canonical execution on the reference platform.
- **Category C (Methodological Interpretation):** Scientific framing, multi-criteria decision theory, spectral proxy modeling concepts.
- **Category D (Viva Presentation Guidance):** Whiteboard pacing, drawing order, verbal delivery scripts, pedagogical analogies.

---

## 3. Demonstration-by-Demonstration Source Lock Matrix

### DEMO-01: 5-Minute Pipeline Walk (Steps 0–8)
| Pipeline Step | Mathematical / Software Element | Authoritative Source File & Line | Evidence Category | Exact Canonical Value / Formula |
| :--- | :--- | :--- | :---: | :--- |
| **Step 0** | Chemical Validation | `src/asd_mcda/v2/chemistry.py:45-120` | Cat A | RDKit canonical SMILES parsing; raises `ProductionFallbackProhibitedError` on failure in Research mode. |
| **Step 1** | Four-Criterion Matrix $S$ | `src/asd_mcda/compatibility/matrix.py:20-65` | Cat A | Columns: $(s_{\text{HSP}}, s_\chi, s_{\text{desc}}, s_{\text{GT}})$; all values bounded in $[0.0, 1.0]$. |
| **Step 2** | Standardization $Z$ | `src/asd_mcda/v2/standardization.py:20-55` | Cat A | $Z_{ij} = (S_{ij} - \mu_j) / \sigma_j$; population std ($\text{ddof}=0$); zero-variance guardrail: $\sigma_j < 10^{-8} \Rightarrow$ `ZeroVarianceError`. |
| **Step 3** | Correlation PCA $R$ | `src/asd_mcda/v2/pca.py:53-75` | Cat A | $R = \frac{1}{n} Z^T Z$; solved via `scipy.linalg.eigh`; sorted descending; sign canonicalization enforced. |
| **Step 4** | Subspace Stability $\delta_K$ | `src/asd_mcda/v2/stability.py:38-95` | Cat A / Cat B | $\delta_K = \lambda_K - \lambda_{K+1}$; thresholds: $\ge 0.10$ (`STABLE`), $[0.03, 0.10)$ (`WARNING`), $< 0.03$ (`BLOCKED`). |
| **Step 5** | AHP Preference Weights | `src/asd_mcda/v2/ahp.py:52-85` | Cat A / Cat B | Power iteration / eigendecomposition of $4 \times 4$ matrix; $RI_4 = 0.89$; gate: $CR < 0.08$. |
| **Step 6** | Metric Tensor $M_K$ | `src/asd_mcda/v2/metrics.py:20-130` | Cat A | $M_K = V_K^T W V_K$; positive-definite quadratic-form metric; symmetrized $0.5(M_K + M_K^T)$; strictly positive-definite ($\min \text{eig} > 10^{-12}$). |
| **Step 7** | Reference Points $t^+, t^-$ | `src/asd_mcda/v2/metrics.py:227-230` | Cat A | Physical ideal $s^+ = [1,1,1,1]$, anti-ideal $s^- = [0,0,0,0]$; projected: $t^+ = z^+ V_K, t^- = z^- V_K$. |
| **Step 8** | Closeness $C_L$ & Ranking | `src/asd_mcda/v2/metrics.py:235-275` | Cat A / Cat B | $D_i^+ = \sqrt{(T_i - t^+)^T M_K (T_i - t^+)}$, $C_L = D_i^- / (D_i^+ + D_i^-)$; sorted descending. |

---

### DEMO-02: AHP Consistency Demonstration & Proof
| Parameter / Concept | Authoritative Source File | Evidence Category | Exact Machine Record (float64) | Viva Defense Value |
| :--- | :--- | :---: | :--- | :--- |
| **Authoritative Matrix $A$** | `backend/services/engine_adapter.py:100-105` | Cat A | $[[1.0, 2.0, 3.0, 2.0], [0.5, 1.0, 5.0, 2.0], [1/3, 0.2, 1.0, 0.5], [0.5, 0.5, 2.0, 1.0]]$ | Exact $4 \times 4$ matrix |
| **Reciprocity Condition** | `src/asd_mcda/v2/ahp.py:64-70` | Cat A | $|a_{ji} a_{ij} - 1.0| < 10^{-12}$ | Reciprocal ($a_{ji} = 1/a_{ij}$) |
| **Principal Root $\lambda_{\max}$** | `scientific_validation_results.json` | Cat B | `4.131937073898666` | $4.1319$ |
| **Saaty Random Index ($RI_4$)** | `src/asd_mcda/v2/ahp.py:41` | Cat A | `0.89` | $0.89$ |
| **Consistency Index ($CI$)** | `scientific_validation_results.json` | Cat B | `0.04397902463288853` | $0.0440$ ($(\lambda_{\max}-4)/3$) |
| **Consistency Ratio ($CR$)** | `scientific_validation_results.json` | Cat B | `0.04941463441897588` | $0.0494$ ($CI / 0.89$) |
| **Governance Gate Threshold** | `src/asd_mcda/v2/ahp.py:50` | Cat A | `0.08` | $CR < 0.08$ [ACCEPTED] |
| **Weight: $s_{\text{HSP}}$** | `scientific_validation_results.json` | Cat B | `0.40767478396983764` | $0.4077$ ($40.77\%$) |
| **Weight: $s_\chi$** | `scientific_validation_results.json` | Cat B | `0.32443340865551623` | $0.3244$ ($32.44\%$) |
| **Weight: $s_{\text{desc}}$** | `scientific_validation_results.json` | Cat B | `0.09216133794843878` | $0.0922$ ($9.22\%$) |
| **Weight: $s_{\text{GT}}$** | `scientific_validation_results.json` | Cat B | `0.17573046942620724` | $0.1757$ ($17.57\%$) |

---

### DEMO-03: Indomethacin Eigengap Board & Subspace Stability
| Parameter / Concept | Authoritative Source File | Evidence Category | Exact Machine Record (float64) | Viva Defense Value |
| :--- | :--- | :---: | :--- | :--- |
| **Drug Identifier & Name** | `scientific_validation_results.json` | Cat A | `IND-001-2026`, `Indomethacin` | Indomethacin |
| **Eigenvalue $\lambda_1$** | `scientific_validation_results.json` | Cat B | `2.0908657741533783` | $\sim 2.0909$ ($52.27\%$) |
| **Eigenvalue $\lambda_2$** | `scientific_validation_results.json` | Cat B | `1.1678952418522826` | $\sim 1.1679$ ($29.20\%$) |
| **Eigenvalue $\lambda_3$** | `scientific_validation_results.json` | Cat B | `0.7397747065453792` | $\sim 0.7398$ ($18.49\%$) |
| **Eigenvalue $\lambda_4$** | `scientific_validation_results.json` | Cat B | `0.0014642774489659338` | $\sim 0.0015$ ($0.04\%$) |
| **Total Trace ($\sum \lambda_j$)** | `src/asd_mcda/v2/pca.py` | Cat A / Cat B | `4.000000000000006` | $4.0$ (trace of $4 \times 4$ corr matrix) |
| **Retained Dimension $K$** | `scientific_validation_results.json` | Cat B | `3` | $K = 3$ |
| **Cumulative Variance** | `scientific_validation_results.json` | Cat B | `0.99963393063776` | $99.9634\%$ ($> 95\%$) |
| **Boundary Eigengap $\delta_3$** | `scientific_validation_results.json` | Cat B | `0.7383104290964133` | $0.7383$ (or $0.738$) |
| **Stability Status** | `src/asd_mcda/v2/stability.py:78` | Cat A / Cat B | `STABLE` | `STABLE` ($\delta_3 = 0.7383 \gg 0.10$) |
| **Warning Threshold** | `src/asd_mcda/v2/stability.py:81` | Cat A | `0.03 <= delta_K < 0.10` | $[0.03, 0.10)$ |
| **Block Threshold** | `src/asd_mcda/v2/stability.py:88` | Cat A | `delta_K < 0.03` | $< 0.03$ (`DegenerateSubspaceBlockedError`) |

---

### DEMO-04: SP-PRP-TOPSIS Metric Tensor Geometry
| Parameter / Concept | Authoritative Source File | Evidence Category | Exact Mathematical Definition | Viva Defense Interpretation |
| :--- | :--- | :---: | :--- | :--- |
| **Subspace Metric Tensor** | `src/asd_mcda/v2/metrics.py:27` | Cat A | $M_K = V_K^T W V_K$ | Positive-definite quadratic-form metric induced by physical AHP weighting in the PCA subspace |
| **Eigenvector Matrix $V_K$** | `src/asd_mcda/v2/pca.py:70` | Cat A | $V_K \in \mathbb{R}^{4 \times K}$ ($V_K^T V_K = I_K$) | Orthonormal basis of empirical variance subspace |
| **Physical Weight Matrix $W$** | `src/asd_mcda/v2/metrics.py:108` | Cat A | $W = \text{diag}(w_{\text{phys}}) \in \mathbb{R}^{4 \times 4}$ | Diagonal decision-theoretic criteria preferences |
| **Tensor Dimension (Indo)** | `scientific_validation_results.json` | Cat B | Shape $(3, 3)$ | $3 \times 3$ positive-definite matrix |
| **Projected Coordinates $T$** | `src/asd_mcda/v2/metrics.py:227` | Cat A | $T = Z V_K \in \mathbb{R}^{n \times K}$ | Coordinate projection of candidates into PCA subspace |
| **Projected Ideal $t^+$** | `src/asd_mcda/v2/metrics.py:228` | Cat A | $t^+ = z^+ V_K \in \mathbb{R}^{1 \times K}$ | Subspace projection of standardized physical ideal |
| **Projected Anti-Ideal $t^-$** | `src/asd_mcda/v2/metrics.py:229` | Cat A | $t^- = z^- V_K \in \mathbb{R}^{1 \times K}$ | Subspace projection of standardized physical anti-ideal |
| **Lead Candidate Closeness** | `scientific_validation_results.json` | Cat B | Soluplus $C_L = 0.6864350839750771$ | Soluplus $C_L = 0.6864$ (Rank 1) |
| **Metric Comparison** | Methodology Baseline | Cat C / Cat D | Classical Euclidean distance vs. projected quadratic form | Classical TOPSIS uses Euclidean distance in the selected criterion representation, whereas SP-PRP-TOPSIS evaluates projected coordinates using $M_K = V_K^T W V_K$. |

---

### DEMO-05: v1.5 vs. v2 AHP Architectural Distinction
| Architectural Dimension | Historical v1.5 Architecture | Active v2 Production Engine | Authoritative Source Files |
| :--- | :--- | :--- | :--- |
| **Matrix Dimension** | $2 \times 2$ matrix | $4 \times 4$ matrix | `config/ahp/default_matrix.json` vs. `backend/services/engine_adapter.py:100` |
| **Criteria Evaluated** | Abstract eigenvectors: $\{PC_1, PC_2\}$ | Four defined compatibility criteria: $\{s_{\text{HSP}}, s_\chi, s_{\text{desc}}, s_{\text{GT}}\}$ | `default_matrix.json:4` vs. `engine_adapter.py:98` |
| **Pairwise Values** | $[[1.0, 2.0], [0.5, 1.0]]$ | $[[1.0, 2.0, 3.0, 2.0], [0.5, 1.0, 5.0, 2.0], \dots]$ | `default_matrix.json:5-8` vs. `engine_adapter.py:100-105` |
| **Dimensionality Selection**| Fixed $K=2$ regardless of data | Dynamic $K = \min \{k : \text{cumVar}(k) \ge 0.95\}$ | Commit `31eee4d` vs. `src/asd_mcda/v2/pca.py:53` |
| **Subspace Stability** | None (no eigengap governance) | Eigengap check ($\delta_K \ge 0.10, 0.03$) | None vs. `src/asd_mcda/v2/stability.py:38` |
| **Preference Domain** | Methodological limitation: assigning preferences to abstract PCs | Methodologically grounded: expert preference is expressed over the four defined compatibility criteria | `07_SOFTWARE_ARCHITECTURE/04_V2_VARIABLE_K_ENGINE.md` |

---

## 4. Source Conflict & Provenance Resolution Analysis

### 4.1 Master Map Approximations vs. Machine Float64
- **Observation:** In `00_MASTER_KNOWLEDGE_MAP/PHARMAPOLYSCOPE_MASTER_KNOWLEDGE_MAP.md` line 837, the Indomethacin eigenvalues are listed as `~2.09, ~1.17, ~0.74, ~0.001` and the gap is listed as `delta_3 = 0.738`.
- **Validation JSON Record:** The exact float64 values in `scientific_validation_results.json` are $\lambda_1 = 2.09086577..., \lambda_2 = 1.16789524..., \lambda_3 = 0.73977470..., \lambda_4 = 0.00146427..., \delta_3 = 0.73831043...$.
- **Resolution:** This is NOT a source conflict. The Master Map values represent rapid-fire oral whiteboard approximations (2 decimal places). The future whiteboard scripts will provide dual-tier representation:
  * Whiteboard drawing/sketching tier: $\sim 2.09, \sim 1.17, \sim 0.74, \sim 0.001$ with $\delta_3 \approx 0.738$.
  * Formal viva written precision: $\lambda_1 = 2.0909, \lambda_2 = 1.1679, \lambda_3 = 0.7398, \lambda_4 = 0.0015, \delta_3 = 0.7383$.

### 4.2 Legacy `default_matrix.json` vs. v2 Authoritative Matrix
- **Observation:** `config/ahp/default_matrix.json` contains a legacy `raw_pairwise_matrix` with entries $[[1.0, 1.0, 2.0, 2.0], [1.0, 1.0, 3.0, 2.0], \dots]$.
- **Production Truth:** Active v2 engine (`backend/services/engine_adapter.py:100-105`) hardcodes the authoritative matrix $[[1,2,3,2], [0.5,1,5,2], [1/3, 0.2, 1, 0.5], [0.5, 0.5, 2, 1]]$.
- **Resolution:** As established in Phase 1 correction and Module 12 audit, `default_matrix.json` is a historical legacy artifact preserved for backwards compatibility testing. The v2 production engine does NOT load `default_matrix.json`. The whiteboard scripts must exclusively draw the authoritative matrix from `engine_adapter.py`.

### 4.3 Unresolved Conflicts Status
- **Audit Result:** Zero unresolved conflicts exist across Tier 1 through Tier 4 sources. All numbers are 100% concordant with Module 12 Master Quantitative Ledger.

*End of MODULE_14_SOURCE_LOCK.md*
