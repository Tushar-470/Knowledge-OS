# MODULE 15 — Mn OPTIONALITY ARCHITECTURE SPECIFICATION
## STRICT SOURCE-OF-TRUTH FORENSIC REPAIR AUDIT

**Document ID:** `PS-VIVA-MOD15-AUDIT-001`  
**Audit Date:** 2026-09-24  
**Auditor:** Forensic Runtime Auditor & Curriculum Architect  
**Target Artifact:** `MODULE_15_MN_OPTIONALITY_ARCHITECTURE_SPEC.md` (`PS-VIVA-MOD15-SPEC-001`)  
**Target Repository:** `indomethacin-asd-framework` (Main branch, Commit `285c3d7`, Baseline `v1.5.0-FOUR-CRITERION-FREEZE`)  
**Active v2 Mathematical Engine:** Knowledge-OS Viva School Master Architecture (Modules 00–14)  
**Audit Scope:** Design Specification Forensic Verification against Active Source of Truth  
**Authorization Status:** READ-ONLY FORENSIC AUDIT — NO CODE MODIFICATION AUTHORIZED  

---

## 1. Executive Verdict

### **1.1 Forensic Verdict: HOLD FOR SPECIFICATION REPAIR**
A comprehensive, line-by-line forensic audit of `MODULE_15_MN_OPTIONALITY_ARCHITECTURE_SPEC.md` was conducted against the active source code in `indomethacin-asd-framework` and the authoritative mathematical foundation established in Viva School Modules 00–14.

* **Primary Scientific Decoupling Confirmed [FACT]:** The specification correctly establishes that number-average molecular weight ($M_n$) has **zero presence and zero mathematical dependency** in the active 4-criterion decision matrix $S = [s_{\text{HSP}}, s_\chi, s_{\text{desc}}, s_{\text{GT}}]$, standardized matrix $Z$, correlation matrix $R$, variance-threshold $K$-selection, PCA coordinate projection $T = Z V_K$, AHP preference weights $W$, the positive-definite metric tensor $M_K = V_K^T W V_K$, ideal/anti-ideal points $t^\pm$, quadratic-form distances $D_i^\pm$, closeness coefficients $C_L$, Morris screening, and Monte Carlo uncertainty propagation. Counterfactual omission of $M_n$ produces $\Delta C_L = 0.000000$ and zero rank shifts across the tested Indomethacin cohort.
* **Flory-Huggins Diagnostic Decoupling Confirmed [FACT]:** The candidate-level condition $\chi < \chi_c$ computed in `flory_huggins.py` is strictly descriptive and non-exclusionary (e.g. Eudragit E PO fails $\chi < \chi_c$ but is ranked #5 in the Indomethacin benchmark).
* **Defects Identified [AUDIT FINDING]:** While the foundational premise is solid, the specification contains **7 specific defects** spanning API ingress validation consistency, range mathematics, small-molecule classification claims, missing active v2 equations, provenance overclaims, and v1.5/v2 shared-infrastructure isolation.
* **Defect Counts:**
  * **P0 (Critical Breaking Defects):** 0
  * **P1 (High Severity Architectural / Mathematical Defects):** 4
  * **P2 (Medium Severity Epistemic / Governance Defects):** 2
  * **P3 (Low Severity Notation / Formatting Defects):** 1
  * **Total Defects:** 7
  * **Unsupported Claims Found (Class D):** 3
* **Action Decision:** `HOLD_FOR_SPEC_REPAIR` / `GO_TO_SPEC_REPAIR`. The specification must undergo a focused Phase D repair before final certification.

---

## 2. Critical Defect Table

The following table itemizes all defects discovered in `MODULE_15_MN_OPTIONALITY_ARCHITECTURE_SPEC.md`:

| Defect ID | Severity | Target Location in Spec | Defect Description | Root Cause | Required Correction |
| :---: | :---: | :--- | :--- | :--- | :--- |
| **DEF-01** | **P1** | Section 8 (Table rows D & E, lines 312–313) | **API Ingress Rejection vs Downstream Fallback Contradiction:** States D ($M_n = 0$) and E ($M_n < 0$) claim that core MCDA runs normally, Flory diagnostic returns `NOT_EVALUATED_INVALID_INPUT`, warning alert is shown, and report table renders diagnostic cells. In reality, Pydantic schema `PolymerCreate` with `mn_da: Optional[float] = Field(None, gt=0)` causes FastAPI to reject $M_n \le 0$ with HTTP 422 `ValidationError` at ingress. | Conflating HTTP API boundary validation with downstream internal function fallback. | Disambiguate API ingress behavior (HTTP 422 rejection) from legacy CSV / direct internal dictionary ingestion fallback (`NOT_EVALUATED_INVALID_INPUT`). |
| **DEF-02** | **P1** | Section 9 (lines 349–351), Section 8 (State J in prompt summary) | **Unsupported Monomer / Non-Polymer Domain Classifier Claim:** Spec defines status `NOT_APPLICABLE` for "small-molecule carriers or non-polymeric surfactants" and earlier notes claimed an $r_2 \approx 1$ domain exclusion. No such classifier exists anywhere in `src/asd_mcda/` or `backend/`. | Inventing domain logic not present in the active codebase. | Classify `NOT_APPLICABLE` strictly as a future proposed extension [C] or remove it from the active vocabulary. Explicitly record that no polymer/non-polymer domain classifier exists in the source code. |
| **DEF-03** | **P1** | Section 8 (Table row H, line 316) | **Missing Mathematical Derivation & Vague Rules for $M_n$ Range:** Spec specifies range $[M_{n,\min}, M_{n,\max}]$ but omits formal proof that $\chi_{c,\min} = \chi_c(M_{n,\max})$ and $\chi_{c,\max} = \chi_c(M_{n,\min})$ (monotonic inversion). Also uses undefined phrases ("Pill Badge: Green or Amber with interval bounds") instead of exact diagnostic rules. | Incomplete mathematical derivation for monotonic interval bounds. | Explicitly derive the monotonic derivative $\partial \chi_c / \partial M_n < 0$, define the inverse mapping $\chi_{c,\min} = \chi_c(M_{n,\max})$ and $\chi_{c,\max} = \chi_c(M_{n,\min})$, and define exact 3-state outcomes: (1) $\chi < \chi_{c,\min}$, (2) $\chi > \chi_{c,\max}$, (3) $\chi_{c,\min} \le \chi \le \chi_{c,\max}$. |
| **DEF-04** | **P1** | Section 1.1, Section 2.2, Section 3 | **Omission of Step-by-Step Active v2 Mathematical Sequence:** Spec refers to v2 MCDA steps by name and mentions $M_K = V_K^T W V_K$, but does not write out the complete, authoritative active mathematical equations ($S, Z, R, K, T, M_K, z^\pm, t^\pm, D_i^\pm, C_L$). | High-level architectural narrative lacking explicit equation definitions. | Add the complete active v2 mathematical equation block to Section 1 or Section 3, explicitly barring alternate metric formulations ($W^{1/2}(I + \sum \lambda v v^T)W^{1/2}$) and Euclidean distance descriptions. |
| **DEF-05** | **P2** | Section 1.1 (line 19), Section 8, Section 9 (lines 353–356) | **Overclaimed Provenance Labels & Material Certification:** Spec refers to "certified $M_n$" and introduces provenance labels (`USER_SUPPLIED_MN_CERTIFIED`, `PROVENANCE_INSUFFICIENT`, etc.) as if they are established system types. In the active code, `gate1_status` is simply `"PASS"`/`"FAIL"`, and reference polymers use literature values (not certified reference standards). | Blurring proposed schema extensions with active codebase facts. | Reclassify all advanced provenance enum states as Proposed Future Schema Extensions [C]. Replace "certified" terminology with "literature-sourced" or "user-supplied". |
| **DEF-06** | **P2** | Section 15, Section 16 (Table, lines 505–514) | **Underspecified v1.5 / v2 Version Isolation for Shared Infrastructure:** Spec marks `backend/models/schemas.py` and `backend/services/validation.py` as "VERY LOW" risk without detailing that they are shared between frozen v1.5 and v2. Directly relaxing `mn_da` in shared validation alters the contract of the frozen `v1.5.0` baseline. | Underestimating shared file coupling between frozen baseline and proposed changes. | Elevate risk to LOW/MODERATE. Explicitly define version boundary strategy (e.g. version-aware schemas or ingress branching) to guarantee that frozen v1.5 golden tests (`tests/test_report_generator_integrity.py`) remain completely protected. |
| **DEF-07** | **P3** | Section 1.1 (line 18), Section 3 (line 114), Section 14 | **Variable Nomenclature Inconsistency ($C_i$ vs $C_L$):** Spec alternates between $C_i$ (generic index notation) and $C_L$ (authoritative v2 closeness coefficient notation). | Inconsistent notation across narrative and mathematical expressions. | Standardize uniformly on $C_L$ (or $C_{L,i}$) matching Master Knowledge Map and Module 05. |

---

## 3. Mathematical Source Reconciliation

### **3.1 Authoritative Active v2 MCDA Pipeline Equations**
The specification must incorporate the exact, active mathematical sequence implemented in the v2 architecture:

1. **Active Compatibility Decision Matrix ($S$):**
   $$\mathbf{S} = [s_{\text{HSP}},\; s_\chi,\; s_{\text{desc}},\; s_{\text{GT}}] \in [0, 1]^{N \times 4}$$
   * $s_{\text{HSP}} = 1 - R_a / (2 R_0)$ (Hansen distance)
   * $s_\chi = \max(0, 1 - \chi)$ (Lindvig interaction parameter)
   * $s_{\text{desc}} = 1 - d_{\text{norm}}$ (RDKit 2D descriptor distance)
   * $s_{\text{GT}} = 1 - |T_{g,\text{blend}} - T_{g,\text{target}}| / 100$ (Gordon-Taylor glass transition)
   * **Source Verification:** $M_n$ has **zero involvement** in the construction of $S$.

2. **Column-Wise $Z$-Score Standardization ($Z$):**
   $$Z_{ij} = \frac{S_{ij} - \mu_j}{\sigma_j}, \quad \mu_j = \frac{1}{N}\sum_{i=1}^N S_{ij}, \quad \sigma_j = \sqrt{\frac{1}{N}\sum_{i=1}^N (S_{ij} - \mu_j)^2}$$
   * Produces zero-mean, unit-variance standardized matrix $Z \in \mathbb{R}^{N \times 4}$.

3. **Sample Correlation Matrix ($R$):**
   $$R = \frac{1}{N} Z^T Z \in \mathbb{R}^{4 \times 4}$$

4. **K-Selection by Active Cumulative Variance Threshold:**
   $$K = \min \left\{ k \in \{1, 2, 3, 4\} : \frac{\sum_{m=1}^k \lambda_m}{\text{Tr}(R)} \ge 0.95 \right\}$$
   * Where $\lambda_1 \ge \lambda_2 \ge \lambda_3 \ge \lambda_4 > 0$ are the sorted eigenvalues of $R$.
   * **Critical Distinction:** $K$-selection is governed strictly by the cumulative variance threshold (e.g. 95%), **NOT by the eigengap**.
   * **Eigengap Role:** The eigengap $\Delta_K = \lambda_K - \lambda_{K+1}$ is a **post-selection stability and governance diagnostic** used to monitor subspace boundary degeneracy. It does not select $K$.

5. **Subspace Coordinate Projection ($T$):**
   $$T = Z V_K \in \mathbb{R}^{N \times K}$$
   * Where $V_K = [v_1, \dots, v_K] \in \mathbb{R}^{4 \times K}$ contains the orthonormal eigenvectors corresponding to the top $K$ eigenvalues.

6. **Subspace Metric Tensor ($M_K$):**
   $$M_K = V_K^T W V_K \in \mathbb{R}^{K \times K}$$
   * Where $W = \text{diag}(w_{\text{AHP}}) = \text{diag}([w_{\text{HSP}}, w_\chi, w_{\text{desc}}, w_{\text{GT}}])$ represents the decision-theoretic AHP preference weights (satisfying $\sum w_j = 1, w_j > 0$).
   * Symmetry is formally enforced: $M_K \leftarrow 0.5(M_K + M_K^T)$.
   * Positive-definiteness is verified: $\min(\text{eig}(M_K)) > 10^{-12}$.
   * **Banned Alternate Formulations:**
     * The expression $W^{1/2}(I + \sum \lambda_k v_k v_k^T)W^{1/2}$ is **strictly prohibited**. It does not exist in the active source code.
     * Any unsupported $4 \times 4$ full-space formulation when $K < 4$ is invalid. $M_K$ is strictly $K \times K$.

7. **Ideal and Anti-Ideal Anchor Projections ($t^\pm$):**
   In standardized space:
   $$z_j^+ = \frac{1 - \mu_j}{\sigma_j}, \quad z_j^- = \frac{0 - \mu_j}{\sigma_j}, \quad j \in \{1, 2, 3, 4\}$$
   Projected into PCA subspace:
   $$t^+ = z^+ V_K \in \mathbb{R}^{1 \times K}, \quad t^- = z^- V_K \in \mathbb{R}^{1 \times K}$$

8. **Quadratic-Form Subspace Distances ($D_i^\pm$):**
   $$D_i^+ = \sqrt{(t_i - t^+)^T M_K (t_i - t^+)}$$
   $$D_i^- = \sqrt{(t_i - t^-)^T M_K (t_i - t^-)}$$
   * **Critical Distinction:** Distances in SP-PRP-TOPSIS are **NOT ordinary Euclidean distances**. They are weighted quadratic-form metric distances in the decorrelated PCA subspace induced by physical AHP weighting.

9. **Relative Closeness Coefficient ($C_L$):**
   $$C_L(i) = \frac{D_i^-}{D_i^+ + D_i^-} \in [0, 1]$$
   * Candidate ranking is obtained by sorting $C_L(i)$ in descending order.

### **3.2 Flory-Huggins Critical Parameter & Exact Comparator**
* **Active Critical Equation:**
  $$\chi_c = \frac{1}{2}\left(1 + \frac{1}{\sqrt{r_2}}\right)^2, \quad r_2 = \frac{V_{\text{m,poly}}}{V_{\text{m,drug}}} = \frac{M_n / \rho_{\text{poly}}}{M_{\text{drug}} / \rho_{\text{drug}}}$$
* **Exact Active Comparator Operator [FACT]:**
  Inspected directly in `src/asd_mcda/compatibility/flory_huggins.py:23–26`:
  ```python
  def evaluate_gate1_diagnostic(chi: float, chi_c: float) -> str:
      if chi < chi_c:
          return "PASS"
      else:
          return "FAIL"
  ```
  * The active operator is **strictly less than (`<`)**.
  * Favorable condition: $\chi < \chi_c \implies$ `PASS` (Target: `EVALUATED_MISCIBLE`).
  * Unfavorable condition: $\chi \ge \chi_c \implies$ `FAIL` (Target: `EVALUATED_PHASE_SEPARATION_RISK`).
  * The specification must not use `\le` or `<=` for the favorable condition.

---

## 4. Mn Input-State Contract Audit

The specification must cleanly distinguish between **API Ingress Rejection** (HTTP 422 handled by FastAPI/Pydantic) and **Internal Pipeline Handling** (for unvalidated dicts/CSVs). The complete 10-state behavior is audited below:

| State | Input Condition | API Schema Ingress Behavior | Downstream Core MCDA | Flory-Huggins Diagnostic | User-Facing Outcome & Status | Provenance & Log Classification |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| **A** | **Valid $M_n > 0$** <br>*(e.g. `40000.0`)* | Accepted (HTTP 200). Passes Pydantic `gt=0`. | Runs normally. Matrix $S$ built. | Computes $r_2, \chi_c$. Evaluates $\chi < \chi_c$. | Displays $\chi, \chi_c$. Status: `EVALUATED_MISCIBLE` (if $\chi < \chi_c$) or `EVALUATED_PHASE_SEPARATION_RISK` (if $\chi \ge \chi_c$). | User-provided or catalog literature citation. |
| **B** | **Absent / Omitted** <br>*(Field omitted)* | Accepted (HTTP 200). `mn_da` defaults to `None`. | **Runs normally.** Zero numerical drift. | **Bypassed.** $\chi_c = \text{None}$. Status: `NOT_EVALUATED_MN_UNAVAILABLE`. | UI/PDF: Neutral badge: *"Diagnostic Omitted (Mn Unavailable)"*. No failure implication. | Logged as `NOT_PROVIDED`. |
| **C** | **Explicit `null` / `None`** | Accepted (HTTP 200). Deserialized as `None`. | **Runs normally.** Zero numerical drift. | **Bypassed.** Identical to State B. | Identical to State B. | Logged as `EXPLICIT_NULL`. |
| **D** | **Zero ($M_n = 0$)** | **Rejected at Ingress (HTTP 422 Unprocessable Entity).** Fails `gt=0`. | Not reached via API. *(Legacy CSV fallback: runs normally).* | Not reached via API. *(CSV fallback: bypassed; `NOT_EVALUATED_INVALID_INPUT`).* | API error: `Input should be greater than 0`. UI highlights invalid field. | Logged as `REJECTED_AT_INGRESS`. |
| **E** | **Negative ($M_n < 0$)** | **Rejected at Ingress (HTTP 422 Unprocessable Entity).** Fails `gt=0`. | Not reached via API. *(Legacy CSV fallback: runs normally).* | Not reached via API. *(CSV fallback: bypassed; `NOT_EVALUATED_INVALID_INPUT`).* | API error: `Input should be greater than 0`. UI highlights invalid field. | Logged as `REJECTED_AT_INGRESS`. |
| **F** | **$M_n$ Range $[M_{n,\min}, M_{n,\max}]$** | Accepted if range schema supported; otherwise parses scalar. | Runs normally. Matrix $S$ built. | Computes $[\chi_{c,\min}, \chi_{c,\max}]$. Evaluates bounding conditions. | Displays bounding interval. Status: `EVALUATED_MISCIBLE_RANGE`, `EVALUATED_PHASE_SEPARATION_RISK_RANGE`, or `EVALUATED_CONDITIONAL_RANGE`. | Logged as `USER_SUPPLIED_RANGE`. |
| **G** | **Non-numeric String** <br>*(e.g. `"40k"`)* | **Rejected at Ingress (HTTP 422 Unprocessable Entity).** Fails float parse. | Not reached via API. *(Legacy CSV fallback: runs normally).* | Not reached via API. *(CSV fallback: bypassed; `NOT_EVALUATED_INVALID_INPUT`).* | API error: `Input should be a valid number`. UI highlights invalid field. | Logged as `REJECTED_AT_INGRESS`. |
| **H** | **$M_w$-Only Provided** | Accepted if $M_w$ optional field exists. `mn_da` is `None`. | **Runs normally.** Zero substitution. | **Bypassed.** Status: `NOT_EVALUATED_MN_UNAVAILABLE`. **Zero substitution.** | Notice: *"Mw provided but cannot substitute for Mn in lattice entropy."* Diagnostic omitted. | Logged as `MW_ONLY_MN_UNAVAILABLE`. |
| **I** | **Both $M_n$ and $M_w$** | Accepted. If $M_w < M_n$, validation warning emitted. | Runs normally. | Evaluates $\chi_c(M_n)$. Calculates $\text{PDI} = M_w/M_n$. | Displays diagnostic and verified PDI. If $M_w < M_n$, warning: *"Unphysical PDI < 1.0"*. | Logged with literature provenance for both moments. |
| **J** | **Unknown / Unverified Provenance** | Accepted. `provenance_notes` is empty. | Runs normally. | Evaluates $\chi_c(M_n)$ normally. | Displays $\chi_c$ with provenance advisory: *"Provenance unverified: value not cross-referenced to literature."* | Logged as `PROVENANCE_UNVERIFIED`. |

### **4.1 Mathematical Derivation for $M_n$ Range Inversion (State F)**
In classical Flory-Huggins lattice theory:
$$\chi_c(M_n) = \frac{1}{2}\left(1 + \frac{1}{\sqrt{r_2(M_n)}}\right)^2, \quad \text{where } r_2(M_n) = \frac{M_n / \rho_{\text{poly}}}{V_{\text{m,drug}}}$$
Taking the first derivative with respect to $M_n$ for $M_n > 0$:
$$\frac{\partial r_2}{\partial M_n} = \frac{1}{\rho_{\text{poly}} V_{\text{m,drug}}} > 0$$
$$\frac{\partial \chi_c}{\partial M_n} = \left(1 + \frac{1}{\sqrt{r_2}}\right) \cdot \left(-\frac{1}{2 r_2^{3/2}}\right) \cdot \frac{\partial r_2}{\partial M_n} = -\frac{1 + 1/\sqrt{r_2}}{2 r_2^{3/2} \rho_{\text{poly}} V_{\text{m,drug}}} < 0$$
Since $\frac{\partial \chi_c}{\partial M_n} < 0$ strictly across the positive domain $(0, \infty)$, $\chi_c$ is a **strictly monotonically decreasing function of $M_n$**.

Therefore, for any valid molecular weight interval $[M_{n,\min}, M_{n,\max}]$ where $0 < M_{n,\min} \le M_{n,\max}$:
$$\chi_{c,\min} = \chi_c(M_{n,\max})$$
$$\chi_{c,\max} = \chi_c(M_{n,\min})$$
The bounding critical interval is $[\chi_{c,\min}, \chi_{c,\max}] = [\chi_c(M_{n,\max}), \chi_c(M_{n,\min})]$.

**Deterministic Diagnostic Rules for Range Evaluation:**
1. **Case 1 (Unconditional Miscibility Likelihood):**
   If $\chi < \chi_{c,\min}$:
   Candidate satisfies $\chi < \chi_c(M_n)$ across the entire molecular weight distribution.
   Status: `EVALUATED_MISCIBLE_RANGE`.  
   UI Text: *"Miscible likelihood across full molecular weight range (χ < χc,min)."*
2. **Case 2 (Unconditional Phase-Separation Risk):**
   If $\chi \ge \chi_{c,\max}$:
   Candidate violates $\chi < \chi_c(M_n)$ across the entire molecular weight distribution.
   Status: `EVALUATED_PHASE_SEPARATION_RISK_RANGE`.  
   UI Text: *"Phase-separation risk across full molecular weight range (χ ≥ χc,max)."*
3. **Case 3 (Conditional / Molecular Weight-Dependent Boundary):**
   If $\chi_{c,\min} \le \chi < \chi_{c,\max}$:
   Thermodynamic miscibility depends on chain length fraction. Low-$M_n$ chains are miscible; high-$M_n$ chains risk phase separation.
   Status: `EVALUATED_CONDITIONAL_RANGE`.  
   UI Text: *"Molecular weight-dependent phase boundary (χc,min ≤ χ < χc,max). Miscibility sensitive to high-MW fraction."*

---

## 5. v1.5 / v2 Isolation Audit

PharmaPolySCOPE v1.5 was formally frozen under git tag `v1.5.0-FOUR-CRITERION-FREEZE`. An architectural audit of repository dependencies revealed critical shared infrastructure between the frozen baseline and v2:

```
[SHARED INFRASTRUCTURE DEPENDENCY MAP]

backend/models/schemas.py (PolymerCreate) 
    ├── Used by v1.5 API endpoints (/api/polymers, /api/screening)
    └── Used by proposed v2 diagnostic workflows

backend/services/validation.py (validate_polymer_input)
    ├── Enforces required fields for v1.5 screening runs
    └── Currently mandates mn_da in required_fields list

src/asd_mcda/polymer/polymer_library.py (Polymer.from_dict)
    ├── Parses polymer CSVs and API payloads for v1.5 orchestrator
    └── Currently assumes mn_da is a valid float

backend/services/pdf_report_generator.py (PDFReportGenerator)
    ├── Renders official 14-page v1.5.0-FOUR-CRITERION-FREEZE PDF report
    └── Golden tests in tests/test_report_generator_integrity.py assert exact v1.5 strings
```

### **5.1 Compatibility Risk Analysis**
* **The Shared Schema Vulnerability:** Modifying `backend/models/schemas.py:PolymerCreate` directly to make `mn_da` optional relaxes the validation contract across **all** consumers, including any legacy v1.5 test fixtures and endpoints.
* **The PDF Generator Regression Risk:** In `tests/test_report_generator_integrity.py`, Test 3 asserts `"v1.5.0-FOUR-CRITERION-FREEZE"` and Test 5 asserts canonical equations. If `pdf_report_generator.py` alters its diagnostic table rendering without checking the active engine version, existing baseline regression tests could fail.

### **5.2 Required Version Isolation Strategy**
To maintain 100% compliance with frozen baseline commitments:
1. **API Schema Versioning:** Retain `PolymerCreate` with version parameter or introduce `PolymerCreateV2` where `mn_da` is optional, ensuring legacy endpoints can continue to enforce strict v1.5 contracts if called under a v1.5 flag.
2. **Report Generator Version Branching:** In `pdf_report_generator.py`, the diagnostic section must check the analysis metadata `engine_version`. If `v1.5.0-FOUR-CRITERION-FREEZE` is specified, it renders according to the frozen v1.5 contract; if v2 is specified, it renders the decoupled diagnostic table.
3. **Reference Catalog Immutability:** `config/polymers/polymer_library_v3_five_polymers.csv` must remain 100% byte-for-byte identical.

---

## 6. Terminology Audit

The specification's terminology was checked against authoritative project standards:

| Term in Spec | Authoritative Status | Audit Finding | Correction / Standard Term |
| :--- | :--- | :--- | :--- |
| "Gate 1" (Candidate level) | Deprecated / Colliding | Confuses diagnostic check with exclusion filter. | **Flory-Huggins Phase-Boundary Diagnostic** |
| "Gate 1" (Cohort level) | Inactive Screening QC | Cohort-level RED diversity filter. | **HSP Cohort Feasibility Screen** |
| "Euclidean closeness" | **Mathematically Incorrect** | SP-PRP-TOPSIS uses a quadratic-form metric $M_K = V_K^T W V_K$ in PCA subspace, not Euclidean distance. | **Relative Closeness Coefficient ($C_L$) under Quadratic Metric $M_K$** |
| "Eigengap K-selection" | **Functionally Incorrect** | $K$ is selected via the cumulative variance threshold ($\ge 95\%$). The eigengap is a post-selection governance metric. | **Cumulative Variance Threshold $K$-Selection** & **Post-Selection Eigengap Governance** |
| "AHP physical weights" | Ambiguous | AHP weights represent decision-theoretic expert preference tradeoffs, not intrinsic physical properties of matter. | **Decision-Theoretic AHP Preference Weights** |
| "Certified $M_n$" | Unsupported Claim [D] | Commercial polymers do not carry certified $M_n$ standards; values are literature estimates. | **Curated Literature $M_n$** or **User-Supplied $M_n$** |
| "Dual status" | Undefined phrase | Lacks mathematical precision for range outcomes. | **Molecular Weight-Dependent Phase Boundary** |

---

## 7. Implementation File-Map Audit

The 8 files proposed in Section 16 of the specification were audited for responsibility, shared infrastructure, and implementation risk:

| Proposed File | Current Responsibility | Target Responsibility | Shared v1.5/v2? | Version Isolation Required? | Specification Risk | Audited Reassessed Risk | Audit Rationale |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| `backend/models/schemas.py` | Pydantic API schemas | `mn_da: Optional[float] = Field(None, gt=0)` | **YES** | **YES** | VERY LOW | **LOW / MODERATE** | Shared across API routes; must ensure v1.5 endpoints or tests are not broken. |
| `backend/services/validation.py` | Ingress validation service | Remove `"mn_da"` from mandatory list | **YES** | **YES** | VERY LOW | **LOW / MODERATE** | Enforces core data integrity; version gating needed if v1.5 requires $M_n$. |
| `src/asd_mcda/polymer/polymer_library.py` | Polymer dataclass & parser | Parse optional `mn_da` safely | **YES** | **NO** | VERY LOW | **VERY LOW** | Permissive parsing is backward compatible with all v1.5 records. |
| `src/asd_mcda/compatibility/flory_huggins.py` | Computes $\chi, \chi_c$, Gate 1 | Return `None` if $M_n$ absent; evaluate $\chi < \chi_c$ | **YES** | **NO** | LOW | **LOW** | Diagnostic-only function; does not touch core matrix $S$. |
| `src/asd_mcda/prediction/predictor.py` | Assembles prediction report | Handles `chi_c is None` in report | **YES** | **NO** | VERY LOW | **VERY LOW** | Purely presentation formatting for prediction results. |
| `backend/services/pdf_report_generator.py` | ReportLab PDF generator | Format absent $\chi_c$ as `"N/A"`, status as `"Diagnostic Omitted"` | **YES** | **YES** | LOW | **MODERATE** | Must preserve frozen v1.5 report layout for regression tests. |
| `frontend/src/pages/PolymerLibrary.tsx` | Polymer entry UI modal | Remove `*`, remove `mn_da <= 0` blocking | **YES** | **NO** | LOW | **LOW** | Pure frontend form usability improvement. |
| `frontend/src/pages/Results.tsx` | Results dashboard UI | Render neutral badge for un-evaluated diagnostic | **YES** | **NO** | LOW | **LOW** | UI rendering change; prevents false "FAIL" display. |

---

## 8. Material Claim Classification

All material claims in `MODULE_15_MN_OPTIONALITY_ARCHITECTURE_SPEC.md` are formally classified according to scientific and architectural truth:

### **[A] Active Implementation Facts (Verified in Source Code):**
1. Criterion 1 ($s_{\text{HSP}}$), Criterion 2 ($s_\chi$), Criterion 3 ($s_{\text{desc}}$), and Criterion 4 ($s_{\text{GT}}$) contain zero occurrences of and zero mathematical dependencies on $M_n$.
2. In the entire active codebase, $M_n$ enters exactly one computational expression: `compute_chi_critical()` in `flory_huggins.py`.
3. The Flory-Huggins condition $\chi < \chi_c$ does not exclude or disqualify candidates from the active TOPSIS ranking (e.g. Eudragit E PO fails $\chi < \chi_c$ but is ranked #5 with $C_L = 0.545616$).
4. The exact comparator in `evaluate_gate1_diagnostic()` is strict inequality (`<`).
5. Current Pydantic schema in `backend/models/schemas.py:PolymerCreate` defines `mn_da: float = Field(..., gt=0)`, which strictly rejects missing or non-positive $M_n$ at API ingress.

### **[B] Authoritative Methodology Facts (Viva School Knowledge Map):**
1. Combinatorial entropy of mixing in Flory-Huggins lattice theory depends on the number density of distinct chains ($n_2 \propto 1/M_n$). Substituting $M_w$ for $M_n$ introduces a systematic depression of $\chi_c$ by $1.3\%$ to $3.8\%$ due to polydispersity ($r_{2,M_w} = \text{PDI} \cdot r_{2,M_n}$). Naive substitution is thermodynamically invalid.
2. In the active v2 architecture, $K$-selection is performed by cumulative variance threshold ($\ge 95\%$), while the eigengap $\Delta_K = \lambda_K - \lambda_{K+1}$ is a post-selection stability diagnostic.
3. The metric tensor $M_K = V_K^T W V_K$ is a positive-definite quadratic-form metric in the PCA subspace induced by physical AHP weighting, not an ordinary Euclidean distance ruler.
4. Empirical counterfactual invariance ($\Delta C_L = 0.000000$, zero rank shifts) is formally established and verified on the canonical Indomethacin benchmark cohort (`IND-001-2026`).

### **[C] Proposed Future Architecture (Target Design, Not Yet Implemented):**
1. Relaxing `PolymerCreate.mn_da` to `Optional[float] = Field(None, gt=0)`.
2. Transitioning candidate diagnostic vocabulary from `"PASS"`/`"FAIL"` to `EVALUATED_MISCIBLE`, `EVALUATED_PHASE_SEPARATION_RISK`, and `NOT_EVALUATED_MN_UNAVAILABLE`.
3. Standardizing nomenclature from "Gate 1" to "Flory-Huggins Phase-Boundary Diagnostic" (candidate level) and "HSP Cohort Feasibility Screen" (cohort level).
4. Range support $[M_{n,\min}, M_{n,\max}]$ mapping to $[\chi_c(M_{n,\max}), \chi_c(M_{n,\min})]$.

### **[D] Unsupported / Invented / Source-Conflicting Claims (Defects):**
1. **CLAIM:** Excipients can be classified as non-polymeric carriers or lipids with status `NOT_APPLICABLE` via an $r_2 \approx 1$ domain rule.  
   **FACT:** Zero classification logic or functions exist in the codebase. This is completely invented [DEF-02].
2. **CLAIM:** Reference polymers in the repository possess "certified $M_n$" values.  
   **FACT:** The values in `polymer_library_v3_five_polymers.csv` are curated literature values from technical bulletins and journal articles, not NIST/USP certified reference materials [DEF-05].
3. **CLAIM:** Ingesting $M_n = 0$ or $M_n < 0$ via the API allows the core MCDA to run normally while the diagnostic engine sets status `NOT_EVALUATED_INVALID_INPUT`.  
   **FACT:** Pydantic schema validation (`gt=0`) rejects $M_n \le 0$ at API ingress with HTTP 422 before any engine code is reached [DEF-01].

---

## 9. Exact Surgical Repair List for Phase D

To bring `MODULE_15_MN_OPTIONALITY_ARCHITECTURE_SPEC.md` into 100% compliance with the active source of truth, the following 7 surgical repairs must be executed in Phase D:

1. **Repair REP-01 (Fix Ingress vs Downstream Logic for States D & E):**
   * *Target:* Section 8, Table rows D and E.
   * *Action:* Update the table to explicitly state that under the Pydantic API schema, inputs with $M_n \le 0$ or non-numeric strings are rejected at API ingress with HTTP 422 `ValidationError`. Clarify that `NOT_EVALUATED_INVALID_INPUT` is strictly an internal fallback for unvalidated legacy CSV or internal dictionary loaders.
2. **Repair REP-02 (Remove / Reclassify Monomer Classifier):**
   * *Target:* Section 9 (lines 349–351).
   * *Action:* Remove `NOT_APPLICABLE` from the active candidate status vocabulary or explicitly mark it as a `Proposed Future Domain Classifier [C]`. Remove all statements implying that an $r_2 \approx 1$ domain classifier currently exists.
3. **Repair REP-03 (Add Mathematical Derivation for $M_n$ Range Inversion):**
   * *Target:* Section 8, Table row H and add new Section 8.1.
   * *Action:* Insert the formal derivative proof $\partial \chi_c / \partial M_n < 0$, establish $\chi_{c,\min} = \chi_c(M_{n,\max})$ and $\chi_{c,\max} = \chi_c(M_{n,\min})$, and define the three exact diagnostic outcomes: `EVALUATED_MISCIBLE_RANGE`, `EVALUATED_PHASE_SEPARATION_RISK_RANGE`, and `EVALUATED_CONDITIONAL_RANGE`.
4. **Repair REP-04 (Insert Complete Active v2 Mathematical Sequence):**
   * *Target:* Section 1.1 or Section 3.
   * *Action:* Insert the full, explicit 9-step mathematical sequence ($S, Z, R, K, T, M_K, z^\pm, t^\pm, D_i^\pm, C_L$). Explicitly bar $W^{1/2}(I + \sum \lambda v v^T)W^{1/2}$ and ordinary Euclidean distance terminology.
5. **Repair REP-05 (Reclassify Provenance Labels & Replace "Certified"):**
   * *Target:* Section 1.1, Section 8, Section 9.
   * *Action:* Replace "certified $M_n$" with "curated literature $M_n$". Mark all advanced provenance enum states as `Proposed Future Schema States [C]`.
6. **Repair REP-06 (Detail v1.5 / v2 Version Isolation & Adjust File Map Risk):**
   * *Target:* Section 15 and Section 16 (File Map).
   * *Action:* Update the file map to indicate which files are shared between v1.5 and v2, state whether version isolation is required, and adjust risk ratings to reflect shared infrastructure dependencies.
7. **Repair REP-07 (Standardize Variable Notation on $C_L$):**
   * *Target:* Throughout document (lines 18, 98, 114, 478, 526).
   * *Action:* Replace generic index notation $C_i$ with authoritative v2 closeness coefficient notation $C_L$ (or $C_{L,i}$).

---

## 10. Go / Hold Decision

```
================================================================================
                    MODULE 15 PHASE C AUDIT DECISION
================================================================================

FINAL AUDIT VERDICT: HOLD FOR PHASE D SURGICAL SPECIFICATION REPAIR

RATIONALE:
The architectural foundation of MODULE_15_MN_OPTIONALITY_ARCHITECTURE_SPEC.md 
is scientifically and mathematically valid: Mn is 100% decoupled from the active 
v2 MCDA decision engine, and the Flory-Huggins diagnostic is non-exclusionary.
However, 7 specific defects (4 P1, 2 P2, 1 P3) must be resolved to align the 
specification with the active codebase truth, remove invented domain claims, 
provide complete mathematical derivations for range inversion, and protect the 
frozen v1.5 baseline.

PREFLIGHT REPAIR AUTHORIZATION:
- Production code modifications permitted: NO (ZERO)
- Modules 00–14 modifications permitted: NO (ZERO)
- Repair target: MODULE_15_MN_OPTIONALITY_ARCHITECTURE_SPEC.md ONLY
- Authorization status: READY FOR PHASE D SURGICAL REPAIR
================================================================================
```
