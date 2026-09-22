# 06_DISTANCE_AND_CL_FORMULA

## What is it? / Why does it exist? / Problem solved
The distance calculation and closeness coefficient ($C_L$) form the final mathematical scoring mechanism of SP-PRP-TOPSIS. 
Euclidean distance is geometrically incorrect in a principal component subspace when criteria have distinct physical importance weights. The PharmaPolySCOPE v2 model solves this by computing distances via a quadratic form utilizing the subspace metric tensor $M_K$. $C_L$ synthesizes the distance to the ideal ($D_+$) and the anti-ideal ($D_-$) into a single ratio bounded by $[0,1]$, yielding a deterministic ranking.

## Layers
- **Layer A (Literature):** TOPSIS ranks by similarity to the ideal, defined by $C = D_- / (D_+ + D_-)$.
- **Layer B (Implementation):** `compute_distances_and_closeness()` in `metrics.py` (line 172). Computes $q = \Delta @ M_K @ \Delta^T$, applies $\max(0, q)$ for float stability, takes the square root, and outputs $C_L$.
- **Layer C (Rationale):** We cannot use standard Euclidean math. $M_K = V_K^T W V_K$ ensures that the AHP weights ($W$) dynamically distort the space, penalizing distance along physically critical axes.

## Beginner explanation (Level 1)
If you're using GPS to walk to a perfect location (Ideal) and away from a dangerous location (Anti-Ideal), measuring a straight line on a map assumes all terrain is equal. But what if one direction is a steep mountain (a highly weighted physical criterion)? The "Metric Tensor" is like a topographic map that adjusts your distance based on how hard the terrain is. We measure your true "topographic" distance to both the perfect and dangerous locations, and calculate a score ($C_L$). A high score means you are very close to perfection and far from danger. 

## Technical explanation (Level 2)
For each candidate $i$, its projection is $T_i \in \mathbb{R}^K$.
We compute the displacement vectors:
`diff_plus` = $T_i - t_+$ (`metrics.py` line 235)
`diff_minus` = $T_i - t_-$ (`metrics.py` line 236)
The squared distance is a quadratic form evaluated using the metric tensor $M_K$:
$q_+ = (T_i - t_+) M_K (T_i - t_+)^T$ (line 238)
$q_- = (T_i - t_-) M_K (T_i - t_-)^T$ (line 239)
To handle microscopic floating-point underflow ($q < 0$), the implementation uses $D_+ = \sqrt{\max(0, q_+)}$. If $q < -1e-12$, it strictly raises a `MateriallyNegativeQuadraticFormError`.
The closeness coefficient is $C_L = \frac{D_-}{D_+ + D_-}$ (line 259), clipped securely to $[0,1]$.
Tie-breaking is deterministic: sort by $C_L$ descending, then alphabetically by `polymer_id`.

## Mathematics
1. Displacement: $\Delta_+ = T_i - t_+$, $\Delta_- = T_i - t_-$
2. Quadratic Form: $q_{\pm} = \Delta_{\pm} M_K \Delta_{\pm}^T$
3. Distance: $D_{\pm} = \sqrt{ \max(0, q_{\pm}) }$
4. Closeness Coefficient: $C_L = \frac{D_-}{D_+ + D_-}$
Because $M_K$ is positive semi-definite (constructed from $V_K^T W V_K$ with diagonal positive $W$), $q$ is strictly $\ge 0$ mathematically. 

## Hand-calculable example
Toy system in 1D ($K=1$).
Candidate projection $T_1 = 1.0$.
Ideal $t_+ = 3.0$. Anti-ideal $t_- = -1.0$.
Metric tensor $M_1 = 0.5$.
Displacement: $\Delta_+ = 1.0 - 3.0 = -2.0$. $\Delta_- = 1.0 - (-1.0) = 2.0$.
Quadratic forms:
$q_+ = (-2.0) \times 0.5 \times (-2.0) = 2.0$. So $D_+ = \sqrt{2.0} \approx 1.414$.
$q_- = (2.0) \times 0.5 \times (2.0) = 2.0$. So $D_- = \sqrt{2.0} \approx 1.414$.
$C_L = 1.414 / (1.414 + 1.414) = 0.5$.
Candidate is exactly halfway.

## Actual production example
Indomethacin cohort production values from the v2 pipeline:
1. Soluplus: $C_L=0.68643508$, $D_+=4.182604$, $D_-=9.156273$, rank=1
2. HPMC E5: $C_L=0.67314649$, $D_+=4.196084$, $D_-=8.641728$, rank=2
3. PVP-VA64: $C_L=0.60624689$, $D_+=5.082374$, $D_-=7.825140$, rank=3
Soluplus is the top-ranked computational candidate because it maximizes $C_L$. Counterintuitively to beginners, $D_-$ being large is *good* because it means the polymer is far away from the anti-ideal.

## Exact implementation trace
- Core logic in `compute_distances_and_closeness()` in `metrics.py` (line 172).
- Line 235: `diff_plus = T[i] - t_plus`
- Line 236: `diff_minus = T[i] - t_minus`
- Line 238: `q_plus = diff_plus @ M_K @ diff_plus`
- Line 242-247: `MateriallyNegativeQuadraticFormError` trap.
- Line 249: `D_plus = sqrt(max(0, q_plus))`
- Line 253-257: `DegenerateReferenceCoincidenceError` trap.
- Line 259: `C_L = D_minus / (D_plus + D_minus)`
- Line 267-290: Deterministic sort and tie-breaking `epsilon_rank = 1e-12`.

## Inputs / Processing / Outputs
- **Inputs:** Candidate projections $T$, metric tensor $M_K$, anchors $t_+, t_-$.
- **Processing:** Matrix displacement vectors, quadratic form multiplication, numerical stability checks, ranking sort.
- **Outputs:** Arrays of $D_+$, $D_-$, $C_L$, and the sorted integer ranks.

## Assumptions / Limitations / Failure modes
- **Assumption:** $D_+$ and $D_-$ cannot sum to zero. 
- **Limitation:** $C_L$ is highly sensitive to the AHP weights contained within $M_K$.
- **Failure modes:** 
  1. $q < -1e-12$ -> `MateriallyNegativeQuadraticFormError`.
  2. $D_+ + D_- \le 1e-14$ -> `DegenerateReferenceCoincidenceError`.

## Alternatives and why this method was used
We rejected Euclidean distance because it treats all PCA dimensions as physically equal. We rejected Mahalanobis distance because it normalizes strictly by variance, ignoring the domain-expert AHP weights $W$. The $M_K$ quadratic form is the only geometrically valid way to project a weighted importance matrix into a dimensionally reduced subspace.

## Common misconceptions
- **Misconception:** "Higher distance means worse score, so a large $D_-$ is bad."
  **Reality:** $D_-$ is distance to the ANTI-ideal. A larger $D_-$ increases the numerator of $C_L$, improving the score. High $C_L$ is good.
- **Misconception:** "C_L is the probability the polymer will work."
  **Reality:** Absolutely not. $C_L$ is a spatial geometric ratio, nothing more.

## One-minute, five-minute, and board explanations
- **One-minute:** We calculate the "weighted spatial distance" from a polymer to the perfect score and the worst score. The closeness ratio $C_L$ combines these into a single number from 0 to 1 to rank the polymers.
- **Five-minute:** We can't use simple Euclidean distance because some criteria are more important than others (like $s_{GT}$ vs $s_{\chi}$). The metric tensor $M_K$ bends the geometric space to reflect AHP weights. We calculate the quadratic form distance to the ideal ($D_+$) and anti-ideal ($D_-$). A polymer that minimizes $D_+$ and maximizes $D_-$ will achieve a high $C_L$, making it the top-ranked computational candidate.
- **Board:** Write the formula $q = \Delta M_K \Delta^T$. Show that if $M_K$ is the identity matrix, this reduces to Euclidean distance $\Delta \cdot \Delta$. Because $M_K = V_K^T W V_K$, it is not the identity, so it creates an ellipsoidal distance field.

## Things never to claim
- NEVER say "Euclidean distance". It is a quadratic form over $M_K$.
- NEVER call it "classical Hwang-Yoon TOPSIS".
- NEVER say "probability of success". 
- NEVER use "optimal polymer" or "best polymer". Say "top-ranked computational candidate".

## Cross-references to other modules
- Module 04 for $s_{GT}$, $s_{HSP}$, $s_{\chi}$ physical meanings.
- Module 03 (PCA) for $V_K$.
- Module 02 (AHP) for $W$ matrix and $RI_4=0.89$.

## 40 Viva Q&A

### Basic (1-10)
1. **What is the Closeness Coefficient $C_L$ formula, and why is $D_-$ in the numerator?**
   - **Direct Answer:** $C_L = \frac{D_-}{D_+ + D_-}$, representing the relative proportion of total reference distance accounted for by distance from the anti-ideal anchor.
   - **Reasoning:** A superior candidate should be simultaneously close to the ideal ($D_+ \to 0$) and far from the anti-ideal ($D_- \to \text{large}$). When $D_+ \to 0$, $C_L = \frac{D_-}{0 + D_-} = 1.0$. Conversely, if a candidate coincides with the anti-ideal ($D_- = 0$), $C_L = 0.0$. Placing $D_-$ in the numerator ensures that $C_L$ monotonically increases as candidate performance improves.
   - **Implementation Trace:** Evaluated at line 259 of `src/asd_mcda/v2/metrics.py`, with guardrails checking `denom <= 1e-14` (`DegenerateReferenceCoincidenceError`) and clipping output via `np.clip(cl, 0.0, 1.0)`.
   - **Viva Defense Sentence:** *"$C_L$ is a bounded geometric ratio where 1.0 indicates convergence to physical perfection and 0.0 represents complete physical incompatibility; $D_-$ in the numerator ensures intuitive positive monotonicity."*
2. **What is the formula for $C_L$?** $C_L = D_- / (D_+ + D_-)$.
3. **What is $D_+$?** Distance to the physical ideal reference point.
4. **What is $D_-$?** Distance to the physical anti-ideal reference point.
5. **What file and line computes this?** `metrics.py` line 172, `compute_distances_and_closeness()`.
6. **What does a high $C_L$ mean?** The candidate is closer to the ideal and further from the anti-ideal.
7. **Is Euclidean distance used?** No, a quadratic form using $M_K$ is used.
8. **Who is the top-ranked computational candidate for Indomethacin?** Soluplus.
9. **What is Soluplus's $C_L$ value?** 0.68643508.
10. **What is $s_{HSP}$?** The compatibility diagnostic.

### Intermediate (11-20)
11. **Why do we use $\max(0, q_+)$?** To prevent mathematical domain errors (square root of negative) caused by infinitesimal floating-point underflows.
12. **What happens if $q_+$ is $-1e-10$?** It evaluates to 0. But if it is $< -1e-12$, `MateriallyNegativeQuadraticFormError` is raised.
13. **What happens if $D_+ + D_- \le 10^{-14}$, and how does the engine handle it?**
   - **Direct Answer:** The engine halts immediately and raises `DegenerateReferenceCoincidenceError`, refusing to compute a division by zero.
   - **Reasoning:** Geometrically, $D_+ + D_- = 0$ implies that $D_+=0$ and $D_-=0$ simultaneously, which means the candidate's projected coordinates coincide with both the ideal $t_+$ and anti-ideal $t_-$. This can only occur if the projection matrix $V_K$ completely collapses the subspace (e.g., all criteria have identical values, projecting to a single point). In that degenerate geometry, closeness is mathematically undefined ($0/0$).
   - **Implementation Trace:** Implemented at lines 253–257 of `src/asd_mcda/v2/metrics.py` as an explicit defensive guardrail.
   - **Viva Defense Sentence:** *"Rather than silently defaulting to NaN or zero, the architecture employs strict exception gating, treating reference coincidence as an unphysical degenerate condition."*
14. **How are ties broken in rankings?** Sort by $C_L$ descending, then alphabetically by `polymer_id` (`epsilon_rank = 1e-12`).
15. **What is the mathematical definition of $q_+$?** $q_+ = (T_i - t_+) M_K (T_i - t_+)^T$.
16. **Why is a large $D_-$ good?** Because it means the candidate is far from the anti-ideal (the worst possible physical state).
17. **What is $s_{\chi}$?** The interaction compatibility / phase-boundary diagnostic.
18. **What is $s_{GT}$?** The model-predicted glass-transition margin.
19. **What is the range of $C_L$?** It is strictly clipped to $[0, 1]$.
20. **Why don't we use Mahalanobis distance?** Because it normalizes out the specific AHP domain-expert weights $W$.

### Difficult (21-30)
21. **Prove that $q_+$ is non-negative.** $M_K = V_K^T W V_K$. $W$ is a diagonal matrix of positive AHP weights. For any non-zero vector $v$, $v M_K v^T = (v V_K^T) W (V_K v^T) = u W u^T$. Since $W > 0$, $u W u^T \ge 0$. Thus $M_K$ is positive semi-definite.
22. **What specifically triggers `DegenerateReferenceCoincidenceError`?** If both the ideal and anti-ideal map to the exact same geometric point, meaning the subspace has zero variance and distances sum to zero.
23. **How does $N_{generated} = 10,000$ affect $C_L$?** The Monte Carlo sampling defines the standardisation $\mu, \sigma$ and the PCA $V_K$, mapping the spatial topography. $C_L$ values stabilize as $N$ increases.
24. **Why is `diff_plus @ M_K @ diff_plus` technically a tensor contraction?** Because $M_K$ is a rank-2 metric tensor operating on the vector space $\mathbb{R}^K$, defining the inner product $\langle \Delta, \Delta \rangle_M$.
25. **How does this implementation differ from v1.5?** v1.5 used a fixed $K=2$ and applied classical AHP logic directly to PC1/PC2 without a rigorous $M_K$ tensor projection. The v2 method is '2.0.0-SP-PRP-TOPSIS'.
26. **What is truncation discrepancy?** Measured in `diagnostics.py` (line 40), it is $\Delta D^2 = d_{full}^2 - d_K^2$, auditing the error introduced by discarding lower-variance principal components.
27. **Why must $C_L$ be clipped to $[0,1]$?** While mathematically bound to $[0,1]$ because of triangle inequality in standard metrics, extreme floating-point arithmetic or anomalous projection bounds could technically violate limits by `1e-16`. Line 263 clips it for rigorous type safety.
28. **Is $C_L$ robust to non-linear criteria?** No. The metric tensor assumes a linear inner product space.
29. **What is the significance of $ddof=0$?** It guarantees that the projection statistics do not contain Bessel's correction, mapping strictly the actual geometric variance of the generated point cloud.
30. **Why break ties alphabetically?** To guarantee deterministic provenance for automated testing and regulatory auditing.

### Hostile/Challenging (31-40)
31. **Challenge:** Your distance formula is literally just Euclidean distance with extra steps.
    **Response:** Incorrect. Euclidean distance requires an identity metric tensor. $M_K$ heavily distorts the space to respect AHP weights $W$; calculating Euclidean distance in this subspace yields scientifically meaningless numbers.
32. **Challenge:** $C_L$ is obviously the probability of the polymer succeeding.
    **Response:** I will never claim that. $C_L$ is a geometric spatial closeness coefficient. It computes top-ranked computational candidates, not formulation success probabilities.
33. **Challenge:** Soluplus is definitively the winning polymer because its $C_L$ is highest.
    **Response:** Soluplus is the top-ranked computational candidate. The term "best polymer" is forbidden because this is an in silico model, not an experimental conclusion.
34. **Challenge:** The quadratic form is computationally too expensive for 10,000 points.
    **Response:** A purely vectorized implementation using NumPy `@` operators performs $O(N \times K^2)$ operations, completing 10,000 queries in milliseconds, well within performance constraints.
35. **Challenge:** If $q_+$ is negative, your math is broken.
    **Response:** Analytically, $q_+$ cannot be negative. If it is computed as negative, it is strictly due to IEEE 754 floating-point truncation, which is why we enforce the `1e-12` tolerance trap.
36. **Challenge:** Your method is just classical Hwang-Yoon TOPSIS.
    **Response:** Classical TOPSIS uses cohort extrema and unprojected Minkowski metrics. Our v2 methodology ('2.0.0-SP-PRP-TOPSIS') uses a dynamic $K$ projected metric tensor and absolute physical anchors.
37. **Challenge:** A high $D_-$ means the distance is far, which implies a bad score.
    **Response:** $D_-$ is distance to the *anti-ideal* (the worst possible outcome). Being far from the worst outcome is mathematically advantageous, driving $C_L$ higher.
38. **Challenge:** You arbitrarily chose $RI_4 = 0.89$.
    **Response:** $RI_4 = 0.89$ is the universally accepted Random Index for a 4x4 AHP matrix established by Saaty, hardcoded into `ahp.py`, not an arbitrary selection.
39. **Challenge:** Tie-breaking alphabetically is unscientific.
    **Response:** Ties at `1e-12` precision are computationally degenerate points. Alphabetical sorting ensures reproducible pipeline provenance without injecting fake mathematical variance.
40. **Challenge:** If the weights $W$ change, your $M_K$ is invalid.
    **Response:** $M_K$ is dynamically constructed per evaluation run. If AHP expert weights change, $W$ updates, $M_K$ re-projects, and rankings recalculate instantly.
