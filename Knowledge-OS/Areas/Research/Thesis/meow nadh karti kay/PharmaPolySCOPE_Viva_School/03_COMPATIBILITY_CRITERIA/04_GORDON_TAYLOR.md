# 04 Gordon-Taylor and Kinetic Stability
---
## Cross-Reference
**Prerequisite knowledge:** Glass Transition Temperature ($T_g$), Free volume theory, Amorphous solids.
**Used later by:** Module 04 (PCA Dimensionality Reduction).
**Related source code:** `src/asd_mcda/compatibility/gordon_taylor.py`
**Related tests:** `tests/v2/`
**Related validation artifact:** `scientific_validation_results.json`
**Related viva attack:** Part 9

---
## Part 1: Beginner Understanding [BEGINNER]

Imagine a jar of honey. If you put it in the freezer, it becomes hard as rock—you can't even dent it with a spoon. If you leave it in the sun, it becomes a runny liquid. The point at which it transitions from a "glassy" hard solid to a "rubbery" slow-moving liquid is similar to the Glass Transition Temperature ($T_g$). 

In an Amorphous Solid Dispersion (ASD), the drug is trapped in a chaotic, non-crystalline state. If the molecules can wiggle around and move (which happens above $T_g$), they will eventually find each other and form crystals. Once the drug crystallizes, the ASD has failed. Therefore, to ensure the drug stays trapped (kinetically stable) on the pharmacy shelf, the formulation must remain below its $T_g$. 

The Gordon-Taylor model helps us predict the $T_g$ of the *mixture* ($T_{g,mix}$) when we blend a low-$T_g$ drug with a high-$T_g$ polymer. By calculating $T_{g,mix}$, we can verify if the resulting plastic-like material will stay glassy at room temperature, acting as a **model-predicted glass-transition margin**.

---
## Part 2: Technical Background [TECHNICAL]

### Physical Meaning of $T_g$
The Glass Transition Temperature ($T_g$) is the temperature below which long-range cooperative segmental mobility ceases. 
* **Below $T_g$:** The material is a glassy solid. Molecular diffusion is on the order of years or decades. The drug is kinetically frozen.
* **Above $T_g$:** The material is rubbery. Free volume increases, molecular diffusion is rapid, and the drug can easily recrystallize.

### The Gordon-Taylor Equation
Gordon and Taylor (1952) proposed an equation to predict the $T_g$ of binary mixtures based on the assumption of ideal volume additivity (the free volume of the mixture is the sum of the fractional free volumes of the components):
$$T_{g,mix} = \frac{w_1 T_{g1} + K w_2 T_{g2}}{w_1 + K w_2}$$
Where:
* $w_1$ = weight fraction of the drug (default $0.30$ in PharmaPolySCOPE).
* $w_2$ = weight fraction of the polymer ($1 - w_1 = 0.70$).
* $T_{g1}$ = $T_g$ of the drug.
* $T_{g2}$ = $T_g$ of the polymer.
* $K$ = The Simha-Boyer constant.

### The Simha-Boyer Constant ($K$)
The parameter $K$ weights the relative free-volume contributions of the two components. Simha and Boyer (1962) provided the approximation:
$$K = \frac{\rho_1 T_{g1}}{\rho_2 T_{g2}}$$
Where $\rho$ is density. This implies that the contribution of a component to $T_{g,mix}$ is proportional to its specific volume expansion at $T_g$.

### The Boyer-Beaman Rule
If the experimental $T_g$ of a drug is unknown, PharmaPolySCOPE uses the Boyer-Beaman rule (`BOYER_BEAMAN_FACTOR = 0.70`), which states that the glass transition temperature is approximately 70% of the melting temperature ($T_m$) in Kelvin:
$$T_g (K) \approx 0.70 \times T_m (K)$$

---
## Part 3: Literature Form vs PharmaPolySCOPE Form [COMPARISON]

### Literature Form
The literature primarily concerns itself with predicting the exact $T_{g,mix}$ value using the equations above. 
$$T_{g,mix} = \frac{w_1 T_{g1} + K w_2 T_{g2}}{w_1 + K w_2}$$
The Kwei equation is an extension that adds a specific interaction parameter $q$:
$$T_{kwei} = T_{g,mix} + q w_1 w_2$$
A positive $q$ indicates strong specific interactions (like H-bonding) that restrict mobility, raising $T_g$ above ideal GT predictions.

### PharmaPolySCOPE Form
In PharmaPolySCOPE, predicting $T_{g,mix}$ is not enough; it must be converted into a bounded criterion ($s_{GT}$) for the MCDA matrix. The score must reflect a safety margin above the drug's baseline mobility.

$$s_{GT} = \text{clip} \left( \frac{T_{g,mix} - (T_{g,drug} + 30.0)}{50.0}, 0.0, 1.0 \right)$$

**Explanation of the Formula:**
1. **Reference Point ($T_{g,drug} + 30.0$):** The system establishes a baseline target. The mixture must have a $T_g$ at least $30\ K$ higher than the pure amorphous drug to be considered kinetically advantageous. 
2. **Normalization Range ($50.0$):** The score scales linearly over a $50\ K$ window. 
3. **Clipping:** 
   * If $T_{g,mix} \le T_{g,drug} + 30\ K$, $s_{GT} = 0.0$.
   * If $T_{g,mix} \ge T_{g,drug} + 80\ K$, $s_{GT} = 1.0$.

---
## Part 4: Worked Numerical Example [EXAMPLE]

### Hypothetical Hand-Calculable Example
**Drug:**
* $T_{g1} = 320\ K$
* $\rho_1 = 1.25\ g/cm^3$

**Polymer:**
* $T_{g2} = 390\ K$
* $\rho_2 = 1.20\ g/cm^3$

**Settings:**
* $w_1 = 0.30$, $w_2 = 0.70$

**Step 1: Calculate $K$**
* $K = \frac{1.25 \times 320}{1.20 \times 390} = \frac{400}{468} \approx 0.855$

**Step 2: Calculate $T_{g,mix}$**
* Numerator = $(0.30 \times 320) + (0.855 \times 0.70 \times 390)$
* Numerator = $96 + 233.415 = 329.415$
* Denominator = $0.30 + (0.855 \times 0.70) = 0.30 + 0.5985 = 0.8985$
* $T_{g,mix} = \frac{329.415}{0.8985} = 366.6\ K$

**Step 3: Calculate $s_{GT}$**
* Reference = $T_{g1} + 30 = 320 + 30 = 350\ K$
* Range = $50\ K$
* $s_{GT} = \text{clip} \left( \frac{366.6 - 350}{50}, 0, 1 \right) = \text{clip} \left( \frac{16.6}{50}, 0, 1 \right) = 0.332$

### Validated Indomethacin Values (Production)
For Indomethacin ($T_g = 315.15\ K$, $\rho = 1.31\ g/cm^3$):
Reference limit = $315.15 + 30 = 345.15\ K$.
* **Soluplus:** $0.0000$ (Soluplus is a low-$T_g$ polymer, $T_{g,mix} \le 345.15\ K$)
* **Eudragit E PO:** $0.0000$ (Also low-$T_g$)
* **PVP-VA64:** $0.2368$
* **HPMC E5:** $0.9731$ (High-$T_g$ polymer, $T_{g,mix}$ is very high)
* **PVP K30:** $0.9848$

---
## Part 5: PharmaPolySCOPE Implementation [IMPLEMENTATION]

### Source File Location
`src/asd_mcda/compatibility/gordon_taylor.py` -> `Class GordonTaylorModel`

### Implementation Trace
**Concept** $\rightarrow$ Kinetic stability proxy via glass transition mixture.
**Input** $\rightarrow$ `drug` ($T_g$, density), `polymer` ($T_g$, density), `drug_loading_ww` (0.30).
**Function** $\rightarrow$ `compute_k_simha_boyer(polymer)`, `compute_tg_mix(polymer)`, `compute_s_gt(polymer)`.
**File** $\rightarrow$ `gordon_taylor.py`
**Computation** $\rightarrow$ 
1. Establishes $K = (\rho_1 \times T_{g1}) / (\rho_2 \times T_{g2})$.
2. Calculates $T_{g,mix} = (w_1 T_{g1} + K w_2 T_{g2}) / (w_1 + K w_2)$.
3. Optional Kwei calculation: `Tg_kwei = Tg_GT + q*w1*w2` (skipped in baseline).
4. Normalizes via `clip((Tg_mix - (Tg_drug + 30.0)) / 50.0, 0.0, 1.0)`.
**Output** $\rightarrow$ `s_GT` float value.
**Next stage** $\rightarrow$ Matrix compilation in `build_matrix()`.

---
## Part 6: Assumptions and Limitations [LIMITATIONS]
1. **Ideal Additivity:** Gordon-Taylor assumes ideal volume additivity ($\Delta V = 0$). Real systems often exhibit volume contraction due to specific interactions, causing experimental $T_g$ to exceed GT predictions.
2. **Kinetic Proxy Only:** $T_g$ is not absolute stability. A polymer with a high $T_g$ but terrible thermodynamic miscibility will still phase separate rapidly in the solid state.
3. **Moisture Ignored:** Water acts as a severe plasticizer. The model calculates dry $T_g$. In real-world conditions, ambient moisture significantly lowers the true $T_{g,mix}$.
4. **Empirical Anchors:** The $+30\ K$ threshold and $50\ K$ scale are engineering heuristics designed for MCDA separation, not fundamental physical laws.

---
## Part 7: Viva Questions [VIVA]

### A. 10 Basic Q&A
**Q1: What does $T_g$ stand for?**
A: Glass Transition Temperature.

**Q2: What is the physical state of a polymer below its $T_g$?**
A: A glassy, rigid solid with extremely low molecular mobility.

**Q3: What equation is used to predict the $T_g$ of the drug-polymer mixture?**
A: The Gordon-Taylor equation.

**Q4: What is the default drug loading used in the calculations?**
A: $0.30$ ($30\%$ by weight).

**Q5: What is the parameter $K$ in the equation?**
A: The Simha-Boyer constant, which weights the relative free-volume contributions.

**Q6: How does PharmaPolySCOPE estimate a drug's $T_g$ if it is unknown?**
A: Using the Boyer-Beaman rule: $T_g (K) \approx 0.70 \times T_m (K)$.

**Q7: What is the reference point for the $s_{GT}$ score?**
A: $T_{g,drug} + 30\ K$.

**Q8: If $T_{g,mix}$ is equal to the drug's $T_g$, what is the $s_{GT}$ score?**
A: $0.0$, because it is below the $+30\ K$ threshold.

**Q9: What does a score of 0.0 for Soluplus indicate?**
A: It indicates that mixing Indomethacin with Soluplus results in a $T_{g,mix}$ that fails to provide a 30 K margin above the drug's own $T_g$.

**Q10: What is the correct terminology for $s_{GT}$?**
A: A model-predicted glass-transition margin.

### B. 10 Intermediate Q&A
**Q11: How is the Simha-Boyer constant $K$ calculated?**
A: $K = (\rho_1 \times T_{g1}) / (\rho_2 \times T_{g2})$.

**Q12: Why is a high $T_{g,mix}$ desirable for an ASD?**
A: It ensures the formulation remains in a glassy state at room temperature, severely restricting molecular mobility and preventing recrystallization.

**Q13: How does the Kwei equation differ from Gordon-Taylor?**
A: It adds a parameter $q$ to account for specific intermolecular interactions (like H-bonding) that restrict mobility and raise $T_g$ beyond ideal volume additivity predictions.

**Q14: If $w_1$ is 0.50, what is $w_2$?**
A: $0.50$ (since $w_1 + w_2 = 1$).

**Q15: What happens to $s_{GT}$ if $T_{g,mix}$ is $100\ K$ higher than the reference?**
A: It is clipped at $1.0$.

**Q16: Is $s_{GT}$ a thermodynamic or kinetic metric?**
A: It is a proxy for kinetic stability.

**Q17: Why do HPMC E5 and PVP K30 have very high $s_{GT}$ scores?**
A: Because they are inherently high-$T_g$ polymers, so when mixed at 70% weight, they elevate the mixture's $T_g$ significantly above the Indomethacin baseline.

**Q18: What is the normalization range used in the $s_{GT}$ equation?**
A: $50\ K$.

**Q19: If density data is missing, how does it affect $K$?**
A: It can cause errors. However, drug densities typically hover around $1.2-1.4\ g/cm^3$, so the density ratio $\rho_1/\rho_2$ is often close to 1, making $T_{g1}/T_{g2}$ the dominant factor.

**Q20: Why did the system designers choose $+30\ K$ as a baseline instead of room temperature?**
A: To provide a relative margin based on the drug's intrinsic mobility rather than an absolute temperature, ensuring the polymer actively contributes to stabilizing the specific API.

### C. 10 Difficult Q&A
**Q21: Derive the physical basis of the Simha-Boyer rule.**
A: The Simha-Boyer rule is derived from the observation that the fractional free volume at $T_g$ is approximately constant (~0.113) for all amorphous polymers. Therefore, the difference in thermal expansion coefficients above and below $T_g$ multiplied by $T_g$ is constant, leading directly to the density ratio approximation.

**Q22: Defend the choice of using the clip function rather than a sigmoid.**
A: The clip function provides a linear response within the critical operational window (30-80 K margin). A sigmoid would compress the variance in the middle of the range, which is exactly where we need linear mathematical separation for the PCA algorithms to distinguish nuanced differences between polymers.

**Q23: How does the Gordon-Taylor model handle strong hydrogen bonding between the drug and polymer?**
A: It fails to handle it completely. GT assumes ideal mixing. Strong H-bonding causes volume contraction, reducing free volume and elevating experimental $T_g$ higher than the GT prediction. This requires the Kwei modification to model accurately.

**Q24: What is the impact of moisture on $T_g$, and how is it modeled here?**
A: Moisture acts as a potent plasticizer, drastically lowering $T_g$ (the Fox equation handles plasticization). This model does *not* account for moisture; it assumes perfectly dry conditions, representing a theoretical maximum kinetic margin.

**Q25: If a polymer has a $s_{GT}$ of 1.0 but an $s_{\chi}$ of 0.0, what does this mean physically?**
A: It means the polymer is extremely rigid (high $T_g$) but fundamentally incompatible with the drug thermodynamically. The system will likely phase-separate during manufacturing (melt extrusion) before it ever has a chance to form a stable glass.

**Q26: Why is $w_1$ fixed at 0.30 instead of being optimized dynamically?**
A: To establish a uniform mathematical baseline for comparative MCDA. If $w_1$ varied, the matrix would be comparing different system states, invalidating the rank-order logic. 30% is a standard, industrially relevant baseline drug loading.

**Q27: Explain the thermodynamic difference between $T_g$ and $T_m$.**
A: $T_m$ (melting point) is a first-order thermodynamic transition with a discontinuous change in enthalpy and volume. $T_g$ is a second-order kinetic transition characterized by a change in the derivative properties (heat capacity, thermal expansion coefficient) without latent heat.

**Q28: Why might a low-$T_g$ polymer like Soluplus still be useful despite an $s_{GT}$ of 0?**
A: Soluplus has excellent thermodynamic properties (high $s_{\chi}$, high $s_{HSP}$) and specific interactions. If stored correctly (desiccated, refrigerated), or used for immediate-release formulations where kinetic shelf-life isn't the limiting factor, it is highly valuable.

**Q29: How does the molecular weight of the polymer affect the Gordon-Taylor prediction?**
A: In the classical GT equation, MW is ignored, assuming the polymer is above its entanglement molecular weight where $T_g$ plateaus (Flory-Fox equation). For oligomers, GT would overestimate $T_{g,mix}$.

**Q30: Why is $s_{GT}$ termed a 'proxy' for kinetic stability?**
A: Because true kinetic stability depends on the activation energy of molecular diffusion (Adam-Gibbs theory), nucleation rates, and crystal growth kinetics. $T_g$ only dictates the temperature below which these processes are exceptionally slow; it does not model the processes themselves.

### D. 10 Hostile Q&A
**Q31: "Your model gave Soluplus a score of zero. But Soluplus is widely used in industry. Your tool is broken."**
A: The tool is perfectly functional. It correctly identifies that Soluplus fails to provide a massive $T_g$ margin for this specific high-melting drug. The matrix requires 4 criteria. Soluplus scores extremely high on thermodynamics. It is the user's job to balance thermodynamics against kinetics using the MCDA weights.

**Q32: "You use the Boyer-Beaman rule for unknown $T_g$. That rule is wildly inaccurate for complex APIs."**
A: It is an established, peer-reviewed first-order approximation (typically $\pm 15\%$). In the absence of experimental data, statistical estimation is strictly superior to dropping the matrix column entirely, which would mathematically cripple the PCA.

**Q33: "The Gordon-Taylor equation is outdated. Why didn't you use Molecular Dynamics to calculate free volume?"**
A: MD requires supercomputing time and empirical force-field parameterization for every novel API, which fundamentally breaks the requirement for a high-throughput, deterministic MCDA screener. GT provides instant, rank-order valid approximations.

**Q34: "You claim $s_{GT}$ predicts the glass transition margin, but you completely ignore the Kwei equation in the baseline. Why?"**
A: The Kwei $q$ parameter must be experimentally fitted for every drug-polymer pair. We cannot mandate experimental pre-fitting for a predictive tool. The standard GT equation operates on universally available pure-component data ($T_g, \rho$).

**Q35: "If your system doesn't account for humidity, it's useless for real-world pharmaceutical development."**
A: A baseline must establish theoretical dry state potential first. If a system is unstable in the dry state, it will certainly fail in high humidity. The tool triages candidates for further experimental stress testing, it does not replace the stability chamber.

**Q36: "Why is the baseline +30 K and not +50 K? This is just an arbitrary threshold."**
A: It is a widely accepted industry heuristic (commonly cited in Hancock and Zografi) stating that storage at $T_g - 50\ K$ ensures multi-year stability. By demanding $T_{g,mix}$ be $30\ K$ above the drug, and assuming room temperature storage, the math aligns with standard operational safety margins.

**Q37: "Your equation uses weight fractions ($w_1$). Real thermodynamics uses volume fractions ($\phi_1$). The math is wrong."**
A: Gordon-Taylor was originally formulated using weight fractions under the assumption of specific volume additivity. While volume fractions are used in Flory-Huggins, the standard GT convention in literature explicitly uses weight fractions.

**Q38: "HPMC E5 scores 0.97 but it has terrible melt processability. Your model recommends impossible formulations."**
A: I must never claim the tool recommends the "best polymer" unconditionally. $s_{GT}$ purely scores the kinetic margin. Melt viscosity is a process engineering problem outside the scope of thermodynamic/kinetic phase compatibility.

**Q39: "If $s_{GT}$ is 1.0, can I guarantee 2-year shelf life?"**
A: NEVER. I must never claim stability prediction. It is a 'model-predicted glass-transition margin.' Phase separation can still occur via spinodal decomposition if thermodynamics are extremely poor.

**Q40: "You say a score of 0 means the mixture is below the +30K threshold. But it might still be above room temperature! You're penalizing viable systems."**
A: The multi-criteria framework relies on relative ranking. A formulation that barely clears room temperature is vastly inferior to one that provides a 50 K safety margin against thermal excursions during transport. The 0 score accurately reflects this relative kinetic inferiority.

### E. Common Mistakes
- **Confusing Weight and Volume Fractions:** Using $\phi_1$ instead of $w_1$ in the Gordon-Taylor equation.
- **Forgetting Kelvin Conversion:** Calculating $T_g$ in Celsius. The Boyer-Beaman rule and the $K$ constant ratio are strictly valid in Kelvin.
- **Misinterpreting $s_{GT}$ as Absolute $T_g$:** Believing $s_{GT} = 0.5$ means $T_g = 50^\circ C$. It is a normalized margin score.

### F. Things You Must Never Claim
- NEVER claim $s_{GT}$ "predicts stability" or "guarantees shelf-life".
- NEVER state that Gordon-Taylor accounts for specific H-bonding interactions (that is the Kwei extension).
- NEVER invent $s_{GT}$ values.
- NEVER claim that a high $s_{GT}$ makes a polymer the "best" choice overall.
