# MODULE 06 - DOCUMENT 01: MONTE CARLO FROM ZERO

## 1. What is it? / Why does it exist? / Problem solved
The Monte Carlo (MC) Engine in PharmaPolySCOPE is the computational machinery responsible for propagating uncertainty from input parameters (scoring and AHP weights) to the final output (candidate rankings). In predictive modelling for amorphous solid dispersions (ASDs), deterministic point-estimates are insufficient because empirical physical properties and subjective expert weightings carry inherent uncertainty. The MC Engine solves this by executing $N=10,000$ independent simulations (replicates), sampling input parameters from defined probability distributions, and aggregating the results to determine the computationally robust "top-ranked computational candidate" based on its "computational top-1 frequency."

### Layer A: Literature / Theory
In literature, Monte Carlo simulation is a standard numerical method for uncertainty quantification (UQ). It relies on the Law of Large Numbers (LLN) to approximate the expected value of a complex, non-linear function by averaging over many random samples.

### Layer B: PharmaPolySCOPE Implementation (v2.0.0-SP-PRP-TOPSIS-MC)
The methodology is formally codified as `2.0.0-SP-PRP-TOPSIS-MC` (commit 1139397). The pipeline runs exactly $N_{generated} = 10,000$ replicates. A key structural invariant is Replicate Conservation: $N_{generated} = N_{valid} + N_{blocked}$.

### Layer C: Rationale for Choices
Why 10,000 replicates? 
100 is too small (high variance in tail probabilities). 1,000,000 is computationally prohibitive for an eigendecomposition-heavy pipeline and provides diminishing returns for top-1 frequency convergence. 10,000 ensures standard errors of frequencies are $\le 0.5\%$, perfectly balancing precision and compute time.

## 2. Beginner Explanation (Level 1)
Imagine you want to know if a specific polymer is the best match for a drug. You have some initial scores, but you aren't 100% sure they are exact—maybe they could be slightly higher or lower. 
Instead of guessing, we create 10,000 parallel universes. In each universe, we randomly tweak the scores just a tiny bit, mimicking real-world measurement error. We then run the entire PharmaPolySCOPE decision engine in all 10,000 universes. Finally, we count how many times each polymer "wins" (is the top-ranked computational candidate). If Polymer A wins in 9,000 out of 10,000 universes, it has a 90% computational top-1 frequency, giving us high confidence.

## 3. Technical Explanation (Level 2)
The Monte Carlo framework evaluates the sensitivity of the $C_L$ mapping to stochastic perturbations in the input space $\mathcal{X} = \{S, A\}$, where $S$ is the $n \times 4$ score matrix and $A$ is the $4 \times 4$ AHP preference matrix. We define a probability measure $P$ on $\mathcal{X}$. The engine draws i.i.d. samples $x^{(m)} \sim P$ for $m=1, \dots, 10000$. For each $x^{(m)}$, the full SP-PRP-TOPSIS function $f: \mathcal{X} \to \mathbb{R}^n$ is evaluated. We compute the empirical probability of the $i$-th alternative being the top-ranked computational candidate: $\hat{P}(i = \text{argmax}_j C_{L,j}) = \frac{1}{M_{valid}} \sum_{m} \mathbb{I}(i = \text{argmax}_j C_{L,j}^{(m)})$.

## 4. Mathematics & Derivations
**Law of Large Numbers (LLN):**
As $N \to \infty$, the sample average converges to the expected value:
$\frac{1}{N} \sum_{i=1}^N f(x_i) \xrightarrow{p} \mathbb{E}[f(X)]$

**Standard Error of Proportion:**
For an estimated frequency $\hat{p}$, the standard error is $\sqrt{\frac{\hat{p}(1-\hat{p})}{N}}$.
Maximized at $\hat{p} = 0.5$, for $N=10,000$, $SE \le \sqrt{\frac{0.25}{10000}} = 0.005$ (0.5%).

## 5. Hand-Calculable Example
Consider a 5-replicate toy MC for a simple function $f(x) = x^2$ with $x \sim \mathcal{N}(0.5, 0.05)$. (Using ddof=0 for population std throughout).
Samples: $x_1 = 0.45$, $x_2 = 0.55$, $x_3 = 0.50$, $x_4 = 0.48$, $x_5 = 0.52$.
$f(x_1) = 0.2025$
$f(x_2) = 0.3025$
$f(x_3) = 0.2500$
$f(x_4) = 0.2304$
$f(x_5) = 0.2704$
Mean $\mu = (0.2025 + 0.3025 + 0.2500 + 0.2304 + 0.2704) / 5 = 0.25116$.
Var = $\sum (f(x_i) - \mu)^2 / 5$ (ddof=0).

## 6. Actual Production Example
**Validation Run (Indomethacin):**
- $N_{generated} = 10,000$
- $N_{valid} = 8,600$
- $N_{blocked} = 1,400$
- Valid Ratio = $8,600 / 10,000 = 0.86$ (86%)
The top-ranked computational candidate was selected based on the highest top-1 frequency derived strictly from the 8,600 valid replicates.

## 7. Exact Implementation Trace
- `MonteCarloEngine` class defined in `uncertainty.py` (line 141).
- Default `num_replicates = 10000` (line 160).
- Default `random_seed = 42` (line 161) -> PCG64 bit generator via `np.random.default_rng()`.
- Method `MonteCarloEngine.run()` (line 154) oversees the replication loop.
- `run_monte_carlo()` wrapper function (line 487).
- Replicate evaluation: `VariableKEngine.evaluate()` (uncertainty.py lines 281-290). NO cached PCA.
- Replicate conservation assertion: $N_{generated} == N_{valid} + N_{blocked}$ (uncertainty.py lines 318-322).
- Zero-valid policy: simulation_state = `UNEVALUABLE_ALL_BLOCKED` if $N_{valid} == 0$ (line 337).

## 8. Inputs / Processing / Outputs
**Inputs:** Base scores (S), base AHP (A), hyperparameters ($N=10000$, $\sigma_{score}$, $\sigma_{ahp}$).
**Processing:** Generation of random seed, instantiation of parallel universe parameters, execution of full pipeline for each, categorization into valid vs blocked.
**Outputs:** Aggregated `SimulationResult` object containing frequencies, metrics, and blocking statistics.

## 9. Assumptions / Limitations / Failure Modes
**Assumption:** The baseline values represent the curated best-estimate configuration for the analysis, not ground-truth physical parameters.
**Limitation:** It assumes the structural equations (SP-PRP-TOPSIS) are fundamentally correct, only testing parameter sensitivity.
**Failure Mode:** "Zero-valid policy" triggered. If all 10,000 replicates are blocked (e.g., extremely noisy AHP causing every matrix to fail CR threshold), simulation terminates as `UNEVALUABLE_ALL_BLOCKED`.

## 10. Alternatives and Why This Method Was Used
**Alternative:** Analytical error propagation (Delta method).
**Why Rejected:** The decision pipeline involves discrete steps (variable K selection, CR threshold blocking) which are highly non-linear and discontinuous. Analytical derivatives are impossible. MC handles non-differentiable pipelines gracefully.

## 11. Common Misconceptions
- **Misconception:** "It calculates the probability of experimental success." **Correction:** It ONLY calculates the "computational top-1 frequency", representing model robustness, not real-world clinical success.
- **Misconception:** "We can speed it up by reusing PCA results." **Correction:** Every replicate invokes `VariableKEngine.evaluate()` fresh. Re-using PCA would destroy the coupling between variable K and perturbed scores.

## 12. 1-Minute, 5-Minute, and Board Explanations
**1-Minute:** We run the algorithm 10,000 times with slight random noise to ensure our top recommendation isn't a fluke caused by perfect inputs.
**5-Minute:** We use a PCG64 random generator to perturb scores and AHP weights across 10,000 replicates. Each replicate independently runs the v2.0.0-SP-PRP-TOPSIS pipeline, dynamically choosing K and evaluating closeness. We discard replicates that violate AHP consistency. The valid replicates vote for the top-ranked computational candidate.
**Board Explanation:** Draw a normal distribution over a score. Draw paths branching out to 10k different $M_K$ matrices, then funneling into a histogram of top-1 frequencies. Emphasize $N_{gen} = N_{val} + N_{block}$.

## 13. Things Never To Claim
- NEVER claim it predicts physical success probability.
- NEVER call the result the "best polymer" (use "top-ranked computational candidate").
- NEVER use Euclidean distance or classical TOPSIS concepts here; it's strictly SP-PRP-TOPSIS.
- NEVER state an outdated iteration count; the frozen engine strictly mandates N_generated = 10,000.

## 14. Cross-References
- **Module 03 (SP-PRP-TOPSIS):** How the deterministic pipeline processes each replicate.
- **Module 04 (AHP):** Why the CR threshold blocks replicates.
- **Module 05 (Variable K):** Why PCA must be re-run in every replicate.

---
## 40 Viva Q&A

### Basic (10)
1. **Q:** What is the primary purpose of the Monte Carlo simulation in PharmaPolySCOPE? 
   **A:** To propagate input parameter uncertainty through the model to determine the computational top-1 frequency of candidates.
2. **Q:** How many replicates are generated by default? 
   **A:** 10,000 ($N_{generated} = 10,000$).
3. **Q:** What random seed is used by default? 
   **A:** 42, using a PCG64 bit generator via `np.random.default_rng()`.
4. **Q:** What does the Replicate Conservation law state? 
   **A:** $N_{generated} = N_{valid} + N_{blocked}$.
5. **Q:** Can we reuse the PCA eigenvectors across replicates? 
   **A:** No, every replicate must evaluate PCA fresh because perturbations alter the score correlation matrix $R_m$.
6. **Q:** What is the correct term for the polymer selected by the engine? 
   **A:** "Top-ranked computational candidate."
7. **Q:** What happens if all replicates fail validation? 
   **A:** The Zero-valid policy triggers, setting the state to `UNEVALUABLE_ALL_BLOCKED`.
8. **Q:** Where is the `MonteCarloEngine` class defined? 
   **A:** In `uncertainty.py` at line 141.
9. **Q:** Why not 1,000,000 replicates? 
   **A:** Diminishing returns on the standard error of frequencies vs computational cost.
10. **Q:** What specific v2 methodology is being simulated? 
    **A:** `2.0.0-SP-PRP-TOPSIS-MC`.

### Intermediate (10)
11. **Q:** What is the standard error at 10,000 replicates for a 50% frequency? 
    **A:** Approximately 0.5% ($\sqrt{0.25/10000}$).
12. **Q:** In the validation run for Indomethacin, how many replicates were valid? 
    **A:** 8,600 (an 86% valid ratio).
13. **Q:** Why do we calculate population variance (`ddof=0`) instead of sample variance during MC aggregations? 
    **A:** By design, PharmaPolySCOPE treats the 10,000 replicates as the complete simulated population, not a sample of an infinite simulation.
14. **Q:** How does a replicate get "blocked"? 
    **A:** Generally through AHP consistency violations (CR >= 0.08) or eigengap failures during projection.
15. **Q:** What function acts as a convenience wrapper for running the engine? 
    **A:** `run_monte_carlo()` (uncertainty.py, line 487).
16. **Q:** Can the computational top-1 frequency be equated to physical formulation success? 
    **A:** Absolutely not; it only indicates robustness of the algorithmic ranking under assumed noise models.
17. **Q:** What does $M_K$ stand for in the context of SP-PRP-TOPSIS, and does its shape change during MC? 
    **A:** $M_K = V_K^T W V_K$ is the projected metric tensor. Its shape ($K \times K$) can change between replicates if dynamic K selection changes.
18. **Q:** Why is the Delta method inappropriate for this pipeline? 
    **A:** The variable K selection and strict CR gating introduce discontinuities; the pipeline is non-differentiable.
19. **Q:** How is the zero-valid state codified? 
    **A:** In `uncertainty.py` (line 337), if $N_{valid} == 0$, `simulation_state` becomes `UNEVALUABLE_ALL_BLOCKED`.
20. **Q:** What distributions are the physical variables (like $s_{HSP}$) perturbed with? 
    **A:** They are mapped to scores first, then perturbed using truncated normals.

### Difficult (10)
21. **Q:** Detail the assertion that guarantees Replicate Conservation in the code. 
    **A:** `assert N_generated == N_valid + N_blocked` in `uncertainty.py`, lines 318-322.
22. **Q:** If $N_{valid} = 8600$, how is the empirical probability formulated? 
    **A:** $\hat{P} = \frac{1}{8600} \sum_{m=1}^{10000} \mathbb{I}(i = \text{argmax}_j C_{L,j}^{(m)}) \cdot \mathbb{I}(m \in \text{Valid})$.
23. **Q:** How does the PCG64 generator ensure reproducibility across platforms compared to legacy Mersenne Twister? 
    **A:** It uses better statistical properties and is the strict standard in `np.random.default_rng()` in NumPy >= 1.17, preventing float drift across OSes.
24. **Q:** Prove that a static K=2 PCA (v1.5) requires drastically fewer compute cycles than v2.0 during MC. 
    **A:** v1.5 computes static 2 eigenvectors once. v2.0 recomputes spectral decomposition $10,000$ times and dynamically selects K based on $R_m$ eigenvalues, scaling cost by $O(10000 \times n^3)$.
25. **Q:** Why did the architect freeze the scientific baseline at commit 31eee4d? 
    **A:** To strictly delineate the v1.5 static 2D Euclidean topology from the projected metric tensor topology of v2.0.0.
26. **Q:** How does the structural invariant of $M_K = V_K^T W V_K$ respond to the MC permutations? 
    **A:** $W$ is perturbed via AHP noise, $V_K$ changes via score correlation shifts. Thus $M_K$ is subject to compounded stochastic variation.
27. **Q:** What happens to rank correlation between pre-MC and post-MC frequencies if perturbation variance is made arbitrarily large? 
    **A:** Under sufficiently strong symmetric perturbation, top-1 frequencies may become less concentrated, driving correlation toward zero; however, exact convergence to $1/N_{candidates}$ is not guaranteed for the implemented variable-$K$ system because PCA representation, nonlinear TOPSIS calculations, dynamic-$K$ selection, and governance blocking can affect the limiting distribution.
28. **Q:** Discuss the specific lines in `VariableKEngine.evaluate()` (281-290) behavior. 
    **A:** They force the pipeline to instantiate a new `evaluate` call with the perturbed score matrix, ensuring no leakage of state from previous replicates.
29. **Q:** Does the MC engine parallelize via multiprocessing by default? 
    **A:** No, standard execution is serial to maintain strictly deterministic execution traces for forensic auditing, though the math is embarrassingly parallel.
30. **Q:** Define the exact topological space in which the Monte Carlo samples are evaluated. 
    **A:** A variable-dimension projected metric space defined by the local projected metric tensor $M_K = V_K^T W V_K$.

### Hostile / Challenging (10)
31. **Q:** "You just run a random loop 10k times, it's glorified brute force. Why not just use Bayesian Inference?" 
    **A:** Bayesian inference requires defining a likelihood function mapping formulation outcomes to model parameters. We lack outcome data. We are performing Forward Uncertainty Quantification, not Inverse Parameter Estimation. MC is exactly correct for forward UQ.
32. **Q:** "You're just guessing the uncertainty bounds. If garbage goes in, garbage comes out." 
    **A:** The perturbation magnitudes ($\sigma$) are chosen as exploratory computational sensitivity parameters, not arbitrary guesses. $\sigma_{score} = 0.05$ probes a $\pm 5\%$ local neighborhood; $\sigma_{ahp} = 0.15$ tests $\approx \pm 16\%$ multiplicative judgment variation. It's a structured sensitivity analysis over plausible domain variations.
33. **Q:** "10,000 replicates is overkill and shows a lack of theoretical optimization." 
    **A:** For $N_{valid} = 8,600$ (from $10,000$ generated), the maximum binomial standard error is approximately $0.0054$ ($0.54$ percentage points). This quantifies Monte Carlo sampling precision; whether the precision is sufficient to resolve a particular ranking difference depends on the magnitude of that difference. Given it resolves in seconds on modern hardware, limiting replicates merely introduces noise without practically saving time.
34. **Q:** "In v1.5 you used classical TOPSIS, why did you needlessly complicate it with SP-PRP-TOPSIS?" 
    **A:** Never claim we used classical TOPSIS. v1.5 used a fixed K=2 projection with Euclidean geometry. v2.0 uses SP-PRP-TOPSIS to account for the Mahalanobis-like distortion via $M_K$. It's a mathematically required upgrade to preserve inner product structure.
35. **Q:** "Your 'Valid Ratio' of 86% just proves your model fails 14% of the time." 
    **A:** The 14% block rate demonstrates rigorous governance, filtering out replicates where stochastically generated AHP matrices lose logical transitivity. It demonstrates that the system strictly rejects non-compliant geometries, rather than failing.
36. **Q:** "You claim ddof=0 is correct, but every statistician uses n-1 for samples." 
    **A:** We use ddof=0 because the 10,000 universes generated constitute the entire population of our simulation space defined by our random seed, not a sample of a larger simulation.
37. **Q:** "I bet you reused PCA results to save time, compromising the accuracy of the MC." 
    **A:** As verified in `uncertainty.py` (lines 281-290), `VariableKEngine.evaluate()` is invoked entirely fresh for every replicate. No caching is performed.
38. **Q:** "Top-ranked computational candidate just means probability of clinical success, stop hiding behind jargon." 
    **A:** They are structurally distinct. The top-ranked computational candidate represents maximal alignment with input heuristics under $M_K$ geometry. Clinical success involves unmodeled pharmacokinetic variables. The terminology enforces semantic precision.
39. **Q:** "If your model drops to K=2 for some replicates, you are mixing dimensionalities and your results are mathematically invalid." 
    **A:** This is why we use conditional closeness $C_L|(K=k)$ rather than naive pooling. The descriptive label in `phase5_models.py` explicitly states it is a "DESCRIPTIVE SUMMARY ONLY — NOT GEOMETRICALLY INVARIANT". We handle dimensional shifts properly.
40. **Q:** "Your code doesn't even handle $N_{valid} = 0$, it probably crashes." 
    **A:** The Zero-valid policy in `uncertainty.py` (line 337) gracefully catches $N_{valid} == 0$, transitioning the simulation state to `UNEVALUABLE_ALL_BLOCKED` and returning a structured null result, explicitly preventing a crash.
