# MODULE 12 — VIVA QUICK REFERENCE
# High-Priority Memorization Sheet & Rapid-Fire Defense Reference

**Document ID:** `MODULE_12_VIVA_QUICK_REFERENCE`  
**Module:** Module 12 — Numbers You Must Know (`12_NUMBERS_YOU_MUST_KNOW/`)  
**Phase:** Phase 9 Forensic Repair & Final Freeze (Module 11 → Module 12 Handoff)  
**Authoritative Repositories Inspected:**  
- Production Source: `asd_framework/src/asd_mcda/v2/` (Git commit: `220ba4c`, v1.5 freeze: `31eee4d`)  
- Scientific Validation: `results/validation/v2_scientific_validation/scientific_validation_results.json`  
- Counterfactual Lab Dataset: `11_COUNTERFACTUAL_LAB/PHASE_8_EXECUTION_RESULTS.json`  
**Auditor:** Forensic Computational-Science Architect & PhD Methodology Auditor  
**Date:** September 23, 2026  
**Status:** **AUTHORITATIVE VIVA REFERENCE (REPAIRED & SOURCE-LOCKED)**  

---

## 1. Ten Numbers You Must Memorize Exactly

| Value | Parameter Name | Pipeline Stage | Operational Role |
| :--- | :--- | :--- | :--- |
| **0.95** ($95.0\%$) | PCA Variance Threshold ($\tau_{\text{var}}$) | Step 2 (PCA) | Minimum cumulative variance required for dynamic $K$ selection. |
| **0.10** | Eigengap Stable Threshold | Step 3 (Stability) | Minimum boundary eigengap for $\text{status} = \text{`STABLE`}$. |
| **0.03** | Eigengap Block Threshold | Step 3 (Stability) | Critical threshold raising `DegenerateSubspaceBlockedError`. |
| **0.08** | AHP Governance Gate Threshold | Step 5 (AHP) | Maximum permissible consistency ratio ($CR < 0.08$). |
| **0.89** | Saaty Random Index ($RI_4$) | Step 5 (AHP) | Fixed benchmark random index for $4 \times 4$ reciprocal matrices. |
| **4.131937** | AHP Principal Eigenvalue ($\lambda_{\max}$) | Step 5 (AHP) | Power iteration root for authoritative $4 \times 4$ comparison matrix. |
| **0.049415** | AHP Consistency Ratio ($CR$) | Step 5 (AHP) | Baseline consistency ($CR = 0.043979 / 0.89 = 0.0494 < 0.08$). |
| **K = 3** | Retained Subspace Dimension | Step 2 (PCA) | Dynamic components for Indomethacin capturing $99.9634\%$ variance. |
| **0.738310** | Indomethacin Eigengap ($\delta_3$) | Step 3 (Stability) | $\delta_3 = \lambda_3 - \lambda_4 = 0.739775 - 0.001464 = 0.738310 \ge 0.10$. |
| **1e-08** | Standardization Guardrail | Step 1 (Standardize)| Minimum column variance $\sigma_j^2$ raising `ZeroVarianceStandardizationError`. |

---

## 2. Canonical AHP Comparison Matrix & Decision Weights

### 2.1 The Authoritative Reciprocal Comparison Matrix ($A$)
Established in `backend/services/engine_adapter.py:95`:

$$
A = \begin{bmatrix}
1.0 & 2.0 & 3.0 & 2.0 \\
0.5 & 1.0 & 5.0 & 2.0 \\
1/3 & 0.2 & 1.0 & 0.5 \\
0.5 & 0.5 & 2.0 & 1.0
\end{bmatrix}
$$

- **Row 1 ($s_{\text{HSP}}$ row):** $[1.0, 2.0, 3.0, 2.0]$
- **Row 2 ($s_\chi$ row):** $[0.5, 1.0, 5.0, 2.0]$ (maximum ratio is $a_{23} = 5.0$, where $\chi$ is judged strongly more important than descriptors)
- **Row 3 ($s_{\text{desc}}$ row):** $[1/3, 0.2, 1.0, 0.5]$
- **Row 4 ($s_{\text{GT}}$ row):** $[0.5, 0.5, 2.0, 1.0]$

### 2.2 Canonical Eigenvector Weights ($w$)
Computed via power iteration with tolerance $10^{-10}$:

```
+-----------------------------------------------------------------------------------------+
|                               CANONICAL V2 AHP WEIGHTS                                  |
+------------------------------+---------------------+----------------+-------------------+
| Criterion                    | Mathematical Symbol | Weight Value   | Percentage        |
+------------------------------+---------------------+----------------+-------------------+
| Hansen Solubility Distance   | s_HSP               | 0.40767478     | 40.77%            |
| Flory-Huggins Interaction    | s_chi               | 0.32443341     | 32.44%            |
| Molecular Descriptors        | s_desc              | 0.09216134     |  9.22%            |
| Gordon-Taylor Anti-Plastic   | s_GT                | 0.17573047     | 17.57%            |
+------------------------------+---------------------+----------------+-------------------+
| Sum Check                    | Sum(w_i)            | 1.00000000     | 100.00%           |
+------------------------------+---------------------+----------------+-------------------+
```

> [!IMPORTANT]
> **VIVA EPISTEMIC GOVERNANCE — AHP WEIGHT INTERPRETATION:**  
> These weights represent **decision-theoretic preference allocations across four computational criteria**, NOT physical mass fractions, empirical thermodynamic driving forces, or kinetic contribution shares. In oral defense, never claim that the system has "73% thermodynamic contribution" or "17.57% Gordon-Taylor anti-plasticization". Always defend them as multi-criteria preference priorities.

---

## 3. Baseline Validation Cohort (Indomethacin Ranking & Uncertainty)

```
+-----------------------------------------------------------------------------------------+
|                                INDOMETHACIN BENCHMARK                                   |
+------+-----------------------+------------+------------+------------+-------------------+
| Rank | Polymer Candidate     | TOPSIS C_L | D+ (Ideal) | D- (Anti)  | MC P(top1) [N=8600]
+------+-----------------------+------------+------------+------------+-------------------+
| 1    | Soluplus              | 0.68643508 | 4.182604   | 9.156273   | 55.51% (4,774)    |
| 2    | HPMC E5               | 0.67314649 | 4.196084   | 8.641728   | 42.00% (3,612)    |
| 3    | PVP-VA64              | 0.60624689 | 5.082374   | 7.825140   |  1.38% (  119)    |
| 4    | PVP K30               | 0.58758390 | 5.344023   | 7.613821   |  0.56% (   48)    |
| 5    | Eudragit E PO         | 0.54561620 | 5.671239   | 6.809926   |  0.55% (   47)    |
+------+-----------------------+------------+------------+------------+-------------------+
| Replicates: N_generated=10,000 | N_valid=8,600 (86.00%) | N_blocked=1,400 (14.00%)      |
| Blocks: 1,396 AHP_CR_BLOCKED (99.71%) | 4 EIGENGAP_BLOCKED (0.29%) | Valid Ratio=0.8600  |
+-----------------------------------------------------------------------------------------+
```

---

## 4. Multi-Cohort Cross-Check Reference

| Cohort ID | Model Drug | Retained $K$ | Cumulative Variance | Eigengap $\delta_K$ | Stability Status | Deterministic Rank 1 Polymer |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **IND-001-2026** | Indomethacin | $K = 3$ | $99.9634\%$ | $0.738310$ | `STABLE` | Soluplus ($C_L = 0.6864$) |
| **DRG-0001** | Ibuprofen | $K = 2$ | $96.1008\%$ | $0.816878$ | `STABLE` | Eudragit E PO ($C_L = 0.5503$) |
| **ITR-001-2026** | Itraconazole | $K = 2$ | $96.1936\%$ | $0.650372$ | `STABLE` | Soluplus ($C_L = 0.6106$) |
| **DRG-0002** | Quarantined Snapshot | N/A | N/A | N/A | `BLOCKED` | Quarantined: Chemical identity mismatch (requested Fenofibrate vs stored Indomethacin structure) |

> [!IMPORTANT]
> **DRG-0002 QUARANTINE PROVENANCE:**  
> The DRG-0002 snapshot was quarantined by `resolve_validated_drug_snapshot()` in `src/asd_mcda/v2/chemistry.py` because the requested chemical identity (`Fenofibrate`) did not match the stored chemical structure (`Indomethacin`). It was NOT quarantined due to an isolated physical property defect such as unphysical density or molar volume.

---

## 5. Five Defensive Governance Tripwires

```
+-----------------------------------------------------------------------------------------+
|                               DEFENSIVE GOVERNANCE GATES                                |
+--------+--------------------------+-----------------+-----------------------------------+
| Gate   | Trigger Condition        | Pipeline Stage  | Exception Class Raised            |
+--------+--------------------------+-----------------+-----------------------------------+
| Gate 0 | Malformed SMILES String  | Step 0 (Chem)   | RDKitParseFailureError            |
| Gate 1 | Column Variance <= 1e-08 | Step 1 (Std)    | ZeroVarianceStandardizationError  |
| Gate 2 | Subspace Gap delta < 0.03| Step 3 (Stab)   | DegenerateSubspaceBlockedError    |
| Gate 3 | Subspace Gap in [0.03,0.1| Step 3 (Stab)   | WARNING logged (executes)         |
| Gate 4 | AHP Consistency CR>=0.08 | Step 5 (AHP)    | AHPConsistencyViolationError      |
+--------+--------------------------+-----------------+-----------------------------------+
```

---

## 6. Dual-Tier Precision Architecture (Machine vs. Viva Defense)

| Parameter | Raw Machine Value (float64) | Viva Defense Reporting Value | Scientific Rationale |
| :--- | :--- | :--- | :--- |
| **Indomethacin MW** | `357.793` | `357.79 g/mol` | Standard atomic weight precision. |
| **Indomethacin LogP**| `3.92732` | `3.93` | Empirical partition coefficient error bounds. |
| **Indomethacin TPSA**| `68.53` | `68.5 Å²` | 2D topological approximation surface limit. |
| **PCA Eigenvalue 1** | `2.0908657741533783` | `2.0909` | Numerical linear algebra coordinate. |
| **Cumulative Var 3** | `0.99963393063776` | `99.96%` | Total explained variance percentage. |
| **Boundary Eigengap**| `0.7383104290964133` | `0.7383` (or `> 0.10`) | Separation gap verifying subspace stability. |
| **AHP Principal Root**| `4.131937073898666` | `4.1319` | Spectral radius of comparison matrix. |
| **AHP Consistency CR**| `0.04941463441897588` | `0.0494` (or `< 0.08`) | Governance ratio confirming Saaty consistency. |
| **Soluplus Closeness**| `0.6864350839750771` | `0.6864` | TOPSIS relative closeness score. |

---

## 7. Forbidden Viva Phrases & Approved Scientific Phrasing

```
+----------------------------------------------------+----------------------------------------------------+
| FORBIDDEN VIVA PHRASES (DISMISSAL RISK)            | APPROVED SCIENTIFIC PHRASING (DEFENSIBLE)          |
+----------------------------------------------------+----------------------------------------------------+
| "Soluplus is the proven best polymer for Indometh" | "Soluplus ranks first under the configured multi-  |
|                                                    | criteria preference weights and 3D PCA subspace."  |
+----------------------------------------------------+----------------------------------------------------+
| "AHP weights show 73% thermodynamic contribution"  | "AHP weights allocate 0.4077 to HSP and 0.3244 to  |
|                                                    | Flory-Huggins chi as decision preference weights." |
+----------------------------------------------------+----------------------------------------------------+
| "DRG-0002 failed because density was 1.781 g/cm3"  | "DRG-0002 was quarantined by chemistry governance |
|                                                    | due to an identity mismatch (Fenofibrate vs Indo)."|
+----------------------------------------------------+----------------------------------------------------+
| "AHP matrix row 1 has a12=5.0 and a13=2.0"         | "Row 1 is [1.0, 2.0, 3.0, 2.0]; the maximum ratio  |
|                                                    | in row 2 is a23=5.0 (chi over descriptors)."       |
+----------------------------------------------------+----------------------------------------------------+
| "Our algorithm predicts physical shelf-life"       | "The framework computes relative thermodynamic and |
|                                                    | glass-transition proxy indicators for screening."  |
+----------------------------------------------------+----------------------------------------------------+
| "We clustered the polymers using K-Means"          | "We dynamically selected subspace dimension K=3    |
|                                                    | using a 95% cumulative PCA variance criterion."    |
+----------------------------------------------------+----------------------------------------------------+
| "The machine calculated MW to 16 decimal places"   | "Float64 values ensure numerical reproducibility;  |
|                                                    | viva values are reported to significant figures."  |
+----------------------------------------------------+----------------------------------------------------+
```
