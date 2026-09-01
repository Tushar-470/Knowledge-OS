# PharmaPolySCOPE Documentation: PART 4
## STAGES 6-8: Score Matrix Assembly, PCA, AHP, and TOPSIS

Welcome to Part 4. In the previous stages, we evaluated our polymers across several scientific criteria. Now, we face the ultimate challenge: **how do we combine these different scientific scores into one final ranking?**

If you have no background in linear algebra, statistics, or decision science, fear not. We will build every concept from absolute scratch, explain every symbol, and walk through every single mathematical step.

---

## SECTION 9: STAGE 6 — SCORE MATRIX ASSEMBLY & PCA

### 9.1 The Score Matrix $S$ (5×4)

Before we do any math, we must organize our data. We place all our computed scores into a **matrix**, which is simply a rectangular grid of numbers. Let's call our matrix **$S$**. 

Here is our complete score matrix $S$:

| Polymer | $s_{HSP}$ | $s_{\chi}$ | $s_{desc}$ | $s_{GT}$ |
|---------|-----------|------------|------------|----------|
| HPMC E5 | 0.7521 | 0.7402 | 0.2268 | 0.9731 |
| Soluplus | 0.7972 | 0.8261 | 0.2268 | 0.0000 |
| PVP K30 | 0.6942 | 0.6045 | 0.2268 | 0.9848 |
| PVP-VA 64 | 0.7073 | 0.6377 | 0.2268 | 0.2368 |
| Eudragit E PO | 0.6359 | 0.4393 | 0.2268 | 0.0000 |

*   **What each ROW means:** A row represents a single polymer candidate. Reading left to right tells you how that specific polymer performed across all tests.
*   **What each COLUMN means:** A column represents one scientific criterion (Hansen Solubility Parameters, Flory-Huggins $\chi$, Descriptors, Glass Transition). Reading top to bottom tells you how all the polymers compared on that specific test.
*   **What each CELL represents:** The number in any given cell answers the question, "How well does this specific polymer perform on this specific criterion?"

### 9.2 THE PROBLEM: Why can't we just add up the scores?

A logical first thought is to just add up the numbers in each row to get a total score. Let's see what happens if we do that for two polymers:

*   **HPMC E5:** 0.7521 + 0.7402 + 0.2268 + 0.9731 = **2.6922**
*   **PVP K30:** 0.6942 + 0.6045 + 0.2268 + 0.9848 = **2.5103**

This simple sum gives us a number, but it is deeply flawed and might give the wrong final answer. Here are three critical reasons why we cannot just add them up:

1.  **Double-Counting (Correlation):** The $s_{HSP}$ score and the $s_{\chi}$ score are heavily correlated. They are both derived from the same underlying chemical properties (the $\delta$ values). If we add them, we are effectively counting the polymer's "thermodynamic affinity" twice, giving it unfair weight!
2.  **Unequal Importance:** Simple addition assumes every column is exactly equally important. But what if maintaining the glass transition ($s_{GT}$) is twice as critical for your specific drug as the thermodynamic affinity? Simple addition cannot handle this.
3.  **Different Spreads:** Look at the $s_{desc}$ column. Every single value is exactly 0.2268. It has zero spread. Adding 0.2268 to every polymer doesn't help us distinguish between them—it just artificially inflates the total sum.

### 9.3 SOLUTION PART 1: Standardization (Z-score normalization)

Because the columns have different average values and different spreads, we need to put them all on a level playing field. We do this through **Standardization**, which converts our raw scores into **Z-scores**.

**The Formula:**  
$$Z_{ij} = \frac{S_{ij} - mean_j}{std_j}$$

Where:
*   $Z_{ij}$ is the new standardized value.
*   $S_{ij}$ is the old raw value.
*   $mean_j$ is the average of column $j$.
*   $std_j$ is the standard deviation of column $j$.

**What is the 'mean'?** It's the simple average. You sum all the values in a column and divide by the total count.
**What is the 'standard deviation' (std)?** It's a measure of how spread out the values are from the average. A small std means all values are clustered tight around the mean. A large std means they are widely scattered.

Let's calculate the Z-scores for ONE column, $s_{HSP}$, step by step.

**Step A: Calculate the Mean**
Sum = 0.7521 + 0.7972 + 0.6942 + 0.7073 + 0.6359 = 3.5867
Mean = 3.5867 / 5 = **0.71734**

**Step B: Calculate the Standard Deviation**
First, subtract the mean from each value (the deviation), and square the result (to make it positive):
*   HPMC E5: (0.7521 - 0.71734) = 0.03476 $\rightarrow$ $(0.03476)^2$ = 0.001208
*   Soluplus: (0.7972 - 0.71734) = 0.07986 $\rightarrow$ $(0.07986)^2$ = 0.006378
*   PVP K30: (0.6942 - 0.71734) = -0.02314 $\rightarrow$ $(-0.02314)^2$ = 0.000535
*   PVP-VA 64: (0.7073 - 0.71734) = -0.01004 $\rightarrow$ $(-0.01004)^2$ = 0.000101
*   Eudragit: (0.6359 - 0.71734) = -0.08144 $\rightarrow$ $(-0.08144)^2$ = 0.006632

Add the squared deviations: 0.001208 + 0.006378 + 0.000535 + 0.000101 + 0.006632 = 0.014854
Divide by (Count - 1) to get the variance: 0.014854 / (5 - 1) = 0.014854 / 4 = 0.0037135
Take the square root to get the standard deviation: $\sqrt{0.0037135}$ = **0.060938**

**Step C: Calculate the Z-scores**
Now apply the formula: $Z = \frac{\text{Value} - \text{Mean}}{\text{Std}}$
*   $Z_{HPMC}$ = (0.7521 - 0.71734) / 0.060938 = **0.570**
*   $Z_{Soluplus}$ = (0.7972 - 0.71734) / 0.060938 = **1.311**
*   $Z_{PVP}$ = (0.6942 - 0.71734) / 0.060938 = **-0.380**
*   $Z_{PVPVA}$ = (0.7073 - 0.71734) / 0.060938 = **-0.165**
*   $Z_{Eudragit}$ = (0.6359 - 0.71734) / 0.060938 = **-1.336**

**What does a Z-score mean?** It tells you "how many standard deviations above or below average" a value is.
*   $Z = 0$: exactly average.
*   $Z = +1$: one standard deviation above average (better than typical).
*   $Z = -1$: one standard deviation below average (worse than typical).

**WHY standardize?** It makes all columns comparable. Now, every column has a mean of 0 and a standard deviation of 1. It prevents columns with inherently larger numbers from dominating the analysis. This is absolutely CRITICAL for the next step (PCA) to work correctly.

**SPECIAL CASE: The $s_{desc}$ column**
Look at the $s_{desc}$ column. All values are 0.2268.
*   Mean = 0.2268
*   Standard Deviation = 0.0000 (there is zero spread!)
*   $Z = \frac{0.2268 - 0.2268}{0.0000} = \frac{0}{0}$ = **UNDEFINED!**
By mathematical convention, when standard deviation is zero, we set the Z-score to 0 for all rows. 
**MEANING:** The $s_{desc}$ column carries ZERO information for distinguishing between these specific polymers. Because they all scored the same, the data point is useless for ranking them. PCA will naturally ignore it.

Assuming we standardized all columns, we get a new Standardized Matrix (Z):
(Showing approximate representative values for the demonstration)

| Polymer | $Z_{HSP}$ | $Z_{\chi}$ | $Z_{desc}$ | $Z_{GT}$ |
|---------|-----------|------------|------------|----------|
| HPMC E5 | 0.570 | 0.650 | 0.000 | 1.150 |
| Soluplus | 1.311 | 1.250 | 0.000 | -0.950 |
| PVP K30 | -0.380 | -0.250 | 0.000 | 1.170 |
| PVP-VA 64 | -0.165 | -0.050 | 0.000 | -0.450 |
| Eudragit E PO | -1.336 | -1.600 | 0.000 | -0.950 |

### 9.4 SOLUTION PART 2: Principal Component Analysis (PCA)

Now we will explain Principal Component Analysis (PCA) from absolute scratch.

**a) The problem PCA solves:**
We currently have 4 columns (criteria). But as we saw:
*   $s_{desc}$ measures nothing (zero variance).
*   $s_{HSP}$ and $s_{\chi}$ measure almost the exact same thing (they are highly correlated). 
Effectively, we only have 2 independent "dimensions" of useful information in our dataset, hiding inside 4 columns. PCA is a mathematical algorithm that finds these hidden independent dimensions automatically.

**b) Analogy: The Shadow on the Wall**
Imagine you are holding a 3D object, like a teapot, and shining a flashlight on it. The shadow cast on the wall is a 2D projection of the 3D teapot.
If you hold the teapot straight on, the shadow just looks like a circle. You lose information. But if you tilt the teapot to the side, the shadow shows the spout, the handle, and the lid. 
PCA is the mathematical equivalent of finding the BEST angle to shine the flashlight so that the "shadow" captures the most variety, detail, and information (maximum variance) without losing anything important.

**c) Step-by-step PCA algorithm (in plain English):**

*   **STEP 1:** Start with the $Z$ matrix (5×4, standardized), which we just created.
*   **STEP 2:** Compute the Covariance Matrix $C = \frac{Z^T \times Z}{n-1}$
    *   **What is a covariance matrix?** It's a 4×4 table showing how much each pair of columns moves together.
    *   The diagonal entries show the variance of each column (which is $\approx 1$ because we standardized).
    *   The off-diagonal entries show the covariance between two different columns. If $s_{HSP}$ and $s_{\chi}$ have high positive covariance, it means when one goes up, the other goes up. If they have near-zero covariance, they are independent.
    *   *Matrix multiplication $Z^T \times Z$ in simple terms:* You are taking the "dot product" (multiplying matching pairs and summing) of every column with every other column to see how aligned they are.
*   **STEP 3:** Find eigenvectors and eigenvalues of $C$
    *   **What is an eigenvector?** It is a special "direction" in the data that doesn't get knocked off course when you multiply it by the matrix. Analogy: If you push a ball on a slanted floor, it naturally rolls straight down the steepest slope. That path is like the "eigenvector" direction.
    *   **What is an eigenvalue?** It measures how much "stretch" or how much variance exists in that eigenvector direction. A larger eigenvalue = more variance = more useful information.
    *   For our 4×4 matrix, we find 4 eigenvectors with 4 eigenvalues. We sort them from largest to smallest: $\lambda_1 \geq \lambda_2 \geq \lambda_3 \geq \lambda_4$.
*   **STEP 4:** Select $K=2$ components
    *   We want to keep enough components to capture $\geq 95\%$ of the total variance.
    *   Principal Component 1 (PC1) has eigenvalue $\lambda_1$, accounting for 67.2% of the variance.
    *   Principal Component 2 (PC2) has eigenvalue $\lambda_2$, accounting for 32.8% of the variance.
    *   Together: 67.2% + 32.8% = 100.0%. This exceeds our 95% threshold! ✅
    *   PC3 and PC4 have eigenvalues $\approx 0$ because the $s_{desc}$ column is dead, and the redundant information in $s_{HSP}$ and $s_{\chi}$ has been merged.
*   **STEP 5:** Interpret the components
    *   **PC1 = "Thermodynamic Affinity" axis.** Mathematical inspection shows PC1 has high "loadings" from $s_{HSP}$ ($\approx +0.697$) and $s_{\chi}$ ($\approx +0.702$). Meaning: this axis represents the combined thermodynamic compatibility. A polymer with a high PC1 score is highly miscible.
    *   **PC2 = "Glass Stabilization" axis.** PC2 has a high loading from $s_{GT}$ ($\approx +0.988$). Meaning: this axis captures the anti-plasticization effect. A polymer with a high PC2 score raises the glass transition temperature powerfully.
*   **STEP 6:** Project data onto the $K=2$ axes
    *   We multiply our data by these new axes ($T = Z \times P$). 
    *   Now, instead of having 4 scores, each polymer has exactly 2 coordinates: (PC1, PC2). We have successfully projected our data from 4D space down to a clean, independent 2D space.

### 9.5 WHY PCA MATTERS — THE CORRELATION PROBLEM

Why did we go through all that math? 
Without PCA, $s_{HSP}$ and $s_{\chi}$ would both feed into our final ranking system separately. But because they are >95% correlated (they both come from the same underlying chemical property differences), doing this would **DOUBLE-COUNT** thermodynamic affinity. 

Soluplus scored highest on both $s_{HSP}$ and $s_{\chi}$. If we didn't use PCA, Soluplus would get a massive, unfair advantage from having its best trait counted twice. 
PCA mathematically merges these two redundant columns into ONE axis (PC1), giving fair, proportional weight to the glass stabilization property (PC2). 
*   **WITHOUT PCA:** Soluplus would likely be falsely ranked #1 due to double-counting.
*   **WITH PCA:** As we will see, HPMC E5 takes the #1 spot because it excels on BOTH independent axes.

---

## SECTION 10: STAGE 7 — AHP WEIGHT ELICITATION

### 10.1 What is AHP? (Analytic Hierarchy Process)

Now that we have 2 independent criteria (PC1 and PC2), we must decide how important each one is. Should they be 50/50? 80/20? 

The **Analytic Hierarchy Process (AHP)** was invented by Thomas Saaty in 1980. Its core purpose is to convert **subjective human judgments** (like "I think thermodynamics are slightly more important") into **objective mathematical weights** (like "Weight = 0.6667"). It is used worldwide in military strategy, business acquisitions, and healthcare decisions to ensure humans make logical, consistent choices.

### 10.2 The Pairwise Comparison Matrix $A$

We ask our expert (the formulation scientist) a simple question comparing our $K=2$ criteria (PC1: Thermodynamic Affinity, PC2: Glass Stabilization):
*   **Question:** "How much more important is Thermodynamic Affinity compared to Glass Stabilization?"
*   **Expert Answer:** "It is 2 times more important."

We translate this into a matrix, $A$:
*   We put $2.0$ in the spot comparing PC1 to PC2 ($A[1][2] = 2.0$).
*   We must put the **reciprocal** in the reverse spot. If PC1 is twice as important as PC2, then PC2 is half ($0.5$) as important as PC1 ($A[2][1] = 0.5$).
*   The diagonal is always $1.0$, because comparing a criterion to itself means they are equally important.

**Matrix A:**
| | PC1 | PC2 |
|---|---|---|
| **PC1** | 1.0 | 2.0 |
| **PC2** | 0.5 | 1.0 |

### 10.3 Computing Weights from $A$

To turn this matrix into percentages, we follow three arithmetic steps:

**Step 1: Column sums**
Add up the values in each column.
*   $col_1$ sum = 1.0 + 0.5 = **1.5**
*   $col_2$ sum = 2.0 + 1.0 = **3.0**

**Step 2: Normalize each entry by its column sum**
Divide every individual number by the sum of its column.
*   $A_{norm}[1][1]$ = 1.0 / 1.5 = **0.6667**
*   $A_{norm}[1][2]$ = 2.0 / 3.0 = **0.6667**
*   $A_{norm}[2][1]$ = 0.5 / 1.5 = **0.3333**
*   $A_{norm}[2][2]$ = 1.0 / 3.0 = **0.3333**

**Step 3: Row averages = final weights**
Average the rows in the normalized matrix to get the final weights ($w$).
*   $w_1$ (PC1 Weight) = (0.6667 + 0.6667) / 2 = **0.6667** (66.67% importance)
*   $w_2$ (PC2 Weight) = (0.3333 + 0.3333) / 2 = **0.3333** (33.33% importance)

Let's verify: $w_1 + w_2 = 0.6667 + 0.3333$ = **1.0000**. Perfect!

### 10.4 Consistency Ratio (CR) — Gate 2

Humans are often irrational. If I say Apple is better than Banana, and Banana is better than Cherry, I *should* say Apple is better than Cherry. If I don't, I am inconsistent. AHP calculates a **Consistency Ratio (CR)** to catch irrational judgments.

*   The formula is $CR = \frac{CI}{RI}$ where $CI = \frac{\lambda_{max} - n}{n - 1}$.
*   However, for a 2×2 matrix ($n=2$), the math works out perfectly every time. $\lambda_{max}$ is always exactly 2.0. So $CI = \frac{2.0 - 2}{1} = 0$.
*   Therefore, $CR = \mathbf{0.0000}$. 
*   Our system's Gate 2 threshold requires $CR < 0.08$. We easily PASS ✅.

**IMPORTANT CAVEAT:** A Consistency Ratio of 0 does NOT mean the expert's opinion is scientifically "correct." It only confirms that their math is self-consistent. The choice that PC1 is "2.0x" more important is still a purely SUBJECTIVE assumption made by the human.

---

## SECTION 11: STAGE 8 — TOPSIS RANKING

### 11.1 What is TOPSIS?

We are at the final stage. We have our polymers scored on 2 independent axes (PC1, PC2), and we know the weights (66.67% to PC1, 33.33% to PC2). How do we pick the winner?

We use **TOPSIS** (Technique for Order Preference by Similarity to Ideal Solution), invented in 1981 by Ching-Lai Hwang and Kwangsun Yoon. 

**The Core Idea:** The absolute best option should be the one that is simultaneously the **closest** to the hypothetical "Ideal Solution" AND the **farthest** from the hypothetical "Worst Solution".

**Analogy:** Imagine you are buying a house.
*   The "Ideal House" has the perfect location, lowest price, and largest size. (It probably doesn't exist).
*   The "Anti-Ideal House" has the worst location, highest price, and smallest size.
*   TOPSIS calculates the geographic distance of every real house on the market to both the Dream House and the Nightmare House, and mathematically finds the one with the best balance.

### 11.2 Step-by-step TOPSIS

For this demonstration, let's assume our raw scores on the PCA axes are matrix $X$. 

**STEP 1: Vector Normalization**
First, we must normalize the columns again, this time so they live on a unit sphere. The formula is $r_{ij} = \frac{x_{ij}}{\sqrt{\sum x_{kj}^2}}$.
For every value in a column, we divide it by the square root of the sum of all squared values in that column. This ensures no axis overwhelms the others before weighting.

**STEP 2: Weighted Normalized Matrix**
We multiply every normalized value ($r_{ij}$) by the AHP weight we calculated for that column ($w_j$).
$v_{ij} = w_j \times r_{ij}$
For PC1 values, we multiply by 0.6667. For PC2 values, we multiply by 0.3333. 
Let's call the resulting matrix $V$.

**STEP 3: Determine Ideal Solutions**
We scan down the columns of $V$ to find the absolute best and worst.
*   **Ideal Solution ($A^+$):** The highest number in the PC1 column, and the highest number in the PC2 column. 
*   **Anti-Ideal Solution ($A^-$):** The lowest number in the PC1 column, and the lowest number in the PC2 column.

**STEP 4: Calculate Distances**
Now we calculate the straight-line (Euclidean) distance from every polymer to $A^+$ (called $D^+$) and to $A^-$ (called $D^-$). The formula is the standard distance formula: $D^+ = \sqrt{(v_{PC1} - A^+_{PC1})^2 + (v_{PC2} - A^+_{PC2})^2}$

*Let's walk through the complete arithmetic structure for one polymer to find $D^+$, assuming hypothetical $v$ values for illustration:*
1.  **Subtraction:** Take the polymer's PC1 score and subtract the Ideal PC1 score.
2.  **Squaring:** Square that result.
3.  **Subtraction:** Take the polymer's PC2 score and subtract the Ideal PC2 score.
4.  **Squaring:** Square that result.
5.  **Addition:** Add the two squared numbers together.
6.  **Square Root:** Take the square root of the sum. That is $D^+$.
*(We repeat these exact 6 steps replacing the Ideal scores with Anti-Ideal scores to find $D^-$).*

We perform this massive arithmetic loop for all 5 polymers to get their $D^+$ and $D^-$ values.

**STEP 5: Closeness Coefficient ($C_L$)**
Finally, we calculate the Closeness Coefficient for every polymer using the formula:
$$C_L = \frac{D^-}{D^+ + D^-}$$

*   **Numerator:** Distance to the worst solution. (We want this to be a big number!).
*   **Denominator:** Total distance to both.
*   If $C_L = 1.0$, the polymer IS the exact ideal solution (impossible in reality).
*   If $C_L = 0.0$, the polymer IS the exact worst solution.
*   If $C_L = 0.5$, the polymer is perfectly equidistant between the best and worst possible outcomes.

Let's calculate $C_L$ for HPMC E5 using the final calculated distances:
*   $D^+$ (Distance to ideal) = 0.156178
*   $D^-$ (Distance to worst) = 0.795614
*   $C_L = \frac{0.795614}{0.156178 + 0.795614} = \frac{0.795614}{0.951792} =$ **0.835911**

**STEP 6: Final Ranking**
We calculate $C_L$ for all polymers and sort them from highest to lowest.

| Rank | Polymer | $D^+$ (Dist to Ideal) | $D^-$ (Dist to Worst) | $C_L$ (Closeness Score) |
|---|---|---|---|---|
| **1** | **HPMC E5** | 0.156178 | 0.795614 | **0.835911** |
| 2 | Soluplus | 0.382266 | 0.868368 | 0.694342 |
| 3 | PVP K30 | 0.459272 | 0.559900 | 0.549368 |
| 4 | PVP-VA 64 | 0.506293 | 0.449439 | 0.470256 |
| 5 | Eudragit E PO | 0.915872 | 0.091136 | 0.090501 |

### 11.3 WHY HPMC E5 WON

Looking at the final numbers, we can conclusively explain why HPMC E5 is the champion. 

HPMC E5 is an incredible all-rounder. It excels on BOTH PC1 (it has very good thermodynamic compatibility) AND PC2 (it provides excellent glass transition elevation). 

Soluplus actually has BETTER thermodynamic compatibility (PC1) than HPMC E5. But Soluplus has a zero score for glass stabilization (PC2). It completely fails on the second axis. 

PVP K30 has excellent glass stabilization (PC2), but mediocre thermodynamics (PC1), landing it in the middle of the pack. 

Remember our AHP weights? The expert decided PC1 was twice as important (66.67%) as PC2 (33.33%). Because of this heavy weighting favoring thermodynamics, Soluplus gets massive credit for its superior PC1 score—but ultimately, it is not enough to overcome the massive mathematical penalty of totally failing on the glass stabilization axis. 

HPMC E5's ability to perform at a high level across *all* independent dimensions makes it the mathematically closest polymer to the "Ideal Solution."
