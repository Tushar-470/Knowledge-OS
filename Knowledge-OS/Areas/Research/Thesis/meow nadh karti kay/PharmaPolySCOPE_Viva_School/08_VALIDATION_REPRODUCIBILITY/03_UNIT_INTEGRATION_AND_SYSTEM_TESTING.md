# Module 08 — Validation & Reproducibility
# Document 03: Unit, Integration, and System Testing in Scientific Software

```
========================================================================================
PHARMAPOLYSCOPE VIVA SCHOOL — MODULE 08: VALIDATION & REPRODUCIBILITY
DOCUMENT 03: UNIT, INTEGRATION, AND SYSTEM TESTING IN SCIENTIFIC SOFTWARE
========================================================================================
Authoritative Engine: PharmaPolySCOPE v2.0.0 (Variable-K Spectral Governance)
Framework Package: v1.5.0-FOUR-CRITERION-FREEZE | Baseline Commit: 31eee4d
Methodology: 2.0.0-SP-PRP-TOPSIS | Document Revision: 2.0.0-FINAL
Target Audience: Doctoral Candidates, Scientific Software QA Auditors, Viva Examiners
========================================================================================
```

---

## 1. Executive Summary & Epistemological Stance

In scientific software engineering, the relationship between code testing and scientific truth is frequently misunderstood. A passing test suite does **not** prove that a computational model correctly predicts nature. Passing tests establish **software verification**—the mathematical demonstration that code implements its intended algorithmic specification without execution faults, state leakage, or numerical corruption.

PharmaPolySCOPE maintains an exhaustive, multi-tiered automated testing harness spanning unit, integration, cheminformatics integrity, and cryptographic isolation regression suites. This document provides a forensic examination of this testing architecture, detailing the exact test inventory (116 production v2 tests across 15 files, 29 cheminformatics integrity tests, 15 RDKit integration tests, 4 isolation regression tests, and 92 legacy/unit tests), the resolution of the classical *Test Oracle Problem*, and the rigorous epistemological boundaries separating verified code from prospective laboratory experimental formulation validation (which remains pending).

```
+--------------------------------------------------------------------------------------------------+
|                                    SOFTWARE TESTING TAXONOMY                                     |
|                                                                                                  |
|   +--------------------------+    +--------------------------+    +--------------------------+   |
|   |       UNIT TESTS         |    |    INTEGRATION TESTS     |    |       SYSTEM TESTS       |   |
|   |  - Isolated functions    |    |  - Multi-module data flow|    |  - End-to-end pipeline   |   |
|   |  - Pure numerical ops    | -> |  - Matrix handover       | -> |  - CLI / Web API / PDF   |   |
|   |  - e.g. PCA, AHP, Metric |    |  - Engine + Compatibility|    |  - Full cohort screening |   |
|   +--------------------------+    +--------------------------+    +--------------------------+   |
|                 |                               |                               |                |
|                 +-------------------------------+-------------------------------+                |
|                                                 v                                                |
|                                  +------------------------------+                                |
|                                  |     REGRESSION ISOLATION     |                                |
|                                  |  - 71 frozen v1.5 files      |                                |
|                                  |  - SHA-256 baseline check    |                                |
|                                  |  - Zero silent decay         |                                |
|                                  +------------------------------+                                |
|                                                 |                                                |
|                                                 v                                                |
|                        VERIFICATION != EXPERIMENTAL VALIDATION                                   |
|                        Code matches math != Math predicts in vivo                                |
+--------------------------------------------------------------------------------------------------+
```

---

## 2. The Test Oracle Problem in Computational Science

### Layer A — General Scientific/Technical Concept
In commercial software (e.g., e-commerce, banking), the expected output for a given input is known a priori (e.g., `2 + 2 = 4`, or an account balance reduces by the exact withdrawal amount). In computational science, however, software is written precisely because the analytical solution to complex physical or mathematical equations is unknown. This is the **Test Oracle Problem** (Weyuker, 1982).

If an algorithm computes the principal eigenvectors of a 4-dimensional correlation matrix under noise perturbation, what is the 'oracle' against which the test asserts correctness?
1. **Manufactured Solutions & Trivial Baselines:** Evaluating orthogonal matrices with known analytic eigenvalues (e.g., identity matrix, diagonal matrix with prescribed entries).
2. **Physical and Mathematical Invariants:** Asserting conservation laws and mathematical axioms that must hold regardless of inputs (e.g., $\sum w_i = 1$, $V^T V = I$, $M_K = M_K^T$, $N_{\text{generated}} = N_{\text{valid}} + N_{\text{blocked}}$).
3. **Floating-Point Tolerances:** In IEEE 754 floating-point arithmetic, strict equality (`assert a == b`) is an anti-pattern. Numerical tests must use bounded absolute and relative tolerances ($|a - b| \le \text{atol} + \text{rtol} \cdot |b|$), reflecting machine precision limits ($\varepsilon_{\text{mach}} \approx 2.22 \times 10^{-16}$).
4. **Golden Master / Frozen Regression Baselines:** Recording high-precision snapshots of verified runs to detect unintended algorithmic drift during refactoring.

### Layer B — Actual PharmaPolySCOPE Implementation
PharmaPolySCOPE addresses the Oracle Problem through three explicit architectural patterns:
1. **Mathematical Invariant Assertions:**
   - In `tests/v2/test_pca.py`, tests assert orthonormal column preservation ($||V_K^T V_K - I_K||_F < 10^{-12}$) and strict sign canonicalization ($V_{1,j} \ge 0$).
   - In `tests/v2/test_ahp.py`, tests assert reciprocity ($A_{ji} = 1 / A_{ij}$ within $10^{-12}$) and Perron-Frobenius eigenvalue bounds ($\lambda_{\max} \ge n$).
   - In `tests/v2/test_uncertainty.py`, tests assert the Replicate Conservation Law: `assert len(replicates) + len(blocked) == n_generated`.
2. **Controlled Floating-Point Comparison:**
   - All numerical assertions utilize `numpy.testing.assert_allclose()` or `pytest.approx()` with explicit tolerances (typically `atol=1e-7, rtol=1e-5`).
3. **Cryptographic Baseline Locking:**
   - In `tests/v2/test_v15_isolation_regression.py`, 71 frozen files from commit `31eee4d` are verified via SHA-256 hashes, ensuring that v2 engine developments never alter the v1.5 benchmark foundation.

### Layer C — Why This Implementation Choice Matters
Without invariant-based test oracles, scientific software decays into circular verification: testing that code produces what the code currently outputs, even when erroneous. By anchoring test assertions to formal linear-algebraic axioms (orthonormality, reciprocity, conservation), PharmaPolySCOPE ensures that refactoring or dependency updates cannot silently corrupt the computational engine.

---

## 3. Comprehensive Test Inventory and Taxonomy

PharmaPolySCOPE segregates testing across four distinct functional tiers:
1. **Core v2 Computational Engine Tests (`tests/v2/`)**
2. **Cheminformatics & Chemical Structure Integrity Tests (`tests/v2/test_cheminformatics_integrity.py`)**
3. **Cryptographic Baseline Isolation Tests (`tests/v2/test_v15_isolation_regression.py`)**
4. **Legacy Unit, Web API, and Integration Tests (`tests/unit/`, `tests/web/`, `tests/integration/`, `tests/`)**

```
+--------------------------------------------------------------------------------------------------+
|                                    PHARMAPOLYSCOPE TEST SUITE MAP                                |
+------------------------------------+----------------+---------------+----------------------------+
| Test Module Directory              | File Count     | Tests Executed| Core Scientific Focus      |
+------------------------------------+----------------+---------------+----------------------------+
| tests/v2/                          | 15 files       | 116 tests     | SP-PRP-TOPSIS v2 Engine    |
|   - test_cheminformatics_integrity | (included)     | 29 tests      | SMILES, RDKit, Valence     |
|   - test_v15_isolation_regression  | (included)     | 4 tests       | 71 Frozen Files Hashing    |
|   - other 13 v2 test files         | (included)     | 83 tests      | PCA, AHP, UQ, Sensitivity  |
| tests/unit/                        | 14 files       | 62 tests      | Legacy unit models         |
|   - test_rdkit_integration.py      | (included)     | 15 tests      | RDKit wrapper functions    |
|   - test_v150_four_criterion.py    | (included)     | 15 tests      | 4-criterion v1.5 matrix    |
|   - other 12 unit test files       | (included)     | 32 tests      | HSP, GT, Flory-Huggins     |
| tests/web/                         | 3 files        | 11 tests      | FastAPI routes & schemas   |
| tests/integration/                 | 1 file         | 1 test        | Legacy pipeline run        |
| tests/ (root)                      | 2 files        | 18 tests      | PDF report generator       |
+------------------------------------+----------------+---------------+----------------------------+
| TOTAL PRODUCTION REGRESSION GATE   | 15 files       | 116 tests     | tests/v2/ (100% Pass)      |
| TOTAL FULL REPOSITORY TEST SUITE   | 35 files       | 208 tests     | Full framework coverage    |
| TOTAL COMBINED CORE INTEGRITY      | --             | 131 tests     | 116 v2 + 15 RDKit unit     |
+------------------------------------+----------------+---------------+----------------------------+
```

---

## 4. Deep Dive: The 15 Test Files of `tests/v2/`

The primary regression gate of the v2 engine consists of **116 tests executed across 105 test functions in 15 files**:

### 1. `tests/v2/test_ahp.py` (4 tests)
- **Functions Tested:** `src/asd_mcda/v2/ahp.py:solve_ahp_preference()`, `compute_consistency_ratio()`.
- **Verifications:**
  - Reciprocal matrix structure: $A_{ij} \cdot A_{ji} = 1.0$.
  - Exact Saaty Random Consistency Index ($RI_4 = 0.89$).
  - Consistency Ratio gating: $CR < 0.08$ permits execution; $CR \ge 0.08$ raises `AHPConsistencyViolationError`.
  - Weight normalization: $\sum_{j=1}^4 w_j = 1.0$.

### 2. `tests/v2/test_cheminformatics_integrity.py` (29 executed tests across 18 functions)
- **Functions Tested:** `src/asd_mcda/v2/chemistry.py:validate_chemical_structure()`, `compute_production_descriptors()`, `validate_polymer_repeat_units()`.
- **Verifications:**
  - Parameterized test cases for canonical SMILES: Indomethacin, Ibuprofen, Itraconazole, Paracetamol, Aspirin.
  - Rejection of corrupted SMILES (syntax errors, invalid characters, unclosed rings).
  - Nitrogen and carbon valence violation rejection (e.g. 5-valent carbon).
  - Exact Crippen $\log P$, TPSA, and molecular weight extraction.
  - Strict isolation: `ProductionFallbackProhibitedError` raised when fallback descriptors are attempted in production mode.
  - Quarantined test verifying `data/user_drugs/drg-0002.json` failure at input gating.

### 3. `tests/v2/test_cli.py` (5 tests)
- **Functions Tested:** `src/asd_mcda/v2/cli.py:main()`.
- **Verifications:**
  - CLI argument parsing (`--drug`, `--polymers`, `--mode`, `--seed`, `--monte-carlo`).
  - Output manifest file generation and exit code handling.
  - Error trapping on unvalidated input profiles in authoritative research mode.

### 4. `tests/v2/test_diagnostics.py` (2 tests)
- **Functions Tested:** `src/asd_mcda/v2/diagnostics.py:audit_truncation_discrepancy()`.
- **Verifications:**
  - Truncation discrepancy vector $E_i = ||z_i - \hat{z}_i||_2$.
  - Signed error accounting: verification that when $K=p$ (full rank), discrepancy $E_i \equiv 0.0$.

### 5. `tests/v2/test_engine.py` (11 tests)
- **Functions Tested:** `src/asd_mcda/v2/engine.py:VariableKEngine.evaluate()`.
- **Verifications:**
  - Complete end-to-end evaluation of Indomethacin reference cohort ($K=3$).
  - Dynamic $K$ dimension retention ($K \in \{1, 2, 3, 4\}$).
  - Rejection of degenerate cohorts with zero variance (`ZeroVarianceStandardizationError`).
  - Gate blocking on unstable subspaces (`DegenerateSubspaceBlockedError`).

### 6. `tests/v2/test_metrics.py` (17 tests)
- **Functions Tested:** `src/asd_mcda/v2/metrics.py:construct_metric_tensor()`, `project_reference_points()`, `compute_closeness()`.
- **Verifications:**
  - Subspace metric tensor construction: $M_K = V_K^T W V_K$.
  - Positive-definiteness check: all eigenvalues $\lambda_i(M_K) > 0$.
  - Quadratic form distance calculation: $D^+(t_i) = \sqrt{(t_i - t^+)^T M_K (t_i - t^+)}$.
  - TOPSIS relative closeness formula: $C_L = \frac{D^-}{D^+ + D^-} \in [0, 1]$.
  - Monotonicity and anti-ideal separation guardrails.

### 7. `tests/v2/test_models.py` (8 tests)
- **Functions Tested:** `src/asd_mcda/v2/models.py:VariableKDecisionSnapshot`, `deep_freeze()`, `make_readonly()`.
- **Verifications:**
  - Immutability of returned snapshots: attempting to modify `snapshot.closeness[0] = 0.9` raises `ValueError` or `FrozenInstanceError`.
  - Canonical criteria ordering enforcement: `[s_HSP, s_chi, s_desc, s_GT]`.

### 8. `tests/v2/test_pca.py` (3 tests)
- **Functions Tested:** `src/asd_mcda/v2/pca.py:decompose_spectral()`.
- **Verifications:**
  - Spectral decomposition of correlation matrix $R_m$ via `scipy.linalg.eigh`.
  - Descending eigenvalue ordering: $\lambda_1 \ge \lambda_2 \ge \lambda_3 \ge \lambda_4$.
  - Eigenvector sign canonicalization: leading nonzero entry forced to positive.
  - Cumulative variance thresholding: dynamic selection of smallest $K$ satisfying $\sum_{j=1}^K \lambda_j / p \ge 0.95$.

### 9. `tests/v2/test_pipeline_integration.py` (6 tests)
- **Functions Tested:** Full multi-stage integration from raw matrix to frozen snapshot.
- **Verifications:**
  - Synthetic cohorts with prescribed dimensionality: $K=1, 2, 3, 4$.
  - Indomethacin benchmark cohort verification: exact matching of $K=3$ and cumulative variance $99.9634\%$.

### 10. `tests/v2/test_provenance.py` (4 tests)
- **Functions Tested:** `src/asd_mcda/v2/provenance.py:to_canonical_json()`, `compute_analysis_fingerprint()`, `build_provenance_manifest()`.
- **Verifications:**
  - Canonical JSON string determinism: invariant under dictionary key ordering.
  - Two-pass non-circular SHA-256 manifest hashing.
  - Bitwise stability of fingerprint under identical inputs.

### 11. `tests/v2/test_sensitivity.py` (8 tests)
- **Functions Tested:** `src/asd_mcda/v2/sensitivity.py:MorrisSensitivityEngine.run()`.
- **Verifications:**
  - Factor space definition: $d = 26$ factors (20 score dimensions + 6 AHP pairwise).
  - Trajectory generation: $p = 4$ levels, step $\Delta = 2/3$.
  - Whole-trajectory discard on blocked points.
  - Elementary effect calculation: $\mu^* = \frac{1}{r} \sum |EE_i|$.

### 12. `tests/v2/test_stability.py` (4 tests)
- **Functions Tested:** `src/asd_mcda/v2/stability.py:evaluate_subspace_stability()`.
- **Verifications:**
  - Boundary eigengap calculation: $\delta_K = \lambda_K - \lambda_{K+1}$.
  - Three-tier stability classification:
    * $\delta_K \ge 0.10 \implies \text{STABLE}$.
    * $0.03 \le \delta_K < 0.10 \implies \text{WARNING}$.
    * $\delta_K < 0.03 \implies \text{BLOCKED}$ (`DegenerateSubspaceBlockedError`).

### 13. `tests/v2/test_standardization.py` (3 tests)
- **Functions Tested:** `src/asd_mcda/v2/standardization.py:standardize_cohort()`.
- **Verifications:**
  - Population moments ($ddof=0$): $\mu_j = \frac{1}{m} \sum s_{ij}$, $\sigma_j = \sqrt{\frac{1}{m} \sum (s_{ij} - \mu_j)^2}$.
  - Unit variance and zero mean of standardized cohort matrix $Z$.
  - Zero-variance column detection: raising `ZeroVarianceStandardizationError`.

### 14. `tests/v2/test_uncertainty.py` (8 tests)
- **Functions Tested:** `src/asd_mcda/v2/uncertainty.py:MonteCarloEngine.run()`.
- **Verifications:**
  - Replicate generation: $N = 10,000$, seed = 42.
  - Re-evaluation of dynamic $K$ for every single replicate.
  - Replicate Conservation Law: $N_{\text{generated}} = N_{\text{valid}} + N_{\text{blocked}}$.
  - Proper conditioning of top-1 selection probability: $P(\text{top-1} \mid \text{valid}) = \text{count} / N_{\text{valid}}$.

### 15. `tests/v2/test_v15_isolation_regression.py` (4 tests)
- **Functions Tested:** Cryptographic isolation of legacy baseline.
- **Verifications:**
  - Recursive SHA-256 verification of all 71 frozen v1.5 files against commit `31eee4d`.
  - Assertion that no v2 import modifies or mutates v1.5 modules.

---

## 5. Authoritative Test Execution Commands

In scientific audits, reproducing test passes requires precise command invocations. PharmaPolySCOPE specifies four canonical commands:

```bash
# 1. Authoritative v2 Production Regression Suite (116 tests)
pytest tests/v2/ -v

# 2. Cheminformatics & Molecular Integrity Gate (29 tests)
pytest tests/v2/test_cheminformatics_integrity.py -v

# 3. Cryptographic v1.5 Baseline Isolation Suite (4 tests)
pytest tests/v2/test_v15_isolation_regression.py -v

# 4. Full Framework Regression Suite (All unit, integration, and web tests)
py -3 -m pytest tests/ -v
```

### Execution Output & Verification Criteria
A valid test run must report **zero failures and zero errors**:
- `tests/v2/`: `116 passed`
- `test_cheminformatics_integrity.py`: `29 passed`
- `test_v15_isolation_regression.py`: `4 passed`
- Full test suite: `208 passed`

---

## 6. Verification vs. Validation: The Epistemological Boundary

### Layer A — General Scientific/Technical Concept
The distinction between verification and validation is formalized by IEEE Standard 1012 and the ASME V&V 10 / V&V 40 standards:
- **Verification:** *"Was the software built right?"* The process of determining whether computational models correctly implement the intended mathematical equations, data structures, and algorithms. Verification is mathematical, logical, and internal to the code.
- **Validation:** *"Was the right software built?"* The process of determining whether the mathematical model accurately represents the physical or biological system of interest in the real world. Validation is physical, experimental, and empirical.

### Layer B — Actual PharmaPolySCOPE Implementation
PharmaPolySCOPE enforces this distinction through architectural isolation:
1. **Verification Evidence:**
   - 116 v2 automated tests passing with 100% success.
   - 71 frozen baseline files byte-identical.
   - Zero numerical NaN leaks or uncaught floating-point errors.
   - Mathematical axioms rigorously asserted across all matrix operations.
2. **Validation Evidence Status:**
   - **Computational Scientific Validation:** **PASSED (Class B)**. The multi-cohort benchmark study (`VAL-RPT-2026-V2-001-REV1`) established that the algorithm behaves correctly on three real drug cohorts (Indomethacin, Ibuprofen, Itraconazole) and correctly quarantines corrupted profiles (`DRG-0002`).
   - **Experimental Formulation Validation:** **PENDING**. Laboratory preparation of amorphous solid dispersions, dissolution testing, PXRD characterization, and physical stability tracking have **not** been executed.

### Layer C — Why This Implementation Choice Matters
Claiming that passing 116 software tests "validates the polymer recommendations" is a catastrophic scientific error. The software tests demonstrate that if you give the system Indomethacin parameters, it will compute $C_L = 0.686435$ for Soluplus without crashing. They do **not** prove that Soluplus will physically prevent Indomethacin crystallization in a humidity chamber over 6 months. A rigorous viva defense articulates this boundary with absolute clarity.

---

## 7. Ten Layered Viva Defense Scenarios

### Q1: What is the exact difference between software verification and scientific validation in PharmaPolySCOPE?
- **Direct Answer:** Software verification demonstrates that our Python code correctly implements the specified mathematical equations without coding bugs, whereas scientific validation assesses whether those mathematical equations accurately predict real physical formulation behavior.
- **Reasoning:** Verification is a purely internal mathematical and logical check (e.g., verifying that metric tensor $M_K = V_K^T W V_K$ is positive-definite). Validation requires comparing model outputs against external empirical reality (e.g., laboratory dissolution and crystallization experiments).
- **Actual PharmaPolySCOPE Implementation:** Verification is established by our 116 passing tests in `tests/v2/`. Validation is addressed by the computational benchmark study `VAL-RPT-2026-V2-001-REV1`, while prospective experimental formulation validation remains explicitly pending.
- **Limitation / Caveat:** 100% verification coverage provides zero guarantee that the thermodynamic models (HSP, Flory-Huggins, Gordon-Taylor) are sufficient to describe complex drug-polymer miscibility.
- **One-Sentence Defense:** Verification proves our code calculates the mathematics correctly, but only laboratory experiments can validate whether those mathematics capture physical reality.

### Q2: Does your 131/131 passing test count prove that your polymer rankings are scientifically correct?
- **Direct Answer:** No. It proves that our numerical pipeline executed 131 distinct algorithmic, cheminformatics, and isolation checks without error, but it does not prove that the resulting polymer rankings reflect biological or pharmaceutical reality.
- **Reasoning:** Tests verify software contracts (e.g., that $CR < 0.08$ is enforced, that $Z$ has zero mean, that RDKit descriptors match expected values). They cannot verify whether the weights chosen in AHP or the assumptions of Flory-Huggins lattice theory match in vivo performance.
- **Actual PharmaPolySCOPE Implementation:** Demonstrated by the 116 tests in `tests/v2/` and 15 tests in `tests/unit/test_rdkit_integration.py`, which assert algebraic properties and exception handling.
- **Limitation / Caveat:** The test suite operates entirely in silico and cannot account for crystallization kinetics, moisture plasticization, or ternary manufacturing degradation.
- **One-Sentence Defense:** The test suite establishes computational integrity and software verification, but never substitutes for empirical formulation validation.

### Q3: How do you solve the Test Oracle Problem when testing Monte Carlo uncertainty propagation?
- **Direct Answer:** We construct test oracles using mathematical conservation laws and physical bounds rather than attempting to guess exact stochastic outputs.
- **Reasoning:** Because individual stochastic replicates vary, an oracle cannot check specific closeness values; instead, it checks that the Replicate Conservation Law holds ($N_{\text{generated}} = N_{\text{valid}} + N_{\text{blocked}}$), that valid probabilities sum to 1.0, and that all retained eigenvalues are strictly positive.
- **Actual PharmaPolySCOPE Implementation:** Enforced in `tests/v2/test_uncertainty.py`, where `len(snapshot.valid_replicates) + len(snapshot.blocked_replicates) == 10000` and `assert_allclose(sum(p_top1.values()), 1.0, atol=1e-7)` are verified.
- **Limitation / Caveat:** Invariant testing verifies the structural integrity of the simulation but cannot verify whether the input standard deviations ($\sigma_{\text{score}} = 0.08, \sigma_{\text{AHP}} = 0.15$) represent true physical experimental uncertainty.
- **One-Sentence Defense:** We test stochastic algorithms against invariant mathematical theorems and conservation laws rather than arbitrary numerical guesses.

### Q4: Why did you write 4 dedicated tests in `test_v15_isolation_regression.py` using cryptographic SHA-256 hashes?
- **Direct Answer:** To guarantee that the development of the v2 engine did not alter, mutate, or contaminate any of the 71 frozen baseline files that define the published v1.5 benchmark.
- **Reasoning:** In scientific software refactoring, developers frequently modify shared utility functions or data loaders, accidentally changing historical benchmark results. Cryptographic hashing provides an absolute tamper-evident verification barrier.
- **Actual PharmaPolySCOPE Implementation:** Implemented in `tests/v2/test_v15_isolation_regression.py`, which calculates SHA-256 hashes for all 71 files in `src/asd_mcda/` (commit `31eee4d`) and asserts bitwise identity against `FROZEN_V15_BASELINE_COMMIT`.
- **Limitation / Caveat:** Hash preservation ensures historical code immutability but does not mean that the v1.5 methodology was mathematically optimal; indeed, v2 was created precisely to fix v1.5's static $K=2$ flaw.
- **One-Sentence Defense:** We used SHA-256 hashes to guarantee that our historical scientific baseline remained mathematically and physically frozen during v2 development.

### Q5: Why are floating-point assertions in your test suite bounded by tolerances rather than strict equality?
- **Direct Answer:** Because IEEE 754 floating-point arithmetic is subject to rounding error, register width variations, and non-associative operation ordering across different hardware and compiler environments.
- **Reasoning:** Operations such as matrix multiplication and spectral decomposition accumulate roundoff error on the order of machine epsilon ($\varepsilon_{\text{mach}} \approx 2.22 \times 10^{-16}$). Expecting exact equality `a == b` leads to brittle, machine-dependent test failures.
- **Actual PharmaPolySCOPE Implementation:** All numerical assertions throughout `tests/v2/` utilize `numpy.testing.assert_allclose(actual, expected, atol=1e-7, rtol=1e-5)`.
- **Limitation / Caveat:** Loose tolerances could theoretically mask subtle algorithmic errors; tolerances must therefore be chosen tight enough to catch mathematical errors while accommodating hardware rounding.
- **One-Sentence Defense:** We employ bounded numerical tolerances to maintain reproducible, robust test oracles across diverse IEEE 754 computing platforms.

### Q6: What does the 29-test cheminformatics integrity suite (`test_cheminformatics_integrity.py`) protect against?
- **Direct Answer:** It protects the computational engine against corrupted, unphysical, or syntactically invalid chemical input data before any matrix calculations occur.
- **Reasoning:** Downstream thermodynamic models rely on valid molecular weights, Crippen $\log P$, and topological polar surface areas. If an invalid SMILES string or valence violation is processed, calculations fail silently or produce unphysical garbage.
- **Actual PharmaPolySCOPE Implementation:** `tests/v2/test_cheminformatics_integrity.py` validates RDKit graph parsing, valence sanity, descriptor extraction, and verifies that `ProductionFallbackProhibitedError` is raised if fallback approximations are attempted.
- **Limitation / Caveat:** RDKit validates 2D graph topology and standard valence rules, but cannot verify whether a chemical structure is experimentally stable, synthesizable, or commercially available.
- **One-Sentence Defense:** The cheminformatics suite serves as a strict upstream gate, ensuring that unphysical molecular graphs are intercepted before entering numerical modeling.

### Q7: Why did you test 15 files in `tests/v2/` individually rather than relying only on an end-to-end integration test?
- **Direct Answer:** Because unit tests provide fine-grained fault localization, allowing us to pinpoint the exact mathematical component that fails without confounding effects from upstream or downstream modules.
- **Reasoning:** If only an end-to-end pipeline test is run and the output closeness $C_L$ is off by 0.05, it is impossible to determine whether the bug occurred in standardization, PCA decomposition, AHP weighting, or TOPSIS distance projection.
- **Actual PharmaPolySCOPE Implementation:** We maintain 14 isolated unit test modules testing individual stages (e.g. `test_pca.py`, `test_ahp.py`, `test_metrics.py`), complemented by `test_pipeline_integration.py` for end-to-end verification.
- **Limitation / Caveat:** Passing all unit tests does not guarantee pipeline correctness if the data handover interfaces between modules are misaligned.
- **One-Sentence Defense:** We test every mathematical module in complete isolation to guarantee granular fault localization before verifying their end-to-end integration.

### Q8: How does your test suite verify that the v2 engine is completely stateless?
- **Direct Answer:** By asserting that repeated calls to `VariableKEngine.evaluate()` with identical inputs yield bitwise identical outputs and that all returned data structures are deeply frozen.
- **Reasoning:** In multi-cohort screening and Monte Carlo simulation, state leakage between runs (e.g. accumulating values in class-level lists or mutating NumPy arrays in place) leads to catastrophic numerical corruption.
- **Actual PharmaPolySCOPE Implementation:** In `tests/v2/test_models.py`, we assert that returned `VariableKDecisionSnapshot` instances cannot be modified (`FrozenInstanceError`), and in `test_engine.py`, we assert that back-to-back executions produce zero state drift.
- **Limitation / Caveat:** Python runtime immutability requires discipline; low-level C-extensions could theoretically bypass Python-level immutability if not properly wrapped.
- **One-Sentence Defense:** We enforce immutability and test for zero state leakage to guarantee that every analysis is mathematically independent and reproducible.

### Q9: Why is `py -3 -m pytest tests/ -v` recommended alongside `pytest tests/v2/ -v`?
- **Direct Answer:** Invoking `py -3 -m pytest` ensures that pytest runs using the exact Python 3.14 interpreter and environment on Windows, avoiding path confusion with other installed Python versions.
- **Reasoning:** On Windows workstations, global shell commands like `pytest` may resolve to a different Python environment or virtual environment than intended. Explicit module execution via the Windows Python Launcher (`py -3 -m`) guarantees deterministic runtime binding.
- **Actual PharmaPolySCOPE Implementation:** Documented in `README.md`, `docs/reproducibility.md`, and validated across our test harness.
- **Limitation / Caveat:** Command syntax varies across operating systems (e.g., `python3 -m pytest` on Linux/macOS).
- **One-Sentence Defense:** Explicit launcher invocation prevents Python runtime collisions and ensures reproducible test execution across developer environments.

### Q10: How would you respond if an examiner asserts that your testing methodology is purely software engineering and adds no scientific value to your thesis?
- **Direct Answer:** I would respectfully disagree and explain that in computational science, software is the laboratory instrument; unverified software produces unscientific, irreproducible results.
- **Reasoning:** If a physical chemist used a spectrometer without calibrating its mirrors and photodetectors, their data would be rejected. In computational chemistry, our test suite is the instrument calibration that guarantees our mathematical lens is unclouded by numerical drift, state leakage, or algorithmic bugs.
- **Actual PharmaPolySCOPE Implementation:** The 116 v2 production tests calibrate and verify our numerical instrument across spectral decomposition, metric tensor formulation, and Monte Carlo propagation.
- **Limitation / Caveat:** Instrument calibration does not guarantee that the sample placed in the instrument is representative of nature, which is why experimental formulation validation remains essential.
- **One-Sentence Defense:** The test suite is our computational calibration protocol, ensuring that our thesis findings reflect genuine mathematical properties rather than coding artifacts.
