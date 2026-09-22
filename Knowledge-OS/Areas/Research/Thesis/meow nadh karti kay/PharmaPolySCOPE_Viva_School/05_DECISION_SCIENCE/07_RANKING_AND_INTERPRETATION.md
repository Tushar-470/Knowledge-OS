# 07_RANKING_AND_INTERPRETATION

## What is it? / Why does it exist? / Problem solved
The final output of the SP-PRP-TOPSIS engine is an integer ranking of candidates based on the closeness coefficient ($C_L$). However, translating mathematical arrays into valid scientific conclusions requires strict interpretive boundaries. This document explains what rankings mean, the truncation discrepancy audit that validates them, and the forbidden language rules. It solves the problem of "model overconfidence" where users misinterpret computational spatial geometry as in vivo clinical success.

## Layers
- **Layer A (Literature):** Ranks denote preference order. Dimensionality reduction induces reconstruction loss.
- **Layer B (Implementation):** Rankings are 1-based integers (1 = top-ranked). `audit_truncation_discrepancy()` in `diagnostics.py` (line 40) computes relative discrepancy $E_i = |\Delta D^2| / d_{full}^2$. Tie-breaking uses `epsilon_rank=1e-12`.
- **Layer C (Rationale):** We must quantify the exact geometric error caused by dynamic $K$ projection. If the discrepancy is too large, the ranking is geographically compromised. Furthermore, strict linguistic rules prevent the model from being marketed as a definitive formulation oracle.

## Beginner explanation (Level 1)
Imagine a computer ranking cars based on fuel efficiency and safety scores. If the computer says "Car A is Rank 1", it doesn't mean Car A will never crash or never run out of gas. It just means *according to the specific math rules we gave it*, Car A scored the highest. In PharmaPolySCOPE, a rank of 1 means that polymer is the top-ranked computational candidate. It does not mean it is the "ideal carrier" in a lab. Additionally, because we simplified the math (using PCA), we double-check our work with an "audit" to make sure the simplification didn't ruin the distances.

## Technical explanation (Level 2)
Rankings are 1-based index derivatives of the $C_L$ array sorted descending. Because $C_L$ is computed in a $K$-dimensional subspace, some original $p$-dimensional distance information is lost.
`audit_truncation_discrepancy()` evaluates this by computing the full-space distance squared ($d_{full}^2$) and the subspace distance squared ($d_K^2$). The signed discrepancy is $\Delta D^2 = d_{full}^2 - d_K^2$. 
The relative geometric distortion is $E_i = \frac{|\Delta D^2|}{d_{full}^2}$. 
This is fundamentally different from conventional PCA reconstruction loss (which measures coordinate variance, not reference-point distance).
If $E_i$ exceeds safety thresholds, the rankings are flagged as unreliable.
For the Indomethacin cohort, the top-ranked computational candidate is Soluplus with $C_L=0.6864$.

## Mathematics
1. Truncation Discrepancy: $\Delta D^2 = d_{full}^2 - d_K^2$
2. Relative Discrepancy: $E_i = \frac{|\Delta D^2|}{d_{full}^2}$
3. Ranking Logic: $\text{Rank}_i = 1 + \sum_{j \neq i} \mathbf{1}(C_{L,j} > C_{L,i} + 10^{-12})$
4. Top-1 Frequency: In Monte Carlo simulation ($N_{generated} = 10,000$), we count the frequency that a candidate achieves Rank 1 across all draws. 

## Hand-calculable example
Suppose Candidate 1 has $d_{full}^2 = 10.0$.
In the $K=1$ subspace, $d_K^2 = 8.5$.
Signed discrepancy: $\Delta D^2 = 10.0 - 8.5 = 1.5$.
Relative discrepancy: $E_1 = 1.5 / 10.0 = 0.15$ (15% error).
Suppose Candidate 1 $C_L = 0.65$ and Candidate 2 $C_L = 0.60$.
Rank 1 goes to Candidate 1. We must state: "Candidate 1 is the top-ranked computational candidate under this projection, bearing a 15% distance discrepancy."

## Actual production example
Indomethacin v2 methodology ('2.0.0-SP-PRP-TOPSIS'):
1. Soluplus (C_L=0.6864) — top-ranked computational candidate
2. HPMC E5 (C_L=0.6731)
3. PVP-VA64 (C_L=0.6062)
4. PVP K30 (C_L=0.5876)
5. Eudragit EPO (C_L=0.5456)
All 10,000 Monte Carlo variants are evaluated (`ddof=0`). The computational top-1 frequency dictates the overall probabilistic confidence under the structural uncertainty model.

## Exact implementation trace
- Truncation audit: `audit_truncation_discrepancy()` in `diagnostics.py` (line 40).
- Tie-breaking logic: `metrics.py` lines 267-290.
- AHP consistency check: `ahp.py` validating $RI_4 = 0.89$.
- Methodology string bound in provenance: '2.0.0-SP-PRP-TOPSIS'.

## Inputs / Processing / Outputs
- **Inputs:** $C_L$ arrays, raw full distances, projected distances.
- **Processing:** Subtraction for discrepancy, sorting logic for ranking, string formatting for output.
- **Outputs:** Integer ranks (1 to $N$), $E_i$ audit metrics, final computational frequency counts.

## Assumptions / Limitations / Failure modes
- **Assumption:** The AHP weights $W$ accurately reflect domain priorities. If they are wrong, the ranking is scientifically meaningless even if mathematically flawless.
- **Limitation:** The ranking only considers the 4 criteria ($s_{HSP}$, $s_{\chi}$, $s_{GT}$, etc.). Unmodeled phenomena (like moisture uptake) are invisible to the ranking.
- **Failure modes:** If $\Delta D^2$ is massively large, it implies $K$ was too small, rendering the $C_L$ values geometrically invalid.

## Alternatives and why this method was used
We could have used full $p$-dimensional space, avoiding truncation discrepancy entirely. However, because physical diagnostics are correlated, full space would double-count overlapping traits (e.g., scoring $s_{HSP}$ and $s_{\chi}$ as independent when they share solubility physics). The projection penalty $E_i$ is a necessary trade-off to ensure orthogonal evaluation.

## Common misconceptions
- **Misconception:** "Soluplus will definitely work in the lab."
  **Reality:** Rankings do NOT predict formulation success. They are computational mathematical outcomes only.
- **Misconception:** "Truncation discrepancy is the same as PCA variance loss."
  **Reality:** PCA variance loss measures the entire cohort's scatter. Truncation discrepancy strictly measures the error in the distance to the ideal anchor point.

## One-minute, five-minute, and board explanations
- **One-minute:** The rankings tell us which polymer scores highest mathematically based on our inputs. We check a "discrepancy score" to make sure we didn't break the math while simplifying it, but we never claim this proves the polymer will actually work in a lab.
- **Five-minute:** After SP-PRP-TOPSIS generates $C_L$ values, we rank the polymers. But because we projected the data from 4D to a smaller $K$ dimension, the distance changed. The `audit_truncation_discrepancy` measures this exact error. If Soluplus ranks #1, we call it the "top-ranked computational candidate". It is critical to never say "ideal carrier" because these rankings are heavily dependent on cohort composition, the AHP weights, and the linear projection assumption.
- **Board:** Write $d_{full}^2 \neq d_K^2$. Draw a triangle showing how dropping a dimension shortens the hypotenuse. Label this difference as $\Delta D^2$. 

## Things never to claim
- NEVER say "ideal carrier" or "optimal polymer".
- NEVER say "predicts formulation success".
- NEVER call the method "classical Hwang-Yoon TOPSIS".
- MUST say "top-ranked computational candidate" or "computational top-1 frequency".

## Cross-references to other modules
- Module 04 for uncertainty models generating the top-1 frequency.
- Module 06 for the exact $C_L$ math.
- Module 03 for PCA projection.

## 40 Viva Q&A

### Basic (1-10)
1. **What does a rank of 1 represent, and what does Soluplus's $C_L = 0.68643508$ physically mean?**
   - **Direct Answer:** A rank of 1 identifies the top-ranked computational candidate under the specified 4-criterion model and AHP preference matrix; for Soluplus, $C_L = 0.6864$ means it covers 68.64% of the relative distance span away from the anti-ideal anchor.
   - **Reasoning:** $C_L = \frac{D_-}{D_+ + D_-} = \frac{9.156}{4.183 + 9.156} = 0.6864$. It is a deterministic, dimensionless geometric metric. It is NOT a percentage probability of formulation success, nor does it guarantee physical stability. It simply indicates that under the 4-criterion model and expert AHP weights, Soluplus achieves the most favorable balance of thermodynamic miscibility ($s_{HSP}=0.7972, s_{\chi}=0.8261$) and structural compatibility ($s_{desc}=0.3260$).
   - **Implementation Trace:** Produced by `VariableKEngine.evaluate()` (`src/asd_mcda/v2/engine.py:58`) and audited via `audit_truncation_discrepancy()` (`diagnostics.py:40`).
   - **Viva Defense Sentence:** *"$C_L = 0.6864$ is a comparative geometric index of multi-attribute physical balance, not a statistical probability of clinical or manufacturing success."*
2. **What determines the rank?** The $C_L$ value sorted in descending order.
3. **What is Soluplus's rank for Indomethacin?** Rank 1.
4. **What is $s_{HSP}$?** The compatibility diagnostic.
5. **What does the truncation discrepancy audit measure?** The distance error introduced by PCA dimensional reduction.
6. **Where is `audit_truncation_discrepancy()` found?** `diagnostics.py` line 40.
7. **Is $C_L$ a probability?** No, it is a geometric ratio.
8. **What does computational top-1 frequency mean?** The frequency a candidate is ranked #1 across 10,000 Monte Carlo simulation runs.
9. **What value is $N_{generated}$?** 10,000.
10. **What is the v2 methodology called?** '2.0.0-SP-PRP-TOPSIS'.

### Intermediate (11-20)
11. **Why do we need a truncation discrepancy audit?** Because projecting into $K$ dimensions inherently loses geometric distance data, which could alter rankings.
12. **How is the relative discrepancy $E_i$ calculated?** $E_i = |\Delta D^2| / d_{full}^2$.
13. **What is $s_{\chi}$?** The interaction compatibility / phase-boundary diagnostic.
14. **What is $s_{GT}$?** The model-predicted glass-transition margin.
15. **How are exact ties in $C_L$ broken?** Alphabetically by `polymer_id`.
16. **What is `epsilon_rank`?** `1e-12`, the numerical tolerance for tie-breaking.
17. **Why is it wrong to say Soluplus is the "ideal carrier"?** Because "best" implies experimental truth, whereas this is strictly an in silico computational ranking.
18. **Can rankings change if AHP weights change?** Yes, altering $W$ alters the metric tensor $M_K$, changing distances.
19. **What random index justifies the 4x4 AHP matrix?** $RI_4 = 0.89$.
20. **Is `ddof=0` used here?** Yes, all cohort standardizations leading to these ranks use population standard deviation `ddof=0`.

### Difficult (21-30)
21. **How does truncation discrepancy differ from PCA reconstruction loss?** PCA loss measures the global variance captured by $V_K$. Truncation discrepancy specifically isolates the metric distance error between a candidate $T_i$ and the anchor $t_+$.
22. **Why does $d_K^2$ usually underestimate $d_{full}^2$?** By Pythagoras in $p$-dimensions, removing orthogonal axes strictly removes positive squared distance components, shrinking the vector.
23. **What happens if $E_i$ is extremely high?** The `diagnostics.py` module flags the candidate, indicating that the $K$-dimensional subspace failed to capture its spatial location accurately.
24. **How does the dynamic $K$ in v2 differ from v1.5?** v1.5 used a hardcoded $K=2$. v2 calculates dynamic $K$ to minimize the truncation discrepancy $E_i$.
25. **Explain the Monte Carlo top-1 frequency logic.** We execute the entire SP-PRP-TOPSIS pipeline 10,000 times under parametric uncertainty. We count how many times each polymer achieves Rank 1, yielding the computational top-1 frequency.
26. **Why don't rankings prove physical stability?** Because they only evaluate 4 criteria. Kinetics, moisture, and unmodeled phenomena can cause a top-ranked candidate to fail in vivo.
27. **What is the significance of the v1.5 freeze at commit 31eee4d versus v2 at 1139397?** v1.5 used Euclidean PCA logic. v2 strictly implements $M_K = V_K^T W V_K$ and absolute references, making the v1.5 math obsolete.
28. **Does a $C_L$ of 0.68 vs 0.67 represent a statistically significant difference?** No. The $C_L$ is a deterministic geometric coordinate. Significance is only evaluable via the Monte Carlo top-1 frequency spread.
29. **Why use absolute [1,1,1,1] anchors instead of cohort max?** To prevent rank reversal. Changing the cohort changes empirical maximums, which shifts distances and scrambles rankings without any physical justification.
30. **What exception triggers if all candidates have zero variance?** `DegenerateReferenceCoincidenceError`.

### Hostile/Challenging (31-40)
31. **Challenge:** You're just hiding behind words. "Top-ranked computational candidate" is just marketing speak for the ideal carrier.
    **Response:** No. "Top-ranked" rigorously defines the boundary of the claim: it is the mathematical output of a specific matrix projection model. "Optimal carrier" is an experimental claim we do not have the in vivo data to make.
32. **Challenge:** The rankings are useless because they don't predict formulation success.
    **Response:** They are highly useful for formulation *screening* and prioritizing resources. Not predicting absolute clinical success does not invalidate their utility as a physical-thermodynamic diagnostic tool.
33. **Challenge:** Classical Hwang-Yoon TOPSIS is better because it doesn't need this complex discrepancy audit.
    **Response:** Classical TOPSIS suffers from fatal rank reversal and ignores criteria correlation. Our audit is a feature guaranteeing transparency regarding projection error, not a flaw.
34. **Challenge:** A high discrepancy $E_i$ invalidates your entire methodology.
    **Response:** If discrepancy is high, dynamic $K$ automatically adjusts to include more components. The audit *protects* the methodology by bounding the error.
35. **Challenge:** You are manipulating the rankings by changing the AHP weights until Soluplus wins.
    **Response:** AHP weights are derived strictly from physical principles and domain-expert elicitation prior to execution, validated by $RI_4 = 0.89$. They are immutable during the SP-PRP-TOPSIS pipeline.
36. **Challenge:** $C_L$ values of 0.68 and 0.67 are basically the same. Tie-breaking alphabetically is arbitrary and fake.
    **Response:** Tie-breaking alphabetically is strictly restricted to collisions at the `1e-12` precision limit. A difference of 0.01 is massive in this highly constrained subspace and resolves geometrically long before alphabetical logic triggers.
37. **Challenge:** The model is broken because a new polymer can change the rankings of the existing ones.
    **Response:** That is precisely the rank reversal we eliminated. Because we use absolute physical anchors [1,1,1,1], a new polymer only causes microscopic coordinate shifts due to $\mu, \sigma$ standardisation, not gross topological rank reversal.
38. **Challenge:** This top-1 frequency is just a fancy probability of success.
    **Response:** It is strictly the "computational top-1 frequency under the specified uncertainty model." It quantifies model variance, not real-world experimental probability.
39. **Challenge:** Using 10,000 MC samples is overkill and slows down the system.
    **Response:** $N_{generated} = 10,000$ guarantees statistical convergence for the population standard deviation (`ddof=0`) and ensures the stability of the PCA $V_K$ eigenspace.
40. **Challenge:** You just copied the v1.5 PCA method and changed the name.
    **Response:** False. v1.5 ('v1.5.0-FOUR-CRITERION-FREEZE') used fixed K=2 and lacked a projected metric tensor. v2 ('2.0.0-SP-PRP-TOPSIS') introduces dynamic K, $M_K = V_K^T W V_K$, absolute anchors, and truncation audits.
