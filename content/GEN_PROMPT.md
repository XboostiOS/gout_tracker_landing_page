# Generating the Learn feed with AI

Draft `feed-knowledge.json` and `feed-news.json` with an LLM that can browse the
web, then **validate + human-review** before publishing. Output is a **draft**;
`reviewed` stays `false` until a person checks the medical copy and every source.

**Layout (fixed):** GitHub Pages serves `main` branch, path `/docs`. So the public
site root == `docs/`. Everything outside `docs/` (this prompt, the schemas, the
report) is in git but never served.
- Published feeds live in `docs/content/` → served at `https://goutly.xboostapp.io/content/feed-knowledge.json` and `/content/feed-news.json` (the app fetches these `/content/…` URLs).
- Published images live in `docs/content/img/<item-id>.<ext>` → served at `https://goutly.xboostapp.io/content/img/<item-id>.<ext>`.
- So `imageUrl` is always `https://goutly.xboostapp.io/content/img/<item-id>.<ext>` (self-hosted, never a third-party hotlink).
- Schemas + this prompt live in the **repo-root** `content/` (internal, not served) — distinct from the served `docs/content/`.

**Two content types, two trust profiles:**
- **Knowledge** = evergreen foundation, written once, rarely changes. Anchor to
  **guidelines**.
- **News** = dated updates, must stay fresh. Anchor to the **primary paper /
  guideline / trial registry** — specialty med-news is for *discovery only*.

---

## Source whitelist & evidence tiering (HARD)

Trust is ranked, and the rank maps **directly** onto the schema's `evidence` field:
`guideline` > `rct` / `review` > `news`. Every item MUST carry a working `sourceUrl`.
For **Knowledge** it MUST be a primary Tier-1/2 source. For **News** the rules relax
(see the News carve-out below) — News is dated, often preliminary, and its source may
be a press release, registry, or reputable med-news page.

| Tier | `evidence` | Whitelisted sources | Role |
|------|-----------|---------------------|------|
| **1 — Specialty guidelines** | `guideline` | **ACR** (rheumatology.org, 2020 treat-to-target — still current), **EULAR** (eular.org, management 2016 + diagnosis 2020), **NICE** UK (2022) + **BSR** (2017), **APLAR** (2021) | Foundation of the Knowledge feed. Write once. **APLAR + EULAR matter for the Asian/EU locales.** |
| **2 — Peer-reviewed journals** | `rct` or `review` | **Annals of the Rheumatic Diseases (ARD)**, **Arthritis & Rheumatology**, **Arthritis Care & Research**, **Rheumatology (Oxford)**, **The Lancet**, **NEJM**, **Journal of Rheumatology** | Where real papers appear. The **ideal `sourceUrl`** for News. |
| **3 — Primary "news" objects** | `news` | **ACR Convergence** (Nov) & **EULAR Congress** (June) conference abstracts; **ClinicalTrials.gov** records; **company press releases** (e.g. Sobi, PR Newswire); **regulatory** notices (FDA/EMA) | Earliest phase-3 data, approvals, trial-status/business news. Cite the abstract/registry/press page itself. |
| **Specialty med-news** | `news` (News only) | **Rheumatology Advisor**, **Healio Rheumatology**, **MedPage Today**, **BioPharma Dive**, congress-coverage outlets | Best for *discovery*. For **News** items, if no primary exists, one of these MAY be the `sourceUrl` (`evidence: news`). For **Knowledge**, never — trace to a Tier-1/2 primary. |
| **Tone reference only — NOT a source** | — | **Gout Education Society**, **Arthritis Foundation**, **CreakyJoints** | Read to calibrate plain-language voice. Never a `sourceUrl`. |

**Carve-out (Knowledge basics):** for an evergreen *basic* with no guideline/journal
statement (e.g. "what is gout"), a major medical-reference org (**Mayo Clinic, NHS,
CDC, MedlinePlus, NIAMS**) may serve as the source with `evidence: "review"` — but a
guideline's background section is preferred.

**Carve-out (News):** News = genuinely recent, dated items (new trial readouts,
approvals, pipeline/company developments — including things that are still uncertain
or may not pan out). Find leads by searching "gout news / gout update" + specialty
med-news, then **prefer** a primary source (journal, ClinicalTrials.gov, company
press, regulator); a reputable med-news page is an acceptable `sourceUrl` when that is
all that exists. Still: real, working URL you actually opened; **nothing fabricated**;
frame preliminary findings neutrally and attributed ("a company reported…", "in a
trial presented at…"). `evidence: news` for most; `rct` only for an actual trial with
results.

**Banned outright:** supplement sites, "home remedy / X foods to avoid" listicles,
personal blogs, SEO content farms, anything selling a product.

Focus topics: lowering serum urate to target, urate-lowering therapy (ULT),
adherence, early-treatment flares, drug safety, new ULT mechanisms, diet/lifestyle
support.

---

## The prompt (paste to a browsing-capable model)

> **Role.** You are a medical content editor for **Goutly**, a gout self-management
> iOS app positioned as **wellness, not a medical device**. You research reputable
> sources, write **original** plain-language summaries, and link back to the real
> source. You never copy or closely paraphrase source text.
>
> **Task.** Produce two JSON documents for the app's Learn tab, valid against the
> field spec below:
> - `feed-knowledge.json` — evergreen education, every item `type: "knowledge"`.
> - `feed-news.json` — recent updates, newest first, every item `type: "update"`.
>
> **Allowed sources.** Use the **Source whitelist & evidence tiering** table above.
> Set `evidence` to match the tier of the primary source you actually cite:
> guideline → `guideline`; journal RCT/review → `rct`/`review`; conference abstract
> or ClinicalTrials.gov → `news`. **Med-news (Rheumatology Advisor, Healio,
> MedPage, BioPharma Dive) and patient-ed/advocacy pages are for discovery/tone
> only — never put them in `sourceUrl`.** Find the *real* primary article and use
> its canonical URL (prefer PubMed/PMC/DOI — they resolve for everyone).
>
> **Hard rules (strict — a violation means drop the item, never fabricate):**
> 1. **Real, primary sources only.** Every item MUST have a working `sourceUrl` you
>    actually visited that genuinely supports the summary, pointing to the primary
>    guideline / paper / trial registry (not a med-news retelling). Do **not** invent
>    URLs, DOIs, titles, dates, or findings. If you cannot verify a real primary
>    source, omit the item.
> 2. **Original wording.** Write summaries in your own words. **No verbatim copying and
>    no close paraphrase** that mirrors the source's sentence structure. Do not
>    reproduce figures, tables, or long quotes.
> 3. **No medical advice.** No dosing or titration numbers presented as advice; no
>    diagnosis; no "normal/abnormal" judgements. You may state what a guideline or
>    study reports, attributed to the source; when mentioning a target, tie it to
>    "the target your doctor sets", never a personal instruction.
> 4. **Copy shape.** `summary` = 2–4 neutral sentences. `whyItMatters` = exactly one
>    declarative sentence, no imperative ("you should…").
> 5. **Fixed fields.** `id` kebab-case with prefix `k-` (knowledge) / `n-` (news),
>    stable and unique. Write each item in **English first** (`locale: "en"`), then
>    localize (rule 9). `reviewed: false` on every item (never set true). `tags`: 2–5
>    lowercase words. Fill `category` and `readMinutes`. `type` matches the file.
> 6. **Sections (knowledge only, optional).** 3–5 short sections; `icon` is an SF
>    Symbol name (`target`, `drop.fill`, `calendar`,
>    `gauge.with.dots.needle.bottom.50percent`, `checkmark.seal.fill`, `heart.fill`,
>    `fork.knife`, `pills.fill`).
> 7. **Images — check the licence and decide.** For each item, look for a relevant
>    image and **determine its licence from an authoritative signal** (e.g. a
>    Wikimedia Commons / Openverse licence box, an explicit public-domain or CC0
>    statement on the page, a government public-domain source like CDC PHIL / NIH, or
>    a stock site's free licence). The app has **no attribution UI**, so:
>    - **Include** it only if the image is **public domain or CC0** — freely reusable,
>      redistributable, and **requires no attribution**. Then set `imageUrl` to
>      `https://goutly.xboostapp.io/content/img/<id>.<ext>` and self-host it (never hotlink).
>    - **Omit `imageUrl`** for anything else: copyrighted / all-rights-reserved,
>      licences that require attribution (CC-BY, CC-BY-SA), non-commercial or
>      no-derivatives licences, or **any image whose licence you cannot clearly
>      confirm**. Do not guess. (The user will add art for these later.)
>    - Prefer openly-licensed repositories (Wikimedia Commons, Openverse, CDC PHIL,
>      NIH, NCI) over news/journal article photos, which are almost always
>      copyrighted.
> 8. **Schema-clean.** Emit only the fields in the spec — **no extra keys** inside the
>    JSON (strict validation rejects unknown fields).
> 9. **Localize into all four locales (do this as part of generation, not later).**
>    After the English item is finalized, add three translated copies to the SAME
>    file: **Vietnamese** (`vi`), **Japanese** (`ja`), **Simplified Chinese**
>    (`zh-Hans`). Each copy:
>    - `id` = `<english-id>-<suffix>` (`-vi` / `-ja` / `-zh`); `locale` set accordingly.
>    - **Translate only** `title`, `summary`, `whyItMatters`, and (if present) each
>      section's `title` + `body`. Keep everything else byte-identical to the English
>      item: `tags`, `evidence`, `sourceName`, `sourceUrl`, `publishDate`, `category`,
>      `readMinutes`, `imageUrl`, `type`, and section `id`s.
>    - Keep verbatim inside the translation: drug names (allopurinol, febuxostat,
>      colchicine, pozdeutinurad/AR882, ruzinurad, dotinurad, …), source/trial/org
>      names (ACR, EULAR, NHS, JAMA, REDUCE 2), and units/identifiers (`6 mg/dL`,
>      `HLA-B*58:01`, DASH, GLP-1, DECT, FDA, NASP). Don't add advice or content not in
>      the English. `reviewed: false`.
>    - **Length still applies per locale:** `summary` ≤ 400 chars, `whyItMatters` ≤ 220.
>      Vietnamese runs ~5–10% longer than English — tighten it to fit rather than
>      spill over.
>
> **Output format.** Return, clearly separated:
> - **A)** `feed-knowledge.json` and **B)** `feed-news.json`, each exactly
>   `{ "version": 4, "updatedAt": "<today yyyy-MM-dd>", "items": [ ... ] }`, JSON only.
> - **C)** a **verification report** (plain text, OUTSIDE the JSON), with two tables:
>   1. **Sources** — per item: `id`, the primary source URL you visited, the tier /
>      `evidence` it maps to, and one line confirming it supports the claim. If the
>      lead came from med-news, note the med-news trail but cite the primary. Flag any
>      you could not fully verify.
>   2. **Images** — per item that has a candidate image: `id`, the original image URL,
>      its host, the **exact licence** you found (e.g. "Public domain", "CC0",
>      "CC-BY-4.0", "© all rights reserved", "unclear"), and your decision
>      (**kept** only for PD/CC0, **dropped** otherwise). List every image you
>      considered and dropped, with the reason.
>
> **Counts.** ~15–25 English knowledge items (aim for a rich set with images where
> PD/CC0 art exists), ~8–12 English news items — then ×4 in the file once each is
> localized to vi/ja/zh-Hans (rule 9). So a ~20-item English knowledge set ships as
> ~80 items total.
>
> **Field spec (bind to this; also enforced by `feed.schema.json`):**
> - Required: `id` (kebab), `type` (`knowledge`|`update`), `publishDate`
>   (`yyyy-MM-dd`), `locale` (`en`|`vi`|`ja`|`zh-Hans`), `title` (≤90),
>   `summary` (≤400), `whyItMatters` (≤220), `tags` (string[]),
>   `evidence` (`guideline`|`rct`|`review`|`news`), `sourceName`, `sourceUrl`
>   (`https://…`), `reviewed` (bool).
> - Optional: `category` (`guideline`|`research`|`therapy`|`lifestyle`|`general`),
>   `readMinutes` (int 1–60), `imageUrl` (`https://…`),
>   `sections` (`[{id, icon, title, body}]`).

---

## Keeping the News feed alive (the real risk)

The failure mode of the News tab is **not** technical — it's whether one person can
keep the feed fresh. Don't browse by hand. Stand up a pull pipeline:

1. **PubMed saved-query alert = the backbone.** Save a query such as
   `gout AND (treatment OR urate-lowering OR flare)`, filtered to RCT / review /
   guideline, and turn on the email/RSS alert. PubMed pushes new hits to you. No
   food-scanner competitor has this discipline.
2. **ClinicalTrials.gov RSS** — watch phase-3 gout trials change status.
3. **Fixed conference calendar** — **ACR Convergence (Nov)** + **EULAR Congress
   (June)**. Two big "harvest" windows a year; mark the calendar. Phase-3 data
   usually breaks here before it reaches a journal.
4. **One med-news safety net** (Healio *or* Rheumatology Advisor) to catch what
   PubMed misses. Discovery only — still trace to the primary.
5. **Claude/API does the scan → draft summary + suggested tags; the operator only
   approves.** RSS in → API summarizes → you nod/veto → commit the feed.

**Solo cadence that actually holds:** weekly PubMed alert (~5 min to filter) + two
conference harvests a year. Enough to keep News from dying without eating your life.

---

## Current landscape / live leads (verify to primary before writing)

Biggest wave right now = **new-generation URAT1 inhibitors**. Treat these as *leads*
— confirm each against the primary paper / conference abstract / ClinicalTrials.gov
before it goes in the feed (med-news figures are the starting point, not the citation):

- **pozdeutinurad (AR882)** — reported 18-month safety data.
- **ruzinurad** — phase 3 head-to-head vs allopurinol, reported superior urate
  lowering (≈52.6% reaching ≤360 µmol/L vs ≈34.5%).
- **tigulixostat**, **SEL-212**, **ABP-671** — in development.
- **dotinurad** — already approved in **Japan**.

**Locale edge.** URAT1 research is concentrated in China, the US, Japan, and Europe,
and many of the new drugs are Chinese/Japanese. Because Goutly ships Asian locales
(`ja`, `zh-Hans`) and sells into the EU/US, catching Asian drug news that Western
med-news covers slowly is a small but real content differentiator. Pair this with the
APLAR + Japanese-approval angle.

---

## After generation — operator checklist

1. **Validate** each file. Schemas live in `content/`, published feeds in `docs/`,
   so run from `content/` and point `-d` at `../docs/`. The formats plugin + relaxed
   strict mode are needed or ajv aborts before checking the data:
   ```bash
   cd content
   npx --package=ajv-cli@5 --package=ajv-formats@2 ajv validate \
     -s feed-knowledge.schema.json -d ../docs/content/feed-knowledge.json \
     --spec=draft2020 -r feed.schema.json -c ajv-formats --strict=false
   npx --package=ajv-cli@5 --package=ajv-formats@2 ajv validate \
     -s feed-news.schema.json -d ../docs/content/feed-news.json \
     --spec=draft2020 -r feed.schema.json -c ajv-formats --strict=false
   ```
2. **Verify every `sourceUrl`** opens (HTTP 200) and actually supports the summary —
   models can still hallucinate citations, and it must be the **primary** source, not
   a med-news retelling. Delete anything you can't confirm.
3. **Check originality** — the summary must not mirror the source's wording.
4. **Images** — using the report's Images table, keep only **public-domain / CC0**
   ones. Spot-check the licence yourself (models can misread it), download each to
   `docs/content/img/<id>.<ext>` (name = `id`), and remove `imageUrl` for anything
   not clearly PD/CC0. (Safest of all: use the app's own illustration style instead
   of source photos — you can regenerate these later.)
5. **Medical review** — a clinician/editor reviews the copy against the guardrails
   (no dosing/diagnosis, neutral wellness tone).
6. Only then set `reviewed: true` and deploy `feed-*.json` + `img/` to
   `goutly.xboostapp.io`.

> Legal note: summarizing facts and linking to the source is fine; reproducing text,
> figures, or copyrighted images is not. When an image's licence is unclear, don't
> use it.
