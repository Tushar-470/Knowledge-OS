# Phase 9 Evidence Matrix
# Forensic Mapping of Current Evidence, Evidence Gaps, and Resolution Pathways

**Document ID:** `PHASE_9_EVIDENCE_MATRIX`  
**Phase:** Phase 9 (Source-Locked Planning Gate)  
**Target:** Module 11 to Module 12 Quantitative Evidence Ledger  
**Auditor:** Forensic Computational-Science Architect & PhD Methodology Auditor  
**Date:** September 23, 2026  
**Status:** **AUTHORITATIVE EVIDENCE MATRIX**  

---

## 1. Overview & Evaluation Taxonomy

This matrix itemizes all scientific, mathematical, computational, and pedagogical questions relevant to the PharmaPolySCOPE pipeline, its validation, its counterfactual behavior, and the Module 11 → Module 12 handoff.

Every question is evaluated across strictly factual statuses:
- `ESTABLISHED`: Supported by unambiguous, verified production code and frozen validation artifacts.
- `PARTIALLY ESTABLISHED`: Supported by partial evidence or bounded within specific conditions; requires explicit bounding or cross-validation.
- `OPEN`: Unresolved by existing records; planned for systematic resolution in Phase 9.
- `BLOCKED`: Prevented by fundamental epistemological, mathematical, or physical boundaries.
- `REQUIRES EXPERIMENT`: Requires empirical wet-lab physical testing outside computational scope.
- `REQUIRES IMPLEMENTATION`: Requires writing new software or configuration outside current freeze.
- `REQUIRES VALIDATION`: Requires external benchmark dataset or independent cohort testing.

Subjective descriptors (such as "best", "strongest", "highest priority") are strictly prohibited.

---

## 2. Evidence Matrix

| ID | Scientific / Computational Question | Current Evidence | Evidence Gap | Required Evidence | Source | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **Q-01** | What are the baseline relative closeness scores ($C_L$) for Indomethacin across the 5 validated polymers? | `scientific_validation_results.json` reports Soluplus (0.6864), HPMC E5 (0.6731), PVP-VA64 (0.6062), PVP K30 (0.5876), Eudragit E PO (0.5456). | None. Exactly verified in Module 08 and Module 10. | Full 10-decimal precision verification. | `results/validation/.../scientific_validation_results.json` | **ESTABLISHED** |
| **Q-02** | What is the active PCA subspace dimension $K$ and cumulative explained variance for Indomethacin? | `pca.py` executes dynamic cutoff; JSON records $K=3$ and cumulative variance $99.9634\%$. | None. Verified in validation study and CF-01. | Direct AST and JSON verification. | `src/asd_mcda/v2/pca.py`, validation JSON | **ESTABLISHED** |
| **Q-03** | What is the active boundary eigengap $\delta_3$ for Indomethacin and its stability classification? | `stability.py` computes $\delta_3 = \lambda_3 - \lambda_4 = 0.73831043 > 0.10$; classified as `STABLE`. | None. Verified across Module 06, 08, 10, and CF-01. | Numerical extraction from JSON. | `src/asd_mcda/v2/stability.py`, validation JSON | **ESTABLISHED** |
| **Q-04** | How does dynamic $K$ selection behave across additional model drugs (Ibuprofen, Itraconazole)? | Validation report confirms Ibuprofen selects $K=2$ ($97.10\%$) and Itraconazole selects $K=2$ ($95.53\%$). | None. Verified in Module 08 and Module 10 traces. | Comparative JSON trace extraction. | `VAL-RPT-2026-V2-001-REV1`, Module 10 Doc 03 | **ESTABLISHED** |
| **Q-05** | What is the authoritative 4x4 AHP matrix, principal eigenvalue $\lambda_{\max}$, and consistency ratio $CR$? | `backend/services/engine_adapter.py` and `ahp.py` confirm matrix $[[1,2,3,2],...]$; $\lambda_{\max}=4.131937$, $CI=0.043979$, $CR=0.049415 < 0.08$. | None. Verified in Module 05, 08, and CF-01. | AST inspection and power iteration verification. | `backend/services/engine_adapter.py`, validation JSON | **ESTABLISHED** |
| **Q-06** | What is the mathematical formulation of the TOPSIS metric in active v2? | `metrics.py` implements SP-PRP-TOPSIS using positive-definite quadratic metric tensor $M_K = V_K^T W V_K$. | None. Classical Hwang-Yoon Euclidean TOPSIS strictly refuted. | Code verification in `metrics.py`. | `src/asd_mcda/v2/metrics.py`, `engine.py` | **ESTABLISHED** |
| **Q-07** | What is the Monte Carlo replicate conservation structure and block distribution for Indomethacin? | JSON records $10,000$ generated, $8,600$ valid ($86.00\%$), $1,400$ blocked ($14.00\%$); $1,396$ AHP CR vs. 4 eigengap blocks. | None. Exactly matches Replicate Conservation Law. | AST check of `uncertainty.py` and JSON extraction. | `src/asd_mcda/v2/uncertainty.py`, validation JSON | **ESTABLISHED** |
| **Q-08** | What are the computational top-1 ranking frequencies ($p_{\text{top1}}$) under input uncertainty? | Validation JSON records Soluplus $p_{\text{top1}} = 55.51\%$ ($4,774 / 8,600$) and HPMC E5 $p_{\text{top1}} = 42.00\%$ ($3,612 / 8,600$). | None. Verified across Modules 06, 08, and CF-01. | Numerical extraction from JSON. | `scientific_validation_results.json` | **ESTABLISHED** |
| **Q-09** | What occurs mathematically when all $p=4$ components are retained ($K=p=4$)? | CF-04 confirmed full-space metric reduction identity: $V_4 V_4^T = I_4$, metric collapses to unrotated weighted Euclidean ($|C_{L,\text{CF04}} - C_{L,\text{CF01}}| < 10^{-15}$). | None. Verified in Phase 8 execution and audit. | Algebraic proof and machine record in CF-04. | `WHAT_IF_EXPERIMENTS.md`, `PHASE_8_EXECUTION_RESULTS.json` | **ESTABLISHED** |
| **Q-10** | How does software governance respond when eigengap $\delta_K < 0.03$? | CF-05 confirmed pipeline halts at Step 3, raising `DegenerateSubspaceBlockedError`. | None. AST verified and live execution tested. | Exception trace in CF-05 record. | `src/asd_mcda/v2/stability.py`, CF-05 | **ESTABLISHED** |
| **Q-11** | How does software governance respond when AHP consistency ratio $CR \ge 0.08$? | CF-07 confirmed pipeline halts at Step 4, raising `AHPConsistencyViolationError`. | None. Verified in live execution and Monte Carlo filtering. | Exception trace in CF-07 record. | `src/asd_mcda/v2/ahp.py`, CF-07 | **ESTABLISHED** |
| **Q-12** | How does software governance respond to malformed SMILES input? | CF-16 confirmed pipeline halts at Step 0, raising `RDKitParseFailureError`. | None. Verified in CF-16 execution. | Exception trace in CF-16 record. | `src/asd_mcda/v2/chemistry.py`, CF-16 | **ESTABLISHED** |
| **Q-13** | How does standardization behave when a criterion or all candidate rows have zero variance? | CF-17 and CF-19 confirmed pipeline halts at Step 1, raising `ZeroVarianceStandardizationError`. | None. Disproved claim that production emits $C_L=0.50$. | Exception trace in CF-17/CF-19 records. | `src/asd_mcda/v2/standardization.py`, CF-17, CF-19 | **ESTABLISHED** |
| **Q-14** | What causes ranking inversions between Soluplus and HPMC E5 under equal or perturbed weights? | CF-12 ($w = [0.25, 0.25, 0.25, 0.25]$) and CF-13 ($w_4=0.4578$) confirmed rank inversions stem from weight re-allocation toward $s_{\text{GT}}$. | None. Purged all causal/physical overclaims. | Machine JSON records for CF-12 and CF-13. | `WHAT_IF_EXPERIMENTS.md`, `PHASE_8_EXECUTION_RESULTS.json` | **ESTABLISHED** |
| **Q-15** | Are the 4 criteria non-redundant in decision space? | CF-08 through CF-11 demonstrated in standalone $p=3$ testbeds that criterion omission alters geometry and rank order. | None. Segregated as Class C standalone testbeds. | Analytic trace in `WHAT_IF_EXPERIMENTS.md`. | `WHAT_IF_EXPERIMENTS.md`, Section 5 | **ESTABLISHED** |
| **Q-16** | Are closeness scores ($C_L$) commensurable across cohorts with different subspace dimensions? | Modules 04, 08, 10 note that distances in $\mathbb{R}^3$ and $\mathbb{R}^2$ occupy different metric spaces. | Formal mathematical bounds on cross-cohort geometric distortion have not been tabulated. | Mathematical derivation of non-commensurability. | Module 04 Doc 04, Module 08 Doc 04 | **PARTIALLY ESTABLISHED** |
| **Q-17** | What are the exact numerical limits of floating-point non-associativity across IEEE 754 platforms? | Modules 07 and 08 document non-associativity and establish $|C_L^{(A)} - C_L^{(B)}| \le 10^{-12}$. | Cross-compiler (MSVC vs. GCC vs. Clang) empirical verification matrix not compiled into single ledger. | Reconciled tolerance ledger across BLAS/LAPACK builds. | `src/asd_mcda/v2/`, Module 07 Doc 07 | **PARTIALLY ESTABLISHED** |
| **Q-18** | Does an integrated, authoritative Quantitative Master Ledger exist for all 15 stages to support Module 12? | Numbers are scattered across code, validation JSON, Module 08, Module 10, and Module 11. | No single, unified, multi-source reconciled quantitative ledger exists in `12_NUMBERS_YOU_MUST_KNOW/`. | Compilation of Phase 9 Quantitative Master Ledger. | Active codebase and validation artifacts | **OPEN** |
| **Q-19** | How does dynamic $K$ selection and eigengap governance behave across 20+ BCS Class II/IV compounds? | Tested only on Indomethacin, Ibuprofen, Itraconazole, and DRG-0003. | Uncharacterized behavior across broad chemical space. | Curated chemical library and batch execution. | External chemical databases | **REQUIRES IMPLEMENTATION** |
| **Q-20** | How do computational closeness scores ($C_L$) correlate with experimental dissolution rates? | None. Purely computational framework. | Zero experimental dissolution curves. | In vitro dissolution testing (USP II). | Wet-lab laboratory | **REQUIRES EXPERIMENT** |
| **Q-21** | How does polymer ranking correlate with long-term amorphous physical stability under 40°C/75% RH? | None. Purely computational framework. | Zero experimental accelerated stability data. | PXRD / DSC physical stability study. | Wet-lab laboratory | **REQUIRES EXPERIMENT** |
| **Q-22** | Can the MCDA framework screen ternary ASD formulations containing surfactants? | Currently models binary drug-polymer systems at 30% loading. | No ternary thermodynamics or surfactant criteria. | Extension of `chemistry.py` and criterion models. | Production codebase | **REQUIRES IMPLEMENTATION** |
| **Q-23** | What is the statistical distribution of boundary eigengap $\delta_K$ under experimental measurement noise? | Monte Carlo perturbs criteria by $\sigma=0.05$ across 10,000 replicates for Indomethacin. | No multi-drug distribution analysis of eigengap density. | Large-scale synthetic Monte Carlo screening study. | Validation harness | **REQUIRES VALIDATION** |
| **Q-24** | Can AHP pairwise comparison matrices be derived directly from first-principles thermodynamics? | AHP is fundamentally an epistemic multi-criteria preference model. | Epistemological limitation: preference != physical law. | None. Inherent boundary of decision science. | Decision theory literature | **BLOCKED** |

---

## 3. Evidence Status Summary

```
Total Questions Audited: 24
- ESTABLISHED             : 15 (62.5%)
- PARTIALLY ESTABLISHED   :  2  (8.3%)
- OPEN                    :  1  (4.2%)  --> Targeted for resolution in Phase 9 (Module 11 -> Module 12 handoff)
- REQUIRES IMPLEMENTATION :  2  (8.3%)  --> Excluded from Phase 9 (preserves code freeze)
- REQUIRES EXPERIMENT     :  2  (8.3%)  --> Excluded from Phase 9 (outside computational scope)
- REQUIRES VALIDATION     :  1  (4.2%)  --> Excluded from Phase 9 (deferred to post-viva studies)
- BLOCKED                 :  1  (4.2%)  --> Epistemological boundary (permanent non-claim)
```

The matrix proves that the computational and counterfactual foundations of PharmaPolySCOPE are mature (15/24 established), while experimental and implementation expansions are properly demarcated. The sole open requirement within the curriculum's scope is **Q-18 (Quantitative Master Ledger Compilation)**, confirming the focus of Phase 9.
