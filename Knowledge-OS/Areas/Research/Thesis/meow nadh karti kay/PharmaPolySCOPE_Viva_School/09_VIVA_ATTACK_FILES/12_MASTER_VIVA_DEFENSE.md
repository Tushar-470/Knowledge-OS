# 12. MASTER VIVA DEFENSE PRINCIPLES

This document outlines the core epistemic principles required to defend the PharmaPolySCOPE architecture under hostile viva examination. 

## The 15 Immutable Defense Principles

1. **Never claim more than the model establishes.** Stick strictly to what is computationally calculated and explicitly documented in the framework architecture.
2. **Never confuse computational ranking with experimental success.** A high $C_L$ or top-1 frequency means the polymer is mathematically closer to the defined ideal reference under the implemented criteria, not that it will form a stable amorphous solid dispersion in vitro.
3. **Never confuse sensitivity with causality.** Morris sensitivity ($\mu^*$) measures the mean absolute elementary effect caused by input perturbations, not a variance decomposition or physical causation.
4. **Never confuse consistency with correctness.** An AHP Consistency Ratio (CR) < 0.08 diagnoses mathematical consistency among pairwise comparison judgments, not that they are scientifically "true" or optimal.
5. **Never confuse numerical verification with scientific validation.** You must explicitly distinguish between software verification, numerical verification, integration verification, reproducibility, computational scientific validation, and experimental formulation validation. The current study is Class B — Validation Pass with Documented Environment Limitation. Experimental formulation validation remains PENDING.
6. **Never silently repair corrupted scientific input.** (e.g., DRG-0002). If a stored structure is inconsistent with the intended profile, it must be quarantined, not patched or ranked.
7. **Never mix v1.5 and v2 methodology.** v1.5 uses static $K=2$. v2 uses dynamic $K$ based on cumulative variance $\ge 95\%$ and a quadratic-form metric tensor $M_K = V_K^T W V_K$ induced by physical AHP (SP-PRP-TOPSIS).
8. **Never pool raw PCA coordinates from unrelated local geometries.** Different drugs yield different covariance structures. $C_L$ is a local relative metric within that specific chemical space.
9. **Never describe computational perturbation parameters as experimentally calibrated unless evidence exists.** $\sigma_{score} = 0.05$ and $\sigma_{AHP} = 0.15$ define a computational perturbation model, not a calibrated model of experimental error.
10. **Always identify the unit of analysis.** Are you discussing a deterministic $C_L$ value, a Monte Carlo frequency, a descriptor value, or an AHP weight?
11. **Always identify the denominator of a percentage.** A 55.5116% top-1 frequency is calculated over $N_{valid} = 8600$ surviving replicates, not the $10,000$ generated. 1400 replicates were blocked by governance failures (1396 AHP, 4 eigengap).
12. **Always identify whether a value is measured, literature-derived, calculated, or derived.** E.g., The AHP weights are derived; the SMILES are inputs; the PCA eigenvalues are calculated.
13. **Always state the limitation when answering an aggressive examiner.** Acknowledge what the model *cannot* do before defending what it *can* do.
14. **If the examiner's premise is false, correct the premise before answering.** If asked "Why does your model prove Soluplus works?", first correct the premise: "The model does not prove it works; it identifies it as the top computational candidate..."
15. **If the model cannot answer the question, say exactly what additional experiment/data would be required.** "To answer that, we would need experimental dissolution profiles or XRPD stability data."

## Strategic Stance

- **Maintain the Boundary:** You are defending a computational screening tool. It is a decision-support system, not a crystal ball.
- **Embrace Limitations as Strengths:** Admitting that the model lacks experimental validation (currently Class B Validation) shows scientific maturity. Do not try to upgrade it to Class A without the required experimental data. No "independent hold-out set" claims can be made unless explicitly in an authoritative artifact.
- **Trace Everything:** When asked a numerical question, trace it to the actual implemented architecture. "The $N_{valid}$ denominator is enforced by the governance framework..."

---
*Module 09 is an implementation-aligned viva-defense module designed to train scientific and methodological defense of PharmaPolySCOPE within its documented computational scope. It does not convert computational evidence into experimental formulation validation.*
