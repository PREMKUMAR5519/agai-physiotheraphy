import PageIntro from '../components/PageIntro'
import { Link, useParams, useSearchParams } from 'react-router'
import { blogArticles, blogTopics, readingMinutes, type BlogArticle } from '../blogs'
import { Arrow } from '../components/UI'
import './BlogsPage.css'

function ArticleCard({ article }: { article: BlogArticle }) {
  return <article className="journal-card">
    <Link to={`/blogs/${article.slug}`} className="journal-card-link">
      <div className="journal-card-image"><img src={article.image} alt={article.imageAlt} loading="lazy" width="640" height="440" /><span className="journal-card-arrow"><Arrow diagonal /></span></div>
      <div className="journal-meta"><span>{article.category}</span><span>{readingMinutes(article)} min read</span></div>
      <h3>{article.title}</h3><p>{article.excerpt}</p>
      <span className="journal-read">Read article <Arrow /></span>
    </Link>
  </article>
}

function BookingNote() {
  return <aside className="journal-booking"><div><span className="journal-kicker">YOUR NEXT CHAPTER</span><h2>Let’s talk about<br />your next step.</h2><p>Care starts with a conversation about you.</p></div><Link className="agai-button" to="/#appointment">Book an appointment <Arrow diagonal /></Link></aside>
}

export default function BlogsPage() {
  const [params, setParams] = useSearchParams()
  const topic = blogTopics.find(value => value === params.get('topic')) || 'All articles'
  const query = params.get('q') || ''
  const visible = blogArticles.filter(article => (topic === 'All articles' || article.category === topic) && `${article.title} ${article.excerpt} ${article.category}`.toLowerCase().includes(query.trim().toLowerCase()))
  function updateFilter(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true, preventScrollReset: true })
  }
  return <div className="journal-page">
    <PageIntro label="Blogs" lead="A little insight." accent="A step forward." description="Thoughtful reads on movement, everyday wellbeing and making the most of your care." metric={String(blogArticles.length).padStart(2, '0')} metricCaption={<>Thoughtful reads.<br />For your everyday.</>} />
    <div className="agai-container journal-content">
    <section className="journal-library" aria-labelledby="journal-library-title"><div className="journal-library-heading"><div><p className="journal-kicker">EXPLORE THE JOURNAL</p><h2 id="journal-library-title">Good reads. For your everyday.</h2></div><label className="journal-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></svg><span className="visually-hidden">Search articles</span><input type="search" placeholder="Find a little inspiration…" value={query} onChange={event => updateFilter('q', event.target.value)} /></label></div>
      <div className="journal-filter-row"><div className="journal-filters" role="group" aria-label="Filter articles by topic">{blogTopics.map(value => <button key={value} type="button" aria-pressed={topic === value} onClick={() => updateFilter('topic', value === 'All articles' ? '' : value)}>{value}</button>)}</div><span className="journal-count" role="status">{visible.length} {visible.length === 1 ? 'article' : 'articles'}</span></div>
      {visible.length ? <div className="journal-grid">{visible.map(article => <ArticleCard key={article.slug} article={article} />)}</div> : <div className="journal-empty"><h3>No articles found.</h3><p>Try a different phrase or explore all topics.</p><button className="agai-button" onClick={() => setParams({})}>View all articles <Arrow /></button></div>}
    </section><BookingNote />
    </div>
  </div>
}

export function BlogArticlePage() {
  const { slug } = useParams()
  const article = blogArticles.find(item => item.slug === slug)
  if (!article) return <section className="section agai-container journal-page"><h1>Article not found.</h1><Link className="text-action" to="/blogs">Explore the journal <Arrow /></Link></section>
  return <div className="journal-page agai-container"><article className="journal-article"><nav className="breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><Link to="/blogs">Blogs</Link><span>/</span><span aria-current="page">Article</span></nav><header className="journal-article-heading"><div className="journal-meta"><span>{article.category}</span><span>{readingMinutes(article)} min read</span></div><h1>{article.title}</h1><p>{article.excerpt}</p></header><img className="journal-article-cover" src={article.image} alt={article.imageAlt} width="1120" height="600" /><div className="journal-article-layout"><aside className="journal-contents"><p className="journal-kicker">IN THIS ARTICLE</p>{article.sections.map((section, index) => <a href={`#section-${index}`} key={section.heading}>{section.heading}</a>)}<Link className="text-action" to="/blogs">All articles <Arrow /></Link></aside><div className="journal-article-body">{article.sections.map((section, index) => <section id={`section-${index}`} key={section.heading} tabIndex={-1}><h2>{section.heading}</h2><p>{section.text}</p></section>)}<p className="journal-editorial-note">General information to help you prepare for a conversation. Your physiotherapist can advise on your individual care.</p></div></div></article><section className="journal-related"><p className="journal-kicker">KEEP EXPLORING</p><h2>A little more to read.</h2><div className="journal-grid">{blogArticles.filter(item => item.slug !== slug).slice(0, 3).map(item => <ArticleCard key={item.slug} article={item} />)}</div></section><BookingNote /></div>
}
