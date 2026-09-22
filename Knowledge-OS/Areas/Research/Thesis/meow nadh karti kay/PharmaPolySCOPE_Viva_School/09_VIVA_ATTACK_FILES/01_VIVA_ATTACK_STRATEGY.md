# VIVA ATTACK STRATEGY

## Core Directives for Defense

1. **Deny Experimental Validation Claims:** Never claim the software validates physical stability or replaces lab trials. The status is "Class B — Validation Pass with Documented Environment Limitation." Experimental validation is pending.
2. **Defend the Mathematics, Not the Physics:** You are defending a computational multi-criteria decision framework, not predicting thermodynamic truth. 
3. **Control the Vocabulary:** Never use the terms "predicts," "proves," "guarantees," "chance of success," or "probability." Use "ranks," "diagnoses," "computes," "computational perturbation," and "governance failure."
4. **Clarify PCA 'K':** K refers to the number of retained principal components dynamically selected to satisfy cumulative variance. It is strictly NOT a K-Means cluster count. Do not mention elbows, silhouettes, or clusters.
5. **SP-PRP-TOPSIS Rigor:** Defend the formulation: metric tensor $M_K = V_K^T W V_K$ in the PCA subspace. Explain the ideal ($z^+ = 1$) and anti-ideal ($z^- = 0$) references.
6. **AHP Consistency Ratio (CR):** CR < 0.08 indicates consistency in pairwise judgments (a mathematical property). It does not validate the scientific accuracy of the judgments.
7. **Monte Carlo Context:** $\sigma_{score}=0.05$ and $\sigma_{AHP}=0.15$ are defined computational perturbation parameters, not physically calibrated errors.
8. **Interpret Top-1 Frequency Carefully:** "Soluplus was ranked top-1 in 55.5116% of valid replicates under the specified computational perturbation and governance model." It is not an experimental probability of success.
9. **Morris Method Boundaries:** Morris yields $\mu^*$ (mean absolute elementary effect) and $\sigma$ (dispersion of elementary effects). It is a screening/sensitivity method, not a variance decomposition.
10. **Address DRG-0002 Head-On:** DRG-0002 was quarantined because the stored structure is mathematically inconsistent with the intended Fenofibrate profile, not because of a "completely unphysical density."
11. **Reject Hold-Out Sets:** Explicitly state there are no independent hold-out validation sets. This is not a machine learning train/test scenario.
12. **Focus on the Perturbation Model:** When asked about errors, point to the governance model and how blocked replicates (e.g., 1,400 out of 10,000 for Indomethacin) represent governance failures, with valid replicates ($N_{valid}$) acting as the denominator.
13. **Keep Source Traces Real:** Only reference actual implementation paths (e.g., `asd_mcda/mcda/ahp.py`, `asd_mcda/integration/pca.py`).
14. **Yield on Unverified Claims:** If an examiner asks about a software feature you are unsure of, state: "Implementation source not independently verified; do not present this as an implementation fact."
15. **Maintain Composure Under Hostility:** The examiner will try to goad you into making an overclaim. Stick purely to the validated computational facts and the exact definitions of the mathematical parameters.
