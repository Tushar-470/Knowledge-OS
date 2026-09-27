# MODULE 13 — DELIVERABLE MANIFEST
# Formal Specification of Module 13 Target Deliverables & Anti-Hallucination Controls

**Document ID:** `MODULE_13_DELIVERABLE_MANIFEST`  
**Module:** Module 13 — Do NOT Say This in Viva (`13_DO_NOT_SAY_THIS_IN_VIVA/`)  
**Phase:** Module 13 Planning Gate (Curriculum Architecture Transition)  
**Authoritative Curriculum Anchor:** Part 13 of `00_MASTER_KNOWLEDGE_MAP/PHARMAPOLYSCOPE_MASTER_KNOWLEDGE_MAP.md`  
**Auditor:** Forensic Computational-Science Architect & PhD Methodology Auditor  
**Date:** September 23, 2026  
**Status:** **AUTHORITATIVE DELIVERABLE MANIFEST (AUTHORING BLOCKED)**  

---

## 1. Inventory of Target Deliverables in `13_DO_NOT_SAY_THIS_IN_VIVA/`

When Module 13 execution is authorized, exactly seven deliverables will be authored within `13_DO_NOT_SAY_THIS_IN_VIVA/`:

| # | Deliverable File Name | Structural Role & Purpose | Target Scope | Source Dependencies | Acceptance Criteria |
| :- | :--- | :--- | :---: | :--- | :--- |
| **D1** | `MODULE_13_MASTER_FORBIDDEN_CANON.md` | Master taxonomy of 35+ forbidden assertions across 7 domains with fatal flaw analysis | ~25,000 chars | Master Map Part 13, Module 09, Module 12 Canon | All 7 domains covered; 35+ items cataloged; fatal flaws detailed |
| **D2** | `MODULE_13_EXAMINER_TRAP_DECONSTRUCTION.md`| 20 simulated hostile viva traps with 3-tier answers (`SHORT ANSWER`, `IF PRESSED`, `BOUNDARY`)| ~30,000 chars | Module 09 Attacks, Module 11 Counterfactuals, Module 12 Ledger | 20 traps fully deconstructed; 10-element rubric complete; zero overclaims |
| **D3** | `MODULE_13_ORAL_DEFENSE_FLASHCARDS.md` | Rapid-fire verbal drill flashcards with paired "Never Say" vs. "Say Instead" | ~15,000 chars | D1, D2, Module 12 Quick Reference | Direct verbal drill format; concise; memorizable |
| **D4** | `MODULE_13_EPISTEMIC_GOVERNANCE_LEDGER.md` | Theoretical treatise on proxy modeling philosophy, non-mechanistic MCDA, and audit | ~18,000 chars | Philosophy of science literature, `provenance.py`, `metrics.py` | 6 epistemic tiers defined; proxy modeling rigorous; limits defended |
| **D5** | `MODULE_13_EXECUTION_RESULTS.json` | Machine-readable catalog of traps, classifications, replacements, and SHA-256 hashes | ~10,000 chars | Production code AST, D1, D2 | Valid JSON schema; 20 traps indexed; 100% hash consistency |
| **D6** | `MODULE_13_EXECUTION_LOG.md` | Chronological audit trail of Module 13 authoring, gate verification, and milestones | ~8,000 chars | Git commit logs, execution timestamps | Complete progression recorded; zero gaps |
| **D7** | `MODULE_13_FORENSIC_AUDIT.md` | Independent audit certificate verifying Gates G0 through G10 and zero defects | ~6,000 chars | Gates G0–G10 specifications, `git status` | Gates G0–G10 passed; P0=0, P1=0, P2=0, P3=0 certified |

---

## 2. Specification of the Twenty Core Simulated Hostile Traps

The twenty simulated hostile viva traps to be deconstructed in `MODULE_13_EXAMINER_TRAP_DECONSTRUCTION.md` are:

```
+----+------------------------------------------------------------------------------------+
| #  | Simulated Hostile Examiner Question                                                |
+----+------------------------------------------------------------------------------------+
| 01 | "Which polymer is the proven best formulation for Indomethacin?"                   |
| 02 | "Doesn't your 55.51% Monte Carlo result mean a 55% chance of clinical success?"    |
| 03 | "Why did you drop criterion 4 during your PCA dimensionality reduction?"           |
| 04 | "Your AHP weights show 73% thermodynamic contribution. How did you validate that?" |
| 05 | "Why did 14% of your Monte Carlo simulation runs fail? Is your software unstable?" |
| 06 | "How do you explain the unphysical crystalline density that broke DRG-0002?"       |
| 07 | "Can your software predict if an ASD will recrystallize after 2 years at 25°C/60%?"|
| 08 | "Why did you use K-Means clustering to partition your polymers?"                   |
| 09 | "Why do 6 tests fail in your regression suite? Isn't the codebase broken?"         |
| 10 | "How can you justify claiming bitwise reproducibility for 16-decimal floats?"      |
| 11 | "Doesn't a Consistency Ratio CR < 0.08 prove your expert weights are true?"       |
| 12 | "How does your Morris method prove that molecular descriptors cause the ranking?"  |
| 13 | "If HSP distance is small, does that guarantee negative Gibbs free energy of mix?" |
| 14 | "Why did Eudragit E PO win for Ibuprofen while Soluplus won for Indomethacin?"     |
| 15 | "What happens to your ranking if the drug loading is increased to 50%?"            |
| 16 | "Doesn't your boundary eigengap delta_3 = 0.7383 prove that 3 criteria are real?"   |
| 17 | "How do you defend using Hwang-Yoon TOPSIS when criteria are highly correlated?"   |
| 18 | "Why didn't you split your 5 polymers into training, testing, and hold-out sets?"  |
| 19 | "What physical molecular mechanism explains why Soluplus has closeness C_L=0.686?"|
| 20 | "If your tool is purely computational, why should a pharmaceutical company use it?"|
+----+------------------------------------------------------------------------------------+
```

---

## 3. Anti-Hallucination Matrix & Risk Mitigation Table

```
+--------------------------------------+--------------------------------------+--------------------------------------+
| Hallucination / Overclaim Risk       | Vulnerability Mechanism              | Non-Discretionary Mitigation Rule    |
+--------------------------------------+--------------------------------------+--------------------------------------+
| 1. Invented Implementation Features  | Attempting to answer a question with | Strictly cite only verified source   |
|                                      | imaginary algorithms or APIs.        | files (`engine.py`, `ahp.py`, etc.). |
+--------------------------------------+--------------------------------------+--------------------------------------+
| 2. Physical / Causal Overreach       | Succumbing to examiner pressure to   | Enforce TIER-3/TIER-5 boundaries:    |
|                                      | explain "why" physically.            | frame as multi-criteria proxy ranking|
+--------------------------------------+--------------------------------------+--------------------------------------+
| 3. Numerical Value Drift             | Citing approximate or recalled       | Anchor 100% of numerical figures     |
|                                      | numbers that diverge from ledger.    | directly to `NUM-001` through `090`. |
+--------------------------------------+--------------------------------------+--------------------------------------+
| 4. Classical TOPSIS Slippage         | Using classical Euclidean distance   | Explicitly enforce SP-PRP-TOPSIS     |
|                                      | formulas without metric tensor.      | with metric tensor M_K = V_K^T W V_K.|
+--------------------------------------+--------------------------------------+--------------------------------------+
| 5. K-Means Cluster Conflation        | Referring to PCA K as "clusters"     | Strictly define K as retained        |
|                                      | or mentioning elbow methods.         | principal components for 95% variance|
+--------------------------------------+--------------------------------------+--------------------------------------+
| 6. MC Top-1 Probability Fallacy      | Interpreting p_top1 as physical      | Frame p_top1 strictly as rank        |
|                                      | formulation success rate.            | stability under computational noise. |
+--------------------------------------+--------------------------------------+--------------------------------------+
| 7. Morris Causality Fallacy          | Interpreting mu* as physical causal  | Frame Morris strictly as algorithmic |
|                                      | force driving miscibility.           | factor sensitivity screening.        |
+--------------------------------------+--------------------------------------+--------------------------------------+
| 8. AHP Mechanistic Fallacy           | Adding weights and calling them      | Purge all "73% thermodynamic" claims;|
|                                      | thermodynamic percentage shares.     | frame as subjective preference trade.|
+--------------------------------------+--------------------------------------+--------------------------------------+
| 9. DRG-0002 Density Myth             | Repeating legacy text about corrupt  | Ground quarantine strictly in        |
|                                      | density rather than identity check.  | chemistry.py identity validation.    |
+--------------------------------------+--------------------------------------+--------------------------------------+
| 10. Bitwise Reproducibility Claim    | Overpromising platform independence  | Use preferred wording: computational |
|                                      | of float64 computations.             | auditability and exact recording.    |
+--------------------------------------+--------------------------------------+--------------------------------------+
```

---

## 4. Manifest Sign-Off & Execution Hold

This manifest represents the complete architectural specification for Module 13. Authoring of deliverables D1 through D7 is **STRICTLY BLOCKED** until explicit user authorization is provided.

**PLANNING STATUS:** **COMPLETE — PROCEED TO GATE EVALUATION**
