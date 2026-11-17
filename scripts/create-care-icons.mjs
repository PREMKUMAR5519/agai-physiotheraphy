import { mkdir, writeFile } from 'node:fs/promises'
import sharp from 'sharp'

// Plain pictograms: one blue figure, one green cue that names the concern.
// Coordinates share a 256 × 256 grid; strokes stay legible at 48 px.
const blue = '#006C9F', green = '#48B20B'
const line = (d, color = blue, width = 17) => `<path fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" d="${d}"/>`
const path = (d, fill) => `<path fill="${fill}" d="${d}"/>`
const head = (cx, cy, r = 21) => `<circle fill="${blue}" cx="${cx}" cy="${cy}" r="${r}"/>`
const icons = [
  {
    // Person holding an aching lower back.
    name: '01-pain-and-stiffness', title: 'Back pain and stiffness',
    shapes: [
      head(164, 50),
      line('M154 88Q136 116 132 156'),
      line('M132 156L150 194L144 232'),
      line('M132 156L118 232'),
      line('M152 98L110 112L126 148', blue, 15),
      line('M94 146L68 136', green, 13),
      line('M92 166L62 166', green, 13),
      line('M94 186L68 196', green, 13),
    ],
  },
  {
    // Person on a crutch with a bandaged leg.
    name: '02-injury-and-rehabilitation', title: 'Injury recovery with a crutch',
    shapes: [
      head(136, 46),
      line('M136 84L136 152'),
      line('M136 152L136 232'),
      line('M136 152L168 176'),
      line('M168 176L156 212', green, 24),
      line('M136 94L164 128', blue, 15),
      line('M136 96L114 120L102 142', blue, 15),
      line('M74 106L106 106M90 106L90 232', green, 13),
    ],
  },
  {
    // Runner with motion lines.
    name: '03-return-to-sport', title: 'Running',
    shapes: [
      head(176, 48),
      line('M160 86L128 146'),
      line('M128 146L170 164L164 212'),
      line('M128 146L102 184L60 196'),
      line('M158 94L188 116L212 98', blue, 15),
      line('M158 94L122 92L104 116', blue, 15),
      line('M36 88L76 88M24 120L68 120M40 152L72 152', green, 12),
    ],
  },
  {
    // Pregnant woman in profile with a heart on the bump.
    name: '04-pregnancy-and-womens-health', title: 'Pregnancy',
    shapes: [
      head(118, 46, 23),
      path('M98 84C118 74 140 84 144 104C174 112 192 138 186 164C181 184 164 194 148 196L164 236L80 236L96 184C88 152 88 112 98 84Z', blue),
      path('M150 172C120 150 132 122 150 136C168 122 180 150 150 172Z', '#fff'),
    ],
  },
  {
    // Person walking with a stick.
    name: '05-walking-and-balance', title: 'Walking with a stick',
    shapes: [
      head(132, 48),
      line('M126 86Q110 116 112 152'),
      line('M112 152L92 232'),
      line('M112 152L140 190L144 232'),
      line('M126 98L152 128L174 134', blue, 15),
      line('M172 136C172 116 198 116 198 136L198 232', green, 13),
    ],
  },
  {
    // Head in profile with the brain highlighted.
    name: '06-stroke-and-movement-recovery', title: 'Brain and nerve care',
    shapes: [
      path('M92 236L92 196C66 178 52 150 56 116C61 70 98 38 144 40C188 42 216 76 212 114L232 152L210 158L208 184C208 198 198 208 184 208L166 208L166 236Z', blue),
      path('M104 132A28 28 0 0 1 96 86A30 30 0 0 1 146 66A28 28 0 0 1 188 96A24 24 0 0 1 176 136A26 26 0 0 1 136 146A24 24 0 0 1 104 132Z', '#fff'),
      line('M112 112L128 112L138 88L150 130L160 104L176 104', green, 10),
    ],
  },
]

const assetDir = 'public/images/care-symbols'
const outDir = 'output/care-symbols'
await mkdir(assetDir, { recursive: true })
await mkdir(outDir, { recursive: true })
for (const icon of icons) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="${icon.title}">${icon.shapes.join('')}</svg>\n`
  await writeFile(`${assetDir}/${icon.name}.svg`, svg)
  await writeFile(`${outDir}/${icon.name}.svg`, svg)
}
const presentation = `<svg xmlns="http://www.w3.org/2000/svg" width="1536" height="1024" viewBox="0 0 1536 1024"><rect width="1536" height="1024" fill="white"/>${icons.map((icon, index) => `<g transform="translate(${(index % 3) * 512 + 96} ${Math.floor(index / 3) * 512 + 96}) scale(1.25)">${icon.shapes.join('')}</g>`).join('')}</svg>`
await writeFile(`${outDir}/agai-six-care-symbols.svg`, presentation)
await sharp(Buffer.from(presentation)).png().toFile(`${outDir}/agai-six-care-symbols.png`)
// A small-size proof uses the exact artwork, with no pixel retouching.
const proof = `<svg xmlns="http://www.w3.org/2000/svg" width="768" height="224"><rect width="768" height="224" fill="white"/>${icons.map((icon, index) => `<g transform="translate(${index * 128 + 32} 24) scale(.25)">${icon.shapes.join('')}</g><g transform="translate(${index * 128 + 40} 140) scale(.1875)">${icon.shapes.join('')}</g>`).join('')}</svg>`
await sharp(Buffer.from(proof)).png().toFile(`${outDir}/size-proof-64px-48px.png`)
console.log(`Created ${icons.length} transparent SVG symbols and presentation in ${outDir}`)
