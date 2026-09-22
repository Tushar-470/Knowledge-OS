# DOCUMENT 5: GOVERNANCE BLOCKING AND VALID REPLICATES

## 1. What is it? / Why does it exist? / Problem solved
The Governance Blocking Taxonomy is PharmaPolySCOPE's mechanism for ensuring scientific integrity during Monte Carlo simulations. When we inject noise into AHP judgments or polymer descriptors, some of the resulting matrices become mathematically invalid or logically contradictory. Rather than forcing the pipeline to swallow garbage data (which would pollute the output rankings), the system intercepts and "blocks" these replicates. 
Problem solved: It prevents ill-conditioned geometries or inconsistent decision preferences from corrupting the distributional analysis.

## 2. Beginner Explanation (Level 1)
Imagine you ask 10,000 people to rate 3 polymers. If a person says "A is better than B, B is better than C, but C is better than A," their logic is circular. If you include their vote, it messes up the whole poll. Governance blocking is a bouncer at the door of our algorithm: it checks each of the 10,000 randomized "votes" (replicates) and kicks out the ones that break the rules of math or logic. We generated 10,000 replicates, but only 8,600 made sense. The 1,400 blocked ones were thrown out, and this is a *feature*, not a bug.

## 3. Technical Explanation (Level 2)
The SP-PRP-TOPSIS v2 methodology operates on a projected metric tensor $M_K = V_K^T W V_K$. Under perturbation, the weighting matrix $W$ (derived from AHP) or the input space $V$ can degenerate. 
- AHP perturbations can push the Consistency Ratio ($CR_4$) beyond the strict 0.08 threshold.
- Matrix rank deficiency can occur if perturbed values collapse.
The blocking taxonomy captures these exceptions centrally. The replicate conservation law ($N_{generated} = N_{valid} + N_{blocked}$) asserts that no replicate is silently dropped. A high AHP block rate explicitly quantifies the sensitivity of the preference manifold to the injected uncertainty.

## 4. Mathematics (with derivation where appropriate)
### Replicate Conservation Law
$$ N_{generated} = N_{valid} + \sum_{r \in R} N_{blocked}^{(r)} $$
Where $R$ is the set of canonical block reasons.
### AHP Consistency Block
Let $	ilde{A}$ be the perturbed pairwise comparison matrix. 
Calculate $\lambda_{max}(	ilde{A})$.
$CI = (\lambda_{max} - n) / (n - 1)$.
$CR = CI / RI_4$, where $RI_4 = 0.89$ (hardcoded in `ahp.py`).
If $CR > 0.08$, raise `AHPConsistencyViolationError` $ $\rightarrow$ Map to `AHP_CR_BLOCKED`.

## 5. Hand-calculable Example
Target: $N_{generated} = 5$.
Rep 1: Valid. ($N_{valid} = 1$)
Rep 2: $	ilde{A}$ yields $CR = 0.09 > 0.08$. Blocked. (`AHP_CR_BLOCKED = 1`)
Rep 3: Valid. ($N_{valid} = 2$)
Rep 4: PCA space rank degenerates. Blocked. (`EIGENGAP_BLOCKED = 1`)
Rep 5: Valid. ($N_{valid} = 3$)
Conservation check: $5 = 3 + (1 + 1)$. The zero-valid policy (`UNEVALUABLE_ALL_BLOCKED`) ensures we crash if $N_{valid} = 0$.

## 6. Actual Production Example
From the Indomethacin case study:
- $N_{generated} = 10,000$
- $N_{valid} = 8,600$
- $N_{blocked} = 1,400$
- `AHP_CR_BLOCKED` = 1,396 (99.7% of blocks)
- `EIGENGAP_BLOCKED` = 4 (0.3% of blocks)
- All other block reasons = 0.

## 7. Exact Implementation Trace
- **Tuple definition:** `CANONICAL_BLOCK_REASONS` (`phase5_models.py`, lines 15-27): `'INVALID_INPUT_SCORE'`, `'ZERO_VARIANCE'`, `'EIGENGAP_BLOCKED'`, `'AHP_CR_BLOCKED'`, `'NON_PD_METRIC'`, `'REFERENCE_COINCIDENCE'`, `'INVALID_SMILES'`, `'RDKIT_PARSE_FAILURE'`, `'RDKIT_SANITIZATION_FAILURE'`, `'RDKIT_UNAVAILABLE'`, `'FALLBACK_PROHIBITED'`.
- **Exception Mapping:** `uncertainty.py` (lines 298-311).
  - `ZeroVarianceStandardizationError` $ $\rightarrow$ `ZERO_VARIANCE` (line 298)
  - `DegenerateSubspaceBlockedError` $ $\rightarrow$ `EIGENGAP_BLOCKED` (line 300)
  - `AHPConsistencyViolationError` / `AHPNonReciprocalError` $ $\rightarrow$ `AHP_CR_BLOCKED` (lines 302-303)
  - `NonPositiveDefiniteMetricError` etc. $ $\rightarrow$ `NON_PD_METRIC` (lines 304-305)
  - `DegenerateReferenceCoincidenceError` $ $\rightarrow$ `REFERENCE_COINCIDENCE` (lines 306-307)
  - `StandardizationError` etc. $ $\rightarrow$ `INVALID_INPUT_SCORE` (lines 308-309)
  - Default $ $\rightarrow$ `INVALID_INPUT_SCORE` (lines 310-311).
- **Conservation Check:** Assertion at `uncertainty.py` line 319.
- **Zero-Valid Policy:** `UNEVALUABLE_ALL_BLOCKED` at line 337.

## 8. Inputs / Processing / Outputs
- **Inputs:** Monte Carlo noise scale ($\sigma_{score}$, $\sigma_{ahp}$), baseline model state.
- **Processing:** Try generating and evaluating $N$ replicates. Intercept specific mathematical exceptions.
- **Outputs:** $N_{valid}$ matrices, list of block reasons, and block frequencies.

## 9. Assumptions / Limitations / Failure Modes
- **Assumption:** A strict $CR > 0.08$ threshold is appropriate under stochastic perturbation.
- **Limitation:** High variance ($\sigma_{ahp}$) will naturally cause massive blocking, potentially reducing statistical power.
- **Failure Mode:** If all replicates block (`UNEVALUABLE_ALL_BLOCKED`), the system terminates rather than returning empty frames.

## 10. Alternatives and Why Not Used
- **Alternative:** Coerce matrices (e.g., force AHP consistency using nearest consistent matrix). 
- **Why rejected:** Violates the fundamental premise of uncertainty mapping. If preference uncertainty creates inconsistency, that inconsistency is the *truth* of the noise. Masking it creates false confidence.

## 11. Common Misconceptions
- *Misconception:* "14% of your runs failed, so your code is buggy."
- *Truth:* 14% of the perturbations explored regions of the parameter space that are mathematically inconsistent. Blocking them demonstrates that the governance filter actively functions.

## 12. 40 Viva Q&A

**Q1:** What does N_blocked represent in the Monte Carlo simulation?
**A:**
1. **Direct Answer:** N_blocked is the count of replicates discarded because their perturbed parameters violated at least one governance constraint.
2. **Reasoning:** Each of the 10,000 generated replicates is tested against consistency (CR < 0.08) and eigengap (δ_K ≥ 0.03) thresholds. Those that fail are blocked.
3. **Implementation:** `uncertainty.py` line 303 increments `block_counts[reason]` for each exception type caught.
4. **Limitation:** N_blocked depends on both the noise magnitude (σ_ahp, σ_score) and the specific baseline configuration.
5. **Defense:** N_blocked quantifies the fraction of the perturbation space that violates structural mathematical constraints.

**Q2:** What does N_valid represent?
**A:**
1. **Direct Answer:** N_valid is the count of replicates that passed all governance gates and produced valid C_L rankings.
2. **Reasoning:** Only replicates where AHP consistency, eigengap stability, and all other checks pass contribute to the final ranking statistics.
3. **Implementation:** `uncertainty.py` computes N_valid = N_generated - N_blocked, enforced by the conservation assertion.
4. **Limitation:** N_valid is not a measure of quality — it only certifies that the replicate obeyed mathematical admissibility rules.
5. **Defense:** N_valid defines the denominator for all frequency and rank statistics in the uncertainty analysis.

**Q3:** What is the replicate conservation law?
**A:**
1. **Direct Answer:** It states that N_generated = N_valid + N_blocked, with no replicates lost or double-counted.
2. **Reasoning:** Every generated replicate must be classified as either valid or blocked. This strict partition ensures full auditability.
3. **Implementation:** `uncertainty.py` line 319 contains an assertion enforcing this exact equality.
4. **Limitation:** Conservation only tracks replicate counts, not the quality or representativeness of the valid subset.
5. **Defense:** The conservation law guarantees that every Monte Carlo sample is accounted for in the final report.

**Q4:** What does CR stand for in this context?
**A:**
1. **Direct Answer:** CR stands for Consistency Ratio, a measure of logical coherence in AHP pairwise comparison matrices.
2. **Reasoning:** CR = CI / RI, where CI is the consistency index and RI is the random index for the given matrix size. CR ≥ 0.08 indicates intransitive preferences.
3. **Implementation:** `ahp.py` line 92: `cr >= CR_THRESHOLD - 1e-12` triggers blocking.
4. **Limitation:** CR is a scalar summary that can mask specific pairwise inconsistencies.
5. **Defense:** CR provides the standard Saaty-derived gate for filtering logically invalid weight structures.

**Q5:** What does EIGENGAP_BLOCKED mean?
**A:**
1. **Direct Answer:** It means the PCA eigenvalue gap fell below the 0.03 threshold, indicating a near-degenerate subspace.
2. **Reasoning:** When consecutive eigenvalues are nearly equal, the eigenvectors become rotationally unstable. Any C_L computed from such a projection is numerically unreliable.
3. **Implementation:** `stability.py` lines 77-91 classify replicates as BLOCKED when δ_K < 0.03.
4. **Limitation:** Only 4 out of 10,000 replicates triggered this for Indomethacin, making it statistically rare for this baseline.
5. **Defense:** Eigengap blocking prevents numerically degenerate projections from corrupting the ranking ensemble.

**Q6:** What does AHP_CR_BLOCKED mean?
**A:**
1. **Direct Answer:** It means the perturbed AHP pairwise comparison matrix failed the Saaty consistency test (CR ≥ 0.08).
2. **Reasoning:** Log-space noise on the upper-triangular entries can create intransitive preference orderings. The CR gate rejects these as logically invalid.
3. **Implementation:** `ahp.py` line 92 raises `AHPConsistencyViolationError` when CR exceeds the threshold.
4. **Limitation:** AHP_CR_BLOCKED dominates the blocking counts (1,396 / 1,400) because σ_ahp = 0.15 pushes many matrices past the 0.08 cliff.
5. **Defense:** AHP_CR_BLOCKED enforces that only logically coherent weight structures enter the ranking calculation.

**Q7:** What is the valid ratio for the Indomethacin baseline?
**A:**
1. **Direct Answer:** The valid ratio is N_valid / N_generated = 8,600 / 10,000 = 86.0%.
2. **Reasoning:** This means 86% of the perturbation space defined by (σ_score = 0.05, σ_ahp = 0.15) produces structurally valid decision matrices.
3. **Implementation:** Computed from the block_counts dictionary output of the Monte Carlo engine.
4. **Limitation:** This ratio is specific to the Indomethacin baseline and the chosen sigma values — different drugs or noise levels would yield different ratios.
5. **Defense:** An 86% valid ratio yields N_valid = 8,600, giving a maximum binomial standard error of approximately 0.0054 (0.54 percentage points), which quantifies Monte Carlo sampling precision.

**Q8:** What happens when N_valid = 0?
**A:**
1. **Direct Answer:** The system classifies the evaluation as UNEVALUABLE and cannot produce any ranking statistics.
2. **Reasoning:** With zero valid replicates, there is no denominator for p_top1 or expected rank. The analysis must report this as a fundamental failure of the chosen noise model for that baseline.
3. **Implementation:** The engine checks for N_valid > 0 before computing statistics; zero triggers a warning state.
4. **Limitation:** N_valid = 0 does not mean the framework is wrong — it means the noise parameters are too large for the specific baseline's governance tolerances.
5. **Defense:** The zero-valid fallback is an explicit design feature that prevents division-by-zero and forces honest reporting.

**Q9:** How many distinct block reasons exist in the codebase?
**A:**
1. **Direct Answer:** Six canonical block reasons: AHP_CR_BLOCKED, EIGENGAP_BLOCKED, ZERO_VARIANCE, NON_PD_METRIC, REFERENCE_COINCIDENCE, and INVALID_INPUT_SCORE.
2. **Reasoning:** Each reason corresponds to a specific mathematical failure mode in the decision pipeline. They are mutually exclusive per replicate (first failure encountered triggers the block).
3. **Implementation:** Defined in the exception hierarchy in `uncertainty.py` and caught in the main evaluation loop.
4. **Limitation:** Additional failure modes could theoretically emerge from new pipeline components not yet implemented.
5. **Defense:** The six canonical reasons provide exhaustive coverage of the known mathematical failure modes in the SP-PRP-TOPSIS pipeline.

**Q10:** What are the production block counts for Indomethacin?
**A:**
1. **Direct Answer:** AHP_CR_BLOCKED = 1,396; EIGENGAP_BLOCKED = 4; all other reasons = 0. Total N_blocked = 1,400.
2. **Reasoning:** The dominance of AHP_CR_BLOCKED reflects that σ_ahp = 0.15 pushes many matrices past the CR = 0.08 threshold, while eigengap collapse is extremely rare for this specific dataset geometry.
3. **Implementation:** Reported in the `block_counts` dictionary from `scientific_validation_results.json`.
4. **Limitation:** These counts are specific to the Indomethacin dataset with the default sigma parameters.
5. **Defense:** The block histogram confirms that AHP consistency is the binding constraint for this baseline.

**Q11:** Why does AHP_CR_BLOCKED dominate the blocking statistics (1,396 out of 1,400)?
**A:**
1. **Direct Answer:** Because σ_ahp = 0.15 creates enough multiplicative variation to push approximately 14% of generated matrices past the CR = 0.08 consistency threshold.
2. **Reasoning:** The baseline AHP matrix has a CR near but below 0.08. Log-space noise of ±16% frequently crosses this cliff. In contrast, eigengap collapse requires very specific eigenvalue configurations that are rare for 4-criteria systems.
3. **Implementation:** `ahp.py` evaluates CR for every perturbed matrix; `stability.py` evaluates eigengap independently.
4. **Limitation:** If σ_ahp were reduced to 0.05, AHP blocking would drop dramatically. The 1,396 count is σ-dependent.
5. **Defense:** The dominance of AHP blocking demonstrates that consistency is the primary governance constraint under our noise model.

**Q12:** Why is EIGENGAP_BLOCKED so rare (only 4 out of 10,000)?
**A:**
1. **Direct Answer:** Because score perturbations of σ = 0.05 rarely create eigenvalue configurations where consecutive eigenvalues become nearly equal.
2. **Reasoning:** For Indomethacin's 4 criteria, the covariance structure typically produces well-separated eigenvalues. Only extreme noise combinations collapse the gap below 0.03.
3. **Implementation:** `stability.py` lines 77-91 check δ_K = λ_k - λ_{k+1} against the 0.03 threshold.
4. **Limitation:** Datasets with inherently correlated criteria could produce much higher eigengap blocking rates.
5. **Defense:** The rarity of eigengap blocking for this dataset confirms the PCA subspace is generally well-conditioned.

**Q13:** How does the CR threshold of 0.08 compare to Saaty's standard of 0.10?
**A:**
1. **Direct Answer:** PharmaPolySCOPE uses a stricter threshold (0.08) than Saaty's conventional 0.10 to provide an additional safety margin.
2. **Reasoning:** A 0.08 cutoff blocks matrices that would pass under the traditional 0.10 rule, ensuring tighter logical consistency in the pharmaceutical decision context.
3. **Implementation:** `ahp.py` line 18: `CR_THRESHOLD = 0.08`.
4. **Limitation:** The choice of 0.08 vs 0.10 is a governance decision, not a mathematical necessity.
5. **Defense:** The stricter threshold adds a 20% safety margin over Saaty's standard, reflecting the higher-stakes pharmaceutical application.

**Q14:** What does RI_4 = 0.89 mean?
**A:**
1. **Direct Answer:** RI_4 is the Random Index for a 4×4 matrix, representing the average CI of randomly generated comparison matrices of that size.
2. **Reasoning:** Dividing CI by RI normalizes the consistency measure across different matrix sizes. For n=4, the standard Saaty RI is 0.89.
3. **Implementation:** `ahp.py` line 19: `RI = {3: 0.52, 4: 0.89, 5: 1.11, ...}`.
4. **Limitation:** RI values are empirically derived averages; they assume uniform random matrix generation.
5. **Defense:** RI_4 = 0.89 is the standard Saaty normalization constant for 4-criteria AHP evaluations.

**Q15:** Where does the exception mapping live in the codebase?
**A:**
1. **Direct Answer:** In `uncertainty.py` within the main Monte Carlo evaluation loop, where specific exception types are caught and mapped to canonical block reason strings.
2. **Reasoning:** Each exception class (e.g., `AHPConsistencyViolationError`, `DegenerateSubspaceBlockedError`) is caught individually and increments the corresponding `block_counts` entry.
3. **Implementation:** `uncertainty.py` lines 297-311, within the try/except blocks of the replication loop.
4. **Limitation:** The mapping is hardcoded; adding a new exception type requires modifying the catch blocks.
5. **Defense:** The explicit exception-to-reason mapping ensures every blocked replicate is classified under a documented canonical reason.

**Q16:** What does the ~14% blocking rate mean for statistical power?
**A:**
1. **Direct Answer:** For N_valid = 8,600, the maximum binomial standard error is approximately 0.0054 (0.54 percentage points). This quantifies Monte Carlo sampling precision; whether the precision is sufficient to resolve a particular ranking difference depends on the magnitude of that difference.
2. **Reasoning:** SE_max = √(0.25 / 8600) ≈ 0.005386. For this baseline, the 13.51 percentage point gap between Soluplus (55.51%) and HPMC E5 (42.00%) substantially exceeds this standard error, but smaller margins between closer competitors would require careful scrutiny.
3. **Implementation:** N_valid = 8,600 is the sample size used in the frequency calculations in `uncertainty.py`.
4. **Limitation:** Sampling precision only reflects Monte Carlo sample size; it does not measure or imply model robustness or real-world validity.
5. **Defense:** N_valid = 8,600 yields SE_max ≈ 0.54 percentage points, bounding simulation sampling uncertainty for the observed frequencies.

**Q17:** How is the block_reasons histogram structured?
**A:**
1. **Direct Answer:** It is a Python dictionary mapping canonical reason strings to integer counts, e.g., `{'AHP_CR_BLOCKED': 1396, 'EIGENGAP_BLOCKED': 4}`.
2. **Reasoning:** Each entry represents a mutually exclusive blocking category. The sum of all values equals N_blocked.
3. **Implementation:** Initialized as a defaultdict(int) and incremented within the exception handlers in `uncertainty.py`.
4. **Limitation:** The histogram only reports the first blocking reason per replicate; a replicate could potentially violate multiple constraints.
5. **Defense:** The histogram provides a full decomposition of blocked replicates by failure mode.

**Q18:** What does ZERO_VARIANCE blocking mean physically?
**A:**
1. **Direct Answer:** It means all candidates received identical scores on at least one criterion, making PCA meaningless for that dimension.
2. **Reasoning:** If a perturbed score column has zero variance, the corresponding eigenvalue is zero, and PCA cannot extract any discriminating information from it.
3. **Implementation:** Caught during the standardization step when a column standard deviation is zero.
4. **Limitation:** This is extremely unlikely with continuous perturbation distributions but is defended against as a safety measure.
5. **Defense:** ZERO_VARIANCE blocking prevents degenerate standardization from producing NaN or infinite values.

**Q19:** How does NON_PD_METRIC blocking work?
**A:**
1. **Direct Answer:** It blocks replicates where the projected metric tensor M_K = V_K^T W V_K fails to be positive definite.
2. **Reasoning:** The TOPSIS distance computation requires a positive definite metric. If M_K has a non-positive eigenvalue, distances become undefined or imaginary.
3. **Implementation:** Checked via eigenvalue decomposition of M_K; if min(eigenvalues) ≤ 0, the replicate is blocked.
4. **Limitation:** For the current 4-criteria system with diagonal W, NON_PD_METRIC is essentially impossible. It is a defensive check.
5. **Defense:** NON_PD_METRIC blocking prevents mathematically undefined distance calculations.

**Q20:** What does REFERENCE_COINCIDENCE mean?
**A:**
1. **Direct Answer:** It means the ideal and anti-ideal reference points in TOPSIS coincided, making the closeness coefficient undefined.
2. **Reasoning:** If all candidates project to the same point in K-space, the ideal and anti-ideal collapse to a single point, and the distance ratio C_L = d⁻ / (d⁺ + d⁻) becomes 0/0.
3. **Implementation:** Checked before the C_L computation; if reference points coincide, the replicate is blocked.
4. **Limitation:** Like ZERO_VARIANCE, this is an extreme edge case that continuous perturbation makes vanishingly unlikely.
5. **Defense:** REFERENCE_COINCIDENCE blocking prevents division-by-zero in the TOPSIS closeness formula.

**Q21:** Derive the λ_max blocking cutoff for a 4×4 AHP matrix with CR = 0.08.
**A:**
1. **Direct Answer:** CR = CI / RI = (λ_max - n) / ((n-1) × RI). For CR = 0.08, n = 4, RI = 0.89: λ_max = n + CR × (n-1) × RI = 4 + 0.08 × 3 × 0.89 = 4.2136.
2. **Reasoning:** Any perturbed matrix with λ_max ≥ 4.2136 will be blocked. This is the exact eigenvalue threshold implied by the CR gate.
3. **Implementation:** `ahp.py` computes λ_max via `np.linalg.eigvals()`, derives CI = (λ_max - n)/(n-1), then CR = CI/RI.
4. **Limitation:** This derivation assumes the standard Saaty RI; alternative RI tables would shift the cutoff.
5. **Defense:** The λ_max cutoff of 4.2136 is the exact mathematical boundary implied by CR = 0.08 for a 4×4 matrix.

**Q22:** Explain why governance filtering is not cherry-picking.
**A:**
1. **Direct Answer:** Cherry-picking selects results that favor a predetermined conclusion. Governance filtering applies predetermined mathematical rules that are blind to the outcome.
2. **Reasoning:** The CR and eigengap thresholds are fixed before any replication runs. They reject structurally invalid matrices regardless of which candidate would have ranked first. The filter is input-blind, not output-dependent.
3. **Implementation:** Blocking occurs before any ranking computation, at the AHP or PCA stage.
4. **Limitation:** While not cherry-picking, the choice of threshold values (0.08, 0.03) does influence how much of the perturbation space is admitted.
5. **Defense:** Governance filtering is a predetermined, outcome-blind mathematical admissibility test, fundamentally different from post-hoc selection bias.

**Q23:** How does blocking preserve the Law of Large Numbers guarantee?
**A:**
1. **Direct Answer:** By maintaining N_valid = 8,600 independent valid samples, the LLN ensures that empirical frequencies converge to their expected values within the valid subspace.
2. **Reasoning:** Blocked replicates are excluded from both the numerator and denominator of p_top1. The remaining valid samples are still i.i.d. draws from the conditional distribution (conditioned on passing governance).
3. **Implementation:** The mean and variance calculations in `uncertainty.py` use only the valid subset.
4. **Limitation:** LLN convergence applies within the governance-filtered subspace, not to the full perturbation space.
5. **Defense:** N_valid = 8,600 bounds sampling error with SE_max ≈ 0.54 percentage points, providing precision under the LLN within the valid subspace.

**Q24:** Explain how the zero-valid policy works.
**A:**
1. **Direct Answer:** If N_valid = 0, the system reports the evaluation as UNEVALUABLE rather than crashing or returning meaningless statistics.
2. **Reasoning:** With no valid replicates, all ranking statistics (p_top1, expected rank, etc.) are undefined. The framework explicitly handles this edge case to prevent silent failures.
3. **Implementation:** Checked before the aggregation step; if the valid array is empty, no statistics are computed.
4. **Limitation:** The zero-valid outcome indicates that the noise parameters overwhelm the governance constraints for this specific baseline.
5. **Defense:** The zero-valid policy ensures honest reporting and prevents the framework from producing numerically meaningless output.

**Q25:** Is the 14% blocking rate baseline-specific or universal?
**A:**
1. **Direct Answer:** It is strictly baseline-specific — determined by the interaction between the Indomethacin AHP matrix structure, σ_ahp = 0.15, and the CR = 0.08 threshold.
2. **Reasoning:** A different drug's baseline AHP matrix might have CR further from or closer to 0.08, producing dramatically different blocking rates under the same σ_ahp.
3. **Implementation:** The blocking rate emerges from the Monte Carlo run and is not a fixed system parameter.
4. **Limitation:** Generalizing the 14% rate to other drug systems without running their specific simulations is methodologically unsound.
5. **Defense:** The 14% blocking rate is an empirical observation specific to the Indomethacin baseline under the defined noise parameters.

**Q26:** How would changing σ_ahp from 0.15 to 0.30 affect blocking?
**A:**
1. **Direct Answer:** It would dramatically increase the AHP_CR_BLOCKED count, potentially exceeding 50% blocking, because doubled log-space noise creates far more intransitive matrices.
2. **Reasoning:** At σ_ahp = 0.30, the multiplicative variation becomes ±35%, which is severe enough to routinely generate CR > 0.08.
3. **Implementation:** Controlled by changing the `ahp_log_scale_sd` parameter in `uncertainty.py`.
4. **Limitation:** At very high blocking rates, the valid subset becomes small and may not be representative of the full perturbation space.
5. **Defense:** Doubling σ_ahp would stress-test the system more aggressively but reduce effective sample size substantially.

**Q27:** What does the stability distribution (STABLE 85.55%, WARNING 0.45%, BLOCKED 0.04%) mean?
**A:**
1. **Direct Answer:** These are classifications from the eigengap stability assessment: STABLE means δ_K ≥ 0.10, WARNING means 0.03 ≤ δ_K < 0.10, BLOCKED means δ_K < 0.03.
2. **Reasoning:** The three-tier system distinguishes between confidently stable projections, marginal ones requiring caution, and degenerate ones that must be excluded.
3. **Implementation:** `stability.py` lines 77-91 apply the thresholds and return the classification.
4. **Limitation:** These percentages describe PCA stability only, not AHP consistency or overall ranking quality.
5. **Defense:** The stability distribution confirms that the vast majority of valid replicates have well-conditioned PCA projections.

**Q28:** How do eigengap thresholds 0.03 and 0.10 relate to blocking?
**A:**
1. **Direct Answer:** δ_K < 0.03 triggers BLOCKED (replicate excluded); 0.03 ≤ δ_K < 0.10 triggers WARNING (replicate included but flagged); δ_K ≥ 0.10 is STABLE.
2. **Reasoning:** The two thresholds create a three-zone system: safe, cautionary, and excluded. Only the BLOCKED zone actually removes replicates from the ensemble.
3. **Implementation:** `stability.py` implements this as a series of conditional checks on the minimum eigengap.
4. **Limitation:** The threshold values (0.03, 0.10) are governance parameters, not physically derived constants.
5. **Defense:** The two-threshold system provides both a hard exclusion boundary and an early warning zone for marginal subspaces.

**Q29:** Why do blocked replicates never enter the ranking calculation?
**A:**
1. **Direct Answer:** Because they are intercepted by exception handlers before the C_L computation step, so no ranking is ever produced for them.
2. **Reasoning:** The pipeline evaluates AHP consistency and eigengap stability before computing TOPSIS closeness. If either check fails, execution halts for that replicate.
3. **Implementation:** The try/except block in `uncertainty.py` catches exceptions raised by `ahp.py` and `stability.py` before the ranking code executes.
4. **Limitation:** This means blocked replicates contribute zero information to the ranking statistics.
5. **Defense:** Blocked replicates are excluded at the source of the mathematical failure, ensuring no invalid data can leak into the rankings.

**Q30:** How does the assertion at uncertainty.py line 319 enforce conservation?
**A:**
1. **Direct Answer:** It asserts that len(valid_results) + sum(block_counts.values()) == N_generated, raising an AssertionError if violated.
2. **Reasoning:** This runtime check guarantees that every generated replicate is accounted for — either it produced a valid result or it was explicitly blocked and counted.
3. **Implementation:** `uncertainty.py` line 319: `assert len(valid) + sum(blocked.values()) == n_total`.
4. **Limitation:** The assertion only checks counts, not that individual replicates are correctly classified.
5. **Defense:** The conservation assertion provides a hard runtime guarantee against silent replicate loss.

**Q31:** "You throw out 14% of your data — that's cherry-picking."
**A:**
1. **Direct Answer:** We reject 14% of replicates that violate predetermined, outcome-blind mathematical validity rules — this is quality control, not selection bias.
2. **Reasoning:** The governance filters (CR < 0.08, δ_K ≥ 0.03) are defined before any simulation runs. They do not know which candidate would win. Blocked replicates contain structurally invalid decision matrices that would produce meaningless rankings.
3. **Implementation:** Blocking occurs in the AHP/PCA evaluation stages, before any ranking computation.
4. **Limitation:** We acknowledge that the blocking threshold choice affects how much of the perturbation space is sampled.
5. **Defense:** Governance filtering applies predetermined mathematical rules that are blind to ranking outcomes — this is structured quality control, not cherry-picking.

**Q32:** "Your blocking rate proves your noise model is wrong."
**A:**
1. **Direct Answer:** The blocking rate demonstrates that the noise model is severe enough to stress-test the governance filters — which is its purpose.
2. **Reasoning:** A 0% blocking rate would mean our noise is too mild to probe the consistency boundary. A 14% rate shows the noise actively challenges the AHP governance, creating a meaningful sensitivity test.
3. **Implementation:** Controlled by σ_ahp = 0.15, an exploratory computational parameter, not a calibrated physical measurement.
4. **Limitation:** The specific rate depends on the noise model parameters, which are not empirically calibrated.
5. **Defense:** The 14% blocking rate validates that our noise model is severe enough to meaningfully test the governance architecture.

**Q33:** "Why not coerce matrices to be consistent instead of blocking?"
**A:**
1. **Direct Answer:** Coercion would artificially modify the perturbed matrix, injecting a systematic bias toward consistency that masks the true sensitivity of the decision.
2. **Reasoning:** If we "fix" an inconsistent matrix (e.g., by nearest-consistent-matrix projection), we change the weights that the noise model generated. This makes the uncertainty analysis dishonest — it would underestimate the sensitivity of the ranking to AHP perturbations.
3. **Implementation:** The framework deliberately blocks rather than coerces, preserving the integrity of the noise model.
4. **Limitation:** Coercion could recover more valid replicates, but at the cost of introducing unknown systematic bias.
5. **Defense:** Blocking preserves the honesty of the perturbation model; coercion would silently bias the results.

**Q34:** "If EIGENGAP only blocks 4, it's useless overhead."
**A:**
1. **Direct Answer:** The eigengap check is computationally cheap and protects against a catastrophic failure mode — numerically degenerate projections producing chaotic C_L values.
2. **Reasoning:** Even though only 4 replicates triggered it for Indomethacin, other drug datasets with more correlated criteria could trigger it far more frequently. The check is defensive engineering.
3. **Implementation:** `stability.py` requires only a comparison of sorted eigenvalues — negligible computational cost.
4. **Limitation:** For this specific dataset, the eigengap check is rarely activated but still essential for correctness.
5. **Defense:** The eigengap filter prevents numerically catastrophic projections at near-zero computational cost.

**Q35:** "Your 86% valid rate is too low for publication."
**A:**
1. **Direct Answer:** For N_valid = 8,600, the maximum binomial standard error is approximately 0.0054 (0.54 percentage points). This quantifies Monte Carlo sampling precision; whether the precision is sufficient to resolve a particular ranking difference depends on the magnitude of that difference.
2. **Reasoning:** An 86% retention rate yields 8,600 valid replicates, which bounds the sampling error tightly. The 13.51 percentage point difference between Soluplus (55.51%) and HPMC E5 (42.00%) is substantially larger than this standard error margin.
3. **Implementation:** The valid rate is reported transparently alongside all statistics in `uncertainty.py`.
4. **Limitation:** A higher valid rate could be achieved by loosening governance thresholds, but this would compromise mathematical rigor.
5. **Defense:** N_valid = 8,600 bounds sampling precision to SE_max ≈ 0.54 percentage points within the mathematically valid subspace.

**Q36:** "Blocking biases your results toward conservative matrices."
**A:**
1. **Direct Answer:** Blocking conditions our analysis on the subspace of mathematically valid configurations, which is the correct conditioning for a decision analysis.
2. **Reasoning:** The blocked replicates contain logically contradictory preference structures. Including them would not add information — it would add noise from structurally invalid decision processes.
3. **Implementation:** The conditioning is explicit and transparent in the N_valid/N_generated reporting.
4. **Limitation:** The conditioned subspace is narrower than the full perturbation space, and this should be acknowledged.
5. **Defense:** Conditioning on mathematical validity is a standard and necessary practice in computational decision analysis.

**Q37:** "If you increased σ_ahp, you'd block everything — your model is fragile."
**A:**
1. **Direct Answer:** Any noise model has limits. If σ_ahp → ∞, all matrices become random and CR → 1. This is not fragility — it is a mathematical certainty for any consistency-gated system.
2. **Reasoning:** The purpose of σ_ahp = 0.15 is to test a specific, predefined severity of uncertainty. It is not meant to be increased indefinitely.
3. **Implementation:** σ_ahp is an explicitly chosen exploratory parameter, documented as such.
4. **Limitation:** The framework's behavior at extreme noise levels is not informative — it correctly identifies that all matrices are inconsistent.
5. **Defense:** The framework correctly blocks invalid matrices at any noise level; the chosen σ_ahp defines the scope of the stress test.

**Q38:** "Saaty says 0.10 not 0.08 — you're being arbitrarily strict."
**A:**
1. **Direct Answer:** We adopted 0.08 as a deliberately stricter threshold to provide a safety margin in a pharmaceutical decision context.
2. **Reasoning:** Saaty's 0.10 was proposed for general decision-making. In pharmaceutical formulation, where decisions affect patient safety, a tighter threshold is defensible as a conservative engineering choice.
3. **Implementation:** `ahp.py` line 18: `CR_THRESHOLD = 0.08`, documented and configurable.
4. **Limitation:** The choice of 0.08 vs 0.10 is a governance decision that should be documented and justified.
5. **Defense:** The 20% tighter threshold reflects the higher-stakes pharmaceutical application and is transparently documented.

**Q39:** "Your zero-valid fallback is just hiding a crash."
**A:**
1. **Direct Answer:** The fallback explicitly reports UNEVALUABLE status — it does not hide the failure, it surfaces it prominently.
2. **Reasoning:** A crash would provide no diagnostic information. The UNEVALUABLE classification tells the user exactly what happened and why, enabling them to adjust noise parameters.
3. **Implementation:** The zero-valid check prevents division-by-zero and forces an explicit status report.
4. **Limitation:** The user must interpret UNEVALUABLE as a signal to re-examine noise parameters, not as a software bug.
5. **Defense:** The zero-valid fallback is a designed safety mechanism that ensures honest, informative failure reporting.

**Q40:** "1,396 AHP blocks means your AHP matrix is poorly constructed."
**A:**
1. **Direct Answer:** The 1,396 blocks reflect the sensitivity of the consistency gate to σ_ahp = 0.15 noise, not a flaw in the baseline AHP matrix.
2. **Reasoning:** The baseline AHP matrix passes CR < 0.08 cleanly. The blocks occur only in stochastically perturbed versions. The 14% rate shows that the baseline sits in a region where moderate noise can cross the consistency boundary.
3. **Implementation:** The baseline CR is verified deterministically before any Monte Carlo run.
4. **Limitation:** A baseline matrix with CR closer to zero would produce fewer blocks under the same noise.
5. **Defense:** The 1,396 blocks characterize the noise model's interaction with the consistency gate, not a defect in the baseline AHP construction.

## 13. Explanations (1, 5, Board)
- **1-Min:** We ran 10,000 simulations. 1,400 broke math rules (mostly AHP logic). We threw them out to keep the results pure.
- **5-Min:** We use a strict governance pipeline (`phase5_models.py`). Exceptions map to canonical block reasons. By asserting conservation, we track exactly why regions of the perturbation space are invalid.
- **Board:** Draw the distribution of $CR$ values under perturbation. Mark $CR=0.08$. Show that the tail extending beyond 0.08 constitutes the `AHP_CR_BLOCKED` mass.

## 14. Things Never to Claim
- Never claim "100% of replicates succeeded."
- Never claim "blocking improves the probability of clinical success."
- Never call it "classical Hwang-Yoon TOPSIS."

## 15. Cross-References
- See `06_TOP1_FREQUENCY_INTERPRETATION.md` for how $N_{valid}$ is used.
- See `08_UNCERTAINTY_LIMITATIONS.md` for viva defense.
