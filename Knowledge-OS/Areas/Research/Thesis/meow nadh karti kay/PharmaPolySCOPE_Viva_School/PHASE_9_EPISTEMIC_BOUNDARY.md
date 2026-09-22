# PHASE 9 EPISTEMIC BOUNDARY
# Demarcation of Computational Screening vs. Physical Formulation Reality

**Document ID:** `PHASE_9_EPISTEMIC_BOUNDARY`  
**Phase:** Phase 9 (Source-Locked Planning Gate)  
**Curriculum Scope:** Module 11 to Module 12 Handoff  
**Auditor:** Forensic Computational-Science Architect & PhD Methodology Auditor  
**Date:** September 23, 2026  
**Status:** **AUTHORITATIVE EPISTEMIC DEMARCATION**  

---

## 1. Philosophical & Methodological Mandate

In a doctoral viva examination, examiners aggressively probe the epistemological boundary of computational models. Candidates fail when they conflate in silico multi-criteria proxy metrics with physical laboratory phenomena. 

This document establishes the **absolute epistemic demarcation** governing PharmaPolySCOPE v2, Phase 9 planning, and Module 12 authoring. It categorizes all claims into four non-overlapping domains:
- **Domain A:** What computation can establish.
- **Domain B:** What computation cannot establish.
- **Domain C:** What experimental data would establish.
- **Domain D:** What remains strictly outside Phase 9 scope.

---

## 2. Domain A: What Computation Can Establish

The PharmaPolySCOPE v2 software pipeline can rigorously, definitively establish:
1. **Mathematical Multi-Criteria Ranking:** Given an input set of molecular SMILES and a fixed polymer library, the exact relative closeness score $C_L(i) \in [0, 1]$ evaluated via SP-PRP-TOPSIS under positive-definite quadratic metric tensor $M_K = V_K^T W V_K$.
2. **Subspace Dimensionality & Eigengap Governance:** The minimal number of principal components $K \le p$ capturing cumulative explained variance $\ge \tau_{\text{var}} = 0.95$, and whether the boundary eigengap $\delta_K = \lambda_K - \lambda_{K+1}$ satisfies stability thresholds ($\ge 0.10$ stable, $< 0.03$ blocked).
3. **Decision-Theoretic Preference Consistency:** The mathematical consistency ratio $CR = CI / RI_4$ of an expert AHP pairwise comparison matrix, and whether $CR < 0.08$.
4. **Computational Ranking Sensitivity:** The exact rate of change $\partial C_L / \partial w$ and rank volatility distributions under Monte Carlo input perturbation ($\sigma_{\text{score}}=0.05, \sigma_{\text{AHP}}=0.15$) and Morris Elementary Effects screening.
5. **Algorithmic Guardrail Integrity:** That unphysical or corrupt chemical inputs (malformed SMILES, zero-variance criteria, identical polymer profiles) are deterministically intercepted by software exceptions (`RDKitParseFailureError`, `ZeroVarianceStandardizationError`) before calculating rankings.
6. **Machine-Independent Reproducibility:** Exact bitwise or floating-point bounded ($|\Delta| \le 10^{-12}$) reproduction of numerical traces across standard IEEE 754 computing platforms.

---

## 3. Domain B: What Computation Cannot Establish

The PharmaPolySCOPE v2 software pipeline **cannot** establish under any circumstances:
1. **Physical Miscibility:** Computation of Hansen solubility parameter distance $R_a$ and Flory-Huggins $\chi$ does not establish that the drug and polymer will physically mix into a single homogeneous amorphous phase during hot-melt extrusion or spray drying.
2. **Amorphous Solid State Stability:** A high relative closeness score (e.g., Soluplus $C_L = 0.6864$) does not establish that the amorphous drug will resist nucleation, spinodal decomposition, or crystallization when stored at 40°C / 75% RH for 6 months.
3. **Dissolution Rate Enhancement:** The model does not predict or guarantee that the formulation will achieve "spring and parachute" supersaturation, improve dissolution velocity, or enhance in vivo oral bioavailability.
4. **Physical Optimality of Preferences:** The AHP weights ($w = [0.4077, 0.3244, 0.0922, 0.1757]$) represent an epistemic consensus of expert preferences; they do not represent fundamental physical coupling constants derived from statistical mechanics.
5. **Universal Chemical Transferability:** Results obtained on the validated 5-polymer library cannot be extrapolated to untested polymers (e.g., HPMCAS grades, Soluplus copolymers with varying block lengths) without full recalibration and revalidation.
6. **Cross-Cohort Distance Equivalence:** A score of $C_L = 0.6864$ in the $K=3$ Indomethacin subspace cannot be directly compared as a Euclidean distance against $C_L = 0.7412$ in the $K=2$ Ibuprofen subspace.

---

## 4. Domain C: What Experimental Data Would Establish

The following critical pharmaceutical realities can **only** be established by physical, wet-lab experimental investigation:
1. **Solid-State Phase Behavior:** Powder X-Ray Diffraction (PXRD) halo patterns and Differential Scanning Calorimetry (DSC) glass transition temperature ($T_g$) single-step shifts establishing true amorphous molecular dispersion.
2. **Physical Kinetic Stability:** Real-time and accelerated stability testing under ICH guidelines ($25^\circ\text{C}/60\%\text{RH}$ and $40^\circ\text{C}/75\%\text{RH}$) monitored by PXRD and polarized light microscopy (PLM) to detect crystallization onset ($t_{\text{cryst}}$).
3. **In Vitro Supersaturation & Dissolution Kinetics:** USP Apparatus II (paddle) dissolution testing measuring dissolution rate, maximum supersaturation concentration ($C_{\max}$), and area under the dissolution curve (AUC) in biorelevant media (FaSSIF / FeSSIF).
4. **Molecular Interaction Confirmation:** Solid-state FTIR and 13C/1H solid-state NMR spectroscopy establishing hydrogen bonding, dipole-dipole, or acid-base interactions between drug functional groups and polymer backbones.
5. **In Vivo Pharmacokinetics:** Animal bioavailability studies measuring $C_{\max}$, $T_{\max}$, and $\text{AUC}_{0-\infty}$ to evaluate true therapeutic performance.

---

## 5. Domain D: What Remains Outside the Scope of Phase 9

Phase 9 is strictly a **source-locked computational planning phase** bridging Module 11 to Module 12. The following areas are explicitly outside its scope:
1. **No Laboratory Synthesis:** Zero preparation of physical extrudates, spray-dried dispersions, or physical mixtures.
2. **No Production Software Refactoring:** Zero changes to `asd_framework` source code, unit tests, or production configuration.
3. **No Modification of Prior Modules:** Modules 01 through 11 are sealed and frozen.
4. **No Introduction of New Chemical Libraries:** Screening remains bounded by the validated Indomethacin, Ibuprofen, Itraconazole, and DRG-0002 cohorts.
5. **No Novel Computational Algorithms:** Phase 9 plans the reconciliation of existing v2 methods; it does not introduce new machine learning, neural network, or alternative MCDA algorithms.

---

## 6. Forbidden vs. Permitted Language Reference Table

| Concept | FORBIDDEN VIVA LANGUAGE (Hostile Trap) | PERMITTED DEFENSE LANGUAGE (Mathematically Grounded) |
| :--- | :--- | :--- |
| **Top Rank** | "Soluplus is the best polymer for Indomethacin." | "Soluplus is the top-ranked candidate within the 5-polymer library under the documented v2 MCDA criteria and AHP preference weights." |
| **Closeness Score** | "A score of $C_L = 0.6864$ proves formulation stability." | "The relative closeness score $C_L = 0.6864$ represents the normalized relative distance from the anti-ideal solution in the 3D projected subspace." |
| **Monte Carlo $p_{\text{top1}}$** | "There is a $55.51\%$ probability that Soluplus will succeed in the clinic." | "Soluplus achieved Rank 1 in $55.51\%$ of the 8,600 valid Monte Carlo replicates under the specified $\pm 5\%$ score and $\pm 15\%$ AHP noise models." |
| **AHP Weight Shift** | "Changing weights proved HPMC E5 is physically superior." | "Perturbing AHP weights shifted diagonal metric tensor elements, resulting in a mathematical rank inversion without altering input chemistry." |
| **Dynamic PCA $K$** | "PCA K-Means clustering clustered the polymers." | "Dynamic PCA selected $K=3$ principal components, capturing $99.96\%$ of cumulative variance while satisfying the $\delta_3 \ge 0.10$ stability threshold." |
| **Metric Formulation**| "We applied classical Hwang-Yoon TOPSIS." | "The pipeline executes Subspace Projected Positive/Negative Reference Point TOPSIS (SP-PRP-TOPSIS) using a positive-definite quadratic metric tensor $M_K$." |
| **CF-04 Identity** | "CF-04 proved the metric recovery theorem." | "CF-04 confirmed the full-space metric reduction identity, where orthogonal projection collapses to unrotated weighted Euclidean distance when $K=p=4$." |
| **Identical Rows (CF-19)**| "Identical polymers output $C_L = 0.500$ in production." | "Identical polymer rows have zero variance, triggering `ZeroVarianceStandardizationError` at Step 1; the $C_L=0.50$ value is an unreachable theoretical bound." |

---

## 7. Epistemic Certification

By strictly enforcing these boundaries, Phase 9 ensures that the candidate's viva defense remains impregnable. Computational claims are defended with absolute mathematical rigor, while physical formulation realities are conservatively and appropriately deferred to experimental science.
