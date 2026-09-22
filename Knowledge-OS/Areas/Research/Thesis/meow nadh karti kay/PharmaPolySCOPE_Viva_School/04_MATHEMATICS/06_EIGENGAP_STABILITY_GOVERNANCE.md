# 06_EIGENGAP_STABILITY_GOVERNANCE
---
## Cross-Reference
**Prerequisite knowledge:** 04_PCA_FROM_FIRST_PRINCIPLES.md, 05_DYNAMIC_K_SELECTION.md
**Used later by:** Subspace distance calculations.
**Related source code:** `src/asd_mcda/v2/stability.py`
**Related tests:** `tests/v2/`
**Related validation artifact:** `scientific_validation_results.json`
**Related viva attack:** Part 9

---
## Part 1: Beginner Understanding [BEGINNER]
Imagine a cliff edge. If you are 10 meters away from the edge, you are stable. If you are 1 meter away, you are in a warning zone. If you are 1 centimeter away, you are blocked from moving forward because a tiny breeze could push you over.

In PCA, the "edge" is the boundary between the information we keep ($K$) and the information we throw away ($K+1$). The distance to this edge is called the **Eigengap**. If the last piece of information we kept ($\lambda_K$) is nearly identical in size to the first piece we threw away ($\lambda_{K+1}$), the boundary is ambiguous. A tiny perturbation (noise) could swap them, completely flipping the geometric axes of our model. We measure this gap and govern the pipeline strictly: STABLE, WARNING, or BLOCKED.

---
## Part 2: Technical Development [TECHNICAL]
### The Eigengap Definition
$\Delta_K = \lambda_K - \lambda_{K+1}$
(Difference between the LAST RETAINED eigenvalue and the FIRST DISCARDED eigenvalue).

### Geometric Meaning
When $\lambda_K \gg \lambda_{K+1}$, the $K$-th principal component contributes substantially more variance than the $(K+1)$-th. The retained subspace is "well-separated". Small perturbations in $S$ won't cause the eigenvectors to swap.
When $\lambda_K \approx \lambda_{K+1}$, the subspace is geometrically unstable (degenerate).

### Governance Thresholds
- $\Delta_K \ge 0.10 \rightarrow$ **STABLE**: Proceed.
- $0.03 \le \Delta_K < 0.10 \rightarrow$ **WARNING**: Proceed but record warning.
- $\Delta_K < 0.03 \rightarrow$ **BLOCKED**: Raise `DegenerateSubspaceBlockedError`.

### Special Case: $K=p$
If $K=4$, there are no discarded eigenvalues. $\Delta_K = +\infty$. Unconditionally **STABLE**.

---
## Part 3: Worked Example [EXAMPLE]

### [HYPOTHETICAL — NOT PRODUCTION VALUES]
**Example A (STABLE):**
Eigenvalues: $[2.5, 1.2, 0.25, 0.05]$
$K=3$ (cumvar = $3.95/4 = 0.9875 \ge 0.95$)
$\Delta_3 = 0.25 - 0.05 = 0.20 \ge 0.10 \rightarrow$ STABLE.

**Example B (WARNING):**
Eigenvalues: $[2.5, 1.2, 0.24, 0.17]$
$K=3$ (cumvar = $3.94/4 = 0.985 \ge 0.95$)
$\Delta_3 = 0.24 - 0.17 = 0.07 \rightarrow$ WARNING (in $[0.03, 0.10)$).

**Example C (BLOCKED):**
Eigenvalues: $[2.5, 1.2, 0.26, 0.24]$
$K=3$ (cumvar = $3.96/4 = 0.99 \ge 0.95$)
$\Delta_3 = 0.26 - 0.24 = 0.02 \rightarrow$ BLOCKED ($< 0.03$).

### [PRODUCTION VALUES]
**Indomethacin (K=3):**
$\Delta_3 = \lambda_3 - \lambda_4 = 0.7398 - 0.0015 = 0.7383 \gg 0.10 \rightarrow$ STABLE.

**Other drugs:**
- Ibuprofen: $\Delta_2 = 0.8169 \rightarrow$ STABLE.
- Itraconazole: $\Delta_2 = 0.6504 \rightarrow$ STABLE.

**MC Blocked Replicates (Indomethacin, 10,000 generated):**
- AHP_CR_BLOCKED = 1,396
- EIGENGAP_BLOCKED = 4 (0.04% of generated).
Confirms the 0.03 threshold blocks only genuinely degenerate cases.

---
## Part 4: v1.5 vs v2 Comparison [VERSIONING]
v1.5 had absolutely no eigengap stability tracking. If a drug's correlation structure was degenerate, v1.5 would blindly compute distances using an unstable plane, returning random rankings on repeated noisy runs. v2 guarantees architectural geometry is sound before proceeding.

---
## Part 5: PharmaPolySCOPE Implementation [IMPLEMENTATION]
### Implementation Trace
- **Concept:** Calculate eigengap and assert subspace stability.
- **Input:** `eigenvalues`, `retained_k` (from PCA).
- **Function:** `evaluate_subspace_stability(eigenvalues, retained_k)`
- **File:** `src/asd_mcda/v2/stability.py`
- **Computation:**
  ```python
  p = len(eigenvalues)
  if retained_k == p:
      delta_k = float('inf')
      status = 'STABLE'
  else:
      delta_k = eigenvalues[retained_k-1] - eigenvalues[retained_k] # 0-indexed
      if delta_k >= 0.10 - 1e-12: status = 'STABLE'
      elif delta_k >= 0.03 - 1e-12: status = 'WARNING'
      else: raise DegenerateSubspaceBlockedError
  ```
- **Output:** `StabilityRecord`
- **Next stage:** If not blocked, pipeline continues to distance calculations.

---
## Part 6: Assumptions and Limitations [LIMITATIONS]
- **Assumption:** $0.10$ and $0.03$ are absolute geometric boundaries. In reality, stability is a continuous gradient.
- **Limitation:** A gap of $0.029$ blocks the pipeline, while $0.031$ passes with a warning, despite being physically almost identical.

---
## Part 7: Viva Questions [VIVA]
### A. 10 Basic Q&A
1. **What is an eigengap?** The difference between the last retained eigenvalue and the first discarded one.
2. **What does a large eigengap mean?** The subspace is stable and well-separated.
3. **What does a small eigengap mean?** The boundary is ambiguous and unstable.
4. **What is the threshold for STABLE?** $0.10$.
5. **What is the threshold for BLOCKED?** Below $0.03$.
6. **What happens if $K=p$?** Gap is infinity, unconditionally stable.
7. **What is Indomethacin's eigengap?** $0.7383$.
8. **How many Indomethacin MC runs were blocked by eigengap?** 4 out of 10,000.
9. **Did v1.5 have this check?** No.
10. **Why do we need this check?** To prevent the algorithm from producing garbage rankings on degenerate data.

### B. 10 Intermediate Q&A
11. **Why do eigenvalues swapping cause problems?** Because the associated eigenvectors represent completely different orthogonal directions. A swap flips the geometry of the metric space.
12. **Is the index for eigenvalues 0-based in code?** Yes, `eigenvalues[retained_k-1] - eigenvalues[retained_k]`.
13. **Why subtract `1e-12` from the thresholds?** To prevent floating point arithmetic from blocking a gap that is exactly 0.03 in theory but $0.02999999999999$ in binary.
14. **How are the thresholds 0.10 and 0.03 derived?** They are empirically calibrated project governance choices that successfully block topological degeneracy while allowing 99.96% of valid replicates to pass.
15. **What does it mean if $\lambda_1 \approx \lambda_2$?** The first two principal components form a circle instead of an ellipse; any rotation is equally valid.
16. **If Ibuprofen's gap is 0.8169, is it more stable than Indomethacin?** Yes, its $K=2$ boundary is marginally more sharply defined.
17. **What is a `StabilityRecord`?** A read-only dataclass holding $K$, the gap, the status, and any warnings.
18. **Can you bypass a BLOCKED status?** No, it raises a fatal error terminating that pipeline branch.
19. **What happens to the 4 blocked MC runs?** They are discarded from the valid replicate count, representing physically intractable noisy states.
20. **Does a warning halt execution?** No, it just emits a log/warning message.

### C. 10 Difficult Q&A
21. **Relate the eigengap to the Davis-Kahan $\sin(\Theta)$ theorem.** The Davis-Kahan theorem states that the perturbation of eigenspaces is bounded inversely by the eigengap. A small gap means a small perturbation can cause a massive rotation of the subspace (large $\sin(\Theta)$).
22. **What if the gap between $\lambda_1$ and $\lambda_2$ is 0.01, but $K=2$? Is it blocked?** No. The eigengap governance *only* checks the boundary $\Delta_K = \lambda_K - \lambda_{K+1}$. Internal gaps inside the retained space do not matter because the total $K$-dimensional subspace remains intact.
23. **Is it theoretically possible for $\Delta_K$ to be negative?** No, the eigh function sorts them descending: $\lambda_K \ge \lambda_{K+1}$, so $\Delta_K \ge 0$.
24. **Why did AHP block 1,396 replicates but Eigengap only blocked 4?** AHP consistency is highly sensitive to the 10% log-normal noise injected into the subjective judgments. The physical score correlation structure is much more rigid, making geometric degeneracy extremely rare.
25. **Could standardizing with ddof=1 artificially shrink the eigengap?** Yes, it would slightly scale down all variance components, theoretically pushing a borderline gap into the warning zone incorrectly.
26. **What is the geometrical shape of a degenerate subspace?** A hypersphere (or isotropic plane), where variance is equal in all directions.
27. **Why not just increase K if the gap is small?** That would violate the parsimony principle and might just push the problem to the next boundary, eventually retaining all dimensions (K=p) and defeating the purpose of PCA.
28. **How does this relate to the spectral condition number?** It's similar in spirit. A small eigengap implies the spectral gap is closing, leading to ill-conditioned subspace projections.
29. **If K=3 and $\lambda_4=0$, what is the gap?** $\lambda_3 - 0 = \lambda_3$.
30. **Explain the impact of a BLOCKED replicate in a clinical context.** It means the input data (or its noisy state) lacks the mathematical clarity to safely recommend a formulation. Refusal to decide is safer than deciding randomly.

### D. 10 Hostile Q&A
31. **"Aren't the thresholds 0.10 and 0.03 completely arbitrary?"** They are project governance choices, empirically motivated. The near-zero block rate (0.04%) confirms they are properly calibrated—they act as emergency circuit breakers for mathematically degenerate cases, not routine filters.
32. **If you have a WARNING, doesn't that invalidate the results?** No. A warning means the subspace perturbation bound is looser, but the primary orientation is still mathematically correct. It alerts the user to lower confidence, without destroying the utility of the result.
33. **Why do you care about stability when you already hit 95% variance?** Because hitting 95% doesn't guarantee the *uniqueness* of the subspace. If the boundary is degenerate, the specific vectors in $V_K$ are arbitrary, making the metric tensor $M_K$ arbitrary.
34. **Does this mean your model fails 4 out of 10,000 times?** It means the universe of physical uncertainty contains 0.04% states that are logically undecidable. Identifying and blocking them is a feature of a robust system, not a failure.
35. **Could the 10% noise in MC artificially create these blocked states?** Yes, exactly. The MC explores the boundary of uncertainty. The fact that extreme noise only causes 0.04% degeneracy proves the core Indomethacin structure is massively stable.
36. **What if a reviewer demands you use 0.05 for BLOCKED?** We can adjust the constant. It is a configuration parameter. However, 0.03 prevents over-rejection while maintaining geometric safety bounds.
37. **Did you prove this stability theoretically or just empirically?** The necessity of the gap is proven theoretically via Davis-Kahan; the specific thresholds are verified empirically for this domain.
38. **If the internal gap $\lambda_1 - \lambda_2$ is 0, the vectors can spin. How do you defend ignoring internal gaps?** Because any rotation within the retained subspace leaves the projection matrix $V_K V_K^T$ invariant. The metric tensor distance calculation is invariant to rotations *within* the subspace.
39. **Could your system block a perfectly good drug just because of a math technicality?** If the criteria are perfectly degenerate, it is not a "perfectly good drug" for MCDA; it implies the formulation problem is physically under-determined.
40. **Are you just fixing v1.5's broken math with band-aids?** No, v1.5 ignored geometry entirely. v2 builds a rigorous topological foundation from first principles. Governance is standard engineering practice.

### E. Common Mistakes
- Thinking internal gaps (e.g., between $\lambda_1$ and $\lambda_2$) matter for subspace stability (they don't, only the boundary matters).
- Subtracting the wrong eigenvalues (must be index `K-1` minus index `K`).
### F. Things You Must Never Claim
- Never claim the 0.03 threshold is a fundamental physical constant.
- Never claim a STABLE status means the ranking is 100% correct (it only means the geometry is stable).
