# Mobile performance changes — 18 November 2026

The changes are local and have not been deployed. Re-run PageSpeed Insights on
the public site after deployment; local Lighthouse results are not a promise
of a particular public score.

## Controlled comparison

Both builds were tested with Lighthouse 13.6.0, the same Edge installation,
default mobile simulation, and local HTTP servers with gzip enabled. The baseline
was built from the unchanged HEAD. Google Tag Manager remained enabled.

| Measurement | Before | After |
| --- | ---: | ---: |
| Performance | 84 | 90 |
| Accessibility | 97 | 100 |
| Best practices | 100 | 100 |
| SEO | 100 | 100 |
| First Contentful Paint | 0.9 s | 0.8 s |
| Largest Contentful Paint | 4.3 s | 3.4 s |
| Total Blocking Time | 130 ms | 150 ms |
| Cumulative Layout Shift | 0 | 0 |

These are individual runs, not medians. Third-party scripts and machine load
cause score variation. The user's public report showed 79 and 4.9 s LCP; it was
not used as the baseline for this comparison.

Reports: `tmp/performance/compressed-before.json` and
`tmp/performance/final-mobile.json`.

## Implementation

- Preload only the matching mobile or desktop hero, after the viewport meta tag.
- Inline the production styles with rebased asset URLs. One CSS bundle ensures
  component styling is present before CMS loading/hydration. This trades a larger
  HTML document for fewer cold-load request dependencies.
- Replace the 352,240-byte preloaded font with an 86,360-byte Latin/UI subset.
  Keep the full font for its remaining supported characters. Restrict its
  Unicode coverage so unsupported emoji do not trigger an unnecessary download.
- Generate a 1,878-byte 64px emblem for the 32px mobile header. Retain the 128px
  original as the higher-resolution source.
- Start Tag Manager during browser idle time after load, or on the first pointer
  or keyboard interaction. Consent defaults and event queuing run immediately.
  Very short visits ending before either trigger may not be measured.
- Let the browser defer offscreen home-section rendering. Keep booking and FAQ
  fully rendered, and disable this optimization for print.
- Darken muted text that failed the contrast audit.

## Verification

- Production build and 31 regression tests passed: loading/retry, booking
  analytics, navigation, care filters, Tamil layouts, forms, and language switching.
- Production browser checks passed at 390px and 1440px in English and Tamil:
  one hero download, no full-font download on those pages, stable booking anchors,
  preserved form values when switching languages, no horizontal overflow or
  uncaught JavaScript errors.
- Prerendered content remains styled and visible with JavaScript disabled.

Google Tag Manager still accounts for unused JavaScript reported by Lighthouse.
Removing that code requires reviewing the configured tags; the measurements
have not been disabled to hide the warning. LCP can still improve further.

## Asset maintenance

The subset is committed, so normal builds do not need Python. To regenerate it
after updating Inter, install `fonttools[woff]` in a Python environment and run
`python scripts/subset-font.py`. The original font and its OFL license remain.
`npm run images:optimize` regenerates the small header emblem.
