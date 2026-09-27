# MODULE 13 — SCOPE PROPOSAL
# Curriculum Handoff & Formal Architecture Specification for Module 13

**Document ID:** `MODULE_13_SCOPE_PROPOSAL`  
**Module Target:** Module 13 — Do NOT Say This in Viva (`13_DO_NOT_SAY_THIS_IN_VIVA/`)  
**Phase:** Phase 9 Final Freeze & Module 13 Handoff Gate  
**Authoritative Curriculum Anchor:** Part 13 of `00_MASTER_KNOWLEDGE_MAP/PHARMAPOLYSCOPE_MASTER_KNOWLEDGE_MAP.md`  
**Auditor:** Forensic Computational-Science Architect & PhD Methodology Auditor  
**Date:** September 23, 2026  
**Status:** **PROPOSED & SOURCE-LOCKED PLANNING SPECIFICATION (AUTHORING BLOCKED)**  

---

## 1. Proposed Module 13 Title

**Module 13: Do NOT Say This in Viva**  
*Sub-title:* Epistemic Boundaries, Fatal Viva Traps, Forbidden Assertions & Scientifically Defensible Oral Responses

---

## 2. Why Module 13 Follows Module 12

In **Module 12: Numbers You Must Know**, the doctoral candidate memorized the exact quantitative master ledger (`NUM-001` through `NUM-090`), the 10 critical numbers, 5 governance tripwires, and 7 mathematical derivations. 

However, possessing exact numerical recall creates a dangerous viva vulnerability: **the illusion of physical precision and causal insight**. If an examiner asks *"Why did Soluplus win?"* or *"What do your AHP weights tell us about thermodynamic stability?"*, an unprepared candidate who recites numbers with casual, causal, or physical terminology will be immediately dismissed for scientific overreach.

Module 13 provides the essential **negative-space defense training**:
- It codifies what the candidate must **NEVER SAY** under any circumstances.
- It deconstructs the hostile examiner's trap behind each question.
- It identifies the exact fatal methodological flaw exposed by the forbidden answer.
- It supplies the pre-rehearsed, epistemically watertight, and scientifically defensible replacement response.

---

## 3. Exact Learning Objective

Upon completion of Module 13, the candidate must be able to:
1. Recognize hostile PhD viva traps designed to induce physical, causal, or clinical overclaims.
2. Immediately suppress instinctive, colloquial, or marketing assertions (e.g., "optimal polymer", "proves miscibility", "73% thermodynamic driving force", "55.5% success probability").
3. Articulate the precise mathematical and computational boundaries of the PharmaPolySCOPE v2 framework in real-time oral defense.
4. Convert high-risk cross-examination questions into authoritative demonstrations of scientific humility, methodological rigor, and governance awareness.

---

## 4. Scientific Scope

The scientific scope of Module 13 encompasses the rigorous epistemic demarcation of the four compatibility domains and the aggregation pipeline:
1. **Thermodynamic Compatibility Demarcation:** Distinguishing solubility parameter distance ($s_{	ext{HSP}}$) and Flory-Huggins interaction parameter ($s_\chi$) as computational geometric/lattice indicators from true experimental Gibbs free energy of mixing ($\Delta G_{	ext{mix}}$).
2. **Kinetic / Glass Stability Demarcation:** Distinguishing Gordon-Taylor anti-plasticization margin ($s_{	ext{GT}}$) from real-world room-temperature recrystallization kinetics, moisture absorption, and physical shelf-life.
3. **Dimensionality Reduction Demarcation:** Clarifying that PCA orthogonalization captures cohort variance across normalized scores, rather than selecting "important physical criteria" or eliminating variables.
4. **Decision-Theoretic Demarcation:** Establishing that AHP preference weights and TOPSIS closeness scores reflect decision-maker priorities and relative geometric distances, rather than thermodynamic driving forces or clinical efficacy.
5. **Stochastic Uncertainty Demarcation:** Establishing that Monte Carlo top-1 frequency ($p_{	ext{top1}} = 55.51\%$) reflects algorithmic stability under input perturbations, not experimental probability of formulation success.

---

## 5. Software & Architecture Scope

Module 13 explicitly covers the software governance and architecture boundaries:
1. **Version Semantics Defense:** Defending the co-existence of package API `1.5.0` (for backward compatibility), computational engine `2.0.0`, methodology `2.0.0-SP-PRP-TOPSIS`, and scientific baseline `v1.5.0-FOUR-CRITERION-FREEZE` (commit `31eee4d`).
2. **Defensive Exception Hierarchy:** Articulating why defensive tripwires (e.g., `DegenerateSubspaceBlockedError`, `AHPConsistencyViolationError`, `ZeroVarianceStandardizationError`) are architectural victories that halt corrupted execution, rather than software defects or "failures".
3. **Chemistry Governance Provenance:** Defending the quarantine of DRG-0002 as a triumph of strict chemical identity validation (`resolve_validated_drug_snapshot()` in `chemistry.py`), rejecting heuristic density-anomaly explanations.

---

## 6. What the Student Must Be Able to Explain Orally After Completion

The candidate must be able to answer the following ten high-risk viva attack questions with zero hesitation and zero forbidden phrasing:

1. *"Which polymer is best for Indomethacin?"*  
   *Candidate Response:* State that "best" is unscientific; Soluplus is the top-ranked computational candidate under the configured multi-criteria preference weights and 3D PCA subspace.
2. *"What does your 55.51% Monte Carlo result mean for a pharmaceutical formulator?"*  
   *Candidate Response:* It represents the computational ranking stability under $\pm 15\%$ AHP log-space and $\pm 5\%$ criterion score perturbations across 8,600 valid replicates, not formulation success probability.
3. *"Why did you eliminate criterion 4 in your PCA step?"*  
   *Candidate Response:* No criterion was eliminated. The 4 criteria are preserved in the four-criterion freeze baseline; PCA identified a 3-dimensional subspace capturing $99.96\%$ of cohort variance, and all 4 criteria contribute to this subspace via the eigenvector projection matrix.
4. *"Your AHP weights show 73% thermodynamic contribution. How did you validate that thermodynamically?"*  
   *Candidate Response:* The AHP weights do not represent thermodynamic driving forces or physical contribution shares. They represent decision-theoretic preference weights ($w_{	ext{HSP}}=0.4077, w_\chi=0.3244$) allocated across computational proxy indicators.
5. *"Why did 14% of your Monte Carlo runs fail?"*  
   *Candidate Response:* They did not fail; they were intentionally blocked by governance gates (1,396 by $CR \ge 0.08$ and 4 by eigengap $\delta_K < 0.03$), proving that the system actively enforces decision consistency.
6. *"How do you prove that DRG-0002 has corrupted crystalline density?"*  
   *Candidate Response:* DRG-0002 was not quarantined due to density; it was quarantined by strict chemical identity validation because the requested drug name (Fenofibrate) did not match the stored chemical structure (Indomethacin).
7. *"Can your software predict if an amorphous solid dispersion will crystallize after two years at 25°C/60% RH?"*  
   *Candidate Response:* No. PharmaPolySCOPE is a computational screening tool based on thermodynamic and glass-transition proxy indicators; shelf-life prediction requires experimental accelerated stability testing.
8. *"Why did you use K-Means clustering to choose your polymers?"*  
   *Candidate Response:* K-Means was not used. $K=3$ represents the dynamic subspace dimension selected by principal component analysis based on a $95\%$ cumulative variance threshold.
9. *"Why do 6 tests fail in your v1.5 regression suite?"*  
   *Candidate Response:* Those 6 tests belong to the legacy fixed-$K$ test suite; their failure in the v2 engine confirms that the dynamic-$K$ innovation is active and that legacy behavior is isolated.
10. *"How do you justify storing floating-point numbers to 16 decimal places for molecular weight?"*  
    *Candidate Response:* The raw float64 value is retained for computational auditability and exact recording of the executed result; viva values are reported at standard significant digits matching measurement limits.

---

## 7. What is Explicitly Out of Scope

To prevent scope creep and maintain strict academic focus, the following topics are explicitly **OUT OF SCOPE** for Module 13:
- Re-deriving mathematical equations (already completed in Module 12).
- Implementing new Python code, scripts, or test cases.
- Proposing wet-lab experimental protocols or stability chamber design.
- Re-running Monte Carlo or Morris simulations.
- Designing GUI layouts or user interfaces.
- Expanding the polymer library beyond the 5 validated polymers.

---

## 8. Required Source Files (Read-Only)

Module 13 will be constructed strictly from the following existing authoritative sources:
1. `00_MASTER_KNOWLEDGE_MAP/PHARMAPOLYSCOPE_MASTER_KNOWLEDGE_MAP.md` (Part 13: Forbidden Phrases table).
2. `09_VIVA_ATTACK_FILES/` (Examiner psychology and trap archetypes).
3. `12_NUMBERS_YOU_MUST_KNOW/MODULE_12_VIVA_QUICK_REFERENCE.md` (Section 7: Forbidden Viva Phrases).
4. `12_NUMBERS_YOU_MUST_KNOW/MODULE_12_NUMERICAL_DEFENSE_CANON.md` (Defense narratives).
5. `11_COUNTERFACTUAL_LAB/WHAT_IF_EXPERIMENTS.md` (Counterfactual limits and boundaries).
6. `PHASE_9_EPISTEMIC_BOUNDARY.md` (Approved epistemic lexicon).

---

## 9. Expected Deliverables for Module 13

The authored Module 13 package in `13_DO_NOT_SAY_THIS_IN_VIVA/` will consist of:
1. `MODULE_13_MASTER_FORBIDDEN_CANON.md`: The complete master taxonomy of 30+ forbidden viva phrases, organized across 6 scientific and computational domains.
2. `MODULE_13_EXAMINER_TRAP_DECONSTRUCTION.md`: Detailed breakdown of 15 hostile viva attack questions, the hidden trap, the fatal candidate blunder, and the approved PhD defense.
3. `MODULE_13_ORAL_DEFENSE_FLASHCARDS.md`: Rapid-fire flashcards with "Never Say" vs. "Say Instead" pairing for oral drill.
4. `MODULE_13_EPISTEMIC_GOVERNANCE_LEDGER.md`: Theoretical framework explaining the philosophy of science, proxy modeling, and non-mechanistic decision theory underpinning the defense.
5. `MODULE_13_EXECUTION_RESULTS.json`: Structured machine-readable catalog of all forbidden terms, trap archetypes, and approved alternatives.
6. `MODULE_13_FORENSIC_AUDIT.md`: Independent forensic audit verifying zero forbidden terms used in unquoted contexts and zero code modifications.

---

## 10. Proposed Forensic Audit Gates

Authoring of Module 13 will be governed by four strict forensic audit gates:
- **Gate M13-1 (Master Map Fidelity):** All forbidden phrases from Part 13 of the Master Knowledge Map must be integrated without omission.
- **Gate M13-2 (Epistemic Hygiene):** Zero uncontextualized occurrences of prohibited words ("best", "optimal", "proves stability", "73% thermodynamic") in authored expository text.
- **Gate M13-3 (Code Isolation):** Zero modifications to `asd_framework/` production code, configuration, tests, or Modules 00–12.
- **Gate M13-4 (Viva Defense Viability):** Every forbidden phrase must be paired with an actionable, defensible alternative that accurately cites production architecture.

---

## 11. Dependencies on Previous Modules

- **Depends on Module 00:** For high-level pipeline architecture and version semantics.
- **Depends on Modules 01–06:** For scientific domain definitions (HSP, $\chi$, Gordon-Taylor, PCA, AHP, Monte Carlo).
- **Depends on Module 09:** For hostile examiner personas and attack strategies.
- **Depends on Module 11:** For counterfactual boundary limits.
- **Depends on Module 12:** For exact numerical values cited in the approved replacement answers.

---

## 12. Potential Hallucination & Overclaim Risks

1. **Risk:** Creating new chemical or physical theories to justify why a phrase is forbidden.  
   *Mitigation:* Base all justifications strictly on existing literature and active v2 code documentation.
2. **Risk:** Overly defensive answers that sound evasive or imply the software does not work.  
   *Mitigation:* Frame every boundary positively as a demonstration of scientific rigor, domain humility, and governance safety.
3. **Risk:** Reintroducing speculative explanations for DRG-0002 or legacy tests.  
   *Mitigation:* Strictly adhere to the reconciled identity validation provenance established in Module 12.

---

## 13. Proposed Completion Criteria

Module 13 planning will be considered complete when:
1. `MODULE_13_SCOPE_PROPOSAL.md` is reviewed and approved by the user.
2. The user explicitly issues authorization to begin authoring.
3. Zero source code changes have occurred.
4. `MODULE_13_SCOPE = RESOLVED`.
