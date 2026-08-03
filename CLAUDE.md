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
  - Learn feed: `docs/feed-knowledge.json` → `/feed-knowledge.json`,
    `docs/feed-news.json` → `/feed-news.json`,
    `docs/img/<id>.<ext>` → `/img/<id>.<ext>`
- **`content/` — internal (committed, NOT served):** `feed*.schema.json`,
  `FEED_SCHEMA.md`, `GEN_PROMPT.md`, `VERIFICATION_REPORT.md`
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

## Non-negotiable source rules

- **Trust tier maps to `evidence`:** guideline > `rct`/`review` > `news`.
- **Every item cites the PRIMARY source** (guideline / peer-reviewed paper /
  conference abstract / ClinicalTrials.gov). Prefer PubMed/PMC/DOI URLs — they
  resolve for everyone (BMJ/NEJM/Wiley block bots).
- **Med-news (Rheumatology Advisor, Healio, MedPage, BioPharma Dive) = discovery
  only; patient-ed/advocacy (Gout Education Society, Arthritis Foundation,
  CreakyJoints) = tone reference only. Neither is ever a `sourceUrl`.**
- **Banned:** supplements, home-remedy listicles, blogs, SEO farms, product sellers.
- **Never fabricate.** No invented URL/DOI/finding. Can't verify a primary source →
  drop the item.
- **Copy guardrails:** original wording (no close paraphrase); no dosing/diagnosis
  advice; targets tied to "the target your doctor sets"; `summary` 2–4 neutral
  sentences; `whyItMatters` one declarative sentence, never imperative.

## Before publishing (always)

1. **Validate** — schemas in `content/`, feeds in `docs/`, so run from `content/`
   (strict mode + `uri` format need flags, or ajv aborts before checking data):
   ```bash
   cd content
   npx --package=ajv-cli@5 --package=ajv-formats@2 ajv validate \
     -s feed-knowledge.schema.json -d ../docs/feed-knowledge.json \
     --spec=draft2020 -r feed.schema.json -c ajv-formats --strict=false
   npx --package=ajv-cli@5 --package=ajv-formats@2 ajv validate \
     -s feed-news.schema.json -d ../docs/feed-news.json \
     --spec=draft2020 -r feed.schema.json -c ajv-formats --strict=false
   ```
2. **HTTP-check every `sourceUrl`** returns 200 and is the primary source.
3. **Images:** only PD/CC0 (no attribution UI). Spot-check the licence, download to
   `docs/img/<id>.<ext>`, drop `imageUrl` otherwise.
4. **`reviewed` stays `false`** until a clinician/editor reviews the medical copy.
   Only a human flips it to `true`.

## Git

Site deploys from `main` (solo, deploy-on-commit repo — commit directly to `main`,
no PR needed). Commit/push only when asked. Write a `content/VERIFICATION_REPORT.md`
whenever regenerating feeds.
