// Writes a static HTML file for every route after the client and server builds,
// so crawlers and link previews (WhatsApp, Google) get real content, titles and
// social tags without running JavaScript. Unknown URLs get a real 404 page.
//
// Output uses flat files: /about -> dist/about.html, /blogs/x -> dist/blogs/x.html.
// Netlify, Cloudflare Pages and GitHub Pages serve these at the clean URL as-is;
// public/.htaccess does the same on Apache.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const dist = resolve(root, 'dist')
const serverBuild = resolve(root, 'dist-ssr')
const { render, getPageMeta, prerenderPaths, socialImage, structuredData, siteUrl } = await import(pathToFileURL(resolve(serverBuild, 'entry-server.js')).href)

const template = readFileSync(resolve(dist, 'index.html'), 'utf8')
const escapeHtml = value => String(value).replace(/[&<>"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char])

// Fail the build rather than ship a page with a stale tag if index.html changes shape.
function replaceOnce(html, pattern, replacement) {
  if (!pattern.test(html)) throw new Error(`index.html no longer contains ${pattern}; update prerender.js`)
  return html.replace(pattern, () => replacement)
}
function setMeta(html, attribute, value) {
  return replaceOnce(html, new RegExp(`<meta ${attribute} content="[^"]*"\\s*/?>`), `<meta ${attribute} content="${escapeHtml(value)}" />`)
}

function build(path) {
  const meta = getPageMeta(path)
  const markup = render(path)
  if (!markup.includes('<h1')) throw new Error(`Prerendered ${path} has no <h1>; the page did not render`)
  let html = replaceOnce(template, /<title>[^<]*<\/title>/, `<title>${escapeHtml(meta.title)}</title>`)
  html = html.replace('<html lang="en">', `<html lang="${meta.language}">`)
  html = setMeta(html, 'name="description"', meta.description)
  html = setMeta(html, 'property="og:title"', meta.title)
  html = setMeta(html, 'property="og:description"', meta.description)
  html = setMeta(html, 'property="og:type"', meta.type)
  html = setMeta(html, 'property="og:url"', meta.canonical ?? siteUrl)
  html = setMeta(html, 'property="og:image"', socialImage)
  const head = [
    ...meta.alternates.map(alternate => `<link rel="alternate" hreflang="${alternate.language}" href="${escapeHtml(alternate.href)}" />`),
    `<meta name="robots" content="${meta.indexable ? 'index, follow' : 'noindex, follow'}" />`,
    meta.canonical ? `<link rel="canonical" href="${escapeHtml(meta.canonical)}" />` : '',
    // "<" is escaped so content can never close the script element early.
    meta.indexable ? `<script type="application/ld+json">${JSON.stringify(structuredData).replace(/</g, '\\u003c')}</script>` : '',
  ].filter(Boolean).map(tag => `    ${tag}\n`).join('')
  html = replaceOnce(html, /[ \t]*<\/head>/, `${head}  </head>`)
  return replaceOnce(html, /<div id="root"><\/div>/, `<div id="root" data-prerendered="${escapeHtml(path)}">${markup}</div>`)
}

const pages = [...prerenderPaths.map(path => ({ path, file: path === '/' ? 'index.html' : `${path.slice(1)}.html` })), { path: '/404', file: '404.html' }]
// Build everything before writing so index.html, which is also the template, is replaced last and only on success.
const outputs = pages.map(page => ({ ...page, html: build(page.path) }))
for (const { file, html } of outputs) {
  const destination = resolve(dist, file)
  mkdirSync(dirname(destination), { recursive: true })
  writeFileSync(destination, html)
}
rmSync(serverBuild, { recursive: true, force: true })
console.log(`Prerendered ${outputs.length} pages: ${outputs.map(page => page.file).join(', ')}`)
