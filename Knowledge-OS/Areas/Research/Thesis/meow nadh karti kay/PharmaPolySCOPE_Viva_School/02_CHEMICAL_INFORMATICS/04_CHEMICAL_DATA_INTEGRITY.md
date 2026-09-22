# Chemical Data Integrity & Governance

---
## Cross-Reference
**Prerequisite knowledge:** SMILES format, RDKit calculations, Molecular Descriptors.
**Used later by:** Matrix computation, VariableKEngine.
**Related source code:** src/asd_mcda/v2/chemistry.py
**Related tests:** tests/v2/
**Related validation artifact:** scientific_validation_results.json
**Related viva attack:** Part 9 — Viva Attack Files

---
## Part 1: Beginner Understanding

Imagine a library database where anyone can upload a summary of a book. A user uploads a profile for *Moby Dick*, but instead of listing the page count as 600, they mistakenly type 60. Later, an automated system uses this page count to calculate shipping costs, drastically undercharging for a heavy book. Over time, as more users copy-paste information, these numbers "drift" further from reality. We call this the **stale descriptor problem**.

In PharmaPolySCOPE, a drug profile is a JSON file containing the SMILES string (the chemical structure) alongside numbers like Molecular Weight (MW) and TPSA. Historically, researchers manually entered these numbers. If a researcher pasted the structure for Indomethacin but accidentally pasted the Molecular Weight of Aspirin, the Flory-Huggins mathematical models would calculate garbage results.

To fix this, v2 introduces **Chemical Data Integrity**. We instituted the **Authoritative Overwrite principle**. It works like this: we completely ignore the numbers the researcher typed. Instead, we take the SMILES string, feed it into RDKit, and let RDKit mathematically prove what the weight and properties must be. RDKit's answers forcefully overwrite the researcher's numbers. 

If the user's numbers were close (within a tiny tolerance, like ±0.05 for weight), we quietly overwrite them and log the correction. But if the numbers are wildly different, it means the user claimed the drug was one thing, but the chemical structure proved it was something else entirely. The system immediately triggers a fatal alarm, blocks the profile, and stops the math from running on corrupted data.

---
## Part 2: Technical Detail

### The Stale Descriptor Problem
JSON datastores are prone to desynchronization. A profile might undergo a SMILES update, but the maintainer forgets to recalculate the corresponding physicochemical descriptors. This leads to mathematically impossible profiles (e.g., a massive SMILES graph claiming an MW of 150 g/mol).

### The Authoritative Overwrite Principle
The `resolve_validated_drug_snapshot(raw_data)` function guarantees that the structural graph ($G$) is inextricably linked to its derived descriptors ($D$). $D = f(G)$, where $f$ is RDKit.
The fields forcefully overwritten are:
* `canonical_smiles`
* `inchi_key`
* `molecular_weight_g_mol`
* `logp`
* `tpsa_angstrom2`
* `hbd`, `hba`
* `rotatable_bonds`, `aromatic_rings`
* `fractional_tpsa`

### Tolerance System and Discrepancy Recording
The system does not blindly crash on floating-point rounding errors. It applies strict numerical tolerances:
* **MW:** ± 0.05
* **logP:** ± 0.05
* **TPSA:** ± 0.1
* **Integer Fields (HBD, HBA, Rings, Bonds):** Exact (Tolerance = 0)

Deviations are logged in a `descriptor_discrepancies` dictionary:
`{field_name: {stored: X, authoritative: Y}}`

If a deviation exceeds the tolerance, it flags a metadata mismatch. If the graph cannot be parsed at all, a `ChemicalStructureError` prevents further execution.

### The No-Fallback Design Principle
Previous iterations of the software contained a fallback function that generated heuristic estimates if RDKit failed. In v2 Research Mode, this is strictly prohibited. A silent fallback would propagate an incorrect Molar Volume ($V_m$) into the Flory-Huggins $\chi$ equation, corrupting the compatibility scores without warning.
If a profile carries the `fallback_used=True` flag, the `VariableKEngine` raises a `ProductionFallbackProhibitedError`, permanently halting analysis for that profile.

### Polymer Integrity
Integrity extends to polymers. The function `validate_polymer_repeat_units(polymer)` handles polymer definitions formatted as `FragmentA|FragmentB`. It splits the string by the `|` delimiter and strictly applies `validate_chemical_structure()` to every individual monomer fragment.

---
## Part 3: PharmaPolySCOPE Implementation

### The DRG-0002 Incident (Forensic Breakdown)
The DRG-0002 incident is the definitive proof of the v2 governance model.

* **The Attack/Error:** A profile labeled 'Fenofibrate' was ingested. However, the SMILES string inside the profile was exactly the SMILES for Indomethacin: `COc1ccc2c(c1)c(CC(=O)O)c(C)n2C(=O)c1ccc(Cl)cc1`. The profile also contained incorrect, placeholder physicochemical values: density $\rho=1.781 \text{ g/cm}^3$ and $V_m=200.89 \text{ cm}^3/\text{mol}$.
* **The Detection:** 
  1. `resolve_validated_drug_snapshot()` extracted the SMILES.
  2. RDKit computed the authoritative MW from the Indomethacin SMILES: ~357.79 g/mol.
  3. The system compared this to the stored 'Fenofibrate' MW (which was ~360.83 g/mol).
  4. The difference ($|360.83 - 357.79| \approx 3.04$) massively exceeded the ±0.05 tolerance.
  5. The InChIKey also fundamentally mismatched.
* **The Result:** The system recorded massive deviations, triggering a `FATAL_METADATA_MISMATCH`. The `VariableKEngine` blocked the profile from entering the compatibility matrix.
* **Critical Viva Distinction:** DRG-0002 demonstrates the INPUT-GOVERNANCE layer functioning perfectly. It prevented corrupted data from executing. *It does NOT validate the scientific ranking model itself*, because the math never ran.

### Implementation Trace
**Concept:** Enforcing Data Integrity.
**Input:** DRG-0002 Raw JSON (Fake Fenofibrate profile).
**Function:** `resolve_validated_drug_snapshot(raw_data)`
**File:** `src/asd_mcda/v2/chemistry.py`
**Transformation:** Computes RDKit MW (357.79). Compares to JSON MW (360.83). Logs violation in `descriptor_discrepancies`. Returns snapshot.
**Next stage:** `VariableKEngine` detects fatal mismatch -> Raises Error -> Profile Blocked.

---
## Part 4: Assumptions and Limitations

* **Density is unverified:** The system forces structural properties (MW, TPSA) to be true to the SMILES. However, bulk properties like `density_crystalline` cannot be calculated by RDKit. If a user maliciously inputs a false density, $V_m$ will still be wrong. The system mitigates this by restricting density inputs to administrator-validated datasets.
* **Isotope standard:** RDKit calculates average MW. If a researcher genuinely intended to use a heavily deuterated isotope but did not format the SMILES to reflect this, the system will overwrite the user's intended isotope weight with the standard weight.

---
## Part 5: Viva Questions and Answers

### A. 10 Basic Questions

1. **What is the "stale descriptor problem"?**
   *Model Answer:* When the chemical structure (SMILES) in a database is updated, but the numerical properties (like MW) are not, leading to a mismatch between the structure and its stated properties.

2. **What does the Authoritative Overwrite principle do?**
   *Model Answer:* It discards user-provided or stored chemical descriptors and replaces them with values newly computed directly from the SMILES string by RDKit.

3. **What is the tolerance limit for Molecular Weight discrepancies?**
   *Model Answer:* ± 0.05 g/mol.

4. **What is the tolerance limit for integer fields like Number of Hydrogen Bond Donors?**
   *Model Answer:* Zero. They must match exactly.

5. **Where are the differences between stored and computed values recorded?**
   *Model Answer:* In a dictionary called `descriptor_discrepancies`.

6. **What does `ProductionFallbackProhibitedError` signify?**
   *Model Answer:* It means a profile attempted to enter the strict calculation engine using unverified, heuristic guess-data instead of exact RDKit calculations.

7. **How does the system validate polymer repeat units?**
   *Model Answer:* It splits the polymer's `monomer_smiles` string by the `|` character and validates each resulting piece individually.

8. **In the DRG-0002 incident, what drug's SMILES was actually in the profile?**
   *Model Answer:* Indomethacin.

9. **What label was on the DRG-0002 profile?**
   *Model Answer:* Fenofibrate.

10. **Did the DRG-0002 profile reach the Flory-Huggins calculation stage?**
    *Model Answer:* No. It was blocked by a `FATAL_METADATA_MISMATCH`.

### B. 10 Intermediate Questions

1. **Why is a silent fallback dangerous in this specific pipeline?**
   *Model Answer:* A silent fallback would generate a heuristic MW. This incorrect MW would be used to calculate Molar Volume ($V_m$), which directly alters the Flory-Huggins $\chi$ parameter. The matrix would generate scientifically invalid compatibility scores without warning the researcher.

2. **Explain the step-by-step detection of the DRG-0002 incident.**
   *Model Answer:* The system extracted the Indomethacin SMILES from the profile. RDKit computed the true MW (~357.79). It compared this to the stored MW of Fenofibrate (~360.83). The difference exceeded 0.05, triggering a massive discrepancy log and resulting in a fatal block.

3. **Does DRG-0002 prove that the Flory-Huggins scientific model is accurate?**
   *Model Answer:* Absolutely not. DRG-0002 proves that the input-governance software architecture successfully detects and blocks corrupted metadata. It is a software engineering victory, not a validation of the thermodynamic physics model.

4. **Name four fields overwritten by `resolve_validated_drug_snapshot`.**
   *Model Answer:* `canonical_smiles`, `molecular_weight_g_mol`, `tpsa_angstrom2`, `logp`.

5. **Why apply a tolerance of ±0.05 to MW instead of requiring an exact match?**
   *Model Answer:* Different software packages might use slightly different atomic weight tables (e.g., resolving atomic mass to 3 decimal places vs 5). A tiny floating-point deviation is mathematically irrelevant to our bulk calculations, whereas a zero-tolerance policy would cause constant, unnecessary pipeline crashes.

6. **What is the function of `get_diagnostic_fallback_descriptors`?**
   *Model Answer:* It generates heuristic, low-quality estimates for UI testing or diagnostic purposes. It is strictly blocked from the production scientific engine.

7. **Why must integer fields have a tolerance of zero?**
   *Model Answer:* You cannot have 0.5 of a hydrogen bond donor or 0.1 of an aromatic ring. A mismatch in an integer topological count represents a fundamental structural divergence, not a rounding error.

8. **How does the system ensure polymers don't bypass chemistry validation?**
   *Model Answer:* Polymers are often viewed as bulk materials, but `validate_polymer_repeat_units` forces their SMILES representations to undergo the identical strict RDKit graph parsing and sanitization as small molecules.

9. **What was the density provided in the DRG-0002 profile?**
   *Model Answer:* A placeholder/incorrect value of 1.781 g/cm³.

10. **What component raises the `ProductionFallbackProhibitedError`?**
    *Model Answer:* The `VariableKEngine`, serving as the gatekeeper to the compatibility matrix.

### C. 10 Difficult Examiner Questions

1. **How does the architecture mathematically link identity to physical properties to prevent spoofing?**
   *Model Answer:* By defining Identity = Graph Topology (Canonical SMILES), and defining Properties as a strict mathematical function of that graph $D=f(G)$, the architecture eliminates spoofing. A user cannot supply a Graph $G_1$ and claim Properties $D_2$, because the pipeline automatically recalculates $D_1 = f(G_1)$ and overwrites the input.

2. **Since density cannot be computed from a 2D SMILES, how does the system prevent a DRG-0002 style attack where only the density is spoofed?**
   *Model Answer:* The automated RDKit pipeline cannot prevent a spoofed density. This represents the boundary of computational governance. We mitigate this by requiring that bulk experimental properties (like density and $T_g$) undergo manual administrative review before entering the master dataset, whereas topological descriptors are entirely automated.

3. **In DRG-0002, the InChIKey mismatched. Why isn't InChIKey validation alone sufficient without MW tolerances?**
   *Model Answer:* InChIKey is a hash. A mismatch tells you the structures are different, but it provides no thermodynamic context. By computing and checking MW, TPSA, and logP, `descriptor_discrepancies` quantifies exactly *how* different the structures are, providing critical debugging forensics to determine if it was a minor stereochemical shift or an entirely wrong drug class.

4. **Justify the strict blocking of fallback data. If a minor descriptor like Rotatable Bonds fails, why crash the whole analysis?**
   *Model Answer:* Partial data integrity is an oxymoron in automated thermodynamic modeling. If the system fails to calculate Rotatable Bonds, it implies a fundamental failure in RDKit graph generation, meaning MW and TPSA are also compromised. Allowing partial failures leads to unpredictable, silent propagation of nan/null values into the matrix mathematics.

5. **Explain the architectural rationale behind overwriting raw JSON rather than keeping the computed data in memory and leaving the JSON untouched.**
   *Model Answer:* Overwriting standardizes the persistent datastore. If computed values only live in RAM, any secondary analysis tool hitting the JSON directly will read stale, corrupted data. The Authoritative Overwrite ensures that once a profile passes through the system, its persistent state is mathematically synchronized with physical reality.

6. **The historical 18-drug batch contains invalid chemistry. Doesn't this mean your earlier research was fabricated?**
   *Model Answer:* It means the earlier research was conducted without the rigorous automated governance we have now developed. The historical profiles used placeholder data, which invalidated those specific numerical results. Acknowledging this flaw is exactly why v2 was built. The v2 governance successfully identifies and blocks those historical errors, proving the new architecture's superiority.

7. **How does canonicalization within `resolve_validated_drug_snapshot` solve the problem of degenerate representations?**
   *Model Answer:* A user might input an uncanonical, messy SMILES. `compute_production_descriptors` generates a strict Canonical SMILES. The Authoritative Overwrite replaces the messy SMILES with the canonical one. This ensures that the persistent database eventually converges to a state of perfect canonical uniqueness, optimizing database indexing and deduplication.

8. **If the user provides an empty SMILES string, how is it handled differently than a malformed one?**
   *Model Answer:* Both result in errors, but specifically different ones. An empty string raises `InvalidSmilesError('empty')` early in the process. A malformed string (e.g., `C1=C=C=C1` failing valence) raises an `RDKitSanitizationFailureError`. This separation aids precise logging and debugging.

9. **What is the exact logic chain that leads from an incorrect MW in a JSON to a `FATAL_METADATA_MISMATCH`?**
   *Model Answer:* 1. JSON parsed. 2. `resolve_validated_drug_snapshot` calls RDKit. 3. RDKit calculates $MW_{true}$. 4. System calculates $|MW_{true} - MW_{json}|$. 5. Value > 0.05. 6. Discrepancy logged as `MW: {stored: X, authoritative: Y}`. 7. The magnitude of discrepancy flags a severity violation. 8. Engine reads violation and raises fatal exception.

10. **Why are we confident that Indomethacin (MW 357.79) satisfies Lipinski's rules despite having multiple rings and halogens?**
    *Model Answer:* Lipinski's rules are strict numeric thresholds: MW < 500, logP < 5, HBD < 5, HBA < 10. The halogens and rings only contribute to MW and logP. Indomethacin's MW (358) is well below 500, and its calculated logP (3.9) is below 5. Its rigid topology limits its donors to 1 and acceptors to 3, keeping it safely within oral bioavailability space.

### D. 10 Hostile/Challenging Questions

1. **"You claim DRG-0002 proves your system works, but I say it proves your database was full of garbage data in the first place."**
   *Model Answer:* Yes, the initial manual database compilation contained errors—a universal problem in chemoinformatics. The entire purpose of building the automated v2 integrity layer was to detect and neutralize human-entered garbage data. DRG-0002 proves the software solution successfully identified and quarantined the human error.

2. **"If I maliciously input the correct SMILES for Indomethacin but a fake density, your system calculates a fake Flory-Huggins chi. Your governance is an illusion."**
   *Model Answer:* The automated governance governs what it can calculate: 2D topology. Density is a 3D bulk thermodynamic property that cannot be derived from a 1D string. We acknowledge this limitation. We secure density through administrative review workflows outside of this automated module. Claiming governance is an 'illusion' because it respects the limits of physics is a misunderstanding of system boundaries.

3. **"The 18-drug batch results are heavily cited in Chapter 3. Now you admit they are invalid. Your thesis falls apart."**
   *Model Answer:* Scientific progress requires identifying and correcting methodological flaws. The earlier results demonstrated the *mathematical framework* of the matrix, assuming perfect inputs. V2 provides the *software architecture* to guarantee perfect inputs. The thesis is not about a specific batch of 18 drugs; it is about the design of an unbreakable computational pipeline.

4. **"Tolerance of 0.05 for logP is ridiculous. Different calculation methods yield logPs that vary by whole numbers. You'll block valid molecules constantly."**
   *Model Answer:* The tolerance compares the user's stored logP against the RDKit Wildman-Crippen calculated logP. If the user stored an experimental logP, yes, it would mismatch and be overwritten. This is the desired behavior! We enforce standardizing on the deterministic RDKit calculated value to ensure relative matrix consistency. We want to overwrite the user's value.

5. **"By forcing 'Authoritative Overwrite', you are destroying the original experimental data entered by the researchers."**
   *Model Answer:* The raw, unaltered JSON uploads are preserved in version control (git). The Authoritative Overwrite occurs in the active processing pipeline to ensure the mathematical matrix operates on standardized physics. We prioritize thermodynamic modeling integrity over preserving heterogeneous historical notes in the active runtime.

6. **"Why use the VariableKEngine to block fallback data? Why not block it inside `chemistry.py`?"**
   *Model Answer:* Separation of concerns. `chemistry.py` is a utility module; it doesn't know if the application is currently running a strict scientific matrix or just mocking up a user interface. The `VariableKEngine` represents the scientific modeling domain; it knows that for its specific equations, heuristic data is fatal.

7. **"If a SMILES string fails parsing, why raise `ChemicalStructureError` instead of just returning False?"**
   *Model Answer:* Returning a boolean `False` forces the caller to remember to check for `False` and figure out what it means. Raising a typed Exception guarantees that execution stops immediately and provides a stack trace indicating exactly why and where the chemistry failed. Fail-fast exceptions are superior software engineering.

8. **"You say DRG-0002 doesn't validate the scientific model. Then what does?"**
   *Model Answer:* The scientific model (Flory-Huggins $\chi$, solubility parameters, matrix scoring) is validated by comparing the final computed compatibility scores of correctly ingested, physically verified drugs against real-world experimental differential scanning calorimetry (DSC) and physical stability assays.

9. **"If I put Indomethacin's SMILES and exactly mimic RDKit's output for MW, TPSA, etc., but I change the drug name to 'Water', your system passes it."**
   *Model Answer:* Yes. The computational pipeline analyzes physical chemistry, not English linguistics. If the physical properties mathematically match the topological graph, the physics calculations will be perfectly accurate for Indomethacin, regardless of the text label. 

10. **"Your system is overly rigid. A human researcher would spot the DRG-0002 error in seconds without all this complex code."**
    *Model Answer:* A human researcher reviewing 10 profiles might spot it. A human reviewing 10,000 profiles in a high-throughput screening database will absolutely miss it, leading to a polluted matrix. Automated rigid governance scales infinitely without fatigue, which is mandatory for modern cheminformatics.

### E. Common Mistakes
* Claiming DRG-0002 validates the Flory-Huggins parameter calculation.
* Thinking `get_diagnostic_fallback_descriptors` is used in production.
* Believing the system calculates density from SMILES.
* Trying to defend the 18-drug historical batch as scientifically valid data under v2 rules.

### F. Things You Must Never Claim
* NEVER claim DRG-0002 validates the scientific model.
* NEVER claim the v2 system uses silent fallbacks for missing chemical data.
* NEVER state the historical 18-drug batch represents the validated output of the v2 engine.
* NEVER claim the system can automatically correct a spoofed density value.
