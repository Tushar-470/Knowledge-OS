# PharmaPolySCOPE Master Knowledge Map
## PhD Viva Defense Curriculum -- Version 1.1 (Forensic Correction 2026-09-14)

> **Classification:** Learning / Viva Preparation -- NOT production documentation.
> **Source of truth:** PharmaPolySCOPE repository (read-only)
> **Audit basis:** Classification B -- Release Ready With Documented Limitations
> **Active engine:** PharmaPolySCOPE v2.0.0 (Variable-K, SP-PRP-TOPSIS)
> **Package anchor:** 1.5.0 | **Scientific baseline:** v1.5.0-FOUR-CRITERION-FREEZE
> **Version history:** v1.0 contained material errors (wrong AHP matrix, wrong MC count,
>   wrong polymer cohort, incomplete DRG-0002/legacy-test framing).
>   v1.1 is the forensically corrected version. See PHASE1_CORRECTION_LOG.md.

---

## VERSION SEMANTICS -- DO NOT COLLAPSE THESE

| Concept | Value | Source |
|---------|-------|--------|
| Package / API version | `1.5.0` | `pyproject.toml`, `__version__.py` |
| Active computational engine | `2.0.0` | `backend/engine_adapter.py:108` |
| Methodology version | `2.0.0-SP-PRP-TOPSIS` | `v2/provenance.py` |
| Methodology (MC layer) | `2.0.0-SP-PRP-TOPSIS-MC` | `v2/uncertainty.py:46` |
| Scientific baseline | `v1.5.0-FOUR-CRITERION-FREEZE` | commit 31eee4d |
| Git release tag | `v2.0.0` -> commit `1139397` | Git tag |

If an examiner asks "what version is PharmaPolySCOPE?":
"The package API is anchored at 1.5.0 for backward compatibility. The active computational
engine is v2.0.0 running methodology 2.0.0-SP-PRP-TOPSIS. The four-criterion compatibility
science is frozen at the v1.5.0-FOUR-CRITERION-FREEZE baseline, commit 31eee4d."

---

## How to Read This Map

**Three layers per concept:**

| Layer | What It Is | You Must Be Able To... |
|-------|-----------|----------------------|
| **A -- Literature** | Textbook/journal definition | Cite the standard source |
| **B -- Implementation** | What PharmaPolySCOPE actually does | Point to exact source file + line |
| **C -- Justification** | Why this specific design choice | Defend against a sceptical examiner |

**Two delivery levels:**
- **Level 1 (Intuition):** 30-second analogy for a smart non-specialist
- **Level 2 (PhD):** Formal definition, equation, governance threshold, consequence of violation

---

## Part 0 -- The Complete 9-Step Pipeline

```
RAW DRUG INPUT (SMILES + physicochemical profile)
        |
        v
[Step 0] CHEMICAL STRUCTURE VALIDATION  (RDKit)
         validate_chemical_structure() in chemistry.py
         No fallback in Research mode:
         SMILES parse failure => ProductionFallbackProhibitedError
         Metadata mismatch (MW, TPSA) => FATAL_METADATA_MISMATCH
        |
        v
[Step 1] FOUR-CRITERION COMPATIBILITY MATRIX S  (N_poly x 4, all values in [0,1])
         Columns: s_HSP | s_chi | s_desc | s_GT
         Source: src/asd_mcda/compatibility/matrix.py
        |
        v
[Step 2] STANDARDIZATION  Z_ij = (S_ij - mu_j) / sigma_j  (ddof=0, population std)
         Zero-variance guardrail: if sigma_j < 1e-8 => ZeroVarianceError
         Source: src/asd_mcda/v2/standardization.py
        |
        v
[Step 3] CORRELATION PCA   R = (1/n) * Z^T @ Z  via scipy.linalg.eigh
         K = min{ k : cumVar(k) >= 0.95 }  (Variable K -- core v2 innovation)
         Sign canonicalization applied to eigenvectors
         Source: src/asd_mcda/v2/pca.py
        |
        v
[Step 4] SUBSPACE STABILITY   delta_K = lambda_K - lambda_{K+1}
         >= 0.10 => STABLE | [0.03, 0.10) => WARNING | < 0.03 => BLOCKED
         Source: src/asd_mcda/v2/stability.py
        |
        v
[Step 5] AHP WEIGHTS  (principal eigenvector of 4x4 physical-criterion matrix)
         CR = CI / RI_4  (RI_4 = 0.89, hard-coded)
         CR < 0.08 => ACCEPT | CR >= 0.08 => AHPConsistencyViolationError
         Source: src/asd_mcda/v2/ahp.py
        |
        v
[Step 6] METRIC TENSOR   M_K = V_K^T @ W @ V_K   (W = diag(w_phys), K x K)
         Source: src/asd_mcda/v2/metrics.py
        |
        v
[Step 7] IDEAL / ANTI-IDEAL REFERENCE POINTS in K-dim subspace
         Rebaselined per cohort (no leakage from external data)
        |
        v
[Step 8] SP-PRP-TOPSIS CLOSENESS  (Subspace-Projected, Rebaselined-Reference-Point)
         D_i+ = sqrt( (t_i - t+)^T @ M_K @ (t_i - t+) )
         D_i- = sqrt( (t_i - t-)^T @ M_K @ (t_i - t-) )
         C_L_i = D_i- / (D_i+ + D_i-)  in [0,1]  -- ranked descending
         Source: src/asd_mcda/v2/metrics.py
        |
        v
[Step 9] MONTE CARLO (N_generated=10,000 replicates) + MORRIS SENSITIVITY
         AHP log-space perturbation (sigma_ahp=0.15)
         Compatibility scores: truncated normal (sigma_score=0.05), bounds [0,1]
         Every replicate: full re-run through VariableKEngine (no cached state)
         Indomethacin results:
           N_generated=10,000 | N_valid=8,600 | N_blocked=1,400 (~14%)
           AHP_CR_BLOCKED: 1,396 (dominant) | EIGENGAP_BLOCKED: 4
         p_top1 computed over N_valid replicates only
         Source: src/asd_mcda/v2/uncertainty.py, sensitivity.py
        |
        v
OUTPUT: VariableKDecisionSnapshot (SHA-256 signed, deep-frozen, fully stateless)
```

---

## Part 1 -- Pharmaceutical Foundations
**Curriculum folder:** `01_PHARMACEUTICAL_FOUNDATIONS\`
*(Phase 2 deep-dive document: 01_PHARMACEUTICAL_FOUNDATIONS\ASD_SCIENCE.md)*

### 1.1 What Is an Amorphous Solid Dispersion (ASD)?

**Level 1 -- Analogy:**
Imagine a poorly-soluble drug as a crystalline sugar clump that won't dissolve in water.
An ASD is produced by melting the drug together with a polymer then rapidly cooling.
The drug molecules are "frozen apart" within the polymer matrix in no particular crystal order.
Without crystal structure, they dissolve much faster when they encounter water in the gut.

**Level 2 -- PhD:**
An ASD is a thermodynamically metastable single-phase system in which the drug is
molecularly dispersed within a polymeric carrier matrix in the amorphous (non-crystalline)
state. Elimination of the drug's crystalline lattice energy enhances apparent solubility
(advantage up to 1,000x over crystalline form in extreme cases). Stability depends on:
- Drug-polymer interaction strength (HSP compatibility, chi)
- Glass-transition temperature of the dispersion (Gordon-Taylor)
- Hygroscopicity of the polymer

Manufacturing methods: Hot-melt extrusion, spray-drying (used in indomethacin validation).

---

### 1.2 Why Polymer Selection Is a Multi-Criterion Problem

**Level 2 -- PhD:**
Four orthogonal physicochemical criteria capture distinct compatibility mechanisms.
No single criterion captures all relevant interactions.

| Criterion | Physical Meaning | Source Module |
|-----------|-----------------|---------------|
| **s_HSP** | Hansen solubility parameter distance | `hsp_model.py` |
| **s_chi** | Flory-Huggins interaction parameter | `flory_huggins.py` |
| **s_desc** | Molecular descriptor proximity | `matrix.py` |
| **s_GT** | Gordon-Taylor glass-transition margin | `gordon_taylor.py` |

Each score is normalized to [0,1]. No single score dominates by design.
This is the four-criterion freeze baseline `v1.5.0-FOUR-CRITERION-FREEZE`.

---

### 1.3 The Active Five-Polymer Validated Cohort (v2)

**Source of truth:** `config/polymers/polymer_library_v3_five_polymers.csv`

| polymer_id    | Abbreviation  | Full Name                             | Family      |
|--------------|-------------|---------------------------------------|-------------|
| POL-001-2026  | PVP_K30      | Polyvinylpyrrolidone K30              | vinylic      |
| POL-002-2026  | PVP_VA_64    | PVP-Vinyl Acetate 64                  | vinylic      |
| POL-005-2026  | SOLUPLUS     | Soluplus                              | acrylic      |
| POL-006-2026  | HPMC_E5      | Hydroxypropyl Methylcellulose E5      | cellulosic   |
| POL-007-2026  | EDR_EPO      | Eudragit E PO                         | acrylic      |

**HPMCAS-MF:** A different cellulosic polymer (hydroxypropyl methylcellulose acetate
succinate) that is NOT part of the active v2 validated cohort. It is absent from
`polymer_library_v3_five_polymers.csv`. It could be added in Exploratory mode as a
custom candidate, but this has not been validated.

**VIVA RULE:** Never say "best polymer." Say "top-ranked computational candidate for
[drug] under the SP-PRP-TOPSIS framework with the specified uncertainty model."

---

### 1.4 Validated Indomethacin Deterministic Ranking

**Source:** `results/validation/v2_scientific_validation/scientific_validation_results.json`
(authoritative, do NOT infer from any other source)

Indomethacin: K=3, cumVar=99.963%, eigengap=0.7383 (STABLE), AHP CR=0.049415 (ACCEPTED)

| Rank | Polymer ID    | Name           | C_L (TOPSIS)  | MC p_top1 |
|------|--------------|---------------|--------------|----------|
| 1    | POL-005-2026 | Soluplus       | 0.6864350840  | 55.51%   |
| 2    | POL-006-2026 | HPMC E5        | 0.6731464918  | 42.00%   |
| 3    | POL-002-2026 | PVP-VA64       | 0.6062468903  |  1.38%   |
| 4    | POL-001-2026 | PVP K30        | 0.5875839043  |  0.56%   |
| 5    | POL-007-2026 | Eudragit E PO  | 0.5456162038  |  0.55%   |

Note: p_top1 percentages computed over N_valid=8,600 valid replicates (of 10,000 generated).

Correct interpretation of 55.51%:
"Soluplus achieved the top-1 computational rank in 55.51% of the 8,600 valid replicates
under the specified uncertainty model (sigma_score=0.05, ahp_log_sd=0.15, seed=42)."
Do NOT say "55.51% chance of formulation success."

---

## Part 2 -- Chemical Informatics
**Curriculum folder:** `02_CHEMICAL_INFORMATICS\`
*(Phase 2 deep-dive: 02_CHEMICAL_INFORMATICS\RDKIT_AND_DESCRIPTORS.md)*

### 2.1 SMILES and RDKit

RDKit parses SMILES to compute:
- NumHDonors (HBD), NumHAcceptors (HBA): hydrogen-bond counts
- TPSA: topological polar surface area
- NumAromaticRings: aromatic ring count
- MolWt + density: needed for Flory-Huggins V_m

**CRITICAL GOVERNANCE RULE -- RESEARCH MODE:**
In v2 Research mode, `chemistry.py` has NO fallback. SMILES parse failure =>
`ProductionFallbackProhibitedError` => analysis blocked immediately.

Rationale: A silent fallback would propagate incorrect physicochemical properties
into the compatibility scores without any warning. This is the lesson of DRG-0002.

---

### 2.2 The s_desc Formula -- Exact Implementation

**Source:** `src/asd_mcda/compatibility/matrix.py` lines 48-74
**DEFAULT_DESC_SUBWEIGHTS** (utils/constants.py): {hbd:0.30, hba:0.30, tpsa:0.20, aromatic:0.20}

```
s_desc = 0.30 * match_HBD  +  0.30 * match_HBA  +  0.20 * prox_TPSA  +  0.20 * ratio_arom

match_HBD  = max(0,  1 - |HBD_d - HBD_p| / max(HBD_d, HBD_p, 1)  )
match_HBA  = max(0,  1 - |HBA_d - HBA_p| / max(HBA_d, HBA_p, 1)  )
prox_TPSA  = max(0,  1 - |TPSA_d - TPSA_p| / 200.0               )
ratio_arom =           min(arom_d, arom_p) / max(arom_d, arom_p, 1)
```

Key design decisions:
- `max(..., 1)` denominator: zero-division guard when both drug and polymer have 0 donors/acceptors
- `200.0` for TPSA: empirical upper bound for drug-like TPSA; converts difference to [0,1]
- These sub-weights are INTRA-s_desc weights -- completely separate from AHP criterion weights

**VIVA CRITICAL DISTINCTION:**
The four AHP weights [0.408, 0.324, 0.092, 0.176] rank the FOUR CRITERIA against each other.
The s_desc sub-weights [0.30, 0.30, 0.20, 0.20] weight sub-components WITHIN s_desc only.
They are independent and operate at different levels. Do NOT conflate them.

---

## Part 3 -- Compatibility Criteria
**Curriculum folder:** `03_COMPATIBILITY_CRITERIA\`
*(Phase 2 deep-dive: 03_COMPATIBILITY_CRITERIA\FOUR_CRITERIA_DEEP_DIVE.md)*

### 3.1 s_HSP -- Hansen Solubility Parameters

**Correct terminology:** "compatibility diagnostic" (NOT "miscibility predictor")

**Level 2:**
HSP decomposes total cohesion energy into three components (dispersion, polar, hydrogen):

    delta_total^2 = delta_d^2 + delta_p^2 + delta_h^2

Geometric distance in HSP space (Hansen, 1967):

    R_a = sqrt( 4*(delta_d_drug - delta_d_poly)^2 + (delta_p_drug - delta_p_poly)^2
                + (delta_h_drug - delta_h_poly)^2 )

Factor of 4 on dispersion term: Hansen's empirical correction from experimental data.

Normalized score:  s_HSP = 1 - R_a / R_max

What s_HSP does NOT do: does not model molecular-level interactions, entropic effects,
or concentration-dependent miscibility. It is a geometric screening diagnostic.

---

### 3.2 s_chi -- Flory-Huggins Interaction Parameter

**Correct terminology:** "interaction compatibility / phase-boundary diagnostic"

**Level 2:**
Flory-Huggins free energy of mixing per mole of lattice sites:

    DeltaG_mix / (nRT) = phi_1 * ln(phi_1) + (phi_2/r) * ln(phi_2) + chi * phi_1 * phi_2

Miscibility condition: chi < chi_critical = (1/2) * (1 + 1/sqrt(r))^2

chi estimated from HSP:

    chi = (V_m / RT) * (delta_drug - delta_poly)^2

V_m = M_w / rho_crystalline  [cm3/mol]

ITRACONAZOLE: rho_crystalline = 1.27 g/cm3, V_m = 555.59 cm3/mol (validated)

---

### 3.3 s_GT -- Gordon-Taylor Glass Transition

**Correct terminology:** "model-predicted glass-transition margin"

**Level 2:**
Gordon-Taylor equation for binary Tg:

    T_g_mix = (w1 * T_g1 + K_GT * w2 * T_g2) / (w1 + K_GT * w2)

where K_GT approximately equals rho_1 * T_g1 / (rho_2 * T_g2) (Kelly-Bueche approximation)

Default drug loading: 30% w/w (drug_loading_ww = 0.30, `matrix.py` line 26)

Score s_GT reflects margin between T_g_mix and 25C (storage) and 40C (stress testing).
Higher margin => better kinetic stability.

---

### 3.4 s_desc Cross-Reference

See Part 2.2 for full formula.
DEFAULT_DESC_SUBWEIGHTS {0.30, 0.30, 0.20, 0.20} are intra-s_desc sub-weights;
four AHP weights [0.408, 0.324, 0.092, 0.176] are inter-criterion weights. Completely distinct.

---

## Part 4 -- Mathematics
**Curriculum folder:** `04_MATHEMATICS\`
*(Phase 2 deep-dive: 04_MATHEMATICS\STEP_BY_STEP_MATH.md)*

### 4.1 Standardization -- Step 2

**Level 2:**
Population standardization (ddof=0):

    Z_ij = (S_ij - mu_j) / sigma_j
    mu_j = (1/n) * sum_i S_ij
    sigma_j = sqrt( (1/n) * sum_i (S_ij - mu_j)^2 )

- n = number of polymers in the current cohort
- ddof=0: population denominator (correct because the cohort IS the full population)
- Zero-variance guardrail: sigma_j < 1e-8 => ZeroVarianceError (prevents division by zero)

**Viva defence for ddof=0:** "We have the entire cohort of N candidate polymers under
analysis. This is the population, not a sample drawn from a larger population. Using n
in the denominator (population variance) is the appropriate choice."

---

### 4.2 PCA -- Correlation Matrix and Variable K -- Step 3

**Level 2:**
Empirical correlation matrix:

    R = (1/n) * Z^T @ Z   [4 x 4 symmetric positive semi-definite]

Uses (1/n) consistently with ddof=0 standardization.

Eigendecomposition:

    scipy.linalg.eigh(R)  =>  lambda_1 >= lambda_2 >= lambda_3 >= lambda_4 >= 0

Sign canonicalization: for each eigenvector, find the element with largest absolute value.
If it is negative, flip the entire vector. Ties broken by lowest index within 1e-12 tolerance.

Dynamic K selection (the core v2 architectural innovation vs v1.5 fixed K=2):

    K = min{ k : (lambda_1 + ... + lambda_k) / 4  >=  0.95 }

Total variance = 4 (trace of R = 4, because four unit-variance standardized criteria).

PCA identifies ORTHOGONAL DIRECTIONS capturing variance in the cohort compatibility data.
It does NOT discard criteria and does NOT identify which criteria are "most important."
All four criteria contribute to the retained subspace via the eigenvectors.

**Note: "PCA picks the important criteria" is WRONG.** Say instead: "PCA identifies
orthogonal directions capturing variance in the cohort compatibility data. The retained
subspace is a linear combination of all four criteria."

---

### 4.3 Subspace Stability -- Eigengap -- Step 4

**Level 2:**

    delta_K = lambda_K - lambda_{K+1}

| delta_K | Status | Consequence |
|---------|--------|-------------|
| >= 0.10 | STABLE | Proceed normally |
| [0.03, 0.10) | WARNING | Proceed with warning recorded in report |
| < 0.03 | BLOCKED | DegenerateSubspaceBlockedError; analysis halted |

Special case: K = p = 4 (retain all) => delta_K = +infinity => unconditionally STABLE.

**Production values from scientific_validation_results.json:**

| Drug | K | lambda_K | lambda_{K+1} | delta_K | Status |
|------|---|---------|-------------|---------|--------|
| Indomethacin | 3 | 0.7398 | 0.0015 | 0.7383 | STABLE |
| Ibuprofen | 2 | (K=2) | - | 0.8169 | STABLE |
| Itraconazole | 2 | (K=2) | - | 0.6504 | STABLE |

---

### 4.4 AHP -- Analytic Hierarchy Process -- Step 5

**AUTHORITATIVE v2 4x4 PAIRWISE COMPARISON MATRIX A**

Source: `backend/services/engine_adapter.py` lines 99-104 (AUTHORITATIVE_V2_AHP_MATRIX)
Confirmed by: `tests/v2/conftest.py` lines 206-211 (ahp_reciprocal_matrix fixture)

```
           s_HSP    s_chi    s_desc   s_GT
s_HSP  [  1.000    2.000    3.000    2.000  ]
s_chi  [  0.500    1.000    5.000    2.000  ]
s_desc [  0.333    0.200    1.000    0.500  ]
s_GT   [  0.500    0.500    2.000    1.000  ]
```

Exact entry values:
- A[1,0] = 1/2 = 0.5 exactly
- A[2,0] = 1/3 = 0.333333... exactly (reciprocal of A[0,2]=3)
- A[2,1] = 1/5 = 0.2 exactly (reciprocal of A[1,2]=5)
- A[2,3] = 1/2 = 0.5 exactly (reciprocal of A[3,2]=2)
- A[3,0] = 1/2 = 0.5 exactly (reciprocal of A[0,3]=2)
- A[3,1] = 1/2 = 0.5 exactly (reciprocal of A[1,3]=2)

Reciprocity condition: a_ji = 1/a_ij for all i != j.
Maximum reciprocity error: < 1e-12 (enforced by uncertainty.py).

**Physical meaning of matrix entries (v2 expert judgement):**
- s_HSP is preferred over s_chi (2x), over s_desc (3x), and over s_GT (2x)
- s_chi is strongly preferred over s_desc (5x) and over s_GT (2x)
- s_GT is preferred over s_desc (2x)

This reflects the expert view that thermodynamic affinity criteria (HSP, chi) outrank
molecular shape descriptors (desc) and glass-transition margin (GT).

**V1.5 AHP design (for historical reference):**
v1.5 operated AHP over the 2 retained principal components (PC1, PC2), not over the
4 physical criteria. The v1.5 config files (expert_001/002/003.json) contain 2x2 matrices
for PC1:PC2. These are NOT used by the v2 engine. See Part 7.2.

**Consistency check:**

    lambda_max = 4.131937073898666  (production validated)
    CI = (lambda_max - p) / (p - 1) = (4.131937 - 4) / 3 = 0.043979
    RI_4 = 0.89  (Saaty, hard-coded in ahp.py)
    CR = CI / RI_4 = 0.043979 / 0.89 = 0.049415
    CR < 0.08 => ACCEPTED (governance gate PASSED)

    Weights (principal eigenvector method, validated):
    w_HSP  = 0.40767478
    w_chi  = 0.32443341
    w_desc = 0.09216134
    w_GT   = 0.17573047

---

### 4.5 Metric Tensor and SP-PRP-TOPSIS -- Steps 6-8

**Key distinction from classical Hwang-Yoon TOPSIS (1981):**
Classical TOPSIS computes Euclidean distances in the original p-dimensional criterion space,
with weights applied as simple multiplicative scalars. It does not account for correlations
between criteria and assumes a fixed problem dimensionality.

**PharmaPolySCOPE v2 SP-PRP-TOPSIS:**
- **Subspace-Projected:** Distances are computed in K-dimensional PCA subspace (not full 4D)
- **Rebaselined-Reference-Point:** Ideal/anti-ideal reference points are recalculated per cohort
  (no external normalization; no cross-analysis leakage)
- The metric tensor M_K simultaneously encodes PCA geometry (V_K) and AHP weights (W)

**Step 6 -- Metric Tensor** (source: `src/asd_mcda/v2/metrics.py`):

    M_K = V_K^T @ W @ V_K

    V_K: (4 x K) matrix of first K eigenvectors (PCA basis vectors)
    W = diag(w_phys): diagonal 4x4 matrix of AHP physical weights
    M_K: (K x K) symmetric positive-definite "distance ruler" in PCA subspace

**Step 7 -- Reference Points (rebaselined per cohort):**

    t_i = V_K^T @ z_i  (project standardized scores into K-space)
    t+ = element-wise max of {t_i} across all candidates  (ideal profile in K-space)
    t- = element-wise min of {t_i} across all candidates  (anti-ideal profile in K-space)

**Step 8 -- Closeness Coefficient** (source: `src/asd_mcda/v2/metrics.py`):

    D_i+ = sqrt( (t_i - t+)^T @ M_K @ (t_i - t+) )  [weighted distance to ideal]
    D_i- = sqrt( (t_i - t-)^T @ M_K @ (t_i - t-) )  [weighted distance to anti-ideal]
    C_L_i = D_i- / (D_i+ + D_i-)   in [0, 1]

C_L = 1: identical to ideal profile. C_L = 0: identical to anti-ideal.
Candidates ranked by C_L descending.

**Production-validated results (Indomethacin, K=3, from scientific_validation_results.json):**

| Rank | Polymer        | C_L         | D_plus    | D_minus   |
|------|---------------|------------|----------|---------|
| 1    | Soluplus       | 0.686435   | 4.18260  | 9.15627 |
| 2    | HPMC E5        | 0.673146   | 4.19608  | 8.64173 |
| 3    | PVP-VA64       | 0.606247   | 5.08237  | 7.82514 |
| 4    | PVP K30        | 0.587584   | 5.34402  | 7.61382 |
| 5    | Eudragit E PO  | 0.545616   | 5.67124  | 6.80993 |

---

## Part 5 -- Decision Science
**Curriculum folder:** `05_DECISION_SCIENCE\`
*(Phase 2 deep-dive)*

### 5.1 Why Not Use Each Criterion Independently?

Single-criterion screening risks:
- A polymer that scores 0.95 on s_HSP but 0.0 on s_GT might crystallize rapidly in storage
- A polymer excellent by chi but poor on s_desc misses important molecular-level interactions

MCDA allows compensatory trade-off while preserving the relative importance structure (AHP weights).

### 5.2 Why SP-PRP-TOPSIS Over Classical TOPSIS?

| Method | What It Captures | What It Misses |
|--------|-----------------|---------------|
| AHP alone | Expert preference | Data-driven variance / correlation |
| PCA alone | Data geometry | Expert preference |
| Classical TOPSIS | Distance to ideal in full space | Criterion collinearity; fixed dimensionality |
| SP-PRP-TOPSIS | AHP weights + PCA geometry + variable K | The complete picture |

---

## Part 6 -- Uncertainty and Sensitivity Analysis
**Curriculum folder:** `06_UNCERTAINTY_SENSITIVITY\`
*(Phase 2 deep-dive)*

### 6.1 Monte Carlo Uncertainty Analysis

**Implementation default** (`src/asd_mcda/v2/uncertainty.py` line 160):

    num_replicates: int = 10000   [authoritative default -- not 2000]

**Validation study** (`scientific_validation_results.json`, Indomethacin cohort):

    N_generated = 10,000    (total replicates attempted)
    N_valid     = 8,600     (replicates passing all governance gates)
    N_blocked   = 1,400     (~14% of generated)
    valid_ratio = 0.86

**Block reason histogram (Indomethacin, authoritative from validation JSON):**

    AHP_CR_BLOCKED:     1,396   (dominant -- perturbed AHP matrix pushed CR >= 0.08)
    EIGENGAP_BLOCKED:       4   (perturbed scores created near-degenerate subspace)
    All other reasons:      0

**Input perturbation design:**
- Compatibility scores: truncated normal, sigma=0.05, hard-clipped to [0,1]
- AHP matrix: log-space Gaussian perturbation with sigma_ahp=0.15
  (preserves exact analytical reciprocity a_ji = 1/a_ij to within 1e-12)
- Random seed: 42 (fully deterministic and reproducible)

**Full re-run per replicate:**
Monte Carlo re-runs COMPLETE VariableKEngine per replicate:
Fresh standardization + fresh PCA + fresh K selection + fresh eigengap check +
fresh AHP solve + fresh M_K + fresh C_L. Zero state leakage.

**~14% blocked replicates:**
These replicates are governance-blocked (CR enforcement, eigengap enforcement) and
EXCLUDED from p_top1 and rank distribution calculations. This is NOT a failure --
the governance gate correctly enforces CR < 0.08 on every perturbed replicate.

**Frequency p_top1 (Indomethacin, computed over N_valid=8,600 valid replicates):**

| Polymer | p_top1 |
|---------|--------|
| Soluplus | 55.51% |
| HPMC E5 | 42.00% |
| PVP-VA64 | 1.38% |
| PVP K30 | 0.56% |
| Eudragit E PO | 0.55% |

Correct interpretation: "Soluplus achieved top-1 computational rank in 55.51% of the
8,600 valid replicates under the specified uncertainty model."
NEVER say: "55.51% probability of formulation success."

**K distribution (Indomethacin, over N_valid=8,600 valid replicates):**

    K=1:  0.00% of valid replicates
    K=2:  2.12% of valid replicates
    K=3: 90.78% of valid replicates  (dominant -- consistent with deterministic K=3)
    K=4:  7.10% of valid replicates

---

### 6.2 Morris Elementary Effects Sensitivity Analysis

**Per input factor i:**

    EE_i = [ f(x + delta_i * e_i) - f(x) ] / delta_i

Statistics over r trajectories:

    mu_star_i = (1/r) * sum_t |EE_i^t|     (overall importance)
    sigma_i   = std(EE_i)                   (non-linearity / interaction strength)

High mu_star => strong influence on C_L ranking.
High sigma / mu_star ratio => non-linear or interacting effects.

**Top factors (Indomethacin, from scientific_validation_results.json):**

    Rank 1: score_POL-005-2026_s_desc (Soluplus s_desc)  mu_star = 0.1444
    Rank 2: score_POL-007-2026_s_HSP  (Eudragit E PO HSP) mu_star = 0.1001

The s_desc score for Soluplus has the largest marginal effect on the C_L ranking --
meaning uncertainty in the Soluplus molecular descriptor score matters most to
the overall ranking stability.

Source: `src/asd_mcda/v2/sensitivity.py`

---

## Part 7 -- Software Architecture
**Curriculum folder:** `07_SOFTWARE_ARCHITECTURE\`
*(Phase 2 deep-dive: 07_SOFTWARE_ARCHITECTURE\VERSION_SEMANTICS_V15_V2.md)*

### 7.1 Version Architecture -- Four Distinct Concepts

See the table at the top of this document. NEVER collapse them.

### 7.2 v1.5 vs v2 -- Architectural Isolation

**v1.5 engine (frozen, historical):**
- Location: `src/asd_mcda/` (NOT the v2 subdirectory)
- Frozen byte-identical to commit 31eee4d (confirmed by golden hash manifest test)
- Fixed K=2 (two principal components hardcoded throughout)
- AHP operated over PC1 and PC2 (2x2 matrix), NOT the four physical criteria
- Isolation confirmed by: test_zero_v15_import_dependencies (AST scan) -- PASSES

**v2 engine (active production):**
- Location: `src/asd_mcda/v2/`
- Zero imports from v1.5 (confirmed by AST scan)
- VARIABLE K (data-driven, minimum K to capture >= 95% variance)
- AHP operates over the FOUR PHYSICAL CRITERIA (4x4 matrix)
- Then projects weights through metric tensor M_K into the PCA subspace

**CRITICAL ARCHITECTURAL DISTINCTION:**
v1.5: AHP weighed 2 retained PCs (PC1:PC2). 2x2 matrices in expert_001/002/003.json.
v2: AHP weighs 4 PHYSICAL CRITERIA (s_HSP:s_chi:s_desc:s_GT). 4x4 matrix in engine_adapter.py.
These are fundamentally different designs. Do NOT confuse them in viva.

### 7.3 Stateless Guarantee

VariableKEngine.__init__ contains only `pass`.
Every evaluate() call is fully self-contained -- fresh standardization, fresh PCA,
fresh AHP, fresh reference points. Thread-safe. Scientifically reproducible. Audit-clean.

### 7.4 Cryptographic Provenance

Every analysis produces a VariableKDecisionSnapshot with:
- **analysis_fingerprint:** SHA-256(raw_scores || AHP_matrix || methodology_version || semantic_mode)
- **full_manifest_sha256:** SHA-256 of complete provenance manifest (two-pass non-circular protocol)
- Source: `src/asd_mcda/v2/provenance.py`

---

## Part 8 -- Validation and Reproducibility
**Curriculum folder:** `08_VALIDATION_REPRODUCIBILITY\`
*(Phase 2 deep-dive: 08_VALIDATION_REPRODUCIBILITY\DRG0002_INCIDENT_DETAILED.md)*

### 8.1 Test Coverage Summary

| Suite | Location | Result |
|-------|----------|--------|
| v2 engine | `tests/v2/` | 116/116 PASS |
| Web API | `tests/web/` | 11/11 PASS |
| PDF integrity | `tests/pdf/` | 18/18 PASS |
| Legacy v1.5 | `tests/` (root) | 6 FAIL -- BY DESIGN |

**On the 6 legacy v1.5 failures:**
The legacy tests encode the frozen v1.5 fixed-K=2 architecture. When corrected drug
chemistry is applied, the v2 variable-K engine selects K=3 for Indomethacin.

These tests are NOT v2 acceptance tests. They preserve the historical v1.5 contract
and confirm v1.5 code is byte-identical to commit 31eee4d.

Correct framing: "Those tests preserve the historical v1.5 fixed-K contract; the v2
architecture deliberately removes the fixed-K assumption. The failing tests do not
indicate a bug in v1.5 -- they indicate that v1.5's fixed-K design assumption is
architecturally superseded by v2."

Do NOT say: "The failing tests prove v1.5 was wrong."

---

### 8.2 DRG-0002 Quarantine -- The Input-Integrity Incident

**What happened:**
Drug profile DRG-0002 was labelled "Fenofibrate" but contained Indomethacin SMILES
and Indomethacin physicochemical parameters (rho_crystalline=1.781 g/cm3, V_m=200.89).
This is an input-integrity violation -- fabricated/placeholder chemistry submitted as
a real candidate drug profile.

**Detection mechanism:**
v2 `chemistry.py` `validate_chemical_structure()` computed MW from SMILES via RDKit
and compared to profile metadata. Mismatch detected => FATAL_METADATA_MISMATCH raised.
Profile permanently blocked.

**FOUR CRITICAL DISTINCTIONS for viva:**

1. Blocking an invalid input is evidence the INPUT-GOVERNANCE LAYER detected an
   integrity problem. It is NOT evidence that the underlying scientific model is correct.

2. The original 18-drug batch (historical v1.5 analyses, some using invalid/placeholder
   chemistry) is NOT valid scientific evidence. Those results are under review.

3. The v2 fail-fast behavior (ProductionFallbackProhibitedError) is a METHODOLOGICAL
   INTEGRITY SAFEGUARD, not a proof of scientific validity.

4. Blocking rather than approximating is a deliberate scientific integrity decision.
   A silent fallback would have propagated incorrect V_m into Flory-Huggins chi
   calculations, corrupting results silently without any warning.

---

### 8.3 Audit Classification

**Final verdict:** B -- RELEASE READY WITH DOCUMENTED LIMITATIONS

**Documented limitations (not defects):**
1. RDKit installed as 2026.03.5 vs declared >=2026.3.6; zero functional regression in 116/116 v2 tests
2. 6 legacy v1.5 tests fail -- preserve historical contract, not v2 acceptance tests
3. `v2/provenance.py` ENGINE_VERSION = "2.0.0-draft" -- overridden to "2.0.0" at web layer
4. Validation JSON records "2.0.0-draft" for engine -- minor, fully documented

---

## Part 9 -- Viva Attack Files (Preview)
**Curriculum folder:** `09_VIVA_ATTACK_FILES\`
*(Phase 2 full document: 09_VIVA_ATTACK_FILES\ATTACK_AND_RESPONSE.md)*

| # | Examiner Attack | Core Defence Principle |
|---|----------------|----------------------|
| 1 | "Why PCA before TOPSIS?" | Removes criterion collinearity; K is data-driven; M_K places AHP weights in geometrically correct subspace |
| 2 | "AHP weights are subjective" | CR=0.049 < 0.08; governance-gated; Morris sensitivity identifies which weights matter |
| 3 | "HSP is old (1967)" | Compatibility diagnostic, not a prediction; one of four criteria; limitations hedged by multi-criterion aggregation |
| 4 | "Why ddof=0 not ddof=1?" | Full cohort IS the population; n in denominator is correct for population variance |
| 5 | "What if K=4?" | delta_K = +infinity; unconditionally STABLE; M_K becomes full 4x4 physical-space metric |
| 6 | "RDKit version mismatch" | Classification B documented limitation; zero functional regression in 116/116 v2 tests |
| 7 | "DRG-0002 invalidates everything" | Shows input-governance working correctly; does NOT validate the scientific model; 18-drug batch under review |
| 8 | "Why 10,000 MC replicates?" | Implementation default = 10,000; validation study = 10,000; convergence of p_top1 verified |
| 9 | "You said 55.51% probability of success" | That is computational top-1 frequency over 8,600 valid replicates; not clinical probability; experimental confirmation required |
| 10 | "Your v1.5 tests are failing" | Those 6 tests preserve the frozen v1.5 contract; not v2 acceptance tests; confirm v1.5 isolation |
| 11 | "s_desc has arbitrary sub-weights" | Sub-weights are intra-s_desc and SEPARATE from AHP criterion weights; they weight descriptor sub-components |
| 12 | "HPMCAS-MF would have ranked higher" | HPMCAS-MF is not in the validated cohort; adding an unvalidated polymer would require revalidation |

---

## Part 12 -- Numbers You Must Know (Memorise)
**Curriculum folder:** `12_NUMBERS_YOU_MUST_KNOW\`
*(Phase 2 flashcard set: 12_NUMBERS_YOU_MUST_KNOW\FLASHCARDS.md)*

| Value | What It Is | Source |
|-------|-----------|--------|
| **0.95** | PCA cumulative variance threshold | `pca.py` |
| **0.10 / 0.03** | Eigengap STABLE / BLOCKED thresholds | `stability.py` |
| **0.08** | AHP CR governance gate (CR < 0.08 = ACCEPTED) | `ahp.py` |
| **0.89** | RI_4: Saaty Random Index for 4x4 matrix | `ahp.py` (hard-coded) |
| **4.131937** | lambda_max (production AHP) | validation JSON |
| **0.043979** | CI = (lambda_max-4)/3 | validation JSON |
| **0.049415** | CR = CI/RI_4 (< 0.08, ACCEPTED) | validation JSON |
| **[0.40767478, 0.32443341, 0.09216134, 0.17573047]** | AHP weights [s_HSP, s_chi, s_desc, s_GT] | validation JSON |
| **K=3** | Indomethacin retained PCA components | validation JSON |
| **99.9634%** | Indomethacin cumulative variance | validation JSON |
| **0.73831043** | Indomethacin eigengap delta_3 (STABLE) | validation JSON |
| **K=2** | Ibuprofen retained components | validation JSON |
| **K=2** | Itraconazole retained components | validation JSON |
| **0.6864350840** | Indomethacin Soluplus C_L (Rank 1) | validation JSON |
| **0.6731464918** | Indomethacin HPMC E5 C_L (Rank 2) | validation JSON |
| **0.6062468903** | Indomethacin PVP-VA64 C_L (Rank 3) | validation JSON |
| **0.5875839043** | Indomethacin PVP K30 C_L (Rank 4) | validation JSON |
| **0.5456162038** | Indomethacin Eudragit E PO C_L (Rank 5) | validation JSON |
| **55.51%** | Soluplus p_top1 (over 8,600 valid reps) | validation JSON |
| **10,000** | MC N_generated | uncertainty.py + validation JSON |
| **8,600** | MC N_valid (Indomethacin) | validation JSON |
| **1,400** | MC N_blocked (Indomethacin) | validation JSON |
| **1,396** | AHP_CR_BLOCKED count (dominant block) | validation JSON |
| **~14%** | Fraction MC blocked (1400/10000) | validation JSON |
| **0.86** | MC valid_ratio | validation JSON |
| **0.05** | MC score uncertainty sigma | uncertainty.py |
| **0.15** | MC AHP log-space sigma | uncertainty.py |
| **42** | MC random seed | uncertainty.py |
| **200.0** | TPSA normalization constant (s_desc) | matrix.py |
| **0.30/0.30/0.20/0.20** | s_desc sub-weights (HBD/HBA/TPSA/arom) | utils/constants.py |
| **1e-12** | AHP reciprocity tolerance | ahp.py / uncertainty.py |
| **1e-8** | Zero-variance guardrail threshold | standardization.py |
| **30% w/w** | Default drug loading (Gordon-Taylor) | matrix.py line 26 |
| **1.27 g/cm3** | Itraconazole crystalline density | validation config |
| **555.59 cm3/mol** | Itraconazole V_m (corrected) | validation JSON |
| **1.781 g/cm3** | DRG-0002 incorrect density (quarantined) | audit record |

---

## Part 13 -- Do NOT Say This in Viva
**Curriculum folder:** `13_DO_NOT_SAY_THIS_IN_VIVA\`
*(Phase 2 extended: 13_DO_NOT_SAY_THIS_IN_VIVA\FORBIDDEN_PHRASES_EXTENDED.md)*

| NEVER SAY | SAY INSTEAD |
|-----------|------------|
| "The best polymer is Soluplus" | "Soluplus is the top-ranked computational candidate for Indomethacin under the SP-PRP-TOPSIS framework with the specified uncertainty model" |
| "HSP tells us which polymer is most compatible" | "s_HSP provides a geometric compatibility diagnostic in HSP space; it is one of four criteria aggregated by the framework" |
| "The software predicts which polymer works" | "The framework computationally ranks candidates under specified physicochemical assumptions; experimental validation remains essential" |
| "PCA identifies the important criteria" | "PCA identifies orthogonal directions capturing variance in the cohort data; all four criteria contribute to the retained subspace" |
| "We used version 1.5.0" | "The package API is anchored at 1.5.0; the active engine is v2.0.0 running 2.0.0-SP-PRP-TOPSIS" |
| "We removed one of the criteria" | "All four criteria are preserved in the four-criterion freeze; PCA identifies a lower-dimensional subspace but all four contribute via the eigenvectors" |
| "14% of Monte Carlo runs failed" | "1,400 of 10,000 generated replicates were governance-blocked (1,396 AHP_CR_BLOCKED + 4 EIGENGAP_BLOCKED); the system correctly enforced governance gates" |
| "55.51% chance of formulation success" | "55.51% computational top-1 frequency under the specified uncertainty model, over 8,600 valid replicates of 10,000 generated" |
| "The v1.5 tests failing proves v1.5 was wrong" | "Those 6 tests preserve the historical v1.5 fixed-K contract; they confirm v1.5 isolation; they are not v2 acceptance tests" |
| "DRG-0002 proves the governance system works" | "DRG-0002 demonstrates that the input-validation layer detected an integrity problem; this validates input governance, not the scientific model" |
| "The 18-drug batch results are valid" | "Those results used historical v1.5 methodology and potentially invalid chemistry; they are under review" |
| "HSP proves drug-polymer miscibility" | "s_HSP provides a compatibility diagnostic based on solubility parameter distance; thermodynamic miscibility requires experimental confirmation" |

---

## Part 14 -- Board Explanations (Preview)
**Curriculum folder:** `14_BOARD_EXPLANATIONS\`
*(Phase 2 whiteboard scripts)*

1. **5-minute pipeline walk:** SMILES => S matrix => Z => R => K selection => AHP =>
   M_K => ideal/anti-ideal => C_L => full ranking

2. **AHP consistency demonstration:** Draw the CORRECT 4x4 matrix (with [1,2,3,2] in row 1
   and [0.5,1,5,2] in row 2 -- NOT [1,2,5,3] and [0.5,1,4,2]).
   Show lambda_max = 4.132, CI = 0.044, CR = 0.049 < 0.08 [ACCEPTED].

3. **Eigengap bar chart:** Four eigenvalues for Indomethacin: ~2.09, ~1.17, ~0.74, ~0.001.
   Gap between bar 3 and bar 4 = delta_3 = 0.738. K=3 STABLE (gap >> 0.10).

4. **SP-PRP-TOPSIS vs classical:** Show M_K = V_K^T @ W @ V_K. Explain it simultaneously
   respects PCA geometry (V_K) and expert preference (W). Classical TOPSIS lacks both.

5. **v1.5 vs v2 AHP distinction:** v1.5 AHP operated over PC1:PC2 (2x2).
   v2 AHP operates over s_HSP:s_chi:s_desc:s_GT (4x4). Fundamentally different designs.

---

## Part 99 -- Indexes and Cross References
**Curriculum folder:** `99_INDEXES_AND_CROSS_REFERENCES\`

### Recommended Learning Sequence

```
Step  1: Part 1 (ASD Foundations) -- WHAT you are solving
Step  2: Part 3 (Four Criteria) -- WHAT you measure and WHY
Step  3: Part 2 (Chemical Informatics, s_desc formula) -- HOW descriptors computed
Step  4: Part 4.1-4.3 (Standardization, PCA, Eigengap) -- Core math
Step  5: Part 4.4 (AHP -- CORRECT MATRIX -- drill it) -- Preference structure
Step  6: Part 4.5 (Metric Tensor + SP-PRP-TOPSIS) -- Ranking mechanism
Step  7: Part 6 (MC + Morris -- 10k replicates) -- Robustness
Step  8: Part 7 (Software Architecture) -- v1.5/v2 distinction
Step  9: Part 8 (Validation + DRG-0002) -- Audit + input-integrity
Step 10: Part 12 (All numbers -- MEMORISE) -- Non-negotiable
Step 11: Part 13 (Forbidden phrases -- DRILL) -- Automatic substitution
Step 12: Part 9 (Attack Files -- Phase 2) -- Attack-and-response drills
Step 13: Part 14 (Board Explanations -- Phase 2) -- Whiteboard practice
```

### Complete Source File Index

| Concept | Source File |
|---------|------------|
| Four-criterion S matrix | `src/asd_mcda/compatibility/matrix.py` |
| HSP model | `src/asd_mcda/compatibility/hsp_model.py` |
| Flory-Huggins chi | `src/asd_mcda/compatibility/flory_huggins.py` |
| Gordon-Taylor Tg | `src/asd_mcda/compatibility/gordon_taylor.py` |
| Descriptor constants | `src/asd_mcda/utils/constants.py` |
| Standardization | `src/asd_mcda/v2/standardization.py` |
| PCA | `src/asd_mcda/v2/pca.py` |
| Eigengap stability | `src/asd_mcda/v2/stability.py` |
| AHP solver | `src/asd_mcda/v2/ahp.py` |
| **AUTHORITATIVE AHP MATRIX** | **`backend/services/engine_adapter.py` lines 99-104** |
| AHP matrix test fixture | `tests/v2/conftest.py` lines 206-211 |
| Metric tensor + SP-PRP-TOPSIS | `src/asd_mcda/v2/metrics.py` |
| Monte Carlo | `src/asd_mcda/v2/uncertainty.py` |
| Morris sensitivity | `src/asd_mcda/v2/sensitivity.py` |
| RDKit validation | `src/asd_mcda/v2/chemistry.py` |
| Provenance + SHA-256 | `src/asd_mcda/v2/provenance.py` |
| Pipeline orchestrator | `src/asd_mcda/v2/engine.py` |
| Active polymer cohort | `config/polymers/polymer_library_v3_five_polymers.csv` |
| Validated numerical results | `results/validation/v2_scientific_validation/scientific_validation_results.json` |
| Validation study report | `results/validation/v2_scientific_validation/PHARMAPOLYSCOPE_V2_SCIENTIFIC_VALIDATION_STUDY.md` |

---

*End of PHARMAPOLYSCOPE_MASTER_KNOWLEDGE_MAP.md -- Version 1.1 (Forensic Correction)*
*All material changes documented in PHASE1_CORRECTION_LOG.md*
