# 05_DYNAMIC_K_SELECTION
---
## Cross-Reference
**Prerequisite knowledge:** PCA concepts (04_PCA_FROM_FIRST_PRINCIPLES.md)
**Used later by:** 06_EIGENGAP_STABILITY_GOVERNANCE.md
**Related source code:** `src/asd_mcda/v2/pca.py`
**Related tests:** `tests/v2/`
**Related validation artifact:** `scientific_validation_results.json`
**Related viva attack:** Part 9

---
## Part 1: Beginner Understanding [BEGINNER]
When you pack for a trip, you want to bring the smallest suitcase possible that still holds 95% of what you need. 
In PCA, $K$ is the size of our suitcase (number of dimensions). The items we are packing are "variance" (information). 
Instead of hardcoding a medium suitcase for every trip (like v1.5 did), v2 looks at the pile of information and dynamically calculates the smallest suitcase that fits exactly $\ge 95\%$ of the information. For some drugs, that's a small suitcase ($K=2$). For Indomethacin, we need a larger one ($K=3$).

---
## Part 2: Technical Development [TECHNICAL]
### The K Selection Rule
$K = \min\left\{k : \frac{\sum_{i=1}^k \lambda_i}{p} \ge 0.95\right\}$
The 95% threshold ensures we retain the vast majority of the geometric structure. 
We use the *minimum* $K$ due to the parsimony principle: smaller subspaces mean simpler computation and fewer dimensions to cause geometric instability.

### Why K Varies Between Drugs
The raw score matrix $S$ is computed from fundamental physical interactions between the drug and the polymers. Different drugs elicit different compatibility scores.
Different $S$ matrices $\rightarrow$ different correlation structures ($R$) $\rightarrow$ different eigenvalues $\rightarrow$ different $K$.

### Impact on Downstream Ranking
Choosing $K$ defines the dimensionality of the metric tensor $M_K$. 
$K=2 \rightarrow M_K$ is $2\times2$.
$K=3 \rightarrow M_K$ is $3\times3$.
A higher dimension includes a completely new geometric axis of variance when calculating distances from the ideal profile. This structurally changes the closeness coefficients ($C_L$) and can shift the final polymer rankings.

---
## Part 3: Worked Example [EXAMPLE]

### [HYPOTHETICAL — NOT PRODUCTION VALUES]
**Scenario A: Strong Correlation (K=1)**
Eigenvalues: $[3.8, 0.1, 0.06, 0.04]$, total = 4.0
Cumvar: $[0.95, 0.975, 0.99, 1.0]$
At $k=1$, $0.95 \ge 0.95 \rightarrow K=1$.
$\Delta_1 = 3.8 - 0.1 = 3.7 \rightarrow$ STABLE.

**Scenario B: Two Information Groups (K=2)**
Eigenvalues: $[2.0, 2.0, 0.01, 0.0]$, total $\approx 4.0$
Cumvar: $[0.50, 1.00, ...]$
At $k=2$, $1.00 \ge 0.95 \rightarrow K=2$.
$\Delta_2 = 2.0 - 0.01 = 1.99 \rightarrow$ STABLE.

**Scenario C: No Correlation (K=4)**
Eigenvalues: $[1.0, 1.0, 1.0, 1.0]$, total = 4.0
Cumvar: $[0.25, 0.50, 0.75, 1.0]$
Requires all 4 to reach 95%. $K=4=p$.
$\Delta_4 = +\infty \rightarrow$ STABLE.

### [PRODUCTION VALUES]
**Indomethacin K=3:**
Eigenvalues: `[2.0909, 1.1679, 0.7398, 0.0015]`
Cumvar: `[0.5227, 0.8147, 0.9996, 1.0]`
$K=3$ selected because $0.9996 \ge 0.95$.

**Other drugs:**
- Ibuprofen: $K=2$
- Itraconazole: $K=2$

**Monte Carlo K Distribution for Indomethacin (8,600 valid replicates):**
- $K=1: 0.00\%$
- $K=2: 2.12\%$
- $K=3: 90.78\%$
- $K=4: 7.10\%$

---
## Part 4: v1.5 vs v2 Comparison [VERSIONING]
The core architectural failure of v1.5 was `K = 2` hardcoded into the pipeline.
For Indomethacin, this captured only 81.47% of the variance, discarding nearly a fifth of the information. v2's dynamic selection fixes this structural defect.

---
## Part 5: PharmaPolySCOPE Implementation [IMPLEMENTATION]
### Implementation Trace
- **Concept:** Iterative selection of $K$.
- **Input:** `cum_var_curve` (array of length $p$).
- **Function:** `decompose_spectral(Z, variance_threshold=0.95)`
- **File:** `src/asd_mcda/v2/pca.py`
- **Computation:**
  ```python
  K = p
  for k in range(1, p+1):
      if cum_var_curve[k-1] >= variance_threshold - 1e-12:
          K = k; break
  ```
- **Output:** Int $K$
- **Next stage:** Returns $K$ to the main pipeline.

---
## Part 6: Assumptions and Limitations [LIMITATIONS]
- **Assumption:** 95% is the universal optimal threshold for preserving signal while discarding noise across all possible APIs.
- **Limitation:** A hard threshold can cause sudden phase transitions. If cumvar is $0.9499$, $K$ increments, adding a whole new dimension compared to $0.9501$.

---
## Part 7: Viva Questions [VIVA]
### A. 10 Basic Q&A
1. **What is dynamic K selection?** The algorithm choosing how many dimensions to keep based on the data.
2. **What is the threshold?** 95%.
3. **What was v1.5's K?** Hardcoded to 2.
4. **What is Indomethacin's K in v2?** 3.
5. **Why not just keep all 4 dimensions?** To remove noise, simplify calculations, and decorrelate the space.
6. **Can K be 1?** Yes, if the first eigenvalue is $\ge 3.8$ (95% of 4).
7. **What happens if the threshold is never met until the end?** $K=4$.
8. **What does a different K mean physically?** It means the drug interacts with the polymers in a more (or less) geometrically complex way.
9. **Does Ibuprofen use K=3?** No, it uses $K=2$.
10. **What is the tie-breaker for floating point errors?** $- 1e-12$ tolerance on the check.

### B. 10 Intermediate Q&A
11. **Why is the minimum K selected?** Parsimony principle: simplest model that explains 95% of the data.
12. **How does K=3 affect the ranking of Indomethacin compared to v1.5?** It introduces the 3rd principal component into distance measurements, resolving ties or altering proximities that were obscured in 2D.
13. **What is the dominant K for Indomethacin under Monte Carlo noise?** K=3 (90.78% of the time).
14. **Why is K=1 0% in MC for Indomethacin?** The inherent structural and thermodynamic differences in the criteria are too distinct to collapse into a single axis.
15. **What would a threshold of 99% do to Ibuprofen?** It would likely force $K=3$ or $K=4$.
16. **Is it possible for K=2 to capture 99% variance?** Yes, if $\lambda_3$ and $\lambda_4$ are virtually zero.
17. **What is cumvar at K=3 for Indomethacin?** 99.96%.
18. **Why does Itraconazole have K=2?** Its thermodynamic and structural criteria correlate strongly enough that 2 PCs capture $\ge 95\%$.
19. **How is the tolerance `1e-12` mathematically justified?** It covers IEEE 754 standard double-precision float accumulation errors over small sums.
20. **Can K change if a different polymer is added to the cohort?** Yes, because the cohort mean and variance change.

### C. 10 Difficult Q&A
21. **Discuss the discontinuity of K selection.** It's a step function. An eigenvalue shifting by 0.0001 could push cumvar from 0.9499 to 0.9500, causing a discontinuous jump from K=3 to K=2, fundamentally changing the metric space. This is why eigengap stability is checked next.
22. **What if an API naturally has K=4? Is PCA useless?** Not useless. PCA still orthogonalizes the space, meaning the downstream Mahalanobis-like metric is perfectly aligned with the variance axes, preventing double-counting of correlated variables.
23. **Why use variance as a proxy for "information"?** In MCDA, discrimination between candidates is the goal. Variance exactly measures how much the candidates differ. Low variance directions are indistinguishable noise.
24. **How do you defend the 7.10% MC replicates that hit K=4?** The MC injects 10% structural uncertainty. Sometimes that noise breaks existing correlations, inflating the minor eigenvalues until 4 PCs are needed. This is physical reality under uncertainty.
25. **If K=1, what does that imply about the weights $W$?** It implies all criteria measure exactly the same underlying physical property, and the weights simply scale that one property.
26. **Explain the memory complexity of dynamic K.** Negligible. For $p=4$, it's at most storing a $4\times4$ matrix.
27. **Could we use the Kaiser rule ($\lambda \ge 1$) instead of 95%?** The Kaiser rule is notorious for under-retaining or over-retaining. A percentage threshold maps directly to "proportion of information retained", which is much easier to defend physically.
28. **What does the 90.78% stability mean for validation?** It proves that the $K=3$ finding for Indomethacin is not an artifact of a single lucky point estimate, but a robust topological property of the space.
29. **What happens to the $V_K$ matrix if K=p?** $V_K = V$. The projection is purely a rotation.
30. **If cumvar[1] = 0.95 exactly, does the code pick K=2?** Yes, the `>=` condition is met.

### D. 10 Hostile Q&A
31. **Is your K selection robust to outliers, or did one weird polymer force K=3?** It is influenced by the full cohort. If one polymer is an extreme outlier on an uncorrelated axis, it will demand a PC for itself. In our small $N=5$ cohort, every polymer is a critical candidate; none are "outliers" to be ignored.
32. **A 95% threshold is arbitrary magic. Reviewers will reject this.** 95% is the most universally accepted heuristic in PCA literature for physical sciences (unlike social sciences which use 70-80%). 
33. **Why do we need a dynamic K when a fixed K=4 would retain 100% of information and avoid the complexity?** Retaining $K=4$ retains numerical noise ($\lambda_4 = 0.0015$). Small eigenvalues are highly unstable to inversion and noise. Truncating them is a stabilizing regularization technique.
34. **Does K=3 mean the AHP weights on the 4th criterion are discarded?** No! The AHP weights are projected into the K=3 space via $M_K = V_K^T W V_K$. The 4th criterion still influences the orientation of the PCs.
35. **Your MC simulation shows K jumps between 2, 3, and 4. Isn't your algorithm structurally unstable?** The fact that it dynamically adjusts to the noise level *is* the stability. Forcing K=2 when the noise demands K=3 would be mathematically degenerate.
36. **Are rank reversals possible just because of a threshold crossing?** Yes, and that is mathematically correct. If the physical reality crosses a topological boundary, the decision geometry must reflect it.
37. **Can you prove that the discarded 5% doesn't contain the most important chemical signal?** By definition, if it has $<5\%$ variance, the polymers barely differ on that axis. A criteria where all polymers score the same cannot dictate a ranking.
38. **Did v1.5 ever work?** Yes, coincidentally, for APIs where K=2 naturally captured $>95\%$ variance (like Ibuprofen and Itraconazole). It failed silently on Indomethacin.
39. **Could your tolerance of $1e-12$ cause K to drop?** Only if a float calculation artificially depressed 0.95 to 0.949999999999. The tolerance strictly *prevents* incorrect drops.
40. **How do you explain K=3 to a pharmacist?** "The criteria we measured are complex enough that they can't be simplified down to 2 summary scores without losing critical differences between the polymers. We need 3."

### E. Common Mistakes
- Thinking a higher K is always "better".
- Believing K=3 discards one of the original 4 criteria (it discards an *axis of variance*, not a raw criterion).
### F. Things You Must Never Claim
- Never claim dynamic K guarantees the same K for all drugs.
- Never claim 95% is a mathematically proven absolute law (it is a project heuristic).
