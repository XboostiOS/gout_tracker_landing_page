# Goutly — image assets

**The real app screenshots are already in place** (copied from your existing
`gout_tracker_landing_page/assets`). To refresh any of them, just overwrite the
PNG with the same name — no code changes needed. Each `<img>` requests the `.png`
first and falls back to a same-named `.svg` placeholder only if the PNG is missing.

## App screenshots (device-framed on the page)
Export at the native iPhone resolution so they stay crisp on Retina/2x displays.

| File (in place)        | Shows                                              |
|------------------------|----------------------------------------------------|
| `screen-today.png`     | Today: medication + latest uric acid (also hero-adjacent) |
| `screen-meds.png`      | Medication history — on-time chart, doses per day  |
| `screen-uric-acid.png` | Insights — uric acid over time, lab vs. home series |
| `screen-bodymap.png`   | Flares — stats + "Where it hurts" body map         |
| `screen-loguric.png`   | Log uric acid sheet — value, source, context tags  |

(Native iPhone Pro resolution, ~9:19.5 portrait. The device frame crops with `object-fit: cover`, so any portrait ratio is safe.)

## Social + icon (already provided as SVG; PNG optional but recommended)
| File            | Size        | Notes                                                        |
|-----------------|-------------|--------------------------------------------------------------|
| `og-image.png`  | 1200 × 630  | Social share card. Export from `og-image.svg`. Referenced by the OG/Twitter meta tags. |
| `favicon.svg`   | scalable    | Browser tab icon — already wired up, no action needed.       |

## Notes
- All assets are local — the site makes **no external requests** (no fonts, no CDNs, no trackers).
- Delete the `.svg` placeholder for a screen only after you've added its `.png`, if you want a smaller repo. Leaving them costs nothing.
