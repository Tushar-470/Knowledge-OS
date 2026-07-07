### 1. Computers in Clinical Development: Clinical Data Collection and Management

**1. Introduction & The Shift to eClinical (1.5 Marks):**
Historically, clinical trials relied on paper-based Case Report Forms (CRFs), leading to data transcription errors, lost data, and years of delay before database lock. Today, computers have digitized the entire clinical data lifecycle. The use of **Electronic Data Capture (EDC) systems** ensures real-time data entry, immediate query resolution, and strict compliance with Good Clinical Practice (GCP).

**2. Electronic Data Capture (EDC) and eCRFs (2.5 Marks):**
*   **EDC Systems:** These are web-based software platforms (e.g., Medidata Rave, Oracle InForm, Veeva Vault) used by clinical sites to enter patient data.
*   **eCRFs (Electronic Case Report Forms):** Digital versions of paper forms. They feature real-time edit checks. For example, if a coordinator enters a patient's birthdate making them 150 years old, the system immediately flags an error and prevents saving until corrected.
*   **Query Management:** If data is missing or illogical, the Data Manager generates an electronic query. The site coordinator receives an alert, resolves it, and the system automatically logs the change with a timestamp.

**3. Clinical Data Management System (CDMS) Workflow (2 Marks):**
Once entered into the EDC, data flows to the CDMS for processing:
*   **Medical Coding:** Adverse events and medications are auto-coded using global dictionaries like **MedDRA** (Medical Dictionary for Regulatory Activities) for adverse events and **WHODrug** for medications.
*   **Database Lock:** Once all queries are resolved, the database is "locked." This means no further edits can be made, and the clean dataset is exported to statistical software (SAS) for unblinding and analysis.

**4. Advanced eClinical Technologies (2 Marks):**
*   **ePRO (Electronic Patient Reported Outcomes):** Patients use apps on their smartphones to log symptoms (e.g., pain scores) in real-time, preventing recall bias.
*   **Wearables and IoT:** Biosensors (e.g., continuous glucose monitors, ECG patches) stream continuous physiological data directly to the trial database.
*   **eConsent:** Multimedia tablets are used to explain complex trial protocols to patients, ensuring better understanding and digital signature capture.

*(Exam Tip: Draw a flowchart: Patient $\rightarrow$ ePRO/Wearable $\rightarrow$ Site Coordinator $\rightarrow$ EDC (eCRF) $\rightarrow$ CDMS (Coding/Queries) $\rightarrow$ Database Lock.)*

---

### 2. Regulation of Computer Systems

**1. The Need for Regulation (1 Mark):**
Regulatory agencies (FDA, EMA) will not approve a drug if the clinical trial data is unreliable. If the computer systems collecting or managing data fail, the data is compromised. Therefore, computer systems in clinical trials must be strictly regulated to ensure **data integrity, security, and patient privacy**.

**2. 21 CFR Part 11 (FDA) (2.5 Marks):**
This is the cornerstone FDA regulation governing electronic records and electronic signatures. Key requirements include:
*   **Validation:** Systems must be validated to ensure they perform exactly as intended.
*   **Audit Trails:** The system must automatically record secure, computer-generated, time-stamped audit trails. It must record *who* made a change, *what* the old and new values were, and *when* it was changed. Audit trails cannot be altered or deleted.
*   **Electronic Signatures:** Must be unique to one individual and cannot be reused or reassigned. They are legally binding equivalents to handwritten signatures.

**3. ALCOA+ Data Integrity Principles (2 Marks):**
Regulators evaluate computer data using the ALCOA+ acronym. Data must be:
*   **A**ttributable (traceable to the person who entered it)
*   **L**egible (readable permanently; no disappearing digital ink)
*   **C**ontemporaneous (recorded at the exact time the event occurred)
*   **O**riginal (the first capture of the data, e.g., the eCRF entry)
*   **A**ccurate (error-free and verified)
*   **C**omplete, **C**onsistent, **E**nduring, **A**vailable (the "+" additions for long-term archiving and accessibility).

**4. Computer System Validation (CSV) and GAMP 5 (2 Marks):**
Systems cannot just be bought and used; they must be validated under the **GAMP 5 (Good Automated Manufacturing Practice)** framework.
*   **Validation Lifecycle:** Requires creating a User Requirement Specification (URS), followed by testing. 
*   **Testing Phases:** 
    *   *IQ (Installation Qualification):* Is it installed correctly on the server?
    *   *OQ (Operational Qualification):* Does it do what the vendor claims?
    *   *PQ (Performance Qualification):* Does it work for the specific clinical trial process in the real world?
*   **Audit & Inspections:** Sponsors must grant FDA inspectors access to audit trails and validation documents during site audits.

**5. EU Annex 11 (0.5 Mark):**
The European equivalent of 21 CFR Part 11. It emphasizes a **risk-based approach** to validation, focusing system validation efforts strictly on features that directly impact patient safety and data reliability.

*(Exam Tip: Memorize the ALCOA+ acronym and the IQ/OQ/PQ validation steps. Examiners heavily reward these specific regulatory frameworks.)*