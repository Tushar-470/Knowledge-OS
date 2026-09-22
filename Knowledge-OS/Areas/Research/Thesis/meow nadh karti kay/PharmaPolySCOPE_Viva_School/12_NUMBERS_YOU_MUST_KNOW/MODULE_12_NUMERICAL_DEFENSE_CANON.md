# MODULE 12 — NUMERICAL DEFENSE CANON
# Conceptual Viva-Defense Guide for Key Quantitative Metrics

**Document ID:** `MODULE_12_NUMERICAL_DEFENSE_CANON`  
**Module:** Module 12 — Numbers You Must Know (`12_NUMBERS_YOU_MUST_KNOW/`)  
**Phase:** Phase 9 Execution & Forensic Repair (Module 11 → Module 12 Handoff)  
**Auditor:** Forensic Computational-Science Architect & PhD Methodology Auditor  
**Date:** September 23, 2026  
**Status:** **AUTHORITATIVE DEFENSE CANON (REPAIRED & SOURCE-LOCKED)**  

---

## 1. Purpose & Pedagogical Architecture

This canon translates the raw numbers in [`MODULE_12_MASTER_QUANTITATIVE_LEDGER.md`](file:///C:/Users/Admin/Documents/GitHub/Knowledge-OS/Knowledge-OS/Areas/Research/Thesis/meow%20nadh%20karti%20kay/PharmaPolySCOPE_Viva_School/12_NUMBERS_YOU_MUST_KNOW/MODULE_12_MASTER_QUANTITATIVE_LEDGER.md) into structured, hostile-viva defense responses.

Organized across 17 conceptual sections, every key quantitative parameter is interrogated through a mandatory 6-part defense structure:
1. **What is it?** (Exact definition, value, and unit)
2. **Why does it matter?** (Systemic role in the MCDA pipeline)
3. **How is it calculated?** (Underlying mathematical equation and inputs)
4. **What happens if it changes?** (Sensitivity, boundary behavior, and failure modes)
5. **What should I say in viva?** (Recommended, implementation-aligned defense script)
6. **What must I NOT claim?** (Forbidden causal, physical, or clinical traps)

---

## 2. Conceptual Defense Sections

### Section 1: Chemistry & Molecular Identity (Indomethacin Baseline)

#### Numerical Anchor: $MW = 357.79	ext{ g/mol}, V_m = 273.0	ext{ cm}^3/	ext{mol}, T_g = 315.15	ext{ K}$
- **What is it?** The baseline physicochemical descriptors of Indomethacin free acid parsed from canonical SMILES `COc1ccc2c(c1)c(CC(=O)O)c(C)n2C(=O)c1ccc(Cl)cc1` via RDKit (`2026.03.5`).
- **Why does it matter?** These descriptors establish the physical baseline: molar volume ($V_m$) is used in Flory-Huggins $\chi$ computation, while $T_g$ is used in Gordon-Taylor predicted mixture $T_g$ evaluation.
- **How is it calculated?** Molar volume is calculated as $V_m = MW / ho_{	ext{amorphous}} = 357.793 / 1.22 pprox 273.0	ext{ cm}^3/	ext{mol}$.
- **What happens if it changes?** Under CF-15, perturbing density shifted $\chi$ and altered closeness scores continuously, but did not induce rank inversions. Under DRG-0002, the record was quarantined due to an identity mismatch between requested drug (Fenofibrate) and stored chemical structure (Indomethacin).
- **What should I say in viva?** *"Indomethacin is modeled as a lipophilic BCS Class II weak acid with molecular weight 357.79 g/mol and experimental amorphous $T_g$ of 315.15 K. All descriptors are deterministically parsed from canonical SMILES using RDKit with fallback policies strictly prohibited."*
- **What must I NOT claim?** Do NOT claim that RDKit descriptors prove drug solubility or that computational $\log P$ guarantees membrane permeability.

---

### Section 2: Four Compatibility Criteria

#### Numerical Anchor: Criteria Order $[s_{	ext{HSP}}, s_\chi, s_{	ext{desc}}, s_{	ext{GT}}]$
- **What is it?** The canonical, immutable ordering of the four continuous compatibility criteria evaluated for every drug-polymer pair.
- **Why does it matter?** Arbitrary column reordering breaks covariance structure and matrix multiplication against eigenvectors $V_K$ and metric tensor $M_K$.
- **How is it calculated?** Evaluated via dedicated estimators in `src/asd_mcda/compatibility/matrix.py`.
- **What happens if it changes?** Any attempt to submit criteria in a non-canonical order raises `ValueError("Criteria order mismatch")` in `engine.py:114`.
- **What should I say in viva?** *"The pipeline enforces an immutable four-criterion ordering spanning Hansen solubility distance, Flory-Huggins interaction parameter, molecular descriptor similarity, and Gordon-Taylor glass transition metric."*
- **What must I NOT claim?** Do NOT claim these criteria capture all solid-state thermodynamic effects; they are computational proxy metrics.

---

### Section 3: Descriptor Construction & Normalization

#### Numerical Anchor: $TPSA_{	ext{norm}} = 200.0	ext{ \AA}^2$, Weights $[0.30, 0.30, 0.20, 0.20]$
- **What is it?** The hard-coded normalizer and sub-weights used to construct the composite descriptor similarity score $s_{	ext{desc}}$.
- **Why does it matter?** Prevents large polar surface areas from dominating discrete H-bonding donor and acceptor counts.
- **How is it calculated?** $s_{	ext{desc}} = 0.30(1 - rac{|\Delta HBD|}{HBD_{\max}}) + 0.30(1 - rac{|\Delta HBA|}{HBA_{\max}}) + 0.20(1 - rac{|\Delta TPSA|}{200.0}) + 0.20(1 - rac{|\Delta 	ext{arom}|}{	ext{arom}_{\max}})$.
- **What happens if it changes?** Altering sub-weights shifts $s_{	ext{desc}}$, which Morris screening identified as the dominant factor for Soluplus sensitivity (`score_POL-005-2026_s_desc`, $\mu^* = 0.1444$).
- **What should I say in viva?** *"Descriptor similarity integrates H-bonding capacity, polar surface area, and aromatic ring matching using fixed, literature-grounded sub-weights and a 200 Å² normalizer to balance discrete and continuous counts."*
- **What must I NOT claim?** Do NOT claim that descriptor similarity models 3D quantum electrostatic surface potentials.

---

### Section 4: Cohort Standardization Moments ($	ext{ddof}=0$)

#### Numerical Anchor: $	ext{ddof}=0$, Guardrail $\sigma_{\min}^2 = 10^{-8}$
- **What is it?** The population z-score normalization applied to raw score matrix $S$: $Z = (S - \mu) / \sigma$.
- **Why does it matter?** Using population degrees of freedom ($	ext{ddof}=0$) ensures exact variance partition $rac{1}{m} \sum z_j^2 = 1.0$, which is required for correlation PCA. The guardrail prevents division by zero.
- **How is it calculated?** $\mu_j = rac{1}{m} \sum_{i=1}^m s_{ij}$, $\sigma_j = \sqrt{rac{1}{m} \sum_{i=1}^m (s_{ij} - \mu_j)^2}$.
- **What happens if it changes?** If a criterion has variance $\le 10^{-8}$ (CF-17) or candidate polymers have identical rows (CF-19), the pipeline halts immediately, raising `ZeroVarianceStandardizationError`.
- **What should I say in viva?** *"Cohort standardization uses population degrees of freedom (ddof=0) to strictly preserve total variance equal to p=4 for correlation PCA, protected by a 1e-8 zero-variance guardrail."*
- **What must I NOT claim?** Do NOT claim that standardization eliminates cohort dependency; standardization explicitly ties scores to the specific candidate cohort.

---

### Section 5: Principal Component Analysis (Correlation Spectral Decomposition)

#### Numerical Anchor: $\lambda = [2.0909, 1.1679, 0.7398, 0.0015]$, $\sum \lambda_i = 4.0$
- **What is it?** The eigenvalues of the sample correlation matrix $R = rac{1}{m} Z^T Z$.
- **Why does it matter?** Spectral decomposition decorrelates criteria and projects candidates onto orthogonal axes of maximal cohort variance.
- **How is it calculated?** Solved via `numpy.linalg.eigh()` with sign canonicalization (enforcing positive sign on the largest absolute loading element).
- **What happens if it changes?** If criteria become highly collinear (CF-18), $\lambda_1$ absorbs $96.52\%$ of variance, collapsing the subspace to $K=1$.
- **What should I say in viva?** *"Spectral decomposition of the correlation matrix partitions the total variance p=4 across orthogonal principal components, with sign canonicalization guaranteeing deterministic eigenvector orientation."*
- **What must I NOT claim?** Do NOT refer to PCA components as "clusters" or "K-Means groups".

---

### Section 6: Dynamic Subspace Dimension Selection

#### Numerical Anchor: $	au_{	ext{var}} = 0.95$ ($95.0\%$), Retained $K = 3$ ($99.9634\%$)
- **What is it?** The adaptive dimensionality selection algorithm that chooses the minimal integer $K$ such that cumulative explained variance reaches at least 95%.
- **Why does it matter?** Eliminates the legacy v1.5 flaw of arbitrary fixed $K=2$ truncation. For Indomethacin, $K=2$ captures only $81.47\%$ of variance, discarding a significant $18.50\%$ variance component ($\lambda_3 = 0.7398$). Dynamic selection correctly chooses $K=3$ ($99.96\%$).
- **How is it calculated?** $	ext{cum\_var}(K) = rac{1}{p} \sum_{k=1}^K \lambda_k \ge 0.95$.
- **What happens if it changes?** If $	au_{	ext{var}}$ is reduced to $0.70$ (CF-02), $K=2$ is selected, altering the metric geometry and closeness scores.
- **What should I say in viva?** *"Dynamic K selection adaptively determines subspace dimensionality by requiring at least 95% cumulative explained variance. For Indomethacin, two components capture only 81.5%, correctly triggering K=3 to retain 99.96% of cohort information."*
- **What must I NOT claim?** Do NOT claim that $K=3$ is universal across all drugs; Ibuprofen and Itraconazole select $K=2$.

---

### Section 7: Subspace Stability & Boundary Eigengap Governance

#### Numerical Anchor: $\delta_3 = 0.73831043$, Thresholds $0.10$ and $0.03$
- **What is it?** The spectral separation between the last retained eigenvalue and the first discarded eigenvalue: $\delta_K = \lambda_K - \lambda_{K+1}$.
- **Why does it matter?** By the Davis-Kahan sin $	heta$ theorem, eigenvector orientation stability is bounded by the eigengap. If $\delta_K pprox 0$, random noise rotates the subspace arbitrarily.
- **How is it calculated?** $\delta_3 = \lambda_3 - \lambda_4 = 0.73977471 - 0.00146428 = 0.73831043$.
- **What happens if it changes?** If $\delta_K < 0.03$ (CF-05), the pipeline halts with `DegenerateSubspaceBlockedError`. If $0.03 \le \delta_K < 0.10$ (CF-06), a `WARNING` is logged.
- **What should I say in viva?** *"The boundary eigengap delta_3 = 0.7383 measures spectral separation, far exceeding the 0.10 stability threshold and proving that the 3D principal subspace is mathematically stable against noise perturbation."*
- **What must I NOT claim?** Do NOT claim that a large eigengap proves the polymer formulation will not crystallize in the physical world.

---

### Section 8: Analytic Hierarchy Process (AHP) Preference Weighting

#### Numerical Anchor: Full Authoritative Matrix, Weights $w = [0.4077, 0.3244, 0.0922, 0.1757]$
- **What is it?** The 4x4 pairwise comparison matrix defining decision-maker preference across $[s_{	ext{HSP}}, s_\chi, s_{	ext{desc}}, s_{	ext{GT}}]$.
  The exact matrix in `backend/services/engine_adapter.py:95` is:
  - Row 1 ($s_{	ext{HSP}}$ row): $[1.0, 2.0, 3.0, 2.0]$
  - Row 2 ($s_\chi$ row): $[0.5, 1.0, 5.0, 2.0]$
  - Row 3 ($s_{	ext{desc}}$ row): $[1/3, 0.2, 1.0, 0.5]$
  - Row 4 ($s_{	ext{GT}}$ row): $[0.5, 0.5, 2.0, 1.0]$
- **Why does it matter?** Encodes pharmaceutical screening preference, allocating primary weight to Hansen solubility distance ($40.77\%$) and Flory-Huggins $\chi$ ($32.44\%$), followed by Gordon-Taylor metric ($17.57\%$) and descriptors ($9.22\%$).
- **How is it calculated?** Principal eigenvector computed via power iteration ($|\lambda^{(t)} - \lambda^{(t-1)}| < 10^{-10}$), normalized to sum to 1.
- **What happens if it changes?** Re-allocating weights to equal weighting ($w = 0.25$, CF-12) or heavily weighting $s_{	ext{GT}}$ ($w_4 = 0.4578$, CF-13) inverts the ranking between Soluplus and HPMC E5.
- **What should I say in viva?** *"AHP weights are derived via power iteration on the authoritative 4x4 physical comparison matrix with consistency ratio CR = 0.0494, placing primary emphasis on solubility and Flory-Huggins criteria while strictly maintaining transitivity."*
- **What must I NOT claim?** Do NOT interpret the weights as physical mechanism percentages or claim they represent '73% thermodynamic contribution'. They are decision-theoretic preference weights.

---

### Section 9: AHP Consistency Governance ($CR < 0.08$)

#### Numerical Anchor: $\lambda_{\max} = 4.131937, CI = 0.043979, RI_4 = 0.89, CR = 0.049415$
- **What is it?** The mathematical consistency metrics governing transitivity in the pairwise comparison matrix.
- **Why does it matter?** Prevents contradictory preferences (e.g., $A > B, B > C, C > A$) from corrupting the decision metric.
- **How is it calculated?** $CI = (\lambda_{\max} - 4) / 3 = (4.131937 - 4) / 3 = 0.043979$; $CR = CI / 0.89 = 0.049415$.
- **What happens if it changes?** If $CR \ge 0.08$ (CF-07), the pipeline halts with `AHPConsistencyViolationError`. During Monte Carlo, $1,396$ replicates were blocked by this gate.
- **What should I say in viva?** *"The AHP matrix achieves a consistency ratio of CR = 0.0494, well within the strict 0.08 governance gate, verifying that preference judgements are transitive and mathematically robust."*
- **What must I NOT claim?** Do NOT claim that $CR < 0.08$ proves the screening preferences will produce an FDA-approved drug product.

---

### Section 10: Subspace Projected TOPSIS (SP-PRP-TOPSIS Metric Tensor)

#### Numerical Anchor: $M_K = V_K^T W V_K$, $3 	imes 3$ Positive-Definite Matrix
- **What is it?** The positive-definite quadratic metric tensor transforming AHP criterion weights into the $K$-dimensional principal subspace.
- **Why does it matter?** Classical TOPSIS applies Euclidean distance directly, which violates metric axioms when criteria are correlated or projected. SP-PRP-TOPSIS correctly rotates the metric tensor into the subspace.
- **How is it calculated?** $M_K = V_K^T 	ext{diag}(w) V_K$, with candidate distances $D_i^+ = \sqrt{(t_i - t^+)^T M_K (t_i - t^+)}$.
- **What happens if it changes?** Under CF-04 ($K=p=4$), $V_4 V_4^T = I_4$, proving the full-space metric reduction identity where $D_i$ reduces identically to unrotated weighted Euclidean distance.
- **What should I say in viva?** *"We utilize Subspace Projected Positive/Negative Reference Point TOPSIS (SP-PRP-TOPSIS), projecting diagonal weights into the subspace via the positive-definite quadratic metric tensor M_K = V_K^T W V_K."*
- **What must I NOT claim?** NEVER say "we applied classical Hwang-Yoon TOPSIS".

---

### Section 11: Relative Closeness Scores ($C_L$) and Candidate Ranking

#### Numerical Anchor: Soluplus $C_L = 0.6864$ (Rank 1), HPMC E5 $C_L = 0.6731$ (Rank 2)
- **What is it?** The relative closeness to the ideal solution in projected metric space: $C_L = D^- / (D^+ + D^-)$.
- **Why does it matter?** Governs the deterministic ranking order of candidate polymers in the screening library.
- **How is it calculated?** Soluplus: $D^+ = 4.1826, D^- = 9.1563 \implies C_L = 9.1563 / (4.1826 + 9.1563) = 0.686435$.
- **What happens if it changes?** Rank gap between Soluplus and HPMC E5 is narrow ($\Delta C_L = 0.0133$), explaining why weight shifts in CF-12 invert the ranking.
- **What should I say in viva?** *"Soluplus achieves Rank 1 with closeness score C_L = 0.6864, narrowly leading HPMC E5 at 0.6731, driven by higher scores in Hansen solubility distance and Flory-Huggins chi."*
- **What must I NOT claim?** NEVER say "Soluplus is the best polymer". Say "Soluplus is the top-ranked candidate within the 5-polymer library under the documented MCDA criteria."

---

### Section 12: Monte Carlo Uncertainty Quantification

#### Numerical Anchor: $N_{	ext{gen}} = 10,000, N_{	ext{valid}} = 8,600, N_{	ext{blk}} = 1,400$, Soluplus $p_{	ext{top1}} = 55.51\%$
- **What is it?** Stochastic uncertainty evaluation perturbing input scores ($\sigma = 0.05$) and AHP ratios ($\sigma = 0.15$) over 10,000 replicates with `seed=42`.
- **Why does it matter?** Reconciles point-estimate ranking with input measurement error, proving that deterministic Rank 1 does not mean 100% certainty.
- **How is it calculated?** Replicate conservation: $10,000 = 8,600	ext{ valid} + 1,400	ext{ blocked}$. Valid ratio $= 86.00\%$.
- **What happens if it changes?** If perturbations are disabled (CF-14), distributions collapse to deterministic step functions ($p_{	ext{top1}} \in \{0, 1\}$).
- **What should I say in viva?** *"Under Monte Carlo uncertainty with 10,000 replicates, 8,600 satisfied all governance gates. Soluplus attained Rank 1 in 55.51% of valid replicates, while HPMC E5 achieved Rank 1 in 42.00%, confirming competitive performance under noise."*
- **What must I NOT claim?** Do NOT claim that $p_{	ext{top1}} = 55.51\%$ represents the probability of formulation success in clinical trials.

---

### Section 13: Morris Elementary Effects Sensitivity Screening

#### Numerical Anchor: 26 Factors, 10 Valid Trajectories, Dominant Factor: `score_POL-005-2026_s_desc` ($\mu^* = 0.1444$)
- **What is it?** Global sensitivity screening evaluating the elementary effect of 26 input parameters (20 score matrix entries + 6 AHP comparisons).
- **Why does it matter?** Identifies which input parameters exert the greatest influence on candidate rankings.
- **How is it calculated?** Evaluated across trajectories with step size $\Delta = 2/3$, with whole-trajectory discard applied when any point violates governance gates.
- **What happens if it changes?** Out of 31 attempted trajectories, 21 were discarded due to `AHP_CR_BLOCKED`, leaving exactly 10 valid trajectories.
- **What should I say in viva?** *"Morris screening across 26 factors identified Soluplus descriptor similarity as the most influential parameter (mu* = 0.1444), while confirming that whole-trajectory discard rigorously prevented corrupted intermediate points from biasing sensitivity estimates."*
- **What must I NOT claim?** Do NOT claim Morris screening proves which physical mechanism dominates drug crystallization.

---

### Section 14: Defensive Software Exceptions & Controlled Halts

#### Numerical Anchor: 19 Exception Classes rooted in `PharmaPolyScopeV2Error`
- **What is it?** The formal AST exception taxonomy governing defensive pipeline execution.
- **Why does it matter?** Implements the "Fail Safely and Auditably" principle: an unphysical input or corrupted eigenspace must never yield a silent ranking.
- **How is it calculated?** Defined in `src/asd_mcda/v2/exceptions.py`.
- **What happens if it changes?** Verified in Phase 8: `DegenerateSubspaceBlockedError` (CF-05), `AHPConsistencyViolationError` (CF-07), `RDKitParseFailureError` (CF-16), `ZeroVarianceStandardizationError` (CF-17, CF-19).
- **What should I say in viva?** *"PharmaPolySCOPE implements defensive architecture with 19 domain-specific exceptions, guaranteeing that unphysical chemistry, zero-variance cohorts, or intransitive preferences halt execution with complete audit records."*
- **What must I NOT claim?** Do NOT claim that throwing an exception is a system defect; defensive blocking is an intentional governance feature.

---

### Section 15: Multi-Cohort Validation Results

#### Numerical Anchor: Ibuprofen ($K=2, \delta_2 = 0.8169$), Itraconazole ($K=2, \delta_2 = 0.6504$), DRG-0002 Quarantined
- **What is it?** The multi-drug validation cohort demonstrating cross-compound pipeline execution.
- **Why does it matter?** Proves that dynamic $K$ selection adapts to differing chemical spaces, selecting $K=2$ for Ibuprofen and Itraconazole while isolating mismatched inputs.
- **How is it calculated?** Executed on `DRG-0001` (Ibuprofen), `ITR-001-2026` (Itraconazole), and `DRG-0002` in `scientific_validation_results.json`.
- **What happens if it changes?** For Ibuprofen, Eudragit E PO achieves Rank 1 ($C_L = 0.5503$); for Itraconazole, Soluplus achieves Rank 1 ($C_L = 0.6106$). DRG-0002 was quarantined by strict identity validation due to an identity mismatch between requested drug (Fenofibrate) and stored chemical structure (Indomethacin).
- **What should I say in viva?** *"Multi-cohort validation confirms that dynamic K selection correctly adapts to chemical complexity, selecting K=2 for Ibuprofen and Itraconazole, while input chemistry governance successfully quarantined DRG-0002 due to chemical identity mismatch."*
- **What must I NOT claim?** Do NOT claim closeness scores can be compared across cohorts ($K=3$ and $K=2$ spaces are geometrically non-commensurable).

---

### Section 16: Phase 8 Counterfactual Boundaries

#### Numerical Anchor: CF-01 through CF-20 Machine Record in `PHASE_8_EXECUTION_RESULTS.json`
- **What is it?** The 20 canonical What-If perturbation scenarios validating algorithmic boundaries.
- **Why does it matter?** Proves that every component (PCA, Eigengap, AHP, SP-PRP-TOPSIS, Monte Carlo) is mathematically essential and defensibly bounded.
- **How is it calculated?** Systemic perturbations executed in Phase 8 without modifying production code.
- **What happens if it changes?** Five scenarios were intentionally blocked (CF-05, CF-07, CF-16, CF-17, CF-19), while 15 completed with exact numerical shifts.
- **What should I say in viva?** *"Across 20 counterfactual scenarios, we demonstrated that PCA truncation prevents noise overfitting, AHP governance blocks intransitivity, and metric reduction identity holds exactly at full dimensionality."*
- **What must I NOT claim?** Do NOT refer to CF-04 as a "theorem" (it is an algebraic reduction identity).

---

### Section 17: Known Limitations & Epistemic Boundaries

#### Numerical Anchor: 5-Polymer Cohort, Binary System, 30% w/w Loading
- **What is it?** The explicitly documented boundary conditions of the v2 implementation.
- **Why does it matter?** Demarcates computational screening from wet-lab formulation science, shielding the candidate from hostile overextension attacks.
- **How is it calculated?** Defined in `08_VALIDATION_REPRODUCIBILITY/07_VALIDATION_FAILURES_AND_LIMITATIONS.md`.
- **What happens if it changes?** Expanding to ternary surfactant systems or broader polymer libraries requires revalidation.
- **What should I say in viva?** *"PharmaPolySCOPE v2 is a computational decision-support tool bounded by binary drug-polymer systems at 30% loading across a validated 5-polymer library. It provides prioritized candidate rankings, not empirical stability predictions."*
- **What must I NOT claim?** NEVER claim that PharmaPolySCOPE replaces dissolution testing or physical stability studies.
