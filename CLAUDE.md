# CLAUDE.md — Goutly landing page + Learn feed

Static site for **Goutly** (a gout self-management iOS app, positioned as
**wellness, not a medical device**). Beyond the marketing pages, this repo hosts the
app's **Learn feed** — two JSON files the app pulls at runtime.

## Deployment / repo shape

GitHub Pages serves **branch `main`, path `/docs`**. So **`docs/` is the public site
root**, and anything *outside* `docs/` is version-controlled but **never served**.
That boundary — not `.gitignore` — is what keeps internal files private. (`.gitignore`
now only ignores `.DS_Store`; everything else is committed.)

- **`docs/` — public (served):**
  - Marketing: `index.html`, `privacy.html`, `terms.html`, `support.html`,
    `styles.css`, `script.js`, `assets/`
  - `CNAME` (custom domain must live in the served dir), `.nojekyll`
  - Learn feed (the app fetches these `/content/…` URLs): `docs/content/feed-knowledge.json` → `/content/feed-knowledge.json`,
    `docs/content/feed-news.json` → `/content/feed-news.json`,
    `docs/content/img/<id>.<ext>` → `/content/img/<id>.<ext>`
- **repo-root `content/` — internal (committed, NOT served):** `feed*.schema.json`,
  `FEED_SCHEMA.md`, `GEN_PROMPT.md`, `VERIFICATION_REPORT.md`. (Note: distinct from the
  served `docs/content/` — same name, different dir.)
- **`CLAUDE.md`** (this file) — internal, at repo root.

To change the served set, move files in/out of `docs/`. Pages source is set via
`gh api -X PUT repos/XboostiOS/gout_tracker_landing_page/pages -f 'source[branch]=main' -f 'source[path]=/docs'`.

## Two Learn-feed tasks

Both follow the same playbook — full spec in **`content/GEN_PROMPT.md`** (paste-ready
prompt + source whitelist), schema in **`content/FEED_SCHEMA.md`** + `content/feed*.schema.json`.

### 1. Knowledge (evergreen)
Foundation content, written once. Anchor every item to a **specialty guideline**
(`evidence: guideline`): ACR 2020, EULAR, NICE, APLAR (APLAR/EULAR cover the
Asian/EU locales).

### 2. News (dated) — the one that needs a heartbeat
The risk isn't tech, it's freshness. Don't browse by hand — run the pull pipeline in
`GEN_PROMPT.md`: **PubMed saved-query RSS alert** (backbone) + **ClinicalTrials.gov
RSS** + the **ACR (Nov) / EULAR (June)** conference calendar + one med-news safety net
(Healio / Rheumatology Advisor). Claude scans → drafts summary + tags → operator
approves → commit. Cadence: weekly PubMed filter (~5 min) + 2 conference harvests/year.
Live lead worth publishing now: **new-gen URAT1 inhibitors** (AR882, ruzinurad,
tigulixostat, SEL-212, ABP-671, dotinurad-in-Japan).

### Localize every item (part of generation, not a later pass)

Each feed ships in **four locales**: `en` + `vi` + `ja` + `zh-Hans`. When you crawl
and write the English items, immediately add three translated copies of each to the
same file. Localized item = the English item copied verbatim except: `id` =
`<en-id>-<vi|ja|zh>`, `locale` set, and only `title` / `summary` / `whyItMatters` /
section `title`+`body` translated. Keep `tags`, `evidence`, `source*`, dates,
`category`, `readMinutes`, `imageUrl`, and section `id`s identical; keep drug/source/
trial names and units (`6 mg/dL`, `HLA-B*58:01`, GLP-1, …) verbatim; `reviewed:false`.
Length limits apply per locale — Vietnamese runs long, so tighten it to fit
(`summary` ≤400, `whyItMatters` ≤220). A ~20-item English knowledge set becomes ~80
items. (Do the translation directly — no separate tool.)

## Non-negotiable source rules

- **Knowledge vs News is about verification, not topic.** Knowledge = *established,
  verified* facts (this-is-true). News = *latest gout news*, which need not be proven
  or peer-reviewed (this-is-being-reported).
- **Knowledge sources (strict):** a primary/authoritative source per item — guideline
  (ACR/EULAR/NICE/APLAR) or peer-reviewed journal; for evergreen basics a major
  medical-reference org (NIAMS/NHS/Mayo/CDC/MedlinePlus, and patient-ed orgs like
  Arthritis Foundation) with `evidence: review`. Prefer PubMed/PMC/DOI URLs (they
  resolve for everyone; BMJ/NEJM/Wiley block bots). Trust tier → `evidence`:
  guideline > `rct`/`review`.
- **News sources (lenient):** a primary source is welcome but **not required**.
  Reputable med-news (Rheumatology Advisor, Healio, MedPage, BioPharma Dive), a
  company/registry/regulator page, or an org's own page for its own event/campaign
  are all valid `sourceUrl`s. `evidence: news`. Frame as reported/preliminary, attribute
  claims ("the group says…"), never assert as settled fact.
- **Banned everywhere:** supplements, home-remedy listicles, blogs, SEO farms, product
  sellers.
- **Never fabricate.** No invented URL/DOI/finding, in either tab. Every item needs a
  real, working URL you actually opened; if you can't find one, drop the item.
- **Copy guardrails:** original wording (no close paraphrase); no dosing/diagnosis
  advice; targets tied to "the target your doctor sets"; `summary` 2–4 neutral
  sentences; `whyItMatters` one declarative sentence, never imperative.

## Before publishing (always)

1. **Validate** — schemas in `content/`, feeds in `docs/`, so run from `content/`
   (strict mode + `uri` format need flags, or ajv aborts before checking data):
   ```bash
   cd content
   npx --package=ajv-cli@5 --package=ajv-formats@2 ajv validate \
     -s feed-knowledge.schema.json -d ../docs/content/feed-knowledge.json \
     --spec=draft2020 -r feed.schema.json -c ajv-formats --strict=false
   npx --package=ajv-cli@5 --package=ajv-formats@2 ajv validate \
     -s feed-news.schema.json -d ../docs/content/feed-news.json \
     --spec=draft2020 -r feed.schema.json -c ajv-formats --strict=false
   ```
2. **HTTP-check every `sourceUrl`** returns 200 and is the primary source.
3. **Images:** only PD/CC0 (no attribution UI). Spot-check the licence, download to
   `docs/content/img/<id>.<ext>`. **If no PD/CC0 image fits, generate one** with the
   local FLUX tool `/Users/andrew/Works/Tools /genImg/genimg_cf.py` (run via
   `python3.12`); use a clean text-free subject (macro object / crystals / plain
   tablet / droplet / molecule — avoid labels, packaging, graduated tubes, documents;
   FLUX writes gibberish text on those), save to `docs/content/img/<id>.png`, and
   eyeball each output for stray text. All four locales of a topic share the one image.
4. **`reviewed` stays `false`** until a clinician/editor reviews the medical copy.
   Only a human flips it to `true`.

## Git

Site deploys from `main` (solo, deploy-on-commit repo — commit directly to `main`,
no PR needed). Commit/push only when asked. Write a `content/VERIFICATION_REPORT.md`
whenever regenerating feeds.
