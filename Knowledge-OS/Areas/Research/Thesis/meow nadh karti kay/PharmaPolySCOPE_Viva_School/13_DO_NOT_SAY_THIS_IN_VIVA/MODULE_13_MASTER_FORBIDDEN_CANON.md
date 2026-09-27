# MODULE 13 — MASTER FORBIDDEN CANON
# Master Taxonomy of Forbidden Assertions, Fatal Methodological Flaws, and Defensible Oral Alternatives

**Document ID:** `MODULE_13_MASTER_FORBIDDEN_CANON`  
**Module:** Module 13 — Do NOT Say This in Viva (`13_DO_NOT_SAY_THIS_IN_VIVA/`)  
**Phase:** Module 13 Execution (Negative-Space Viva Defense Doctrine)  
**Authoritative Curriculum Anchor:** Part 13 of `00_MASTER_KNOWLEDGE_MAP/PHARMAPOLYSCOPE_MASTER_KNOWLEDGE_MAP.md`  
**Auditor:** Forensic Computational-Science Architect & PhD Methodology Auditor  
**Date:** September 24, 2026  
**Status:** **AUTHORITATIVE DEFENSE CANON (SEALED)**  

---

## 1. Executive Summary & Defense Doctrine

In a doctoral viva examination, candidates are rarely failed for what they *calculate*; they are failed for what they *claim*. In computational pharmaceutics, the barrier between mathematical success and academic dismissal lies entirely in **epistemic demarcation**—the rigorous ability to distinguish what the algorithm computes from what physical nature does.

This document establishes the **Master Forbidden Canon** of PharmaPolySCOPE v2. It catalogs 36 high-risk assertions partitioned across seven operational domains. For every assertion, this canon details:
1. The forbidden verbal statement.
2. Why an examiner will challenge it.
3. The exact scientific or implementation problem.
4. The approved, scientifically defensible replacement response.
5. Code and artifact provenance.
6. Epistemic tier (Tiers 1–6).
7. Defect severity level (`P0_FATAL_OVERCLAIM`, `P1_MAJOR_EPISTEMIC_SLIP`, `P2_METHODOLOGICAL_BLUNDER`).
8. Related curriculum modules.
9. Required numerical anchors from Module 12 (`NUM-001`–`NUM-090`).
10. Follow-up examiner trap questions and defensible follow-up answers.

---

## 2. Contextual Disqualification Principle

> [!IMPORTANT]
> **THE CONTEXTUAL DISQUALIFICATION PRINCIPLE:**  
> A scientific statement is rarely "forbidden" in the abstract. Concepts such as the Flory-Huggins lattice theory, Gordon-Taylor free-volume additivity, and principal component analysis are legitimate physical and mathematical principles established in literature.  
> 
> A statement becomes **strictly forbidden** only when a candidate:
> 1. Attributes empirical physical certainty to a computational proxy model.
> 2. Claims that PharmaPolySCOPE *directly computes, proves, or predicts* a physical phenomenon that lies outside its mathematical formulation.
> 3. Conflates decision-maker preference weights with thermodynamic energy shares.
> 4. Treats stochastic perturbation frequencies as clinical success probabilities.

---

## 3. Domain 1: Polymer Ranking & Candidate Superiority

### FC-01: The "Proven Best Polymer" Superlative
- **Forbidden Statement:** *"Soluplus is the proven best polymer for Indomethacin."*
- **Why Examiner Challenges It:** The word "best" is scientifically undefined without an explicit multi-attribute objective function, economic cost model, manufacturability criteria, and in-vivo pharmacokinetic data.
- **Exact Problem:** Soluplus achieved rank 1 ($C_L = 0.686435$) under a specific 4-criterion weighting model in an in-silico cohort. It has not been clinically proven superior.
- **Correct Replacement:** *"Soluplus is the top-ranked computational candidate for Indomethacin under the SP-PRP-TOPSIS framework with the configured preference weights and 3D PCA subspace."*
- **Evidence Source:** `scientific_validation_results.json` -> `rankings[0]`; `src/asd_mcda/v2/topsis.py:115`
- **Epistemic Tier:** `TIER-2: ESTABLISHED_BY_NUMERICAL_COMPUTATION`
- **Severity:** `P0_FATAL_OVERCLAIM`
- **Related Module:** Module 01 (`01_PHARMACEUTICAL_FOUNDATIONS`), Module 05 (`05_DECISION_SCIENCE`), Module 12
- **Numerical Evidence Required:** Yes (`NUM-071`: Soluplus $C_L = 0.686435$, `NUM-076`: $p_{\text{top1}} = 55.51\%$)
- **Follow-Up Examiner Question:** *"What if an experimental dissolution test shows HPMC E5 releases drug faster?"*
- **Defensible Follow-Up Answer:** *"That would be entirely compatible with our model. SP-PRP-TOPSIS ranks candidates across multi-criteria proxy scores; it does not simulate dissolution hydrodynamics or precipitation inhibition in biorelevant media."*

### FC-02: The Physical Stability Guarantee
- **Forbidden Statement:** *"The algorithm guarantees that the selected polymer will form a stable amorphous solid dispersion."*
- **Why Examiner Challenges It:** Solid-state stability depends on nucleation kinetics, environmental humidity, thermal history, and mechanical stress—none of which are solved by an algebraic ranking tool.
- **Exact Problem:** PharmaPolySCOPE is a screening tool based on proxy indicators ($s_{\text{HSP}}, s_\chi, s_{\text{desc}}, s_{\text{GT}}$), not a kinetic nucleation solver.
- **Correct Replacement:** *"The framework computes relative thermodynamic and glass-transition proxy indicators to prioritize candidates for experimental screening; it provides no physical stability guarantee."*
- **Evidence Source:** `src/asd_mcda/v2/engine.py:45-120`; `08_VALIDATION_REPRODUCIBILITY/07_VALIDATION_FAILURES_AND_LIMITATIONS.md`
- **Epistemic Tier:** `TIER-5: EXPERIMENTALLY_UNVALIDATED`
- **Severity:** `P0_FATAL_OVERCLAIM`
- **Related Module:** Module 01, Module 08
- **Numerical Evidence Required:** No
- **Follow-Up Examiner Question:** *"Then what value does your framework provide to a formulator?"*
- **Defensible Follow-Up Answer:** *"It rationalizes candidate selection from dozens of polymers down to high-probability screening cohorts, eliminating unpromising candidates based on thermodynamic and kinetic incompatibility proxies before capital-intensive wet-lab trials."*

### FC-03: The Closeness Score as Performance Metric
- **Forbidden Statement:** *"A high TOPSIS closeness score $C_L$ proves superior in-vitro formulation performance."*
- **Why Examiner Challenges It:** $C_L$ is a normalized geometric distance ratio in a rotated mathematical coordinate space, not a release rate, bioavailability percentage, or physical shelf-life.
- **Exact Problem:** Conflates normalized decision space Euclidean distance with physical drug release kinetics.
- **Correct Replacement:** *"The closeness score $C_L$ represents relative geometric proximity to the cohort-rebaselined ideal solution in the metric-tensor-weighted PCA subspace."*
- **Evidence Source:** `src/asd_mcda/v2/topsis.py:102`; `MODULE_12_DERIVATION_BOOK.md:Derivation-5`
- **Epistemic Tier:** `TIER-2: ESTABLISHED_BY_NUMERICAL_COMPUTATION`
- **Severity:** `P1_MAJOR_EPISTEMIC_SLIP`
- **Related Module:** Module 05, Module 12
- **Numerical Evidence Required:** Yes (`NUM-071` to `NUM-075`: $C_L$ values for all 5 polymers)
- **Follow-Up Examiner Question:** *"Why is Soluplus $C_L = 0.6864$ only slightly higher than HPMC E5 $C_L = 0.6731$?"*
- **Defensible Follow-Up Answer:** *"Because both polymers exhibit strong multi-criteria compatibility profiles; Soluplus gains a slight advantage in descriptor proximity and $T_g$ margin, but their close scores indicate they are competitive candidates requiring empirical discrimination."*

### FC-04: The Dissolution Parity Claim
- **Forbidden Statement:** *"Our computational ranking will directly match experimental dissolution rate ranking."*
- **Why Examiner Challenges It:** Dissolution involves wetting, hydrodynamic boundary layers, polymer swelling, and gel-layer diffusion—mechanisms absent from the 4 compatibility criteria.
- **Exact Problem:** Extrapolates solid-state miscibility proxies into fluid-phase mass transfer kinetics.
- **Correct Replacement:** *"The computational ranking prioritizes thermodynamic miscibility and kinetic anti-plasticization proxies; dissolution kinetics depend on secondary phenomena such as polymer dissolution rates and gel-layer formation that require empirical evaluation."*
- **Evidence Source:** `01_PHARMACEUTICAL_FOUNDATIONS/ASD_SCIENCE.md:Section-4`
- **Epistemic Tier:** `TIER-6: EXPLICITLY_OUTSIDE_MODEL_SCOPE`
- **Severity:** `P1_MAJOR_EPISTEMIC_SLIP`
- **Related Module:** Module 01, Module 08
- **Numerical Evidence Required:** No
- **Follow-Up Examiner Question:** *"Could a lower-ranked polymer have better dissolution?"*
- **Defensible Follow-Up Answer:** *"Yes, if that polymer possesses superior surfactant properties or rapid wettability that overcome a slightly less favorable thermodynamic interaction score."*

### FC-05: The "Completely Incompatible" Condemnation
- **Forbidden Statement:** *"Polymers ranked 4 and 5 (PVP K30 and Eudragit E PO) are completely incompatible with Indomethacin."*
- **Why Examiner Challenges It:** PVP K30 and Eudragit E PO have documented experimental literature forming amorphous dispersions with Indomethacin under specific processing conditions.
- **Exact Problem:** Interprets relative multi-criteria ranking as an absolute binary threshold of physical incompatibility.
- **Correct Replacement:** *"PVP K30 and Eudragit E PO rank lower in relative multi-criteria alignment under this specific weighting model, primarily due to lower Gordon-Taylor margin ($s_{\text{GT}}$) or Flory-Huggins interaction ($s_\chi$), but they remain viable candidates under alternative formulation strategies."*
- **Evidence Source:** `10_REVERSE_ENGINEERING/02_INDOMETHACIN_FULL_NUMERICAL_TRACE.md:Stage-15`
- **Epistemic Tier:** `TIER-3: SUPPORTED_AS_METHODOLOGICAL_DIAGNOSTIC`
- **Severity:** `P2_METHODOLOGICAL_BLUNDER`
- **Related Module:** Module 01, Module 10
- **Numerical Evidence Required:** Yes (`NUM-074`: PVP K30 $C_L = 0.587584$, `NUM-075`: Eudragit $C_L = 0.545616$)
- **Follow-Up Examiner Question:** *"Why does Eudragit E PO achieve Rank 1 for Ibuprofen but Rank 5 for Indomethacin?"*
- **Defensible Follow-Up Answer:** *"Because Ibuprofen's smaller molar volume ($V_m = 199.3\text{ cm}^3\text{/mol}$) and specific chemical profile yield a much stronger interaction score with Eudragit's tertiary amine groups, shifting the raw compatibility matrix."*

---

## 4. Domain 2: Thermodynamic & Miscibility Defense Canon

### FC-06: The HSP Miscibility Proof
- **Forbidden Statement:** *"A small Hansen solubility parameter distance proves thermodynamic drug-polymer miscibility."*
- **Why Examiner Challenges It:** HSP is an empirical, geometric approximation based on cohesive energy densities. True thermodynamic miscibility requires $\Delta G_{\text{mix}} = \Delta H_{\text{mix}} - T \Delta S_{\text{mix}} < 0$ and $\frac{\partial^2 \Delta G_{\text{mix}}}{\partial \phi^2} > 0$.
- **Exact Problem:** Equates geometric distance in 3D solubility parameter space with second derivatives of free energy of mixing.
- **Correct Replacement:** *"A small Hansen solubility parameter distance provides a geometric compatibility diagnostic suggesting favorable dispersion cohesive energy matching, but thermodynamic miscibility requires experimental thermal or spectroscopic confirmation."*
- **Evidence Source:** `src/asd_mcda/compatibility/hsp_model.py`; `03_COMPATIBILITY_CRITERIA/HSP_THEORY.md`
- **Epistemic Tier:** `TIER-3: SUPPORTED_AS_METHODOLOGICAL_DIAGNOSTIC`
- **Severity:** `P0_FATAL_OVERCLAIM`
- **Related Module:** Module 03 (`03_COMPATIBILITY_CRITERIA`), Module 04
- **Numerical Evidence Required:** Yes (`NUM-013` to `NUM-015`: Indomethacin HSP $\delta_D=19.2, \delta_P=7.9, \delta_H=8.4\text{ MPa}^{1/2}$)
- **Follow-Up Examiner Question:** *"What are the known failure modes of Hansen solubility parameters?"*
- **Defensible Follow-Up Answer:** *"HSP assumes isotropic dispersion forces and does not account for specific spatial donor-acceptor stoichiometry, steric hindrance around polar groups, or temperature-dependent entropic changes."*

### FC-07: The Flory-Huggins Free Energy Claim
- **Forbidden Statement:** *"Our Flory-Huggins $\chi$ parameter calculation proves negative Gibbs free energy of mixing."*
- **Why Examiner Challenges It:** The implemented $\chi$ is calculated via group contribution / solubility parameter approximation at a single reference temperature; it does not calculate the combinatorial entropy or composition-dependent free energy curve.
- **Exact Problem:** Claims free energy proof without calculating the full composition-dependent Flory-Huggins free energy equation: $\frac{\Delta G_{\text{mix}}}{RT} = \phi_{\text{drug}} \ln \phi_{\text{drug}} + \frac{\phi_{\text{poly}}}{m} \ln \phi_{\text{poly}} + \chi \phi_{\text{drug}} \phi_{\text{poly}}$.
- **Correct Replacement:** *"The Flory-Huggins $\chi$ parameter score ($s_\chi$) serves as a normalized interaction diagnostic evaluating relative enthalpic interaction favorability based on group contributions."*
- **Evidence Source:** `src/asd_mcda/compatibility/flory_huggins.py:35-80`
- **Epistemic Tier:** `TIER-3: SUPPORTED_AS_METHODOLOGICAL_DIAGNOSTIC`
- **Severity:** `P0_FATAL_OVERCLAIM`
- **Related Module:** Module 03, Module 04
- **Numerical Evidence Required:** Yes (`NUM-027` to `NUM-031`: raw $s_\chi$ column values)
- **Follow-Up Examiner Question:** *"What is the critical $\chi$ value for miscibility in a polymeric system?"*
- **Defensible Follow-Up Answer:** *"For high molecular weight polymers where degree of polymerization $m \to \infty$, the critical interaction parameter is approximately $\chi_{\text{crit}} \approx \frac{1}{2}(1 + 1/\sqrt{m})^2 \approx 0.5$. Values of $\chi < 0.5$ generally indicate favorable thermodynamic interaction."*

### FC-08: Molecular Interaction Energy Claim
- **Forbidden Statement:** *"PharmaPolySCOPE computes real-world molecular interaction energies between drug and polymer."*
- **Why Examiner Challenges It:** Real interaction energies require quantum mechanical DFT calculations or molecular dynamics simulations. The software uses empirical 2D descriptor formulas and group contributions.
- **Exact Problem:** Confuses empirical 2D topological descriptor matching with ab-initio quantum chemistry.
- **Correct Replacement:** *"The framework computes empirical proxy indicators based on 2D topological descriptors, group contributions, and solubility parameters; it does not perform atomistic molecular mechanics or quantum chemical energy calculations."*
- **Evidence Source:** `src/asd_mcda/v2/chemistry.py:80-140`; `src/asd_mcda/compatibility/matrix.py`
- **Epistemic Tier:** `TIER-6: EXPLICITLY_OUTSIDE_MODEL_SCOPE`
- **Severity:** `P1_MAJOR_EPISTEMIC_SLIP`
- **Related Module:** Module 02 (`02_CHEMICAL_INFORMATICS`), Module 03
- **Numerical Evidence Required:** No
- **Follow-Up Examiner Question:** *"How are the molecular descriptors calculated?"*
- **Defensible Follow-Up Answer:** *"They are calculated deterministically via RDKit from the canonical SMILES string, extracting molecular weight, LogP, topological polar surface area (TPSA), hydrogen bond donors (HBD), and acceptors (HBA)."*

### FC-09: Permanent Anti-Phase Separation Claim
- **Forbidden Statement:** *"A low HSP distance means the formulation will never phase-separate."*
- **Why Examiner Challenges It:** Amorphous solid dispersions are thermodynamically metastable systems. Given sufficient thermal energy, moisture, or time, phase separation can occur regardless of initial HSP distance.
- **Exact Problem:** Confuses kinetic stabilization with absolute thermodynamic equilibrium.
- **Correct Replacement:** *"A low HSP distance indicates favorable cohesive energy density matching, which reduces the thermodynamic driving force for phase separation, but physical metastability means phase separation remains possible under adverse environmental conditions."*
- **Evidence Source:** `01_PHARMACEUTICAL_FOUNDATIONS/ASD_SCIENCE.md:Section-2`
- **Epistemic Tier:** `TIER-4: GENERAL_SCIENTIFIC_INTERPRETATION`
- **Severity:** `P1_MAJOR_EPISTEMIC_SLIP`
- **Related Module:** Module 01, Module 03
- **Numerical Evidence Required:** No
- **Follow-Up Examiner Question:** *"What environmental factor most aggressively accelerates phase separation?"*
- **Defensible Follow-Up Answer:** *"Moisture absorption. Water acts as a potent plasticizer, dramatically depressing the mixture $T_g$ and increasing molecular mobility, which accelerates phase separation and nucleation."*

### FC-10: Directional H-Bond Network Proof
- **Forbidden Statement:** *"Our model proves that specific directional hydrogen bonds form between Indomethacin's carboxyl group and Soluplus."*
- **Why Examiner Challenges It:** 2D topological descriptor proximity ($s_{\text{desc}}$) only counts donor/acceptor counts; it has zero 3D spatial conformation or spectroscopic orientation information.
- **Exact Problem:** Infers 3D directional hydrogen-bonding geometry from 2D integer counts (HBD=1, HBA=3).
- **Correct Replacement:** *"The molecular descriptor criterion $s_{\text{desc}}$ evaluates stoichiometric complementarity between hydrogen bond donor and acceptor counts; confirmation of specific directional hydrogen bonding requires experimental FTIR or solid-state NMR spectroscopy."*
- **Evidence Source:** `src/asd_mcda/compatibility/matrix.py:65-90`
- **Epistemic Tier:** `TIER-3: SUPPORTED_AS_METHODOLOGICAL_DIAGNOSTIC`
- **Severity:** `P1_MAJOR_EPISTEMIC_SLIP`
- **Related Module:** Module 02, Module 03
- **Numerical Evidence Required:** Yes (`NUM-004`: HBD=1, `NUM-005`: HBA=3)
- **Follow-Up Examiner Question:** *"Which functional groups in Indomethacin act as donors and acceptors?"*
- **Defensible Follow-Up Answer:** *"The carboxylic acid hydroxyl group acts as the sole donor (HBD=1), while the indole carbonyl oxygen, amide carbonyl oxygen, and methoxy oxygen act as acceptors (HBA=3)."*

### FC-11: Group Contribution Exactness
- **Forbidden Statement:** *"Group contribution methods yield exact thermodynamic values for complex polymers."*
- **Why Examiner Challenges It:** Group contribution methods assume additivity of isolated molecular fragments, ignoring polymer tertiary folding, steric shielding, and sequence-dependent interactions.
- **Exact Problem:** Treats semi-empirical additive approximations as exact physical values.
- **Correct Replacement:** *"Group contribution methods provide useful semi-empirical approximations of partial solubility parameters and molar volumes, but they carry documented uncertainties of $\pm 10\text{--}15\%$ compared to experimental calorimetric measurements."*
- **Evidence Source:** `03_COMPATIBILITY_CRITERIA/HSP_THEORY.md:Section-5`
- **Epistemic Tier:** `TIER-4: GENERAL_SCIENTIFIC_INTERPRETATION`
- **Severity:** `P2_METHODOLOGICAL_BLUNDER`
- **Related Module:** Module 03
- **Numerical Evidence Required:** No
- **Follow-Up Examiner Question:** *"How does PharmaPolySCOPE account for this group contribution uncertainty?"*
- **Defensible Follow-Up Answer:** *"Through our Monte Carlo uncertainty engine, which perturbs compatibility scores by $\sigma_{\text{score}} = 0.05$ across 10,000 replicates to evaluate whether ranking stability is robust to group contribution estimation errors."*

---

## 5. Domain 3: Kinetic & Glass Stability Defense Canon

### FC-12: The Two-Year Shelf-Life Prediction
- **Forbidden Statement:** *"PharmaPolySCOPE predicts that the Indomethacin-Soluplus formulation will have a shelf-life of at least two years at 25°C/60% RH."*
- **Why Examiner Challenges It:** Real shelf-life testing requires Arrhenius kinetic modeling of crystallization rates, moisture vapor transmission rates of packaging, and empirical stability testing in ICH stability chambers.
- **Exact Problem:** Claims temporal shelf-life prediction from a timeless algebraic decision model that lacks kinetic rate equations.
- **Correct Replacement:** *"The framework does not model crystallization kinetics or moisture ingress over time; shelf-life prediction requires empirical accelerated stability testing under ICH guidelines."*
- **Evidence Source:** `08_VALIDATION_REPRODUCIBILITY/07_VALIDATION_FAILURES_AND_LIMITATIONS.md`
- **Epistemic Tier:** `TIER-5: EXPERIMENTALLY_UNVALIDATED`
- **Severity:** `P0_FATAL_OVERCLAIM`
- **Related Module:** Module 01, Module 08
- **Numerical Evidence Required:** No
- **Follow-Up Examiner Question:** *"What kinetic parameters would you need to predict shelf-life?"*
- **Defensible Follow-Up Answer:** *"We would need experimental crystallization induction times, nucleation rate constants, crystal growth rates as a function of temperature via Avrami or Johnson-Mehl-Avrami-Kolmogorov (JMAK) kinetics, and moisture sorption isotherms."*

### FC-13: Gordon-Taylor Score as Anti-Crystallization Proof
- **Forbidden Statement:** *"The Gordon-Taylor score proves that the polymer will prevent drug crystallization."*
- **Why Examiner Challenges It:** High $T_g$ provides kinetic slowing of molecular mobility ($T - T_g$ rule), but crystallization can still occur from the glassy state via Johari-Goldstein secondary relaxations ($\beta$-relaxations).
- **Exact Problem:** Assumes glass transition elevation completely eliminates nucleation risk.
- **Correct Replacement:** *"The Gordon-Taylor score $s_{\text{GT}}$ evaluates the theoretical elevation of the mixture glass transition temperature above storage temperature, providing an indicator of kinetic mobility reduction under free-volume additivity assumptions."*
- **Evidence Source:** `src/asd_mcda/compatibility/gordon_taylor.py:30-75`
- **Epistemic Tier:** `TIER-3: SUPPORTED_AS_METHODOLOGICAL_DIAGNOSTIC`
- **Severity:** `P1_MAJOR_EPISTEMIC_SLIP`
- **Related Module:** Module 01, Module 03
- **Numerical Evidence Required:** Yes (`NUM-011`: Indomethacin $T_g = 315.15\text{ K}$, `NUM-037` to `NUM-041`: $s_{\text{GT}}$ values)
- **Follow-Up Examiner Question:** *"What is the $T - T_g < -50\text{ K}$ rule of thumb?"*
- **Defensible Follow-Up Answer:** *"Hancock and Zografi established that molecular mobility is substantially reduced when storage temperature is at least 50 K below the system $T_g$, drastically slowing crystallization kinetics, though not guaranteeing absolute stability."*

### FC-14: Guaranteed Single-Phase Glass
- **Forbidden Statement:** *"The calculated Gordon-Taylor $T_g$ guarantees that the formulation will form a single homogeneous glass."*
- **Why Examiner Challenges It:** Gordon-Taylor equation assumes an ideal single-phase mixture. If the drug and polymer are immiscible, two distinct glass transitions will form experimentally.
- **Exact Problem:** Uses an equation that *assumes* single-phase behavior to *prove* single-phase behavior (circular reasoning).
- **Correct Replacement:** *"The Gordon-Taylor equation models the theoretical $T_g$ of an assumed single-phase amorphous mixture; observing a single experimental $T_g$ via differential scanning calorimetry (DSC) is required to confirm actual single-phase homogeneity."*
- **Evidence Source:** `01_PHARMACEUTICAL_FOUNDATIONS/ASD_SCIENCE.md:Section-3`
- **Epistemic Tier:** `TIER-4: GENERAL_SCIENTIFIC_INTERPRETATION`
- **Severity:** `P1_MAJOR_EPISTEMIC_SLIP`
- **Related Module:** Module 01, Module 03
- **Numerical Evidence Required:** No
- **Follow-Up Examiner Question:** *"What happens if DSC shows two $T_g$ peaks?"*
- **Defensible Follow-Up Answer:** *"Two distinct $T_g$ peaks indicate phase separation into a drug-rich phase and a polymer-rich phase, representing a formulation failure that invalidates the Gordon-Taylor single-phase assumption."*

### FC-15: Moisture Absorption Modeling Claim
- **Forbidden Statement:** *"Our model explicitly simulates the impact of relative humidity on the amorphous solid dispersion."*
- **Why Examiner Challenges It:** PharmaPolySCOPE has no relative humidity inputs, water sorption isotherms, or ternary drug-polymer-water thermodynamic models.
- **Exact Problem:** Claims environmental moisture simulation when the codebase operates strictly on binary dry-state formulations.
- **Correct Replacement:** *"The active v2 framework models binary drug-polymer formulations under dry-state assumptions; moisture absorption kinetics and ternary hygroscopicity modeling are explicitly outside the current implementation scope."*
- **Evidence Source:** `src/asd_mcda/v2/engine.py:30-60`
- **Epistemic Tier:** `TIER-6: EXPLICITLY_OUTSIDE_MODEL_SCOPE`
- **Severity:** `P1_MAJOR_EPISTEMIC_SLIP`
- **Related Module:** Module 01, Module 07
- **Numerical Evidence Required:** No
- **Follow-Up Examiner Question:** *"How would water alter the Gordon-Taylor calculation?"*
- **Defensible Follow-Up Answer:** *"Water has a very low $T_g$ ($\approx 136\text{ K}$) and acts as a severe plasticizer. Including water requires extending Gordon-Taylor to a ternary Couchman-Karasz or Gordon-Taylor formulation, which would sharply depress the predicted mixture $T_g$."*

### FC-16: Classical Nucleation Theory Modeling Claim
- **Forbidden Statement:** *"PharmaPolySCOPE uses classical nucleation theory to model crystal growth rates."*
- **Why Examiner Challenges It:** Classical nucleation theory requires surface free energy, activation energy of diffusion, and critical nucleus radius calculations, none of which exist in the repository.
- **Exact Problem:** Confuses static multi-criteria ranking with dynamic nucleation theory.
- **Correct Replacement:** *"The framework does not implement classical nucleation theory or calculate nucleation barriers; it relies on empirical static proxy scores ($s_{\text{GT}}$ and $s_{\text{HSP}}$)."*
- **Evidence Source:** `src/asd_mcda/compatibility/matrix.py`
- **Epistemic Tier:** `TIER-6: EXPLICITLY_OUTSIDE_MODEL_SCOPE`
- **Severity:** `P2_METHODOLOGICAL_BLUNDER`
- **Related Module:** Module 01, Module 04
- **Numerical Evidence Required:** No
- **Follow-Up Examiner Question:** *"What is the difference between thermodynamic miscibility and kinetic stability?"*
- **Defensible Follow-Up Answer:** *"Thermodynamic miscibility means the drug and polymer form a true single-phase solution with negative free energy of mixing. Kinetic stability means that although the system is thermodynamically supersaturated, molecular mobility is so low that phase separation and crystallization are arrested on a practical human timescale."*

---

## 6. Domain 4: Dimensionality Reduction & PCA Governance Canon

### FC-17: The K-Means Clustering Conflation
- **Forbidden Statement:** *"We clustered the polymers into groups using the K-Means algorithm."*
- **Why Examiner Challenges It:** Conflating PCA dimensionality reduction with K-Means unsupervised clustering reveals fundamental mathematical ignorance of linear algebra and machine learning.
- **Exact Problem:** Confuses spectral projection onto $K$ orthogonal eigenvectors ($V_K$) with iterative centroid partitioning of sample points in $k$-means.
- **Correct Replacement:** *"We do not use K-Means clustering. $K=3$ represents the number of principal components dynamically retained in our PCA orthogonalization to capture $\ge 95\%$ of cohort variance."*
- **Evidence Source:** `src/asd_mcda/v2/pca.py:45-80`; `MODULE_12_DERIVATION_BOOK.md:Derivation-1`
- **Epistemic Tier:** `TIER-1: DIRECTLY_ESTABLISHED_BY_IMPLEMENTATION`
- **Severity:** `P0_FATAL_OVERCLAIM`
- **Related Module:** Module 04 (`04_MATHEMATICS`), Module 12
- **Numerical Evidence Required:** Yes (`NUM-057`: $K=3$, `NUM-056`: $\text{cum\_var} = 99.9634\%$)
- **Follow-Up Examiner Question:** *"What algorithm performs the spectral decomposition?"*
- **Defensible Follow-Up Answer:** *"We use `scipy.linalg.eigh` to perform exact spectral decomposition of the real symmetric sample correlation matrix $R = \frac{1}{m} Z^T Z$, sorting eigenvalues in descending order with automated sign canonicalization."*

### FC-18: The "Eliminated Criterion" Fallacy
- **Forbidden Statement:** *"We eliminated criterion 4 because it was unimportant."*
- **Why Examiner Challenges It:** PCA does not discard criteria; it projects all four original criteria onto orthogonal linear combinations (eigenvectors). Criterion 4 contributes to all retained principal components.
- **Exact Problem:** Confuses feature selection (dropping columns) with feature extraction / orthogonal rotation (PCA).
- **Correct Replacement:** *"No criterion was eliminated. All four physical criteria are preserved in the four-criterion freeze baseline; PCA rotates the data into an orthogonal 3D subspace where all four criteria contribute through their eigenvector coefficients."*
- **Evidence Source:** `src/asd_mcda/v2/pca.py:65-90`; `11_COUNTERFACTUAL_LAB/WHAT_IF_EXPERIMENTS.md:CF-04`
- **Epistemic Tier:** `TIER-1: DIRECTLY_ESTABLISHED_BY_IMPLEMENTATION`
- **Severity:** `P1_MAJOR_EPISTEMIC_SLIP`
- **Related Module:** Module 04, Module 11
- **Numerical Evidence Required:** Yes (`NUM-051` to `NUM-054`: eigenvalues $\lambda_1..\lambda_4$)
- **Follow-Up Examiner Question:** *"What did CF-04 prove regarding PCA dimension reduction?"*
- **Defensible Follow-Up Answer:** *"CF-04 proved the Full-Space Metric Reduction Identity: when retained dimension $K$ equals ambient dimension $p=4$, the metric tensor preserves Euclidean distances exactly, confirming that PCA is a pure orthogonal rotation."*

### FC-19: Eigengap as Physical Truth Proof
- **Forbidden Statement:** *"The boundary eigengap $\delta_3 = 0.7383$ proves that our PCA model reflects physical reality."*
- **Why Examiner Challenges It:** The eigengap is a matrix spectral property diagnosing numerical subspace stability; it is not a physical law or proof of molecular structure. Furthermore, the active software evaluates scalar eigengaps against project thresholds and does not compute the Davis-Kahan $\sin \Theta$ theorem directly.
- **Exact Problem:** Treats a numerical linear algebra stability concept as a physical validation proof, and conflates literature theoretical motivation with an active software calculation.
- **Correct Replacement:** *"The boundary eigengap $\delta_3 = \lambda_3 - \lambda_4 = 0.738310 \ge 0.10$ satisfies the project stability threshold motivated by Davis-Kahan-type subspace perturbation theory; however, the software itself evaluates the scalar eigengap against governance tripwires and does not directly compute the Davis-Kahan $\sin \Theta$ bound."*
- **Evidence Source:** `src/asd_mcda/v2/stability.py:40-70`; `MODULE_12_DERIVATION_BOOK.md:Derivation-2`
- **Epistemic Tier:** `TIER-2: ESTABLISHED_BY_NUMERICAL_COMPUTATION`
- **Severity:** `P1_MAJOR_EPISTEMIC_SLIP`
- **Related Module:** Module 04, Module 12
- **Numerical Evidence Required:** Yes (`NUM-058`: $\delta_3 = 0.738310$, `NUM-059`: $\delta_{\text{warn}}=0.10$, `NUM-060`: $\delta_{\text{block}}=0.03$)
- **Follow-Up Examiner Question:** *"What happens if the eigengap falls below 0.03?"*
- **Defensible Follow-Up Answer:** *"The engine immediately raises `DegenerateSubspaceBlockedError` and halts execution, preventing contaminated decision-making on an ill-conditioned subspace."*

### FC-20: Dominant Criteria Physical Attribution
- **Forbidden Statement:** *"PCA proves that Hansen solubility is the physically dominant criterion governing formulation."*
- **Why Examiner Challenges It:** PCA identifies directions of maximal *sample variance* across the chosen cohort; a criterion with high variance across 5 polymers is not necessarily the most physically important mechanism in nature.
- **Exact Problem:** Conflates statistical sample variance across a small cohort with universal physical importance.
- **Correct Replacement:** *"PCA identifies that the first principal component captures $52.27\%$ of the standardized sample variance across this five-polymer cohort; physical importance is incorporated separately via the decision-theoretic AHP preference weights."*
- **Evidence Source:** `src/asd_mcda/v2/pca.py:50-70`
- **Epistemic Tier:** `TIER-3: SUPPORTED_AS_METHODOLOGICAL_DIAGNOSTIC`
- **Severity:** `P1_MAJOR_EPISTEMIC_SLIP`
- **Related Module:** Module 04, Module 05
- **Numerical Evidence Required:** Yes (`NUM-051`: $\lambda_1 = 2.090866$, capturing $52.27\%$)
- **Follow-Up Examiner Question:** *"Why standardize before PCA?"*
- **Defensible Follow-Up Answer:** *"Because the four criteria have differing raw physical distributions; standardization to z-scores ($\mu=0, \sigma=1$) prevents criteria with larger numerical dispersion from dominating the covariance matrix by artifact of unit scale."*

### FC-21: Sign Canonicalization Altering Physics Claim
- **Forbidden Statement:** *"Sign canonicalization in PCA changes the physical polarity of the criteria."*
- **Why Examiner Challenges It:** Eigenvectors are defined up to an arbitrary sign flip ($v$ and $-v$ span the exact same eigenspace). Sign canonicalization is an algorithmic step to ensure deterministic numerical reproducibility.
- **Exact Problem:** Misinterprets an arbitrary algebraic sign convention as a physical transformation.
- **Correct Replacement:** *"Sign canonicalization is an algorithmic standardization step ensuring that the component with the largest absolute loading has a positive sign, guaranteeing deterministic output across BLAS/LAPACK implementations without altering subspace geometry."*
- **Evidence Source:** `src/asd_mcda/v2/pca.py:75-85`
- **Epistemic Tier:** `TIER-1: DIRECTLY_ESTABLISHED_BY_IMPLEMENTATION`
- **Severity:** `P2_METHODOLOGICAL_BLUNDER`
- **Related Module:** Module 04, Module 07
- **Numerical Evidence Required:** No
- **Follow-Up Examiner Question:** *"Does sign flipping affect Euclidean distance in TOPSIS?"*
- **Defensible Follow-Up Answer:** *"No. Since TOPSIS distances are Euclidean norms calculated via $(t_i - t^+)^T M_K (t_i - t^+)$, negating an eigenvector negates both coordinate projections equally, leaving all squared Euclidean distances completely invariant."*

---

## 7. Domain 5: Decision-Theoretic Aggregation & AHP Canon

### FC-22: The "73% Thermodynamic Contribution" Fallacy
- **Forbidden Statement:** *"Our AHP weights show that the system is 73.21% governed by thermodynamics and 17.57% by Gordon-Taylor anti-plasticization."*
- **Why Examiner Challenges It:** AHP weights are subjective preference trade-offs elicited from a human decision-maker. They have zero physical units and do not represent energy shares, enthalpy fractions, or thermodynamic driving forces.
- **Exact Problem:** Conflates multi-criteria decision-maker priority preferences with physical mass, energy, or kinetic contribution percentages.
- **Correct Replacement:** *"The AHP preference vector allocates $0.4077$ to HSP distance and $0.3244$ to Flory-Huggins $\chi$ as decision-theoretic weights on computational criteria, reflecting expert priority given to thermodynamic matching proxies in the screening decision."*
- **Evidence Source:** `src/asd_mcda/v2/ahp.py:45-80`; `MODULE_12_NUMERICAL_DEFENSE_CANON.md:Section-2`
- **Epistemic Tier:** `TIER-1: DIRECTLY_ESTABLISHED_BY_IMPLEMENTATION`
- **Severity:** `P0_FATAL_OVERCLAIM`
- **Related Module:** Module 05 (`05_DECISION_SCIENCE`), Module 12
- **Numerical Evidence Required:** Yes (`NUM-067`: $w_{\text{HSP}}=0.4077$, `NUM-068`: $w_\chi=0.3244$, `NUM-069`: $w_{\text{desc}}=0.0922$, `NUM-070`: $w_{\text{GT}}=0.1757$)
- **Follow-Up Examiner Question:** *"Why are HSP and $\chi$ weighted higher than Gordon-Taylor?"*
- **Defensible Follow-Up Answer:** *"Because in early-stage formulation screening, establishing thermodynamic miscibility proxies is prioritized to ensure favorable molecular mixing, whereas kinetic anti-plasticization ($s_{\text{GT}}$) is treated as a secondary stabilizing factor."*

### FC-23: Consistency Ratio as Scientific Truth Proof
- **Forbidden Statement:** *"An AHP Consistency Ratio $CR < 0.08$ proves that our expert weighting matrix is scientifically true."*
- **Why Examiner Challenges It:** $CR$ measures the mathematical transitivity of pairwise comparisons against a random matrix of the same size. A decision-maker can be perfectly consistent while holding completely unscientific beliefs.
- **Exact Problem:** Conflates logical transitivity ($A > B$ and $B > C \implies A > C$) with empirical scientific validity.
- **Correct Replacement:** *"A Consistency Ratio $CR = 0.0494 < 0.08$ confirms that the expert pairwise comparison matrix possesses acceptable mathematical transitivity under Saaty's random index, ensuring absence of internal logical contradiction."*
- **Evidence Source:** `src/asd_mcda/v2/ahp.py:75-95`; `MODULE_12_DERIVATION_BOOK.md:Derivation-3`
- **Epistemic Tier:** `TIER-2: ESTABLISHED_BY_NUMERICAL_COMPUTATION`
- **Severity:** `P1_MAJOR_EPISTEMIC_SLIP`
- **Related Module:** Module 05, Module 12
- **Numerical Evidence Required:** Yes (`NUM-065`: $CR = 0.049415$, `NUM-066`: $CR_{\text{gate}} = 0.08$)
- **Follow-Up Examiner Question:** *"What happens if an expert submits an AHP matrix with $CR = 0.12$?"*
- **Defensible Follow-Up Answer:** *"The engine immediately raises `AHPConsistencyViolationError` and aborts the evaluation, preventing corrupted or contradictory preference structures from propagating into the metric tensor."*

### FC-24: Physical Derivation of AHP Matrix
- **Forbidden Statement:** *"The pairwise comparison matrix was derived from physical experimental measurements."*
- **Why Examiner Challenges It:** The comparison ratios ($1.0, 2.0, 3.0, 5.0$) are Saaty scale integer judgments based on expert formulation heuristics, not physical measurements.
- **Exact Problem:** Misrepresents subjective multi-criteria decision scaling as physical laboratory instrumentation.
- **Correct Replacement:** *"The pairwise comparison matrix $A$ represents codified expert formulation heuristics elicited on Saaty's 1-to-9 fundamental scale, defining relative trade-off preferences across the four compatibility proxies."*
- **Evidence Source:** `backend/services/engine_adapter.py:95`
- **Epistemic Tier:** `TIER-1: DIRECTLY_ESTABLISHED_BY_IMPLEMENTATION`
- **Severity:** `P1_MAJOR_EPISTEMIC_SLIP`
- **Related Module:** Module 05, Module 12
- **Numerical Evidence Required:** Yes (`NUM-061` to `NUM-064`: ratios $a_{12}=2.0, a_{13}=3.0, a_{23}=5.0, a_{14}=2.0$)
- **Follow-Up Examiner Question:** *"What is the structure of Row 1 in your comparison matrix?"*
- **Defensible Follow-Up Answer:** *"Row 1 is $[1.0, 2.0, 3.0, 2.0]$, representing that HSP distance is judged twice as important as $\chi$, three times as important as molecular descriptors, and twice as important as Gordon-Taylor margin."*

### FC-25: Empirical Degradation Weighting Claim
- **Forbidden Statement:** *"The AHP weights reflect the true empirical probability of degradation pathways in ASDs."*
- **Why Examiner Challenges It:** Degradation pathways (hydrolysis, oxidation, recrystallization) depend on chemical structure, packaging, and excipient impurities, none of which are represented in the 4-criterion AHP matrix.
- **Exact Problem:** Conflates screening decision criteria with chemical degradation kinetics.
- **Correct Replacement:** *"The AHP weights do not model chemical degradation rates; they serve purely as scaling factors within the decision-support ranking algorithm."*
- **Evidence Source:** `src/asd_mcda/v2/metrics.py`
- **Epistemic Tier:** `TIER-6: EXPLICITLY_OUTSIDE_MODEL_SCOPE`
- **Severity:** `P2_METHODOLOGICAL_BLUNDER`
- **Related Module:** Module 05
- **Numerical Evidence Required:** No
- **Follow-Up Examiner Question:** *"Can the user change the AHP matrix?"*
- **Defensible Follow-Up Answer:** *"Yes, in Exploratory mode, a user can supply a custom reciprocal matrix, provided it passes reciprocity validation ($|a_{ij} \cdot a_{ji} - 1| \le 10^{-12}$) and governance gate verification ($CR < 0.08$)."*

### FC-26: Saaty Random Index Dataset Calibration
- **Forbidden Statement:** *"The Saaty Random Index $RI_4 = 0.89$ was calibrated directly to our polymer dataset."*
- **Why Examiner Challenges It:** The Saaty Random Index $RI_4 = 0.89$ is a universal mathematical constant derived from Monte Carlo simulation of 50,000 random reciprocal matrices of dimension $n=4$ by Saaty (1980); it has nothing to do with polymers.
- **Exact Problem:** Claims biological/pharmaceutical calibration for a standard linear algebra simulation benchmark.
- **Correct Replacement:** *"The value $RI_4 = 0.89$ is the standard Saaty benchmark random index for $4 \times 4$ reciprocal matrices, established in decision science literature to normalize the Consistency Index."*
- **Evidence Source:** `src/asd_mcda/v2/ahp.py:53`; Saaty (1980)
- **Epistemic Tier:** `TIER-1: DIRECTLY_ESTABLISHED_BY_IMPLEMENTATION`
- **Severity:** `P2_METHODOLOGICAL_BLUNDER`
- **Related Module:** Module 05, Module 12
- **Numerical Evidence Required:** Yes (`NUM-064`: $RI_4 = 0.89$)
- **Follow-Up Examiner Question:** *"How is Consistency Index $CI$ computed from $\lambda_{\max}$?"*
- **Defensible Follow-Up Answer:** *"Via the exact closed-form equation $CI = \frac{\lambda_{\max} - n}{n - 1} = \frac{4.131937 - 4}{3} = 0.043979$. Dividing by $RI_4 = 0.89$ yields $CR = 0.049415$."*

---

## 8. Domain 6: Stochastic Uncertainty & Sensitivity Canon

### FC-27: Monte Carlo Frequency as Success Probability
- **Forbidden Statement:** *"Soluplus has a 55.51% probability of experimental formulation success."*
- **Why Examiner Challenges It:** A 55.51% top-1 frequency under synthetic mathematical noise (score Truncated Normal on $[0.0, 1.0]$ with $\sigma_{\text{score}}=0.05$ and defensive `np.clip`, plus log-space AHP noise $\sigma_{\text{ahp}}=0.15$) measures algorithmic rank stability under our two-locus model, not a laboratory success rate.
- **Exact Problem:** Conflates numerical sensitivity under synthetic two-locus perturbations (truncated normal scores on $[0.0, 1.0]$ with `np.clip`, and log-normal AHP pairwise ratios) with real-world clinical/laboratory success rates.
- **Correct Replacement:** *"Soluplus was ranked top-1 in $55.51\%$ of valid computational replicates ($4,774$ out of $8,600$) under our two-locus uncertainty model (truncated normal scores bounded to $[0.0, 1.0]$ with `np.clip`, and log-normal AHP pairwise ratios with exact analytical reciprocity), demonstrating algorithmic rank stability within the MCDA decision model."*
- **Evidence Source:** `src/asd_mcda/v2/uncertainty.py:150-210`; `MODULE_12_MASTER_QUANTITATIVE_LEDGER.md`
- **Epistemic Tier:** `TIER-2: ESTABLISHED_BY_NUMERICAL_COMPUTATION`
- **Severity:** `P0_FATAL_OVERCLAIM`
- **Related Module:** Module 06 (`06_UNCERTAINTY_SENSITIVITY`), Module 12
- **Numerical Evidence Required:** Yes (`NUM-076`: $p_{\text{top1}} = 55.51\%$, `NUM-086`: $N_{\text{valid}} = 8,600$)
- **Follow-Up Examiner Question:** *"What polymer was ranked second in Monte Carlo replicates?"*
- **Defensible Follow-Up Answer:** *"HPMC E5 achieved rank 1 in $42.00\%$ of valid replicates ($3,612$ out of $8,600$), indicating that Soluplus and HPMC E5 together dominate $97.51\%$ of valid perturbed decision spaces."*

### FC-28: Blocked Replicates as Code Failures
- **Forbidden Statement:** *"14% of our Monte Carlo runs failed due to software bugs or algorithmic instability."*
- **Why Examiner Challenges It:** The 1,400 blocked replicates represent intentional governance enforcement (rejecting perturbed inputs that violate consistency or stability thresholds), not software crashes.
- **Exact Problem:** Misinterprets active defensive governance tripwires as computational errors or software defects.
- **Correct Replacement:** *"Exactly $1,400$ of $10,000$ generated replicates ($14.00\%$) were intentionally blocked by governance gates ($1,396$ by AHP $CR \ge 0.08$ and $4$ by boundary eigengap $\delta_K < 0.03$), demonstrating that defensive tripwires successfully prevent unprincipled rankings."*
- **Evidence Source:** `src/asd_mcda/v2/uncertainty.py:180-220`; `MODULE_12_DERIVATION_BOOK.md:Derivation-6`
- **Epistemic Tier:** `TIER-2: ESTABLISHED_BY_NUMERICAL_COMPUTATION`
- **Severity:** `P0_FATAL_OVERCLAIM`
- **Related Module:** Module 06, Module 12
- **Numerical Evidence Required:** Yes (`NUM-085`: $N_{\text{gen}}=10,000$, `NUM-087`: $N_{\text{blk}}=1,400$, `NUM-088`: $1,396$ CR blocks, `NUM-089`: $4$ eigengap blocks)
- **Follow-Up Examiner Question:** *"Why are blocked replicates excluded from the $p_{\text{top1}}$ denominator?"*
- **Defensible Follow-Up Answer:** *"Because evaluating rankings over logically contradictory or mathematically degenerate decision states would corrupt the probability distribution; $p_{\text{top1}}$ is strictly evaluated over the $8,600$ valid, well-conditioned decision states."*

### FC-29: Morris Method Physical Causality Claim
- **Forbidden Statement:** *"The Morris method proves that molecular descriptors physically cause the polymer ranking."*
- **Why Examiner Challenges It:** Morris method evaluates algorithmic sensitivity ($\mu^*$) across a computational grid; it has zero ability to infer physical causality or molecular mechanisms.
- **Exact Problem:** Confuses numerical parameter sensitivity of a mathematical function with physical causality in natural systems.
- **Correct Replacement:** *"The Morris screening method demonstrates that `score_POL-005-2026_s_desc` has the highest mean absolute elementary effect ($\mu^* = 0.144381$), identifying it as the most influential computational factor in the ranking algorithm."*
- **Evidence Source:** `src/asd_mcda/v2/sensitivity.py:45-90`; `scientific_validation_results.json`
- **Epistemic Tier:** `TIER-3: SUPPORTED_AS_METHODOLOGICAL_DIAGNOSTIC`
- **Severity:** `P0_FATAL_OVERCLAIM`
- **Related Module:** Module 06, Module 12
- **Numerical Evidence Required:** Yes (`NUM-090`: dominant factor $\mu^* = 0.144381$)
- **Follow-Up Examiner Question:** *"What does Morris $\sigma$ measure?"*
- **Defensible Follow-Up Answer:** *"Morris $\sigma$ measures the standard deviation of elementary effects, diagnosing whether an input factor participates in non-linear interactions with other factors or exhibits non-monotonic behavior across the parameter grid."*

### FC-30: Calibrated Experimental Error Claim
- **Forbidden Statement:** *"The perturbation parameters $\sigma_{\text{AHP}} = 0.15$ and $\sigma_{\text{score}} = 0.05$ reflect measured experimental laboratory errors."*
- **Why Examiner Challenges It:** These parameters were synthetically selected as computational stress-testing thresholds, not derived from inter-laboratory repeatability trials.
- **Exact Problem:** Fictitiously attributes empirical measurement calibration to arbitrary algorithmic perturbation bounds.
- **Correct Replacement:** *"These perturbation values are defined computational stress-testing parameters chosen to evaluate algorithmic rank stability under moderate input noise; they are not empirically calibrated to laboratory measurement variances."*
- **Evidence Source:** `src/asd_mcda/v2/uncertainty.py:50-70`
- **Epistemic Tier:** `TIER-1: DIRECTLY_ESTABLISHED_BY_IMPLEMENTATION`
- **Severity:** `P1_MAJOR_EPISTEMIC_SLIP`
- **Related Module:** Module 06
- **Numerical Evidence Required:** No
- **Follow-Up Examiner Question:** *"How would you experimentally calibrate $\sigma_{\text{score}}$ in future work?"*
- **Defensible Follow-Up Answer:** *"By measuring the experimental standard deviation of solubility parameters and $T_g$ measurements across multiple instrument runs and laboratories, using those empirical standard deviations to parameterize the Monte Carlo normal distributions."*

### FC-31: Physical Disaster in Blocked Replicates
- **Forbidden Statement:** *"Blocked replicates represent formulations that precipitated or suffered chemical degradation."*
- **Why Examiner Challenges It:** Blocked replicates exist entirely inside the computer when perturbed numbers violate mathematical consistency rules ($CR \ge 0.08$ or $\delta_K < 0.03$). No physical substance exists.
- **Exact Problem:** Anthropomorphizes software input rejection as physical laboratory disaster.
- **Correct Replacement:** *"Blocked replicates represent synthetic numerical vectors that violate mathematical consistency or stability constraints; they reflect data governance actions, not physical chemical events."*
- **Evidence Source:** `src/asd_mcda/v2/uncertainty.py:195-215`
- **Epistemic Tier:** `TIER-1: DIRECTLY_ESTABLISHED_BY_IMPLEMENTATION`
- **Severity:** `P1_MAJOR_EPISTEMIC_SLIP`
- **Related Module:** Module 06
- **Numerical Evidence Required:** No
- **Follow-Up Examiner Question:** *"Why are $99.71\%$ of blocks caused by AHP rather than the eigengap?"*
- **Defensible Follow-Up Answer:** *"Because the log-space perturbation $\sigma_{\text{AHP}} = 0.15$ introduces random non-reciprocal variations across 6 off-diagonal elements, frequently pushing $CR$ past the strict $0.08$ threshold, whereas Indomethacin's boundary eigengap ($\delta_3 = 0.7383$) is exceptionally wide and rarely drops below $0.03$."*

---

## 9. Domain 7: Software Governance & Architecture Canon

### FC-32: The DRG-0002 Density Myth
- **Forbidden Statement:** *"DRG-0002 was quarantined because of an unphysical crystalline density of $1.781\text{ g/cm}^3$."*
- **Why Examiner Challenges It:** Citing an arbitrary density threshold suggests an ad-hoc, unprincipled heuristic. In the active v2 architecture, DRG-0002 was quarantined because the requested drug name (Fenofibrate) did not match the stored chemical structure (Indomethacin).
- **Exact Problem:** Misidentifies the architectural tripwire, citing legacy notes rather than active v2 chemical identity validation.
- **Correct Replacement:** *"DRG-0002 was quarantined by chemistry governance (`resolve_validated_drug_snapshot()` in `chemistry.py`) due to an identity mismatch between the requested drug (Fenofibrate) and the stored chemical structure (Indomethacin)."*
- **Evidence Source:** `src/asd_mcda/v2/chemistry.py:85-115`; `MODULE_12_SOURCE_RECONCILIATION.md:Section-3.2`
- **Epistemic Tier:** `TIER-1: DIRECTLY_ESTABLISHED_BY_IMPLEMENTATION`
- **Severity:** `P0_FATAL_OVERCLAIM`
- **Related Module:** Module 02, Module 07, Module 12
- **Numerical Evidence Required:** No
- **Follow-Up Examiner Question:** *"What exception is raised when this identity mismatch is detected?"*
- **Defensible Follow-Up Answer:** *"The chemistry layer detects the metadata inconsistency and raises an integrity quarantine error, preventing corrupted drug records from entering the four-criterion compatibility pipeline."*

### FC-33: The Failing v1.5 Tests Contamination
- **Forbidden Statement:** *"The 6 failing tests in the regression suite prove that the v2 codebase is broken."*
- **Why Examiner Challenges It:** Those 6 tests belong to the legacy fixed-$K$ contract suite; their failure under the dynamic-$K$ v2 engine confirms that the v2 innovation is actively operating and that legacy behavior is cleanly isolated.
- **Exact Problem:** Misinterprets intentional architectural contract isolation as software breakage.
- **Correct Replacement:** *"Those six tests belong to the legacy v1.5 fixed-$K$ test suite; their failure in the v2 engine verifies that the dynamic-$K$ variable subspace architecture is functioning as designed and preserves historical v1.5 test isolation."*
- **Evidence Source:** `tests/v15_tests/`; `08_VALIDATION_REPRODUCIBILITY/06_TEST_SUITE_ARCHITECTURE.md`
- **Epistemic Tier:** `TIER-1: DIRECTLY_ESTABLISHED_BY_IMPLEMENTATION`
- **Severity:** `P0_FATAL_OVERCLAIM`
- **Related Module:** Module 07, Module 08
- **Numerical Evidence Required:** No
- **Follow-Up Examiner Question:** *"What version semantics govern PharmaPolySCOPE?"*
- **Defensible Follow-Up Answer:** *"The package API is anchored at 1.5.0 for backward compatibility; the active computational engine is v2.0.0 running methodology 2.0.0-SP-PRP-TOPSIS, and the four-criterion compatibility science is frozen at baseline v1.5.0-FOUR-CRITERION-FREEZE (commit 31eee4d)."*

### FC-34: Cross-Platform Bitwise Identity Overclaim
- **Forbidden Statement:** *"Storing floating-point numbers to 16 decimal places guarantees bitwise reproducibility across all computers."*
- **Why Examiner Challenges It:** Floating-point operations (IEEE 754) are subject to compiler optimizations, FMA instructions, and differing BLAS/LAPACK implementations that can cause least-significant-bit divergence across hardware architectures.
- **Exact Problem:** Conflates recording full float64 machine records with cross-platform bitwise reproducibility.
- **Correct Replacement:** *"The raw float64 value is retained for computational auditability and exact recording of the executed result; the viva value is reported at an appropriate number of significant digits."*
- **Evidence Source:** `MODULE_12_MASTER_QUANTITATIVE_LEDGER.md:Section-1.2`
- **Epistemic Tier:** `TIER-1: DIRECTLY_ESTABLISHED_BY_IMPLEMENTATION`
- **Severity:** `P1_MAJOR_EPISTEMIC_SLIP`
- **Related Module:** Module 08, Module 12
- **Numerical Evidence Required:** No
- **Follow-Up Examiner Question:** *"Why not report 16 decimal places in viva defense?"*
- **Defensible Follow-Up Answer:** *"Because reporting 16 decimal places for physical parameters such as molecular weight ($357.793\text{ g/mol}$) or $T_g$ ($315.15\text{ K}$) falsely implies measurement precision beyond physical reality; oral figures must reflect scientific significant figures."*

### FC-35: Degenerate Subspace as Algorithmic Defect
- **Forbidden Statement:** *"Raising `DegenerateSubspaceBlockedError` is a bug that we need to fix."*
- **Why Examiner Challenges It:** Raising an exception when the boundary eigengap $\delta_K < 0.03$ is an intentional defensive governance design that halts execution when a matrix is ill-conditioned.
- **Exact Problem:** Treats a defensive safety tripwire as a software flaw.
- **Correct Replacement:** *"Raising `DegenerateSubspaceBlockedError` is an intentional defensive governance tripwire that protects the user by halting calculation when spectral ill-conditioning threatens decision integrity."*
- **Evidence Source:** `src/asd_mcda/v2/stability.py:55-70`
- **Epistemic Tier:** `TIER-1: DIRECTLY_ESTABLISHED_BY_IMPLEMENTATION`
- **Severity:** `P1_MAJOR_EPISTEMIC_SLIP`
- **Related Module:** Module 04, Module 07
- **Numerical Evidence Required:** Yes (`NUM-060`: $\delta_{\text{block}} = 0.03$)
- **Follow-Up Examiner Question:** *"In what scenarios does this error trigger?"*
- **Defensible Follow-Up Answer:** *"In scenarios where adjacent eigenvalues are nearly identical ($\lambda_K \approx \lambda_{K+1}$), causing the boundary eigengap to collapse below 0.03, which makes eigenvector orientations hypersensitive to random noise under Davis-Kahan theory."*

### FC-36: Machine Learning Cross-Validation Claim
- **Forbidden Statement:** *"We validated our algorithm using k-fold cross-validation with training, testing, and hold-out sets."*
- **Why Examiner Challenges It:** PharmaPolySCOPE is a deterministic Multi-Criteria Decision Analysis (MCDA) framework, not an inductive Machine Learning predictive model. It does not train model weights on labeled data.
- **Exact Problem:** Misrepresents deterministic multi-criteria ranking as an empirical supervised machine learning model.
- **Correct Replacement:** *"PharmaPolySCOPE is an MCDA framework applying deterministic algebraic algorithms (AHP, PCA, SP-PRP-TOPSIS) to a defined decision matrix; it does not train weights on labeled datasets, and validation refers to mathematical verification and sensitivity profiling (Class B validation)."*
- **Evidence Source:** `08_VALIDATION_REPRODUCIBILITY/01_VALIDATION_METHODOLOGY.md`
- **Epistemic Tier:** `TIER-1: DIRECTLY_ESTABLISHED_BY_IMPLEMENTATION`
- **Severity:** `P0_FATAL_OVERCLAIM`
- **Related Module:** Module 08
- **Numerical Evidence Required:** No
- **Follow-Up Examiner Question:** *"What classification tier applies to PharmaPolySCOPE's validation status?"*
- **Defensible Follow-Up Answer:** *"Classification B: Release Ready With Documented Limitations. All mathematical and software execution pathways are verified, while physical formulation validation remains pending."*

---

## 10. Summary Index of Forbidden Assertions

| Assertion ID | Domain | Short Keyword Description | Epistemic Tier | Defect Severity |
| :--- | :--- | :--- | :---: | :---: |
| **FC-01** | Domain 1: Ranking | "Proven best polymer" | Tier 2 | `P0_FATAL_OVERCLAIM` |
| **FC-02** | Domain 1: Ranking | "Guaranteed physical stability" | Tier 5 | `P0_FATAL_OVERCLAIM` |
| **FC-03** | Domain 1: Ranking | "$C_L$ proves performance" | Tier 2 | `P1_MAJOR_EPISTEMIC_SLIP` |
| **FC-04** | Domain 1: Ranking | "Matches experimental dissolution"| Tier 6 | `P1_MAJOR_EPISTEMIC_SLIP` |
| **FC-05** | Domain 1: Ranking | "Rank 4/5 polymers incompatible" | Tier 3 | `P2_METHODOLOGICAL_BLUNDER` |
| **FC-06** | Domain 2: Thermodynamics | "HSP proves miscibility" | Tier 3 | `P0_FATAL_OVERCLAIM` |
| **FC-07** | Domain 2: Thermodynamics | "$\chi$ proves negative $\Delta G_{\text{mix}}$" | Tier 3 | `P0_FATAL_OVERCLAIM` |
| **FC-08** | Domain 2: Thermodynamics | "Computes molecular interaction energy"| Tier 6 | `P1_MAJOR_EPISTEMIC_SLIP` |
| **FC-09** | Domain 2: Thermodynamics | "Never phase-separates" | Tier 4 | `P1_MAJOR_EPISTEMIC_SLIP` |
| **FC-10** | Domain 2: Thermodynamics | "Proves directional H-bonds" | Tier 3 | `P1_MAJOR_EPISTEMIC_SLIP` |
| **FC-11** | Domain 2: Thermodynamics | "Group contribution is exact" | Tier 4 | `P2_METHODOLOGICAL_BLUNDER` |
| **FC-12** | Domain 3: Glass Stability | "Predicts 2-year shelf-life" | Tier 5 | `P0_FATAL_OVERCLAIM` |
| **FC-13** | Domain 3: Glass Stability | "Gordon-Taylor proves anti-crystallization"| Tier 3 | `P1_MAJOR_EPISTEMIC_SLIP` |
| **FC-14** | Domain 3: Glass Stability | "Guarantees single-phase glass"| Tier 4 | `P1_MAJOR_EPISTEMIC_SLIP` |
| **FC-15** | Domain 3: Glass Stability | "Simulates relative humidity" | Tier 6 | `P1_MAJOR_EPISTEMIC_SLIP` |
| **FC-16** | Domain 3: Glass Stability | "Classical nucleation theory" | Tier 6 | `P2_METHODOLOGICAL_BLUNDER` |
| **FC-17** | Domain 4: Dimensionality | "Clustered using K-Means" | Tier 1 | `P0_FATAL_OVERCLAIM` |
| **FC-18** | Domain 4: Dimensionality | "Eliminated criterion 4" | Tier 1 | `P1_MAJOR_EPISTEMIC_SLIP` |
| **FC-19** | Domain 4: Dimensionality | "Eigengap proves physical reality"| Tier 2 | `P1_MAJOR_EPISTEMIC_SLIP` |
| **FC-20** | Domain 4: Dimensionality | "PCA proves physical dominance"| Tier 3 | `P1_MAJOR_EPISTEMIC_SLIP` |
| **FC-21** | Domain 4: Dimensionality | "Sign canonicalization alters physics"| Tier 1 | `P2_METHODOLOGICAL_BLUNDER` |
| **FC-22** | Domain 5: AHP Aggregation | "73% thermodynamic contribution"| Tier 1 | `P0_FATAL_OVERCLAIM` |
| **FC-23** | Domain 5: AHP Aggregation | "$CR < 0.08$ proves scientific truth"| Tier 2 | `P1_MAJOR_EPISTEMIC_SLIP` |
| **FC-24** | Domain 5: AHP Aggregation | "AHP derived from physical data"| Tier 1 | `P1_MAJOR_EPISTEMIC_SLIP` |
| **FC-25** | Domain 5: AHP Aggregation | "Reflects true degradation rates"| Tier 6 | `P2_METHODOLOGICAL_BLUNDER` |
| **FC-26** | Domain 5: AHP Aggregation | "$RI_4 = 0.89$ calibrated to polymers"| Tier 1 | `P2_METHODOLOGICAL_BLUNDER` |
| **FC-27** | Domain 6: Uncertainty | "55.51% clinical success chance"| Tier 2 | `P0_FATAL_OVERCLAIM` |
| **FC-28** | Domain 6: Uncertainty | "14% MC runs failed" | Tier 2 | `P0_FATAL_OVERCLAIM` |
| **FC-29** | Domain 6: Uncertainty | "Morris proves physical causality"| Tier 3 | `P0_FATAL_OVERCLAIM` |
| **FC-30** | Domain 6: Uncertainty | "$\sigma$ calibrated to lab error"| Tier 1 | `P1_MAJOR_EPISTEMIC_SLIP` |
| **FC-31** | Domain 6: Uncertainty | "Blocked runs represent precipitation"| Tier 1 | `P1_MAJOR_EPISTEMIC_SLIP` |
| **FC-32** | Domain 7: Software Gov | "DRG-0002 failed due to density"| Tier 1 | `P0_FATAL_OVERCLAIM` |
| **FC-33** | Domain 7: Software Gov | "Failing v1.5 tests prove code broken"| Tier 1 | `P0_FATAL_OVERCLAIM` |
| **FC-34** | Domain 7: Software Gov | "Float64 guarantees bitwise identity"| Tier 1 | `P1_MAJOR_EPISTEMIC_SLIP` |
| **FC-35** | Domain 7: Software Gov | "`DegenerateSubspaceBlockedError` is bug"| Tier 1 | `P1_MAJOR_EPISTEMIC_SLIP` |
| **FC-36** | Domain 7: Software Gov | "Validated via k-fold ML split"| Tier 1 | `P0_FATAL_OVERCLAIM` |
