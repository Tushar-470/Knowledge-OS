# MODULE 15 — Mn OPTIONALITY & DIAGNOSTIC ARCHITECTURE SPECIFICATION

**Document ID:** `PS-VIVA-MOD15-SPEC-001-REV1`  
**Specification Date:** 2026-09-24  
**Revision:** Phase D Final Micro-Repair (REV2)  
**Author:** Forensic Runtime Auditor & Curriculum Architect  
**Scope:** Architectural Design Specification for $M_n$ Optionality, Flory-Huggins Phase-Boundary Diagnostic Decoupling, Terminology Standardization, and Version Isolation  
**Target Codebase:** PharmaPolySCOPE Production Repository (`indomethacin-asd-framework`, Commit `285c3d7`, Baseline `v1.5.0-FOUR-CRITERION-FREEZE`) & Active v2 Mathematical Engine (Modules 00–14)  
**Authorization Status:** READ-ONLY DESIGN SPECIFICATION — NO IMPLEMENTATION AUTHORIZED  
**Classification:** System Architecture, Data Contract, and Epistemic Governance Specification  

---

## 1. Problem Statement

### **1.1 The Mandatory Input Paradox**
PharmaPolySCOPE accelerates amorphous solid dispersion (ASD) formulation by screening candidate polymers using multi-criteria decision analysis (MCDA). However, the current software architecture exhibits an input-dependency defect:
1. **Mandatory User Burden [FACT / A]:** The frontend user interface (`frontend/src/pages/PolymerLibrary.tsx`), API validation schema (`backend/models/schemas.py:PolymerCreate`), and backend validation service (`backend/services/validation.py`) enforce the number-average molecular weight ($M_n$ / `mn_da`) as a **strictly mandatory, positive float (`gt=0`) input**. An experimentalist cannot add a custom polymer or execute a screening run without providing an exact numeric value for $M_n$.
2. **Total Algorithmic Indifference in Core MCDA [FACT / A & B]:** As proven across two exhaustive forensic audits (`MODULE_15_PRELIMINARY_MN_DEPENDENCY_AUDIT.md` and `MODULE_15_GATE1_CHICRITICAL_FORENSIC_AUDIT.md`), the active v2 four-criterion decision engine contains **zero occurrences of and zero dependencies on $M_n$**.

#### **Authoritative Active v2 MCDA Pipeline Equations [METHODOLOGY FACT / B]:**
The active multicriteria evaluation pipeline is defined by the following exact mathematical sequence:
* **Active Compatibility Decision Matrix ($\mathbf{S}$):**
  $$\mathbf{S} = [s_{\text{HSP}},\; s_\chi,\; s_{\text{desc}},\; s_{\text{GT}}] \in [0, 1]^{N \times 4}$$
  where Criterion 1 is Hansen distance ($s_{\text{HSP}}$), Criterion 2 is Lindvig Flory-Huggins parameter ($s_\chi = \max(0, 1 - \chi)$), Criterion 3 is RDKit 2D descriptor distance ($s_{\text{desc}}$), and Criterion 4 is Gordon-Taylor glass transition ($s_{\text{GT}}$). $M_n$ does not enter any criterion in $\mathbf{S}$.
* **Column-Wise $Z$-Score Standardization ($Z$):**
  $$Z = (S - \mu) / \sigma$$
* **Sample Correlation Matrix ($R$):**
  $$R = \frac{1}{n} Z^T Z \in \mathbb{R}^{4 \times 4}$$
* **$K$-Selection by Active Variance-Retention Rule:**
  $K$ is selected using the active variance-retention threshold (e.g. cumulative explained variance $\ge 95\%$):
  $$K = \min \left\{ k \in \{1, 2, 3, 4\} : \frac{\sum_{m=1}^k \lambda_m}{\text{Tr}(R)} \ge 0.95 \right\}$$
  *Governance Distinction:* The eigengap $\Delta_K = \lambda_K - \lambda_{K+1}$ is a **post-selection subspace-stability and governance diagnostic** used to detect spectral degeneracy; it is **not** the $K$-selection mechanism.
* **Subspace Coordinate Projection ($T$):**
  $$T = Z V_K \in \mathbb{R}^{N \times K}$$
  where $V_K = [v_1, \dots, v_K] \in \mathbb{R}^{4 \times K}$ contains the retained orthonormal eigenvectors of $R$.
* **Subspace Metric Tensor ($M_K$):**
  $$M_K = V_K^T W V_K \in \mathbb{R}^{K \times K}$$
  where $W = \text{diag}(w_{\text{AHP}})$ represents the decision-theoretic AHP preference weights (satisfying $\sum w_j = 1, w_j > 0$). Distance in the retained PCA subspace is governed by the **positive-definite quadratic-form metric induced by physical AHP weighting in the retained PCA subspace**. *(The alternate formulation alternate unprojected formulations is strictly prohibited and absent from source).*
* **Ideal and Anti-Ideal Anchor Projections ($t^\pm$):**
  $$z^+ = (1 - \mu) / \sigma, \quad z^- = (0 - \mu) / \sigma$$
  $$t^+ = z^+ V_K \in \mathbb{R}^{1 \times K}, \quad t^- = z^- V_K \in \mathbb{R}^{1 \times K}$$
* **Quadratic-Form Subspace Distances ($D_i^\pm$):**
  $$D_i^\pm = \sqrt{(t_i - t^\pm)^T M_K (t_i - t^\pm)}$$
  *(Note: Distances are quadratic-form metric distances in PCA subspace, not unweighted coordinate norms).*
* **Relative Closeness Coefficient ($C_L$):**
  $$C_L = \frac{D_i^-}{D_i^+ + D_i^-} \quad (\text{or } C_{L,i})$$
* **Empirical Counterfactual Invariance [FACT / A]:** Under the tested cohorts and tested conditions (specifically verified on the canonical Indomethacin benchmark cohort `IND-001-2026`), omitting or varying $M_n$ produces **zero numerical drift ($\Delta C_L = 0.000000$)** and zero rank shifts.

3. **Severe Industrial Data Scarcity [GENERAL SCIENTIFIC KNOWLEDGE]:** In commercial preformulation practice, polymer Certificates of Analysis (CoAs) characterize polymers by solution viscosity or Fikentscher K-values. Curated number-average molecular weight ($M_n$) is rarely reported on commercial specification sheets and requires specialized GPC/SEC-MALLS. Mandating $M_n$ forces formulators to guess values or fabricate synthetic inputs to bypass the entry form.

### **1.2 The Secondary Diagnostic & Terminology Collision**
* **Sole Computational Consumer [FACT / A]:** In the entire repository, $M_n$ enters exactly one equation: `compute_chi_critical()` in `src/asd_mcda/compatibility/flory_huggins.py`, which computes the Flory-Huggins critical parameter $\chi_c = 0.5(1 + 1/\sqrt{r_2})^2$.
* **Exact Active Comparator [FACT / A]:** The candidate diagnostic in `flory_huggins.py:23` uses strict inequality:
  $$\chi < \chi_c$$
  If $\chi < \chi_c$, the candidate receives a favorable diagnostic status; otherwise, it receives an unfavorable diagnostic status.
* **Non-Exclusionary Diagnostic [FACT / A]:** This diagnostic **does not filter, exclude, or penalize candidates**. In the canonical Indomethacin benchmark cohort, Eudragit E PO fails the diagnostic condition ($\chi = 1.341 \ge \chi_c = 0.589$), yet it proceeds into TOPSIS and receives Rank 5 ($C_{L,5} = 0.545616$).
* **Nomenclature Ambiguity [FACT / A]:** The codebase exhibits a terminological collision where "Gate 1" historically refers to a cohort-level HSP RED filter in `hsp_model.py` and `orchestrator.py`, while simultaneously referring to the candidate-level Flory-Huggins $\chi < \chi_c$ check in `flory_huggins.py` and `Results.tsx`. Calling an uncoupled diagnostic a "Gate" creates acute vulnerabilities during viva defense.
* **$M_w$ Parameterization Boundary [FACT / A & B]:** $M_w$ is not a valid substitute for $M_n$ in the current $\chi_c$ implementation because the implemented chain-volume ratio $r_2$ is parameterized specifically using $M_n$. In Flory-Huggins lattice theory, combinatorial entropy of mixing depends on the number density of distinct chains ($n_2 \propto 1/M_n$). Substituting $M_w$ into this specific implementation parameterization overestimates chain volume ratio by the Polydispersity Index ($\text{PDI} = M_w/M_n$) and artificially depresses $\chi_c$ by $1.34\%$ to $3.73\%$ (previously stated as $1.3\%$ to $3.8\%$) across the five reference polymers in `config/polymers/polymer_library_v3_five_polymers.csv`. This is a constraint of the current model formulation, not a universal prohibition on all treatments of polymer molecular-weight distributions.

### **1.3 Architectural Objective of this Specification**
This document designs the target architecture to transition $M_n$ from a **mandatory core input** to an **optional diagnostic input**, decouple the secondary phase-boundary diagnostic from candidate screening, resolve the terminology collision, and establish an explicit behavior contract for all missing-data states—**without altering existing v2 rankings or modifying any production code at this stage**.

---

## 2. Current Architecture vs Target Architecture

### **2.1 Current Architecture: Monolithic Coupling (Status Quo)**
Under the status quo, the input validation layer treats the polymer dataclass as a monolithic unit, tightly coupling core screening attributes with secondary diagnostic parameters:

```
[CURRENT ARCHITECTURE: TIGHTLY COUPLED INGESTION]

  User Form Input (PolymerLibrary.tsx)
    │ Mandates: name, smiles, tg_k, density, hsp_d, hsp_p, hsp_h, mw_da, mn_da
    │ (Validation blocks if mn_da is missing or <= 0)
    ▼
  FastAPI Schema (PolymerCreate: mn_da: float = Field(..., gt=0))
    │ (HTTP 422 if missing, zero, or negative)
    ▼
  Backend Validation (validate_polymer_data: "mn_da" in required_fields)
    │ (ValueError if missing or <= 0)
    ▼
  Polymer Dataclass (mn_da: float)
    │
    ├────────────────────────────────────────┬────────────────────────────────────────┐
    ▼                                        ▼                                        ▼
  HSP Model (s_HSP)                        Flory-Huggins Model                      Gordon-Taylor Model
  (No Mn used)                             ├── compute_s_chi() [s_chi] (No Mn used) (No Mn used)
                                           └── compute_chi_critical() [χc]
                                               └── Uses Mn ──► evaluate_gate1()
                                                                 └── Emits "Gate 1: PASS/FAIL"
                                                                     (Ignored by MCDA, rendered on UI/PDF)
```

### **2.2 Target Architecture: Decoupled Core vs Diagnostic Pipeline**
The target architecture establishes an explicit structural boundary between the primary screening pipeline and the secondary thermodynamic diagnostic:

```
[TARGET ARCHITECTURE: DECOUPLED CORE & DIAGNOSTIC]

  User Form Input (PolymerLibrary.tsx)
    │ Mandates: name, smiles, tg_k, density, hsp_d, hsp_p, hsp_h
    │ OPTIONAL: mn_da (Optional positive float, tooltip explains diagnostic role)
    ▼
  FastAPI Schema Ingress Boundary (PolymerCreate / PolymerCreateV2)
    │ • If omitted or null: Deserializes as None (HTTP 200)
    │ • If positive float (> 0): Validated normally (HTTP 200)
    │ • If <= 0 or non-numeric: Rejected at schema ingress (HTTP 422 Unprocessable Entity)
    ▼
  Backend Validation (validate_polymer_data: mn_da optional; validated > 0 only if provided)
    │
    ▼
  Polymer Domain Model (mn_da: Optional[float] = None)
    │
    ├───────────────────────────────────────────────────────┐
    │                                                       │
    ▼ [PRIMARY DECISION PIPELINE: 100% INVARIANT]          ▼ [OPTIONAL DIAGNOSTIC BRANCH]
  Compatibility Matrix Builder                             Flory-Huggins Phase-Boundary Diagnostic
  ├── s_HSP  (Hansen distance Ra/R0)                        │
  ├── s_χ    (Lindvig scaling on V_drug)                   Is polymer.mn_da provided, valid, and > 0?
  ├── s_desc (RDKit 2D descriptor distance)                 ├── YES:
  └── s_GT   (Gordon-Taylor glass transition)               │     r2 = (Mn / ρ) / V_drug
    │                                                       │     χc = 0.5 * (1 + 1/√r2)²
    ▼                                                       │     Evaluate strict pointwise rule: χ < χc
  Matrix S ∈ ℝ^{N x 4}                                      │     Status: EVALUATED_MISCIBLE (if χ < χc)
    │                                                       │             EVALUATED_PHASE_SEPARATION_RISK (if χ ≥ χc)
    ▼                                                       └── NO (None / Omitted):
  Active v2 MCDA Pipeline                                         χc = None
  ├── Z-Score Standardization (Z = (S - μ)/σ)                     Status: NOT_EVALUATED_MN_UNAVAILABLE
  ├── Correlation Matrix (R = (1/n) Z^T Z)                        Message: "Diagnostic omitted: Mn unavailable"
  ├── Variance-Retention K-Selection (≥ 95% variance)             │
  │     (Post-selection Eigengap ΔK diagnostic)                   ▼
  ├── Subspace Projection (T = Z V_K)                      [REPORT & UI PRESENTATION]
  ├── Metric Tensor (M_K = V_K^T W V_K)                    Displays neutral diagnostic badge/table cell.
  ├── Quadratic Distance (D_i^±)                           Zero implication of candidate failure!
  ├── TOPSIS Relative Closeness (C_{L,i})
  ├── Morris Global Sensitivity
  └── Monte Carlo Uncertainty UQ
    │
    ▼
  FINAL CANDIDATE RANKINGS & RECOMMENDATIONS
  (Executes to completion with bit-for-bit identical results regardless of Mn presence!)
```

---

## 3. Detailed Architectural Principles of Target Design

The target architecture is governed by five mandatory design principles:

1. **Principle of Decision Invariance [METHODOLOGY FACT / B]:**  
   The presence, absence, or variation of $M_n$ must produce **zero numerical drift ($\Delta C_L = 0.000000$)** in compatibility matrix $\mathbf{S}$, standardized matrix $Z$, correlation matrix $R$, retained eigenvalues $\lambda_k$, eigenvectors $v_k$, subspace dimension $K$, decision-theoretic AHP preference weights $w$, metric tensor $M_K$, ideal/anti-ideal points $t^\pm$, relative closeness scores $C_{L,i}$, and candidate rank orderings—as formally verified under the tested cohorts and tested conditions.
2. **Principle of Non-Fabrication [METHODOLOGY FACT / B]:**  
   If $M_n$ is omitted by the user, the system must **never fabricate a synthetic value**, must never guess an ungrounded average, and must never substitute $M_w$. Missing data must be handled transparently through explicit state logging.
3. **Principle of Non-Penalization [METHODOLOGY FACT / B]:**  
   The absence of an optional diagnostic input must **never cause a failure of the core analysis**, must never disqualify a polymer candidate, and must never downgrade a candidate's closeness score $C_L$ or confidence tier.
4. **Principle of Epistemic Transparency [METHODOLOGY FACT / B]:**  
   Reports and user interfaces must clearly distinguish an **unfavorable evaluated condition** ($\chi \ge \chi_c$) from an **unevaluated condition** (diagnostic omitted due to unavailable $M_n$). Unevaluated states must never be rendered as "FAIL", "REJECTED", or "INCOMPATIBLE".
5. **Principle of Version Isolation [SYSTEM GOVERNANCE FACT / B]:**  
   The frozen v1.5 baseline contract (`v1.5.0-FOUR-CRITERION-FREEZE`) must remain completely unchanged. The proposed v2 contract relaxes $M_n$ exclusively for v2 workflows, using version-aware API schemas and presentation handlers.

---

## 4. Mn Dependency Boundary Specification

To prevent accidental re-coupling during future development, this section formalizes the strict dependency boundary governing $M_n$:

### **4.1 Quarantined Zone (Strictly Prohibited from Accessing $M_n$)**
The following modules, functions, and mathematical routines constitute the **Quarantined Zone** and must never read, reference, import, or depend on $M_n$:
* `src/asd_mcda/compatibility/matrix.py` (Matrix $\mathbf{S}$ assembly)
* `src/asd_mcda/compatibility/hsp_model.py` (Hansen solubility parameter scoring)
* `src/asd_mcda/compatibility/gordon_taylor.py` (Glass transition scoring)
* `src/asd_mcda/descriptors/` (All molecular descriptor calculations)
* `src/asd_mcda/v2/engine.py` (Variable-$K$ evaluation engine)
* `src/asd_mcda/v2/standardization.py` ($Z$-score standardization)
* `src/asd_mcda/v2/pca.py` (PCA decomposition and post-selection eigengap stability governance)
* `src/asd_mcda/v2/ahp.py` (Decision-theoretic AHP preference elicitation)
* `src/asd_mcda/v2/metrics.py` (Positive-definite metric tensor $M_K = V_K^T W V_K$)
* `src/asd_mcda/v2/topsis.py` (SP-PRP-TOPSIS scoring $C_{L,i}$)
* `src/asd_mcda/v2/stability.py` (Subspace stability and rank reversal)
* `src/asd_mcda/v2/sensitivity.py` (Morris screening)
* `src/asd_mcda/v2/uncertainty.py` (Monte Carlo uncertainty propagation)

### **4.2 Permitted Diagnostic Zone (Authorized to Access $M_n$)**
Access to $M_n$ is strictly quarantined to the **Diagnostic Zone**:
* `backend/models/schemas.py` (`PolymerCreate.mn_da`, `PolymerResponse.mn_da` as `Optional[float] = Field(None, gt=0)`)
* `src/asd_mcda/polymer/polymer_library.py` (`PolymerCandidate.mn_da: Optional[float] = None`)
* `src/asd_mcda/compatibility/flory_huggins.py` (`compute_chi_critical(polymer)` — executed conditionally)
* `src/asd_mcda/prediction/predictor.py` (`FormulationPredictor` — sets diagnostic report fields)
* `backend/services/pdf_report_generator.py` (Renders diagnostic table cell)
* `frontend/src/pages/PolymerLibrary.tsx` (Renders optional form field with diagnostic tooltip)
* `frontend/src/pages/Results.tsx` (Renders optional diagnostic badge)

---

## 5. χc Diagnostic Boundary Specification

### **5.1 Physical and Mathematical Boundary**
The Flory-Huggins critical parameter $\chi_c$ is formally specified as an **auxiliary, post-hoc thermodynamic diagnostic**:
* **Physical Significance [GENERAL SCIENTIFIC KNOWLEDGE]:** Defines the theoretical spinodal critical threshold in classical binary Flory-Huggins lattice theory. For a binary system where $\chi < \chi_c$, the blend is predicted to possess negative free energy of mixing across all volume fractions ($\Delta G_{\text{mix}} < 0$, $\partial^2 \Delta G_{\text{mix}}/\partial \phi_2^2 > 0$), indicating thermodynamic miscibility. For $\chi \ge \chi_c$, a two-phase liquid-liquid miscibility gap is theoretically predicted at critical composition.
* **Exact Pointwise Comparator [FACT / A]:** The diagnostic evaluation strictly uses the active comparator operator $\chi < \chi_c$. Favorable interaction is defined by strict inequality; $\chi \ge \chi_c$ indicates phase-separation risk under the model diagnostic.
* **Non-Exclusionary Boundary [FACT / A]:** In solid-state pharmaceutical formulations, kinetic stabilization (elevated glass transition temperature margins $T_g - T_{\text{storage}} \ge 50\text{ K}$) and steric hindrance frequently prevent crystallization and phase separation even when $\chi \ge \chi_c$. Therefore, $\chi_c$ must **never act as an exclusionary gate**.
* **Decoupling from Compatibility Matrix $\mathbf{S}$ [FACT / A]:** Criterion 2 ($s_\chi = \max(0, 1 - \chi)$) already penalizes high interaction energies continuously in the primary decision matrix. $\chi_c$ is strictly confined to reporting whether the thermodynamic condition $\chi < \chi_c$ is satisfied.

### **5.2 Numerical Bounds and Safety Envelope**
Because $r_2 = (M_n / \rho) / V_{\text{drug}}$ and $V_{\text{drug}} \approx 261.16\text{ cm}^3/\text{mol}$, the mathematical formulation guarantees:
$$\chi_c = \frac{1}{2}\left(1 + \frac{1}{\sqrt{r_2}}\right)^2$$
* As $M_n \to \infty$, $\chi_c \to 0.5000$.
* For commercial polymers ($M_n \ge 10,000\text{ Da}$), $\chi_c \in [0.5000, 0.6500]$.
* If evaluated, $\chi_c$ must be bounded within $[0.500, 1.000]$. If a computed $\chi_c$ falls outside this envelope due to corrupt input data, the diagnostic must raise a data integrity warning rather than emitting an unphysical value.

---

## 6. Terminology Architecture: Standardizing Framework Nomenclature

### **6.1 The Historical Terminology Collision**
The legacy codebase exhibits a terminological collision:
1. **Cohort-Level Screening:** In `src/asd_mcda/compatibility/hsp_model.py:74` and `orchestrator.py:73`, "Gate 1" refers to checking whether candidate polymers meet Hansen Relative Energy Difference $\text{RED} \le 1.0$.
2. **Candidate-Level Diagnostic:** In `src/asd_mcda/compatibility/flory_huggins.py:82` and `Results.tsx:197`, "Gate 1" refers to checking whether a candidate satisfies $\chi < \chi_c$.
3. **The Architectural Resolution:** Neither check functions as an actual candidate exclusion gate in the active v2 engine. Calling an uncoupled diagnostic a "Gate" is misleading to end users and creates vulnerabilities during viva examination.

### **6.2 Standardized Terminology Architecture**
To eliminate ambiguity, this specification establishes a unified terminology architecture:

| Legacy Term | Target Standardized Term | Architectural Layer | Operational Definition | User-Facing Display |
| :--- | :--- | :--- | :--- | :--- |
| `hsp_model.check_gate1()` | **HSP Cohort Feasibility Screen** | Pre-Screening Data QC | Verifies that the candidate cohort possesses sufficient solubility parameter diversity before running MCDA. | *"Cohort Feasibility: Adequate chemical diversity identified."* |
| `flory_huggins.evaluate_candidate_gate1()` | **Flory-Huggins Phase-Boundary Diagnostic** | Candidate Diagnostic | Compares candidate $\chi$ against $\chi_c$ via strict pointwise test $\chi < \chi_c$. | *"Phase-Boundary Diagnostic: Miscible Likelihood (χ < χc)"* or *"Phase-Separation Risk (χ ≥ χc)"* |
| `gate1_status: "PASS"` | `diagnostic_status: "EVALUATED_MISCIBLE"` | Reporting & Schema | Favorable thermodynamic interaction ($\chi < \chi_c$). | Pill Badge: Green (`Miscible Likelihood`) |
| `gate1_status: "FAIL"` | `diagnostic_status: "EVALUATED_PHASE_SEPARATION_RISK"` | Reporting & Schema | Unfavorable thermodynamic interaction ($\chi \ge \chi_c$). | Pill Badge: Amber (`Phase-Separation Risk`) |
| *(Missing $M_n$ State)* | `diagnostic_status: "NOT_EVALUATED_MN_UNAVAILABLE"` | Reporting & Schema | Molecular weight omitted; diagnostic bypassed. | Pill Badge: Neutral Gray (`Diagnostic Not Evaluated`) |

---

## 7. Input / Data Contract Specification

### **7.1 Pydantic Schema Specification (`backend/models/schemas.py`)**

```python
from typing import Optional
from pydantic import BaseModel, Field

class PolymerCreate(BaseModel):
    '''Schema for creating a new polymer candidate in the user library.'''
    name: str = Field(..., min_length=1, max_length=100, description="Polymer trade name or generic chemical name")
    smiles: str = Field(..., min_length=1, description="Constitutional repeat unit SMILES string")
    abbreviation: Optional[str] = Field(None, max_length=20, description="Short abbreviation for plots and tables")
    
    # Core Mandatory Physicochemical Attributes (Required for Matrix S Construction)
    tg_k: float = Field(..., gt=0, description="Experimental glass transition temperature in Kelvin (Tg)")
    density_g_cm3: float = Field(..., gt=0, description="Polymer density in g/cm^3")
    hsp_d: float = Field(..., ge=0, description="Hansen dispersion parameter (delta_D) in MPa^0.5")
    hsp_p: float = Field(..., ge=0, description="Hansen polar parameter (delta_P) in MPa^0.5")
    hsp_h: float = Field(..., ge=0, description="Hansen hydrogen bonding parameter (delta_H) in MPa^0.5")
    
    # Optional Molecular Weight Fields (Exclusively for Secondary Diagnostics)
    # Ingress Rule: If provided, must be strictly > 0. Values <= 0 or non-numeric strings are rejected with HTTP 422.
    mn_da: Optional[float] = Field(
        None, 
        gt=0, 
        description="Number-average molecular weight in Da (Mn). Used exclusively for secondary Flory-Huggins phase-boundary diagnostic."
    )
    mw_da: Optional[float] = Field(
        None, 
        gt=0, 
        description="Weight-average molecular weight in Da (Mw). Optional informational metadata; never substituted for Mn."
    )
    pdi: Optional[float] = Field(
        None, 
        ge=1.0, 
        description="Polydispersity index (Mw/Mn). Informational metadata."
    )
    provenance_notes: Optional[str] = Field(
        None, 
        description="Documentation of literature source, batch number, or measurement method for molecular weight data."
    )
```

### **7.2 Domain Dataclass Adaptation (`src/asd_mcda/polymer/polymer_library.py`)**

```python
@dataclass(frozen=True)
class PolymerCandidate:
    '''Domain model representing a candidate polymer excipient.'''
    polymer_id: str
    polymer_name: str
    abbreviation: str
    smiles: str
    density_g_cm3: float
    tg_k: float
    hsp_d: float
    hsp_p: float
    hsp_h: float
    
    # Optional diagnostic attributes
    mn_da: Optional[float] = None
    mw_da: Optional[float] = None
    pdi: Optional[float] = None
    provenance_notes: Optional[str] = None
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "PolymerCandidate":
        # Safe extraction of optional mn_da for internal loaders and CSV ingestion
        raw_mn = data.get("mn_da")
        mn_val = None
        if raw_mn is not None and str(raw_mn).strip() != "" and str(raw_mn).lower() != "nan":
            try:
                parsed = float(raw_mn)
                if parsed > 0:
                    mn_val = parsed
                else:
                    # Non-positive values from unvalidated sources are parsed as None
                    mn_val = None
            except (ValueError, TypeError):
                mn_val = None
                
        return cls(
            polymer_id=str(data["polymer_id"]),
            polymer_name=str(data["name"]),
            abbreviation=str(data.get("abbreviation", data["name"][:10])),
            smiles=str(data["smiles"]),
            density_g_cm3=float(data["density"]),
            tg_k=float(data["tg_k"]),
            hsp_d=float(data["hsp_d"]),
            hsp_p=float(data["hsp_p"]),
            hsp_h=float(data["hsp_h"]),
            mn_da=mn_val,
            mw_da=float(data["mw_da"]) if data.get("mw_da") not in (None, "", "nan") else None,
            pdi=float(data["pdi"]) if data.get("pdi") not in (None, "", "nan") else None,
            provenance_notes=data.get("provenance_notes"),
        )
```

---

## 8. Missing-Mn Behavior & Complete 10-State Behavior Matrix

The table below specifies the deterministic behavior across all 10 potential input conditions, explicitly distinguishing **API Ingress Boundary Rejection** from **Internal Pipeline Execution**:

| State | Input Condition | API Schema Ingress Behavior | Downstream Core MCDA | Flory-Huggins Phase Diagnostic | User Message / UI Indicator | PDF Report Output | Provenance Category |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **A** | **Valid $M_n > 0$** <br>*(e.g. `40000.0`)* | Accepted (HTTP 200). Passes Pydantic `gt=0`. | Runs normally. Matrix $\mathbf{S}$ built. | Evaluates strict rule $\chi < \chi_c$. Emits `EVALUATED_MISCIBLE` or `EVALUATED_PHASE_SEPARATION_RISK`. | Pill Badge: Green (`Miscible Likelihood`) or Amber (`Phase-Separation Risk`). | Table displays: $\chi$, $\chi_c$, and status. | User-supplied or catalog literature citation. |
| **B** | **Absent / Omitted** <br>*(Field omitted)* | Accepted (HTTP 200). `mn_da` defaults to `None`. | **Runs normally.** Invariant under tested conditions. | **Bypassed.** $\chi_c = 	ext{None}$. Status: `NOT_EVALUATED_MN_UNAVAILABLE`. | Pill Badge: Neutral Gray (`Diagnostic Not Evaluated`). Tooltip: *"Provide Mn to enable phase diagnostic."* | Table displays: $\chi$, $\chi_c = 	ext{"N/A"}$, Status: *"Not Evaluated (Mn unavailable)"*. | Logged as `NOT_PROVIDED`. |
| **C** | **Explicit `null` / `None`** | Accepted (HTTP 200). Deserialized as `None`. | **Runs normally.** Invariant under tested conditions. | **Bypassed.** Identical to State B. | Identical to State B. | Identical to State B. | Logged as `EXPLICIT_NULL`. |
| **D** | **Zero ($M_n = 0$)** | **Rejected at Ingress (HTTP 422 Unprocessable Entity).** Fails `gt=0`. | **Not reached via API.** *(Legacy CSV fallback: runs normally).* | **Not reached via API.** *(CSV fallback: bypassed; `NOT_EVALUATED_INVALID_INPUT`).* | Form error: `Input should be greater than 0`. UI highlights invalid field. | N/A (Request aborted at gateway). | Logged as `REJECTED_AT_INGRESS` [C]. |
| **E** | **Negative ($M_n < 0$)** | **Rejected at Ingress (HTTP 422 Unprocessable Entity).** Fails `gt=0`. | **Not reached via API.** *(Legacy CSV fallback: runs normally).* | **Not reached via API.** *(CSV fallback: bypassed; `NOT_EVALUATED_INVALID_INPUT`).* | Form error: `Input should be greater than 0`. UI highlights invalid field. | N/A (Request aborted at gateway). | Logged as `REJECTED_AT_INGRESS` [C]. |
| **F** | **$M_n$ Range** <br>*(e.g. $[35000, 45000]$)* | Accepted if range schema supported [C]. | Runs normally. Matrix $\mathbf{S}$ built. | Computes $[\chi_{c,\min}, \chi_{c,\max}]$. Evaluates bounding rules (Section 8.1). | Displays bounding interval with `PASS`, `FAIL`, or `RANGE-INDETERMINATE`. | Table displays: $\chi_c \in [\chi_{c,\min}, \chi_{c,\max}]$ and range status. | Logged as `USER_SUPPLIED_RANGE` [C]. |
| **G** | **Non-Numeric String** <br>*(e.g. `"40k"`)* | **Rejected at Ingress (HTTP 422 Unprocessable Entity).** Fails float parse. | **Not reached via API.** *(Legacy CSV fallback: runs normally).* | **Not reached via API.** *(CSV fallback: bypassed; `NOT_EVALUATED_INVALID_INPUT`).* | Form error: `Input should be a valid number`. UI highlights invalid field. | N/A (Request aborted at gateway). | Logged as `REJECTED_AT_INGRESS` [C]. |
| **H** | **$M_w$-Only Provided** | Accepted if $M_w$ optional field exists. `mn_da` is `None`. | **Runs normally.** Zero substitution. | **Bypassed.** Status: `NOT_EVALUATED_MN_UNAVAILABLE`. **Zero substitution.** | Notice: *"Mw provided but cannot substitute for Mn in lattice entropy."* | Table displays: *"Not Evaluated (Mw cannot substitute for Mn in lattice entropy)"*. | Logged as `MW_ONLY_MN_UNAVAILABLE` [C]. |
| **I** | **Both $M_n$ and $M_w$** | Accepted. If $M_w < M_n$, validation warning emitted. | Runs normally. | Evaluates $\chi < \chi_c(M_n)$. Calculates $	ext{PDI} = M_w/M_n$. | Displays diagnostic and verified PDI. If $M_w < M_n$, warning: *"Unphysical PDI < 1.0"*. | Table displays: $\chi, \chi_c, M_n, M_w, 	ext{PDI}$. | Logged with literature provenance for both moments. |
| **J** | **Unknown Provenance** | Accepted. `provenance_notes` empty. | Runs normally. | Evaluates strict rule $\chi < \chi_c$. | Displays $\chi, \chi_c$ with advisory: *"Provenance unverified: value not cross-referenced to literature."* | Table displays $\chi, \chi_c$ with unverified provenance notice. | Logged as `PROVENANCE_UNVERIFIED` [C]. |

---

### **8.1 Mathematical Derivation for $M_n$ Range Inversion (Proposed State F) [C]**

In classical Flory-Huggins lattice theory:
$$\chi_c(M_n) = rac{1}{2}\left(1 + rac{1}{\sqrt{r_2(M_n)}}
ight)^2, \quad 	ext{where } r_2(M_n) = rac{M_n / 
ho_{	ext{poly}}}{V_{	ext{m,drug}}}$$
Taking the first derivative with respect to $M_n$ for $M_n > 0$:
$$rac{\partial r_2}{\partial M_n} = rac{1}{
ho_{	ext{poly}} V_{	ext{m,drug}}} > 0$$
$$rac{\partial \chi_c}{\partial M_n} = \left(1 + rac{1}{\sqrt{r_2}}
ight) \cdot \left(-rac{1}{2 r_2^{3/2}}
ight) \cdot rac{\partial r_2}{\partial M_n} = -rac{1 + 1/\sqrt{r_2}}{2 r_2^{3/2} 
ho_{	ext{poly}} V_{	ext{m,drug}}} < 0$$
Since $rac{\partial \chi_c}{\partial M_n} < 0$ strictly across the positive domain $(0, \infty)$, $\chi_c$ is a **strictly monotonically decreasing function of $M_n$**.

Therefore, for any valid molecular weight interval $[M_{n,\min}, M_{n,\max}]$ where $0 < M_{n,\min} \le M_{n,\max}$:
$$\chi_{c,\min} = \chi_c(M_{n,\max})$$
$$\chi_{c,\max} = \chi_c(M_{n,\min})$$
The bounding critical interval is $[\chi_{c,\min}, \chi_{c,\max}] = [\chi_c(M_{n,\max}), \chi_c(M_{n,\min})]$.

#### **Deterministic Diagnostic Rules for Range Evaluation [C]:**
Range evaluation operates without altering the underlying pointwise strict comparator rule $\chi < \chi_c(M_n)$:
1. **Case 1 (PASS):**
   If $\chi < \chi_{c,\min}$:  
   Because $\chi < \chi_{c,\min} \le \chi_c(M_n)$ for all $M_n \in [M_{n,\min}, M_{n,\max}]$, the candidate satisfies the pointwise miscibility condition $\chi < \chi_c(M_n)$ across the entire supplied $M_n$ interval.  
   **Status:** `PASS` (or `EVALUATED_RANGE_PASS`).  
   **UI Text:** *"Miscible likelihood across full supplied Mn interval (χ < χc,min)."*
2. **Case 2 (FAIL):**
   If $\chi \ge \chi_{c,\max}$:  
   Because $\chi \ge \chi_{c,\max} \ge \chi_c(M_n)$ for all $M_n \in [M_{n,\min}, M_{n,\max}]$, the candidate violates the pointwise condition $\chi < \chi_c(M_n)$ across the entire supplied $M_n$ interval.  
   **Status:** `FAIL` (or `EVALUATED_RANGE_FAIL`).  
   **UI Text:** *"Phase-separation risk across full supplied Mn interval (χ ≥ χc,max)."*
3. **Case 3 (RANGE-INDETERMINATE):**
   If $\chi_{c,\min} \le \chi < \chi_{c,\max}$:  
   RANGE-INDETERMINATE: the diagnostic outcome depends on the actual $M_n$ value within the supplied $M_n$ interval. Pointwise $\chi < \chi_c(M_n)$ holds if the true $M_n$ is below the threshold $M_n^*$, but fails if the true $M_n$ is above $M_n^*$.  
   **Status:** `RANGE-INDETERMINATE` (or `EVALUATED_CONDITIONAL_RANGE`).  
   **UI Text:** *"RANGE-INDETERMINATE: the diagnostic outcome depends on the actual Mn value within the supplied Mn interval (χc,min ≤ χ < χc,max)."*

*(Note: Bounding conditions are evaluated deterministically via the three explicit categories: PASS, FAIL, or RANGE-INDETERMINATE).*

---

## 9. Diagnostic Status Vocabulary Specification

To replace the legacy binary labels `"PASS"` and `"FAIL"`, this specification formalizes an explicit thermodynamic status enumeration:

```python
from enum import Enum

class DiagnosticStatus(str, Enum):
    '''Formal status enumeration for secondary Flory-Huggins phase-boundary diagnostic.'''
    
    # Evaluated States (Mn was provided, positive, and evaluated against strict rule chi < chi_c)
    EVALUATED_MISCIBLE = "EVALUATED_MISCIBLE"
    # chi < chi_c: Favorable thermodynamic interaction under the model.
    # UI Text: "Miscible Likelihood (chi < chi_c)"
    
    EVALUATED_PHASE_SEPARATION_RISK = "EVALUATED_PHASE_SEPARATION_RISK"
    # chi >= chi_c: Two-phase spinodal demixing predicted by classical lattice theory.
    # UI Text: "Phase-Separation Risk (chi >= chi_c)"
    
    # Unevaluated States (Diagnostic bypassed; core analysis proceeds with zero disruption)
    NOT_EVALUATED_MN_UNAVAILABLE = "NOT_EVALUATED_MN_UNAVAILABLE"
    # Mn was omitted or explicitly null. No assumption made.
    # UI Text: "Not Evaluated (Mn Unavailable)"
    
    NOT_EVALUATED_INVALID_INPUT = "NOT_EVALUATED_INVALID_INPUT"
    # Internal fallback: Mn was zero, negative, or unparseable in an unvalidated CSV. Core analysis preserved.
    # UI Text: "Not Evaluated (Invalid Mn Input)"
    
    # Range Evaluated States [PROPOSED FUTURE ARCHITECTURE - C]
    EVALUATED_RANGE_PASS = "EVALUATED_RANGE_PASS"
    EVALUATED_RANGE_FAIL = "EVALUATED_RANGE_FAIL"
    EVALUATED_RANGE_INDETERMINATE = "EVALUATED_RANGE_INDETERMINATE"
    
    # Proposed Future Extensions [PROPOSED FUTURE EXTENSION - C]
    # NOTE: The current codebase contains no automatic non-polymeric excipient classifier.
    # The following state is reserved strictly as a proposed future extension [C]:
    NOT_APPLICABLE_NON_POLYMER = "NOT_APPLICABLE_NON_POLYMER"
```

---

## 10. Report Design Specification (PDF & Web UI)

### **10.1 Presentation Contract: Preventing Misinterpretation**
The report generation layer (`backend/services/pdf_report_generator.py`) must adhere to strict presentation rules:

#### **Case A: $M_n$ is Available and Valid**
* The diagnostic table renders all columns:
  * Calculated $\chi$: `0.395`
  * Critical $\chi_c$: `0.594`
  * Evaluation: `Miscible Likelihood (χ < χc)` (Rendered in dark green text).
* A footnote specifies: *"Flory-Huggins critical parameter computed from number-average molecular weight ($M_n = 40,000	ext{ Da}$, source: literature curated value)."*

#### **Case B: $M_n$ is Omitted or Unavailable**
* The diagnostic table renders:
  * Calculated $\chi$: `0.395`
  * Critical $\chi_c$: `N/A`
  * Evaluation: `Diagnostic Omitted (Mn Unavailable)` (Rendered in neutral slate-gray text).
* **Strict Prohibition:** Under no circumstances may the report display `"FAIL"`, `"REJECTED"`, or `"INCOMPATIBLE"` when $M_n$ was not evaluated.
* An explicit informational banner must state:  
  > *"Note: Flory-Huggins critical interaction parameter ($\chi_c$) was not evaluated because number-average molecular weight ($M_n$) was not provided. This diagnostic does not affect multi-criteria candidate scoring, criteria weights, or TOPSIS rankings, which are based on the four orthogonal criteria ($s_{	ext{HSP}}, s_\chi, s_{	ext{desc}}, s_{	ext{GT}}$)."*

---

## 11. User Interface (UI) Design Specification

### **11.1 Target UI Specification: Dual Input with Progressive Tooltips**
* In `frontend/src/pages/PolymerLibrary.tsx`:
  * Remove the asterisk (`*`) from `<Label>Number-Average Molecular Weight (Mn, Da)</Label>`.
  * Add sub-label / tooltip: `<span className="text-xs text-muted-foreground">(Optional — enables secondary Flory-Huggins phase-boundary diagnostic)</span>`.
  * In `handleSubmit`: remove the client-side `formData.mn_da <= 0` blocking check; if empty, submit `mn_da: null`.
* In `frontend/src/pages/Results.tsx`:
  * If `topCandidate.mn_da` is null/omitted: render neutral badge `<Badge variant="neutral">Diagnostic Not Evaluated</Badge>`.

---

## 12. Internal Catalog Option Feasibility Audit

### **12.1 Sourcing Feasibility for Commercial Excipients**
* **Reference Polymers in Repository [FACT / A]:**  
  The 5 reference polymers in `config/polymers/polymer_library_v3_five_polymers.csv` possess curated literature values extracted from technical bulletins and monographs:
  1. *PVP K30:* $M_n = 40,000	ext{ Da}$, $M_w = 50,000	ext{ Da}$, $	ext{PDI} = 1.25$ (BASF Technical Monograph).
  2. *PVP-VA 64:* $M_n = 45,000	ext{ Da}$, $M_w = 57,500	ext{ Da}$, $	ext{PDI} = 1.28$ (BASF Kollidon VA 64 Document).
  3. *Eudragit E PO:* $M_n = 39,000	ext{ Da}$, $M_w = 47,000	ext{ Da}$, $	ext{PDI} = 1.205$ (Evonik Technical Sheets).
  4. *Soluplus:* $M_n = 90,000	ext{ Da}$, $M_w = 118,000	ext{ Da}$, $	ext{PDI} = 1.311$ (BASF Technical Bulletin; Dressman et al., 2012).
  5. *HPMC E5:* $M_n = 20,000	ext{ Da}$, $M_w = 28,700	ext{ Da}$, $	ext{PDI} = 1.435$ (Dow Methocel Handbook).
* **Catalog Feasibility Verdict [B]:** These values represent curated literature estimates from manufacturer technical documentation and peer-reviewed studies. An internal catalog provides representative rather than batch-specific measured values. Custom user polymers without explicit $M_n$ must remain cleanly un-evaluated; synthetic $M_n$ values must never be injected automatically.

---

## 13. Backward Compatibility Specification

### **13.1 Bidirectional Compatibility Assessment**
* **Old Records Ingested by New Software [FORWARD COMPATIBLE - 100%]:** Existing records containing positive numeric `mn_da` values are parsed normally; $\chi_c$ is evaluated.
* **New Records Ingested by Old Software [UNIDIRECTIONAL INCOMPATIBILITY]:** A record created without $M_n$ (`mn_da: null`) will be rejected by legacy v1.5 validation schemas (`Field(..., gt=0)`). This is expected because legacy software enforces mandatory validation.

---

## 14. Comprehensive Test Strategy Design

Before any future code modification can be committed, the following 12 formal integration and regression tests must be implemented:

| Test ID | Test Name | Ingested Condition | Expected Execution Outcome | Verification Assertion |
| :---: | :--- | :--- | :--- | :--- |
| **TEST-01** | `test_mn_present_evaluates_diagnostic` | Custom polymer with valid $M_n = 45,000	ext{ Da}$. | $\chi_c$ is computed correctly; diagnostic evaluates strict rule $\chi < \chi_c$. | `assert diag["chi_critical"] > 0`  <br>`assert diag["diagnostic_status"].startswith("EVALUATED_")` |
| **TEST-02** | `test_mn_absent_core_ranking_succeeds` | Custom polymer with `mn_da` omitted from dictionary. | Core MCDA pipeline completes with 0 errors. Candidate is scored and ranked in TOPSIS. | `assert result.success is True`  <br>`assert len(result.rankings) == 5` |
| **TEST-03** | `test_mn_absent_zero_fabrication` | Custom polymer with `mn_da = None`. | System does NOT invent or substitute any value for $M_n$ or $\chi_c$. | `assert diag["chi_critical"] is None`  <br>`assert diag["diagnostic_status"] == "NOT_EVALUATED_MN_UNAVAILABLE"` |
| **TEST-04** | `test_mn_absent_ranking_invariance` | Reference Indomethacin cohort with $M_n$ artificially removed for all polymers. | All candidate closeness scores $C_{L,i}$ and ranks are identical to baseline to 6 decimal places under tested conditions. | `np.testing.assert_allclose(cl_absent, cl_baseline, atol=1e-6)`  <br>`assert ranks_absent == ranks_baseline` |
| **TEST-05** | `test_mn_present_exact_baseline_parity` | Reference Indomethacin cohort with original $M_n$ values. | Exact replication of `scientific_validation_results.json`. | `assert result.rankings[0]["topsis_cl"] == 0.6864350839750771` |
| **TEST-06** | `test_invalid_mn_ingress_rejection` | API submission with $M_n = -100.0$ or $0.0$. | FastAPI rejects payload at schema ingress with HTTP 422 `ValidationError`. | `assert response.status_code == 422` |
| **TEST-07** | `test_mw_only_no_silent_substitution` | Custom polymer with $M_w = 60,000	ext{ Da}$, but `mn_da = None`. | System records $M_w$ as metadata but DOES NOT substitute it into $r_2$. $\chi_c$ remains `None`. | `assert diag["chi_critical"] is None`  <br>`assert poly.mw_da == 60000.0` |
| **TEST-08** | `test_legacy_saved_analysis_compatibility` | Loads raw JSON from `data/analyses/ANA-20260821-085221-2670c3/`. | History database and result viewer load without schema errors. | `assert history_db.get_analysis(legacy_id) is not None` |
| **TEST-09** | `test_pdf_distinguishes_not_evaluated` | Generates PDF report for analysis containing candidate with `mn_da = None`. | PDF table renders `"Diagnostic Omitted"`; does NOT contain the word `"FAIL"` for that candidate. | `assert "Diagnostic Omitted" in pdf_text`  <br>`assert "FAIL" not in candidate_row_text` |
| **TEST-10** | `test_frontend_form_submits_without_mn` | React component test: Submits form with empty $M_n$ field. | Form submits successfully; HTTP POST body contains `mn_da: null`. | `expect(apiPostMock).toHaveBeenCalledWith(expect.objectContaining({mn_da: null}))` |
| **TEST-11** | `test_cohort_vs_candidate_gate_isolation`| Induces cohort HSP check failure while Flory-Huggins check passes. | The two diagnostics report independently without naming collision or state cross-talk. | `assert cohort_check.status != candidate_check.status` |
| **TEST-12** | `test_downstream_mcda_numerical_invariance`| Runs PCA, AHP, and metric tensor with and without $M_n$. | Eigenvalues $\lambda_k$, eigenvectors $v_k$, weights $w$, and $M_K$ matrices match identically. | `assert np.array_equal(MK_with_mn, MK_without_mn)` |

---

## 15. v1.5 Protection Specification & Version Isolation

### **15.1 Preservation of Frozen Baseline Methodology**
PharmaPolySCOPE v1.5 was formally frozen under git tag `v1.5.0-FOUR-CRITERION-FREEZE`. To maintain 100% audit integrity:
1. **Production Code Isolation [FACT / A]:** The frozen codebase in `indomethacin-asd-framework` at commit `285c3d7` must remain **completely untouched** until a formal Phase B implementation phase is authorized.
2. **Version Boundary Enforcement [PROPOSED ARCHITECTURE / C]:**
   * **v1.5 Frozen Contract:** Mandatory $M_n$, strict schema validation, canonical 14-page PDF report layout.
   * **v2 Proposed Contract:** Optional $M_n$ for core MCDA, required only for secondary $\chi_c$ diagnostic evaluation.
3. **Shared Infrastructure Isolation Strategy [PROPOSED ARCHITECTURE / C]:**
   Because `backend/models/schemas.py`, `backend/services/validation.py`, and `backend/services/pdf_report_generator.py` are shared between v1.5 and v2, any future implementation **must branch by version or API path**:
   * API endpoints must support version routing (e.g. `PolymerCreateV2` or version-gated validation) so that legacy v1.5 API calls continue to enforce mandatory $M_n$.
   * `pdf_report_generator.py` must check `engine_version`; if `v1.5.0-FOUR-CRITERION-FREEZE`, it renders the original baseline format; if v2, it renders the decoupled diagnostic format.
   * Regression tests in `tests/test_report_generator_integrity.py` must remain completely passing without modification.

---

## 16. Implementation File Map (Planned Scope for Future Phase)

The following table provides the audited blueprint of production files for future authorized phases, accounting for shared infrastructure and version isolation:

| File Path in Repository | Current Role | Planned Target Role | Shared v1.5/v2? | Version Isolation Required? | Audited Risk Level | Architectural Mitigation |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| `backend/models/schemas.py` | Validates API payloads | `mn_da: Optional[float] = Field(None, gt=0)` | **YES** | **YES** | **LOW / MODERATE** | Introduce `PolymerCreateV2` or version-aware schema validation to protect v1.5 endpoints. |
| `backend/services/validation.py` | Enforces business rules | Remove `"mn_da"` from mandatory list for v2 | **YES** | **YES** | **LOW / MODERATE** | Gate required-field validation on `engine_version == "v1.5"`. |
| `src/asd_mcda/polymer/polymer_library.py` | Parses polymer dictionaries | `mn_da: Optional[float] = None`; safe `.get("mn_da")` | **YES** | **NO** | **VERY LOW** | Safe parsing is backward compatible with all v1.5 and v2 dictionaries. |
| `src/asd_mcda/compatibility/flory_huggins.py`| Computes $\chi_c$ and diagnostic | Return `chi_c = None` if $M_n$ absent; evaluate strict $\chi < \chi_c$ | **YES** | **NO** | **LOW** | Diagnostic-only function; does not touch core matrix $\mathbf{S}$. |
| `src/asd_mcda/prediction/predictor.py` | Builds prediction report | Handles `chi_c is None` in `PredictionReport` | **YES** | **NO** | **VERY LOW** | Presentation formatting for report structures. |
| `backend/services/pdf_report_generator.py` | Generates PDF diagnostic table | Formats absent $\chi_c$ as `"N/A"`, status as `"Diagnostic Omitted"` | **YES** | **YES** | **MODERATE** | Branch report layout on `engine_version` to prevent breaking v1.5 golden regression tests. |
| `frontend/src/pages/PolymerLibrary.tsx` | UI input modal & table | Removes asterisk (`*`), removes client-side blocking | **YES** | **NO** | **LOW** | Pure frontend usability improvement. |
| `frontend/src/pages/Results.tsx` | UI results badge & table | Renders neutral badge if diagnostic not evaluated | **YES** | **NO** | **LOW** | UI rendering change; prevents false "FAIL" display. |

---

## 17. Publication & Viva Implications

### **17.1 Authoritative Defense Scripts for Viva Examination**

* **Examiner:** *"Why did you make $M_n$ optional instead of mandatory?"*  
  **Candidate:** *"In industrial preformulation practice, polymer Certificates of Analysis report viscosity grades or K-values; curated $M_n$ is rarely available without specialized GPC-MALLS analysis. Because our four-criterion MCDA ranking engine is mathematically invariant to $M_n$, mandating it created an artificial user bottleneck for an uncoupled parameter. Making $M_n$ optional aligns the tool with real-world pharmaceutical workflows while preserving full thermodynamic diagnostics whenever $M_n$ is provided."*

* **Examiner:** *"Does omitting $M_n$ alter your published TOPSIS polymer rankings?"*  
  **Candidate:** *"Not by a single decimal place under the tested cohorts and tested conditions. As proven in our forensic audit, the compatibility matrix $\mathbf{S}$, $Z$-score standardization, PCA spectral decomposition, decision-theoretic AHP preference weights, positive-definite quadratic metric tensor $M_K = V_K^T W V_K$, and TOPSIS relative closeness $C_{L,i}$ have zero mathematical dependency on $M_n$. In controlled counterfactual testing on the canonical Indomethacin benchmark cohort, omitting $M_n$ produced $\Delta C_L = 0.000000$ change in rankings."*

* **Examiner:** *"Why didn't you just accept $M_w$, which is more commonly reported?"*  
  **Candidate:** *"Because $M_w$ is not a valid substitute for $M_n$ in the current $\chi_c$ implementation. The implemented Flory-Huggins critical parameter calculates chain-volume ratio $r_2$ specifically from $M_n$, reflecting the number density of distinct chains ($n_2 \propto 1/M_n$). Substituting $M_w$ into this specific implementation parameterization overestimates chain volume ratio by the Polydispersity Index ($	ext{PDI} = M_w/M_n$) and introduces an artificial negative bias of up to $3.73\%$ (previously stated as up to $3.8\%$) in $\chi_c$, as independently recalculated across the five reference polymers in `config/polymers/polymer_library_v3_five_polymers.csv`. We refused to introduce an unphysical proxy assumption to paper over a software usability constraint."*

* **Examiner:** *"How does K-selection relate to the eigengap in your v2 architecture?"*  
  **Candidate:** *"K is selected strictly by our active variance-retention threshold rule (capturing $\ge 95\%$ of cumulative variance). The eigengap $\Delta_K = \lambda_K - \lambda_{K+1}$ is an uncoupled post-selection stability and governance diagnostic used to verify that the retained subspace boundary is non-degenerate."*

---

## 18. Unresolved Questions & Implementation Prerequisites

### **18.1 Strategic Open Questions for Project Governance**
1. **Terminology Transition Timeline:** Should the terminology update (retiring "Gate 1" in favor of "Phase-Boundary Diagnostic") be deployed simultaneously with the $M_n$ optionality patch, or phased across minor version increments?
2. **Interval $\chi_c$ Capability (State F) [C]:** Should Phase C implementation include support for molecular weight ranges $[M_{n,\min}, M_{n,\max}]$ to compute bounding intervals $[\chi_{c,\min}, \chi_{c,\max}]$ using the monotonic inversion rule, or is single-point optionality sufficient for initial deployment?

### **18.2 Mandatory Prerequisites Before Implementation Authorization**
* [ ] **Prerequisite 1:** Formal review and sign-off on this specification document (`MODULE_15_MN_OPTIONALITY_ARCHITECTURE_SPEC.md`) by project leadership.
* [ ] **Prerequisite 2:** Explicit authorization to open a Phase B Implementation package.
* [ ] **Prerequisite 3:** Creation of a dedicated branch (`feat/mn-optionality-decoupling`) to preserve the frozen main branch.
* [ ] **Prerequisite 4:** Zero file modifications during the audit phase formally verified.

---

## 19. Summary & Final Verification

```
================================================================================
             PHARMAPOLYSCOPE ARCHITECTURE SPECIFICATION CERTIFICATION
================================================================================
```

### **Summary of System Integrity [FACT / A]:**
* Production repository source code modified: **NO**
* Production configuration modified: **NO**
* Production test files modified: **NO**
* Production datasets modified: **NO**
* Releases or git tags modified: **NO**
* Viva School Modules 00–14 modified: **NO**
* Frozen baseline artifacts modified: **NO**
* Implementation authorized: **NO (DESIGN SPECIFICATION ONLY)**
