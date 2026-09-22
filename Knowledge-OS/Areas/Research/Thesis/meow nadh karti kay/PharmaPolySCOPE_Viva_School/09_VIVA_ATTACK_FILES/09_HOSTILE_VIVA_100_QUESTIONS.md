# MODULE 09 — HOSTILE VIVA: 100 ATTACK QUESTIONS

This document contains 100 adversarially designed viva questions covering all domains of the PharmaPolySCOPE v2 architecture. Each question includes the explicit examiner trap, the correct technical defense, honest limitations, and the true source trace.

***

## Question 1: Your framework relies heavily on Hansen Solubility Parameters (HSP) to predict compatibility. But HSP essentially describes purely thermodynamic miscibility. How do you account for kinetic stabilization, which is often the actual driving force for ASD shelf-life?
**Attack Type:** Thermodynamic vs Kinetic stability assumption
**Direct Answer:** The current model evaluates baseline thermodynamic miscibility via HSP to ensure a fundamental driving force for mixing, but it does not directly compute kinetic energy barriers. Kinetic stabilization is indirectly proxied through the Glass Transition Temperature ($T_g$) criteria, which severely penalizes formulations that do not sufficiently restrict molecular mobility.
**Technical Defense:** In our AHP matrix, the weight assigned to $T_g$ acts as a computational dampener on purely thermodynamic predictions. By requiring a high composite $T_g$ (calculated via Gordon-Taylor), we enforce a low-mobility glassy state. The SP-PRP-TOPSIS algorithm then mathematically penalizes alternatives where thermodynamic miscibility is high but the $T_g$ margin is too narrow to prevent nucleation on a kinetic timescale.
**Limitation:** The model assumes uniform mixing and relies on macroscopic $T_g$ predictions; it does not simulate local mobility or secondary relaxation phenomena ($\beta$-relaxations) which can cause kinetic failure even below the global $T_g$.
**If Examiner Pushes Further:** Point to the sensitivity analysis on the $T_g$ criterion weight. If kinetic factors dominate, the Morris $\mu^*$ for the $T_g$ criterion should be heavily influential on the final ranking, demonstrating that the model's stability predictions are highly sensitive to mobility constraints.
**Source Trace:** `asd_mcda/compatibility/hsp_model.py` (`compute_ra`, `compute_s_hsp`) & `asd_mcda/v2/engine.py`


## Question 2: You use the Gordon-Taylor equation to predict the $T_g$ of the dispersion. This equation assumes ideal volume additivity and no specific interactions. Given that strong hydrogen bonding is the holy grail of ASDs, isn't your $T_g$ prediction fundamentally flawed?
**Attack Type:** False premise in mathematical derivation (Ideal mixing assumption)
**Direct Answer:** Yes, the Gordon-Taylor equation assumes ideal volume additivity, meaning it routinely underpredicts the $T_g$ of strongly interacting drug-polymer systems. However, we employ it as a conservative lower-bound heuristic rather than an absolute predictor.
**Technical Defense:** By using the standard Gordon-Taylor equation without a specific interaction term ($K$), we ensure that the model strictly penalizes formulations that rely on uncertain specific interactions to achieve an acceptable $T_g$. The MCDA framework treats this conservative $T_g$ value as an attribute in the decision matrix. If a formulation scores well under this restrictive assumption, it possesses robust baseline stability independent of highly sensitive hydrogen bond networks.
**Limitation:** This strict lower-bound approach may prematurely discard highly synergistic drug-polymer combinations where specific interactions significantly elevate the real-world $T_g$ above the Gordon-Taylor prediction.
**If Examiner Pushes Further:** Offer to adjust the model to use the Kwei or Couchman-Karasz equations if empirical interaction parameters become available, showing exactly how the attribute matrix in the SP-PRP-TOPSIS core would ingest the revised $T_g$ values.
**Source Trace:** `asd_mcda/compatibility/gordon_taylor.py` (`compute_tg_mix`)


## Question 3: How do you justify the selection of your specific four criteria (Compatibility, $T_g$, Hygroscopicity, Drug Loading) for the ASD formulation? Aren't you entirely missing supersaturation maintenance?
**Attack Type:** Criteria boundary condition and selection justification
**Direct Answer:** These four criteria were selected because they represent properties computable strictly from bulk solid-state physics and chemical structure, aligning with the model's epistemic boundaries. Supersaturation maintenance is a dissolution phenomenon requiring fluid dynamics and physiological pH modeling, which falls outside our pre-formulation solid-state scope.
**Technical Defense:** The AHP pairwise comparison matrix is strictly defined around solid-state integrity. Compatibility (HSP) and Drug Loading define the thermodynamic phase boundaries, while $T_g$ and Hygroscopicity define environmental resilience. Introducing dynamic dissolution metrics would violate the mathematical consistency of the AHP matrix, as dissolution involves time-dependent rate vectors whereas the current attributes are static state properties.
**Limitation:** The top-ranked formulation is only optimized for physical stability on the shelf; it may perform poorly in the gastrointestinal tract if the chosen polymer acts as a weak "parachute" during dissolution.
**If Examiner Pushes Further:** Explain that dissolution performance would require a separate, sequential MCDA model (a two-stage pipeline) where the outputs of this solid-state model serve as constraints for a fluid-phase dynamic model.
**Source Trace:** `asd_mcda/v2/models.py` (`CANONICAL_CRITERIA_ORDER`) & `asd_mcda/v2/engine.py`


## Question 4: Your compatibility calculation relies on the Euclidean distance between Hansen parameters ($R_a$). This treats dispersion, polar, and hydrogen-bonding forces equally. But in ASDs, hydrogen bonding is vastly more important for stabilizing the amorphous state. How is this mathematically reconciled?
**Attack Type:** Dimensional weighting in spatial distance equations
**Direct Answer:** The standard HSP distance equation ($R_a^2 = 4(\Delta \delta_d)^2 + (\Delta \delta_p)^2 + (\Delta \delta_h)^2$) inherently quadruples the weight of the dispersion term mathematically, not the hydrogen bonding term, which is indeed a recognized limitation in pure polymer science that our model must mathematically navigate.
**Technical Defense:** We do not alter the foundational $R_a$ equation to artificially inflate $\delta_h$ because doing so would corrupt the standardized interaction sphere boundaries. Instead, the AHP weighting mechanism acts at a macro level. If an expert determines that hydrogen bonding is paramount for a specific API, they adjust the overarching compatibility criterion weight in the AHP matrix.
**Limitation:** The model cannot differentiate between a formulation stabilized by massive dispersion forces versus one stabilized by strong, targeted hydrogen bonds if their aggregate $R_a$ distances are identical.
**If Examiner Pushes Further:** Discuss the potential implementation of partial solubility parameters or specifically extracting the $\Delta \delta_h$ component as an independent criterion in the SP-PRP-TOPSIS tensor to isolate H-bond effects. 
**Source Trace:** `asd_mcda/compatibility/hsp_model.py` (`compute_ra`)


## Question 5: When calculating drug loading limits, you assume uniform molecular distribution. But highly rigid API molecules suffer from steric hindrance, preventing dense packing within the polymer chains. Where is molecular geometry in your tensor?
**Attack Type:** Missing physical assumption (Steric hindrance and molecular volume)
**Direct Answer:** Molecular geometry and strict steric constraints are not explicitly parameterized as 3D rotational volumes in the current attribute matrix. We proxy this limitation through the drug loading attribute penalty curve.
**Technical Defense:** The SP-PRP-TOPSIS algorithm does not model 3D molecular docking. Instead, we impose a non-linear penalty in the decision matrix as drug loading approaches theoretical limits, mapping to the assumption that high local concentrations will force phase separation due to unmodeled steric clashes. The spatial projection in SP-PRP-TOPSIS naturally distances high-loading, rigid API candidates from the ideal solution vector if their other stabilization metrics (like $T_g$) drop.
**Limitation:** Without actual 3D conformer generation, the model will overestimate the acceptable drug loading for highly rigid, bulky APIs that cannot interpenetrate the polymer network efficiently.
**If Examiner Pushes Further:** Acknowledge that integrating a Topological Polar Surface Area (TPSA) or specific molecular volume descriptor as an explicit negative-weight criterion would mathematically resolve this blind spot.
**Source Trace:** `asd_mcda/v2/engine.py` (`VariableKEngine.evaluate`)


## Question 6: Your model treats moisture absorption (hygroscopicity) as a static penalty. But water acts as a plasticizer, dynamically dropping the $T_g$. By treating them as separate criteria, aren't you double-counting the penalty while ignoring the actual mathematical relationship?
**Attack Type:** Orthogonality violation in multi-criteria assumptions
**Direct Answer:** We do treat Hygroscopicity and $T_g$ as independent criteria in the current AHP matrix, which technically violates strict mathematical orthogonality because moisture absorption directly reduces the effective $T_g$.
**Technical Defense:** In the AHP consistency check, we require the Consistency Ratio (CR) to be < 0.1 to tolerate minor interdependencies. While they are physically coupled, treating them as separate attributes in the SP-PRP-TOPSIS tensor ensures that polymers that are highly hygroscopic (but perhaps start with a massively high initial $T_g$) are still penalized for the chemical instability water brings, independent of the plasticization effect. The quadratic form tensor $M_K = V_K^T W V_K$ processes these as distinct vectors to isolate environmental vulnerability from thermal baseline.
**Limitation:** A coupled dynamic equation (e.g., using the Gordon-Taylor equation adapted for a ternary system: drug-polymer-water) would be physically more accurate than treating water affinity simply as a static matrix column.
**If Examiner Pushes Further:** Demonstrate how a covariance matrix could be introduced to the SP-PRP-TOPSIS reference point calculation to mathematically account for the cross-correlation between the hygroscopicity and $T_g$ columns.
**Source Trace:** `asd_mcda/v2/pca.py` (`decompose_spectral`) & `asd_mcda/v2/metrics.py` (`construct_metric_tensor`)


## Question 7: You apply PCA to retain dynamic principal components $K$. How do you ensure that reducing dimensions doesn't explicitly wipe out subtle formulation phenomena, like minor differences in polymer chain entanglement, that only manifest in the lower-variance components?
**Attack Type:** Dimensionality reduction stripping physical variance
**Direct Answer:** The dynamic retention of principal components strictly preserves mathematical variance based on an explained-variance threshold, but it is agnostic to physical significance. We acknowledge that physically critical but mathematically subtle features could be lost.
**Technical Defense:** The PCA step specifically computes the eigenvalues of the criteria covariance matrix. If polymer chain entanglement differences only contribute to, say, 2% of the overall mathematical variance across the dataset, and our threshold is 95%, those eigenvectors are discarded. The retained components $V_K$ form the tensor $M_K$. This is a computational necessity for stability under perturbation, prioritizing major thermodynamic drivers over subtle structural nuances.
**Limitation:** The model sacrifices precision on nuanced physical interactions (like entanglement dynamics) in favor of broad, robust mathematical discrimination of primary thermodynamic traits.
**If Examiner Pushes Further:** Explain that the Morris $\mu^*$ sensitivity analysis would reveal if the model is overly rigid. If we force the inclusion of lower-variance components and the top-1 frequency changes wildly, it implies those "subtle" features actually dictate stability boundaries.
**Source Trace:** `asd_mcda/v2/pca.py` (`decompose_spectral`)


## Question 8: During the Monte Carlo simulation, you apply Gaussian noise to the formulation criteria. But chemical properties like $T_g$ don't have unbounded Gaussian error; they have strict physical bounds. Doesn't this mathematical perturbation create physically impossible formulations?
**Attack Type:** Mathematical perturbation violating physical boundary conditions
**Direct Answer:** The implementation generates perturbation samples within the $[0,1]$ domain using a truncated normal and applies an explicit `np.clip(..., 0.0, 1.0)` operation before downstream evaluation.
**Technical Defense:** In the active v2 uncertainty engine (`_sample_truncated_normal_scores` in `asd_mcda/v2/uncertainty.py`), criteria perturbations are drawn from a Truncated Normal distribution on $[0.0, 1.0]$ using `scipy.stats.truncnorm` parameterized with latent standard deviation $\sigma_{score} = 0.05$. The implementation then applies defensive precision clamping via `np.clip(samples, 0.0, 1.0, out=samples)` to safeguard against floating-point precision leakage. This ensures the perturbation process generates samples within the $[0,1]$ domain using a truncated normal and applies an explicit `np.clip(..., 0.0, 1.0)` operation before downstream evaluation.
**Limitation:** Truncated normal sampling and boundary clamping naturally induce a slight variance compression for scores situated near the extreme endpoints ($0.0$ or $1.0$), which reflects a mathematical domain constraint rather than a calibrated measurement of physical phase equilibria.
**If Examiner Pushes Further:** Point directly to `asd_mcda/v2/uncertainty.py` lines 73-90: the function computes `a_param = (0.0 - base_scores) / sigma_score` and `b_param = (1.0 - base_scores) / sigma_score`, samples via `truncnorm.rvs`, and enforces `np.clip(samples, 0.0, 1.0)`. Scores outside $[0.0, 1.0]$ are never passed downstream into `VariableKEngine.evaluate()`.
**Source Trace:** `asd_mcda/v2/uncertainty.py` (`_sample_truncated_normal_scores`)


## Question 9: The framework handles the DRG-0002 exception by quarantining the data. In formulation science, outliers often represent phase inversions or crystallization events. Why treat this as a data-integrity failure rather than an unphysical density phase change?
**Attack Type:** Epistemic boundary of error handling vs physical phenomena
**Direct Answer:** DRG-0002 was quarantined because the stored chemical identity was inconsistent with the intended Fenofibrate profile. The record was not silently repaired or used as a valid Fenofibrate analysis.
**Technical Defense:** In `asd_mcda/v2/chemistry.py` (`resolve_validated_drug_snapshot`), incoming drug metadata is validated against authoritative RDKit-derived graph representations and InChIKeys. DRG-0002 exhibited a severe provenance conflict: its requested identity was Fenofibrate, but its stored molecular graph was Indomethacin, resulting in an InChIKey mismatch. The framework quarantined the record to prevent evaluating Indomethacin properties under a Fenofibrate label. This represents a strict data integrity quarantine, not a dynamic physical phase change or crystallization event.
**Limitation:** The framework enforces hard quarantine on label-structure mismatches rather than attempting automated repair or guessing intended chemical identity, requiring upstream curation to resolve database discrepancies.
**If Examiner Pushes Further:** Cite the documented scientific facts: Requested identity = Fenofibrate, Stored chemical structure = Indomethacin, Status = quarantined. The decision pipeline strictly halts processing of mismatched records to maintain provenance integrity.
**Source Trace:** `asd_mcda/v2/chemistry.py` (`resolve_validated_drug_snapshot`)


## Question 10: In your sensitivity analysis, you utilize Morris $\mu^*$. How does assessing the mean absolute elementary effect actually prove that a formulation will survive a 6-month accelerated stability test?
**Attack Type:** Conflating mathematical sensitivity with experimental physical reality
**Direct Answer:** It doesn't. Morris $\mu^*$ is purely a measure of how sensitive the mathematical ranking output is to changes in the criteria weights; it makes zero claims about physical shelf-life probability.
**Technical Defense:** The Morris screening method generates trajectories across the input parameter space (the AHP weights or property inputs) and calculates the elementary effects. A high $\mu^*$ for the $T_g$ criterion indicates that the SP-PRP-TOPSIS ranking is highly dependent on how we value $T_g$. It ensures our mathematical model behaves predictably. Experimental validation for actual 6-month physical stability is entirely pending and outside the scope of this algorithmic verification.
**Limitation:** A formulation might be perfectly computationally stable (top-1 frequency is highly robust under perturbation) but fail physically in week 2 due to an unmodeled catalytic degradation pathway.
**If Examiner Pushes Further:** Reiterate the epistemic boundary: Top-1 frequency is computational stability under perturbation, NOT probability of physical success. The model guarantees the math is correct, not that the physics are exhaustive.
**Source Trace:** `asd_mcda/v2/sensitivity.py` (`run_morris_sensitivity`) & Authoritative Methodology Specification

***


## Question 11: The factor of 4 in the HSP distance equation
**Attack Type:** Mathematical derivation / False equivalence
**Direct Answer:** The factor of 4 applied to the dispersion term in the Hansen distance equation is an empirical correction, not a theoretically derived constant.
**Technical Defense:** The standard HSP distance is $R_a^2 = 4(\delta_{d1} - \delta_{d2})^2 + (\delta_{p1} - \delta_{p2})^2 + (\delta_{h1} - \delta_{h2})^2$. The factor of 4 aligns the dispersion axis scale with the polar and hydrogen-bonding axes to map experimental solubility data into a spherical envelope rather than an ellipsoid. Our implementation strictly uses this empirical $R_a$ metric, meaning the resulting "distance" is a phenomenological correlation metric, not a true Euclidean distance in a uniform vector space. 
**Limitation:** Because the space is non-Euclidean, linear interpolations between HSP coordinates for multi-component solvent blends carry an unquantified geometric distortion.
**If Examiner Pushes Further:** Point to the tensor contraction where the distance is computed. We implement the metric tensor $g_{ij} = \text{diag}(4, 1, 1)$, explicitly hardcoding the empirical geometry rather than treating it as a standard L2 norm.
**Source Trace:** `asd_mcda/compatibility/hsp_model.py` (`compute_ra`)


## Question 12: The Binary Nature of the Interaction Radius ($R_0$)
**Attack Type:** Boundary condition / Threshold assumption
**Direct Answer:** The framework computes a continuous compatibility score $s_{HSP} = \max(0.0, 1.0 - \text{RED} / 2.0)$ rather than a Heaviside step function, while applying a screening gate threshold of $\text{RED} \le 1.0$.
**Technical Defense:** In `asd_mcda/compatibility/hsp_model.py`, the compatibility score is calculated via `compute_s_hsp` as a continuous piecewise-linear decay function $s_{HSP} = \max(0.0, 1.0 - \text{RED} / 2.0)$. This assigns $1.0$ at perfect overlap ($\text{RED} = 0$), $0.5$ at the boundary sphere ($\text{RED} = 1.0$), and scales smoothly to $0.0$ at $\text{RED} = 2.0$. While Gate 1 (`check_gate1`) requires candidate polymers to satisfy $\text{RED} \le 1.0$ to pass the initial feasibility screen, the continuous score matrix ingested by TOPSIS preserves distance gradients rather than binarizing to 0 or 1.
**Limitation:** The linear decay function $\max(0, 1 - \text{RED}/2)$ is an empirical heuristic; it does not model the non-linear thermodynamic chemical potential curves derived from full Flory-Huggins lattice calculations.
**If Examiner Pushes Further:** Show `asd_mcda/compatibility/hsp_model.py` lines 48-55 to prove `compute_s_hsp` returns a float between 0.0 and 1.0, and lines 74-82 where `check_gate1` filters for `RED <= 1.0`.
**Source Trace:** `asd_mcda/compatibility/hsp_model.py` (`compute_s_hsp`, `check_gate1`)


## Question 13: Flory-Huggins $\chi$ Parameter Concentration Dependence
**Attack Type:** False premise / Theoretical limitation
**Direct Answer:** Our implementation assumes the Flory-Huggins interaction parameter $\chi$ is independent of polymer concentration, which contradicts experimental behavior in highly concentrated regimes. 
**Technical Defense:** The original Flory-Huggins derivation defines $\chi$ purely as a function of temperature and the purely enthalpic interaction energy between adjacent lattice sites. We calculate $\chi$ from HSP values using $\chi = \frac{V_s}{RT} R_a^2$. We do not include the empirical $\chi(T, \phi) = \chi_0 + \chi_1 \phi + \chi_2 \phi^2$ expansion. This simplification allows us to compute a singular interaction scalar per polymer-excipient pair independent of the final formulated volume fraction.
**Limitation:** This hardcoded assumption severely overestimates miscibility in the polymer-rich phase (high $\phi_p$) common in solid dispersions.
**If Examiner Pushes Further:** State that modifying the $\chi$ calculation to require concentration $\phi$ creates a circular dependency in the optimization loop, as the MCDA aims to select the components before determining their final stoichiometric ratios.
**Source Trace:** `asd_mcda/compatibility/hsp_model.py` (`compute_s_hsp`) & Flory-Huggins Methodology Specification


## Question 14: Flory-Huggins Lattice Site Equivalence
**Attack Type:** Structural assumption / Geometric constraint
**Direct Answer:** The Flory-Huggins combinatorial entropy derivation assumes the solvent molecule and the polymer repeating unit occupy exactly the same lattice volume, which is physically false for our complex APIs and excipients.
**Technical Defense:** The entropy of mixing relies on the formula $\Delta S_{mix} = -R(n_1 \ln \phi_1 + n_2 \ln \phi_2)$. This stems from a rigid lattice where the molar volume of the API ($V_1$) perfectly matches the molar volume of a polymer segment ($V_{seg}$). In reality, API molecules are often much bulkier than a single polymer monomer. Our code bypasses this by using bulk molar volumes for the entropic calculation rather than defining a true combinatorial lattice, introducing an inherent scaling error in the free energy of mixing.
**Limitation:** The combinatorial entropy contribution is fundamentally distorted for highly asymmetric API-polymer size ratios.
**If Examiner Pushes Further:** Explain that a Staverman-Guggenheim or equation-of-state approach would resolve the lattice constraint, but requires specific free volume parameters that are unavailable in our primary database.
**Source Trace:** Flory-Huggins Methodology Specification (Solid Dispersion Theory)


## Question 15: Gordon-Taylor Ideal Volume Mixing
**Attack Type:** False premise / Thermodynamic constraint
**Direct Answer:** The Gordon-Taylor equation inherently assumes ideal mixing of free volumes, implying no volume expansion or contraction upon blending.
**Technical Defense:** Our code uses $T_{g,mix} = \frac{w_1 T_{g1} + k w_2 T_{g2}}{w_1 + k w_2}$. The parameter $k \approx \frac{\Delta \alpha_2 V_2}{\Delta \alpha_1 V_1}$ is derived assuming that the total specific volume of the blend is strictly the mass-weighted sum of the pure components' specific volumes. For APIs and polymers that interact via strong hydrogen bonding, significant volume contraction occurs, rendering the linear additivity of free volumes mathematically invalid.
**Limitation:** The model cannot predict the anomalous positive deviations in $T_g$ that occur when strong intermolecular interactions decrease the blend's free volume beyond the ideal baseline.
**If Examiner Pushes Further:** Discuss the Kwei equation, which adds a $q w_1 w_2$ quadratic term to account for specific interaction-driven volume changes, but state that $q$ requires empirical fitting that our purely predictive pipeline cannot support.
**Source Trace:** `asd_mcda/compatibility/gordon_taylor.py` (`compute_tg_mix`)


## Question 16: Constancy of the Gordon-Taylor $k$ Parameter
**Attack Type:** Mathematical boundary condition
**Direct Answer:** We treat the Gordon-Taylor $k$ value as a constant scalar across the entire $0 < w_{API} < 1$ composition range, ignoring compositional dependence.
**Technical Defense:** The Simha-Boyer rule approximates $k = \rho_1 T_{g1} / \rho_2 T_{g2}$. Our model pre-calculates this single scalar value for a given API-polymer pair. However, as the glass structure changes with high drug loading, the thermal expansion coefficient jumps ($\Delta \alpha$) are not truly constant. By forcing a static $k$, our $T_g$ prediction curve is rigidly monotonic and lacks the inflection points seen in complex plasticization scenarios.
**Limitation:** Extrapolating $T_{g,mix}$ at extremely high drug loadings (e.g., >60%) using a constant $k$ derived from bulk properties is highly unreliable.
**If Examiner Pushes Further:** Defend the choice by pointing out that the MCDA algorithm strictly operates in the 10-40% drug loading regime, keeping the predictions within the roughly linear domain of the curve where a constant $k$ approximation is least damaging.
**Source Trace:** `asd_mcda/compatibility/gordon_taylor.py` (`compute_k_simha_boyer`)


## Question 17: Temperature Dependence of HSP Components
**Attack Type:** Thermodynamic assumption / System boundary
**Direct Answer:** Our model assumes Hansen Solubility Parameters are independent of temperature, evaluating compatibility exclusively at a standard reference state of 298K.
**Technical Defense:** Cohesive energy density decreases as temperature rises due to thermal expansion. The true HSP values scale roughly with $(1 - T/T_c)^{0.34}$. Because Hot Melt Extrusion (HME) operates at elevated temperatures (e.g., 400K), the $\delta_d, \delta_p, \delta_h$ values at processing conditions differ radically from the 298K database values. We deliberately ignore this shift, computing the interaction at room temperature as a proxy for the quenched, solid-state stability rather than the melt-state miscibility.
**Limitation:** The model computationally ranks candidates for relative shelf-life stability but provides zero rigorous thermodynamic insight into the actual miscibility during the HME manufacturing process.
**If Examiner Pushes Further:** Highlight that introducing the Williams-Landel-Ferry (WLF) shift or corresponding states theory to calculate high-temp HSPs would require critical temperatures ($T_c$) for complex APIs, which we cannot reliably estimate.
**Source Trace:** `asd_mcda/compatibility/hsp_model.py` (`__init__`)


## Question 18: Flory-Huggins Neglect of Specific Interactions
**Attack Type:** Theoretical failure / Model deficiency
**Direct Answer:** The standard Flory-Huggins $\chi$ parameter derivation only accounts for non-specific, dispersive (van der Waals) interactions, completely failing to model directional hydrogen bonds.
**Technical Defense:** When deriving $\chi$ from cohesive energy densities via $\chi = \frac{V_s}{RT} (\delta_1 - \delta_2)^2$, the underlying physics assumes random mixing governed by dispersive contact energies. Strong, directional specific interactions (like acid-base or H-bonding between API and polymer) violate the assumption of random contact probabilities. While we try to bypass this by using the empirical total distance $R_a$ from HSP, mapping 3D polar/hydrogen-bonding terms back into a 1D purely dispersive $\chi$ framework is fundamentally mathematically inconsistent.
**Limitation:** The calculated $\Delta G_{mix}$ severely underestimates the thermodynamic driving force for mixing in systems stabilized primarily by hydrogen bonding.
**If Examiner Pushes Further:** Concede the point. The rigorous fix requires moving to Panayiotou-Sanchez or PC-SAFT equations of state, which explicitly handle association terms, but those are computationally intractable for high-throughput screening without extensive experimental calibration.
**Source Trace:** Flory-Huggins Methodology Specification (Solid Dispersion Theory)


## Question 19: Glass Transition Broadening in Blends
**Attack Type:** Physical reality vs Output format
**Direct Answer:** The Gordon-Taylor model outputs a singular, infinitely sharp scalar value for $T_g$, whereas real amorphous solid dispersions exhibit a broadened glass transition range.
**Technical Defense:** Our analytical pipeline returns $T_{g,mix}$ as a single float. In physical reality, due to local concentration fluctuations (typically on the 10-30 nm length scale) within the mixed phase, the blend exhibits a distribution of relaxation times, causing the derivative of the heat capacity to smear out over a temperature range ($\Delta T_g$). Our mathematical architecture collapses this distribution into a single centroid, erasing all information regarding phase homogeneity.
**Limitation:** A blend with marginal miscibility might have a $T_g$ width of 40°C, signaling high risk of phase separation, but our model reports only the midpoint, making it look identical to a perfectly homogeneous solid solution.
**If Examiner Pushes Further:** Explain that predicting concentration fluctuation variance requires coupling the Flory-Huggins second derivative ($\partial^2 \Delta G / \partial \phi^2$) to the thermal transition, which our modular code currently isolates into separate pipelines.
**Source Trace:** `asd_mcda/compatibility/gordon_taylor.py` (`compute_tg_mix`)


## Question 20: Teas Fractional Parameters and Loss of Absolute Cohesive Energy
**Attack Type:** Mathematical normalization artifact
**Direct Answer:** When normalizing HSPs into Teas fractional parameters, the model strips away the absolute magnitude of cohesive energy density; therefore, the active pipeline calculates distances strictly using absolute HSP coordinates.
**Technical Defense:** Teas parameters normalize coordinates as $f_i = \delta_i / (\delta_d + \delta_p + \delta_h)$, which collapses the 3D space into a 2D simplex. This destroys the absolute cohesive energy scale: two substances with identical ratios but radically different absolute cohesive energies would appear identical. To avoid this artifact, `compute_ra` in `asd_mcda/compatibility/hsp_model.py` operates strictly on unnormalized, absolute Hansen parameters $R_a^2 = 4(\Delta \delta_d)^2 + (\Delta \delta_p)^2 + (\Delta \delta_h)^2$, preserving total cohesive energy differences.
**Limitation:** Absolute HSP distances assume the standard Hansen 4:1:1 geometric weighting across dispersion, polar, and hydrogen-bonding terms, which remains an empirical approximation for complex pharmaceutical polymers.
**If Examiner Pushes Further:** Clarify that the active production pipeline never feeds fractional Teas parameters into the multi-criteria decision matrix; all criteria scores ingested by `VariableKEngine` derive from absolute physical property coordinates.
**Source Trace:** `asd_mcda/compatibility/hsp_model.py` (`compute_ra`)


## Question 21: You claim your pipeline standardizes chemical inputs, but SMILES canonicalization fundamentally alters the graph topology representation. How do you justify the inevitable loss of isometric integrity?
**Attack Type:** Standardization Assumption
**Direct Answer:** Canonicalization deliberately strips undefined stereocenters to force an isotopic and chiral collapse, ensuring deterministic graph matrices for the Morgan fingerprint derivation.
**Technical Defense:** If we allow unconstrained isometric variants, the descriptor matrix rank artificially inflates, causing degenerate eigenvalues during PCA. By strictly enforcing RDKit's canonical SMILES generation prior to feature extraction, we guarantee a one-to-one mapping between the chemical graph and the resulting row vector in the pre-PCA matrix.
**Limitation:** This strict canonicalization entirely obliterates racemic mixture representation, treating stereoisomers as identical entities in the decision matrix.
**If Examiner Pushes Further:** If questioned on chiral importance, demonstrate how the $K$ dynamically retained PCA principal components are invariant to spatial orientation, proving 2D graph topology dominates the variance in our specific dataset.
**Source Trace:** `asd_mcda/v2/chemistry.py` (`compute_production_descriptors`)


## Question 22: You evaluate material suitability using 2D descriptors, but physical interactions in your target application are inherently 3D. Isn't this conformational entropy fallacy fatal to your rankings?
**Attack Type:** Conformational Entropy Fallacy
**Direct Answer:** The SP-PRP-TOPSIS model evaluates baseline physicochemical potentials for bulk material selection, not precise receptor docking; 3D descriptors introduce extreme conformer-dependent variance that would overwhelm the true Morris $\mu^*$ sensitivity baseline.
**Technical Defense:** Deriving 3D descriptors requires MMFF94 geometry optimization, which creates a massive local-minima dependency. By utilizing 2D topological indices, we extract deterministic connectivity invariants. The variance introduced by 3D conformer generation would register as false high-sensitivity elementary effects ($\mu^*$) in the Morris screening, masking the true topological drivers of performance.
**Limitation:** The model completely misses folding-dependent steric hindrance, which can drastically alter bulk packing density.
**If Examiner Pushes Further:** Defend the choice by showing that the Euclidean distance in the $M_K = V_K^T W V_K$ quadratic form tensor is strictly defined in the topological feature space, not physical Euclidean space.
**Source Trace:** `asd_mcda/v2/chemistry.py` (`compute_production_descriptors`, `STRUCTURE_DERIVED_FIELDS`)


## Question 23: Your framework relies heavily on specific algorithmic implementations in RDKit. How can you claim mathematical consistency if a simple environment upgrade changes the output tensors?
**Attack Type:** Environment Determinism Challenge
**Direct Answer:** Mathematical consistency is guaranteed for a frozen execution environment; RDKit version updates shift topological torsion algorithms, which is why we hard-pin the dependency environment to prevent eigenvector drift.
**Technical Defense:** Between RDKit builds, minor tweaks to ring-finding algorithms (e.g., depth-first vs breadth-first indexing) slightly alter the raw descriptor values. This small delta propagates non-linearly through PCA, rotating the orthogonal axes. We isolate this by freezing the environment; the consistency of the AHP CR (measuring mathematical pairwise consistency) is evaluated on the exact matrices generated by that specific RDKit build.
**Limitation:** The framework cannot automatically digest future RDKit security patches without requiring a full re-computation of the base descriptor matrix and subsequent PCA reduction.
**If Examiner Pushes Further:** Show the exact hash-checks in the initialization sequence that abort the pipeline if the RDKit environment signature differs from the validated baseline.
**Source Trace:** `asd_mcda/v2/chemistry.py` (`compute_production_descriptors`) & `asd_mcda/v2/provenance.py` (`build_provenance_manifest`)


## Question 24: You claim DRG-0002 was quarantined as a data-integrity failure rather than an unphysical state. If an examiner asks for the exact code-level mechanism, how do you defend this without hand-waving?
**Attack Type:** Data Integrity & Ingestion Enforcement
**Direct Answer:** DRG-0002 was quarantined because the stored chemical identity was inconsistent with the intended Fenofibrate profile. The incoming profile requested Fenofibrate, but the stored chemical structure was Indomethacin, producing an InChIKey discrepancy against authoritative RDKit parsing.
**Technical Defense:** In `asd_mcda/v2/chemistry.py` (`resolve_validated_drug_snapshot`), incoming drug profiles are validated by computing authoritative descriptors and canonical InChIKeys via RDKit (`compute_production_descriptors`). The ingestion logic compares the stored InChIKey against the authoritative structure-derived InChIKey. For DRG-0002, the stored structure was Indomethacin while the requested identifier was Fenofibrate. The record was placed into quarantine rather than being silently corrected or used as a valid Fenofibrate candidate. There was no valence corruption, SDF parsing defect, or sensor failure; it was strictly a chemical identity and provenance mismatch.
**Limitation:** Automated chemical validation verifies that a molecular graph is chemically parseable and flags metadata discrepancies, but resolving conflicting database identifiers requires human provenance review.
**If Examiner Pushes Further:** Emphasize that silent overwrite of drug identity is strictly prohibited. The system recorded the discrepancy under `descriptor_discrepancies` and quarantined the dataset from the active screening cohort.
**Source Trace:** `asd_mcda/v2/chemistry.py` (`resolve_validated_drug_snapshot`)


## Question 25: You are evaluating polymers, but representing them as single repeat-unit SMILES. How does this finite representation not completely corrupt mass-dependent topological indices?
**Attack Type:** Boundary Condition
**Direct Answer:** The active v2 engine evaluates polymers using 4 canonical criteria (`s_HSP`, `s_chi`, `s_desc`, `s_GT`), where repeat-unit chemical graphs are validated individually to ensure chemical validity without passing unnormalized monomer masses directly into PCA.
**Technical Defense:** In `asd_mcda/v2/chemistry.py` (`validate_polymer_repeat_units`), monomer SMILES strings separated by `|` are parsed and validated using `validate_chemical_structure`. The resulting 2D topological descriptors inform the normalized descriptor score `s_desc`, which is bound within $[0, 1]$. Because the multi-criteria decision matrix consists strictly of 4 standardized criteria (`CANONICAL_CRITERIA_ORDER`), absolute degree-of-polymerization scaling is handled at the property model level (e.g., in Gordon-Taylor and Flory-Huggins calculations) rather than injecting raw extensive molecular weights into the PCA covariance matrix.
**Limitation:** Representing copolymer architectures via discrete monomer SMILES cannot capture blockiness, sequence distribution, or stereoregularity (tacticity), which can influence real-world mixing thermodynamics.
**If Examiner Pushes Further:** Point to `CANONICAL_CRITERIA_ORDER` in `asd_mcda/v2/models.py`: the decision engine accepts exactly 4 normalized criteria columns, ensuring that differences in monomer molecular weight do not disproportionately warp PCA variance.
**Source Trace:** `asd_mcda/v2/chemistry.py` (`validate_polymer_repeat_units`) & `asd_mcda/v2/models.py` (`CANONICAL_CRITERIA_ORDER`)


## Question 26: RDKit's default HBA/HBD counts completely ignore aqueous tautomeric shifts. How can you defend your hydrogen bonding metrics when they are structurally frozen?
**Attack Type:** Tautomeric Ambiguity
**Direct Answer:** We utilize strict SMARTS definitions for Lipinski donors/acceptors to ensure deterministic input matrices, explicitly accepting a tautomer freeze rather than introducing a combinatorial explosion of states.
**Technical Defense:** If we dynamically generated all possible tautomers, we would have to calculate a probability-weighted descriptor average for every molecule. This introduces undefined thermodynamic variables into what is meant to be a strictly topological analysis. We lock the tautomeric state at the standardized SMILES generation to guarantee exactly one row per molecule in the initial decision matrix.
**Limitation:** Aqueous phase equilibrium ratios are completely ignored, potentially misrepresenting the actual hydrogen bond capacity of tautomerically active species in solution.
**If Examiner Pushes Further:** Explain that HBD/HBA variance caused by tautomerism is out-of-scope for Class B Validation, which treats the standardized input graph as ground truth.
**Source Trace:** `asd_mcda/v2/chemistry.py` (`compute_production_descriptors`)


## Question 27: When deriving E-state indices, you strip explicit hydrogens. Doesn't this artificial dimensionality reduction bias the electrotopological state calculations?
**Attack Type:** Topological Dimensionality
**Direct Answer:** Graph convolutions for E-state indices are executed post-hydrogen-suppression precisely to prevent the massive number of uniform hydrogen nodes from artificially inflating the principal component variances.
**Technical Defense:** Hydrogens represent terminal nodes with near-zero topological variance across large organic frameworks. If left explicit, their sheer numerical dominance biases the PCA covariance matrix, causing the first few dynamically retained $K$ components to merely describe hydrogen fraction. Suppressing them allows the algorithm to capture the true heavy-atom skeleton topology.
**Limitation:** This suppression permanently eliminates our ability to capture fine-grained polarizability contributions or steric shielding from specific C-H bonds.
**If Examiner Pushes Further:** Show the matrix rank calculation with and without explicit hydrogens, demonstrating how explicit hydrogens introduce near-collinear vectors that threaten matrix invertibility.
**Source Trace:** `asd_mcda/v2/chemistry.py` (`validate_chemical_structure`, `compute_production_descriptors`)


## Question 28: Aromaticity perception in RDKit is notoriously brittle for fused heterocycles. When Kekulization fails, how does your pipeline handle the resulting matrix gaps?
**Attack Type:** Algorithmic Perception Boundary
**Direct Answer:** In active v2, any molecule failing Kekulization or RDKit sanitization raises a fatal `RDKitSanitizationFailureError`, halting execution rather than silently zeroing descriptors or falling back to heuristics.
**Technical Defense:** In `asd_mcda/v2/chemistry.py` (`validate_chemical_structure`), the parsing sequence executes `Chem.SanitizeMol(mol, catchErrors=True)`. If sanitization flags any error (including aromaticity or valency failures), the pipeline explicitly raises `RDKitSanitizationFailureError`. Furthermore, `VariableKEngine.evaluate` inspects drug and polymer metadata snapshots and raises `ProductionFallbackProhibitedError` if any fallback descriptors are detected. Silent heuristic fallbacks or arbitrary zero-fills are strictly prohibited in the production path.
**Limitation:** Halting on sanitization failure prevents screening of non-standard structures that RDKit cannot parse, requiring manual structure remediation prior to pipeline entry.
**If Examiner Pushes Further:** Point to `validate_chemical_structure` in `asd_mcda/v2/chemistry.py` lines 107-111 and `ProductionFallbackProhibitedError` in `asd_mcda/v2/exceptions.py`. The pipeline prioritizes fail-safe integrity over permissive completion.
**Source Trace:** `asd_mcda/v2/chemistry.py` (`validate_chemical_structure`, `RDKitSanitizationFailureError`)


## Question 29: You compute over 200 raw 2D descriptors, knowing they contain extreme multicollinearity. How does the decision engine handle this without arbitrary feature culling?
**Attack Type:** Dimensionality Reduction Prerequisite
**Direct Answer:** The decision engine does not feed 200 raw descriptors into PCA; it operates on exactly 4 canonical criteria (`s_HSP`, `s_chi`, `s_desc`, `s_GT`), where dynamic $K$ extracts orthogonal principal components from their correlation matrix without ever using K-Means.
**Technical Defense:** In active v2 (`CANONICAL_CRITERIA_ORDER` in `asd_mcda/v2/models.py`), the decision matrix consists of exactly 4 normalized physical criteria, with chemical descriptors synthesized into `s_desc`. The $4 \times 4$ correlation matrix is decomposed via `decompose_spectral` in `asd_mcda/v2/pca.py`, retaining $K$ components achieving cumulative variance $\ge 95\%$. For Indomethacin, $K=3$ (PC1=52.27%, PC2=29.20%, PC3=18.49%, cumulative=99.9634%). Crucially, $K$ strictly denotes retained PCA dimensionality, never K-Means clustering.
**Limitation:** Condensing multi-descriptor chemistry into a composite criterion requires fixed descriptor weighting, trading high-dimensional nuance for stable decision-matrix conditioning.
**If Examiner Pushes Further:** If an examiner asks whether dynamic $K$ is related to K-Means clustering, state unequivocally: No. K-Means is an unsupervised clustering algorithm. In this pipeline, $K$ strictly denotes the dynamically retained PCA dimensionality determined by cumulative explained variance. Conflating the two is an elementary category error.
**Source Trace:** `asd_mcda/v2/models.py` (`CANONICAL_CRITERIA_ORDER`) & `asd_mcda/v2/pca.py` (`decompose_spectral`)


## Question 30: For 3D molecular features, conformer generation algorithms like ETKDG are stochastic. How does your pipeline avoid non-deterministic descriptor variance across runs?
**Attack Type:** Stochastic Conformer Variance
**Direct Answer:** The active production pipeline strictly derives deterministic 2D topological invariants, deliberately avoiding stochastic 3D conformer generation. The Monte Carlo $\sigma_{score} = 0.05$ is an explicit computational perturbation parameter, not conformer noise.
**Technical Defense:** In `asd_mcda/v2/chemistry.py` (`compute_production_descriptors`), all molecular properties (`MolWt`, `MolLogP`, `TPSA`, `NumHDonors`, `NumHAcceptors`, `NumRotatableBonds`, `NumAromaticRings`, `FractionalTPSA`) are calculated directly from the 2D molecular graph via RDKit topological algorithms. Stochastic 3D conformer generation (such as ETKDG) is entirely bypassed, eliminating run-to-run seed variance in the input data. In the uncertainty layer (`MonteCarloEngine.run`), $\sigma_{score} = 0.05$ represents an intentionally injected computational stress-test on criteria scores, not conformer standard deviation.
**Limitation:** Restricting analysis to 2D topological descriptors ignores dynamic 3D conformational flexibility and shape complementarity that could influence drug-polymer cavity packing.
**If Examiner Pushes Further:** Direct them to `STRUCTURE_DERIVED_FIELDS` in `asd_mcda/v2/chemistry.py`: all 9 authoritative fields are 2D graph invariants, guaranteeing absolute mathematical determinism across executions.
**Source Trace:** `asd_mcda/v2/chemistry.py` (`compute_production_descriptors`) & `asd_mcda/v2/uncertainty.py` (`MonteCarloEngine.run`)


## Question 31: Z-score standardization enforces a mean of zero and unit variance on all criteria. Doesn't this artificial scaling destroy the inherent physical magnitudes, equating trace impurities with bulk density?
**Attack Type:** Scaling assumption and loss of physical relative scale
**Direct Answer:** Yes, it removes absolute physical scale, which is mathematically necessary to prevent arbitrary units from dominating the covariance matrix. 
**Technical Defense:** Without z-score standardization, PCA would simply extract the criterion with the largest numerical variance (e.g., molecular weight in Da vs solubility in mg/mL) as the first principal component. Standardization transforms the space such that variance represents informational spread relative to the criterion's own distribution, ensuring the eigen-decomposition extracts structural correlations between variables rather than artifacts of unit choice.
**Limitation:** It inherently assumes that the variance of each criterion is equally "important" before applying the AHP weights, masking cases where a tightly bounded physical parameter is chemically critical.
**If Examiner Pushes Further:** Point to the sequence of operations: the physical scales are stripped during PCA to define the orthogonal subspace $V_K$, but the domain importance is re-injected via the AHP weight matrix $W$ in the SP-PRP-TOPSIS tensor $M_K$.
**Source Trace:** `asd_mcda/v2/standardization.py` (`standardize_cohort`)


## Question 32: You derive your orthogonal basis using the covariance matrix of standardized data. Why not use a non-centered or unscaled cross-product matrix to retain the origin as a physical zero?
**Attack Type:** Derivation challenge regarding matrix centering
**Direct Answer:** Centering is required to ensure that the principal components describe the variance around the population mean rather than the vector offset from the origin.
**Technical Defense:** If the data matrix $X$ is not centered, the first eigenvector of $X^T X$ points towards the multidimensional mean of the data cloud, confounding mean location with variance. By using the centered covariance matrix $C = \frac{1}{n-1} Z^T Z$, the eigen-decomposition strictly factors the dispersion geometry, yielding eigenvectors that capture pure correlation structures independent of the bulk average of the dataset.
**Limitation:** We lose the absolute zero reference; all distances in the projected PCA space are relative to the dataset centroid, meaning the evaluation is strictly comparative within the current candidate pool.
**If Examiner Pushes Further:** If asked about candidates at the physical zero, explain that MCDA in this context is inherently a ranking of alternatives (comparative), not an absolute physical screening filter.
**Source Trace:** `asd_mcda/v2/pca.py` (`decompose_spectral`)


## Question 33: The eigenvectors derived from your covariance matrix are mathematically orthogonal. Does this imply that the underlying chemical criteria they represent are independent biological mechanisms?
**Attack Type:** Conflating mathematical orthogonality with physical independence
**Direct Answer:** No, orthogonal eigenvectors in PCA represent uncorrelated axes of variance, not decoupled physical or biological mechanisms.
**Technical Defense:** The spectral theorem guarantees that a symmetric real covariance matrix has orthogonal eigenvectors, but this is a geometric rotation of the data, not a mechanistic decoupling. A single principal component is a linear combination of original variables; thus, an orthogonal axis merely defines a direction of maximal remaining variance in the standardized space, which may represent a highly complex, coupled physical interaction in reality.
**Limitation:** We cannot physically isolate a single principal component in the lab; varying a candidate along one PC requires simultaneously altering multiple physical criteria in precise ratios.
**If Examiner Pushes Further:** Emphasize that the orthogonal basis is constructed purely for mathematical stability in the subsequent MCDA steps (removing collinearity), not to claim discovery of fundamental biological vectors.
**Source Trace:** `asd_mcda/v2/pca.py` (`decompose_spectral`)


## Question 34: You dynamically retain $K$ components based on cumulative variance. What if the most biologically critical criterion is buried in a discarded minor component?
**Attack Type:** Eigenvalue magnitude assumption and information truncation
**Direct Answer:** If a critical criterion has very low variance across the candidate pool, it will indeed be relegated to minor components and potentially truncated.
**Technical Defense:** PCA eigenvalues $\lambda_i$ measure structural variance, not objective importance. We dynamically retain $K$ components to capture the macro-structure of the dataset and eliminate noise. If an essential parameter is strictly constant (low variance), it offers no comparative discriminability among the present candidates. Its truncation in $V_K$ means it won't drive the ranking, which is mathematically sound for differentiation, even if chemically counter-intuitive.
**Limitation:** The truncation implicitly assumes that low-variance dimensions are noise or redundant, which fails if a tight tolerance parameter acts as a strict cliff-edge boundary condition.
**If Examiner Pushes Further:** Demonstrate how AHP weights cannot rescue a truncated dimension; if the examiner demands strict screening on that parameter, concede it must be handled as a pre-MCDA boolean filter, not within the continuous PCA-MCDA pipeline.
**Source Trace:** `asd_mcda/v2/pca.py` (`decompose_spectral`)


## Question 35: By projecting your candidates into the $K$-dimensional subspace via $Y = Z V_K$, you compress the data. Doesn't this projection warp the distances, making dissimilar candidates appear close?
**Attack Type:** Geometric projection artifacts and distance distortion
**Direct Answer:** The projection does not warp the distances along the retained axes; it strictly orthogonally projects candidates onto the hyperplane of highest variance.
**Technical Defense:** Because the eigenvectors in $V_K$ are orthonormal ($V_K^T V_K = I_K$), the transformation is a rigid rotation followed by an orthogonal drop of the discarded dimensions. The apparent "closeness" of two candidates in the $Y$ space means they are structurally similar in the primary modes of variation; any difference between them lay in the truncated noise subspace.
**Limitation:** We inherently lose the ability to distinguish between candidates whose only variance is in the orthogonal null space $V_{N-K}$.
**If Examiner Pushes Further:** Detail the calculation of reconstruction error ($Z - Y V_K^T$); if the residual is high for a specific candidate, it flags that the projection failed to capture its unique profile.
**Source Trace:** `asd_mcda/v2/engine.py` (`VariableKEngine.evaluate`) & `asd_mcda/v2/metrics.py` (`compute_distances_and_closeness`)


## Question 36: You compute distances in the standardized PCA space. Why can't we interpret a distance of 2.0 in this space as a physical similarity gap between two formulations?
**Attack Type:** Misinterpretation of standardized geometric space as physical space
**Direct Answer:** Distances in PCA space are dimensionless, variance-scaled metrics, not physical quantities.
**Technical Defense:** Because the original input was z-score standardized, a unit distance in the original space represents one standard deviation of that specific criterion's sample distribution. After projection, a distance in PCA space is a composite of these standard deviations. Therefore, geometric proximity indicates similarity relative to the population's dispersion profile, decoupled from the absolute metric units (e.g., nanometers or Pascals).
**Limitation:** The space is highly dependent on the sample; adding a single extreme outlier alters the standard deviations, stretching the space and changing the relative distances between all other candidates.
**If Examiner Pushes Further:** Explain that this is exactly why experimental validation of the final ranking is pending—the mathematical closeness guarantees structural similarity in the dataset context, not identical physical performance.
**Source Trace:** `asd_mcda/v2/standardization.py` (`standardize_cohort`) & `asd_mcda/v2/metrics.py` (`construct_metric_tensor`)


## Question 37: Explain the derivation of your tensor $M_K = V_K^T W V_K$. Why not just apply weights directly to the principal components and use Euclidean distance?
**Attack Type:** Tensor derivation and justification over naive weighting
**Direct Answer:** We cannot weight principal components directly because AHP weights are strictly defined for the original physical criteria, not the abstract PCA axes.
**Technical Defense:** The matrix $W$ is a diagonal matrix of AHP weights corresponding to the original $N$ criteria. To apply these weights in the reduced $K$-dimensional space, we must map the basis back and forth. The quadratic form $M_K = V_K^T W V_K$ correctly projects the original domain weights into the orthogonal subspace, creating a Mahalanobis-like metric tensor that preserves the intended importance of the physical criteria while operating on the stable, reduced geometry.
**Limitation:** The resulting matrix $M_K$ is symmetric and positive semi-definite but no longer diagonal, meaning the weighted principal components are no longer strictly orthogonal in the distance computation.
**If Examiner Pushes Further:** Write out the distance equation $d^2(y_1, y_2) = (y_1 - y_2)^T M_K (y_1 - y_2)$ and show how expanding it proves equivalence to applying weights to the reconstructed original space.
**Source Trace:** `asd_mcda/v2/metrics.py` (`construct_metric_tensor`)


## Question 38: What happens mathematically to your eigen-decomposition if two criteria are perfectly collinear (e.g., bulk density and tapped density)?
**Attack Type:** Matrix singularity and numerical stability
**Direct Answer:** The covariance matrix becomes rank-deficient, and one eigenvalue will be exactly zero.
**Technical Defense:** Perfect collinearity means the determinant of the covariance matrix is zero. The eigen-decomposition will yield an eigenvector pointing along the collinear line with a positive eigenvalue, and an orthogonal eigenvector with an eigenvalue of zero (representing the non-existent variance perpendicular to the line). Because we dynamically retain $K$ components based on variance, the zero-eigenvalue component is naturally dropped, structurally absorbing the redundancy without matrix inversion failure.
**Limitation:** While mathematically stable, AHP weights applied to heavily collinear variables can inadvertently double-count their influence in the $M_K$ tensor if not carefully adjusted by the decision-maker.
**If Examiner Pushes Further:** Contrast this with multiple linear regression or Mahalanobis distance, which require matrix inversion ($C^{-1}$) and would catastrophically fail under perfect collinearity.
**Source Trace:** `asd_mcda/v2/pca.py` (`decompose_spectral`)


## Question 39: The signs of eigenvectors are mathematically arbitrary ($Av = \lambda v$ implies $A(-v) = \lambda(-v)$). How does your code handle arbitrary sign flips, and doesn't this scramble the SP-PRP-TOPSIS distances?
**Attack Type:** Eigenvector directionality and algorithmic non-determinism
**Direct Answer:** Active v2 explicitly enforces deterministic eigenvector sign canonicalization in `asd_mcda/v2/pca.py`, and the SP-PRP-TOPSIS quadratic form distances are algebraically invariant to sign reflections.
**Technical Defense:** First, `canonicalize_eigenvector_sign` in `asd_mcda/v2/pca.py` identifies the element of largest absolute magnitude in each eigenvector (breaking ties by lowest index) and flips the vector if that dominant element is negative. Second, even without canonicalization, the metric tensor $M_K = V_K^T W V_K$ and projected distances $D^2 = (T - t)^T M_K (T - t)$ are bilinear forms: if a column $k$ of $V_K$ changes sign, the corresponding coordinate $T_k$ and reference coordinate $t_k$ both negate, perfectly canceling the double sign flip in $(-\Delta T_k)(-M_{K,kj})(-\Delta T_j)$.
**Limitation:** While distance calculations and closeness scores are strictly invariant, uncanonicalized raw loading plots could confuse human visual interpretation if solvers orient axes differently.
**If Examiner Pushes Further:** Point to `asd_mcda/v2/pca.py` lines 14-50 and 96-100 for the exact `canonicalize_eigenvector_sign` implementation.
**Source Trace:** `asd_mcda/v2/pca.py` (`canonicalize_eigenvector_sign`) & `asd_mcda/v2/metrics.py` (`construct_metric_tensor`)


## Question 40: You state $K$ is dynamically retained. If the threshold is 90% variance, and the components explain 40%, 30%, 19%, and 5%, a tiny perturbation could drop $K$ from 4 to 3. How does this discontinuity affect ranking stability?
**Attack Type:** Boundary condition of the dynamic $K$ threshold and subspace discontinuity
**Direct Answer:** A small perturbation pushing the cumulative variance across the threshold causes a discrete drop in dimensionality, abruptly changing the subspace geometry.
**Technical Defense:** The dynamic retention $K = \min \{ k : \sum_{i=1}^k \lambda_i / \sum \lambda \geq \theta \}$ is a step function. If a perturbation shifts the 3rd component to 21%, $K$ drops to 3. The 4th eigenvector $v_4$ is suddenly truncated, meaning the tensor $M_K$ collapses its rank by 1. Any distance separation previously provided by $v_4$ is zeroed out, which can instantaneously reorder candidates whose distinction relied on that axis.
**Limitation:** The strict threshold creates algorithmic fragility at the boundary; the top-1 ranking frequency could plummet if the dataset is natively near this eigenvalue edge.
**If Examiner Pushes Further:** Point to the Monte Carlo sensitivity analysis, which explicitly samples these perturbations to track the top-1 frequency. If the stability is low, it indicates the threshold boundary is being crossed frequently.
**Source Trace:** `asd_mcda/v2/pca.py` (`decompose_spectral`)

***


## Question 41: Why use a dynamic K based on $\geq 95\%$ cumulative variance rather than a fixed standard dimensionality across all molecular candidates?
**Attack Type:** Methodological consistency vs. statistical fidelity
**Direct Answer:** Fixing K imposes a uniform complexity prior on all drugs, which mathematically under-represents highly uncorrelated feature spaces and over-represents highly collinear ones, whereas a dynamic $\geq 95\%$ variance threshold guarantees a consistent level of information retention regardless of the underlying structural complexity.
**Technical Defense:** The covariance matrix $\Sigma$ for different drug profiles possesses vastly different spectra. If we fix $K=5$, a highly lipophilic compound might capture 99% of its variance, while a complex biologic might only capture 70%. By enforcing $\sum_{i=1}^K \lambda_i / \sum_{j=1}^N \lambda_j \geq 0.95$, we ensure the Mahalanobis distance approximations in the TOPSIS objective function $M_K$ operate on subspaces with equivalent informational density, preventing systemic bias toward simpler molecules.
**Limitation:** The 95% threshold is a heuristic scalar; capturing 95% of variance does not guarantee that the remaining 5% doesn't contain critical, highly specific mechanistic features (like a singular hydrogen bond donor requirement).
**If Examiner Pushes Further:** If asked about comparing scores between drugs with different K values, emphasize that the final SP-PRP-TOPSIS scores are normalized distances to the ideal solution within their respective $K$-dimensional subspaces, not absolute geometric distances in the original $\mathbb{R}^N$.
**Source Trace:** `asd_mcda/v2/pca.py` (`decompose_spectral`)


## Question 42: How do you justify the fact that K varies per drug? Doesn't this mean you are comparing candidates in completely different mathematical spaces?
**Attack Type:** Comparability boundary condition
**Direct Answer:** We are not directly comparing the geometric coordinates of different drugs; we are comparing their relative performance against an idealized synthetic target projected into each drug's mathematically optimal basis.
**Technical Defense:** The evaluation matrix maps the original feature vector $x \in \mathbb{R}^N$ to $y \in \mathbb{R}^{K_d}$ via the drug-specific projection matrix $V_{K_d}$. The synthetic ideal ($x^+$) and anti-ideal ($x^-$) vectors undergo the exact same projection $V_{K_d}^T x^+$. Thus, the relative closeness coefficient $\mathcal{C}$ is computed strictly within the valid $K_d$-dimensional subspace of that specific drug's covariance structure. The variation in $K$ reflects the intrinsic rank of the viable feature space, not an arbitrary dimensional shift.
**Limitation:** This projection assumes the ideal vector $x^+$ is well-represented in the retained $K$-dimensional subspace; if $x^+$ relies heavily on the discarded null space, the relative ranking degrades.
**If Examiner Pushes Further:** Direct them to the projection step in the MCDA pipeline where the ideal solutions are transformed using the exact same principal components derived from the drug's specific perturbation runs.
**Source Trace:** `asd_mcda/v2/engine.py` (`VariableKEngine.evaluate`) & `asd_mcda/v2/pca.py` (`decompose_spectral`)


## Question 43: Define the eigengap in the context of your PCA implementation and explain why its magnitude is critical to the validity of your retained subspace.
**Attack Type:** Mathematical derivation of stability
**Direct Answer:** The eigengap is the spectral difference between the last retained component and the first discarded component ($\delta_K = \lambda_K - \lambda_{K+1}$). Its magnitude measures the separation of the retained PCA subspace from discarded noise dimensions.
**Technical Defense:** In `asd_mcda/v2/stability.py` (`evaluate_subspace_stability`), the system computes $\delta_K = \lambda_K - \lambda_{K+1}$ from the sorted eigenvalues of the empirical correlation matrix and enforces project governance thresholds: $\delta_K \ge 0.10$ is STABLE, $0.03 \le \delta_K < 0.10$ issues a WARNING, and $\delta_K < 0.03$ raises `DegenerateSubspaceBlockedError` (BLOCKED). A robust eigengap ensures the retained subspace does not blur into discarded dimensions under input perturbations. The code implements these governance rules directly; it does not compute a runtime Davis-Kahan matrix norm.
**Limitation:** When all $p$ components are retained ($K=p$), no dimensions are discarded, so $\delta_K$ is unconditionally defined as $+\infty$ and stability status is STABLE.
**If Examiner Pushes Further:** Point to lines 70-98 in `asd_mcda/v2/stability.py` for the exact threshold evaluation and exception raising logic.
**Source Trace:** `asd_mcda/v2/stability.py` (`evaluate_subspace_stability`)


## Question 44: Why does the system trigger a governance block (`DegenerateSubspaceBlockedError`) when the eigengap is determined to be too low?
**Attack Type:** System constraint and boundary logic
**Direct Answer:** A critically low eigengap ($\delta_K < 0.03$) indicates a near-degenerate subspace boundary where retained and discarded variance components are statistically indistinguishable, prompting the system to halt execution via `DegenerateSubspaceBlockedError`.
**Technical Defense:** When $\delta_K = \lambda_K - \lambda_{K+1} < 0.03$, `evaluate_subspace_stability` raises `DegenerateSubspaceBlockedError`. Constructing the subspace metric tensor $M_K = V_K^T W V_K$ on a near-degenerate boundary would yield an unstable projection basis sensitive to arbitrary rotational shifts under minor input perturbation. The governance block halts execution because the resulting multi-criteria ranking would be computationally ill-conditioned, not because the drug molecule is chemically defective.
**Limitation:** The static $0.03$ threshold is a strict computational guardrail; a dataset with $\delta_K = 0.029$ is blocked even if the cumulative variance exceeds 95%.
**If Examiner Pushes Further:** Show the implementation in `asd_mcda/v2/stability.py` lines 87-91 where `DegenerateSubspaceBlockedError` is raised, and `asd_mcda/v2/uncertainty.py` lines 299-301 where this exception is counted in Monte Carlo under `block_counts["EIGENGAP_BLOCKED"]`.
**Source Trace:** `asd_mcda/v2/stability.py` (`evaluate_subspace_stability`), `asd_mcda/v2/exceptions.py` (`DegenerateSubspaceBlockedError`)


## Question 45: How does your Monte Carlo simulation account for changes in dynamic $K$ during stochastic perturbations?
**Attack Type:** Parameter consistency across perturbation iterations
**Direct Answer:** In active v2, $K$ is not artificially frozen; every Monte Carlo replicate is freshly re-evaluated through `VariableKEngine.evaluate()`, allowing dynamic $K$ re-selection and full stability governance per replicate.
**Technical Defense:** In `asd_mcda/v2/uncertainty.py` (`MonteCarloEngine.run`), every replicate independently executes cohort standardization, spectral decomposition, dynamic $K$ selection ($\ge 95\%$ variance), and eigengap governance without caching the baseline PCA basis. Replicates that encounter degenerate boundaries ($\delta_K < 0.03$) or non-reciprocal AHP matrices are caught and audited in `block_counts`. For valid replicates, the system records `valid_k_list` and computes `k_distribution` (for Indomethacin, $K=3$ holds across all 8,600 valid replicates). Closeness is rigorously summarized as conditioned $C_L \mid (K=k)$, while pooled $C_L$ is explicitly labeled as a descriptive heuristic.
**Limitation:** Re-evaluating PCA per replicate requires careful statistical interpretation across changing dimensionalities, which active v2 addresses by reporting conditioned closeness $C_L \mid (K=k)$ rather than naive pooling.
**If Examiner Pushes Further:** Direct them to `asd_mcda/v2/uncertainty.py` lines 280-305 and lines 368-382, which prove fresh re-evaluation and conditioned closeness summaries.
**Source Trace:** `asd_mcda/v2/uncertainty.py` (`MonteCarloEngine.run`), `asd_mcda/v2/engine.py` (`VariableKEngine.evaluate`)


## Question 46: In your tensor $M_K = V_K^T W V_K$, what are the mathematical consequences of a small eigengap on the resulting SP-PRP-TOPSIS ranking?
**Attack Type:** Error propagation through matrix operations
**Direct Answer:** A small eigengap causes high variance in the matrix $V_K$, which quadratically amplifies instability in the transformed weight tensor $M_K$, leading to erratic, unreliable drug rankings.
**Technical Defense:** Since the derivative of an eigenvector with respect to a matrix perturbation is inversely proportional to the eigengap ($\frac{\partial v_i}{\partial A} \propto \frac{1}{\lambda_i - \lambda_j}$), a small gap implies that $V_K$ is highly volatile. Because the transformed weight matrix $M_K$ relies on $V_K$ quadratically ($V_K^T W V_K$), the instability is squared. This means the Mahalanobis distance metric used to find the relative distance to the ideal solution will wildly fluctuate, rendering the final TOPSIS score highly sensitive to measurement noise.
**Limitation:** This instability is purely numerical; it does not necessarily mean the biological properties of the compound are volatile, only that our specific mathematical formulation cannot reliably quantify them.
**If Examiner Pushes Further:** Walk through the chain rule for the derivative of the TOPSIS distance with respect to the projection basis, explicitly highlighting the quadratic amplification factor.
**Source Trace:** `asd_mcda/v2/metrics.py` (`construct_metric_tensor`), `asd_mcda/v2/stability.py` (`evaluate_subspace_stability`)


## Question 47: You claim 95% variance is sufficient. What happens to the orthogonal projection of the weight vector $W$ if a critical evaluation criterion is completely isolated in the remaining 5% of the variance?
**Attack Type:** Boundary condition of feature independence
**Direct Answer:** If a critical criterion (like a highly specific toxicity flag) is entirely independent of the main variance structure, its corresponding weight will be projected out into the null space by $V_K^T$, effectively erasing its impact on the decision model.
**Technical Defense:** The projection $V_K^T W V_K$ relies on the criteria weights aligning, at least partially, with the principal components. If feature $j$ has variance perfectly orthogonal to the first $K$ eigenvectors, the $j$-th row of $V_K$ is a zero vector. Consequently, the weight $W_j$ vanishes in the $M_K$ representation. The TOPSIS algorithm will then rank the candidates as if criterion $j$ does not exist.
**Limitation:** This is a severe limitation of using unsupervised dimensionality reduction prior to supervised or weighted decision-making; PCA maximizes variance, not decision utility.
**If Examiner Pushes Further:** Acknowledge this flaw and state that this is exactly why governance gates exist *before* the MCDA pipeline (e.g., hard toxicity filters) rather than relying entirely on the aggregated continuous scoring.
**Source Trace:** `asd_mcda/v2/diagnostics.py` (`audit_truncation_discrepancy`) & `asd_mcda/v2/metrics.py`


## Question 48: Is a higher retained K inherently a better representation of the molecular candidate?
**Attack Type:** False premise on dimensionality
**Direct Answer:** No, a higher $K$ often degrades the model by incorporating the noise floor, which disrupts the distance calculations in the TOPSIS space.
**Technical Defense:** PCA orders components by variance, which ideally corresponds to signal-to-noise ratio. Components beyond the optimal $K$ primarily describe assay noise, experimental variance, and spurious correlations. Including these in $M_K = V_K^T W V_K$ introduces meaningless dimensions into the Euclidean distance calculation. Because Euclidean distance suffers in high dimensions (distance concentration), adding noisy dimensions compresses the relative differences between candidates and the ideal solution, degrading discriminatory power.
**Limitation:** The assumption that low-variance components are purely noise is empirically driven; in certain highly controlled environments, minor variance components might represent legitimate, subtle binding affinities.
**If Examiner Pushes Further:** Discuss the "curse of dimensionality" specifically in the context of distance metrics, and how the relative contrast between the best and worst candidates shrinks as noisy dimensions are added.
**Source Trace:** `asd_mcda/v2/pca.py` (`decompose_spectral`) & `asd_mcda/v2/diagnostics.py` (`audit_truncation_discrepancy`)


## Question 49: How do you differentiate between a dataset with distinct eigenvalues and a dataset with eigenvalues that are numerically close?
**Attack Type:** Computational precision vs. Governance significance
**Direct Answer:** Active v2 enforces explicit, hardcoded spectral gap thresholds ($\delta_K \ge 0.10$ for STABLE, $0.03 \le \delta_K < 0.10$ for WARNING, $\delta_K < 0.03$ for BLOCKED) implemented in `evaluate_subspace_stability`.
**Technical Defense:** In `asd_mcda/v2/stability.py`, the governance module directly evaluates the spectral gap at the truncation boundary $\delta_K = \lambda_K - \lambda_{K+1}$. If $\delta_K \ge 0.10$, the subspace is certified as STABLE. If $0.03 \le \delta_K < 0.10$, status is set to WARNING with a documented advisory that orientation may be perturbation-sensitive. If $\delta_K < 0.03$, it raises `DegenerateSubspaceBlockedError`, blocking automated ranking. These thresholds are defined governance standards, not dynamically fitted noise models.
**Limitation:** Fixed thresholds (0.10 and 0.03) provide uniform governance across cohorts but do not adapt to varying sample sizes $n$.
**If Examiner Pushes Further:** Point to `asd_mcda/v2/stability.py` lines 77-91 for the exact conditional branch structure.
**Source Trace:** `asd_mcda/v2/stability.py` (`evaluate_subspace_stability`)


## Question 50: If the system encounters a candidate cohort where the 95% variance threshold lands exactly in the middle of a degenerate subspace (eigengap near 0), how does the pipeline mathematically resolve this?
**Attack Type:** Edge case logic failure
**Direct Answer:** The pipeline does not mathematically resolve it; it explicitly hard-fails and raises `DegenerateSubspaceBlockedError` (BLOCKED status).
**Technical Defense:** In `asd_mcda/v2/stability.py` (`evaluate_subspace_stability`), the algorithm evaluates $\delta_K = \lambda_K - \lambda_{K+1}$ at the exact index $K$ where cumulative variance reaches $\ge 95\%$. If $\delta_K < 0.03$, indicating a near-degenerate subspace boundary, the system does not arbitrarily increment or decrement $K$. Instead, it raises `DegenerateSubspaceBlockedError`. In Monte Carlo simulation, this replicate is recorded under `block_counts["EIGENGAP_BLOCKED"]`.
**Limitation:** This strict guardrail halts automated ranking for datasets with clustered minor eigenvalues near the threshold, requiring manual cohort inspection.
**If Examiner Pushes Further:** Explain that in automated pharmaceutical triage, deterministic halting is vastly preferable to silently rotating an ill-conditioned subspace.
**Source Trace:** `asd_mcda/v2/stability.py` (`evaluate_subspace_stability`), `asd_mcda/v2/exceptions.py` (`DegenerateSubspaceBlockedError`)


## Question 51: You assert a strict reciprocal matrix structure where $a_{ij} = 1/a_{ji}$. How do you justify this mathematically when modeling non-commutative physical drug interactions where A's superiority to B does not necessarily imply B's exact inverse inferiority to A?
**Attack Type:** False premise on reciprocity
**Direct Answer:** The reciprocal structure is a mathematically imposed axiom to construct a positive reciprocal pairwise matrix, enabling principal eigenvector extraction, rather than a claim about physical non-commutativity.
**Technical Defense:** AHP requires a positive reciprocal matrix $A = (a_{ij})$ to guarantee that the principal eigenvalue $\lambda_{max}$ is real and non-negative (via the Perron-Frobenius theorem). If we dropped the $a_{ij} = 1/a_{ji}$ constraint to model asymmetric physical trade-offs, $A$ becomes a general asymmetric matrix. Its eigenspace could yield complex weights, which entirely breaks the real-valued tensor $M_K$ required for the downstream SP-PRP-TOPSIS.
**Limitation:** It forces a symmetric cognitive judgement on inherently asymmetric biochemical interactions.
**If Examiner Pushes Further:** Point to the eigenvalue solver. If they argue for asymmetric inputs, mathematically demonstrate that complex weights invalidate TOPSIS geometric distance metrics entirely.
**Source Trace:** `asd_mcda/v2/ahp.py` (`solve_ahp_preference`)


## Question 52: Your code extracts $\lambda_{max}$ to evaluate consistency. Prove why $\lambda_{max}$ must be greater than or equal to $n$, and explain what it means when it equals exactly $n$.
**Attack Type:** Derivation challenge on eigenvalues
**Direct Answer:** $\lambda_{max} \ge n$ is a fundamental property of positive reciprocal $n \times n$ matrices; it equals exactly $n$ if and only if the matrix is perfectly consistent ($a_{ij} a_{jk} = a_{ik}$).
**Technical Defense:** For a reciprocal matrix, the trace is exactly $n$ (since diagonals $a_{ii} = 1$). The sum of all eigenvalues equals the trace. By a theorem of Frobenius, a positive reciprocal matrix has a dominant real eigenvalue $\lambda_{max}$, and it can be shown that $\lambda_{max} \ge n$. When judgements are perfectly transitive, the rank of the matrix drops to 1, meaning the only non-zero eigenvalue is $\lambda_{max}$, which must therefore equal the trace $n$.
**Limitation:** It assumes linear transitivity of preferences, which humans rarely achieve in multi-dimensional feature spaces.
**If Examiner Pushes Further:** Derive the rank-1 matrix state: $a_{ij} = w_i/w_j$. Show that multiplying this matrix by the vector $w$ directly yields $n \cdot w$.
**Source Trace:** `asd_mcda/v2/ahp.py` (`solve_ahp_preference`)


## Question 53: The Consistency Index (CI) is defined as $(\lambda_{max} - n)/(n - 1)$. Why divide by $(n - 1)$? What artifact does this normalization attempt to hide?
**Attack Type:** Derivation challenge on scaling factors
**Direct Answer:** Division by $(n-1)$ normalizes the deviation of $\lambda_{max}$ from $n$ by the number of remaining eigenvalues, representing the average variance of the non-principal eigenvalues.
**Technical Defense:** Since the sum of all $n$ eigenvalues is $n$, the sum of the remaining $n-1$ eigenvalues is exactly $n - \lambda_{max}$. The average of these remaining eigenvalues is $(n - \lambda_{max}) / (n - 1)$. The negative of this average gives the Consistency Index. It is not hiding an artifact; it is directly measuring the mean magnitude of the non-principal spectral noise introduced by human intransitivity.
**Limitation:** It assumes the noise is uniformly distributed across the remaining $n-1$ eigenspace dimensions, which isn't guaranteed in highly skewed judgements.
**If Examiner Pushes Further:** Ask them to compute the trace of the matrix minus the principal eigenspace; demonstrate that the residual trace directly requires an $(n-1)$ averaging factor.
**Source Trace:** `asd_mcda/v2/ahp.py` (`solve_ahp_preference`, `RI_4`)


## Question 54: You rely on a pre-computed Random Index (RI) to calculate the Consistency Ratio (CR). This relies on Oak Ridge empirical simulations from the 1970s. Why didn't you analytically derive the expected value of CI for a random matrix?
**Attack Type:** Boundary condition on random baselines
**Direct Answer:** The expected value of $\lambda_{max}$ for a random reciprocal matrix populated with uniform integers from 1 to 9 does not have a closed-form analytic solution.
**Technical Defense:** The set of allowed matrix entries is discrete $(1/9, \dots, 1, \dots, 9)$. The characteristic polynomial for the eigenvalues involves sums of products of these discrete reciprocal variables. Because the distribution of the roots of such constrained random polynomials lacks a closed-form probability density function, the expected value $E[\lambda_{max}]$ must be approximated via Monte Carlo simulation, which is what Saaty originally did and what the standard RI tables represent.
**Limitation:** Standard RI tables use a uniform random distribution of Saaty scales, which does not reflect the actual prior distribution of biased human judgements in domain-specific tasks.
**If Examiner Pushes Further:** Challenge them to provide the exact integral for the expected dominant root of an $n$-degree polynomial with constrained discrete reciprocal coefficients.
**Source Trace:** `asd_mcda/v2/ahp.py` (`RI_4`)


## Question 55: Your AHP implementation is strictly locked to a 4x4 matrix for physical criteria. Why can't a user dynamically configure 5 or 6 criteria in the decision engine?
**Attack Type:** Boundary condition on matrix dimensionality
**Direct Answer:** The active v2 engine enforces a strict 4x4 criteria matrix matching `CANONICAL_CRITERIA_ORDER`, preventing arbitrary reordering and cognitive inconsistency degradation.
**Technical Defense:** In `asd_mcda/v2/models.py` and `asd_mcda/v2/engine.py`, `CANONICAL_CRITERIA_ORDER` is frozen as `("s_HSP", "s_chi", "s_desc", "s_GT")`. `VariableKEngine.evaluate` strictly asserts that the decision matrix has shape $(n, 4)$ and that criteria match this tuple. AHP consistency degrades rapidly as matrix dimension grows ($n(n-1)/2$ comparisons), where $n \ge 5$ compromises transitive consistency. Locking to the 4 canonical physical criteria maintains rigorous mathematical transitivity against the $RI_4 = 0.89$ benchmark.
**Limitation:** Formulations requiring specialized non-canonical criteria (e.g., biological permeability) cannot inject extra columns directly without architectural pipeline extension.
**If Examiner Pushes Further:** Show `asd_mcda/v2/engine.py` lines 106-116, where input dimension $p \neq 4$ or criteria reordering immediately raises a `ValueError`.
**Source Trace:** `asd_mcda/v2/models.py` (`CANONICAL_CRITERIA_ORDER`) & `asd_mcda/v2/engine.py` (`VariableKEngine.evaluate`)


## Question 56: Your system reports a CR of 0.07, and you claim this "validates" the expert's weighting of clearance versus toxicity. Explain why this claim is epistemically fraudulent.
**Attack Type:** False premise on epistemic truth
**Direct Answer:** A CR of 0.07 only validates that the expert's internal logic was mathematically transitive; it says absolutely nothing about whether those weights reflect physical reality.
**Technical Defense:** Consistency Ratio (CR) strictly measures the variance of the principal eigenvalue $\lambda_{max}$ from $n$. It is an assessment of pairwise transitivity (if A>B and B>C, then A>C). An expert could be perfectly, mathematically consistent in believing a completely lethal drug is optimal. The CR $< 0.10$ threshold (or stricter $< 0.08$) is a Class B validation of mathematical stability, not a validation of clinical efficacy.
**Limitation:** There is no built-in mechanism in AHP to detect mathematically consistent but scientifically incorrect judgements.
**If Examiner Pushes Further:** Concede immediately that AHP is a consensus-extraction algorithm, not an objective truth-discovery algorithm. Point to experimental assay as the only arbiter of physical truth.
**Source Trace:** `asd_mcda/v2/ahp.py` (`solve_ahp_preference`) & Authoritative Methodology Specification


## Question 57: You map physical domain expertise onto a 1-9 discrete Saaty scale. Physical variables like $IC_{50}$ scale logarithmically. How do you justify fitting exponential physical trade-offs into a linear cognitive integer scale?
**Attack Type:** Boundary condition on scaling mappings
**Direct Answer:** We don't. The 1-9 Saaty scale represents subjective *importance*, not the direct physical magnitude of the variables themselves.
**Technical Defense:** The AHP weighting phase establishes the governance policy (how much we care about toxicity vs efficacy). It does not measure the physical values; that is what the decision matrix in the downstream TOPSIS handles. The 1-9 scale operates on human intensity of preference. While $IC_{50}$ scales logarithmically in physical reality, human perception of risk/reward is bounded and often step-wise, which the discrete integer scale captures adequately for policy weighting.
**Limitation:** It risks compressing severe physical threshold effects (where a slight shift in a parameter causes sudden failure) into a mild "strongly preferred" cognitive bucket.
**If Examiner Pushes Further:** Emphasize the strict boundary between the subjective AHP weighting (policy space) and the objective SP-PRP-TOPSIS evaluation (physical space).
**Source Trace:** `asd_mcda/v2/ahp.py` (`solve_ahp_preference`)


## Question 58: You use the principal right eigenvector for weight extraction. Why use the eigenvector method instead of the computationally simpler logarithmic least squares or geometric mean of rows?
**Attack Type:** Derivation challenge on weight extraction
**Direct Answer:** The principal right eigenvector uniquely accounts for indirect interaction pathways in the judgement matrix, capturing systemic consistency that row-wise geometric means ignore.
**Technical Defense:** Raising the pairwise matrix $A$ to successive powers ($A^k$) calculates the dominance of criteria along paths of length $k$. By Perron-Frobenius, as $k \to \infty$, the columns of $A^k$ align with the principal right eigenvector. Therefore, the eigenvector represents the steady-state global dominance of each criterion, factoring in all indirect transitive relationships. The geometric mean only captures direct 1-step relationships.
**Limitation:** The eigenvector approach is highly sensitive to extreme outliers in a single pairwise judgement compared to logarithmic least squares.
**If Examiner Pushes Further:** Ask them to compute the limit of $A^k e / (e^T A^k e)$ and show that it strictly converges to the principal eigenvector space.
**Source Trace:** `asd_mcda/v2/ahp.py` (`solve_ahp_preference`)


## Question 59: Rank reversal is a well-known flaw in MCDA when new alternatives are added. How does your SP-PRP-TOPSIS formulation mathematically mitigate rank reversal?
**Attack Type:** Boundary condition on rank preservation
**Direct Answer:** Active v2 SP-PRP-TOPSIS uses absolute physical ideal ($s^+ = [1,1,1,1]$) and anti-ideal ($s^- = [0,0,0,0]$) reference points rather than cohort max/min, mitigating classical rank reversal.
**Technical Defense:** Classical TOPSIS defines ideal solutions dynamically as $A^+ = \max(x_{ij})$ and $A^- = \min(x_{ij})$ across the current candidate cohort, making distances dependent on cohort composition. In contrast, `standardize_cohort` in `asd_mcda/v2/standardization.py` defines $z^+ = (s^+ - \mu) / \sigma$ and $z^- = (s^- - \mu) / \sigma$ based on fixed absolute physical extremes $s^+ = 1.0$ and $s^- = 0.0$. These are projected into the subspace via `project_reference_points` ($t^+ = z^+ V_K, t^- = z^- V_K$). Distances evaluated via $M_K$ reference these fixed anchor projections.
**Limitation:** Cohort mean $\mu$ and standard deviation $\sigma$ still depend on the candidate cohort distribution, meaning extreme additions can slightly alter standardized coordinates.
**If Examiner Pushes Further:** Show `asd_mcda/v2/standardization.py` lines 44-55 and `asd_mcda/v2/metrics.py` lines 133-170, demonstrating that $s^+$ and $s^-$ are fixed physical endpoints.
**Source Trace:** `asd_mcda/v2/standardization.py` (`standardize_cohort`) & `asd_mcda/v2/metrics.py` (`project_reference_points`)


## Question 60: Prove the computational stability of your AHP weights. If a domain expert shifts a single judgement from 3 to 4, what is the mathematical guarantee on weight stability?
**Attack Type:** Derivation challenge on perturbation stability
**Direct Answer:** Stability is governed by the spectral properties of positive reciprocal matrices via Perron-Frobenius theory, and verified by the Consistency Ratio $CR < 0.08$ threshold in `solve_ahp_preference`.
**Technical Defense:** For a positive reciprocal pairwise matrix $A$, Perron-Frobenius theory guarantees that the maximum eigenvalue $\lambda_{max}$ is real, unique, and strictly positive, with an associated strictly positive eigenvector. In `asd_mcda/v2/ahp.py` (`solve_ahp_preference`), the principal eigenvector is extracted via eigendecomposition and normalized such that $\sum w_i = 1$. The system computes $CI = (\lambda_{max} - 4) / 3$ and $CR = CI / 0.89$. For Indomethacin, documented weights are $[0.407675, 0.324433, 0.092161, 0.175730]$ with $\lambda_{max} = 4.131937$, $CI = 0.043979$, and $CR = 0.049415$. A shift from 3 to 4 in a single entry will perturb weights smoothly, provided $CR < 0.08$ is maintained; if consistency degrades beyond threshold, the matrix is rejected.
**Limitation:** Highly inconsistent pairwise matrices can produce volatile eigenvectors; enforcing $CR < 0.08$ is essential to prevent ill-conditioned weight vectors.
**If Examiner Pushes Further:** Direct them to `solve_ahp_preference` in `asd_mcda/v2/ahp.py` lines 50-95 for the exact eigenvalue extraction and consistency verification logic.
**Source Trace:** `asd_mcda/v2/ahp.py` (`solve_ahp_preference`)


## Question 61: The Mahalanobis-like Metric Derivation
**Attack Type:** Mathematical derivation challenge
**Direct Answer:** The weight tensor $M_K = V_K^T W V_K$ maps the original attribute weighting scheme into the $K$-dimensional principal component space, creating a generalized distance metric rather than a simple Euclidean space.
**Technical Defense:** By substituting the PC projection $X_K = X_{std} V_K$ into the weighted distance formulation, the diagonal weight matrix $W$ is sandwiched by the loading matrix $V_K$. Because $W$ is diagonal with strictly positive AHP-derived weights and $V_K$ has orthonormal columns, the resulting inner matrix $M_K$ represents the quadratic form for distance in the reduced space, correctly preserving the original attribute importance distributions across the retained components.
**Limitation:** This assumes that the linear combination of weights inside the principal components meaningfully preserves the decision-maker's original intent, which can become obscured if highly weighted attributes load heavily onto discarded (non-retained) components.
**If Examiner Pushes Further:** If asked about the loss of orthogonality, confirm that $M_K$ is generally non-diagonal. This means the SP-PRP-TOPSIS distance calculation explicitly accounts for the "crosstalk" between principal components induced by the weighting matrix, which is exactly why a standard Euclidean TOPSIS in PC space fails.
**Source Trace:** `asd_mcda/v2/metrics.py` (`construct_metric_tensor`)


## Question 62: Positive Definiteness of the Distance Tensor
**Attack Type:** Matrix property verification
**Direct Answer:** $M_K$ is guaranteed to be positive definite because $W$ is a diagonal matrix of strictly positive weights, and $V_K$ is a full-rank matrix (by definition of PCA).
**Technical Defense:** For any non-zero vector $y \in \mathbb{R}^K$, $y^T M_K y = y^T (V_K^T W V_K) y = (V_K y)^T W (V_K y)$. Since $V_K$ has full column rank, $x = V_K y$ is non-zero. Since $W$ has strictly positive diagonal entries, $x^T W x > 0$. Thus, $M_K$ is positive definite, ensuring that all computed SP-PRP distances are strictly non-negative and satisfy the identity of indiscernibles.
**Limitation:** If any attribute weight in $W$ were permitted to be exactly zero, $M_K$ would only be positive semi-definite, potentially resulting in zero distance between distinct alternatives.
**If Examiner Pushes Further:** If they question numerical stability, note that while positive definiteness is mathematically guaranteed, ill-conditioned $W$ (extreme weight differences) could cause near-singularity in finite precision floating-point arithmetic.
**Source Trace:** `asd_mcda/v2/metrics.py` (`construct_metric_tensor`, `NonPositiveDefiniteMetricError`)


## Question 63: Abandonment of Euclidean TOPSIS
**Attack Type:** Baseline methodology justification
**Direct Answer:** Standard Euclidean TOPSIS assumes orthogonal axes and applies weights linearly to each dimension, which fundamentally fails when the dimensions themselves are principal components derived from correlated original attributes.
**Technical Defense:** If we applied standard Euclidean TOPSIS on the PCA scores, we would have to either ignore the AHP weights or attempt to apply them directly to the PCs. Applying weights to PCs is mathematically invalid because the PCs are linear combinations of the original attributes; there is no 1-to-1 mapping. SP-PRP-TOPSIS uses the $M_K$ tensor to project the weights through the PC loadings, modifying the geometry of the space itself to calculate distances.
**Limitation:** The computational complexity is slightly higher as we evaluate a full quadratic form for every distance calculation instead of a simple sum of squared differences.
**If Examiner Pushes Further:** If they ask why not just use Euclidean TOPSIS on the original normalized data, explain that the dimensionality (1000s of variables) makes distance metrics meaningless due to the curse of dimensionality (distances concentrate), which necessitates the PCA reduction first.
**Source Trace:** `asd_mcda/v2/metrics.py` (`construct_metric_tensor`, `compute_distances_and_closeness`)


## Question 64: Absolute Ideal vs. Relative Ideal
**Attack Type:** Boundary condition construction
**Direct Answer:** Unlike standard TOPSIS which builds ideals from the max/min of the current dataset, SP-PRP-TOPSIS defines absolute theoretical bounds ($z^+=1$, $z^-=0$) in the normalized space.
**Technical Defense:** Because the input data is min-max normalized to $[0, 1]$ *before* PCA and weighting, the theoretical maximum possible value for any attribute is strictly 1, and the minimum is 0. Projecting these absolute vectors of 1s and 0s through $V_K$ defines the ideal and anti-ideal points. This prevents the moving-target problem (rank reversal) where the addition of a new alternative shifts the ideal points and alters the distances for existing alternatives.
**Limitation:** The absolute ideal point $z^+=1$ might represent an unphysical compound (e.g., maximum efficacy, zero toxicity, infinite solubility simultaneously), meaning the shortest distance is bounded away from zero.
**If Examiner Pushes Further:** If asked how the projection works, detail that the vector of 1s (ideal) is multiplied by $V_K$ to locate the ideal point in the $K$-dimensional space. The distance to this point is then measured using the $M_K$ metric.
**Source Trace:** `asd_mcda/v2/standardization.py` (`standardize_cohort`) & `asd_mcda/v2/metrics.py` (`project_reference_points`)


## Question 65: The Closeness Coefficient ($C_L$) Formulation
**Attack Type:** Ranking metric validity
**Direct Answer:** The closeness ratio $C_{L,i} = D_i^- / (D_i^+ + D_i^-)$ elegantly scales the distance from the anti-ideal relative to the total distance spread between the ideal and anti-ideal points.
**Technical Defense:** By utilizing the SP-PRP distances ($D_i^+$ using $M_K$ to $z^+$, and $D_i^-$ using $M_K$ to $z^-$), the ratio normalizes the score strictly to the $[0, 1]$ interval. A higher $C_L$ indicates the alternative is further from the worst-case scenario and closer to the best-case. This formulation provides a unified scalar ranking that simultaneously penalizes poor performance on highly weighted attributes and rewards good performance, driven entirely by the geometric topology defined by $M_K$.
**Limitation:** The coefficient assumes that distance from the anti-ideal and distance to the ideal trade off linearly in the denominator, which may mask specific critical failures if an alternative is moderately far from both.
**If Examiner Pushes Further:** If challenged on alternative ranking equations (like shifted ratios), clarify that the standard formulation is retained because the absolute bounds ($z^+, z^-$) guarantee stability, so complex localized penalty ratios are mathematically unnecessary.
**Source Trace:** `asd_mcda/v2/metrics.py` (`compute_distances_and_closeness`)


## Question 66: Denominator Zero Safeguard
**Attack Type:** Numerical stability edge case
**Direct Answer:** A denominator of zero in the $C_L$ calculation can only occur if an alternative simultaneously perfectly matches both the absolute ideal and absolute anti-ideal, which is geometrically impossible.
**Technical Defense:** The denominator is $D_i^+ + D_i^-$. Since $M_K$ is positive definite, $D_i = 0$ if and only if the alternative perfectly equals the reference point. Because $z^+$ (all 1s) and $z^-$ (all 0s) are separated by a Euclidean distance of $\sqrt{N}$ in the original space, their projections in the PC space are strictly distinct. Therefore, no alternative $i$ can satisfy $D_i^+ = 0$ AND $D_i^- = 0$. The denominator is strictly positive, guaranteeing numerical stability.
**Limitation:** While exactly zero is impossible, severe floating-point underflow could theoretically occur if the precision limit is reached, though the normalization scale $[0,1]$ prevents this in practical float64 implementations.
**If Examiner Pushes Further:** If they suggest a case where $V_K$ collapses both points to the same location, demonstrate that $V_K$ is derived from PCA and represents the directions of maximum variance; it cannot map the extremes of the unit hypercube to a single point unless variance is zero, which halts the pipeline earlier.
**Source Trace:** `asd_mcda/v2/metrics.py` (`compute_distances_and_closeness`, `DegenerateReferenceCoincidenceError`)


## Question 67: Invariance to Translation
**Attack Type:** Metric property challenge
**Direct Answer:** The distance quadratic form $(x - y)^T M_K (x - y)$ is strictly invariant to translations in the PC space, but the ranking metric $C_L$ is sensitive to translation because the ideal points are fixed.
**Technical Defense:** If we shift all data points by a constant vector $c$, the distance between any two alternatives $i, j$ remains identically $(x_i - x_j)^T M_K (x_i - x_j)$. However, TOPSIS evaluates distance to fixed absolute anchors ($z^+, z^-$). Therefore, translating the dataset shifts the points relative to these anchors, intentionally changing the $C_L$ scores. This is desired behavior: global shifts in performance should alter the absolute ranking score.
**Limitation:** The method depends critically on the initial min-max normalization bound anchors. If the theoretical boundaries are improperly defined (e.g., using observed min/max instead of theoretical), the translation invariance is broken during the bounds definition itself.
**If Examiner Pushes Further:** If they ask about rotational invariance, state that the $M_K$ metric is *not* invariant to arbitrary rotations, because the AHP weight matrix $W$ relies on the specific physical alignment of the original attribute axes.
**Source Trace:** `asd_mcda/v2/standardization.py` (`standardize_cohort`) & `asd_mcda/v2/metrics.py` (`compute_distances_and_closeness`)


## Question 68: The Triangle Inequality in SP-PRP Space
**Attack Type:** Topological constraint
**Direct Answer:** The SP-PRP metric strictly satisfies the triangle inequality because it is derived from an inner product space defined by the symmetric, positive-definite tensor $M_K$.
**Technical Defense:** Since $M_K = V_K^T W V_K$ is positive definite, we can define a matrix square root $R = M_K^{1/2}$. The distance calculation can then be written as $D(x,y) = \sqrt{(x-y)^T R^T R (x-y)} = ||R(x-y)||_2$. Since this is equivalent to the standard Euclidean distance evaluated on linearly transformed vectors, all metric space axioms, including the triangle inequality $D(x,z) \le D(x,y) + D(y,z)$, strictly hold.
**Limitation:** While mathematically satisfying the triangle inequality, the "shortest path" through this space has no physical counterpart (e.g., we cannot synthesize a drug that traverses the space directly).
**If Examiner Pushes Further:** If asked to prove symmetry, point out that $M_K^T = (V_K^T W V_K)^T = V_K^T W^T V_K = V_K^T W V_K = M_K$, hence the distance is symmetric $D(x,y) = D(y,x)$.
**Source Trace:** `asd_mcda/v2/metrics.py` (`construct_metric_tensor`, `compute_distances_and_closeness`)


## Question 69: Impact of Discarded Principal Components
**Attack Type:** Information loss vector
**Direct Answer:** Information discarded by truncating to $K$ components is strictly excluded from the SP-PRP distance calculation, meaning differences between alternatives occurring entirely in the null space of $V_K$ result in zero distance variation.
**Technical Defense:** The full weight matrix $W$ is $N \times N$, while $M_K$ is $K \times K$. By utilizing only $V_K$ (the first $K$ eigenvectors), we implicitly project the data onto a lower-dimensional subspace. If two alternatives differ only in original attributes that load exclusively onto components $K+1$ to $N$, their projections in the $K$-dimensional space are identical. Consequently, the SP-PRP metric evaluates their distance as exactly zero, treating them as indiscernible.
**Limitation:** If a highly weighted AHP attribute has low overall variance across the dataset, PCA might push it into a discarded component, causing the SP-PRP metric to completely ignore a critical decision criterion.
**If Examiner Pushes Further:** If pressed on how to detect this, explain that the algorithm logs the explained variance ratio and the loading matrix. A severe mismatch between AHP weight rank and PCA component loading magnitude triggers a Class B limitation flag.
**Source Trace:** `asd_mcda/v2/diagnostics.py` (`audit_truncation_discrepancy`)


## Question 70: Metric Sensitivity to the Eigenvector Signs
**Attack Type:** Mathematical consistency
**Direct Answer:** The SP-PRP distance calculation and the resulting $C_L$ scores are strictly invariant to the arbitrary sign flips inherent in PCA eigenvectors.
**Technical Defense:** PCA eigenvectors are unique only up to a sign change ($\pm v$). If the sign of the $k$-th column of $V_K$ flips, the corresponding $k$-th score for every projected data point $X_K$ and ideal point also flips sign. In the quadratic form $D^2 = \Delta x^T M_K \Delta x$, $M_K = V_K^T W V_K$. A sign flip in a column of $V_K$ negates the corresponding row and column of $M_K$. Because $\Delta x$ also undergoes the same sign flip in the $k$-th position, the two negations cancel out perfectly in the scalar product.
**Limitation:** While the distance computation is mathematically invariant, interpretive visualizations of the PC space or the loading matrix must account for these arbitrary signs to avoid misinterpretation of directionality.
**If Examiner Pushes Further:** Write out the element-wise sum $D^2 = \sum_i \sum_j \Delta x_i (M_K)_{i,j} \Delta x_j$. If dimension $i$ flips sign, $\Delta x_i \to -\Delta x_i$ and $(M_K)_{i,j} \to -(M_K)_{i,j}$, meaning the term $(-\Delta x_i)(-(M_K)_{i,j})\Delta x_j$ remains identical.
**Source Trace:** `asd_mcda/v2/pca.py` (`canonicalize_eigenvector_sign`) & `asd_mcda/v2/metrics.py` (`construct_metric_tensor`, `compute_distances_and_closeness`)

***


## Question 71: You refer to your Monte Carlo outputs as representing "uncertainty." Are you claiming these distributions reflect the standard error of experimental measurement?
**Attack Type:** Epistemic boundary definition
**Direct Answer:** No, the Monte Carlo distributions represent computational sensitivity to input perturbation, not calibrated experimental error.
**Technical Defense:** The model injects independent Gaussian noise to evaluate the topological stability of the SP-PRP-TOPSIS ranking vector. It answers the question: "How much does the math change if the inputs shift?" rather than "What is the physical likelihood of the in-vivo properties shifting?" Experimental variance requires historical wet-lab calibration, whereas this MC approach is strictly a stress-test of the decision-theoretic architecture.
**Limitation:** Because the perturbations are purely mathematical, the resulting variance cannot be used to estimate clinical or physical failure rates.
**If Examiner Pushes Further:** If asked why bother doing MC at all, explain that MCDA models are notoriously brittle to boundary-case inputs. The MC isolates candidates whose high rankings are artifacts of precise point-estimates rather than robust multi-dimensional dominance.
**Source Trace:** `asd_mcda/v2/uncertainty.py` (`MonteCarloEngine.run`)


## Question 72: You fixed $\sigma_{score} = 0.05$ for all performance metrics. Why this exact scalar, and doesn't applying a uniform variance dangerously ignore the fact that some properties (like clearance) are much harder to predict than others (like molecular weight)?
**Attack Type:** Homogeneous perturbation challenge
**Direct Answer:** The $\sigma = 0.05$ scalar is a standardized mathematical perturbation designed to test algorithmic threshold sensitivity, not a reflection of predictive heteroscedasticity.
**Technical Defense:** If we applied variable $\sigma$ based on assay confidence, the MC output would conflate predictive uncertainty with algorithmic stability. By standardizing the perturbation radius at 5% of the normalized [0,1] range across the entire $V_K$ matrix, the top-1 frequency purely isolates the geometric isolation of a candidate in the PCA-reduced space. The goal is to see which rankings survive a uniform noise floor.
**Limitation:** This uniform noise floor fails to penalize candidates that rely heavily on highly uncertain biological predictions compared to high-confidence physicochemical ones.
**If Examiner Pushes Further:** Point to the $\mu^*$ sensitivity analysis. If an examiner demands heteroscedastic noise, argue that variance mapping should be handled by updating the base decision matrix prior to the MCDA pipeline, keeping the MCDA sensitivity module strictly focused on rank robustness.
**Source Trace:** `asd_mcda/v2/uncertainty.py` (`_sample_truncated_normal_scores`)


## Question 73: Your AHP noise parameter is $\sigma_{AHP} = 0.15$. Are you perturbing the final synthesized weights, or the pairwise comparison matrix, and how does this affect the Consistency Ratio (CR)?
**Attack Type:** Matrix algebra and consistency validity
**Direct Answer:** We perturb the judgments in the original pairwise comparison matrix prior to calculating the principal eigenvector, which inherently alters the Consistency Ratio for every iteration.
**Technical Defense:** Perturbing the final weights directly would violate the structural hierarchy of AHP. By applying noise to the off-diagonal elements $a_{ij}$ (and enforcing $a_{ji} = 1/a_{ij}$), we simulate a decision-maker's cognitive drift. The $\sigma = 0.15$ shift means the matrix will occasionally generate a CR > 0.10. This mathematically proves that our stability metric incorporates the risk of the decision framework itself breaking down due to inconsistent prioritization.
**Limitation:** Log-normal perturbations would be mathematically superior for ratio scales to prevent zero-crossing, whereas standard Gaussian noise requires artificial truncation.
**If Examiner Pushes Further:** Walk through the recalculation of the principal eigenvalue $\lambda_{max}$ per iteration. Show that rank collapse in MC often stems from the eigenvector shifting wildly when the perturbed matrix approaches singularity.
**Source Trace:** `asd_mcda/v2/uncertainty.py` (`_perturb_ahp_matrix_log_space`)


## Question 74: Out of 10,000 Monte Carlo runs, 1,400 were blocked. Are you claiming that in 14% of scenarios, the molecule enters a physically impossible state?
**Attack Type:** Governance mechanism vs Physical reality
**Direct Answer:** No. The 1,400 blocked runs represent computational governance constraint violations, comprising exactly 1,396 AHP consistency failures ($CR \ge 0.08$) and 4 eigengap stability failures ($\delta_K < 0.03$).
**Technical Defense:** In `asd_mcda/v2/uncertainty.py` (`MonteCarloEngine.run`), every replicate is evaluated against strict governance filters. For the Indomethacin benchmark ($N=10000$), 8,600 replicates are VALID ($N_{valid} = 8600$) and 1,400 are BLOCKED ($N_{blocked} = 1400$). The block breakdown recorded in `block_reasons_histogram` is exactly: `AHP_CR_BLOCKED`: 1,396 (pairwise perturbation shifted $CR \ge 0.08$), and `EIGENGAP_BLOCKED`: 4 (criteria perturbation shifted eigengap $\delta_K < 0.03$, raising `DegenerateSubspaceBlockedError`). These reflect mathematical governance guardrails, not physical molecular breakdowns.
**Limitation:** Hard binary cutoffs in the governance layer discard replicates that exceed risk-tolerance boundaries, preserving mathematical conditioning at the cost of truncating extreme parameter tails.
**If Examiner Pushes Further:** Emphasize the exact block count: 1,396 AHP consistency rejections and 4 eigengap rejections. This demonstrates that judgment transitivity is more sensitive to perturbation than spectral subspace stability.
**Source Trace:** `asd_mcda/v2/uncertainty.py` (`MonteCarloEngine.run`)


## Question 75: Your top-1 frequency is calculated with a denominator of 8,600 valid runs ($N_{valid}$), ignoring the 1,400 blocked runs. Doesn't this mathematically inflate the stability of candidates that frequently fail governance?
**Attack Type:** Denominator bias and normalization logic
**Direct Answer:** No, because candidates that trigger a governance block are assigned a terminal utility of zero for that iteration, preventing them from achieving top-1 status.
**Technical Defense:** Calculating top-1 frequency over $N_{valid}$ normalizes the relative dominance of the surviving candidates conditional on the project remaining viable. If a candidate is blocked, it inherently loses that round. Normalizing over 8,600 simply tells us: "Given that the portfolio hasn't failed administrative rules, how often is Candidate X the mathematical winner?" It isolates competitive dominance from governance survival.
**Limitation:** By separating the metrics, a user must manually inspect both the survival rate and the conditional top-1 frequency; a combined expected-utility metric might offer a more unified ranking.
**If Examiner Pushes Further:** Defend the separation of metrics. Conflating governance survival with TOPSIS distance creates a mathematically opaque single scalar where you can't tell if a drug lost because it was mediocre, or because it was toxic.
**Source Trace:** `asd_mcda/v2/uncertainty.py` (`MonteCarloEngine.run`)


## Question 76: A candidate achieves a 94% top-1 frequency in the Monte Carlo simulation. Does this mean it has a 94% probability of clinical success?
**Attack Type:** Probabilistic overreach
**Direct Answer:** Absolutely not. A 94% top-1 frequency means the candidate's mathematical superiority in the SP-PRP-TOPSIS space is highly insulated against a 5% input noise floor.
**Technical Defense:** Top-1 frequency measures algorithmic stability. It indicates that the candidate's projection in the $M_K = V_K^T W V_K$ quadratic space is far enough away from its nearest neighbors that a perturbation vector drawn from $\mathcal{N}(0, \sigma^2)$ rarely changes the sign of their relative distance. It is purely a measure of geometric isolation in the tensor space.
**Limitation:** Algorithmic stability does not correlate with biological efficacy. A candidate could be robustly selected by the model while being completely ineffective in-vivo if the base data is systematically wrong.
**If Examiner Pushes Further:** If the examiner accuses you of misleading stakeholders, heavily emphasize that the documentation defines top-1 frequency as "Robustness against parameter uncertainty," strictly enforcing Class B validation (Documented Environment Limitation).
**Source Trace:** `asd_mcda/v2/uncertainty.py` (`CandidateMCOutputRecord.p_top1`)


## Question 77: Under Monte Carlo, Candidate A beats Candidate B in the base case, but B has a higher top-1 frequency. Which one is the "better" drug according to your framework?
**Attack Type:** Rank reversal interpretation
**Direct Answer:** The framework designates Candidate B as the superior choice due to its higher topological resilience, treating the base case as an overfitted point estimate.
**Technical Defense:** If A wins the base case but B dominates the MC iterations, it implies A's victory was hypersensitive to the exact coordinates of the unperturbed matrix. B possesses a broader "basin of attraction" in the decision space. Since our inputs are inherently estimations, a candidate that requires absolute precision to maintain its rank is computationally fragile. B's higher top-1 frequency proves its dominance integrates over a wider volume of plausible scenarios.
**Limitation:** Relying purely on volume of integration ignores the severity of failure; B might win more often, but when it loses, its TOPSIS distance to the negative ideal solution might be catastrophic.
**If Examiner Pushes Further:** Discuss the difference between the mean rank and top-1 frequency. Offer to show the full rank-distribution histograms to prove that B's distribution is tighter and more right-skewed than A's.
**Source Trace:** `asd_mcda/v2/uncertainty.py` (`MonteCarloEngine.run`)


## Question 78: When perturbing boundary values, like a score of 0.98 with a $\sigma = 0.05$, how do you handle values exceeding 1.0, and doesn't this induce a truncation bias?
**Attack Type:** Distributional skew at boundaries
**Direct Answer:** The implementation generates perturbation samples within the $[0,1]$ domain using a truncated normal and applies an explicit `np.clip(..., 0.0, 1.0)` operation before downstream evaluation, preventing sampled values from exceeding 1.0.
**Technical Defense:** In `_sample_truncated_normal_scores` (`asd_mcda/v2/uncertainty.py`), scores are sampled using `scipy.stats.truncnorm` with `a_param = (0.0 - base_scores) / sigma_score` and `b_param = (1.0 - base_scores) / sigma_score`, followed by `np.clip(samples, 0.0, 1.0, out=samples)`. This ensures all sampled values strictly reside within $[0.0, 1.0]$. For a score of 0.98 with $\sigma = 0.05$, the truncated normal distribution naturally redistributes density within the unit interval. The defensive clipping guards against floating-point epsilon leakage without allowing scores to leave the valid criteria domain.
**Limitation:** Truncated sampling near 1.0 inherently yields an empirical sample mean slightly below the unperturbed baseline coordinate; this boundary compression is an understood mathematical property of domain-bounded perturbations.
**If Examiner Pushes Further:** Explain that constraining scores to $[0, 1]$ is essential because unconstrained scores outside $[0.0, 1.0]$ would violate the physical bounds of the criteria definitions and could distort standardized coordinate geometry.
**Source Trace:** `asd_mcda/v2/uncertainty.py` (`_sample_truncated_normal_scores`)


## Question 79: If both the AHP pairwise matrix and the raw performance scores are perturbed simultaneously, how do you mathematically distinguish which source is driving a rank collapse?
**Attack Type:** Confounding variance attribution
**Direct Answer:** The Monte Carlo simulation alone cannot distinguish the sources; we rely on the independent Morris $\mu^*$ elementary effects to decouple weight sensitivity from score sensitivity.
**Technical Defense:** The joint MC perturbation simulates the real-world scenario of simultaneous parameter drift, giving us the global top-1 frequency. To isolate algorithmic sensitivity, we run a separate variance-based sensitivity analysis (Morris method). The MC gives us the joint probability of failure, while the Morris $\mu^*$ gradients map exactly how much the derivative of the TOPSIS score depends on $\partial W$ versus $\partial V_K$.
**Limitation:** The current framework does not track interaction terms between specific AHP weights and specific performance scores during the joint MC simulation.
**If Examiner Pushes Further:** Explain that tracking the full covariance matrix of rank shifts across 10,000 iterations for every parameter pair would scale at $O(N^2)$, which is computationally prohibitive and unnecessary for a first-pass triage tool.
**Source Trace:** `asd_mcda/v2/uncertainty.py` (`MonteCarloEngine.run`) & `asd_mcda/v2/sensitivity.py` (`run_morris_sensitivity`)


## Question 80: You state that the top-1 frequency evaluates "algorithmic stability." If a candidate has high stability but a low base-case score, what does this mathematically imply about its location in the PCA space?
**Attack Type:** Geometric interpretation of stability
**Direct Answer:** It implies the candidate is situated in an isolated, low-density region of the PCA space far from the ideal solution, making it consistently mediocre regardless of perturbation.
**Technical Defense:** Stability is strictly a measure of variance, not magnitude. A candidate with low variance but a low mean SP-PRP-TOPSIS score is mathematically trapped near the negative ideal solution ($A^-$). Its coordinates in the $M_K$ tensor space are not contested by nearby neighbors. The noise vector $\epsilon$ is too small to push it into a competitive region, proving that it is a robustly bad candidate.
**Limitation:** High stability can easily be misinterpreted by end-users as a positive endorsement, requiring strict UI guardrails to prevent users from selecting stable but poor-performing candidates.
**If Examiner Pushes Further:** Show how the framework plots Base Score (y-axis) vs Top-1 Frequency (x-axis). The ideal drug is in the top-right quadrant. A drug in the bottom-right quadrant is effectively a "dead certainty"—it is mathematically proven to fail under all simulated conditions.
**Source Trace:** `asd_mcda/v2/metrics.py` (`compute_distances_and_closeness`) & `asd_mcda/v2/uncertainty.py`

***


## Question 81: In Section 5.2, you highlight that parameter X has the highest $\mu^*$ value and conclude it is the main driver of outcome variance. Isn't this a fundamental misuse of the Morris method, which does not compute variance contributions?
**Attack Type:** False premise / Methodological misinterpretation
**Direct Answer:** The critique is correct regarding the terminology; $\mu^*$ measures the mean absolute elementary effect, establishing the magnitude of the model's sensitivity to parameter X, not its fractional contribution to global output variance.
**Technical Defense:** Unlike Sobol indices which decompose actual variance $V(Y)$, the Morris $\mu^*$ computes $\frac{1}{r} \sum_{i=1}^r |EE_i|$. It bounds the maximum influence of the parameter across the One-At-a-Time (OAT) trajectories. We rely on $\mu^*$ strictly to screen and rank parameter influence on the final SP-PRP-TOPSIS evaluations, explicitly avoiding causal variance claims.
**Limitation:** Because $\mu^*$ only screens for magnitude, the framework cannot quantify the exact percentage of rank reversal variance caused by parameter X without running a computationally prohibitive variance-based decomposition.
**If Examiner Pushes Further:** If asked why Sobol wasn't used, point out the exponential computational cost given that the dynamic PCA retention must be recalculated at every perturbation step. For identifying the most sensitive governance parameters, absolute elementary effects provide sufficient screening fidelity.
**Source Trace:** `asd_mcda/v2/sensitivity.py` (`run_morris_sensitivity`, `mu_star`)


## Question 82: Your results show a massive $\sigma$ value for the environmental weighting parameters in the Morris screening. Does this mean the experimental literature supporting these weights is highly uncertain and flawed?
**Attack Type:** Epistemic boundary / Variable conflation
**Direct Answer:** No, the Morris $\sigma$ does not measure physical measurement error or literature uncertainty; it represents the standard deviation of the parameter's elementary effects across different points in the decision space.
**Technical Defense:** A high Morris $\sigma$ mathematically demonstrates that the parameter's influence on the final rank is highly non-linear or strongly interacts with other parameters. Within the $M_K = V_K^T W V_K$ quadratic form, changing an environmental weight propagates through the dynamic PCA basis differently depending on the fixed coordinates of the other criteria in a given trajectory.
**Limitation:** The Morris $\sigma$ cannot isolate *which* specific interacting parameter is causing the fluctuation; it only flags that the parameter does not act in simple, independent isolation.
**If Examiner Pushes Further:** Write out the calculation $\sigma = \sqrt{\frac{1}{r} \sum (EE_i - \mu)^2}$. Strictly differentiate this Morris $\sigma$ from the Monte Carlo perturbation $\sigma$, which is an input noise parameter used to evaluate computational stability.
**Source Trace:** `asd_mcda/v2/sensitivity.py` (`run_morris_sensitivity`, `sigma`)


## Question 83: How do you justify your Morris screening trajectory count and grid resolution for evaluating criteria sensitivity?
**Attack Type:** Boundary condition / Sampling adequacy
**Direct Answer:** Active v2 uses $r=10$ completed trajectories with $p=4$ grid levels and step size $\Delta = 2/3$ across 26 factors (31 attempted, 10 completed, 21 discarded), providing computationally efficient elementary effect screening.
**Technical Defense:** In `asd_mcda/v2/sensitivity.py` (`run_morris_sensitivity`), the Morris engine implements the radial OAT sampling strategy with $p=4$ grid levels and $\Delta = p / (2(p-1)) = 2/3$. Across 26 input factors, 31 trajectories are attempted and 10 completed ($r=10$), while 21 are discarded to enforce trajectory orthogonality and boundary compliance. This yields $r(k+1) = 10 \times 27 = 270$ model evaluations, successfully estimating $\mu^*$ (mean absolute elementary effect) and $\sigma$ (dispersion) without exponential combinatorial cost.
**Limitation:** Coarse grid levels ($p=4$) can miss highly localized non-linear interaction spikes that occur between grid intervals.
**If Examiner Pushes Further:** Point to lines in `asd_mcda/v2/sensitivity.py` defining `num_grid_levels=4` and `delta = 4.0 / (2.0 * 3.0) = 2/3`, confirming the exact documented parameters.
**Source Trace:** `asd_mcda/v2/sensitivity.py` (`run_morris_sensitivity`)


## Question 84: In your Morris implementation, standard grid jumps might create impossible combinations of criteria values before the PCA step. Doesn't this mean you are evaluating the sensitivity of a mathematically degenerate, unphysical space?
**Attack Type:** Structural assumption / Mathematical derivation
**Direct Answer:** Yes, the orthogonal grid jumps evaluate the mathematical sensitivity of the algorithmic model across its continuous bounds, regardless of the physical likelihood of those exact coordinate combinations.
**Technical Defense:** Morris assumes completely independent input variables to isolate elementary effects. If variables like material density and yield strength are physically correlated, an orthogonal jump might test a low-density/high-strength anomaly. However, the purpose of this analysis is testing the robustness of the $M_K$ tensor calculations under stress, not mapping a physical material manifold.
**Limitation:** The sensitivity rankings represent the algorithmic vulnerabilities of the SP-PRP-TOPSIS code itself, and cannot be directly translated to physical process sensitivities where criteria are strictly collinear.
**If Examiner Pushes Further:** Reiterate that this is a computational stability framework. The dynamic PCA retention ($K$) specifically handles the correlations during the actual evaluation; the Morris screening tests the limits of that retention logic by feeding it uncorrelated adversarial bounds.
**Source Trace:** `asd_mcda/v2/sensitivity.py` (`run_morris_sensitivity`) & `asd_mcda/v2/pca.py` (`decompose_spectral`)


## Question 85: Why do you report the absolute mean $\mu^*$ rather than the standard mean $\mu$? By using the absolute value, you destroy all directional information about whether a parameter improves or degrades the alternative's rank.
**Attack Type:** Mathematical derivation / Metric justification
**Direct Answer:** We must use $\mu^*$ because the SP-PRP-TOPSIS distance calculations are non-monotonic; a positive elementary effect in one trajectory and a negative effect in another would falsely cancel out in standard $\mu$.
**Technical Defense:** The final ranking depends on the relative distance to ideal solutions mapped through the $M_K = V_K^T W V_K$ quadratic form. Depending on the trajectory's location in the grid, increasing a weight might move an alternative closer to the ideal in one subspace but further away in another. Standard $\mu$ would average these to near zero, falsely categorizing a highly volatile parameter as insensitive. $\mu^*$ prevents this Type II error.
**Limitation:** The loss of directional sign means we know a parameter dominates the stability of the model, but we must inspect specific execution traces to know *how* it alters the ranking.
**If Examiner Pushes Further:** Offer to show the scatter plot of $\mu^*$ versus $\sigma$. A parameter with low $\mu$ but high $\mu^*$ is the exact mathematical signature of a non-monotonic rank influence requiring absolute evaluation.
**Source Trace:** `asd_mcda/v2/sensitivity.py` (`run_morris_sensitivity`)


## Question 86: I see Monte Carlo perturbation $\sigma$ values and Morris $\sigma$ values used in Chapter 5. Are you confusing input uncertainty with output sensitivity?
**Attack Type:** Epistemic boundary / Parameter conflation
**Direct Answer:** No. The mathematical implementations in active v2 are strictly separated: Monte Carlo $\sigma_{score} = 0.05$ is an input perturbation parameter, whereas Morris $\sigma$ is an output dispersion metric.
**Technical Defense:** In `asd_mcda/v2/uncertainty.py`, $\sigma_{score} = 0.05$ and $\sigma_{AHP} = 0.15$ are input perturbation standard deviations used to stress-test the SP-PRP-TOPSIS ranking under noise. In contrast, `asd_mcda/v2/sensitivity.py` calculates Morris $\sigma$ as the sample standard deviation of elementary effects across trajectories: $\sigma = \sqrt{\frac{1}{r-1} \sum (EE_i - \mu)^2}$. Monte Carlo $\sigma$ is an input variance parameter; Morris $\sigma$ is an output measure of non-linearity and parameter interaction.
**Limitation:** Sharing the symbol $\sigma$ in documentation can create confusion, requiring explicit subscripts ($\sigma_{score}$ vs $\sigma_{morris}$) in presentation.
**If Examiner Pushes Further:** Point to the modular architecture: Monte Carlo resides in `asd_mcda/v2/uncertainty.py` generating input samples; Morris resides in `asd_mcda/v2/sensitivity.py` evaluating output gradients.
**Source Trace:** `asd_mcda/v2/uncertainty.py` (`MonteCarloEngine.run`) & `asd_mcda/v2/sensitivity.py` (`run_morris_sensitivity`)


## Question 87: You apply Morris sensitivity to the AHP weights. But AHP weights are derived from a discrete 1-9 pairwise comparison matrix. Applying continuous grid steps $\Delta$ to these weights violates the fundamental mathematics of AHP.
**Attack Type:** Boundary condition / Matrix consistency
**Direct Answer:** The Morris trajectories are applied to the final continuous weight vectors *after* the AHP eigenvalue derivation and CR validation, not to the discrete pairwise matrix itself.
**Technical Defense:** AHP generates a continuous priority vector $\vec{w}$ such that $\sum w_i = 1$. The Morris screening perturbs these normalized continuous weights directly within the SP-PRP-TOPSIS integration layer to observe final rank sensitivity. Perturbing the discrete 1-9 matrix entries would indeed be invalid because it would instantly violate the reciprocal axiom ($a_{ij} = 1/a_{ji}$) and destroy the Consistency Ratio (CR).
**Limitation:** Because we perturb the continuous output weights rather than the input matrix, we cannot trace sensitivity back to a specific subjective judgment made by the decision-maker on the 1-9 scale.
**If Examiner Pushes Further:** Clarify that AHP CR measures mathematical pairwise consistency, not scientific truth. Once CR < 0.1 is achieved, the resulting vector $\vec{w}$ is mathematically valid for continuous perturbation in the downstream integration phase.
**Source Trace:** `asd_mcda/v2/sensitivity.py` (`run_morris_sensitivity`) & `asd_mcda/v2/ahp.py` (`solve_ahp_preference`)


## Question 88: If multiple parameters change simultaneously during the Monte Carlo perturbation, how do you mathematically distinguish this from the interaction effects flagged by the Morris $\sigma$?
**Attack Type:** Concept integration / Methodology overlap
**Direct Answer:** We don't. Monte Carlo and Morris answer two distinct questions; Monte Carlo simulates simultaneous real-world systemic noise, while Morris isolates specific algorithmic interactions.
**Technical Defense:** Monte Carlo applies simultaneous Gaussian noise scaled by $\sigma_{mc}$ to evaluate the Top-1 Frequency—the raw probability that the optimal choice survives systemic variance. Morris uses isolated, orthogonal One-At-a-Time (OAT) jumps to decompose *why* the model behaves that way. Morris $\sigma$ tells us which parameters interact heavily; Monte Carlo shows us the cumulative damage of those interactions.
**Limitation:** Neither method guarantees physical validity. Blocked replicates or rank failures in MC represent algorithmic governance failures, not guaranteed physical impossibilities.
**If Examiner Pushes Further:** Emphasize that Monte Carlo is for robustness verification (does it break?) while Morris is for diagnostic screening (what breaks it?).
**Source Trace:** `asd_mcda/v2/uncertainty.py` (`MonteCarloEngine.run`) & `asd_mcda/v2/sensitivity.py` (`run_morris_sensitivity`)


## Question 89: In Chapter 4, your dynamic PCA retention ($K$) and stochastic MC seeds produce a very specific ranking trace. Given the stochastic nature of the framework, how can you prove these results are reproducible and not merely cherry-picked favorable runs?
**Attack Type:** Software provenance / Execution integrity
**Direct Answer:** The stochastic framework is anchored by deterministic Pseudo-Random Number Generator (PRNG) seeding and SHA-256 pipeline hashing, guaranteeing bit-for-bit reproducibility of the execution trace.
**Technical Defense:** Every Monte Carlo perturbation matrix and Morris trajectory grid is generated using an explicitly logged global seed. Furthermore, the input data matrix, PCA dynamic $K$ retention thresholds, and initial AHP weights are hashed upon execution. If a single bit in the input CSV changes, the SHA-256 hash fails the provenance check, preventing unlogged data tampering.
**Limitation:** Reproducibility only proves mathematical determinism of the code. It does not validate the physical accuracy of the parameters chosen for the seed state (Class B limitation).
**If Examiner Pushes Further:** Offer to run the exact seed from the provenance logs. The code will regenerate the exact $M_K$ tensor state and Top-1 frequency to the precision limit of the floating-point architecture. 
**Source Trace:** `asd_mcda/v2/provenance.py` (`compute_analysis_fingerprint`, `build_provenance_manifest`) & `asd_mcda/v2/uncertainty.py` (`MonteCarloEngine.run`)


## Question 90: The theoretical derivation of the SP-PRP-TOPSIS tensor ($M_K = V_K^T W V_K$) is elegant on paper. But how do we know your code actually computes this quadratic form rather than silently falling back to standard Euclidean TOPSIS during an execution failure?
**Attack Type:** Code validity / Algorithm enforcement
**Direct Answer:** The active v2 engine directly executes $M_K = V_K^T W V_K$ in `asd_mcda/v2/metrics.py`, and explicitly raises non-recoverable exceptions rather than falling back to classical Euclidean TOPSIS.
**Technical Defense:** In `construct_metric_tensor` (`asd_mcda/v2/metrics.py`), the tensor is computed directly as `M_K = V_arr.T @ W @ V_arr`. If $V_K$ has deficient rank, it raises `RankDeficientSubspaceError`. If $M_K$ has non-positive eigenvalues, it raises `NonPositiveDefiniteMetricError`. In `compute_distances_and_closeness`, distances are evaluated via quadratic forms `diff @ M_arr @ diff`; if any form is negative, it raises `MateriallyNegativeQuadraticFormError`. Euclidean fallback is structurally impossible.
**Limitation:** The metric tensor requires positive criteria weights ($w_j > 0$); an invalid weight vector raises `InvalidWeightVectorError`.
**If Examiner Pushes Further:** Contrast this with data integrity handling: DRG-0002 was quarantined due to an InChIKey label-structure mismatch, whereas the metric tensor layer halts via strict algebraic exceptions.
**Source Trace:** `asd_mcda/v2/metrics.py` (`construct_metric_tensor`, `compute_distances_and_closeness`)


## Question 91: How can you guarantee the reproducibility of your top-1 frequencies and ranking outputs across different operating systems and computing architectures?
**Attack Type:** Cross-platform reproducibility limits
**Direct Answer:** We guarantee deterministic execution on identical software stacks via fixed PRNG seeding (seed=42) and SHA-256 provenance manifests, but we do not claim universal bitwise cross-platform identity.
**Technical Defense:** In `asd_mcda/v2/uncertainty.py` (`MonteCarloEngine.run`), random number generation is initialized with `np.random.default_rng(42)` using NumPy's PCG64 bit generator. In `asd_mcda/v2/provenance.py`, two-pass canonical JSON SHA-256 digests seal input scores, AHP matrices, and outputs. However, differences in underlying BLAS/LAPACK implementations and IEEE 754 floating-point rounding across CPU architectures prevent universal bitwise guarantees. Across tested environments, reproducibility is verified through matching canonical chemical identifiers and evaluated 2D descriptor outputs across the tested RDKit environments.
**Limitation:** Upgrading RDKit or NumPy minor versions can introduce subtle floating-point deviations that slightly perturb boundary eigenvalues without affecting macro ranking order.
**If Examiner Pushes Further:** Highlight that all production runs record full provenance manifests including commit hashes and environment versions, ensuring complete retrospective auditability.
**Source Trace:** `asd_mcda/v2/provenance.py` (`compute_analysis_fingerprint`), `asd_mcda/v2/uncertainty.py` (`MonteCarloEngine.run`)


## Question 92: Your thesis relies on DRG-0002 being excluded. If I inject DRG-0002 back into the raw inputs, does the pipeline silently fail, or does it corrupt the PCA covariance matrix?
**Attack Type:** Data Integrity & Quarantine Boundary
**Direct Answer:** DRG-0002 is actively quarantined because its stored structure (Indomethacin) mismatches its requested identity (Fenofibrate).
**Technical Defense:** DRG-0002 represents a known data-integrity mismatch where the label does not match the chemical graph. Allowing it to propagate would mean the model evaluates the physical properties of Indomethacin while labeling it as Fenofibrate. It is quarantined, not silently corrected, and not used as a valid Fenofibrate production analysis.
**Limitation:** The framework requires manual or upstream curation to identify label-to-structure mismatches before the pipeline begins.
**If Examiner Pushes Further:** Reiterate that this is a documented data provenance failure, not a computational crash or a physical impossibility.
**Source Trace:** `asd_mcda/v2/chemistry.py` (`resolve_validated_drug_snapshot`)


## Question 93: You claim numerical stability, but how do you know your results aren't simply artifacts of software library version changes over the course of your PhD?
**Attack Type:** Software Reproducibility (Dependency Drift)
**Direct Answer:** Mathematical consistency is bounded by the documented computational environment, specifically versions of critical libraries like RDKit.
**Technical Defense:** Reproducibility is heavily dependent on the environment. For example, updating RDKit can change how specific 2D descriptors are calculated due to underlying algorithm updates. Therefore, the documented validation status is Class B, which explicitly includes a Documented Environment Limitation.
**Limitation:** The framework's exact numerical output is intrinsically tied to the specific versions of the dependencies used during the study, and cannot be blindly upgraded without re-validation.
**If Examiner Pushes Further:** Clarify that this is why the methodology specification and computational environment are strictly versioned alongside the framework itself.
**Source Trace:** `asd_mcda/v2/chemistry.py` (`compute_production_descriptors`), `asd_mcda/v2/provenance.py` (`build_provenance_manifest`)


## Question 94: If I re-run your SP-PRP-TOPSIS implementation a thousand times, how often does the model converge to a mathematically incorrect solution due to floating point underflow in the quadratic form?
**Attack Type:** Numerical Verification
**Direct Answer:** SP-PRP-TOPSIS is a deterministic algebraic calculation, not an iterative optimization algorithm that "converges", so it does not fail to converge.
**Technical Defense:** The formulation $M_K = V_K^T W V_K$ and the subsequent distance calculations $D_i = \sqrt{ (t_i - t)^T M_K (t_i - t) }$ are direct linear algebra operations. While they are subject to standard IEEE 754 floating-point precision limits, there is no iterative convergence process that can stall or diverge.
**Limitation:** Extreme multicollinearity leading to a near-singular covariance matrix could cause numerical instability during PCA, which is why we enforce strict dimensionality reduction criteria.
**If Examiner Pushes Further:** Stand firm that the metric geometry operations are deterministic matrix multiplications, not stochastic or gradient-based optimizations.
**Source Trace:** `asd_mcda/v2/metrics.py` (`construct_metric_tensor`, `compute_distances_and_closeness`)


## Question 95: Your model shows a high top-1 frequency. How did you handle data leakage into your hold-out test set during the PCA reduction?
**Attack Type:** False Premise (Hold-out sets / ML terminology)
**Direct Answer:** That premise is false; we do not use train/test splits, nor do we predict in-vivo biological response. Our framework is a deterministic Multi-Criteria Decision Analysis tool.
**Technical Defense:** The framework applies SP-PRP-TOPSIS to rank formulations based on computational stability under Monte Carlo perturbation. We do not employ machine learning classifiers, hence "hold-out test sets" and "data leakage" are inapplicable concepts. The top-1 frequency strictly quantifies algorithmic robustness to computational noise, not the probability of physical, biological success.
**Limitation:** Because we do not use predictive modeling with historical biological data, the computational ranking provides no statistical guarantee of in-vivo efficacy.
**If Examiner Pushes Further:** Reiterate that the PCA reduction dynamically retains principal components $K$ for dimensional independence of criteria, not for feature selection in a predictive model.
**Source Trace:** Authoritative Methodology Specification & `asd_mcda/v2/engine.py` (`VariableKEngine.evaluate`)


## Question 96: If this framework has only achieved Class B validation, why should any pharmaceutical company trust it over their existing experimental pipelines?
**Attack Type:** Validation Status (Class B vs Class A)
**Direct Answer:** They shouldn't replace experimental pipelines; Class B signifies a Validation Pass with a Documented Environment Limitation, meaning experimental validation remains pending.
**Technical Defense:** Class B validation confirms that the mathematical logic, data integrity, and numerical stability are verified within the documented computational boundaries. It explicitly denotes that predictive biological validity (Class A) is not yet established. The framework is a decision-support tool designed to computationally filter candidates, not a replacement for physical formulation success.
**Limitation:** The framework cannot account for unmodeled physical interactions that fall outside the parameterized criteria matrix.
**If Examiner Pushes Further:** Detail that experimental formulation validation requires pre-specified experimental endpoints appropriate to the scientific question, which has not yet been conducted.
**Source Trace:** Authoritative Phase 5 Validation Protocol & Audit Artifacts


## Question 97: The Morris $\mu^*$ value for the viscosity parameter is extremely high. Does this prove that viscosity causes the formulation to fail in the biological assay?
**Attack Type:** False Premise (Sensitivity vs Causality/Biology)
**Direct Answer:** No, $\mu^*$ measures the mean absolute elementary effect on the algorithmic ranking; it does not prove physical causality or biological failure.
**Technical Defense:** A high Morris $\mu^*$ indicates that small computational perturbations in a specific input parameter cause large structural changes in the final SP-PRP-TOPSIS hierarchy. For example, the documented dominant factor for Indomethacin is `score_POL-005-2026_s_desc`. This indicates the algorithm is highly sensitive to this descriptor score, but it says absolutely nothing about the physical causal mechanism of failure in a biological assay.
**Limitation:** The Morris screening method is a computational sensitivity metric and cannot infer causal physical mechanisms.
**If Examiner Pushes Further:** Remind the examiner that $\mu^*$ is the mean absolute elementary effect, and $\sigma$ is the dispersion of elementary effects. Neither are causal metrics.
**Source Trace:** `asd_mcda/v2/sensitivity.py` (`run_morris_sensitivity`)


## Question 98: You state the actual documented AHP Consistency Ratio (CR) for your expert weightings is 0.049415. If a hypothetical expert achieved a CR of 0.08, wouldn't that guarantee their selection criteria reflect true biological reality?
**Attack Type:** Concept Boundary (Mathematical Consistency vs Scientific Truth)
**Direct Answer:** No. The Consistency Ratio measures only the internal mathematical logic of the pairwise comparisons, not their alignment with external scientific truth.
**Technical Defense:** An AHP CR of 0.049415 simply proves that the expert's subjective pairwise comparisons are mathematically transitive and avoid logical contradictions. Even a hypothetical CR of 0.08 is considered mathematically acceptable (<0.10). However, if an expert consistently applies a fundamentally flawed scientific theory to the comparisons, the CR will still be excellent, even though the resulting weights are scientifically invalid.
**Limitation:** AHP is entirely dependent on the subjective domain expertise of the user; the algorithm cannot self-correct for scientifically inaccurate priors.
**If Examiner Pushes Further:** Emphasize that CR diagnoses internal matrix consistency, while scientific truth requires external empirical validation.
**Source Trace:** `asd_mcda/v2/ahp.py` (`solve_ahp_preference`)


## Question 99: Given the lack of experimental validation, what exact physical experiment must be conducted to upgrade this framework from Class B to Class A validation?
**Attack Type:** Experimental Counterfactual
**Direct Answer:** Experimental formulation validation remains pending and would require pre-specified experimental endpoints appropriate to the scientific question.
**Technical Defense:** Upgrading to Class A validation requires closing the loop between the SP-PRP-TOPSIS outputs and empirical reality. This would require physical synthesis and stability testing of formulations (e.g., accelerated degradation conditions) to statistically correlate the computational rankings with actual physical stability or shelf-life.
**Limitation:** The exact parameters and definitions of experimental "success" would need to be rigorously defined beforehand, as the computational metric (stability under perturbation) is not identical to physical stability.
**If Examiner Pushes Further:** Acknowledge that until such experiments are performed, the framework must be strictly interpreted as a computational decision-support tool.
**Source Trace:** Authoritative Validation Status & Methodology Artifacts


## Question 100: Do the Monte Carlo perturbation parameters, $\sigma_{score} = 0.05$ and $\sigma_{AHP} = 0.15$, represent the calibrated laboratory error of your experimental instruments?
**Attack Type:** False Premise (Perturbation parameters vs Experimental Error)
**Direct Answer:** No, they are purely computational perturbation parameters, not calibrated experimental error.
**Technical Defense:** The Monte Carlo parameters ($\sigma_{score} = 0.05$ and $\sigma_{AHP} = 0.15$) are intentionally injected Gaussian noise used to evaluate the topological stability of the SP-PRP-TOPSIS algorithmic rankings. They are not derived from the standard deviation of physical lab instruments, nor do they represent calibrated expert variance.
**Limitation:** Because the perturbations are synthetic and algorithmic, the resulting top-1 frequencies do not reflect the actual real-world probability of laboratory measurement errors.
**If Examiner Pushes Further:** Clarify that $P(\text{top-1}) = 55.5116\%$ for Soluplus simply represents the fraction of valid Monte Carlo replicates in which Soluplus ranked first under this specific computational perturbation, not an experimental success probability.
**Source Trace:** `asd_mcda/v2/uncertainty.py` (`MonteCarloEngine.run`)

