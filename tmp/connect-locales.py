from pathlib import Path
repls={
'src/components/AppointmentSection.tsx': [('t, isTamil, locale, localPath','t, isTamil, locale')],
'src/pages/ContactPage.tsx':[('t, isTamil, locale, localPath','t, isTamil')],
'src/pages/BookAppointmentPage.tsx':[('t, isTamil, locale, localPath','t')],
'src/components/Layout.tsx':[('t, isTamil, locale, localPath','t, isTamil, localPath')]
}
for f, pairs in repls.items():
 p=Path(f);s=p.read_text(encoding='utf8')
 for a,b in pairs:s=s.replace(a,b)
 if f.endswith('Layout.tsx'):
  start=s.index('export function Footer')
  s=s[:start]+s[start:].replace('t, isTamil, localPath','t, localPath')
  for line in s.splitlines():
   if any('to="'+x+'"' in line for x in ['/about','/blogs','/about#founder']) and ('NavLink' in line or 'founder-nav' in line):s=s.replace(line,'        {!isTamil && <>'+line.strip()+'</>}')
 p.write_text(s,encoding='utf8')
p=Path('src/App.tsx');s=p.read_text(encoding='utf8');s="import { useLanguage } from './language'\n"+s
s=s.replace('function WebsiteApp() {','function WebsiteApp() {\n  const { t, isTamil } = useLanguage()')
s=s.replace('    document.title = meta.title','    document.title = meta.title\n    document.documentElement.lang = meta.language\n    document.querySelectorAll(\'link[rel="alternate"][hreflang]\').forEach(link => link.remove())\n    for (const alternate of meta.alternates) {\n      const link = document.createElement(\'link\')\n      link.rel = \'alternate\'\n      link.hreflang = alternate.language\n      link.href = alternate.href\n      document.head.appendChild(link)\n    }')
s=s.replace('className="site-shell"','className={`site-shell${isTamil ? \' tamil-page\' : \'\'}`} lang={isTamil ? \'ta\' : \'en\'}')
s=s.replace('>Skip to content</a>','>{t(\'Skip to content\')}</a>')
s=s.replace('<Route path="/contact"', '<Route path="/ta/book-appointment" element={<BookAppointmentPage />} /><Route path="/ta/contact" element={<ContactPage key={location.search} />} /><Route path="/contact"')
s=s.replace('<ChatAssistant />','<div lang="en"><ChatAssistant /></div>')
p.write_text(s,encoding='utf8')
p=Path('src/meta.ts');s=p.read_text(encoding='utf8');s=s.replace("  '/contact':", "  '/ta/book-appointment': { title: 'சந்திப்புக்கு முன்பதிவு | AGAI இயன்முறை மருத்துவ மையம்', description: 'சென்னை அம்பத்தூரில் உள்ள AGAI மையத்தில் சந்திப்புக்கு முன்பதிவு செய்யுங்கள். உங்களுக்கு ஏற்ற சேவை, தேதி மற்றும் நேரத்தைத் தெரிவியுங்கள்.' },\n  '/ta/contact': { title: 'தொடர்புகொள்ளுங்கள் | AGAI இயன்முறை மருத்துவ மையம்', description: 'சேவைகள் அல்லது சந்திப்பு குறித்துக் கேட்க AGAI மையத்தைத் தொடர்புகொள்ளுங்கள். உங்கள் விசாரணையைத் தமிழில் அனுப்பலாம்.' },\n  '/contact':")
s=s.replace('  return {\n    ...meta,', "  const language = path.startsWith('/ta/') ? 'ta' : 'en'\n  const englishPath = language === 'ta' ? path.slice(3) : path\n  const alternates = ['/book-appointment', '/contact'].includes(englishPath)\n    ? [{ language: 'en', href: `${site.url}${englishPath}` }, { language: 'ta', href: `${site.url}/ta${englishPath}` }, { language: 'x-default', href: `${site.url}${englishPath}` }]\n    : []\n  return {\n    ...meta,\n    language,\n    alternates,")
p.write_text(s,encoding='utf8')
p=Path('prerender.js');s=p.read_text(encoding='utf8');s=s.replace("  html = setMeta(html, 'name=", "  html = html.replace('<html lang=\"en\">', `<html lang=\"${meta.language}\">`)\n  html = setMeta(html, 'name=",1)
s=s.replace('  const head = [','  const head = [\n    ...meta.alternates.map(alternate => `<link rel="alternate" hreflang="${alternate.language}" href="${escapeHtml(alternate.href)}" />`),')
p.write_text(s,encoding='utf8')
p=Path('generate-sitemap.js');s=p.read_text(encoding='utf8');s=s.replace("  { path: '/contact',", "  { path: '/ta/book-appointment', source: 'src/pages/BookAppointmentPage.tsx', changefreq: 'monthly', priority: 0.9 },\n  { path: '/ta/contact', source: 'src/pages/ContactPage.tsx', changefreq: 'monthly', priority: 0.8 },\n  { path: '/contact',")
p.write_text(s,encoding='utf8')
p=Path('src/components/UI.tsx');s=p.read_text(encoding='utf8');s="import { useLanguage } from '../language'\n"+s;s=s.replace('  return <nav className="breadcrumb"','  const { t } = useLanguage()\n  return <nav className="breadcrumb"').replace('to="/">Home</Link><span','to="/">{t(\'Home\')}</Link><span');p.write_text(s,encoding='utf8')
