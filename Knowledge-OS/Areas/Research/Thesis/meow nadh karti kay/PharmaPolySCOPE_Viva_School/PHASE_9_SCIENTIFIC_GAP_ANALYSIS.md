# Phase 9 Scientific Gap Analysis
# Module 11 to Module 12 Handoff Architecture

**Document ID:** `PHASE_9_SCIENTIFIC_GAP_ANALYSIS`  
**Phase:** Phase 9 (Source-Locked Planning Gate)  
**Curriculum Focus:** Module 11 (\`11_COUNTERFACTUAL_LAB/\`) to Module 12 (\`12_NUMBERS_YOU_MUST_KNOW/\`) Handoff  
**Authoritative Repositories:**  
- Production Source: `asd_framework/src/asd_mcda/v2/` (Git commit: `220ba4c`, v1.5 freeze: `31eee4d`)  
- Scientific Validation: `results/validation/v2_scientific_validation/scientific_validation_results.json`  
- Curriculum Canon: Modules 01–10 and Module 11 (`WHAT_IF_EXPERIMENTS.md`)  
**Auditor:** Forensic Computational-Science Architect & PhD Methodology Auditor  
**Date:** September 23, 2026  
**Status:** **AUTHORITATIVE PLANNING BASELINE**  

---

## 1. Current Evidence State

The PharmaPolySCOPE multi-criteria decision analysis (MCDA) framework v2 provides an algorithmic pipeline for screening polymeric carriers in amorphous solid dispersion (ASD) formulations. The current evidence state across production code, authoritative validation artifacts, and curriculum modules establishes the following verified technical reality:

### 1.1 Production Pipeline Mechanics
The pipeline executes a 15-stage sequence on an input chemical library (default: 5 polymers, 1 drug candidate at 30% w/w drug loading):
1. **Input Chemistry Validation (`chemistry.py`):** Canonical SMILES parsing via RDKit, fallback prohibition (`ProductionFallbackProhibitedError`), molecular weight, donor/acceptor counts, and molar volume calculation.
2. **Criteria Evaluation (`matrix.py`, `criteria/`):** Evaluates $p=4$ continuous criteria:
   - $s_{\text{HSP}}$: Hansen solubility parameter distance $R_a = \sqrt{4(\Delta \delta_d)^2 + (\Delta \delta_p)^2 + (\Delta \delta_h)^2}$, transformed via inverse exponential scoring.
   - $s_\chi$: Flory-Huggins interaction parameter $\chi_{\text{drug-poly}}$, evaluated from HSP components and molar volumes.
   - $s_{\text{desc}}$: Weighted molecular descriptor similarity based on hydrogen bond donors (HBD, 0.30), acceptors (HBA, 0.30), topological polar surface area (TPSA, normalized by 200.0, 0.20), and aromatic ring counts (0.20).
   - $s_{\text{GT}}$: Gordon-Taylor predicted glass transition temperature elevation/suppression, evaluated at $w_{\text{drug}} = 0.30$.
3. **Standardization (`standardization.py`):** Population z-score standardization ($Z = (S - \mu) / \sigma$) using strictly $\text{ddof} = 0$, protected by a zero-variance guardrail (requiring $\sigma_j^2 > 10^{-8}$; otherwise raising `ZeroVarianceStandardizationError`).
4. **Subspace Dimensionality Reduction (`pca.py`):** Sample correlation matrix $R = \frac{1}{m} Z^T Z$, dynamic eigenvalue truncation selecting the minimal $K \le p$ satisfying cumulative variance threshold $\sum_{k=1}^K (\lambda_k / p) \ge \tau_{\text{var}} = 0.95$.
5. **Subspace Stability Governance (`stability.py`):** Evaluates boundary eigengap $\delta_K = \lambda_K - \lambda_{K+1}$ (for $K < p$; $\delta_K = +\infty$ for $K = p$). Hard blocking threshold $\delta_K < 0.03$ raises `DegenerateSubspaceBlockedError`; warning threshold $0.03 \le \delta_K < 0.10$ logs `WARNING`; $\delta_K \ge 0.10$ classifies as `STABLE`.
6. **Preference Weighting (`ahp.py`):** 4x4 pairwise comparison matrix in criterion space ($RI_4 = 0.89$). Principal eigenvector computed via power iteration ($|\lambda_{\max}^{(t)} - \lambda_{\max}^{(t-1)}| < 10^{-10}$). Consistency index $CI = (\lambda_{\max} - 4)/3$; consistency ratio $CR = CI / 0.89$. Hard governance tripwire at $CR \ge 0.08$ raises `AHPConsistencyViolationError`.
7. **Subspace Projected TOPSIS (`metrics.py`, `engine.py`):** SP-PRP-TOPSIS transforms diagonal weights $W = \text{diag}(w)$ into the $K$-dimensional subspace via $M_K = V_K^T W V_K$. Ideal and anti-ideal coordinate vectors $t^+ = z^+ V_K$ and $t^- = z^- V_K$ define quadratic form distances $D_i^+ = \sqrt{(t_i - t^+)^T M_K (t_i - t^+)}$ and $D_i^- = \sqrt{(t_i - t^-)^T M_K (t_i - t^-)}$. Relative closeness score:
   $$C_L(i) = \frac{D_i^-}{D_i^+ + D_i^-}$$
8. **Uncertainty Quantification (`uncertainty.py`):** Monte Carlo simulation with $N_{\text{generated}} = 10,000$ replicates. Score perturbation $\mathcal{N}(0, 0.05^2)$, AHP log-space perturbation $\mathcal{N}(0, 0.15^2)$ with exact reciprocal preservation ($a_{ji} = 1/a_{ij}$). Replicate conservation law: $N_{\text{generated}} = N_{\text{valid}} + N_{\text{blocked}}$.

### 1.2 Authoritative Baseline Values (Indomethacin Validation Cohort)
From `scientific_validation_results.json`:
- **Retained Subspace:** Dynamic $K = 3$, cumulative explained variance $= 99.9634\%$, boundary eigengap $\delta_3 = 0.73831043$ (`STABLE`).
- **AHP Eigenstructure:** $\lambda_{\max} = 4.1319370739$, $CI = 0.0439790246$, $CR = 0.0494146344 < 0.08$ (`ACCEPTED`).
- **AHP Weights:** $w = [0.40767478, 0.32443341, 0.09216134, 0.17573047]$ (corresponding to $s_{\text{HSP}}, s_\chi, s_{\text{desc}}, s_{\text{GT}}$).
- **Ranking & Closeness Scores ($C_L$):**
  1. Soluplus: $C_L = 0.6864350840$
  2. HPMC E5: $C_L = 0.6731464918$
  3. PVP-VA64: $C_L = 0.6062468903$
  4. PVP K30: $C_L = 0.5875839043$
  5. Eudragit E PO: $C_L = 0.5456162038$
- **Monte Carlo Uncertainty Profile:**
  - $N_{\text{generated}} = 10,000$, $N_{\text{valid}} = 8,600$ ($86.00\%$), $N_{\text{blocked}} = 1,400$ ($14.00\%$).
  - Block decomposition: $1,396$ `AHP_CR_BLOCKED`, $4$ `EIGENGAP_BLOCKED`.
  - Top-1 computational frequencies: Soluplus $p_{\text{top1}} = 55.5116\%$ ($4,774 / 8,600$), HPMC E5 $p_{\text{top1}} = 42.0000\%$ ($3,612 / 8,600$), PVP-VA64 $p_{\text{top1}} = 2.4884\%$ ($214 / 8,600$).

### 1.3 Multi-Cohort Comparison
- **Ibuprofen:** $K=2$, cumulative variance $= 97.10\%$, $\delta_2 = 0.5861$ (`STABLE`).
- **Itraconazole:** $K=2$, cumulative variance $= 95.53\%$, $\delta_2 = 0.4497$ (`STABLE`).
- **DRG-0002 Incident:** Quarantined drug compound exhibiting unphysical SMILES and density anomaly; successfully intercepted by input chemistry governance (`ProductionFallbackProhibitedError`), demonstrating defensive blocking integrity.

---

## 2. What Phase 8 Established

Phase 8 (Module 11 — Counterfactual Lab, documented in `WHAT_IF_EXPERIMENTS.md`) established the behavior of the pipeline under systemic parameter, structural, and input perturbations across 20 canonical What-If scenarios:
1. **Subspace Truncation vs. Metric Preservation:**
   - Perturbing variance threshold to $\tau_{\text{var}} = 0.70$ forced $K=2$ (CF-02), causing rank stability but numerical closeness score shift ($C_L$ Soluplus $0.7719$, HPMC E5 $0.6409$).
   - When $K=p=4$ (CF-04), $V_4 V_4^T = I_4$, mathematically proving the *full-space metric reduction identity* where projected quadratic distance collapses identically to unrotated weighted Euclidean distance with zero numerical discrepancy ($|C_{L,\text{CF04}} - C_{L,\text{CF01}}| < 10^{-15}$).
2. **Governance Tripwire Reliability:**
   - Artificially degenerate eigenspaces (CF-05, $\delta_K = 0.0050 < 0.03$) triggered hard defensive halts (`DegenerateSubspaceBlockedError`) at Step 3, preventing arbitrary projection onto noisy eigenvectors.
   - Borderline eigenspaces (CF-06, $\delta_K = 0.0600$) correctly triggered `WARNING` logs while allowing execution.
   - Severe preference intransitivity (CF-07, $CR = 0.1250 \ge 0.08$) triggered hard halts (`AHPConsistencyViolationError`) at Step 4.
   - Malformed SMILES inputs (CF-16) tripped input governance at Step 0 (`RDKitParseFailureError`).
   - Zero-variance criteria (CF-17) and identical polymer rows (CF-19) tripped standardization guardrails at Step 1 (`ZeroVarianceStandardizationError`), disproving the claim that production v2 outputs $C_L = 0.50$ for identical candidates.
3. **Preference Weighting Sensitivity & Rank Inversions:**
   - Shifting to equal AHP weights (CF-12, $w = [0.25, 0.25, 0.25, 0.25]$) produced a deterministic rank inversion: HPMC E5 ($C_L = 0.7067$, Rank 1) overtook Soluplus ($C_L = 0.6896$, Rank 2).
   - Skewing weight toward $s_{\text{GT}}$ (CF-13, $w_4 = 0.4578$) widened this inversion ($C_L$ HPMC E5 $0.7788$, Rank 1).
   - This proved that ranking inversions in PharmaPolySCOPE are mathematical consequences of weight vector re-allocation on the simplex, not alterations in physical compatibility.
4. **Criterion Ablation Non-Redundancy:**
   - CF-08 through CF-11 demonstrated in standalone $p=3$ mathematical testbeds that removing any individual criterion alters the decision manifold and shifts candidate closeness, confirming non-redundancy of the 4-criterion set.

---

## 3. What Phase 8 Did Not Establish

Crucially, Phase 8 was a computational counterfactual laboratory and **did not** establish:
1. **Empirical Physical Stability:** CF-01 through CF-20 do not establish that Soluplus or HPMC E5 forms a physically stable amorphous solid dispersion in the laboratory, nor does it establish resistance to crystallization under 40°C/75% RH stability storage.
2. **Dissolution Rate Enhancement:** The closeness scores ($C_L$) do not correlate with, predict, or establish in vitro dissolution curves, supersaturation maintenance, or membrane permeability.
3. **Cross-Cohort Metric Commensurability:** Phase 8 did not establish that closeness scores between different drugs (e.g., Indomethacin $C_L=0.6864$ at $K=3$ vs. Ibuprofen $C_L=0.7412$ at $K=2$) can be directly compared as scalar distances.
4. **Thermodynamic Superiority:** The rank inversions in CF-12 and CF-13 do not indicate that HPMC E5 is "physically superior" under equal weighting; they only reflect sensitivity to the user's decision-theoretic preference matrix.
5. **Universal Chemical Validity:** The pipeline behavior on novel compounds was tested only on DRG-0003 (CF-20); broad generalization across the entire IUPAC chemical landscape was not established.

---

## 4. Remaining Open Questions

From the reconciliation of the active v2 implementation, validation artifacts, Modules 01–11, and the Phase 8 counterfactual dataset, four major categories of open questions remain:

### 4.1 Methodological & Pedagogical Gap: Module 11 → Module 12 Handoff
While Modules 01–11 provide exhaustive explanations of the scientific theory, mathematical models, reverse engineering traces, and counterfactual stress tests, the curriculum currently lacks a **single, authoritative, immutable Quantitative Master Ledger and Memorization Canon**.
In a doctoral viva defense:
- Examiners probe exact quantitative values across all 15 pipeline stages (e.g., "What was the exact condition number?", "Why was $\lambda_{\max} = 4.131937$?", "What is the exact decimal threshold for AHP consistency?", "How many replicates were blocked and under what exact exception categories?").
- Discrepancies between historical module drafts, assistant chat summaries (such as the CF-12 2-weight display truncation incident), and production JSON risk fatal examiner challenges.
- **Module 12 (`12_NUMBERS_YOU_MUST_KNOW/`)** is provisioned to resolve this gap by establishing an unambiguous, source-locked, memorizable quantitative ledger.

### 4.2 Chemical Space Generalization Gap
The active validated baseline comprises exactly 3 model drugs (Indomethacin, Ibuprofen, Itraconazole) and 5 polymers. How the dynamic PCA eigenvalue cutoff and eigengap governance respond across a broader, systematically curated cohort of 20+ BCS Class II/IV compounds remains unmapped.

### 4.3 Empirical Validation Gap
PharmaPolySCOPE v2 has never undergone end-to-end wet-lab validation against physical dissolution testing (USP Apparatus II), differential scanning calorimetry (DSC), powder X-ray diffraction (PXRD), or accelerated stability testing.

### 4.4 Analytical Metric Conditioning Gap
While empirical condition numbers for $M_K = V_K^T W V_K$ are evaluated numerically, closed-form theoretical bounds on $\kappa(M_K)$ as a function of the simplex weight vector $w$ and eigenvector matrix $V_K$ have not been formally published.

---

## 5. Candidate Phase 9 Objectives

To determine the focus of Phase 9, we formulate four candidate objectives directly derived from the evidence chain:

| Candidate Objective | Description | Target Scope |
| :--- | :--- | :--- |
| **Objective 1: Quantitative Master Ledger & Numerical Defense Canon** | Reconcile, verify, and freeze all numerical values across production source code, validation JSON, Module 10 traces, and Module 11 counterfactual outputs into an immutable Quantitative Master Ledger for the Module 11 → Module 12 handoff. | Pedagogical / Methodology / Defense Canon |
| **Objective 2: Chemical Space Expansion (20 BCS II/IV Compounds)** | Curate SMILES, calculate descriptors, and execute the v2 pipeline across 20 additional active pharmaceutical ingredients. | Computational Screening / Library Expansion |
| **Objective 3: Empirical Laboratory Formulation Validation** | Synthesize ASD formulations using hot-melt extrusion/spray drying and measure physical dissolution and stability. | Experimental Wet-Lab / Physical Validation |
| **Objective 4: Closed-Form Metric Tensor Conditioning Derivations** | Formulate closed-form analytical proofs bounding $\kappa(M_K)$ and proving Lipschitz continuity of $C_L$. | Pure Mathematical Analysis |

---

## 6. Evidence Required for Each Objective

### For Objective 1 (Quantitative Master Ledger):
- Direct AST inspection of `src/asd_mcda/v2/`.
- Byte-level extraction of `scientific_validation_results.json`.
- Reconciliation of all 20 scenario records in `PHASE_8_EXECUTION_RESULTS.json` and `WHAT_IF_EXPERIMENTS.md`.
- Machine-independent floating-point tolerance bounds ($|C_L^{(A)} - C_L^{(B)}| \le 10^{-12}$).
- Complete mapping of 116 production test constants.

### For Objective 2 (Chemical Space Expansion):
- Curated, validated SMILES and experimental densities for 20 new drugs.
- Literature compatibility data for ground-truth comparison.
- Modifications to `asd_framework/config/` and batch runner scripts.

### For Objective 3 (Empirical Validation):
- Physical API and polymer samples.
- Extrusion/spray-drying equipment, dissolution baths, HPLC/UV assays, DSC, and PXRD instruments.
- 6-month stability protocols under ICH conditions.

### For Objective 4 (Metric Tensor Derivations):
- Matrix perturbation theory derivations (Davis-Kahan sin $\theta$ theorem).
- Convex optimization proofs over the unit simplex $\Delta^{p-1}$.

---

## 7. Dependency Analysis

We classify the four candidate objectives across five critical execution axes:

| Evaluation Axis | Objective 1 (Quantitative Ledger) | Objective 2 (Chemical Expansion) | Objective 3 (Empirical Lab) | Objective 4 (Metric Proofs) |
| :--- | :--- | :--- | :--- | :--- |
| **Dependency** | Self-contained (Production + JSON + Modules 01–11) | External chemical databases + config edits | Physical lab equipment + materials | Pure mathematics |
| **Feasibility** | **100% Feasible** (Immediate) | Moderate (Requires config unfreeze) | **Infeasible** (No wet-lab access) | High (Requires pure math) |
| **Evidence Requirement**| Multi-source forensic reconciliation | Novel compound curation & validation | Wet-lab assay protocols & raw spectra | Formal mathematical lemmas |
| **Scientific Role** | **Viva School Core: Module 11 → 12 Handoff** | Secondary computational exploration | External empirical validation | Theoretical foundational proof |
| **Implementation Risk** | **Zero Risk** (Read-only, preserves freezes) | High (Violates repo freeze; GIGO risks)| Fatal (Cannot be executed in workspace)| Low, but bypasses Viva School needs |

---

## 8. Recommended Phase 9 Scope

Based on the evidence chain, repository freeze mandates, and the curriculum architecture, **Objective 1: Quantitative Master Ledger & Numerical Defense Canon (Module 11 → Module 12 Handoff)** is the sole recommended scope for Phase 9.

### Specific Scope Components:
1. **Pipeline Stage Constants Ledger:** Formal extraction and reconciliation of every hard-coded threshold, tolerance, and parameter across all 15 stages (e.g., $\tau_{\text{var}} = 0.95$, $\delta_{\text{block}} = 0.03$, $\delta_{\text{warn}} = 0.10$, $CR_{\text{gate}} = 0.08$, $RI_4 = 0.89$, power iteration tol $= 10^{-10}$, standardization guardrail $= 10^{-8}$, TPSA normalizer $= 200.0$, descriptor weights $[0.30, 0.30, 0.20, 0.20]$).
2. **Authoritative Baseline Ledger:** Complete 10-decimal precision records for all 5 baseline polymers (Soluplus, HPMC E5, PVP-VA64, PVP K30, Eudragit E PO) across $s_j$, $z_j$, $t_i$, $D_i^+$, $D_i^-$, $C_L$, and $p_{\text{top1}}$.
3. **Multi-Cohort Reconciliation Ledger:** Comprehensive comparison table reconciling Indomethacin ($K=3$), Ibuprofen ($K=2$), Itraconazole ($K=2$), and DRG-0002.
4. **Counterfactual Boundary Ledger:** Reconciliation of exact perturbation parameters and outcomes across CF-01 through CF-20.
5. **Monte Carlo Replicate & Block Ledger:** Reconciling the $10,000$ replicate budget, $8,600$ valid, $1,400$ blocked ($1,396$ AHP CR vs. 4 eigengap), and SE precision bounds ($SE_{\max} \approx 0.54\%$).
6. **Numerical Precision & Platform Tolerance Canon:** Establishing the strict floating-point bounds ($|C_L^{(A)} - C_L^{(B)}| \le 10^{-12}$) for cross-platform IEEE 754 execution.
7. **Module 12 Pedagogical Specification:** Formal architectural blueprint for authoring Module 12 (`12_NUMBERS_YOU_MUST_KNOW/FLASHCARDS.md` and numerical drills).

---

## 9. Explicitly Excluded Scope

To maintain absolute scientific integrity and avoid research overreach, the following areas are **strictly excluded** from Phase 9:
1. **No Production Code Modifications:** The `asd_framework` repository must remain completely clean and unmodified.
2. **No Modifications to Historical Modules:** Modules 01 through 11 are frozen and must not be altered.
3. **No Wet-Lab Assays or Claims:** No claims of experimental dissolution, amorphous stability, or physical shelf-life.
4. **No Classical TOPSIS Terminology:** The method must never be referred to as classical Euclidean Hwang-Yoon TOPSIS; it is strictly SP-PRP-TOPSIS.
5. **No K-Means Terminology:** The subspace dimension $K$ must never be referred to as K-Means clusters.
6. **No Evaluative Superlatives:** Prohibits words such as "best", "winner", "optimal", "superior" when describing polymer ranks.
7. **No Phase 9 Experiment Execution During Planning:** Phase 9 remains strictly in planning until all preflights and audit gates are formally cleared.

---

## 10. Decision

**FORMAL DECISION: ADOPT CANDIDATE OBJECTIVE 1.**

Phase 9 is formally chartered to establish the **Source-Locked Planning Package for the Module 11 → Module 12 Handoff (Quantitative Master Ledger & Numerical Defense Canon)**. This provides the doctoral candidate with an unassailable quantitative anchor, directly resolving the numerical defense gap and enabling the systematic construction of Module 12.
