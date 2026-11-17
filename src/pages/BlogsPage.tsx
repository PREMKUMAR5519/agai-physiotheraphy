import { useLanguage } from '../language'
import OptimizedImage from '../components/OptimizedImage'
import RichText from '../components/RichText'
import PageIntro from '../components/PageIntro'
import { Link, useParams, useSearchParams } from 'react-router'
import { blogArticles, blogTopics, readingMinutes, type BlogArticle } from '../blogs'
import { Arrow } from '../components/UI'
import './BlogsPage.css'

function ArticleCard({ article }: { article: BlogArticle }) {
  const { t, isTamil, localPath } = useLanguage()
  return <article className="journal-card">
    <Link to={localPath(`/blogs/${article.slug}`)} className="journal-card-link">
      <div className="journal-card-image"><OptimizedImage sizes="(max-width: 640px) calc(100vw - 40px), (max-width: 1000px) 45vw, 380px" src={article.image} alt={article.imageAlt} loading="lazy" width="640" height="440" /><span className="journal-card-arrow"><Arrow diagonal /></span></div>
      <div className="journal-meta"><span>{t(article.category)}</span><span>{readingMinutes(article)} {isTamil ? 'நிமிட வாசிப்பு' : 'min read'}</span></div>
      <h3 lang="en">{article.title}</h3><p lang="en">{article.excerpt}</p>{isTamil && <span className="article-language-note">ஆங்கிலக் கட்டுரை</span>}
      <span className="journal-read">{t("Read article")} <Arrow /></span>
    </Link>
  </article>
}

function BookingNote() {
  const { t, isTamil, localPath } = useLanguage()
  return <aside className="journal-booking"><div><span className="journal-kicker">{t("YOUR NEXT CHAPTER")}</span><h2>{isTamil ? 'உங்கள் அடுத்த படியைப் பற்றிப் பேசலாம்.' : <>Let’s talk about<br />your next step.</>}</h2><p>{t("Care starts with a conversation about you.")}</p></div><Link className="agai-button" to={localPath("/#appointment")}>{t("Book an appointment")} <Arrow diagonal /></Link></aside>
}

export default function BlogsPage() {
  const { t, isTamil } = useLanguage()
  const [params, setParams] = useSearchParams()
  const topic = blogTopics.find(value => value === params.get('topic')) || 'All articles'
  const query = params.get('q') || ''
  const visible = blogArticles.filter(article => (topic === 'All articles' || article.category === topic) && `${article.title} ${article.excerpt} ${article.category} ${t(article.category)}`.toLowerCase().includes(query.trim().toLowerCase()))
  function updateFilter(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true, preventScrollReset: true })
  }
  return <div className="journal-page">
    <PageIntro label={t("Blogs")} lead={t("A little insight.")} accent={t("A step forward.")} description={t("Thoughtful reads on movement, everyday wellbeing and making the most of your care.")} metric={String(blogArticles.length).padStart(2, '0')} metricCaption={<>{t("Thoughtful reads.")}<br />{t("For your everyday.")}</>} />
    <div className="agai-container journal-content">{isTamil && <p className="article-language-note">கட்டுரைகள் தற்போது ஆங்கிலத்தில் உள்ளன. தலைப்பு அல்லது ஆங்கிலச் சொற்கள் மூலம் தேடலாம்.</p>}
    <section className="journal-library" aria-labelledby="journal-library-title"><div className="journal-library-heading"><div><p className="journal-kicker">{t("EXPLORE THE JOURNAL")}</p><h2 id="journal-library-title">{t("Good reads. For your everyday.")}</h2></div><label className="journal-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></svg><span className="visually-hidden">{t("Search articles")}</span><input type="search" placeholder={t("Find a little inspiration…")} value={query} onChange={event => updateFilter('q', event.target.value)} /></label></div>
      <div className="journal-filter-row"><div className="journal-filters" role="group" aria-label={t("Filter articles by topic")}>{blogTopics.map(value => <button key={value} type="button" aria-pressed={topic === value} onClick={() => updateFilter('topic', value === 'All articles' ? '' : value)}>{t(value)}</button>)}</div><span className="journal-count" role="status">{visible.length} {isTamil ? 'கட்டுரைகள்' : visible.length === 1 ? 'article' : 'articles'}</span></div>
      {visible.length ? <div className="journal-grid">{visible.map(article => <ArticleCard key={article.slug} article={article} />)}</div> : <div className="journal-empty"><h3>{t("No articles found.")}</h3><p>{t("Try a different phrase or explore all topics.")}</p><button className="agai-button" onClick={() => setParams({})}>{t("View all articles")} <Arrow /></button></div>}
    </section><BookingNote />
    </div>
  </div>
}

export function BlogArticlePage() {
  const { t, isTamil, localPath } = useLanguage()
  const { slug } = useParams()
  const article = blogArticles.find(item => item.slug === slug)
  if (!article) return <section className="section agai-container journal-page"><h1>{t("Article not found.")}</h1><Link className="text-action" to={localPath("/blogs")}>{t("Explore the journal")} <Arrow /></Link></section>
  const headings = article.body?.content?.flatMap((node, index) => node.type === 'heading' ? [{ id: `heading-body-${index}`, text: (node.content || []).map(child => child.text || '').join('') }] : [])
  return <div className="journal-page agai-container"><article className="journal-article"><nav className="breadcrumb" aria-label="Breadcrumb"><Link to={localPath("/")}>{t("Home")}</Link><span>/</span><Link to={localPath("/blogs")}>{t("Blogs")}</Link><span>/</span><span aria-current="page">{t("Article")}</span></nav><header className="journal-article-heading"><div className="journal-meta"><span>{t(article.category)}</span><span>{readingMinutes(article)} {isTamil ? 'நிமிட வாசிப்பு' : 'min read'}</span></div><h1 lang="en">{article.title}</h1><p lang="en">{article.excerpt}</p>{isTamil && <p className="article-language-note">இந்தக் கட்டுரை அதன் அசல் மொழியான ஆங்கிலத்தில் வழங்கப்படுகிறது.</p>}</header><OptimizedImage sizes="(max-width: 1160px) calc(100vw - 40px), 1120px" fetchPriority="high" className="journal-article-cover" src={article.image} alt={article.imageAlt} width="1120" height="600" /><div className="journal-article-layout"><aside className="journal-contents"><p className="journal-kicker">{t("IN THIS ARTICLE")}</p>{article.body ? headings?.map(heading => <a lang="en" href={`#${heading.id}`} key={heading.id}>{heading.text}</a>) : article.sections.map((section, index) => <a lang="en" href={`#section-${index}`} key={section.heading}>{section.heading}</a>)}<Link className="text-action" to={localPath("/blogs")}>{t("All articles")} <Arrow /></Link></aside><div className="journal-article-body" lang="en">{article.body ? <RichText body={article.body}/> : article.sections.map((section, index) => <section id={`section-${index}`} key={section.heading} tabIndex={-1}><h2>{section.heading}</h2><p>{section.text}</p></section>)}<p className="journal-editorial-note" lang={isTamil ? 'ta' : 'en'}>{t("General information to help you prepare for a conversation. Your physiotherapist can advise on your individual care.")}</p></div></div></article><section className="journal-related"><p className="journal-kicker">{t("KEEP EXPLORING")}</p><h2>{t("A little more to read.")}</h2><div className="journal-grid">{blogArticles.filter(item => item.slug !== slug).slice(0, 3).map(item => <ArticleCard key={item.slug} article={item} />)}</div></section><BookingNote /></div>
}
