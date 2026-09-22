# 05 Monte Carlo & Morris Attacks

**Q1: Doesn't a Top-1 frequency of 55.5% mean there is a 55.5% chance the formulation will succeed in the lab?**
- **Direct Answer:** No, the Top-1 frequency is purely a computational stability metric, not a physical probability of success.
- **Technical Defense:** The statement means "Soluplus was ranked top-1 in 55.5116% of valid replicates under the specified computational perturbation and governance model." It reflects the robustness of the ranking against injected noise in the AHP weights and input matrices.
- **Limitation:** This metric gives no information regarding thermodynamic solubility or kinetic stability in physical reality.
- **Pushes Further:** The metric establishes confidence in the software's decision output, identifying which recommendations are mathematically stable despite expert uncertainty.
- **Source Trace:** `asd_mcda/uncertainty/monte_carlo.py`

**Q2: How did you calibrate your Monte Carlo error parameters $\sigma_{score}=0.05$ and $\sigma_{AHP}=0.15$?**
- **Direct Answer:** They were not experimentally calibrated; they are defined computational perturbation parameters used to test system robustness.
- **Technical Defense:** $\sigma_{score}$ and $\sigma_{AHP}$ define the magnitude of Gaussian noise injected into the input descriptor matrices and AHP weights, respectively. They act as stress-test bounds to evaluate the stability of the SP-PRP-TOPSIS ranking, simulating theoretical uncertainty, not measured lab error.
- **Limitation:** Because they are not calibrated to physical sensor or measurement error, the resulting perturbation space represents a mathematical sensitivity test, not a true physical error propagation.
- **Pushes Further:** Future iterations could calibrate these $\sigma$ values against actual experimental variance reported in literature for specific physicochemical assays.
- **Source Trace:** `asd_mcda/uncertainty/monte_carlo.py`

**Q3: If you ran 10,000 Monte Carlo replicates for Indomethacin, why did you divide by 8,600 to get your Top-1 frequency?**
- **Direct Answer:** Because the denominator for the frequency is $N_{valid}$, the number of replicates that survived the governance checks.
- **Technical Defense:** Out of 10,000 generated replicates, 1,400 were blocked by the system's governance and boundary constraints (e.g., perturbations pushing values outside valid physical ranges). These blocked replicates are governance failures, not physically impossible formulations. Therefore, the frequency is calculated over the 8,600 valid replicates.
- **Limitation:** A high rejection rate indicates that the perturbation bounds might be aggressively large relative to the acceptable input space.
- **Pushes Further:** Tracking the rejection rate ($N_{blocked} / N_{total}$) serves as a secondary metric for assessing how close a specific API/polymer combination sits to the boundaries of the model's validity.
- **Source Trace:** `asd_mcda/uncertainty/monte_carlo.py`

**Q4: In your Morris Screening, does a high $\mu^*$ mean that feature accounts for most of the variance in the model?**
- **Direct Answer:** No, $\mu^*$ is the mean absolute elementary effect; it is a screening metric, not a variance decomposition.
- **Technical Defense:** The Morris method is an OAT (One-At-a-Time) screening technique. $\mu^*$ measures the overall influence of an input factor on the output ranking. A high $\mu^*$ indicates the factor has a strong effect, but it does not quantify the percentage of total output variance it explains (which would require a variance-based method like Sobol).
- **Limitation:** Morris provides qualitative ranking of factor importance (screening) but cannot provide quantitative variance decomposition.
- **Pushes Further:** Morris is computationally efficient and perfectly suited for identifying which parameters the SP-PRP-TOPSIS model is most sensitive to before committing to more expensive global sensitivity analyses.
- **Source Trace:** `asd_mcda/uncertainty/morris.py`

**Q5: What does the $\sigma$ value represent in your Morris Screening results?**
- **Direct Answer:** The $\sigma$ in the Morris method represents the dispersion (standard deviation) of the elementary effects for a given parameter.
- **Technical Defense:** While $\mu^*$ measures the magnitude of the effect, $\sigma$ measures how much that effect varies across different points in the input space. A high $\sigma$ indicates that the parameter's influence is highly dependent on the values of other parameters (non-linear interactions or interdependencies in the PCA projection).
- **Limitation:** It indicates the presence of interactions but does not identify which specific parameters are interacting.
- **Pushes Further:** A feature with low $\mu^*$ but high $\sigma$ should not be ignored, as its impact could be critical in specific regions of the chemical space.
- **Source Trace:** `asd_mcda/uncertainty/morris.py`

**Q6: Why did you use Monte Carlo simulations instead of just reporting the baseline TOPSIS score?**
- **Direct Answer:** Because baseline scores generated from deterministic AHP weights ignore the inherent subjective uncertainty of expert judgments.
- **Technical Defense:** By injecting $\sigma_{AHP}$ into the weights and $\sigma_{score}$ into the data, we map the sensitivity of the metric tensor $M_K = V_K^T W V_K$. This prevents us from overconfidently recommending a polymer whose Top-1 ranking is highly brittle and relies on perfectly precise input matrices.
- **Limitation:** The Monte Carlo simulation is computationally expensive and requires defining arbitrary perturbation boundaries.
- **Pushes Further:** It transitions the framework from a naive deterministic calculator to a robust probabilistic decision-support tool.
- **Source Trace:** `asd_mcda/uncertainty/monte_carlo.py`

**Q7: Can your Monte Carlo perturbation model generate physically impossible polymer structures?**
- **Direct Answer:** No, because the perturbations are applied to the numerical descriptor vectors, bounded by the governance layer, not directly to molecular structures.
- **Technical Defense:** The noise is injected into the numerical matrix after feature extraction. The governance layer checks these perturbed vectors against valid bounds. If a perturbation pushes a descriptor into an invalid domain, it is logged as a blocked replicate and excluded from $N_{valid}$.
- **Limitation:** The method perturbs descriptors independently (unless covariance is explicitly modeled), which might generate numerical vectors that do not correspond to any synthesizable real-world polymer.
- **Pushes Further:** The governance checks act as a mathematical safety net, ensuring the SP-PRP-TOPSIS operations only evaluate mathematically permissible states.
- **Source Trace:** `asd_mcda/uncertainty/monte_carlo.py`

**Q8: If a polymer is ranked Top-1 in 99% of MC replicates, does that guarantee it is the best formulation?**
- **Direct Answer:** No. It guarantees mathematical stability of the decision under the defined perturbations.
- **Technical Defense:** It simply means the $C_L$ score of that polymer remains superior to all others across the sampled subspace of $W$ and input data. It is a statement about the topography of the SP-PRP-TOPSIS quadratic form, avoiding claims like "best" or "proves".
- **Limitation:** The stability is relative strictly to the other polymers in the dataset. A stable recommendation among poor options is still mathematically stable.
- **Pushes Further:** High stability gives the experimentalist confidence that they are testing the algorithm's true recommendation, untainted by minor parameter noise.
- **Source Trace:** `asd_mcda/uncertainty/monte_carlo.py`

**Q9: Did you use a hold-out set to validate the accuracy of your Morris elementary effects?**
- **Direct Answer:** No, Morris screening is a structural sensitivity analysis of the model itself, not a predictive machine learning algorithm requiring hold-out validation.
- **Technical Defense:** The Morris method maps the input-output behavior of the deterministic SP-PRP-TOPSIS equation. There is no ground-truth experimental data being predicted during this step; we are strictly evaluating the mathematical sensitivity of the metric tensor and $C_L$ calculation to input variations.
- **Limitation:** The screening only describes the software's internal logic, not its correlation to physical chemistry.
- **Pushes Further:** Understanding the internal sensitivities helps us focus future data curation efforts on the descriptors that most heavily drive the ranking ($\mu^*$).
- **Source Trace:** `asd_mcda/uncertainty/morris.py`

**Q10: Why define $\sigma_{score}$ and $\sigma_{AHP}$ independently?**
- **Direct Answer:** Because they model two fundamentally different sources of uncertainty: measurement/data noise versus subjective expert bias.
- **Technical Defense:** $\sigma_{score}$ perturbs the physicochemical descriptors (the raw data matrix), while $\sigma_{AHP}$ perturbs the expert-assigned weight matrix $W$. By keeping them independent, we can isolate whether ranking instability is driven by poor data quality or by disagreement among experts regarding parameter importance.
- **Limitation:** In reality, expert weights might be subconsciously influenced by data quality, meaning the two uncertainties could be coupled.
- **Pushes Further:** Independent perturbation allows for targeted Morris screening to isolate exact points of failure in the decision pipeline.
- **Source Trace:** `asd_mcda/uncertainty/monte_carlo.py`
