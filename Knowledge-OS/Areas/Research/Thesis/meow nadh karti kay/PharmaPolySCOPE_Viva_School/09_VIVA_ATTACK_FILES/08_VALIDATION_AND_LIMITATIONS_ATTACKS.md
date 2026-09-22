# MODULE 08: VALIDATION AND LIMITATIONS ATTACKS

**1. Where is the independent hold-out set used to validate your model's accuracy?**
There is no independent hold-out set. The PharmaPolySCOPE framework is an MCDA decision-support tool, not a machine learning model performing predictive train/test splits.

**2. Has this framework been experimentally validated in a laboratory?**
No. The study is strictly Class B — Validation Pass with Documented Environment Limitation. Experimental formulation validation remains PENDING.

**3. Does the consistency ratio ($CR < 0.08$) prove that the user's judgments are scientifically correct?**
No. A $CR < 0.08$ strictly diagnoses mathematical consistency among pairwise judgments in the AHP matrix. It does NOT prove scientific truth, optimality, or experimental validity.

**4. Soluplus was ranked top-1 in 55.5116% of replicates. Does this mean it has a 55% chance of experimental success?**
Absolutely not. It means Soluplus was ranked top-1 in 55.5116% of valid replicates under the specified computational perturbation and governance model. It is not an experimental probability or "chance of success".

**5. Can you claim your model "proves" Soluplus is the "best" carrier for Indomethacin?**
No. Avoid words like "proves", "guarantee", or "best". The model ranks Soluplus highest according to the specified mathematical criteria, weights, and input data within a defined decision framework.

**6. How does your validation address the gap between in-silico scores and in-vivo performance?**
It does not bridge that gap. The Class B validation acknowledges that software tests do not prove in-vivo or in-vitro physical performance. Experimental validation is explicitly listed as pending.

**7. If your system passes all unit tests, doesn't that guarantee the mathematical formulations are optimal?**
No. It guarantees the algorithms execute the SP-PRP-TOPSIS and AHP logic correctly without software faults. It does not guarantee physical optimality.

**8. Your Morris analysis shows a high $\mu^*$ for a specific descriptor. Does this mean it causes a physical change in stability?**
No. $\mu^*$ represents the mean absolute elementary effect, which is purely a mathematical screening/sensitivity measure of the model's response to input changes. It does not prove a physical causal effect.

**9. If we test Soluplus in the lab and it fails, does that invalidate your entire software framework?**
It would invalidate the specific criteria or weights chosen for that drug scenario, but the MCDA computational framework itself (Class B validation) remains mathematically valid as a decision-support tool.

**10. Can you point to the validation script that calibrates $\sigma_{score}$ against lab data?**
Implementation source not independently verified; do not present this as an implementation fact. $\sigma_{score}=0.05$ is a defined computational perturbation parameter, not an experimentally calibrated error.
