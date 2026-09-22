# MODULE 07: SOFTWARE AND REPRODUCIBILITY ATTACKS

**1. What is the specific source file implementing the Monte Carlo perturbation logic?**
The perturbation logic is implemented in `asd_mcda/uncertainty/monte_carlo.py`.

**2. How is PCA integrated with TOPSIS in the codebase?**
PCA integration is handled via `asd_mcda/integration/pca.py`, which provides the projection matrix $V_K$. This matrix is then utilized by the SP-PRP-TOPSIS implementation in `asd_mcda/mcda/topsis.py` to construct the metric tensor $M_K = V_K^T W V_K$.

**3. How do you defend against the claim that 1,400 blocked replicates out of 10,000 for Indomethacin represent physically impossible formulations?**
The 1,400 blocked replicates are governance failures (e.g., consistency ratio exceeding thresholds during perturbation), not physically impossible formulations.

**4. What is the denominator for calculating top-1 frequency in the Monte Carlo simulation?**
The denominator is strictly $N_{valid}$ (8,600 for the Indomethacin case study), not the total 10,000 replicates. 

**5. What exactly do $\sigma_{score}=0.05$ and $\sigma_{AHP}=0.15$ represent?**
They are defined computational perturbation parameters used to test the mathematical robustness of the MCDA rankings. They are NOT experimentally calibrated physical errors.

**6. Which file computes the pairwise consistency ratio for the analytical hierarchy process?**
The consistency ratio logic is located in `asd_mcda/mcda/ahp.py`.

**7. Does a successful run of your test suite guarantee the algorithm will find a stable formulation?**
No. Software tests strictly verify computational correctness of the MCDA algorithms. They do not prove experimental validity or in-vivo performance.

**8. What does a high $\sigma$ value indicate when analyzing the output of `asd_mcda/uncertainty/morris.py`?**
A high $\sigma$ indicates a high dispersion of elementary effects (suggesting non-linearities or interactions). It is a screening/sensitivity method, not a variance decomposition or physical causal effect.

**9. If a reviewer asks for the repository script that defines the thermodynamic truth of your model, how do you respond?**
Implementation source not independently verified; do not present this as an implementation fact. The framework is an MCDA model designed for decision support, not a first-principles thermodynamic simulation. Avoid all overclaims regarding "thermodynamic truth".

**10. Why is DRG-0002 quarantined in the software pipeline? Is it due to unphysical density?**
DRG-0002 is quarantined because the stored structure is inconsistent with the intended Fenofibrate profile. It has absolutely nothing to do with "completely unphysical density".
