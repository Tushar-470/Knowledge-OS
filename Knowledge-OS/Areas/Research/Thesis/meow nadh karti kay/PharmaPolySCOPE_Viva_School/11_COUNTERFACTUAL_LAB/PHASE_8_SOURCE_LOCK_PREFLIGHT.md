# PHASE 8 SOURCE-LOCK PREFLIGHT
# MODULE 11 — COUNTERFACTUAL LAB

**Document ID:** `PS-VIVA-MOD11-PREFLIGHT-001`  
**Audit Date:** 2026-09-23  
**Auditor:** Forensic Runtime Auditor & Curriculum Architect  
**Target Plan:** [`11_COUNTERFACTUAL_LAB/PHASE_8_IMPLEMENTATION_PLAN.md`](file:///C:/Users/Admin/Documents/GitHub/Knowledge-OS/Knowledge-OS/Areas/Research/Thesis/meow%20nadh%20karti%20kay/PharmaPolySCOPE_Viva_School/11_COUNTERFACTUAL_LAB/PHASE_8_IMPLEMENTATION_PLAN.md)  
**Target Codebase:** Active PharmaPolySCOPE v2 Production Repository (`asd_framework/src/asd_mcda/v2/`)  
**Validation Artifact:** `scientific_validation_results.json` (`VAL-RPT-2026-V2-001-REV1`)  
**Preflight Mandate:** Audit all 20 counterfactual scenarios against live active v2 source code before authoring or executing experiments. Determine exact interface compatibility, exception validity, and execution feasibility without modifying production code.

---

## 1. Executive Finding

### **PREFLIGHT VERDICT: GO_WITH_REVISIONS**

1. **Foundational Viability:** The Phase 8 Implementation Plan is structurally sound and scientifically rigorous. All 20 canonical What-If scenarios from the Master Architecture Prompt (Step 18668) are uniquely accounted for with zero duplications.
2. **Production Code Isolation:** All 20 experiments can be executed or analyzed with **zero modifications to active production code in `asd_framework`** and zero modifications to Modules 01–10.
3. **Execution Class Distribution:**
   - **Class A (Direct Live V2 Execution):** **12 Scenarios** can be executed directly through the existing `VariableKEngine.evaluate()` or `MonteCarloEngine.run()` interfaces (CF-02, CF-03, CF-04, CF-07, CF-12, CF-13, CF-14, CF-15, CF-16, CF-17, CF-18, CF-20).
   - **Class B (External Analytical / Test Harness):** **3 Scenarios** require external test scripts calling active v2 sub-functions (`standardize_cohort`, `decompose_spectral`, `evaluate_subspace_stability`) with synthetic boundary vectors (CF-01, CF-05, CF-06).
   - **Class C (Standalone Mathematical / Pedagogical Proof):** **4 Scenarios** (CF-08, CF-09, CF-10, CF-11: Criteria Omission) cannot pass $N \times 3$ matrices into active v2 functions because the codebase strictly hardcodes $p=4$; they must be analyzed as standalone linear algebraic counterfactuals.
   - **Class D (Execution Claim Mismatch — Pipeline Halts at Step 1):** **1 Scenario** (CF-19: Identical Polymer Scores) cannot compute $C_L = 0.50$ via distance equations because the active standardizer halts immediately at Step 1 with `ZeroVarianceStandardizationError`.
   - **Class E (Scientifically Ill-Defined):** **0 Scenarios**.
4. **Defect Scorecard:**
   - **P0 Errors (Fatal Defect / Crash / Code Contamination):** **0**
   - **P1 Errors (Major Source / Runtime Interface Mismatch):** **3** (Defect #1: Omission $p=4$ constraint; Defect #2: CF-16 exception name mismatch; Defect #3: CF-19 zero-variance halt vs $C_L=0.50$)
   - **P2 Errors (Mathematical / Definition Mismatch):** **1** (Defect #4: CF-04 $\delta_4 = +\infty$ vs claimed $\delta_4 = 0$)
   - **P3 Errors (Parameter Clarification):** **1** (Defect #5: CF-02/03 `variance_threshold` parameter specification)

---

## 2. Source Hierarchy & Inspected Implementation Files

Every runtime claim in the Phase 8 Implementation Plan was cross-examined against active Python production files in `C:\Users\Admin\.gemini\antigravity\scratch\asd_framework\src\asd_mcda\v2\`:

| Source Module | Inspected Functions / Classes | Verified Runtime Behaviors & Constraints |
|:---|:---|:---|
| **`engine.py`** | `VariableKEngine.evaluate()` | Hardcodes $p=4$ (`if p != 4: raise ValueError`). Does NOT accept explicit `K`; dimension is modulated via `variance_threshold`. Intercepts fallback descriptors via `ProductionFallbackProhibitedError`. |
| **`standardization.py`** | `standardize_cohort()` | Hardcodes $p=4$. Computes population moments ($ddof=0$). Checks `if sigma[j] <= 1e-15: raise ZeroVarianceStandardizationError`. |
| **`pca.py`** | `decompose_spectral()`, `canonicalize_eigenvector_sign()` | Hardcodes $p=4$. Sorts eigenvalues descending. Dynamically selects minimum $K$ satisfying cumulative variance $\ge \text{threshold} - 10^{-12}$. |
| **`stability.py`** | `evaluate_subspace_stability()` | Evaluates $\delta_K = \lambda_K - \lambda_{K+1}$. Thresholds: $\ge 0.10$ (`STABLE`), $[0.03, 0.10)$ (`WARNING`), $< 0.03$ (`BLOCKED` $\to$ raises `DegenerateSubspaceBlockedError`). When $K=p$, $\delta_K = +\infty$ (`STABLE`). |
| **`ahp.py`** | `solve_ahp_preference()` | Hardcodes shape $(4, 4)$. $RI_4 = 0.89$. Raises `AHPNonReciprocalError` if $|a_{ji} a_{ij} - 1| \ge 10^{-12}$. Raises `AHPConsistencyViolationError` if $CR \ge 0.08$. |
| **`metrics.py`** | `construct_metric_tensor()`, `compute_distances_and_closeness()` | Hardcodes $p=4$. Computes $M_K = V_K^T W V_K$. Raises `NonPositiveDefiniteMetricError`, `MateriallyNegativeQuadraticFormError`, `DegenerateReferenceCoincidenceError`. |
| **`uncertainty.py`** | `MonteCarloEngine.run()`, `_sample_truncated_normal_scores()` | Outer wrapper around `VariableKEngine.evaluate()`. Enforces $N=10,000$, $\sigma_{\text{score}}=0.05$ with `np.clip(..., 0, 1)`, and log-space AHP noise $\sigma_{\text{AHP}}=0.15$. |
| **`chemistry.py`** | `validate_chemical_structure()`, `compute_production_descriptors()` | Validates SMILES via RDKit. Raises `InvalidSmilesError`, `RDKitParseFailureError`, `RDKitSanitizationFailureError`. |
| **`exceptions.py`** | All 19 exception classes | AST verified; all claimed exceptions exist under root `PharmaPolyScopeV2Error`. |

---

## 3. Scenario-by-Scenario Runtime Verification

| CF-ID | Scenario Title | Proposed Runtime Mechanism | Source Verified? | Interface Verified? | Exception Verified? | Execution Class | Preflight Defect |
|:---:|:---|:---|:---:|:---:|:---:|:---:|:---|
| **CF-01** | PCA Removed | Bypass PCA, evaluate in standardized space ($M_4 = W$) | **YES** | **PARTIAL** (No flag in engine; requires harness) | N/A | **Class B** | Minor: Document that `VariableKEngine` has no `bypass_pca` flag; evaluated via `metrics.py` harness. |
| **CF-02** | $K$ Fixed at 2 | Set $K=2$ on Indomethacin | **YES** | **YES** (via `variance_threshold=0.80`) | N/A | **Class A** | None: Fully executable via `variance_threshold=0.80`. |
| **CF-03** | $K$ Becomes 3 | Force $K=3$ on Ibuprofen | **YES** | **YES** (via `variance_threshold=0.99`) | N/A | **Class A** | None: Fully executable via `variance_threshold=0.99`. |
| **CF-04** | $K$ Becomes 4 | Force $K=4$ on Indomethacin | **YES** | **YES** (via `variance_threshold=0.9999`) | **MISMATCH** | **Class A** | **P2 Defect:** Plan claimed $\delta_4 = 0$ collapse. In `stability.py`, when $K=p=4$, $\delta_4 = +\infty$ by contract. |
| **CF-05** | Eigengap $\delta_K < 0.03$ | Synthetic matrix with $\delta_K = 0.015$ | **YES** | **YES** | **YES** (`DegenerateSubspaceBlockedError`) | **Class B** | None: Verified in `stability.py`. |
| **CF-06** | Eigengap $[0.03, 0.10)$ | Synthetic matrix with $\delta_K = 0.065$ | **YES** | **YES** | **YES** (`WARNING` status) | **Class B** | None: Verified in `stability.py`. |
| **CF-07** | AHP $CR \ge 0.08$ | Intransitive comparison matrix ($CR = 0.124$) | **YES** | **YES** | **YES** (`AHPConsistencyViolationError`) | **Class A** | None: Verified in `ahp.py` and `engine.py`. |
| **CF-08** | HSP Omitted | Slice $S$ to $N \times 3$, pass to pipeline | **YES** | **MISMATCH** ($p=4$ hardcoded) | N/A | **Class C** | **P1 Defect:** Active v2 modules reject $p=3$. Must be analyzed as standalone $3 \times 3$ linear algebra proof. |
| **CF-09** | Flory-Huggins Omitted | Slice $S$ to $N \times 3$, pass to pipeline | **YES** | **MISMATCH** ($p=4$ hardcoded) | N/A | **Class C** | **P1 Defect:** Same as CF-08 ($p=4$ constraint). |
| **CF-10** | Descriptors Omitted | Slice $S$ to $N \times 3$, pass to pipeline | **YES** | **MISMATCH** ($p=4$ hardcoded) | N/A | **Class C** | **P1 Defect:** Same as CF-08 ($p=4$ constraint). |
| **CF-11** | Gordon-Taylor Omitted | Slice $S$ to $N \times 3$, pass to pipeline | **YES** | **MISMATCH** ($p=4$ hardcoded) | N/A | **Class C** | **P1 Defect:** Same as CF-08 ($p=4$ constraint). |
| **CF-12** | Equal AHP Weights | Pass all-ones matrix $A = \mathbf{1}_{4 \times 4}$ | **YES** | **YES** | N/A | **Class A** | None: Produces $w = [0.25, 0.25, 0.25, 0.25]$, $CR = 0.0$. |
| **CF-13** | Inverted AHP Weights | Pass consistent inverted priority matrix | **YES** | **YES** | N/A | **Class A** | None: Fully executable via `pairwise_matrix`. |
| **CF-14** | Monte Carlo Disabled | Execute `VariableKEngine.evaluate()` directly | **YES** | **YES** | N/A | **Class A** | None: Native deterministic evaluation mode. |
| **CF-15** | Density Perturbation | Perturb density $\pm 20\%$, recompute $S$ | **YES** | **YES** | N/A | **Class A** | None: Smooth parametric input shift. |
| **CF-16** | SMILES Corrupted | Pass malformed SMILES in `drug_data` | **YES** | **YES** | **MISMATCH** | **Class A** | **P1 Defect:** Malformed SMILES raises `RDKitParseFailureError`, NOT `ProductionFallbackProhibitedError`. |
| **CF-17** | Zero Variance Column | Pass matrix with identical column values | **YES** | **YES** | **YES** (`ZeroVarianceStandardizationError`) | **Class A** | None: Verified in `standardization.py`. |
| **CF-18** | Perfect Collinearity | Pass matrix with $r_{jk} \approx 1.0$ | **YES** | **YES** | N/A | **Class A** | None: Dynamic $K$ collapses gracefully to $K=1$. |
| **CF-19** | Identical Polymers | Pass matrix with identical candidate rows | **YES** | **MISMATCH** (Halts at Step 1) | **MISMATCH** | **Class D** | **P1 Defect:** Plan claimed distance collapse to $C_L=0.50$. In active code, $\sigma_j=0 \implies$ halts with `ZeroVarianceStandardizationError`! |
| **CF-20** | New Drug Requires $K=4$ | Pass synthetic orthogonal candidate matrix | **YES** | **YES** | N/A | **Class A** | None: Directly executable; selects $K=4$ at $\ge 95\%$ variance. |

---

## 4. Special Mathematical & Architectural Checks

### 4.1 Dynamic-K Modulations (CF-02, CF-03, CF-04)
- **Active Code Reality:** `VariableKEngine.evaluate()` does not feature an explicit argument `retained_k: int`. Instead, $K$ is dynamically selected at lines 105–109 of `pca.py`:
  $$\text{cumVar}(k) = \frac{1}{p} \sum_{j=1}^k \lambda_j \ge \tau_{\text{var}} - 10^{-12}$$
- **Runtime Solution:** To evaluate fixed-$K$ counterfactuals cleanly through the live production engine:
  - For Indomethacin ($K=2$): Pass `variance_threshold = 0.80` (since $\text{PC1-2} = 81.47\% \ge 80\%$).
  - For Ibuprofen ($K=3$): Pass `variance_threshold = 0.99` (since $\text{PC1-2} = 96.10\% < 99\%$, while $\text{PC1-3} = 99.93\% \ge 99\%$).
  - For Indomethacin ($K=4$): Pass `variance_threshold = 0.9999` (forces retention of all 4 PCs).
- **Eigengap at $K=4$ (Defect #4):** The plan asserted that for $K=4$, the eigengap collapses to $\delta_4 = 0$. In `stability.py` line 70, when $K = p$, $\delta_K = +\infty$ (`STABLE`). The preflight confirms that the real instability of $K=4$ is **metric tensor condition number inflation** (incorporating near-zero noise $\lambda_4 = 0.001464$), NOT an eigengap block.

### 4.2 PCA Removal (CF-01)
- **Mathematical Equivalence:** Bypassing PCA in SP-PRP-TOPSIS means:
  $$V = I_4 \implies T = Z I_4 = Z, \quad M_4 = I_4^T W I_4 = W = \operatorname{diag}(w_{\text{phys}})$$
- **Distance Formula:**
  $$D_i^2 = (z_i - z_{\text{ref}})^T W (z_i - z_{\text{ref}}) = \sum_{j=1}^4 w_j (z_{ij} - z_{\text{ref}, j})^2$$
- This is exactly **standardized Weighted Euclidean TOPSIS**. It tests the hypothesis: *Does oblique PCA projection alter candidate rankings compared to evaluating directly in correlated standardized space?*
- Because `VariableKEngine.evaluate()` always executes PCA, CF-01 must be executed using an external analytical test harness calling `standardize_cohort()` followed by `compute_distances_and_closeness(Z, z_plus, z_minus, V_K=np.eye(4), M_K=np.diag(w_phys))`.

### 4.3 Criteria Omission and the $p=4$ Hardcode (CF-08 to CF-11)
- **Source Inspection Finding (Defect #1):**
  Every module in `src/asd_mcda/v2/` enforces $p=4$:
  - `engine.py` line 108: `if p != 4: raise ValueError(...)`
  - `standardization.py` line 56: `if p != 4: raise StandardizationError(...)`
  - `pca.py` line 83: `if p != 4: raise ValueError(...)`
  - `ahp.py` line 54: `if A.shape != (4, 4): raise ValueError(...)`
  - `metrics.py` line 67: `if p != 4: raise ValueError(...)`
- **Consequence:** Slicing $S$ to $5 \times 3$ and passing it to active v2 functions is impossible without modifying production code.
- **Preflight Ruling:** Scenarios CF-08, CF-09, CF-10, and CF-11 are **Class C (Standalone Mathematical / Pedagogical Counterfactuals)**. They must be evaluated using dedicated standalone 3-criterion formulas (using $RI_3 = 0.58$ for AHP) rather than calling the production 4-criterion pipeline.

### 4.4 Chemistry Validation Exception Disambiguation (CF-16)
- **Source Inspection Finding (Defect #2):**
  In `engine.py` lines 141–142, when `canonical_smiles` is provided, `validate_chemical_structure()` is called. In `chemistry.py` line 102:
  `if mol is None: raise RDKitParseFailureError(...)`
  `ProductionFallbackProhibitedError` is raised only if `drug_snapshot.get("fallback_used") is True` or `drug_snapshot.get("descriptor_source") == "fallback"`.
- **Preflight Ruling:** CF-16 must distinguish two sub-cases:
  1. Corrupt SMILES string $\implies$ intercepts **`RDKitParseFailureError`** (subclass of `InvalidSmilesError`).
  2. Diagnostic fallback metadata bypass $\implies$ intercepts **`ProductionFallbackProhibitedError`**.

### 4.5 Identical Polymer Candidates and Zero Variance (CF-19)
- **Source Inspection Finding (Defect #3):**
  The plan stated that if all 5 candidates have identical compatibility scores, the distances collapse to $D_i^+ = D_i^-$, yielding $C_L = 0.50$.
  However, in `standardization.py` lines 71–75:
  `for j in range(p): if sigma[j] <= 1e-15: raise ZeroVarianceStandardizationError(...)`
  If all candidates have identical scores, the cohort variance $\sigma_j = 0$ for all criteria! The active pipeline **halts immediately at Step 1** by raising `ZeroVarianceStandardizationError`.
- **Preflight Ruling:** In the active v2 architecture, identical candidate polymers trigger a governance halt (`ZeroVarianceStandardizationError`). The result $C_L = 0.50$ is a theoretical limit of the distance equation if standardization were bypassed, but under live production execution, the engine **blocks**.

---

## 5. Scientific Design Risks

1. **Risk of Conflating Standalone Mathematics with Active Code:**  
   If the student claims that "I ran 3-criterion screening in the PharmaPolySCOPE v2 engine", a hostile examiner will point to line 108 of `engine.py` (`if p != 4: raise ValueError`) and expose that the student does not know the source code. The curriculum must explicitly teach that v2 is hardcoded for $M=4$, and 3-criterion counterfactuals are evaluated in an external educational testbed.
2. **Risk of Misidentifying Exception Names:**  
   Citing `ProductionFallbackProhibitedError` for a malformed SMILES when the code actually raises `RDKitParseFailureError` is a classic P1 viva failure. The preflight correction resolves this before any document is written.
3. **Risk of Misrepresenting Identical Candidate Behavior:**  
   Claiming that identical candidates produce $C_L = 0.50$ in production ignores the standardizer guardrail. The student must defend that the standardizer **actively prevents** processing identical candidate libraries by demanding non-zero cohort variance.

---

## 6. Required Plan Corrections (To Incorporate in Authoring)

The following surgical corrections must be applied when authoring `11_COUNTERFACTUAL_LAB/WHAT_IF_EXPERIMENTS.md`:

1. **Correction 1 (Scenarios CF-08 to CF-11 — Criteria Omission):**  
   Reclassify from "Type D / Omission Adapter Harness" to **Class C (Standalone 3-Criterion Mathematical Testbed)**. Explicitly explain to the candidate that active production v2 code strictly enforces $p=4$, so testing criteria omission requires standalone linear algebra evaluation using $RI_3 = 0.58$.
2. **Correction 2 (Scenario CF-16 — Chemistry Ingestion):**  
   Update the primary exception trigger from `ProductionFallbackProhibitedError` to **`RDKitParseFailureError`** (for syntax/valency failures), retaining `ProductionFallbackProhibitedError` for heuristic fallback bypasses.
3. **Correction 3 (Scenario CF-19 — Identical Polymer Scores):**  
   Update the primary governance output to **`ZeroVarianceStandardizationError` (`BLOCKED`)**. Document $C_L = 0.50$ as an unstandardized mathematical asymptote, but confirm that live production code halts at Step 1.
4. **Correction 4 (Scenario CF-04 — $K=4$ Subspace):**  
   Correct the eigengap description from "collapse $\delta_4 = 0$" to **$\delta_4 = +\infty$ (`STABLE`)** as defined in `stability.py` line 70, refocusing the scientific critique on metric tensor condition number inflation.
5. **Correction 5 (Scenarios CF-02 and CF-03 — Dynamic $K$ Modulation):**  
   Explicitly identify **`variance_threshold`** ($0.80$ for Indomethacin $K=2$; $0.99$ for Ibuprofen $K=3$) as the exact production interface parameter used to execute these counterfactuals.

---

## 7. Freeze / Go Decision

### **FINAL PREFLIGHT DECISION: GO_WITH_REVISIONS**

- **Justification:** Zero production code modifications are required. Zero P0 defects exist. All 20 scenarios are executable or mathematically evaluable through documented pathways. The five identified revisions (P1/P2/P3) provide surgical guidance for authoring `WHAT_IF_EXPERIMENTS.md` with 100% source-code fidelity.
- **Next Permitted Step:** Proceed to Phase 8 experiment authoring and numerical data generation incorporating the five preflight corrections.

---

*End of Phase 8 Source-Lock Preflight Report*\n