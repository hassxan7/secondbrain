---
title: "TAM SAM SOM — Global Rebuild (Sep 2026)"
type: analysis
tags: [strategy, pitch, market-sizing, tam-sam-som, pfc, deck, gtm]
created: 2026-09-11
updated: 2026-09-11
sources: 0
---

Rebuild of the TAM/SAM/SOM figures on the Business Model slide. The old set (US$40B / A$1.8B / A$6M) framed Civly as an AU+NZ company with an Australian-dollar market, and the layer labelled SAM was really a beachhead — SOM-scale, not serviceable-market-scale. This page replaces all three numbers with a global, USD, bottom-up set, and carries the image-edit prompt to patch the existing slide graphic.

## Question / Prompt
What are the defensible TAM, SAM and SOM for Civly if the company is positioned as global from day one, with no AU/NZ framing anywhere?

## Methodology

Three rules drove the rebuild:

1. **No geography in any layer.** The old SAM pinned Civly to 15,000 AU+NZ firms. Nothing in the product is Australian — [[Civly Architecture Reference]] confirms IFC in, IFC out, with jurisdiction supplied by swappable YAML rule packs (`rules/ncc_2022.yaml` is one pack among many, not the product). Geography is a rule-pack parameter, not a market boundary.
2. **Every layer is a strict subset of the one above it**, and each carries its own visible arithmetic.
3. **TAM is stated as the labour value pool being displaced; SAM and SOM are stated as revenue at Civly's price.** Mixing the two is the single most common way a market-sizing slide gets caught. See the coherence note below.

## Findings — the three numbers

### TAM — US$60B/yr · global AEC drafting and BIM modelling labour

Two independent methods converge:

| Method | Math | Result |
|---|---|---|
| Bottom-up headcount | ~2,000,000 CAD/BIM drafters and BIM technicians worldwide × ~US$30k blended fully-loaded annual cost | **US$60B** |
| Top-down cross-check | US: 180,200 drafters (BLS, May 2025) × ~US$90k fully loaded ≈ US$16B. US ≈ 25% of the US$1.59T global architecture/engineering consulting market → US$16B ÷ 0.25 | **US$64B** |

The US$30k global blend is deliberate: the drafting workforce is weighted heavily toward India, the Philippines, China, Eastern Europe and Latin America, where a drafter costs a fraction of a Sydney or London one. Blending at a Western salary would have inflated TAM past US$150B and made it indefensible.

Public alternatives were rejected as the headline: the **drafting services market (US$6.2B, 2026)** counts only *outsourced* drafting bought as a service, which is a small slice of the labour actually performed, and the **BIM software market (US$5.8B, 2025)** measures incumbent tool licences, which is what Civly displaces adjacent to, not what it replaces.

### SAM — US$9B/yr · ~600,000 MEP + structural drafting seats worldwide

Narrowed from TAM on three axes that match what the product actually does:

- **Discipline:** MEP and structural only. Civil/infrastructure drafting, product and fabrication drafting are out.
- **Phase:** design-phase drafting, LOD 0 → ~250. Shop drawings and LOD 350+ fabrication detailing are out ([[BIM Drafting vs Coordination]]).
- **Workflow:** firms that already run a model-based (IFC-capable) process. Firms still drafting in 2D CAD with no BIM deliverable cannot consume Civly's output.

That leaves roughly **600,000 addressable seats**, concentrated in BIM-mandated and high-cost design markets — UK, EU, Nordics, North America, the Gulf, Singapore, Hong Kong, Japan, Korea, ANZ — plus the offshore delivery centres producing for them.

At Civly's price of **US$1,300/seat/month ≈ US$15,600/seat/year**:

> 600,000 seats × US$15,600 ≈ **US$9.4B → state as US$9B**

### SOM — US$20M ARR by 2030 · ~250 firms

- Contract value: 5-seat minimum × US$15,600 = **~US$78k per firm per year**.
- 250 firms × US$78k ≈ **US$19.5M → state as US$20M ARR**.
- That is **0.2% of SAM** — small enough to be credible, large enough to be worth funding.

Ramp, consistent with the Timeline slide in [[PFC Pitch — Deck, Scripts & Prompts]]:

| Year | Paying firms | ARR |
|---|---|---|
| 2027 | 10 | ~US$0.8M |
| 2028 | 40 | ~US$3.1M |
| 2029 | 120 | ~US$9.4M |
| 2030 | 250 | ~US$19.5M |

## The coherence note (read before pitching this)

One Civly seat is sold at roughly a quarter of what a drafter costs in a high-cost market. So capturing the entire serviceable market yields far less revenue than the labour it removes — and that gap is the reason customers buy, not a flaw in the numbers:

- 600,000 SAM seats at a ~US$55k loaded cost in those markets ≈ **US$33B of annual labour**.
- Civly's price across the same seats ≈ **US$9B of annual software revenue**.
- Ratio ≈ **28%** — which is exactly the "a drafter's output at about a quarter of the cost" claim, arriving at the same answer from the market side.

Say it in this order and it holds: TAM is the labour being displaced, SAM is what that becomes as revenue at Civly's price, SOM is the slice winnable by 2030.

## Knock-on changes required elsewhere in the deck

- **Price in USD.** A$1,999/seat/mo must become **US$1,300/seat/mo (~US$78k per firm per year)** everywhere it appears. An AUD price on a global slide reintroduces the exact signal this rebuild removes.
- **The "$10k MRR" milestone** reconciles as roughly the first firm onto full price, not ten firms. The existing coherence warning in [[PFC Pitch — Deck, Scripts & Prompts]] still applies and is now sharper, since ACV is stated in USD.
- **Business Model script** needs its closing lines replaced. New version: *"Drafting labour is a sixty-billion-dollar market globally. The MEP and structural slice we serve is six hundred thousand seats, nine billion dollars at our price. Two hundred and fifty firms makes us twenty million a year by 2030 — two tenths of one percent of it."*
- **Anywhere the deck says Australia, NCC or AU+NZ as a market** should say "starting where BIM is mandated" instead. NCC 2022 stays as a shipped rule pack and a credibility proof, not as a market boundary.

## Image-edit prompt (Gemini / Nano Banana Pro)

Attach the existing TAM/SAM/SOM skyline graphic, then paste the prompt below verbatim. It is written as a surgical text swap so nothing else in the image moves.

```
Edit the attached image. This is a TEXT-ONLY edit. Change nothing except the words inside the three cream rounded label pills.

Preserve exactly, pixel for pixel:
- The photorealistic night skyline and the illuminated tower, including the vertical split between the cool blue-lit left side and the warm dark right side
- The position, size, corner radius, cream/off-white fill colour and drop shadow of all three rounded label pills
- The three thin orange arrows, their length, angle and the exact points on the tower they touch
- The typeface, weight hierarchy (bold first line, regular second line), black text colour, font size, line spacing and left alignment inside every pill
- The image aspect ratio, crop and resolution

Replace the text as follows, keeping each pill's two-line structure with the first line bold and the second line regular:

TOP PILL (arrow to the spire)
  Line 1 (bold): TAM · US$60B
  Line 2 (regular): global AEC drafting labour

MIDDLE PILL (arrow to mid-tower)
  Line 1 (bold): SAM · US$9B ·
  Line 2 (regular): 600,000 seats worldwide

BOTTOM PILL (arrow to the tower base)
  Line 1 (bold): SOM · US$20M ARR
  Line 2 (regular): by 2030 · 250 firms

Rules:
- Use the interpunct character · exactly as shown, with a space either side, matching the original separators.
- Keep every pill the same width as it is now. If a new line is slightly longer than the old one, reduce the tracking a fraction rather than widening the pill, growing the image, or wrapping to a third line.
- Do not translate, abbreviate, reword, reformat or "correct" any of the text. Reproduce the strings above character for character, including the dollar signs, commas and capitalisation.
- Do not add, remove or move any pill, arrow, logo, caption or watermark.
- Do not restyle, relight, recolour, sharpen, denoise or regenerate the photograph.
- Output at the same dimensions and aspect ratio as the input.
```

## Limitations
- The ~2,000,000 global drafter headcount is an estimate. Only the US leg (180,200 drafters, BLS May 2025) is a hard published figure; the rest is extrapolated from the US share of the US$1.59T global architecture/engineering consulting market and cross-checked against it. Both methods land within 7% of each other, which is the strongest support available without a commissioned study.
- The ~600,000 addressable-seat figure is the softest number in the set. It rests on a judgement that MEP and structural design-phase drafting in BIM-capable markets is roughly 30% of the global drafting pool. If a judge or investor pushes hard on any single figure, it will be this one — lead the defence with the discipline/phase/workflow filters rather than the number.
- No primary source separates *design-phase* drafting hours from *fabrication-phase* detailing hours at a global level. The split used here comes from the firm-level structure described in [[Civly Direction — Drafting-First Pivot (Jun 2026)]] (3–4 drafters per firm, 1 coordinator), not from published data.
- Figures are September 2026. The architecture/engineering consulting base grows ~4.5% annually, so refresh before any raise after mid-2027.

## Related pages
[[PFC Pitch — Deck, Scripts & Prompts]] · [[Pitch Copy Library]] · [[Civly Direction — Drafting-First Pivot (Jun 2026)]] · [[Civly Architecture Reference]] · [[BIM Drafting vs Coordination]] · [[Drafting vs Coordination Strategy Shift]]
