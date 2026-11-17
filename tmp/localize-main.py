from pathlib import Path
import json,re
D=json.loads(Path('src/tamil.json').read_text(encoding='utf8'));D.update(json.loads(Path('src/tamil-main.json').read_text(encoding='utf8')))
files={
'src/pages/HomePage.tsx':['HomePage'], 'src/pages/AboutPage.tsx':['AboutPage'], 'src/pages/ServicesPage.tsx':['ServicesPage'], 'src/pages/BlogsPage.tsx':['ArticleCard','BookingNote','BlogsPage','BlogArticlePage'],
'src/components/CareNeedsSection.tsx':['CareNeedsSection'], 'src/components/FounderSection.tsx':['FounderSection'], 'src/components/FounderDetails.tsx':['FounderDetails'], 'src/components/HomeFAQSection.tsx':['HomeFAQSection'], 'src/components/AboutClinicSection.tsx':['AboutClinicSection'], 'src/components/TestimonialsSection.tsx':['ReviewStars','TestimonialsSection'], 'src/components/ChatAssistant.tsx':['ChatAssistant']}
for file, funcs in files.items():
 p=Path(file);s=p.read_text(encoding='utf8')
 s="import { useLanguage } from '../language'\n"+s
 for fn in funcs:
  pattern=r'(function '+fn+r'\([^\n]*\) \{)'
  s=re.sub(pattern,r'\1\n  const { t, isTamil, localPath } = useLanguage()',s)
 for en in sorted(D,key=len,reverse=True):
  q=json.dumps(en,ensure_ascii=False)
  s=re.sub(r'>(\s*)'+re.escape(en.replace('&','&amp;'))+r'(\s*)<',lambda m:'>'+m[1]+'{t('+q+')}'+m[2]+'<',s)
  for attr in ['placeholder','aria-label','title','label','lead','accent','description','alt']:
   s=s.replace(attr+'="'+en+'"',attr+'={t('+q+')}')
 s=re.sub(r'to="(/[^\"]*)"',r'to={localPath("\1")}',s)
 # Translate displayed content; original English data/IDs remain the basis of filters and keys.
 displays=['line','homeContent.speciality','homeContent.featureTitle','homeContent.featureText','service.shortTitle','service.title','service.intro','service.description','service.forYou','focus','step.title','step.text','item.label','item.title','item.text','need.title','need.description','need.focus','tag','founderContent.description','founderContent.role','credentialLabels[credential]','shortcut.label','shortcut.detail','action.label']
 for expr in displays:s=s.replace('{'+expr+'}', '{t('+expr+')}')
 # variable labels in each component
 if 'CareNeeds' in file:
  s=s.replace('{value}</button>','{t(value)}</button>')
  s=s.replace('to={service ? `/services#${need.serviceId}` : \'/contact\'}','to={localPath(service ? `/services#${need.serviceId}` : \'/contact\')}')
  s=s.replace("{service ? need.linkLabel : 'Ask us about this care'}", "{t(service ? need.linkLabel : 'Ask us about this care')}")
  s=s.replace("${need.title} ${need.description} ${need.keywords} ${need.tags.join(' ')}", "${need.title} ${need.description} ${need.keywords} ${need.tags.join(' ')} ${t(need.title)} ${t(need.description)} ${need.tags.map(t).join(' ')}")
  s=s.replace("{visible.length} care {visible.length === 1 ? 'path' : 'paths'}{query.trim() ? ` for “${query.trim()}”` : ' to explore'}", "{isTamil ? `${visible.length} சேவை வகைகள்${query.trim() ? ` — “${query.trim()}”` : ''}` : <>{visible.length} care {visible.length === 1 ? 'path' : 'paths'}{query.trim() ? ` for “${query.trim()}”` : ' to explore'}</>}")
  s=s.replace('Path {String(need.index + 1)', "{isTamil ? 'வகை' : 'Path'} {String(need.index + 1)")
 if file.endswith('HomePage.tsx'):
  s=s.replace('to={`/services#${service.id}`}','to={localPath(`/services#${service.id}`)}')
  s=s.replace('{services.length} services. One focus: your movement.', "{isTamil ? `${services.length} சேவைகள். ஒரே நோக்கம்: உங்கள் இயக்கம்.` : `${services.length} services. One focus: your movement.`}")
 if file.endswith('AboutPage.tsx'):
  s=s.replace('description={`${clinic.name}', "description={isTamil ? `சென்னை அம்பத்தூரில் உள்ள AGAI மையம் வலி, இறுக்கம், காயங்கள் மற்றும் இயக்கச் சிரமங்கள் உள்ளவர்களுக்கு உதவுகிறது. உங்கள் அன்றாட வாழ்க்கையில் உள்ள சிரமங்களைப் புரிந்துகொண்டு, தேவைகளுக்கு ஏற்ற சிகிச்சையைத் திட்டமிடுகிறோம்.` : `${clinic.name}")
 if file.endswith('ServicesPage.tsx'):
  s=s.replace("{visibleServices.length} {visibleServices.length === 1 ? 'service' : 'services'}", "{visibleServices.length} {isTamil ? 'சேவைகள்' : visibleServices.length === 1 ? 'service' : 'services'}")
  s=s.replace('{categories.find(item => item.id === service.category)?.label}', "{t(categories.find(item => item.id === service.category)?.label || '')}")
  s=s.replace('to={`/?service=${service.id}#appointment`}', 'to={localPath(`/?service=${service.id}#appointment`)}')
  s=s.replace('aria-label={`Book Appointment for ${service.shortTitle}`}', 'aria-label={isTamil ? `${t(service.shortTitle)} — முன்பதிவு செய்யுங்கள்` : `Book Appointment for ${service.shortTitle}`}')
 if file.endswith('FounderSection.tsx'):
  s=s.replace(' : credential}', ' : t(credential)}')
 if file.endswith('FounderDetails.tsx'):s=s.replace('{value}</li>', '{t(value)}</li>')
 if file.endswith('HomeFAQSection.tsx'):
  s=s.replace('{item}</button>', '{t(item)}</button>')
  s=s.replace('items={items}', 'items={items.map(item => ({ question: t(item.question), answer: t(item.answer) }))}')
  s=s.replace('{items.length} questions in {category}', "{isTamil ? `${t(category)}: ${items.length} கேள்விகள்` : `${items.length} questions in ${category}`}")
 if file.endswith('TestimonialsSection.tsx'):
  s=s.replace('<blockquote>', '<blockquote lang="en">')
  s=s.replace("? 'Show less' : 'Read full review'", "? t('Show less') : t('Read full review')")
  s=s.replace('Google reviews · {googleReviewSnapshot.reviewCount} reviews', "{isTamil ? `Google · ${googleReviewSnapshot.reviewCount} கருத்துகள்` : `Google reviews · ${googleReviewSnapshot.reviewCount} reviews`}")
  s=s.replace('> out of 5<', ">{isTamil ? ' / 5' : ' out of 5'}<")
  s=s.replace(' by {review.name}', " {isTamil ? '—' : 'by'} {review.name}")
  s=s.replace('className="testimonial-category"', 'className="testimonial-category" lang="en"')
 if file.endswith('BlogsPage.tsx'):
  s=s.replace('to={`/blogs/${article.slug}`}', 'to={localPath(`/blogs/${article.slug}`)}')
  s=s.replace('{value}</button>', '{t(value)}</button>')
  s=s.replace('{article.category}', '{t(article.category)}')
  s=s.replace('{readingMinutes(article)} min read', "{readingMinutes(article)} {isTamil ? 'நிமிட வாசிப்பு' : 'min read'}")
  s=s.replace("{visible.length} {visible.length === 1 ? 'article' : 'articles'}", "{visible.length} {isTamil ? 'கட்டுரைகள்' : visible.length === 1 ? 'article' : 'articles'}")
  s=s.replace('<h3>{article.title}</h3><p>{article.excerpt}</p>', '<h3 lang="en">{article.title}</h3><p lang="en">{article.excerpt}</p>{isTamil && <span className="article-language-note">ஆங்கிலக் கட்டுரை</span>}')
  s=s.replace('<h1>{article.title}</h1><p>{article.excerpt}</p>', '<h1 lang="en">{article.title}</h1><p lang="en">{article.excerpt}</p>{isTamil && <p className="article-language-note">இந்தக் கட்டுரை அதன் அசல் மொழியான ஆங்கிலத்தில் வழங்கப்படுகிறது.</p>}')
  s=s.replace('className="journal-article-body"', 'className="journal-article-body" lang="en"')
  s=s.replace('className="journal-editorial-note"', 'className="journal-editorial-note" lang={isTamil ? \'ta\' : \'en\'}')
  s=s.replace('<div className="agai-container journal-content">', '<div className="agai-container journal-content">{isTamil && <p className="article-language-note">கட்டுரைகள் தற்போது ஆங்கிலத்தில் உள்ளன. தலைப்பு அல்லது ஆங்கிலச் சொற்கள் மூலம் தேடலாம்.</p>}')
 if file.endswith('ChatAssistant.tsx'):
  s=s.replace("pathname === '/'", "pathname === '/' || pathname === '/ta'")
  s=s.replace("const reply: Message = { id: nextId.current++, role: 'assistant', ...getChatReply(message, services) }", "const reply: Message = { id: nextId.current++, role: 'assistant', ...(isTamil ? getTamilChatReply(message, services) : getChatReply(message, services)) }")
  s=s.replace("import { getChatReply }", "import { getTamilChatReply } from './tamilChatReplies'\nimport { getChatReply }")
  s=s.replace('createPortal(<div className=', 'createPortal(<div lang={isTamil ? \'ta\' : \'en\'} className=')
  s=s.replace('send(shortcut.question)', 'send(t(shortcut.question))')
  for question in ['How do I book an appointment?','What services do you offer?','Contact the clinic team']:
   s=s.replace("send('"+question+"')", "send(t('"+question+"'))")
  s=s.replace("? 'You' : 'AGAI guide'", "? t('You') : t('AGAI guide')").replace("? 'Close AGAI chat' : 'Open AGAI chat'", "? t('Close AGAI chat') : t('Open AGAI chat')")
  s=s.replace('to={action.href}', 'to={localPath(action.href)}')
 p.write_text(s,encoding='utf8')
# Existing shared UI: translate contact banners and navigation without changing icon components.
p=Path('src/components/UI.tsx');s=p.read_text(encoding='utf8');s=s.replace('  const isHome =', '  const { t, localPath } = useLanguage()\n  const isHome =')
for en in sorted(D,key=len,reverse=True):
 q=json.dumps(en,ensure_ascii=False);s=re.sub(r'>(\s*)'+re.escape(en.replace('&','&amp;'))+r'(\s*)<',lambda m:'>'+m[1]+'{t('+q+')}'+m[2]+'<',s)
# translate banner ternaries only
start=s.index('export function ContactBanner');end=s.index('export function FAQ')
a=s[start:end]
for en in D:
 for quote in ["'",'"']:
  a=a.replace(quote+en+quote, 't('+json.dumps(en,ensure_ascii=False)+')') if (quote+en+quote) in a and '{t('+quote+en+quote+')}' not in a else a
# above may nest t in literals introduced; collapse
while 't(t(' in a:a=re.sub(r't\(t\(("[^"\n]*")\)\)',r't(\1)',a)
a=re.sub(r'to="(/[^\"]*)"',r'to={localPath("\1")}',a)
a=a.replace('{step.title}','{t(step.title)}').replace('{step.text}','{t(step.text)}')
s=s[:start]+a+s[end:]
p.write_text(s,encoding='utf8')
