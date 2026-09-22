# Module 08 — Validation & Reproducibility
# Document 07: Validation Failures, Controlled Blocking, and Inherent Scientific Limitations

```
========================================================================================
PHARMAPOLYSCOPE VIVA SCHOOL — MODULE 08: VALIDATION & REPRODUCIBILITY
DOCUMENT 07: VALIDATION FAILURES, CONTROLLED BLOCKING, AND INHERENT SCIENTIFIC LIMITATIONS
========================================================================================
Authoritative Engine: PharmaPolySCOPE v2.0.0 (Variable-K Spectral Governance)
Framework Package: v1.5.0-FOUR-CRITERION-FREEZE | Baseline Commit: 31eee4d
Methodology: 2.0.0-SP-PRP-TOPSIS | Document Revision: 2.0.0-FINAL
Target Audience: Doctoral Candidates, Quality Assurance Auditors, Viva Examiners
========================================================================================
```

---

## 1. Epistemological Foundations: Controlled Blocking as a Positive Validation Feature

### 1.1 The Epistemic Hazard of Silent Numerical Coercion
In conventional commercial software engineering, an unhandled exception or halted execution is typically treated as a software defect—a "bug" to be eliminated by aggressive try-catch wrappers, default parameter substitution, clipping, or heuristic regularization. In consumer software, keeping the application running at all costs is paramount.

In **scientific decision computing and regulatory pharmaceutical modeling**, however, this paradigm is inverted. The most dangerous failure mode in scientific software is **silent numerical decay**: an algorithm encounters an ill-conditioned, rank-deficient, non-transitive, or physically impossible state, but instead of halting, quietly coerces the numbers (e.g., via arbitrary Tikhonov ridge regularization $\mathbf{\Sigma} + \epsilon \mathbf{I}$, projection to the nearest positive semi-definite matrix, or boundary clipping) to output a plausible-looking ranking accompanied by green checkmarks.

Such silent coercion is epistemologically fraudulent:
1. **Falsification of Probability Densities**: Modifying or "repairing" non-compliant parameter draws during Monte Carlo sampling alters the underlying sampling distribution, producing an uncharacterized, synthetic prior.
2. **Concealment of Physical Instability**: If a drug-polymer screening problem exhibits a near-zero spectral eigengap ($\delta_K < 0.03$), the PCA coordinate axes are hypersensitive to perturbation. Coercing this subspace to continue execution conceals the reality that the resulting ranking is geometric noise.
3. **Violation of Regulatory Data Integrity (ALCOA+)**: Under FDA 21 CFR Part 11 and GAMP 5 principles, computational predictions informing drug development must be accurate, traceable, and defensible. Synthesizing data points to prevent pipeline crashes violates ALCOA+ standards of Accuracy and Originality.

### 1.2 Controlled Blocking as Authoritative Measurement
PharmaPolySCOPE implements an explicit **Fail-Fast Mathematical Governance Architecture**. Every mathematical theorem underpinning the decision framework—the Perron-Frobenius theorem for AHP reciprocity, the Davis-Kahan perturbation theorem for invariant subspace stability, Sylvester's criterion for Riemannian positive definiteness, and topological separation in TOPSIS—is codified into an executable gate.

When a simulated replicate violates one of these boundary conditions, the engine triggers a **controlled block**:
- The event is not an uncaught runtime crash; it is an authoritative, classified measurement indicating that the parameter combination has crossed beyond the valid mathematical domain of the model.
- Controlled blocking proves that the software actively monitors its own theoretical boundaries, enforcing rigorous compliance with the mathematical laws on which its validity depends.
- In stochastic uncertainty propagation and sensitivity screening, blocked samples are preserved as primary scientific data, aggregated into a canonical block histogram, and reported in the permanent audit trail.

```
+--------------------------------------------------------------------------------------------------+
|                                    CONTROLLED BLOCKING PIPELINE                                  |
|                                                                                                  |
|   Parameter Realization (Scores S, Weights A)                                                    |
|                     │                                                                            |
|                     ▼                                                                            |
|   [ Gate 1: Bounded Normalized Scores ] ───> Outside [0, 1] / NaN? ──> INVALID_INPUT_SCORE      |
|                     │ (Pass)                                                                     |
|                     ▼                                                                            |
|   [ Gate 2: Cohort Discrimination ] ────────> Std Dev sigma_j <= 0? ──> ZERO_VARIANCE            |
|                     │ (Pass)                                                                     |
|                     ▼                                                                            |
|   [ Gate 3: AHP Consistency Ratio ] ────────> CR >= 0.08? ───────────> AHP_CR_BLOCKED            |
|                     │ (Pass)                                                                     |
|                     ▼                                                                            |
|   [ Gate 4: Davis-Kahan Boundary Gap ] ─────> delta_K < 0.03? ───────> EIGENGAP_BLOCKED          |
|                     │ (Pass)                                                                     |
|                     ▼                                                                            |
|   [ Gate 5: Metric Positive Definiteness ] ──> min eig(M_K) <= 0? ────> NON_PD_METRIC             |
|                     │ (Pass)                                                                     |
|                     ▼                                                                            |
|   [ Gate 6: Reference Target Separation ] ──> D+ + D- <= 1e-12? ─────> REFERENCE_COINCIDENCE    |
|                     │ (Pass)                                                                     |
|                     ▼                                                                            |
|   Valid Decision Snapshot -> Enforce Replicate Conservation: N_gen == N_valid + N_blocked       |
+--------------------------------------------------------------------------------------------------+
```

---

## 2. The Six Canonical Block Reasons in `phase5_models.py`

In `src/asd_mcda/v2/phase5_models.py` (lines 15–27), the taxonomy of failure modes is formalized into `CANONICAL_BLOCK_REASONS`. In stochastic uncertainty quantification (`uncertainty.py`, lines 297–311) and sensitivity analysis (`sensitivity.py`, lines 320–347), every blocked evaluation maps strictly to one of these reasons:

1. **`AHP_CR_BLOCKED`** (`AHPConsistencyViolationError`, `AHPNonReciprocalError`):
   - **Condition**: Saaty Consistency Ratio $CR \ge 0.08$ or reciprocity deviation $\|a_{ji} a_{ij} - 1\| \ge 10^{-12}$.
   - **Failure Mechanism**: Pairwise comparisons introduce intransitive preference loops ($A \succ B, B \succ C, C \succ A$), violating the transitivity axiom required for Perron-Frobenius eigenvector weight stability.

2. **`EIGENGAP_BLOCKED`** (`DegenerateSubspaceBlockedError`):
   - **Condition**: Boundary Eigengap $\delta_K = \lambda_K - \lambda_{K+1} < 0.03$.
   - **Failure Mechanism**: Spectral degeneracy. Under the Davis-Kahan perturbation theorem, as $\delta_K \to 0$, eigenvector orientation becomes hyper-sensitive, causing arbitrary coordinate rotations that invalidate projection geometry.

3. **`ZERO_VARIANCE`** (`ZeroVarianceStandardizationError`):
   - **Condition**: Criterion standard deviation $\sigma_j \le 0$ across cohort candidates.
   - **Failure Mechanism**: All candidates exhibit identical performance on criterion $j$, resulting in $0/0$ division-by-zero during cohort standardization ($Z_{ij} = (S_{ij} - \mu_j)/\sigma_j$) and total loss of discrimination.

4. **`NON_PD_METRIC`** (`NonPositiveDefiniteMetricError`, `MateriallyNegativeQuadraticFormError`, `RankDeficientSubspaceError`):
   - **Condition**: $\min(\text{eig}(M_K)) \le 0$, quadratic form $\delta^T M_K \delta < -10^{-12}$, or $\text{rank}(V_K) < K$.
   - **Failure Mechanism**: The metric tensor $M_K = V_K^T W V_K$ fails Sylvester's positive definiteness criterion, violating Riemannian distance axioms and allowing imaginary or non-monotonic distance calculations.

5. **`REFERENCE_COINCIDENCE`** (`DegenerateReferenceCoincidenceError`):
   - **Condition**: Separation denominator $D_i^+ + D_i^- \le 10^{-12}$.
   - **Failure Mechanism**: Pathological subspace projection collapses ideal and anti-ideal targets onto the same coordinate as candidate $i$, yielding an undefined $0/0$ relative closeness $C_L = D_i^- / (D_i^+ + D_i^-)$.

6. **`INVALID_INPUT_SCORE`** (`StandardizationError`, `ValueError`, `InvalidWeightVectorError`):
   - **Condition**: Entries outside $[0.0, 1.0]$, NaN, $\pm\infty$, or dimension mismatch.
   - **Failure Mechanism**: Input score matrix violates bounded normalized contract or contains non-numeric IEEE floating-point exceptions.

---

## 3. Replicate Conservation Law and Conditional Probabilities

### 3.1 The Replicate Conservation Law
To eliminate silent sample loss, PharmaPolySCOPE enforces the **Replicate Conservation Law**:

$$N_{\text{generated}} \equiv N_{\text{valid}} + N_{\text{blocked}}$$

$$\sum_{b \in \mathcal{B}} \text{Histogram}[b] \equiv N_{\text{blocked}}$$

In `src/asd_mcda/v2/uncertainty.py` (lines 318–322), this invariant is defended by an active runtime assertion:
```python
num_valid = len(valid_k_list)
num_blocked = sum(block_counts.values())

assert num_replicates == num_valid + num_blocked, (
    f"Replicate conservation violated: N_gen ({num_replicates}) != "
    f"N_valid ({num_valid}) + N_blocked ({num_blocked})"
)
```

### 3.2 Indomethacin Baseline Audit Accounting
In the baseline Monte Carlo uncertainty quantification for Indomethacin (`IND-001-2026`) ($N_{\text{generated}} = 10,000$, $\sigma_{\text{score}} = 0.05$, $\sigma_{\text{AHP}} = 0.15$, seed = 42):
- Total Generated: $N_{\text{generated}} = 10,000$
- Valid Replicates: $N_{\text{valid}} = 8,600$ ($86.00\%$)
- Blocked Replicates: $N_{\text{blocked}} = 1,400$ ($14.00\%$)
- Block Decomposition:
  * `AHP_CR_BLOCKED`: **1,396** replicates ($99.71\%$ of blocked)
  * `EIGENGAP_BLOCKED`: **4** replicates ($0.29\%$ of blocked)
  * `ZERO_VARIANCE`: **0** replicates
  * `NON_PD_METRIC`: **0** replicates
  * `REFERENCE_COINCIDENCE`: **0** replicates
  * `INVALID_INPUT_SCORE`: **0** replicates

Every single replicate is accounted for. Not a single draw is discarded without an auditable taxonomic classification.

### 3.3 Why $P(\text{top-1})$ Must Be Conditioned on Valid Replicates
In PharmaPolySCOPE, all candidate ranking probabilities, expected ranks, and closeness distributions are strictly **conditioned on governance-valid replicates**:

$$P(\text{top-1} \mid \text{Valid}) = \frac{\sum_{m \in \mathcal{M}_{\text{valid}}} \mathbb{I}(R_{i, m} = 1)}{N_{\text{valid}}}$$

**Scientific Justification**:
1. **Meaningless Comparison in Blocked States**: If an AHP matrix has $CR \ge 0.08$, transitivity fails. There is no mathematically valid ranking vector $\mathbf{R}_m$ associated with that replicate. If an eigenvalue gap is $< 0.03$, the PCA projection is uninterpretable. Imputing a rank to blocked states would require inventing computational outcomes.
2. **Epistemic Conditioning**: The Monte Carlo simulation does not ask: *"What is the probability of selecting Polymer X across arbitrary mathematical errors?"* It asks: *"Given that the decision scenario satisfies the foundational axioms of rational decision theory and spectral stability, what is the probability that Polymer X is optimal?"*
3. **Audit Transparency**: By pairing $P(\text{top-1} \mid \text{Valid})$ with the governance distribution $\{P(\text{VALID}) = 0.8600, P(\text{BLOCKED}) = 0.1400\}$, decision-makers can assess both the candidate's performance and the stability of the preference manifold.

---

## 4. Morris Trajectory Whole-Discard Policy

### 4.1 The Geometry of Morris Elementary Effects
The Morris method for Global Sensitivity Analysis (GSA) constructs randomized trajectories through a normalized $d$-dimensional factor grid $\Omega \subset [0, 1]^d$. A single Morris trajectory consists of an ordered sequence of $d+1$ sampling points: $\mathbf{x}^{(0)}, \mathbf{x}^{(1)}, \dots, \mathbf{x}^{(d)}$. Each consecutive step modifies **exactly one factor** $j_m$ by a fixed normalized step size $\Delta = \frac{p_{\text{grid}}}{2(p_{\text{grid}} - 1)}$:

$$EE_{j_m}^{(k)} = \frac{Y(\mathbf{x}^{(m+1)}) - Y(\mathbf{x}^{(m)})}{\Delta_{j_m}}$$

### 4.2 Why Any Trajectory with a Blocked Point Is Discarded in Its Entirety
In `src/asd_mcda/v2/sensitivity.py` (lines 285–358), if any point $\mathbf{x}^{(m)}$ triggers a governance block, the engine enforces the **Whole-Trajectory Discard Policy**:
1. **Broken Differential Chaining**: Because each point $\mathbf{x}^{(m)}$ serves as both endpoint for step $m-1$ and base point for step $m$, an invalid evaluation at $\mathbf{x}^{(m)}$ invalidates two adjacent elementary effects simultaneously.
2. **Destruction of Design Orthogonality**: A Morris design is an orthogonal randomized block. Salvaging "surviving" segments yields an unbalanced, non-orthogonal design where some factors are sampled $r$ times and others $r - k$ times.
3. **Survivor Sampling Bias**: Discarding only invalid points while retaining remaining steps biases sensitivity indices toward regions of parameter space that avoid governance gates.
4. **Indomethacin Screening Experience**: In the Indomethacin screening ($r=10$ valid trajectories requested across $d=26$ factors, total attempted = 31):
   - Accepted Trajectories: 10
   - Discarded Trajectories: 21 ($100\%$ due to `AHP_CR_BLOCKED`)
   - Discard Mechanism: Log-space exploration of the 6 pairwise AHP comparisons occasionally lands in regions where transitivity is violated ($CR \ge 0.08$). Every invalid trajectory was discarded in its entirety, preserving strict orthogonality across all 10 realized trajectories.

---

## 5. The Six Inherent Scientific Limitations of PharmaPolySCOPE

Scientific integrity requires unambiguous demarcation between what a computational model predicts and the physical reality of the laboratory. PharmaPolySCOPE is subject to six fundamental scientific limitations:

### Limitation 1: Computational Ranking Is Not Experimental Formulation Success
PharmaPolySCOPE is an in silico multi-criteria decision prioritization tool. A high ranking ($P(\text{top-1}) = 55.51\%$) indicates that a polymer exhibits an optimal balance of calculated thermodynamic affinity, high glass transition temperature, and functional group complementarity relative to other candidates in the library. However, computational ranking **does not guarantee successful experimental ASD manufacture**. Physical ASD manufacturability depends on solvent solubility and flash evaporation kinetics (in spray drying), melt rheology and torque (in hot-melt extrusion), post-drying compressibility, powder flow, and tablet ejection friction.

### Limitation 2: Thermodynamic Equilibrium Approximations Neglect Crystallization Kinetics and Supersaturation
The foundational physical models in PharmaPolySCOPE assume thermodynamic equilibrium:
- Hansen Solubility Parameters predict cohesive energy density matching.
- Flory-Huggins Interaction Parameter ($\chi$) calculates mean-field thermodynamic enthalpy of mixing.
- Gordon-Taylor Equation calculates idealized volume-additive composite glass transition ($T_{g,\text{mix}}$).

**Physical Reality**: Real amorphous solid dispersions are **kinetically trapped, non-equilibrium glassy systems**. Their shelf-life is dictated by kinetic barriers: classical nucleation induction times ($\tau$), critical nucleus radius ($r^*$), diffusion-controlled crystal growth, and secondary relaxations ($\beta$ / Johari-Goldstein) that initiate crystallization below $T_{g,\text{mix}}$.

### Limitation 3: Ternary Formulation Effects and Dissolution Dynamics Are Not Modeled
- **Binary Assumption**: PharmaPolySCOPE evaluates strictly binary drug-polymer systems. Commercial oral dosage forms are invariably **ternary or quaternary formulations** containing surfactants (e.g. Polysorbate 80, SLS), glidants, and disintegrants. Surfactants can disrupt drug-polymer hydrogen bonding or lower the system $T_g$.
- **Dissolution Dynamics**: Upon oral administration, ASD performance is governed by the dynamic **"spring and parachute" effect**—rapid dissolution to high kinetic supersaturation followed by polymeric precipitation inhibition. PharmaPolySCOPE does not simulate hydrodynamic boundary layer dissolution rates, liquid-liquid phase separation (LLPS), or gut luminal bile salt interactions.

### Limitation 4: Polymer Polydispersity, Tacticity, and Regiochemistry Are Omitted
In PharmaPolySCOPE, polymers are represented as discrete chemical repeat units or nominal average molecular weights:
- **Polydispersity ($\text{PDI} = M_w / M_n$)**: Real commercial polymers have broad distributions ($PDI \approx 2.0 - 6.0$). Low-molecular-weight oligomers act as plasticizers that depress $T_g$, while high-molecular-weight chains dominate melt viscosity.
- **Tacticity & Stereochemistry**: The spatial arrangement of substituents (isotactic, syndiotactic, atactic) substantially impacts chain flexibility and free volume.
- **Copolymer Regiochemistry**: For cellulosic derivatives such as HPMCAS, the precise distribution of acetyl and succinoyl groups along the anhydroglucose ring strongly alters microphase separation, which is not captured by mean group contribution models.

### Limitation 5: AHP Decision Weights Remain Heuristic Expert Prior Inputs
The criteria weights in PharmaPolySCOPE are derived via Saaty's Analytical Hierarchy Process. While internal transitivity is strictly enforced via the $CR < 0.08$ gate, the weights themselves reflect **human subjective prior preference orderings**:
- There is no physical law establishing that thermodynamic miscibility ($\chi$) must be weighted 3-to-1 relative to 2D chemical similarity ($s_{\text{desc}}$).
- Different formulation organizations may legitimately define different weightings.
- Morris sensitivity analysis proves that input weights exert strong leverage over final closeness scores; hence, rankings reflect expert judgment combined with physical modeling, not autonomous physical fact.

### Limitation 6: Prospective Experimental Formulation Validation Is Currently Pending
PharmaPolySCOPE has undergone rigorous computational verification, retrospective benchmark concordance testing against published experimental literature screens, and formal cryptographic freeze. However, **prospective experimental wet-lab validation remains pending**:
- The platform outputs prioritized formulation hypotheses to guide laboratory screening.
- Until candidate rankings are tested prospectively against de novo experimental spray-drying, mDSC thermograms, XRPD crystallization tracking, and 6-month accelerated stability testing ($40^\circ\text{C} / 75\%\text{ RH}$), the platform cannot claim empirical validation of novel predictions.

---

## 6. Ten Layered Viva Defense Scenarios

### Q1: Why do you claim that blocking 1,400 replicates is a positive validation feature rather than a defect?
- **Direct Answer:** Controlled blocking is an active verification gate that enforces the mathematical boundaries of underlying physical theorems, preventing silent numerical corruption and ensuring that empirical distributions reflect only admissible mathematical states.
- **Reasoning:** In non-linear decision pipelines, parameter perturbations can easily drift into ill-conditioned domains (such as negative eigenvalues or inconsistent preference cycles). Silently coercing such inputs falsifies the uncertainty distribution and masks instability. Blocking them preserves statistical integrity and adheres to FDA ALCOA+ data accuracy standards.
- **Actual PharmaPolySCOPE Implementation:** Enforced in `src/asd_mcda/v2/uncertainty.py` (lines 297–311) and `sensitivity.py` (lines 320–347), where strongly typed exceptions are caught, mapped to `CANONICAL_BLOCK_REASONS`, and logged in audit manifests.
- **Limitation / Caveat:** Controlled blocking reduces computational yield ($N_{\text{valid}} < N_{\text{gen}}$), requiring higher initial replicate generation to achieve target sample sizes.
- **One-Sentence Defense:** Controlled blocking proves that our software actively enforces mathematical theorems rather than silently coercing invalid numbers to hide failures.

### Q2: Why did you implement a consistency threshold of $CR < 0.08$ rather than Saaty's classical 0.10?
- **Direct Answer:** We selected $CR < 0.08$ as an operational governance baseline to guarantee transitivity in multi-criteria weighting, and log-space perturbations occasionally break transitivity because independent noise on pairwise ratios compounds across matrix cycles.
- **Reasoning:** In a $4 \times 4$ pairwise matrix, the consistency index measures deviation from transitivity. In pharmaceutical formulation screening, where relative weights scale thermodynamic metrics, tighter transitivity ($CR < 0.08$) ensures that priority vectors derived from the principal eigenvector remain physically stable. Perturbing pairwise ratios independently can compound around closed loops ($a_{ik} \ne a_{ij}a_{jk}$), pushing $CR$ above $0.08$.
- **Actual PharmaPolySCOPE Implementation:** Implemented in `src/asd_mcda/v2/ahp.py` (line 92) and caught in `uncertainty.py` (line 302) via `AHPConsistencyViolationError`.
- **Limitation / Caveat:** Tightening $CR$ from $0.10$ to $0.08$ increases the block rate under $\sigma_{\text{AHP}} = 0.15$ to $13.96\%$.
- **One-Sentence Defense:** The $CR < 0.08$ threshold guarantees that our weighting vectors maintain strict transitivity before entering metric tensor synthesis.

### Q3: What is the mathematical justification for terminating execution when $\delta_K < 0.03$?
- **Direct Answer:** The Davis-Kahan perturbation theorem dictates that the rotational sensitivity of principal component eigenvectors is inversely proportional to the spectral gap; when $\delta_K < 0.03$, microscopic input noise can trigger catastrophic subspace rotation.
- **Reasoning:** Under perturbation $\mathbf{E}$, the canonical angle $\Theta$ between true and perturbed subspaces satisfies $\|\sin\Theta\| \le \|\mathbf{E}\|_2 / \delta_K$. When $\delta_K \to 0$, the bound diverges, allowing eigenvectors to rotate arbitrarily within degenerate eigenspaces. Halting execution prevents projecting candidates onto geometrically unstable coordinate frames.
- **Actual PharmaPolySCOPE Implementation:** Enforced in `src/asd_mcda/v2/stability.py` (lines 82–90), raising `DegenerateSubspaceBlockedError`.
- **Limitation / Caveat:** The threshold $\delta_K = 0.03$ is an empirical governance boundary; borderline cases ($0.03 \le \delta_K < 0.10$) emit WARNING flags rather than halting.
- **One-Sentence Defense:** The eigengap gate mathematically guarantees that our PCA projection planes are rotationally stable and well-separated.

### Q4: What physical scenario triggers `ZeroVarianceStandardizationError`?
- **Direct Answer:** It occurs when all candidate polymers in a screening cohort produce identical numerical scores on a criterion ($\sigma_j = 0$), making Z-score standardization mathematically undefined due to division by zero.
- **Reasoning:** Standardization transforms raw criterion scores into standard deviations: $Z_{ij} = (S_{ij} - \mu_j)/\sigma_j$. If all candidates possess identical properties on a criterion, $\sigma_j = 0$. Proceeding would emit IEEE NaN or Inf, which silently poisons covariance matrices.
- **Actual PharmaPolySCOPE Implementation:** Enforced in `src/asd_mcda/v2/engine.py` (lines 172–178), raising `ZeroVarianceStandardizationError`.
- **Limitation / Caveat:** A cohort with zero variance on a criterion cannot be standardized as a dynamic variable; the cohort must be expanded to restore discriminatory variance.
- **One-Sentence Defense:** We fail fast on zero variance to inform the user that their candidate library lacks discriminatory variance on that criterion.

### Q5: How could the metric tensor $M_K$ violate positive definiteness?
- **Direct Answer:** $M_K = V_K^T W V_K$ can become non-positive definite if PCA projection vectors collapse or if numerical rounding creates microscopic negative eigenvalues; the $-10^{-12}$ threshold distinguishes rounding noise from true mathematical invalidity.
- **Reasoning:** For distance to satisfy Riemannian metric axioms, $M_K$ must be strictly positive definite ($\min \text{eig}(M_K) > 0$). In double-precision floating-point arithmetic, computing $\delta^T M_K \delta$ when $\delta \approx 0$ can yield values like $-10^{-16}$. Clamping within $[-10^{-12}, 0.0]$ avoids crashing on machine noise, while values below $-10^{-12}$ trigger `MateriallyNegativeQuadraticFormError`.
- **Actual PharmaPolySCOPE Implementation:** Implemented in `src/asd_mcda/v2/metrics.py` (lines 78–84, 112–118).
- **Limitation / Caveat:** Clamping within $[-10^{-12}, 0.0]$ represents an engineering concession to finite precision, but guarantees non-negative Euclidean metrics.
- **One-Sentence Defense:** Distinguishing machine precision jitter from true mathematical failure prevents false crashes while strictly arresting invalid metrics.

### Q6: Why do you condition $P(\text{top-1})$ on valid replicates instead of all 10,000 generated replicates?
- **Direct Answer:** Conditioning on valid replicates is mathematically mandatory because blocked replicates do not represent valid decision spaces, and it preserves relative proportions among candidates on the admissible decision manifold.
- **Reasoning:** An invalid replicate (e.g. $CR = 0.12$) possesses an intransitive preference structure where no rational ranking exists. Dividing top-1 counts by 10,000 would treat blocked replicates as assigning rank $>1$ to all candidates, which is logically absurd. Full transparency is maintained by reporting both conditional probabilities and the unconditional governance distribution ($86\%$ valid, $14\%$ blocked).
- **Actual PharmaPolySCOPE Implementation:** Implemented in `src/asd_mcda/v2/uncertainty.py` (line 357): `p_top1 = float(np.mean(r_i == 1))` evaluated over valid replicates.
- **Limitation / Caveat:** Conditional probability assumes ranking distributions within the blocked region mirror the valid region, which is unprovable because the blocked region is uncomputable.
- **One-Sentence Defense:** Defining probability conditional on valid replicates evaluates performance strictly on admissible decision manifolds.

### Q7: Why discard entire 27-point Morris trajectories when only a single step fails?
- **Direct Answer:** Discarding the entire trajectory is required because Morris elementary effects rely on an unbroken, orthogonal finite-difference chain; salvaging partial paths would introduce survivor bias and destroy design orthogonality.
- **Reasoning:** A Morris trajectory evaluates $d$ factors across $d+1$ contiguous steps where only one factor changes per step. If point $\mathbf{x}^{(m)}$ is blocked, the output is undefined, simultaneously invalidating the step into it and the step out of it. Keeping remaining points would produce an unbalanced design where factors are sampled unevenly.
- **Actual PharmaPolySCOPE Implementation:** Enforced in `src/asd_mcda/v2/sensitivity.py` (lines 349–358), logging discard counts in `discard_counts[block_reason]`.
- **Limitation / Caveat:** Whole-trajectory discard increases computational overhead; in Indomethacin screening, 31 trajectories were attempted to secure 10 valid paths.
- **One-Sentence Defense:** Whole-trajectory discard preserves the mathematical orthogonality of the Morris sensitivity design.

### Q8: How can an equilibrium thermodynamic model predict real formulation stability?
- **Direct Answer:** PharmaPolySCOPE does not model long-term non-equilibrium crystallization kinetics or molecular relaxation rates; it provides a thermodynamic affinity ranking that acts as a pre-screening filter to select candidates with favorable mixing baselines.
- **Reasoning:** Flory-Huggins theory predicts whether the free energy of mixing is negative, while Gordon-Taylor predicts composite glass transition elevation. Real shelf-life is dictated by non-equilibrium kinetics: nucleation barriers, critical nucleus radius, and structural $\alpha$-relaxation times. PharmaPolySCOPE identifies systems with minimal thermodynamic driving force for phase separation, but does not calculate kinetic crystallization rates.
- **Actual PharmaPolySCOPE Implementation:** Documented as an explicit scientific limitation in project governance and reports.
- **Limitation / Caveat:** The framework cannot predict crystallization onset times ($\tau_{\text{ind}}$) under accelerated stability testing ($40^\circ\text{C} / 75\%\text{ RH}$).
- **One-Sentence Defense:** PharmaPolySCOPE filters polymers by thermodynamic mixing affinity, but kinetic physical stability requires prospective DSC and PXRD testing.

### Q9: Why does PharmaPolySCOPE omit ternary formulation excipients and dissolution kinetics?
- **Direct Answer:** PharmaPolySCOPE isolates binary polymer carrier performance to avoid combinatorial complexity and lack of standardized ternary interaction parameters, focusing on carrier selection rather than final dosage form engineering.
- **Reasoning:** Extending group contribution models to ternary systems (drug-polymer-surfactant) introduces severe parameter uncertainty, as ternary interaction parameters ($\chi_{123}$) are rarely available. Furthermore, oral supersaturation maintenance is a dynamic dissolution phenomenon involving precipitation kinetics, which cannot be captured in static decision matrices without unvalidated heuristics.
- **Actual PharmaPolySCOPE Implementation:** Formalized as Limitation 3, restricting engine scope to binary carrier selection.
- **Limitation / Caveat:** The platform cannot predict whether adding a surfactant will destabilize a top-ranked binary glass through competitive plasticization.
- **One-Sentence Defense:** Restricting scope to binary carrier ranking maintains high parameter fidelity and avoids unvalidated ternary heuristics.

### Q10: How can a pharmaceutical company rely on your rankings when prospective validation is pending?
- **Direct Answer:** AHP weights reflect transparent expert prior preferences tested via Morris sensitivity analysis to expose ranking dependencies, and the platform serves as an auditable hypothesis generation engine rather than a substitute for wet-lab clinical development.
- **Reasoning:** Multi-Criteria Decision Analysis formalizes expert judgment. By documenting pairwise comparison matrices with cryptographic fingerprints and testing their robustness across 10,000 Monte Carlo draws, the software proves which candidate rankings are robust to weight shifts and which are borderline. It optimizes pre-experimental resource allocation by prioritizing the top candidates for laboratory trial.
- **Actual PharmaPolySCOPE Implementation:** Documented in `provenance_manifest.json` and `results/v2/morris_sensitivity_report.md`.
- **Limitation / Caveat:** The framework cannot replace physical laboratory trials; it optimizes pre-experimental resource allocation.
- **One-Sentence Defense:** PharmaPolySCOPE is an auditable, pre-experimental decision filter that prioritizes candidates to guide prospective laboratory formulation campaigns.
