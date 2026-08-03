# Learn feed — generation & verification report

Generated 2026-07-31. **Status: DRAFT.** Every item has `reviewed: false`. A
clinician/editor must review the copy before flipping `reviewed: true` and
publishing.

- `feed-knowledge.json` — 11 items, all `type: knowledge`, all `locale: en`.
- `feed-news.json` — 7 items, all `type: update`, all `locale: en`, newest first.
- Schema validation: **both files pass** `ajv` against `feed.schema.json`
  (Draft 2020-12; run with `-c ajv-formats --strict=false` because the wrapper
  schemas use `$ref`+`properties` and the `uri` format needs the formats plugin —
  data is valid either way).
- Every `sourceUrl` was fetched and returns **HTTP 200** (checked 2026-07-31).
- URLs standardised on **PubMed / PMC / NHS** canonical pages (they load for
  everyone; publisher pages at bmj.com, nejm.org, wiley.com are the same papers
  but block automated fetching behind Cloudflare/paywall).

> Note on the previous draft: the old files mixed in a few Vietnamese (`vi`)
> items and pointed CARES at an `nejm.org` URL that returns 403 to bots. This
> regeneration is **all-English per the prompt** and re-points CARES to its
> PubMed page. If you want the `vi` locale items back, they can be re-added as
> translations of these verified sources.

---

## 1. Sources — one row per item

Each source below was visited by a research agent and (for the URL liveness) by a
direct HTTP check. "Supports" = the source genuinely backs the summary's claim.

### Knowledge

| id | sourceUrl (HTTP 200) | Supports the summary? |
|----|----------------------|-----------------------|
| k-what-is-gout | https://www.nhs.uk/conditions/gout/ | Yes — NHS states gout is caused by too much uric acid forming crystals around joints, sudden pain "usually your big toe." |
| k-treat-to-target | https://pubmed.ncbi.nlm.nih.gov/32391934/ | Yes — ACR 2020 strongly recommends treat-to-target ULT to serum urate <6 mg/dL, lower with tophi, maintained long-term. |
| k-allopurinol-first-line | https://pubmed.ncbi.nlm.nih.gov/32391934/ | Yes — ACR 2020 strongly recommends allopurinol as preferred first-line ULT, incl. moderate–severe CKD. |
| k-start-low-go-slow | https://pubmed.ncbi.nlm.nih.gov/32391934/ | Yes — ACR 2020 strongly recommends a low allopurinol start dose with titration (start-low-go-slow), treat-to-target dosing. |
| k-flare-prophylaxis | https://pubmed.ncbi.nlm.nih.gov/32391934/ | Yes — ACR 2020 strongly recommends anti-inflammatory flare prophylaxis when initiating ULT, ≥3–6 months. |
| k-dont-stop-during-flare | https://pubmed.ncbi.nlm.nih.gov/32391934/ | Yes — ACR 2020 directs continuing established ULT during a flare (and conditionally starting ULT during a flare). |
| k-hlab5801 | https://pubmed.ncbi.nlm.nih.gov/32391934/ | Yes — ACR 2020 conditionally recommends HLA-B*58:01 testing before allopurinol in higher-risk groups (Han Chinese/Korean/Thai descent). |
| k-adherence | https://pubmed.ncbi.nlm.nih.gov/24692321/ | Yes — De Vera 2014 systematic review: ULT adherence consistently below 0.80; adherent proportion 10–46%. |
| k-diet-role | https://pmc.ncbi.nlm.nih.gov/articles/PMC8678356/ | Yes — 2021 review: diet lowers urate only modestly (DASH ~0.22, low-purine ~1 mg/dL); ULT "remains the mainstay." |
| k-ckd-urate | https://pubmed.ncbi.nlm.nih.gov/32391934/ | Yes — ACR 2020: allopurinol usable in reduced kidney function with dose management (low start dose in CKD). |
| k-comorbidities | https://pmc.ncbi.nlm.nih.gov/articles/PMC11678569/ | Yes — 2024 narrative review: gout/hyperuricemia associated with CVD, CKD, hypertension, T2D, insulin resistance, obesity. |

### News

| id | sourceUrl (HTTP 200) | Supports the summary? |
|----|----------------------|-----------------------|
| n-mirror-methotrexate | https://pubmed.ncbi.nlm.nih.gov/36099211/ | Yes — MIRROR RCT (A&R 2023): MTX co-therapy raised month-6 pegloticase response 71.0% vs 38.5%, fewer infusion reactions. |
| n-fast-cv-safety | https://pubmed.ncbi.nlm.nih.gov/33181081/ | Yes — FAST (Lancet 2020, n=6,128): febuxostat non-inferior to allopurinol for CV endpoint (HR 0.85), no increased death risk. |
| n-acr-2020-guideline | https://pubmed.ncbi.nlm.nih.gov/32391934/ | Yes — ACR 2020 guideline: treat-to-target, allopurinol first-line, flare prophylaxis at initiation. |
| n-nurse-led-t2t | https://pubmed.ncbi.nlm.nih.gov/30343856/ | Yes — Doherty 2018 (Lancet, n=517): 95% of nurse-led group reached urate <360 µmol/L at 2 yr vs 30% usual care. |
| n-cares-cv | https://pubmed.ncbi.nlm.nih.gov/29527974/ | Yes — CARES (NEJM 2018, n=6,190 with CVD): CV endpoint non-inferior (HR 1.03) but higher all-cause (1.22) and CV mortality (1.34). |
| n-eular-2016 | https://pubmed.ncbi.nlm.nih.gov/27457514/ | Yes — EULAR 2016 update (Ann Rheum Dis 2017): treat-to-target <6 mg/dL, patient education central, prophylaxis first 6 months. |
| n-agree-colchicine | https://pubmed.ncbi.nlm.nih.gov/20131255/ | Yes — AGREE (A&R 2010): low-dose colchicine ≈ high-dose efficacy for early flare, far less GI toxicity (diarrhea 23% vs 77%). |

**Flags for the medical reviewer:**
- ACR claims for **k-dont-stop-during-flare** and **k-hlab5801** are in the full
  guideline recommendation set, not the PubMed *abstract* text — confirm against
  the full guideline (paywalled at Wiley). Both are well-established ACR 2020
  recommendations; HLA-B*58:01 testing is a *conditional* recommendation.
- **k-what-is-gout** uses NHS (a patient-education overview); `evidence` is set to
  `review` as the closest enum value — reviewer may prefer to relabel.
- No dosing/titration numbers are presented as advice; targets are tied to "the
  target your doctor sets"; no diagnosis language. Please confirm the wellness
  (non–medical-device) tone throughout.

---

## 2. Images — licence decisions

**Rule:** include an `imageUrl` only for **public-domain / CC0** images (no
attribution — the app has no attribution UI). Everything else is omitted for the
operator to add later.

### Kept (wired into the feed + downloaded)

| id | image | host | licence (verified) | file |
|----|-------|------|--------------------|------|
| k-allopurinol-first-line | Milurit 100 mg allopurinol tablets | Wikimedia Commons | **CC0 1.0** — "dedicated to the public domain… attribution not required" (re-checked on the Commons file page) | `content/img/k-allopurinol-first-line.jpg` (356 KB, 1164×2113 JPEG) → served at `https://goutly.xboostapp.io/img/k-allopurinol-first-line.jpg` |

### Additional PD/CC0 candidates found (NOT wired — available for the operator)

All verified public-domain / CC0 by reading the file page. Not attached because a
bare diagram is a weak hero image, or (kidney) the host *requests* a credit line.

| Suggested for | image | licence | direct URL |
|---------------|-------|---------|------------|
| k-what-is-gout / urate | Uric acid molecule (SVG) | PD (simple chemical structure, ineligible for copyright) | https://upload.wikimedia.org/wikipedia/commons/8/88/Uric_Acid.svg |
| urate metabolism | Uric acid synthesis diagram (SVG) | PD (simple chemical equation) | https://upload.wikimedia.org/wikipedia/commons/7/77/Synthesis_Uric_Acid.svg |
| allopurinol | Allopurinol structure (SVG) | PD (author release worldwide) | https://upload.wikimedia.org/wikipedia/commons/8/8c/Allopurinol_V.1.svg |
| k-ckd-urate | Kidney & nephron (labeled) | PD (US govt work); **NIDDK requests, does not require, a credit line** — legally fine, but omitted to keep zero strings | https://www.niddk.nih.gov/media-assets/11236/B2-Image03-Kidney+Nephron-FINAL.jpg |

### Dropped (attribution/share-alike/unclear — do NOT use as-is)

No PD/CC0 option was found for the most "clinical" images — every candidate was
CC-BY or CC-BY-SA:
- MSU crystals under polarised light — all CC-BY / CC-BY-SA → dropped.
- Podagra / big-toe clinical photos — CC-BY 3.0 DE, CC-BY 4.0 → dropped.
- Tophi photos (incl. Wellcome) — CC-BY 4.0 → dropped.
- Gout foot X-rays — CC-BY 1.0, CC-BY-SA 4.0 → dropped.
- Assorted gout diagrams — CC-BY-SA 4.0 → dropped.
- "The Gout" (Gillray, 1799) — genuinely PD, but a satirical caricature; not a fit
  for a wellness tone → not used.

**Recommendation:** for the crystal/toe/tophi/X-ray topics, either license a
CC-BY image *with* attribution (needs an attribution surface the app doesn't have
yet), or generate art in the app's own illustration style — the safest route and
fully under your control.

---

## Operator checklist — remaining steps before publish

1. [x] Validate both files against schema — **pass**.
2. [x] Confirm every `sourceUrl` returns 200 — **pass** (2026-07-31).
3. [ ] Human: open each source and confirm it supports the summary (spot the two
   ACR "full-guideline-not-abstract" flags above).
4. [ ] Human: originality pass — confirm no summary mirrors source wording.
5. [ ] Human: re-confirm the CC0 licence on the one wired image; add art for the
   image-less items if desired (see candidates above).
6. [ ] Clinician/editor: medical-copy review against the guardrails.
7. [ ] Only then set `reviewed: true` and deploy `feed-*.json` + `img/`.
