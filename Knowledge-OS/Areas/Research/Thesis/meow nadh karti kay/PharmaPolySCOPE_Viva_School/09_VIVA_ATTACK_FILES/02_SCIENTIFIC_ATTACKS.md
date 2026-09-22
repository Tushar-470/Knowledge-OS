# SCIENTIFIC ATTACKS AND DEFENSES

## Q1: Does your framework prove that Soluplus is the best polymer for Indomethacin?
**Direct Answer:** No, it does not prove physical superiority or thermodynamic stability.
**Technical Defense:** The framework applies a defined multi-criteria computational model. It indicates that under our specific weighting and evaluation criteria, Soluplus achieves the highest closeness coefficient $C_L$.
**Limitation:** The result is bounded by the inputs. Experimental formulation validation remains PENDING (Class B Validation).
**If Examiner Pushes Further:** "The software diagnoses multi-criteria alignment based on input scores; it does not substitute for laboratory solubility or stability trials."
**Source Trace:** `asd_mcda/mcda/topsis.py`

## Q2: How did you calibrate your Monte Carlo error parameters $\sigma_{score}=0.05$ and $\sigma_{AHP}=0.15$ to real-world experimental errors?
**Direct Answer:** They are not experimentally calibrated error margins.
**Technical Defense:** These values are defined computational perturbation parameters used to test the sensitivity of the SP-PRP-TOPSIS rankings to input variations, assessing algorithmic robustness, not physical measurement error.
**Limitation:** Because they are synthetic parameters, the resulting perturbation profiles do not directly translate to expected physical variance in a lab.
**If Examiner Pushes Further:** "The goal of the Monte Carlo simulation here is to stress-test the decision model's governance structure and identify at what perturbation level rank reversals occur."
**Source Trace:** `asd_mcda/uncertainty/monte_carlo.py`

## Q3: If Soluplus is ranked top-1 in 55.51% of replicates, does that mean I have a 55% chance of experimental success?
**Direct Answer:** No, that is an incorrect interpretation of the metric.
**Technical Defense:** The 55.51% value specifically means that "Soluplus was ranked top-1 in 55.5116% of valid replicates under the specified computational perturbation and governance model." It is a measure of rank stability under defined noise, not a physical probability.
**Limitation:** It cannot be translated into an experimental success rate or thermodynamic probability.
**If Examiner Pushes Further:** "The percentage strictly reflects the output distribution of the MCDA model against the $N_{valid}$ denominator (e.g., 8,600 valid out of 10,000 for Indomethacin), filtering out governance failures."
**Source Trace:** `asd_mcda/uncertainty/monte_carlo.py`

## Q4: Why did you quarantine DRG-0002? Was the density completely unphysical?
**Direct Answer:** DRG-0002 was quarantined due to structural inconsistency, not specifically an unphysical density.
**Technical Defense:** The stored computational structure for DRG-0002 was inconsistent with the intended analytical profile for Fenofibrate. It failed the integrity checks required for the decision matrix.
**Limitation:** We had to remove it from the decision space to maintain the mathematical validity of the subsequent MCDA steps.
**If Examiner Pushes Further:** "Including an inconsistent profile would corrupt the AHP and TOPSIS results. The quarantine is a data governance action, not a thermodynamic judgment."
**Source Trace:** Implementation source not independently verified; do not present this as an implementation fact.

## Q5: How did you divide your dataset into train, test, and hold-out sets for validation?
**Direct Answer:** There are no hold-out, train, or test sets in this study.
**Technical Defense:** PharmaPolySCOPE v2 is a Multi-Criteria Decision Analysis (MCDA) framework, not a Machine Learning predictive model. It applies deterministic mathematical operations (AHP, PCA, TOPSIS) to a defined decision matrix.
**Limitation:** As it is an MCDA tool, it does not "learn" from data or generalize to unseen data in the ML sense; its validation is based on the logical consistency of its rankings given the inputs.
**If Examiner Pushes Further:** "Validation in this context refers to structural and mathematical verification (Class B — Validation Pass), not predictive generalization on a hold-out set."
**Source Trace:** `asd_mcda/integration/pca.py`

## Q6: Doesn't a Consistency Ratio (CR) < 0.08 prove that your expert weights are scientifically correct?
**Direct Answer:** No, the CR does not measure scientific truth.
**Technical Defense:** A CR < 0.08 solely diagnoses mathematical consistency among the pairwise judgments in the AHP matrix. It ensures the user's logic is transitive (e.g., if A > B and B > C, then A > C).
**Limitation:** A perfectly consistent AHP matrix can still be based on completely incorrect scientific premises.
**If Examiner Pushes Further:** "The CR validates the mathematical coherence of the decision-maker's inputs, nothing more."
**Source Trace:** `asd_mcda/mcda/ahp.py`

## Q7: How does your Morris method prove the physical causality of the input parameters?
**Direct Answer:** The Morris method does not prove physical causality.
**Technical Defense:** The Morris method is a computational screening tool. It calculates $\mu^*$ (mean absolute elementary effect) and $\sigma$ (dispersion of elementary effects) to identify which input parameters most significantly affect the TOPSIS $C_L$ score numerically.
**Limitation:** It is a sensitivity analysis of the algorithm, not a variance decomposition or a proof of physical thermodynamic pathways.
**If Examiner Pushes Further:** "We use Morris strictly to understand model sensitivity and screen out non-influential computational inputs, not to derive physical laws."
**Source Trace:** `asd_mcda/uncertainty/morris.py`

## Q8: Why do you have blocked replicates in your Monte Carlo simulation? Are these physically impossible formulations?
**Direct Answer:** Blocked replicates represent governance failures, not physical impossibilities.
**Technical Defense:** During perturbation, some replicates (e.g., 1,400 out of 10,000) violate the predefined computational constraints or boundary conditions of the model. These are rejected by the software's governance logic.
**Limitation:** The existence of a blocked replicate only means the perturbed input vector fell outside the accepted mathematical domain of the MCDA model.
**If Examiner Pushes Further:** "The top-1 frequency is calculated only over $N_{valid}$ (e.g., 8,600), as blocked replicates are computational discards, not failed lab experiments."
**Source Trace:** `asd_mcda/uncertainty/monte_carlo.py`

## Q9: Does the framework guarantee that the selected polymer will form a stable amorphous solid dispersion?
**Direct Answer:** No, the framework provides no guarantees of physical stability.
**Technical Defense:** The software computes a relative ranking based on SP-PRP-TOPSIS within the defined PCA subspace. It identifies the mathematically optimal compromise among competing criteria.
**Limitation:** The output is a computational recommendation. Experimental validation remains PENDING.
**If Examiner Pushes Further:** "The phrase 'guarantee' is inapplicable. The system diagnoses the highest theoretical alignment with the target profile based on current data."
**Source Trace:** `asd_mcda/mcda/topsis.py`

## Q10: What does the K parameter in your model actually physically represent?
**Direct Answer:** K is a mathematical parameter, not a physical one.
**Technical Defense:** K represents the number of retained Principal Components dynamically selected to satisfy the required cumulative variance threshold in the PCA step (e.g., K=3 for Indomethacin).
**Limitation:** It defines the dimensionality of the subspace for the SP-PRP-TOPSIS calculation and does not correspond to a physical property like clusters or molecular states.
**If Examiner Pushes Further:** "K is strictly the rank of the truncated basis used to construct the metric tensor $M_K = V_K^T W V_K$."
**Source Trace:** `asd_mcda/integration/pca.py`
