export const translatedPages = ['/', '/about', '/services', '/blogs', '/book-appointment', '/contact']

export function isTamilPath(path: string) {
  return path === '/ta' || path.startsWith('/ta/')
}

export function englishPath(path: string) {
  return isTamilPath(path) ? path.slice(3) || '/' : path
}

export function languagePath(path: string, tamil: boolean) {
  if (!path.startsWith('/') || path.startsWith('//')) return path
  const match = /^([^?#]*)(.*)$/.exec(path)!
  const base = englishPath(match[1]).replace(/\/$/, '') || '/'
  return `${tamil ? base === '/' ? '/ta' : `/ta${base}` : base}${match[2]}`
}
