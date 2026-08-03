# Goutly Learn feed — schema & authoring guide

The **Learn** tab (Knowledge + Updates) is served by two static JSON files. The app
does a plain `GET`, caches with stale-while-revalidate, and ships a bundled
fallback so it's never blank. **No user data is ever sent.**

| File | Served at | Every item `type` |
|------|-----------|-------------------|
| `feed-knowledge.json` | `https://goutly.xboostapp.io/feed-knowledge.json` | `"knowledge"` (evergreen) |
| `feed-news.json` | `https://goutly.xboostapp.io/feed-news.json` | `"update"` (dated) |

Layout: both JSON files live in `content/`; article images live in
`content/img/<item-id>.<ext>` (served at `…/img/<item-id>.<ext>`). See
`GEN_PROMPT.md` for drafting the content with AI.

Both files share the same schema (`feed.schema.json`); they differ only in the
`type` value. Per-file schemas that enforce `type`:
`feed-knowledge.schema.json`, `feed-news.schema.json`.

The host is configured in one place — `GoutHelper/App/AppConfig.swift`
(`feedBaseURL`). Change it there to point at a different environment.

---

## Envelope

```json
{
  "version": 4,
  "updatedAt": "2026-07-30",
  "items": [ /* Item[] */ ]
}
```

- `version` — integer, currently **4**.
- `updatedAt` — `yyyy-MM-dd` (UTC), when the file was published.
- `items` — the articles.

---

## Item fields

### Required

| Field | Type / values | Notes |
|-------|---------------|-------|
| `id` | string, kebab-case, **unique & stable** | Never change it — it keys Save-for-later and de-dup. Convention: `k-…` (knowledge), `n-…` (news). |
| `type` | `"knowledge"` \| `"update"` | Must match the file. |
| `publishDate` | `"yyyy-MM-dd"` | Drives news sorting. |
| `locale` | `"en"` \| `"vi"` \| `"ja"` \| `"zh-Hans"` | One item per language (see Localization). |
| `title` | string (≤ 90) | |
| `summary` | string (≤ 400) | 2–4 neutral, plain-language sentences. |
| `whyItMatters` | string (≤ 220) | One sentence: why a patient cares. Not an instruction. |
| `tags` | string[] | e.g. `["medication","ult"]`. Used for silent on-device personalization + topic icon. |
| `evidence` | `"guideline"` \| `"rct"` \| `"review"` \| `"news"` | Shown as an evidence chip. |
| `sourceName` | string | e.g. `"ACR Gout Guideline"`. |
| `sourceUrl` | `https://…` | **Required.** A real, credible source. |
| `reviewed` | boolean | `true` **only after human medical review**. |

### Optional

| Field | Type / values | Notes |
|-------|---------------|-------|
| `category` | `"guideline"` \| `"research"` \| `"therapy"` \| `"lifestyle"` \| `"general"` | Coloured badge. Inferred from `evidence`/`tags` if omitted. |
| `readMinutes` | integer 1–60 | Inferred (~200 wpm) if omitted. |
| `imageUrl` | `https://…` | The article's **real image** (downloaded + disk-cached). |
| `illustration` | string | Bundled asset name — **fallback file only**; remote feeds use `imageUrl`. |
| `sections` | Section[] | The "In this article" contents + body. |

### Section

```json
{ "id": "s1", "icon": "target", "title": "What is treat-to-target?", "body": "…" }
```

- `id` — unique within the article.
- `icon` — an **SF Symbol** name (`target`, `drop.fill`, `calendar`, `checkmark.seal.fill`, …).
- `title`, `body` — plain reviewed prose (no dosing advice).

---

## Rules that matter

1. **`type` matches the file** — knowledge file → all `knowledge`; news file → all `update`.
2. **Localization** — each translation is a **separate item** (different `id`, e.g.
   `…-vi`) with the same fields in that language. The app shows items in the
   selected language; if a section has none in that language it falls back to `en`.
   Provide `en` for everything; add other languages as you localize.
   **Do not machine-translate medical copy without human review.**
3. **`imageUrl`** — one real image per article. **Transparent PNG** is ideal (the app
   feathers the edges so it melts into the card); images with a background also work.
   ~1200 px, < ~150 KB, subject centred (it's cropped to a **square** thumbnail and a
   **wide** hero). Host on the same CDN.
4. **Caps** — Updates shows the **10 newest per category** (a file may hold ~100).
   Knowledge is unbounded and pages in client-side (6 at a time). Saved articles are
   always kept even after you remove them from the feed.
5. **Forward-compatible** — the app's decoder ignores unknown fields, maps unknown
   enum values to a safe default, and tolerates missing optionals. Old cached copies
   keep working when you add fields.
6. **Guardrails** — no dosing/titration advice, no diagnosis, neutral wellness tone,
   every item has a real `sourceUrl`. Set `reviewed: true` only after a human checks it.

---

## Validate before you serve

Using [ajv](https://github.com/ajv-validator/ajv-cli) (Draft 2020-12). Schemas live
here in the repo-root `content/`; published feeds live in `docs/content/` — run from
`content/` and point `-d` at `../docs/content/`. Add the formats plugin +
`--strict=false` or ajv aborts on the `uri` format / strict-types before it checks the
data:

```bash
cd content
npx --package=ajv-cli@5 --package=ajv-formats@2 ajv validate \
  -s feed-knowledge.schema.json -d ../docs/content/feed-knowledge.json \
  --spec=draft2020 -r feed.schema.json -c ajv-formats --strict=false
npx --package=ajv-cli@5 --package=ajv-formats@2 ajv validate \
  -s feed-news.schema.json -d ../docs/content/feed-news.json \
  --spec=draft2020 -r feed.schema.json -c ajv-formats --strict=false
```

Or point any Draft 2020-12 validator at `feed.schema.json` (add the per-file schema
to enforce `type`). Wire this into CI so a bad feed never ships.

---

## Generating with AI (draft → human review)

You can draft items with an LLM, but treat output as a **draft that must be
human-reviewed** before `reviewed` is set to `true` — this is medical copy.

**Prompt scaffold:**

> You are drafting entries for a gout self-care app's Learn feed. Output **only**
> JSON matching this schema: _(paste `feed.schema.json`)_.
> Rules:
> - Neutral, plain language for men aged 45–75. Reading age ~12.
> - **No** dosing, titration, or "you should…" instructions. **No** diagnosis.
> - `summary`: 2–4 sentences. `whyItMatters`: exactly one sentence, no imperative.
> - Every item needs a real, verifiable `sourceUrl` (guideline, RCT, or review).
>   If you can't cite a real source, omit the item.
> - `id` kebab-case with `k-`/`n-` prefix; `reviewed: false`.
> - Only `type: "knowledge"` for the knowledge file / `"update"` for the news file.
> - Leave `imageUrl`/`illustration` empty unless given a real URL.
> Produce N items as a single `{ "version": 4, "updatedAt": "<today>", "items": [...] }`.

**After generation:** validate against the schema, **verify every `sourceUrl`
resolves and supports the claim**, have a clinician/editor review the copy, then set
`reviewed: true` and publish.
