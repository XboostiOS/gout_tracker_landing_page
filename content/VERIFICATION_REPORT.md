# Learn feed — generation & verification report (v2)

Regenerated 2026-08-03. **Status: DRAFT.** Every item has `reviewed: false`. A
clinician/editor must review the copy before flipping `reviewed: true`.

- `feed-knowledge.json` — **22 items** (all `type: knowledge`, `locale: en`); **12
  carry a self-hosted PD/CC0 image**.
- `feed-news.json` — **10 items** (all `type: update`, `locale: en`, newest first);
  genuinely recent (Mar 2025 → Jun 2026); 1 carries an image.
- **13 images**, all downloaded to `docs/img/` and confirmed **public-domain or CC0
  (no attribution)**; SVG diagrams rasterized to PNG (iOS won't render SVG). The beer
  SVG failed to rasterize and was dropped (`k-alcohol` has no image).
- Schema validation: **both files pass** ajv (Draft 2020-12,
  `-c ajv-formats --strict=false`).
- Every `sourceUrl` was fetched: all return **HTTP 200 except JAMA (403 to bots — the
  page is real and opens in a browser)**.

## What changed from v1
- **Knowledge** expanded 11 → 22 (added: where-uric-acid, colchicine, febuxostat,
  purine-foods, alcohol, fructose/sugar, weight, vitamin-C/cherries, flare-course,
  tophi, pseudogout) and 12 items now have images.
- **News** rewritten from "landmark trials" into **actual recent news** — drug
  pipeline / approvals / new readouts (2025–2026). Per the updated policy, News may
  cite a reputable **company press release / registry / med-news** page
  (`evidence: news`); primary preferred, nothing fabricated.

---

## 1. Sources — News (newest first)

| id | date | evidence | source (opened, HTTP 200 unless noted) | supports summary |
|----|------|----------|----------------------------------------|------------------|
| n-eular2026-continue-ult | 2026-06-03 | rct | EMJ (EULAR 2026 coverage) | Dutch RCT: continuing ULT beat stopping (remission 79% vs 63%; fewer flares). |
| n-reduce2-pozdeutinurad | 2026-05-21 | rct | Sobi press (REDUCE 2 topline) | Phase 3, n=811: both AR882 doses hit sUA<6 far more than placebo; well tolerated. |
| n-jama-t2t-cv | 2026-01-26 | news | JAMA Internal Medicine (**403 to bots**, real) | ~109k patients: reaching sUA<6 within a year tied to lower 5-yr MACE (observational). |
| n-glp1-gout-signal | 2025-11-03 | news | Healio (ACR Convergence 2025) | GLP-1 initiators had lower 1-yr gout risk vs DPP-4; other studies disagree (mixed, observational). |
| n-dect-flare-prediction | 2025-11-01 | news | European Radiology (PubMed 41175200) | DECT+clinical model predicted frequent flares better than clinical data alone. |
| n-acr2025-firsekibart | 2025-10-25 | news | ACR press release | Phase 3 firsekibart (anti-IL-1β) for acute flares, incl. renal impairment. |
| n-crystalys-dotinurad | 2025-09-30 | news | PR Newswire (Crystalys) | $205M launch to run US/EU phase 3 of dotinurad (already approved in Japan etc.). |
| n-nasp-fda-bla | 2025-09-10 | news | Sobi press | FDA accepted BLA for NASP (uncontrolled gout); PDUFA mid-2026; from DISSOLVE I/II. |
| n-ruzinurad-ph3 | 2025-06-26 | rct | Rheumatology Republic (EULAR 2025) | Phase 3, n=773: ruzinurad beat allopurinol to target (~53% vs 35%) to wk52. |
| n-tigulixostat-halt | 2025-03-28 | news | Korea Biomedical Review | LG Chem discontinued tigulixostat (EURELIA-2 halted); China rights with partner. |

**News flags for the reviewer:**
- These are **news, i.e. preliminary by nature** (topline results, press releases,
  conference talks not yet peer-reviewed). Copy attributes them and flags uncertainty;
  confirm that framing before publishing.
- **Dropped (couldn't open the primary):** ABP-671/lingdolinurad topline (all press
  pages 403'd), a claimed SGLT2/Diabetes-Care-2026 paper, a processed-meat/UK-Biobank
  item, and several medRxiv items — omitted rather than cite unverified.
- The GLP-1 item deliberately presents the evidence as **mixed** (one study found
  lower risk, others higher).

## 2. Sources — Knowledge (new items only; the 8 ACR/EULAR-anchored items reuse
PubMed 32391934 / 27457514 verified in v1)

| id | evidence | source (HTTP 200) | supports summary |
|----|----------|-------------------|------------------|
| k-where-uric-acid | review | Frontiers in Medicine 2018 | ~2/3 of urate is endogenous from purines; gout mostly under-excretion. |
| k-colchicine | guideline | ACR 2020 (PubMed 32391934) | Colchicine for acute flares + low-dose prophylaxis at ULT start. |
| k-febuxostat-alt | rct | NEJM 2005 (PubMed 16339094) | Febuxostat (XO inhibitor) lowered urate ≥ fixed-dose allopurinol; alt option. |
| k-purine-foods / k-alcohol / k-fructose-sugar / k-weight | guideline | ACR 2020 (PubMed 32391934) | ACR 2020 conditionally recommends limiting purines, alcohol, HFCS, and weight loss. |
| k-vitamin-c-cherries | review | Arthritis Care & Research meta-analysis (PMC3169708) | Vitamin C lowers urate only ~0.35 mg/dL (too small to treat); cherry evidence limited. |
| k-flare-course / k-what-are-tophi | review | NIAMS (NIH) gout page | Flares self-limited over ~1–2 weeks; tophi = urate lumps, shrink with urate lowering. |
| k-pseudogout | review | Arthritis Foundation (CPPD) | Pseudogout is a distinct calcium-pyrophosphate crystal arthritis. |

**Knowledge flags:**
- `k-what-is-gout` still cites **NHS** (patient-ed); allowed under the "Knowledge
  basics" carve-out (`evidence: review`), but a guideline-background source is
  preferred if you want it stricter.
- Diet items are anchored to the **ACR 2020 guideline's** conditional lifestyle
  recommendations (cleaner than citing single cohort papers); the underlying
  associations also have cohort support (Lancet/BMJ/NEJM, Choi et al.).
- `k-flare-course` and `k-what-are-tophi` share the NIAMS URL (both supported by it).

## 3. Images — all KEPT are Public Domain / CC0 (no attribution), self-hosted in `docs/img/`

| file | item | licence |
|------|------|---------|
| k-allopurinol-first-line.jpg | k-allopurinol-first-line | CC0 (Wikimedia) |
| k-where-uric-acid.png | k-where-uric-acid | PD (chem diagram; SVG→PNG) |
| k-diet-role.jpg | k-diet-role | CC0 |
| k-purine-foods.jpg (salmon) | k-purine-foods | CC0 |
| k-fructose-sugar.jpg | k-fructose-sugar | CC0 (**trademark in shot** — swap for a generic soda if preferred) |
| k-weight.jpg | k-weight | PD (US Gov / NCI) |
| k-vitamin-c-cherries.jpg | k-vitamin-c-cherries | CC0 |
| k-colchicine.jpg (blister) | k-colchicine | CC0 |
| k-ckd-urate.jpg (kidney) | k-ckd-urate | PD |
| k-comorbidities.jpg (stethoscope) | k-comorbidities | CC0 |
| k-flare-course.png (foot skeleton) | k-flare-course | PD (pre-1931) |
| k-pseudogout.png (knee) | k-pseudogout | PD (US Gov; SVG→PNG) |
| n-dect-flare-prediction.jpg (foot X-ray) | n-dect-flare-prediction | CC0 |

No true PD/CC0 image exists for clinical urate crystals, tophi, real gout toe, or an
allopurinol-branded pack (all CC-BY/BY-SA) — those items are left image-less or use a
PD diagram stand-in. Add app-style art later if desired.

## Operator checklist — remaining before publish
1. [x] Schema validation — pass. 2. [x] Source URLs 200 (JAMA 403-to-bots, real).
3. [ ] Human: open each source, confirm it supports the summary (esp. the preliminary
   News items and the mixed-evidence GLP-1 item). 4. [ ] Originality pass.
5. [ ] Spot-check each image licence + that it renders in-app. 6. [ ] Clinician review.
7. [ ] Only then set `reviewed: true`.
