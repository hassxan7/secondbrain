---
title: "NCC 2022 Overview for Civly"
type: concept
tags: [compliance, NCC, YAML, rule-packs, deterministic, civly-product]
created: 2026-06-14
updated: 2026-06-14
sources: 0
---

NCC 2022 (National Construction Code) is Civly's primary rule pack. The YAML rule packs in `rules/au-ncc/` implement it. This page maps the NCC structure to what Civly already calculates and what still needs to be added.

See [[Civly Architecture Reference]] for how rules map to the four implementation surfaces.

---

## How Civly Implements NCC 2022

Rules are stored as YAML files in `rules/au-ncc/`. The engine resolves a rule by `(jurisdiction, category, space_function)` — no code change needed to add a new rate or space function, just edit the YAML.

**Current rule files (from QUICKSTART.md and Architecture.md):**
- `ventilation.yaml` — outdoor air rates (L/s/person) by space function
- `parking.yaml` — car park demand ratios by use type (council-overrideable)
- `sanitary.yaml` — fixture counts by space function and occupancy
- `egress.yaml` — egress requirements (PASS / REVIEW / FAIL per storey)
- `efficiency.yaml` — yield metrics (GFA, NLA, efficiency ratio)

---

## NCC 2022 Structure — What Each Volume Covers

### Volume One (Class 2–9 buildings — the Civly target)
- **Part A — Performance Requirements** — intent and deemed-to-satisfy (DTS) pathway
- **Part B — Structure** — structural performance (references AS 1170 series); NOT what Civly calcs (defers to structural engineer)
- **Part C — Fire Resistance** — FRL requirements by construction type; type of construction lookup by Class + height
- **Part D — Access and Egress** — travel distances, stairwell widths, number of exits; **Civly calcs egress.py**
- **Part E — Services and Equipment** — HVAC, hydraulics, fire services; **Civly calcs ventilation.py, sanitary.py**
- **Part F — Health and Amenity** — natural light, ventilation (natural), acoustic, room sizes; **partially in Civly**
- **Part G — Ancillary Provisions** — loading zones, bicycle storage, waste
- **Part H — Special Use Buildings** — aged care, hospitals etc.; not Civly v1
- **Part J — Energy Efficiency** — HVAC energy, building fabric U-values; **NOT yet in Civly**
- **Section D (new in NCC 2022) — Livable Housing** — accessible design requirements for Class 2

### Volume Two (Class 1 and Class 10 — houses)
Not currently a Civly target. Could be added as a separate rule pack later.

---

## Key Rates Claude Must Know (NCC 2022 / AS 1668.2)

### Ventilation (AS 1668.2-2012, the NCC 2022 reference standard)
These are the values that should be in `rules/au-ncc/ventilation.yaml`:

| Space Function | Rate | Standard |
|---|---|---|
| Office, open plan | 10 L/s/person | AS 1668.2 |
| Office, cellular | 10 L/s/person | AS 1668.2 |
| Conference / meeting | 12.5 L/s/person | AS 1668.2 |
| Retail | 8 L/s/person | AS 1668.2 |
| Corridor | 5 L/s/person (or 0.5 ACH min) | AS 1668.2 |
| Car park | 7.5 ACH minimum | AS 1668.2 |
| Kitchen (commercial) | 50 L/s/m² | AS 1668.2 |
| Residential apartment | 0.5 ACH (NCC Part F4.5) | NCC 2022 |
| Bathroom / WC | 25 L/s exhaust per fixture | AS 1668.2 |

**Occupancy density (persons/m²) — for occupancy calc:**
| Use | Persons/m² |
|---|---|
| Office open plan | 1/10 m² |
| Office, cellular | 1/12 m² |
| Conference | 1/2 m² |
| Retail | 1/3 m² |
| Residential (Class 2 SOU) | 1 person/bedroom (NCC assumption) |

### Parking (NCC + council instruments — council overrides in Civly)
Parking is NOT in NCC (it's in council LEPs/DCPs), but Civly provides defaults:
- Class 2 residential: 1 space/SOU + 1 visitor/5 SOUs (typical mid-rise Sydney)
- Class 5 office: 1/50 m² NLA (typical Sydney CBD DCP)
- Class 6 retail: 1/30 m² GFA (typical)
- Bicycle: NCC Part D4 (2024) now mandates bicycle spaces and end-of-trip facilities

### Sanitary Fixtures (NCC Part F3, AS 1428.1)
| Occupancy | WC (M) | WC (F) | Basin | Note |
|---|---|---|---|---|
| Office up to 25 persons | 1 | 1 | 1 each | NCC Table F3D1 |
| Office 26–50 persons | 2 | 2 | 2 each | NCC Table F3D1 |
| Add 1 WC per additional 30M / 20F above 50 | — | — | — | NCC Table F3D1 |
| Accessible WC: 1 required if >5 occupants | — | — | — | NCC Part D3 |

### Egress (NCC Part D2)
- Travel distance to exit: 20m without sprinklers, 40m with sprinklers
- Min exit width: 1000mm
- Two exits required when floor occupancy >50 or floor area >1000m² (Class 5)
- Class 2 residential: one exit per floor up to 3 storeys; two exits above

---

## YAML Rule Pack Format (Current Pattern)

Based on the architecture description, rule YAML files likely follow a pattern like:

```yaml
# rules/au-ncc/ventilation.yaml
jurisdiction: au-ncc
category: ventilation
version: NCC2022
rules:
  - space_function: office_open
    outdoor_air_rate: 10          # L/s/person
    occupancy_density: 0.1        # persons/m²
    source: "AS 1668.2-2012 Table 4.2"
  - space_function: residential_apartment
    air_change_rate: 0.5          # ACH minimum
    source: "NCC 2022 Part F4.5"
```

The `source` field is what appears in the report as a citation — every number is traceable. This is the "D6: LLM strictly at edges" principle applied to rules: the LLM never generates the number, it reads it from YAML.

---

## What Civly Does NOT Yet Calculate (NCC 2022 Gaps)

- **Part J Energy Efficiency** — HVAC CoP, building fabric U-values, SHGC for glazing; requires NatHERS or JV3 pathway — significant to add
- **Part C Fire Resistance** — construction type by Class + height → FRL table; would require `fire.yaml` + `fire_resistance.py`
- **Part D Accessible Design** — NCC 2022 added Livable Housing Design requirements for Class 2 (wheelchair access provisions)
- **Bicycle facilities** — NCC 2024 Part D4 bicycle end-of-trip; `bicycle.yaml` would be a quick add
- **NatHERS / BASIX** — energy rating scheme (NSW BASIX is a State-level tool layered on top of NCC Part J)

---

## Resources for Expanding Rule Packs

- **ABCB NCC 2022 XML** — Australian Building Codes Board published NCC 2022 as machine-readable XML (CC BY 4.0); this is the authoritative source for every value in the rule packs
- **CODE-ACCORD on HuggingFace** — compliance NLP base model; could help parse new jurisdiction codes
- **AS 1668.2-2012** — the AS standard for mechanical ventilation of buildings (NCC references this for all ventilation calcs)
- **Leo Chan (HK GTM)** — structural engineer with compliance business; key contact for HK CoP rule pack expansion

---

## Related Pages

- [[Civly Architecture Reference]] — four implementation surfaces; relevance heuristic
- [[Structural Engineering Overview for Civly]] — structural calcs that intersect NCC Part B/D
- [[NCC 2022 Ventilation Rates]] (to be created) — detailed AS 1668.2 rate tables for all space functions
