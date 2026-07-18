        > [!tip] Civly Relevance — **LOW**
        > The document focuses on Revit MEP plumbing tutorials, which is outside Civly's scope (Civly does not develop Revit plugins). While MEP is a priority discipline for Civly, the content does not address Tapir MCP calls, IFC standards, NCC compliance rules, or BIM automation workflows relevant to Civly's implementation surfaces.

        ## Notes

        ## Overview of Civly's Functionality  
- **Core Purpose**: AI-powered BIM feasibility tool for Australian architects and developers  
- **Input Requirements**: Site address, storeys, building class, GFA (Gross Floor Area)  
- **Output**: Compliant BIM model + feasibility report  
- **Three-Layer Architecture**:  
  - **Layer 1: BIM Generator**  
    - Uses **Tapir MCP** (parametric modeling) via JSON-RPC to place:  
      - Structural elements (columns, slabs)  
      - MEP risers (hydraulic, electrical, mechanical shafts)  
      - Core elements (egress stairs, ventilation)  
    - Integrates with **Archicad** for model generation  
  - **Layer 2: Feasibility Engine**  
    - **Python-based** with modules:  
      - `ifc_writer/` (writes IFC files)  
      - `calcs/` (egress, ventilation, sanitary, parking calculations)  
      - `rules/` (NCC compliance rules)  
    - Reads IFC files, runs NCC checks, generates **PDF feasibility report**  
  - **Layer 3: React UI**  
    - Web interface for:  
      - Input form (site address, parameters)  
      - PDF report viewer  

## Implementation Surfaces  
- **1. Tapir MCP API Integration**  
  - JSON-RPC calls to configure Archicad elements  
  - Parametric placement of structural and MEP elements  
- **2. IFC Writer Module**  
  - Located in `ifc_writer/mep.py`  
  - Writes MEP elements (pipes, ducts, electrical conduits) to IFC files  
- **3. YAML Rule Packs**  
  - Located in `rules/*.yaml`  
  - Contains NCC compliance rules:  
    - Rates (e.g., parking per dwelling)  
    - Thresholds (e.g., minimum corridor widths)  
    - Citations (NCC Volume 1 references)  
- **4. Calculation Functions**  
  - Located in `calcs/*.py`  
  - Includes:  
    - **Egress**: Stair dimensions, riser/tread calculations  
    - **Ventilation**: Fixture counts based on NCC Volume 1  
    - **Sanitary**: Fixture counts and drainage calculations  
    - **Parking**: Minimum requirements per building class  

## Current Capabilities  
- **Structural Elements**:  
  - **RC Columns**: 400×400mm on 7.2m grid  
  - **Ground Slab**: 300mm RC  
  - **Upper Slabs**: 200mm RC flat plate  
- **MEP Elements**:  
  - Hydraulic, electrical, mechanical risers in core  
  - Shaft placement for services  
- **Egress Compliance**:  
  - Stair dimensions generated via `calcs/egress.py`  
  - Meets NCC Part D (accessibility) requirements  
- **Ventilation & Sanitary**:  
  - Fixture counts derived from NCC Volume 1  
  - Includes calculations for bathroom, kitchen, and laundry fixtures  

## Out-of-Scope Features  
- **Structural Engineering**:  
  - No AS 3600 beam/column design calculations  
- **Fire Engineering**:  
  - Excludes Part C NCC compliance (fire safety)  
- **Energy Efficiency**:  
  - No Part J NCC (energy efficiency) or NatHERS integration  
- **Hydraulic Engineering**:  
  - Limited to riser placement; no detailed piping design  
- **Cost Estimating**:  
  - No cost calculations or budgeting tools  
- **Town Planning**:  
  - No DA (Development Application) lodgement support  

## Relevance Scoring for Content  
- **HIGH Relevance**:  
  - **Tapir / Archicad API**: Parametric modeling, IFC generation  
  - **NCC Volume 1**: Parts B (building), D (accessibility), E (sanitary), F (ventilation)  
  - **BIM Automation**: AI-driven parametric modeling  
  - **PropTech Accelerators**: Partnerships with AEC-focused VCs  
  - **Feasibility Analysis**: Development economics, compliance checks  
- **MEDIUM Relevance**:  
  - General AI/LLM tooling  
  - Startup fundraising strategies  
  - Construction tech trends  
- **LOW/Relevance**:  
  - Unrelated tech (e.g., gaming, IoT)  
  - Lifestyle, politics, or non-AEC topics  

## CRM Contact Tracking Schema  
- **Required Fields**:  
  - `full_name`: "First Last"  
  - `category`: One of:  
    - `architect`  
    - `developer`  
    - `engineer`  
    - `investor`  
    - `accelerator`  
    - `mentor`  
    - `other`  
  - `organisation`: Company name or `null`  
  - `relevance`: `HIGH` | `MEDIUM` | `LOW`  
  - `who`: One-line role description (e.g., "Lead architect at XYZ firm")  
  - `why`: Civly's value proposition (e.g., "Could use BIM tool for project feasibility")  
  - `details`: Location, LinkedIn, notes (e.g., "Based in Sydney, interested in pilot programs")  
  - `met`: `YYYY-MM-DD` or `null`  
  - `followup`: Specific action (e.g., "Schedule demo call")  
- **Example**:  
  ```json  
  {  
    "full_name": "Jane Smith",  
    "category": "architect",  
    "organisation": "Smith & Co Architects",  
    "relevance": "HIGH",  
    "who": "Lead architect specializing in residential projects",  
    "why": "Could use Civly for rapid BIM feasibility checks on new developments",  
    "details": "Based in Melbourne, LinkedIn: jane.smith@architects.com",  
    "met": "2023-10-05",  
    "followup": "Send case study on residential project timelines"  
  }  
  ```

