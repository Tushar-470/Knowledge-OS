# PHASE 1 FORENSIC CORRECTION LOG
## PharmaPolySCOPE Viva School

**Date of correction:** 2026-09-14
**Correction basis:** Direct read-only forensic inspection of production source files
**Corrected document:** PHARMAPOLYSCOPE_MASTER_KNOWLEDGE_MAP.md

---

## Authoritative Source Hierarchy Used

1. PRODUCTION IMPLEMENTATION (highest priority)
   - `backend/services/engine_adapter.py` (lines 95-104) -- AUTHORITATIVE_V2_AHP_MATRIX
   - `src/asd_mcda/v2/uncertainty.py` (line 160) -- num_replicates default
   - `config/polymers/polymer_library_v3_five_polymers.csv` -- active cohort
2. VALIDATED ARTIFACT
   - `results/validation/v2_scientific_validation/scientific_validation_results.json`
3. TEST FIXTURES
   - `tests/v2/conftest.py` (lines 203-217) -- confirms AHP matrix

---

## Correction Record

---

### CORRECTION 1 -- AHP PAIRWISE COMPARISON MATRIX (CRITICAL)

**Phase 1 (INCORRECT) matrix:**
```
HSP   chi   desc   GT
 1     2     5      3
1/2    1     4      2
1/5   1/4    1    1/3
1/3   1/2    3      1
```

**Authoritative (CORRECT) matrix** (source: `backend/services/engine_adapter.py` lines 99-104,
confirmed by `tests/v2/conftest.py` lines 206-211):
```
HSP   chi   desc   GT
 1     2     3      2
1/2    1     5      2
1/3   1/5    1    1/2
1/2   1/2    2      1
```

Exact values:
```python
AUTHORITATIVE_V2_AHP_MATRIX = np.array([
    [1.0,       2.0, 3.0, 2.0],
    [0.5,       1.0, 5.0, 2.0],
    [1.0/3.0,   0.2, 1.0, 0.5],
    [0.5,       0.5, 2.0, 1.0],
], dtype=np.float64)
```

Note: row 3 (desc) column 1 = 1/3 = 0.33333... and column 2 = 0.2 = 1/5 as exact
reciprocals of the upper-triangle entries (3 and 5). Row 3 column 4 = 0.5 = 1/2.

**Weights** (from scientific_validation_results.json -- authoritative):
    w = [0.40767478, 0.32443341, 0.09216134, 0.17573047]
    lambda_max = 4.131937
    CI = 0.043979
    CR = 0.049415 < 0.08 [ACCEPTED]

**Resolution:** The weights and CR values reported in the validation artifact are
authoritative and consistent with the correct matrix. They are retained unchanged.
Only the displayed matrix was wrong in Phase 1 v1.0.

**Conflicting statement in Phase 1:** The incorrect matrix was stated as
"production, exact fractions" -- this was an error in prior session summary
that was carried forward unchecked into Phase 1 v1.0.

---

### CORRECTION 2 -- MONTE CARLO REPLICATE COUNT (CRITICAL)

**Phase 1 (INCORRECT):** "n_replicates = 2,000 (default)"

**Authoritative (CORRECT):**

A. Implementation default (`src/asd_mcda/v2/uncertainty.py` line 160):
       num_replicates: int = 10000

B. Validation study replicate count
   (`results/validation/v2_scientific_validation/scientific_validation_results.json`
    key: cohorts > IND-001-2026 > monte_carlo > num_replicates):
       10000

C. Valid replicates in Indomethacin validation:
       num_valid_replicates: 8600

D. Blocked replicates:
       num_blocked_replicates: 1400

E. Valid ratio: 0.86 (86% of 10,000 generated)

F. Block reasons histogram (Indomethacin):
   - AHP_CR_BLOCKED: 1396 (the dominant block reason)
   - EIGENGAP_BLOCKED: 4
   - All others: 0

**The "~14% blocked" figure is correct in magnitude** (1400/10000 = 14%),
but Phase 1 v1.0 stated it over a 2,000-replicate base, which was wrong.

**Resolution:** All MC references updated to N_generated = 10,000, N_valid = 8,600,
N_blocked = 1,400.

**NOTE on p_top1 denominator:** The p_top1 frequencies (Soluplus 55.51%, HPMC E5 42.00%)
are computed as fractions of N_valid (8,600), not N_generated (10,000). This is
confirmed by the source code (uncertainty.py line 357: p_top1 = mean(r_i == 1)
over valid replicates only). The percentages are correct; the denominator is 8,600.

---

### CORRECTION 3 -- POLYMER COHORT (CRITICAL)

**Phase 1 v1.0 (INCORRECT) cohort included:**
- Soluplus (POL-005-2026) -- CORRECT
- HPMC E5 (POL-006-2026) -- CORRECT
- Eudragit E PO (POL-007-2026) -- CORRECT
- PVPVA 64 (POL-008-2026) -- WRONG ID (correct is POL-002-2026)
- HPMCAS-MF (POL-009-2026) -- DOES NOT EXIST IN LIBRARY

**Authoritative five-polymer cohort** (source: `config/polymers/polymer_library_v3_five_polymers.csv`):

| polymer_id    | polymer_name                     | abbreviation |
|--------------|----------------------------------|-------------|
| POL-001-2026  | Polyvinylpyrrolidone K30         | PVP_K30      |
| POL-002-2026  | PVP-Vinyl Acetate 64             | PVP_VA_64    |
| POL-005-2026  | Soluplus                         | SOLUPLUS     |
| POL-006-2026  | Hydroxypropyl Methylcellulose E5 | HPMC_E5      |
| POL-007-2026  | Eudragit E PO                    | EDR_EPO      |

HPMCAS-MF has no entry in the active library. It must not appear in the active
cohort description. It may be mentioned only as an example of a polymer class that
COULD be added in Exploratory mode, with explicit annotation it is NOT part of the
active v2 validated cohort.

**Indomethacin deterministic ranking** (from scientific_validation_results.json):

| Rank | Polymer ID    | Name            | C_L (10 sig.fig.) |
|------|--------------|-----------------|------------------|
| 1    | POL-005-2026 | Soluplus         | 0.6864350840     |
| 2    | POL-006-2026 | HPMC E5          | 0.6731464918     |
| 3    | POL-002-2026 | PVP-VA64         | 0.6062468903     |
| 4    | POL-001-2026 | PVP K30          | 0.5875839043     |
| 5    | POL-007-2026 | Eudragit E PO    | 0.5456162038     |

Phase 1 v1.0 showed only Ranks 1-2. The complete ranking is now stated.

---

### CORRECTION 4 -- LEGACY V1.5 TEST FAILURE FRAMING

**Phase 1 v1.0 (IMPRECISE):**
"6 legacy v1.5 test failures demonstrate, by failing, the exact design error v2 corrects:
v1.5 hardcodes K=2 for Indomethacin; v2 correctly selects K=3 based on data."

**Corrected framing:**
These tests encode the frozen v1.5 fixed-K=2 architecture. After corrected drug chemistry
is applied, the v2 variable-K engine selects K=3 for Indomethacin.

These tests are NOT v2 acceptance tests. They exist to preserve the historical v1.5
contract and to confirm v1.5 code remains byte-identical to commit 31eee4d.

The correct statement: "Those tests preserve the historical v1.5 fixed-K contract;
the v2 architecture deliberately removes the fixed-K assumption, replacing it with
data-driven K selection. The failing tests do not indicate a bug in v1.5 -- they
indicate that v1.5's fixed-K design assumption is architecturally superseded by v2."

---

### CORRECTION 5 -- DRG-0002 INCIDENT FRAMING

**Phase 1 v1.0 (INCOMPLETE):**
Described DRG-0002 as if it merely "demonstrated the governance system working correctly."

**Corrected framing:**
DRG-0002 was an input-integrity violation. The profile was labelled "Fenofibrate" but
contained Indomethacin SMILES and Indomethacin physicochemical parameters.

v2 chemistry.py `validate_chemical_structure()` detected the mismatch and raised
FATAL_METADATA_MISMATCH. Profile is blocked.

Critical distinctions:
- Blocking an invalid input is evidence the INPUT-GOVERNANCE LAYER detected an
  integrity problem -- NOT evidence the scientific model is correct.
- The original 18-drug batch (historical v1.5, some with invalid/placeholder chemistry)
  is NOT valid scientific evidence. Those results are under review.
- The v2 fail-fast behavior is a METHODOLOGICAL INTEGRITY SAFEGUARD.
- Blocking rather than approximating is a deliberate scientific integrity decision.

---

### CORRECTION 6 -- TERMINOLOGY

All occurrences of overstrong or ambiguous language were corrected:

| Removed phrase | Replacement |
|---------------|-------------|
| "best polymer" | "top-ranked computational candidate" |
| "predicts formulation success" | "computationally ranks polymer candidates under specified assumptions" |
| "proves miscibility" | "provides a compatibility diagnostic" |
| "55.51% chance of success" | "55.51% computational top-1 frequency under the specified uncertainty model (over 8,600 valid replicates of 10,000 generated)" |
| "PCA identifies important variables" | "PCA identifies orthogonal directions capturing variance in the cohort compatibility data" |

---

### CORRECTION 7 -- HPMCAS-MF SUBSTITUTION REMOVAL

Every occurrence of HPMCAS-MF as an active cohort member has been removed.
HPMCAS-MF is mentioned only once in Part 1.3, with explicit note it is NOT part
of the active validated cohort.

---

## Source Conflict / Resolution Log

| # | Conflicting Claim | Source A | Source B | Authoritative Source | Corrected Value |
|---|-------------------|---------|---------|---------------------|----------------|
| 1 | AHP matrix entries | Prior session summary (wrong matrix) | engine_adapter.py:99-104 | engine_adapter.py | [[1,2,3,2],[0.5,1,5,2],[1/3,0.2,1,0.5],[0.5,0.5,2,1]] |
| 2 | MC replicate count | Prior session summary (2000) | uncertainty.py:160 + validation JSON | Both = 10,000 | N_gen=10000, N_valid=8600, N_blocked=1400 |
| 3 | POL-008-2026 / POL-009-2026 | Phase 1 map (fabricated) | polymer_library_v3_five_polymers.csv | CSV file | POL-001 and POL-002; no 008 or 009 |
| 4 | HPMCAS-MF in active cohort | Phase 1 map (wrong) | CSV (HPMCAS-MF absent) | CSV file | Removed from active cohort |
| 5 | p_top1 denominator | Phase 1 implied N=2000 | uncertainty.py:357 + validation JSON | Both: N_valid=8600 | Stated correctly with both N_gen and N_valid |

---

*End of PHASE1_CORRECTION_LOG.md*
