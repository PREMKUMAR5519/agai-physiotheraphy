from pathlib import Path
import re
cleanup={
'src/components/AboutClinicSection.tsx':[('t, isTamil, localPath','t, localPath')],
'src/components/FounderDetails.tsx':[('t, isTamil, localPath','t')],
'src/components/FounderSection.tsx':[('t, isTamil, localPath','t, localPath')],
'src/components/TestimonialsSection.tsx':[('t, isTamil, localPath','t, isTamil')],
'src/pages/AboutPage.tsx':[('t, isTamil, localPath','t, isTamil')]}
for f,pairs in cleanup.items():
 p=Path(f);s=p.read_text(encoding='utf8')
 for a,b in pairs:s=s.replace(a,b)
 if f.endswith('TestimonialsSection.tsx'):s=s.replace('const { t, isTamil }','const { t }',1)
 p.write_text(s,encoding='utf8')
p=Path('src/pages/BlogsPage.tsx');s=p.read_text(encoding='utf8');s=s.replace('export default function BlogsPage() {\n  const { t, isTamil, localPath }','export default function BlogsPage() {\n  const { t, isTamil }');s=s.replace('<h2>{t("Let’s talk about")}<br />{t("your next step.")}</h2>', '<h2>{isTamil ? \'உங்கள் அடுத்த படியைப் பற்றிப் பேசலாம்.\' : <>Let’s talk about<br />your next step.</>}</h2>');p.write_text(s,encoding='utf8')
p=Path('src/meta.ts');s=p.read_text(encoding='utf8');s="import { englishPath, isTamilPath, languagePath, translatedPages } from './locale-paths'\n"+s
s=s.replace("  '/ta/book-appointment':", "  '/ta': { title: 'AGAI இயன்முறை மருத்துவ மையம் | அம்பத்தூர், சென்னை', description: 'இயக்கம், மீட்சி மற்றும் உடற்திறனுக்கான தனிப்பட்ட இயன்முறை மருத்துவம். சென்னை அம்பத்தூரில் உள்ள AGAI மையத்தின் சேவைகளை அறியுங்கள்.' },\n  '/ta/about': { title: 'எங்களைப் பற்றி | AGAI இயன்முறை மருத்துவ மையம்', description: 'AGAI மையத்தின் மருத்துவர், சிகிச்சை அணுகுமுறை மற்றும் முதல் வருகையில் எதிர்பார்க்கக்கூடியவை குறித்து அறியுங்கள்.' },\n  '/ta/services': { title: 'எங்கள் சேவைகள் | AGAI இயன்முறை மருத்துவ மையம்', description: 'விளையாட்டுக் காயங்கள், மூட்டுப் பிரச்சினைகள், நரம்பியல் பாதிப்புகள், பெண்கள் நலம் மற்றும் முதியோருக்கான மறுவாழ்வுச் சேவைகளை அறியுங்கள்.' },\n  '/ta/blogs': { title: 'கட்டுரைகள் | AGAI இயன்முறை மருத்துவ மையம்', description: 'இயக்கம், அன்றாட நலம் மற்றும் சிகிச்சைக்குத் தயாராவது குறித்த AGAI கட்டுரைகளைப் பாருங்கள். கட்டுரைகள் தற்போது ஆங்கிலத்தில் உள்ளன.' },\n  '/ta/book-appointment':")
s=s.replace("  const article = path.startsWith('/blogs/') ? blogArticles.find(item => `/blogs/${item.slug}` === path) : undefined", "  const sourcePath = englishPath(path)\n  const article = sourcePath.startsWith('/blogs/') ? blogArticles.find(item => `/blogs/${item.slug}` === sourcePath) : undefined")
s=s.replace("const indexable = Boolean(article || pageMeta[path])", "const indexable = Boolean((article && !isTamilPath(path)) || pageMeta[path])")
s=s.replace("const language = path.startsWith('/ta/') ? 'ta' : 'en'", "const language = isTamilPath(path) ? 'ta' : 'en'")
s=s.replace("  const englishPath = language === 'ta' ? path.slice(3) : path\n  const alternates = ['/book-appointment', '/contact'].includes(englishPath)", "  const alternates = translatedPages.includes(sourcePath)")
s=s.replace('${site.url}${englishPath}', '${site.url}${sourcePath}').replace('${site.url}/ta${englishPath}', '${site.url}${languagePath(sourcePath, true)}')
s=s.replace("...blogArticles.map(article => `/blogs/${article.slug}`)", "...blogArticles.flatMap(article => [`/blogs/${article.slug}`, `/ta/blogs/${article.slug}`])")
p.write_text(s,encoding='utf8')
p=Path('generate-sitemap.js');s=p.read_text(encoding='utf8');s=s.replace("  { path: '/ta/book-appointment',", "  { path: '/ta', source: 'src/pages/HomePage.tsx', changefreq: 'monthly', priority: 1.0 },\n  { path: '/ta/about', source: 'src/pages/AboutPage.tsx', changefreq: 'monthly', priority: 0.8 },\n  { path: '/ta/services', source: 'src/pages/ServicesPage.tsx', changefreq: 'monthly', priority: 0.9 },\n  { path: '/ta/blogs', source: 'src/pages/BlogsPage.tsx', changefreq: 'weekly', priority: 0.8 },\n  { path: '/ta/book-appointment',");s=s.replace("'/blogs/:slug', '*']", "'/blogs/:slug', '/ta/blogs/:slug', '*']");p.write_text(s,encoding='utf8')
p=Path('middleware.js');s=p.read_text(encoding='utf8');s=s.replace("matcher: '/blogs/:slug'", "matcher: ['/blogs/:slug', '/ta/blogs/:slug']")
s=s.replace('function unavailable(status) {', 'function unavailable(status, tamil = false) {')
s=s.replace("  const title = missing ?", "  const title = tamil ? (missing ? 'கட்டுரை கிடைக்கவில்லை' : 'கட்டுரைகள் தற்காலிகமாகக் கிடைக்கவில்லை') : missing ?")
s=s.replace('<html lang="en">','<html lang="${tamil ? \'ta\' : \'en\'}">')
s=s.replace("${missing ? 'This article", "${tamil ? (missing ? 'இந்தக் கட்டுரை இல்லை அல்லது வெளியீட்டிலிருந்து நீக்கப்பட்டுள்ளது.' : 'சிறிது நேரம் கழித்து மீண்டும் முயலுங்கள்.') : missing ? 'This article")
s=s.replace('<a href="/blogs">Explore the journal</a>', '<a href="${tamil ? \'/ta/blogs\' : \'/blogs\'}">${tamil ? \'கட்டுரைகளைப் பாருங்கள்\' : \'Explore the journal\'}</a>')
s=s.replace('  const match = /^\\/blogs', "  const tamil = url.pathname.startsWith('/ta/')\n  const match = /^(?:\\/ta)?\\/blogs")
s=s.replace('unavailable(404)', 'unavailable(404, tamil)').replace('unavailable(503)', 'unavailable(503, tamil)').replace("url.pathname = '/blogs'", "url.pathname = tamil ? '/ta/blogs' : '/blogs'")
p.write_text(s,encoding='utf8')
