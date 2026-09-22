# WHAT-IF EXPERIMENTS — PHASE 8
## Module 11 — Counterfactual Lab

**Document ID:** `WHAT_IF_EXPERIMENTS`  
**Module:** Module 11 — Counterfactual Lab (`11_COUNTERFACTUAL_LAB/`)  
**Phase:** Phase 8 Primary Curriculum Deliverable  
**Authoritative Plan Reference:** `11_COUNTERFACTUAL_LAB/PHASE_8_IMPLEMENTATION_PLAN.md`  
**Source-Lock Preflight:** `11_COUNTERFACTUAL_LAB/PHASE_8_SOURCE_LOCK_PREFLIGHT_FINAL.md` (`FINAL_STATUS = GO`)  
**Frozen Execution Dataset:** `11_COUNTERFACTUAL_LAB/PHASE_8_EXECUTION_RESULTS.json`  
**Post-Execution Forensic Audit:** `11_COUNTERFACTUAL_LAB/PHASE_8_POST_EXECUTION_FORENSIC_AUDIT.md` (`FINAL_STATUS = GO_TO_AUTHORING`)  
**Date:** September 23, 2026  

---

### 1. Purpose

This document compiles the exhaustive empirical dossiers for the twenty canonical What-If counterfactual experiments (CF-01 through CF-20) designed for the PharmaPolySCOPE Viva School. The purpose of this counterfactual laboratory is to systematically stress-test the active v2 decision pipeline by deliberately perturbing, removing, replacing, or pushing individual algorithmic, statistical, chemical, and preference components toward boundary conditions.

Specifically, this laboratory evaluates:
- **Sensitivity to dimensionality and subspace selection:** Quantifying the ranking, metric, and variance impact of retaining $K=1, 2, 3,$ or $4$ components, as well as bypassing principal component projection entirely.
- **Software governance response to instability:** Verifying that the governance layer halts execution when encountering near-degenerate eigenspaces ($\delta_K < 0.03$) or severe preference intransitivity ($CR \ge 0.08$).
- **Sensitivity to AHP preference weighting:** Evaluating the susceptibility of candidate rankings to equal weighting and inverted preference structures.
- **Consequences of criterion omission:** Probing three-criterion sub-manifolds in isolated pedagogical testbeds outside production code.
- **Chemical and input integrity behavior:** Testing pre-flight ingestion tripwires against syntactically malformed SMILES strings.
- **Statistical degeneracy behavior:** Testing standardization governance against invariant criterion columns and identical candidate libraries.
- **Stochastic versus deterministic behavior:** Delineating native deterministic point-estimates from full Monte Carlo uncertainty distributions.

> [!IMPORTANT]
> **Epistemic Scope:** All twenty scenarios documented herein are controlled **counterfactual computational experiments** executed against active software implementations or isolated mathematical testbeds. They measure the numerical sensitivity and governance compliance of the computational pipeline. They do **NOT** constitute empirical in vitro or in vivo formulation validation, physical miscibility testing, or laboratory polymer performance trials.

---

### 2. Source and Evidence Lock

This document represents an evidence report compiled directly from frozen experimental records. Every numerical scalar, vector, matrix, exception, stopping point, and diagnostic metric reported herein originates from:
1. [`PHASE_8_EXECUTION_RESULTS.json`](file:///C:/Users/Admin/Documents/GitHub/Knowledge-OS/Knowledge-OS/Areas/Research/Thesis/meow%20nadh%20karti%20kay/PharmaPolySCOPE_Viva_School/11_COUNTERFACTUAL_LAB/PHASE_8_EXECUTION_RESULTS.json) (Frozen Machine-Readable Execution Evidence)
2. [`PHASE_8_EXECUTION_LOG.md`](file:///C:/Users/Admin/Documents/GitHub/Knowledge-OS/Knowledge-OS/Areas/Research/Thesis/meow%20nadh%20karti%20kay/PharmaPolySCOPE_Viva_School/11_COUNTERFACTUAL_LAB/PHASE_8_EXECUTION_LOG.md) (Authoritative Execution Audit Log)
3. [`PHASE_8_POST_EXECUTION_FORENSIC_AUDIT.md`](file:///C:/Users/Admin/Documents/GitHub/Knowledge-OS/Knowledge-OS/Areas/Research/Thesis/meow%20nadh%20karti%20kay/PharmaPolySCOPE_Viva_School/11_COUNTERFACTUAL_LAB/PHASE_8_POST_EXECUTION_FORENSIC_AUDIT.md) (Pre-Authoring Certification)
4. `results/validation/v2_scientific_validation/scientific_validation_results.json` (Active Baseline Validation Record, SHA256: `43ed1f7d7ddc25e0...`)

Authoring of this document involves zero modification, recomputation, filtering, or selective reporting of the experimental dataset. The underlying execution artifacts are completely frozen.

---

### 3. Active v2 Baseline

The active PharmaPolySCOPE v2 architecture (`src/asd_mcda/v2/`) establishes the authoritative baseline for all counterfactual evaluations. The baseline pipeline operates under strict mathematical and governance contracts:
1. **Cohort Standardization (Step 1):** Standardizes raw decision scores $S \in \mathbb{R}^{m \times 4}$ into $Z \in \mathbb{R}^{m \times 4}$ using population standard deviation ($ddof = 0$):
   $$\mu_j = \frac{1}{m} \sum_{i=1}^m S_{ij}, \quad \sigma_j = \sqrt{\frac{1}{m} \sum_{i=1}^m (S_{ij} - \mu_j)^2}, \quad Z_{ij} = \frac{S_{ij} - \mu_j}{\sigma_j}$$
   If any criterion column exhibits $\sigma_j < 10^{-12}$, execution halts with `ZeroVarianceStandardizationError`.
2. **Correlation PCA & Dynamic K Selection (Step 2):** Evaluates the sample population correlation matrix $R = \frac{1}{m} Z^T Z$. Eigendecomposition $R V = V \Lambda$ is computed via `scipy.linalg.eigh(R)`. Eigenvalues are sorted descending ($\lambda_1 \ge \lambda_2 \ge \lambda_3 \ge \lambda_4$). Dynamic dimension $K$ is selected as the minimum integer $K \in \{1, \dots, 4\}$ satisfying:
   $$\frac{\sum_{k=1}^K \lambda_k}{\sum_{j=1}^4 \lambda_j} \ge \tau_{\text{var}} \quad (\tau_{\text{var}} = 0.95 \text{ by default})$$
3. **Subspace Stability Governance (Step 3):** Evaluates the boundary spectral gap $\delta_K = \lambda_K - \lambda_{K+1}$ for $K < 4$:
   - If $\delta_K < 0.03$: Execution halts with `DegenerateSubspaceBlockedError` (`BLOCKED`).
   - If $0.03 \le \delta_K < 0.10$: Emits telemetry warning (`WARNING`).
   - If $\delta_K \ge 0.10$: Certified as `STABLE`.
   - When $K = p = 4$: By contractual definition (`stability.py:70`), $\delta_4 = +\infty$ and status is `STABLE` (no truncation boundary exists).
4. **Physical AHP Preference Weighting (Step 4 & 5):** Solves the principal eigenvector $w$ of an externally supplied $4 \times 4$ pairwise comparison matrix $A$. The consistency ratio is evaluated as $CR = CI / 0.90$, where $CI = (\lambda_{\max} - 4)/3$. If $CR \ge 0.08$, execution halts with `AHPConsistencyViolationError` (`BLOCKED`).
5. **Subspace Metric Tensor Construction (Step 6 & 7):** Constructs the symmetric, positive-definite Riemannian metric tensor $M_K = V_K^T W V_K \in \mathbb{R}^{K \times K}$, where $W = \text{diag}(w_1, w_2, w_3, w_4)$ and $V_K \in \mathbb{R}^{4 \times K}$.
6. **Reference Projection & SP-PRP-TOPSIS (Step 8):** Projects standardized reference points $z^+$ and $z^-$ and candidate rows into $K$-dimensional coordinates: $t_i = z_i V_K, t^+ = z^+ V_K, t^- = z^- V_K$. Quadratic-form metric distances are evaluated as:
   $$D_i^+ = \sqrt{(t_i - t^+)^T M_K (t_i - t^+)}, \quad D_i^- = \sqrt{(t_i - t^-)^T M_K (t_i - t^-)}$$
   Relative closeness is evaluated as $C_L(i) = \frac{D_i^-}{D_i^+ + D_i^-}$.
7. **Chemical Structure Ingestion (Step 0):** Validates input SMILES strings via RDKit (`validate_chemical_structure()`). Corrupted strings halt execution at Step 0 with `RDKitParseFailureError`.

---

### 4. Experimental Taxonomy

The 20 counterfactual scenarios are classified into four authoritative execution classes established during the source-lock preflight audit:
- **Class A (Direct Live V2 Execution — 12 Scenarios):** Executed directly through active `VariableKEngine.evaluate()` or production module functions without any code modifications.
- **Class B (External Analytical / Test Harness — 3 Scenarios):** Executed via controlled test scripts in `scratch/` calling unmodified active sub-functions with synthetic boundary parameters.
- **Class C (Standalone Mathematical / Pedagogical Testbed — 4 Scenarios):** Evaluated in a dedicated linear algebra script outside production v2 to isolate the mathematical impact of criteria omission ($p=3$) without violating the $p=4$ production contract.
- **Class D (Step 1 Governance Block / Theoretical Limit — 1 Scenario):** Evaluates candidate invariance where active standardization strictly halts execution at Step 1, establishing that the theoretical unstandardized bound $C_L = 0.50$ is unreachable in production.

| CF-ID | Category | Counterfactual Scenario | Execution Class | Status |
| :--- | :--- | :--- | :---: | :---: |
| **CF-01** | Classical Unrotated Euclidean TOPSIS | Classical Unrotated Euclidean TOPSIS (PCA Bypassed) | **Class B** | `COMPLETED` |
| **CF-02** | Subspace Dimension Truncated to K=2 | Subspace Dimension Truncated to K=2 (Indomethacin) | **Class A** | `COMPLETED` |
| **CF-03** | Subspace Dimension Expanded to K=3 | Subspace Dimension Expanded to K=3 (Ibuprofen) | **Class A** | `COMPLETED` |
| **CF-04** | Full Rank Subspace Retention K=4 | Full Rank Subspace Retention K=4 (Indomethacin) | **Class A** | `COMPLETED` |
| **CF-05** | Critical Subspace Degeneracy | Critical Subspace Degeneracy (Eigengap < 0.03) | **Class B** | `BLOCKED` |
| **CF-06** | Marginal Subspace Stability | Marginal Subspace Stability (Eigengap in Warning Zone) | **Class B** | `COMPLETED` |
| **CF-07** | Inconsistent AHP Comparison Matrix | Inconsistent AHP Comparison Matrix (CR >= 0.08) | **Class A** | `BLOCKED` |
| **CF-08** | Omission of Hansen Solubility Parameter | Omission of Hansen Solubility Parameter (s_HSP) | **Class C** | `COMPLETED` |
| **CF-09** | Omission of Flory-Huggins Interaction Parameter | Omission of Flory-Huggins Interaction Parameter (s_chi) | **Class C** | `COMPLETED` |
| **CF-10** | Omission of Molecular Descriptors Score | Omission of Molecular Descriptors Score (s_desc) | **Class C** | `COMPLETED` |
| **CF-11** | Omission of Gordon-Taylor Glass Transition Score | Omission of Gordon-Taylor Glass Transition Score (s_GT) | **Class C** | `COMPLETED` |
| **CF-12** | Uniform AHP Weight Allocation | Uniform AHP Weight Allocation (w_j = 0.25) | **Class A** | `COMPLETED` |
| **CF-13** | Inverted AHP Preference Matrix | Inverted AHP Preference Matrix (Kinetic Priority) | **Class A** | `COMPLETED` |
| **CF-14** | Deterministic Native Execution | Deterministic Native Execution (Monte Carlo Bypassed) | **Class A** | `COMPLETED` |
| **CF-15** | Parametric Molecular Density Perturbation | Parametric Molecular Density Perturbation (+- 20%) | **Class A** | `COMPLETED` |
| **CF-16** | Chemical Structure Parsing Failure | Chemical Structure Parsing Failure (Malformed SMILES) | **Class A** | `BLOCKED` |
| **CF-17** | Single Invariant Criterion Column | Single Invariant Criterion Column (Zero Variance) | **Class A** | `BLOCKED` |
| **CF-18** | Near-Perfect Criteria Collinearity | Near-Perfect Criteria Collinearity (r_jk -> 1.0) | **Class A** | `COMPLETED` |
| **CF-19** | Identical Polymer Candidate Rows | Identical Polymer Candidate Rows (Complete Candidate Invariance) | **Class D** | `BLOCKED` |
| **CF-20** | Orthogonal Criteria Matrix | Orthogonal Criteria Matrix (R approx I_4, Dynamic K=4) | **Class A** | `COMPLETED` |

---

### 5. Individual Counterfactual Records

#### CF-01 — Classical Unrotated Euclidean TOPSIS (PCA Bypassed)

**Question**
What happens to multi-criteria candidate rankings and relative closeness when dimensionality reduction is bypassed entirely, evaluating TOPSIS directly in unrotated standardized space ($V = I_4, M_4 = W$)?

**Baseline:** Indomethacin K=3, M_K = V_K^T W V_K (CumVar 99.96%)

**Perturbation / Intervention:** Bypass PCA projection; evaluate in raw standardized space with V_4 = I_4 and M_4 = W

**Execution Class:** `Class B`

**Runtime Path / Analytical Path:** `scratch/run_cf_experiments.py calling v2 standardization.py, ahp.py, metrics.py`

**Stopping Point:** `Completed`

**Observed Result**
Execution completed successfully. Observed status: `COMPLETED`.

**Ranking / C_L**
- Relative Closeness $C_L$: `[0.699919, 0.687066, 0.627514, 0.611995, 0.577132]`
- Ordinal Ranks: `[1, 2, 3, 4, 5]`
- Kendall's $\tau$ vs Baseline: `0.9999999999999999` | Spearman's $\rho$: `0.9999999999999999`
- Top-1 Preserved: `True` | Max Rank Displacement $\Delta r_{\max}$: `0`
- Mean Absolute Closeness Error (MACE): `0.02091965650854628`

**Governance Behavior**
Governance criteria fully satisfied (`PASS`). Normal pipeline execution completed.

**Interpretation:** Bypassing PCA preserves the ordinal ranking of candidates (Kendall tau = 1.000) for this dataset, but shifts relative closeness values systematically upwards (MACE = 0.0215) due to diagonal weighting without off-diagonal covariance orthogonalization.

**Limitation:** Tested only on the Indomethacin 5-polymer cohort; in cohorts with higher collinearity, unrotated Euclidean distance double-counts redundant criteria.

---

#### CF-02 — Subspace Dimension Truncated to K=2 (Indomethacin)

**Question**
What is the effect of truncating Indomethacin's dynamic subspace from $K=3$ down to $K=2$, discarding the third principal component ($18.49\%$ of empirical variance)?

**Baseline:** Indomethacin Dynamic K=3 (CumVar 99.96%, delta_3 = 0.7383)

**Perturbation / Intervention:** Modulate variance_threshold to 0.80, forcing retention of only PC1 and PC2 (81.47% variance)

**Execution Class:** `Class A`

**Runtime Path / Analytical Path:** `engine.py:VariableKEngine.evaluate()`

**Stopping Point:** `Completed`

**Observed Result**
Execution completed successfully. Observed status: `COMPLETED`.
- Retained Dimension: $K = 2$
- Cumulative Variance: $81.47\%$
- Boundary Eigengap: $\delta_K = 0.42812053530690264$ (Status: `STABLE`)

**Ranking / C_L**
- Relative Closeness $C_L$: `[0.752686, 0.692033, 0.650892, 0.609024, 0.576617]`
- Ordinal Ranks: `[1, 2, 3, 4, 5]`
- Kendall's $\tau$ vs Baseline: `0.9999999999999999` | Spearman's $\rho$: `0.9999999999999999`
- Top-1 Preserved: `True` | Max Rank Displacement $\Delta r_{\max}$: `0`
- Mean Absolute Closeness Error (MACE): `0.03644470390984267`

**Governance Behavior**
Governance criteria fully satisfied (`PASS`). Normal pipeline execution completed.

**Interpretation:** Restricting the subspace to K=2 discards 18.49% of empirical variance. While candidate rank order remains topologically invariant (tau = 1.000), closeness values inflate significantly (Soluplus moves from 0.6864 to 0.7527) due to loss of the third principal dimension.

**Limitation:** Truncation at K=2 ignores PC3 which explains 18.49% of total variance, violating the 95% governance threshold.

---

#### CF-03 — Subspace Dimension Expanded to K=3 (Ibuprofen)

**Question**
What is the effect of forcing Ibuprofen's dynamic subspace from $K=2$ up to $K=3$, retaining the minor third principal component ($3.83\%$ of empirical variance)?

**Baseline:** Ibuprofen Dynamic K=2 (CumVar 96.10%, delta_2 = 0.8169)

**Perturbation / Intervention:** Modulate variance_threshold to 0.99, forcing retention of PC3 (capturing 99.93% variance)

**Execution Class:** `Class A`

**Runtime Path / Analytical Path:** `engine.py:VariableKEngine.evaluate()`

**Stopping Point:** `Completed`

**Observed Result**
Execution completed successfully. Observed status: `COMPLETED`.
- Retained Dimension: $K = 3$
- Cumulative Variance: $99.93\%$
- Boundary Eigengap: $\delta_K = 0.15035891396591416$ (Status: `STABLE`)

**Ranking / C_L**
- Relative Closeness $C_L$: `[0.603536, 0.512098, 0.4828, 0.457819, 0.382534]`
- Ordinal Ranks: `[1, 2, 3, 4, 5]`
- Kendall's $\tau$ vs Baseline: `0.9999999999999999` | Spearman's $\rho$: `0.9999999999999999`
- Top-1 Preserved: `True` | Max Rank Displacement $\Delta r_{\max}$: `0`
- Mean Absolute Closeness Error (MACE): `0.08289724700742325`

**Governance Behavior**
Governance criteria fully satisfied (`PASS`). Normal pipeline execution completed.

**Interpretation:** Forcing retention of PC3 for Ibuprofen reduces the boundary eigengap from 0.8169 down to 0.1504, although the subspace remains STABLE (>= 0.10). Ranks are invariant (tau = 1.000) and Top-1 (Eudragit E PO) is preserved.

**Limitation:** Captures 3.83% of marginal variance at the cost of a substantially smaller spectral eigengap.

---

#### CF-04 — Full Rank Subspace Retention K=4 (Indomethacin)

**Question**
What occurs when the subspace retention threshold is modulated to force full-rank retention ($K=p=4$) on Indomethacin, capturing $100\%$ of variance?

**Baseline:** Indomethacin K=3 (CumVar 99.96%)

**Perturbation / Intervention:** Modulate variance_threshold to 0.9999, forcing retention of all 4 components (100.00% variance)

**Execution Class:** `Class A`

**Runtime Path / Analytical Path:** `engine.py:VariableKEngine.evaluate()`

**Stopping Point:** `Completed`

**Observed Result**
Execution completed successfully. Observed status: `COMPLETED`.
- Retained Dimension: $K = 4$
- Cumulative Variance: $100.00\%$
- Boundary Eigengap: $\delta_K = inf$ (Status: `STABLE`)

**Ranking / C_L**
- Relative Closeness $C_L$: `[0.699919, 0.687066, 0.627514, 0.611995, 0.577132]`
- Ordinal Ranks: `[1, 2, 3, 4, 5]`
- Kendall's $\tau$ vs Baseline: `0.9999999999999999` | Spearman's $\rho$: `0.9999999999999999`
- Top-1 Preserved: `True` | Max Rank Displacement $\Delta r_{\max}$: `0`
- Mean Absolute Closeness Error (MACE): `0.02091965650854626`

**Governance Behavior**
Boundary contract at $K=p=4$ engaged: $\delta_4 = +\infty$ and status `STABLE` confirmed by implementation contract (`stability.py:70`).

**Interpretation:** Confirms the full-space metric reduction identity: under the tested full-dimensional configuration ($K=p=4$), because the eigenvector basis spans the complete space ($V_4 V_4^T = I_4$), the projected quadratic form algebraically reduces to the unrotated weighted Euclidean metric, and the computed $C_L$ values match the corresponding CF-01 values to full float64 numerical precision. Eigengap $\delta_4 = +\infty$ and stability status `STABLE` are established by contract (`stability.py:70`).

**Limitation:** Retains PC4 which represents only 0.0366% of variance (eigenvalue 0.001464), introducing near-collinear noise into distance calculations.

---

#### CF-05 — Critical Subspace Degeneracy (Eigengap < 0.03)

**Question**
How does the software governance layer respond when a candidate eigenvalue spectrum exhibits a critical spectral gap collapse ($\delta_K < 0.03$) across the truncation boundary?

**Baseline:** Indomethacin delta_3 = 0.7383 (STABLE)

**Perturbation / Intervention:** Synthetic eigenvalue spectrum with lambda_2 = 1.00, lambda_3 = 0.985 yielding delta_2 = 0.0150 < 0.03

**Execution Class:** `Class B`

**Runtime Path / Analytical Path:** `stability.py:evaluate_subspace_stability()`

**Stopping Point:** `Step 3 (HALTED)`

**Observed Result**
Execution strictly blocked at `Step 3 (HALTED)`. Intercepted exception `DegenerateSubspaceBlockedError` at `stability.py:88`.
Exception message: *"Boundary eigengap delta_2 = 0.0150 is below guardrail threshold 0.03 (BLOCKED). Subspace is near-degenerate; PCA truncation blocked."*

**Ranking / C_L**
`NOT OBSERVABLE UNDER CURRENT EXPERIMENT DESIGN` (Pipeline halted before distance or ranking evaluation).

**Governance Behavior**
Active governance tripwire engaged at `Step 3 (Subspace Stability Governance)`. Software halted to prevent emission of invalid or unvalidated numerical rankings.

**Interpretation:** Subspace stability governance successfully triggered DegenerateSubspaceBlockedError at Step 3. When two consecutive eigenvalues are nearly identical, the corresponding principal plane is indeterminate under rotation, and pipeline execution is halted to protect scientific validity.

**Limitation:** Synthetic eigenvalue spectrum designed to probe boundary behavior; does not simulate end-to-end chemical descriptors.

---

#### CF-06 — Marginal Subspace Stability (Eigengap in Warning Zone)

**Question**
How does the software governance layer respond when a candidate eigenvalue spectrum exhibits a marginal spectral gap ($\delta_K \in [0.03, 0.10)$) in the warning zone?

**Baseline:** Indomethacin delta_3 = 0.7383 (STABLE)

**Perturbation / Intervention:** Synthetic eigenvalue spectrum with lambda_2 = 1.00, lambda_3 = 0.935 yielding delta_2 = 0.0650 in [0.03, 0.10)

**Execution Class:** `Class B`

**Runtime Path / Analytical Path:** `stability.py:evaluate_subspace_stability()`

**Stopping Point:** `Step 3 (TELEMETRY LOGGED; Execution Allowed)`

**Observed Result**
Execution completed successfully. Observed status: `COMPLETED`.
- Retained Dimension: $K = 2$

**Ranking / C_L**
`NOT EVALUATED TO DISTANCE STAGE` (Scenario specifically evaluated spectral gap telemetry at Step 3).

**Governance Behavior**
Active governance issued formal `WARNING` telemetry for spectral gap in warning zone $[0.03, 0.10)$, permitting downstream calculation with audit logging.

**Interpretation:** Subspace stability governance logged a formal WARNING for delta_K = 0.0650 without terminating execution. This telemetry alerts downstream decision makers that the subspace orientation may exhibit heightened sensitivity to noise.

**Limitation:** Evaluated on synthetic eigenvalue inputs to test governance thresholds.

---

#### CF-07 — Inconsistent AHP Comparison Matrix (CR >= 0.08)

**Question**
How does the AHP preference engine respond when an expert comparison matrix exhibits severe transitivity violations resulting in $CR \ge 0.08$?

**Baseline:** Canonical AHP Matrix with CR = 0.049415 (ACCEPTED)

**Perturbation / Intervention:** Intransitive 4x4 pairwise comparison matrix yielding CR = 1.9982 >> 0.08

**Execution Class:** `Class A`

**Runtime Path / Analytical Path:** `ahp.py:solve_ahp_preference() via engine.py`

**Stopping Point:** `Step 4 (HALTED)`

**Observed Result**
Execution strictly blocked at `Step 4 (HALTED)`. Intercepted exception `AHPConsistencyViolationError` at `ahp.py:78`.
Exception message: *"AHP Consistency Ratio CR = 1.9982 exceeds project governance threshold 0.08 (BLOCKED). Preference matrix rejected."*

**Ranking / C_L**
`NOT OBSERVABLE UNDER CURRENT EXPERIMENT DESIGN` (Pipeline halted before distance or ranking evaluation).

**Governance Behavior**
Active governance tripwire engaged at `Step 4 (AHP Preference Consistency Governance)`. Software halted to prevent emission of invalid or unvalidated numerical rankings.

**Interpretation:** AHP governance tripwire functioned exactly as specified, halting execution before metric tensor construction when user preference judgments violated mathematical transitivity.

**Limitation:** Severely intransitive matrix chosen to unambiguously trigger the CR >= 0.08 governance barrier.

---

#### CF-08 — Omission of Hansen Solubility Parameter (s_HSP)

**Question**
How do candidate rankings shift in an isolated pedagogical testbed when the Hansen Solubility Parameter ($s_{\text{HSP}}$) is omitted from the criteria set ($p=3$)?

**Baseline:** Indomethacin 4-criteria baseline (M=4, K=3)

**Perturbation / Intervention:** Remove criterion 0 (Hansen Solubility Parameter (s_HSP)); evaluate 3-criteria manifold (s_chi, s_desc, s_GT)

**Execution Class:** `Class C`

**Runtime Path / Analytical Path:** `scratch/standalone_3crit_testbed (Pedagogical linear algebra outside production v2)`

**Stopping Point:** `Completed (Standalone)`

**Observed Result**
Execution completed successfully. Observed status: `COMPLETED`.
- Retained Dimension: $K = 3$
- Cumulative Variance: $100.00\%$

**Ranking / C_L**
- Relative Closeness $C_L$: `[0.630043, 0.820926, 0.427794, 0.481699, 0.295509]`
- Ordinal Ranks: `[2, 1, 4, 3, 5]`
- Kendall's $\tau$ vs Baseline: `0.6` | Spearman's $\rho$: `0.7999999999999999`
- Top-1 Preserved: `False` | Max Rank Displacement $\Delta r_{\max}$: `1`
- Mean Absolute Closeness Error (MACE): `0.14772318883527907`

**Governance Behavior**
Governance criteria fully satisfied (`PASS`). Normal pipeline execution completed.

**Interpretation:** Removing Hansen Solubility Parameter (s_HSP) reveals specific dimensional sensitivity. Mandatory note: This experiment probes the pedagogical impact of criteria omission; active production v2 strictly mandates p=4 and rejects 3-criteria input matrices.

**Limitation:** Evaluated strictly outside production v2 using normalized 3-criteria AHP sub-weights.

---

#### CF-09 — Omission of Flory-Huggins Interaction Parameter (s_chi)

**Question**
How do candidate rankings shift in an isolated pedagogical testbed when the Flory-Huggins interaction parameter ($s_\chi$) is omitted from the criteria set ($p=3$)?

**Baseline:** Indomethacin 4-criteria baseline (M=4, K=3)

**Perturbation / Intervention:** Remove criterion 1 (Flory-Huggins Interaction Parameter (s_chi)); evaluate 3-criteria manifold (s_HSP, s_desc, s_GT)

**Execution Class:** `Class C`

**Runtime Path / Analytical Path:** `scratch/standalone_3crit_testbed (Pedagogical linear algebra outside production v2)`

**Stopping Point:** `Completed (Standalone)`

**Observed Result**
Execution completed successfully. Observed status: `COMPLETED`.
- Retained Dimension: $K = 3$
- Cumulative Variance: $100.00\%$

**Ranking / C_L**
- Relative Closeness $C_L$: `[0.655543, 0.770347, 0.390346, 0.441232, 0.276779]`
- Ordinal Ranks: `[2, 1, 4, 3, 5]`
- Kendall's $\tau$ vs Baseline: `0.6` | Spearman's $\rho$: `0.7999999999999999`
- Top-1 Preserved: `False` | Max Rank Displacement $\Delta r_{\max}$: `1`
- Mean Absolute Closeness Error (MACE): `0.1518364553208061`

**Governance Behavior**
Governance criteria fully satisfied (`PASS`). Normal pipeline execution completed.

**Interpretation:** Removing Flory-Huggins Interaction Parameter (s_chi) reveals specific dimensional sensitivity. Mandatory note: This experiment probes the pedagogical impact of criteria omission; active production v2 strictly mandates p=4 and rejects 3-criteria input matrices.

**Limitation:** Evaluated strictly outside production v2 using normalized 3-criteria AHP sub-weights.

---

#### CF-10 — Omission of Molecular Descriptors Score (s_desc)

**Question**
How do candidate rankings shift in an isolated pedagogical testbed when the molecular descriptors score ($s_{\text{desc}}$) is omitted from the criteria set ($p=3$)?

**Baseline:** Indomethacin 4-criteria baseline (M=4, K=3)

**Perturbation / Intervention:** Remove criterion 2 (Molecular Descriptors Score (s_desc)); evaluate 3-criteria manifold (s_HSP, s_chi, s_GT)

**Execution Class:** `Class C`

**Runtime Path / Analytical Path:** `scratch/standalone_3crit_testbed (Pedagogical linear algebra outside production v2)`

**Stopping Point:** `Completed (Standalone)`

**Observed Result**
Execution completed successfully. Observed status: `COMPLETED`.
- Retained Dimension: $K = 2$
- Cumulative Variance: $99.93\%$

**Ranking / C_L**
- Relative Closeness $C_L$: `[0.733625, 0.767541, 0.452064, 0.468749, 0.0]`
- Ordinal Ranks: `[2, 1, 4, 3, 5]`
- Kendall's $\tau$ vs Baseline: `0.6` | Spearman's $\rho$: `0.7999999999999999`
- Top-1 Preserved: `False` | Max Rank Displacement $\Delta r_{\max}$: `1`
- Mean Absolute Closeness Error (MACE): `0.19204375246997268`

**Governance Behavior**
Governance criteria fully satisfied (`PASS`). Normal pipeline execution completed.

**Interpretation:** Removing Molecular Descriptors Score (s_desc) reveals specific dimensional sensitivity. Mandatory note: This experiment probes the pedagogical impact of criteria omission; active production v2 strictly mandates p=4 and rejects 3-criteria input matrices.

**Limitation:** Evaluated strictly outside production v2 using normalized 3-criteria AHP sub-weights.

---

#### CF-11 — Omission of Gordon-Taylor Glass Transition Score (s_GT)

**Question**
How do candidate rankings shift in an isolated pedagogical testbed when the Gordon-Taylor glass transition score ($s_{\text{GT}}$) is omitted from the criteria set ($p=3$)?

**Baseline:** Indomethacin 4-criteria baseline (M=4, K=3)

**Perturbation / Intervention:** Remove criterion 3 (Gordon-Taylor Glass Transition Score (s_GT)); evaluate 3-criteria manifold (s_HSP, s_chi, s_desc)

**Execution Class:** `Class C`

**Runtime Path / Analytical Path:** `scratch/standalone_3crit_testbed (Pedagogical linear algebra outside production v2)`

**Stopping Point:** `Completed (Standalone)`

**Observed Result**
Execution completed successfully. Observed status: `COMPLETED`.
- Retained Dimension: $K = 2$
- Cumulative Variance: $99.89\%$

**Ranking / C_L**
- Relative Closeness $C_L$: `[0.857406, 0.760622, 0.458593, 0.364631, 0.241334]`
- Ordinal Ranks: `[1, 2, 3, 4, 5]`
- Kendall's $\tau$ vs Baseline: `0.9999999999999999` | Spearman's $\rho$: `0.9999999999999999`
- Top-1 Preserved: `True` | Max Rank Displacement $\Delta r_{\max}$: `0`
- Mean Absolute Closeness Error (MACE): `0.18666698090473774`

**Governance Behavior**
Governance criteria fully satisfied (`PASS`). Normal pipeline execution completed.

**Interpretation:** Removing Gordon-Taylor Glass Transition Score (s_GT) reveals specific dimensional sensitivity. Mandatory note: This experiment probes the pedagogical impact of criteria omission; active production v2 strictly mandates p=4 and rejects 3-criteria input matrices.

**Limitation:** Evaluated strictly outside production v2 using normalized 3-criteria AHP sub-weights.

---

#### CF-12 — Uniform AHP Weight Allocation (w_j = 0.25)

**Question**
What happens to candidate rankings and relative closeness when AHP preference weights are replaced with equal weights ($w_j = 0.25$ for all $j$)?

**Baseline:** Canonical AHP Weights [0.4077, 0.3244, 0.0922, 0.1757] favoring thermodynamics

**Perturbation / Intervention:** Uniform comparison matrix A = 1_{4x4} yielding w = [0.25, 0.25, 0.25, 0.25]

**Execution Class:** `Class A`

**Runtime Path / Analytical Path:** `engine.py:VariableKEngine.evaluate()`

**Stopping Point:** `Completed`

**Observed Result**
Execution completed successfully. Observed status: `COMPLETED`.
- Physical AHP Weights: `[0.25, 0.25, 0.25, 0.25]` ($CR = 0.000000$)

**Ranking / C_L**
- Relative Closeness $C_L$: `[0.56718, 0.579724, 0.505861, 0.485056, 0.499082]`
- Ordinal Ranks: `[2, 1, 3, 5, 4]`
- Kendall's $\tau$ vs Baseline: `0.6` | Spearman's $\rho$: `0.7999999999999999`
- Top-1 Preserved: `False` | Max Rank Displacement $\Delta r_{\max}$: `1`
- Mean Absolute Closeness Error (MACE): `0.09242512170874255`

**Governance Behavior**
Governance criteria fully satisfied (`PASS`). Normal pipeline execution completed.

**Interpretation:** Allocating equal weights (w_j = 0.25) shifts the diagonal metric tensor W from canonical preference. Soluplus scores high on criteria 0 and 1 (s_HSP = 0.797, s_chi = 0.826) but zero on criterion 3 (s_GT = 0.0), whereas HPMC E5 scores high on criterion 3 (s_GT = 0.973). Reducing the relative weighting of criteria 0 and 1 while increasing criterion 3 decreases Soluplus relative closeness, producing an observed rank inversion (HPMC E5 rank 1, Soluplus rank 2). This reflects mathematical sensitivity to criteria weighting, not physical formulation failure.

**Limitation:** Equal weighting treats all criteria as having identical importance, ignoring structured domain preference elicitation.

---

#### CF-13 — Inverted AHP Preference Matrix (Kinetic Priority)

**Question**
What happens to candidate rankings when AHP preference weights are inverted to prioritize kinetic glass transition criteria ($s_{\text{GT}}$) over thermodynamic criteria ($s_{\text{HSP}}$)?

**Baseline:** Canonical AHP Weights favoring HSP over Gordon-Taylor

**Perturbation / Intervention:** Inverted reciprocal matrix prioritizing Gordon-Taylor (w_GT = 0.4077, w_HSP = 0.1757)

**Execution Class:** `Class A`

**Runtime Path / Analytical Path:** `engine.py:VariableKEngine.evaluate()`

**Stopping Point:** `Completed`

**Observed Result**
Execution completed successfully. Observed status: `COMPLETED`.
- Physical AHP Weights: `[0.1757, 0.3244, 0.0922, 0.4077]` ($CR = 0.049415$)

**Ranking / C_L**
- Relative Closeness $C_L$: `[0.648333, 0.654068, 0.579153, 0.568038, 0.52873]`
- Ordinal Ranks: `[2, 1, 3, 4, 5]`
- Kendall's $\tau$ vs Baseline: `0.7999999999999999` | Spearman's $\rho$: `0.8999999999999998`
- Top-1 Preserved: `False` | Max Rank Displacement $\Delta r_{\max}$: `1`
- Mean Absolute Closeness Error (MACE): `0.024141288203331678`

**Governance Behavior**
Governance criteria fully satisfied (`PASS`). Normal pipeline execution completed.

**Interpretation:** Permuting preference weights to prioritize criterion 3 (s_GT, w_3 = 0.4077) over criterion 0 (s_HSP, w_0 = 0.1757) increases metric sensitivity to glass transition temperature scores, elevating HPMC E5 (s_GT = 0.973, C_L = 0.6541) over Soluplus (s_GT = 0.0, C_L = 0.6483). Because A_inv is a permutation of A_CANONICAL, consistency ratio CR = 0.049415 is preserved exactly. This demonstrates mathematical rank sensitivity to criteria prioritization.

**Limitation:** Represents an extreme preference weighting scenario prioritizing criterion 3 (s_GT) over criterion 0 (s_HSP).

---

#### CF-14 — Deterministic Native Execution (Monte Carlo Bypassed)

**Question**
How do deterministic point-estimate rankings produced by native `VariableKEngine` execution compare to the median and expected rankings from full Monte Carlo stochastic simulation ($N=10,000$)?

**Baseline:** Full Monte Carlo Simulation (N=10,000 replicates)

**Perturbation / Intervention:** Direct execution of VariableKEngine.evaluate() without stochastic perturbation loops

**Execution Class:** `Class A`

**Runtime Path / Analytical Path:** `engine.py:VariableKEngine.evaluate()`

**Stopping Point:** `Completed`

**Observed Result**
Execution completed successfully. Observed status: `COMPLETED`.

**Ranking / C_L**
- Relative Closeness $C_L$: `[0.686435, 0.673146, 0.606247, 0.587584, 0.545616]`
- Ordinal Ranks: `[]`
- Kendall's $\tau$ vs Baseline: `N/A` | Spearman's $\rho$: `N/A`
- Top-1 Preserved: `N/A` | Max Rank Displacement $\Delta r_{\max}$: `N/A`
- Mean Absolute Closeness Error (MACE): `N/A`

**Governance Behavior**
Governance criteria fully satisfied (`PASS`). Normal pipeline execution completed.

**Interpretation:** Deterministic point execution produces ordinal ranks [1, 2, 3, 4, 5] identical to the median Monte Carlo ranks. However, deterministic mode omits the ranking confidence intervals (e.g. Soluplus P(Top-1) = 55.51% vs HPMC E5 P(Top-1) = 38.64%).

**Limitation:** Omits stochastic input uncertainty, treating physical measurements as noise-free constants.

---

#### CF-15 — Parametric Molecular Density Perturbation (+- 20%)

**Question**
How sensitive are multi-criteria scores and rankings to a continuous $\pm 20\%$ parametric variation in the input active drug density ($\rho$)?

**Baseline:** True Indomethacin Density rho = 1.37 g/cm^3

**Perturbation / Intervention:** Modulate density by -20% (1.096 g/cm^3) and +20% (1.644 g/cm^3), scaling molar volume and s_chi

**Execution Class:** `Class A`

**Runtime Path / Analytical Path:** `engine.py:VariableKEngine.evaluate()`

**Stopping Point:** `Completed`

**Observed Result**
Execution completed successfully. Observed status: `COMPLETED`.

**Ranking / C_L**
- Closeness at $\rho - 20\%$: `[0.670751, 0.656385, 0.585902, 0.566321, 0.522257]` (Ranks: `[1, 2, 3, 4, 5]`)
- Closeness at $\rho + 20\%$: `[0.700734, 0.688424, 0.624753, 0.606925, 0.567021]` (Ranks: `[1, 2, 3, 4, 5]`)
- Kendall's $\tau$ (both conditions): `1.000` | Top-1 Preserved: `True`

**Governance Behavior**
Governance criteria fully satisfied (`PASS`). Normal pipeline execution completed.

**Interpretation:** A +-20% shift in active drug density produces smooth, monotonic changes in relative closeness (+-0.015 to +-0.021) without altering candidate ordinal ranks (Kendall tau = 1.000). The pipeline is robust to realistic experimental density measurement noise.

**Limitation:** Models density impact primarily through molar volume and Flory-Huggins interaction scaling.

---

#### CF-16 — Chemical Structure Parsing Failure (Malformed SMILES)

**Question**
How does the chemical ingestion pre-flight gate respond when an unparseable or syntactically corrupted SMILES string is supplied to the pipeline?

**Baseline:** Valid Indomethacin SMILES CC1=C(C2=C(N1C(=O)C3=CC=C(C=C3)Cl)C=CC(=C2)OC)CC(=O)O

**Perturbation / Intervention:** Supplying syntactically corrupted SMILES string 'CC(=O)O[INVALID]'

**Execution Class:** `Class A`

**Runtime Path / Analytical Path:** `chemistry.py:validate_chemical_structure() via engine.py:43`

**Stopping Point:** `Step 0 (HALTED)`

**Observed Result**
Execution strictly blocked at `Step 0 (HALTED)`. Intercepted exception `RDKitParseFailureError` at `chemistry.py:84`.
Exception message: *"RDKit failed to parse chemical structure from SMILES: 'CC(=O)O[INVALID]'."*

**Ranking / C_L**
`NOT OBSERVABLE UNDER CURRENT EXPERIMENT DESIGN` (Pipeline halted before distance or ranking evaluation).

**Governance Behavior**
Active governance tripwire engaged at `Step 0 (Chemical Structure Pre-Flight Gate)`. Software halted to prevent emission of invalid or unvalidated numerical rankings.

**Interpretation:** Chemical structure ingestion gate intercepted the malformed SMILES string and raised RDKitParseFailureError at Step 0, preventing corrupt chemical data from propagating into descriptor computation.

**Limitation:** Tests syntax parsing rejection; does not evaluate semantic validity of physically unstable molecules.

---

#### CF-17 — Single Invariant Criterion Column (Zero Variance)

**Question**
How does the standardization engine respond when an input decision matrix contains an invariant criterion column exhibiting zero variance ($\sigma_j = 0.0$)?

**Baseline:** All criteria columns exhibit positive standard deviation (sigma_j > 0.05)

**Perturbation / Intervention:** Inject constant column S_{i,1} = 0.50 for all i, causing sigma_1 = 0.0

**Execution Class:** `Class A`

**Runtime Path / Analytical Path:** `standardization.py:standardize_cohort() via engine.py`

**Stopping Point:** `Step 1 (HALTED)`

**Observed Result**
Execution strictly blocked at `Step 1 (HALTED)`. Intercepted exception `ZeroVarianceStandardizationError` at `standardization.py:78`.
Exception message: *"Criterion at index 1 exhibits zero or non-positive variance: sigma=0.000000e+00 <= 0."*

**Ranking / C_L**
`NOT OBSERVABLE UNDER CURRENT EXPERIMENT DESIGN` (Pipeline halted before distance or ranking evaluation).

**Governance Behavior**
Active governance tripwire engaged at `Step 1 (Cohort Standardization)`. Software halted to prevent emission of invalid or unvalidated numerical rankings.

**Interpretation:** Standardization governance strictly blocked pipeline execution at Step 1 upon detecting an invariant criterion column (sigma_1 = 0.0). Division by zero is prevented and no degenerate z-scores are produced.

**Limitation:** Probes an engineered failure mode to verify defense-in-depth numerical governance.

---

#### CF-18 — Near-Perfect Criteria Collinearity (r_jk -> 1.0)

**Question**
How does the spectral decomposition and dynamic dimension engine respond when criteria columns exhibit near-perfect mutual collinearity ($r_{jk} \to 1.0$)?

**Baseline:** Indomethacin pairwise correlations r in [-0.60, 0.82] spanning 3 principal components

**Perturbation / Intervention:** Synthetic 4-criteria cohort where all columns are linear transforms of a single underlying signal

**Execution Class:** `Class A`

**Runtime Path / Analytical Path:** `engine.py:VariableKEngine.evaluate()`

**Stopping Point:** `Completed`

**Observed Result**
Execution completed successfully. Observed status: `COMPLETED`.
- Retained Dimension: $K = 1$
- Cumulative Variance: $100.00\%$
- Boundary Eigengap: $\delta_K = 3.9999999999999982$ (Status: `STABLE`)

**Ranking / C_L**
- Relative Closeness $C_L$: `[0.883351, 0.691043, 0.498735, 0.306427, 0.114119]`
- Ordinal Ranks: `[1, 2, 3, 4, 5]`
- Kendall's $\tau$ vs Baseline: `N/A` | Spearman's $\rho$: `N/A`
- Top-1 Preserved: `N/A` | Max Rank Displacement $\Delta r_{\max}$: `N/A`
- Mean Absolute Closeness Error (MACE): `N/A`

**Governance Behavior**
Governance criteria fully satisfied (`PASS`). Normal pipeline execution completed.

**Interpretation:** When all four criteria are mutually collinear, spectral decomposition concentrates 100% of variance into lambda_1 (approx 4.0). Dynamic K correctly collapses to K=1, and eigengap delta_1 approx 4.0 ensures robust STABLE execution without matrix inversion failure.

**Limitation:** Constructed synthetic cohort demonstrating spectral dimensional collapse under severe collinearity.

---

#### CF-19 — Identical Polymer Candidate Rows (Complete Candidate Invariance)

**Question**
What occurs when all candidate polymers in a screening cohort are assigned completely identical score rows across all criteria?

**Baseline:** Differentiated candidate scores with non-zero cohort variance across all criteria

**Perturbation / Intervention:** All 5 candidate polymers assigned identical scores, causing sigma_j = 0.0 for all j in {0,1,2,3}

**Execution Class:** `Class D`

**Runtime Path / Analytical Path:** `standardization.py:standardize_cohort() via engine.py`

**Stopping Point:** `Step 1 (HALTED)`

**Observed Result**
Execution strictly blocked at `Step 1 (HALTED)`. Intercepted exception `ZeroVarianceStandardizationError` at `standardization.py:78`.
Exception message: *"Criterion at index 0 exhibits zero or non-positive variance: sigma=0.000000e+00 <= 0."*

**Ranking / C_L**
`NOT OBSERVABLE UNDER CURRENT EXPERIMENT DESIGN` (Pipeline halted before distance or ranking evaluation).

**Governance Behavior**
Active governance tripwire engaged at `Step 1 (Cohort Standardization)`. Software halted to prevent emission of invalid or unvalidated numerical rankings.

**Interpretation:** Identical candidate scores cause cohort standard deviations to collapse to zero across all columns. Active v2 standardization strictly halts at Step 1 with ZeroVarianceStandardizationError. The theoretical distance-collapse result C_L = 0.500 is an unstandardized mathematical limit that production v2 never reaches.

**Limitation:** Tests software governance against uninformative candidate libraries.

---

#### CF-20 — Orthogonal Criteria Matrix (R approx I_4, Dynamic K=4)

**Question**
How does the dynamic dimension selection algorithm respond when all criteria are mutually orthogonal (identity correlation matrix $R \approx I_4$)?

**Baseline:** Indomethacin K=3, Ibuprofen K=2 (criteria exhibit mutual correlation)

**Perturbation / Intervention:** Orthogonal candidate matrix yielding identity correlation matrix R approx I_4 with flat eigenvalues lambda_j approx 1.0

**Execution Class:** `Class A`

**Runtime Path / Analytical Path:** `engine.py:VariableKEngine.evaluate()`

**Stopping Point:** `Completed`

**Observed Result**
Execution completed successfully. Observed status: `COMPLETED`.
- Retained Dimension: $K = 4$
- Cumulative Variance: $100.00\%$
- Boundary Eigengap: $\delta_K = inf$ (Status: `STABLE`)

**Ranking / C_L**
- Relative Closeness $C_L$: `[0.660192, 0.473077, 0.438673, 0.486861, 0.44992]`
- Ordinal Ranks: `[1, 3, 5, 2, 4]`
- Kendall's $\tau$ vs Baseline: `N/A` | Spearman's $\rho$: `N/A`
- Top-1 Preserved: `N/A` | Max Rank Displacement $\Delta r_{\max}$: `N/A`
- Mean Absolute Closeness Error (MACE): `N/A`

**Governance Behavior**
Boundary contract at $K=p=4$ engaged: $\delta_4 = +\infty$ and status `STABLE` confirmed by implementation contract (`stability.py:70`).

**Interpretation:** When criteria are perfectly uncorrelated, each dimension explains an equal share of variance (25%). Dynamic K automatically expands to K=4 to satisfy the >= 95% variance requirement. Eigengap delta_4 = +infinity confirms STABLE full-space execution by contract.

**Limitation:** Synthetically constructed orthogonal Helmert design demonstrating maximal dimensionality expansion.

---

## 6. Cross-Scenario Findings

### 6.1 Dimensionality and PCA Subspace (CF-01, CF-02, CF-03, CF-04, CF-20)
- **Observed Result:** Bypassing PCA (CF-01) or retaining full space (CF-04) inflates relative closeness values ($C_L$ increases by $+0.013$ to $+0.032$ across candidates) while preserving ordinal rankings ($\tau = 1.000$). Forcing $K=2$ on Indomethacin (CF-02) discards $18.49\%$ of empirical variance, inflating $C_L$ further (Soluplus moves from $0.6864$ to $0.7527$). Expanding to $K=3$ on Ibuprofen (CF-03) captures marginal variance ($3.83\%$) and reduces the eigengap from $0.8169$ to $0.1504$. Under orthogonal criteria (CF-20), dynamic $K$ automatically expands to $K=4$ ($100\%$ variance).
- **Mathematical Implication:** Confirms the full-space metric reduction identity: when $K=p=4$, because $V_4 V_4^T = I_4$, projected distance $(z_i - z^+)^T V_4 (V_4^T W V_4) V_4^T (z_i - z^+)$ reduces algebraically to the unrotated weighted Euclidean distance $(z_i - z^+)^T W (z_i - z^+)$. PCA subspace projection acts as a variance filter that removes residual directions and orthogonalizes correlated criteria.
- **Scientific Limitation:** Retaining $K < p$ discards empirical variance; the decision to truncate must be governed strictly by empirical cumulative variance ($\ge 95\%$) and spectral gap stability ($\delta_K \ge 0.10$). Subspace dimension $K$ represents coordinate reduction, not candidate clustering.

### 6.2 Stability and Governance (CF-05, CF-06, CF-07)
- **Observed Result:** Synthetic boundary gap $\delta_2 = 0.0150 < 0.03$ (CF-05) halted execution at Step 3 with `DegenerateSubspaceBlockedError`. Gap $\delta_2 = 0.0650$ (CF-06) logged a `WARNING` and completed. Intransitive AHP matrix with $CR = 1.9982$ (CF-07) halted execution at Step 4 with `AHPConsistencyViolationError`.
- **Mathematical Implication:** Verifies that the software governance layer enforces strict mathematical tripwires. When consecutive eigenvalues are near-coincident, principal axes are rotationally indeterminate; halting execution protects downstream geometric validity. Halting on $CR \ge 0.08$ prevents arbitrary or inconsistent user preferences from distorting the metric tensor.
- **Scientific Limitation:** Governance blocking demonstrates software reliability against degenerate numerical conditions. It does not provide information regarding physical polymer-drug formulation behavior.

### 6.3 AHP Preference Sensitivity (CF-12, CF-13)
- **Observed Result:** Uniform AHP weighting ($w_j = 0.25$, CF-12) produces an observed rank inversion: HPMC E5 takes Rank 1 ($C_L = 0.5797$) and Soluplus takes Rank 2 ($C_L = 0.5672$). Inverted AHP weighting prioritizing criterion 3 ($w_3 = 0.4077$, CF-13) similarly produces Rank 1 for HPMC E5 ($C_L = 0.6541$) over Soluplus ($C_L = 0.6483$).
- **Mathematical Implication:** Candidate rankings are mathematically sensitive to the relative weighting of criteria. Soluplus scores high on criteria 0 and 1 ($s_{\text{HSP}} = 0.797, s_\chi = 0.826$) but zero on criterion 3 ($s_{\text{GT}} = 0.0$). HPMC E5 scores high on criterion 3 ($s_{\text{GT}} = 0.973$). Reducing weights on criteria 0 and 1 while increasing criterion 3 decreases Soluplus's composite anti-ideal distance relative to HPMC E5, inverting their ranks.
- **Scientific Limitation:** This rank shift demonstrates sensitivity to mathematical weighting. It does NOT experimentally prove that HPMC E5 is physically superior, or that Soluplus fails in formulation.

### 6.4 Criterion-Omission Testbeds (CF-08, CF-09, CF-10, CF-11)
- **Observed Result:** In standalone $p=3$ mathematical testbeds, omitting HSP (CF-08), Flory-Huggins $\chi$ (CF-09), or Descriptors (CF-10) causes HPMC E5 to take Rank 1 over Soluplus (Rank 2). Omitting Gordon-Taylor $T_g$ (CF-11) maintains Soluplus at Rank 1 ($C_L = 0.8574$).
- **Mathematical Implication:** Confirms that Soluplus's baseline Rank 1 status depends on the simultaneous presence of thermodynamic solubility criteria ($s_{\text{HSP}}$ and $s_\chi$). When either is omitted, HPMC E5's high glass transition score dominates the reduced coordinate space.
- **Scientific Limitation:** These experiments were executed strictly outside production v2 using normalized 3-criteria AHP weights ($RI_3 = 0.58$). Active production v2 enforces $p=4$; arbitrary criterion omission is not supported in production.

### 6.5 Chemistry and Input Integrity (CF-15, CF-16)
- **Observed Result:** Corrupted SMILES string `'CC(=O)O[INVALID]'` (CF-16) was blocked at Step 0 with `RDKitParseFailureError`. Modulating input drug density by $\pm 20\%$ (CF-15) produced smooth, monotonic shifts in $C_L$ ($\pm 0.015$ to $\pm 0.021$) without any rank disruption ($\tau = 1.000$).
- **Mathematical Implication:** Demonstrates robust input gatekeeping against invalid chemical syntax (preventing corruption of downstream molecular graphs) and smooth mathematical stability under continuous parameter perturbations.
- **Scientific Limitation:** CF-16 verifies software string parsing, not chemical instability. CF-15 reflects mathematical sensitivity to estimated density, not experimental polymorphism.

### 6.6 Statistical Degeneracy (CF-17, CF-18, CF-19)
- **Observed Result:** Invariant criterion column ($\sigma_1 = 0.0$, CF-17) and identical candidate rows ($\sigma_j = 0.0$ for all $j$, CF-19) both halted execution at Step 1 with `ZeroVarianceStandardizationError`. Near-perfect collinearity ($r_{jk} \to 1.0$, CF-18) collapsed the dynamic subspace to $K=1$ ($100\%$ variance, $\delta_1 \approx 4.0$).
- **Mathematical Implication:** Standardization governance strictly prevents division by zero ($0/0$) when cohort variance is zero. When criteria are perfectly collinear, spectral decomposition concentrates all variance into the first principal component, allowing robust $K=1$ execution without matrix singularity.
- **Scientific Limitation:** CF-19 proves that active production v2 halts at Step 1 and NEVER emits $C_L = 0.500$. The theoretical distance-collapse result $C_L = 0.500$ exists purely as an unstandardized mathematical limit.

### 6.7 Stochasticity (CF-14)
- **Observed Result:** Native deterministic execution of `VariableKEngine.evaluate()` produced candidate ranks `[1, 2, 3, 4, 5]`, in exact agreement with the median ranks from a $N=10,000$ Monte Carlo stochastic simulation.
- **Mathematical Implication:** Deterministic point-estimates correspond to the distribution center of the stochastic model when symmetric measurement noise is applied.
- **Scientific Limitation:** Deterministic execution omits ranking probability distributions and confidence intervals (e.g. Soluplus Top-1 probability of $55.51\%$ vs HPMC E5 of $38.64\%$).

---

### 7. Governance Tripwires

The five intentionally blocked counterfactual scenarios demonstrate the defensive architecture of the active v2 software:

| Scenario | Governance Trigger | Actual Blocking / Warning Behavior | Intercepted Exception / Status | What Became Unobservable |
| :--- | :--- | :--- | :--- | :--- |
| **CF-05** | Spectral Gap $\delta_K < 0.03$ | Pipeline halts at Step 3 before metric tensor construction | `DegenerateSubspaceBlockedError` (`stability.py:88`) | Metric tensor, projected distances, closeness $C_L$, candidate rankings |
| **CF-06** | Spectral Gap $\delta_K \in [0.03, 0.10)$ | Emits formal warning telemetry; execution permitted to proceed | `WARNING` status logged (`stability.py:81`) | Downstream calculation permitted; warning flag logged in audit trail |
| **CF-07** | AHP Transitivity $CR \ge 0.08$ | Pipeline halts at Step 4 before metric tensor weighting | `AHPConsistencyViolationError` (`ahp.py:78`) | Metric tensor, reference projections, closeness $C_L$, candidate rankings |
| **CF-16** | Corrupted SMILES syntax | Pipeline halts at Step 0 before descriptor computation | `RDKitParseFailureError` (`chemistry.py:84`) | Molecular descriptors, scoring matrix $S$, all downstream steps |
| **CF-17** | Invariant criterion column | Pipeline halts at Step 1 before correlation matrix evaluation | `ZeroVarianceStandardizationError` (`standardization.py:78`) | Z-scores, correlation matrix $R$, eigenvalues, metric tensor, rankings |
| **CF-19** | Identical candidate rows | Pipeline halts at Step 1 before correlation matrix evaluation | `ZeroVarianceStandardizationError` (`standardization.py:78`) | Z-scores, eigenvalues, metric tensor, distance vectors, closeness $C_L$ |

---

### 8. Rank-Inversion Findings

Counterfactual execution revealed two distinct classes of ranking inversions relative to the canonical Indomethacin baseline (Soluplus Rank 1, HPMC E5 Rank 2):

#### 8.1 Preference Weight Inversions (CF-12 & CF-13)
1. **Uniform Weighting (CF-12):**  
   Assigning equal weights ($w_j = 0.25$) to all four criteria caused HPMC E5 to achieve Rank 1 ($C_L = 0.579724$) and Soluplus to drop to Rank 2 ($C_L = 0.567180$). Kendall's $\tau$ dropped to $0.600$.
2. **Inverted Kinetic Weighting (CF-13):**  
   Inverting AHP comparison judgments to prioritize criterion 3 ($w_3 = 0.407675$) over criterion 0 ($w_0 = 0.175730$) similarly elevated HPMC E5 to Rank 1 ($C_L = 0.654068$) and reduced Soluplus to Rank 2 ($C_L = 0.648333$). Kendall's $\tau$ dropped to $0.800$.

#### 8.2 Criterion Omission Inversions (CF-08, CF-09, CF-10)
In the standalone three-criterion mathematical testbed, omitting criterion 0 ($s_{\text{HSP}}$, CF-08), criterion 1 ($s_\chi$, CF-09), or criterion 2 ($s_{\text{desc}}$, CF-10) caused HPMC E5 to take Rank 1 ($C_L \in [0.7675, 0.8209]$) over Soluplus ($C_L \in [0.6300, 0.7336]$). Soluplus retained Rank 1 only when criterion 3 ($s_{\text{GT}}$) was omitted (CF-11, $C_L = 0.857406$).

> [!NOTE]
> **Methodological Demarcation:** These rank inversions document mathematical sensitivity to criteria weighting and criteria selection within multi-criteria decision geometry. They do **NOT** constitute experimental evidence that HPMC E5 is physically superior, or that Soluplus fails in laboratory formulations.

---

### 9. What These Experiments Establish

The Phase 8 counterfactual experiments establish that:
1. **Under the tested full-dimensional configuration ($K=p=4$), the metric tensor reduces algebraically to the unrotated weighted Euclidean metric**, confirming the full-space metric reduction identity to full numerical precision ($|C_{L, \text{CF04}} - C_{L, \text{CF01}}| < 10^{-15}$).
2. **The active v2 software strictly halts execution** when input SMILES strings are unparseable (`RDKitParseFailureError`), when criteria exhibit zero variance (`ZeroVarianceStandardizationError`), when spectral gaps are near-degenerate (`DegenerateSubspaceBlockedError`), and when preference judgments violate transitivity (`AHPConsistencyViolationError`).
3. **Dynamic dimension selection collapses to $K=1$ under perfect collinearity and expands to $K=4$ under perfect orthogonality**, confirming adaptive dimensionality behavior across extreme correlation boundaries.
4. **Candidate rankings exhibit mathematical sensitivity to preference weight allocation**, demonstrating that Soluplus's top ranking requires prioritizing thermodynamic miscibility criteria ($s_{\text{HSP}}, s_\chi$) over glass transition anti-plasticization ($s_{\text{GT}}$).
5. **Native deterministic execution yields ordinal rankings identical to the median rankings of a $N=10,000$ Monte Carlo uncertainty simulation** for the tested Indomethacin cohort.

---

### 10. What These Experiments Do Not Establish

To maintain strict scientific integrity, it is explicitly noted that these computational experiments do **NOT** establish:
- **Empirical miscibility or thermodynamic phase behavior** in physical polymer-drug blends.
- **Physical amorphous solid dispersion stability** during storage or accelerated aging.
- **Dissolution rate, supersaturation maintenance, or in vivo bioavailability** enhancement.
- **Experimental glass transition temperatures ($T_g$)** or polymer-drug interaction parameters.
- **Causal formulation mechanisms** operating in hot-melt extrusion or spray drying.
- **Clinical efficacy, safety, or pharmacokinetic bioequivalence**.
- **Absolute physical superiority of any polymer candidate** in a laboratory setting.

---

### 11. Reproducibility

Every quantitative value in this report is fully reproducible from the frozen execution records:
- **Execution Run ID:** `PHASE_8_STEP_2_AUTHORITATIVE_RUN`
- **Python Environment:** Python `3.14.5`, NumPy `2.4.6`, SciPy `1.18.0`, RDKit `2026.03.5`
- **Authoritative Validation Artifact:** `results/validation/v2_scientific_validation/scientific_validation_results.json` (SHA256: `43ed1f7d7ddc25e0c490cc086f29245861da159444683b1d2f8b25ab6c90a56e`)
- **Frozen Machine-Readable Data:** `11_COUNTERFACTUAL_LAB/PHASE_8_EXECUTION_RESULTS.json` (SHA256 verified)
- **Codebase Modifications:** 0 modified files in `asd_framework/` (`PRODUCTION_CODE_MODIFIED = NO`)
- **Knowledge-OS Modifications:** Modules 01–10 untouched (`MODULES_01_10_MODIFIED = NO`)

---

### 12. Final Conclusion

The Phase 8 counterfactual laboratory provides a rigorous, structured computational sensitivity and governance analysis of the PharmaPolySCOPE v2 framework. By evaluating twenty canonical boundary scenarios, the laboratory demonstrates that the active software pipeline reliably enforces governance guardrails, adapts its dimensionality across correlation regimes, and produces rankings whose sensitivity to preference weighting is fully characterized.

These results establish computational robustness and mathematical transparency, serving as authoritative evidence for thesis defense drills without asserting unvalidated physical claims.

---

### 13. Audit Trail

| Milestone / Gate | Document Reference | Status | Verification Date |
| :--- | :--- | :---: | :---: |
| **Step 1: Source-Lock Preflight** | `11_COUNTERFACTUAL_LAB/PHASE_8_SOURCE_LOCK_PREFLIGHT_FINAL.md` | **GO** | September 23, 2026 |
| **Step 2: Counterfactual Execution** | `11_COUNTERFACTUAL_LAB/PHASE_8_EXECUTION_LOG.md` | **COMPLETE** | September 23, 2026 |
| **Step 2.5: Post-Execution Audit** | `11_COUNTERFACTUAL_LAB/PHASE_8_POST_EXECUTION_FORENSIC_AUDIT.md` | **GO_TO_AUTHORING** | September 23, 2026 |
| **Step 3: Primary Deliverable Authoring** | `11_COUNTERFACTUAL_LAB/WHAT_IF_EXPERIMENTS.md` | **AUTHORED** | September 23, 2026 |
