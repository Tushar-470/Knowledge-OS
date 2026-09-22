# 05_IDEAL_ANTIIDEAL_REFERENCES

## What is it? / Why does it exist? / Problem solved
The concept of Ideal and Anti-Ideal reference points forms the geographic anchors of the SP-PRP-TOPSIS evaluation. They solve a critical problem in classical multi-criteria decision making: rank reversal. If you evaluate candidates based on the "best in the room" (cohort max), adding a new candidate shifts the anchor, altering the distances of all existing candidates. By defining physical, absolute anchors ($s_+ = [1,1,1,1]$ and $s_- = [0,0,0,0]$), PharmaPolySCOPE ensures that the definition of perfection is tied to physical thermodynamics, not relative cohort composition.

## Layers
- **Layer A (Literature):** Classical TOPSIS uses empirical anchors $A^* = \{ \max x_{ij} \}$ and $A^- = \{ \min x_{ij} \}$.
- **Layer B (Implementation):** PharmaPolySCOPE defines physical absolute bounds. Standardization uses cohort parameters $z_+ = (1 - \mu)/\sigma$, $z_- = (0 - \mu)/\sigma$. Projection uses $t_+ = z_+ @ V_K$ and $t_- = z_- @ V_K$ (metrics.py lines 160-161).
- **Layer C (Rationale):** A perfect polymer conceptually has a diagnostic score of 1.0 across all axes. Its identity as an ideal does not change regardless of what other polymers are in the dataset.

## Beginner explanation (Level 1)
Imagine taking a math test. In standard grading, your score is compared to 100% (absolute ideal) and 0% (absolute anti-ideal). Your grade doesn't depend on how well your classmates did. Classical TOPSIS, however, grades on a curve: it defines 100% as the highest score in the room and 0% as the lowest. If a genius enters the room, everyone else's grade drops. We use absolute anchors [1,1,1,1] to ensure that a polymer's physical distance to perfection is strictly its own, preventing "the genius effect" from ruining the rankings.

## Technical explanation (Level 2)
The physical criteria algorithms ($s_{HSP}$, $s_{\chi}$, etc.) generate diagnostic values strictly bounded in $[0,1]$. Therefore, the physical theoretical maximum compatibility vector is $s_+ = [1,1,1,1]^T$ and the minimum is $s_- = [0,0,0,0]^T$. 
In `project_reference_points()` (metrics.py line 133), these bounds are mapped into the PCA subspace. First, they must be standardized to match the spatial scaling of the cohort matrix $Z$. We apply the exact cohort mean $\mu$ and population standard deviation $\sigma$ (`ddof=0`) to the anchors:
$z_+ = \frac{1 - \mu}{\sigma}$ and $z_- = \frac{0 - \mu}{\sigma}$.
Then, we project these standardized anchors into the dynamic $K$-dimensional subspace using the right singular vectors $V_K$:
$t_+ = z_+ V_K$ and $t_- = z_- V_K$.
These projected points serve as the fixed coordinates for evaluating the quadratic form distance $D_+$ and $D_-$.

## Mathematics
Given physical bounds $s_+ = \vec{1}$, $s_- = \vec{0} \in \mathbb{R}^p$.
Given cohort statistics $\mu \in \mathbb{R}^p$ and $\sigma \in \mathbb{R}^p$ (computed with ddof=0).
1. **Standardization:**
   $z_{+, j} = \frac{1 - \mu_j}{\sigma_j} \quad \forall j \in \{1 \dots p\}$
   $z_{-, j} = \frac{0 - \mu_j}{\sigma_j} \quad \forall j \in \{1 \dots p\}$
2. **Projection:**
   $t_+ = z_+ V_K \in \mathbb{R}^K$
   $t_- = z_- V_K \in \mathbb{R}^K$
These vectors $t_+$ and $t_-$ are the fixed termini for the $D$ computations.

## Hand-calculable example
Assume 3 candidates, 2 criteria. 
$\mu = [0.4, 0.6]$, $\sigma = [0.2, 0.3]$.
$V_1 = \begin{bmatrix} 0.8 \\ 0.6 \end{bmatrix}$. ($K=1$).
Physical ideal $s_+ = [1, 1]$.
Standardized: $z_+ = [ \frac{1-0.4}{0.2}, \frac{1-0.6}{0.3} ] = [3.0, 1.333]$.
Projected: $t_+ = 3.0(0.8) + 1.333(0.6) = 2.4 + 0.8 = 3.2$.
Physical anti-ideal $s_- = [0, 0]$.
Standardized: $z_- = [ \frac{0-0.4}{0.2}, \frac{0-0.6}{0.3} ] = [-2.0, -2.0]$.
Projected: $t_- = -2.0(0.8) + -2.0(0.6) = -1.6 - 1.2 = -2.8$.
The anchors in the 1D subspace are firmly set at $3.2$ and $-2.8$.

## Actual production example
In the Indomethacin cohort validation, $\mu$ and $\sigma$ are computed over $N_{generated} = 10,000$ Monte Carlo samples. 
The absolute anchors $s_+ = [1,1,1,1]$ are passed into `project_reference_points()`.
Because the population variance for specific criteria (like $s_{GT}$, the model-predicted glass-transition margin) differs heavily from $s_{HSP}$ (the compatibility diagnostic), the standardized $z_+$ vector strongly elongates along dimensions with low variance, asserting that achieving physical perfection in a low-variance criterion is mathematically "further" away.

## Exact implementation trace
The implementation rigorously separates cohort standardization from subspace projection across two distinct modules:
```
Raw physical anchors:
s+ = [1, 1, 1, 1]
s- = [0, 0, 0, 0]
      ↓
[Step 1: standardize_cohort() in src/asd_mcda/v2/standardization.py:78-79]
z+ = (1.0 - mu) / sigma
z- = (0.0 - mu) / sigma
      ↓
[Step 2: Spectral Decomposition & V_K in src/asd_mcda/v2/pca.py:52]
      ↓
[Step 8: project_reference_points() in src/asd_mcda/v2/metrics.py:133-169]
t+ = z_plus @ V_K   (line 160, shape (K,))
t- = z_minus @ V_K  (line 161, shape (K,))
```
- Source file `src/asd_mcda/v2/standardization.py` lines 78-79:
  `z_plus = (1.0 - mu) / sigma`
  `z_minus = (0.0 - mu) / sigma`
- Source file `src/asd_mcda/v2/metrics.py` lines 133-169:
  `project_reference_points(z_plus, z_minus, V_K)` receives pre-standardized arrays. Lines 156-157 convert them defensively via `np.asarray(..., dtype=np.float64)`. Lines 160-161 execute projection: `t_plus = z_p @ V` and `t_minus = z_m @ V`. Both returned arrays are sealed as read-only (`flags.writeable = False`).

## Inputs / Processing / Outputs
- **Inputs:** Absolute vectors [1,1,1,1] and [0,0,0,0], $\mu$ array, $\sigma$ array, $V_K$ matrix.
- **Processing:** Element-wise standardization followed by dot-product subspace projection.
- **Outputs:** $t_+$ and $t_-$, the $K$-dimensional coordinates of the ideal and anti-ideal points.

## Assumptions / Limitations / Failure modes
- **Assumption:** The theoretical maximum of any criterion is exactly 1.0. If a scoring function is unbounded, this method fails.
- **Limitation:** If a cohort has absolutely zero variance for a criterion, $\sigma=0$ and the standardization step will throw a divide-by-zero `ZeroDivisionError`.
- **Failure modes:** If $V_K$ captures only noise, the projected ideal $t_+$ may be located extremely close to the origin, artificially compressing the distance gradients.

## Alternatives and why this method was used
Classical TOPSIS uses cohort maximums ($\max x_{ij}$) and minimums. We explicitly rejected this because it causes rank reversal. A new, poorly performing polymer entering the cohort would change the anti-ideal anchor, inexplicably altering the closeness coefficient of the top-ranked computational candidate. Absolute anchors guarantee physical consistency.

## Common misconceptions
- **Misconception:** The ideal polymer actually exists. 
  **Reality:** No, $s_+ = [1,1,1,1]$ is a theoretical physical bound, not a real polymer in the dataset.
- **Misconception:** Standardizing $s_+$ ruins its "absolute" nature.
  **Reality:** Standardizing simply translates the absolute bound into the same coordinate system as the standardized cohort. It remains a fixed physical anchor relative to the raw space.

## One-minute, five-minute, and board explanations
- **One-minute:** Instead of comparing polymers to the best and worst in the current batch, we compare them to an absolute theoretical "perfect score" (1) and "zero score" (0), ensuring fair and stable rankings.
- **Five-minute:** Classical methods suffer from rank reversal because their anchors float based on who is in the dataset. By fixing our anchors at [1,1,1,1] and [0,0,0,0], we anchor the geometry to physical reality. We must then apply the same statistical stretching (standardization) and rotation (PCA projection) to these anchors so they accurately frame the cohort in the $K$-dimensional subspace.
- **Board:** Draw a 2D scatter plot bounded by a [0,1]x[0,1] box. Point to (1,1) as $s_+$ and (0,0) as $s_-$. Show that the scatter plot points change, but (1,1) remains fixed.

## Things never to claim
- NEVER say "probability of success".
- NEVER say "best polymer" or "optimal polymer". Say "top-ranked computational candidate".
- DO NOT claim this is classical Hwang-Yoon TOPSIS.

## Cross-references to other modules
- Module 03 (PCA) for $V_K$ matrix extraction.
- Module 04 for how Monte Carlo variance defines $\sigma$.

## 40 Viva Q&A

### Basic (1-10)
1. **What is $s_+$, and why is it defined as an absolute physical limit rather than an empirical cohort maximum?**
   - **Direct Answer:** $s_+ = [1,1,1,1]$ is the absolute physical ideal reference anchor, representing the theoretical boundary of perfect compatibility across all four physical criteria ($R_a=0$, $\chi \le 0$, optimal descriptors, $T_{g,mix} \ge T_{g,drug}+80K$).
   - **Reasoning:** Classical TOPSIS defines the ideal as $s_j^+ = \max_i x_{ij}$ within the evaluated cohort. This creates floating anchors that shift whenever candidates are added, removed, or modified, triggering rank reversal. Absolute physical anchors ground the coordinate system in unchanging thermodynamic laws, guaranteeing that candidate evaluations remain invariant to cohort composition.
   - **Implementation Trace:** Hardcoded physical bounds are standardized via `standardize_cohort()` (`src/asd_mcda/v2/standardization.py:78-79`) and projected via `project_reference_points()` (`src/asd_mcda/v2/metrics.py:133-169`).
   - **Viva Defense Sentence:** *"A polymer's thermodynamic compatibility is an intrinsic physical property that cannot depend on which other polymers happen to be present in the screening batch; absolute anchors guarantee this physical invariance."*
2. **What is $s_-$?** The physical anti-ideal reference point, [0,0,0,0].
3. **What values are used for standardization?** Cohort mean $\mu$ and population standard deviation $\sigma$.
4. **What is the `ddof` value for $\sigma$?** `ddof=0`.
5. **Where is `project_reference_points()` located?** `metrics.py` line 133.
6. **How is projection calculated?** By multiplying the standardized point by $V_K$.
7. **What does classical TOPSIS use for anchors?** The max and min values of the cohort dataset.
8. **What does $s_{\chi}$ represent?** The interaction compatibility / phase-boundary diagnostic.
9. **What does $s_{GT}$ represent?** The model-predicted glass-transition margin.
10. **Why are the scores bounded between 0 and 1?** Because the underlying thermodynamic scoring functions are normalized diagnostics.

### Intermediate (11-20)
11. **Why do we reject classical TOPSIS empirical anchors?** Because they cause rank reversal when the cohort composition changes.
12. **What is rank reversal?** A phenomenon where candidate A ranks above candidate B, but inserting a third candidate C causes B to rank above A.
13. **How does standardizing $s_+$ affect it?** It maps the theoretical 1.0 score into the $Z$-score space of the cohort.
14. **What is $t_+$?** The coordinate of the ideal point in the $K$-dimensional PCA subspace.
15. **How does $K$ affect $t_+$?** $t_+$ will have length $K$. Changing $K$ changes the dimensionality of the anchor.
16. **What is the shape of $z_+$?** It is a $p$-dimensional vector (4 dimensions).
17. **What is the shape of $V_K$?** It is a $p \times K$ matrix.
18. **At what line does $t_+ = z_+ @ V_K$ occur?** `metrics.py` line 160.
19. **What is the compatibility diagnostic?** $s_{HSP}$.
20. **Is the ideal polymer in the dataset?** No, it is a theoretical mathematical bound.

### Difficult (21-30)
21. **Does standardizing with cohort $\mu$ and $\sigma$ re-introduce rank reversal, and how is this defended?**
   - **Direct Answer:** No true rank reversal occurs. While cohort moments $\mu$ and $\sigma$ adjust the scaling of the coordinate frame, the physical definition of the anchors remains absolute and invariant.
   - **Reasoning:** In classical TOPSIS, adding an extreme candidate alters the anchor identity itself ($s^+$ or $s^-$ jumps to the new candidate's value), which alters relative distance ratios non-linearly. In SP-PRP-TOPSIS, $s^+=[1,1,1,1]$ remains the fixed target; standardization simply maps all candidates and anchors into a shared z-score space ($Z = (S-\mu)/\sigma$). Any minor numerical shift in closeness coefficients reflects statistical re-scaling of the population variance, not structural rank reversal.
   - **Implementation Trace:** Standardized in `standardization.py:78-79` with `ddof=0` and audited in `diagnostics.py:40-104`.
   - **Viva Defense Sentence:** *"Standardization rescales the measurement units of the population; it does not alter the absolute thermodynamic definition of the reference targets."*
22. **Why must we standardize $s_+$ before projecting?** Because the projection matrix $V_K$ was derived from the standardized covariance matrix of $Z$. Applying it to unstandardized data is a geometric domain error.
23. **What happens if a criterion has zero variance?** $\sigma_j = 0$, leading to a `ZeroDivisionError` during standardisation, indicating a malformed statistical cohort.
24. **How does this differ from v1.5?** v1.5 used a fixed $K=2$. The projection space for anchors in v2 is dynamically sized.
25. **How does $N_{generated} = 10,000$ affect $t_+$?** The large MC sample ensures $\mu$ and $\sigma$ are strictly stable, locking the geographic location of $t_+$ against small-sample statistical noise.
26. **Explain the mathematical necessity of `ddof=0` here.** The Monte Carlo generated cohort is the entire statistical universe of interest. We are not estimating parameters of a larger unseen population, hence population variance is required.
27. **What happens if an experimental score goes above 1?** The model assumes strict $[0,1]$ boundaries. A score $>1$ breaks the theoretical bound, rendering $s_+=[1,1,1,1]$ no longer the true ideal.
28. **How does the metric tensor $M_K = V_K^T W V_K$ interact with $t_+$?** $t_+$ defines the spatial location, while $M_K$ is the positive-definite quadratic-form metric induced by the physical AHP weighting in the PCA subspace, governing the eccentricity and orientation of the distance level sets radiating away from $t_+$.
29. **Why don't we apply PCA directly to the unstandardized cohort?** Because differing scales between criteria (e.g., $s_{HSP}$ vs $s_{GT}$) would dominate the covariance matrix, making the eigenvectors align only with the highest-magnitude criterion.
30. **If two polymers have the exact same distance to $t_+$, how do we break the tie?** By comparing their distance to $t_-$. If $C_L$ is identical down to `1e-12`, alphabetical sorting by `polymer_id` is used.

### Hostile/Challenging (31-40)
31. **Challenge:** Absolute anchors mean you're ignoring the real-world dataset limits.
    **Response:** Incorrect. We are tethering the evaluation to physical thermodynamics limits. Comparing polymers to an empirical max just creates artificial, relative rankings that break when the dataset changes.
32. **Challenge:** Your ideal polymer [1,1,1,1] is impossible to synthesize.
    **Response:** It is a reference point, not a target for synthesis. A compass pointing North is useful even if you never intend to walk to the North Pole.
33. **Challenge:** Because you use $\mu$ and $\sigma$ to standardise $s_+$, it's not truly an absolute anchor.
    **Response:** The unstandardized bound [1,1,1,1] is absolute. Mapping it to the cohort's statistical space via $\mu$ and $\sigma$ is a necessary coordinate transformation, not a redefinition of the physical ideal.
34. **Challenge:** By setting $s_- = [0,0,0,0]$, you claim 0 is the worst possible score. What if a score is negative?
    **Response:** The scoring functions for $s_{\chi}$, $s_{HSP}$, etc., are mathematically formulated and strictly clipped to yield $[0,1]$ normalized outputs. Negative scores are physically undefined in this framework.
35. **Challenge:** This is just a fancy way of running classical Hwang-Yoon TOPSIS.
    **Response:** No. Classical TOPSIS defines the ideal strictly as the vector of column-wise maximums from the raw dataset. Our theoretical bounds fundamentally rewrite the geometric basis of the algorithm.
36. **Challenge:** Soluplus is the definitively superior carrier because it is closest to [1,1,1,1].
    **Response:** I never use the term "best polymer". Soluplus is the top-ranked computational candidate because its $C_L$ ratio maximizes proximity to the ideal while maximizing distance from the anti-ideal under the AHP model.
37. **Challenge:** The projection $t_+$ destroys information from the rejected PCs.
    **Response:** That is a known property of PCA. However, the `audit_truncation_discrepancy()` function rigorously monitors this exact information loss to ensure rankings remain valid.
38. **Challenge:** A high score in one criterion can cancel out a zero in another, which is dangerous.
    **Response:** This is true of all compensatory MCDA methods. However, the $M_K$ metric tensor, weighted by AHP domain knowledge, specifically penalizes deviations based on the physical importance of each criterion.
39. **Challenge:** $t_+$ and $t_-$ can be the same point in a 1D subspace.
    **Response:** Only if the subspace completely collapses, meaning the cohort has zero variance. If so, a `DegenerateReferenceCoincidenceError` prevents processing.
40. **Challenge:** You're predicting formulation success based on how close a point is to [1,1,1,1].
    **Response:** Absolutely not. We are calculating the computational top-1 frequency under the specified uncertainty model. Rankings do not predict in vivo or experimental success.
