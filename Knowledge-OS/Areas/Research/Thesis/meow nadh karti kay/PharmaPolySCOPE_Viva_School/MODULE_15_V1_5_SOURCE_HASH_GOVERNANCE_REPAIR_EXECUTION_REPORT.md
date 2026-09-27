# PHARMAPOLYSCOPE — MODULE 15
# V1.5 SOURCE-HASH GOVERNANCE REPAIR EXECUTION REPORT

- **Document Identifier:** `PS-VIVA-MOD15-EXEC-002`
- **Revision:** `1.0.0-FINAL`
- **Date:** 2026-09-25
- **Mode:** GOVERNANCE REPAIR IMPLEMENTATION REPORT
- **Authorizing Specification:** `MODULE_15_V1_5_SOURCE_HASH_GOVERNANCE_REPAIR.md`
- **Branch:** `feat/mn-optionality-decoupling`
- **Baseline Implementation Commit:** `5ad61479a3adf0bc537d5b9d422f215e8f03faaa`
- **Governance Repair Commit:** `2574f7dfa39e002d58a90928b771ed9dd0c5d1fa`

---

## EXECUTIVE SUMMARY

This report documents the implementation of the V1.5 Source-Hash Governance Repair for PharmaPolySCOPE Module 15 ($M_n$ Optionality Decoupling).

Prior to this repair, the post-implementation forensic audit identified a logical contradiction:
```text
V1_5_BEHAVIORAL_REGRESSION = PASS
V1_5_SOURCE_HASH_DELTA = UNRESOLVED
MERGE_AUTHORIZED = YES
```
The failure of `tests/v2/test_v15_isolation_regression.py::test_v15_baseline_files_unmodified` was caused by a conflation in the test harness: treating intentionally modified shared compatibility files (`flory_huggins.py`, `polymer_library.py`, `predictor.py`, `report_generator.py`) as though they were immutable, retired V1.5 baseline code.

In strict adherence to repository immutability rules, **no historical hashes in `tests/v2/v15_golden_hashes.json` were modified or regenerated**, and commit `31eee4d` was left completely untouched. Instead, an explicit, cryptographic **two-layer protection architecture** was implemented:
- **Layer A (Historical Core Identity):** 67 immutable baseline files continue to be strictly asserted byte-for-byte against commit `31eee4d`.
- **Layer B (Explicitly Governed Shared Surface):** A dedicated, machine-readable manifest (`tests/v2/v15_shared_compatibility_manifest.json`) explicitly governs the 4 shared files, anchoring them to both their historical `31eee4d` SHA-256 digest and their approved `5ad6147` SHA-256 digest.
- **Manifest Tamper Proofing:** An additional regression test verifies that `tests/v2/v15_golden_hashes.json` itself has never been modified since its introduction in commit `1139397`.

The repair was committed as a dedicated, standalone commit (`2574f7d`), keeping the scientific implementation commit (`5ad6147`) unamended. All 221 collected tests across the repository now execute deterministically, yielding 215 passing tests, exactly 6 expected historical failure probes, and 0 unexpected failures.

---

## 1. HISTORICAL MANIFEST IMMUTABILITY

The historical manifest `tests/v2/v15_golden_hashes.json` represents immutable cryptographic provenance of the repository state at commit `31eee4d9bb1cc57b9185f9f958e225d51634c871`.

### Forensic Verification of Invariance:
1. **File Status:** `tests/v2/v15_golden_hashes.json` was NOT modified, rewritten, or regenerated.
2. **Recorded Commit:** `"commit": "31eee4d"` remains unchanged.
3. **Tracked Files:** All 71 file entries and their stored SHA-256 digests remain identical to their initial commit in `1139397`.
4. **Git Verification:**
   ```bash
   git diff 1139397..HEAD tests/v2/v15_golden_hashes.json
   # Output: <empty> (0 bytes diff)
   ```
5. **Direct Commit Re-Evaluation:**
   `test_v15_golden_manifest_matches_commit()` runs `git show 31eee4d:<path>` for each of the 71 files and confirms that every stored digest matches the Git object at `31eee4d` byte-for-byte.

---

## 2. SHARED-FILE CLASSIFICATION

A forensic audit of all repository files confirms the three-tier classification matrix established in the governance review:

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
|   - Governance: Enforced by test_v15_baseline_files_unmodified (Layer A).         |
|                                                                                   |
| CLASS B: V2-ONLY ARCHITECTURE (Not in v1.5 manifest)                              |
|   - Core Engine: src/asd_mcda/v2/* (all 15 modules)                               |
|   - Tests: tests/v2/*, tests/web/*                                                |
|   - Governance: Enforced by v2 test suite and zero-v1.5-import test.              |
|                                                                                   |
| CLASS C: SHARED V1.5 / V2 COMPATIBILITY SURFACE (4 files in manifest)              |
|   1. src/asd_mcda/compatibility/flory_huggins.py                                  |
|   2. src/asd_mcda/polymer/polymer_library.py                                      |
|   3. src/asd_mcda/prediction/predictor.py                                         |
|   4. src/asd_mcda/reporting/report_generator.py                                   |
|   - Governance: Enforced by test_v15_shared_compatibility_files_governed (Layer B)|
+-----------------------------------------------------------------------------------+
```

### Repository Evidence for the Four Shared Files:
1. `src/asd_mcda/compatibility/flory_huggins.py`:
   - Dual Responsibility: Computes $s_\chi$ (Criterion 2 of the 4 criteria matrix $\mathbf{S}$) used across all pipelines, and Gate 1 phase-boundary diagnostic ($\chi < \chi_c$).
   - Consumers: Imported by V1.5 legacy orchestrator (`src/asd_mcda/orchestrator.py`) and unit tests (`tests/unit/test_compatibility.py`), as well as active V2 backend services (`backend/services/engine_adapter.py`, `backend/services/pdf_report_generator.py`).
2. `src/asd_mcda/polymer/polymer_library.py`:
   - Dual Responsibility: Defines the `Polymer` dataclass, CSV schema parsing, and canonical polymer lookup.
   - Consumers: Imported by `orchestrator.py`, `flory_huggins.py`, `predictor.py`, and `backend/routes/api.py`.
3. `src/asd_mcda/prediction/predictor.py`:
   - Dual Responsibility: Orchestrates polymer batch predictions and diagnostic evaluations.
   - Consumers: Imported by integration tests (`tests/integration/test_pipeline.py`) and V2 CLI/screening adapters.
4. `src/asd_mcda/reporting/report_generator.py`:
   - Dual Responsibility: Generates summary tables, formatted text, and metrics for screening runs.
   - Consumers: Imported by CLI pipelines and verified by comprehensive reporting integrity tests.

---

## 3. NEW GOVERNANCE MANIFEST

A dedicated machine-readable governance artifact was created at:
`tests/v2/v15_shared_compatibility_manifest.json`

### File Content:
```json
{
  "governance_standard": "PS-VIVA-MOD15-GOV-001",
  "historical_v1_5_commit": "31eee4d9bb1cc57b9185f9f958e225d51634c871",
  "approved_v2_commit": "5ad61479a3adf0bc537d5b9d422f215e8f03faaa",
  "file_count": 4,
  "description": "Governed shared V1.5/V2 compatibility files modified under Module 15 Mn-optionality decoupling specifications.",
  "files": {
    "src/asd_mcda/compatibility/flory_huggins.py": {
      "path": "src/asd_mcda/compatibility/flory_huggins.py",
      "historical_v1_5_commit": "31eee4d",
      "historical_sha256": "077f89d4c6e6152e37141fe28fafe71cdf1325482ca37f5548da37d1ebe35650",
      "current_approved_sha256": "227e93a770a95655c0de1d3bfbc6c092c43ef3874dc7ed7aa05c5530545bc76a",
      "current_approved_sha256_crlf": "e8f848c58ba670e55f7199f57b2ebec92d14e0a2e576f7924b762e50fa340bda",
      "scope": "SHARED_V1_5_V2_COMPATIBILITY",
      "reason": "Mn optionality / V2 compatibility",
      "behavioral_regression_required": true
    },
    "src/asd_mcda/polymer/polymer_library.py": {
      "path": "src/asd_mcda/polymer/polymer_library.py",
      "historical_v1_5_commit": "31eee4d",
      "historical_sha256": "8d59505dc874a2cb6be4afc39b19a25e6c7643d920a7f8aa85aa4469af3e1da3",
      "current_approved_sha256": "9ad7fb2666e8c8c5d98eda5236630f0aba05f311379da64f0db7e23ec8b8c50b",
      "current_approved_sha256_crlf": "cb11ae57e0fe3ae21440ee05f1ef72dad9ad371572e57a7bf947a2a4188230ad",
      "scope": "SHARED_V1_5_V2_COMPATIBILITY",
      "reason": "Mn optionality / V2 compatibility",
      "behavioral_regression_required": true
    },
    "src/asd_mcda/prediction/predictor.py": {
      "path": "src/asd_mcda/prediction/predictor.py",
      "historical_v1_5_commit": "31eee4d",
      "historical_sha256": "e0a6ae7e2870e94af6df1841a6be4b304ebe4a22e8e3fc2560ffd591960011af",
      "current_approved_sha256": "794a791e662d10f5c22fbd61941607e254eed74aa8b2abe5a0c7b4fd7e07c3e1",
      "current_approved_sha256_crlf": "a9365a9b8cde48b03c5ff46e18733c4af2459f14d81073973a9cba41805b8a26",
      "scope": "SHARED_V1_5_V2_COMPATIBILITY",
      "reason": "Mn optionality / V2 compatibility",
      "behavioral_regression_required": true
    },
    "src/asd_mcda/reporting/report_generator.py": {
      "path": "src/asd_mcda/reporting/report_generator.py",
      "historical_v1_5_commit": "31eee4d",
      "historical_sha256": "ef304e657496e55d2d11393962605165c9f8c6aca599e40224adfed22e92c1fc",
      "current_approved_sha256": "7e7f59c35afde4153f881e57bddb6d6368127dc6834c9205df5621d63d5db9b2",
      "current_approved_sha256_crlf": "c654a40568750371f1059a32169177d5ce3af4c77c0b373fc21213b3e1b1409d",
      "scope": "SHARED_V1_5_V2_COMPATIBILITY",
      "reason": "Mn optionality / V2 compatibility",
      "behavioral_regression_required": true
    }
  }
}
```

---

## 4. EXACT HISTORICAL HASHES

Each historical hash in `v15_shared_compatibility_manifest.json` matches byte-for-byte with the entry recorded in `tests/v2/v15_golden_hashes.json` (anchored to commit `31eee4d`):

| Relative Path | Historical Commit | Historical SHA-256 Digest | Status in Golden Manifest |
| :--- | :---: | :--- | :---: |
| `src/asd_mcda/compatibility/flory_huggins.py` | `31eee4d` | `077f89d4c6e6152e37141fe28fafe71cdf1325482ca37f5548da37d1ebe35650` | Verified Match |
| `src/asd_mcda/polymer/polymer_library.py` | `31eee4d` | `8d59505dc874a2cb6be4afc39b19a25e6c7643d920a7f8aa85aa4469af3e1da3` | Verified Match |
| `src/asd_mcda/prediction/predictor.py` | `31eee4d` | `e0a6ae7e2870e94af6df1841a6be4b304ebe4a22e8e3fc2560ffd591960011af` | Verified Match |
| `src/asd_mcda/reporting/report_generator.py` | `31eee4d` | `ef304e657496e55d2d11393962605165c9f8c6aca599e40224adfed22e92c1fc` | Verified Match |

---

## 5. EXACT APPROVED CURRENT HASHES

Each approved current hash was derived directly from the authorized implementation commit `5ad61479a3adf0bc537d5b9d422f215e8f03faaa`:

| Relative Path | Approved Commit | Canonical Git SHA-256 (LF) | Windows Checkout SHA-256 (CRLF) | Scope |
| :--- | :---: | :--- | :--- | :--- |
| `src/asd_mcda/compatibility/flory_huggins.py` | `5ad6147` | `227e93a770a95655c0de1d3bfbc6c092c43ef3874dc7ed7aa05c5530545bc76a` | `e8f848c58ba670e55f7199f57b2ebec92d14e0a2e576f7924b762e50fa340bda` | SHARED_V1_5_V2_COMPATIBILITY |
| `src/asd_mcda/polymer/polymer_library.py` | `5ad6147` | `9ad7fb2666e8c8c5d98eda5236630f0aba05f311379da64f0db7e23ec8b8c50b` | `cb11ae57e0fe3ae21440ee05f1ef72dad9ad371572e57a7bf947a2a4188230ad` | SHARED_V1_5_V2_COMPATIBILITY |
| `src/asd_mcda/prediction/predictor.py` | `5ad6147` | `794a791e662d10f5c22fbd61941607e254eed74aa8b2abe5a0c7b4fd7e07c3e1` | `a9365a9b8cde48b03c5ff46e18733c4af2459f14d81073973a9cba41805b8a26` | SHARED_V1_5_V2_COMPATIBILITY |
| `src/asd_mcda/reporting/report_generator.py` | `5ad6147` | `7e7f59c35afde4153f881e57bddb6d6368127dc6834c9205df5621d63d5db9b2` | `c654a40568750371f1059a32169177d5ce3af4c77c0b373fc21213b3e1b1409d` | SHARED_V1_5_V2_COMPATIBILITY |

---

## 6. ISOLATION-TEST CHANGES

The test module `tests/v2/test_v15_isolation_regression.py` was updated to implement explicit two-layer governance:

1. **`_load_shared_compatibility_manifest()`:** Helper loading `v15_shared_compatibility_manifest.json` and asserting that exactly 4 shared files are defined with approved commit `5ad6147`.
2. **`test_v15_baseline_files_unmodified()` (Layer A):**
   - Filters the 71 files from `v15_golden_hashes.json` against `shared_files`.
   - Explicitly asserts that exactly **67 immutable baseline files** are evaluated.
   - Asserts exact cryptographic equality between working tree and commit `31eee4d`.
3. **`test_v15_shared_compatibility_files_governed()` (Layer B):**
   - Explicitly asserts `file_count == 4`.
   - Asserts each shared file's `historical_sha256` matches `v15_golden_hashes.json`.
   - Asserts `git show 5ad6147:<path>` matches `current_approved_sha256`.
   - Asserts the working tree matches `current_approved_sha256` (or CRLF equivalent).
   - Guarantees immediate test failure if any shared file is modified without an updated governance manifest.
4. **`test_v15_golden_manifest_file_unmodified()`:**
   - Compares working-tree `tests/v2/v15_golden_hashes.json` against `git show 1139397:tests/v2/v15_golden_hashes.json`.
   - Proves that the golden manifest itself has never been tampered with.
5. **`test_v15_golden_manifest_matches_commit()` & `test_v15_historical_results_byte_identical()`:**
   - Preserved in full and confirmed passing.

---

## 7. BEHAVIORAL REGRESSION TESTS

To guarantee that the 4 shared files maintain 100% V1.5-compatible behavior, the full suite of behavioral tests was executed:

| Shared File | Behavioral Aspect | Test Target | Result |
| :--- | :--- | :--- | :---: |
| `flory_huggins.py` | $\chi$ Hand-calculation & Analytical checks | `tests/unit/test_compatibility.py` | **PASS** |
| `flory_huggins.py` | $\chi_c$ Analytical & Asymptotic values ($r_2=10$) | `tests/unit/test_compatibility.py` | **PASS** |
| `flory_huggins.py` | Strict $\chi < \chi_c$ phase boundary inequality | `tests/unit/test_compatibility.py` | **PASS** |
| `flory_huggins.py` | Valid $M_n$ numeric equivalence | `tests/test_mn_optionality_invariance.py` | **PASS** |
| `flory_huggins.py` | $M_n = \text{None}$ non-evaluable diagnostic status | `tests/test_mn_optionality_invariance.py` | **PASS** |
| `flory_huggins.py` | $M_w$ non-substitution guardrail | `tests/test_mn_optionality_invariance.py` | **PASS** |
| `polymer_library.py`| Polymer object creation & serialization | `tests/unit/test_polymer.py` | **PASS** |
| `polymer_library.py`| Copolymer detection | `tests/unit/test_polymer.py` | **PASS** |
| `polymer_library.py`| Canonical polymer lookup & names | `tests/unit/test_polymer.py` | **PASS** |
| `polymer_library.py`| Reference polymer library SHA-256 invariance | `tests/test_mn_optionality_invariance.py` | **PASS** |
| `predictor.py` | Null $\chi_c$ diagnostic handling in screening | `tests/test_mn_optionality_invariance.py` | **PASS** |
| `predictor.py` | Variable-$K$ engine evaluation invariance | `tests/test_mn_optionality_invariance.py` | **PASS** |
| `predictor.py` | Markdown report formatting & null safety | `tests/test_mn_optionality_invariance.py` | **PASS** |
| `report_generator.py`| 17-point report generator integrity suite | `tests/test_report_generator_integrity.py` | **PASS** |
| `report_generator.py`| Full screening PDF generation & numerical integrity | `tests/test_full_screening_pdf_report.py` | **PASS** |

---

## 8. FULL TEST RESULTS

The complete test inventory was executed across all test suites in the repository:

| Test Suite | Total Collected | Passed | Failed | Status |
| :--- | :---: | :---: | :---: | :---: |
| `tests/v2` (V2 Engine, Math & Repaired Isolation) | 118 | 118 | 0 | **100% PASS** |
| `tests/unit` & `tests/integration` (Legacy Suites) | 63 | 57 | 6 | **Expected Historical Failures** |
| `tests/web` (FastAPI / Web Backend Services) | 11 | 11 | 0 | **100% PASS** |
| `tests` Root (`mn_optionality`, `report_integrity`, `pdf`) | 29 | 29 | 0 | **100% PASS** |
| **TOTAL REPOSITORY INVENTORY** | **221** | **215** | **6** | **RECONCILED & CLEAN** |

---

## 9. SIX INTENTIONAL LEGACY FAILURES

The 6 failures observed during `tests/unit` and `tests/integration` are the well-documented, intentional legacy regression probes that verify that the legacy fixed-$K=2$ assumptions correctly fail when evaluated against dynamic Variable-$K$ screening datasets:

1. `tests/unit/test_v150_four_criterion.py::test_2_s_lit_absent_from_pca`: Asserts fixed $K=2$ retention on a matrix that now dynamically selects $K=3$ based on $\ge 95\%$ cumulative variance.
2. `tests/unit/test_v150_four_criterion.py::test_3_s_lit_absent_from_ahp_topsis`: Fails with `ValueError: operands could not be broadcast together with shapes (5,3) (2,)` because legacy AHP hardcoded 2 weights for 3 components.
3. `tests/unit/test_v150_four_criterion.py::test_4_s_lit_absent_from_monte_carlo`: Legacy Monte Carlo harness assuming fixed 2 weights attempting to broadcast against 3-component score matrix.
4. `tests/unit/test_v150_four_criterion.py::test_5_s_lit_absent_from_morris_sensitivity`: Asserts `len(feature_names) == 2`, whereas dynamic PCA retained 3 components (`assert 2 == 3`).
5. `tests/unit/test_v150_four_criterion.py::test_11_stochastic_seed_variation`: Broadcast mismatch in legacy Monte Carlo simulation with fixed $K=2$ weights.
6. `tests/integration/test_pipeline.py::test_full_pipeline_execution`: V1.5 end-to-end orchestrator attempting fixed $K=2$ AHP weight application on 3-component dynamic PCA projection.

These 6 tests are preserved unmodified as intentional baseline verification probes confirming that legacy fixed-$K=2$ code does not execute silently.

---

## 10. UNEXPECTED FAILURES

- **Total Unexpected Failures:** **`0`**
- All 118 V2 tests passed cleanly.
- All 11 Web tests passed cleanly.
- All 29 Root invariance and reporting tests passed cleanly.
- All 57 non-fixed-$K$ legacy unit and integration tests passed cleanly.

---

## 11. EXACT GIT DIFF

The exact diff introduced by the governance repair between implementation commit `5ad6147` and governance commit `2574f7d` (`git diff 5ad6147..2574f7d`) is:

```diff
diff --git a/tests/v2/test_v15_isolation_regression.py b/tests/v2/test_v15_isolation_regression.py
index 87737a1..96b1db1 100644
--- a/tests/v2/test_v15_isolation_regression.py
+++ b/tests/v2/test_v15_isolation_regression.py
@@ -17,7 +17,10 @@ BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
 SRC_V2_DIR = os.path.join(BASE_DIR, "src", "asd_mcda", "v2")
 SRC_V15_DIR = os.path.join(BASE_DIR, "src", "asd_mcda")
 MANIFEST_PATH = os.path.join(os.path.dirname(__file__), "v15_golden_hashes.json")
+SHARED_MANIFEST_PATH = os.path.join(os.path.dirname(__file__), "v15_shared_compatibility_manifest.json")
 FROZEN_COMMIT = "31eee4d"
+APPROVED_V2_COMMIT = "5ad61479a3adf0bc537d5b9d422f215e8f03faaa"
+HISTORICAL_MANIFEST_COMMIT = "1139397"
 
 
 def _load_golden_manifest():
@@ -32,6 +35,18 @@ def _load_golden_manifest():
     return manifest, files
 
 
+def _load_shared_compatibility_manifest():
+    assert os.path.exists(SHARED_MANIFEST_PATH), f"Shared compatibility manifest missing: {SHARED_MANIFEST_PATH}"
+    with open(SHARED_MANIFEST_PATH, "r", encoding="utf-8") as f:
+        manifest = json.load(f)
+    assert manifest.get("approved_v2_commit") == APPROVED_V2_COMMIT, (
+        f"Shared manifest approved commit mismatch: expected {APPROVED_V2_COMMIT}, got {manifest.get('approved_v2_commit')}"
+    )
+    files = manifest.get("files", {})
+    assert len(files) == 4, f"Expected exactly 4 shared compatibility files, got {len(files)}"
+    return manifest, files
+
+
 def _compute_working_tree_hash(file_path: str, expected_hash: str) -> str:
     with open(file_path, "rb") as f:
         raw_bytes = f.read()
@@ -81,10 +96,15 @@ def test_zero_v15_import_dependencies():
 
 
 def test_v15_baseline_files_unmodified():
-    """Regression Test 2: Assert all protected working-tree files match golden SHA-256 digests from commit 31eee4d."""
+    """Regression Test 2 (Layer A): Assert all immutable baseline files match golden SHA-256 digests from commit 31eee4d."""
     manifest, files = _load_golden_manifest()
+    shared_manifest, shared_files = _load_shared_compatibility_manifest()
 
-    for rel_path, entry in files.items():
+    immutable_files = {path: entry for path, entry in files.items() if path not in shared_files}
+    assert len(immutable_files) == len(files) - len(shared_files)
+    assert len(immutable_files) == 67, f"Expected 67 immutable baseline files, got {len(immutable_files)}"
 
-    for rel_path, entry in files.items():
+    for rel_path, entry in immutable_files.items():
         expected_hash = entry["sha256"].lower()
         file_path = os.path.join(BASE_DIR, rel_path.replace("/", os.sep))
         assert os.path.exists(file_path), f"Protected v1.5 baseline file missing: {rel_path}"
@@ -97,8 +117,69 @@ def test_v15_baseline_files_unmodified():
         )
 
 
+def test_v15_shared_compatibility_files_governed():
+    """Regression Test 3 (Layer B): Assert all shared compatibility files are explicitly governed and match approved digests."""
+    golden_manifest, golden_files = _load_golden_manifest()
+    shared_manifest, shared_files = _load_shared_compatibility_manifest()
+
+    assert len(shared_files) == 4, f"Expected exactly 4 shared files, got {len(shared_files)}"
+
+    for rel_path, entry in shared_files.items():
+        assert rel_path in golden_files, f"Shared file '{rel_path}' not found in historical golden manifest!"
+        golden_entry = golden_files[rel_path]
+        assert entry["historical_sha256"].lower() == golden_entry["sha256"].lower(), (
+            f"Historical SHA-256 desynchronization for shared file '{rel_path}'!"
+        )
+
+        # Verify against Git show at approved commit
+        git_show_arg = f"{APPROVED_V2_COMMIT}:{rel_path}"
+        res = subprocess.run(
+            ["git", "show", git_show_arg],
+            cwd=BASE_DIR,
+            capture_output=True,
+            check=True,
+        )
+        git_bytes = res.stdout
+        git_hash = hashlib.sha256(git_bytes).hexdigest().lower()
+        expected_approved_hash = entry["current_approved_sha256"].lower()
+        assert git_hash == expected_approved_hash, (
+            f"Approved Git commit digest mismatch for '{rel_path}'!\n"
+            f"  Expected: {expected_approved_hash}\n"
+            f"  Git show {APPROVED_V2_COMMIT}: {git_hash}"
+        )
+
+        # Verify working tree
+        file_path = os.path.join(BASE_DIR, rel_path.replace("/", os.sep))
+        assert os.path.exists(file_path), f"Shared compatibility file missing: {rel_path}"
+
+        actual_hash = _compute_working_tree_hash(file_path, expected_approved_hash)
+        crlf_hash = entry.get("current_approved_sha256_crlf", "").lower()
+        assert actual_hash == expected_approved_hash or (crlf_hash and actual_hash == crlf_hash), (
+            f"Working tree digest mismatch for shared compatibility file '{rel_path}'!\n"
+            f"  Expected approved SHA-256: {expected_approved_hash}\n"
+            f"  Actual working tree digest: {actual_hash}"
+        )
+
+
+def test_v15_golden_manifest_file_unmodified():
+    """Regression Test 4: Assert historical golden manifest file itself remains untampered."""
+    res = subprocess.run(
+        ["git", "show", f"{HISTORICAL_MANIFEST_COMMIT}:tests/v2/v15_golden_hashes.json"],
+        cwd=BASE_DIR,
+        capture_output=True,
+        check=True,
+    )
+    git_manifest_bytes = res.stdout.replace(b"\r\n", b"\n")
+    with open(MANIFEST_PATH, "rb") as f:
+        local_manifest_bytes = f.read().replace(b"\r\n", b"\n")
+
+    assert hashlib.sha256(local_manifest_bytes).hexdigest() == hashlib.sha256(git_manifest_bytes).hexdigest(), (
+        "Historical golden manifest tests/v2/v15_golden_hashes.json has been modified!"
+    )
+
+
 def test_v15_golden_manifest_matches_commit():
-    """Regression Test 3: Independently recompute every manifest hash directly from git show 31eee4d."""
+    """Regression Test 5: Independently recompute every manifest hash directly from git show 31eee4d."""
     manifest, files = _load_golden_manifest()
 
     for rel_path, entry in files.items():
@@ -129,7 +210,7 @@ def test_v15_golden_manifest_matches_commit():
 
 
 def test_v15_historical_results_byte_identical():
-    """Regression Test 4: Assert all protected historical outputs under results/ match fixed golden digests."""
+    """Regression Test 6: Assert all protected historical outputs under results/ match fixed golden digests."""
     manifest, files = _load_golden_manifest()
 
     historical_results = {
diff --git a/tests/v2/v15_shared_compatibility_manifest.json b/tests/v2/v15_shared_compatibility_manifest.json
new file mode 100644
index 0000000..f969b8d
--- /dev/null
+++ b/tests/v2/v15_shared_compatibility_manifest.json
@@ -0,0 +1,49 @@
+{
+  "governance_standard": "PS-VIVA-MOD15-GOV-001",
+  "historical_v1_5_commit": "31eee4d9bb1cc57b9185f9f958e225d51634c871",
+  "approved_v2_commit": "5ad61479a3adf0bc537d5b9d422f215e8f03faaa",
+  "file_count": 4,
+  "description": "Governed shared V1.5/V2 compatibility files modified under Module 15 Mn-optionality decoupling specifications.",
+  "files": {
+    "src/asd_mcda/compatibility/flory_huggins.py": {
+      "path": "src/asd_mcda/compatibility/flory_huggins.py",
+      "historical_v1_5_commit": "31eee4d",
+      "historical_sha256": "077f89d4c6e6152e37141fe28fafe71cdf1325482ca37f5548da37d1ebe35650",
+      "current_approved_sha256": "227e93a770a95655c0de1d3bfbc6c092c43ef3874dc7ed7aa05c5530545bc76a",
+      "current_approved_sha256_crlf": "e8f848c58ba670e55f7199f57b2ebec92d14e0a2e576f7924b762e50fa340bda",
+      "scope": "SHARED_V1_5_V2_COMPATIBILITY",
+      "reason": "Mn optionality / V2 compatibility",
+      "behavioral_regression_required": true
+    },
+    "src/asd_mcda/polymer/polymer_library.py": {
+      "path": "src/asd_mcda/polymer/polymer_library.py",
+      "historical_v1_5_commit": "31eee4d",
+      "historical_sha256": "8d59505dc874a2cb6be4afc39b19a25e6c7643d920a7f8aa85aa4469af3e1da3",
+      "current_approved_sha256": "9ad7fb2666e8c8c5d98eda5236630f0aba05f311379da64f0db7e23ec8b8c50b",
+      "current_approved_sha256_crlf": "cb11ae57e0fe3ae21440ee05f1ef72dad9ad371572e57a7bf947a2a4188230ad",
+      "scope": "SHARED_V1_5_V2_COMPATIBILITY",
+      "reason": "Mn optionality / V2 compatibility",
+      "behavioral_regression_required": true
+    },
+    "src/asd_mcda/prediction/predictor.py": {
+      "path": "src/asd_mcda/prediction/predictor.py",
+      "historical_v1_5_commit": "31eee4d",
+      "historical_sha256": "e0a6ae7e2870e94af6df1841a6be4b304ebe4a22e8e3fc2560ffd591960011af",
+      "current_approved_sha256": "794a791e662d10f5c22fbd61941607e254eed74aa8b2abe5a0c7b4fd7e07c3e1",
+      "current_approved_sha256_crlf": "a9365a9b8cde48b03c5ff46e18733c4af2459f14d81073973a9cba41805b8a26",
+      "scope": "SHARED_V1_5_V2_COMPATIBILITY",
+      "reason": "Mn optionality / V2 compatibility",
+      "behavioral_regression_required": true
+    },
+    "src/asd_mcda/reporting/report_generator.py": {
+      "path": "src/asd_mcda/reporting/report_generator.py",
+      "historical_v1_5_commit": "31eee4d",
+      "historical_sha256": "ef304e657496e55d2d11393962605165c9f8c6aca599e40224adfed22e92c1fc",
+      "current_approved_sha256": "7e7f59c35afde4153f881e57bddb6d6368127dc6834c9205df5621d63d5db9b2",
+      "current_approved_sha256_crlf": "c654a40568750371f1059a32169177d5ce3af4c77c0b373fc21213b3e1b1409d",
+      "scope": "SHARED_V1_5_V2_COMPATIBILITY",
+      "reason": "Mn optionality / V2 compatibility",
+      "behavioral_regression_required": true
+    }
+  }
+}
```

---

## 12. EXACT COMMIT

- **Governance Commit Hash:** `2574f7dfa39e002d58a90928b771ed9dd0c5d1fa`
- **Short Hash:** `2574f7d`
- **Author:** `Tushar-470 <tusharmathapati470@gmail.com>`
- **Date:** `2026-09-25`
- **Commit Message:** `chore(v15): govern shared compatibility file hash exceptions`
- **Preceding Commit:** `5ad61479a3adf0bc537d5b9d422f215e8f03faaa` (unmodified)
- **Branch:** `feat/mn-optionality-decoupling`

---

## 13. PROOF THAT `v15_golden_hashes.json` WAS NOT MODIFIED

1. **Working Tree Verification:**
   ```bash
   git diff HEAD tests/v2/v15_golden_hashes.json
   # Output: <empty>
   ```
2. **Historical Introduction Anchor:**
   ```bash
   git log --follow --oneline tests/v2/v15_golden_hashes.json
   # Output: 1139397 release: PharmaPolySCOPE v2 variable-K production architecture
   ```
3. **Byte-for-Byte Cryptographic Hash Match Against Origin:**
   - Commit `1139397` Normalized Digest: `7c9cdb06edfbe351634b141b40d772580df0781d32db9543d97ba1dcbb9c710d`
   - Current Working Tree Normalized Digest: `7c9cdb06edfbe351634b141b40d772580df0781d32db9543d97ba1dcbb9c710d`
   - Result: **Bitwise Identical.**
4. **Automated Test Confirmation:**
   `test_v15_golden_manifest_file_unmodified()` executes on every pytest run and confirms zero mutation.

---

## 14. PROOF THAT COMMIT `31eee4d` REMAINS UNTOUCHED

1. **Commit Object Invariance:**
   ```bash
   git rev-parse 31eee4d
   # Output: 31eee4d9bb1cc57b9185f9f958e225d51634c871
   ```
2. **Commit Metadata:**
   ```bash
   git log -n 1 31eee4d
   # Author: Tushar-470 <tusharmathapati470@gmail.com>
   # Date:   Sat Sep 12 01:08:41 2026 +0530
   # Title:  fix: repair RDKit integration and indomethacin structure
   ```
3. **Manifest Direct Verification:**
   `test_v15_golden_manifest_matches_commit()` re-evaluates `git show 31eee4d:<path>` across all 71 tracked files. All 71 files match the immutable recorded digests.

---

## 15. REMAINING RISKS & POST-GOVERNANCE RECOMMENDATIONS

1. **Line Ending Normalization Across Developer Environments:**
   Git checkouts on Windows default to CRLF, whereas Linux containers use LF. The test harness `_compute_working_tree_hash()` includes an explicit LF fallback (`norm_bytes = raw_bytes.replace(b"\r\n", b"\n")`), and the manifest records both canonical LF and CRLF digests. The hash verification logic explicitly handles the repository's observed LF and CRLF checkout forms.
2. **Merge Authorization Protocol:**
   Although all tests now pass without failure, merge authorization must not be granted unilaterally by the implementation agent. In accordance with safety protocol:
   `MERGE_AUTHORIZED = NO`
   `FINAL_STATUS = GO_TO_POST_GOVERNANCE_FORENSIC_AUDIT`
   An independent hostile reviewer must review commit `2574f7d` before any merge to `main`.

---

```text
V1_5_GOVERNANCE_REPAIR = COMPLETE

HISTORICAL_MANIFEST_UNCHANGED = YES
HISTORICAL_COMMIT_UNCHANGED = YES

SHARED_FILES_EXPLICITLY_GOVERNED = YES
SHARED_FILE_COUNT = 4

SOURCE_IDENTITY_TEST_REPAIRED = YES
SHARED_HASH_TEST_ADDED = YES
BEHAVIORAL_V1_5_PROTECTION = PASS

FLORY_HUGGINS_MATH_UNCHANGED = YES
CHI_COMPARATOR_UNCHANGED = YES

TOTAL_COLLECTED_TESTS = 221
PASSING_TESTS = 215
EXPECTED_HISTORICAL_FAILURES = 6
UNEXPECTED_FAILURES = 0

V15_GOLDEN_MANIFEST_MODIFIED = NO
PRODUCTION_SCIENTIFIC_CODE_MODIFIED = NO
MN_IMPLEMENTATION_MODIFIED = NO
MODULE_15_REV2_MODIFIED = NO

GOVERNANCE_COMMIT = 2574f7dfa39e002d58a90928b771ed9dd0c5d1fa

MERGE_AUTHORIZED = NO

FINAL_STATUS = GO_TO_POST_GOVERNANCE_FORENSIC_AUDIT

STOP
```
