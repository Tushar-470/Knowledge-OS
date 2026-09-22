# PHASE 8 IMPLEMENTATION PLAN
# MODULE 11 — COUNTERFACTUAL LAB (REVISED & SOURCE-LOCKED)

**Document ID:** `PS-VIVA-MOD11-PLAN-001-REV1`  
**Phase:** Phase 8  
**Target Module:** `11_COUNTERFACTUAL_LAB\`  
**Authoritative Baseline:** Active PharmaPolySCOPE v2 Production Architecture (`asd_mcda/v2/`) & `scientific_validation_results.json` (`VAL-RPT-2026-V2-001-REV1`)  
**Status:** REPAIRED IMPLEMENTATION PLAN — POST-PREFLIGHT SOURCE-LOCKED  
**Preflight Reference:** [`11_COUNTERFACTUAL_LAB/PHASE_8_SOURCE_LOCK_PREFLIGHT.md`](file:///C:/Users/Admin/Documents/GitHub/Knowledge-OS/Knowledge-OS/Areas/Research/Thesis/meow%20nadh%20karti%20kay/PharmaPolySCOPE_Viva_School/11_COUNTERFACTUAL_LAB/PHASE_8_SOURCE_LOCK_PREFLIGHT.md)  
**Mandate:** Establish the complete, publication-grade architectural blueprint for building Module 11 without authoring final teaching content or executing production runs prematurely.

---

## 1. Authoritative Scope

### 1.1 Scope Provenance & Legal Mandate
Module 11 is formally established and bound by four foundational Knowledge-OS records:
1. **Master Architecture Prompt (Phase 0 / Step 18668):** Defines the module title as `COUNTERFACTUAL LAB`, designates folder `11_COUNTERFACTUAL_LAB\`, specifies exactly 20 canonical What-If scenarios, and demands 5 mandatory analytical questions per scenario.
2. **`PHASE_STATUS.md` (Line 143):** Explicitly designates `11_COUNTERFACTUAL_LAB\WHAT_IF_EXPERIMENTS.md` as the primary deliverable under *Priority 3 (Defence Exercises)*.
3. **`09_VIVA_ATTACK_FILES\MODULE_11_SCOPE_FORENSIC_AUDIT.md`:** Establishes that Module 11 is currently **SCAFFOLDED ONLY / NOT YET BUILT** (folder provisioned on 2026-09-14 01:11:02 UTC, 0 files, 0 bytes) and that file `09_VIVA_ATTACK_FILES\11_TRICK_QUESTIONS_AND_COUNTERFACTUALS.md` is an internal Module 09 viva attack component, not Module 11.
4. **`10_REVERSE_ENGINEERING\PHASE_7_FORENSIC_AUDIT.md`:** Concludes Phase 7 with Module 10 approved and frozen, establishing the exact handoff boundary into Phase 8.

---

## 2. Scientific Purpose

In pharmaceutical solid dispersion development, computational multi-criteria screening models are frequently attacked by sceptics and viva examiners as "black boxes" whose candidate selections are sensitive to arbitrary parameter choices. 

Module 11 transforms the candidate from a user of the pipeline into an adversarial validator of its mathematical and algorithmic resilience. By systematically perturbing inputs, omitting criteria, forcing dimensionalities via active threshold parameters, altering expert weights, and simulating degenerate matrix conditions, Module 11 answers the central scientific questions:
- *Why is every individual step of PharmaPolySCOPE necessary?*
- *What happens when pipeline assumptions fail?*
- *Which parameter shifts cause graceful rank adjustments versus catastrophic governance aborts?*
- *Where does the mathematical pipeline maintain interpretability, and where does it become scientifically meaningless?*

---

## 3. Learning Objectives

Upon completion of Module 11, the doctoral candidate will be able to:
1. **Defend Component Indispensability:** Prove mathematically why each pipeline component (RDKit chemistry validation, population standardization, correlation PCA, dynamic $K$, boundary eigengap governance, AHP consistency, metric tensor projection, and Monte Carlo perturbation) cannot be omitted without degrading screening validity.
2. **Differentiate Soft Sensitivity from Hard Governance:** Distinguish parametric ranking shifts (measured via Kendall's $\tau$ and Spearman's $\rho$) from hard algorithmic halts triggered by defensive exceptions (`DegenerateSubspaceBlockedError`, `AHPConsistencyViolationError`, `ZeroVarianceStandardizationError`, `RDKitParseFailureError`, `ProductionFallbackProhibitedError`).
3. **Conduct Real-Time Oral Defense:** Respond instantaneously to adversarial examiner hypotheticals (*"What happens to your top choice if I drop Flory-Huggins?", "Why can't you just use $K=2$ for Indomethacin?", "What if an expert reverses your AHP weights?"*) with exact numerical metrics, geometric visualizations, and clear epistemic boundaries.
4. **Enforce Non-Causal Epistemic Demarcation:** Accurately describe algorithmic responses as computational sensitivities and numerical dependencies without making unsupported claims of physical causality or clinical efficacy.

---

## 4. Counterfactual Philosophy

Counterfactual analysis in PharmaPolySCOPE is strictly defined as:
$$\Delta \mathcal{M} = \mathcal{F}(\mathcal{S}_{\text{pert}}) - \mathcal{F}(\mathcal{S}_{\text{base}})$$
where $\mathcal{F}$ represents the deterministic mathematical screening operator, $\mathcal{S}_{\text{base}}$ is the validated baseline state, and $\mathcal{S}_{\text{pert}}$ is the controlled counterfactual perturbation.

### Core Philosophical Tenets:
1. **The Principle of Invariant Context:** A valid counterfactual perturbs exactly one defined parameter, component, or input vector while holding all other environmental parameters strictly invariant.
2. **The Principle of Algorithmic Transparency:** The software does not attempt to "smooth over" failures. When a mathematical assumption is violated (e.g., zero criterion variance or inconsistent AHP pairwise judgments), the pipeline must raise an explicit, typed exception rather than silently outputting corrupt rankings.
3. **The Principle of Epistemic Humility:** Demonstrating that candidate ranking is stable under perturbation proves **numerical robustness of the decision model**, NOT experimental shelf-life or physical stability of the amorphous solid dispersion.
4. **The Principle of Architectural Demarcation:** The candidate must rigorously separate:
   - *Production-v2 behavior* (unmodified execution through active codebase),
   - *Read-only external analytical reconstruction* (calling lower-level active functions in a scratch harness),
   - *Standalone pedagogical mathematics* (mathematical exploration outside the 4-criterion constraint), and
   - *Hypothetical counterfactuals* that cannot be executed under current production architecture.

---

## 5. Counterfactual Taxonomy

The 20 canonical What-If scenarios established in the Master Architecture Prompt are grouped into seven distinct scientific taxonomy classes:

```
                                  =================================================
                                  MODULE 11 COUNTERFACTUAL TAXONOMY (20 SCENARIOS)
                                  =================================================
                                                          │
          ┌───────────────────────┬───────────────────────┼───────────────────────┬───────────────────────┐
          ▼                       ▼                       ▼                       ▼                       ▼
    [Group A: Dim.]         [Group B: Gov.]         [Group C: AHP]          [Group D: Crit.]        [Group E: Chem.]
   Scenarios 1,2,3,4,20     Scenarios 5, 6          Scenarios 7,12,13       Scenarios 8,9,10,11     Scenarios 15, 16
   • PCA removal            • Eigengap < 0.03       • AHP CR >= 0.08        • Omit HSP              • Alter density
   • K fixed at 2           • Eigengap in [0.03,0.1)• Equal AHP weights     • Omit Flory-Huggins    • Malformed SMILES
   • K = 3                  • Subspace stability    • Inverted weights      • Omit Descriptors
   • Forced full K=4        • Error vs warning      • Preference shift      • Omit Gordon-Taylor
   • New drug with K=4
                                          │                                       │
                                          └───────────────────┬───────────────────┘
                                                              ▼
                                                    [Group F: Degeneracy]     [Group G: Sim.]
                                                    Scenarios 17, 18, 19      Scenario 14
                                                    • Zero-variance criterion • MC disabled
                                                    • Perfect collinearity    • Deterministic-only
                                                    • Identical polymers
```

1. **Group A: Dimensionality & Subspace Representation (Scenarios 1, 2, 3, 4, 20):** Evaluates orthogonal projection vs full space, variance capture thresholds ($\tau_{\text{var}} = 0.95$), and truncation residual norms $\|E\|_F$.
2. **Group B: Subspace Stability & Eigengap Governance (Scenarios 5, 6):** Evaluates spectral boundary separation $\delta_K = \lambda_K - \lambda_{K+1}$, Davis-Kahan rotation susceptibility, and exception triggering (`DegenerateSubspaceBlockedError`).
3. **Group C: Preference Modeling & AHP Weights (Scenarios 7, 12, 13):** Evaluates Saaty transitive consistency ($CR < 0.08$), uniform weighting baseline ($w = 0.25$), and metric tensor distortion $M_K = V_K^T W V_K$.
4. **Group D: Criterion Omission & Physical Completeness (Scenarios 8, 9, 10, 11):** Evaluates pipeline conceptual performance when physical criteria ($s_{\text{HSP}}, s_\chi, s_{\text{desc}}, s_{\text{GT}}$) are omitted, reducing dimensionality from $M=4$ to $M=3$ inside a standalone educational testbed.
5. **Group E: Chemical Input & Descriptors Integrity (Scenarios 15, 16):** Evaluates structural parser fail-safes (`RDKitParseFailureError`, `ProductionFallbackProhibitedError`), molar volume shifts, and molecular weight/density discrepancies.
6. **Group F: Statistical Degeneracy & Pathological Cohorts (Scenarios 17, 18, 19):** Evaluates defensive standardizer guardrails (`ZeroVarianceStandardizationError`), singular correlation matrices $\det(R) \to 0$, and the governance response to identical candidate libraries.
7. **Group G: Stochastic Uncertainty Propagation (Scenario 14):** Evaluates screening fragility when Monte Carlo perturbation is disabled, comparing native deterministic point-estimates with stochastic confidence intervals.

---

## 6. Baseline Cohorts

To ensure total continuity with Modules 08, 09, and 10, Module 11 utilizes the three authoritative production validation cohorts:

| Cohort Identifier | Active Drug | Baseline Dimensions | Baseline Variance | Eigengap $\delta_K$ | Top-Ranked Candidate | Baseline $C_L$ | Primary Role in Module 11 |
|:---|:---|:---:|:---:|:---:|:---|:---:|:---|
| **`IND-001-2026`** | Indomethacin | $5 \times 4 \to K=3$ | $99.9634\%$ | $0.738310$ (`STABLE`) | Soluplus | $0.68643508$ | **Primary Universal Baseline:** Used for Scenarios 1–19. Complex 3D subspace provides rich geometric and governance dynamics. |
| **`DRG-0001`** | Ibuprofen | $5 \times 4 \to K=2$ | $96.1008\%$ | $0.816878$ (`STABLE`) | Eudragit E PO | $0.55026449$ | **Collinear 2D Baseline:** Used for cross-cohort validation in Scenarios 2, 3, 18. Naturally exhibits high criterion correlation. |
| **`ITR-001-2026`** | Itraconazole | $5 \times 4 \to K=2$ | $96.1936\%$ | $0.650372$ (`STABLE`) | Soluplus | $0.61059502$ | **Lipophilic Baseline:** Used for comparative verification in Scenarios 8, 9, 13. |
| **`SYN-ORTHO-001`** | Synthetic Orthogonal Drug | $5 \times 4 \to K=4$ | $100.0000\%$ | $+\infty$ ($K=4$) | Soluplus | Variable | **Synthetic High-Dim Cohort:** Specifically constructed for Scenario 20 to test $K=4$ saturation where criteria are mutually uncorrelated. |

---

## 7. Standard Experiment Record Data Model

Every counterfactual experiment authored in Module 11 must adhere to this standardized 18-field schema:

```yaml
Experiment_Record_Schema:
  id: "CF-XX (e.g., CF-01)"
  title: "Descriptive Scenario Title"
  taxonomy_group: "Group A through G"
  execution_class: "Class A (Direct Live V2) | Class B (Harness) | Class C (Standalone Math) | Class D (Mismatch/Blocked)"
  source_path: "Actual source file in src/asd_mcda/v2/ or Standalone"
  active_target_symbol: "Actual active function, class, or exception name"
  production_v2_executed: "YES | NO"
  scratch_harness_required: "YES | NO"
  scientific_objective: "Exact theoretical hypothesis being tested"
  baseline_cohort: "IND-001-2026 | DRG-0001 | ITR-001-2026 | SYN-ORTHO-001"
  perturbation_specification:
    target_component: "Exact pipeline component perturbed"
    perturbation_mechanism: "Parameter adjustment, matrix replacement, or omission"
    perturbation_magnitude: "Quantitative scalar or structural change"
  fixed_variables: "Explicit inventory of invariant parameters"
  recomputed_variables: "Explicit inventory of downstream recomputed objects"
  pipeline_entry_point: "Expected entry point function"
  pipeline_stopping_point: "Expected exit function or halting exception"
  expected_governance_verdict: "PASS | WARNING | BLOCKED"
  expected_exception_class: "None | ExceptionClassName"
  observable_outputs: "List of observable metrics (delta_CL, rank_shifts, etc.)"
  inadmissible_conclusions: "Explicit list of prohibited causal or clinical claims"
  viva_attack_and_defense:
    examiner_question: "Hostile examiner attack question"
    candidate_defense: "Definitive 5-part model defense response"
```

---

## 8. The 20 Canonical What-If Experiments (Source-Locked Specifications)

### 8.1 Master Summary Table

| ID | What-If Scenario | Perturbed Component | Baseline Condition | Counterfactual Condition | Execution Class | Production V2 Executed? | Governance Trigger |
|:---:|:---|:---|:---|:---|:---:|:---:|:---|
| **CF-01** | PCA Removed | Dimensional Reduction | PCA active ($K=3$, $M_K = V_K^T W V_K$) | Raw standardized space ($K=4, V=I_4, M_4=W$) | **Class B** | NO (External harness) | None (Full space) |
| **CF-02** | $K$ Fixed at 2 | Subspace Dimension | Dynamic $K=3$ (`var_thresh=0.95`, $99.96\%$) | Modulated `variance_threshold = 0.80` ($81.47\%$) | **Class A** | YES | None (v1.5 legacy mode) |
| **CF-03** | $K$ Becomes 3 | Subspace Dimension | Ibuprofen baseline $K=2$ (`var_thresh=0.95`, $96.10\%$) | Modulated `variance_threshold = 0.99` ($99.93\%$) | **Class A** | YES | None (Retains PC3) |
| **CF-04** | Forced Full $K=4$ | Subspace Dimension | Indomethacin dynamic $K=3$ | Modulated `variance_threshold = 0.9999` ($100.00\%$) | **Class A** | YES | $\delta_4 = +\infty$ (`STABLE` by contract) |
| **CF-05** | Eigengap $\delta_K < 0.03$ | Spectral Gap | $\delta_3 = 0.738310$ (`STABLE`) | Synthetic matrix with $\lambda_3 - \lambda_4 = 0.015$ | **Class B** | YES (via test harness) | `DegenerateSubspaceBlockedError` (`BLOCKED`) |
| **CF-06** | Eigengap in $[0.03, 0.10)$ | Spectral Gap | $\delta_3 = 0.738310$ (`STABLE`) | Synthetic matrix with $\delta_K = 0.065$ | **Class B** | YES (via test harness) | `WARNING` state logged |
| **CF-07** | AHP $CR \ge 0.08$ | Preference Consistency | Canonical $CR = 0.049415$ (`ACCEPT`) | Intransitive AHP matrix ($CR = 0.124$) | **Class A** | YES | `AHPConsistencyViolationError` (`BLOCKED`) |
| **CF-08** | HSP Omitted | Criteria Set | 4 criteria active ($M=4$) | HSP omitted ($M=3$: $\chi, \text{desc}, \text{GT}$) | **Class C** | NO (Standalone math) | None (Standalone testbed) |
| **CF-09** | Flory-Huggins Omitted | Criteria Set | 4 criteria active ($M=4$) | $\chi$ omitted ($M=3$: $\text{HSP}, \text{desc}, \text{GT}$) | **Class C** | NO (Standalone math) | None (Standalone testbed) |
| **CF-10** | Descriptors Omitted | Criteria Set | 4 criteria active ($M=4$) | $s_{\text{desc}}$ omitted ($M=3$: $\text{HSP}, \chi, \text{GT}$) | **Class C** | NO (Standalone math) | None (Standalone testbed) |
| **CF-11** | Gordon-Taylor Omitted | Criteria Set | 4 criteria active ($M=4$) | $s_{\text{GT}}$ omitted ($M=3$: $\text{HSP}, \chi, \text{desc}$) | **Class C** | NO (Standalone math) | None (Standalone testbed) |
| **CF-12** | Equal AHP Weights | Criteria Weighting | Canonical weights $[0.41, 0.32, 0.09, 0.18]$ | Uniform comparison matrix $A = \mathbf{1}_{4 \times 4}$ | **Class A** | YES | None ($CR = 0.0$) |
| **CF-13** | Inverted AHP Weights | Criteria Weighting | Canonical weights ($s_{\text{HSP}}$ dominant) | Inverted priority matrix ($s_{\text{GT}}$ dominant) | **Class A** | YES | None (if $CR < 0.08$) |
| **CF-14** | Monte Carlo Disabled | Uncertainty Simulation | $N=10,000$ stochastic replicates | Direct `VariableKEngine.evaluate()` execution | **Class A** | YES | None (Native deterministic mode) |
| **CF-15** | Density Perturbed | Molecular Descriptors | True drug density $\rho = 1.37 \text{ g/cm}^3$ | Scaled density $\pm 20\%$ | **Class A** | YES | None (Smooth parameter shift) |
| **CF-16** | SMILES Corrupted | Chemical Ingestion | Valid Indomethacin SMILES | Corrupted SMILES / Syntax parsing error | **Class A** | YES | `RDKitParseFailureError` (`BLOCKED`) |
| **CF-17** | Zero Variance Criterion | Statistical Distribution | $\sigma_j > 0.05$ across all criteria | Invariant column ($S_{i, j} = 0.50$ for all $i$) | **Class A** | YES | `ZeroVarianceStandardizationError` (`BLOCKED`) |
| **CF-18** | Perfect Collinearity | Matrix Correlation | Pairwise correlations $r \in [-0.6, 0.8]$ | Synthetic matrix with $r_{jk} = 0.9999$ | **Class A** | YES | None (Dynamic $K \to 1$) |
| **CF-19** | Identical Polymer Scores | Candidate Separation | Differentiated polymers | All 5 polymers identical ($S_i = S_j$) | **Class D** | YES | `ZeroVarianceStandardizationError` (`BLOCKED`) |
| **CF-20** | New Drug Requires $K=4$ | Subspace Dimensionality | Indomethacin ($K=3$), Ibuprofen ($K=2$) | Orthogonal matrix ($R \approx I_4, \lambda_j \approx 1.0$) | **Class A** | YES | None (Dynamic $K=4$, $\delta_4=+\infty$) |

---

### 8.2 Detailed Scenario-by-Scenario Source-Locked Dossiers

#### CF-01: PCA Removed (Weighted Standardized Space)
- **Execution Class:** Class B (External Analytical Harness).
- **Source Path:** `src/asd_mcda/v2/metrics.py`, `standardization.py`.
- **Active Target Symbols:** `compute_distances_and_closeness()`, `standardize_cohort()`.
- **Production V2 Executed:** NO (`VariableKEngine` has no `bypass_pca` flag; evaluated via read-only harness).
- **Scratch Harness Required:** YES (`scratch/run_cf_harness.py`).
- **Pipeline Entry / Stopping Point:** Enters at `standardize_cohort()`; bypasses `pca.py`; evaluates distances via $V=I_4, M_4=W$.
- **Perturbation Mechanism:** Setting $V_K = I_4$ and $M_K = \operatorname{diag}(w_{\text{phys}})$.
- **Expected Governance Verdict:** `PASS` (Runs cleanly in 4D standardized space).
- **Expected Exception:** None.
- **Observable Outputs:** Kendall's $\tau$, Spearman's $\rho$, $\Delta C_L$ vector, candidate rank shifts.
- **Inadmissible Conclusions:** Prohibited from claiming PCA removal "proves" PCA is or is not biologically necessary. It strictly evaluates sensitivity to criteria collinearity.

#### CF-02: $K$ Fixed at 2 on Indomethacin (Truncation Sensitivity)
- **Execution Class:** Class A (Direct Live V2 Execution).
- **Source Path:** `src/asd_mcda/v2/engine.py`, `pca.py`.
- **Active Target Symbols:** `VariableKEngine.evaluate(..., variance_threshold=0.80)`.
- **Production V2 Executed:** YES.
- **Scratch Harness Required:** NO.
- **Pipeline Entry / Stopping Point:** Full pipeline execution (Steps 1–9); completes normally.
- **Perturbation Mechanism:** Setting active parameter `variance_threshold = 0.80` (since PC1-2 = $81.47\% \ge 80\%$, selecting $K=2$).
- **Expected Governance Verdict:** `PASS` (Simulates legacy v1.5 fixed $K=2$ behavior).
- **Expected Exception:** None.
- **Observable Outputs:** Frobenius truncation residual $\|E\|_F$, Kendall's $\tau$, rank shifts.
- **Inadmissible Conclusions:** Prohibited from claiming $K=2$ is "wrong"; it is a dimensionally truncated model capturing $81.47\%$ variance.

#### CF-03: $K$ Becomes 3 on Ibuprofen (Over-Retention Sensitivity)
- **Execution Class:** Class A (Direct Live V2 Execution).
- **Source Path:** `src/asd_mcda/v2/engine.py`, `pca.py`.
- **Active Target Symbols:** `VariableKEngine.evaluate(..., variance_threshold=0.99)`.
- **Production V2 Executed:** YES.
- **Scratch Harness Required:** NO.
- **Pipeline Entry / Stopping Point:** Full pipeline execution (Steps 1–9); completes normally.
- **Perturbation Mechanism:** Setting active parameter `variance_threshold = 0.99` on Ibuprofen cohort (`DRG-0001`), where PC1-2 ($96.10\%$) is insufficient, forcing selection of $K=3$ ($99.93\%$).
- **Expected Governance Verdict:** `PASS`.
- **Expected Exception:** None.
- **Observable Outputs:** Eigengap shift $\delta_3 = \lambda_3 - \lambda_4$, metric tensor condition number $\kappa(M_3)$, rank shifts.
- **Inadmissible Conclusions:** Prohibited from claiming $K=3$ improves formulation fidelity; it incorporates near-zero variance ($3.83\%$).

#### CF-04: Forced Full-Dimensional PCA Retention ($K=4$ on Indomethacin)
- **Execution Class:** Class A (Direct Live V2 Execution).
- **Source Path:** `src/asd_mcda/v2/engine.py`, `pca.py`, `stability.py`.
- **Active Target Symbols:** `VariableKEngine.evaluate(..., variance_threshold=0.9999)`.
- **Production V2 Executed:** YES.
- **Scratch Harness Required:** NO.
- **Pipeline Entry / Stopping Point:** Full pipeline execution (Steps 1–9); completes normally.
- **Perturbation Mechanism:** Setting active parameter `variance_threshold = 0.9999` on Indomethacin cohort, forcing retention of all 4 PCs ($100.00\%$ variance).
- **Expected Governance Verdict:** `PASS` (In `stability.py:70`, when $K=p=4$, $\delta_4 = +\infty$ and status is `STABLE` by contract).
- **Expected Exception:** None.
- **Observable Outputs:** Measure whether full-dimensional retention changes metric conditioning $\kappa(M_4)$ and rank ordering; do not predetermine the direction of change.
- **Inadmissible Conclusions:** Prohibited from claiming an eigengap collapse to zero (governance contract in `stability.py` defines $\delta_K = +\infty$ when $K=p$).

#### CF-05: Subspace Instability Governance (Boundary Eigengap $\delta_K < 0.03$)
- **Execution Class:** Class B (External Analytical / Test Harness).
- **Source Path:** `src/asd_mcda/v2/stability.py`, `exceptions.py`.
- **Active Target Symbols:** `evaluate_subspace_stability()`, `DegenerateSubspaceBlockedError`.
- **Production V2 Executed:** YES (via test harness).
- **Scratch Harness Required:** YES (`scratch/run_cf_harness.py`).
- **Pipeline Entry / Stopping Point:** Enters `evaluate_subspace_stability()`; halts immediately at Step 3.
- **Perturbation Mechanism:** Injecting an eigenvalue spectrum with degenerate boundary gap: $\lambda_3 - \lambda_4 = 0.015 < 0.03$.
- **Expected Governance Verdict:** `BLOCKED`.
- **Expected Exception:** `DegenerateSubspaceBlockedError`.
- **Observable Outputs:** Intercepted exception class, boundary gap magnitude, blocked status string.
- **Inadmissible Conclusions:** Prohibited from claiming eigengap block proves physical formulation instability; it diagnoses numerical orientation instability.

#### CF-06: Subspace Instability Warning (Boundary Eigengap in $[0.03, 0.10)$)
- **Execution Class:** Class B (External Analytical / Test Harness).
- **Source Path:** `src/asd_mcda/v2/stability.py`.
- **Active Target Symbols:** `evaluate_subspace_stability()`, `StabilityRecord`.
- **Production V2 Executed:** YES (via test harness).
- **Scratch Harness Required:** YES (`scratch/run_cf_harness.py`).
- **Pipeline Entry / Stopping Point:** Enters `evaluate_subspace_stability()`; returns warning record without raising.
- **Perturbation Mechanism:** Injecting an eigenvalue spectrum with gap in warning band: $\delta_K = 0.065 \in [0.03, 0.10)$.
- **Expected Governance Verdict:** `WARNING`.
- **Expected Exception:** None (Non-raising telemetry state).
- **Observable Outputs:** `stability_status == 'WARNING'`, non-empty `warning_message`.
- **Inadmissible Conclusions:** Prohibited from treating warning state as an error or blocking event.

#### CF-07: AHP Transitive Consistency Violation ($CR \ge 0.08$)
- **Execution Class:** Class A (Direct Live V2 Execution).
- **Source Path:** `src/asd_mcda/v2/ahp.py`, `engine.py`, `exceptions.py`.
- **Active Target Symbols:** `solve_ahp_preference()`, `AHPConsistencyViolationError`.
- **Production V2 Executed:** YES.
- **Scratch Harness Required:** NO.
- **Pipeline Entry / Stopping Point:** Enters `VariableKEngine.evaluate()`; halts at Step 5 (`solve_ahp_preference()`).
- **Perturbation Mechanism:** Supplying an internally contradictory pairwise comparison matrix $A$ yielding $CR = 0.124 \ge 0.08$.
- **Expected Governance Verdict:** `BLOCKED`.
- **Expected Exception:** `AHPConsistencyViolationError`.
- **Observable Outputs:** Intercepted exception class, evaluated $CR$ value, governance blocking log.
- **Inadmissible Conclusions:** Prohibited from claiming $CR < 0.08$ proves scientific correctness of weights; it evaluates only mathematical transitivity.

#### CF-08: Omission of Hansen Solubility Parameter ($s_{\text{HSP}}$ Omitted)
- **Execution Class:** Class C (Standalone Mathematical / Pedagogical Counterfactual).
- **Source Path:** Standalone Educational Testbed (`scratch/standalone_3crit_testbed.py`).
- **Active Target Symbols:** Generic NumPy/SciPy linear algebra ($RI_3 = 0.58$).
- **Production V2 Executed:** NO (Active production v2 enforces $p=4$ and raises `StandardizationError` if $p \ne 4$).
- **Scratch Harness Required:** YES (Clearly labeled educational script).
- **Mandatory Statement:** *"This experiment probes the conceptual consequence of criterion omission; it does not modify or execute the production v2 four-criterion methodology."*
- **Perturbation Mechanism:** Removing column 0 ($s_{\text{HSP}}$), evaluating $5 \times 3$ matrix with criteria $(\chi, \text{desc}, \text{GT})$ and normalized $3 \times 3$ AHP weights.
- **Expected Governance Verdict:** N/A (Evaluated outside production engine).
- **Expected Exception:** None.
- **Observable Outputs:** Record whether Soluplus top rank shifts, compute Kendall's $\tau$ vs 4-criterion baseline.
- **Inadmissible Conclusions:** Prohibited from claiming the production v2 engine supports 3 criteria.

#### CF-09: Omission of Flory-Huggins Interaction Parameter ($s_\chi$ Omitted)
- **Execution Class:** Class C (Standalone Mathematical / Pedagogical Counterfactual).
- **Source Path:** Standalone Educational Testbed (`scratch/standalone_3crit_testbed.py`).
- **Active Target Symbols:** Generic NumPy/SciPy linear algebra ($RI_3 = 0.58$).
- **Production V2 Executed:** NO (Active production v2 enforces $p=4$).
- **Scratch Harness Required:** YES.
- **Mandatory Statement:** *"This experiment probes the conceptual consequence of criterion omission; it does not modify or execute the production v2 four-criterion methodology."*
- **Perturbation Mechanism:** Removing column 1 ($s_\chi$), evaluating $5 \times 3$ matrix with criteria $(\text{HSP}, \text{desc}, \text{GT})$.
- **Expected Governance Verdict:** N/A.
- **Expected Exception:** None.
- **Observable Outputs:** Record ranking shifts and correlation when entropic/enthalpic lattice interaction is excluded.
- **Inadmissible Conclusions:** Prohibited from claiming physical miscibility is fully represented without $\chi$.

#### CF-10: Omission of Molecular Descriptor Compatibility ($s_{\text{desc}}$ Omitted)
- **Execution Class:** Class C (Standalone Mathematical / Pedagogical Counterfactual).
- **Source Path:** Standalone Educational Testbed (`scratch/standalone_3crit_testbed.py`).
- **Active Target Symbols:** Generic NumPy/SciPy linear algebra ($RI_3 = 0.58$).
- **Production V2 Executed:** NO (Active production v2 enforces $p=4$).
- **Scratch Harness Required:** YES.
- **Mandatory Statement:** *"This experiment probes the conceptual consequence of criterion omission; it does not modify or execute the production v2 four-criterion methodology."*
- **Perturbation Mechanism:** Removing column 2 ($s_{\text{desc}}$), evaluating $5 \times 3$ matrix with criteria $(\text{HSP}, \chi, \text{GT})$.
- **Expected Governance Verdict:** N/A.
- **Expected Exception:** None.
- **Observable Outputs:** Record whether ranking changes when 2D molecular feature matching is bypassed.
- **Inadmissible Conclusions:** Prohibited from claiming production engine can run without descriptors.

#### CF-11: Omission of Gordon-Taylor Glass Transition Metric ($s_{\text{GT}}$ Omitted)
- **Execution Class:** Class C (Standalone Mathematical / Pedagogical Counterfactual).
- **Source Path:** Standalone Educational Testbed (`scratch/standalone_3crit_testbed.py`).
- **Active Target Symbols:** Generic NumPy/SciPy linear algebra ($RI_3 = 0.58$).
- **Production V2 Executed:** NO (Active production v2 enforces $p=4$).
- **Scratch Harness Required:** YES.
- **Mandatory Statement:** *"This experiment probes the conceptual consequence of criterion omission; it does not modify or execute the production v2 four-criterion methodology."*
- **Perturbation Mechanism:** Removing column 3 ($s_{\text{GT}}$), evaluating $5 \times 3$ matrix with criteria $(\text{HSP}, \chi, \text{desc})$.
- **Expected Governance Verdict:** N/A.
- **Expected Exception:** None.
- **Observable Outputs:** Record ranking shifts when kinetic anti-plasticization / $T_g$ elevation is excluded.
- **Inadmissible Conclusions:** Prohibited from claiming kinetic stability can be inferred without $T_g$ data.

#### CF-12: Uniform Physical Criteria Weighting (Equal AHP Weights)
- **Execution Class:** Class A (Direct Live V2 Execution).
- **Source Path:** `src/asd_mcda/v2/ahp.py`, `engine.py`.
- **Active Target Symbols:** `VariableKEngine.evaluate(..., pairwise_matrix=np.ones((4,4)))`.
- **Production V2 Executed:** YES.
- **Scratch Harness Required:** NO.
- **Pipeline Entry / Stopping Point:** Full pipeline execution (Steps 1–9); completes normally.
- **Perturbation Mechanism:** Passing $A = \mathbf{1}_{4 \times 4}$ (all pairwise judgments equal to 1), yielding $w_{\text{phys}} = [0.25, 0.25, 0.25, 0.25]$ and $CR = 0.0$.
- **Expected Governance Verdict:** `PASS` ($CR < 0.08$).
- **Expected Exception:** None.
- **Observable Outputs:** Metric tensor $M_K = 0.25 I_K$, closeness score shifts $\|\Delta C_L\|$, Kendall's $\tau$.
- **Inadmissible Conclusions:** Prohibited from claiming equal weighting is "objective"; it represents an arbitrary uniform prior.

#### CF-13: Inverted Priority Weighting (Kinetic Dominance)
- **Execution Class:** Class A (Direct Live V2 Execution).
- **Source Path:** `src/asd_mcda/v2/ahp.py`, `engine.py`.
- **Active Target Symbols:** `VariableKEngine.evaluate(..., pairwise_matrix=inverted_A)`.
- **Production V2 Executed:** YES.
- **Scratch Harness Required:** NO.
- **Pipeline Entry / Stopping Point:** Full pipeline execution (Steps 1–9); completes normally.
- **Perturbation Mechanism:** Supplying a consistent pairwise matrix where Gordon-Taylor ($s_{\text{GT}}$) is heavily prioritized over HSP ($w \approx [0.10, 0.10, 0.20, 0.60]$, $CR < 0.08$).
- **Expected Governance Verdict:** `PASS`.
- **Expected Exception:** None.
- **Observable Outputs:** Test whether high-$T_g$ polymers (e.g. PVP K30, PVP-VA64) overtake Soluplus; record rank shifts.
- **Inadmissible Conclusions:** Prohibited from claiming inverted weights are "incorrect"; they reflect an alternative formulation philosophy.

#### CF-14: Deterministic Point-Estimate Evaluation (Monte Carlo Disabled)
- **Execution Class:** Class A (Direct Live V2 Execution).
- **Source Path:** `src/asd_mcda/v2/engine.py`.
- **Active Target Symbols:** `VariableKEngine.evaluate()`.
- **Production V2 Executed:** YES.
- **Scratch Harness Required:** NO.
- **Pipeline Entry / Stopping Point:** Enters and executes deterministic pipeline directly without invoking `MonteCarloEngine.run()`.
- **Perturbation Mechanism:** Operating in native deterministic mode without stochastic score/AHP perturbation.
- **Expected Governance Verdict:** `PASS`.
- **Expected Exception:** None.
- **Observable Outputs:** Absence of $p_{\text{top1}}$ distribution; point-estimate $C_L$ vs stochastic mean $C_L$.
- **Inadmissible Conclusions:** Prohibited from claiming deterministic rank 1 guarantees robustness; stochastic fragility is unobservable without Monte Carlo.

#### CF-15: Parametric Molecular Density Perturbation ($\pm 20\%$)
- **Execution Class:** Class A (Direct Live V2 Execution).
- **Source Path:** `src/asd_mcda/v2/engine.py`, `chemistry.py`.
- **Active Target Symbols:** `VariableKEngine.evaluate()`.
- **Production V2 Executed:** YES.
- **Scratch Harness Required:** NO.
- **Pipeline Entry / Stopping Point:** Ingestion $\to$ recalculate molar volume $V_m = MW / \rho \to$ recalculate $S \to$ execute pipeline.
- **Perturbation Mechanism:** Scaling drug density parameter $\rho$ by $+20\%$ and $-20\%$.
- **Expected Governance Verdict:** `PASS` (Smooth parametric shift).
- **Expected Exception:** None.
- **Observable Outputs:** Shift in molar volume $\Delta V_m$, shifts in $s_{\text{HSP}}$, delta in final $C_L$, rank stability.
- **Inadmissible Conclusions:** Prohibited from claiming density errors are catastrophic without testing sensitivity magnitude.

#### CF-16: Chemical Structure Parsing Failure (Malformed SMILES)
- **Execution Class:** Class A (Direct Live V2 Execution).
- **Source Path:** `src/asd_mcda/v2/chemistry.py`, `engine.py`, `exceptions.py`.
- **Active Target Symbols:** `validate_chemical_structure()`, `RDKitParseFailureError`.
- **Production V2 Executed:** YES.
- **Scratch Harness Required:** NO.
- **Pipeline Entry / Stopping Point:** Enters `VariableKEngine.evaluate()`; halts at pre-flight chemistry check (Step 0).
- **Perturbation Mechanism:** Supplying an invalid/unparseable SMILES string (`"CC(=O)O[INVALID]"`) in `drug_data["canonical_smiles"]`.
- **Expected Governance Verdict:** `BLOCKED`.
- **Expected Exception:** `RDKitParseFailureError` (subclass of `InvalidSmilesError` and `ChemicalStructureError`).
- **Explicit Disambiguation:** `ProductionFallbackProhibitedError` is reserved for unauthorized fallback descriptor dictionaries (`fallback_used=True`); syntax parsing failure raises `RDKitParseFailureError`.
- **Inadmissible Conclusions:** Prohibited from claiming the engine falls back to heuristic constants.

#### CF-17: Degenerate Cohort Variance (Zero Variance Column)
- **Execution Class:** Class A (Direct Live V2 Execution).
- **Source Path:** `src/asd_mcda/v2/standardization.py`, `engine.py`, `exceptions.py`.
- **Active Target Symbols:** `standardize_cohort()`, `ZeroVarianceStandardizationError`.
- **Production V2 Executed:** YES.
- **Scratch Harness Required:** NO.
- **Pipeline Entry / Stopping Point:** Enters `VariableKEngine.evaluate()`; halts immediately at Step 1 (`standardize_cohort()`).
- **Perturbation Mechanism:** Setting column $j=2$ ($s_{\text{desc}}$) to invariant constant $0.50$ across all 5 candidate polymers, yielding $\sigma_j = 0.0$.
- **Expected Governance Verdict:** `BLOCKED`.
- **Expected Exception:** `ZeroVarianceStandardizationError`.
- **Observable Outputs:** Intercepted exception class, column index identifying degenerate criterion.
- **Inadmissible Conclusions:** Prohibited from claiming the pipeline silently ignores zero-variance criteria.

#### CF-18: High Criteria Collinearity (Extreme Redundancy)
- **Execution Class:** Class A (Direct Live V2 Execution).
- **Source Path:** `src/asd_mcda/v2/engine.py`, `pca.py`.
- **Active Target Symbols:** `VariableKEngine.evaluate()`, `decompose_spectral()`.
- **Production V2 Executed:** YES.
- **Scratch Harness Required:** NO.
- **Pipeline Entry / Stopping Point:** Full pipeline execution (Steps 1–9); completes normally.
- **Perturbation Mechanism:** Injecting a synthetic score matrix where all 4 criteria have pairwise correlation $r_{jk} > 0.99$.
- **Expected Governance Verdict:** `PASS`.
- **Expected Exception:** None.
- **Observable Outputs:** Dynamic $K$ collapses to $K=1$ (since $\lambda_1 \approx 3.96 \ge 95\%$ variance), preventing multicollinearity distortion.
- **Inadmissible Conclusions:** Prohibited from claiming correlation PCA fails under high collinearity; collapsing to $K=1$ is PCA's intended protective behavior.

#### CF-19: Identical Polymer Candidates (Cohort Indistinguishability)
- **Execution Class:** Class D (Execution Claim Mismatch — Active Pipeline Halts at Step 1).
- **Source Path:** `src/asd_mcda/v2/standardization.py`, `exceptions.py`.
- **Active Target Symbols:** `standardize_cohort()`, `ZeroVarianceStandardizationError`.
- **Production V2 Executed:** YES.
- **Scratch Harness Required:** NO.
- **Pipeline Entry / Stopping Point:** Enters `VariableKEngine.evaluate()`; halts at Step 1 (`standardize_cohort()`).
- **Perturbation Mechanism:** Supplying a decision matrix where all 5 polymers have identical score rows ($S_i = S_k$ for all $i, k$).
- **ACTIVE V2 OUTCOME:**
  `BLOCKED AT STANDARDIZATION` via `ZeroVarianceStandardizationError`.
- **THEORETICAL NOTE:**
  *"For an already-standardized identical pair under an abstract symmetric distance construction, one may construct a $C_L = 0.50$ mathematical limit, but this is NOT the result of the active v2 pipeline for identical candidate rows."*
- **Inadmissible Conclusions:** Prohibited from describing $C_L = 0.50$ as a production result. The active engine halts because cohort variance is zero across all criteria.

#### CF-20: Uncorrelated Orthogonal Drug Cohort ($K=4$ Subspace Saturation)
- **Execution Class:** Class A (Direct Live V2 Execution).
- **Source Path:** `src/asd_mcda/v2/engine.py`, `pca.py`, `stability.py`.
- **Active Target Symbols:** `VariableKEngine.evaluate()`, `decompose_spectral()`.
- **Production V2 Executed:** YES.
- **Scratch Harness Required:** NO.
- **Pipeline Entry / Stopping Point:** Full pipeline execution (Steps 1–9); completes normally.
- **Perturbation Mechanism:** Supplying a candidate cohort where criteria are mutually orthogonal ($R \approx I_4, \lambda_j \approx 1.0$), requiring all 4 PCs to satisfy $95\%$ variance.
- **Expected Governance Verdict:** `PASS` (Dynamic $K=4$, CumVar $= 100\%$, $\delta_4 = +\infty$).
- **Expected Exception:** None.
- **Observable Outputs:** Dynamic retention of $K=4$, coincidence of PCA subspace with ambient 4D space.
- **Inadmissible Conclusions:** Prohibited from claiming $K=4$ indicates pipeline failure; it indicates the criteria are completely non-redundant.

---

## 9. Runtime vs Analytical Execution Boundaries

To preserve complete codebase integrity, experiments are strictly partitioned into four audited execution classes:

```
                                  =================================================
                                  EXECUTION BOUNDARIES (NO PRODUCTION MODIFICATION)
                                  =================================================
                                                          │
          ┌───────────────────────┬───────────────────────┴───────────────────────┬───────────────────────┐
          ▼                       ▼                                               ▼                       ▼
    [Class A: Live V2]      [Class B: Harness]                              [Class C: Standalone]   [Class D: Step 1 Block]
    12 Scenarios            3 Scenarios                                     4 Scenarios             1 Scenario
    CF-02, CF-03, CF-04,    CF-01 (PCA bypassed),                           CF-08, CF-09,           CF-19 (Identical rows)
    CF-07, CF-12, CF-13,    CF-05 (Eigengap < 0.03),                        CF-10, CF-11            • Halts at Step 1 via
    CF-14, CF-15, CF-16,    CF-06 (Eigengap warning)                        • Standalone 3-crit     ZeroVarianceStandardization-
    CF-17, CF-18, CF-20     • Lower-level active v2                           testbed with RI_3     Error
    • Unmodified calls to     calls with synthetic                            • p=4 enforced in v2  • CL=0.50 is purely
      VariableKEngine         boundary vectors                                • Zero v2 execution     theoretical
```

1. **Class A (Direct Live V2 Execution — 12 Scenarios):**  
   Executed directly through standard calls to `VariableKEngine.evaluate()` or `MonteCarloEngine.run()` without any code modifications. Parameters are modulated strictly through supported interfaces (`variance_threshold`, `pairwise_matrix`, `drug_data`).
2. **Class B (External Analytical / Test Harness — 3 Scenarios):**  
   Executed using read-only test scripts in `scratch/` that call unmodified active sub-functions (`standardize_cohort`, `decompose_spectral`, `evaluate_subspace_stability`, `compute_distances_and_closeness`) with controlled boundary matrices.
3. **Class C (Standalone Mathematical / Pedagogical Counterfactual — 4 Scenarios):**  
   Evaluated in a dedicated educational script outside production v2. Because all active v2 modules strictly enforce $p=4$, criteria omission cannot enter production code. Standalone linear algebra equations using $RI_3 = 0.58$ are employed.
4. **Class D (Execution Claim Mismatch — Pipeline Halts at Step 1 — 1 Scenario):**  
   CF-19 proves that identical candidate scores trigger `ZeroVarianceStandardizationError` at Step 1. The theoretical $C_L = 0.50$ asymptote is documented as an unstandardized limit, but the active pipeline halts.

---

## 10. Quantitative Output Metrics

For every counterfactual experiment, the following standardized quantitative metrics must be computed and reported:

1. **Dimensionality & Subspace Metrics:**
   - Dimension change: $\Delta K = K_{\text{CF}} - K_{\text{base}}$
   - Cumulative variance change: $\Delta \text{cumVar} = \text{cumVar}_{\text{CF}} - \text{cumVar}_{\text{base}}$
   - Truncation residual Frobenius norm: $\|E\|_F = \|Z - Z V_K V_K^T\|_F$
2. **Spectral & Stability Metrics:**
   - Eigenvalue spectrum shift: $\Delta \lambda_k = \lambda_{k, \text{CF}} - \lambda_{k, \text{base}}$
   - Eigengap delta: $\Delta \delta_K = \delta_{K, \text{CF}} - \delta_{K, \text{base}}$
   - Stability state transition: $\text{State}_{\text{base}} \to \text{State}_{\text{CF}}$
3. **Metric Tensor Metrics:**
   - Metric tensor Frobenius distortion: $\|\Delta M_K\|_F = \|M_{K, \text{CF}} - M_{K, \text{base}}\|_F$
   - Condition number shift: $\Delta \kappa = \kappa(M_{K, \text{CF}}) - \kappa(M_{K, \text{base}})$
4. **Distance & Closeness Metrics:**
   - Ideal distance shift vector: $\Delta D^+ = D^+_{\text{CF}} - D^+_{\text{base}}$
   - Anti-ideal distance shift vector: $\Delta D^- = D^-_{\text{CF}} - D^-_{\text{base}}$
   - Relative closeness shift vector: $\Delta C_L = C_{L, \text{CF}} - C_{L, \text{base}}$
   - Mean Absolute Closeness Error: $\text{MACE} = \frac{1}{N} \sum_{i=1}^N |C_{L, i, \text{CF}} - C_{L, i, \text{base}}|$
5. **Ranking Concordance Metrics:**
   - Kendall's rank correlation coefficient $\tau \in [-1.0, 1.0]$:
     $$\tau = \frac{P - Q}{\frac{1}{2} N (N - 1)}$$
   - Spearman's rank correlation coefficient $\rho \in [-1.0, 1.0]$:
     $$\rho = 1 - \frac{6 \sum d_i^2}{N(N^2 - 1)}$$
   - Top-1 candidate preservation: $\mathbb{I}(\text{Top-1}_{\text{CF}} == \text{Top-1}_{\text{base}}) \in \{\text{TRUE}, \text{FALSE}\}$
   - Maximum rank displacement: $\Delta r_{\max} = \max_i |\text{rank}_{i, \text{CF}} - \text{rank}_{i, \text{base}}|$
6. **Governance Telemetry:**
   - Execution status: `COMPLETED` | `WARNING_ISSUED` | `EXCEPTION_BLOCKED`
   - Specific exception class intercepted (if blocked).

---

## 11. Interpretation Rules

The authoring of Module 11 must strictly abide by four epistemological interpretation rules:

1. **Rule 1 (The Numerical Demarcation Rule):**  
   A change in $C_L$ indicates **mathematical sensitivity of the multi-criteria geometry**. It does NOT indicate that the physical polymer-drug formulation will fail in an extruder or precipitate in a dissolution vessel.
2. **Rule 2 (The Governance Isolation Rule):**  
   When a counterfactual triggers a blocking exception (`BLOCKED`), this is a demonstration of **effective input and stability governance**. It proves the software refuses to emit unvalidated predictions when its formal boundary assumptions are violated.
3. **Rule 3 (The Ranking vs Distance Invariance Rule):**  
   If $C_L$ values change by $\pm 0.05$ but Kendall's $\tau = 1.000$, the candidate ranking is **topologically invariant** to the perturbation. The candidate must explicitly distinguish magnitude shifts from ordering reversals.
4. **Rule 4 (The Multicollinearity Correction Rule):**  
   When comparing PCA-active (SP-PRP-TOPSIS) against PCA-removed (CF-01), any ranking divergence demonstrates that **correlated criteria double-count physical dimensions**. The candidate must defend PCA as an anti-collinearity measure, not a physical interaction discovery tool.

---

## 12. Prohibited Claims & Epistemic Guardrails

The following 10 claims are strictly prohibited from appearing in any Module 11 teaching document:

1. **NO Causal Claims:** Do NOT state that counterfactual ranking changes "prove the causal mechanism" of drug-polymer binding.
2. **NO Clinical Extrapolations:** Do NOT claim that a polymer maintaining top rank under perturbation "guarantees clinical bio-availability" or "in-vivo shelf-life".
3. **NO Thermodynamic Proof Claims:** Do NOT claim that AHP consistency ($CR < 0.08$) "proves the thermodynamic truth" of criteria weights.
4. **NO Stability Conflation:** Do NOT conflate numerical subspace stability (eigengap $\delta_K \ge 0.10$) with physical amorphous solid dispersion stability (resistance to recrystallization).
5. **NO K-Means Terminology:** Do NOT refer to $K$ as "clusters", "clustering", or "K-Means". $K$ is retained orthogonal principal components.
6. **NO Euclidean TOPSIS Default:** Do NOT describe distance calculations as standard Euclidean distance; they are oblique quadratic forms governed by metric tensor $M_K = V_K^T W V_K$.
7. **NO "Physically Impossible" MC Labeling:** Do NOT frame blocked Monte Carlo replicates as "physically impossible formulations"; they are governance violations of mathematical consistency.
8. **NO Invented File Paths:** Do NOT cite fictional paths (e.g. `docs/module_X.md`). Cite real source modules in `src/asd_mcda/v2/`.
9. **NO Arbitrary Parameter Tweaking:** Do NOT modify the baseline methodology to "fix" an inconvenient counterfactual result.
10. **NO Unanchored Whiteboard Numbers:** All whiteboard drill numbers must be clearly demarcated as `[PEDAGOGICAL EXAMPLE — NOT PRODUCTION DATA]` or `[PRODUCTION DATA — EXACT VERIFICATION]`.

---

## 13. Reproducibility Protocol

To ensure 100% computational replicability:
1. **Hardware & Environment Anchor:** Python 3.14+ (executed via `py -3`), NumPy 2.4+, SciPy 1.18+, RDKit 2026.03+.
2. **Floating-Point Precision:** All intermediate matrices, vectors, and norms stored at IEEE 754 float64 precision.
3. **Stochastic Anchoring:** For stochastic scenarios (CF-14 comparison), `seed = 42`, $N = 10,000$, with $\sigma_{\text{score}} = 0.05$ and $\sigma_{\text{AHP}} = 0.15$.
4. **Execution Harness Archival:** All counterfactual execution scripts must reside strictly in `scratch/` and dump exact raw outputs to JSON before Markdown document synthesis.

---

## 14. Forensic Audit Plan

Before Module 11 can be frozen, it must pass a comprehensive forensic audit covering 15 verification axes:

| Audit Axis | Verification Standard | Target |
|:---|:---|:---:|
| **Axis A: Source Integrity** | All cited classes, methods, and exceptions exist in `asd_framework/src/asd_mcda/v2/` | **100% Pass** |
| **Axis B: Scenario Uniqueness** | Exactly 20 distinct scenarios with 0 duplicates | **20 / 20 Unique** |
| **Axis C: Counterfactual Definitions** | Each scenario defines baseline, perturbation, fixed, and recomputed variables | **100% Pass** |
| **Axis D: Baseline Accuracy** | Baseline numbers match `scientific_validation_results.json` to 8 decimal places | **100% Match** |
| **Axis E: Reproducibility Protocol** | Exact scripts, seeds, and float64 arrays archived | **100% Pass** |
| **Axis F: Linear Algebra Correctness** | Matrix dimensions, spectral decompositions, and tensor forms mathematically verified | **100% Pass** |
| **Axis G: Dynamic K Governance** | Cumulative variance threshold ($\ge 95\%$) verified across all perturbed cohorts | **100% Pass** |
| **Axis H: Eigengap Thresholding** | Correct application of $\ge 0.10$ (`STABLE`), $[0.03, 0.10)$ (`WARNING`), $< 0.03$ (`BLOCKED`) | **100% Pass** |
| **Axis I: AHP Consistency Checks** | Saaty power iteration, $RI_4 = 0.89$, and $CR < 0.08$ logic verified | **100% Pass** |
| **Axis J: Metric Tensor Mathematics** | $M_K = V_K^T W V_K$ positive-definiteness verified | **100% Pass** |
| **Axis K: Ranking Metric Verification** | Manual verification of Kendall's $\tau$, Spearman's $\rho$, and $\Delta \text{rank}$ | **100% Pass** |
| **Axis L: Epistemic Boundary Scan** | Zero occurrences of forbidden causal or clinical phrases | **0 Violations** |
| **Axis M: Pedagogical Structure** | 100% compliance with standard 5-part model viva answers in drills | **100% Pass** |
| **Axis N: Production Code Isolation** | Working tree in `asd_framework` remains 100% clean | **0 Modifications** |
| **Axis O: Modules 01–10 Isolation** | Zero modifications to existing frozen modules | **0 Modifications** |

### Defect Scorecard Thresholds:
- **P0 Errors (Fatal Defect / Calculation Bug / Production Modification):** **0 Allowed**
- **P1 Errors (Scientific / Source Code Mismatch / Causal Overclaim):** **0 Allowed**
- **P2 Errors (Boilerplate / Uniqueness Failure / Ambiguity):** **0 Allowed**
- **P3 Errors (Minor Formatting / Typographical):** **0 Allowed**

---

## 15. Required Future Artifacts

Module 11 will be constructed across four comprehensive documents totaling $\ge 80,000$ bytes:

1. **`11_COUNTERFACTUAL_LAB\01_COUNTERFACTUAL_METHODOLOGY.md`** (~18 KB):  
   Epistemological framework of counterfactual stress-testing in pharmaceutical MCDA; taxonomy of perturbations; mathematical mechanisms of information loss and rank distortion; formal definition of governance tripwires.
2. **`11_COUNTERFACTUAL_LAB\WHAT_IF_EXPERIMENTS.md`** (~35 KB):  
   The primary curriculum deliverable designated in `PHASE_STATUS.md`. Contains the full, exhaustive numerical and analytical dossiers for all 20 canonical What-If experiments, structured according to the 18-field schema.
3. **`11_COUNTERFACTUAL_LAB\03_COUNTERFACTUAL_ANALYSIS_AND_INTERPRETATION.md`** (~16 KB):  
   Cross-scenario synthesis; pipeline robustness matrices; parameter sensitivity ranking; comparative vulnerability heatmaps (thermodynamic vs kinetic vs algorithmic); definitive viva defense protocols.
4. **`11_COUNTERFACTUAL_LAB\04_COUNTERFACTUAL_WHITEBOARD_DRILLS.md`** (~22 KB):  
   12 real-time PhD viva whiteboard drills: hostile examiner challenges, quick manual calculation shortcuts, boundary proofs, common traps, and definitive verbal defense statements.
5. **Phase 8 Governance & Audit Artifacts:**  
   - `11_COUNTERFACTUAL_LAB\PHASE_8_REVIEW.md`
   - `11_COUNTERFACTUAL_LAB\PHASE_8_FORENSIC_AUDIT.md` (and mirrored at root).

---

## 16. Build Sequence

```
Step 1: Implementation Plan Repair & Preflight Verification (Current Step)
   │
   ▼
Step 2: Execution of Scratch Simulation Harnesses (`scratch/run_cf_experiments.py`)
   │    Extract exact float64 matrices and ranking correlations for all 20 scenarios
   │
   ▼
Step 3: Authoring of Primary Deliverable `11_COUNTERFACTUAL_LAB\WHAT_IF_EXPERIMENTS.md`
   │
   ▼
Step 4: Authoring of Foundations Document `01_COUNTERFACTUAL_METHODOLOGY.md`
   │
   ▼
Step 5: Authoring of Synthesis Document `03_COUNTERFACTUAL_ANALYSIS_AND_INTERPRETATION.md`
   │
   ▼
Step 6: Authoring of Oral Defense Drills `04_COUNTERFACTUAL_WHITEBOARD_DRILLS.md`
   │
   ▼
Step 7: Verification & Archival of `PHASE_8_REVIEW.md`
   │
   ▼
Step 8: Execution of Forensic Audit & Generation of `PHASE_8_FORENSIC_AUDIT.md` (P0=0, P1=0, P2=0, P3=0)
   │
   ▼
Step 9: Formal Freeze of Module 11
```

---

## 17. Freeze Criteria

Module 11 will be approved for freeze if and only if:
1. All four technical documents and the primary deliverable `WHAT_IF_EXPERIMENTS.md` are authored, deployed in `11_COUNTERFACTUAL_LAB\`, and complete.
2. All 20 canonical What-If experiments are fully analyzed with zero duplication and zero missing scenarios.
3. All numerical values match live v2 execution and authoritative validation baselines.
4. All 15 audit axes in the Forensic Audit Plan achieve **100% Pass**.
5. Defect counts strictly satisfy: **P0 = 0, P1 = 0, P2 = 0, P3 = 0**.
6. Zero changes are made to production code in `asd_framework` and zero changes to Modules 01–10.

---

*End of Repaired Phase 8 Implementation Plan — Module 11: Counterfactual Lab*\n