from pathlib import Path
import re
p=Path('src/components/UI.tsx');s=p.read_text(encoding='utf8').replace('aria-label=t("Your first visit")','aria-label={t("Your first visit")}').replace('const { t } = useLanguage()','const { t, localPath } = useLanguage()').replace('to="/"','to={localPath("/")}');p.write_text(s,encoding='utf8')
p=Path('src/components/Layout.tsx');s=p.read_text(encoding='utf8').replace('import { translatedPages, useLanguage }', 'import { useLanguage }');s="import { isTamilPath, languagePath } from '../locale-paths'\n"+s
s=re.sub(r'to="(/[^\"]*)"',r'to={localPath("\1")}',s)
s=s.replace('to={`/services#${service.id}`}', 'to={localPath(`/services#${service.id}`)}')
s=s.replace('{!isTamil && <>','<>').replace('</>}','</>')
s=s.replace('to={isTamil ? "/ta/book-appointment" : "/#appointment"}', 'to={localPath("/#appointment")}')
s=s.replace('const { t, isTamil, localPath }', 'const { t, localPath }')
s=s.replace("const isTamil = pathname.startsWith('/ta/')", 'const isTamil = isTamilPath(pathname)')
a=s.index('  const englishPath =',s.index('function LanguageSwitch'))
b=s.index('  return <Link',a)
s=s[:a]+"  const target = languagePath(pathname, !isTamil)\n"+s[b:]
s=s.replace("{isTamil ? 'English' : 'தமிழ்'}</Link>", "<span aria-hidden=\"true\"><span className={!isTamil ? 'is-selected' : undefined}>English</span> | <span className={isTamil ? 'is-selected' : undefined}>தமிழ்</span></span></Link>")
p.write_text(s,encoding='utf8')
p=Path('src/App.tsx');s=p.read_text(encoding='utf8').replace('const { t, isTamil }', 'const { t, isTamil, localPath }').replace('to="/"','to={localPath("/")}').replace('<div lang="en"><ChatAssistant /></div>','<ChatAssistant />')
s=s.replace('<Route path="/ta/book-appointment"', '<Route path="/ta" element={<HomePage />} /><Route path="/ta/about" element={<AboutPage />} /><Route path="/ta/services" element={<ServicesPage />} /><Route path="/ta/blogs" element={<BlogsPage />} /><Route path="/ta/blogs/:slug" element={<BlogArticlePage />} /><Route path="/ta/book-appointment"')
p.write_text(s,encoding='utf8')
p=Path('src/pages/ContactPage.tsx');s=p.read_text(encoding='utf8').replace('t, isTamil, localizeValidation','t, isTamil, localPath, localizeValidation').replace('to="/services"','to={localPath("/services")}');p.write_text(s,encoding='utf8')
p=Path('src/ServicesContext.tsx');s=p.read_text(encoding='utf8');s="import { useLanguage } from './language'\n"+s;s=s.replace('export function ServicesStatus() {','export function ServicesStatus() {\n  const { t } = useLanguage()');s=s.replace('>Updating services…<','>{t(\'Updating services…\')}<').replace('{error}</p>','{t(error)}</p>').replace('>Retry loading services<','>{t(\'Retry loading services\')}<');p.write_text(s,encoding='utf8')
for p in list(Path('src/components').glob('*.tsx'))+list(Path('src/pages').glob('*.tsx')):
 s=p.read_text(encoding='utf8');new=re.sub(r'key=\{t\(([^()]*)\)\}',r'key={\1}',s)
 if new!=s:p.write_text(new,encoding='utf8')
