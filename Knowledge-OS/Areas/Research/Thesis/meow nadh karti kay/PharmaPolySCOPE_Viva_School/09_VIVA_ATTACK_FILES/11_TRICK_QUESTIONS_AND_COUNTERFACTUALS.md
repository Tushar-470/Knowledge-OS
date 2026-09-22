2# MODULE 11: TRICK QUESTIONS AND COUNTERFACTUALS

**1. (TRICK): How did you determine K=3 for your K-Means clustering of Indomethacin carriers?**
**RESPONSE:** Wrong premise. There is absolutely NO K-Means in PharmaPolySCOPE v2. K=3 refers to the number of retained PCA principal components dynamically selected to satisfy cumulative variance.

**2. (TRICK): Can you walk me through the generic Euclidean TOPSIS distance calculation in your model?**
**RESPONSE:** Wrong premise. v2 uses strict SP-PRP-TOPSIS, not generic Euclidean TOPSIS. Distance is calculated as a quadratic form using the metric tensor $M_K = V_K^T W V_K$ in the PCA subspace, with standardized ideal $z^+=1$ and anti-ideal $z^-=0$.

**3. (TRICK): What was the performance on your independent hold-out set?**
**RESPONSE:** Wrong premise. There is no independent hold-out set. This is an MCDA decision-support tool, not an ML train/test hold-out study. 

**4. (TRICK): Since DRG-0002 had a completely unphysical density, how did your model catch it?**
**RESPONSE:** Wrong premise. DRG-0002 was quarantined because the stored structure is inconsistent with the intended Fenofibrate profile. It has nothing to do with an "unphysical density".

**5. (TRICK): Does the variance decomposition from your Morris analysis align with physical interactions?**
**RESPONSE:** Wrong premise. Morris is a screening/sensitivity method ($\mu^*$, $\sigma$), not a variance decomposition method. It evaluates elementary effects, not physical causal interactions.

**6. (TRICK): Since 1,400 formulations for Indomethacin were physically impossible, how did the Monte Carlo simulator handle them?**
**RESPONSE:** Wrong premise. The 1,400 blocked replicates out of 10,000 for Indomethacin represent governance failures (e.g., CR exceeding thresholds), not physically impossible formulations.

**7. (TRICK): If Soluplus has a 55.5116% probability of experimental success, does that guarantee a stable formulation?**
**RESPONSE:** Wrong premise. 55.5116% is not a "chance of success" or experimental probability. It strictly means Soluplus was ranked top-1 in 55.5116% of valid replicates ($N=8,600$) under the specified computational perturbation and governance model. We do not use words like "guarantee".

**8. (TRICK): Since your AHP CR was below 0.08, does this prove your expert weights reflect the thermodynamic truth of the system?**
**RESPONSE:** Wrong premise. A $CR < 0.08$ strictly diagnoses mathematical consistency among pairwise judgments. It does NOT prove scientific truth, optimality, or thermodynamic validity.

**9. (TRICK): How did you calibrate your experimental errors for $\sigma_{score}=0.05$ and $\sigma_{AHP}=0.15$?**
**RESPONSE:** Wrong premise. These are defined computational perturbation parameters used to test the model's mathematical stability, NOT experimentally calibrated errors.

**10. (TRICK): Did the successful software tests in `docs/module_X.md` prove the in-vivo performance of the Class A validation?**
**RESPONSE:** Wrong premise on three fronts: First, the study is Class B — Validation Pass with Documented Environment Limitation (experimental validation is pending). Second, software tests never prove in-vivo performance. Third, `docs/module_X.md` is an invalid invented source path; actual logic resides in the `asd_mcda/` framework.
