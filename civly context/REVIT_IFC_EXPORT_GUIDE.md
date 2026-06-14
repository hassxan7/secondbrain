# Revit → IFC export settings for Civly (one page)

Bad export settings are the #1 cause of "Civly found no spaces". Two checkboxes
fix almost everything.

## The two settings that matter

Revit: **File → Export → IFC → Modify Setup…**

1. **Export rooms as spaces.** Tab *Additional Content* → tick
   **"Export rooms in 3D views"** (and export from a 3D view), or in newer
   Revit versions ensure room/space export is enabled. Without this your IFC
   contains **zero IfcSpace entities** and Civly cannot compute ventilation,
   occupancy, parking demand, or egress.
2. **Export base quantities.** Tab *Property Sets* → tick
   **"Export base quantities"**. This writes areas/volumes (Qto sets) so Civly
   uses your authored numbers instead of recomputing everything from geometry.

## Recommended setup

| Setting | Value |
|---|---|
| IFC version | **IFC4 Reference View** (or IFC 2x3 Coordination View 2.0) |
| Export rooms in 3D views / spaces | **ON** |
| Export base quantities | **ON** |
| Export Revit property sets | ON (helps name/function matching) |
| Phase | The phase your rooms live in |
| Rooms placed + bounded | Check unplaced/unbounded rooms in Revit first |

## Quick self-check before sending to Civly

- Every level you care about has **Rooms** placed in Revit.
- Room names are meaningful ("Office", "Meeting", "Kontor", "Vergaderruimte" —
  Civly auto-maps en/nl/sv/de names).
- After upload, Civly's **Model diagnostics** banner is empty, and the spaces
  table shows your room names with areas.

If Civly still reports problems, the diagnostics banner will say exactly what's
missing — send us that message plus a throwaway export and we'll tune ingestion
to your firm's settings.
