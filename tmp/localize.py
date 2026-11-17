import json,re
from pathlib import Path
D=json.loads(Path('src/tamil.json').read_text(encoding='utf8'))
files=['src/components/AppointmentSection.tsx','src/pages/ContactPage.tsx','src/components/ServiceSelect.tsx','src/components/Layout.tsx','src/pages/BookAppointmentPage.tsx']
for f in files:
 p=Path(f); s=p.read_text(encoding='utf8')
 s="import { useLanguage } from '../language'\n"+s
 funcs={'AppointmentSection.tsx':['AppointmentSection'],'ContactPage.tsx':['ContactPage'],'ServiceSelect.tsx':[], 'Layout.tsx':['Header','Footer'],'BookAppointmentPage.tsx':['BookAppointmentPage']}[p.name]
 for fn in funcs: s=s.replace('function '+fn+'() {','function '+fn+'() {\n  const { t, isTamil, locale, localPath } = useLanguage()')
 if p.name=='ServiceSelect.tsx': s=s.replace('  const { services }', '  const { t } = useLanguage()\n  const { services }')
 # Translate exact JSX text and translatable attribute values only.
 for en in sorted(D,key=len,reverse=True):
  q=json.dumps(en,ensure_ascii=False)
  encoded=en.replace('&','&amp;')
  s=re.sub(r'>(\s*)'+re.escape(encoded)+r'(\s*)<',lambda m:'>'+m[1]+'{t('+q+')}'+m[2]+'<',s)
  for attr in ['placeholder','aria-label','title','label','lead','accent','description','pending']:
   s=s.replace(attr+'="'+en+'"',attr+'={t('+q+')}')
 # Only translate string expressions inside rendered JSX; leave state/IDs unchanged.
 start=s.index('  return <',s.index('export '))
 before,markup=s[:start],s[start:]
 for en in sorted(D,key=len,reverse=True):
  literal="'"+en.replace("'","\\'")+"'"
  markup=markup.replace(literal,'t('+literal+')')
 s=before+markup
 if p.name=='AppointmentSection.tsx':
  s=s.replace("location.pathname === '/book-appointment'", "location.pathname.endsWith('/book-appointment')")
  s=s.replace("toLocaleDateString('en-IN'",'toLocaleDateString(locale')
  # move dateLabel inside component for locale access
  a=s.index('function dateLabel('); b=s.index('\nexport default',a)
  helper=s[a:b]; s=s[:a]+s[b:]; marker='  const { services } = useServices()'; s=s.replace(marker,helper+'\n'+marker)
  s=s.replace(" : 'Flexible — help me choose'", " : (isTamil ? 'தேதியைத் தேர்ந்தெடுக்க உதவி தேவை' : 'Flexible — help me choose')")
  s=s.replace('{label}</button>', '{t(label)}</button>').replace('{period}</button>', '{t(period)}</button>')
  s=s.replace('{error}</p>','{t(error)}</p>')
  s=s.replace('{founderContent.credentials}', '{t(founderContent.credentials)}').replace('{founderContent.role}', '{t(founderContent.role)}')
  s=s.replace('Step {step + 1} of {steps.length}', "{isTamil ? `படி ${step + 1} / ${steps.length}` : `Step ${step + 1} of ${steps.length}`} ")
  s=s.replace("{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map", "{(isTamil ? ['ஞா', 'தி', 'செ', 'பு', 'வி', 'வெ', 'ச'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']).map")
  s=s.replace('aria-label={`${timePeriod} times`}', 'aria-label={isTamil ? `${t(timePeriod)} நேரங்கள்` : `${timePeriod} times`}')
  # explicit whitespace after tags in source text is covered separately
  s=s.replace('</strong> Share only the details needed to arrange your visit. Please avoid sensitive medical information.', '</strong> {t("Share only the details needed to arrange your visit. Please avoid sensitive medical information.")}')
 elif p.name=='ContactPage.tsx':
  s=s.replace('{phoneError}</p>','{t(phoneError)}</p>').replace('{formError}</p>','{t(formError)}</p>')
  s=s.replace("result?.message || 'We could not submit your enquiry. Please try again.'", "(!isTamil && result?.message) || 'We could not submit your enquiry. Please try again.'")
  for text in ['Your name','Email address','Phone number','Your message']:
   s=s.replace('>'+text+' <span','>{t('+json.dumps(text)+')} <span')
 elif p.name=='ServiceSelect.tsx':
  s=s.replace('label: service.shortTitle as string','label: t(service.shortTitle as string)')
  s=s.replace("label: 'Not sure yet / help me choose'", "label: t('Not sure yet / help me choose')")
 elif p.name=='Layout.tsx':
  for route in ['/contact','/book-appointment']:
   s=s.replace('to="'+route+'"','to={localPath("'+route+'")}')
  s=s.replace('to="/#appointment"', 'to={isTamil ? "/ta/book-appointment" : "/#appointment"}')
  s=s.replace('{service.shortTitle}', '{t(service.shortTitle)}')
  # global accessible language switch, outside collapsed menu
  s=s.replace('      <button ref={menuButton}', '      <LanguageSwitch />\n      <button ref={menuButton}')
  s=s.replace("import { Link, NavLink }", "import { Link, NavLink, useLocation }")
  s=s.replace("import { useLanguage }", "import { translatedPages, useLanguage }")
  s+='''\nfunction LanguageSwitch() {
  const { pathname, search, hash } = useLocation()
  const isTamil = pathname.startsWith('/ta/')
  const englishPath = isTamil ? pathname.slice(3) : pathname
  const target = isTamil ? englishPath : `/ta${translatedPages.includes(englishPath) ? englishPath : '/book-appointment'}`
  return <Link className="language-switch" to={`${target}${search}${hash}`} lang={isTamil ? 'en' : 'ta'} hrefLang={isTamil ? 'en' : 'ta'} aria-label={isTamil ? 'Switch to English' : 'தமிழில் படிக்க'}>{isTamil ? 'English' : 'தமிழ்'}</Link>
}
'''
 # only keep destructured hook fields actually used
 for name in ['isTamil','locale','localPath']:
  # per-function unused cleanup left to tsc below
  pass
 p.write_text(s,encoding='utf8')
