# Module 05: Decision Science - 01_DECISION_SCIENCE_FROM_ZERO

## 1. What is it? / Why does it exist? / Problem solved
Multi-criteria decision analysis (MCDA) provides a mathematical framework for evaluating and selecting alternatives when multiple, often conflicting, criteria are involved. In pharmaceutical polymer selection, evaluating polymers based on a single criterion (e.g., solubility parameter) is insufficient. We need to evaluate interaction compatibility, physical properties, and kinetic stability simultaneously. MCDA formalizes this trade-off process, moving from qualitative heuristics to quantitative ranking.

## 2. Beginner explanation (Level 1)
Imagine buying a car. You care about price, safety, speed, and fuel efficiency. A fast car might be unsafe, and a safe car might be expensive. You need a way to combine these different attributes to find the most suitable overall car. A decision matrix is just a table where each row is a car and each column is an attribute score. MCDA is the recipe for weighting those columns and scoring the cars so you can confidently say which car is the most balanced choice for your requirements.

## 3. Technical explanation (Level 2)
In formal decision theory, a decision matrix $S \in \mathbb{R}^{n \times m}$ defines $n$ alternatives evaluated across $m$ criteria. Pharmaceutical polymer selection involves complex thermodynamic and kinetic trade-offs. The PharmaPolySCOPE framework constructs a 4-criterion decision matrix where columns represent distinct physical rationales. A simple linear additive scoring model is inadequate because the criteria are non-commensurate, have different physical scales, and exhibit covariance. We employ SP-PRP-TOPSIS under a v2.0.0-SP-PRP-TOPSIS methodology to rigorously resolve these vectors into a computational top-1 frequency. 

## 4. Mathematics
The decision matrix is denoted as $S_{ij}$, where $i$ indexes the alternative and $j$ indexes the criterion.
Criteria vector: $C = [s_{HSP}, s_{chi}, s_{desc}, s_{GT}]$.
The methodology applies standardization: $Z_{ij} = \frac{S_{ij} - \mu_j}{\sigma_j}$ using population standard deviation (ddof=0).
The subsequent pipeline involves projecting this standardized matrix into a stable subspace via PCA and evaluating distances using a projected metric tensor.

## 5. Hand-calculable example
Consider a 3×2 toy decision matrix for 3 polymers across 2 criteria (e.g., Solubility, Stability).
Polymers: P1, P2, P3
Solubility: [0.8, 0.4, 0.6]
Stability: [0.2, 0.9, 0.5]
Standardizing Solubility ($\mu=0.6, \sigma=0.163$): P1=1.22, P2=-1.22, P3=0.0
Standardizing Stability ($\mu=0.533, \sigma=0.286$): P1=-1.16, P2=1.28, P3=-0.11
These Z-scores form the foundation for any subsequent distance-based ranking.

## 6. Actual production example
Indomethacin production S-matrix (5 polymers × 4 criteria):
- Soluplus:    s_HSP=0.7972, s_chi=0.8261, s_desc=0.3260, s_GT=0.0000
- HPMC E5:     s_HSP=0.7521, s_chi=0.7402, s_desc=0.3942, s_GT=0.9731
- PVP-VA64:    s_HSP=0.7073, s_chi=0.6377, s_desc=0.2942, s_GT=0.2368
- PVP K30:     s_HSP=0.6942, s_chi=0.6045, s_desc=0.2518, s_GT=0.9848
- Eudragit EPO: s_HSP=0.6359, s_chi=0.4393, s_desc=0.4094, s_GT=0.0000
These form a 5x4 matrix $S$ which is the fundamental input to the engine.


### Production Baseline Spectral Decomposition (Indomethacin):
- Eigenvalues: $\lambda = [2.090866, 1.167895, 0.739775, 0.001464]$
- Explained variance per PC: [52.27%, 29.20%, 18.49%, 0.04%]
- Cumulative variance: PC1 = 52.27%, PC1+PC2 = 81.47%, PC1+PC2+PC3 = 99.96% (threshold $\ge 95\%$ satisfied at $K=3$)
- Boundary eigengap: $\delta_3 = \lambda_3 - \lambda_4 = 0.739775 - 0.001464 = 0.7383$ (Governance status: STABLE, $\ge 0.10$)

## 7. Exact implementation trace
- Matrix defined in `models.py` line 16: `CANONICAL_CRITERIA_ORDER = ('s_HSP', 's_chi', 's_desc', 's_GT')`
- Criterion reordering is strictly prohibited: `engine.py` line 113-116.
- Pipeline execution: `engine.py` line 5.
- Class: `VariableKEngine` (`engine.py` line 47), execution in method `evaluate()` (`engine.py` line 58).

## 8. Inputs / Processing / Outputs
**Inputs**: $n \times 4$ raw decision matrix $S$.
**Processing**: Validates criteria order, standardizes (ddof=0), executes the pipeline (PCA $\rightarrow$ stability $\rightarrow$ AHP $\rightarrow$ metrics $\rightarrow$ diagnostics).
**Outputs**: Computes top-ranked computational candidate and stability diagnostics.

## 9. Assumptions / Limitations / Failure modes
- **Assumptions**: The 4 criteria adequately capture the physical properties dictating solid dispersion success.
- **Limitations**: The model cannot dynamically re-weight criteria if new physics are introduced without recalibrating the AHP.
- **Failure modes**: Rank deficient matrices or identically scoring candidates can cause degenerate eigenvalues if not handled.

## 10. Alternatives and why this method was used
Simple scoring models (weighted sum) ignore correlation among criteria. Classical TOPSIS uses Euclidean distance in the full space, which double-counts correlated physical effects. SP-PRP-TOPSIS projects into a decorrelated subspace to isolate independent physical phenomena before applying decision weights, mitigating collinearity bias.

## 11. Common misconceptions
- **Misconception**: MCDA is just adding up scores. **Correction**: Modern MCDA handles non-linearities, correlations, and topological distances.
- **Misconception**: The criteria order doesn't matter. **Correction**: The pipeline relies on `CANONICAL_CRITERIA_ORDER` being fixed for consistency.

## 12. 40 Viva Q&A
### Basic (10)
1. **Q**: What does MCDA stand for? **A**: Multi-criteria decision analysis.
2. **Q**: Why do we use MCDA? **A**: To evaluate alternatives across multiple conflicting criteria.
3. **Q**: What are the 4 criteria? **A**: s_HSP, s_chi, s_desc, s_GT.
4. **Q**: What is s_HSP? **A**: The compatibility diagnostic based on Hansen Solubility Parameters.
5. **Q**: What is s_chi? **A**: The interaction compatibility / phase-boundary diagnostic.
6. **Q**: What is s_GT? **A**: Model-predicted glass-transition margin.
7. **Q**: Can we reorder the criteria? **A**: No, engine.py lines 113-116 prohibits it.
8. **Q**: What is the matrix dimension for Indomethacin? **A**: 5 polymers x 4 criteria.
9. **Q**: What is a top-ranked computational candidate? **A**: The polymer with the highest final evaluation score.
10. **Q**: Do we use sample or population standard deviation? **A**: Population (ddof=0).

### Intermediate (10)
11. **Q**: How does v2 differ from v1.5? **A**: v1.5 used fixed K=2 and PCA PC1/PC2 AHP. v2 uses dynamic K, physical-criteria 4x4 AHP, and projected metric tensor SP-PRP-TOPSIS.
12. **Q**: What is the canonical criteria order? **A**: ('s_HSP', 's_chi', 's_desc', 's_GT') as per models.py line 16.
13. **Q**: Why is simple additive scoring inadequate for pharmaceutical polymer selection?
    - **Direct Answer:** Additive weighting assumes criteria orthogonality and mutual preference independence, both of which are severely violated in solid dispersion thermodynamics.
    - **Reasoning:** In ASD formulation, thermodynamic miscibility descriptors such as $s_{HSP}$ and $s_{\chi}$ share overlapping physical foundations (both depend heavily on dispersive and polar cohesive energy densities). A naive weighted sum ($S_i = \sum w_j s_{ij}$) double-counts these thermodynamic interactions while diluting the independent kinetic stabilization captured by $s_{GT}$.
    - **Implementation Trace:** `VariableKEngine.evaluate()` (`src/asd_mcda/v2/engine.py:58`) rejects simple summation; it decorrelates the 4 criteria via spectral decomposition (`decompose_spectral()` in `pca.py:52`) before evaluating distance metrics.
    - **Viva Defense Sentence:** *"If we simply add the criteria scores, we double-count collinear thermodynamic parameters and artificially suppress the kinetic glass-stabilizing contribution of Gordon–Taylor elevation."*
14. **Q**: What is the pipeline sequence? **A**: standardization -> PCA -> stability -> AHP -> metrics -> diagnostics.
15. **Q**: Which class handles this? **A**: VariableKEngine in engine.py line 47.
16. **Q**: What method starts evaluation? **A**: evaluate() at line 58.
17. **Q**: What is Soluplus's s_GT? **A**: 0.0000.
18. **Q**: What is HPMC E5's s_GT? **A**: 0.9731.
19. **Q**: What defines the computational top-1 frequency? **A**: The MC stability analysis over 10,000 runs.
20. **Q**: Why freeze the criteria order? **A**: Ensures AHP weights correctly map to their physical diagnostic parameters.

### Difficult (10)
21. **Q**: Why is s_chi distinct from s_HSP if both relate to compatibility? **A**: s_HSP evaluates dispersive/polar/hydrogen-bonding distance, while s_chi is the interaction compatibility phase-boundary diagnostic derived from Flory-Huggins theory.
22. **Q**: How does the engine treat degenerate criteria? **A**: It relies on PCA to identify rank-deficient subspaces.
23. **Q**: What happens if the criteria are identically zero? **A**: Standardization with ddof=0 will fail with division by zero; input validation rejects zero-variance columns.
24. **Q**: Why use a decision matrix instead of a mechanistic equation? **A**: No single mechanistic equation perfectly combines kinetic (s_GT) and thermodynamic (s_chi) stability.
25. **Q**: How do we define success? **A**: By finding the top-ranked computational candidate, robust to noise.
26. **Q**: In v1.5-FOUR-CRITERION-FREEZE, what was frozen? **A**: The 4 criteria columns and the K=2 assumption.
27. **Q**: How does VariableKEngine determine K? **A**: Dynamically via explained variance thresholds.
28. **Q**: What is the role of `s_desc`? **A**: It serves as a molecular descriptor diagnostic.
29. **Q**: Why is Eudragit EPO s_HSP 0.6359 but s_chi 0.4393? **A**: Because HSP and chi parameter models scale differently based on polymer molecular volume and interaction types.
30. **Q**: Are the values in the S-matrix scaled prior to engine input? **A**: No, the engine handles standardization natively.

### Hostile / Challenging (10)
31. **Q**: Isn't MCDA just a subjective heuristic dressed up in math? **A**: While weights are derived via AHP, the SP-PRP-TOPSIS framework strictly enforces topological distances in a decorrelated space, anchoring the heuristic to measurable physical variance.
32. **Q**: You claim this is predictive, but you just ranked things. Where's the probability? **A**: We output the computational top-1 frequency via Monte Carlo perturbations; we never claim a physiological "probability of success."
33. **Q**: Your s_GT for Soluplus is 0.0, isn't that physically impossible? **A**: The values are margins mapped to a diagnostic scale, bounded at 0 for negative predictive margins.
34. **Q**: Why freeze criteria order? Isn't that bad coding practice? **A**: It guarantees structural integrity between the AHP weight vector and the subspace projection, preventing silent alignment failures.
35. **Q**: Isn't SP-PRP-TOPSIS just classical Hwang–Yoon TOPSIS under a complicated academic name?
    - **Direct Answer:** Absolutely not. SP-PRP-TOPSIS differs from classical Hwang–Yoon TOPSIS in coordinate space, metric definition, reference anchor stability, and truncation auditing.
    - **Reasoning:** Classical TOPSIS evaluates Euclidean distances in the full, un-decorrelated criterion space $\mathbb{R}^p$ against empirical cohort extrema (min/max), which causes severe rank reversal when cohort members change. SP-PRP-TOPSIS projects candidates into an orthogonal PCA subspace $\mathbb{R}^K$, applies a positive-definite quadratic-form metric tensor $M_K = V_K^T W V_K$ that preserves physical AHP preferences without collinearity bias, and measures distance to fixed physical anchors ($[1,1,1,1]$ and $[0,0,0,0]$).
    - **Implementation Trace:** Orchestrated in `src/asd_mcda/v2/engine.py:58`, utilizing `metrics.py` for tensor projection and `diagnostics.py:40` for signed discrepancy auditing ($\Delta D^2, E_i$).
    - **Viva Defense Sentence:** *"Classical TOPSIS assumes orthogonal criteria, floating empirical anchors, and Euclidean distances; SP-PRP-TOPSIS explicitly resolves criteria collinearity via PCA projection and measures quadratic-form distances against absolute thermodynamic anchors."*
36. **Q**: Why ddof=0? Sample standard deviation is standard. **A**: We evaluate the entire known candidate pool as the population for the ranking problem, not a sample of a broader unknown population.
37. **Q**: The difference between v1.5 and v2 is trivial. **A**: False. Moving from PCA-weighted components to a projected metric tensor incorporating physical AHP weights completely redefines the distance metric.
38. **Q**: Why can't we simply calculate Euclidean distance directly on the standardized decision matrix $Z$?
    - **Direct Answer:** Euclidean distance in standardized space implicitly assumes that the identity matrix $I$ is an appropriate metric tensor, ignoring both the covariance between criteria and their differential physical importance.
    - **Reasoning:** In standardized space $Z$, the axes are normalized to unit variance but remain oblique (non-orthogonal) due to criterion correlations ($r_{s_{HSP}, s_{\chi}} \approx 0.85$). Euclidean distance treats these oblique axes as orthogonal, distorting physical distance and overweighting the collinear thermodynamic cluster relative to kinetic stabilization ($s_{GT}$) and descriptor compatibility ($s_{desc}$).
    - **Implementation Trace:** Line 112 of `src/asd_mcda/v2/metrics.py` calculates $M_K = V_K^T W V_K$, transforming the diagonal AHP weight matrix $W$ through the eigenvector basis $V_K$ to create an anisotropic quadratic form $q = \Delta t^T M_K \Delta t$.
    - **Viva Defense Sentence:** *"Applying Euclidean distance directly to standardized criteria implicitly treats oblique, correlated physical axes as an orthonormal Cartesian frame, creating severe collinearity distortion in the candidate ranking."*
39. **Q**: Can I add a 5th criterion, say 'cost'? **A**: Not under v2.0.0-SP-PRP-TOPSIS methodology, which is rigidly calibrated to the 4 physical criteria.
40. **Q**: Your Indomethacin data is cherry-picked. **A**: These are the validated production S-matrix values used to benchmark the engine's precision across known solid dispersion behaviors.

## 13. One-minute, five-minute, and board explanations
**1-Minute**: PharmaPolySCOPE uses MCDA to rank polymers by balancing 4 conflicting physical criteria (s_HSP, s_chi, s_desc, s_GT). It forms a decision matrix, standardizes it, and processes it through a custom pipeline to identify the top-ranked computational candidate.
**5-Minute**: Selecting a polymer requires balancing thermodynamics and kinetics. We format these as a 5x4 decision matrix for Indomethacin. Because these criteria overlap (e.g., s_HSP and s_chi), simple scoring fails. Our v2 VariableKEngine standardizes the matrix, decorrelates the data using PCA, and computes rankings using a projected metric tensor, yielding a robust computational top-1 frequency.
**Board**: Draw a 5x4 matrix $S$. Write $Z_{ij} = (S_{ij}-\mu_j)/\sigma_j$. Draw arrows to PCA, then AHP weights, then distance calculation. Emphasize that classical TOPSIS uses Euclidean space, while our SP-PRP-TOPSIS uses a subspace metric tensor.

## 14. Things never to claim
- NEVER claim "probability of success" (use "computational top-1 frequency").
- NEVER call the output the "best polymer" or "optimal polymer" (use "top-ranked computational candidate").
- NEVER call the method "classical Hwang-Yoon TOPSIS".

## 15. Cross-references to other modules
- See Module 02 for physical derivation of `s_HSP` and `s_chi`.
- See Module 03 for `s_GT` calculation.
- See Module 06 for details on the SP-PRP-TOPSIS metric tensor.
