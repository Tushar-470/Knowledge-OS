# 06 The Four-Criterion Decision Matrix and the v1.5.0 Freeze
---
## Cross-Reference
**Prerequisite knowledge:** HSP, Flory-Huggins, Gordon-Taylor, Molecular Descriptors, Matrix Algebra.
**Used later by:** Module 04 (PCA Dimensionality Reduction), Module 05 (AHP Weighting).
**Related source code:** `src/asd_mcda/compatibility/matrix.py`
**Related tests:** `tests/v2/`
**Related validation artifact:** `scientific_validation_results.json`
**Related viva attack:** Part 9

---
## Part 1: Beginner Understanding [BEGINNER]

Imagine you are evaluating candidates for a job. You don't just look at their typing speed. You look at their education, their experience, their interview skills, and their references. You organize this into a spreadsheet where every row is a candidate and every column is a different skill score out of 100.

In PharmaPolySCOPE, our candidates are the polymers, and the "job" is to form a stable Amorphous Solid Dispersion (ASD) with the target drug. We evaluate them based on four completely different physical skills:
1. **$s_{HSP}$:** Do they have similar cohesive energies?
2. **$s_{\chi}$:** Does the lattice thermodynamics favor mixing?
3. **$s_{desc}$:** Do their molecular shapes and bonding sites match?
4. **$s_{GT}$:** Does the mixture become a rigid, stable glass?

The `CompatibilityMatrix` brings all these isolated scores together into a single, unified mathematical spreadsheet called the **S Matrix**. This matrix is the absolute core of the engine. Once this matrix is built, the pure physics and chemistry are finished. From this point forward, the system transitions into pure statistics and machine learning to analyze the spreadsheet.

---
## Part 2: Technical Background [TECHNICAL]

### The $S$ Matrix Architecture
The Compatibility Matrix ($S$) is defined as an $N \times M$ array, where $N$ is the number of polymers in the library (rows) and $M=4$ represents the four evaluation criteria (columns).

$$S = \begin{bmatrix}
s_{HSP,1} & s_{\chi,1} & s_{desc,1} & s_{GT,1} \\
s_{HSP,2} & s_{\chi,2} & s_{desc,2} & s_{GT,2} \\
\vdots & \vdots & \vdots & \vdots \\
s_{HSP,N} & s_{\chi,N} & s_{desc,N} & s_{GT,N}
\end{bmatrix}$$

All values in $S$ are continuous floats strictly bounded within $[0.0, 1.0]$. 

### Why These Four Criteria?
No single metric captures all modes of ASD failure:
* **HSP** catches bulk cohesive mismatches.
* **Flory-Huggins** catches volume-dependent lattice entropy failures.
* **Descriptors** catch specific topological/bonding incompatibilities.
* **Gordon-Taylor** catches kinetic mobility failures (low $T_g$).

By orthogonalizing the physics into these four axes, the matrix captures the full spectrum of solid-state behavior. 

### The Spearman Rank Correlation Matrix
Before handing the $S$ matrix over to PCA, `matrix.py` provides the ability to evaluate the internal correlation of the columns via `get_correlation_matrix()`. It uses Spearman rank correlation rather than Pearson because the variables are non-linear and non-parametric. 
* We expect $s_{HSP}$ and $s_{\chi}$ to be highly positively correlated, as they both derive fundamentally from Hansen parameters.
* We expect $s_{GT}$ to act somewhat orthogonally, as it is driven by density and glass transitions, completely independent of cohesive energy density.
* This collinearity structure is *exactly* why PCA is invoked in the next module: to collapse the redundant thermodynamic variance while isolating the independent kinetic variance.

### The v1.5.0 FOUR-CRITERION-FREEZE
PharmaPolySCOPE operates under a strict architectural directive known as the `v1.5.0-FOUR-CRITERION-FREEZE` (Commit 31eee4d). 
What this means: **The definition, calculation, and inclusion of exactly these four criteria are immutably locked.**
* You cannot add a fifth criterion (e.g., $s_{viscosity}$).
* You cannot remove $s_{desc}$.
* You cannot alter the $s_{HSP}$ mapping equation.

**Why?** Because any change to the criteria alters the covariance matrix downstream. This alters the eigenvectors and eigenvalues of the PCA, which shifts the final score. The established scientific validation for the tool is anchored entirely to this specific four-dimensional feature space. Altering the freeze invalidates the entire model's proof of efficacy.

---
## Part 3: Literature Form vs PharmaPolySCOPE Form [COMPARISON]

### Literature Form
In traditional pharmaceutical literature, researchers evaluate polymers sequentially. If HSP is good, they test $T_g$. If both are good, they go to the lab. There is no unified mathematical aggregation.

### PharmaPolySCOPE Form
The continuous evaluation matrix $S$ maps heterogeneous physics into a homogenized mathematical space ($\mathbb{R}^{N \times 4}$), enabling matrix algebra (standardization, covariance, eigendecomposition) to be performed globally across the entire polymer cohort simultaneously.

---
## Part 4: Worked Numerical Example [EXAMPLE]

### The Validated Indomethacin $S$ Matrix
Below is the exact, authoritative $S$ matrix for Indomethacin across the 5-polymer library, extracted from `scientific_validation_results.json`:

| Polymer | $s_{HSP}$ | $s_{\chi}$ | $s_{desc}$ | $s_{GT}$ |
| :--- | :--- | :--- | :--- | :--- |
| **Soluplus** | 0.7972 | 0.8261 | 0.3260 | 0.0000 |
| **HPMC E5** | 0.7521 | 0.7402 | 0.3942 | 0.9731 |
| **PVP-VA64** | 0.7073 | 0.6377 | 0.2942 | 0.2368 |
| **PVP K30** | 0.6942 | 0.6045 | 0.2518 | 0.9848 |
| **Eudragit E PO** | 0.6359 | 0.4393 | 0.4094 | 0.0000 |

**Observations to Teach from the Data:**
1. **Thermodynamic Agreement:** Look at Soluplus. It has the highest $s_{HSP}$ (0.7972) and highest $s_{\chi}$ (0.8261). Eudragit has the lowest for both (0.6359 and 0.4393). The thermodynamic columns are clearly highly correlated.
2. **Kinetic Independence:** Look at Soluplus again. Despite being the best thermodynamic match, it scores a perfect $0.0000$ on $s_{GT}$. Conversely, HPMC E5 is second in thermodynamics but scores an immense $0.9731$ in kinetics. This proves the Gordon-Taylor axis is capturing completely different physical phenomena.
3. **Descriptor Uniformity:** The $s_{desc}$ column is tightly banded between 0.25 and 0.41. It provides a subtle structural penalty/bonus rather than dominating the variance.
4. **The "Best" Polymer Fallacy:** You cannot pick a winner from this raw matrix. Soluplus wins thermodynamics, HPMC E5 wins overall balance, PVP K30 wins kinetics, Eudragit wins descriptors. The MCDA solver is required to synthesize this contradiction.

---
## Part 5: PharmaPolySCOPE Implementation [IMPLEMENTATION]

### Source File Location
`src/asd_mcda/compatibility/matrix.py` -> `Class CompatibilityMatrix`

### Implementation Trace
**Concept** $\rightarrow$ Assembly of the raw MCDA feature matrix.
**Input** $\rightarrow$ `drug_id`, list of `polymer_id`s.
**Function** $\rightarrow$ `build_matrix()` and `build_active_matrix()`.
**File** $\rightarrow$ `matrix.py`
**Computation** $\rightarrow$ 
1. Iterates over every polymer in the library.
2. Instantiates `HSPModel`, calls `compute_s_hsp`.
3. Instantiates `FloryHugginsModel`, calls `compute_s_chi`.
4. Calls internal `compute_s_desc`.
5. Instantiates `GordonTaylorModel`, calls `compute_s_gt`.
6. Appends the row to a Pandas DataFrame.
**Output** $\rightarrow$ An $N \times 4$ DataFrame $S$.
**Next stage** $\rightarrow$ Passed to `standardize_cohort()` to create the $Z$ matrix (Module 04).

---
## Part 6: Assumptions and Limitations [LIMITATIONS]
1. **Static Composition:** The matrix implies these properties are evaluated at a fixed state (usually 25°C, 30% drug loading). If temperature or loading changes, the entire matrix dynamically shifts.
2. **False Equivalence:** By bounding all variables to $[0,1]$, the raw matrix mathematically treats a $1.0$ in $s_{HSP}$ as equivalent magnitude to a $1.0$ in $s_{desc}$. The relative physical importance of these axes is not resolved until the AHP weighting stage downstream.
3. **Orthogonality Assumption:** Matrix algebra often assumes independent basis vectors. $s_{HSP}$ and $s_{\chi}$ are structurally non-orthogonal (they share root variables). The system explicitly relies on downstream PCA to resolve this non-orthogonality.

---
## Part 7: Viva Questions [VIVA]

### A. 10 Basic Q&A
**Q1: How many criteria are in the Compatibility Matrix?**
A: Four.

**Q2: What are the four columns of the $S$ matrix?**
A: $s_{HSP}$, $s_{\chi}$, $s_{desc}$, and $s_{GT}$.

**Q3: What are the rows of the $S$ matrix?**
A: The polymers in the evaluation library ($N$ polymers).

**Q4: What is the numerical range for all values in the $S$ matrix?**
A: Floating-point values between $0.0$ and $1.0$, inclusive.

**Q5: Which polymer scores the highest on $s_{\chi}$ for Indomethacin?**
A: Soluplus (0.8261).

**Q6: Which polymer scores 0.0000 on $s_{GT}$ for Indomethacin?**
A: Soluplus (and Eudragit E PO).

**Q7: What does the term "FOUR-CRITERION-FREEZE" mean?**
A: It is an architectural mandate that the definition and inclusion of these exact four metrics cannot be altered, as doing so would invalidate the underlying matrix mathematics and prior scientific validation.

**Q8: What function assembles the matrix?**
A: `build_matrix()` (or `build_active_matrix()` for just the scores).

**Q9: What is the data structure returned by `build_active_matrix()`?**
A: A Pandas DataFrame.

**Q10: After the $S$ matrix is built, what happens next in the pipeline?**
A: The data is passed to the statistical module (PCA) to be standardized into a $Z$ matrix.

### B. 10 Intermediate Q&A
**Q11: Why is Spearman rank correlation used instead of Pearson correlation on the $S$ matrix?**
A: The physical criteria are non-linear transformations (with clipping and max functions) that do not follow normal Gaussian distributions. Spearman evaluates monotonic rank relationships without assuming linearity.

**Q12: Why are $s_{HSP}$ and $s_{\chi}$ expected to be highly correlated?**
A: Because the Lindvig $\chi$ equation uses the exact same cohesive energy differences ($\Delta\delta_d, \Delta\delta_p, \Delta\delta_h$) that define the Hansen $Ra$ distance. They are mathematically derived from the same root data.

**Q13: If they are correlated, isn't it redundant to include both?**
A: No, because they diverge for asymmetric systems (Flory-Huggins accounts for molar volume and temperature, while HSP does not). The downstream PCA specifically handles the redundancy by collapsing their shared variance into a single principal component.

**Q14: Look at the Indomethacin matrix. Why can't we declare HPMC E5 the "winner" right now?**
A: Because we do not yet know the mathematical weighting of the criteria. If kinetics ($s_{GT}$) is given zero weight, Soluplus wins. If kinetics is given heavy weight, HPMC E5 wins. The MCDA solver must resolve the priorities.

**Q15: What would happen to the matrix if a new polymer was added to the library?**
A: A new row is added. The absolute values of the existing cells do not change. (However, the downstream standardized $Z$ matrix *would* change, as the mean and variance of the cohort would shift).

**Q16: Where in the codebase is the default drug loading of 30% defined for this matrix?**
A: It is initialized in `matrix.py` at the class level (`drug_loading_ww = 0.30`) and propagated to the Gordon-Taylor module.

**Q17: Is there any experimental chemistry performed by the code during `build_matrix()`?**
A: No. It purely executes mathematical formulas against the pre-stored parameter profiles.

**Q18: What happens if a polymer is missing density data required for $s_{GT}$?**
A: The system should fall back to a reasonable approximation or fail gracefully, but the matrix requires all $N \times 4$ cells to be populated with valid floats for PCA to execute.

**Q19: Explain the physical implication of Eudragit E PO's scores (low thermodynamics, low kinetics, high descriptors).**
A: It implies that structurally, it has good complementary functional groups, but the bulk lattice energy severely resists mixing, and even if forced to mix, the resulting glass will be too mobile to prevent crystallization. It is a terrible candidate for this drug.

**Q20: Can a score in the matrix ever be negative?**
A: No, every calculation uses `max(0, ...)` or `clip(..., 0, 1)` to strictly bound the lower limit at 0.0.

### C. 10 Difficult Q&A
**Q21: Prove statistically why altering the four criteria invalidates the model.**
A: The MCDA model uses PCA to extract the eigenvectors of the covariance matrix of $S$. The covariance matrix has dimensions $M \times M$. If you add a criterion, $M$ changes from 4 to 5. The entire eigen-structure (the principal components) completely changes, meaning the final multidimensional distance score is mapping a fundamentally different geometric space, severing all correlation to the original experimental validation cohort.

**Q22: Why doesn't the system normalize the columns within the $S$ matrix (e.g., making the highest value in a column 1.0)?**
A: The $S$ matrix represents absolute physics bounded relative to theoretical constants (e.g., $RED/2$, $+30K$ margin). Normalizing the raw scores against the cohort would destroy the absolute physical meaning of the score (e.g., stretching a terrible cohort so the "best of the worst" looks perfect). Cohort standardization happens later (the $Z$ score) precisely to preserve the integrity of the raw $S$ matrix.

**Q23: How does the matrix handle the temperature dependence of $\chi$ and $s_{HSP}$?**
A: It ignores it. The matrix is a static snapshot at standard state (298 K). It represents the thermodynamic stability vector of the final solid product on the shelf, not the transient state inside the hot melt extruder.

**Q24: Discuss the problem of scale invariance in the $s_{desc}$ column relative to $s_{GT}$.**
A: $s_{GT}$ exploits the full $[0,1]$ range (Soluplus is 0.0, PVP K30 is 0.98). $s_{desc}$ is compressed between 0.25 and 0.41. In unweighted matrix algebra, the column with higher variance mathematically dominates the principal components. This scale discrepancy is resolved downstream by standardizing the variance (making all columns $\sigma = 1$).

**Q25: If Indomethacin has $T_g = 315 K$, and Soluplus has $T_{g,mix}$ of exactly $315 K$, trace the exact values through the row of the matrix.**
A: Thermodynamics would calculate normally. For $s_{GT}$, the reference is $315 + 30 = 345 K$. The mixture is $315 K$. $(315 - 345) / 50 = -0.6$. Clipped to $[0,1]$, $s_{GT}$ becomes $0.0000$.

**Q26: What is the computational complexity (Big O) of building the $S$ matrix?**
A: It scales linearly with the number of polymers, $O(N)$. The time per polymer is constant $O(1)$ because it only involves basic arithmetic on pre-stored floats.

**Q27: Defend the strict bounds of $[0, 1]$ from an MCDA perspective.**
A: Algorithms like Analytic Hierarchy Process (AHP) and Technique for Order of Preference by Similarity to Ideal Solution (TOPSIS) require continuous, unitless, positive matrices to calculate vector distances to a theoretical "Ideal Positive" coordinate (usually $[1,1,1,1]$). Unbounded variables break the geometry of the ideal solution space.

**Q28: If $s_{\chi}$ evaluates to exactly 0.5, what does this mathematically guarantee about $\chi$?**
A: Since $s_{\chi} = 1 - \chi$, if $s_{\chi} = 0.5$, then $\chi$ must be exactly $0.5$.

**Q29: How does the system handle a scenario where Gate 1 ($RED \le 1$) is failed by all polymers, but the matrix is requested anyway?**
A: Architecturally, the Gate 1 check occurs *prior* to full matrix execution. If the drug is fundamentally intractable, the pipeline throws an abort exception, preventing the generation of mathematically meaningless PCA noise.

**Q30: Why is $s_{desc}$ completely uncorrelated with $s_{HSP}$?**
A: Because $s_{HSP}$ evaluates bulk volume cohesive energy ($\Delta\delta$), which is dominated by dispersion forces in large molecules. $s_{desc}$ evaluates discrete topology and specific heteroatom counts. A molecule can have identical bulk dispersion to a polymer but entirely different functional group structures. They measure orthogonal physical realities.

### D. 10 Hostile Q&A
**Q31: "Your matrix treats a thermodynamic heuristic and a hard physical measurement as equal. This is mathematically invalid."**
A: The $S$ matrix purely acts as a unified data structure. It does not treat them as physically equal; that is the explicit purpose of the AHP matrix downstream, which applies rigorous weighting to prioritize fundamental physics over heuristics.

**Q32: "You are hiding the failure of your models behind matrix normalization. Soluplus fails $s_{GT}$ completely but you still consider it."**
A: Soluplus fails *kinetic* stability because of its low $T_g$. It succeeds brilliantly in *thermodynamic* stability. This is not a model failure; it is a perfectly accurate reflection of the material's real-world physical paradox, which formulation scientists must evaluate.

**Q33: "If I add a 5th column for viscosity, your whole model breaks. That proves your architecture is fragile."**
A: It proves the architecture is *controlled*. Unconstrained dimensionality expansion destroys the statistical baseline. The FOUR-CRITERION-FREEZE is a governance mechanism to ensure the validated physical boundaries of the model are never breached by arbitrary feature bloat.

**Q34: "The values in your Indomethacin matrix are just random numbers generated to fit your thesis. Prove they aren't."**
A: The values are strictly deterministic outputs derived from the peer-reviewed physical constants of Indomethacin (SMILES, $T_g=315 K$, $V_m=273$) processed through the standard Hansen, Flory-Huggins, and Gordon-Taylor equations documented in the open-source `src` code. They are reproducible to the last decimal.

**Q35: "Why did you force all scores between 0 and 1? A truly terrible polymer should have a negative score to penalize it."**
A: In matrix geometry, a vector distance to an ideal solution cannot process unbounded negative space logically without skewing the variance. A zero score already exerts maximum mathematical penalty distance from the ideal coordinate of 1.0. 

**Q36: "Your correlation matrix uses Spearman rank. That's a cheat to hide non-linear failures in your physics equations."**
A: Pearson assumes a linear relationship and normal distribution. Our criteria (like $s_{GT}$) use clip functions and non-linear boundaries by design. Using Pearson on bounded, non-parametric physical heuristics is a statistical error; Spearman is the mathematically correct tool for evaluating monotonic rank relationships.

**Q37: "If two polymers have the exact same matrix scores, your tool crashes trying to rank them."**
A: The tool handles duplicate vectors perfectly well algebraically. They will map to the exact same coordinate in PCA space and receive the exact same final score. It is up to the scientist to choose between them based on cost or processability.

**Q38: "You admit the matrix doesn't calculate temperature or loading curves. It's totally useless for actual HME manufacturing."**
A: It is a *screening* tool. It triages a library of 100 polymers down to the top 3 candidates by establishing the baseline thermodynamic limit. Simulating complex HME thermal curves for 100 intractable polymers is computationally wasteful; we filter first, simulate later.

**Q39: "If I change `drug_loading_ww` to 0.50, all the $s_{GT}$ scores change. Your baseline is totally arbitrary."**
A: 0.30 is the industry standard baseline for API screening. If a user changes the matrix configuration, they are explicitly running a *custom experimental scenario*, which the tool supports, but it is no longer the standardized validation baseline.

**Q40: "Show me exactly where in the $S$ matrix it proves that Indomethacin will not crystallize in 6 months."**
A: I will NEVER make that claim. The $S$ matrix provides continuous mathematical proxies for interaction affinity and kinetic restriction. It organizes physical data; it does not issue absolute temporal guarantees for crystallization kinetics.

### E. Common Mistakes
- **Assuming the $S$ matrix applies weights:** The $S$ matrix is unweighted. AHP weights are applied *after* PCA, not in this matrix.
- **Thinking the Matrix Normalizes Data:** The $S$ matrix bounds the data $[0,1]$ based on theoretical physical limits. It does *not* normalize polymers against each other (that is the $Z$ matrix).
- **Conflating the Columns:** Treating $s_{HSP}$ and $s_{\chi}$ as completely identical, or ignoring that $s_{GT}$ captures kinetic, not thermodynamic, properties.

### F. Things You Must Never Claim
- NEVER claim you can pick the "best" polymer directly from the raw $S$ matrix values.
- NEVER claim the FOUR-CRITERION-FREEZE is just a recommendation; it is an immutable architectural law.
- NEVER claim the $S$ matrix guarantees long-term stability.
- NEVER invent values for the matrix; use the verified JSON trace.
- NEVER confuse the $S$ matrix (raw physics) with the $Z$ matrix (standardized statistics) or the $AHP$ matrix (weights).
