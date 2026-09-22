# DOCUMENT 7: MORRIS SENSITIVITY FROM ZERO

## 1. What is it? / Why does it exist? / Problem solved
The Morris Elementary Effects method is a global sensitivity screening tool. Monte Carlo analysis tells us *that* the model is sensitive to noise; Morris screening tells us *which specific inputs* drive that sensitivity.
Problem solved: It isolates the most influential factors among dozens of inputs, separating dominant variables from negligible ones without requiring computationally prohibitive variance-based methods (like Sobol).

## 2. Beginner Explanation (Level 1)
Imagine a soundboard with 26 dials. You want to know which dial controls the main volume. You start with all dials set somewhere, then turn one dial a click, measure the change, turn the next dial, measure, and so on. You do this whole sequence (a trajectory) 10 times from different starting points. The dial that produces the biggest average change in volume is your most sensitive input. 

## 3. Technical Explanation (Level 2)
The `MorrisSensitivityEngine` applies an optimized Morris B* OAT (One-At-a-Time) design. It constructs random trajectories in the $k$-dimensional input space. 
For a factor $i$, the elementary effect (EE) at a point $X$ is the ratio of the change in output to the step size $\Delta$. We compute $\mu$ (mean EE), $\mu^*$ (mean absolute EE, solving cancellation effects), and $\sigma$ (standard deviation of EE, indicating non-linearity or interaction). 

## 4. Mathematics (with derivation where appropriate)
Elementary Effect:
$$ EE_i = rac{Y(X_1, ..., X_i + \Delta, ... X_k) - Y(X)}{\Delta} $$
$$ \mu_i^* = rac{1}{r} \sum_{j=1}^r |EE_i^{(j)}| $$
For PharmaPolySCOPE, $Y$ is the continuous Closeness Coefficient $C_L$.

## 5. Hand-calculable Example
3 factors ($x_1, x_2, x_3$), $\Delta = 2/3$.
Start point $X = (0, 1/3, 2/3)$, $Y = 0.50$
Step $x_1  $\rightarrow$ 2/3$, new $Y = 0.60$. $EE_1 = (0.60 - 0.50)/(2/3) = 0.15$
Step $x_2  $\rightarrow$ 1$, new $Y = 0.65$. $EE_2 = (0.65 - 0.60)/(2/3) = 0.075$
Repeat across $r$ trajectories to get $\mu_1^*$ and $\mu_2^*$.

## 6. Actual Production Example (Indomethacin)
- $r=10$ valid trajectories required.
- 31 trajectories attempted, 21 discarded (`AHP_CR_BLOCKED`).
- 26 total factors (5 polymers $	imes$ 4 scores = 20, + 6 AHP pairwise bounds).
- Top factor: `score_POL-005-2026_s_desc` (Soluplus $s_{desc}$) with $\mu^* = 0.1444$.
- 2nd: `score_POL-007-2026_s_HSP` ($\mu^* = 0.1001$)
- AHP factors have very low $\mu^*$ (<0.01).

## 7. Exact Implementation Trace
File: `sensitivity.py`
- `MorrisSensitivityEngine` (line 95)
- `run()` (line 108), wrapper `run_morris_sensitivity()` (line 520)
- `MORRIS_METHODOLOGY_VERSION = '2.0.0-SP-PRP-TOPSIS-MORRIS'` (line 45)
- Trajectories: $r=10$ (line 114), $p=4$ (line 115), $\Delta = 4/6 = 2/3$ (line 213)
- Max attempts: $300$ (line 259)
- Score bounds $\pm 0.15$ (lines 226-227); AHP bounds $\pm 0.30$ log (lines 244-245)
- Trajectory generator: `_generate_candidate_trajectory()` (line 57)
- If one point blocks, entire trajectory discarded (lines 349-351).
- $EE$: `(cl[step+1] - cl[step]) / dx` (line 392)

## 8. Inputs / Processing / Outputs
- **Inputs:** Baseline factors, step parameters ($r, p, \Delta$).
- **Processing:** OAT perturbation, VariableKEngine evaluation.
- **Outputs:** $\mu, \mu^*, \sigma$ for each factor regarding $C_L$ and Rank.

## 9. Assumptions / Limitations / Failure Modes
- **Assumption:** Discarding blocked trajectories doesn't fatally bias the sampled space (it restricts analysis to the mathematically valid manifold).
- **Limitation:** $r=10$ is a screening resolution. It identifies dominant factors but cannot produce high-resolution interaction maps.
- **Limitation:** High discard rate (68%) implies efficiency loss.

## 10. Alternatives and Why Not Used
- **Alternative:** Variance-based (Sobol) indices.
- **Why Not Used:** Sobol requires $N(k+2)$ runs, often $>10,000$ valid evaluations. With a 68% block rate, achieving complete Sobol matrices is computationally hostile and unnecessary for mere screening.

## 11. Common Misconceptions
- *Misconception:* "Morris proves that $s_{desc}$ causes Soluplus to be the best."
- *Truth:* Morris identifies $s_{desc}$ as the factor with the highest influence on the closeness coefficient variance. It does not make causal claims about physical polymer superiority.

## 12. 40 Viva Q&A

### Basic (10)

**Q1:** What does mu_star measure in the Morris method?
**A:**
1. **Direct Answer:** It measures the mean absolute elementary effect of a factor on the output.
2. **Reasoning:** By taking the absolute value before averaging, mu_star prevents positive and negative effects from canceling each other out. This makes it a reliable indicator of the overall influence of a factor.
3. **Implementation:** Computed from the aggregated outputs of `MorrisSensitivityEngine` in `sensitivity.py`.
4. **Limitation:** It is a screening measure, not a precise variance decomposition like a Sobol index.
5. **Defense:** We use mu_star to identify the most influential factors among our inputs without the computational burden of variance-based methods.

**Q2:** What does sigma measure in this Morris context?
**A:**
1. **Direct Answer:** It measures the standard deviation of the elementary effects for a given factor across different trajectories.
2. **Reasoning:** A high sigma indicates that the elementary effect of the factor changes depending on the values of other factors, which suggests non-linear effects or interactions.
3. **Implementation:** Calculated alongside mu_star during the aggregation phase in `sensitivity.py`.
4. **Limitation:** It indicates the presence of interactions or non-linearity but cannot identify specific pair-wise interactions.
5. **Defense:** Sigma provides a fast heuristic for detecting non-linear behavior across the input space.

**Q3:** What exactly is an elementary effect (EE)?
**A:**
1. **Direct Answer:** An elementary effect is the ratio of the change in output to the step size when a single input factor is perturbed.
2. **Reasoning:** It represents a finite-difference approximation of the local gradient for a specific factor at a given point in the input space.
3. **Implementation:** Calculated as `(cl[step+1] - cl[step]) / dx` at line 392 of `sensitivity.py`.
4. **Limitation:** It is heavily dependent on the chosen grid level p and step size delta.
5. **Defense:** The elementary effect provides a simple, direct measurement of local sensitivity that aggregates robustly across the domain.

**Q4:** What does OAT mean in the context of your experimental design?
**A:**
1. **Direct Answer:** OAT stands for One-At-a-Time, meaning only one input factor is varied between consecutive evaluations.
2. **Reasoning:** Varying one factor at a time isolates its specific contribution to the output change, forming the basis for computing the elementary effect.
3. **Implementation:** Governed by `_generate_candidate_trajectory()` at line 57 of `sensitivity.py`.
4. **Limitation:** Pure OAT without multiple trajectories fails to capture global interactions.
5. **Defense:** Morris uses randomized OAT trajectories, balancing the isolation of individual effects with global space exploration.

**Q5:** What constitutes a trajectory in the Morris method?
**A:**
1. **Direct Answer:** A trajectory is a sequence of OAT steps that sequentially perturbs every factor exactly once, starting from a random base point.
2. **Reasoning:** By stepping through all dimensions, a single trajectory computes one elementary effect for every factor in a contiguous chain.
3. **Implementation:** Generated by `_generate_candidate_trajectory()` inside `sensitivity.py`.
4. **Limitation:** If any step violates domain constraints, the geometric validity of the entire trajectory can be compromised.
5. **Defense:** Using trajectories allows us to compute an elementary effect for all factors using only k+1 model evaluations.

**Q6:** How many factors are being screened, and what are they?
**A:**
1. **Direct Answer:** We screen 26 factors in total for the Indomethacin baseline.
2. **Reasoning:** The total consists of 20 score factors (5 polymers multiplied by 4 scores each) and 6 AHP pairwise bounds.
3. **Implementation:** The baseline configuration parsed by `MorrisSensitivityEngine` yields these 26 distinct inputs.
4. **Limitation:** Fixed structural parameters are not included in this 26-factor screening.
5. **Defense:** The 26 factors represent the complete set of primary uncertainty sources in our formulation scoring and weighting.

**Q7:** What does the parameter r=10 signify?
**A:**
1. **Direct Answer:** It specifies the number of valid trajectories required for the Morris screening.
2. **Reasoning:** This dictates that we must successfully aggregate elementary effects from 10 distinct regions of the input space. It is a computational budget choice.
3. **Implementation:** Set as `r=10` at line 114 of `sensitivity.py`.
4. **Limitation:** 10 trajectories provide a coarse screening estimate and may not perfectly stabilize the mu_star rankings.
5. **Defense:** r=10 is a pragmatic computational budget choice that sufficiently distinguishes dominant factors from negligible ones.

**Q8:** What do p=4 and delta=2/3 mean in your grid?
**A:**
1. **Direct Answer:** p=4 is the number of grid levels, and delta=2/3 is the standardized step size between these levels.
2. **Reasoning:** These parameters discretize the input space, ensuring that steps are large enough to observe global effects rather than just local noise.
3. **Implementation:** Specified at line 115 (p=4) and line 213 (delta=2/3) in `sensitivity.py`.
4. **Limitation:** This coarse grid may step over fine-grained local optima.
5. **Defense:** These specific grid settings ensure unbiased coverage of the domain while maintaining structural simplicity.

**Q9:** What is the target function Y being evaluated?
**A:**
1. **Direct Answer:** The target function Y is the continuous Closeness Coefficient, C_L.
2. **Reasoning:** We evaluate sensitivity based on C_L rather than discrete rank because C_L provides a smooth, continuous metric that yields meaningful finite differences. Note that ranking is argmax (higher C_L is Rank 1).
3. **Implementation:** Elementary effect is calculated using `cl[step+1] - cl[step]` at line 392 of `sensitivity.py`.
4. **Limitation:** C_L sensitivity does not always map linearly to discrete rank changes.
5. **Defense:** Using continuous C_L avoids the step-function artifacts that occur when differentiating discrete ranks.

**Q10:** Where is the Morris sensitivity logic defined in your codebase?
**A:**
1. **Direct Answer:** It is defined in the `MorrisSensitivityEngine` class within `sensitivity.py`.
2. **Reasoning:** Centralizing the logic allows it to systematically manipulate the `VariableKEngine` for different baselines.
3. **Implementation:** `MorrisSensitivityEngine` is located at line 95, with its main execution in `run()` at line 108 of `sensitivity.py`.
4. **Limitation:** Tight coupling with `VariableKEngine` makes it harder to use for external unrelated models.
5. **Defense:** Encapsulating the logic ensures consistent application of the methodology across all experiments.

### Intermediate (10)

**Q11:** Why were 21 out of 31 trajectories discarded?
**A:**
1. **Direct Answer:** They were discarded because at least one step in the trajectory triggered an AHP transitivity violation (CR > 0.08).
2. **Reasoning:** The screening randomly explores the input space, which frequently steps into regions where the randomly combined AHP pairwise weights become inconsistent.
3. **Implementation:** Blocking enforced and trajectory discarded at lines 349-351 of `sensitivity.py`.
4. **Limitation:** The 68% discard rate is computationally expensive and specific to this baseline.
5. **Defense:** Discarding invalid states ensures our sensitivity metrics reflect only mathematically sound configurations.

**Q12:** Why do you use whole-trajectory discard instead of just skipping bad steps?
**A:**
1. **Direct Answer:** To preserve the geometric integrity of the OAT design.
2. **Reasoning:** Skipping a step breaks the contiguous chain required to compute elementary effects for all k factors within k+1 evaluations.
3. **Implementation:** If any point blocks, the loop breaks and the entire trajectory is discarded (lines 349-351, `sensitivity.py`).
4. **Limitation:** It leads to a high rejection rate when the valid parameter space is complex or narrow.
5. **Defense:** Whole-trajectory discard is mathematically necessary to maintain the strictly controlled grid exploration of the Morris method.

**Q13:** What does score_screening_delta=0.15 represent?
**A:**
1. **Direct Answer:** It is the absolute bounds (+/- 0.15) applied to the score factors during the Morris grid setup.
2. **Reasoning:** It defines the maximum perturbation space for the descriptor scores, scaling the normalized grid to the actual operational range of the scores.
3. **Implementation:** Defined at lines 226-227 in `sensitivity.py`.
4. **Limitation:** The choice of 0.15 is static and doesn't adapt to the differing confidence intervals of specific scores.
5. **Defense:** This absolute delta provides a uniform, controlled boundary for evaluating score sensitivities across all polymers.

**Q14:** What does ahp_log_screening_delta=0.30 represent?
**A:**
1. **Direct Answer:** It is the absolute bounds (+/- 0.30) applied in log-space to the AHP pairwise comparisons.
2. **Reasoning:** AHP weights operate multiplicatively, so perturbations must be symmetric in logarithmic space to prevent skewed distributions.
3. **Implementation:** Defined at lines 244-245 in `sensitivity.py`.
4. **Limitation:** Log-space bounds complicate the interpretation of the un-transformed step sizes.
5. **Defense:** Applying perturbations in log-space is standard practice to maintain the reciprocal symmetry of AHP matrices.

**Q15:** Why do AHP factors show low mu_star despite causing most trajectory blocks?
**A:**
1. **Direct Answer:** Because within the valid bounds where CR <= 0.08, AHP weight variations have a minimal numerical impact on C_L.
2. **Reasoning:** They frequently cause CR violations (blocking the trajectory), but when they don't, the resulting shift in the final C_L output is highly buffered by the aggregation process.
3. **Implementation:** Observed in the output where AHP mu_star < 0.01.
4. **Limitation:** The blocking masks the theoretical sensitivity that would occur if CR constraints were ignored.
5. **Defense:** The low mu_star accurately reflects that, strictly within valid transitive configurations, AHP weights do not drive the C_L variance.

**Q16:** What does the dominant factor score_POL-005-2026_s_desc mean?
**A:**
1. **Direct Answer:** It refers to the descriptor score (s_desc) for Soluplus (POL-005-2026), which has the highest influence on C_L.
2. **Reasoning:** Perturbing this specific score causes the largest absolute changes in the C_L values across the evaluated trajectories.
3. **Implementation:** Identified by the highest mu_star value of 0.1444 in the results.
4. **Limitation:** It highlights sensitivity but does not explain the underlying physical reason for that sensitivity.
5. **Defense:** Identifying s_desc for Soluplus as the dominant factor correctly targets where uncertainty reduction efforts should be focused.

**Q17:** Why do a mu_star of 0.1444 and a sigma of 0.1830 indicate non-linearity?
**A:**
1. **Direct Answer:** Because the standard deviation (sigma) is larger than the mean absolute effect (mu_star).
2. **Reasoning:** A sigma larger than mu_star implies that the elementary effect varies wildly depending on the trajectory's location in the input space, indicating strong interactions or non-monotonic behavior.
3. **Implementation:** Calculated during the final aggregation in `sensitivity.py`.
4. **Limitation:** It alerts us to non-linearity but cannot specify which other factors it is interacting with.
5. **Defense:** The high sigma/mu_star ratio is a classic signature in Morris screening that confirms the model's response is highly dependent on local interactions.

**Q18:** What is the difference between mu and mu_star?
**A:**
1. **Direct Answer:** mu is the mean of the raw elementary effects, while mu_star is the mean of their absolute values.
2. **Reasoning:** For the dominant factor, mu = 0.0590 while mu_star = 0.1444; the difference occurs because positive and negative effects partially cancel out in mu.
3. **Implementation:** Both are computed in the final aggregation phase in `sensitivity.py`.
4. **Limitation:** mu can be misleadingly close to zero if a factor has strong alternating effects.
5. **Defense:** We rely on mu_star as the primary sensitivity metric precisely to avoid the cancellation issue inherent in mu.

**Q19:** How do the 26 factors decompose conceptually?
**A:**
1. **Direct Answer:** They decompose into 20 polymer score parameters and 6 AHP pairwise comparisons.
2. **Reasoning:** There are 5 polymers, each with 4 scores (20 total), plus the 6 independent pairwise relationships required for a 4-criteria AHP matrix.
3. **Implementation:** Parsed directly from the Indomethacin baseline configuration.
4. **Limitation:** It ignores the structural dependencies within the AHP matrix by treating the 6 pairwise bounds as orthogonal inputs.
5. **Defense:** This decomposition represents the maximal set of independent parameters that can be legally perturbed in the model.

**Q20:** What is the significance of max trajectory attempts being 300?
**A:**
1. **Direct Answer:** It acts as a computational circuit breaker to prevent infinite loops when the valid parameter space is extremely tight.
2. **Reasoning:** Given the high discard rate from AHP CR blocks, the engine might struggle to find 10 valid trajectories; the 300 limit guarantees termination.
3. **Implementation:** Set as a hardcoded limit at line 259 of `sensitivity.py`.
4. **Limitation:** If the domain is too restrictive, the engine will fail to gather r=10 trajectories and error out.
5. **Defense:** Setting a maximum attempt threshold is standard defensive programming for stochastic sampling in constrained spaces.

### Difficult (10)

**Q21:** Why is Morris considered a screening method and not a variance decomposition?
**A:**
1. **Direct Answer:** Morris evaluates mean local gradients rather than partitioning the total global variance of the output.
2. **Reasoning:** It ranks factors by influence but cannot calculate the precise percentage of variance each factor is responsible for, unlike Sobol.
3. **Implementation:** Evident in the use of OAT finite differences (`cl[step+1] - cl[step] / dx`) rather than variance integrals.
4. **Limitation:** It cannot provide quantitative statements like "factor X causes 40% of the output variance."
5. **Defense:** Screening is exactly what is needed here to separate the few influential factors from the many negligible ones efficiently.

**Q22:** How does mu_star differ from a Sobol total-order index?
**A:**
1. **Direct Answer:** mu_star is an aggregate of absolute finite differences, whereas a Sobol total-order index represents a strict fraction of the total output variance.
2. **Reasoning:** Sobol indices are mathematically rigorous integrals over the domain, whereas mu_star is a heuristic measure of average local change.
3. **Implementation:** The code computes means of absolute elementary effects, not conditional variances.
4. **Limitation:** mu_star rankings may occasionally diverge from Sobol rankings for highly non-linear models.
5. **Defense:** mu_star provides a sufficient proxy for total influence at a fraction of the computational cost of Sobol.

**Q23:** How does the computational cost of Morris compare to Sobol given the blocking?
**A:**
1. **Direct Answer:** Morris requires N = r * (k + 1) evaluations; for r=10, k=26, that is 270 valid evaluations, whereas Sobol requires N * (k + 2) which easily exceeds 10,000.
2. **Reasoning:** Even with a 68% discard rate (requiring ~840 total attempts), Morris remains vastly cheaper than Sobol, which would require tens of thousands of attempts to satisfy its valid sample requirements.
3. **Implementation:** Morris attempt counts are logged during the `run()` execution in `sensitivity.py`.
4. **Limitation:** The cost advantage shrinks if the discard rate approaches 99%.
5. **Defense:** Given our severe AHP CR constraints, Morris is the only computationally viable approach for global sensitivity analysis.

**Q24:** Why does a sigma larger than mu_star strongly suggest non-monotonicity or interactions?
**A:**
1. **Direct Answer:** If sigma > mu_star, the elementary effect must cross zero or fluctuate wildly in magnitude across the domain.
2. **Reasoning:** Since mu_star is the mean of absolute values, a standard deviation larger than this mean implies a distribution of effects that is wide and likely multimodal or sign-changing.
3. **Implementation:** Derived from the aggregation math in `sensitivity.py`.
4. **Limitation:** It tells us an interaction exists, but not which specific factors are interacting.
5. **Defense:** Recognizing sigma > mu_star acts as an immediate diagnostic that the system response is complex and non-linear.

**Q25:** How does eigengap blocking affect the sampled Morris trajectories?
**A:**
1. **Direct Answer:** It acts as an implicit boundary condition, rejecting trajectories that step into regions where the primary eigenvector is ill-defined.
2. **Reasoning:** If a perturbation causes the AHP matrix to drop its eigengap below the 0.03 threshold, the step fails and the trajectory is discarded.
3. **Implementation:** Eigengap enforcement is part of the `VariableKEngine` which throws an error handled by the sensitivity engine.
4. **Limitation:** This creates "holes" in the parameter space, complicating the uniform grid assumption of Morris.
5. **Defense:** We strictly only care about sensitivity within the valid operational manifold, so rejecting low-eigengap regions is desired behavior.

**Q26:** What is the mathematical basis for setting delta = p/(2(p-1)) = 2/3?
**A:**
1. **Direct Answer:** This specific delta ensures that sampling is symmetric and provides an equal probability of stepping forward or backward across the grid levels.
2. **Reasoning:** For a grid with p levels, a step size of p/(2(p-1)) guarantees that perturbations do not systematically bias the exploration toward the edges or center of the domain.
3. **Implementation:** Hardcoded as `dx = 2/3` (derived from p=4) at line 213 in `sensitivity.py`.
4. **Limitation:** It is a heuristic optimized for p being an even number.
5. **Defense:** Using the standard delta of 2/3 for p=4 is the canonical recommendation from Morris (1991) to ensure unbiased sampling.

**Q27:** Why is the Morris EE computed on C_L rather than the final discrete rank?
**A:**
1. **Direct Answer:** C_L is continuous, making finite difference calculations (EE) meaningful, whereas discrete rank is a step function.
2. **Reasoning:** Differentiating a step function yields mostly zeros and occasional infinite spikes, which destroys the averaging logic of mu_star.
3. **Implementation:** EE is explicitly calculated as `(cl[step+1] - cl[step]) / dx` in `sensitivity.py`.
4. **Limitation:** Small C_L sensitivities might not actually result in any rank changes.
5. **Defense:** Analyzing the continuous C_L provides a smooth, accurate metric of influence that underlies the final ranking.

**Q28:** How does the factor naming convention `score_POL-XXX-2026_s_YYY` work?
**A:**
1. **Direct Answer:** It concatenates the parameter type, the specific polymer ID, and the descriptor type.
2. **Reasoning:** This structured naming allows the engine to programmatically apply the correct perturbation bounds (e.g., +/- 0.15 for scores) to the correct location in the model state.
3. **Implementation:** Parsed dynamically during the initialization of `MorrisSensitivityEngine`.
4. **Limitation:** The rigid naming convention requires strict adherence in the baseline JSON files.
5. **Defense:** The naming convention ensures deterministic, traceable mapping between the sensitivity inputs and the underlying physical parameters.

**Q29:** What does `rank_mu_star = 1.95` mean for the dominant factor?
**A:**
1. **Direct Answer:** It means that, on average across trajectories, perturbing this factor changes the rank of the target polymer by almost 2 positions.
2. **Reasoning:** While we use C_L for primary sensitivity, we also track rank shifts; an average shift of 1.95 indicates severe instability caused by this single factor.
3. **Implementation:** Rank EE is tracked alongside C_L EE in the aggregation phase of `sensitivity.py`.
4. **Limitation:** Rank shifts are highly dependent on how closely clustered the other polymers are.
5. **Defense:** Tracking `rank_mu_star` translates abstract C_L sensitivity into concrete, operational impact on the final decision.

**Q30:** What is the relationship between these Morris findings and the Monte Carlo top-1 stability?
**A:**
1. **Direct Answer:** Monte Carlo showed *that* the top-1 ranking was unstable; Morris shows *why* it is unstable by identifying the specific factors driving the variance.
2. **Reasoning:** They are complementary: MC explores the holistic operational noise, while Morris isolates the individual drivers of that noise.
3. **Implementation:** Both methods operate on the same `VariableKEngine` using identical underlying math.
4. **Limitation:** Morris operates on a structured grid, whereas MC uses continuous distributions, so their exact numerical outputs are not directly convertible.
5. **Defense:** Morris effectively unpackages the black-box variance observed in the Monte Carlo results, pinpointing s_desc as the primary culprit.

### Hostile / Challenging (10)

**Q31:** r=10 is laughably small — your sensitivity analysis is meaningless.
**A:**
1. **Direct Answer:** r=10 is standard for Morris screening and entirely sufficient for identifying dominant factors.
2. **Reasoning:** Morris is an OAT screening technique, not a variance decomposition. Standard literature recommends r=10-20 to achieve stable differentiation between highly influential and non-influential factors.
3. **Implementation:** Enforced as a computational budget choice at line 114 in `sensitivity.py`.
4. **Limitation:** A higher r would stabilize the exact numerical values of mu_star, but would not likely change the top-ranked factors.
5. **Defense:** r=10 provides a decisive separation of dominant factors while respecting our strict computational constraints.

**Q32:** A 68% discard rate means your Morris design is broken.
**A:**
1. **Direct Answer:** The discard rate is a feature, not a bug; it reflects strict adherence to mathematically valid AHP geometries.
2. **Reasoning:** The high rate (21/31) is caused by random trajectories stepping into CR > 0.08 territory. Discarding them prevents garbage data from corrupting the sensitivity metrics.
3. **Implementation:** Discards occur at lines 349-351 when constraints are violated.
4. **Limitation:** It makes the screening computationally inefficient for this specific baseline.
5. **Defense:** The high discard rate ensures that our sensitivity results strictly apply to the valid, transitive operational manifold of the model.

**Q33:** You're just measuring noise sensitivity to your own noise.
**A:**
1. **Direct Answer:** We are measuring the system's structural sensitivity to defined parameter bounds.
2. **Reasoning:** The model is deterministic; the "noise" is simply the structured exploration of the parameter space. Identifying which parameters drive the output is exactly the point of sensitivity analysis.
3. **Implementation:** Controlled perturbations via `MorrisSensitivityEngine`.
4. **Limitation:** The results are entirely dependent on the somewhat arbitrary choice of perturbation bounds (+/- 0.15).
5. **Defense:** We are systematically quantifying the internal mechanics of the model's response to uncertainty.

**Q34:** Why not use Sobol indices which are mathematically superior?
**A:**
1. **Direct Answer:** Because Sobol is computationally intractable given our geometric constraints and high blocking rate.
2. **Reasoning:** Sobol requires N*(k+2) evaluations. With 26 factors and a 68% discard rate, assembling valid Sobol integration matrices would require tens of thousands of runs for a task that only needs screening.
3. **Implementation:** We deliberately selected Morris (line 45) to avoid this overhead.
4. **Limitation:** We cannot quantify exact variance contributions.
5. **Defense:** Morris answers the critical question—which factors matter most—at a fraction of the computational cost of Sobol.

**Q35:** Your factors aren't independent, so Morris assumptions are violated.
**A:**
1. **Direct Answer:** The factors we perturb are independently defined inputs; the dependencies are structural constraints (CR, Eigengap) applied after sampling.
2. **Reasoning:** While AHP weights have internal dependencies, we perturb the raw pairwise entries independently and use independent sampling, filtering out invalid combinations post-hoc.
3. **Implementation:** Independent grid construction occurs in `_generate_candidate_trajectory()`.
4. **Limitation:** The post-hoc filtering means the final sampled space is not a perfectly independent hypercube.
5. **Defense:** The independent sampling protocol combined with strict blocking is the most rigorous way to handle sensitivity in constrained spaces.

**Q36:** mu_star=0.14 is tiny — none of your factors matter.
**A:**
1. **Direct Answer:** mu_star=0.14 is massive considering C_L is bounded between 0 and 1.
2. **Reasoning:** An average elementary effect of 0.14 means that a standard step in this parameter shifts the entire Closeness Coefficient by 14% of its maximum possible range.
3. **Implementation:** Measured directly against the C_L outputs.
4. **Limitation:** The absolute magnitude is dependent on the delta step size.
5. **Defense:** In the context of a metric tightly clustered around 0.5 to 0.7, a shift of 0.14 is easily enough to cause severe rank inversions.

**Q37:** Morris can't detect interactions — you're missing the real story.
**A:**
1. **Direct Answer:** Morris explicitly detects the presence of interactions via the sigma parameter.
2. **Reasoning:** While it cannot identify specific pair-wise interactions (like Sobol second-order indices), a high sigma (like our 0.1830) definitively proves that strong interactions are occurring.
3. **Implementation:** Sigma computation is native to our `MorrisSensitivityEngine`.
4. **Limitation:** We know interactions exist, but cannot name the interacting pairs.
5. **Defense:** Detecting the presence of interactions via sigma is entirely sufficient for screening purposes.

**Q38:** Your whole-trajectory discard biases toward AHP-safe regions.
**A:**
1. **Direct Answer:** Yes, and that is mathematically intentional.
2. **Reasoning:** Regions that trigger AHP blocks (CR > 0.08) are mathematically invalid states. We strictly want our sensitivity analysis to be biased towards the valid operational manifold.
3. **Implementation:** Enforced at lines 349-351 in `sensitivity.py`.
4. **Limitation:** The boundaries of the valid region may exert strange leverage on the OAT finite differences.
5. **Defense:** We are exclusively interested in the model's behavior within mathematically sound configurations; discarding invalid regions is a requirement, not a bias.

**Q39:** If s_desc dominates, why didn't you just fix it deterministically?
**A:**
1. **Direct Answer:** Because s_desc represents empirical uncertainty that cannot be assumed away.
2. **Reasoning:** The descriptor score has an inherent confidence interval. We cannot arbitrarily fix it; we must acknowledge its uncertainty and its resulting impact on the final decision.
3. **Implementation:** Evaluated with a +/- 0.15 delta in `MorrisSensitivityEngine`.
4. **Limitation:** Identifying its dominance does not provide a mechanism to reduce its uncertainty.
5. **Defense:** Identifying the dominant factor directs where future experimental resources should be spent to reduce overall model uncertainty.

**Q40:** This screening adds no value over the Monte Carlo you already ran.
**A:**
1. **Direct Answer:** Monte Carlo measures systemic failure; Morris identifies the specific cause.
2. **Reasoning:** MC showed a 14% blocking rate and high rank instability but treated the system as a black box. Morris deconstructs the inputs to prove that score variations, not AHP weights, drive that instability.
3. **Implementation:** Executed via `run_morris_sensitivity()` explicitly to complement the MC runs.
4. **Limitation:** Morris is a structured artificial grid, less representative of "real" variance than MC distributions.
5. **Defense:** Morris adds crucial explanatory power, transforming Monte Carlo's observation of instability into a specific, actionable insight.

## 13. Explanations (1, 5, Board)
- **1-Min:** We wiggle each input slightly to see which one changes the final score the most. For Indomethacin, Soluplus's descriptor score had the biggest impact.
- **5-Min:** We use Morris Elementary Effects ($r=10$). We generate trajectories in the parameter space, step one factor at a time, and measure the $\Delta Y / \Delta X$. It showed score factors dominate over AHP weights in driving $C_L$ variation.
- **Board:** Draw the grid space for 2 factors. Draw an OAT trajectory. Show how $EE$ is computed at each step.

## 14. Things Never to Claim
- Never claim "Morris sensitivity proves s_desc causes ranking changes"
- Never claim it's a high-resolution analysis (it is *screening*).

## 15. Cross-References
- Link to `08_UNCERTAINTY_LIMITATIONS.md`
