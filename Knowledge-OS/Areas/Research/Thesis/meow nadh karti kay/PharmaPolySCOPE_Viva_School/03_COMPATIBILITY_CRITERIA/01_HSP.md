# 01 Hansen Solubility Parameters (HSP) and Thermodynamic Compatibility
---
## Cross-Reference
**Prerequisite knowledge:** Basic thermodynamics, intermolecular forces, Hildebrand solubility parameter.
**Used later by:** Module 04 (PCA Dimensionality Reduction), Flory-Huggins Model (Module 03).
**Related source code:** `src/asd_mcda/compatibility/hsp_model.py`
**Related tests:** `tests/v2/`
**Related validation artifact:** `scientific_validation_results.json`
**Related viva attack:** Part 9

---
## Part 1: Beginner Understanding [BEGINNER]

Imagine you are trying to mix two different crowds of people at a party. If Group A only likes talking about sports, and Group B only likes talking about movies, they will naturally segregate into two corners of the room. However, if both groups share an interest in music, they will mix seamlessly. In the world of pharmaceutical formulation, we face a similar challenge: mixing a drug (which might be highly crystalline and poorly soluble) with a polymer (a long, chain-like molecule). For an Amorphous Solid Dispersion (ASD) to be successful, the drug and the polymer must "like" each other enough to mix intimately at a molecular level and stay mixed over time. 

The Hansen Solubility Parameters (HSP) provide a quantitative way to measure this "liking." Instead of a single number, HSP breaks down the personality of a molecule into three distinct traits:
1. **Dispersion (δ_d):** The basic, universal attraction between all molecules (like the fact that everyone at the party is a human being).
2. **Polarity (δ_p):** The attraction between molecules that have a permanent imbalance of electrical charge (like people who speak the same language).
3. **Hydrogen Bonding (δ_h):** A specific, strong type of interaction between certain functional groups (like a secret handshake).

When we plot these three traits in a 3D space, every molecule is represented as a point. Hansen's theory suggests that if the drug's point and the polymer's point are close together in this 3D space, they are compatible. If they are far apart, they will phase-separate. The distance between them is called $Ra$. If $Ra$ is smaller than a certain threshold (the interaction radius $R_o$), the drug and polymer are considered miscible. In PharmaPolySCOPE, we translate this distance into a score between 0 and 1, where 1 means a perfect match and 0 means they are practically strangers. This score is called `s_HSP`, and it serves as our **compatibility diagnostic**.

---
## Part 2: Technical Background [TECHNICAL]

### Cohesion Energy Density and the Hildebrand Parameter
The foundation of solubility parameters lies in the concept of Cohesive Energy Density (CED). The CED is defined as the energy required to completely vaporize a mole of a liquid, divided by its molar volume:
$$CED = \frac{\Delta U_{vap}}{V_m} = \frac{\Delta H_{vap} - RT}{V_m}$$
Joel Hildebrand (1936) introduced the Hildebrand solubility parameter ($\delta$), which is simply the square root of the CED:
$$\delta = \sqrt{CED}$$
While the Hildebrand parameter works well for non-polar, regular solutions, it completely fails for polar and hydrogen-bonding systems (like almost all drugs and polymers) because it lumps all intermolecular forces into a single value.

### Hansen's Three-Component Decomposition
To solve this, Charles Hansen (1967) proposed that the total cohesive energy is the sum of three separate energies: dispersion ($E_d$), permanent dipole-dipole or polar ($E_p$), and hydrogen bonding ($E_h$). Dividing by the molar volume gives:
$$CED = \frac{E_d}{V_m} + \frac{E_p}{V_m} + \frac{E_h}{V_m}$$
Which translates to the fundamental Hansen equation:
$$\delta_{total}^2 = \delta_d^2 + \delta_p^2 + \delta_h^2$$
Where the components are measured in $MPa^{0.5}$ (or $J^{0.5}/cm^{1.5}$).

### The $Ra$ Formula and the Exact Factor of 4
The distance between a drug (1) and a polymer (2) in Hansen space is denoted by $Ra$. The equation is:
$$Ra = \sqrt{4(\delta_{d1} - \delta_{d2})^2 + (\delta_{p1} - \delta_{p2})^2 + (\delta_{h1} - \delta_{h2})^2}$$
**Crucial Detail:** Notice the coefficient of 4 in front of the dispersion term. Why 4? Hansen derived this empirically. When plotting experimental solubility data of various polymers in hundreds of solvents, Hansen found that the solubility regions formed ellipsoids, not spheres. The dispersion axis was exactly twice as long as the polar and hydrogen-bonding axes. By multiplying the dispersion difference by 2 (which becomes 4 when squared), the interaction volume is transformed from an ellipsoid into a true sphere in a modified space $(2\delta_d, \delta_p, \delta_h)$. This empirical factor of 4 is non-negotiable and strictly preserved in the PharmaPolySCOPE architecture.

### The Relative Energy Difference (RED)
To determine if a polymer is a "good solvent" for a drug, the distance $Ra$ is compared to the interaction radius of the drug, $R_o$. The ratio is the Relative Energy Difference (RED):
$$RED = \frac{Ra}{R_o}$$
- $RED < 1$: High probability of miscibility.
- $RED = 1$: Boundary condition.
- $RED > 1$: High probability of immiscibility (phase separation).

---
## Part 3: Literature Form vs PharmaPolySCOPE Form [COMPARISON]

### Literature Form
In classic Hansen theory, RED is used as a binary classification. 
* If $RED \le 1$, the system is compatible. 
* If $RED > 1$, the system is incompatible. 

### PharmaPolySCOPE Form
In the context of Multi-Criteria Decision Analysis (MCDA), binary thresholds are problematic. They create artificial cliffs where a RED of 0.99 is considered "perfect" and 1.01 is "terrible." PharmaPolySCOPE transforms the RED into a continuous **compatibility diagnostic** score, $s_{HSP}$, bounded between 0 and 1.

The transformation is defined as:
$$s_{HSP} = \max(0.0, 1.0 - \frac{RED}{2.0})$$
This mapping has several mathematical implications:
1. If $RED = 0$ (perfect match), $s_{HSP} = 1.0$.
2. If $RED = 1$ (the classical boundary), $s_{HSP} = 0.5$.
3. If $RED = 2$, $s_{HSP} = 0.0$.
4. If $RED > 2$, $s_{HSP} = 0.0$ (via the max function).

This specific formulation maps the physically relevant range of $RED \in [0, 2]$ to $s_{HSP} \in [1, 0]$, providing a smooth gradient for the PCA and AHP algorithms downstream.

### Gate 1 Constraint
PharmaPolySCOPE employs a strict hard constraint called **Gate 1**. For a drug to be processable through the MCDA pipeline, at least 3 polymers in the library must satisfy $RED \le 1.0$. If this condition is not met, the system aborts, as the drug is considered generally intractable with the current polymer library.

---
## Part 4: Worked Numerical Example [EXAMPLE]

### Hypothetical Hand-Calculable Example
Let's consider a simplified, clearly labeled hypothetical system.
**Drug:**
* $\delta_d = 18.0\ MPa^{0.5}$
* $\delta_p = 7.0\ MPa^{0.5}$
* $\delta_h = 9.0\ MPa^{0.5}$
* $R_o = 8.0\ MPa^{0.5}$

**Polymer A:**
* $\delta_d = 17.0\ MPa^{0.5}$
* $\delta_p = 6.0\ MPa^{0.5}$
* $\delta_h = 8.0\ MPa^{0.5}$

**Step 1: Calculate Differences**
* $\Delta\delta_d = 18.0 - 17.0 = 1.0$
* $\Delta\delta_p = 7.0 - 6.0 = 1.0$
* $\Delta\delta_h = 9.0 - 8.0 = 1.0$

**Step 2: Calculate $Ra$**
* $Ra^2 = 4(1.0)^2 + (1.0)^2 + (1.0)^2$
* $Ra^2 = 4 + 1 + 1 = 6$
* $Ra = \sqrt{6} \approx 2.449$

**Step 3: Calculate RED**
* $RED = \frac{Ra}{R_o} = \frac{2.449}{8.0} = 0.306$

**Step 4: Calculate $s_{HSP}$**
* $s_{HSP} = \max(0, 1 - \frac{0.306}{2})$
* $s_{HSP} = \max(0, 1 - 0.153) = 0.847$

### Validated Indomethacin Values (Production)
For Indomethacin ($\delta_d=19.2, \delta_p=7.9, \delta_h=8.4$), the validated $s_{HSP}$ scores (from `scientific_validation_results.json`) are:
* **Soluplus:** $0.7972$
* **HPMC E5:** $0.7521$
* **PVP-VA64:** $0.7073$
* **PVP K30:** $0.6942$
* **Eudragit E PO:** $0.6359$

All scores are within the [0.636, 0.797] range, indicating good general solubility compatibility across the board, with Soluplus being the highest.

---
## Part 5: PharmaPolySCOPE Implementation [IMPLEMENTATION]

The HSP logic is localized entirely within `src/asd_mcda/compatibility/hsp_model.py`.

### Source File Location
`src/asd_mcda/compatibility/hsp_model.py` -> `Class HSPModel`

### Implementation Trace
**Concept** $\rightarrow$ Hansen Solubility distance logic.
**Input** $\rightarrow$ `drug` object and `polymer` object (both containing pre-stored `hsp_delta_d`, `hsp_delta_p`, `hsp_delta_h`).
**Function** $\rightarrow$ `compute_ra(polymer)` calculates Euclidean distance in modified Hansen space. `compute_red(polymer)` normalizes by $R_o$. `compute_s_hsp(polymer)` applies the transformation formula.
**File** $\rightarrow$ `hsp_model.py`
**Computation** $\rightarrow$ $dd = drug.hsp\_delta\_d - polymer.hsp\_delta\_d$, followed by the $Ra$ formula with the explicit $4 \times dd^2$. 
**Output** $\rightarrow$ A floating-point value for $s_{HSP} \in [0.0, 1.0]$.
**Next stage** $\rightarrow$ Assembled into the $N \times 4$ Compatibility Matrix ($S$) by `CompatibilityMatrix.build_matrix()`.

---
## Part 6: Assumptions and Limitations [LIMITATIONS]
1. **Empirical Nature:** The factor of 4 in the $Ra$ equation is purely empirical. It lacks rigorous derivation from first-principles statistical mechanics.
2. **Temperature Independence:** The standard HSP components are defined at 25°C. PharmaPolySCOPE does not adjust $\delta$ values for melt-extrusion temperatures (often > 150°C), assuming the *relative* differences between polymers remain roughly constant.
3. **No Molecular Architecture:** HSP treats the polymer as a uniform continuum. It ignores chain length, stereochemistry, and monomer sequence distribution.
4. **Spherical Assumption:** The interaction volume is assumed to be perfectly spherical in the $(2\delta_d, \delta_p, \delta_h)$ space, which is an oversimplification for highly associating molecules.
5. **Pre-stored Data:** The system relies on pre-computed/pre-stored HSP values. It does not compute them dynamically from SMILES strings using group contribution methods on the fly.

---
## Part 7: Viva Questions [VIVA]

### A. 10 Basic Q&A
**Q1: What does HSP stand for?**
A: Hansen Solubility Parameters.

**Q2: What are the three components of HSP?**
A: Dispersion forces ($\delta_d$), permanent dipole/polar forces ($\delta_p$), and hydrogen bonding ($\delta_h$).

**Q3: What does the term RED stand for?**
A: Relative Energy Difference.

**Q4: What is the formula for RED?**
A: $RED = Ra / R_o$, where $Ra$ is the distance in Hansen space and $R_o$ is the interaction radius.

**Q5: What is the rule of thumb for miscibility using RED?**
A: If $RED \le 1.0$, the system is highly likely to be miscible.

**Q6: What is the exact transformation formula for $s_{HSP}$ in PharmaPolySCOPE?**
A: $s_{HSP} = \max(0.0, 1.0 - \frac{RED}{2.0})$.

**Q7: If $RED = 2.5$, what is $s_{HSP}$?**
A: $0.0$, because of the $\max(0.0, ...)$ constraint.

**Q8: What is Gate 1?**
A: A requirement that at least 3 polymers in the library must have $RED \le 1.0$ for the drug to proceed.

**Q9: What is the correct terminology for $s_{HSP}$?**
A: A "compatibility diagnostic."

**Q10: Are HSP values temperature-dependent in this module?**
A: Technically yes in reality, but in the implementation, they are treated as static constants, generally representing room temperature (25°C).

### B. 10 Intermediate Q&A
**Q11: Why does the $\delta_d$ term have a factor of 4 in the $Ra$ equation?**
A: It is an empirical correction factor proposed by Hansen. He observed that when plotting solubility data, the solubility volumes were ellipsoids where the dispersion axis was twice as long as the others. Multiplying the $\Delta\delta_d$ term by 2 (which becomes 4 when squared) maps the ellipsoid into a sphere.

**Q12: How is the Cohesive Energy Density (CED) related to the Hildebrand parameter?**
A: The Hildebrand parameter ($\delta$) is the square root of the CED.

**Q13: Why is the Hildebrand parameter insufficient for pharmaceutical systems?**
A: Hildebrand parameter only works well for non-polar systems. Drugs and polymers have extensive polar and hydrogen-bonding interactions, which Hildebrand lumps into a single value, leading to inaccurate predictions.

**Q14: How does PharmaPolySCOPE handle missing $R_o$ values?**
A: If the drug's $R_o$ is missing or $\le 0$, it defaults to $8.0\ MPa^{0.5}$.

**Q15: What is the physical unit of an HSP component?**
A: $MPa^{0.5}$ (or equivalently, $J^{0.5}/cm^{1.5}$).

**Q16: Which polymer scored the highest $s_{HSP}$ for Indomethacin?**
A: Soluplus, with a score of $0.7972$.

**Q17: Is $s_{HSP}$ a measure of kinetic stability?**
A: No, it is a thermodynamic compatibility diagnostic. Kinetic stability is represented by the Gordon-Taylor score ($s_{GT}$).

**Q18: What is the minimum possible value for $s_{HSP}$?**
A: $0.0$.

**Q19: If a drug perfectly matches a polymer ($\Delta\delta = 0$), what is the RED?**
A: $0.0$.

**Q20: Why map RED to a $[0,1]$ scale?**
A: Multi-Criteria Decision Analysis (MCDA) requires all disparate criteria to be on a normalized, continuous, unitless scale to perform mathematical aggregations like PCA and AHP.

### C. 10 Difficult Q&A
**Q21: Derive the dimensions of CED.**
A: CED = Energy / Volume. Energy is Joules ($N \cdot m = kg \cdot m^2 / s^2$). Volume is $m^3$. CED = $N/m^2$ = Pascals. Therefore, HSP dimensions are $\sqrt{Pa}$.

**Q22: Defend the choice of the transformation $s_{HSP} = \max(0.0, 1.0 - RED/2.0)$.**
A: In standard theory, RED=1 is the boundary of the solubility sphere. A linear mapping where RED=0 $\rightarrow$ 1 and RED=1 $\rightarrow$ 0.5 acknowledges that RED values between 1 and 2 still represent *partial* miscibility or some degree of interaction, preventing an artificial cliff at RED=1.01.

**Q23: How would the $s_{HSP}$ score change if the Flory-Huggins $\chi$ parameter were used instead?**
A: While both are thermodynamic measures, $\chi$ incorporates molar volume and temperature explicitly, whereas $s_{HSP}$ is based solely on cohesive energy density differences. They would correlate but not be identical.

**Q24: Explain the difference in handling H-bonding in HSP vs descriptor compatibility.**
A: HSP ($\delta_h$) measures the bulk thermodynamic energy density of H-bonds. Descriptor compatibility (HBD, HBA) counts discrete functional groups and handles molecular complementarity and directionality, which bulk thermodynamics obscures.

**Q25: What happens to the Hansen sphere at high melt-extrusion temperatures?**
A: Generally, cohesive energy decreases as temperature rises (due to thermal expansion), meaning $\delta$ values decrease. More importantly, the sphere of solubility ($R_o$) typically expands, meaning polymers that are immiscible at room temperature may become miscible in the melt.

**Q26: Why is the baseline model frozen at v1.5.0?**
A: The four-criterion matrix defines the fundamental scientific baseline. Modifying the $s_{HSP}$ equation would shift the entire feature space for PCA, invalidating prior empirical validations and the established spectral decomposition.

**Q27: Can $s_{HSP}$ predict the formation of co-crystals?**
A: No. Co-crystals rely on highly specific, stoichiometric crystal lattice packing and directional non-covalent bonding, which bulk cohesive energy density models cannot resolve.

**Q28: If drug molar volume increases, how does it affect $s_{HSP}$?**
A: Mathematically in PharmaPolySCOPE, $s_{HSP}$ does not explicitly depend on molar volume. It depends on $\delta$, which is derived from $V_m$, but $V_m$ is not a direct variable in the $Ra$ or RED equation.

**Q29: Are there edge cases where RED $\le 1$ but the system phase separates?**
A: Yes, particularly if there are large disparities in free volume or if the system undergoes specific reactions or extreme crystalline forces (very high Tm) that overcome the amorphous mixing enthalpy.

**Q30: How does Gate 1 impact the statistical validity of the downstream matrix?**
A: By requiring at least 3 compatible polymers, it ensures that there is sufficient variance and valid data points in the $N \times 4$ matrix. If an intractable drug were allowed through, the matrix would be populated mostly by zeros, causing singular matrices or meaningless eigenvectors in PCA.

### D. 10 Hostile Q&A
**Q31: "Your $s_{HSP}$ is just a crude hack of Hansen's work. Why didn't you use rigorous Molecular Dynamics?"**
A: MD is computationally prohibitive for high-throughput screening of massive libraries. The $s_{HSP}$ transformation is an intentionally fast, validated heuristic that maps robust macro-thermodynamic principles into an MCDA framework. It trades atomic resolution for systemic throughput, which is strictly required for this pipeline.

**Q32: "You call it a compatibility diagnostic, but literature proves HSP fails for highly asymmetric polymer mixtures. Your tool is flawed."**
A: We explicitly state that $s_{HSP}$ is a *diagnostic*, not a guaranteed predictor of miscibility. It is just one axis of a four-criterion matrix. The limitations of HSP for asymmetric mixtures are compensated for by the inclusion of Flory-Huggins $\chi$ (which accounts for volume asymmetry) and structural descriptors.

**Q33: "The factor of 4 is completely arbitrary and unphysical. Why use it?"**
A: The factor of 4 is empirical, but it is not arbitrary. It was derived by Hansen via extensive multi-solvent regression to enforce spherical geometry in the interaction space. Deviating from it breaks the foundational basis upon which the pre-stored HSP library values were originally calculated.

**Q34: "You claim RED=2 gives a score of 0. Why not RED=3? What's your proof?"**
A: The mapping $1 - RED/2$ is an engineering choice designed to map the classical solubility boundary (RED=1) to the midpoint (0.5) of the [0,1] scale. Values beyond RED=2 represent severe incompatibility where nuances in score are meaningless for our decision boundary.

**Q35: "Indomethacin with Soluplus scores 0.7972. Does this prove it's the best polymer?"**
A: No. I must never claim any single score "proves" it is the "best polymer." $s_{HSP}$ is merely the thermodynamic affinity diagnostic. Soluplus fails on the kinetic stability criterion ($s_{GT}=0.0$), demonstrating exactly why isolated scores cannot determine the "best" polymer.

**Q36: "Why is the $R_o$ default set to 8.0? That is completely made up."**
A: It is a literature-derived heuristic for typical small-molecule active pharmaceutical ingredients when experimental solubility spheres are unmapped. It provides a mathematically stable fallback to prevent division by zero while preserving relative polymer ranking.

**Q37: "Your model ignores temperature. Therefore, it is useless for Hot Melt Extrusion."**
A: While it is true the $\delta$ values are static (typically 25°C), relative polymer-drug affinity rankings tend to persist across temperature regimes. The absolute miscibility boundary shifts, but the vector of compatibility remains highly informative for initial screening.

**Q38: "If two polymers have the exact same HSP, your model treats them identically. But one could be linear and one branched!"**
A: That is exactly why the four-criterion matrix exists. HSP handles macro-thermodynamics, Flory-Huggins incorporates density/volume, and descriptors handle structure. Isolating $s_{HSP}$ to attack the whole model is a logical fallacy.

**Q39: "You are misusing the term CED. It only applies to volatile liquids, not solid drugs."**
A: In polymer science, CED for solids (polymers and drugs) is a well-established extrapolated theoretical construct. We use indirect methods (group contribution, inverse gas chromatography) to estimate the hypothetical liquid state cohesive energy. This is standard industry practice.

**Q40: "Can you guarantee that an $s_{HSP}$ of 0.8 ensures a stable formulation for 2 years?"**
A: Absolutely not. $s_{HSP}$ is a thermodynamic interaction proxy. Long-term kinetic stability is governed by completely different physical mechanisms (glass transition, mobility), which is why $s_{GT}$ is included downstream.

### E. Common Mistakes
- **Forgetting the factor of 4:** In hand calculations, a common mistake is to forget the $4$ multiplier on the dispersion term $(\delta_{d1} - \delta_{d2})^2$.
- **Misinterpreting the scale:** Thinking that a lower $s_{HSP}$ is better. RED should be low, but $s_{HSP}$ should be high (closer to 1.0).
- **Conflating RED and $s_{HSP}$:** RED is the raw ratio. $s_{HSP}$ is the bounded transformation.

### F. Things You Must Never Claim
- NEVER claim that $s_{HSP}$ "proves miscibility". It is a 'compatibility diagnostic'.
- NEVER claim that $s_{HSP}$ is a predictor of kinetic stability or shelf-life.
- NEVER invent $s_{HSP}$ values; only use the validated JSON values for Indomethacin.
- NEVER state that the system computes HSP dynamically from molecular structure during a run (it uses pre-stored profile values).
