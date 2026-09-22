# MODULE 09 — TRUE CLAIM-TO-SOURCE FORENSIC AUDIT

**STATUS: HOLD — CORRECTIONS REQUIRED**

## 1. AUDIT OVERVIEW
This audit executes a strict forensic verification of the substantive claims in the 100-question bank against the actual `asd_framework` codebase. The previous regex-based remediation was insufficient, as it applied generic boilerplate without verifying the underlying mathematical and programmatic mechanisms.

## 2. QUANTITATIVE RESULTS
- **Total Substantive Claims Audited:** 100
- **Class A (Direct Source Verified):** 6
- **Class B (Authoritative Methodology):** 0
- **Class C (General Scientific):** 0
- **Class D (Unsupported):** 0

- **P1 Errors:** 94
- **P2 Errors:** 0
- **Fabricated Source Traces:** 21

## 3. IDENTIFIED FATAL MECHANISM MISMATCHES
- **TOPSIS Implementation:** The document repeatedly defends `SP-PRP-TOPSIS` and the metric tensor $M_K = V_K^T W V_K$. However, the actual codebase (`topsis.py`) implements standard Euclidean TOPSIS vector normalization (Hwang & Yoon 1981).
- **Monte Carlo Clipping:** The document claims noise is unclipped to evaluate topological decision space. The code explicitly implements `np.clip(..., 0.0, 1.0)`.
- **Eigengap Blocking:** The document claims `pca.py` calculates eigengaps and triggers DRG-0004. `pca.py` does neither.
- **RDKit Integrity:** The document claims DRG-0002 failed due to an explicit pentavalent carbon. DRG-0002 is actually a Fenofibrate/Indomethacin identity mismatch.
- **Validation:** Class B (Documented Environment Limitation) is frequently mischaracterized or mapped to the wrong modules (`uncertainty.py` instead of `sensitivity.py`).

## 4. FINAL DECISION
Approval requires P0=0, P1=0, P2=0, and all implementation claims to have valid source support.

Because the underlying source mechanisms directly contradict the generated text, this document fails Class A verification.

**DECISION: HOLD — CORRECTIONS REQUIRED**

## 5. MANUAL FORENSIC SAMPLE & AUDIT RECORDS

### Question 1
- **Claim:** In our AHP matrix, the weight assigned to $T_g$ acts as a computational dampener on purely thermodynamic predictions. By requiring a high composite $T...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/compatibility/hsp_model.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 2
- **Claim:** By using the standard Gordon-Taylor equation without a specific interaction term ($K$), we ensure that the model strictly penalizes formulations that ...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `Implementation source not independently verified; do not present this as an implementation fact.`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Fabricated/Disclaimed Source Trace)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 3
- **Claim:** The AHP pairwise comparison matrix is strictly defined around solid-state integrity. Compatibility (HSP) and Drug Loading define the thermodynamic pha...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/mcda/ahp.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 4
- **Claim:** We do not alter the foundational $R_a$ equation to artificially inflate $\delta_h$ because doing so would corrupt the standardized interaction sphere ...
- **Claim Type:** Implementation / Methodology
- **Classification:** A
- **Source File:** `asd_mcda/compatibility/hsp_model.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** PASS (Dispersion factor of 4.0 explicitly in code)
- **Answer Wording Appropriate?** YES
- **Severity:** None

### Question 5
- **Claim:** The SP-PRP-TOPSIS algorithm does not model 3D molecular docking. Instead, we impose a non-linear penalty in the decision matrix as drug loading approa...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `Implementation source not independently verified; do not present this as an implementation fact.`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Fabricated/Disclaimed Source Trace)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 6
- **Claim:** In the AHP consistency check, we require the Consistency Ratio (CR) to be < 0.1 to tolerate minor interdependencies. While they are physically coupled...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/integration/pca.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 7
- **Claim:** The PCA step specifically computes the eigenvalues of the criteria covariance matrix. If polymer chain entanglement differences only contribute to, sa...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/integration/pca.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 8
- **Claim:** We inject noise into the normalized decision matrix, not the raw physical values. The perturbation ($\sigma$) tests the robustness of the SP-PRP-TOPSI...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/uncertainty/monte_carlo.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Code explicitly uses np.clip, contradicting claims of unclipped noise)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 9
- **Claim:** To model a phase inversion, we would need non-linear differential equations tracking time-dependent nucleation rates. Our model uses a static SP-PRP-T...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `Implementation source not independently verified; do not present this as an implementation fact.`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Fabricated/Disclaimed Source Trace)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 10
- **Claim:** The Morris screening method generates trajectories across the input parameter space (the AHP weights or property inputs) and calculates the elementary...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/v2/uncertainty.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 11
- **Claim:** The standard HSP distance is $R_a^2 = 4(\delta_{d1} - \delta_{d2})^2 + (\delta_{p1} - \delta_{p2})^2 + (\delta_{h1} - \delta_{h2})^2$. The factor of 4...
- **Claim Type:** Implementation / Methodology
- **Classification:** A
- **Source File:** `asd_mcda/compatibility/hsp_model.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** PASS (Dispersion factor of 4.0 explicitly in code)
- **Answer Wording Appropriate?** YES
- **Severity:** None

### Question 12
- **Claim:** In our model, $R_0$ defines a sharp boundary sphere. While statistically, polymer-solvent interactions exhibit a probabilistic transition zone governe...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/compatibility/hsp_model.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 13
- **Claim:** The original Flory-Huggins derivation defines $\chi$ purely as a function of temperature and the purely enthalpic interaction energy between adjacent ...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `Implementation source not independently verified; do not present this as an implementation fact.`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Fabricated/Disclaimed Source Trace)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 14
- **Claim:** The entropy of mixing relies on the formula $\Delta S_{mix} = -R(n_1 \ln \phi_1 + n_2 \ln \phi_2)$. This stems from a rigid lattice where the molar vo...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `Implementation source not independently verified; do not present this as an implementation fact.`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Fabricated/Disclaimed Source Trace)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 15
- **Claim:** Our code uses $T_{g,mix} = \frac{w_1 T_{g1} + k w_2 T_{g2}}{w_1 + k w_2}$. The parameter $k \approx \frac{\Delta \alpha_2 V_2}{\Delta \alpha_1 V_1}$ i...
- **Claim Type:** Implementation / Methodology
- **Classification:** A
- **Source File:** `asd_mcda/compatibility/gordon_taylor.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** PASS (Gordon-Taylor equation perfectly matches code)
- **Answer Wording Appropriate?** YES
- **Severity:** None

### Question 16
- **Claim:** The Simha-Boyer rule approximates $k = \rho_1 T_{g1} / \rho_2 T_{g2}$. Our model pre-calculates this single scalar value for a given API-polymer pair....
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/compatibility/gordon_taylor.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 17
- **Claim:** Cohesive energy density decreases as temperature rises due to thermal expansion. The true HSP values scale roughly with $(1 - T/T_c)^{0.34}$. Because ...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/compatibility/hsp_model.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 18
- **Claim:** When deriving $\chi$ from cohesive energy densities via $\chi = \frac{V_s}{RT} (\delta_1 - \delta_2)^2$, the underlying physics assumes random mixing ...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `Implementation source not independently verified; do not present this as an implementation fact.`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Fabricated/Disclaimed Source Trace)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 19
- **Claim:** Our analytical pipeline returns $T_{g,mix}$ as a single float. In physical reality, due to local concentration fluctuations (typically on the 10-30 nm...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/compatibility/gordon_taylor.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 20
- **Claim:** Teas parameters are defined as $f_i = \delta_i / (\delta_d + \delta_p + \delta_h)$. This maps the 3D space onto a 2D ternary diagram. However, this no...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/compatibility/hsp_model.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 21
- **Claim:** If we allow unconstrained isometric variants, the descriptor matrix rank artificially inflates, causing degenerate eigenvalues during PCA. By strictly...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/v2/chemistry.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 22
- **Claim:** Deriving 3D descriptors requires MMFF94 geometry optimization, which creates a massive local-minima dependency. By utilizing 2D topological indices, w...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/v2/chemistry.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 23
- **Claim:** Between RDKit builds, minor tweaks to ring-finding algorithms (e.g., depth-first vs breadth-first indexing) slightly alter the raw descriptor values. ...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/v2/provenance.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 24
- **Claim:** DRG-0002 failed the strict `SanitizeMol` check because of an explicit pentavalent carbon definition in the source file. It is a quarantined parsing fa...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/v2/chemistry.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (chemistry.py does not contain DRG-0002 pentavalent carbon logic; it is an identity mismatch)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 25
- **Claim:** Passing raw molecular weight or absolute heavy atom counts of a single monomer into the model creates a false mapping where smaller repeating units ap...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/v2/chemistry.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 26
- **Claim:** If we dynamically generated all possible tautomers, we would have to calculate a probability-weighted descriptor average for every molecule. This intr...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/v2/chemistry.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 27
- **Claim:** Hydrogens represent terminal nodes with near-zero topological variance across large organic frameworks. If left explicit, their sheer numerical domina...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/integration/pca.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 28
- **Claim:** Rather than dropping the molecule or attempting unsafe manual bond reassignment, the exception is caught, and the aromatic descriptors are populated w...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/v2/chemistry.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 29
- **Claim:** Manually pre-filtering "redundant" descriptors like exact mass vs molecular weight introduces human bias. Instead, we compute the full RDKit 2D suite ...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/integration/pca.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 30
- **Claim:** Instead of fixing a random seed to hide the stochasticity, we execute multiple ETKDG conformer generation runs and compute the standard deviation of t...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/uncertainty/monte_carlo.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 31
- **Claim:** Without z-score standardization, PCA would simply extract the criterion with the largest numerical variance (e.g., molecular weight in Da vs solubilit...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/integration/pca.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 32
- **Claim:** If the data matrix $X$ is not centered, the first eigenvector of $X^T X$ points towards the multidimensional mean of the data cloud, confounding mean ...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/integration/pca.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 33
- **Claim:** The spectral theorem guarantees that a symmetric real covariance matrix has orthogonal eigenvectors, but this is a geometric rotation of the data, not...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/v2/phase5_models.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 34
- **Claim:** PCA eigenvalues $\lambda_i$ measure structural variance, not objective importance. We dynamically retain $K$ components to capture the macro-structure...
- **Claim Type:** Implementation / Methodology
- **Classification:** A
- **Source File:** `asd_mcda/integration/pca.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** PASS (Code explicitly retains K components based on variance_threshold)
- **Answer Wording Appropriate?** YES
- **Severity:** None

### Question 35
- **Claim:** Because the eigenvectors in $V_K$ are orthonormal ($V_K^T V_K = I_K$), the transformation is a rigid rotation followed by an orthogonal drop of the di...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/integration/pca.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 36
- **Claim:** Because the original input was z-score standardized, a unit distance in the original space represents one standard deviation of that specific criterio...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/v2/phase5_models.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 37
- **Claim:** The matrix $W$ is a diagonal matrix of AHP weights corresponding to the original $N$ criteria. To apply these weights in the reduced $K$-dimensional s...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/v2/phase5_models.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 38
- **Claim:** Perfect collinearity means the determinant of the covariance matrix is zero. The eigen-decomposition will yield an eigenvector pointing along the coll...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/integration/pca.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 39
- **Claim:** The distance metric relies on the quadratic form $M_K = V_K^T W V_K$. If a column of $V_K$ (an eigenvector) is multiplied by -1, the projection of the...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/v2/phase5_models.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (phase5_models does not implement SP-PRP-TOPSIS metric tensor; actual code in topsis.py uses standard Euclidean distance)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 40
- **Claim:** The dynamic retention $K = \min \{ k : \sum_{i=1}^k \lambda_i / \sum \lambda \geq \theta \}$ is a step function. If a perturbation shifts the 3rd comp...
- **Claim Type:** Implementation / Methodology
- **Classification:** A
- **Source File:** `asd_mcda/integration/pca.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** PASS (Code explicitly retains K components based on variance_threshold)
- **Answer Wording Appropriate?** YES
- **Severity:** None

### Question 41
- **Claim:** The covariance matrix $\Sigma$ for different drug profiles possesses vastly different spectra. If we fix $K=5$, a highly lipophilic compound might cap...
- **Claim Type:** Implementation / Methodology
- **Classification:** A
- **Source File:** `asd_mcda/integration/pca.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** PASS (Code explicitly retains K components based on variance_threshold)
- **Answer Wording Appropriate?** YES
- **Severity:** None

### Question 42
- **Claim:** The evaluation matrix maps the original feature vector $x \in \mathbb{R}^N$ to $y \in \mathbb{R}^{K_d}$ via the drug-specific projection matrix $V_{K_...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/v2/phase5_models.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 43
- **Claim:** According to the Davis-Kahan $\sin(\Theta)$ theorem, the angular deviation of the principal subspace under a perturbation matrix $E$ is bounded by $\f...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/integration/pca.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (pca.py does not calculate eigengaps or trigger DRG-0004 blocks)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 44
- **Claim:** When $\lambda_K \approx \lambda_{K+1}$, the threshold for $K$ has cleanly severed a degenerate eigenspace. This means the features contributing to com...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `Implementation source not independently verified; do not present this as an implementation fact.`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Fabricated/Disclaimed Source Trace)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 45
- **Claim:** If $K$ were allowed to fluctuate dynamically during each Monte Carlo draw (e.g., $K=4$ on draw 1, $K=5$ on draw 2), the resulting distribution of clos...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/uncertainty/monte_carlo.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 46
- **Claim:** Since the derivative of an eigenvector with respect to a matrix perturbation is inversely proportional to the eigengap ($\frac{\partial v_i}{\partial ...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/v2/phase5_models.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (phase5_models does not implement SP-PRP-TOPSIS metric tensor; actual code in topsis.py uses standard Euclidean distance)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 47
- **Claim:** The projection $V_K^T W V_K$ relies on the criteria weights aligning, at least partially, with the principal components. If feature $j$ has variance p...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/integration/pca.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 48
- **Claim:** PCA orders components by variance, which ideally corresponds to signal-to-noise ratio. Components beyond the optimal $K$ primarily describe assay nois...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/v2/phase5_models.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (phase5_models does not implement SP-PRP-TOPSIS metric tensor; actual code in topsis.py uses standard Euclidean distance)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 49
- **Claim:** Mathematically, any real symmetric covariance matrix will yield orthogonal eigenvectors, even if the eigenvalues are separated by $10^{-16}$ (machine ...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `Implementation source not independently verified; do not present this as an implementation fact.`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Fabricated/Disclaimed Source Trace)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 50
- **Claim:** The algorithm checks the eigengap $\delta = \lambda_K - \lambda_{K+1}$ at the exact index $K$ where the cumulative variance crosses 95%. If $\delta$ i...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/integration/pca.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (pca.py does not calculate eigengaps or trigger DRG-0004 blocks)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 51
- **Claim:** AHP requires a positive reciprocal matrix $A = (a_{ij})$ to guarantee that the principal eigenvalue $\lambda_{max}$ is real and non-negative (via the ...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/mcda/ahp.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 52
- **Claim:** For a reciprocal matrix, the trace is exactly $n$ (since diagonals $a_{ii} = 1$). The sum of all eigenvalues equals the trace. By a theorem of Frobeni...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/mcda/ahp.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 53
- **Claim:** Since the sum of all $n$ eigenvalues is $n$, the sum of the remaining $n-1$ eigenvalues is exactly $n - \lambda_{max}$. The average of these remaining...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/mcda/ahp.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 54
- **Claim:** The set of allowed matrix entries is discrete $(1/9, \dots, 1, \dots, 9)$. The characteristic polynomial for the eigenvalues involves sums of products...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/uncertainty/monte_carlo.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 55
- **Claim:** As $n$ increases, the number of required pairwise comparisons grows as $n(n-1)/2$. Beyond $n=4$ (6 comparisons), cognitive overload degrades transitiv...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/integration/pca.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 56
- **Claim:** Consistency Ratio (CR) strictly measures the variance of the principal eigenvalue $\lambda_{max}$ from $n$. It is an assessment of pairwise transitivi...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/mcda/ahp.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 57
- **Claim:** The AHP weighting phase establishes the governance policy (how much we care about toxicity vs efficacy). It does not measure the physical values; that...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/mcda/ahp.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 58
- **Claim:** Raising the pairwise matrix $A$ to successive powers ($A^k$) calculates the dominance of criteria along paths of length $k$. By Perron-Frobenius, as $...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/mcda/ahp.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 59
- **Claim:** In our architecture, AHP is strictly used to weight the *criteria*, not to evaluate the *alternatives*. Therefore, adding a new drug candidate does no...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/integration/pca.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 60
- **Claim:** By matrix perturbation theory (specifically the Davis-Kahan theorem for eigenspaces), the variation in the principal eigenvector $v$ due to a perturba...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/mcda/ahp.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 61
- **Claim:** By substituting the PC projection $X_K = X_{std} V_K$ into the weighted distance formulation, the diagonal weight matrix $W$ is sandwiched by the load...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/v2/phase5_models.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (phase5_models does not implement SP-PRP-TOPSIS metric tensor; actual code in topsis.py uses standard Euclidean distance)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 62
- **Claim:** For any non-zero vector $y \in \mathbb{R}^K$, $y^T M_K y = y^T (V_K^T W V_K) y = (V_K y)^T W (V_K y)$. Since $V_K$ has full column rank, $x = V_K y$ i...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/v2/phase5_models.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 63
- **Claim:** If we applied standard Euclidean TOPSIS on the PCA scores, we would have to either ignore the AHP weights or attempt to apply them directly to the PCs...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/v2/phase5_models.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (phase5_models does not implement SP-PRP-TOPSIS metric tensor; actual code in topsis.py uses standard Euclidean distance)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 64
- **Claim:** Because the input data is min-max normalized to $[0, 1]$ *before* PCA and weighting, the theoretical maximum possible value for any attribute is stric...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/v2/phase5_models.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (phase5_models does not implement SP-PRP-TOPSIS metric tensor; actual code in topsis.py uses standard Euclidean distance)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 65
- **Claim:** By utilizing the SP-PRP distances ($D_i^+$ using $M_K$ to $z^+$, and $D_i^-$ using $M_K$ to $z^-$), the ratio normalizes the score strictly to the $[0...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/v2/phase5_models.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 66
- **Claim:** The denominator is $D_i^+ + D_i^-$. Since $M_K$ is positive definite, $D_i = 0$ if and only if the alternative perfectly equals the reference point. B...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/v2/phase5_models.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 67
- **Claim:** If we shift all data points by a constant vector $c$, the distance between any two alternatives $i, j$ remains identically $(x_i - x_j)^T M_K (x_i - x...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/v2/phase5_models.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (phase5_models does not implement SP-PRP-TOPSIS metric tensor; actual code in topsis.py uses standard Euclidean distance)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 68
- **Claim:** Since $M_K = V_K^T W V_K$ is positive definite, we can define a matrix square root $R = M_K^{1/2}$. The distance calculation can then be written as $D...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/v2/phase5_models.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 69
- **Claim:** The full weight matrix $W$ is $N \times N$, while $M_K$ is $K \times K$. By utilizing only $V_K$ (the first $K$ eigenvectors), we implicitly project t...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/integration/pca.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 70
- **Claim:** PCA eigenvectors are unique only up to a sign change ($\pm v$). If the sign of the $k$-th column of $V_K$ flips, the corresponding $k$-th score for ev...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/v2/phase5_models.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 71
- **Claim:** The model injects independent Gaussian noise to evaluate the topological stability of the SP-PRP-TOPSIS ranking vector. It answers the question: "How ...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/uncertainty/monte_carlo.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 72
- **Claim:** If we applied variable $\sigma$ based on assay confidence, the MC output would conflate predictive uncertainty with algorithmic stability. By standard...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/v2/uncertainty.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 73
- **Claim:** Perturbing the final weights directly would violate the structural hierarchy of AHP. By applying noise to the off-diagonal elements $a_{ij}$ (and enfo...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/v2/uncertainty.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 74
- **Claim:** The governance layer enforces strict thresholding (e.g., predicted toxicity exceeding a hard cutoff). When a perturbation pushes a candidate's score a...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `Implementation source not independently verified; do not present this as an implementation fact.`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Fabricated/Disclaimed Source Trace)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 75
- **Claim:** Calculating top-1 frequency over $N_{valid}$ normalizes the relative dominance of the surviving candidates conditional on the project remaining viable...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/uncertainty/monte_carlo.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 76
- **Claim:** Top-1 frequency measures algorithmic stability. It indicates that the candidate's projection in the $M_K = V_K^T W V_K$ quadratic space is far enough ...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/v2/phase5_models.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (phase5_models does not implement SP-PRP-TOPSIS metric tensor; actual code in topsis.py uses standard Euclidean distance)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 77
- **Claim:** If A wins the base case but B dominates the MC iterations, it implies A's victory was hypersensitive to the exact coordinates of the unperturbed matri...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `Implementation source not independently verified; do not present this as an implementation fact.`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Fabricated/Disclaimed Source Trace)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 78
- **Claim:** Because the performance scores are strictly normalized, allowing perturbations $> 1.0$ would violate the geometric boundaries of the SP-PRP-TOPSIS ide...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/v2/uncertainty.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 79
- **Claim:** The joint MC perturbation simulates the real-world scenario of simultaneous parameter drift, giving us the global top-1 frequency. To isolate algorith...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/v2/uncertainty.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 80
- **Claim:** Stability is strictly a measure of variance, not magnitude. A candidate with low variance but a low mean SP-PRP-TOPSIS score is mathematically trapped...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/integration/pca.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 81
- **Claim:** Unlike Sobol indices which decompose actual variance $V(Y)$, the Morris $\mu^*$ computes $\frac{1}{r} \sum_{i=1}^r |EE_i|$. It bounds the maximum infl...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/sensitivity/morris.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 82
- **Claim:** A high Morris $\sigma$ mathematically demonstrates that the parameter's influence on the final rank is highly non-linear or strongly interacts with ot...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/v2/sensitivity.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 83
- **Claim:** The Morris method creates $r$ randomized start points and perturbs each parameter one-at-a-time by a fixed grid step $\Delta = \frac{p}{2(p-1)}$. Beca...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/v2/sensitivity.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 84
- **Claim:** Morris assumes completely independent input variables to isolate elementary effects. If variables like material density and yield strength are physica...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/integration/pca.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 85
- **Claim:** The final ranking depends on the relative distance to ideal solutions mapped through the $M_K = V_K^T W V_K$ quadratic form. Depending on the trajecto...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/sensitivity/morris.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 86
- **Claim:** The Monte Carlo $\sigma_{mc}$ is an *input* parameter defining the radius of the probability distribution used to test the top-1 frequency (computatio...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/uncertainty/monte_carlo.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 87
- **Claim:** AHP generates a continuous priority vector $\vec{w}$ such that $\sum w_i = 1$. The Morris screening perturbs these normalized continuous weights direc...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/mcda/ahp.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 88
- **Claim:** Monte Carlo applies simultaneous Gaussian noise scaled by $\sigma_{mc}$ to evaluate the Top-1 Frequency—the raw probability that the optimal choice su...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/uncertainty/monte_carlo.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Source exists but exact mechanism/symbol is not verified to support the claim)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 89
- **Claim:** Every Monte Carlo perturbation matrix and Morris trajectory grid is generated using an explicitly logged global seed. Furthermore, the input data matr...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `Implementation source not independently verified; do not present this as an implementation fact.`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Fabricated/Disclaimed Source Trace)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 90
- **Claim:** The core calculation engine requires the input of the dynamic eigenvectors $V_K$ and the diagonal weight matrix $W$. If $V_K$ fails to generate due to...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `asd_mcda/v2/phase5_models.py`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (phase5_models does not implement SP-PRP-TOPSIS metric tensor; actual code in topsis.py uses standard Euclidean distance)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 91
- **Claim:** Reproducibility is supported by documented inputs, deterministic calculations where applicable, fixed seeds for stochastic procedures, and provenance ...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `Implementation source not independently verified; do not present this as an implementation fact.`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Fabricated/Disclaimed Source Trace)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 92
- **Claim:** DRG-0002 represents a known data-integrity mismatch where the label does not match the chemical graph. Allowing it to propagate would mean the model e...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `Implementation source not independently verified; do not present this as an implementation fact.`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Fabricated/Disclaimed Source Trace)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 93
- **Claim:** Reproducibility is heavily dependent on the environment. For example, updating RDKit can change how specific 2D descriptors are calculated due to unde...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `Implementation source not independently verified; do not present this as an implementation fact.`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Fabricated/Disclaimed Source Trace)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 94
- **Claim:** The formulation $M_K = V_K^T W V_K$ and the subsequent distance calculations $D_i = \sqrt{ (t_i - t)^T M_K (t_i - t) }$ are direct linear algebra oper...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `Implementation source not independently verified; do not present this as an implementation fact.`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Fabricated/Disclaimed Source Trace)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 95
- **Claim:** The framework applies SP-PRP-TOPSIS to rank formulations based on computational stability under Monte Carlo perturbation. We do not employ machine lea...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `Implementation source not independently verified; do not present this as an implementation fact.`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Fabricated/Disclaimed Source Trace)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 96
- **Claim:** Class B validation confirms that the mathematical logic, data integrity, and numerical stability are verified within the documented computational boun...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `Implementation source not independently verified; do not present this as an implementation fact.`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Fabricated/Disclaimed Source Trace)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 97
- **Claim:** A high Morris $\mu^*$ indicates that small computational perturbations in a specific input parameter cause large structural changes in the final SP-PR...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `Implementation source not independently verified; do not present this as an implementation fact.`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Fabricated/Disclaimed Source Trace)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 98
- **Claim:** An AHP CR of 0.049415 simply proves that the expert's subjective pairwise comparisons are mathematically transitive and avoid logical contradictions. ...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `Implementation source not independently verified; do not present this as an implementation fact.`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Fabricated/Disclaimed Source Trace)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 99
- **Claim:** Upgrading to Class A validation requires closing the loop between the SP-PRP-TOPSIS outputs and empirical reality. This would require physical synthes...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `Implementation source not independently verified; do not present this as an implementation fact.`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Fabricated/Disclaimed Source Trace)
- **Answer Wording Appropriate?** NO
- **Severity:** P1

### Question 100
- **Claim:** The Monte Carlo parameters ($\sigma_{score} = 0.05$ and $\sigma_{AHP} = 0.15$) are intentionally injected Gaussian noise used to evaluate the topologi...
- **Claim Type:** Implementation / Methodology
- **Classification:** D
- **Source File:** `Implementation source not independently verified; do not present this as an implementation fact.`
- **Source Symbol:** Unverified/Mismatch
- **Verified Behavior:** FAIL (Fabricated/Disclaimed Source Trace)
- **Answer Wording Appropriate?** NO
- **Severity:** P1
