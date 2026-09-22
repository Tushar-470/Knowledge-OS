# Module 08 — Validation & Reproducibility
# Document 06: Input Data and Cheminformatics Integrity Architecture

```
========================================================================================
PHARMAPOLYSCOPE VIVA SCHOOL — MODULE 08: VALIDATION & REPRODUCIBILITY
DOCUMENT 06: INPUT DATA AND CHEMINFORMATICS INTEGRITY ARCHITECTURE
========================================================================================
Authoritative Engine: PharmaPolySCOPE v2.0.0 (Variable-K Spectral Governance)
Framework Package: v1.5.0-FOUR-CRITERION-FREEZE | Baseline Commit: 31eee4d
Methodology: 2.0.0-SP-PRP-TOPSIS | Document Revision: 2.0.0-FINAL
Target Audience: Doctoral Candidates, Cheminformatics Specialists, Viva Examiners
========================================================================================
```

---

## 1. The GIGO Problem in Computational Drug Screening & Mandatory Input Gates

### 1.1 The Mathematical-Physical Decoupling Trap
Computational screening pipelines in pharmaceutical formulation engineering operate as composite systems: physical and thermodynamic phenomena (cohesive energy densities, Flory–Huggins interaction parameters, Gordon–Taylor glass transition modifications) are translated into numerical scores, which are subsequently aggregated through linear algebraic decision algorithms (Principal Component Analysis, spectral decomposition, Analytic Hierarchy Process metric tensor construction, and TOPSIS distance projections).

Downstream linear algebraic operations are completely agnostic to the physical meaning of their input matrices. A PCA solver computes eigenvalues and eigenvectors of a correlation matrix regardless of whether the underlying values reflect genuine laboratory measurements, valid molecular graph calculations, or arbitrary synthetic numbers. If unparseable SMILES strings, corrupted densities, or heuristic fallback constants enter the compatibility matrix, the algebraic pipeline will process them without resistance. It will calculate cumulative variance ratios, check boundary eigengaps, evaluate metric tensors, and produce ranked candidate lists formatted to four decimal places of numerical precision.

This disconnect represents the classic **Garbage-In, Garbage-Out (GIGO)** failure mode. In regulated pharmaceutical development, the danger is acute: the software outputs an apparently valid, deterministic ranking accompanied by successful execution flags, creating an illusion of scientific rigor while the underlying formulation decisions are based on computational fiction.

```
+--------------------------------------------------------------------------------------------------+
|                                    FAIL-FAST CHEMICAL GATING                                     |
|                                                                                                  |
|   Raw Input Payload (JSON / Dict / SMILES)                                                       |
|                     │                                                                            |
|                     ▼                                                                            |
|   [ Tier 1: Syntax & Type Filter ] ───────> Non-string / Empty? ──> InvalidSmilesError          |
|                     │ (Valid String)                                                             |
|                     ▼                                                                            |
|   [ Tier 2: Chemical Valence & Graph ] ───> Pentavalent C / Charge? -> RDKitSanitizationFailure  |
|                     │ (Sanitized Graph)                                                          |
|                     ▼                                                                            |
|   [ Tier 3: Stale Property Audit ] ───────> Overwrite Stored Fields with Authoritative RDKit    |
|                     │                       Log Discrepancies into descriptor_discrepancies      |
|                     ▼                                                                            |
|   [ Tier 4: Fallback Quarantine Gate ] ───> fallback_used == True? ─> ProductionFallbackProhibited|
|                     │ (Certified RDKit Descriptors)                                              |
|                     ▼                                                                            |
|   Downstream Thermodynamic Modeling & MCDA Matrix Construction (VariableKEngine)                 |
+--------------------------------------------------------------------------------------------------+
```

### 1.2 The Legacy Failure Mode
A forensic inspection of legacy computational wrappers revealed three vulnerabilities that prompted the v2 remediation:
1. **Permissive Syntactic Checks**: Legacy validation verified only that `canonical_smiles` was a non-empty string (`isinstance(smiles, str) and len(smiles) > 0`). It did not verify whether the string encoded a syntactically valid or valence-permissible molecular graph.
2. **Silent Fallback Injection**: When RDKit parsing failed on corrupt input, the legacy wrapper caught the parse exception in a permissive `try...except` block and substituted hardcoded mock descriptors ($M_w = 111.14\,\text{g/mol}$, $\text{LogP} = 0.5$, $\text{TPSA} = 20.3\,\text{Å}^2$, $\text{HBD} = 1$, $\text{HBA} = 2$). These arbitrary constants were passed directly into thermodynamic scoring models.
3. **Stale Property Retention**: Deserialization models prioritized dictionary-stored scalar keys over molecular recalculation. If a researcher altered a SMILES string (e.g., from Aspirin to Ethanol) while retaining existing scalar fields in a JSON configuration, the legacy model retained the stale Aspirin molecular weight ($180.16\,\text{g/mol}$) rather than recomputing the Ethanol molecular weight ($46.07\,\text{g/mol}$).

---

## 2. Architecture of `src/asd_mcda/v2/chemistry.py`

The module `src/asd_mcda/v2/chemistry.py` serves as the authoritative, self-contained cheminformatics validation and descriptor derivation gate for the v2 platform. It operates under two strict architectural invariants: zero modification to the frozen v1.5 baseline, and zero global monkey-patching.

### 2.1 The Six Core Functions and Signatures

1. **`is_rdkit_available() -> bool`**
   - Inspects internal module state flags resulting from the safe import of `rdkit.Chem`, `Descriptors`, `inchi`, and `rdMolDescriptors`.
   - Returns `True` if RDKit is operational in the active Python runtime; `False` otherwise.

2. **`validate_chemical_structure(smiles: str) -> Any`**
   - Enforces type safety: asserts `isinstance(smiles, str)` and non-empty content, raising `InvalidSmilesError` on violation.
   - Asserts RDKit availability: raises `RDKitUnavailableError` if the library is missing in production.
   - Parses molecular graph: invokes `Chem.MolFromSmiles(clean_smiles)`. If parser returns `None`, raises `RDKitParseFailureError`.
   - Sanitizes graph: invokes `Chem.SanitizeMol(mol, catchErrors=True)`. Validates aromaticity, explicit valences, and kekulization. If non-zero error flag returned, raises `RDKitSanitizationFailureError`.
   - Returns sanitized `rdkit.Chem.Mol` molecular graph object.

3. **`compute_production_descriptors(smiles_or_mol: Union[str, Any]) -> Dict[str, Any]`**
   - Routes input through `validate_chemical_structure` to guarantee sanitized graph.
   - Computes canonical SMILES via `Chem.MolToSmiles(mol, canonical=True)`, preserving tetrahedral stereocenters (`@`/`@@`).
   - Generates standard IUPAC InChIKey via `inchi.MolToInchiKey(mol)`.
   - Computes quantitative 2D descriptors using authoritative RDKit modules:
     * Molecular weight: `float(Descriptors.MolWt(mol))`
     * Lipophilicity: `float(Descriptors.MolLogP(mol))` (Wildman–Crippen model)
     * Topological Polar Surface Area: `float(Descriptors.TPSA(mol))`
     * Hydrogen bond donors: `int(Descriptors.NumHDonors(mol))`
     * Hydrogen bond acceptors: `int(Descriptors.NumHAcceptors(mol))`
     * Rotatable bonds: `int(Descriptors.NumRotatableBonds(mol))`
     * Aromatic rings: `int(rdMolDescriptors.CalcNumAromaticRings(mol))`
     * Fractional TPSA: `float(TPSA / MolWt)`
   - Stamped with provenance metadata: `descriptor_source="RDKit"`, `fallback_used=False`, `validation_status="VALID"`.

4. **`get_diagnostic_fallback_descriptors(smiles: str) -> Dict[str, Any]`**
   - Computes crude heuristic estimators from string lengths and character frequencies.
   - Stamped with isolation metadata: `descriptor_source="fallback"`, `fallback_used=True`, `validation_status="FALLBACK_DIAGNOSTIC"`, `inchi_key="UNKNOWN_INCHI_KEY"`.
   - Strictly quarantined diagnostic tool for offline syntax checking and frontend mock rendering. Prohibited from production decision paths.

5. **`resolve_validated_drug_snapshot(raw_data: Mapping[str, Any]) -> Dict[str, Any]`**
   - Enforces presence of `canonical_smiles`, raising `InvalidSmilesError` if missing.
   - Routes structure through `compute_production_descriptors(smiles)`.
   - Executes **Stale Descriptor Discrepancy Auditing**: compares incoming dictionary scalar fields against RDKit-derived ground truth across defined tolerances (0.05 for $M_w$ and LogP; 0.1 for TPSA; 0 for integer counts).
   - Records all deviations in `snapshot["descriptor_discrepancies"]` capturing both `stored` and `authoritative` values.
   - Executes **Authoritative Overwrite**: overwrites all structure-derived fields with RDKit values.

6. **`validate_polymer_repeat_units(polymer: Any) -> None`**
   - Reads the `monomer_smiles` attribute of the polymer candidate object.
   - Handles copolymer mixtures by splitting composite strings on the pipe delimiter (`|`), trimming whitespace.
   - Validates each monomer substructure through `validate_chemical_structure(s)`.
   - Catches any `ChemicalStructureError` and wraps it into an error message referencing `polymer.polymer_id` and the invalid monomer string.

### 2.2 The Chemical Exception Hierarchy
All cheminformatics exceptions inherit from `PharmaPolyScopeV2Error` and standard Python base classes:
- `PharmaPolyScopeV2Error(Exception)`: Base exception for the v2 engine space.
- `ChemicalStructureError(PharmaPolyScopeV2Error, ValueError)`: Root of the chemical validation hierarchy.
  * `RDKitUnavailableError(ChemicalStructureError, RuntimeError)`: Raised when production calculation requires RDKit, but the library is not installed.
  * `InvalidSmilesError(ChemicalStructureError)`: Raised when SMILES strings fail basic syntax or type checks.
    - `RDKitParseFailureError(InvalidSmilesError)`: Raised specifically when `Chem.MolFromSmiles()` returns `None`.
  * `RDKitSanitizationFailureError(ChemicalStructureError)`: Raised when the molecular graph fails chemical sanitization (e.g. pentavalent carbon).
  * `ProductionFallbackProhibitedError(ChemicalStructureError)`: Raised when a profile carrying diagnostic fallback metadata is passed into a production calculation path.

---

## 3. Fallback Isolation & `ProductionFallbackProhibitedError`

### 3.1 Why Diagnostic Fallbacks Exist
During software development, continuous integration, and user interface design, developers frequently need to test data pipelines, verify schema serializations, or render frontend layouts without initializing heavy C++ cheminformatics libraries. The function `get_diagnostic_fallback_descriptors()` fulfills this diagnostic role by supplying syntactically valid dictionary representations derived from string lengths and character frequencies.

### 3.2 The Isolation Barrier and Defense-in-Depth
Diagnostic heuristics have no place in production decision-making. Heuristic formulas cannot predict stereochemical volume, electronic conjugation, or hydrogen-bonding topologies. If used in production, they would silently distort the descriptor distance metric ($s_{\text{desc}}$) and corrupt Flory–Huggins thermodynamic calculations.

To prevent diagnostic fallbacks from contaminating production calculations:
1. **Explicit Provenance Stamping**: `get_diagnostic_fallback_descriptors()` explicitly tags every generated profile with `fallback_used: True` and `descriptor_source: "fallback"`.
2. **Defense-in-Depth Interception in `VariableKEngine`**: In `src/asd_mcda/v2/engine.py` (lines 136–143), the primary decision engine evaluates incoming drug metadata before running cohort standardization or PCA:
   ```python
   if drug_snapshot.get("fallback_used") is True or drug_snapshot.get("descriptor_source") == "fallback":
       raise ProductionFallbackProhibitedError(
           "Fallback descriptors are strictly prohibited in the production VariableKEngine."
       )
   if "canonical_smiles" in drug_snapshot and drug_snapshot["canonical_smiles"]:
       validate_chemical_structure(drug_snapshot["canonical_smiles"])
   ```
3. **Impossibility of Silent Propagation**: Even if a calling service bypasses `resolve_validated_drug_snapshot()` and supplies a fallback dictionary directly to `VariableKEngine.evaluate()`, the engine intercepts the provenance tag and immediately raises `ProductionFallbackProhibitedError`. The evaluation halts with zero mathematical operations executed.

---

## 4. DRG-0002 Forensic Case Study

### 4.1 Forensic Analysis of `data/user_drugs/drg-0002.json`
During the validation of candidate cohorts for the v2 release study, an audit of user drug profiles revealed severe internal contradictions within the file `data/user_drugs/drg-0002.json`:
- **Declared Cohort ID**: `DRG-0002`
- **Intended Request Entity**: Fenofibrate (Lipid-regulating fibric acid derivative)
- **Field-by-Field Contradictions**:
  * Line 3: `"generic_name": "Indomethacin"` (Mismatch vs requested entity).
  * Line 4: `"canonical_smiles": "COc1ccc2c(c1)c(CC(=O)O)c(C)n2C(=O)c1ccc(Cl)cc1"` (Indomethacin structure, InChIKey `CGIGDMFJXJATDK-UHFFFAOYSA-N`, $M_w = 357.79\,\text{g/mol}$). True Fenofibrate has SMILES `CC(C)OC(=O)C(C)(C)Oc1ccc(C(=O)c2ccc(Cl)cc2)cc1` ($M_w = 360.83\,\text{g/mol}$).
  * Line 10: `"density_crystalline_g_cm3": 1.781` (a crystalline density inconsistent with the intended Fenofibrate profile and associated with the quarantined input record; genuine Fenofibrate is $\sim 1.18\,\text{g/cm}^3$, authentic Indomethacin is $\sim 1.31\,\text{g/cm}^3$).
  * Line 26: `"molar_volume_cm3_mol": 200.89` (mismatched molar volume; $357.79 / 1.781 = 200.893\,\text{cm}^3/\text{mol}$ vs authentic Indomethacin $V_m = 273.00\,\text{cm}^3/\text{mol}$ and Fenofibrate $V_m \sim 296\,\text{cm}^3/\text{mol}$).

### 4.2 Quarantine vs. Silent Repair: Scientific Governance
In computational pipelines, developers are often tempted to implement heuristic "auto-repair" routines (e.g. overwriting the SMILES if the name says Fenofibrate, or recalculating density from literature lookup tables).

PharmaPolySCOPE v2 rejects silent auto-repair as scientifically indefensible:
- **Epistemic Indeterminacy**: The algorithm cannot know whether the user intended to test Fenofibrate with incorrect chemical fields, or Indomethacin with an incorrect identifier and corrupted density. Attempting automated repair requires guessing researcher intent.
- **ALCOA+ and Regulatory Integrity**: Under FDA 21 CFR Part 11 and cGMP data integrity mandates, computational platforms must preserve input authenticity. Silently mutating data files obscures the provenance trail and conceals upstream data entry errors.
- **Formal Quarantine**: The file `data/user_drugs/drg-0002.json` is preserved under strict read-only repository governance. It is formally quarantined and excluded from screening execution.
- **Audit Registry**: The exclusion is permanently cataloged in `results/v2/tables/blocked_cohorts_audit.csv`:
  ```csv
  drug_id,generic_name,status,file,block_reason
  DRG-0002,Indomethacin,validated,data/user_drugs\drg-0002.json,Redundant user drug profile: superseded by authoritative config/drugs/indomethacin.json (IND-001-2026)
  ```
- **Certified 3-Drug Validation Study**: By quarantining `DRG-0002`, the validation study is certified as an authoritative **3-drug valid study** (`IND-001-2026`, `DRG-0001`, `ITR-001-2026`) with **1 quarantined cohort**, rather than a compromised 4-drug study.

---

## 5. Polymer Repeat Unit Validation

Solid dispersion carriers are macromolecules defined by their repeating monomeric subunits. In PharmaPolySCOPE, physical parameters are estimated using the Hoftyzer–Van Krevelen (H-V-K) group contribution method, while topological descriptor complementarity ($s_{\text{desc}}$) compares drug descriptors to monomer repeat units.

### 5.1 Architecture of `validate_polymer_repeat_units`
The function `validate_polymer_repeat_units(polymer: Any)` in `src/asd_mcda/v2/chemistry.py` enforces chemical validity on polymer entries:
1. **Delimiter Parsing**: Copolymers consisting of multiple distinct monomeric feeds (such as Copovidone / PVP-VA 64, containing vinylpyrrolidone and vinyl acetate units) encode repeat units separated by pipe delimiters: `"C1CCN(C1=O)C=C|CC(=O)OC=C"`. The validator parses and strips each monomer segment individually.
2. **Monomer Graph Verification**: Each repeat unit is subjected to RDKit parsing and sanitization. If an entry contains malformed bond syntax or impossible valences, the validator raises `ChemicalStructureError` attributing the exact failing substring and `polymer_id`.
3. **Molar Volume Conservation**: Validating monomer graph topology guarantees that group-contribution molar volumes ($V_{\text{monomer}} = \sum \Delta V_i$) and repeat-unit molecular weights ($M_{w,\text{monomer}}$) reflect genuine physical structures, preventing distorted lattice volume ratios ($V_{\text{drug}} / V_{\text{monomer}}$) from propagating into the Flory–Huggins interaction parameter $\chi$.

---

## 6. Ten Layered Viva Defense Scenarios

### Q1: Why are chemical structure validation gates strictly mandatory at the ingestion boundary?
- **Direct Answer:** Downstream linear algebra algorithms (PCA, AHP, TOPSIS) operate purely on abstract matrices and are mathematically incapable of detecting chemical invalidity; input gates enforce fail-fast boundaries to guarantee that unphysical or synthetic fallback numbers never reach the mathematical solvers.
- **Reasoning:** A correlation matrix or spectral decomposition algorithm will compute eigenvalues and project subspaces on any finite numerical input, even if the values were generated from an impossible five-valent carbon or a corrupted density string. In computational formulation screening, this produces mathematically stable but chemically fictitious rankings. Enforcing validation at the boundary stops data corruption at the earliest ingestion layer.
- **Actual PharmaPolySCOPE Implementation:** Enforced in `src/asd_mcda/v2/chemistry.py` via `validate_chemical_structure(smiles)` and intercepted in `src/asd_mcda/v2/engine.py` (lines 141–143) within `VariableKEngine.evaluate()`.
- **Limitation / Caveat:** Boundary validation catches structural and topological syntax failures; it cannot verify whether experimental physical constants (such as melting point $T_m$ or enthalpy of fusion $\Delta H_{\text{fus}}$) were measured accurately in the laboratory.
- **One-Sentence Defense:** Input chemical gates prevent unphysical molecular graphs from silently corrupting abstract matrix calculations.

### Q2: What is the exact two-stage sequence in `validate_chemical_structure()`?
- **Direct Answer:** The function executes graph parsing via `Chem.MolFromSmiles()` followed immediately by graph sanitization via `Chem.SanitizeMol(mol, catchErrors=True)`; parsing only verifies string grammar, whereas sanitization verifies physical chemical constraints such as valence rules, aromaticity, and kekulization.
- **Reasoning:** A SMILES string can be syntactically well-formed according to line-notation parsing rules while describing an impossible physical structure, such as a pentavalent neutral carbon (`C=C=C=C=C(C)(C)(C)(C)`) or hypervalent nitrogen. `MolFromSmiles()` builds the basic molecular graph, but `SanitizeMol()` performs valence checks, kekulizes conjugated ring systems, and verifies aromatic pi-electron counts (Hückel $4n+2$ rule).
- **Actual PharmaPolySCOPE Implementation:** In `src/asd_mcda/v2/chemistry.py` (lines 99–111), where `mol is None` raises `RDKitParseFailureError`, and a non-zero sanitization return raises `RDKitSanitizationFailureError`.
- **Limitation / Caveat:** Sanitization relies on standard valence rules and does not model dynamic organometallic coordination states or complex radical species.
- **One-Sentence Defense:** Combining lexical parsing with chemical sanitization ensures that molecular graphs are both grammatically readable and physically plausible.

### Q3: How does `resolve_validated_drug_snapshot()` resolve conflicts between stored scalar values and RDKit-derived properties?
- **Direct Answer:** The function enforces structure-first authority by overwriting stored scalar fields with RDKit-calculated descriptors, while logging any discrepancies exceeding defined tolerances into a permanent audit dictionary (`descriptor_discrepancies`).
- **Reasoning:** In legacy systems, changing a SMILES string while leaving scalar fields in a JSON configuration resulted in the persistence of stale descriptors (e.g. retaining Aspirin molecular weight for an Ethanol structure). v2 treats the molecular graph as the single source of truth. However, rather than silently overwriting discrepancies, the engine records the `stored` versus `authoritative` values for fields exceeding tolerances (0.05 for $M_w$ and LogP; 0.1 for TPSA; 0 for integer counts).
- **Actual PharmaPolySCOPE Implementation:** Implemented in `src/asd_mcda/v2/chemistry.py` (lines 247–298) and verified in `tests/v2/test_cheminformatics_integrity.py` (Aspirin to Ethanol test).
- **Limitation / Caveat:** Tolerance boundaries reflect differences between empirical literature values and Crippen atom-contribution predictions; literature LogP values are recorded in provenance but overridden by Crippen values for algorithmic consistency.
- **One-Sentence Defense:** Structure-first resolution eliminates stale descriptor retention while preserving complete forensic traceability under regulatory audit standards.

### Q4: Why does `get_diagnostic_fallback_descriptors()` exist if fallback descriptors are strictly prohibited in production?
- **Direct Answer:** Diagnostic fallbacks exist exclusively for offline testing, UI wireframing, and syntax validation in minimal development environments; quarantine is maintained by explicit metadata tagging that triggers `ProductionFallbackProhibitedError` if passed to production engines.
- **Reasoning:** Developers need to run test suites and inspect serialization logic in environments where C++ RDKit binaries may not be installed. Diagnostic fallbacks estimate crude properties from string lengths and atom counts. However, to prevent these heuristic approximations from leaking into scientific runs, `get_diagnostic_fallback_descriptors()` explicitly stamps the output with `fallback_used: True` and `descriptor_source: "fallback"`.
- **Actual PharmaPolySCOPE Implementation:** Stamping implemented in `src/asd_mcda/v2/chemistry.py` (lines 187–210); exception defined in `src/asd_mcda/v2/exceptions.py` (lines 103–105).
- **Limitation / Caveat:** Developers must ensure diagnostic test scripts do not call `VariableKEngine.evaluate()` directly without expecting an exception.
- **One-Sentence Defense:** Diagnostic fallbacks assist offline development but are cryptographically quarantined from touching production decision calculations.

### Q5: How does `VariableKEngine` implement defense-in-depth against contaminated drug profiles?
- **Direct Answer:** `VariableKEngine.evaluate()` directly inspects the incoming `drug_data` dictionary for fallback provenance tags and executes independent SMILES validation before performing any mathematical calculations.
- **Reasoning:** Architectural defense-in-depth requires that high-level decision engines do not assume upstream ingestion layers executed perfectly. If an external script circumvents the standard ingestion adapter and constructs a dictionary manually, the engine performs its own security check, inspecting `fallback_used` and `descriptor_source`, and passing `canonical_smiles` to `validate_chemical_structure()`.
- **Actual PharmaPolySCOPE Implementation:** In `src/asd_mcda/v2/engine.py` (lines 136–143) and verified in `tests/v2/test_cheminformatics_integrity.py` (Test 16).
- **Limitation / Caveat:** Validating SMILES inside the engine incurs a microsecond RDKit parsing overhead per evaluation call, which is negligible compared to downstream spectral decomposition.
- **One-Sentence Defense:** Defense-in-depth ensures that even if upstream adapters are bypassed, the core engine intercepts unverified chemical inputs.

### Q6: In the validation study, candidate DRG-0002 was quarantined rather than auto-corrected. Why?
- **Direct Answer:** The file `data/user_drugs/drg-0002.json` contained severe internal contradictions (requested as Fenofibrate, but contained Indomethacin SMILES, a crystalline density inconsistent with the intended Fenofibrate profile and associated with the quarantined input record ($1.781\,\text{g/cm}^3$), and collapsed molar volume); quarantine without modification preserves data provenance and avoids guessing researcher intent.
- **Reasoning:** Automated algorithmic repair requires making unsubstantiated assumptions. If the software assumed the request name was correct and injected Fenofibrate SMILES, the stored density would remain mismatched; if it assumed the SMILES was correct, it would duplicate Indomethacin while retaining a crystalline density inconsistent with the intended Fenofibrate profile and associated with the quarantined input record. Under FDA 21 CFR Part 11 and ALCOA+ integrity principles, corrupt source data must be quarantined and audited, never silently mutated.
- **Actual PharmaPolySCOPE Implementation:** Documented in `PHARMAPOLYSCOPE_V2_SCIENTIFIC_VALIDATION_STUDY.md` (line 99) and cataloged in `results/v2/tables/blocked_cohorts_audit.csv`.
- **Limitation / Caveat:** Quarantining `DRG-0002` reduced the active validation cohort from 4 candidates to 3 candidates, requiring formal documentation that the study is a 3-drug valid study.
- **One-Sentence Defense:** Formal quarantine preserves raw input provenance and prevents the software from guessing researcher intent.

### Q7: How does PharmaPolySCOPE validate polymer repeat units and handle copolymers?
- **Direct Answer:** The function `validate_polymer_repeat_units()` inspects the polymer's `monomer_smiles` attribute, splits copolymer strings on the pipe delimiter (`|`), and independently validates each monomer fragment through `validate_chemical_structure()`.
- **Reasoning:** Polymers used in amorphous solid dispersions include homopolymers (such as PVP K30) and multi-component copolymers (such as PVP-VA 64, composed of vinylpyrrolidone and vinyl acetate). Group contribution methods (H-V-K) and topological descriptors calculate properties from monomer graphs. `validate_polymer_repeat_units` tokenizes multi-monomer strings and validates each chemical graph against valency and sanitization rules.
- **Actual PharmaPolySCOPE Implementation:** In `src/asd_mcda/v2/chemistry.py` (lines 303–323) and verified in `tests/v2/test_cheminformatics_integrity.py` (Test 17).
- **Limitation / Caveat:** The function validates monomer topological structure; it does not model polymer blockiness, copolymer sequence distribution, or molecular weight polydispersity ($M_w / M_n$).
- **One-Sentence Defense:** Pipe-delimited monomer validation ensures that each copolymer subunit is chemically sound before calculating lattice volume ratios.

### Q8: How does the v2 chemistry pipeline handle stereochemical representations and chiral centers?
- **Direct Answer:** The pipeline computes canonical SMILES with explicit stereochemical retention (`@`/`@@` parity markers) and derives 27-character InChIKeys that encode stereochemical layers, ensuring complete distinction between enantiomers.
- **Reasoning:** Stereoisomers possess identical connectivity and molecular formulas but can exhibit different crystalline packing lattices, melting temperatures, and amorphous crystallization kinetics. In RDKit, `Chem.MolToSmiles(mol, canonical=True)` preserves tetrahedral stereocenters by default. Furthermore, standard InChIKeys dedicate their second 8-character block to stereochemical and isotopic definition.
- **Actual PharmaPolySCOPE Implementation:** Evaluated in `tests/v2/test_cheminformatics_integrity.py` (Test 9 Thalidomide, Test 10 Itraconazole).
- **Limitation / Caveat:** Standard 2D descriptors (such as 2D TPSA, LogP, and $M_w$) are identical for optical enantiomers; stereochemical differentiation in v2 is captured in canonical structure strings, InChIKeys, and empirical thermal transition constants ($T_g, T_m$).
- **One-Sentence Defense:** Canonicalization preserves chiral parity markers and generates stereospecific InChIKeys to distinguish stereoisomers.

### Q9: How does `compute_production_descriptors()` handle multi-component salt complexes or solvates?
- **Direct Answer:** Disconnected multi-component SMILES strings (e.g. `CC(=O)[O-].[Na+]`) are parsed and computed as the full unstripped stoichiometric complex; counterion stripping and active moiety extraction are formally documented as boundary limitations.
- **Reasoning:** In pharmaceutical chemistry, active pharmaceutical ingredients are frequently formulated as salts to enhance kinetic solubility. In the current v2 architecture, RDKit parses disconnected structures separated by periods (`.`) into a single composite molecular graph. The calculated molecular weight and TPSA represent the sum of the drug ion and its counterion. In amorphous solid dispersions, the counterion remains physically dispersed in the polymeric carrier and directly influences miscibility and glass transition.
- **Actual PharmaPolySCOPE Implementation:** Formally verified in `tests/v2/test_cheminformatics_integrity.py` (Test 13, Sodium Acetate) and documented in `results/v2/rdkit_integrity_remediation_report.md`.
- **Limitation / Caveat:** If a salt SMILES is ingested, the molecular weight reflects the salt form; automated parent-compound neutralization and physiological microspecies protonation represent future roadmap enhancements.
- **One-Sentence Defense:** We evaluate salt complexes as unstripped stoichiometric units because counterions physically remain in solid dispersion matrices.

### Q10: How does the chemical integrity architecture support regulatory compliance under FDA 21 CFR Part 11?
- **Direct Answer:** By enforcing fail-fast exception boundaries, eliminating silent data manipulation, generating cryptographic InChIKey hashes, and logging all descriptor modifications into structured audit logs, the architecture guarantees data Attributability, Legibility, Contemporaneity, Originality, and Accuracy (ALCOA+).
- **Reasoning:** Regulatory authorities require computerized systems supporting drug development to provide complete data integrity. Silent heuristic fallbacks or unrecorded data overwrites violate the ALCOA+ principle of Accuracy and Originality. PharmaPolySCOPE v2 satisfies ALCOA+ requirements by stamping every profile with `descriptor_source` and `fallback_used`, recording discrepancies in `descriptor_discrepancies`, and quarantining defective inputs in `blocked_cohorts_audit.csv`.
- **Actual PharmaPolySCOPE Implementation:** Audit dictionaries structured in `src/asd_mcda/v2/chemistry.py` (lines 293–298) and verified across the 29-test integrity suite.
- **Limitation / Caveat:** Technical compliance provides audit trails; institutional compliance requires standard operating procedures (SOPs) governing user drug profile generation.
- **One-Sentence Defense:** Fail-fast exceptions and transparent discrepancy auditing ensure full technical alignment with ALCOA+ data integrity standards.
