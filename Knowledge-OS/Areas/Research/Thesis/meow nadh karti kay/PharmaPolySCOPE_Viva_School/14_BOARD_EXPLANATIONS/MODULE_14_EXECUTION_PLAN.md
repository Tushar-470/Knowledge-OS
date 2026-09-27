# MODULE 14: BOARD EXPLANATIONS (PREVIEW)
# Execution Architecture & Pedagogical Defense Plan

**Document ID:** `MODULE_14_EXECUTION_PLAN`  
**Module:** Module 14 — Board Explanations (Preview) (`14_BOARD_EXPLANATIONS/`)  
**Curriculum Phase:** Phase A — Planning & Source-Lock Architecture  
**Author:** Forensic Computational-Science Architect & PhD Methodology Auditor  
**Date:** September 24, 2026  
**Status:** PLANNING ONLY — NO TEACHING CONTENT AUTHORED  

---

## 1. Executive Summary & Curriculum Scope

This execution plan establishes the formal architectural, mathematical, and pedagogical blueprint for **Module 14: Board Explanations (Preview)** within the *PharmaPolySCOPE PhD Viva Defense Curriculum*. 

### 1.1 Curricular Context
In `00_MASTER_KNOWLEDGE_MAP/PHARMAPOLYSCOPE_MASTER_KNOWLEDGE_MAP.md`, Part 14 is designated as:
- **Title:** `Part 14 -- Board Explanations (Preview)`
- **Curriculum Folder:** `14_BOARD_EXPLANATIONS\`
- **Scope Note:** `*(Phase 2 whiteboard scripts)*`
- **Recommended Learning Sequence:** `Step 13: Part 14 (Board Explanations -- Phase 2) -- Whiteboard practice`

Module 14 represents the transition from quantitative recall (Module 12) and epistemic boundary defense (Module 13) to **real-time whiteboard execution** during hostile viva examination. When an examiner says:
> *"Step up to the board and show me how your pipeline works..."* or  
> *"Draw the AHP matrix and prove consistency right now..."* or  
> *"Sketch the Indomethacin spectrum and justify K=3..."*

the PhD candidate must execute precise, mathematically unassailable, visually legible board scripts accompanied by strictly hedged verbal commentary.

---

## 2. The Five Authoritative Board Demonstrations

Per the Master Knowledge Map (lines 826–846), Module 14 is strictly bounded to exactly **five authoritative demonstrations**. No additional scientific demonstrations are permitted.

```
+----------------------------------------------------------------------------------------------------+
|                                    MODULE 14 WHITEBOARD SCOPE                                      |
+----------------------------------------------------------------------------------------------------+
|  DEMO-01: 5-Minute Pipeline Walk (SMILES -> S -> Z -> R -> K -> AHP -> M_K -> C_L -> Ranking)      |
|  DEMO-02: AHP Consistency Demonstration (Authoritative 4x4 -> lambda_max -> CI -> CR < 0.08)       |
|  DEMO-03: Indomethacin Eigengap Board (Lambda = [2.09, 1.17, 0.74, 0.001], delta_3 = 0.738, K=3)    |
|  DEMO-04: SP-PRP-TOPSIS Geometry (M_K = V_K^T W V_K, PCA Subspace + Preference Metric vs Classical)  |
|  DEMO-05: v1.5 vs v2 AHP Architectural Distinction (2x2 PC-space vs 4x4 Physical Criteria Space)   |
+----------------------------------------------------------------------------------------------------+
```

### Detailed Deconstruction of the 5 Demonstrations:

### DEMO-01: The 5-Minute Master Pipeline Walk
- **Pedagogical Target:** Rapid, comprehensive visual synthesis of the 9-stage operational pipeline (Steps 0–8).
- **Whiteboard Flow:**
  1. `SMILES Input`: Authentic SMILES parsing via RDKit (`chemistry.py`), strict input validation (no fallbacks in Research mode).
  2. `Compatibility Matrix S`: Dimension $5 \times 4$, all elements bounded in $[0, 1]$ across criteria $(s_{\text{HSP}}, s_\chi, s_{\text{desc}}, s_{\text{GT}})$.
  3. `Standardization Z`: $Z_{ij} = (S_{ij} - \mu_j) / \sigma_j$ with population std ($\text{ddof}=0$) and zero-variance guardrail ($10^{-8}$).
  4. `Correlation Matrix R`: $R = \frac{1}{n} Z^T Z$ ($4 \times 4$).
  5. `Spectral Decomposition & K Selection`: Eigendecomposition via `scipy.linalg.eigh`, sorted descending, dynamic $K = \min \{k : \text{cumVar}(k) \ge 0.95\}$.
  6. `AHP Preference Weighting`: Principal eigenvector of $4 \times 4$ physical criteria matrix, $CR < 0.08 \Rightarrow w_{\text{phys}}$.
  7. `Subspace Metric Tensor M_K`: $M_K = V_K^T W V_K$ ($K \times K$).
  8. `Rebaselined Reference Points & Projection`: $s^+ = [1,1,1,1]^T, s^- = [0,0,0,0]^T \Rightarrow t^+ = z^+ V_K, t^- = z^- V_K$.
  9. `Closeness & Full Ranking`: $D_i^+, D_i^- \Rightarrow C_L = D_i^- / (D_i^+ + D_i^-) \Rightarrow$ deterministic ranking.

### DEMO-02: AHP Consistency Demonstration & Proof
- **Pedagogical Target:** Defend the preference structure by drawing the canonical $4 \times 4$ matrix, computing eigenvalue bounds, and demonstrating governance acceptance.
- **Whiteboard Flow:**
  1. `Matrix Construction`: Draw authoritative $4 \times 4$ matrix $A$:
     $$A = \begin{bmatrix} 1.0 & 2.0 & 3.0 & 2.0 \\ 0.5 & 1.0 & 5.0 & 2.0 \\ 1/3 & 0.2 & 1.0 & 0.5 \\ 0.5 & 0.5 & 2.0 & 1.0 \end{bmatrix}$$
  2. `Reciprocity Check`: $a_{ji} = 1 / a_{ij}$ (machine check $|a_{ji} a_{ij} - 1| < 10^{-12}$).
  3. `Eigenvalue Bounds`: Show $\lambda_{\max} = 4.1319$ (exceeds $n=4$ due to positive reciprocity; Saaty theorem $\lambda_{\max} \ge n$).
  4. `Consistency Index (CI)`:
     $$CI = \frac{\lambda_{\max} - n}{n - 1} = \frac{4.131937 - 4}{3} = 0.043979 \approx 0.0440$$
  5. `Consistency Ratio (CR)`:
     $$CR = \frac{CI}{RI_4} = \frac{0.043979}{0.89} = 0.049415 \approx 0.0494$$
  6. `Governance Gate`: $CR = 0.0494 < 0.08 \Rightarrow$ **ACCEPTED**.
  7. `Resulting Weight Allocation`: $w = [0.4077, 0.3244, 0.0922, 0.1757]^T$.

### DEMO-03: Indomethacin Eigengap Board & Subspace Stability
- **Pedagogical Target:** Whiteboard bar chart of eigenvalues, spectral gap calculation, and justification of dynamic dimension $K=3$.
- **Whiteboard Flow:**
  1. `Eigenvalue Spectrum`: Draw horizontal or vertical bar chart with 4 eigenvalues:
     - $\lambda_1 \approx 2.0909$ ($52.27\%$ variance)
     - $\lambda_2 \approx 1.1679$ ($29.20\%$ variance)
     - $\lambda_3 \approx 0.7398$ ($18.49\%$ variance)
     - $\lambda_4 \approx 0.0015$ ($0.04\%$ variance)
  2. `Cumulative Variance Curve`: Show $\text{cumVar}(1) = 52.27\%, \text{cumVar}(2) = 81.47\% < 95\%, \text{cumVar}(3) = 99.9634\% \ge 95\% \Rightarrow K=3$.
  3. `Boundary Eigengap Calculation`:
     $$\delta_3 = \lambda_3 - \lambda_4 = 0.739775 - 0.001464 = 0.738310 \approx 0.7383$$
  4. `Governance Threshold Evaluation`:
     - $\delta_K \ge 0.10 \Rightarrow$ **STABLE** (Indomethacin $\delta_3 = 0.7383 \gg 0.10$).
     - $[0.03, 0.10) \Rightarrow$ **WARNING**.
     - $< 0.03 \Rightarrow$ **BLOCKED** (`DegenerateSubspaceBlockedError`).
  5. `Mathematical Interpretation`: The third-to-fourth eigenvalue gap is large, providing a numerically separated retained-subspace boundary under the project's eigengap governance rule.

### DEMO-04: SP-PRP-TOPSIS Metric Tensor Geometry
- **Pedagogical Target:** Contrast Subspace-Projected Rebaselined Reference Point TOPSIS with classical Hwang-Yoon TOPSIS on the board.
- **Whiteboard Flow:**
  1. `The Metric Tensor Equation`:
     $$M_K = V_K^T W V_K$$
     where $V_K \in \mathbb{R}^{4 \times K}$ (orthonormal basis of PCA subspace) and $W = \text{diag}(w_{\text{phys}}) \in \mathbb{R}^{4 \times 4}$ (AHP diagonal preference tensor).
  2. `Dual-Role Geometric Demonstration`:
     - $V_K$ rotates and projects the physical coordinate axes onto the empirical cohort variance subspace, eliminating inter-criterion collinearity.
     - $W$ weights the original physical criteria according to expert decision preferences.
     - $M_K$ synthesizes both into a unified positive-definite quadratic-form metric induced by physical AHP weighting in the PCA subspace.
  3. `Contrast with Classical TOPSIS`:
     - Classical TOPSIS uses Euclidean distance in the selected criterion representation, whereas SP-PRP-TOPSIS evaluates projected coordinates using the positive-definite quadratic-form metric $M_K = V_K^T W V_K$ and rebaselines ideal points per cohort.

### DEMO-05: Architectural Distinction: v1.5 vs. v2 AHP
- **Pedagogical Target:** Clarify the historical evolution from v1.5 fixed-dimension PCA to v2 variable-K physical-criterion AHP.
- **Whiteboard Flow:**
  1. `v1.5 Paradigm (Historical / Deprecated)`:
     - Ran AHP over *Principal Components*: $2 \times 2$ matrix over $\{PC_1, PC_2\}$ ($[[1.0, 2.0], [0.5, 1.0]]$).
     - Methodological limitation of the historical v1.5 design: An expert cannot express meaningful domain preferences over abstract orthogonal eigenvectors ($PC_1, PC_2$) whose composition changes with every drug cohort.
     - Imposed rigid $K=2$ regardless of data variance.
  2. `v2 Paradigm (Active Production Engine)`:
     - Runs AHP over *Physical Compatibility Criteria*: $4 \times 4$ matrix over $\{s_{\text{HSP}}, s_\chi, s_{\text{desc}}, s_{\text{GT}}\}$.
     - Domain validity: The AHP matrix encodes expert preference among the four computational compatibility criteria ($s_{\text{HSP}}, s_\chi, s_{\text{desc}}, s_{\text{GT}}$), providing decision-theoretic preference weights rather than attempting to quantify physical causal mechanisms.
     - Dynamic $K$ selection via cumulative variance ($95\%$) and metric tensor $M_K = V_K^T W V_K$ mathematically projects physical preferences into the data-driven subspace.

---

## 3. Four-Quadrant Whiteboard Drill Architecture

To ensure pedagogical efficacy and auditability during viva preparation, every future board script authored in Module 14 must adhere to a standardized **Four-Quadrant Delivery Structure**:

```
+----------------------------------------------------------------------------------------------------+
|                               FOUR-QUADRANT BOARD SCRIPT ARCHITECTURE                              |
+------------------------------------+---------------------------------------------------------------+
|  1. WHAT I DRAW                    |  2. WHAT I WRITE                                              |
|  - ASCII board layout diagram      |  - Formal mathematical equations                              |
|  - Spatial visual arrangement      |  - Exact numerical coordinates (dual-tier precision)          |
|  - Geometric axes, boxes, arrows   |  - Subscripts, units, and governance threshold inequalities   |
+------------------------------------+---------------------------------------------------------------+
|  3. WHAT I SAY                     |  4. WHAT I MUST NOT CLAIM                                     |
|  - Crisp 15-30 second spoken lines |  - Epistemic boundary constraints (locked to Module 13)       |
|  - Verbal transitions & pacing     |  - Forbidden causal/mechanistic words purged                  |
|  - Direct, confident viva answers  |  - Proxy modeling boundaries strictly maintained              |
+------------------------------------+---------------------------------------------------------------+
```

---

## 4. Module 13 Dependency Boundary

A strict separation of concerns is maintained between Module 13 and Module 14:
- **Module 13 (Do NOT Say This in Viva):** Establishes the *negative boundary space* — the catalog of 36 forbidden assertions, 20 examiner traps, and 32 epistemic ledger rules.
- **Module 14 (Board Explanations):** Establishes the *positive operational execution* — how to physically draw diagrams, write formulas, and verbally articulate permitted concepts on a board.

**Enforcement Rule:** Every board script in Module 14 must cite its corresponding Module 13 negative boundary rules (e.g., `FC-01`, `FC-19`, `FC-27`, `TRAP-01`, `TRAP-16`), ensuring that whiteboard presentation never crosses into unsupported causal claims.

---

## 5. Five-Phase Module Lifecycle

Module 14 follows the established PharmaPolySCOPE rigorous 5-phase execution model:

```
[ PHASE A: Planning & Source Lock ] <--- CURRENT PHASE
    |
    v
[ PHASE B: Whiteboard Script Authoring ]
    |
    v
[ PHASE C: Independent Forensic Content Audit ]
    |
    v
[ PHASE D: Forensic Repair ] (if defects found)
    |
    v
[ PHASE E: Final Freeze Review & Certification ]
```

- **Phase A (Current):** Source lock, numerical reconciliation, deliverable architecture, and gate specification. Zero teaching content authored.
- **Phase B (Awaiting Authorization):** Authoring of `WHITEBOARD_SCRIPTS.md` implementing the 5 authorized demonstrations across the 4-quadrant format.
- **Phase C:** Independent line-by-line audit against production code, validation JSON, and Module 12/13 baselines.
- **Phase D:** Precision repairs if any P0/P1/P2/P3 defects are identified.
- **Phase E:** Final freeze certification (`MODULE_14_FINAL_FREEZE_AUDIT.md`) and status recording (`MODULE_14_STATUS = FROZEN`).

---

## 6. Minimal Auditable Deliverable Set

The deliverable set for Module 14 is scoped strictly to what is justified by authoritative curriculum sources:

| Deliverable ID | File Name | Role / Phase | Status |
| :--- | :--- | :--- | :---: |
| **D1 (Planning)** | `MODULE_14_EXECUTION_PLAN.md` | Master execution blueprint & 4-quadrant architecture | **AUTHORED** |
| **D2 (Planning)** | `MODULE_14_SOURCE_LOCK.md` | Source lock table across 11 sources & numerical freezes | **AUTHORED** |
| **D3 (Planning)** | `MODULE_14_AUDIT_GATE_SPECIFICATION.md` | Proposed governance gates G0–G6 with verification metrics | **AUTHORED** |
| **D4 (Content)** | `WHITEBOARD_SCRIPTS.md` | Primary teaching deliverable: 5 full board scripts | *Phase B Pending* |
| **D5 (Certification)**| `MODULE_14_EXECUTION_RESULTS.json` | Machine-readable SHA-256 signatures & metrics | *Phase B/C Pending* |
| **D6 (Certification)**| `MODULE_14_FORENSIC_AUDIT.md` | Independent static gate audit report | *Phase C Pending* |
| **D7 (Freeze)** | `MODULE_14_FINAL_FREEZE_AUDIT.md` | Final freeze certificate & closeout | *Phase E Pending* |

*End of MODULE_14_EXECUTION_PLAN.md*
