# MODULE 15 — Mn OPTIONALITY SPECIFICATION
## CONTROLLED FORENSIC REPAIR LOG

**Document ID:** `PS-VIVA-MOD15-REPAIR-LOG-001`  
**Execution Date:** 2026-09-24  
**Auditor / Repair Architect:** Forensic Runtime Auditor & Curriculum Architect  
**Target Specification:** `MODULE_15_MN_OPTIONALITY_ARCHITECTURE_SPEC.md` (`PS-VIVA-MOD15-SPEC-001-REV1`)  
**Audit Reference:** `MODULE_15_MN_OPTIONALITY_ARCHITECTURE_FORENSIC_REPAIR_AUDIT.md` (`PS-VIVA-MOD15-AUDIT-001`)  
**Repository State:** Main branch, Commit `285c3d7` (100% UNMODIFIED)  
**Modules 00–14 State:** 100% UNMODIFIED  

---

## 1. Executive Summary of Repairs

In accordance with the findings of `MODULE_15_MN_OPTIONALITY_ARCHITECTURE_FORENSIC_REPAIR_AUDIT.md` and the strict source-of-truth guidelines, exactly 7 surgical repairs were executed on `MODULE_15_MN_OPTIONALITY_ARCHITECTURE_SPEC.md`.

Every repair was reconciled against:
1. Active production v2 implementation
2. Frozen v1.5 implementation (`v1.5.0-FOUR-CRITERION-FREEZE`)
3. Authoritative Modules 00–14
4. Forensic Repair Audit findings

Zero production code was modified. Modules 00–14 remain completely untouched.

---

## 2. Detailed Surgical Repair Ledger

| Repair ID | Target Defect | Target Section in Spec | Original Text / Defect Description | Exact Repaired Text / Action | Technical & Epistemic Reason | Source of Truth | Classification |
| :---: | :---: | :--- | :--- | :--- | :--- | :--- | :---: |
| **REP-01** | **DEF-01** (P1) | Section 8 (Table rows D & E) | Claimed that $M_n = 0$ and $M_n < 0$ run core MCDA, bypass diagnostic with `NOT_EVALUATED_INVALID_INPUT`, show UI warning alert, and report table renders diagnostic cells. | Updated rows D and E to explicitly state: **Rejected at Schema Ingress Boundary (HTTP 422 Unprocessable Entity)** due to Pydantic `gt=0`. Core MCDA and diagnostic are not reached via API. Clarified that `NOT_EVALUATED_INVALID_INPUT` is strictly an internal fallback for unvalidated legacy CSV/dict loaders. | Conflating HTTP API schema validation with internal dictionary loading fallback creates an architectural contradiction. | `backend/models/schemas.py:PolymerCreate`, `backend/services/validation.py` | **[A] Active Fact** & **[C] Target Spec** |
| **REP-02** | **DEF-02** (P1) | Section 9 & Section 8 | Introduced `NOT_APPLICABLE` for non-polymeric excipients and earlier notes claimed an $r_2 pprox 1$ domain exclusion. | Removed active `NOT_APPLICABLE` domain claim; designated `NOT_APPLICABLE_NON_POLYMER` strictly as a `Proposed Future Extension [C]`. Recorded explicitly that the current codebase contains zero polymer/non-polymer domain classification logic. | Active source code contains zero functions or classes for non-polymer/lipid classification. Inventing domain logic violates audit integrity. | `src/asd_mcda/`, `backend/` | **[A] Active Fact** & **[C] Future Extension** |
| **REP-03** | **DEF-03** (P1) | Section 8 (Row F) & new Section 8.1 | Listed range $[M_{n,\min}, M_{n,\max}]$ without proof of monotonic inversion and used vague phrasing ("dual status", "Green or Amber with interval bounds"). | Inserted Section 8.1 with complete first-derivative derivation ($\partial \chi_c / \partial M_n < 0$), derived $\chi_{c,\min} = \chi_c(M_{n,\max})$ and $\chi_{c,\max} = \chi_c(M_{n,\min})$, and established deterministic 3-state rules: (1) `PASS` ($\chi < \chi_{c,\min}$), (2) `FAIL` ($\chi \ge \chi_{c,\max}$), and (3) `RANGE-INDETERMINATE` ($\chi_{c,\min} \le \chi < \chi_{c,\max}$). Retired "dual status". | $\chi_c$ is strictly monotonically decreasing with $M_n$; interval bounds invert. Mathematical rigor requires deterministic rules without altering the underlying strict comparator $\chi < \chi_c(M_n)$. | Master Knowledge Map, Classical Flory-Huggins Theory | **[B] Methodological Fact** & **[C] Target Spec** |
| **REP-04** | **DEF-04** (P1) | Section 1.1, Section 2.2, Section 3 | Mentioned v2 steps by name but lacked the complete, explicit mathematical sequence; lacked explicit ban on prohibited alternate metric formulations. | Inserted the full authoritative v2 equations ($\mathbf{S}, Z, R, K, T, M_K, z^\pm, t^\pm, D_i^\pm, C_L$). Explicitly stated: "positive-definite quadratic-form metric induced by physical AHP weighting in the retained PCA subspace". Explicitly prohibited $W^{1/2}(I + \sum \lambda v v^T)W^{1/2}$ and ordinary Euclidean TOPSIS descriptions. Defined $K$-selection by variance threshold and eigengap $\Delta_K$ as post-selection stability diagnostic. | Prevents metric equation drift and ensures exact alignment with Viva School Linear Algebra and Decision Science modules. | Viva School Modules 00, 04, 05 | **[B] Methodological Fact** |
| **REP-05** | **DEF-05** (P2) | Section 1.1, Section 8, Section 9, Section 12 | Used "certified $M_n$" and presented advanced provenance enum states (`USER_SUPPLIED_MN_CERTIFIED`, `PROVENANCE_INSUFFICIENT`, etc.) as established system types. | Replaced "certified $M_n$" with "curated literature $M_n$". Explicitly marked all advanced provenance states as `[C] PROPOSED FUTURE ARCHITECTURE`. Clarified that catalog values are literature-derived rather than certified reference materials. | The repository uses literature values from BASF, Evonik, Dow, not certified analytical reference standards. | `polymer_library_v3_five_polymers.csv`, `docs/data_provenance.md` | **[A] Active Fact** & **[C] Target Spec** |
| **REP-06** | **DEF-06** (P2) | Section 15, Section 16 | Marked shared files (`schemas.py`, `validation.py`, `pdf_report_generator.py`) as "VERY LOW" risk without detailing v1.5/v2 shared-infrastructure coupling. | Updated File Map with explicit columns for shared files, version isolation requirements, and architectural mitigation strategies. Reassessed risk to LOW/MODERATE. Formally specified version-aware schema branching (`PolymerCreateV2` or version parameter) and report generator version branching to preserve frozen v1.5 golden regression tests. | Modifying shared schemas without version isolation relaxes the frozen v1.5 baseline contract. | `v1.5.0-FOUR-CRITERION-FREEZE`, `tests/test_report_generator_integrity.py` | **[A] Active Fact** & **[B] Methodological Fact** |
| **REP-07** | **DEF-07** (P3) | Throughout document | Alternated between $C_i$ and $C_L$. | Standardized uniformly on $C_L$ (or $C_{L,i}$ for candidate indexing) across narrative, equations, tables, and viva scripts. | Master Knowledge Map and Module 05 establish $C_L$ as the authoritative closeness coefficient symbol. | Viva School Module 00, Module 05 | **[B] Methodological Fact** |

---

## 3. Specific Thematic Alignments

### **3.1 Mw vs Mn Formulation Framing (Item 9)**
* **Original Phrasing:** Universal statement that "substituting $M_w$ in place of $M_n$ violates Flory-Huggins lattice thermodynamics" or is "scientifically invalid".
* **Repaired Formulation:** Clarified to the precise source-grounded statement:
  > *"Mw is not a valid substitute for Mn in the current chi_c implementation because the implemented chain-volume ratio r2 is parameterized specifically using Mn. In Flory-Huggins lattice theory, combinatorial entropy of mixing depends on the number density of distinct chains ($n_2 \propto 1/M_n$). Substituting $M_w$ into this specific implementation parameterization overestimates chain volume ratio by the Polydispersity Index ($	ext{PDI} = M_w/M_n$) and depresses $\chi_c$ by $1.3\%$ to $3.8\%$ across reference polymers. This is a constraint of the current model formulation, not a universal prohibition on all treatments of polymer molecular-weight distributions."*
* **Epistemic Classification:** **[A] Active Implementation Fact** & **[B] Authoritative Methodology Fact**.

### **3.2 Counterfactual Invariance Scope (Item 14)**
* **Original Phrasing:** Broad claims of numerical invariance across all possible datasets.
* **Repaired Formulation:** Explicitly scoped:
  > *"Under the tested cohorts and tested conditions (specifically verified on the canonical Indomethacin benchmark cohort `IND-001-2026`), omitting or varying $M_n$ produces zero numerical drift ($\Delta C_L = 0.000000$) and zero rank shifts."*
* **Epistemic Classification:** **[A] Active Implementation Fact**.

### **3.3 Exact Comparator Operator (Item 3)**
* **Source Verification:** In `src/asd_mcda/compatibility/flory_huggins.py:23`, the operator is strict inequality: `if chi < chi_c: return "PASS" else: return "FAIL"`.
* **Repaired Formulation:** All references enforce strict inequality $\chi < \chi_c$ for favorable thermodynamic interaction. The proposed range architecture evaluates $\chi < \chi_{c,\min}$ for `PASS`, $\chi \ge \chi_{c,\max}$ for `FAIL`, and $\chi_{c,\min} \le \chi < \chi_{c,\max}$ for `RANGE-INDETERMINATE`, completely preserving the underlying strict pointwise comparator.
* **Epistemic Classification:** **[A] Active Implementation Fact** & **[B] Methodological Fact**.

---

## 4. Verification Checkpoint

```
================================================================================
               MODULE 15 CONTROLLED REPAIR VERIFICATION
================================================================================
Specification file modified: MODULE_15_MN_OPTIONALITY_ARCHITECTURE_SPEC.md (ONLY)
Repair log file created:    MODULE_15_MN_OPTIONALITY_ARCHITECTURE_REPAIR_LOG.md (ONLY)

Production repository files modified:     0 (ZERO)
Production tests modified:                0 (ZERO)
Production configurations modified:       0 (ZERO)
Production releases/tags modified:        0 (ZERO)
Viva School Modules 00–14 modified:       0 (ZERO)
Mn optionality implementation attempted:  NO (READ-ONLY SPECIFICATION REPAIR)
Unsupported Class D claims remaining:     0 (ZERO)

P0 defects remaining: 0
P1 defects remaining: 0
P2 defects remaining: 0
P3 defects remaining: 0

FINAL_STATUS = GO_TO_POST_REPAIR_AUDIT
================================================================================
```
