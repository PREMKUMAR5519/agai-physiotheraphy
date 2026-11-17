# Agai custom care symbols

Six plain pictograms, one per care path, drawn so the concern is recognisable at a glance: a blue figure plus one green cue. Artwork is hand-authored SVG (round-capped strokes, filled paths and circles); the presentation is rendered from those same shapes.

## Files and presentation order

Left to right, top row:
1. `01-pain-and-stiffness.svg`
2. `02-injury-and-rehabilitation.svg`
3. `03-return-to-sport.svg`

Left to right, bottom row:
4. `04-pregnancy-and-womens-health.svg`
5. `05-walking-and-balance.svg`
6. `06-stroke-and-movement-recovery.svg`

Each individual SVG has a transparent background and a square `viewBox="0 0 256 256"`. There are no embedded bitmaps, external assets, fonts, gradients, shadows, borders, or watermarks. Artwork uses only #006C9F, #48B20B, and white. Accessible names are included as nonvisual SVG attributes.

`agai-six-care-symbols.png` and `.svg` are the matching 1536 × 1024, three-column by two-row presentation on white, with no visible labels. `size-proof-64px-48px.png` shows actual 64 px artwork in the upper row and 48 px artwork in the lower row.

## Website use

The six SVG assets are also saved under `public/images/care-symbols/`. For an icon beside an existing visible card heading:

```tsx
<img
  src="/images/care-symbols/01-pain-and-stiffness.svg"
  width="64"
  height="64"
  alt=""
/>
```

Use meaningful alt text when the icon is the only label. Render on white or a very light surface for the intended color contrast. Do not stretch the square aspect ratio. Existing website cards are not changed by the asset generation script.

To regenerate the set and presentation: `node scripts/create-care-icons.mjs`.

## What each symbol shows

1. Person holding their lower back, with green pain marks.
2. Person on a green crutch with a bandaged leg.
3. Runner with green motion lines.
4. Pregnant woman in profile with a heart on the bump.
5. Person walking with a green stick.
6. Head in profile with the brain and a green nerve signal.
