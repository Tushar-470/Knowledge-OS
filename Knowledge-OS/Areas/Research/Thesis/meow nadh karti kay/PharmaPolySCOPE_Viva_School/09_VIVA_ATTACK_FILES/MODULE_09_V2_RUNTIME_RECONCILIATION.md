# MODULE 09 — V2 RUNTIME ARCHITECTURE RECONCILIATION

## 1. ACTIVE V2 ENTRY POINT
The authoritative active v2 production entry point is `VariableKEngine`, located in:
- **File:** `asd_mcda/v2/engine.py`
- **Class:** `VariableKEngine`
- **Method:** `evaluate()`
- **Execution Role:** It acts as the stateless orchestrator that sequentially invokes all Phase 2 and Phase 3 mathematical components without persistent scientific state leakage.

## 2. VERIFIED RUNTIME CALL GRAPH
The active `evaluate()` method executes the following strict pathway:

1. **Chemistry Snapshot Handling:** 
   - `asd_mcda/v2/chemistry.py` -> `validate_chemical_structure()`
   - Directly called during input validation to authorize drug profiles.
2. **Standardization:**
   - `asd_mcda/v2/standardization.py` -> `standardize_cohort()`
3. **PCA & Dynamic K:**
   - `asd_mcda/v2/pca.py` -> `decompose_spectral()`
   - Selects K based on the `variance_threshold` (default 0.95).
4. **Stability Governance:**
   - `asd_mcda/v2/stability.py` -> `evaluate_subspace_stability()`
5. **AHP Weights:**
   - `asd_mcda/v2/ahp.py` -> `solve_ahp_preference()`
6. **Metric Tensor:**
   - `asd_mcda/v2/metrics.py` -> `construct_metric_tensor()`
7. **Reference Projection:**
   - `asd_mcda/v2/metrics.py` -> `project_reference_points()`
8. **Distance / C_L (SP-PRP-TOPSIS):**
   - `asd_mcda/v2/metrics.py` -> `compute_distances_and_closeness()`
9. **Monte Carlo Uncertainty:**
   - `asd_mcda/v2/uncertainty.py` -> `MonteCarloEngine.run()`
   - Directly wraps and re-invokes `VariableKEngine.evaluate()` per replicate.
10. **Morris Sensitivity:**
    - `asd_mcda/v2/sensitivity.py` -> `run_morris_screening()`
11. **Provenance Sealing:**
    - `asd_mcda/v2/provenance.py` -> `compute_analysis_fingerprint()`, `build_provenance_manifest()`

## 3. LEGACY V1.5 SEPARATION TABLE

| Module Path | Classification | Context |
| :--- | :--- | :--- |
| `asd_mcda/mcda/topsis.py` | **B. Legacy v1.5** | Unused in v2. Implements legacy Euclidean TOPSIS (Hwang & Yoon 1981). |
| `asd_mcda/integration/pca.py` | **B. Legacy v1.5** | Unused in v2. Lacks stability boundaries. |
| `asd_mcda/uncertainty/monte_carlo.py` | **B. Legacy v1.5** | Unused in v2. Active v2 Monte Carlo is in `v2/uncertainty.py`. |
| `asd_mcda/sensitivity/morris.py` | **B. Legacy v1.5** | Unused in v2. Active v2 Morris is in `v2/sensitivity.py`. |

*Note: The previous Claim-to-Source audit falsely rejected valid v2 implementation claims by reading these legacy v1.5 files instead of the active v2 caller graph.*

## 4. TOPSIS RECONCILIATION
**Does active v2 production calculate $M_K = V_K^T W V_K$?**  
**YES.**  
- **File:** `asd_mcda/v2/metrics.py`
- **Function:** `construct_metric_tensor()`
- **Symbol:** `M_K = V_arr.T @ W @ V_arr` (Line 112)

**Does active v2 calculate $C_L = D^- / (D^+ + D^-)$?**  
**YES.**
- **File:** `asd_mcda/v2/metrics.py`
- **Function:** `compute_distances_and_closeness()`
- **Symbol:** `cl = d_m / denom` (Line 259)

The SP-PRP-TOPSIS architecture documented in the viva is **proven and active**. The prior audit conclusion that it was hallucinated was an auditor error.

## 5. PCA/EIGENGAP RECONCILIATION
Active v2 splits PCA and Stability into two strict steps:
- **PCA/Dynamic K:** `asd_mcda/v2/pca.py` calculates K using `cum_var_curve >= variance_threshold`.
- **Eigengap Thresholds:** `asd_mcda/v2/stability.py` strictly computes $\delta_K = \lambda_K - \lambda_{K+1}$ and enforces:
  - $\delta_K \ge 0.10 \implies$ STABLE
  - $0.03 \le \delta_K < 0.10 \implies$ WARNING
  - $\delta_K < 0.03 \implies$ BLOCKED (`DegenerateSubspaceBlockedError`)
- **Davis-Kahan:** Neither file explicitly calculates or references the Davis-Kahan bounds in code; it is a conceptual mathematical guarantee, not an active code symbol.

## 6. MONTE CARLO RECONCILIATION
Active v2 uses `asd_mcda/v2/uncertainty.py`.
- **`sigma_score` = 0.05:** Present (default argument).
- **`sigma_ahp` = 0.15:** Present (`ahp_log_scale_sd`).
- **Score perturbation:** Present (`_sample_truncated_normal_scores`).
- **`np.clip`:** **YES.** Active v2 explicitly clips scores via `np.clip(samples, 0.0, 1.0, out=samples)` (Line 88). The viva document's claim that the system *intentionally does not clip* is a **fatal content error**.
- **AHP perturbation & reciprocity:** Present (`_perturb_ahp_matrix_log_space`), applies strict reciprocity `matrices[:, j, i] = 1.0 / a_sampled`.
- **Governance Blocking:** Evaluated inside a `try-except` loop tracking `DegenerateSubspaceBlockedError` and others.
- **N_valid/N_blocked:** Enforced via `num_valid` and `num_blocked`.
- **Seed=42:** Default argument.

## 7. DRG-0002 RECONCILIATION
The actual documented validation facts define DRG-0002 as a Fenofibrate/Indomethacin identity mismatch.
- **File:** `asd_mcda/v2/chemistry.py` -> `resolve_validated_drug_snapshot()`
- **Mechanism:** The code tests `if stored_inchi and stored_inchi != authoritative["inchi_key"]:` and records discrepancies.
- **Conclusion:** There is **no** "pentavalent carbon", explicit "DRG-0002" hardcoded exception, or raw SDF origin logic in the code. The viva document's claim regarding pentavalent carbons is a **fatal hallucinated implementation claim**.

## 8. FINDING-BY-FINDING REASSESSMENT

| Previous Finding | True Status | Cause |
| :--- | :--- | :--- |
| 1. Classical TOPSIS in `mcda/topsis.py` | **FALSE** | False inference by auditor (read legacy v1.5 code instead of `v2/metrics.py`). |
| 2. Monte Carlo clipping | **TRUE** | Genuine viva document error. Active v2 explicitly uses `np.clip`. The text falsely claimed it doesn't. |
| 3. No eigengap blocking in `pca.py` | **FALSE** | False inference by auditor. Eigengap blocking actively occurs in `v2/stability.py`. |
| 4. DRG-0002 pentavalent carbon | **TRUE** | Genuine viva document error. The identity mismatch logic operates on InChIKey, not valency. |
| 5. Class B mapping errors | **TRUE** | Genuine viva document error. The model correctly separates Monte Carlo (`v2/uncertainty.py`) and Morris (`v2/sensitivity.py`). |

## 9. CONCLUSION & DECISION
The core mathematical SP-PRP-TOPSIS variable-K v2 architecture is **fully confirmed and actively running** in the `v2/` package. However, the `09_HOSTILE_VIVA_100_QUESTIONS.md` document continues to suffer from localized but severe implementation hallucinations (e.g., claiming clipping doesn't occur when it does, inventing pentavalent carbon exceptions).

**DECISION: A. V2 ARCHITECTURE CONFIRMED — CONTENT REPAIR REQUIRED**
