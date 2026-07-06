# NUCLEIC ACID-BASED THERAPEUTIC DELIVERY SYSTEMS

## 1. INTRODUCTION TO GENE THERAPY (2 Marks)
*   **Definition:** Gene therapy is a technique that involves the introduction, alteration, or replacement of a defective gene (nucleic acid: DNA or RNA) within a patient's cells to treat or prevent a disease.
*   **Concept:** Instead of treating the symptoms of a disease with traditional drugs, gene therapy addresses the root cause at the molecular level by providing a functional copy of a gene, knocking out a mutated gene, or introducing a completely new gene to help fight a disease.
*   **The Delivery Challenge:** Naked nucleic acids (DNA/RNA) are large, negatively charged, easily degraded by serum nucleases, and cannot readily cross cell membranes. Therefore, a **carrier or delivery system (vector)** is absolutely essential to protect the nucleic acid and facilitate its entry into the target cell.

## 2. APPROACHES TO GENE THERAPY: EX-VIVO VS. IN-VIVO (4 Marks)
Gene therapy is broadly classified into two distinct approaches based on *where* the genetic modification takes place.

### A. Ex-Vivo Gene Therapy ("Outside the living body")
*   **Process:** Target cells (e.g., blood stem cells, immune cells) are surgically removed from the patient’s body. In a highly controlled laboratory setting, the therapeutic gene is introduced into these cells using a vector. The genetically modified cells are then allowed to grow and multiply, and finally, they are re-infused or transplanted back into the patient.
*   **Advantages:** Offers maximum control over the transfection process; highly efficient; allows for rigorous testing of the modified cells before putting them back into the patient; lower risk of the vector spreading to non-target tissues.
*   **Limitations:** Restricted to cell types that can be easily extracted, cultured, and re-implanted (primarily blood cells).
*   **Classic Example:** CAR-T cell therapy for cancer (modifying patient's T-cells); treatment of Severe Combined Immunodeficiency (SCID) using modified bone marrow stem cells.
### B. In-Vivo Gene Therapy ("Inside the living body")
*   **Process:** The therapeutic gene is packaged into a delivery vector and directly injected or inhaled into the patient’s body (e.g., intravenously, intramuscularly, or directly into a specific organ like the eye or brain). The vector must then find the target cells, enter them, and deliver the gene.
*   **Advantages:** Can be used for tissues that cannot be removed and grown in a lab (e.g., brain, lung, heart). Less invasive for the patient in terms of cell harvesting.
*   **Limitations:** Highly complex; the vector may face immune system attacks in the bloodstream; difficult to ensure the gene reaches *only* the target cells (risk of off-target effects).
*   **Classic Example:** Luxturna (voretigene neparvovec) for inherited retinal dystrophy (injected directly into the eye); Zolgensma for Spinal Muscular Atrophy (injected intravenously).

---

## 3. POTENTIAL TARGET DISEASES FOR GENE THERAPY (4 Marks)
Gene therapy is ideally suited for diseases that have a clearly defined genetic origin.

### A. Inherited (Genetic) Disorders
These are caused by single-gene mutations (monogenic disorders). Gene therapy works by replacing the missing or faulty gene with a healthy copy.
*   **Hemophilia:** Caused by a deficiency in clotting factors (Factor VIII or IX). Gene therapy delivers the gene to liver cells to produce the missing clotting factor continuously.
*   **Spinal Muscular Atrophy (SMA):** Caused by a mutation in the *SMN1* gene. AAV vectors deliver a functional copy of the gene to motor neurons.
*   **Cystic Fibrosis:** Caused by mutations in the CFTR gene. In-vivo gene therapy aims to deliver a normal CFTR gene to the lungs via inhalation.
*   **Duchenne Muscular Dystrophy (DMD):** Targets the dystrophin gene to restore muscle function.

### B. Cancer
In cancer, the goal of gene therapy is not just replacement, but often destruction or immune activation.
*   **Suicide Gene Therapy:** A "suicide gene" (e.g., Herpes Simplex Virus Thymidine Kinase - HSV-TK) is delivered into tumor cells. The patient is then given a prodrug, which the suicide gene converts into a toxic compound that kills only the cancer cells.
*   **Oncolytic Virotherapy:** Using modified viruses that selectively replicate in and kill cancer cells while leaving normal cells unharmed (e.g., T-VEC for melanoma).
*   **Immune Cell Modification (Ex-vivo):** Modifying the patient's T-cells to express Chimeric Antigen Receptors (CAR-T) that specifically hunt and kill cancer cells (used for leukemias and lymphomas).
*   **Tumor Suppressor Gene Replacement:** Delivering a functional *p53* gene (a tumor suppressor) into tumors where it is mutated.

---

## 4. GENE EXPRESSION SYSTEMS (VECTORS) (5 Marks)
Vectors are the vehicles used to carry the therapeutic nucleic acid into the cell. They are divided into two main categories:

### A. Viral Gene Transfer Systems
Viruses are naturally highly efficient at entering cells and hijacking cellular machinery to express their genes. Scientists strip them of their pathogenic genes and replace them with therapeutic genes.
1.  **Retroviruses (including Lentiviruses):**
    *   *Mechanism:* Integrate their genetic payload directly into the host cell's genome, ensuring permanent gene expression as the cell divides.
    *   *Use:* Ex-vivo therapies (like CAR-T). Lentiviruses can also infect non-dividing cells.
    *   *Risk:* Insertional mutagenesis (accidentally disrupting a host tumor suppressor gene, causing cancer).
2.  **Adenoviruses (Ads):**
    *   *Mechanism:* Do *not* integrate into the host genome (episomal). They remain in the nucleus and provide high-level, but temporary, gene expression.
    *   *Use:* In-vivo cancer therapy and vaccines (because their high immunogenicity helps alert the immune system).
    *   *Risk:* High immune response; transient expression requires repeated dosing.
3.  **Adeno-Associated Viruses (AAVs):**
    *   *Mechanism:* Mostly remain episomal but can provide long-term gene expression (years) in non-dividing cells. Very low immunogenicity and high safety profile.
    *   *Use:* The current "gold standard" for in-vivo gene therapy (e.g., Zolgensma, Luxturna).
    *   *Risk:* Small packaging capacity (can only carry small genes); pre-existing immunity in some patients.

### B. Non-Viral Gene Transfer Systems
Developed to overcome the safety concerns (immunogenicity and mutagenesis) of viral vectors. They rely on physical or chemical methods.
1.  **Physical Methods:**
    *   *Electroporation:* Applying an electrical pulse to create temporary pores in the cell membrane for DNA entry.
    *   *Gene Gun:* Bombarding cells with DNA-coated microscopic gold particles.
    *   *Microinjection:* Directly injecting DNA into the nucleus using a fine needle.
2.  **Chemical Methods:**
    *   *Naked DNA/RNA:* Simple injection of plasmid DNA (low efficiency).
    *   *Calcium Phosphate Co-precipitation:* Mixing DNA with calcium salts to form a precipitate that cells engulf.
    *   **Liposomal Delivery Systems** *(Detailed in the next section).*

---

## 5. LIPOSOMAL GENE DELIVERY SYSTEMS (5 Marks)
Liposomes are microscopic, spherical vesicles composed of one or more phospholipid bilayers enclosing an aqueous core. They are the most widely studied non-viral vector for nucleic acid delivery.

### A. Why Use Liposomes for Gene Delivery?
*   **Protection:** Shield the nucleic acid from degradation by serum nucleases.
*   **Biocompatibility:** Made from natural lipids, they are generally non-toxic and non-immunogenic (unlike viruses).
*   **Versatility:** Can be engineered to carry large DNA plasmids, mRNA, or siRNA.
*   **Targeting:** Surface can be modified with Polyethylene Glycol (PEG) to avoid immune clearance (stealth liposomes) or attached with ligands/antibodies for cell-specific targeting.

### B. Types of Liposomes Used
1.  **Cationic Liposomes (Most Common for Genes):**
    *   Nucleic acids (DNA/RNA) are highly negatively charged. Cationic liposomes have a positive surface charge.
    *   *Mechanism:* The positive liposome and negative nucleic acid spontaneously condense to form a complex called a **"Lipoplex."**
    *   *Cell Entry:* The lipoplex binds to negatively charged cell membrane proteoglycans, enters via endocytosis, and must escape the endosome before it is degraded.
    *   *Examples:* DOTMA, DOTAP (often combined with helper neutral lipids like DOPE to aid in endosomal escape).
2.  **Anionic/Neutral Liposomes:**
    *   Do not readily bind to DNA. Require complexation agents or must encapsulate the DNA inside the aqueous core (which is inefficient for large plasmids). Less commonly used for gene transfer directly.

### C. Mechanism of Liposomal Gene Transfer
1.  **Formation:** Cationic liposomes mix with DNA/RNA $\rightarrow$ Lipoplex formation.
2.  **Binding:** Lipoplex attaches to the target cell surface.
3.  **Endocytosis:** The cell membrane engulfs the lipoplex into an endosome.
4.  **Endosomal Escape:** (The hardest step). Helper lipids (like DOPE) destabilize the endosomal membrane, allowing the nucleic acid to leak into the cytoplasm.
5.  **Nuclear Entry:** For DNA expression, the plasmid must enter the nucleus. (For mRNA or siRNA, action occurs directly in the cytoplasm).

### D. Advantages & Limitations of Liposomal Vectors
*   **Advantages:** Completely safe (no risk of viral infection), no limit on DNA size, easy to manufacture at scale, can be given repeatedly without immune rejection.
*   **Limitations:** Lower transfection efficiency compared to viral vectors; toxicity can occur with high doses of cationic lipids; inability to achieve long-term gene expression (because they don't integrate into the genome).

### E. Modern Evolution: Lipid Nanoparticles (LNPs)
*   While traditional liposomes have a bilayer, modern gene therapies (like the **COVID-19 mRNA vaccines** by Pfizer/Moderna, and **Patisiran** for liver disease) use **LNPs**.
*   LNPs are structurally different (they do not have a continuous aqueous core but rather an inverted micelle core), making them highly stable and significantly better at endosomal escape than traditional liposomes. They represent the current pinnacle of non-viral nucleic acid delivery.