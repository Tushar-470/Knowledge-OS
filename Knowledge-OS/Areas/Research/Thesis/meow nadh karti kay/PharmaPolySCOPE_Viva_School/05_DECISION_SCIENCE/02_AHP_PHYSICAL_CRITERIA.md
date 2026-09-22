# Module 05: Decision Science - 02_AHP_PHYSICAL_CRITERIA

## 1. What is it? / Why does it exist? / Problem solved
The Analytic Hierarchy Process (AHP) provides a rigorous mathematical method to derive criteria weights from pairwise comparisons. In PharmaPolySCOPE v2, we must weigh the 4 physical criteria ($s_{HSP}$, $s_{chi}$, $s_{desc}$, $s_{GT}$) based on their relative fundamental importance to solid dispersion stability. AHP replaces arbitrary weight assignment (e.g., guessing 40/30/10/20) with a consistency-checked eigenvalue problem. 

## 2. Beginner explanation (Level 1)
If you want to know if speed is more important than safety, you ask: "How much more?" AHP uses a 1-to-9 scale to compare criteria two at a time. Speed might be 2x more important than safety. Safety is 3x more important than cost. By doing all pairwise comparisons, we build a matrix. The math extracts the most consistent set of final weights and checks if your original answers contradicted themselves.

## 3. Technical explanation (Level 2)
The AHP constructs an $n \times n$ reciprocal matrix $A$ where $a_{ij}$ represents the relative dominance of criterion $i$ over $j$. The weight vector $w$ is the normalized principal right eigenvector associated with the largest eigenvalue $\lambda_{max}$ of $A$. We evaluate consistency using the Consistency Index $CI = (\lambda_{max} - n) / (n - 1)$ and the Consistency Ratio $CR = CI / RI_n$. PharmaPolySCOPE rigidly enforces a $CR < 0.08$ gate, using the standard $RI_4 = 0.89$ hardcoded in the module.

## 4. Mathematics
Matrix $A \in \mathbb{R}^{4 \times 4}$, $a_{ij} \approx w_i / w_j$.
Reciprocity: $a_{ji} = 1 / a_{ij}$. Validation enforces $|a_{ji} a_{ij} - 1.0| < 10^{-12}$.
Eigenvalue problem: $A w = \lambda_{max} w$.
For a perfectly consistent matrix, $\lambda_{max} = 4$.
$CI = \frac{\lambda_{max} - 4}{3}$.
$CR = \frac{CI}{RI_4}$, where $RI_4 = 0.89$.

## 5. Hand-calculable example
Let's use the authoritative 4x4 matrix from production:
Row 1: [1.0, 2.0, 3.0, 2.0]
Row 2: [0.5, 1.0, 5.0, 2.0]
Row 3: [1/3, 0.2, 1.0, 0.5]
Row 4: [0.5, 0.5, 2.0, 1.0]

Approximate eigenvector by normalizing columns and averaging rows:
Col sum: [2.33, 3.7, 11.0, 5.5]
Normalized matrix:
[0.43, 0.54, 0.27, 0.36] -> Avg: 0.40
[0.21, 0.27, 0.45, 0.36] -> Avg: 0.32
[0.14, 0.05, 0.09, 0.09] -> Avg: 0.09
[0.21, 0.14, 0.18, 0.18] -> Avg: 0.18
These approximate the exact weights: [0.4077, 0.3244, 0.0922, 0.1757].

## 6. Actual production example
Production matrix injected from `backend/services/engine_adapter.py` lines 99-104.
Matrix: `[[1.0, 2.0, 3.0, 2.0], [0.5, 1.0, 5.0, 2.0], [1/3, 0.2, 1.0, 0.5], [0.5, 0.5, 2.0, 1.0]]`
Eigenvalue solver output:
- `lambda_max` = 4.131937073898666
- `CI` = 0.04397902463288853
- `CR` = 0.04941463441897588
Because $CR < 0.08$, it passes the governance gate.
Final Weights: $w_{s\_HSP}=0.4077$, $w_{s\_chi}=0.3244$, $w_{s\_GT}=0.1757$, $w_{s\_desc}=0.0922$.

## 7. Exact implementation trace
- Function: `solve_ahp_preference()` in `ahp.py` (line 22).
- $RI_4 = 0.89$ hardcoded in `ahp.py` line 18 (Overrides `constants.py` 0.90).
- $CR\_THRESHOLD = 0.08$ in `ahp.py` line 19.
- Solver uses `np.linalg.eig` (non-symmetric solver).
- Reciprocity check: `ahp.py` lines 62-69.
- Negative CR clamped: `ahp.py` lines 88-89.
- Exception: raises `AHPConsistencyViolationError` if $CR \ge 0.08$.

## 8. Inputs / Processing / Outputs
**Inputs**: $4 \times 4$ numpy array of pairwise preferences.
**Processing**: Validates size (4x4), checks reciprocity, computes eigenvalues, extracts principal eigenvector, calculates CI and CR, checks against CR threshold.
**Outputs**: 1D numpy array of normalized weights.

## 9. Assumptions / Limitations / Failure modes
- **Assumptions**: The decision maker's preferences map linearly to the Saaty 1-9 scale.
- **Limitations**: Rank reversal can occur if new criteria are added, though the 4-criterion model is frozen.
- **Failure modes**: Non-reciprocal matrices will fail validation. Highly inconsistent matrices ($CR \ge 0.08$) trigger an irrecoverable `AHPConsistencyViolationError`.

## 10. Alternatives and why this method was used
We could have used direct weighting (e.g., slider bars) or entropy weighting. Direct weights lack consistency checks. Entropy weighting relies solely on data variance, ignoring the fundamental physics of polymer science where thermodynamic mixing ($s_{chi}$) objectively dictates stability more than molecular descriptors ($s_{desc}$). AHP bridges expert physical judgment with mathematical rigor.

## 11. Common misconceptions
- **Misconception**: We use a symmetric eigenvalue solver. **Correction**: AHP matrices are reciprocal, not symmetric. We MUST use `np.linalg.eig`, not `eigh`.
- **Misconception**: $RI_4 = 0.90$ like standard literature. **Correction**: In `ahp.py`, $RI_4$ is rigidly set to 0.89.

## 12. 40 Viva Q&A
### Basic (10)
1. **Q**: What is AHP? **A**: Analytic Hierarchy Process.
2. **Q**: What is it used for in PharmaPolySCOPE? **A**: To determine the weights of the 4 physical criteria.
3. **Q**: What is the size of the AHP matrix? **A**: 4x4.
4. **Q**: What solver is used? **A**: `np.linalg.eig`.
5. **Q**: What is the required CR threshold? **A**: $CR < 0.08$.
6. **Q**: What happens if CR is 0.1? **A**: Raises `AHPConsistencyViolationError`.
7. **Q**: Which criterion has the highest weight? **A**: $s_{HSP}$ (0.4077).
8. **Q**: Which criterion has the lowest weight? **A**: $s_{desc}$ (0.0922).
9. **Q**: What is the exact value of $RI_4$ used? **A**: 0.89 (ahp.py line 18).
10. **Q**: What is the reciprocity rule? **A**: $a_{ji} = 1/a_{ij}$.

### Intermediate (10)
11. **Q**: How is reciprocity validated in code? **A**: $|a_{ji} * a_{ij} - 1.0| < 10^{-12}$ (ahp.py lines 62-69).
12. **Q**: What if CR calculation yields a negative number due to float precision? **A**: Clamped to 0.0 (ahp.py lines 88-89).
13. **Q**: Where does the production matrix come from? **A**: `backend/services/engine_adapter.py` lines 99-104.
14. **Q**: What is $\lambda_{max}$ for the production matrix? **A**: 4.131937...
15. **Q**: What is the exact CI value? **A**: 0.043979...
16. **Q**: What is the final CR value? **A**: 0.04941...
17. **Q**: Why don't we use $RI_4 = 0.90$ from constants.py? **A**: `ahp.py` overrides it with a hardcoded 0.89 for stricter governance.
18. **Q**: What is the mathematical definition of CI? **A**: $CI = (\lambda_{max} - n)/(n-1)$.
19. **Q**: How are final weights derived from the eigenvector? **A**: By normalizing the vector so its elements sum to 1.
20. **Q**: Can the AHP evaluate 5 criteria in v2? **A**: No, methodology v2.0.0 is strictly a 4-criterion system.

### Difficult (10)
21. **Q**: Why must the solver use `np.linalg.eig` rather than `np.linalg.eigvalsh` or `scipy.linalg.eigh`?
    - **Direct Answer:** Because AHP pairwise comparison matrices are positive reciprocal ($a_{ji} = 1/a_{ij}$), NOT symmetric ($a_{ji} \neq a_{ij}$).
    - **Reasoning:** In an AHP matrix, $a_{12} = 2.0 \implies a_{21} = 0.5$. Symmetric solvers such as `eigh` or `eigvalsh` assume $A = A^T$ and will silently produce completely erroneous eigenvalues by reflecting only the upper or lower triangle. The general non-symmetric solver `np.linalg.eig` correctly evaluates the complex spectrum and extracts the real Perron–Frobenius eigenvalue.
    - **Implementation Trace:** Invoked in `src/asd_mcda/v2/ahp.py:72`: `eigvals, eigvecs = np.linalg.eig(A)`.
    - **Viva Defense Sentence:** *"AHP matrices are reciprocal rather than symmetric, meaning that applying a symmetric eigensolver like `eigh` would be a fatal linear algebra error."*
22. **Q**: How does AHP differ between v1.5 and v2? **A**: v1.5 applied AHP weights to PC1/PC2. v2 applies AHP to the 4 physical criteria.
23. **Q**: If $s_{HSP}$ and $s_{chi}$ both measure compatibility, why allocate so much weight to both? **A**: They represent distinct physical scales; HSP is a dispersive diagnostic, while chi is an interaction phase-boundary diagnostic.
24. **Q**: What happens to complex eigenvalues returned by `eig`? **A**: The principal eigenvalue is guaranteed to be real and positive by the Perron-Frobenius theorem for positive matrices.
25. **Q**: What does a $CR=0$ mean? **A**: Perfect consistency; all $a_{ik} = a_{ij} \times a_{jk}$.
26. **Q**: Why is the CR threshold 0.08 instead of standard 0.10? **A**: Stricter internal governance for pharmaceutical applications.
27. **Q**: How is the principal eigenvector identified programmatically? **A**: By finding the index of the maximum value in the real parts of the eigenvalues array.
28. **Q**: What physical justification exists for $s_{desc}$ having weight 0.0922? **A**: Molecular descriptors provide minor structural context compared to direct thermodynamic or kinetic predictors.
29. **Q**: In the production matrix, what is the preference of $s_{HSP}$ over $s_{desc}$? **A**: 3.0.
30. **Q**: What if $a_{ij} = 0$? **A**: The Saaty scale is strictly 1-9; 0 implies infinite dominance, causing division by zero on reciprocity.

### Hostile / Challenging (10)
31. **Q**: AHP is an outdated 1970s subjective method. Why use it? **A**: While old, it uniquely resolves the commensurability problem of conflicting physical units by anchoring weights in governed comparative ratios rather than arbitrary tuning.
32. **Q**: Your CR threshold of 0.08 is arbitrary. **A**: It is an empirically derived constraint designed to reject matrices with excessive cognitive dissonance in physical expert elicitation.
33. **Q**: You hardcoded RI=0.89 in ahp.py, bypassing a constants file. Sloppy? **A**: It is intentional scope containment; the core solver must remain hermetically sealed from global constant mutations.
34. **Q**: The weights are just made up to give Indomethacin good results. **A**: The preference matrix reflects fundamental polymer physics literature, independent of the Indomethacin output.
35. **Q**: Using `np.linalg.eig` is slow. **A**: For a 4x4 matrix, performance is irrelevant compared to mathematical correctness.
36. **Q**: Why not just use random weights and Monte Carlo them? **A**: We do use Monte Carlo for stability ($N=10,000$), but a foundational deterministic AHP baseline is required for the metric tensor geometry.
37. **Q**: The difference between 0.89 and 0.90 for RI is statistically meaningless. **A**: In an edge case where CI=0.0715, $0.0715/0.89 = 0.0803$ (Blocked), but $0.0715/0.90 = 0.0794$ (Accepted). It defines the strict boundary of the governance gate.
38. **Q**: Your method claims to be predictive but starts with expert guesses. **A**: It is a diagnostic heuristic weighted by physical domain expertise; we never claim it is an absolute first-principles physical law.
39. **Q**: What if the eigenvector has negative elements? **A**: By the Perron-Frobenius theorem for strictly positive matrices, the principal eigenvector strictly has positive components.
40. **Q**: You call it physical criteria AHP, but HSP and chi are essentially the same thing. **A**: Dispersive approximation (HSP) and lattice-fluid interaction (chi) are distinct thermodynamic models; collapsing them loses fidelity.

## 13. One-minute, five-minute, and board explanations
**1-Minute**: We use the AHP to figure out how much weight to give each of our 4 polymer criteria. By comparing them two at a time, we build a 4x4 matrix, calculate its eigenvector to get the weights, and check a Consistency Ratio (CR) to make sure our logic holds up.
**5-Minute**: We can't treat solubility and stability equally. We build a preference matrix reflecting physical dominance (e.g., thermodynamics over simple descriptors). We extract the principal eigenvector of this matrix to get normalized weights: $s_{HSP}$ (40.8%), $s_{chi}$ (32.4%), $s_{GT}$ (17.6%), $s_{desc}$ (9.2%). We strictly enforce a consistency check (CR < 0.08, using RI=0.89) to reject illogical comparisons.
**Board**: Write the 4x4 matrix. Show $A w = \lambda_{max} w$. Show $\lambda_{max} = 4.13$. Calculate $CI = (4.13 - 4)/3 = 0.043$. Calculate $CR = 0.043 / 0.89 = 0.049$. Since $0.049 < 0.08$, matrix is ACCEPTED. Draw vector $w$.

## 14. Things never to claim
- NEVER claim that AHP generates "optimal weights" (they are consensus physical diagnostic weights).
- NEVER claim AHP uses a symmetric solver (it is reciprocal).
- NEVER use RI=0.90 in calculations (must use 0.89).

## 15. Cross-references to other modules
- See Module 06 for how these AHP weights feed the metric tensor $W = \text{diag}(w_{phys})$.
- See Module 01 for the overall architecture.
