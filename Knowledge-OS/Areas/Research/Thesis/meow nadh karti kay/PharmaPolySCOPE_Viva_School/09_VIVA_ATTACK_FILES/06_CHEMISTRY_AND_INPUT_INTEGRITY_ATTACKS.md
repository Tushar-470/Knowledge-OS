# 06 Chemistry & Input Integrity Attacks

**Q1: Why did the system flag and reject DRG-0002? Was it because it had an unphysical density?**
- **Direct Answer:** No, DRG-0002 was quarantined because its stored molecular structure was inconsistent with the intended profile for Fenofibrate.
- **Technical Defense:** The integrity governance checks revealed a mismatch between the identifier and the underlying SMILES string or descriptor vector. The record was quarantined to prevent corrupt data from entering the PCA projection. It was not flagged for "unphysical density".
- **Limitation:** The quarantine mechanism simply removes the API from the analysis; it does not attempt to auto-correct the structural mismatch.
- **Pushes Further:** Quarantining prevents cascading errors where a misidentified molecule subtly skews the SP-PRP-TOPSIS subspace for all other candidates.
- **Source Trace:** Implementation source not independently verified; do not present this as an implementation fact.

**Q2: Since you successfully ran the software and obtained a ranking, does this validate the physical chemistry of your recommended formulation?**
- **Direct Answer:** No, the study achieved Class B validation (Validation Pass with Documented Environment Limitation), which evaluates software and mathematical integrity, not physical chemistry.
- **Technical Defense:** Class B validation confirms that the matrix operations ($M_K = V_K^T W V_K$), the Monte Carlo perturbations, and the governance flags execute correctly according to their mathematical definitions. Experimental formulation validation remains pending.
- **Limitation:** The software output is a mathematically consistent recommendation based on input descriptors; it does not prove in-vivo performance or thermodynamic truth.
- **Pushes Further:** The current framework provides a rigorously tested decision model, awaiting physical laboratory formulation data to close the validation loop.
- **Source Trace:** Implementation source not independently verified; do not present this as an implementation fact.

**Q3: How do you know your physicochemical descriptors accurately capture the polymer's behavior? Did you test this with a hold-out set?**
- **Direct Answer:** There is no hold-out set because this is a decision-theoretic framework, not an empirical predictive ML model.
- **Technical Defense:** The descriptors are accepted as a priori inputs to the decision matrix. The model assumes they are accurate representations of the chemical state. We evaluate the sensitivity of the decision to these descriptors using Morris screening, not predictive accuracy on a hold-out set.
- **Limitation:** If the underlying descriptors (e.g., computed LogP or Tg) are physically inaccurate representations of the true chemical state, the SP-PRP-TOPSIS ranking will be mathematically correct but physically irrelevant.
- **Pushes Further:** This highlights why $\sigma_{score}$ is used to inject noise—it tests whether the decision holds up even if our theoretical descriptors have slight inaccuracies.
- **Source Trace:** Implementation source not independently verified; do not present this as an implementation fact.

**Q4: Did you just delete DRG-0002 or overwrite it when you found the error?**
- **Direct Answer:** DRG-0002 was strictly quarantined, not overwritten or deleted.
- **Technical Defense:** Overwriting or deleting data violates data provenance and integrity. Quarantining flags the record, removing it from active computation ($N_{valid}$) while preserving the original state in the database for audit and correction tracking.
- **Limitation:** Keeping quarantined data requires storage overhead and careful database querying to ensure flagged records are not accidentally included in subsequent pipeline runs.
- **Pushes Further:** A strict quarantine protocol is essential for reproducible research, allowing future audits to see exactly what data was rejected and why.
- **Source Trace:** Implementation source not independently verified; do not present this as an implementation fact.

**Q5: In your dataset, how does the SP-PRP-TOPSIS handle polymers that have missing physicochemical descriptor values?**
- **Direct Answer:** They are excluded prior to analysis. The PCA and quadratic form calculations require complete matrices.
- **Technical Defense:** The pipeline cannot compute the metric tensor $M_K = V_K^T W V_K$ with null vectors. The governance layer enforces completeness; polymers with missing values are either imputed using established chemical informatics rules before entering the pipeline, or they are dropped.
- **Limitation:** Dropping polymers reduces the search space, potentially missing a highly effective excipient simply due to a lack of documented theoretical parameters.
- **Pushes Further:** This emphasizes the need for comprehensive and high-quality upfront databases to maximize the utility of the multi-criteria decision pipeline.
- **Source Trace:** Implementation source not independently verified; do not present this as an implementation fact.

**Q6: What happens if two completely different polymers yield the exact same descriptor vector?**
- **Direct Answer:** They will project to the exact same coordinate in the PCA subspace and receive identical $C_L$ scores.
- **Technical Defense:** The SP-PRP-TOPSIS model is agnostic to polymer names or structural graphs; it operates purely on the numerical descriptor matrix. Identical vectors yield identical distances ($D^+, D^-$) in the quadratic form.
- **Limitation:** If the chosen descriptors fail to capture a critical physical difference between the two polymers, the model will blindly treat them as identical.
- **Pushes Further:** This demonstrates that the decision model is only as powerful as the descriptive resolution of the input features.
- **Source Trace:** Implementation source not independently verified; do not present this as an implementation fact.

**Q7: Can this framework guarantee that the Top-1 ranked polymer will not precipitate in vivo?**
- **Direct Answer:** No, the framework guarantees mathematical proximity to an idealized theoretical profile, not biological success.
- **Technical Defense:** The framework avoids terms like "guarantee". The closeness coefficient $C_L$ ranks how well the polymer's theoretical properties align with the expert-weighted AHP ideal. It is a prioritization tool to reduce experimental trial-and-error, not a thermodynamic oracle.
- **Limitation:** In-vivo precipitation involves complex biological fluid dynamics and metabolic interactions not captured by static chemical descriptors.
- **Pushes Further:** The goal is to maximize the probability that the first few lab experiments yield success, drastically cutting down the required empirical screening matrix.
- **Source Trace:** Implementation source not independently verified; do not present this as an implementation fact.

**Q8: If Class B validation means pending experimental validation, is your research incomplete?**
- **Direct Answer:** No, the research is complete regarding the development and software validation of the decision framework itself.
- **Technical Defense:** A Class B validation clearly bounds the scope of the claim. We successfully validated the matrix mathematics, the Monte Carlo perturbation stability, and the governance integrity. The software performs exactly as designed.
- **Limitation:** We cannot claim the physical formulations are validated.
- **Pushes Further:** Clearly separating software validation from physical validation prevents the dangerous overclaims common in applied computational chemistry.
- **Source Trace:** Implementation source not independently verified; do not present this as an implementation fact.

**Q9: Why does the system governance reject a replicate during Monte Carlo instead of bounding it?**
- **Direct Answer:** Bounding alters the intended statistical distribution; rejecting (blocking) preserves the integrity of the perturbation model while enforcing physical reality.
- **Technical Defense:** If a Gaussian perturbation pushes a value below zero (e.g., negative molecular weight), capping it at zero creates an artificial spike (a Dirac delta) at the boundary, skewing the SP-PRP-TOPSIS distance calculations. By rejecting it, we log a governance failure and only compute on the $N_{valid}$ replicates that form a clean, mathematically valid distribution.
- **Limitation:** High rejection rates mean the effective number of Monte Carlo samples ($N_{valid}$) is lower than $N_{total}$, requiring larger initial runs.
- **Pushes Further:** This is why Top-1 frequency is strictly reported over $N_{valid}$.
- **Source Trace:** Implementation source not independently verified; do not present this as an implementation fact.

**Q10: Are the expert weights applied before or after the chemistry descriptors are validated by the governance layer?**
- **Direct Answer:** After. The descriptor matrix must pass structural and completeness checks before entering the MCDA pipeline.
- **Technical Defense:** Governance is the first layer. Once the data matrix is verified (e.g., DRG-0002 is quarantined), it undergoes PCA. Only then are the expert weights $W$ projected into the subspace via the metric tensor $M_K = V_K^T W V_K$.
- **Limitation:** If governance fails to catch a subtle chemical error, that error will be mathematically propagated and magnified by the expert weights.
- **Pushes Further:** Ensuring input integrity is paramount, as the SP-PRP-TOPSIS algorithm is a deterministic engine that will confidently execute on garbage data if allowed.
- **Source Trace:** Implementation source not independently verified; do not present this as an implementation fact.
