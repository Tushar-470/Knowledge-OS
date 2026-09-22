# Module 08 — Validation & Reproducibility
# Document 04: The PharmaPolySCOPE v2 Scientific Validation Study

```
========================================================================================
PHARMAPOLYSCOPE VIVA SCHOOL — MODULE 08: VALIDATION & REPRODUCIBILITY
DOCUMENT 04: THE PHARMAPOLYSCOPE V2 SCIENTIFIC VALIDATION STUDY
========================================================================================
Report Identifier: VAL-RPT-2026-V2-001-REV1
Authoritative Methodology: 2.0.0-SP-PRP-TOPSIS | Engine Version: 2.0.0-draft
Package Baseline: v1.5.0-FOUR-CRITERION-FREEZE | Baseline Commit: 31eee4d
Validation Classification: B — VALIDATION PASS WITH DOCUMENTED ENVIRONMENT LIMITATION
Target Audience: Doctoral Candidates, Lead Research Auditors, Scientific Viva Examiners
========================================================================================
```

---

## 1. Study Overview & Multi-Cohort Design Architecture

The formal multi-cohort validation of PharmaPolySCOPE v2.0.0 is codified in Report **`VAL-RPT-2026-V2-001-REV1`** (`PHARMAPOLYSCOPE_V2_SCIENTIFIC_VALIDATION_STUDY.md` and `scientific_validation_results.json`). This study validates the variable-dimension spectral decision engine (`VariableKEngine`), the stochastic Monte Carlo uncertainty quantification engine (`MonteCarloEngine`), and the Morris global sensitivity screening engine (`MorrisSensitivityEngine`) across solid dispersion polymer carrier selection for poorly water-soluble active pharmaceutical ingredients (APIs).

The computational architecture operates under strict **FDA 21 CFR Part 11 / ALCOA+ data integrity principles**:
- **Baseline Git Pinning**: Working tree clean; repository HEAD `220ba4c7b0f021d72b5e79f7091adf4edc9c28ea`; frozen baseline commit `31eee4d`.
- **Runtime Environment**: Python 3.14.5 (64-bit AMD64), NumPy 2.4.6, SciPy 1.18.0, RDKit 2026.03.5.
- **Classification Rationale**: Formally classified as **`B — VALIDATION PASS WITH DOCUMENTED ENVIRONMENT LIMITATION`**. The software and mathematical algorithms passed all regression tests with zero defects and verified numerical reproducibility ($\Delta < 10^{-15}$). The "B" classification documents an environment patch-level discrepancy: runtime RDKit is `2026.03.5` whereas `pyproject.toml` declared `>=2026.3.6`. For the evaluated compounds, the documented cross-environment checks produced matching canonical chemical identifiers and evaluated 2D descriptor outputs across the tested RDKit environments.

```
+----------------------------------------------------------------------------------------------------+
|                                    MULTI-COHORT INGESTION GATE                                     |
+----------------------------------------------------------------------------------------------------+
| [1] IND-001-2026 (Indomethacin)  --> [Tier 2 Integrity: PASS] --> VALID COHORT (K=3, Stable)       |
| [2] DRG-0001     (Ibuprofen)     --> [Tier 2 Integrity: PASS] --> VALID COHORT (K=2, Stable)       |
| [3] ITR-001-2026 (Itraconazole)  --> [Tier 2 Integrity: PASS] --> VALID COHORT (K=2, Stable)       |
| [4] DRG-0002     (Fenofibrate)   --> [Tier 2 Integrity: FAIL] --> BLOCKED COHORT (Quarantined)     |
+----------------------------------------------------------------------------------------------------+
```

### 1.1 The 3-Valid + 1-Blocked Cohort Structure
A foundational tenet of pharmaceutical software governance is the truthful representation of evaluation cohorts. While four drug configuration profiles were submitted to the validation harness, **this study is formally classified as an evaluation across 3 Valid Cohorts and 1 Blocked Cohort, NOT a 4-drug validation**:
1. **Cohort 1: Indomethacin (`IND-001-2026`)** — Authoritative BCS Class II weak acid model compound (`config/drugs/indomethacin.json`).
2. **Cohort 2: Ibuprofen (`DRG-0001`)** — Validated low-$T_g$ acidic model compound (`data/user_drugs/drg-0001.json`).
3. **Cohort 3: Itraconazole (`ITR-001-2026`)** — Validated BCS Class II weak base model compound (`data/user_drugs/itr-001-2026.json`).
4. **Cohort 4: Quarantined Cohort (`DRG-0002`)** — Requested as Fenofibrate, but definitively halted at the Tier 2 Chemical Integrity Gate due to fatal metadata contradictions.

### 1.2 Authoritative Five-Polymer Screening Library
All evaluations screen against the locked, five-polymer solid dispersion carrier library (`config/polymers/polymer_library_v3_five_polymers.csv`, SHA-256 `24cd6c4092788cb7266d2ea34e82b6dfe193b5cfb91e22c0dff66b0abc9088ff`):
1. `POL-001-2026`: Polyvinylpyrrolidone K30 (PVP K30)
2. `POL-002-2026`: PVP-Vinyl Acetate 64 (PVP-VA 64 / Copovidone)
3. `POL-005-2026`: Soluplus (Polyvinyl caprolactam-polyvinyl acetate-polyethylene glycol graft copolymer)
4. `POL-006-2026`: Hydroxypropyl Methylcellulose E5 (HPMC E5 / Hypromellose 2910)
5. `POL-007-2026`: Eudragit E PO (EDR EPO / Basic butylated methacrylate copolymer)

Historical polymers (`POL-003-2026` HPMCAS-LF and `POL-004-2026` Eudragit L100) and unvalidated literature criteria ($s_{\text{lit}}$) are permanently excised.

---

## 2. Exact Cohort Results with Full Floating-Point Precision

### 2.1 Indomethacin Cohort (`IND-001-2026`)
- **Chemical Profile**: Canonical SMILES `COc1ccc2c(c1)c(CC(=O)O)c(C)n2C(=O)c1ccc(Cl)cc1`; InChIKey `CGIGDMFJXJATDK-UHFFFAOYSA-N`; Formula $\text{C}_{19}\text{H}_{16}\text{ClNO}_4$; $M_w = 357.793\,\text{g/mol}$; Crippen $\text{LogP} = 3.927320$; $\text{TPSA} = 68.53\,\text{Å}^2$; $\text{HBD} = 1$; $\text{HBA} = 3$; Rotatable Bonds = 4; Aromatic Rings = 3; $\rho_{\text{cryst}} = 1.31\,\text{g/cm}^3$; $\rho_{\text{amorph}} = 1.22\,\text{g/cm}^3$; $V_m = 273.0\,\text{cm}^3/\text{mol}$; $T_g = 315.15\,\text{K}$; $T_m = 433.15\,\text{K}$; $\text{HSP} = [19.2, 7.9, 8.4, 8.0]\,\text{MPa}^{0.5}$.
- **Analysis Provenance**: Analysis ID `VAL-IND-001-2026`; Cryptographic Fingerprint (SHA-256): `32d6354fe09cfd82764ff03ea89e638c4887f3aca04b37fa8d1794f8518ad21f`.
- **Spectral Decomposition**:
  - Eigenvalues: $\lambda_1 = 2.0908657741533783$, $\lambda_2 = 1.1678952418522826$, $\lambda_3 = 0.7397747065453792$, $\lambda_4 = 0.0014642774489659338$.
  - Explained Variance: $\text{PC}_1 = 0.5227164435383438$ ($52.2716\%$), $\text{PC}_2 = 0.2919738104630702$ ($29.1974\%$), $\text{PC}_3 = 0.18494367663634453$ ($18.4944\%$), $\text{PC}_4 = 0.0003660693622414829$ ($0.0366\%$).
  - Dynamic Retained Dimension: **$K = 3$** (cumulative variance = $0.99963393063776$, or **$99.9634\%$**).
  - Boundary Eigengap: $\delta_3 = \lambda_3 - \lambda_4 = 0.7397747065453792 - 0.0014642774489659338 = \mathbf{0.7383104290964133}$.
  - Subspace Stability Gate: **`STABLE`** ($\delta_3 \ge 0.10$).
- **AHP Preference Weights & Consistency**:
  - $\mathbf{w} = [w_{\text{HSP}}: 0.40767478396983764, w_{\chi}: 0.32443340865551623, w_{\text{desc}}: 0.09216133794843878, w_{\text{GT}}: 0.17573046942620724]^T$.
  - $\lambda_{\max} = 4.131937073898666$; $CI = 0.04397902463288853$; $CR = \mathbf{0.04941463441897588}$ (**`ACCEPTED`**, $CR < 0.08$).
- **Deterministic Candidate Closeness & Ranking**:
  1. **Soluplus** (`POL-005-2026`): $C_L = \mathbf{0.6864350839750771}$, $D^+ = 4.18260400161078$, $D^- = 9.156273493466944$
     - Raw Scores: $s_{\text{HSP}} = 0.797188$, $s_{\chi} = 0.826054$, $s_{\text{desc}} = 0.325973$, $s_{\text{GT}} = 0.000000$
  2. **HPMC E5** (`POL-006-2026`): $C_L = \mathbf{0.6731464918436223}$, $D^+ = 4.196083764580734$, $D^- = 8.641727853990561$
     - Raw Scores: $s_{\text{HSP}} = 0.752118$, $s_{\chi} = 0.740155$, $s_{\text{desc}} = 0.394150$, $s_{\text{GT}} = 0.973123$
  3. **PVP-VA 64** (`POL-002-2026`): $C_L = \mathbf{0.6062468903318390}$, $D^+ = 5.082373875664344$, $D^- = 7.825140378502591$
     - Raw Scores: $s_{\text{HSP}} = 0.707316$, $s_{\chi} = 0.637737$, $s_{\text{desc}} = 0.294176$, $s_{\text{GT}} = 0.236756$
  4. **PVP K30** (`POL-001-2026`): $C_L = \mathbf{0.5875839043102030}$, $D^+ = 5.344023390153163$, $D^- = 7.613820510713223$
     - Raw Scores: $s_{\text{HSP}} = 0.694197$, $s_{\chi} = 0.604534$, $s_{\text{desc}} = 0.251780$, $s_{\text{GT}} = 0.984822$
  5. **Eudragit E PO** (`POL-007-2026`): $C_L = \mathbf{0.5456162037572858}$, $D^+ = 5.671239168807834$, $D^- = 6.809925907286733$
     - Raw Scores: $s_{\text{HSP}} = 0.635887$, $s_{\chi} = 0.439344$, $s_{\text{desc}} = 0.409390$, $s_{\text{GT}} = 0.000000$
- **Monte Carlo Uncertainty Propagation ($N=10,000$, Seed=42)**:
  - Valid Replicates: $8,600$ ($86.00\%$); Blocked Replicates: $1,400$ ($14.00\%$).
  - Blocking Decomposition: `AHP_CR_BLOCKED` = $1,396$ ($99.71\%$); `EIGENGAP_BLOCKED` = $4$ ($0.29\%$).
  - Replicate $K$ Distribution: $K=2$: $2.1163\%$; $K=3$: $90.7791\%$; $K=4$: $7.1047\%$.
  - Rank Probabilities:
    - Soluplus: $P(\text{top-1}) = \mathbf{55.5116\%}$, $E[R] = 1.509186$, Median Rank = 1
    - HPMC E5: $P(\text{top-1}) = \mathbf{42.0000\%}$, $E[R] = 1.683953$, Median Rank = 2
    - PVP-VA 64: $P(\text{top-1}) = 1.3837\%$, $E[R] = 3.356512$, Median Rank = 3
    - PVP K30: $P(\text{top-1}) = 0.5581\%$, $E[R] = 3.804070$, Median Rank = 4
    - Eudragit E PO: $P(\text{top-1}) = 0.5465\%$, $E[R] = 4.646279$, Median Rank = 5
- **Morris Global Sensitivity Screening ($r=10$ valid, 31 attempted, 21 discarded by AHP gate)**:
  - Dominant Factor: `score_POL-005-2026_s_desc` ($\mu^* = \mathbf{0.144381}$, $\mu = 0.059013$, $\sigma = \mathbf{0.182951}$).
  - Secondary Factor: `score_POL-007-2026_s_HSP` ($\mu^* = 0.100117$, $\sigma = 0.162780$).
  - Tertiary Factor: `score_POL-002-2026_s_desc` ($\mu^* = 0.091942$, $\sigma = 0.107987$).

---

### 2.2 Ibuprofen Cohort (`DRG-0001`)
- **Chemical Profile**: Canonical SMILES `CC(C)Cc1ccc(C(C)C(=O)O)cc1`; InChIKey `HEFNNWSXXWATRW-UHFFFAOYSA-N`; Formula $\text{C}_{13}\text{H}_{18}\text{O}_2$; $M_w = 206.285\,\text{g/mol}$; Crippen $\text{LogP} = 3.0732$; $\text{TPSA} = 37.3\,\text{Å}^2$; $\text{HBD} = 1$; $\text{HBA} = 1$; Rotatable Bonds = 4; Aromatic Rings = 1; $\rho_{\text{cryst}} = 1.055\,\text{g/cm}^3$; $\rho_{\text{amorph}} = 1.03\,\text{g/cm}^3$; $V_m = 195.53\,\text{cm}^3/\text{mol}$; $T_g = 244.15\,\text{K}$; $T_m = 349.15\,\text{K}$; $\text{HSP} = [17.86, 2.21, 7.16, 7.50]\,\text{MPa}^{0.5}$.
- **Analysis Provenance**: Analysis ID `VAL-DRG-0001`; Cryptographic Fingerprint (SHA-256): `f4fd3927ccd9c74f91bf6e00f66f2b52558eacfd1ed5833181551a2bc987b82b`.
- **Spectral Decomposition**:
  - Eigenvalues: $\lambda_1 = 2.87398798926013$, $\lambda_2 = 0.9700420251784886$, $\lambda_3 = 0.15316444976364665$, $\lambda_4 = 0.0028055357977325624$.
  - Explained Variance: $\text{PC}_1 = 0.7184969973150329$ ($71.8497\%$), $\text{PC}_2 = 0.24251050629462229$ ($24.2511\%$), $\text{PC}_3 = 0.038291112440911684$ ($3.8291\%$), $\text{PC}_4 = 0.000701383949433141$ ($0.0701\%$).
  - Dynamic Retained Dimension: **$K = 2$** (cumulative variance = $0.9610075036096546$, or **$96.1008\%$**).
  - Boundary Eigengap: $\delta_2 = \lambda_2 - \lambda_3 = 0.9700420251784886 - 0.15316444976364665 = \mathbf{0.8168775754148420}$.
  - Subspace Stability Gate: **`STABLE`** ($\delta_2 \ge 0.10$).
- **Deterministic Candidate Closeness & Ranking**:
  1. **Eudragit E PO** (`POL-007-2026`): $C_L = \mathbf{0.5502644874972997}$, $D^+ = 3.016836300897616$, $D^- = 3.691187008423553$
     - Raw Scores: $s_{\text{HSP}} = 0.751716$, $s_{\chi} = 0.835897$, $s_{\text{desc}} = 0.310620$, $s_{\text{GT}} = 0.375571$
  2. **PVP-VA 64** (`POL-002-2026`): $C_L = \mathbf{0.4167810028577484}$, $D^+ = 3.4792443343938158$, $D^- = 2.486343809068530$
     - Raw Scores: $s_{\text{HSP}} = 0.555038$, $s_{\chi} = 0.472934$, $s_{\text{desc}} = 0.399692$, $s_{\text{GT}} = 0.911266$
  3. **PVP K30** (`POL-001-2026`): $C_L = \mathbf{0.40797616516392965}$, $D^+ = 3.624645292478117$, $D^- = 2.497819850300755$
     - Raw Scores: $s_{\text{HSP}} = 0.495187$, $s_{\chi} = 0.321611$, $s_{\text{desc}} = 0.483010$, $s_{\text{GT}} = 1.000000$
  4. **Soluplus** (`POL-005-2026`): $C_L = \mathbf{0.4031354530991938}$, $D^+ = 3.5639352388285523$, $D^- = 2.407160309288914$
     - Raw Scores: $s_{\text{HSP}} = 0.524848$, $s_{\chi} = 0.398988$, $s_{\text{desc}} = 0.363674$, $s_{\text{GT}} = 0.613538$
  5. **HPMC E5** (`POL-006-2026`): $C_L = \mathbf{0.2461432449415062}$, $D^+ = 4.5530610504386875$, $D^- = 1.486628877239155$
     - Raw Scores: $s_{\text{HSP}} = 0.448267$, $s_{\chi} = 0.189643$, $s_{\text{desc}} = 0.262920$, $s_{\text{GT}} = 1.000000$
- **Monte Carlo Uncertainty Propagation ($N=10,000$, Seed=42)**:
  - Valid Replicates: $8,579$ ($85.79\%$); Blocked Replicates: $1,421$ ($14.21\%$).
  - Blocking Decomposition: `AHP_CR_BLOCKED` = $1,394$ ($98.10\%$); `EIGENGAP_BLOCKED` = $27$ ($1.90\%$).
  - Replicate $K$ Distribution: $K=2$: $50.1574\%$; $K=3$: $49.8077\%$; $K=4$: $0.0350\%$.
  - Rank Probabilities:
    - Eudragit E PO: $P(\text{top-1}) = \mathbf{97.6571\%}$, $E[R] = 1.029141$, Median Rank = 1 (High Robustness)
    - PVP-VA 64: $P(\text{top-1}) = 1.4221\%$, $E[R] = 2.574309$, Median Rank = 2
    - PVP K30: $P(\text{top-1}) = 0.5129\%$, $E[R] = 2.969111$, Median Rank = 3
    - Soluplus: $P(\text{top-1}) = 0.3613\%$, $E[R] = 3.510199$, Median Rank = 4
    - HPMC E5: $P(\text{top-1}) = 0.0466\%$, $E[R] = 4.917240$, Median Rank = 5
- **Morris Global Sensitivity Screening ($r=10$ valid, 31 attempted, 21 discarded by AHP gate)**:
  - Dominant Factor: `score_POL-001-2026_s_desc` ($\mu^* = \mathbf{0.084953}$, $\mu = 0.084953$, $\sigma = \mathbf{0.059615}$).
  - Secondary Factor: `score_POL-007-2026_s_HSP` ($\mu^* = 0.071162$, $\sigma = 0.074183$).
  - Tertiary Factor: `score_POL-005-2026_s_desc` ($\mu^* = 0.068441$, $\sigma = 0.119148$).

---

### 2.3 Itraconazole Cohort (`ITR-001-2026`)
- **Chemical Profile**: Canonical SMILES `CCC(C)n1ncn(-c2ccc(N3CCN(c4ccc(OC[C@H]5CO[C@](Cn6cncn6)(c6ccc(Cl)cc6Cl)O5)cc4)CC3)cc2)c1=O`; InChIKey `VHVPQPYKVGDNFY-ZPGVKDDISA-N`; Formula $\text{C}_{35}\text{H}_{38}\text{Cl}_2\text{N}_8\text{O}_4$; $M_w = 705.647\,\text{g/mol}$; Crippen $\text{LogP} = 5.5773$; $\text{TPSA} = 104.70\,\text{Å}^2$; $\text{HBD} = 0$; $\text{HBA} = 9$; Rotatable Bonds = 11; Aromatic Rings = 5; $\rho_{\text{cryst}} = 1.27\,\text{g/cm}^3$; $\rho_{\text{amorph}} = 1.22\,\text{g/cm}^3$; $V_m = 555.59\,\text{cm}^3/\text{mol}$; $T_g = 330.65\,\text{K}$; $T_m = 438.15\,\text{K}$; $\text{HSP} = [18.5, 11.2, 10.5, 8.0]\,\text{MPa}^{0.5}$.
- **Analysis Provenance**: Analysis ID `VAL-ITR-001-2026`; Cryptographic Fingerprint (SHA-256): `ac58bb2ceb3995c0860742ef62301bbbef517b966f3ebabb2b73b1e234a835e4`.
- **Spectral Decomposition**:
  - Eigenvalues: $\lambda_1 = 3.0741949648760354$, $\lambda_2 = 0.7735480892592678$, $\lambda_3 = 0.12317630456736986$, $\lambda_4 = 0.02908064129732203$.
  - Explained Variance: $\text{PC}_1 = 0.7685487412190097$ ($76.8549\%$), $\text{PC}_2 = 0.1933870223148172$ ($19.3387\%$), $\text{PC}_3 = 0.030794076141842503$ ($3.0794\%$), $\text{PC}_4 = 0.007270160324330516$ ($0.7270\%$).
  - Dynamic Retained Dimension: **$K = 2$** (cumulative variance = $0.9619357635338258$, or **$96.1936\%$**).
  - Boundary Eigengap: $\delta_2 = \lambda_2 - \lambda_3 = 0.7735480892592678 - 0.12317630456736986 = \mathbf{0.6503717846918979}$.
  - Subspace Stability Gate: **`STABLE`** ($\delta_2 \ge 0.10$).
- **Deterministic Candidate Closeness & Ranking**:
  1. **Soluplus** (`POL-005-2026`): $C_L = \mathbf{0.6105950177667027}$, $D^+ = 2.440991548124298$, $D^- = 3.8275249308504624$
     - Raw Scores: $s_{\text{HSP}} = 0.820048$, $s_{\chi} = 0.721304$, $s_{\text{desc}} = 0.476470$, $s_{\text{GT}} = 0.000000$
  2. **PVP-VA 64** (`POL-002-2026`): $C_L = \mathbf{0.5685680192192762}$, $D^+ = 2.4447867563118346$, $D^- = 3.2218927325098408$
     - Raw Scores: $s_{\text{HSP}} = 0.724078$, $s_{\chi} = 0.344778$, $s_{\text{desc}} = 0.464673$, $s_{\text{GT}} = 0.040981$
  3. **Eudragit E PO** (`POL-007-2026`): $C_L = \mathbf{0.5339103782887508}$, $D^+ = 2.662120498832046$, $D^- = 3.049485970880932$
     - Raw Scores: $s_{\text{HSP}} = 0.501722$, $s_{\chi} = 0.000000$, $s_{\text{desc}} = 0.506553$, $s_{\text{GT}} = 0.000000$
  4. **HPMC E5** (`POL-006-2026`): $C_L = \mathbf{0.4675810015433876}$, $D^+ = 3.5599481682053775$, $D^- = 3.1264176048512407$
     - Raw Scores: $s_{\text{HSP}} = 0.812313$, $s_{\chi} = 0.730717$, $s_{\text{desc}} = 0.394680$, $s_{\text{GT}} = 0.808073$
  5. **PVP K30** (`POL-001-2026`): $C_L = \mathbf{0.4661816513962696}$, $D^+ = 3.154593505724517$, $D^- = 2.7548952070103603$
     - Raw Scores: $s_{\text{HSP}} = 0.755690$, $s_{\chi} = 0.486311$, $s_{\text{desc}} = 0.448943$, $s_{\text{GT}} = 0.814471$
- **Monte Carlo Uncertainty Propagation ($N=10,000$, Seed=42)**:
  - Valid Replicates: $8,591$ ($85.91\%$); Blocked Replicates: $1,409$ ($14.09\%$).
  - Blocking Decomposition: `AHP_CR_BLOCKED` = $1,390$ ($98.65\%$); `EIGENGAP_BLOCKED` = $19$ ($1.35\%$).
  - Replicate $K$ Distribution: $K=2$: $32.5224\%$; $K=3$: $67.0120\%$; $K=4$: $0.4656\%$.
  - Rank Probabilities:
    - Soluplus: $P(\text{top-1}) = \mathbf{59.0036\%}$, $E[R] = 1.753579$, Median Rank = 1
    - PVP K30: $P(\text{top-1}) = 15.5861\%$, $E[R] = 2.841695$, Median Rank = 3
    - HPMC E5: $P(\text{top-1}) = 10.8951\%$, $E[R] = 2.624956$, Median Rank = 3
    - PVP-VA 64: $P(\text{top-1}) = 7.2983\%$, $E[R] = 3.306134$, Median Rank = 4
    - Eudragit E PO: $P(\text{top-1}) = 7.2169\%$, $E[R] = 4.473635$, Median Rank = 5
- **Morris Global Sensitivity Screening ($r=10$ valid, 31 attempted, 21 discarded by AHP gate)**:
  - Dominant Factor: `score_POL-005-2026_s_desc` ($\mu^* = \mathbf{0.135318}$, $\mu = 0.135318$, $\sigma = \mathbf{0.084825}$).
  - Secondary Factor: `score_POL-001-2026_s_desc` ($\mu^* = 0.092198$, $\sigma = 0.124011$).
  - Tertiary Factor: `score_POL-005-2026_s_HSP` ($\mu^* = 0.088479$, $\sigma = 0.063369$).
- **Forensic Provenance Reconciliation (Category B: Different Input Snapshot)**:
  - Historical run in `results/v2/itraconazole/` evaluated $V_m = 578.40\,\text{cm}^3/\text{mol}$ (derived from amorphous density $\rho_{\text{amorph}} = 1.22\,\text{g/cm}^3$, yielding Soluplus $C_L = 0.610305879$ and $P(\text{top-1}) = 59.98\%$).
  - The authoritative validation study evaluated $V_m = 555.59\,\text{cm}^3/\text{mol}$ (derived from crystalline density $\rho_{\text{cryst}} = 1.27\,\text{g/cm}^3$, yielding Soluplus $C_L = 0.610595018$ and $P(\text{top-1}) = 59.0036\%$).
  - Both runs are mathematically deterministic and exact under their respective input snapshots, yielding identical ranking orders: `Soluplus > PVP-VA 64 > Eudragit E PO > HPMC E5 > PVP K30`.

---

### 2.4 Quarantined Cohort (`DRG-0002` / Fenofibrate Request)
- **Ingestion Failure**: The candidate profile `data/user_drugs/drg-0002.json` was submitted under the request label "Fenofibrate", but failed Tier 2 Ingestion Auditing.
- **Forensic Findings**:
  - Generic Name Field: `Indomethacin` (Internal contradiction).
  - SMILES Field: `COc1ccc2c(c1)c(CC(=O)O)c(C)n2C(=O)c1ccc(Cl)cc1` (Indomethacin chemical structure, InChIKey `CGIGDMFJXJATDK-UHFFFAOYSA-N`, not Fenofibrate).
  - Crystalline Density: Set to **$1.781\,\text{g/cm}^3$** (a crystalline density inconsistent with the intended Fenofibrate profile and associated with the quarantined input record; true Fenofibrate is $\sim 1.18\,\text{g/cm}^3$, authentic Indomethacin is $\sim 1.31\,\text{g/cm}^3$).
  - Molar Volume: Evaluated as **$200.89\,\text{cm}^3/\text{mol}$** (inconsistent with both intended Fenofibrate $V_m \sim 296\,\text{cm}^3/\text{mol}$ and authentic Indomethacin $V_m = 273.0\,\text{cm}^3/\text{mol}$).
- **Governance Action**: Cohort execution was immediately halted (`FATAL_METADATA_MISMATCH`). In accordance with read-only repository governance, the file was left unedited and formally quarantined in `results/v2/tables/blocked_cohorts_audit.csv`.

---

## 3. Methodological Contrast: v1.5 Fixed-$K$ ($K=2$) vs. v2 Dynamic-$K$ (SP-PRP-TOPSIS)

### 3.1 Mathematical Principles of Dimensionality Selection
In multi-criteria decision analysis (MCDA) coupled with Principal Component Analysis (PCA), truncating orthogonal dimensions represents an explicit trade-off between noise filtering and variance preservation:
- **v1.5 Fixed-$K$ (Hardcoded $K=2$)**: Assumed that two principal components were universally sufficient to represent any ASD decision problem.
- **v2 Dynamic-$K$ (SP-PRP-TOPSIS)**: Evaluates the spectral decay of correlation matrix $R = \frac{1}{n} Z^T Z$ and dynamically selects the minimum integer $K$ satisfying:
  $$\frac{\sum_{k=1}^K \lambda_k}{\sum_{j=1}^p \lambda_j} \ge 0.95$$
  followed by Davis–Kahan boundary eigengap evaluation ($\delta_K = \lambda_K - \lambda_{K+1}$).

### 3.2 Why v1.5 Artificially Compressed Indomethacin's 3D Variance
For Indomethacin, the four physical criteria ($s_{\text{HSP}}, s_{\chi}, s_{\text{desc}}, s_{\text{GT}}$) exhibit a rich, non-planar correlation structure across the five polymers:
- $\lambda_1 = 2.090866$ ($52.27\%$ variance)
- $\lambda_2 = 1.167895$ ($29.20\%$ variance)
- $\lambda_3 = 0.739775$ ($18.49\%$ variance)
- $\lambda_4 = 0.001464$ ($0.04\%$ variance)

Under historical v1.5 fixed $K=2$, the model retained only $\lambda_1 + \lambda_2$, capturing **$81.4690\%$** of total variance. This truncation discarded $\lambda_3 = 0.739775$, amputating **$18.4944\%$** of authentic physical information. Kaiser's classical criterion retains components with eigenvalues $> 0.7$ to $1.0$; discarding an eigenvalue of $0.74$ represented severe variance compression.

```
INDOMETHACIN SPECTRAL VARIANCE RECOVERY:
v1.5 Fixed K=2: [======== PC1 (52.27%) ========] [===== PC2 (29.20%) =====] | DISCARDED PC3 (18.49%) | -> 81.47% Cumulative
v2 Dynamic K=3: [======== PC1 (52.27%) ========] [===== PC2 (29.20%) =====] [==== PC3 (18.49%) ====] -> 99.96% Cumulative
```

### 3.3 Mechanism of the Rank Reversal
In v1.5, compressing the decision space into 2D created an artificial geometric distortion:
- **v1.5 Ranking**:
  1. HPMC E5: $C_L = 0.835911$ ($P(\text{top-1}) = 75.54\%$)
  2. Soluplus: $C_L = 0.694342$
- **v2 Dynamic-$K$ Ranking**:
  1. Soluplus: $C_L = 0.686435$ ($P(\text{top-1}) = 55.51\%$)
  2. HPMC E5: $C_L = 0.673146$ ($P(\text{top-1}) = 42.00\%$)

**Why the shift occurred**:
The third principal component ($\text{PC}_3$) resolves the trade-off between Gordon–Taylor thermal anti-plasticization ($s_{\text{GT}}$) and descriptor-based chemical affinity ($s_{\text{desc}}$) relative to thermodynamic miscibility ($s_{\chi}$). In 2D, HPMC E5 was artificially favored because its very high Gordon–Taylor score ($s_{\text{GT}} = 0.9731$) dominated the truncated plane. When $\text{PC}_3$ is admitted in v2, Soluplus's superior thermodynamic miscibility ($s_{\chi} = 0.826054$ vs. HPMC E5's $0.740155$) and superior Hansen proximity ($s_{\text{HSP}} = 0.797188$ vs. $0.752118$) are properly weighted by the physical preference tensor $M_K = V_K^T W V_K$.

This positions Soluplus as the deterministic lead candidate ($C_L = 0.6864$), while HPMC E5 remains a very close second ($C_L = 0.6731$). Rather than a contradiction, v2 provides the uncompressed three-dimensional truth of the physical system.

---

## 4. Ten Layered Viva Defense Scenarios

### Q1: Why is your validation study classified as evaluating three valid cohorts rather than four?
- **Direct Answer:** Cohort `DRG-0002` failed the Tier 2 Chemical Integrity Gate due to fatal metadata contradictions, and counting an unexecutable or corrupted profile as a validated drug violates regulatory audit integrity.
- **Reasoning:** In `drg-0002.json`, the user requested Fenofibrate, but the record contains the chemical structure and SMILES of Indomethacin, combined with a crystalline density inconsistent with the intended Fenofibrate profile and associated with the quarantined input record ($1.781\,\text{g/cm}^3$) and resulting compressed molar volume ($200.89\,\text{cm}^3/\text{mol}$). Silently altering user input files in a validation repository violates ALCOA+ data integrity rules. The engine correctly halted execution before numerical calculation, preserving pipeline validity.
- **Actual PharmaPolySCOPE Implementation:** Enforced in `src/asd_mcda/v2/chemistry.py` and recorded in `results/v2/tables/blocked_cohorts_audit.csv` under reason `Redundant user drug profile: superseded by authoritative config/drugs/indomethacin.json (IND-001-2026)`. The profile is barred from entering `VariableKEngine`.
- **Limitation / Caveat:** The pipeline cannot automatically infer stakeholder intent when metadata conflicts with chemical structure; human intervention is required to generate a new profile.
- **One-Sentence Defense:** We refused to claim a four-drug validation because scientific integrity demands that blocked cohorts are never conflated with evaluated cohorts.

### Q2: In v1.5, HPMC E5 was Rank 1 for Indomethacin, but in v2, Soluplus is Rank 1. Does this indicate instability?
- **Direct Answer:** The rank reversal is not numerical instability, but the correction of an artificial geometric truncation error caused by v1.5's hardcoded $K=2$ assumption.
- **Reasoning:** The correlation matrix for Indomethacin has three significant eigenvalues ($\lambda_1 = 2.091, \lambda_2 = 1.168, \lambda_3 = 0.740$). Truncating at $K=2$ in v1.5 captured only $81.47\%$ of variance, completely discarding $\text{PC}_3$ ($18.49\%$ variance). Discarding an eigenvalue of $0.740$ artificially amplified Gordon–Taylor glass transition elevation over thermodynamic Flory–Huggins miscibility. By dynamically selecting $K=3$, v2 captures $99.96\%$ of variance, properly reflecting Soluplus's superior thermodynamic solubility.
- **Actual PharmaPolySCOPE Implementation:** Implemented in `src/asd_mcda/v2/pca.py`, where dynamic selection evaluates cumulative variance $\ge 0.95$, returning $K=3$ for Indomethacin.
- **Limitation / Caveat:** Retaining $K=3$ for an $n=5$ cohort approaches the degrees of freedom boundary ($n-1=4$), though the boundary eigengap $\delta_3 = 0.7383$ mathematically confirms subspace separation.
- **One-Sentence Defense:** The rank reversal occurred because v2 restored the third physical dimension ($18.49\%$ variance) that v1.5 had arbitrarily truncated.

### Q3: What is the exact mathematical formulation of your TOPSIS metric tensor?
- **Direct Answer:** The metric tensor is formulated as $M_K = V_K^T W V_K$, which pulls back the diagonal AHP preference weights $W$ from the original physical space into the retained PCA subspace.
- **Reasoning:** In standardized PCA coordinates, the principal components are orthogonal. The SP-PRP-TOPSIS methodology explicitly projects the physical-space AHP preference diagonal matrix $W = \operatorname{diag}(\mathbf{w})$ into the retained eigenspace $V_K$, yielding metric tensor $M_K = V_K^T W V_K$. This preserves stakeholder preference weighting without requiring inverse covariance distortions.
- **Actual PharmaPolySCOPE Implementation:** Verified in `src/asd_mcda/v2/metrics.py` in function `construct_metric_tensor(V_K, ahp_weights)`, computing `M_K = V_K.T @ np.diag(ahp_weights) @ V_K`.
- **Limitation / Caveat:** $M_K$ is a $K \times K$ dense matrix whose condition number depends on the spread of AHP weights and eigenvector alignments; its positive definiteness must be verified for every replicate.
- **One-Sentence Defense:** We construct the metric tensor as $M_K = V_K^T W V_K$ to project physical AHP preferences onto the orthogonal decision subspace.

### Q4: Does four-decimal display of pairwise comparisons in AHP violate analytical reciprocity?
- **Direct Answer:** The value `0.3333` in summary tables is an aesthetic typographical display; the underlying runtime matrix strictly implements IEEE 754 floating-point division `1.0 / 3.0`, achieving machine reciprocity $|a_{ji} a_{ij} - 1.0| < 10^{-12}$.
- **Reasoning:** Saaty's analytic hierarchy process requires reciprocal pairwise comparisons ($a_{ji} a_{ij} = 1$). If an engine hardcodes truncated decimal strings like `0.3333`, $0.3333 \times 3.0 = 0.9999 \ne 1.0$, introducing artificial inconsistency into the characteristic polynomial and distorting the principal eigenvalue $\lambda_{\max}$. In PharmaPolySCOPE, exact machine division ensures true reciprocity.
- **Actual PharmaPolySCOPE Implementation:** Code in `src/asd_mcda/v2/ahp.py` constructs $A[2, 0] = 1.0 / 3.0$, and verifies reciprocity using `np.allclose(A * A.T, np.ones((4,4)), atol=1e-12)`.
- **Limitation / Caveat:** While machine reciprocity is exact, subjective human pairwise comparisons are limited to Saaty's 1–9 fundamental integer scale.
- **One-Sentence Defense:** Machine division ensures bit-level reciprocity within $10^{-12}$, yielding an authoritative consistency ratio of $CR = 0.049415$.

### Q5: Why do you enforce a three-tier eigengap stability gate ($\delta_K \ge 0.10$ STABLE, $0.03 \le \delta_K < 0.10$ WARNING, $\delta_K < 0.03$ BLOCKED)?
- **Direct Answer:** Cumulative variance determines how much information is retained, but only the boundary eigengap $\delta_K = \lambda_K - \lambda_{K+1}$ protects against rotational subspace instability under noise.
- **Reasoning:** Under the Davis–Kahan perturbation theorem, the angle of rotation between an empirical eigenspace and the population eigenspace is bounded inversely by the spectral separation between adjacent eigenvalues: $\|\sin\Theta\| \le \|E\| / \delta_K$. If $\lambda_K \approx \lambda_{K+1}$ ($\delta_K \to 0$), microscopic noise can cause the eigenvectors to rotate unpredictably, scrambling candidate distances.
- **Actual PharmaPolySCOPE Implementation:** Evaluated in `src/asd_mcda/v2/stability.py` where `delta_K = eigenvalues[k-1] - eigenvalues[k]`; if `delta_K < 0.03`, raises `DegenerateSubspaceBlockedError`.
- **Limitation / Caveat:** The eigengap gate enforces spectral separation, but in cases of genuine physical degeneracy, it halts execution rather than attempting rotational regularization.
- **One-Sentence Defense:** The eigengap gate mathematically guarantees that our PCA projection planes are rotationally stable and well-separated.

### Q6: Why did over 98% of Monte Carlo blockages occur at the AHP gate rather than the eigengap gate?
- **Direct Answer:** The high concentration of blockages at the `AHP_CR_BLOCKED` gate reflects the geometric fragility of random pairwise matrices in high-dimensional preference spaces under log-ratio perturbation.
- **Reasoning:** Monte Carlo perturbation applies log-normal noise ($\sigma = 0.15$) to the six independent pairwise ratios of the AHP matrix. The consistent preference manifold occupies a very thin hypersurface within the space of positive reciprocal matrices. Perturbing ratios independently frequently violates transitivity ($CR \ge 0.08$). Conversely, the spectral correlation matrix of the polymer library is robust, encountering small eigengaps in fewer than 0.3% of replicates.
- **Actual PharmaPolySCOPE Implementation:** Handled in `src/asd_mcda/v2/uncertainty.py`, enforcing Replicate Conservation: `assert num_replicates == num_valid + num_blocked`.
- **Limitation / Caveat:** Discarding intransitive AHP samples truncates the injected perturbation distribution, effectively sampling from a conditionally truncated log-normal distribution.
- **One-Sentence Defense:** The high AHP blocking rate demonstrates that our consistency gate actively filters out logically incoherent preference states.

### Q7: Why were 21 out of 31 attempted Morris trajectories discarded in the Indomethacin screening?
- **Direct Answer:** Trajectories were discarded because any single invalid grid step forces the entire trajectory to be discarded to preserve the One-Factor-At-A-Time (OAT) property.
- **Reasoning:** A Morris trajectory consists of $p+1$ coordinated points. If even one point samples an AHP matrix with $CR \ge 0.08$, that point is blocked. Dropping that point would require calculating an elementary effect across two simultaneous parameter steps, violating OAT orthogonality.
- **Actual PharmaPolySCOPE Implementation:** Enforced in `src/asd_mcda/v2/sensitivity.py`, recording `score_POL-005-2026_s_desc` with $\mu^* = 0.1444$ and $\sigma = 0.1830$.
- **Limitation / Caveat:** The Morris screening design measures computational model sensitivity under the defined perturbation grid; it does not measure physical or thermodynamic sensitivity in the laboratory.
- **One-Sentence Defense:** Whole-trajectory discard is mathematically mandatory to preserve the orthogonal design of Morris sensitivity screening.

### Q8: Why does the validation report show Itraconazole closeness $C_L = 0.610595$, whereas an earlier run showed $C_L = 0.610306$?
- **Direct Answer:** The numerical difference arises from a documented input snapshot change in Itraconazole's molar volume ($V_m = 555.59$ vs. $578.40\,\text{cm}^3/\text{mol}$), classified formally as Category B: Different Input Snapshot.
- **Reasoning:** In the earlier run, molar volume was calculated dynamically from amorphous density $\rho_{\text{amorph}} = 1.22\,\text{g/cm}^3$ ($705.647 / 1.22 \approx 578.40$). In the active repository file `data/user_drugs/itr-001-2026.json`, line 26 explicitly locks $V_m = 555.59\,\text{cm}^3/\text{mol}$, derived from crystalline pycnometry $\rho_{\text{cryst}} = 1.27\,\text{g/cm}^3$ ($705.647 / 1.27 = 555.59$). Both runs are deterministic and exact under their respective input snapshots.
- **Actual PharmaPolySCOPE Implementation:** Both runs reproduce identically when initialized with their respective JSON files; verified in Section 8.1 of `PHARMAPOLYSCOPE_V2_SCIENTIFIC_VALIDATION_STUDY.md`.
- **Limitation / Caveat:** Molar volume varies depending on whether crystalline X-ray diffraction or amorphous pycnometry is used, highlighting the importance of immutable input versioning.
- **One-Sentence Defense:** Both calculations are mathematically exact under their respective input files, and the variation was fully reconciled under Category B provenance.

### Q9: Does Eudragit E PO's 97.66% selection probability for Ibuprofen prove physical formulation stability?
- **Direct Answer:** No; Monte Carlo selection probability quantifies numerical ranking robustness under parameter uncertainty, not the physical probability of experimental formulation success.
- **Reasoning:** The computational pipeline evaluates theoretical thermodynamic indicators: Hansen solubility distances, Flory–Huggins interaction parameters, and Gordon–Taylor glass transition temperatures. It does not model kinetic moisture sorption, phase separation kinetics, manufacturing shear degradation, or nucleation barriers.
- **Actual PharmaPolySCOPE Implementation:** Codified in Section 12 ("Formal Validation Distinctions & Known Limitations") of `PHARMAPOLYSCOPE_V2_SCIENTIFIC_VALIDATION_STUDY.md`.
- **Limitation / Caveat:** The pipeline relies on group-contribution thermodynamic models which have inherent prediction errors relative to experimental measurements.
- **One-Sentence Defense:** High selection probability indicates mathematical dominance under model assumptions, but physical stability requires empirical laboratory testing.

### Q10: Why does PharmaPolySCOPE strictly forbid silent numerical coercion in favor of fail-fast exceptions?
- **Direct Answer:** Silent coercion substitutes mathematical reality with computational fiction, masking severe formulation risks under the appearance of valid output.
- **Reasoning:** In pharmaceutical formulation, ill-conditioned matrices signal fundamental physical or logical defects: redundant criteria, zero variance across candidates, or self-contradictory stakeholder requirements. If software quietly adds a ridge penalty or coerces $CR \ge 0.08$ to consistency, it fabricates data that neither the physical system nor the stakeholder produced, violating ALCOA+ data integrity.
- **Actual PharmaPolySCOPE Implementation:** Code enforces domain-specific exceptions in `src/asd_mcda/v2/exceptions.py`: `ZeroVarianceStandardizationError`, `NonPositiveDefiniteMetricError`, `AHPConsistencyViolationError`, and `DegenerateSubspaceBlockedError`.
- **Limitation / Caveat:** Fail-fast governance halts execution immediately, shifting the burden of parameter correction back to the user.
- **One-Sentence Defense:** We enforce fail-fast exceptions because scientific software must never fabricate regularized numbers to hide physical or logical invalidity.
