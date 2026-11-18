import sharp from 'sharp'
import { createHash } from 'node:crypto'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = fileURLToPath(new URL('../', import.meta.url))
const output = path.join(root, 'public/optimized')
await mkdir(output, { recursive: true })
await mkdir(path.join(root, 'src/generated'), { recursive: true })
// The mobile header displays the emblem at 32px; provide a 2x asset instead
// of downloading the larger brand-kit original for every phone visit.
await sharp(path.join(root, 'public/brand-kit/assets/agai-emblem-128.webp'))
  .resize(64, 64).webp({ quality: 80, effort: 6 })
  .toFile(path.join(root, 'public/brand-kit/assets/agai-emblem-64.webp'))
const manifest = {}
let originalBytes = 0
let optimizedBytes = 0

async function emit(buffer, extension, label) {
  const hash = createHash('sha256').update(buffer).digest('hex').slice(0, 16)
  const name = `${label}-${hash}.${extension}`
  await writeFile(path.join(output, name), buffer)
  return `/optimized/${name}`
}

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) { await walk(file); continue }
    if (!/\.(webp|png|jpe?g)$/i.test(entry.name)) continue
    const original = await readFile(file)
    const metadata = await sharp(original).metadata()
    if (!metadata.width || metadata.pages > 1) continue
    const maxWidth = Math.min(metadata.width, 1500)
    const widths = [...new Set([240, 480, 768, 1120, maxWidth].filter(width => width <= maxWidth))].sort((a, b) => a - b)
    const variants = []
    const avifVariants = []
    const label = path.parse(file).name
    for (const width of widths) {
      const pipeline = sharp(original).rotate().resize({ width, withoutEnlargement: true })
      let webp = await pipeline.clone().webp({ quality: 78, effort: 5 }).toBuffer()
      let extension = 'webp'
      if (width === metadata.width && original.length < webp.length) {
        webp = original
        extension = path.extname(file).slice(1)
      }
      variants.push({ width, url: await emit(webp, extension, `${label}-${width}`) })
      const avif = await pipeline.clone().avif({ quality: 55, effort: 4 }).toBuffer()
      if (avif.length < webp.length) avifVariants.push({ width, url: await emit(avif, 'avif', `${label}-${width}`) })
      if (width === maxWidth) {
        originalBytes += original.length
        optimizedBytes += Math.min(webp.length, avif.length)
      }
    }
    const source = '/' + path.relative(path.join(root, 'public'), file).split(path.sep).join('/')
    manifest[source] = { src: variants.at(-1).url, variants,
      // Only offer AVIF when every width is smaller than its fallback.
      avif: avifVariants.length === variants.length ? avifVariants : [] }
  }
}
await walk(path.join(root, 'public/images/services'))
await walk(path.join(root, 'public/images/blog'))
await writeFile(path.join(root, 'src/generated/image-manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
console.log(`Optimized ${Object.keys(manifest).length} images: ${originalBytes} → ${optimizedBytes} bytes at maximum width; smaller responsive variants also generated.`)
