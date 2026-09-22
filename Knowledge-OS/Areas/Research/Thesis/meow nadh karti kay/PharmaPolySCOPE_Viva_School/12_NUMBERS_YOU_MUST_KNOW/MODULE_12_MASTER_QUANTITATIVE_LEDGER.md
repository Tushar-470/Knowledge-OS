# MODULE 12 — MASTER QUANTITATIVE LEDGER
# PharmaPolySCOPE v2 Authoritative Numerical Canon & Provenance Ledger

**Document ID:** `MODULE_12_MASTER_QUANTITATIVE_LEDGER`  
**Module:** Module 12 — Numbers You Must Know (`12_NUMBERS_YOU_MUST_KNOW/`)  
**Phase:** Phase 9 Execution & Forensic Repair (Module 11 → Module 12 Handoff)  
**Authoritative Repositories Inspected:**  
- Production Source: `asd_framework/src/asd_mcda/v2/` (Git commit: `220ba4c`, v1.5 freeze: `31eee4d`)  
- Scientific Validation: `results/validation/v2_scientific_validation/scientific_validation_results.json`  
- Counterfactual Lab Dataset: `11_COUNTERFACTUAL_LAB/PHASE_8_EXECUTION_RESULTS.json`  
- Reverse Engineering Canon: `10_REVERSE_ENGINEERING/02_INDOMETHACIN_FULL_NUMERICAL_TRACE.md`  
**Auditor:** Forensic Computational-Science Architect & PhD Methodology Auditor  
**Date:** September 23, 2026  
**Status:** **AUTHORITATIVE IMMUTABLE LEDGER (REPAIRED & SOURCE-LOCKED)**  

---

## 1. Methodological & Precision Governance

### 1.1 Resolution of Pipeline Stage Enumeration
In accordance with the critical audit rule, the pipeline stages are formally reconciled across architectural boundaries:
- **Core Engine Algorithm:** Exactly **10 internal algorithmic steps** in `VariableKEngine.evaluate()` (`src/asd_mcda/v2/engine.py`): Steps 0 through 9 plus final immutable snapshot aggregation.
- **End-to-End Operational Pipeline:** Exactly **15 conceptual stages** in `07_SOFTWARE_ARCHITECTURE/03_DATA_FLOW_INPUT_TO_OUTPUT.md`, spanning input ingestion through multi-format artifact export.
- **Reverse-Engineering Trace:** Exactly **15 numerical stages** in `10_REVERSE_ENGINEERING/02_INDOMETHACIN_FULL_NUMERICAL_TRACE.md`.
- **Quantitative Item Taxonomy:** Exactly **29 distinct quantitative clusters** (Clusters A through AC) encompassing all 90 parameters itemized below.

### 1.2 Dual-Tier Precision Policy
To prevent conflating IEEE 754 float64 machine storage with scientifically supported precision:
1. **Raw Machine Record (float64):** Preserves the full unrounded floating-point representation (up to 16 decimal digits) as extracted from machine JSON and code ASTs, ensuring bitwise repeatability and programmatic verification.
2. **Viva Reporting Precision:** Presents the scientifically defensible, pedagogically rounded value appropriate for oral viva defense (e.g., $\delta_3 pprox 0.7383$, cumulative variance $pprox 99.96\%$, $MW = 357.79	ext{ g/mol}$). Stored precision must never be misrepresented as physical measurement precision.

### 1.3 Audit of 90-Item Parameter Uniqueness
An independent uniqueness audit confirms that entries **NUM-001 through NUM-090** represent 90 genuinely distinct quantitative entities partitioned across 8 operational categories:
- *Category 1 (NUM-001–NUM-015):* 15 distinct molecular and physicochemical descriptors of Indomethacin.
- *Category 2 (NUM-016–NUM-021):* 6 pipeline constants (normalizers, sub-weights, drug loading).
- *Category 3 (NUM-022–NUM-041):* 20 distinct elements of the raw decision matrix $S$ (5 polymers $	imes$ 4 criteria).
- *Category 4 (NUM-042–NUM-050):* 9 cohort standardization parameters (4 means, 4 standard deviations, 1 zero-variance guardrail).
- *Category 5 (NUM-051–NUM-060):* 10 PCA spectral parameters (4 eigenvalues, cumulative variance, threshold, dimension $K$, eigengap, 2 governance thresholds).
- *Category 6 (NUM-061–NUM-070):* 10 AHP preference parameters ($\lambda_{\max}$, $CI$, $RI_4$, $CR$, $CR$ gate, 4 weights, reciprocity tolerance).
- *Category 7 (NUM-071–NUM-084):* 14 candidate ranking outputs ($5 	imes C_L$, 2 ideal distances, 2 anti-ideal distances, $5 	imes p_{	ext{top1}}$).
- *Category 8 (NUM-085–NUM-090):* 6 Monte Carlo simulation metrics ($N_{	ext{gen}}$, $N_{	ext{valid}}$, $N_{	ext{blk}}$, $CR$ blocks, eigengap blocks, seed).

Zero duplicate numerical facts exist under separate IDs.

---

## 2. Master Quantitative Ledger (NUM-001 through NUM-090)

The ledger follows the standard schema:
`ID | Quantity & Symbol | Raw Machine Value | Viva Reporting Value | Unit | Equation / Definition | Source File & Location | Status | Viva Role | Notes`

### Category 1: Molecular & Physicochemical Descriptors (Indomethacin Baseline)

| ID | Quantity & Symbol | Raw Machine Value | Viva Reporting Value | Unit | Equation / Definition | Primary Source & Location | Status | Viva Role | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- | :--- |
| **NUM-001** | Molecular Weight ($MW$) | 357.793 | 357.79 | g/mol | Sum of atomic weights | `scientific_validation_results.json` (`cohorts.IND-001-2026.molecular_weight`) | ESTABLISHED | MUST MEMORIZE EXACTLY | Indomethacin free acid ($C_{19}H_{16}ClNO_4$). |
| **NUM-002** | Calculated $\log P$ | 3.927320 | 3.93 | dimensionless | Wildman-Crippen atom-based $\log P$ | `scientific_validation_results.json` (`cohorts.IND-001-2026.logp`) | ESTABLISHED | MEMORIZE APPROXIMATELY | Moderately lipophilic BCS Class II compound. |
| **NUM-003** | Polar Surface Area ($TPSA$) | 68.53 | 68.53 | Å² | Ertl topological polar fragment sum | `scientific_validation_results.json` (`cohorts.IND-001-2026.tpsa`) | ESTABLISHED | MEMORIZE APPROXIMATELY | Normalized by $200.0	ext{ \AA}^2$ in $s_{	ext{desc}}$. |
| **NUM-004** | H-Bond Donors ($HBD$) | 1 | 1 | count | OH and NH heteroatom count | `scientific_validation_results.json` (`cohorts.IND-001-2026.hbd`) | ESTABLISHED | MUST MEMORIZE EXACTLY | Carboxylic acid proton donor. |
| **NUM-005** | H-Bond Acceptors ($HBA$) | 3 | 3 | count | N and O heteroatom count | `scientific_validation_results.json` (`cohorts.IND-001-2026.hba`) | ESTABLISHED | MUST MEMORIZE EXACTLY | Carbonyl, ether, and indole/benzoyl oxygens. |
| **NUM-006** | Rotatable Bonds ($N_{	ext{rot}}$) | 4 | 4 | count | Non-ring single bonds to non-H | `scientific_validation_results.json` (`cohorts.IND-001-2026.rotatable_bonds`) | ESTABLISHED | MEMORIZE APPROXIMATELY | Conformational flexibility indicator. |
| **NUM-007** | Aromatic Rings ($N_{	ext{arom}}$) | 3 | 3 | count | Count of aromatic ring systems | `scientific_validation_results.json` (`cohorts.IND-001-2026.aromatic_rings`) | ESTABLISHED | MUST MEMORIZE EXACTLY | Chlorophenyl, indole benzene, and pyrrole rings. |
| **NUM-008** | Crystalline Density ($ho_{	ext{cryst}}$) | 1.31 | 1.31 | g/cm³ | Single-crystal X-ray diffraction density | `scientific_validation_results.json` (`cohorts.IND-001-2026.density_crystalline`) | ESTABLISHED | MEMORIZE APPROXIMATELY | Authoritative physical crystalline density. |
| **NUM-009** | Amorphous Density ($ho_{	ext{amorphous}}$) | 1.22 | 1.22 | g/cm³ | Experimental/estimated amorphous density | `scientific_validation_results.json` (`cohorts.IND-001-2026.density_amorphous`) | ESTABLISHED | MEMORIZE APPROXIMATELY | Used to calculate molar volume. |
| **NUM-010** | Molar Volume ($V_m$) | 273.0 | 273.0 | cm³/mol | $V_m = MW / ho_{	ext{amorphous}}$ | `scientific_validation_results.json` (`cohorts.IND-001-2026.molar_volume`) | ESTABLISHED | MUST MEMORIZE EXACTLY | Key parameter in Flory-Huggins $\chi$ lattice volume. |
| **NUM-011** | Glass Transition Temp ($T_g$) | 315.15 | 315.15 ($42.0^\circ	ext{C}$) | K | Experimental DSC glass transition onset | `scientific_validation_results.json` (`cohorts.IND-001-2026.tg_k`) | ESTABLISHED | MUST MEMORIZE EXACTLY | Baseline amorphous drug $T_g$. |
| **NUM-012** | Melting Temperature ($T_m$) | 433.15 | 433.15 ($160.0^\circ	ext{C}$) | K | Experimental DSC crystalline melting point | `scientific_validation_results.json` (`cohorts.IND-001-2026.tm_k`) | ESTABLISHED | MEMORIZE APPROXIMATELY | Stable crystalline form melting onset. |
| **NUM-013** | Hansen Dispersive ($\delta_d$) | 19.2 | 19.2 | MPa½ | Dispersive cohesive energy density | `scientific_validation_results.json` (`cohorts.IND-001-2026.hsp[0]`) | ESTABLISHED | MEMORIZE APPROXIMATELY | Hansen parameter component. |
| **NUM-014** | Hansen Polar ($\delta_p$) | 7.9 | 7.9 | MPa½ | Polar cohesive energy density | `scientific_validation_results.json` (`cohorts.IND-001-2026.hsp[1]`) | ESTABLISHED | MEMORIZE APPROXIMATELY | Hansen parameter component. |
| **NUM-015** | Hansen Hydrogen-Bonding ($\delta_h$) | 8.4 | 8.4 | MPa½ | Hydrogen bonding cohesive energy density | `scientific_validation_results.json` (`cohorts.IND-001-2026.hsp[2]`) | ESTABLISHED | MEMORIZE APPROXIMATELY | Hansen parameter component. |

### Category 2: Pipeline Constants & Normalizers

| ID | Quantity & Symbol | Raw Machine Value | Viva Reporting Value | Unit | Equation / Definition | Primary Source & Location | Status | Viva Role | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- | :--- |
| **NUM-016** | TPSA Normalizer ($TPSA_{	ext{norm}}$) | 200.0 | 200.0 | Å² | Arbitrary ceiling normalizer for TPSA | `src/asd_mcda/compatibility/matrix.py:85` | FROZEN | KNOW THE THRESHOLD | Bounds polar contribution in $s_{	ext{desc}}$. |
| **NUM-017** | Descriptor Sub-Weight $w_{	ext{HBD}}$ | 0.30 | 0.30 | dimensionless | Weight for H-bond donors in $s_{	ext{desc}}$ | `src/asd_mcda/compatibility/matrix.py:92` | FROZEN | KNOW THE THRESHOLD | Composite descriptor weight. |
| **NUM-018** | Descriptor Sub-Weight $w_{	ext{HBA}}$ | 0.30 | 0.30 | dimensionless | Weight for H-bond acceptors in $s_{	ext{desc}}$ | `src/asd_mcda/compatibility/matrix.py:93` | FROZEN | KNOW THE THRESHOLD | Composite descriptor weight. |
| **NUM-019** | Descriptor Sub-Weight $w_{	ext{TPSA}}$ | 0.20 | 0.20 | dimensionless | Weight for polar surface area in $s_{	ext{desc}}$ | `src/asd_mcda/compatibility/matrix.py:94` | FROZEN | KNOW THE THRESHOLD | Composite descriptor weight. |
| **NUM-020** | Descriptor Sub-Weight $w_{	ext{arom}}$ | 0.20 | 0.20 | dimensionless | Weight for aromatic rings in $s_{	ext{desc}}$ | `src/asd_mcda/compatibility/matrix.py:95` | FROZEN | KNOW THE THRESHOLD | Composite descriptor weight. |
| **NUM-021** | Default Drug Loading ($w_{	ext{drug}}$) | 0.30 | 0.30 ($30\%$ w/w) | weight fraction | Assumed drug mass fraction in GT equation | `src/asd_mcda/compatibility/matrix.py:104` | FROZEN | MUST MEMORIZE EXACTLY | Standard screening formulation baseline. |

### Category 3: Raw Four-Criterion Compatibility Matrix $S$ (Indomethacin Cohort)

| ID | Quantity & Symbol | Raw Machine Value | Viva Reporting Value | Candidate Polymer | Primary Source & Location | Status | Viva Role | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- | :--- |
| **NUM-022** | $s_{	ext{HSP}}$ (Soluplus) | 0.7971877407551506 | 0.7972 | Soluplus | `scientific_validation_results.json` (`ranking[0].s_HSP`) | ESTABLISHED | MEMORIZE APPROXIMATELY | Highest HSP proximity in cohort. |
| **NUM-023** | $s_\chi$ (Soluplus) | 0.8260544677222139 | 0.8261 | Soluplus | `scientific_validation_results.json` (`ranking[0].s_chi`) | ESTABLISHED | MEMORIZE APPROXIMATELY | Highest Flory-Huggins compatibility score. |
| **NUM-024** | $s_{	ext{desc}}$ (Soluplus) | 0.3259730000000000 | 0.3260 | Soluplus | `scientific_validation_results.json` (`ranking[0].s_desc`) | ESTABLISHED | MEMORIZE APPROXIMATELY | Moderate functional descriptor similarity. |
| **NUM-025** | $s_{	ext{GT}}$ (Soluplus) | 0.0000000000000000 | 0.0000 | Soluplus | `scientific_validation_results.json` (`ranking[0].s_GT`) | ESTABLISHED | MUST MEMORIZE EXACTLY | Scored 0 (predicted mixture $T_g < 50^\circ	ext{C}$). |
| **NUM-026** | $s_{	ext{HSP}}$ (HPMC E5) | 0.7521183498118508 | 0.7521 | HPMC E5 | `scientific_validation_results.json` (`ranking[1].s_HSP`) | ESTABLISHED | MEMORIZE APPROXIMATELY | Second highest HSP score. |
| **NUM-027** | $s_\chi$ (HPMC E5) | 0.7401554394368874 | 0.7402 | HPMC E5 | `scientific_validation_results.json` (`ranking[1].s_chi`) | ESTABLISHED | MEMORIZE APPROXIMATELY | Favorable interaction parameter score. |
| **NUM-028** | $s_{	ext{desc}}$ (HPMC E5) | 0.3941500000000000 | 0.3942 | HPMC E5 | `scientific_validation_results.json` (`ranking[1].s_desc`) | ESTABLISHED | MEMORIZE APPROXIMATELY | High cellulosic descriptor match. |
| **NUM-029** | $s_{	ext{GT}}$ (HPMC E5) | 0.9731227201350760 | 0.9731 | HPMC E5 | `scientific_validation_results.json` (`ranking[1].s_GT`) | ESTABLISHED | MUST MEMORIZE EXACTLY | Strong glass transition elevation. |
| **NUM-030** | $s_{	ext{HSP}}$ (PVP-VA64) | 0.7073157631507977 | 0.7073 | PVP-VA64 | `scientific_validation_results.json` (`ranking[2].s_HSP`) | ESTABLISHED | MEMORIZE APPROXIMATELY | Copolymer score. |
| **NUM-031** | $s_\chi$ (PVP-VA64) | 0.6377373672505366 | 0.6377 | PVP-VA64 | `scientific_validation_results.json` (`ranking[2].s_chi`) | ESTABLISHED | MEMORIZE APPROXIMATELY | Intermediate compatibility score. |
| **NUM-032** | $s_{	ext{desc}}$ (PVP-VA64) | 0.2941760000000000 | 0.2942 | PVP-VA64 | `scientific_validation_results.json` (`ranking[2].s_desc`) | ESTABLISHED | MEMORIZE APPROXIMATELY | Descriptor score. |
| **NUM-033** | $s_{	ext{GT}}$ (PVP-VA64) | 0.2367563570253174 | 0.2368 | PVP-VA64 | `scientific_validation_results.json` (`ranking[2].s_GT`) | ESTABLISHED | MEMORIZE APPROXIMATELY | Moderate $T_g$ elevation. |
| **NUM-034** | $s_{	ext{HSP}}$ (PVP K30) | 0.6941967544318732 | 0.6942 | PVP K30 | `scientific_validation_results.json` (`ranking[3].s_HSP`) | ESTABLISHED | MEMORIZE APPROXIMATELY | Homopolymer score. |
| **NUM-035** | $s_\chi$ (PVP K30) | 0.6045340890094775 | 0.6045 | PVP K30 | `scientific_validation_results.json` (`ranking[3].s_chi`) | ESTABLISHED | MEMORIZE APPROXIMATELY | Intermediate compatibility score. |
| **NUM-036** | $s_{	ext{desc}}$ (PVP K30) | 0.2517800000000000 | 0.2518 | PVP K30 | `scientific_validation_results.json` (`ranking[3].s_desc`) | ESTABLISHED | MEMORIZE APPROXIMATELY | Descriptor score. |
| **NUM-037** | $s_{	ext{GT}}$ (PVP K30) | 0.9848222546401791 | 0.9848 | PVP K30 | `scientific_validation_results.json` (`ranking[3].s_GT`) | ESTABLISHED | MUST MEMORIZE EXACTLY | Highest GT score in cohort ($T_g = 441.15	ext{ K}$). |
| **NUM-038** | $s_{	ext{HSP}}$ (Eudragit E PO) | 0.6358872084092624 | 0.6359 | Eudragit E PO | `scientific_validation_results.json` (`ranking[4].s_HSP`) | ESTABLISHED | MEMORIZE APPROXIMATELY | Lowest HSP proximity in cohort. |
| **NUM-039** | $s_\chi$ (Eudragit E PO) | 0.4393436499992346 | 0.4393 | Eudragit E PO | `scientific_validation_results.json` (`ranking[4].s_chi`) | ESTABLISHED | MEMORIZE APPROXIMATELY | Lowest Flory-Huggins score. |
| **NUM-040** | $s_{	ext{desc}}$ (Eudragit E PO) | 0.4093900000000000 | 0.4094 | Eudragit E PO | `scientific_validation_results.json` (`ranking[4].s_desc`) | ESTABLISHED | MEMORIZE APPROXIMATELY | Highest descriptor score in cohort. |
| **NUM-041** | $s_{	ext{GT}}$ (Eudragit E PO) | 0.0000000000000000 | 0.0000 | Eudragit E PO | `scientific_validation_results.json` (`ranking[4].s_GT`) | ESTABLISHED | MUST MEMORIZE EXACTLY | Scored 0 (polymer $T_g = 323.15	ext{ K}$ causes depression). |

### Category 4: Cohort Population Moments ($	ext{ddof}=0$) & Standardization

| ID | Quantity & Symbol | Raw Machine Value | Viva Reporting Value | Unit | Primary Source & Location | Status | Viva Role | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- | :--- |
| **NUM-042** | Mean $s_{	ext{HSP}}$ ($\mu_1$) | 0.7173411633117869 | 0.7173 | dimensionless | `Module 10 Trace 02` (Stage 3) | DERIVED | DO NOT MEMORIZE | Cohort mean for Criterion 1. |
| **NUM-043** | Mean $s_\chi$ ($\mu_2$) | 0.6495649996036700 | 0.6496 | dimensionless | `Module 10 Trace 02` (Stage 3) | DERIVED | DO NOT MEMORIZE | Cohort mean for Criterion 2. |
| **NUM-044** | Mean $s_{	ext{desc}}$ ($\mu_3$) | 0.3350938000000000 | 0.3351 | dimensionless | `Module 10 Trace 02` (Stage 3) | DERIVED | DO NOT MEMORIZE | Cohort mean for Criterion 3. |
| **NUM-045** | Mean $s_{	ext{GT}}$ ($\mu_4$) | 0.4389402663601145 | 0.4389 | dimensionless | `Module 10 Trace 02` (Stage 3) | DERIVED | DO NOT MEMORIZE | Cohort mean for Criterion 4. |
| **NUM-046** | Population Std $s_{	ext{HSP}}$ ($\sigma_1$) | 0.0544256247343277 | 0.0544 | dimensionless | `Module 10 Trace 02` (Stage 3) | DERIVED | DO NOT MEMORIZE | Population std ($	ext{ddof}=0$). |
| **NUM-047** | Population Std $s_\chi$ ($\sigma_2$) | 0.1340150993077651 | 0.1340 | dimensionless | `Module 10 Trace 02` (Stage 3) | DERIVED | DO NOT MEMORIZE | Population std ($	ext{ddof}=0$). |
| **NUM-048** | Population Std $s_{	ext{desc}}$ ($\sigma_3$) | 0.0583496929424653 | 0.0583 | dimensionless | `Module 10 Trace 02` (Stage 3) | DERIVED | DO NOT MEMORIZE | Population std ($	ext{ddof}=0$). |
| **NUM-049** | Population Std $s_{	ext{GT}}$ ($\sigma_4$) | 0.4578139572459918 | 0.4578 | dimensionless | `Module 10 Trace 02` (Stage 3) | DERIVED | DO NOT MEMORIZE | Population std ($	ext{ddof}=0$). |
| **NUM-050** | Zero-Variance Guardrail ($\sigma_{\min}^2$) | 1e-08 | 1e-08 | dimensionless | `src/asd_mcda/v2/standardization.py:28` | FROZEN | MUST MEMORIZE EXACTLY | Minimum column variance; raises `ZeroVarianceStandardizationError`. |

### Category 5: Spectral Decomposition & Dynamic Subspace Governance

| ID | Quantity & Symbol | Raw Machine Value | Viva Reporting Value | Unit | Primary Source & Location | Status | Viva Role | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- | :--- |
| **NUM-051** | Eigenvalue 1 ($\lambda_1$) | 2.0908657741533783 | 2.0909 | dimensionless | `scientific_validation_results.json` (`eigenvalues[0]`) | ESTABLISHED | MEMORIZE APPROXIMATELY | Captures $52.27\%$ of cohort variance. |
| **NUM-052** | Eigenvalue 2 ($\lambda_2$) | 1.1678952418522826 | 1.1679 | dimensionless | `scientific_validation_results.json` (`eigenvalues[1]`) | ESTABLISHED | MEMORIZE APPROXIMATELY | Captures $29.20\%$ of cohort variance. |
| **NUM-053** | Eigenvalue 3 ($\lambda_3$) | 0.7397747065453792 | 0.7398 | dimensionless | `scientific_validation_results.json` (`eigenvalues[2]`) | ESTABLISHED | MEMORIZE APPROXIMATELY | Captures $18.50\%$ of cohort variance. |
| **NUM-054** | Eigenvalue 4 ($\lambda_4$) | 0.0014642774489659 | 0.0015 | dimensionless | `scientific_validation_results.json` (`eigenvalues[3]`) | ESTABLISHED | MEMORIZE APPROXIMATELY | Trailing component ($0.037\%$). |
| **NUM-055** | Cumulative Variance ($K=3$) | 0.9996339306377600 | 99.96% (0.9996) | fraction | `scientific_validation_results.json` (`cumulative_variance`) | ESTABLISHED | MUST MEMORIZE EXACTLY | Triggers $	au_{	ext{var}} \ge 0.95$ stopping rule. |
| **NUM-056** | Variance Cutoff Threshold ($	au_{	ext{var}}$) | 0.95 | 0.95 ($95.0\%$) | fraction | `src/asd_mcda/v2/pca.py:35` | FROZEN | MUST MEMORIZE EXACTLY | Dynamic cumulative variance requirement. |
| **NUM-057** | Retained Subspace Dimension ($K$) | 3 | 3 | count | `scientific_validation_results.json` (`k`) | ESTABLISHED | MUST MEMORIZE EXACTLY | Number of principal components retained. |
| **NUM-058** | Boundary Eigengap ($\delta_3$) | 0.7383104290964133 | 0.7383 | dimensionless | `scientific_validation_results.json` (`boundary_eigengap`) | ESTABLISHED | MUST MEMORIZE EXACTLY | $\delta_3 = \lambda_3 - \lambda_4 \ge 0.10 \implies$ `STABLE`. |
| **NUM-059** | Eigengap Stable Threshold | 0.10 | 0.10 | dimensionless | `src/asd_mcda/v2/stability.py:22` | FROZEN | MUST MEMORIZE EXACTLY | Minimum separation for stable orientation. |
| **NUM-060** | Eigengap Block Threshold | 0.03 | 0.03 | dimensionless | `src/asd_mcda/v2/stability.py:23` | FROZEN | MUST MEMORIZE EXACTLY | Halts pipeline (`DegenerateSubspaceBlockedError`). |

### Category 6: AHP Preference Weighting & Consistency

| ID | Quantity & Symbol | Raw Machine Value | Viva Reporting Value | Unit | Primary Source & Location | Status | Viva Role | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- | :--- |
| **NUM-061** | AHP Principal Eigenvalue ($\lambda_{\max}$) | 4.131937073898666 | 4.1319 | dimensionless | `scientific_validation_results.json` (`ahp.lambda_max`) | ESTABLISHED | MUST MEMORIZE EXACTLY | Power iteration root for authoritative $4 	imes 4$ matrix. |
| **NUM-062** | AHP Consistency Index ($CI$) | 0.0439790246328885 | 0.0440 | dimensionless | `scientific_validation_results.json` (`ahp.consistency_index`) | ESTABLISHED | MUST MEMORIZE EXACTLY | $CI = (\lambda_{\max} - 4) / 3$. |
| **NUM-063** | Saaty Random Index ($RI_4$) | 0.89 | 0.89 | dimensionless | `src/asd_mcda/v2/ahp.py:18` | FROZEN | MUST MEMORIZE EXACTLY | Hard-coded Saaty index for $n=4$. |
| **NUM-064** | AHP Consistency Ratio ($CR$) | 0.04941463441897588| 0.0494 | dimensionless | `scientific_validation_results.json` (`ahp.consistency_ratio`) | ESTABLISHED | MUST MEMORIZE EXACTLY | $CR = CI / 0.89 < 0.08 \implies$ `ACCEPTED`. |
| **NUM-065** | AHP Consistency Gate Threshold | 0.08 | 0.08 | dimensionless | `src/asd_mcda/v2/ahp.py:24` | FROZEN | MUST MEMORIZE EXACTLY | Halts pipeline (`AHPConsistencyViolationError`). |
| **NUM-066** | Preference Weight $w(s_{	ext{HSP}})$ | 0.4076747839698376 | 0.4077 ($40.77\%$) | fraction | `scientific_validation_results.json` (`ahp.weights[0]`) | ESTABLISHED | MUST MEMORIZE EXACTLY | Decision preference assigned to $s_{	ext{HSP}}$. |
| **NUM-067** | Preference Weight $w(s_\chi)$ | 0.3244334086555162 | 0.3244 ($32.44\%$) | fraction | `scientific_validation_results.json` (`ahp.weights[1]`) | ESTABLISHED | MUST MEMORIZE EXACTLY | Decision preference assigned to $s_\chi$. |
| **NUM-068** | Preference Weight $w(s_{	ext{desc}})$ | 0.09216133794843878| 0.0922 ($9.22\%$) | fraction | `scientific_validation_results.json` (`ahp.weights[2]`) | ESTABLISHED | MUST MEMORIZE EXACTLY | Decision preference assigned to $s_{	ext{desc}}$. |
| **NUM-069** | Preference Weight $w(s_{	ext{GT}})$ | 0.1757304694262072 | 0.1757 ($17.57\%$) | fraction | `scientific_validation_results.json` (`ahp.weights[3]`) | ESTABLISHED | MUST MEMORIZE EXACTLY | Decision preference assigned to $s_{	ext{GT}}$. |
| **NUM-070** | AHP Reciprocity Tolerance | 1e-12 | 1e-12 | dimensionless | `src/asd_mcda/v2/ahp.py:45` | FROZEN | KNOW THE THRESHOLD | Preserves $|a_{ji} a_{ij} - 1| < 10^{-12}$. |

### Category 7: Relative Closeness Scores ($C_L$), Distances & Top-1 Frequencies

| ID | Quantity & Symbol | Raw Machine Value | Viva Reporting Value | Candidate Polymer | Primary Source & Location | Status | Viva Role | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- | :--- |
| **NUM-071** | Soluplus $C_L$ (Rank 1) | 0.6864350839750771 | 0.6864 | Soluplus | `scientific_validation_results.json` (`ranking[0].topsis_cl`) | ESTABLISHED | MUST MEMORIZE EXACTLY | Top-ranked candidate score. |
| **NUM-072** | Soluplus $D^+$ | 4.18260400161078 | 4.1826 | Soluplus | `scientific_validation_results.json` (`ranking[0].distance_ideal_d_plus`) | ESTABLISHED | MEMORIZE APPROXIMATELY | Positive ideal quadratic distance. |
| **NUM-073** | Soluplus $D^-$ | 9.156273493466944 | 9.1563 | Soluplus | `scientific_validation_results.json` (`ranking[0].distance_anti_ideal_d_minus`) | ESTABLISHED | MEMORIZE APPROXIMATELY | Anti-ideal quadratic distance. |
| **NUM-074** | Soluplus $p_{	ext{top1}}$ | 0.5551162790697675 | 55.51% (4,774 / 8,600) | Soluplus | `scientific_validation_results.json` (`ranking[0].mc_p_top1`) | ESTABLISHED | MUST MEMORIZE EXACTLY | Top-1 frequency over valid MC replicates. |
| **NUM-075** | HPMC E5 $C_L$ (Rank 2) | 0.6731464918436223 | 0.6731 | HPMC E5 | `scientific_validation_results.json` (`ranking[1].topsis_cl`) | ESTABLISHED | MUST MEMORIZE EXACTLY | Rank 2 candidate score. |
| **NUM-076** | HPMC E5 $D^+$ | 4.196083764580734 | 4.1961 | HPMC E5 | `scientific_validation_results.json` (`ranking[1].distance_ideal_d_plus`) | ESTABLISHED | MEMORIZE APPROXIMATELY | Positive ideal quadratic distance. |
| **NUM-077** | HPMC E5 $D^-$ | 8.641727853990561 | 8.6417 | HPMC E5 | `scientific_validation_results.json` (`ranking[1].distance_anti_ideal_d_minus`) | ESTABLISHED | MEMORIZE APPROXIMATELY | Anti-ideal quadratic distance. |
| **NUM-078** | HPMC E5 $p_{	ext{top1}}$ | 0.4200000000000000 | 42.00% (3,612 / 8,600) | HPMC E5 | `scientific_validation_results.json` (`ranking[1].mc_p_top1`) | ESTABLISHED | MUST MEMORIZE EXACTLY | Top-1 frequency over valid MC replicates. |
| **NUM-079** | PVP-VA64 $C_L$ (Rank 3) | 0.6062468903318390 | 0.6062 | PVP-VA64 | `scientific_validation_results.json` (`ranking[2].topsis_cl`) | ESTABLISHED | MEMORIZE APPROXIMATELY | Rank 3 candidate score. |
| **NUM-080** | PVP-VA64 $p_{	ext{top1}}$ | 0.01383720930232558| 1.38% (119 / 8,600) | PVP-VA64 | `scientific_validation_results.json` (`ranking[2].mc_p_top1`) | ESTABLISHED | MEMORIZE APPROXIMATELY | Top-1 frequency over valid MC replicates. |
| **NUM-081** | PVP K30 $C_L$ (Rank 4) | 0.5875839043102030 | 0.5876 | PVP K30 | `scientific_validation_results.json` (`ranking[3].topsis_cl`) | ESTABLISHED | MEMORIZE APPROXIMATELY | Rank 4 candidate score. |
| **NUM-082** | PVP K30 $p_{	ext{top1}}$ | 0.0055813953488372 | 0.56% (48 / 8,600) | PVP K30 | `scientific_validation_results.json` (`ranking[3].mc_p_top1`) | ESTABLISHED | MEMORIZE APPROXIMATELY | Top-1 frequency over valid MC replicates. |
| **NUM-083** | Eudragit E PO $C_L$ (Rank 5) | 0.5456162037572858 | 0.5456 | Eudragit E PO | `scientific_validation_results.json` (`ranking[4].topsis_cl`) | ESTABLISHED | MEMORIZE APPROXIMATELY | Rank 5 candidate score. |
| **NUM-084** | Eudragit E PO $p_{	ext{top1}}$ | 0.0054651162790697 | 0.55% (47 / 8,600) | Eudragit E PO | `scientific_validation_results.json` (`ranking[4].mc_p_top1`) | ESTABLISHED | MEMORIZE APPROXIMATELY | Top-1 frequency over valid MC replicates. |

### Category 8: Monte Carlo Uncertainty Parameters

| ID | Quantity & Symbol | Raw Machine Value | Viva Reporting Value | Unit | Primary Source & Location | Status | Viva Role | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- | :--- |
| **NUM-085** | Total Replicates ($N_{	ext{gen}}$) | 10000 | 10,000 | count | `src/asd_mcda/v2/uncertainty.py:145` | FROZEN | MUST MEMORIZE EXACTLY | Total generated replicates budget. |
| **NUM-086** | Valid Replicates ($N_{	ext{valid}}$) | 8600 | 8,600 ($86.00\%$) | count | `scientific_validation_results.json` (`monte_carlo.num_valid_replicates`) | ESTABLISHED | MUST MEMORIZE EXACTLY | Replicates satisfying all governance gates. |
| **NUM-087** | Blocked Replicates ($N_{	ext{blk}}$) | 1400 | 1,400 ($14.00\%$) | count | `scientific_validation_results.json` (`monte_carlo.num_blocked_replicates`) | ESTABLISHED | MUST MEMORIZE EXACTLY | $10,000 - 8,600 = 1,400$. |
| **NUM-088** | AHP CR Blocks ($N_{	ext{AHP\_CR}}$)| 1396 | 1,396 ($99.71\%$ of blocks)| count | `scientific_validation_results.json` (`block_reasons.AHP_CR_BLOCKED`) | ESTABLISHED | MUST MEMORIZE EXACTLY | Replicates blocked by $CR \ge 0.08$. |
| **NUM-089** | Eigengap Blocks ($N_{	ext{eig}}$) | 4 | 4 ($0.29\%$ of blocks) | count | `scientific_validation_results.json` (`block_reasons.EIGENGAP_BLOCKED`) | ESTABLISHED | MUST MEMORIZE EXACTLY | Replicates blocked by $\delta_K < 0.03$. |
| **NUM-090** | Monte Carlo Random Seed | 42 | 42 | integer | `src/asd_mcda/v2/uncertainty.py:144` | FROZEN | MUST MEMORIZE EXACTLY | Pseudorandom initialization seed. |
