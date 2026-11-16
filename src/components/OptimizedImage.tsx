import type { ImgHTMLAttributes } from 'react'
import manifest from '../generated/image-manifest.json'

type Variant = { width: number; url: string }
type ImageEntry = { src: string; variants: Variant[]; avif: Variant[] }
const images: Record<string, ImageEntry> = manifest
const srcSet = (variants: Variant[]) => variants.map(item => `${item.url} ${item.width}w`).join(', ')

// Unrecognized or externally hosted CMS images keep their original URL.
export default function OptimizedImage({ src, sizes, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const image = src ? images[src] : undefined
  if (!image) return <img src={src} sizes={sizes} decoding="async" {...props} />
  return <picture style={{ display: 'contents' }}>
    {image.avif.length > 0 && <source type="image/avif" srcSet={srcSet(image.avif)} sizes={sizes} />}
    <img src={image.src} srcSet={srcSet(image.variants)} sizes={sizes} decoding="async" {...props} />
  </picture>
}
