# Module 07: Software Architecture — Document 01: Software Architecture From Zero

---

## 1. What is Software Architecture?

### Layer A: Concept (Plain English from First Principles)
Imagine you decide to build a wooden doghouse in your backyard. You do not need architectural blueprints, soil compaction analyses, structural load calculations, or a team of specialized plumbers and electricians. You buy several planks of pine, a box of nails, and a hammer. You measure by eye, saw the wood, nail the pieces together, and if the roof leaks, you slap on a strip of tar paper. This is the software equivalent of a **scientific script**: a single flat file written in Python, MATLAB, or R, written to produce a single plot for a journal paper.

Now imagine building a 60-story biopharmaceutical research hospital in a seismically active zone. If you attempt to construct that hospital using the doghouse methodology—nailing beams together as you think of them, routing high-voltage power through water pipes, and knocking down load-bearing walls whenever you need another doorway—the entire edifice will collapse, crushing everyone inside. 

**Software architecture** is the set of fundamental design choices, structural abstractions, boundary enforcement rules, and invariants that determine:
1. What the constituent components of a system are;
2. How those components communicate and exchange information;
3. What responsibilities each component is strictly forbidden from assuming;
4. How the software guarantees mathematical, numerical, and scientific correctness under arbitrary runtime perturbations.

Architecture is not "coding." Coding is construction (laying bricks, pouring concrete). Architecture is the blueprint that dictates *where* the load-bearing columns must stand, *how* thermal expansion joints decouple vibration, and *why* sterile operating suites must never share unfiltered airflow with the infectious disease ward.

```
+-----------------------------------------------------------------------------+
|                          THE SCRIPT FAILURE PARADOX                         |
|                                                                             |
|   Single Research Script (100 lines)        Scalable Platform (25,000 lines)|
|   +-------------------------------+        +-------------------------------+|
|   | Global variables everywhere   |        | Strict stateless execution    |
|   | Hardcoded file paths          |        | Pure mathematical transforms  |
|   | In-place matrix mutation      |  --->  | Deep-frozen immutable outputs |
|   | Web & math mixed together     |        | Decoupled presentation layer  |
|   | Silent floating-point drifts  |        | Cryptographic audit trails    |
|   +-------------------------------+        +-------------------------------+|
|   Works once on author's laptop.           Survives regulatory audit & viva.|
+-----------------------------------------------------------------------------+
```

### Layer B: PharmaPolySCOPE Implementation
In the PharmaPolySCOPE repository, software architecture separates the mathematical decision mechanics from presentation, input validation, and web serving:
- **Stateless Mathematical Engine**: [`VariableKEngine`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/engine.py#L47-L100) in [`src/asd_mcda/v2/engine.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/engine.py). It holds **zero internal state** across calls (`self.__init__()` executes only `pass`).
- **Thermodynamic Model Isolation**: Physical criterion calculations ($s_{HSP}$, $s_{\chi}$, $s_{desc}$, $s_{GT}$) reside exclusively in [`src/asd_mcda/compatibility/`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/compatibility/) ([`hsp_model.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/compatibility/hsp_model.py), [`flory_huggins.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/compatibility/flory_huggins.py), [`gordon_taylor.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/compatibility/gordon_taylor.py), [`matrix.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/compatibility/matrix.py)).
- **Bridge Adapter Layer**: The web layer does not interact directly with raw math routines; it calls [`backend/services/engine_adapter.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/backend/services/engine_adapter.py), which enforces validation gates, execution tier isolation (`AUTHORITATIVE_RESEARCH` vs `EXPLORATORY_SCREENING`), and file workspace creation.
- **Presentation Decoupling**: The user interface is a decoupled Single Page Application (SPA) built with React 18 and Vite in [`frontend/src/`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/frontend/src/), communicating across a strictly validated HTTP REST JSON boundary defined in [`backend/api/screening.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/backend/api/screening.py#L17-L48).

### Layer C: Why It Matters
A scientific paper might describe an algorithm in LaTeX equations. However, equations do not run on silicon. When translated into code, naively written software introduces hidden dependencies, unintended side effects (such as memory mutation), race conditions, and platform-specific floating-point artifacts. In pharmaceutical formulation, where candidate polymer rankings decide multi-million-dollar formulation campaigns and clinical trial manufacturing protocols, an undetected off-by-one error or memory bleed across Monte Carlo replicates destroys the integrity of the thesis. Clean architecture ensures that every single mathematical result is strictly reproducible, deterministic, and fully auditable.

---

## 2. Why Scientific Software Needs Formal Architecture

### Layer A: Concept
In wet-lab experimental science, physical containment and sterile barriers prevent sample contamination. If you prepare an HPLC sample using a pipette contaminated with residual surfactant from a previous experiment, your chromatographic peaks are invalid. You do not blame the HPLC detector; you blame the laboratory technique.

In computational science, **state contamination** is invisible. If a function mutates an array in-place, or if a global variable persists between two runs of a model, the second run is secretly corrupted by the first. 

Furthermore, **mathematical correctness does not guarantee computational reproducibility**. Consider this reality:
1. $A \times (B + C) = A \times B + A \times C$ is an exact theorem in real analysis ($\mathbb{R}$). On a computer running IEEE 754 floating-point arithmetic ($\mathbb{F}_{64}$), this equality often fails at the 16th decimal place due to non-associative rounding.
2. An eigenvalue solver might find the correct subspace, but eigenvectors are defined only up to an arbitrary sign factor ($\pm v$). If run on two different CPU architectures (Intel vs ARM) or different BLAS/LAPACK implementations (OpenBLAS vs Intel MKL), an unconstrained solver can return $+v$ on one machine and $-v$ on another, flipping the coordinate orientation of your decision space without warning.
3. Without architectural gates, a user could feed negative temperatures, invalid chemical SMILES strings, or rank-deficient matrices into an algorithm, yielding mathematically meaningless numbers that look superficially plausible.

### Layer B: PharmaPolySCOPE Implementation
PharmaPolySCOPE addresses these hazards through explicit architectural mechanisms:
- **Deterministic Sign Canonicalization**: [`canonicalize_eigenvector_sign()`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/pca.py#L14-L50) in [`src/asd_mcda/v2/pca.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/pca.py) inspects the element with the maximum absolute magnitude. If multiple elements tie within $10^{-12}$, the lowest-index element breaks the tie. If that element is negative, the entire eigenvector is multiplied by $-1$. This guarantees identical spatial orientation across all operating systems and hardware platforms.
- **Fail-Fast Input Gates**: In [`src/asd_mcda/v2/standardization.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/standardization.py#L46-L65), `standardize_cohort()` validates that the input matrix has shape $(n, 4)$, $n \ge 2$, and values in $[0, 1]$. If any column exhibits zero variance ($\sigma_j \le 0$), it raises [`ZeroVarianceStandardizationError`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/exceptions.py#L19-L22) rather than dividing by zero or producing `NaN` / `Inf` floats.
- **Cheminformatics Validation Gate**: In [`src/asd_mcda/v2/chemistry.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/chemistry.py#L65-L105), `validate_chemical_structure()` parses input SMILES strings through RDKit (`Chem.MolFromSmiles`) and forces sanitization (`Chem.SanitizeMol`). If parsing fails, it immediately raises [`RDKitParseFailureError`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/exceptions.py#L93-L96), completely blocking ungrounded structures from polluting physical calculations.

### Layer C: Why It Matters
Regulatory bodies (such as the US FDA under 21 CFR Part 11 and ICH Q8/Q9/Q10 guidelines for Quality by Design) demand that computational models used in drug product development exhibit verified data integrity, provenance, and auditability. When an examiner in a PhD viva asks: *"How do you know that Polymer A was ranked 1st because of thermodynamic compatibility rather than a cached variable from the previous run?"*, the candidate cannot simply say *"I trust Python."* The candidate must prove that the software architecture makes state leakage physically impossible.

---

## 3. Core Architectural Taxonomies

To defend software architecture, a doctoral candidate must master four foundational taxonomies.

```
+-----------------------------------------------------------------------------+
|                     TAXONOMY 1: SCOPE AND PACKAGING                         |
|                                                                             |
|  [ Script ]                                                                 |
|     |  A single .py file executed top-to-bottom. No encapsulation.          |
|     v                                                                       |
|  [ Module ]                                                                 |
|     |  A single .py file designed to be imported by other files (e.g. pca.py)|
|     v                                                                       |
|  [ Package ]                                                                |
|     |  A directory containing an __init__.py and multiple modules           |
|     |  (e.g., src/asd_mcda/v2/ forming the Variable-K computational engine) |
|     v                                                                       |
|  [ Framework ]                                                              |
|        An integrated ecosystem of packages, services, APIs, and UIs        |
|        governed by overarching protocols (PharmaPolySCOPE v1.5 / v2.0).     |
+-----------------------------------------------------------------------------+
```

### 3.1 Script vs Module vs Package vs Framework

#### Script
- **Plain English**: A grocery list or a single recipe jotted on an index card.
- **Technical Definition**: A standalone text file containing sequential programming statements intended to be executed directly from top to bottom by an interpreter (`python script.py`). It typically lacks reusability, modular structure, and input abstraction.
- **PharmaPolySCOPE Implementation**: [`scripts/run_v2_validation.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/scripts/) is a batch script used to trigger validation studies across reference drug cohorts. It imports from packages but contains no business logic itself.

#### Module
- **Plain English**: A specialized kitchen tool, like a digital thermometer or a pasta roller.
- **Technical Definition**: A single Python file (`.py`) that encapsulates related functions, classes, and constants designed to be imported and reused by other programs without side effects upon importation.
- **PharmaPolySCOPE Implementation**: [`src/asd_mcda/v2/ahp.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/ahp.py). It has one cohesive duty: solving the $4 \times 4$ Analytic Hierarchy Process preference matrix, calculating the Consistency Ratio ($CR$), and verifying the governance threshold ($CR < 0.08$).

#### Package
- **Plain English**: A fully stocked, commercial kitchen station dedicated entirely to baking, containing all relevant tools, bowls, and measuring devices.
- **Technical Definition**: A directory in a filesystem containing an `__init__.py` file and one or more modules or subpackages, presenting a unified namespace to external consumers.
- **PharmaPolySCOPE Implementation**: [`src/asd_mcda/v2/`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/). This package houses all 15 modules comprising the Phase 4/5 Variable-K computational engine.

#### Framework
- **Plain English**: An entire culinary institute, complete with procurement departments, food safety inspectors, standard operating procedures, refrigeration, and dining rooms.
- **Technical Definition**: A comprehensive software suite that provides an overarching architectural scaffold. A framework dictates the control flow of an application (the "Hollywood Principle": *Don't call us, we'll call you*), providing shared libraries, configuration systems, data contracts, and execution pipelines.
- **PharmaPolySCOPE Implementation**: The overall `asd_framework` repository, uniting physical criteria models in `src/asd_mcda/compatibility/`, the decision engine in `src/asd_mcda/v2/`, the REST backend in `backend/`, and the client interface in `frontend/`.

---

```
+-----------------------------------------------------------------------------+
|                      TAXONOMY 2: CODE AND DATA ABSTRACTION                  |
|                                                                             |
|  [ Function ]                                                               |
|     |  Pure mathematical transformation: y = f(x). No persistent memory.   |
|     v                                                                       |
|  [ Class ]                                                                  |
|     |  The blueprint defining capabilities, contracts, or properties.       |
|     v                                                                       |
|  [ Object / Instance ]                                                      |
|     |  The realized entity created from a class in computer RAM.            |
|     v                                                                       |
|  [ Data Structure / Contract ]                                              |
|        A frozen, immutable record defining exact types, fields, and bounds  |
|        (e.g., VariableKDecisionSnapshot in models.py).                      |
+-----------------------------------------------------------------------------+
```

### 3.2 Function vs Class vs Object vs Data Structure

#### Function
- **Plain English**: A mathematical transformation machine. You drop raw oranges in the top, turn the crank, and freshly squeezed orange juice comes out the bottom. The machine retains no oranges inside.
- **Technical Definition**: A named, self-contained block of instructions that accepts zero or more typed arguments, performs a deterministic computation, and returns an output. In pure functional programming, a function has zero side effects (it does not modify external memory or mutate its input arguments).
- **PharmaPolySCOPE Implementation**: `solve_ahp_preference(pairwise_matrix, reciprocity_tolerance)` in [`src/asd_mcda/v2/ahp.py:22-103`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/ahp.py#L22-L103). Given an input matrix $A$, it computes eigenvalues via `scipy.linalg.eig`, extracts the principal eigenvector, normalizes it to sum to 1, computes $CR$, and returns `(w_phys, cr)`. It mutates nothing.

#### Class
- **Plain English**: The architectural schematic or cookie cutter. It is not the cookie; it is the metal cutter that defines what shape any cookie made with it will have.
- **Technical Definition**: An extensible code template for creating instances, bundling state (attributes) and behavior (methods) together under an encapsulated namespace.
- **PharmaPolySCOPE Implementation**: [`VariableKEngine`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/engine.py#L47-L100) in [`src/asd_mcda/v2/engine.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/engine.py). It acts as the stateless orchestrator class for the entire SP-PRP-TOPSIS pipeline.

#### Object (Instance)
- **Plain English**: An actual cookie stamped out by the cutter, resting on the baking sheet.
- **Technical Definition**: A concrete realization of a class allocated in memory during program execution.
- **PharmaPolySCOPE Implementation**: When the backend executes `engine = VariableKEngine()`, Python allocates an instance of `VariableKEngine` in heap memory. Because the class is stateless, multiple instances are functionally identical and share no mutable cross-references.

#### Data Structure / Contract
- **Plain English**: A sealed, tamper-evident legal document. Once the numbers are typed and the wax seal is pressed, not a single digit can be altered without breaking the seal.
- **Technical Definition**: A specialized record format designed to store and organize typed data. In PharmaPolySCOPE, all primary data structures are implemented as **frozen dataclasses** (`@dataclass(frozen=True)`).
- **PharmaPolySCOPE Implementation**: [`VariableKDecisionSnapshot`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/models.py#L198-L240) in [`src/asd_mcda/v2/models.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/models.py). It encapsulates every parameter, matrix, eigenvalue, weight, distance, rank, and cryptographic hash produced during an analysis run, sealing them permanently against modification.

---

```
+-----------------------------------------------------------------------------+
|                      TAXONOMY 3: SYSTEM INTERFACES                          |
|                                                                             |
|  [ Interface / API ]                                                        |
|     |  The contractual boundary (e.g. REST POST /api/screening/run).        |
|     v                                                                       |
|  [ Engine ]                                                                 |
|     |  The computational core executing pure scientific algorithms          |
|     |  (VariableKEngine, MonteCarloEngine, MorrisSensitivityEngine).        |
|     v                                                                       |
|  [ Pipeline ]                                                               |
|     |  The linear, sequenced orchestration of discrete mathematical steps   |
|     |  (Standardize -> PCA -> Stability -> AHP -> Metrics -> Diagnostics).  |
|     v                                                                       |
|  [ Adapter ]                                                                |
|        The translation bridge converting web schemas into mathematical      |
|        arrays and vice-versa (backend/services/engine_adapter.py).          |
+-----------------------------------------------------------------------------+
```

### 3.3 Interface / API vs Engine vs Pipeline vs Adapter

#### Interface / API (Application Programming Interface)
- **Plain English**: The electrical wall socket. Your lamp does not know whether the electricity was generated by nuclear fission, a hydroelectric dam, or a wind turbine. The lamp only cares that the socket provides exactly 120V AC at 60Hz through two prongs.
- **Technical Definition**: A formal boundary and communication contract across which two software systems exchange requests and responses. The consumer interacts solely through the published signatures or HTTP endpoints, completely insulated from internal implementation changes.
- **PharmaPolySCOPE Implementation**: The REST endpoint `POST /api/screening/run` defined in [`backend/api/screening.py:17-48`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/backend/api/screening.py#L17-L48). It accepts a JSON payload conforming to [`ScreeningRequest`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/backend/models/schemas.py) and guarantees a response conforming to [`ScreeningResponse`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/backend/models/schemas.py).

#### Engine
- **Plain English**: The jet turbine mounted beneath an airplane wing. It takes in air and fuel, ignites them, and produces forward thrust. It does not decide the flight destination, steer the rudder, or serve in-flight meals.
- **Technical Definition**: The core, computationally intensive software subsystem responsible for executing domain-specific scientific algorithms without external application overhead.
- **PharmaPolySCOPE Implementation**: [`VariableKEngine`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/engine.py#L47-L100), [`MonteCarloEngine`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/uncertainty.py#L19-L50), and [`MorrisSensitivityEngine`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/sensitivity.py#L19-L50). They know nothing about HTTP, cookies, JSON formatting, or user interfaces; they operate strictly on NumPy arrays and physical parameters.

#### Pipeline
- **Plain English**: An automated pharmaceutical packaging line. Blister cards are stamped, tablets are dropped into pockets, an aluminum foil seal is heat-welded, and a camera inspects for defects. If any station fails, the conveyor halts immediately.
- **Technical Definition**: A sequential series of discrete processing elements where the output of each stage serves directly as the validated input to the subsequent stage.
- **PharmaPolySCOPE Implementation**: The 9-step execution sequence inside `VariableKEngine.evaluate()` ([`src/asd_mcda/v2/engine.py:58-325`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/engine.py#L58-L325)):
  1. Input Validation & Criteria Verification
  2. Cohort Standardization (`standardize_cohort()`, $ddof=0$)
  3. Spectral Decomposition (`decompose_spectral()`, $\lambda_j, V$, variance $\ge 0.95$)
  4. Boundary Eigengap Evaluation (`evaluate_subspace_stability()`, $\delta_K$)
  5. AHP Preference Weighting (`solve_ahp_preference()`, $CR < 0.08$)
  6. Subspace Metric Tensor Construction ($M_K = V_K^T W V_K$)
  7. Physical Reference Projection ($t_+ = V_K^T z_+, t_- = V_K^T z_-$)
  8. Quadratic Closeness Evaluation ($C_L = \frac{D^-}{D^+ + D^-}$)
  9. Truncation Auditing & Cryptographic Sealing (`audit_truncation_discrepancy()`)

#### Adapter (The Adapter / Bridge Pattern)
- **Plain English**: A travel plug adapter that allows a British three-prong square plug to connect seamlessly into an Italian two-prong round wall socket.
- **Technical Definition**: A design pattern that converts the interface of one class into another interface that clients expect. It enables classes with incompatible interfaces to collaborate cleanly without mutating either codebase.
- **PharmaPolySCOPE Implementation**: [`backend/services/engine_adapter.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/backend/services/engine_adapter.py). The FastAPI web routes deal with web-tier dictionary payloads, string identifiers, and disk paths. The scientific engine expects NumPy float64 matrices, strict canonical column tuples, and frozen contracts. `engine_adapter.py` acts as the bridge: it extracts data from SQLite or JSON, formats the $(n, 4)$ matrix $S$, invokes the engine, captures the frozen snapshot, generates ReportLab PDF reports, and serializes the results back to the web schema.

---

```
+-----------------------------------------------------------------------------+
|                      TAXONOMY 4: LAYERED ARCHITECTURE                       |
|                                                                             |
|  [ Presentation Layer (Frontend) ]                                          |
|     React 18 + TypeScript + Vite (Browser UI, Charts, Interactive Tables)   |
|                               ^                                             |
|                               | HTTP REST / JSON                            |
|                               v                                             |
|  [ Application Layer (Backend API) ]                                        |
|     FastAPI Routes, CORS, Request Validation, Error Handling                |
|                               ^                                             |
|                               | Native Python Objects                       |
|                               v                                             |
|  [ Service / Adapter Layer ]                                                |
|     engine_adapter.py, validation.py, pdf_report_generator.py               |
|                               ^                                             |
|                               | Strict Mathematical Arrays                  |
|                               v                                             |
|  [ Domain / Computational Core (Engine) ]                                   |
|     VariableKEngine, SP-PRP-TOPSIS, Thermodynamic Models (compatibility/)   |
|                               ^                                             |
|                               | File I/O & Hashes                           |
|                               v                                             |
|  [ Persistence Layer ]                                                      |
|     data/analyses/, data/history.db, config/drugs/, config/polymers/        |
+-----------------------------------------------------------------------------+
```

### 3.4 Frontend vs Backend vs Service Layer vs Persistence

#### Frontend (Presentation Layer)
- **Plain English**: The cockpit of an airplane. It displays digital dials, altimeters, radar screens, and control sticks. It does not generate engine thrust; it visualizes flight telemetry and captures pilot commands.
- **Technical Definition**: The client-side software executing within the user's web browser, responsible for graphical user interface (GUI) rendering, user input capture, local visual validation, and REST API communication.
- **PharmaPolySCOPE Implementation**: Located in [`frontend/`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/frontend/). Built with React 18, TypeScript, Vite, Tailwind CSS, and Lucide icons. Key views include [`Dashboard.tsx`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/frontend/src/pages/Dashboard.tsx), [`Screening.tsx`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/frontend/src/pages/Screening.tsx), and [`Results.tsx`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/frontend/src/pages/Results.tsx).

#### Backend (Application Layer)
- **Plain English**: The air traffic control tower. It receives incoming flight plans, verifies pilot credentials, schedules runway access, and routes messages between the cockpit and maintenance crews.
- **Technical Definition**: The server-side program that listens on a network port, processes HTTP requests, enforces security/CORS rules, deserializes incoming JSON payloads into typed schemas, and routes execution to appropriate application services.
- **PharmaPolySCOPE Implementation**: Located in [`backend/`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/backend/). Configured in [`backend/main.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/backend/main.py), which instantiates the FastAPI application, mounts CORS middleware, mounts static files, and binds route modules from [`backend/api/`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/backend/api/).

#### Service Layer (Business Logic / Orchestration)
- **Plain English**: The aircraft maintenance coordinator. When a pilot requests an engine overhaul, the coordinator does not turn wrenches personally; they review the flight logs, order authentic replacement parts from the warehouse, instruct the certified mechanics to follow standard protocol, and file the maintenance certification.
- **Technical Definition**: The intermediary architectural layer that coordinates application workflows. It retrieves domain entities from persistence, enforces business rules (such as validating that a drug profile has research-grade status before allowing Research Mode screening), orchestrates computational engines, and triggers report generation.
- **PharmaPolySCOPE Implementation**: [`backend/services/engine_adapter.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/backend/services/engine_adapter.py), [`backend/services/validation.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/backend/services/validation.py), and [`backend/services/pdf_report_generator.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/backend/services/pdf_report_generator.py).

#### Persistence Layer (Data Storage)
- **Plain English**: The aircraft black box and library archives. It stores indelible records of every flight, fuel receipt, and inspection checklist in secure fireproof vaults.
- **Technical Definition**: The storage mechanisms responsible for persisting application state across system restarts. This includes relational databases, configuration files, and filesystem directories storing artifacts.
- **PharmaPolySCOPE Implementation**:
  - Reference and user compound profiles: [`config/drugs/*.json`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/config/drugs/) and [`config/polymers/*.csv`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/config/polymers/).
  - Execution history database: SQLite database accessed via [`backend/services/history_db.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/backend/services/history_db.py).
  - Immutable analysis vaults: [`data/analyses/{analysis_id}/`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/data/analyses/) containing generated figures (`figures/`), markdown summaries (`reports/*.md`), Excel workbooks (`reports/*.xlsx`), and cryptographically signed PDF dossiers (`reports/*.pdf`).

---

## 4. Separation of Concerns & Clean Architecture in PharmaPolySCOPE

### Layer A: Concept
The fundamental principle of **Clean Architecture** (pioneered by Robert C. Martin and David Parnas) states that **business rules and mathematical truths must never depend on delivery mechanisms**. 

Whether a matrix multiplication is initiated from a web browser button, an automated unit test, a command-line terminal, or an HPC cluster job script, the underlying mathematics must execute identically. The core mathematical engine must never know that the internet, HTTP, JSON, or web browsers even exist.

```
+-----------------------------------------------------------------------------+
|               THE PHARMAPOLYSCOPE CLEAN ARCHITECTURE ONION                  |
|                                                                             |
|      +---------------------------------------------------------------+      |
|      |  PRESENTATION: React 18 SPA (Vite, TypeScript, Tailwind)      |      |
|      |   +-------------------------------------------------------+   |      |
|      |   |  DELIVERY: FastAPI HTTP REST Layer (backend/api/)     |   |      |
|      |   |   +-----------------------------------------------+   |   |      |
|      |   |   |  ADAPTER: engine_adapter.py, validation.py     |   |   |      |
|      |   |   |   +---------------------------------------+   |   |   |      |
|      |   |   |   |  DOMAIN: src/asd_mcda/compatibility/  |   |   |   |      |
|      |   |   |   |  (Flory-Huggins, Gordon-Taylor, HSP)  |   |   |   |      |
|      |   |   |   |   +-------------------------------+   |   |   |   |      |
|      |   |   |   |   |  CORE ENGINE: asd_mcda/v2/    |   |   |   |   |      |
|      |   |   |   |   |  (VariableKEngine, SP-PRP-   |   |   |   |   |      |
|      |   |   |   |   |   TOPSIS, Monte Carlo, Morris)|   |   |   |   |      |
|      |   |   |   |   +-------------------------------+   |   |   |   |      |
|      |   |   |   +---------------------------------------+   |   |   |      |
|      |   |   +-----------------------------------------------+   |   |      |
|      |   +-------------------------------------------------------+   |      |
|      +---------------------------------------------------------------+      |
|                                                                             |
|   DEPENDENCY RULE: Dependencies point strictly INWARD.                      |
|   The Core Engine has ZERO dependencies on Adapter, Web, or Frontend.       |
+-----------------------------------------------------------------------------+
```

### Layer B: PharmaPolySCOPE Implementation
Let us trace how the repository enforces strict separation across its layers:

#### 1. Thermodynamic & Physical Models (`src/asd_mcda/compatibility/`)
- Contains domain physics and physical chemistry equations:
  - [`hsp_model.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/compatibility/hsp_model.py): Implements Hansen Solubility Parameter Euclidean distance $R_a$ and Relative Energy Difference $RED = R_a / R_0$, mapping to $s_{HSP} = \max(0, 1 - RED/2)$.
  - [`flory_huggins.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/compatibility/flory_huggins.py): Implements Lindvig-corrected Flory–Huggins interaction parameter $\chi$, critical boundary $\chi_c = 0.5(1 + 1/\sqrt{r_2})^2$, and $s_{\chi} = \max(0, 1 - \chi)$.
  - [`gordon_taylor.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/compatibility/gordon_taylor.py): Computes Simha–Boyer constant $K = \frac{\rho_{drug} T_{g,drug}}{\rho_{poly} T_{g,poly}}$, mixture glass transition $T_{g,mix} = \frac{w_1 T_{g1} + K w_2 T_{g2}}{w_1 + K w_2}$, and kinetic elevation margin $s_{GT} = \text{clip}\left(\frac{T_{g,mix} - (T_{g,drug} + 30)}{50}, 0, 1\right)$.
  - [`matrix.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/compatibility/matrix.py): `CompatibilityMatrix` orchestrates the three models above plus molecular descriptor matching ($s_{desc}$) to construct the $n \times 4$ candidate decision matrix $S$.

#### 2. Core Decision Mathematical Engine (`src/asd_mcda/v2/`)
- Contains zero thermodynamic equations and zero web imports:
  - Consumes solely raw mathematical arrays $S \in [0, 1]^{n \times 4}$ and the $4 \times 4$ AHP pairwise comparison matrix $A$.
  - Executes the 9-step SP-PRP-TOPSIS variable-$K$ mathematical protocol.
  - Implements spectral decomposition via NumPy/SciPy, boundary eigengap evaluation, metric tensor projection $M_K = V_K^T W V_K$, and signed truncation discrepancy auditing.

#### 3. Web API & Application Adapter (`backend/services/` and `backend/api/`)
- [`backend/services/engine_adapter.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/backend/services/engine_adapter.py): Takes user requests, validates compound status, invokes `CompatibilityMatrix`, passes $S$ to `VariableKEngine`, and serializes snapshots into PDF and Excel reports.
- [`backend/api/screening.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/backend/api/screening.py): Exposes FastAPI endpoints. It handles HTTP status codes (200, 404, 422, 500) and transforms Python exceptions into JSON error responses.

#### 4. Interactive Presentation (`frontend/src/`)
- TypeScript / React application. It contains no Python code, performs no thermodynamic calculations, and cannot mutate the backend state. It merely displays telemetry, charts, and tables based on the returned `ScreeningResponse`.

### Layer C: Why It Matters
If web concerns (such as an HTTP header or a session token) leak into a mathematical module:
1. **Automated testing becomes impossible**: You cannot run high-speed unit tests or Monte Carlo simulations without spinning up a fake web server.
2. **Reusability is destroyed**: The engine cannot be packaged as a standalone command-line tool (`cli.py`) or embedded in an HPC workflow script.
3. **Audit boundaries collapse**: In a validation audit, software engineers must prove that the mathematical kernel has not changed. When mathematical logic is separated into an isolated package (`src/asd_mcda/v2/`), the mathematical kernel can be frozen and fingerprinted with a Git commit hash, completely insulating it from UI redesigns or web framework updates.

---

## 5. Immutability, Statelessness, and Zero State Leakage

### Layer A: Concept
In computing, **state** is the stored information or memory held by a system at a given moment in time. 
- A **stateful system** remembers past interactions. If you call `calculator.add(5)` and then call `calculator.add(10)`, the answer is 15 because the calculator remembered the 5 from earlier.
- A **stateless system** has no memory of past calls. Every request must supply all necessary inputs, and every output is calculated strictly from the provided parameters: `add(5, 10) = 15`.

**Mutation** occurs when an existing block of memory is modified in-place:
```python
# In-place mutation (DANGEROUS IN SCIENTIFIC COMPUTING)
def scale_matrix(matrix):
    matrix[:, 0] = matrix[:, 0] * 10  # Silently corrupts the caller's array!
```
If another part of the program was relying on the original values in `matrix`, it is now corrupted without any error being raised.

**Immutability** means that once an object is created in memory, it can never be altered. If you want to change it, you must create a new object containing the desired changes.

```
+-----------------------------------------------------------------------------+
|                       MUTABLE VS IMMUTABLE WORKFLOW                         |
|                                                                             |
|   Mutable Workflow (Vulnerable to State Corruption)                         |
|   [Caller Matrix S] ---> [Engine Mutates S in-place] ---> [Corrupted S]     |
|                                                                             |
|   PharmaPolySCOPE Deep-Frozen Architecture (Zero State Leakage)             |
|   [Caller Matrix S]                                                         |
|          |                                                                  |
|          v                                                                  |
|   [Defensive Copy: S.copy()]                                                |
|          |                                                                  |
|          v                                                                  |
|   [Stateless Transform: VariableKEngine.evaluate()]                         |
|          |                                                                  |
|          v                                                                  |
|   [deep_freeze(): flags.writeable = False, MappingProxyType]                 |
|          |                                                                  |
|          v                                                                  |
|   [VariableKDecisionSnapshot: Permanently Sealed & Read-Only]               |
+-----------------------------------------------------------------------------+
```

### Layer B: PharmaPolySCOPE Implementation

#### 1. Total Statelessness of `VariableKEngine`
In [`src/asd_mcda/v2/engine.py:47-56`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/engine.py#L47-L56):
```python
class VariableKEngine:
    """Stateless orchestrator for the SP-PRP-TOPSIS variable-K decision architecture.

    Executes Steps 1-9 in strict compliance with the frozen Phase 0 specification.
    Maintains zero persistent scientific state between evaluations.
    """

    def __init__(self) -> None:
        """Initialize a stateless VariableKEngine instance."""
        pass
```
The constructor `__init__` sets zero instance variables. There is no `self.S`, no `self.weights`, no `self.eigenvalues`, and no `self.results`. Every evaluation executed via `evaluate(...)` receives all inputs explicitly and returns an independent snapshot.

#### 2. Deep Freezing and Defensive Copying
In [`src/asd_mcda/v2/models.py:22-57`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/models.py#L22-L57):
```python
def deep_freeze(obj: Any) -> Any:
    """Recursively transform data structures into unbypassable immutable types."""
    if isinstance(obj, np.ndarray):
        copied_arr = np.copy(obj)
        copied_arr.flags.writeable = False
        return copied_arr
    elif isinstance(obj, Mapping):
        return MappingProxyType({k: deep_freeze(v) for k, v in obj.items()})
    elif isinstance(obj, (list, tuple)):
        return tuple(deep_freeze(item) for item in obj)
    elif isinstance(obj, (set, frozenset)):
        return frozenset(deep_freeze(item) for item in obj)
    elif isinstance(obj, (int, float, str, bool, bytes, type(None))):
        return obj
    else:
        raise TypeError(f"Unsupported mutable type for deep snapshot freeze: {type(obj)}")

def make_readonly(arr: Any) -> np.ndarray:
    """Ensure an array-like object is a defensively copied, read-only NumPy array."""
    if arr is None:
        raise ValueError("Cannot make None into a read-only array.")
    copied_arr = np.copy(np.asarray(arr, dtype=np.float64))
    copied_arr.flags.writeable = False
    return copied_arr
```
When an array passes through `make_readonly()`:
1. `np.copy()` allocates brand-new memory, decoupling the engine from any buffer owned by the caller.
2. `flags.writeable = False` is set at the C-extension level. If any code subsequently attempts an in-place assignment (`arr[0] = 99.0`), NumPy immediately raises `ValueError: assignment destination is read-only`.
3. Dictionaries are recursively wrapped in `MappingProxyType`, preventing addition, deletion, or modification of keys.

#### 3. Strict Prohibition of Inter-Replicate Caching in Monte Carlo Simulation
In [`src/asd_mcda/v2/uncertainty.py:8`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/uncertainty.py#L8):
```python
# Fresh re-evaluation of every replicate through VariableKEngine.evaluate(...) (no cached PCA).
```
During a 10,000-replicate Monte Carlo simulation, a naive programmer might attempt to "optimize" execution speed by calculating the PCA eigenvectors once from the baseline matrix and reusing them across all perturbed replicates. 

PharmaPolySCOPE **strictly forbids** this practice. Every perturbed decision score matrix $S^{(b)}$ represents an independent physical formulation state. It must undergo its own cohort standardization, construct its own empirical correlation matrix $R^{(b)} = \frac{1}{n} Z^{(b)T} Z^{(b)}$, compute its own spectral decomposition, dynamically select its own retained dimension $K^{(b)}$ based on the cumulative variance threshold ($\ge 0.95$), evaluate its own boundary eigengap $\delta_K^{(b)}$, and construct its own metric tensor $M_K^{(b)} = (V_K^{(b)})^T W^{(b)} V_K^{(b)}$. Caching the baseline PCA basis across replicates would cause catastrophic variance leakage, invalidating the dimension distribution $P(K=k)$.

### Layer C: Why It Matters
In scientific computing, caching and in-place mutations are the primary causes of "ghost bugs"—errors where running a simulation a second time yields different numbers than running it the first time. By enforcing complete statelessness and deep immutability, PharmaPolySCOPE guarantees mathematical determinism: given identical inputs, the system will produce bit-for-bit identical outputs across millions of evaluations.

---

## 6. The Four-Tier Versioning Architecture

### Layer A: Concept
When an academic presents a doctoral defense or submits software to regulatory authorities, saying *"I am using Version 2"* is dangerously ambiguous. 
- Does "Version 2" mean the Python package installed via pip?
- Does it mean the mathematical formulation of the algorithm?
- Does it mean the web interface?
- Does it refer to a specific Git commit in the version control history?

If an examiner finds a discrepancy between a table in Chapter 4 of the thesis and the web app running on the laptop, the defense can stall unless the software implements an explicit, multi-tiered versioning taxonomy.

```
+-----------------------------------------------------------------------------+
|                   THE FOUR-TIER VERSIONING ARCHITECTURE                     |
|                                                                             |
|  TIER 1: Framework / Package Distribution Version                           |
|  String: "1.5.0"                                                            |
|  Location: src/asd_mcda/__version__.py                                      |
|  Role: Pip package distribution anchor and backwards-compatibility anchor. |
|                                                                             |
|  TIER 2: Active Computational Engine Version                                |
|  Active Release: "2.0.0" (historical metadata: "2.0.0-draft")                                            |
|  Location: src/asd_mcda/v2/__init__.py, backend/services/engine_adapter.py  |
|  Role: Declares the active execution engine (Variable-K Architecture).      |
|                                                                             |
|  TIER 3: Mathematical Methodology Specification                             |
|  String: "2.0.0-SP-PRP-TOPSIS"                                              |
|  Location: src/asd_mcda/v2/provenance.py                                    |
|  Role: Formal scientific protocol identifier (9-step projected TOPSIS).    |
|                                                                             |
|  TIER 4: Scientific Baseline Git Commit Hash                                |
|  String: "31eee4d" (Full SHA-1: 31eee4d9bb1cc57b9185f9f958e225d51634c871)  |
|  Location: src/asd_mcda/v2/provenance.py                                    |
|  Role: Cryptographic anchor linking calculations to frozen v1.5 benchmark.  |
+-----------------------------------------------------------------------------+
```

### Layer B: PharmaPolySCOPE Implementation
PharmaPolySCOPE establishes a formal four-tier versioning hierarchy grounded in the codebase:

1. **Framework / Package Version: `1.5.0`**
   - File: [`src/asd_mcda/__version__.py:3`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/__version__.py#L3)
   - Code: `__version__ = "1.5.0"`
   - Purpose: Represents the base distribution package installed in the Python environment (`pip show asd-mcda`). It anchors backwards compatibility for legacy modules.

2. **Active Computational Engine Version: `2.0.0` (with `2.0.0-draft` as historical development metadata)**
   - Files: [`src/asd_mcda/v2/__init__.py:69`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/__init__.py#L69), [`backend/services/engine_adapter.py:108`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/backend/services/engine_adapter.py#L108)
   - Code: `__version__ = "2.0.0-draft"` (in `v2/__init__.py`), `ENGINE_VERSION = "2.0.0"` (in `engine_adapter.py`).
   - Purpose: Identifies the active computational execution engine that replaces the fixed-$K=2$ engine with the dynamic Variable-$K$ architecture.

3. **Methodology Specification: `2.0.0-SP-PRP-TOPSIS`**
   - File: [`src/asd_mcda/v2/provenance.py:18`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/provenance.py#L18)
   - Code: `METHODOLOGY_VERSION: str = "2.0.0-SP-PRP-TOPSIS"`
   - Purpose: Specifies the exact mathematical protocol: Subspace-Projected Physical-Reference-Point Technique for Order of Preference by Similarity to Ideal Solution.

4. **Scientific Baseline Commit: `31eee4d` (`FROZEN_V15_BASELINE_COMMIT`, full SHA-1: `31eee4d9bb1cc57b9185f9f958e225d51634c871`)**
   - File: [`src/asd_mcda/v2/provenance.py:20`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/provenance.py#L20)
   - Code: `FROZEN_V15_BASELINE_COMMIT: str = "31eee4d"`
   - Purpose: A permanent Git SHA-1 commit hash certifying the historical point in the version control graph where the Phase 0 benchmark dataset and thermodynamic models were frozen.

In addition, the system dynamically retrieves the runtime repository state via `get_repository_head_commit()` ([`src/asd_mcda/v2/provenance.py:23-35`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/provenance.py#L23-L35)) by running `git rev-parse HEAD`. Every generated PDF report and analysis snapshot records both the baseline commit (`31eee4d`) and the active repository commit.

### Layer C: Why It Matters
This four-tier taxonomy neutralizes forensic attacks during a viva examination. If an examiner asks: *"Your package says version 1.5.0, but your methodology is 2.0.0-SP-PRP-TOPSIS. Is this a packaging mistake?"*, the candidate can defend the system with absolute clarity:
> *"No, Professor. Version 1.5.0 is the package distribution anchor for the broader framework, maintaining backwards compatibility with legacy physical descriptors. The computational engine operating inside that framework is the Variable-K Engine v2.0.0, which executes the 2.0.0-SP-PRP-TOPSIS mathematical specification, validated against the frozen scientific baseline commit 31eee4d."*

---

## 7. Viva Defense Scenarios (10 Layered 5-Part Scenarios)

### Scenario 1: Why Scientific Code Needs Architecture Over Monolithic Scripts
- **Direct Answer**: Monolithic scripts conflate data loading, physics calculations, statistical modeling, and plotting, creating hidden global state, in-place memory mutations, and zero unit-testability, which guarantees reproducibility failure at scale.
- **Reasoning**: When mathematical logic is embedded in a flat script, variables persist in global interpreter memory. Subsequent runs can secretly inherit state from earlier executions. Furthermore, errors in UI rendering or data export can abort execution midway through an analysis, leaving corrupted intermediate files. Clean architecture enforces strict functional boundaries, separating pure mathematical routines from I/O and web serving.
- **Actual Implementation**: In PharmaPolySCOPE, pure mathematical logic is segregated in [`src/asd_mcda/v2/engine.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/engine.py) and [`metrics.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/metrics.py), completely isolated from file I/O or web frameworks. Web endpoints in [`backend/api/screening.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/backend/api/screening.py) call the engine via an adapter bridge ([`backend/services/engine_adapter.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/backend/services/engine_adapter.py)), ensuring mathematical routines can be executed, tested, and validated in total isolation.
- **Limitation**: Layered architecture introduces boilerplate code (DTOs, adapters, validation schemas) and requires higher initial development time compared to writing a 100-line prototype script.
- **Viva Defense Sentence**: *"A flat script is sufficient for an exploratory plot, but a doctoral thesis establishing a pre-experimental formulation ranking methodology demands an auditable architecture where mathematical transformations are completely insulated from I/O side effects."*

---

### Scenario 2: Statelessness of `VariableKEngine`
- **Direct Answer**: `VariableKEngine` is engineered with zero internal state attributes in `__init__`, ensuring that every call to `evaluate()` is an independent, pure mathematical transformation that leaves zero residual memory traces.
- **Reasoning**: If an engine stores inputs or intermediate matrices on `self` (e.g., `self.scores = scores`), concurrent or sequential requests can overwrite or leak state between runs. In Monte Carlo simulations or high-throughput batch screening, state leakage causes subsequent candidate evaluations to depend on prior candidates. Total statelessness guarantees that given identical inputs, the engine will always produce bit-for-bit identical outputs.
- **Actual Implementation**: In [`src/asd_mcda/v2/engine.py:54-56`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/engine.py#L54-L56), `VariableKEngine.__init__()` contains only `pass`. The `evaluate()` method receives all required matrices and parameters as explicit arguments and returns a completely sealed, newly allocated `VariableKDecisionSnapshot`.
- **Limitation**: Statelessness requires every caller to supply all necessary parameters (decision matrix $S$, AHP matrix $A$, variance threshold) on every call, increasing the parameter footprint of the method call.
- **Viva Defense Sentence**: *"By enforcing total statelessness in `VariableKEngine`, we mathematically eliminate cross-run memory contamination, ensuring that run $N+1$ cannot inherit hidden artifacts from run $N$."*

---

### Scenario 3: Immutability and `deep_freeze()`
- **Direct Answer**: `deep_freeze()` and `make_readonly()` prevent post-execution data mutation by recursively converting Python data structures into read-only types and toggling NumPy arrays' C-level `writeable` flag to `False`.
- **Reasoning**: Python passes objects by reference. If a caller receives an analysis result containing a NumPy array and modifies that array, or if a service layer modifies a dictionary key, the historical record of the analysis is permanently corrupted in memory. Making arrays read-only ensures that any attempted modification immediately throws an unbypassable exception.
- **Actual Implementation**: In [`src/asd_mcda/v2/models.py:22-57`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/models.py#L22-L57), `deep_freeze()` copies NumPy arrays via `np.copy()`, sets `copied_arr.flags.writeable = False`, wraps mappings in `MappingProxyType`, and converts lists to tuples. All dataclasses in `models.py` are decorated with `@dataclass(frozen=True)` and invoke `make_readonly()` in their `__post_init__` hooks.
- **Limitation**: Read-only arrays cannot be modified in-place; any necessary data manipulation requires allocating a new array, which incurs a negligible memory and CPU overhead.
- **Viva Defense Sentence**: *"We implement deep immutability at the C-extension level of NumPy so that once an analysis snapshot is sealed, it is physically impossible for downstream services to mutate its numerical contents."*

---

### Scenario 4: Prohibition of Inter-Replicate Caching in Monte Carlo Simulation
- **Direct Answer**: Inter-replicate caching of PCA eigenvectors or eigenvalues is strictly prohibited because each perturbed decision matrix possesses its own unique empirical covariance structure, dimension $K$, and metric tensor.
- **Reasoning**: In the SP-PRP-TOPSIS framework, dimension $K$ is dynamic, selected to capture $\ge 95\%$ of cumulative variance. Under Gaussian score perturbation ($\sigma_{score} = 0.05$), the eigenvalues shift. Reusing the baseline PCA projection basis across replicates would artificially freeze the coordinate system, masking boundary instability and corrupting the empirical distribution of $K$ ($P(K=k)$) and top-1 selection frequencies.
- **Actual Implementation**: Line 8 of [`src/asd_mcda/v2/uncertainty.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/uncertainty.py#L8) mandates fresh evaluation of every replicate through `VariableKEngine.evaluate()`. In lines 260–295, each perturbed replicate undergoes full standardization, spectral decomposition, stability governance checking, and metric tensor construction from scratch.
- **Limitation**: Recomputing the spectral decomposition across 10,000 Monte Carlo replicates requires substantial CPU time (~15–30 seconds for 10,000 replicates of a $5 \times 4$ matrix).
- **Viva Defense Sentence**: *"Caching the PCA basis across Monte Carlo replicates would yield false computational speed at the cost of scientific validity, artificially suppressing the very subspace variance that the uncertainty analysis is designed to quantify."*

---

### Scenario 5: Isolation of Web/API Concerns from Scientific Logic
- **Direct Answer**: Web protocols, HTTP response codes, and serialization formats are delivery mechanisms that change frequently, whereas scientific algorithms represent immutable physical laws that must remain independent of delivery infrastructure.
- **Reasoning**: Coupling mathematical functions to web frameworks (e.g., passing FastAPI `Request` objects into `VariableKEngine`) makes the engine impossible to execute in headless environments (such as HPC clusters or unit test suites) and exposes the scientific core to breaking changes whenever web libraries are updated.
- **Actual Implementation**: The core engine in [`src/asd_mcda/v2/`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/) has **zero imports** from FastAPI, Starlette, or Pydantic. All translation between HTTP JSON schemas and raw mathematical arrays is handled by the adapter layer in [`backend/services/engine_adapter.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/backend/services/engine_adapter.py) and API routers in [`backend/api/`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/backend/api/).
- **Limitation**: Requires maintaining two sets of schemas: Pydantic models for API request/response validation in [`backend/models/schemas.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/backend/models/schemas.py) and frozen dataclasses for scientific snapshots in [`src/asd_mcda/v2/models.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/models.py).
- **Viva Defense Sentence**: *"Our mathematical engine has no awareness of the internet; it accepts matrices and returns snapshots, ensuring that our published scientific algorithms remain fully executable even if FastAPI or React were replaced entirely."*

---

### Scenario 6: The Four-Tier Versioning Architecture
- **Direct Answer**: The four-tier versioning architecture explicitly separates package packaging (`1.5.0`), active released computational engine (`2.0.0`, with `2.0.0-draft` as historical development metadata), mathematical methodology specification (`2.0.0-SP-PRP-TOPSIS`), and the frozen computational baseline commit (`31eee4d`).
- **Reasoning**: A single monolithic version string cannot distinguish between a minor bug fix in an export script, an update to the underlying thermodynamic criteria library, and a fundamental change in the mathematical decision methodology. Explicit multi-tier versioning ensures unambiguous traceability in scientific publications and regulatory audits.
- **Actual Implementation**: Defined across [`src/asd_mcda/__version__.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/__version__.py), [`src/asd_mcda/v2/__init__.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/__init__.py), and [`src/asd_mcda/v2/provenance.py:18-20`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/provenance.py#L18-L20). Every analysis result generated by `provenance.py` captures these constants alongside the active Git commit hash obtained via `get_repository_head_commit()`.
- **Limitation**: Developers must maintain synchronization across these version constants during release cycles.
- **Viva Defense Sentence**: *"We decouple package distribution versioning from methodology and baseline commit versioning so that an auditor can verify exactly what mathematical equations and codebase state generated a given ranking."*

---

### Scenario 7: The Adapter Pattern (`engine_adapter.py`)
- **Direct Answer**: We use the Adapter pattern in `engine_adapter.py` to decouple the web delivery layer from the scientific core, manage execution workspaces, handle multi-mode governance (Research vs Exploratory), and coordinate multi-engine execution.
- **Reasoning**: Executing a complete screening study requires coordinating multiple disparate components: loading drug profiles from JSON, querying polymers from CSV, instantiating thermodynamic models, assembling matrix $S$, invoking `VariableKEngine`, running `MonteCarloEngine` and `MorrisSensitivityEngine`, generating figures, and compiling PDF dossiers. Placing this orchestration directly inside FastAPI route handlers would bloat the API layer and prevent headless execution.
- **Actual Implementation**: In [`backend/services/engine_adapter.py:427-650`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/backend/services/engine_adapter.py#L427-L650), `run_screening()` implements the full workflow. In lines 468–481, it enforces Research Mode validation rules, prepares isolated directory structures under `data/analyses/{analysis_id}/`, orchestrates the computational engines, generates ReportLab PDF reports, and writes to SQLite history.
- **Limitation**: The adapter contains significant integration logic (~1,000 lines), requiring diligent maintenance when new output formats or models are introduced.
- **Viva Defense Sentence**: *"The adapter layer acts as the master orchestrator, bridging high-level user screening requests to low-level mathematical engines while strictly enforcing research governance rules."*

---

### Scenario 8: Defensive Cohort Standardization and Error Guardrails
- **Direct Answer**: Cohort standardization uses population standard deviation ($ddof=0$) with strict input shape validation and zero-variance guardrails to prevent silent division-by-zero errors or distortion of candidate dispersion.
- **Reasoning**: In MCDA, the candidate polymer cohort evaluated for a specific drug formulation represents the entire finite operational decision space under consideration, not an infinite random sample from an unknown population; hence $ddof=0$ is mathematically appropriate. Furthermore, if all candidates score identically on a criterion (e.g., $s_{GT} = 0$), $\sigma_j = 0$. Without an explicit guardrail, standardizing would produce `NaN` values that silently corrupt downstream matrix multiplications.
- **Actual Implementation**: In [`src/asd_mcda/v2/standardization.py:15-65`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/standardization.py#L15-L65), `standardize_cohort()` validates $n \ge 2$, computes $\sigma = \text{np.std}(scores, axis=0, ddof=0)$, and immediately raises [`ZeroVarianceStandardizationError`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/exceptions.py#L19-L22) if any $\sigma_j \le 0$.
- **Limitation**: Requires candidate cohorts to have non-identical performance on all four criteria; a degenerate screening pool where all polymers have identical properties cannot be evaluated.
- **Viva Defense Sentence**: *"We use population standardization with $ddof=0$ because our candidate cohort constitutes the entire operational decision domain, and we guard against zero-variance criteria at the software boundary to prevent silent NaN propagation."*

---

### Scenario 9: Frozen Dataclasses and `object.__setattr__`
- **Direct Answer**: Frozen dataclasses enforce compile-time and runtime field immutability, while custom `__post_init__` hooks using `object.__setattr__` allow type coercion and defensive copying before the instance is permanently locked.
- **Reasoning**: In Python, standard `@dataclass(frozen=True)` forbids attribute assignment inside `__init__`. However, we must ensure that input arguments (such as mutable lists or raw NumPy arrays) are defensively copied and made read-only before the object is returned to the caller. Calling `object.__setattr__(self, key, value)` inside `__post_init__` bypasses the freeze mechanism during instantiation, allowing the object to seal its own internal state.
- **Actual Implementation**: Across [`src/asd_mcda/v2/models.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/models.py), every model—such as [`StandardizationResult`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/models.py#L99-L115) and [`VariableKDecisionSnapshot`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/models.py#L198-L227)—uses this pattern:
  ```python
  @dataclass(frozen=True)
  class StandardizationResult:
      cohort_mean: np.ndarray
      cohort_std: np.ndarray
      ...
      def __post_init__(self):
          object.__setattr__(self, "cohort_mean", make_readonly(self.cohort_mean))
          object.__setattr__(self, "cohort_std", make_readonly(self.cohort_std))
  ```
- **Limitation**: Using `object.__setattr__` is a specialized Python metaprogramming idiom that requires clear documentation to prevent junior developers from misusing it to bypass immutability later.
- **Viva Defense Sentence**: *"We use frozen dataclasses with defensive `__post_init__` copying to construct immutable scientific contracts, guaranteeing that snapshots retain zero references to caller-owned mutable buffers."*

---

### Scenario 10: Prevention of Silent Numerical Drift
- **Direct Answer**: The architecture prevents silent numerical drift through deterministic tie-breaking, eigenvector sign canonicalization, strict floating-point tolerances, and SHA-256 manifest fingerprinting.
- **Reasoning**: Numerical software running across different operating systems (Windows, Linux, macOS) or different BLAS/LAPACK linear algebra backends can produce subtle differences in floating-point rounding and eigenvector orientation. Without explicit architectural controls, these numerical variances can cause different candidate rankings for identical input data.
- **Actual Implementation**:
  1. [`canonicalize_eigenvector_sign()`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/pca.py#L14-L50) forces deterministic spatial orientation of PCA eigenvectors.
  2. AHP reciprocity is verified against an explicit tolerance of $10^{-12}$ ([`src/asd_mcda/v2/ahp.py:33`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/ahp.py#L33)).
  3. Closeness coefficient ranking implements deterministic tie-breaking by polymer ID ([`src/asd_mcda/v2/metrics.py:180-220`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/metrics.py#L180-L220)).
  4. Provenance tracking in [`src/asd_mcda/v2/provenance.py:120-170`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/provenance.py#L120-L170) computes a canonical SHA-256 analysis fingerprint (`compute_analysis_fingerprint()`) using sanitized JSON serialization.
- **Limitation**: Does not eliminate IEEE 754 hardware-level floating-point rounding discrepancies at the 16th decimal place, but prevents those discrepancies from flipping candidate ranks or coordinate axes.
- **Viva Defense Sentence**: *"We do not naively assume floating-point perfection; our architecture actively enforces numerical determinism through eigenvector canonicalization, strict tolerances, and cryptographic fingerprinting."*

---

## 8. Board Explanations & Quick-Reference Cards

### 1-Minute Elevator Defense
> *"PharmaPolySCOPE is engineered under a Clean Architecture paradigm that strictly separates physical chemistry models, core decision mathematics, and web delivery services. The mathematical core, `VariableKEngine`, is completely stateless, taking matrices and returning deeply frozen, immutable analysis snapshots. Numerical determinism is enforced through eigenvector sign canonicalization and strict governance gates. Web concerns like HTTP, JSON, and session management are isolated in an adapter layer, ensuring that our mathematical models are 100% reproducible, auditable, and platform-independent."*

### 5-Minute Technical Defense
> *"In wet-lab formulation science, sterile technique prevents sample contamination. In computational formulation, architectural separation prevents state contamination. PharmaPolySCOPE is organized into four distinct rings. At the center is `src/asd_mcda/v2/`, the Variable-K computational engine. It implements SP-PRP-TOPSIS, a 9-step pipeline that standardizes criteria with $ddof=0$, decorrelates them via ordinary correlation PCA, enforces boundary eigengap stability ($\delta_K \ge 0.10$), projects physical AHP weights ($CR < 0.08$) into a positive-definite metric tensor $M_K = V_K^T W V_K$, and audits truncation discrepancy.*
> 
> *The engine has zero internal state across calls. Every output is wrapped in `deep_freeze()`, making all NumPy arrays read-only at the C level to prevent memory mutation. In Monte Carlo uncertainty propagation, inter-replicate caching is strictly prohibited: all 10,000 replicates undergo independent spectral decomposition and dimension selection.*
> 
> *The outer rings decouple domain physics (`src/asd_mcda/compatibility/`), web serving (`backend/`), and presentation (`frontend/`). An adapter service, `engine_adapter.py`, acts as the bridge pattern, enforcing our Research Mode governance gate—where only experimentally validated compound profiles can generate authoritative pre-experimental rankings. Traceability is cemented by our four-tier versioning architecture, linking every result to the package version 1.5.0, engine version 2.0.0, methodology 2.0.0-SP-PRP-TOPSIS, and scientific baseline commit 31eee4d."*

### Chalkboard Sketch Template
```
+-----------------------------------------------------------------------------+
|                          CHALKBOARD ARCHITECTURE SKETCH                     |
|                                                                             |
|  [ User Input / GUI ] (React 18 + TS)                                       |
|            |                                                                |
|            v  POST /api/screening/run (JSON)                                |
|  [ FastAPI Router ] (backend/api/screening.py)                              |
|            |                                                                |
|            v  ScreeningRequest                                              |
|  [ Engine Adapter ] (backend/services/engine_adapter.py)                     |
|            |                                                                |
|     +------+------+                                                         |
|     |             |                                                         |
|     v             v                                                         |
|  [ Physical ]   [ VariableKEngine ] (src/asd_mcda/v2/engine.py)             |
|  [ Models   ]         |                                                     |
|  (HSP, FH, GT)        | 1. standardize_cohort (ddof=0)                      |
|     |                 | 2. decompose_spectral (PCA, >=95%)                  |
|     v                 | 3. evaluate_subspace_stability (delta_K >= 0.10)   |
|   Matrix S            | 4. solve_ahp_preference (CR < 0.08)                 |
|   (n x 4)             | 5. construct_metric_tensor (M_K = V_K^T W V_K)      |
|     |                 | 6. compute_distances_and_closeness (C_L)            |
|     +---------------->| 7. audit_truncation_discrepancy (Delta D^2)         |
|                       | 8. deep_freeze (flags.writeable = False)            |
|                       v                                                     |
|             [ VariableKDecisionSnapshot ]                                   |
|                       |                                                     |
|            +----------+----------+                                          |
|            v                     v                                          |
|     [ PDF Dossier ]      [ JSON Response ]                                  |
|     (ReportLab)          (to Frontend)                                      |
+-----------------------------------------------------------------------------+
```

---

## 9. Epistemic Guardrails & Forbidden Claims

When defending software architecture in a doctoral viva, candidates frequently undermine their credibility by making exaggerated, non-rigorous claims. The following rules are strictly enforced:

| Forbidden Claim / Phrasing | Why It Is Epistemically Invalid | Acceptable Scientific Phrasing |
|:---|:---|:---|
| *"The software proves the polymer is stable."* | Software models cannot prove physical stability; they only compute mathematical compatibility metrics based on model equations. | *"The computational screening identifies the candidate with the highest topological closeness under declared thermodynamic models."* |
| *"Our architecture eliminates all floating-point drift."* | Impossible on IEEE 754 standard hardware; finite precision arithmetic always produces rounding at $10^{-16}$. | *"The architecture enforces numerical determinism through eigenvector sign canonicalization and deterministic tie-breaking."* |
| *"The data snapshot captures all empirical physical behavior."* | "Realistic" is a qualitative value judgment. The models are simplified abstractions of complex polymer physics. | *"The snapshot accurately reflects the thermodynamic equations parameterized by the validated input profiles."* |
| *"The metric tensor creates a curved non-Euclidean manifold."* | Our subspace is a flat Euclidean subspace with an anisotropic quadratic-form metric tensor, not a curved non-Euclidean differential space. | *"The subspace metric tensor $M_K = V_K^T W V_K$ defines an anisotropic positive-definite quadratic distance metric."* |
| *"AHP reciprocity is analytically verified to zero."* | In finite-precision floating point, $a_{ji} \times a_{ij}$ rarely equals exactly 1.0; it equals $1.0 \pm \epsilon$. | *"AHP reciprocity is verified within an explicit finite-precision tolerance of $|a_{ji} a_{ij} - 1| < 10^{-12}$."* |
| *"The Monte Carlo analysis proves the ranking resolution."* | The Monte Carlo standard error ($SE_{max} \approx 0.54$ percentage points) measures sampling precision, not ranking truth. | *"The Monte Carlo simulation provides an empirical selection frequency quantifying model sensitivity to input perturbations."* |

---

## 10. Cross-References to Other Modules

- **Module 02 (Chemical Informatics)**: Details RDKit parsing, SMILES canonicalization, and the molecular descriptor calculation pipeline invoked by [`chemistry.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/chemistry.py).
- **Module 03 (Compatibility Criteria)**: Details the physical and thermodynamic derivations of $s_{HSP}$, $s_{\chi}$, $s_{desc}$, and $s_{GT}$ implemented in [`src/asd_mcda/compatibility/`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/compatibility/).
- **Module 04 (Mathematics)**: Details the spectral decomposition theorem, ordinary correlation PCA, and boundary eigengap governance implemented in [`pca.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/pca.py) and [`stability.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/stability.py).
- **Module 05 (Decision Science)**: Details AHP consistency theory ($CR < 0.08$), the subspace metric tensor $M_K$, and the SP-PRP-TOPSIS distance derivations implemented in [`ahp.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/ahp.py) and [`metrics.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/metrics.py).
- **Module 06 (Uncertainty & Sensitivity)**: Details the Monte Carlo propagation engine ($N=10,000$) and Morris elementary effects screening ($r=10, p=4, \Delta=2/3$) implemented in [`uncertainty.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/uncertainty.py) and [`sensitivity.py`](file:///C:/Users/Admin/.gemini/antigravity/scratch/asd_framework/src/asd_mcda/v2/sensitivity.py).
- **Module 07 Document 02 (Project Structure & Module Map)**: Provides the file-by-file forensic map, interface contracts, input/output shapes, and ASCII dependency call graphs across the entire repository.
