# MODULE 13 — EPISTEMIC BOUNDARY MAP
# Formal Epistemic Classification System & Forbidden-Claim Taxonomy

**Document ID:** `MODULE_13_EPISTEMIC_BOUNDARY_MAP`  
**Module:** Module 13 — Do NOT Say This in Viva (`13_DO_NOT_SAY_THIS_IN_VIVA/`)  
**Phase:** Module 13 Planning Gate (Curriculum Architecture Transition)  
**Authoritative Repositories Inspected:**  
- Production Source: `asd_framework/src/asd_mcda/v2/` (commit `220ba4c`)  
- Master Knowledge Map: `00_MASTER_KNOWLEDGE_MAP/PHARMAPOLYSCOPE_MASTER_KNOWLEDGE_MAP.md`  
- Quantitative Canon: `12_NUMBERS_YOU_MUST_KNOW/MODULE_12_NUMERICAL_DEFENSE_CANON.md`  
**Auditor:** Forensic Computational-Science Architect & PhD Methodology Auditor  
**Date:** September 23, 2026  
**Status:** **AUTHORITATIVE EPISTEMIC CLASSIFICATION & TAXONOMY**  

---

## 1. Six-Tier Epistemic Classification System

To prevent candidates from committing epistemic category errors during viva cross-examination, all scientific statements in PharmaPolySCOPE v2 are mapped to one of six non-overlapping epistemic tiers:

```
+-----------------------------------------------------------------------------------------+
|                        SIX-TIER EPISTEMIC CLASSIFICATION SYSTEM                         |
+--------+---------------------------------------+----------------------------------------+
| Tier   | Designation                           | Epistemic Status & Defense Boundary    |
+--------+---------------------------------------+----------------------------------------+
| TIER-1 | Directly Established by Implementation| Hard-coded constants, code ASTs, exceptions|
| TIER-2 | Established by Numerical Computation  | Exact eigenvalues, closeness scores, counts|
| TIER-3 | Supported as Methodological Diagnostic| Algorithmic indicators (HSP, CR, Morris)|
| TIER-4 | General Scientific Interpretation     | Literature concepts (metastability, Tg)|
| TIER-5 | Experimentally Unvalidated            | Wet-lab solubility, real shelf-life    |
| TIER-6 | Explicitly Outside Model Scope        | In-vivo PK, manufacturing defects, bioeq|
+--------+---------------------------------------+----------------------------------------+
```

### Tier Definitions & Verification Rules

1. **TIER-1: DIRECTLY ESTABLISHED BY IMPLEMENTATION**
   - *Definition:* Facts directly verifiable by inspecting source code syntax, AST nodes, or configuration files.
   - *Examples:* $\tau_{\text{var}} = 0.95$, $\delta_{\text{block}} = 0.03$, $CR_{\text{gate}} = 0.08$, $RI_4 = 0.89$, $\sigma_{\min}^2 = 10^{-8}$, class `AHPConsistencyViolationError`.
   - *Viva Rule:* Candidate may state these with 100% certainty, citing exact file and line numbers.

2. **TIER-2: ESTABLISHED BY NUMERICAL COMPUTATION**
   - *Definition:* Exact outputs produced by executing deterministic or stochastic algorithms on the baseline dataset.
   - *Examples:* Indomethacin $K=3$, $\lambda_1 = 2.090866$, $\delta_3 = 0.738310$, $CR = 0.049415$, Soluplus $C_L = 0.686435$, $N_{\text{valid}} = 8,600$, $N_{\text{blocked}} = 1,400$.
   - *Viva Rule:* Candidate states these as exact computational facts of the executed model, distinguishing float64 machine records from orally reported figures.

3. **TIER-3: SUPPORTED AS METHODOLOGICAL DIAGNOSTIC**
   - *Definition:* Algorithmic metrics providing geometric, consistency, or sensitivity diagnostics within the computational framework.
   - *Examples:* $s_{\text{HSP}}$ indicates geometric proximity in solubility space; AHP $CR < 0.08$ indicates transitivity of subjective judgments; Morris $\mu^*$ screens algorithmic factor influence.
   - *Viva Rule:* Candidate defends these as internal computational diagnostics, explicitly denying that they represent physical laws or causal mechanisms.

4. **TIER-4: GENERAL SCIENTIFIC INTERPRETATION**
   - *Definition:* Established physical chemistry and pharmaceutical science principles derived from peer-reviewed literature.
   - *Examples:* Amorphous solid dispersions are thermodynamically metastable; polymers with high $T_g$ can provide kinetic anti-plasticization; hydrogen bonding enhances miscibility.
   - *Viva Rule:* Candidate cites standard literature (e.g., Hancock & Zografi, Flory, Gordon & Taylor), noting that PharmaPolySCOPE uses proxy models of these principles.

5. **TIER-5: EXPERIMENTALLY UNVALIDATED**
   - *Definition:* Physical phenomena that PharmaPolySCOPE aims to assist in screening, but which have not been experimentally measured in this study.
   - *Examples:* Physical room-temperature crystallization shelf-life; dissolution rate enhancement in biorelevant media; true ternary phase diagrams.
   - *Viva Rule:* Candidate must explicitly concede that experimental validation is pending (Class B validation status) and that computational ranking cannot guarantee physical formulation stability.

6. **TIER-6: EXPLICITLY OUTSIDE MODEL SCOPE**
   - *Definition:* Downstream pharmaceutical engineering and clinical phenomena completely outside the mathematical formulation.
   - *Examples:* Hot-melt extrusion screw torque; tableting compressibility; in-vivo bioavailability and PK/PD; polymer batch-to-batch molecular weight polydispersity.
   - *Viva Rule:* Candidate immediately and firmly demarcates these as outside model scope, preventing examiners from drawing them into indefensible territory.

---

## 2. Forbidden-Claim Taxonomy Across Seven Domains

```
+----------------------------------------------------+----------------------------------------------------+
| FORBIDDEN VIVA ASSERTION (FATAL OVERCLAIM)         | SCIENTIFICALLY DEFENSIBLE REPLACEMENT (APPROVED)   |
+----------------------------------------------------+----------------------------------------------------+
| DOMAIN 1: POLYMER RANKING & SUPERIORITY                                                                 |
+----------------------------------------------------+----------------------------------------------------+
| "Soluplus is the proven best polymer for Indo"     | "Soluplus is the top-ranked computational candidate|
|                                                    | under the SP-PRP-TOPSIS framework with specified   |
|                                                    | multi-criteria preference weights."                |
| "The algorithm guarantees a stable formulation"    | "The framework computes relative compatibility and |
|                                                    | glass-transition proxy indicators for screening."  |
| "High TOPSIS C_L proves formulation performance"   | "C_L represents relative geometric closeness to the|
|                                                    | rebaselined ideal point in the 3D PCA subspace."   |
+----------------------------------------------------+----------------------------------------------------+
| DOMAIN 2: THERMODYNAMICS & MISCIBILITY                                                                  |
+----------------------------------------------------+----------------------------------------------------+
| "HSP distance proves drug-polymer miscibility"     | "s_HSP provides a geometric compatibility          |
|                                                    | diagnostic; thermodynamic miscibility requires     |
|                                                    | experimental confirmation."                        |
| "Flory-Huggins chi proves negative Delta-G_mix"    | "s_chi provides a lattice-theoretic interaction    |
|                                                    | score based on group-contribution approximations." |
| "AHP weights show 73% thermodynamic contribution"  | "AHP weights allocate 0.4077 to HSP and 0.3244 to  |
|                                                    | chi as decision-theoretic preference weights."     |
+----------------------------------------------------+----------------------------------------------------+
| DOMAIN 3: KINETIC & GLASS STABILITY                                                                     |
+----------------------------------------------------+----------------------------------------------------+
| "The model predicts shelf-life at 25°C/60% RH"     | "The model does not model nucleation or crystal    |
|                                                    | growth kinetics; shelf-life requires lab trials."  |
| "Gordon-Taylor score proves anti-plasticization"   | "s_GT reflects the theoretical mixture T_g margin  |
|                                                    | calculated under free-volume additivity."          |
+----------------------------------------------------+----------------------------------------------------+
| DOMAIN 4: DIMENSIONALITY REDUCTION & PCA                                                                |
+----------------------------------------------------+----------------------------------------------------+
| "We clustered the polymers using K-Means"          | "K=3 is the retained subspace dimension dynamically|
|                                                    | chosen by PCA using a 95% variance criterion."     |
| "We eliminated criterion 4 because it was useless"| "All 4 criteria are preserved; PCA rotates into an |
|                                                    | orthogonal 3D subspace where all 4 contribute."    |
| "The boundary eigengap proves PCA is true"         | "delta_K >= 0.10 diagnoses spectral stability of   |
|                                                    | the subspace against random matrix perturbations." |
+----------------------------------------------------+----------------------------------------------------+
| DOMAIN 5: DECISION-THEORETIC AGGREGATION & AHP                                                          |
+----------------------------------------------------+----------------------------------------------------+
| "AHP weights are physically calibrated"            | "AHP weights represent prioritized decision-maker  |
|                                                    | trade-offs across normalized computational scales."|
| "AHP Consistency Ratio CR < 0.08 proves accuracy"  | "CR < 0.08 confirms mathematical transitivity in   |
|                                                    | pairwise judgments, not empirical accuracy."       |
+----------------------------------------------------+----------------------------------------------------+
| DOMAIN 6: STOCHASTIC UNCERTAINTY & MORRIS SENSITIVITY                                                   |
+----------------------------------------------------+----------------------------------------------------+
| "55.51% Monte Carlo means 55.51% success chance"   | "Soluplus ranked top-1 in 55.51% of valid computational|
|                                                    | replicates under defined input perturbation noise."|
| "14% of Monte Carlo runs failed"                   | "1,400 of 10,000 generated replicates were blocked |
|                                                    | by governance tripwires (1,396 CR + 4 eigengap)."  |
| "Morris mu* proves that descriptors cause ranking" | "mu* screens computational sensitivity of the      |
|                                                    | ranking algorithm, not physical causal mechanisms."|
+----------------------------------------------------+----------------------------------------------------+
| DOMAIN 7: CHEMISTRY GOVERNANCE & ARCHITECTURE                                                           |
+----------------------------------------------------+----------------------------------------------------+
| "DRG-0002 failed because density was 1.781 g/cm3"  | "DRG-0002 was quarantined by chemistry governance |
|                                                    | due to an identity mismatch (Fenofibrate vs Indo)."|
| "The 6 failing v1.5 tests prove the software broke"| "Those tests preserve legacy v1.5 fixed-K contracts|
|                                                    | and confirm v1.5 isolation from the v2 engine."    |
| "Float64 guarantees bitwise reproducibility"       | "Float64 values retain computational auditability; |
|                                                    | viva values are reported to significant digits."   |
+----------------------------------------------------+----------------------------------------------------+
```

---

## 3. Approved vs. Prohibited Epistemic Lexicon

```
+------------------------------------+------------------------------------+
| PROHIBITED TERMS (FATAL IN VIVA)   | APPROVED TERMS (DEFENSIBLE IN VIVA)|
+------------------------------------+------------------------------------+
| Predicts                           | Ranks / Evaluates                  |
| Proves                             | Diagnoses / Indicates              |
| Guarantees                         | Screens / Prioritizes              |
| Optimal / Best                     | Top-ranked candidate               |
| Chance of success / Probability    | Computational top-1 frequency      |
| Physical mechanism                 | Multi-criteria proxy indicator     |
| Causal effect                      | Sensitivity factor / Screening     |
| Simulation failure                 | Governance-blocked replicate       |
| K-Means clusters                   | Principal component subspace (K)   |
| Discarded criterion                | Dimensionally reduced coordinate   |
| Crystalline density anomaly        | Chemical identity validation trip  |
| Bitwise cross-platform identity    | Computational auditability         |
+------------------------------------+------------------------------------+
```
