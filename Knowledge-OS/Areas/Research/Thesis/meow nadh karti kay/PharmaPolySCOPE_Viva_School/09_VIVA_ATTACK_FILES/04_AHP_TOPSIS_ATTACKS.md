# 04 AHP & TOPSIS Attacks

**Q1: How can you justify using K-Means for determining the principal components in your PCA?**
- **Direct Answer:** I did not use K-Means. K refers to the number of retained principal components, dynamically selected to satisfy cumulative variance.
- **Technical Defense:** The parameter K is the dimensionality of the retained PCA subspace. For example, K=3 for Indomethacin. It is selected to capture sufficient variance, not to form clusters.
- **Limitation:** The choice of cumulative variance threshold (e.g., 90%) is somewhat arbitrary, though standard in dimensionality reduction.
- **Pushes Further:** We can examine the scree plot to ensure the selected K captures the dominant variance without retaining noise.
- **Source Trace:** `asd_mcda/integration/pca.py`

**Q2: Isn't TOPSIS just a basic Euclidean distance calculation?**
- **Direct Answer:** No, PharmaPolySCOPE v2 uses SP-PRP-TOPSIS, which operates in the PCA-reduced subspace.
- **Technical Defense:** Standard Euclidean TOPSIS operates in the original feature space. SP-PRP-TOPSIS uses a metric tensor $M_K = V_K^T W V_K$ in the PCA subspace, where $V_K$ are the retained principal components and $W$ is the AHP weight matrix. The distance is a quadratic form, evaluating standardized ideal reference $z^+=1$ and anti-ideal $z^-=0$. The closeness coefficient is $C_L = D^- / (D^+ + D^-)$.
- **Limitation:** SP-PRP-TOPSIS assumes linear relationships through PCA, which may not capture nonlinear interactions between descriptors.
- **Pushes Further:** Future iterations could explore kernel-PCA for nonlinear embedding before applying the SP-PRP-TOPSIS metric tensor.
- **Source Trace:** `asd_mcda/mcda/topsis.py`

**Q3: Since your AHP Consistency Ratio (CR) is < 0.08, does this prove your expert weights represent scientific truth?**
- **Direct Answer:** No, CR < 0.08 diagnoses mathematical consistency among pairwise judgments, it does not prove scientific truth or experimental validity.
- **Technical Defense:** The Consistency Ratio measures how far the pairwise comparison matrix deviates from perfect transitivity (if A > B and B > C, then A > C). It ensures the mathematical model is stable, not that the subjective judgments perfectly reflect physical reality.
- **Limitation:** AHP relies on subjective expert opinion, which inherently carries bias.
- **Pushes Further:** This is why we couple AHP with Monte Carlo perturbations to assess the robustness of the final rankings against variations in these subjective weights.
- **Source Trace:** `asd_mcda/mcda/ahp.py`

**Q4: How did you define the ideal and anti-ideal solutions in your TOPSIS implementation?**
- **Direct Answer:** The ideal and anti-ideal solutions are defined as standardized bounds in the projected space: $z^+=1$ and $z^-=0$.
- **Technical Defense:** Because we project the descriptors into a PCA subspace and apply the metric tensor $M_K$, we define the theoretical best and worst possible outcomes directly as standardized vectors, ensuring the quadratic form distances $D^+$ and $D^-$ are bounded and stable.
- **Limitation:** Defining absolute theoretical bounds rather than empirical bounds from the dataset means the $C_L$ scores may cluster tightly if no empirical polymer approaches the theoretical ideal.
- **Pushes Further:** The standardized bounds ensure cross-API comparability without shifting the reference frame based on the specific polymers available.
- **Source Trace:** `asd_mcda/mcda/topsis.py`

**Q5: Why did you project the AHP weights through the PCA loadings instead of applying them directly?**
- **Direct Answer:** To address multicollinearity among the original physicochemical descriptors while maintaining the semantic meaning of the expert weights.
- **Technical Defense:** Descriptors like molecular weight and H-bond donors are highly correlated. Applying weights directly risks double-counting importance. By projecting the weight matrix $W$ through the retained components $V_K$ to form $M_K = V_K^T W V_K$, SP-PRP-TOPSIS orthogonalizes the space while mathematically preserving the expert prioritization.
- **Limitation:** The resulting subspace axes (principal components) are linear combinations of descriptors, making the exact physical meaning of the weighted axes harder to interpret directly.
- **Pushes Further:** We track the loadings matrix $V_K$ to map the subspace back to the original descriptors for physical interpretation.
- **Source Trace:** `asd_mcda/integration/pca.py`, `asd_mcda/mcda/topsis.py`

**Q6: What happens to the AHP weights if a feature is dropped during PCA dimensionality reduction?**
- **Direct Answer:** The weight is essentially projected out along with the discarded variance.
- **Technical Defense:** The metric tensor $M_K = V_K^T W V_K$ relies on the truncated loading matrix $V_K$. If a descriptor's variance is entirely in the discarded components (e.g., $K+1$ to $N$), its corresponding AHP weight will have negligible impact on the final quadratic form distance.
- **Limitation:** Expert priority might be overridden if the descriptor has very low variance across the dataset, even if the expert deemed it critical.
- **Pushes Further:** This acts as an automated feature selection step, preventing low-variance (uninformative) features from dominating the ranking simply because they received a high subjective weight.
- **Source Trace:** `asd_mcda/integration/pca.py`

**Q7: Can SP-PRP-TOPSIS handle missing data in the descriptor matrix?**
- **Direct Answer:** No, the mathematical operations require a complete descriptor matrix prior to PCA.
- **Technical Defense:** Both the PCA calculation for $V_K$ and the subsequent projection into the $M_K$ tensor require full vectors. Missing values must be imputed or the corresponding polymers/APIs excluded before running the pipeline.
- **Limitation:** This strict mathematical requirement means the pipeline is sensitive to data sparsity in the initial database.
- **Pushes Further:** The current pipeline relies on robust upfront data validation and quarantine protocols to ensure only complete, valid matrices reach the SP-PRP-TOPSIS module.
- **Source Trace:** `asd_mcda/mcda/topsis.py`

**Q8: Your AHP weights sum to 1. Is this mathematically required for the metric tensor?**
- **Direct Answer:** Yes, normalization is required to ensure the trace of the weight matrix $W$ scales correctly in the quadratic form.
- **Technical Defense:** In $M_K = V_K^T W V_K$, $W$ is a diagonal matrix of the AHP weights. Normalizing the weights ($\sum w_i = 1$) ensures that the maximum possible distance in the standardized subspace remains bounded and comparable across different drug runs.
- **Limitation:** It forces a zero-sum game among descriptors; increasing the importance of one strictly decreases the importance of others.
- **Pushes Further:** This normalization is fundamental to multi-criteria decision making, forcing experts to make explicit trade-offs rather than rating everything as "highly important".
- **Source Trace:** `asd_mcda/mcda/ahp.py`

**Q9: How is the final closeness coefficient ($C_L$) interpreted mathematically?**
- **Direct Answer:** It is a relative proximity measure in the weighted PCA subspace, bounded between 0 and 1.
- **Technical Defense:** The coefficient is calculated as $C_L = D^- / (D^+ + D^-)$. As the polymer's projection approaches the ideal $z^+$ ($D^+ \to 0$), $C_L$ approaches 1. As it approaches the anti-ideal $z^-$ ($D^- \to 0$), $C_L$ approaches 0.
- **Limitation:** A higher $C_L$ implies mathematical proximity to the ideal, but does not guarantee a specific physical dissolution rate or stability half-life.
- **Pushes Further:** $C_L$ serves purely as an ordinal ranking metric for the selection of polymer candidates, not an absolute predictive physical quantity.
- **Source Trace:** `asd_mcda/mcda/topsis.py`

**Q10: Why did you not validate the SP-PRP-TOPSIS rankings against an independent hold-out test set?**
- **Direct Answer:** This is a deterministic multi-criteria decision model, not an empirical machine learning model trained on a ground truth dataset, so a hold-out test set is fundamentally inapplicable.
- **Technical Defense:** The study is not an ML train/test study. The ranking is deterministically generated based on physicochemical descriptors and expert AHP weights. There is no "training" phase. Validation in this context means Class B software and mathematical validation (Validation Pass with Documented Environment Limitation), verifying the matrix operations and perturbation bounds.
- **Limitation:** Experimental formulation validation remains pending; the software tests do not prove in-vivo or physical formulation performance.
- **Pushes Further:** Future validation requires physical laboratory formulation of the top-ranked polymers to empirically verify the decision model's utility.
- **Source Trace:** Implementation source not independently verified; do not present this as an implementation fact.
