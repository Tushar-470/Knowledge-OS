# PHARMAPOLYSCOPE — MODULE 15
# V1.5 SOURCE-HASH GOVERNANCE REPAIR REVIEW

- **Document Identifier:** `PS-VIVA-MOD15-GOV-001`
- **Revision:** `1.0.0-FINAL`
- **Date:** 2026-09-25
- **Mode:** READ-ONLY GOVERNANCE ANALYSIS
- **Authorizing Context:** Resolution of the logical inconsistency between `V1_5_SOURCE_HASH_DELTA = UNRESOLVED` and `MERGE_AUTHORIZED`.

---

## EXECUTIVE SUMMARY

During the post-implementation forensic audit of Module 15 ($M_n$ Optionality Decoupling), an unresolved failure was recorded for:
`tests/v2/test_v15_isolation_regression.py::test_v15_baseline_files_unmodified`
caused by cryptographic SHA-256 mismatches on files tracked in `tests/v2/v15_golden_hashes.json`.

This review resolves the architectural tension between:
1. **The Inviolability of Historical Git Provenance:** `tests/v2/v15_golden_hashes.json` is anchored to Git commit `31eee4d` and verified against `git show 31eee4d:<path>`. It must NOT be rewritten or mutated to match working-tree changes.
2. **The Shared Compatibility Surface:** Files located in `src/asd_mcda/` that serve both historical v1.5 workflows and active v2/web screening pipelines (specifically `flory_huggins.py`, `polymer_library.py`, `predictor.py`, and `report_generator.py`) were intentionally modified under authorized Module 15 specifications to support nullable $M_n$.
3. **Merge-Gate Inconsistency:** A status of `V1_5_SOURCE_HASH_DELTA = UNRESOLVED` is logically incompatible with `MERGE_AUTHORIZED = YES`. As long as an automated regression test fails in the repository without an explicit architectural governance mechanism, merge authorization must remain strictly **`MERGE_AUTHORIZED = NO`**.

---

## 1. HISTORICAL MANIFEST IMMUTABILITY

### Cryptographic Anchor to Commit `31eee4d`
Inspection of `tests/v2/v15_golden_hashes.json` confirms:
- **Recorded Commit:** `"commit": "31eee4d"`
- **Total Tracked Files:** `71`
- **Integrity Test:** In `tests/v2/test_v15_isolation_regression.py`, `test_v15_golden_manifest_matches_commit()` executes:
  ```python
  git_show_arg = f"{FROZEN_COMMIT}:{rel_path}"
  res = subprocess.run(["git", "show", git_show_arg], capture_output=True, check=True)
  git_hash = hashlib.sha256(res.stdout).hexdigest().lower()
  assert git_hash == expected_hash
  ```

### Immutability Principle
The historical manifest `tests/v2/v15_golden_hashes.json` **MUST REMAIN PERMANENTLY IMMUTABLE**.

**Forensic Rationale:**
1. If an engineer or governance agent updates the SHA-256 hashes in `v15_golden_hashes.json` to match the current working tree of commit `5ad6147`, then `test_v15_golden_manifest_matches_commit()` will immediately fail because `git show 31eee4d:src/asd_mcda/compatibility/flory_huggins.py` will continue to return the historical file with SHA-256 `077f89d4...`.
2. A historical manifest records an immutable fact of repository history: *what the exact bytes were at commit 31eee4d*. Changing the recorded hash of commit `31eee4d` is falsification of cryptographic provenance.
3. Therefore, `HISTORICAL_V1_5_MANIFEST_IMMUTABLE = YES`. The manifest must never be rewritten merely because a shared file was modified for V2.

---

## 2. SHARED FILE CLASSIFICATION

A forensic audit of all 71 files tracked in `v15_golden_hashes.json` against the active v2 architecture establishes a three-tier taxonomy:

```
+-----------------------------------------------------------------------------------+
|                        REPOSITORY FILE CLASSIFICATION MATRIX                      |
+-----------------------------------------------------------------------------------+
| CLASS A: V1.5-ONLY IMMUTABLE BASELINE (67 files in manifest)                      |
|   - Results: results/final/* (all 6 files), results/reports/* (all files)         |
|   - Historical MCDA Engine: src/asd_mcda/orchestrator.py, src/asd_mcda/mcda/*     |
|   - Historical PCA & Integration: src/asd_mcda/integration/*                     |
|   - Historical Uncertainty & Sensitivity: src/asd_mcda/uncertainty/*, sensitivity |
|   - Reference Configurations: config/drugs/indomethacin.json, config/ahp/*        |
|   - Reference Polymer Library: config/polymers/polymer_library_v3_five_polymers.csv|
|   - Status: ZERO MODIFICATIONS PERMITTED. Working tree must match commit 31eee4d.  |
|                                                                                   |
| CLASS B: V2-ONLY ARCHITECTURE (Not in v1.5 manifest)                              |
|   - Core Engine: src/asd_mcda/v2/* (all 15 modules)                               |
|   - Tests: tests/v2/* (except isolation test), tests/web/*                        |
|   - Status: Active v2 development surface.                                        |
|                                                                                   |
| CLASS C: SHARED V1.5 / V2 COMPATIBILITY SURFACE (4 files in manifest)              |
|   1. src/asd_mcda/compatibility/flory_huggins.py                                  |
|   2. src/asd_mcda/polymer/polymer_library.py                                      |
|   3. src/asd_mcda/prediction/predictor.py                                         |
|   4. src/asd_mcda/reporting/report_generator.py                                   |
|   - Status: Shared domain, diagnostic, and reporting infrastructure.              |
+-----------------------------------------------------------------------------------+
```

### Specific Classification of `src/asd_mcda/compatibility/flory_huggins.py`:
`src/asd_mcda/compatibility/flory_huggins.py` belongs unambiguously to **Class C: Shared V1.5/V2 Compatibility Surface**.

**Evidence:**
1. **Imported by v1.5 Legacy Executable Path:**
   - `src/asd_mcda/orchestrator.py` (v1.5 orchestrator) imports `FloryHugginsModel`.
   - `tests/unit/test_compatibility.py` imports `FloryHugginsModel`.
   - `tests/unit/test_v150_four_criterion.py` imports `FloryHugginsModel` and `evaluate_gate1_diagnostic`.
2. **Imported by Active v2 / Web Production Path:**
   - `backend/services/engine_adapter.py` imports `FloryHugginsModel`.
   - `backend/services/pdf_report_generator.py` imports `FloryHugginsModel` and `evaluate_gate1_diagnostic`.
   - `src/asd_mcda/prediction/predictor.py` imports `FloryHugginsModel`.
3. **Dual Responsibility:**
   - It computes $s_\chi$ (Criterion 2 of the 4 criteria matrix $\mathbf{S}$), which is an essential input to both v1.5 and v2 MCDA.
   - It computes secondary diagnostic Gate 1 ($\chi_c$), which was updated in Module 15 to decouple $M_n$ optionality.

---

## 3. HASH TEST SEMANTICS ANALYSIS

In `tests/v2/test_v15_isolation_regression.py`:

```python
def test_v15_baseline_files_unmodified():
    """Regression Test 2: Assert all protected working-tree files match golden SHA-256 digests from commit 31eee4d."""
    manifest, files = _load_golden_manifest()

    for rel_path, entry in files.items():
        expected_hash = entry["sha256"].lower()
        file_path = os.path.join(BASE_DIR, rel_path.replace("/", os.sep))
        assert os.path.exists(file_path), f"Protected v1.5 baseline file missing: {rel_path}"

        actual_hash = _compute_working_tree_hash(file_path, expected_hash)
        assert actual_hash == expected_hash, (
            f"Cryptographic SHA-256 mismatch for protected file '{rel_path}'!\n"
            f"  Expected (commit {FROZEN_COMMIT}): {expected_hash}\n"
            f"  Actual (working tree):              {actual_hash}"
        )
```

### Forensic Determination:
- **Intended Verification:** **HISTORICAL SOURCE IDENTITY.**
  The test does not execute functions, instantiate classes, or evaluate numerical tolerances. It reads raw bytes from disk, normalizes CRLF/LF, computes `hashlib.sha256()`, and asserts exact string equality against commit `31eee4d`.
- **Architectural Conflation:**
  The test conflates *purely historical, abandoned v1.5 files* (such as `src/asd_mcda/orchestrator.py` and `results/final/*`) with *live, shared domain/diagnostic files* (`flory_huggins.py`, `polymer_library.py`, `predictor.py`, `report_generator.py`).
- **Discovery of Multiple Mismatches:**
  A comprehensive check of all 71 manifest files against the current working tree revealed that **four (4) files** have working tree hashes different from commit `31eee4d`:
  1. `src/asd_mcda/compatibility/flory_huggins.py`
  2. `src/asd_mcda/polymer/polymer_library.py`
  3. `src/asd_mcda/prediction/predictor.py`
  4. `src/asd_mcda/reporting/report_generator.py`
  
  Pytest halted at `flory_huggins.py` solely because it was the first mismatch encountered in dictionary iteration order. All 4 mismatches represent authorized Module 15 null-safety modifications.

---

## 4. REQUIRED GOVERNANCE DESIGN

To resolve this issue without compromising repository integrity, any permanent solution must satisfy five invariant principles:
1. **Preserve Immutable Historical Manifest:** `v15_golden_hashes.json` must remain intact, referencing commit `31eee4d`, so that `test_v15_golden_manifest_matches_commit()` continues to pass.
2. **Preserve Behavioral v1.5 Regression Protection:** All 57 passing legacy tests and 6 intentional failure probes must continue to execute and verify computational equivalence.
3. **Explicit Documentation of Authorized V2 Shared-File Modifications:** Shared files must not be silently bypassed; any modification must be governed by an explicit cryptographic contract.
4. **No Silent Weakening:** The test must not use blanket `try/except: pass` or ignore entire directories.
5. **No Rewriting of Historical Hashes:** Hashes anchored to commit `31eee4d` must never be edited to match commit `5ad6147`.

### Evaluated Architectural Options:

#### Architectural Pattern A: Explicit Shared-File Exception Registry in Test Harness
- `v15_golden_hashes.json` remains untouched.
- `tests/v2/test_v15_isolation_regression.py` introduces an explicit constant:
  ```python
  V2_AUTHORIZED_SHARED_MODIFICATIONS = {
      "src/asd_mcda/compatibility/flory_huggins.py": {
          "authorized_spec": "MODULE_15_MN_OPTIONALITY_ARCHITECTURE_SPEC.md",
          "v2_sha256": "e8f848c58ba670e55f7199f57b2ebec92d14e0a2e576f7924b762e50fa340bda",
      },
      "src/asd_mcda/polymer/polymer_library.py": { ... },
      "src/asd_mcda/prediction/predictor.py": { ... },
      "src/asd_mcda/reporting/report_generator.py": { ... },
  }
  ```
- In `test_v15_baseline_files_unmodified()`, if `rel_path` is in `V2_AUTHORIZED_SHARED_MODIFICATIONS`, it verifies the working tree against the authorized V2 hash; otherwise it enforces the historical v1.5 hash.

#### Architectural Pattern B: Partitioned Manifest Architecture
- Split `v15_golden_hashes.json` into:
  1. `v15_frozen_core_manifest.json` (67 immutable files; zero V2 modifications allowed).
  2. `v2_shared_surface_manifest.json` (4 shared files; versioned under V2 governance).
- `test_v15_baseline_files_unmodified()` verifies the 67 immutable core files against commit `31eee4d`.
- A new test `test_v2_shared_surface_integrity()` verifies the 4 shared files against their authorized V2 specification.

#### Architectural Pattern C: Decouple Shared Code via Physical V2 Specialization
- Copy the modified shared files into `src/asd_mcda/v2/` (e.g., `src/asd_mcda/v2/compatibility/flory_huggins.py`).
- Restore the original `src/asd_mcda/compatibility/flory_huggins.py` to its exact commit `31eee4d` byte stream.
- Update v2 backend services to import from the v2 path.

*(Note: In accordance with read-only audit instructions, no implementation choice is made in this document).*

---

## 5. FLORY-HUGGINS SPECIFIC VERIFICATION

An exhaustive forensic inspection of `src/asd_mcda/compatibility/flory_huggins.py` was conducted:

### A. Exact Historical Hash (commit `31eee4d`):
- `077f89d4c6e6152e37141fe28fafe71cdf1325482ca37f5548da37d1ebe35650`

### B. Exact Current Working Tree Hash (commit `5ad6147`):
- `e8f848c58ba670e55f7199f57b2ebec92d14e0a2e576f7924b762e50fa340bda`

### C. Exact Git Diff (`git diff 31eee4d..HEAD src/asd_mcda/compatibility/flory_huggins.py`):
```diff
--- a/src/asd_mcda/compatibility/flory_huggins.py
+++ b/src/asd_mcda/compatibility/flory_huggins.py
@@ -5,21 +5,25 @@
 import numpy as np
 import pandas as pd
-from typing import Dict, List
+from typing import Dict, List, Optional, Any
 
 from asd_mcda.drug.drug_profile import Drug
 from asd_mcda.polymer.polymer_library import Polymer, PolymerLibrary
 from asd_mcda.utils.constants import GAS_CONSTANT_R, LINDVIG_ALPHA, LINDVIG_SUBWEIGHTS
 
-def evaluate_gate1_diagnostic(chi: float, chi_c: float) -> str:
+def evaluate_gate1_diagnostic(chi: float, chi_c: Optional[float]) -> str:
     """
     Generic Gate 1 Phase-Boundary Diagnostic:
-    if chi < chi_c:
+    if chi_c is None:
+        return 'NOT_EVALUATED_MN_UNAVAILABLE'
+    elif chi < chi_c:
         return 'PASS'
     else:
         return 'FAIL'
     """
+    if chi_c is None:
+        return "NOT_EVALUATED_MN_UNAVAILABLE"
     if chi < chi_c:
         return "PASS"
     else:
@@ -61,7 +65,7 @@
         chi = LINDVIG_ALPHA * (v_m / rt) * energy_diff
         return float(chi)
 
-    def compute_chi_critical(self, polymer: Polymer) -> float:
+    def compute_chi_critical(self, polymer: Polymer) -> Optional[float]:
         """
         Compute classical binary Flory-Huggins critical interaction parameter chi_c for phase separation.
         chi_c = 0.5 * (1 + 1/sqrt(r2))^2
@@ -70,7 +74,11 @@
           - r2 = V_polymer / V_drug (relative molar volume ratio)
           - V_polymer is derived from number-average molecular weight Mn and density rho.
         Note: chi_c is a secondary phase-boundary/criticality diagnostic and is NOT used as an MCDA ranking score.
+        If Mn is unavailable, returns None (diagnostic not evaluated).
         """
+        if polymer.mn_da is None:
+            return None
+
         v_drug = self.drug.molar_volume_cm3_mol
         v_poly = polymer.mn_da / polymer.density_g_cm3 if polymer.density_g_cm3 > 0 else 1000.0
         r2 = v_poly / v_drug if v_drug > 0 else 10.0
@@ -83,7 +91,9 @@
         """
         Generic Gate 1 Phase-Boundary Diagnostic evaluation for a candidate polymer.
         Rule:
-            if chi < chi_c:
+            if chi_c is None:
+                NOT_EVALUATED_MN_UNAVAILABLE
+            elif chi < chi_c:
                 PASS
             else:
                 FAIL
@@ -91,10 +101,14 @@
         chi = self.compute_chi(polymer)
         chi_c = self.compute_chi_critical(polymer)
         status = evaluate_gate1_diagnostic(chi, chi_c)
-        passed = (status == "PASS")
-        if passed:
+        if status == "NOT_EVALUATED_MN_UNAVAILABLE":
+            passed = None
+            msg = "Flory-Huggins critical interaction parameter requires number-average molecular weight (Mn). Candidate ranking is unaffected."
+        elif status == "PASS":
+            passed = True
             msg = "Phase-boundary diagnostic favorable (chi < chi_c)."
         else:
+            passed = False
             msg = "Phase-boundary diagnostic unfavorable (chi >= chi_c) — phase-separation risk under the model diagnostic."
         return {
             "polymer_id": polymer.polymer_id,
```

### Forensic Inquiry Checkpoints:
- **D. Did mathematical equations change?** **NO.**
  - $\chi = lpha rac{V_m}{RT} [(\Delta \delta_D)^2 + 0.25(\Delta \delta_P)^2 + 0.25(\Delta \delta_H)^2]$: **Unchanged.**
  - $\chi_c = 0.5 	imes (1.0 + 1.0 / \sqrt{r_2})^2$: **Unchanged.**
  - $s_\chi = \exp(-\chi)$: **Unchanged.**
- **E. Did strict $\chi < \chi_c$ inequality change?** **NO.** The comparison logic is identical.
- **F. Did valid-$M_n$ numerical outputs change?** **NO.** All floating-point outputs are bitwise identical.
- **G. Was $M_n = 	ext{None}$ behavior added as the only intended change?** **YES.** Only null-handling and the `"NOT_EVALUATED_MN_UNAVAILABLE"` state were added.
- **H. Does v1.5 valid-$M_n$ numerical regression pass?** **YES.** All 7 tests in `tests/unit/test_compatibility.py` pass 100%.

**Verdict:** Zero unintended mathematical alterations exist in `flory_huggins.py`.

---

## 6. MERGE-GATE LOGIC RECONCILIATION

The post-implementation forensic audit previously reported:
```text
V1_5_SOURCE_HASH_DELTA = UNRESOLVED
MERGE_AUTHORIZED = YES
```
This is a formal logical defect.

### Rigorous Gate Logic:
In a high-integrity scientific software pipeline, merge authorization requires that all tests pass or that baseline exceptions are formally encoded in the test governance suite.
An unresolved test failure in `tests/v2/test_v15_isolation_regression.py` implies that the test suite on branch `feat/mn-optionality-decoupling` exits with return code `1`.

Therefore:
$$	ext{UNRESOLVED\_SOURCE\_DELTA} = 	ext{YES} \implies 	ext{MERGE\_AUTHORIZED} = \mathbf{NO}$$

No branch can be merged into `main` while carrying an unhandled assertion error in the primary regression suite. Merge authorization is withheld pending governance repair.

---

## 7. FINAL RECOMMENDATION

The auditor evaluates the two mutually exclusive paths:

1. **`HOLD_FOR_SOURCE_REGRESSION_REPAIR`:**
   Applied if an authorized file modification introduced scientific regression, corrupted historical numerical results, or altered physical equations.
   *Evaluation:* Proven false. Scientific regression is zero. All numerical values match to machine precision.

2. **`GO_TO_GOVERNANCE_REPAIR`:**
   Applied when implementation is scientifically sound and numerically invariant, but the repository governance harness requires an authorized repair to formally accommodate shared-file versioning.
   *Evaluation:* Proven true. The only failure is the test harness assuming zero changes across shared compatibility files.

**Recommendation:** **`FINAL_STATUS = GO_TO_GOVERNANCE_REPAIR`**

---

```text
SOURCE_HASH_GOVERNANCE_REVIEW = COMPLETE

HISTORICAL_V1_5_MANIFEST_IMMUTABLE = YES
SHARED_FILE_CLASSIFICATION_COMPLETE = YES
HASH_TEST_SEMANTICS_RECONCILED = YES
FLORY_HUGGINS_DIFF_RECONCILED = YES
BEHAVIORAL_V1_5_REGRESSION = PASS
UNRESOLVED_SOURCE_DELTA = YES

MERGE_AUTHORIZED = NO

PRODUCTION_MODIFIED = NO
TESTS_MODIFIED = NO
CONFIG_MODIFIED = NO
FROZEN_V1_5_MANIFEST_MODIFIED = NO
MODULE_15_REV2_MODIFIED = NO

FINAL_STATUS = GO_TO_GOVERNANCE_REPAIR

STOP
```
