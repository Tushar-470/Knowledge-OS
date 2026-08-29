# PharmaPolySCOPE Thesis and Viva Defence Master Guide

## Indomethacin amorphous solid dispersion polymer selection

**Author:** Tushar Mathapati  
**Study baseline:** `v1.5.0-FOUR-CRITERION-FREEZE`  
**Status:** Computational phase frozen; prospective experimental validation pending  
**Purpose:** A plain-language study, presentation, and viva rehearsal guide for the PharmaPolySCOPE research framework.

> [!IMPORTANT]
> This guide uses the active frozen v1.5.0 source files as the authority for numerical results. It describes a pre-laboratory computational ranking, not proof of formulation performance, manufacturing success, clinical benefit, or regulatory acceptability.

---

## How to use this guide

Read Chapters 1-3 until you can explain the project without equations. Then learn Chapter 5 one model at a time, practise Chapter 9 aloud, and use Chapter 10 for quick viva rehearsal. In an answer, lead with the physical pharmacy reason, then the computational method, then the experimental limitation.

### Evidence and version rule

The active release is `v1.5.0-FOUR-CRITERION-FREEZE`. Its authoritative inputs and results are:

| Object | Frozen authority |
|---|---|
| Drug profile | `config/drugs/indomethacin.json` |
| Five-polymer library | `config/polymers/polymer_library_v3_five_polymers.csv` |
| Workflow choices | `config/workflow/workflow_config.yaml` |
| AHP matrix | `config/ahp/default_matrix.json` |
| Score matrix and ranking | `results/final/` and `results/reports/v1.5.0_freeze_*` |
| Release declaration | `FINAL_COMPUTATIONAL_BASELINE_MANIFEST.yaml` |

Do not quote the historical `results/final/final_computational_report.md` as the v1.5 result: it identifies itself as `v1.3.1-FREEZE` and reports a different, superseded ranking. The active v1.5 baseline ranks HPMC E5 first.

### Corrections to rehearse

The following numbers come directly from the v1.5 code and frozen score matrix at 30% drug loading:

| Item | Correct v1.5 value | Do not say |
|---|---:|---|
| HPMC E5 predicted Tg_mix | 393.806 K = 120.656 deg C | 86.8 deg C |
| Soluplus predicted Tg_mix | 334.965 K = 61.815 deg C | 70.0 deg C |
| HPMC E5 chi | 0.259845 | a historical or rounded alternative result |
| Soluplus chi | 0.173946 | a historical or rounded alternative result |

The score s_GT is a clipped normalized index, not the temperature itself. Both HPMC E5 and PVP K30 receive high s_GT values because their calculated mixture glass transitions are well above the score's reference margin.

---

# Chapter 1. Big Picture and Executive Summary

## The formulation problem

Indomethacin is a BCS Class II drug: it can cross a biological membrane when dissolved, but it has low aqueous solubility. Dissolution can therefore limit the amount of drug available for absorption. An amorphous solid dispersion (ASD) aims to place drug molecules in a high-energy, non-crystalline state within a polymer carrier. This can create a fast concentration increase, often called the **spring**, while the polymer may slow precipitation and provide the **parachute**.

The difficulty is that an amorphous drug is not automatically stable. It tends to regain the lower-energy crystalline state. A useful polymer must balance several things: molecular affinity with the drug, resistance to phase separation, a mixture glass transition that limits molecular movement, practical processability, and acceptable oral-product scope.

Traditional polymer screening can require many spray-drying batches, repeated solid-state measurements, stability studies, and dissolution tests. PharmaPolySCOPE is a prioritisation tool: it uses defined input data and several complementary physical models to decide which candidates should go first into that laboratory programme.

## What PharmaPolySCOPE is

**PharmaPolySCOPE** means **Pharmaceutical Polymer Screening and Computational Optimization Platform**. It is a local computational framework for screening polymer carriers for indomethacin spray-dried ASDs. It combines HSP affinity, Flory-Huggins interaction estimates, 2D descriptor complementarity, Gordon-Taylor glass-transition prediction, PCA, AHP, TOPSIS, uncertainty analysis, sensitivity analysis, reporting, and a web interface.

It does **not** replace DSC, PXRD, FTIR, dissolution, stability, scale-up, or clinical testing. It replaces an unstructured first pass with a traceable ranking and a focused experimental handoff.

## Thirty-second defence script

> "Indomethacin is a poorly soluble BCS Class II drug, so an amorphous solid dispersion can improve dissolution but risks recrystallisation. PharmaPolySCOPE is a reproducible pre-formulation screening framework that combines molecular affinity, thermodynamic compatibility, glass-transition stability, and multi-criteria ranking to prioritise polymer carriers before extensive spray-drying experiments. In the frozen v1.5.0 computational baseline, HPMC E5 is the top-ranked candidate, but the result is a laboratory prioritisation decision that must be confirmed by solid-state, dissolution, and stability studies."

## One-sentence versions

**For a guide:** "I built a QbD-style computational screen that makes the first polymer-selection decision transparent and experimentally testable."

**For an interviewer:** "I use physical-pharmacy models and uncertainty analysis to narrow a polymer library before spending laboratory time on ASD formulation."

---

# Chapter 2. Pharmaceutical and Thermodynamic First Principles

## 2.1 Indomethacin as the model drug

| Property | Value | Why it matters |
|---|---:|---|
| Molecular weight | 357.79 g/mol | Identity and molar-volume calculations |
| BCS class | II | Low solubility, high permeability; dissolution is a central problem |
| Melting temperature T_m | 433.15 K = 160.0 deg C | Crystalline lattice strength reference |
| Glass transition T_g | 315.15 K = 42.0 deg C | Molecular-mobility reference for amorphous indomethacin |
| Crystalline / amorphous density | 1.31 / 1.22 g/cm3 | The amorphous density is used in the Simha-Boyer constant |
| LogP | 4.27 | Indicates lipophilicity; not a direct v1.5 ranking score |
| HSP (delta_D,delta_P,delta_H) | (19.2, 7.9, 8.4) MPa^0.5 | Cohesive-energy description |
| HSP interaction radius R_0 | 8.0 MPa^0.5 | Converts HSP distance into RED |
| Molar volume V_m | 273.0 cm3/mol | Used for the Lindvig chi estimate |
| Target drug loading w_1 | 0.30 | The formulation point evaluated by the frozen baseline |

### Why 30% drug loading?

Thirty percent is a realistic stress point for a first computational comparison: it gives meaningful drug payload while leaving 70% polymer to stabilise and inhibit precipitation. It is not a universal optimum. A lower loading may improve physical stability but reduce dose efficiency; a higher loading may improve dose efficiency but increase molecular crowding and crystallisation risk. In viva, call 30% the **defined design point for this baseline**, then say that loading must be optimised experimentally.

### Thermodynamic miscibility versus kinetic stability

**Thermodynamic miscibility** asks whether drug and polymer energetically prefer to be mixed rather than separated under a specified model and condition. HSP and Flory-Huggins metrics mainly address this question.

**Kinetic stability** asks whether the mixture remains amorphous for a useful time. It depends on molecular mobility, humidity, processing history, defects, particle surfaces, and drug-polymer interactions. Gordon-Taylor T_g is a useful mobility proxy, but it is not a stability guarantee.

## 2.2 Five-polymer candidate library

| Polymer | Family / functional character | Compendial status recorded | Why it is a useful candidate |
|---|---|---|---|
| HPMC E5 | Cellulosic, neutral; ether and hydroxyl groups | USP-NF | High polymer T_g, hydrogen-bonding functionality, common oral excipient family |
| Soluplus | Amphiphilic graft copolymer; ester, ether, and lactam groups | FDA IID | Strong affinity-oriented candidate and often useful for solubilisation |
| PVP K30 | Vinylic, neutral; lactam/amide-like carbonyl | FDA IID | High T_g polymer with established ASD use |
| PVP-VA 64 | Vinylic copolymer; lactam/amide and ester | FDA IID | Intermediate hydrophilicity and glass-transition behaviour |
| Eudragit E PO | Cationic acrylic; ester and tertiary amine | Ph.Eur. | A deliberately contrasting cationic acrylic carrier |

The supplied library marks polymer HSP values as Hoftyzer-Van Krevelen (H-V-K) group-contribution estimates. They are not direct multi-solvent experimental solubility-sphere measurements.

### Why HPMCAS-L and Eudragit L100 were excluded

They are enteric polymers whose principal functional value is pH-dependent release. This baseline is scoped to immediate-release tablets. Exclusion is a scope decision, not a statement that enteric polymers are poor ASD carriers. They would be appropriate in a separate delayed-release or intestinal-targeted research question.

## 2.3 The four active decision criteria

The active v1.5 feature matrix is

$$
\mathbf{S}
=
\left[s_{\mathrm{HSP}},\,s_{\chi},\,s_{\mathrm{desc}},\,s_{\mathrm{GT}}\right]
\in [0,1]^{N\times 4}
$$

1. **HSP score, s_HSP:** a cohesive-energy proximity score. It asks whether the drug and polymer occupy nearby positions in Hansen space.
2. **Flory-Huggins score, s_chi:** a mixing-interaction score estimated from HSP differences and drug molar volume. Lower chi gives a higher score.
3. **Descriptor score, s_desc:** a structural-complementarity signal based on repeat-unit descriptors. It is 0.2268 for every candidate in this five-polymer set, so it has no discriminating variance here.
4. **Gordon-Taylor score, s_GT:** a predicted glass-transition margin score. A higher mixture T_g means lower molecular mobility under the model.

### Why the literature score was removed

Earlier versions included s_lit, a literature-evidence score. Version 1.5 permanently removes it from the ranking. Literature provenance remains valuable, but it cannot be calculated objectively and identically for every new polymer by this framework. Keeping it as an active score would mix an auditable physical model with a potentially subjective factor. This is a scientific-integrity decision, not a rejection of literature review.

> [!TIP]
> A concise viva answer is: "The literature was retained as provenance, but removed as a numerical ranking input because the model could not score it consistently for new candidates."

---

# Chapter 3. The Computational Pipeline

## Defence flowchart

```text
Raw drug and polymer data
        |
        v
1. Plausibility validation and input ingestion
        |
        v
2. Drug and repeat-unit 2D descriptor calculation
        |
        v
3. HSP distance, RED, Flory-Huggins chi, and Gordon-Taylor Tg_mix
        |
        v
4. Physical diagnostics: RED threshold and chi < chi_c review
        |
        v
5. Build the four-column score matrix S
        |
        v
6. Standardise columns and apply PCA
        |
        v
7. Elicit AHP weights for the retained PCs; check consistency
        |
        v
8. TOPSIS rank candidates by distance to ideal and anti-ideal profiles
        |
        +--------------------------+
        |                          |
        v                          v
9. Monte Carlo robustness     10. Morris sensitivity
   under Policy A                 of PC weights
        |                          |
        +------------+-------------+
                     v
10. Prediction, failure-boundary mapping, reports, figures, and experimental handoff
```

## Step-by-step explanation

### 1. Input ingestion and plausibility validation

The platform reads a drug JSON profile, a polymer CSV library, workflow settings, and an AHP matrix. A useful analogy is checking ingredients before cooking: an equation can only be meaningful if units, ranges, identities, and required fields are sensible. The frozen baseline uses five candidates and a 30% drug load.

### 2. 2D descriptor generation

The platform uses drug structure and polymer repeat-unit representations to obtain basic structural descriptors such as hydrogen-bond donors, acceptors, topological polar surface area, aromaticity, and rotatable bonds. This is a low-resolution molecular description, not a full molecular-dynamics simulation of a real polymer chain.

### 3. Physical compatibility models

HSP calculates a distance in three-dimensional cohesive-energy space. Flory-Huggins converts selected HSP differences to an interaction estimate. Gordon-Taylor predicts the mixture T_g at the defined composition. None of these models alone answers the whole ASD question; their value is complementary evidence.

### 4. Physical diagnostic checks

The HSP screen considers RED<=1.0 favourable. The phase-boundary diagnostic compares chi with chi_c. All five active candidates pass both frozen-baseline physical diagnostics, so the ranking is a comparison among candidates that passed the first screen, not a comparison of obvious failures.

### 5. Score matrix construction

Raw physical outputs have different units and directions. They are converted into four scores on 0-1 scales. This makes them comparable for downstream analysis while preserving a clear path back to the original physical calculations.

### 6. PCA: remove double-counting

HSP and chi both contain information from cohesive-energy differences, so treating them as entirely independent can exaggerate that evidence. PCA rotates correlated score columns into new, uncorrelated axes. In the baseline, PC1 is the affinity axis and PC2 is the glass-stabilisation axis.

### 7. AHP: make expert judgement visible

AHP states an explicit trade-off between the retained PCA axes. The frozen matrix says PC1 is twice as important as PC2. The resulting weights are 0.6667 and 0.3333. A consistency check asks whether the pairwise judgement is internally coherent; it does not prove the judgement is experimentally correct.

### 8. TOPSIS: rank balanced candidates

TOPSIS defines the best observed value for each weighted PC as the positive ideal and the worst as the anti-ideal. A candidate is preferred when it is close to the positive ideal and far from the anti-ideal. It rewards balance better than a simple weighted sum when a candidate is excellent on one axis but poor on another.

### 9. Monte Carlo uncertainty quantification

The model repeats the ranking 10,000 times with controlled perturbations. Policy A keeps the baseline PCA axes fixed, so each repeat is judged in the same coordinate system. The output P(top-1) means how often a candidate ranked first within these assumed perturbations.

### 10. Morris sensitivity analysis

Morris screening changes one input factor at selected points across a range and measures the resulting change in output. Here it examines PC weights. A large absolute mean effect mu* indicates influence; a large standard deviation sigma suggests interactions or non-linear behaviour.

### 11. Failure-boundary mapping and outputs

The framework can create figures, machine-readable reports, spreadsheets, Markdown, and a PDF. Its failure-boundary component uses a logistic model and synthetic/representative design data while wet-lab results are pending. Therefore, it should be presented as an exploratory operating-risk map, not as an experimentally established design space.

---

# Chapter 4. Architecture, Data Flow, and Quality Gates

## System topology

```text
React 18 + TypeScript + Vite dashboard       Command-line batch runner
                    |                                  |
                    +----------- JSON / direct call ----+
                                       |
                                       v
                             FastAPI application layer
                       routes, validation schemas, adapters
                                       |
                                       v
                            asd_mcda computational engine
       inputs -> physical models -> PCA -> AHP -> TOPSIS -> UQ / sensitivity / FBM
                                       |
                                       v
                  reports, figures, Excel/JSON/Markdown/PDF, local history data
```

### Why these layers exist

| Layer | Plain-language reason |
|---|---|
| React + Vite frontend | Gives a researcher an interactive dashboard without changing scientific code; Vite supports fast development refreshes. |
| FastAPI + Pydantic | Provides a typed API boundary so bad or incomplete web inputs can be rejected before reaching the scientific engine. |
| Core `asd_mcda` package | Keeps equations, ranking, and analysis independent of the user interface. This is important for reproducibility and batch use. |
| ReportLab PDF generator | Produces a controlled programmatic report without relying on a browser print layout. |
| SQLite / JSON history | Supports local-first persistence and portable snapshots of analyses. |
| SHA-256 manifest hashes | Make later accidental or deliberate data changes detectable. A hash is a tamper-evidence check, not a scientific validation experiment. |

## Numerical data transformation

```text
Physical inputs
  Indomethacin + five polymer records
        |
        v
Raw model outputs
  Ra, RED, chi, chi_c, K, Tg_mix, descriptors
        |
        v
Score matrix S (5 x 4)
        |
        v
Standardised matrix Z: each varying column mean 0, SD 1
        |
        v
PCA scores T = Z P (5 x 2 retained coordinates)
        |
        v
Vector normalisation + AHP weights
        |
        v
TOPSIS distances D+ and D- -> closeness coefficient CL
        |
        v
Monte Carlo top-1 frequency and sensitivity results
```

## The diagnostic logic to explain in a defence

| Check | Rule in this baseline | Meaning |
|---|---|---|
| HSP affinity screen | RED<=1.0; at least 3 polymers must pass system Gate 1 | Candidates are within the drug's HSP sphere under this model |
| Phase-boundary diagnostic | chi<chi_c | Mixing is favourable relative to a simplified critical boundary |
| AHP consistency | CR<0.08 | Pairwise weighting is internally coherent |
| Selection robustness tier | High at P(top-1)>=0.70 | Ranking is relatively stable under the implemented perturbations |

The manifest calls all five polymers HSP and phase-boundary passes. The system-level HSP gate prevents the pipeline from continuing if fewer than three candidates pass. Treat phase-boundary status as a candidate diagnostic, not as an extra TOPSIS score.

## Honest description of uncertainty implementation

The frozen configuration documents physical uncertainty magnitudes for HSP, chi, LogP, drug/polymer T_g, density, and AHP weights. The current `monte_carlo.py` implementation operationally applies normal score-level noise with SD 0.05 to all four normalised score values and uniform relative perturbation of the two AHP weights from 0.80 to 1.20 of baseline. It projects each perturbed score matrix onto the fixed baseline PCA model.

This distinction matters. A careful defence answer is: "The uncertainty registry records the physical sources motivating uncertainty, while the frozen Monte Carlo engine evaluates ranking robustness through score-level perturbation and AHP-weight perturbation in a fixed PCA subspace. I would extend the next version to sample each physical input explicitly and trace it through each model."

---

# Chapter 5. Equations Explained for Pharmacists

## 5.1 Hansen solubility parameters

HSP divides cohesive energy into dispersion (delta_D), polar (delta_P), and hydrogen-bonding (delta_H) contributions. Imagine comparing the three ingredients of a molecular "preference profile." Small differences indicate that drug and polymer may mix more comfortably.

$$
R_a
=
\sqrt{
4\left(\delta_{D,d}-\delta_{D,p}\right)^2
+ \left(\delta_{P,d}-\delta_{P,p}\right)^2
+ \left(\delta_{H,d}-\delta_{H,p}\right)^2
}
$$

| Symbol | Meaning | Unit |
|---|---|---|
| R_a | Hansen distance between drug and polymer | MPa^0.5 |
| d, p | drug and polymer subscripts | - |
| delta_D,delta_P,delta_H | dispersion, polar, and hydrogen-bond HSP components | MPa^0.5 |

The dispersion difference is weighted by 4 in the conventional Hansen distance expression. It is part of the geometry of the Hansen space, not an arbitrary claim that dispersion is always four times more important chemically.

$$
\mathrm{RED} = \frac{R_a}{R_0}
$$

$$
s_{\mathrm{HSP}} = \max\left(0,\,1-\frac{\mathrm{RED}}{2}\right)
$$

Here, R_0=8.0 MPa^0.5 is indomethacin's interaction radius. RED at or below 1 means the polymer lies within the modelled solubility sphere. Lower RED gives a higher HSP score.

## 5.2 Flory-Huggins interaction parameter

$$
\chi
=
\alpha\,\frac{V_m}{R T}
\left[
\left(\Delta\delta_D\right)^2
+ 0.25\left(\Delta\delta_P\right)^2
+ 0.25\left(\Delta\delta_H\right)^2
\right]
$$

| Symbol | Meaning | Unit / baseline value |
|---|---|---|
| chi | estimated drug-polymer interaction parameter | dimensionless |
| alpha | Lindvig global factor | 0.60 |
| V_m | drug molar volume | 273.0 cm3/mol, converted to m3/mol in code |
| R | universal gas constant | 8.314463 J/(mol K) |
| T | reference temperature | 298.15 K |

A lower chi is more favourable in this implementation, so

$$
s_{\chi}=\max\left(0,\,1-\chi\right)
$$

The critical diagnostic is

$$
\chi_c = \frac{1}{2}\left(1+\frac{1}{\sqrt{r_2}}\right)^2
$$

$$
r_2 = \frac{V_{\mathrm{polymer}}}{V_{\mathrm{drug}}}
$$

$$
V_{\mathrm{polymer}} = \frac{M_n}{\rho_{\mathrm{polymer}}}
$$

chi is the estimated interaction; chi_c is a simplified critical boundary. The comparison chi<chi_c is a diagnostic at the stated condition, not a lifetime stability certificate.

## 5.3 Gordon-Taylor glass-transition model

$$
K
=
\frac{\rho_{\mathrm{drug}}\,T_{g,\mathrm{drug}}}
{\rho_{\mathrm{polymer}}\,T_{g,\mathrm{polymer}}}
$$

$$
T_{g,\mathrm{mix}}
=
\frac{w_1T_{g,\mathrm{drug}}+K\,w_2T_{g,\mathrm{polymer}}}
{w_1+K\,w_2}
$$

$$
w_2 = 1-w_1
$$

K is the Simha-Boyer constant used here. All temperatures must be in Kelvin in the equation. A higher predicted Tg_mix generally means lower segmental mobility and less opportunity for drug molecules to rearrange into a crystal.

$$
s_{\mathrm{GT}}
=
\operatorname{clip}_{[0,1]}
\left(
\frac{T_{g,\mathrm{mix}}-\left(T_{g,\mathrm{drug}}+30\right)}{50}
\right)
$$

This is a model score. It reaches 1.0 after a defined margin and therefore loses information above that cap. Moisture, specific interactions, and process history can shift real T_g values; mDSC is required for confirmation.

## 5.4 Standardisation, PCA, AHP, and TOPSIS

Standardisation puts each varying score column on the same statistical scale:

$$
Z_{ij}=\frac{S_{ij}-\bar{S}_j}{\sigma_j}
$$

The invariant descriptor column has zero variance in this library and is transformed to a zero column by `StandardScaler`. PCA then rotates standardised data into principal coordinates:

$$
\mathbf{T}=\mathbf{Z}\mathbf{P}
$$

The baseline loading pattern is:

| Criterion | PC1 loading | PC2 loading | Interpretation |
|---|---:|---:|---|
| s_HSP | 0.697 | -0.137 | Strong affinity-axis contribution |
| s_chi | 0.702 | -0.068 | Strong affinity-axis contribution |
| s_desc | 0.000 | 0.000 | No variance in this reference library |
| s_GT | 0.145 | 0.988 | Dominant glass-stabilisation contribution |

PC1 explains 67.2% of variance and PC2 explains 32.8%, so the retained two PCs explain 100.0% of variation in this dataset.

For AHP, the baseline matrix is

$$
\mathbf{A}
=
\begin{bmatrix}
1 & 2 \\
\frac{1}{2} & 1
\end{bmatrix}
$$

Its principal eigenvector is proportional to (2,1), giving

$$
\mathbf{w}
=
\begin{bmatrix}
0.6667 \\
0.3333
\end{bmatrix}
$$

The consistency index and ratio are

$$
\mathrm{CI} = \frac{\lambda_{\max}-n}{n-1}
$$

$$
\mathrm{CR} = \frac{\mathrm{CI}}{\mathrm{RI}}
$$

For this reciprocal 2 x 2 matrix, lambda_max=2, CI = 0, and CR = 0.0000. A zero CR says the two-way comparison is mathematically consistent; it does not make the 2:1 preference an empirical fact.

TOPSIS vector-normalises each PC column, multiplies it by the weights, finds positive and negative ideals, and calculates:

$$
D_i^+ = \sqrt{\sum_j\left(v_{ij}-A_j^+\right)^2}
$$

$$
D_i^- = \sqrt{\sum_j\left(v_{ij}-A_j^-\right)^2}
$$

$$
C_{L,i}=\frac{D_i^-}{D_i^+ + D_i^-}
$$

Larger C_L is better because it means farther from the observed anti-ideal and closer to the observed positive ideal.

## 5.5 Worked calculations: HPMC E5 and Soluplus

### HPMC E5

Drug HSP is (19.2, 7.9, 8.4); HPMC E5 HSP is (18.5, 8.8, 12.0).

$$
R_a = \sqrt{4(0.7)^2+(-0.9)^2+(-3.6)^2}
$$

$$
R_a = 3.966106\ \mathrm{MPa}^{1/2}
$$

$$
\mathrm{RED} = \frac{3.966106}{8.0} = 0.495763
$$

$$
s_{\mathrm{HSP}} = 1-\frac{0.495763}{2} = 0.752118
$$

The Lindvig bracket is 0.7^2+0.25(0.9^2)+0.25(3.6^2)=3.9325. With alpha=0.60, V_m=273.0 cm3/mol, and T=298.15 K:

$$
\chi = 0.259845
$$

$$
s_{\chi} = 1-0.259845 = 0.740155
$$

For the critical diagnostic, V_polymer=20000/1.27=15748.03 cm3/mol, r_2=57.685, and chi_c=0.640332. Therefore 0.259845<0.640332: pass.

For Gordon-Taylor, K=(1.22 x 315.15)/(1.27 x 443.15)=0.683160.

$$
T_{g,\mathrm{mix}}
=
\frac{0.30(315.15)+0.683160(0.70)(443.15)}
{0.30+0.683160(0.70)}
$$

$$
T_{g,\mathrm{mix}} = 393.806\ \mathrm{K}
$$

$$
T_{g,\mathrm{mix}} = 120.656^\circ\mathrm{C}
$$

Thus s_GT=0.973123. HPMC E5 combines good affinity scores with very high predicted glass-stabilisation score.

### Soluplus

Soluplus HSP is (18.0, 8.5, 10.5).

$$
R_a = \sqrt{4(1.2)^2+(-0.6)^2+(-2.1)^2}
$$

$$
R_a = 3.244996\ \mathrm{MPa}^{1/2}
$$

$$
\mathrm{RED} = 0.405625
$$

$$
s_{\mathrm{HSP}} = 1-\frac{0.405625}{2} = 0.797188
$$

The Lindvig bracket is 1.2^2+0.25(0.6^2)+0.25(2.1^2)=2.6325.

$$
\chi = 0.173946
$$

$$
s_{\chi} = 1-0.173946 = 0.826054
$$

For the critical diagnostic, V_polymer=90000/1.08=83333.33 cm3/mol, r_2=305.25, and chi_c=0.558874. Therefore 0.173946<0.558874: pass.

For Gordon-Taylor:

$$
K = \frac{1.22(315.15)}{1.08(343.15)} = 1.037455
$$

$$
T_{g,\mathrm{mix}} = 334.965\ \mathrm{K}
$$

$$
T_{g,\mathrm{mix}} = 61.815^\circ\mathrm{C}
$$

The normalized GT score clips to 0 because this temperature is below the framework's Tg_drug+30=345.15 K reference. This does not mean Soluplus has zero practical value; it means it contributes no positive score through this particular margin transform.

### Final TOPSIS arithmetic check

For HPMC E5:

$$
C_L
=
\frac{0.795614}{0.156178+0.795614}
= 0.835911
$$

For Soluplus:

$$
C_L
=
\frac{0.868368}{0.382266+0.868368}
= 0.694342
$$

---

# Chapter 6. Frozen Results and Scientific Interpretation

## Score matrix

| Polymer | s_HSP | s_chi | s_desc | s_GT |
|---|---:|---:|---:|---:|
| HPMC E5 | 0.7521 | 0.7402 | 0.2268 | 0.9731 |
| Soluplus | 0.7972 | 0.8261 | 0.2268 | 0.0000 |
| PVP K30 | 0.6942 | 0.6045 | 0.2268 | 0.9848 |
| PVP-VA 64 | 0.7073 | 0.6377 | 0.2268 | 0.2368 |
| Eudragit E PO | 0.6359 | 0.4393 | 0.2268 | 0.0000 |

## Authoritative v1.5 ranking

| Rank | Candidate | D^+ | D^- | C_L | P(top-1) | Model-selection tier |
|---:|---|---:|---:|---:|---:|---|
| 1 | HPMC E5 | 0.1562 | 0.7956 | **0.8359** | **75.54%** | High |
| 2 | Soluplus | 0.3823 | 0.8684 | **0.6943** | 20.18% | Low |
| 3 | PVP K30 | 0.4593 | 0.5599 | **0.5494** | 4.03% | Low |
| 4 | PVP-VA 64 | 0.5063 | 0.4494 | **0.4703** | 0.25% | Low |
| 5 | Eudragit E PO | 0.9159 | 0.0911 | **0.0905** | 0.00% | Low |

## Why each candidate ranks where it does

### 1. HPMC E5: balanced computational lead

HPMC E5 is not the single best affinity candidate: Soluplus has lower chi and higher s_HSP. HPMC E5 wins because it combines favourable affinity with a very high predicted Tg_mix and a near-maximal GT score. Under the stated PCA and AHP trade-off, that balance places it nearest the positive ideal. The correct phrase is **top-ranked computational candidate**.

### 2. Soluplus: high-affinity alternate

Soluplus is strongest in the affinity-related criteria. Its second rank follows from a trade-off: it does not receive positive GT score under the framework's threshold. It is therefore a compelling experimental comparator, especially if dissolution and supersaturation maintenance are primary outcomes.

### 3. PVP K30: glass-stable alternative with moderate affinity

PVP K30 has the highest GT score and predicted Tg_mix of the library, but its HSP and chi scores are more moderate than HPMC E5 and Soluplus. Its third rank shows why a high T_g alone is not a complete polymer-selection rule.

### 4. PVP-VA 64: intermediate profile

PVP-VA 64 passes the physical diagnostics but has intermediate affinity and a smaller glass-transition margin. It is neither close enough to the positive ideal nor far enough from the anti-ideal to outrank the first three under the frozen weights.

### 5. Eudragit E PO: boundary anti-ideal

Eudragit E PO passes both initial diagnostics, but it has the least favourable HSP and chi scores in the active set and zero GT score. It is last in this immediate-release indomethacin baseline. This does not prove it can never work in another drug, loading, pH environment, or product goal.

---

# Chapter 7. Uncertainty, Sensitivity, and Failure-Boundary Mapping

## Monte Carlo in plain English

Monte Carlo is like repeating the same decision after gently shaking uncertain inputs many times. Instead of pretending the inputs are exact, the framework asks how often each polymer wins across 10,000 permitted variations. The random seed is 42 so the frozen analysis can be reproduced.

$$
P_i(\text{top-1})
=
\frac{1}{N}\sum_{k=1}^{N}
\mathbb{I}\!\left[\text{candidate }i\text{ ranks first in run }k\right]
$$

For HPMC E5, 75.54% corresponds to 7,554 top-rank occurrences in 10,000 frozen runs. It is a **model-selection robustness probability** under the chosen uncertainty method. It is not a probability of clinical success, bioavailability, safety, batch success, or regulatory approval.

## Policy A

PCA axes can change sign, rotate, or swap when refitted to every perturbed sample. That makes PC1 and PC2 weights hard to compare across repetitions. Policy A freezes the baseline scaler and PCA component directions, then projects each perturbed score matrix into that fixed basis. The analogy is measuring every sample using the same ruler rather than redrawing the ruler each time.

## Morris sensitivity

For an elementary effect,

$$
EE_j
=
\frac{f\left(x_1,\ldots,x_j+\Delta,\ldots,x_p\right)-f\left(\mathbf{x}\right)}
{\Delta}
$$

mu is the signed average effect, mu* is the average absolute effect, and sigma describes how much the effect changes across the explored space. The frozen manifest reports:

| Factor | mu | mu* | sigma | Interpretation |
|---|---:|---:|---:|---|
| PC1 weight | 0.180 | 0.190 | 0.060 | Dominant and interactive factor |
| PC2 weight | 0.080 | 0.090 | 0.020 | Moderate factor |

Because PC1 largely represents thermodynamic affinity, changing its importance most strongly changes the ranking. This does not mean glass stabilisation is unimportant; it means the ranking is more sensitive to the stated PC1 weighting range.

## Failure-boundary map: careful interpretation

The implemented failure-boundary model uses logistic regression:

$$
\Pr\left(\mathrm{failure}=1\mid\mathbf{x}\right)
=
\frac{1}
{1+\exp\!\left[-\left(\beta_0+\boldsymbol{\beta}^{\mathsf{T}}\mathbf{x}\right)\right]}
$$

Inputs include polymer rank, inlet temperature, drug loading, and feed concentration. While wet-lab data are pending, the code generates a synthetic representative dataset for model initialisation/testing. Therefore the map is an exploratory decision-support visual, not a validated physical-stability design space. Replace it with experimental results before using it to make operating claims.

---

# Chapter 8. Prospective Laboratory Validation Plan

The computational phase tells you what to test first. It does not eliminate experimental work.

| Stage | Practical experiment | What it answers |
|---|---|---|
| 1 | Prepare indomethacin ASDs with HPMC E5, Soluplus, and a comparator at 30% loading | Can the candidate be processed reproducibly? |
| 2 | Choose solvent system, feed concentration, inlet/outlet conditions, and residual-solvent controls | Is the feed and spray-drying process appropriate? |
| 3 | mDSC | Is there one glass transition, and does it agree reasonably with predicted behaviour? |
| 4 | PXRD | Is the product amorphous or is crystalline drug detectable? |
| 5 | FTIR / Raman where appropriate | Is there evidence consistent with drug-polymer interaction? |
| 6 | Non-sink dissolution | Does the ASD create and maintain supersaturation? |
| 7 | Stability at 25 deg C/60% RH and 40 deg C/75% RH | Does crystallinity emerge during storage? |
| 8 | Tablet compaction and dosage-form testing | Does the dispersion remain useful after downstream processing? |

### Model-versus-experiment script

> "The computational framework is deliberately a prioritisation tool. It narrows the experimental space and makes the assumptions visible, but single-phase behaviour, crystallinity, dissolution, moisture sensitivity, and manufacturability must be demonstrated experimentally. My next decision is therefore to test HPMC E5 and Soluplus prospectively, not to declare the ranking a finished product-development result."

---

# Chapter 9. Figures, Reports, and How to Talk About Them

| Artifact | What to look for | Safe interpretation |
|---|---|---|
| PCA scree plot | Variance explained by each PC | Two PCs capture all non-zero variance in this five-candidate matrix |
| PCA biplot / compatibility view | Candidate positions relative to affinity and GT directions | Directional comparison; do not mistake it for experimental phase behaviour |
| TOPSIS ranking chart | C_L bars | HPMC E5 is the best balanced candidate under frozen weights |
| Monte Carlo chart | Top-1 frequencies and intervals | HPMC E5 has the most stable model selection under assumed perturbations |
| Morris scatter | mu* versus sigma | PC1 weight has the greatest reported influence and interaction |
| Failure-boundary contour | Estimated failure probability regions | Exploratory until trained and tested on real laboratory outcomes |
| PDF report | Inputs, scores, ranking, UQ, sensitivity, and provenance | Audit trail for the specific computational analysis, not a replacement for a lab report |

---

# Chapter 10. One Hundred Viva and Interview Questions

Every answer below is designed to be spoken, not memorised word for word. Keep the quoted sentence structure but adapt it to the examiner's question.

## Module 1. ASD Fundamentals and Indomethacin Pre-formulation

### 1. What is an ASD and why is it needed for indomethacin?
**Examiner intent:** Check whether you understand the dosage-form purpose.  
**Practice answer:** "An ASD disperses drug in a non-crystalline state within a polymer. For indomethacin, a BCS Class II drug, that can increase the concentration available for dissolution, but the polymer must also limit recrystallisation."

### 2. What is the difference between thermodynamic miscibility and kinetic stability?
**Examiner intent:** Separate energetic preference from time-dependent behaviour.  
**Practice answer:** "Miscibility asks whether mixing is energetically favourable under a defined model; kinetic stability asks whether the amorphous mixture remains unchanged over time. A favourable chi does not by itself guarantee storage stability."

### 3. Why is indomethacin BCS Class II?
**Examiner intent:** Check BCS reasoning.  
**Practice answer:** "It is classified as high permeability but low aqueous solubility. The research therefore focuses on raising dissolution performance rather than overcoming a permeability-limited molecule."

### 4. Why are T_m and T_g both important?
**Examiner intent:** Test crystalline versus amorphous concepts.  
**Practice answer:** "T_m describes the melting of the crystalline lattice, while T_g marks the mobility change of the amorphous material. For ASD stability, the mixture's glass transition is especially relevant because mobility enables crystallisation."

### 5. What is the T_g/T_m rule of thumb?
**Examiner intent:** Assess whether you know it is only a heuristic.  
**Practice answer:** "The relationship is a qualitative guide to glass-forming and crystallisation tendencies, not a decision rule. I use it to frame risk, then rely on mixture-specific measurements and stability studies."

### 6. Why use 30% drug loading?
**Examiner intent:** Test design-point justification.  
**Practice answer:** "Thirty percent is the defined frozen-baseline loading: high enough to be a meaningful payload and low enough to retain substantial polymer stabilisation. It is a starting design point, not a universal optimum."

### 7. What is the spring-and-parachute effect?
**Examiner intent:** Test dissolution understanding.  
**Practice answer:** "The spring is rapid supersaturation from the amorphous high-energy drug; the parachute is the polymer's ability to slow precipitation and maintain that supersaturation. Both phases must be measured in non-sink dissolution testing."

### 8. Which indomethacin polymorphs matter here?
**Examiner intent:** Test solid-state awareness.  
**Practice answer:** "The active profile records gamma and alpha polymorphs. The computational model uses curated reference properties, but PXRD and DSC must determine what crystalline form, if any, appears in actual formulations."

### 9. How does moisture affect an ASD?
**Examiner intent:** Test humidity risk.  
**Practice answer:** "Water can plasticise a polymer-drug system, lower its effective T_g, and increase molecular mobility. That is why accelerated humidity storage and water-content control are essential even when a dry-state model is favourable."

### 10. How can a polymer inhibit precipitation?
**Examiner intent:** Connect chemistry to performance.  
**Practice answer:** "A polymer can interact with drug molecules, increase the energetic barrier to nucleation, and slow crystal growth or diffusion. The exact mechanism is formulation-specific and needs experimental evidence rather than assumption."

## Module 2. Hansen Solubility Parameters and Group Contribution

### 11. What are Hansen solubility parameters?
**Examiner intent:** Check the three-component concept.  
**Practice answer:** "They divide cohesive energy into dispersion, polar, and hydrogen-bonding contributions. I use their distance to compare the drug's and polymer's affinity profiles."

### 12. Why is dispersion multiplied by four in R_a?
**Examiner intent:** Test formula literacy.  
**Practice answer:** "That coefficient is part of the standard Hansen-space distance convention. It defines the geometry used by the model; it is not a separate experimentally fitted weight in this study."

### 13. What does RED mean?
**Examiner intent:** Test interpretation.  
**Practice answer:** "RED is HSP distance divided by the drug interaction radius. RED at or below one means the polymer lies inside the modelled solubility sphere and is considered favourable by this screening criterion."

### 14. What is R_0 for indomethacin here?
**Examiner intent:** Check command of input values.  
**Practice answer:** "The frozen indomethacin profile uses R_0=8.0 MPa^0.5. It is the radius used to convert R_a into RED."

### 15. How were polymer HSPs determined?
**Examiner intent:** Test provenance honesty.  
**Practice answer:** "The active polymer-library HSP values are H-V-K group-contribution estimates from repeat-unit information. They were not measured as experimental multi-solvent solubility spheres in this study."

### 16. What is the H-V-K method?
**Examiner intent:** Check estimation-method understanding.  
**Practice answer:** "Hoftyzer-Van Krevelen is a group-contribution method that estimates polymer properties from the functional groups in a repeat unit. It is useful for screening but cannot capture every real-chain or morphology effect."

### 17. What is the limitation of H-V-K HSP estimates?
**Examiner intent:** Invite critical appraisal.  
**Practice answer:** "Group-contribution values can have systematic error, especially for polar and strongly hydrogen-bonding polymers. I therefore present HSP as a screening input and retain experimental solvent-screening or other validation as future work."

### 18. Why did you not manually correct H-V-K values?
**Examiner intent:** Test reproducibility discipline.  
**Practice answer:** "An undocumented manual correction would add subjective bias. The frozen baseline uses a transparent consistent method, and any calibrated correction should be separately justified, versioned, and validated."

### 19. How is HSP uncertainty addressed?
**Examiner intent:** Link limitations to UQ.  
**Practice answer:** "The framework records HSP uncertainty as part of its uncertainty rationale and tests ranking sensitivity by perturbing normalised score values. It does not make experimental HSP measurement unnecessary."

### 20. Why are HSPs not enough to predict ASD stability?
**Examiner intent:** Reject one-metric thinking.  
**Practice answer:** "HSP describes affinity proximity, but stability also depends on glass transition, moisture, phase behaviour, processing, drug loading, and time. That is exactly why the framework combines several criteria and still requires experiments."

## Module 3. Flory-Huggins Theory and Phase Boundaries

### 21. What is chi?
**Examiner intent:** Test thermodynamic meaning.  
**Practice answer:** "The Flory-Huggins interaction parameter is a dimensionless estimate of the energetic penalty or favourability of mixing. In this implementation, lower chi gives a higher compatibility score."

### 22. How is chi obtained in this project?
**Examiner intent:** Test equation ownership.  
**Practice answer:** "It is estimated using the Lindvig conversion from weighted HSP-component differences, indomethacin molar volume, temperature, and the global factor alpha=0.60. It is an estimate, not a directly measured activity parameter."

### 23. Why is alpha=0.60 used?
**Examiner intent:** Probe model assumptions.  
**Practice answer:** "It is the global Lindvig factor implemented in the frozen model. I treat it as a stated modelling assumption that belongs in uncertainty and future calibration discussions."

### 24. What is chi_c?
**Examiner intent:** Check phase-boundary concept.  
**Practice answer:** "chi_c is a simplified critical interaction threshold derived from relative component size. Comparing chi with chi_c gives a phase-boundary diagnostic under the model assumptions."

### 25. How is chi_c calculated?
**Examiner intent:** Test use of polymer size.  
**Practice answer:** "The model forms r_2=V_polymer/V_drug and calculates chi_c=0.5(1+1/sqrt(r_2))^2. Polymer volume is approximated from M_n/rho."

### 26. Why use M_n rather than M_w in chi_c?
**Examiner intent:** Test polymer statistics.  
**Practice answer:** "The implemented segment-size relation uses number-average molecular weight to approximate an average chain-size contribution. M_w is still retained as characterisation metadata, but it is not the primary input to this equation."

### 27. What does chi<chi_c mean?
**Examiner intent:** Test cautious inference.  
**Practice answer:** "It is favourable relative to this simplified phase-boundary diagnostic at 298.15 K. It does not prove that the material will remain single phase at every loading, humidity, or storage temperature."

### 28. Why is the diagnostic evaluated at 298.15 K?
**Examiner intent:** Check condition awareness.  
**Practice answer:** "The frozen model sets 298.15 K as its standard reference condition for comparable screening. Real processing and storage conditions can differ, so temperature-dependent validation remains necessary."

### 29. Does a passing chi test guarantee no phase separation?
**Examiner intent:** Test model limitations.  
**Practice answer:** "No. It is a favourable model diagnostic, not a universal prediction. Humidity, specific interactions, concentration, thermal history, and time can all change the actual system."

### 30. Why is chi_c not a TOPSIS score?
**Examiner intent:** Test separation of gate and rank.  
**Practice answer:** "chi_c acts as a diagnostic boundary rather than a continuous preference score. Keeping it outside the active score matrix avoids double-counting and keeps the pass/fail logic transparent."

## Module 4. Gordon-Taylor and Glass Stabilisation

### 31. What does the Gordon-Taylor equation predict?
**Examiner intent:** Test physical meaning.  
**Practice answer:** "It predicts the glass transition of a binary mixture from component glass transitions, composition, and a weighting constant. In this project it is used as a proxy for molecular-mobility margin."

### 32. What is the Simha-Boyer constant here?
**Examiner intent:** Test implementation knowledge.  
**Practice answer:** "The code calculates K=(rho_drugT_g,drug)/(rho_polymerT_g,polymer). It uses the amorphous indomethacin density and each polymer's density and glass transition."

### 33. Why are density and T_g needed for K?
**Examiner intent:** Test formula logic.  
**Practice answer:** "They determine how the component contributions are weighted in the implemented mixture equation. Their uncertainty and source quality therefore affect the predicted mixture glass transition."

### 34. What is anti-plasticisation in this context?
**Examiner intent:** Test conceptual application.  
**Practice answer:** "It means choosing a carrier that raises the mixture glass transition relative to the drug, reducing molecular mobility. It is favourable only when it is balanced with miscibility and processability."

### 35. Why does a high Tg_mix help stability?
**Examiner intent:** Connect T_g to crystallisation.  
**Practice answer:** "Below T_g, molecular rearrangement is slower, so nucleation and crystal growth are less kinetically accessible. High predicted T_g is therefore a useful stability signal, not proof of stability."

### 36. What is the 'T_g minus 50 deg C' rule?
**Examiner intent:** Check use of heuristics.  
**Practice answer:** "It is a practical mobility heuristic sometimes used to discuss storage margin. I would never use it as a substitute for humidity-controlled stability data, especially for hygroscopic systems."

### 37. What are Gordon-Taylor limitations?
**Examiner intent:** Elicit critical thinking.  
**Practice answer:** "It assumes an idealised binary mixture and may miss specific hydrogen bonding, ionisation, non-ideal mixing, or phase separation. Experimental mDSC may therefore differ from the prediction."

### 38. When would you use the Kwei equation?
**Examiner intent:** Test alternative model awareness.  
**Practice answer:** "Kwei adds an interaction term and can describe deviations caused by specific interactions. I would consider it after enough blend data exist to fit and justify that extra parameter."

### 39. Why does HPMC E5 have a high GT score?
**Examiner intent:** Check numerical correction.  
**Practice answer:** "Using the frozen inputs, HPMC E5 gives T_g,mix=393.806 K or 120.656 deg C and s_GT=0.9731. Its high polymer glass transition and the implemented Simha-Boyer weighting create a large predicted mobility margin."

### 40. Why is Soluplus s_GT zero?
**Examiner intent:** Test score-versus-property distinction.  
**Practice answer:** "Its predicted mixture T_g is 334.965 K, below the score's reference threshold of 345.15 K, so the clipped normalised score is zero. That is a property of the chosen transfer function, not a claim that Soluplus is unusable."

## Module 5. Descriptors and Feature Engineering

### 41. What is the purpose of s_desc?
**Examiner intent:** Test the role of structural signals.  
**Practice answer:** "It preserves a structural-complementarity signal based on 2D descriptors alongside bulk thermodynamic scores. It is meant to become informative when a more diverse polymer library is screened."

### 42. Which descriptors are relevant?
**Examiner intent:** Check tool literacy without code jargon.  
**Practice answer:** "The framework considers descriptors such as hydrogen-bond donors and acceptors, topological polar surface area, aromaticity, and related 2D structure features. These are representations of molecular functionality, not direct measurements of formulation performance."

### 43. What indomethacin groups matter for interaction?
**Examiner intent:** Link structure to chemistry.  
**Practice answer:** "Its carboxylic acid contributes one hydrogen-bond donor, and the structure has four listed acceptors. These features can support interactions with polymer carbonyl, ether, or hydroxyl functionalities."

### 44. Why is s_desc identical for all five polymers?
**Examiner intent:** Test awareness of a limitation.  
**Practice answer:** "The reference repeat-unit matching produces the same value, 0.2268, for this particular library. It therefore contributes no variance to the current PCA and no discrimination among the five candidates."

### 45. Why retain an invariant criterion?
**Examiner intent:** Test design rationale.  
**Practice answer:** "It is retained for generalisability to new polymers, where the descriptor score may vary. I acknowledge that in this frozen library it is structurally present but statistically inactive."

### 46. What happens with a diverse new polymer?
**Examiner intent:** Test extensibility.  
**Practice answer:** "Its repeat-unit descriptors may produce a different score, giving the column variance and allowing it to influence PCA. The new polymer's input quality and method limits would still need checking."

### 47. What is the difference between repeat-unit descriptors and whole-polymer properties?
**Examiner intent:** Test scale awareness.  
**Practice answer:** "Repeat-unit descriptors describe local chemical functionality, whereas whole-polymer properties such as M_n, density, and T_g describe the material at a larger scale. Both are needed because they answer different questions."

### 48. Why remove s_lit?
**Examiner intent:** Test integrity decision.  
**Practice answer:** "It could not be automatically and objectively calculated for every new polymer, so it introduced avoidable subjectivity into a physical ranking. Version 1.5 keeps source information as provenance instead of allowing it to alter the mathematical rank."

### 49. Was literature information discarded?
**Examiner intent:** Test nuance.  
**Practice answer:** "No. DOIs, suppliers, sources, and confidence fields remain in metadata. They are separated from the computational score so that evidence review remains visible without becoming an uncalibrated ranking input."

### 50. Define the active score matrix.
**Examiner intent:** Test exact v1.5 scope.  
**Practice answer:** "The active matrix is S=[s_HSP,s_chi,s_desc,s_GT] with one row per polymer and four columns, each bounded from zero to one. Literature score is not an active fifth column in version 1.5."

## Module 6. PCA and AHP

### 51. Why do PCA before TOPSIS?
**Examiner intent:** Test the anti-double-counting logic.  
**Practice answer:** "HSP and chi are related because both use cohesive-energy differences. PCA combines correlated evidence into orthogonal coordinates before ranking so the model does not treat similar signals as fully independent votes."

### 52. What goes wrong without PCA?
**Examiner intent:** Test collinearity understanding.  
**Practice answer:** "A direct weighted rank could over-emphasise affinity because two correlated columns would each receive influence. The result could look more certain than the independent evidence supports."

### 53. How are columns standardised?
**Examiner intent:** Test mathematical foundation.  
**Practice answer:** "Each varying score is centred by its column mean and divided by its standard deviation. This prevents a criterion with a larger numeric spread from dominating PCA merely because of scale."

### 54. How many PCs are retained?
**Examiner intent:** Check numerical recall.  
**Practice answer:** "Two PCs are retained because they explain 100.0% of the non-zero variance in the v1.5 five-polymer score matrix. PC1 explains 67.2% and PC2 explains 32.8%."

### 55. What do PC1 and PC2 mean physically?
**Examiner intent:** Test translation from math.  
**Practice answer:** "PC1 is mainly the thermodynamic-affinity axis because HSP and chi load strongly on it. PC2 is mainly the glass-stabilisation axis because s_GT has the dominant loading."

### 56. What happens to the descriptor column in PCA?
**Examiner intent:** Test the invariant criterion limit.  
**Practice answer:** "It has zero variance in this reference library, so standardisation maps it to zero and it has zero reported loading. It remains available for future libraries with structural diversity."

### 57. What is AHP?
**Examiner intent:** Test multi-criteria method knowledge.  
**Practice answer:** "AHP converts explicit pairwise expert preferences into weights using the principal eigenvector of a reciprocal comparison matrix. It makes the trade-off between retained decision axes inspectable."

### 58. What AHP matrix is used?
**Examiner intent:** Check exact baseline.  
**Practice answer:** "The frozen two-PC matrix is [[1, 2], [0.5, 1]], meaning PC1 is given twice the importance of PC2."

### 59. What are the AHP weights?
**Examiner intent:** Check recall.  
**Practice answer:** "The normalised principal-eigenvector weights are 0.6667 for PC1 and 0.3333 for PC2. They are explicit model preferences and can be revisited in a future validation study."

### 60. What does CR = 0 mean?
**Examiner intent:** Test the limit of a consistency metric.  
**Practice answer:** "For this two-by-two reciprocal matrix, the principal eigenvalue equals the matrix size, giving CI and CR of zero. It proves internal mathematical consistency, not that the chosen 2:1 scientific preference is universally true."

## Module 7. TOPSIS Ranking

### 61. What does TOPSIS mean?
**Examiner intent:** Test method recall.  
**Practice answer:** "TOPSIS means Technique for Order Preference by Similarity to Ideal Solution. It ranks each candidate by closeness to the best observed weighted profile and distance from the worst observed profile."

### 62. How does TOPSIS normalise data?
**Examiner intent:** Test algorithm steps.  
**Practice answer:** "It vector-normalises each decision column by the square root of summed squares, then applies the AHP weights. This makes the weighted distance calculation comparable across retained PCs."

### 63. What are the positive and negative ideals?
**Examiner intent:** Test geometry.  
**Practice answer:** "The positive ideal contains the maximum weighted value for each benefit criterion, while the negative ideal contains the minimum. They are reference corners constructed from the candidate set, not real formulations."

### 64. How are D^+ and D^- calculated?
**Examiner intent:** Test formula understanding.  
**Practice answer:** "They are Euclidean distances from a candidate's weighted PC coordinates to the positive and negative ideals. A good candidate has a small D^+ and a large D^-."

### 65. What does C_L mean?
**Examiner intent:** Test interpretation.  
**Practice answer:** "C_L=D^-/(D^++D^-) ranges from zero to one. A larger value means greater relative closeness to the positive ideal under this candidate set and these weights."

### 66. Why did HPMC E5 rank first?
**Examiner intent:** Test balanced explanation.  
**Practice answer:** "It combined favourable affinity with a very high predicted glass-transition margin, producing the best balance across the two retained PCA axes. Its frozen C_L is 0.8359 and it has the highest model-selection robustness."

### 67. Why did Soluplus rank second despite strong affinity?
**Examiner intent:** Test trade-off reasoning.  
**Practice answer:** "Soluplus has the best HSP and chi scores, but its predicted mixture T_g does not earn positive GT score under the chosen threshold. TOPSIS therefore places its affinity strength behind HPMC E5's more balanced profile."

### 68. Why is PVP K30 third?
**Examiner intent:** Test non-single-metric reasoning.  
**Practice answer:** "PVP K30 has an excellent GT score, but moderate affinity-related scores. Its third rank shows the framework rewards a balance of stability-related and thermodynamic evidence."

### 69. Why is PVP-VA 64 fourth?
**Examiner intent:** Test full-library literacy.  
**Practice answer:** "It is intermediate on affinity and has only a modest GT score. It passes the physical screens but sits nearer the anti-ideal than the top three candidates."

### 70. Why is Eudragit E PO fifth?
**Examiner intent:** Test calibrated conclusion.  
**Practice answer:** "It has the lowest affinity-related scores in this active library and zero GT score, so it is closest to the anti-ideal in the frozen immediate-release baseline. I would not generalise that result to other drugs or pH-targeted products."

## Module 8. Monte Carlo and Sensitivity

### 71. What is Monte Carlo simulation?
**Examiner intent:** Test uncertainty reasoning.  
**Practice answer:** "It repeats the decision many times while varying uncertain inputs according to predefined rules. The purpose is to see whether a rank is stable rather than treating one deterministic output as exact."

### 72. How many iterations and what seed were used?
**Examiner intent:** Test reproducibility.  
**Practice answer:** "The v1.5 baseline uses 10,000 iterations with random seed 42. The seed makes the pseudo-random sequence reproducible for the frozen implementation."

### 73. What is actually perturbed in the current code?
**Examiner intent:** Test technical honesty.  
**Practice answer:** "The operational code adds normal score-level noise with SD 0.05 to the four bounded compatibility scores and perturbs AHP weights by uniform relative factors from 0.80 to 1.20. The configuration separately records the physical uncertainty rationale."

### 74. What is P(top-1)?
**Examiner intent:** Test metric definition.  
**Practice answer:** "It is the fraction of Monte Carlo iterations in which a candidate is ranked first. For HPMC E5 it is 0.7554, meaning 75.54% within this computational perturbation model."

### 75. What are the robustness tiers?
**Examiner intent:** Test thresholds.  
**Practice answer:** "High is at least 0.70, moderate is 0.40 to below 0.70, and low is below 0.40. Only HPMC E5 reaches the high tier in the frozen result."

### 76. What is Policy A?
**Examiner intent:** Test the fixed-basis choice.  
**Practice answer:** "Policy A uses the baseline scaler and PCA components for every simulated score matrix. It prevents axis rotation or swapping from confusing the fixed AHP weights across simulations."

### 77. What is the risk of refitting PCA every iteration?
**Examiner intent:** Test coordinate-system insight.  
**Practice answer:** "PC definitions can rotate or exchange order after small perturbations, so a PC1 weight may no longer refer to the same physical pattern. Policy A preserves comparable component semantics."

### 78. Why is P(top-1) not clinical success probability?
**Examiner intent:** Test responsible communication.  
**Practice answer:** "It only counts rank outcomes under assumed computational perturbations. It contains no patient, dissolution, toxicology, scale-up, or clinical data, so calling it clinical success probability would be scientifically wrong."

### 79. What is Morris sensitivity and how is it different from OAT?
**Examiner intent:** Test global sensitivity concepts.  
**Practice answer:** "Morris samples elementary effects across several points in a factor space, helping reveal average influence and interaction or non-linearity. A simple OAT approach changes one input around one baseline and can miss that broader behaviour."

### 80. What did Morris show?
**Examiner intent:** Test exact result and restraint.  
**Practice answer:** "The manifest reports PC1 weight as dominant and interactive with mu*=0.190 and sigma=0.060, while PC2 weight is moderate. That tells us affinity-axis weighting is an important ranking assumption to challenge experimentally."

## Module 9. Software, Testing, and Data Integrity

### 81. How is the software organised?
**Examiner intent:** Test architecture fluency.  
**Practice answer:** "The scientific engine is a Python package separated from the FastAPI backend and React dashboard. Inputs, calculation modules, MCDA, uncertainty, reporting, and visualisation are organised into distinct modules so each can be tested and traced."

### 82. Which technologies are used?
**Examiner intent:** Test concise stack explanation.  
**Practice answer:** "The backend uses Python and FastAPI with validation schemas; the scientific layer uses numerical and machine-learning libraries; the frontend uses React, TypeScript, Vite, and Recharts; reports use ReportLab. The architecture keeps presentation separate from equations."

### 83. What does the automated test suite establish?
**Examiner intent:** Test validation scope.  
**Practice answer:** "The frozen manifest records 76 passing tests covering components, integration, web endpoints, and report integrity. Tests support software correctness for specified cases; they do not validate the pharmaceutical model against new laboratory data."

### 84. How do you avoid cross-contamination between candidates?
**Examiner intent:** Test data-isolation thinking.  
**Practice answer:** "Candidates carry distinct IDs and are evaluated as separate rows through the score and ranking pipeline. Analysis snapshots and report records preserve the input set associated with a run."

### 85. How is the PDF report generated?
**Examiner intent:** Test end-to-end understanding.  
**Practice answer:** "A ReportLab service receives the analysis results and builds structured pages, tables, plots, and provenance content programmatically. This gives consistent layout and a traceable report for a specific run."

### 86. Why use SHA-256 hashes?
**Examiner intent:** Test reproducibility and its limit.  
**Practice answer:** "A SHA-256 hash acts as a fingerprint of an input file, so a later change can be detected. It protects provenance integrity but does not prove that the original values were scientifically correct."

### 87. What is the baseline manifest?
**Examiner intent:** Test release governance.  
**Practice answer:** "It is the machine-readable declaration of the active version, inputs, criteria, weights, ranking, uncertainty settings, and hashes. It lets another person identify exactly what was frozen."

### 88. How do you add a new drug or polymer?
**Examiner intent:** Test extensibility.  
**Practice answer:** "A new drug needs a carefully curated profile and a new polymer needs a complete library row with provenance and valid properties. I would rerun validation, recompute PCA and ranking, and never transfer indomethacin's rank directly to the new drug."

### 89. How do you discuss repository history and large files?
**Examiner intent:** Test engineering maturity.  
**Practice answer:** "The defence-relevant point is that active frozen artifacts are versioned and their hashes are recorded. Historical files are clearly separated so they do not overwrite the active scientific baseline."

### 90. Why freeze v1.5.0?
**Examiner intent:** Test research governance.  
**Practice answer:** "Freezing prevents moving targets during prospective validation. It fixes the four-criterion model, data library, weights, and results so experimental outcomes can be compared against a defined prior prediction."

## Module 10. Critical Skepticism and Laboratory Validation

### 91. Why not just use laboratory DoE instead of software?
**Examiner intent:** Test complementarity.  
**Practice answer:** "DoE is essential once a feasible formulation space is defined, but screening every polymer and condition experimentally is resource intensive. This framework prioritises candidates first; DoE then optimises the selected experimental space."

### 92. Why trust HPMC E5 when Soluplus has better affinity scores?
**Examiner intent:** Test balanced ranking logic.  
**Practice answer:** "I do not claim blind trust. The ranking gives HPMC E5 the best balance after PCA and stated AHP weighting because it adds a large glass-transition margin; Soluplus remains the key high-affinity experimental comparator."

### 93. Could HPMC E5 viscosity cause spray-drying problems?
**Examiner intent:** Test process realism.  
**Practice answer:** "Yes, higher solution viscosity can affect atomisation, droplet formation, and nozzle performance. Processability is outside the current four-score ranking and must be checked through feed formulation and spray-dryer trials."

### 94. What if indomethacin degrades during spray drying?
**Examiner intent:** Test thermal-risk awareness.  
**Practice answer:** "The process must be designed around outlet temperature, residence time, solvent choice, and analytical impurity testing. The drug melting point is not a guarantee against degradation, so HPLC or another stability-indicating method is needed."

### 95. How would you confirm a true single-phase ASD?
**Examiner intent:** Test experimental proof.  
**Practice answer:** "I would combine mDSC for glass-transition behaviour, PXRD for absence of crystalline peaks, and supportive spectroscopic or microscopic evidence. One method alone is usually not enough to establish single-phase behaviour confidently."

### 96. What if Soluplus gives better dissolution than HPMC E5?
**Examiner intent:** Test willingness to update.  
**Practice answer:** "That would be a valuable result, not a failure of the project. The model ranks a defined balance of properties; if dissolution or stability data favour Soluplus, I would report the discrepancy, investigate the mechanism, and update the decision model with validation data."

### 97. Can this handle ternary dispersions?
**Examiner intent:** Test scope control.  
**Practice answer:** "The frozen framework is built around binary drug-polymer calculations. A ternary system would require explicit composition, interaction, and model changes, so I would not apply the current ranking unchanged."

### 98. Can it be applied to itraconazole or ritonavir?
**Examiner intent:** Test transferability.  
**Practice answer:** "The architecture can accept another curated drug profile, but the indomethacin ranking cannot be transferred. I would collect drug-specific inputs, revisit the polymer library and AHP preferences, and validate prospectively for that molecule."

### 99. What are the three main limitations?
**Examiner intent:** Test self-critique.  
**Practice answer:** "First, polymer HSPs are group-contribution estimates rather than direct measurements. Second, chi and Gordon-Taylor are simplified models with ideality assumptions. Third, the result is computational and requires solid-state, dissolution, stability, and process validation."

### 100. What is your exact next step?
**Examiner intent:** Test a credible research plan.  
**Practice answer:** "I will prepare 30% indomethacin ASDs starting with HPMC E5 and Soluplus, then compare mDSC, PXRD, dissolution, and humidity-controlled stability. Those measurements will determine whether the frozen computational ranking is prospectively useful and how the next model version should improve."

---

# Chapter 11. Defence Strategy and Communication Playbook

## Recommended presentation narrative

1. Start with patient-relevant formulation problem: poorly soluble drugs may have dissolution-limited performance.
2. Introduce the ASD opportunity and its crystallisation risk.
3. State the screening bottleneck: polymer selection is multi-factorial and laboratory-intensive.
4. Introduce the platform as a transparent pre-formulation prioritisation tool.
5. Explain the four criteria in physical language before showing algorithms.
6. Show PCA, AHP, and TOPSIS as a way to avoid double-counting and state trade-offs.
7. Present HPMC E5 as the top-ranked computational lead and Soluplus as a high-affinity comparator.
8. End with the prospective experimental plan and limitations.

## When an examiner challenges the mathematics

Do not say "the algorithm decided." Say: "The equations convert defined physical assumptions into comparable scores. PCA prevents correlated affinity signals from being counted twice; AHP makes the importance trade-off explicit; TOPSIS rewards closeness to a balanced ideal. The decision is reproducible, but its usefulness still requires experimental testing."

## Phrases to prefer

| Prefer | Avoid |
|---|---|
| Top-ranked computational candidate | Best polymer |
| Model-selection robustness | Probability of successful formulation |
| Predicted mixture glass transition | Measured stability |
| Favourable diagnostic under the model | Proven miscible for all conditions |
| Prospective validation pending | Validated in patients / fully validated |

---

# Chapter 12. Glossary

| Term | Meaning |
|---|---|
| ASD | Amorphous solid dispersion: drug dispersed in a non-crystalline state in a carrier |
| BCS | Biopharmaceutics Classification System |
| HSP | Hansen solubility parameters |
| delta_D,delta_P,delta_H | Dispersion, polar, and hydrogen-bonding HSP components |
| R_a | Hansen distance |
| RED | Relative Energy Difference, R_a/R_0 |
| R_0 | Interaction radius of the drug HSP sphere |
| chi | Flory-Huggins interaction parameter estimate |
| chi_c | Simplified critical interaction diagnostic threshold |
| M_n, M_w | Number-average and weight-average molecular weights |
| T_m | Melting temperature of a crystal |
| T_g | Glass-transition temperature |
| Tg_mix | Predicted glass transition of a drug-polymer mixture |
| H-V-K | Hoftyzer-Van Krevelen group-contribution method |
| PCA | Principal component analysis |
| AHP | Analytic hierarchy process |
| CR | AHP consistency ratio |
| TOPSIS | Ranking by similarity to positive and negative ideal solutions |
| D^+, D^- | Distance to positive and negative TOPSIS ideals |
| C_L | TOPSIS closeness coefficient |
| UQ | Uncertainty quantification |
| P(top-1) | Fraction of simulated rankings in which a candidate is first |
| Morris mu* | Mean absolute elementary effect, a global sensitivity indicator |
| Morris sigma | Variation in elementary effects, suggesting interaction/non-linearity |
| FBM | Failure-boundary mapping |
| mDSC | Modulated differential scanning calorimetry |
| PXRD | Powder X-ray diffraction |
| FTIR | Fourier-transform infrared spectroscopy |
| DoE | Design of experiments |

---

# Chapter 13. Final Study Checklist

- I can give the 30-second pitch without equations.
- I can explain why miscibility and kinetic stability are different.
- I know the active matrix has four criteria and that s_lit is excluded.
- I can calculate and interpret RED, chi, chi_c, and Tg_mix for HPMC E5 and Soluplus.
- I can state why PCA comes before TOPSIS.
- I know the AHP weights are 0.6667 and 0.3333 and why CR = 0 is limited evidence.
- I can state the frozen HPMC E5 ranking: C_L=0.8359, P(top-1)=75.54%.
- I do not call P(top-1) a clinical or manufacturing success probability.
- I can state the actual next laboratory experiments.

## Closing statement to practise

> "PharmaPolySCOPE provides an auditable way to prioritise polymer candidates for indomethacin ASDs. Its main contribution is not claiming that computation replaces formulation science; it makes the first formulation decision more transparent, reproducible, and ready for prospective experimental testing."
