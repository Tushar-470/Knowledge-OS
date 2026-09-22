# PharmaPolySCOPE Viva School - Phase 2 Review Document

**Generated:** 2026-09-14
**Phase:** 2 - Core Teaching Curriculum (Modules 01-04)
**Status:** COMPLETE - PENDING USER REVIEW

---

## Summary

Phase 2 has produced 20 teaching documents across four module directories. All documents follow
the mandatory curriculum structure: Beginner -> Technical -> PharmaPolySCOPE Implementation ->
Worked Example -> Viva Defence.

All scientific values are sourced exclusively from:
- `scientific_validation_results.json` (production-validated numerical results)
- Actual source files (`chemistry.py`, `hsp_model.py`, `flory_huggins.py`, `gordon_taylor.py`,
  `matrix.py`, `standardization.py`, `pca.py`, `stability.py`, `ahp.py`)
- `config/polymers/polymer_library_v3_five_polymers.csv`

---

## File Inventory

### 01_PHARMACEUTICAL_FOUNDATIONS (4 files, ~91 KB)

| File | Size | Topic |
|------|------|-------|
| `01_ASD_FUNDAMENTALS.md` | 22.7 KB | BCS Class II drugs, crystalline vs amorphous, ASD concept, drug loading (30% w/w) |
| `02_DRUG_POLYMER_COMPATIBILITY.md` | 23.0 KB | Compatibility mechanisms, four-criterion rationale, v1.5.0-FOUR-CRITERION-FREEZE |
| `03_POLYMER_SCIENCE_FOR_ASD.md` | 22.8 KB | Polymer structure, Tg, Mn/Mw, the five validated polymers, why HPMCAS-MF absent |
| `04_THERMODYNAMICS_BEHIND_ASD.md` | 22.9 KB | delta_G_mix, spinodal vs nucleation, Tg as kinetic barrier, FH and GT as model diagnostics |

### 02_CHEMICAL_INFORMATICS (4 files, ~83 KB)

| File | Size | Topic |
|------|------|-------|
| `01_SMILES_FROM_ZERO.md` | 21.6 KB | SMILES syntax from scratch, canonical form, InChI/InChIKey, Indomethacin SMILES walkthrough |
| `02_RDKIT_ARCHITECTURE.md` | 21.1 KB | RDKit parsing pipeline, sanitization, v2 chemistry.py architecture, no-fallback design |
| `03_MOLECULAR_DESCRIPTORS.md` | 19.5 KB | All 8 descriptors with Indomethacin values, molar volume V_m, 2D vs 3D, Lipinski context |
| `04_CHEMICAL_DATA_INTEGRITY.md` | 21.0 KB | DRG-0002 incident in full, authoritative overwrite principle, discrepancy audit trail |

### 03_COMPATIBILITY_CRITERIA (6 files, ~117 KB)

| File | Size | Topic |
|------|------|-------|
| `01_HSP.md` | 20.4 KB | Hildebrand->Hansen, Ra formula with factor-of-4, RED, s_HSP = max(0,1-RED/2), Gate 1 |
| `02_HOFTYZER_VAN_KREVELEN.md` | 18.8 KB | Group contribution method, delta_d/p/h estimation, Lindvig sub-weight context |
| `03_FLORY_HUGGINS.md` | 19.9 KB | Lattice model, delta_G_mix, chi_c, Lindvig chi formula vs classical, s_chi |
| `04_GORDON_TAYLOR.md` | 18.2 KB | Tg_mix equation, Simha-Boyer K, Boyer-Beaman rule, s_GT with +30K/50K normalization |
| `05_DESCRIPTOR_COMPATIBILITY.md` | 19.2 KB | Full s_desc formula, four sub-components, worked example, AHP vs sub-weight distinction |
| `06_FOUR_CRITERION_DECISION_MATRIX.md` | 20.6 KB | N x 4 S matrix, build_matrix(), validated Indomethacin S matrix, four-criterion freeze |

### 04_MATHEMATICS (6 files, ~64 KB)

| File | Size | Topic |
|------|------|-------|
| `01_DESCRIPTIVE_STATISTICS.md` | 8.1 KB | Scalars/vectors/matrices, mean, variance (ddof=0 rationale), covariance, correlation |
| `02_STANDARDIZATION.md` | 10.2 KB | Z-score formula, physical ideal/anti-ideal standardization, zero-variance guardrail |
| `03_LINEAR_ALGEBRA.md` | 10.0 KB | Vectors, matrices, dot product, quadratic form, eigenvalues, Spectral Theorem |
| `04_PCA_FROM_FIRST_PRINCIPLES.md` | 12.9 KB | R = (1/n)Z^TZ derivation, scipy.linalg.eigh, sign canonicalization, v1.5 vs v2 |
| `05_DYNAMIC_K_SELECTION.md` | 10.9 KB | 95% threshold rule, K variation by drug, MC K-distribution (K=3 for 90.78% of valid) |
| `06_EIGENGAP_STABILITY_GOVERNANCE.md` | 11.7 KB | delta_K, STABLE/WARNING/BLOCKED thresholds, EIGENGAP_BLOCKED=4, worked examples |

**Total: 20 files, ~355 KB**

---

## Scientific Integrity Checklist

The following forensic constraints from Phase 1 have been enforced throughout all 20 documents:

| Constraint | Status |
|-----------|--------|
| AHP matrix = [[1,2,3,2],[0.5,1,5,2],[1/3,0.2,1,0.5],[0.5,0.5,2,1]] | ENFORCED |
| AHP weights = [0.4077, 0.3244, 0.0922, 0.1757] | ENFORCED |
| RI_4 = 0.89 (from ahp.py, NOT 0.90 from constants.py) | ENFORCED |
| CR = 0.049415 < 0.08 -> ACCEPTED | ENFORCED |
| N_generated = 10,000 (NOT 2,000) | ENFORCED |
| N_valid = 8,600 / N_blocked = 1,400 | ENFORCED |
| AHP_CR_BLOCKED = 1,396 / EIGENGAP_BLOCKED = 4 | ENFORCED |
| Active cohort: POL-001, POL-002, POL-005, POL-006, POL-007 only | ENFORCED |
| HPMCAS-MF not in active cohort | ENFORCED |
| Indomethacin K=3 (NOT K=2) | ENFORCED |
| s_HSP = "compatibility diagnostic" | ENFORCED |
| s_chi = "interaction compatibility / phase-boundary diagnostic" | ENFORCED |
| s_GT = "model-predicted glass-transition margin" | ENFORCED |
| Rankings = "top-ranked computational candidate" | ENFORCED |
| MC p_top1 = "computational top-1 frequency" (NOT "probability of success") | ENFORCED |
| Soluplus C_L = 0.68643508 (Rank 1) | ENFORCED |
| HPMC E5 C_L = 0.67314600 (Rank 2) | ENFORCED |
| drug_loading_ww = 0.30 (default) | ENFORCED |
| LINDVIG_ALPHA = 0.60, LINDVIG_SUBWEIGHTS = (1.0, 0.25, 0.25) | ENFORCED |
| BOYER_BEAMAN_FACTOR = 0.70 | ENFORCED |
| DRG-0002 framed as "INPUT-GOVERNANCE demonstration" | ENFORCED |
| No modification to PharmaPolySCOPE source repository | ENFORCED |

---

## Structural Requirements Checklist (per document)

| Requirement | Status |
|-------------|--------|
| Cross-reference header (Prerequisite / Used by / Source / Tests / Validation / Viva) | All 20 docs |
| Beginner analogy section | All 20 docs |
| Technical section with equations | All 20 docs |
| Literature form vs PharmaPolySCOPE form comparison | Criteria docs (03_*) |
| Hand-calculable worked example (hypothetical, clearly labeled) | All math/criteria docs |
| PharmaPolySCOPE production values (Indomethacin) | All 20 docs |
| Implementation trace block | All 20 docs |
| Assumptions and limitations section | All 20 docs |
| 10 Basic viva Q&As | All 20 docs |
| 10 Intermediate viva Q&As | All 20 docs |
| 10 Difficult viva Q&As | All 20 docs |
| 10 Hostile viva Q&As | All 20 docs |
| Common mistakes section | All 20 docs |
| Things you must never claim section | All 20 docs |
| v1.5 vs v2 comparison (where relevant) | Math module docs |

---

## Version Semantics Used

These version labels have been consistently applied throughout:

| Label | Meaning |
|-------|---------|
| `1.5.0` | Package/API anchor (pip-installable version) |
| `2.0.0` | Active computational engine |
| `2.0.0-SP-PRP-TOPSIS` | Full methodology identifier |
| `v1.5.0-FOUR-CRITERION-FREEZE` | Scientific baseline (criteria immutably frozen) |
| `v2.0.0` | Git release tag (commit 1139397) |
| `31eee4d` | Commit at which v1.5 engine is byte-identical |

---

## What Phase 2 Does NOT Cover (reserved for future authorization)

The following modules have been explicitly held back per user directive:

- `05_DECISION_SCIENCE\` -- SP-PRP-TOPSIS, metric tensor M_K, C_L formula, ranking mechanics
- `06_UNCERTAINTY\` -- Monte Carlo architecture, Morris sensitivity, N_generated/N_valid/N_blocked
- `07_SOFTWARE_ARCHITECTURE\` -- VariableKEngine, 9-step pipeline, v1.5 isolation, AST isolation test
- `08_VALIDATION_AND_GOVERNANCE\` -- scientific_validation_results.json, AHP governance gate, CR audit
- `09_VIVA_ATTACK_FILES\` -- adversarial Q&A, common challenges, forbidden claims compendium
- All drug-specific case study modules (Indomethacin deep-dive, Ibuprofen, Itraconazole)

---

## Instructions for Reviewer

Before approving Phase 2, spot-check the following:

1. **Scientific values** in any document against `scientific_validation_results.json`:
   - Eigenvalues: [2.0909, 1.1679, 0.7398, 0.0015] for Indomethacin
   - K=3, cumVar=99.96%, delta_3=0.7383 (STABLE)
   - AHP CR=0.049415, weights=[0.4077, 0.3244, 0.0922, 0.1757]
   - Soluplus Rank 1 C_L=0.68643508, MC p_top1=55.51%

2. **Terminology compliance** -- search any document for: "best polymer", "predicts success",
   "proves miscibility", "HPMCAS", "2,000 replicates". None of these should appear.

3. **s_desc sub-weight distinction** in `05_DESCRIPTOR_COMPATIBILITY.md` -- the 0.30/0.30/0.20/0.20
   internal weights must be clearly distinguished from AHP weights 0.408/0.324/0.092/0.176.

4. **RI_4 note** in any AHP document -- must state RI_4=0.89 from ahp.py (NOT 0.90 from constants.py).

---

## Next Step (Awaiting Authorization)

**User must explicitly authorize Phase 3** before any further documents are generated.

Candidate Phase 3 scope (for discussion, not yet approved):
- Module 05: Decision Science (SP-PRP-TOPSIS, metric tensor, C_L ranking)
- Module 06: Uncertainty (Monte Carlo architecture, Morris sensitivity, governance distribution)

To authorize Phase 3, say: **"PHASE 2 IS APPROVED. Proceed to Phase 3."**

---

*Document integrity: All content sourced from validated production artifacts. No source code was
modified. No documents placed in the PharmaPolySCOPE source repository.*
