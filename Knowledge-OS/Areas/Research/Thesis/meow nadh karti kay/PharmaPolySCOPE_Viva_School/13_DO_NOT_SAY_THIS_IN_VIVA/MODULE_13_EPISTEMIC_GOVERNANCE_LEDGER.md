# MODULE 13 — EPISTEMIC GOVERNANCE LEDGER
# Formal Epistemic Classification Ledger of PharmaPolySCOPE Claims, Evidence, and Boundaries

**Document ID:** `MODULE_13_EPISTEMIC_GOVERNANCE_LEDGER`  
**Module:** Module 13 — Do NOT Say This in Viva (`13_DO_NOT_SAY_THIS_IN_VIVA/`)  
**Phase:** Module 13 Execution (Negative-Space Viva Defense Doctrine)  
**Authoritative Curriculum Anchor:** Part 13 of `00_MASTER_KNOWLEDGE_MAP/PHARMAPOLYSCOPE_MASTER_KNOWLEDGE_MAP.md`  
**Auditor:** Forensic Computational-Science Architect & PhD Methodology Auditor  
**Date:** September 24, 2026  
**Status:** **AUTHORITATIVE GOVERNANCE LEDGER (SEALED)**  

---

## 1. Executive Summary & Epistemic Framework

The **Epistemic Governance Ledger** provides an authoritative, structured mapping of every major scientific, mathematical, and architectural claim within the PharmaPolySCOPE v2 ecosystem.

By classifying each claim across the **Six-Tier Epistemic Taxonomy**, this ledger establishes:
1. Exactly what can be asserted with 100% confidence.
2. Exactly what must NEVER be claimed under cross-examination.
3. The precise mathematical, computational, or physical reason governing the boundary.

---

## 2. The Six Epistemic Tiers Defined

- **TIER-1: DIRECTLY_ESTABLISHED_BY_IMPLEMENTATION**  
  Hard-coded constants, code ASTs, exception classes, and immutable configuration files.
- **TIER-2: ESTABLISHED_BY_NUMERICAL_COMPUTATION**  
  Deterministic or stochastic outputs produced by executing verified algorithms on the baseline dataset.
- **TIER-3: SUPPORTED_AS_METHODOLOGICAL_DIAGNOSTIC**  
  Internal algorithmic indicators providing geometric, consistency, or sensitivity diagnostics within the MCDA model.
- **TIER-4: GENERAL_SCIENTIFIC_INTERPRETATION**  
  Established physical chemistry and formulation principles derived from peer-reviewed literature.
- **TIER-5: EXPERIMENTALLY_UNVALIDATED**  
  Physical solid-state and dissolution properties that require wet-lab experimental confirmation.
- **TIER-6: EXPLICITLY_OUTSIDE_MODEL_SCOPE**  
  Downstream pharmaceutical processing, tableting, and clinical pharmacokinetic phenomena completely outside the mathematical model.

---

## 3. Epistemic Classification Master Table (32 Core Entries)

| Claim ID | Scientific / Computational Claim | Assigned Epistemic Tier | Primary Evidence Reference | What Can Be Said in Viva | What CANNOT Be Said in Viva | Methodological / Physical Rationale | Related Module |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- | :---: |
| **EGL-01** | PCA Variance Threshold is 0.95 | `TIER-1` | `src/asd_mcda/v2/pca.py:32` | "The dynamic cutoff threshold is hard-coded at $\tau_{\text{var}} = 0.95$." | "0.95 is an experimentally derived physical constant." | It is an algorithmic parameter chosen to preserve $95\%$ of cohort variance. | Module 04, 12 |
| **EGL-02** | Eigengap Thresholds are 0.10 and 0.03 | `TIER-1` | `src/asd_mcda/v2/stability.py:44` | "Thresholds $\ge 0.10$ classify stable; $< 0.03$ raise blocked error." | "0.03 represents a physical phase boundary." | Mathematical thresholds based on Davis-Kahan matrix perturbation stability. | Module 04, 12 |
| **EGL-03** | AHP Governance Gate Threshold is 0.08 | `TIER-1` | `src/asd_mcda/v2/ahp.py:52` | "Matrices with $CR \ge 0.08$ raise `AHPConsistencyViolationError`." | "$CR < 0.08$ proves the expert weights are scientifically true." | $CR$ diagnoses mathematical transitivity under Saaty's random index. | Module 05, 12 |
| **EGL-04** | Saaty Random Index $RI_4 = 0.89$ | `TIER-1` | `src/asd_mcda/v2/ahp.py:53` | "$RI_4 = 0.89$ is the Saaty benchmark random index for $4 \times 4$ matrices." | "$RI_4$ was calibrated to our polymer library." | Derived from 50,000 simulated random reciprocal matrices by Saaty (1980). | Module 05, 12 |
| **EGL-05** | Standardization Guardrail is $10^{-8}$ | `TIER-1` | `src/asd_mcda/v2/standardization.py:28`| "Columns with $\sigma_j^2 \le 10^{-8}$ raise `ZeroVarianceStandardizationError`." | "The guardrail models experimental detection limits." | Computational safety guardrail preventing division by zero. | Module 04, 12 |
| **EGL-06** | Canonical Reciprocal Matrix $A$ | `TIER-1` | `backend/services/engine_adapter.py:95`| "Row 1 is $[1,2,3,2]$; Row 2 has $a_{23}=5.0$ and $a_{24}=2.0$." | "Row 1 contains $a_{12}=5.0$ and $a_{13}=2.0$." | Direct AST code inspection confirms canonical matrix entries. | Module 05, 12 |
| **EGL-07** | DRG-0002 Quarantine Tripwire | `TIER-1` | `src/asd_mcda/v2/chemistry.py:85` | "Quarantined due to chemical identity mismatch (Fenofibrate vs. Indo)."| "Quarantined due to corrupted density of $1.781\text{ g/cm}^3$." | Input data governance detects metadata-structure discrepancies. | Module 02, 12 |
| **EGL-08** | Indomethacin Retained Dimension $K=3$ | `TIER-2` | `scientific_validation_results.json` | "Indomethacin dynamically selects $K=3$ components ($99.9634\%$ var)."| "$K=3$ means Indomethacin forms 3 polymer clusters." | PCA eigenvalue sum reaches $3.9985 / 4.0 = 0.999634 \ge 0.95$ at $K=3$. | Module 04, 12 |
| **EGL-09** | Indomethacin Boundary Eigengap | `TIER-2` | `MODULE_12_DERIVATION_BOOK.md:Deriv-2`| "Boundary eigengap $\delta_3 = \lambda_3 - \lambda_4 = 0.738310 \ge 0.10$." | "$\delta_3$ proves that three physical mechanisms operate." | Exact spectral separation between 3rd and 4th eigenvalues. | Module 04, 12 |
| **EGL-10** | AHP Principal Root $\lambda_{\max} = 4.131937$ | `TIER-2` | `MODULE_12_DERIVATION_BOOK.md:Deriv-3`| "Power iteration root is $\lambda_{\max} = 4.131937$, yielding $CR = 0.049415$."| "$\lambda_{\max}$ reflects thermodynamic free energy." | Perron root of positive reciprocal comparison matrix. | Module 05, 12 |
| **EGL-11** | Soluplus Closeness Score $C_L = 0.6864$ | `TIER-2` | `MODULE_12_DERIVATION_BOOK.md:Deriv-5`| "Soluplus closeness score is $C_L = 0.686435$ ($D^+=4.1826, D^-=9.1563$)."| "$C_L$ proves Soluplus will have the highest dissolution rate." | Quotient of Euclidean distances in metric-tensor-weighted PCA subspace. | Module 05, 12 |
| **EGL-12** | Monte Carlo Top-1 Frequency $55.51\%$ | `TIER-2` | `src/asd_mcda/v2/uncertainty.py:175`| "Soluplus ranked top-1 in $55.51\%$ of valid replicates ($4,774 / 8,600$)."| "Soluplus has a $55.51\%$ probability of clinical formulation success."| Algorithmic ranking frequency under two-locus perturbation: Truncated Normal scores on $[0,1]$ with `np.clip`, and log-normal AHP pairwise ratios. | Module 06, 12 |
| **EGL-13** | Monte Carlo Replicate Partitioning | `TIER-2` | `MODULE_12_DERIVATION_BOOK.md:Deriv-6`| "$10,000 \text{ gen} = 8,600 \text{ valid} + 1,396 \text{ CR blk} + 4 \text{ gap blk}$."| "$14\%$ of runs failed due to software crashes." | Replicate conservation law under active governance tripwires. | Module 06, 12 |
| **EGL-14** | Morris Dominant Factor $\mu^* = 0.1444$| `TIER-2` | `scientific_validation_results.json` | "`score_POL-005-2026_s_desc` has highest screening effect ($\mu^* = 0.144381$)."| "Molecular descriptors physically drive the mixing process." | Algorithmic parameter sensitivity screening across a trajectory grid. | Module 06, 12 |
| **EGL-15** | Ibuprofen Multi-Cohort Baseline | `TIER-2` | `scientific_validation_results.json` | "Ibuprofen selects $K=2$ ($96.10\%$ var), with Eudragit Rank 1 ($C_L = 0.5503$)."| "Eudragit winning proves the Indomethacin model was defective." | Dynamic $K$ adapts to chemical profile; Eudragit matches Ibuprofen's acid. | Module 08, 12 |
| **EGL-16** | Itraconazole Multi-Cohort Baseline | `TIER-2` | `scientific_validation_results.json` | "Itraconazole selects $K=2$ ($96.19\%$ var), with Soluplus Rank 1 ($C_L = 0.6106$)."| "Itraconazole proves Soluplus is universally best." | Rebaselined decision space correctly identifies optimal candidate. | Module 08, 12 |
| **EGL-17** | Hansen Solubility Score $s_{\text{HSP}}$ | `TIER-3` | `src/asd_mcda/compatibility/hsp_model.py`| "Evaluates cohesive energy matching as a geometric screening diagnostic."| "Small HSP distance proves negative $\Delta G_{\text{mix}}$ and miscibility."| Empirical regular solution approximation; ignores combinatorial entropy. | Module 03, 04 |
| **EGL-18** | Flory-Huggins Interaction Score $s_\chi$ | `TIER-3` | `src/asd_mcda/compatibility/flory_huggins.py`| "Evaluates relative enthalpic interaction favorability via group contributions."| "$\chi$ proves spontaneous thermodynamic dissolution." | Semi-empirical group contribution proxy; does not construct phase diagrams. | Module 03, 04 |
| **EGL-19** | Molecular Descriptor Score $s_{\text{desc}}$ | `TIER-3` | `src/asd_mcda/compatibility/matrix.py` | "Evaluates 2D stoichiometric donor/acceptor and polar surface matching."| "Proves formation of specific directional hydrogen bonding networks."| 2D topological counts lack 3D spatial conformation and energy info. | Module 02, 03 |
| **EGL-20** | Gordon-Taylor Score $s_{\text{GT}}$ | `TIER-3` | `src/asd_mcda/compatibility/gordon_taylor.py`| "Evaluates theoretical mixture $T_g$ margin under free volume additivity." | "Proves the formulation will not crystallize for two years." | Static free volume model; lacks nucleation kinetics and moisture modeling. | Module 01, 03 |
| **EGL-21** | AHP Preference Allocation | `TIER-3` | `src/asd_mcda/v2/ahp.py` | "Codified expert trade-offs across normalized computational proxies." | "Represents $73.21\%$ thermodynamic and $17.57\%$ kinetic energy shares."| Decision-theoretic scaling weights; unitless preference trade-offs. | Module 05, 12 |
| **EGL-22** | SP-PRP Metric Tensor $M_K$ | `TIER-3` | `src/asd_mcda/v2/metrics.py:35` | "Projects AHP preference weights into the orthogonal PCA subspace."| "Classical Hwang-Yoon Euclidean metric." | $M_K = V_K^T W V_K$ preserves decision weights in rotated coordinates. | Module 04, 05 |
| **EGL-23** | Amorphous Solid Dispersion Metastability | `TIER-4` | Hancock & Zografi (1997); Literature | "ASDs are thermodynamically metastable systems with enhanced apparent solubility."| "ASDs are in absolute thermodynamic equilibrium." | Established physical chemistry; lattice energy eliminated in amorphous state. | Module 01 |
| **EGL-24** | Free Volume Additivity in Binary Glasses | `TIER-4` | Gordon & Taylor (1952); Literature | "Mixture $T_g$ can be approximated via component densities and $T_g$ values."| "Gordon-Taylor accounts for specific hydrogen-bonding contractions."| Classic polymer physics model; assumes ideal volume additivity without mixing volume. | Module 01, 03 |
| **EGL-25** | Davis-Kahan Eigenspace Perturbation | `TIER-4` | Davis & Kahan (1970); Linear Algebra | "Distance between sample and true eigenspaces is bounded by $\|E\| / \delta_K$."| "Eigengap proves physical reality of chemical bonds." | Rigorous spectral perturbation theorem in numerical linear algebra. | Module 04, 12 |
| **EGL-26** | Room-Temperature Crystallization Shelf-Life| `TIER-5`| ICH Q1A Guidelines | "Shelf-life requires empirical accelerated stability testing under ICH conditions."| "PharmaPolySCOPE predicts a 2-year shelf-life at 25°C/60% RH." | Real crystallization depends on nucleation barriers and moisture sorption. | Module 01, 08 |
| **EGL-27** | Experimental Dissolution Rate | `TIER-5` | USP Dissolution Testing | "Dissolution rate enhancement must be measured experimentally in dissolution baths."| "Soluplus is guaranteed to have faster dissolution than HPMC E5." | Dissolution involves hydrodynamic boundary layers, wetting, and gel diffusion. | Module 01, 08 |
| **EGL-28** | Ternary Moisture Plasticization | `TIER-5` | Rumondor et al. (2009) | "Moisture sorption significantly lowers $T_g$ and accelerates crystallization."| "Our dry-state model accounts for ambient relative humidity." | Water is a potent plasticizer ($T_g \approx 136\text{ K}$); dry model does not simulate water. | Module 01, 03 |
| **EGL-29** | Hot-Melt Extrusion (HME) Processability | `TIER-6` | Pharmaceutical Engineering | "Processing torque and thermal degradation are outside the mathematical model."| "Our model proves Soluplus extrudes easily at 160°C." | Processing depends on melt rheology, viscosity, and degradation kinetics. | Module 01, 07 |
| **EGL-30** | In-Vivo Oral Bioavailability (AUC / $C_{\max}$) | `TIER-6` | Biopharmaceutics | "In-vivo pharmacokinetics and intestinal absorption are outside model scope." | "Soluplus formulation guarantees high bioavailability in humans." | Absorption depends on intestinal permeability, efflux pumps, and hepatic clearance. | Module 01 |
| **EGL-31** | Tableting Compressibility & Tensile Strength | `TIER-6` | Solid Dosage Manufacturing | "Powder compaction and tablet tensile strength are outside model scope." | "Soluplus tablets have superior hardness." | Mechanical properties require compaction simulators and Heckel analysis. | Module 01 |
| **EGL-32** | Polymer Molecular Weight Polydispersity | `TIER-6` | Polymer Chemistry | "The model uses fixed repeat-unit structures, ignoring batch polydispersity ($M_w/M_n$)."| "Our model captures polymer chain-length distributions." | Group contribution methods assume uniform, infinitely long or average chains. | Module 02, 03 |

---

## 4. Epistemic Boundary Enforcement Protocol

When defending PharmaPolySCOPE under examination:
1. **Never promote a claim to a higher tier:** A Tier-3 methodological diagnostic ($s_{\text{GT}}$) must never be asserted as a Tier-5 physical reality (shelf-life).
2. **Never claim model coverage for Tier-6:** Immediately concede that manufacturing, PK/PD, and compaction are outside model scope.
3. **Assert Tier-1 and Tier-2 with absolute precision:** Cite exact lines of code and numbers from Module 12 to demonstrate rigorous technical command.
