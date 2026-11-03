import { useEffect, useRef } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router'
import { Header, Footer } from './components/Layout'
import { Arrow, Eyebrow } from './components/UI'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import ContactPage from './pages/ContactPage'
import ChatAssistant from './components/ChatAssistant'
import BlogsPage, { BlogArticlePage } from './pages/BlogsPage'
import { blogArticles } from './blogs'
import './App.css'

const pageMeta: Record<string, { title: string; description: string }> = {
  '/blogs': { title: 'The AGAI Journal | Blogs', description: 'Thoughtful reads on movement, everyday wellbeing and preparing for physiotherapy care at AGAI.' },
  '/': { title: 'AGAI Physiotherapy Centre | Rehab. Recover. Restore. Perform.', description: 'Personalised, evidence-based physiotherapy at AGAI. Meet Dr. Rasathi Rajendren, PT, and explore rehabilitation, sports performance and wellness care.' },
  '/about': { title: 'About us | AGAI Physiotherapy Centre', description: 'Get to know AGAI Physiotherapy Centre in Chennai: our commitment to personalised, evidence-based care and the clinical experience of founder Dr. Rasathi Rajendren, PT.' },
  '/services': { title: 'Our services | AGAI Physiotherapy Centre', description: 'Explore seven areas of physiotherapy care: sports injury rehabilitation, conditioning, orthopaedics, neurology, women’s wellness, pelvic floor and geriatric rehabilitation.' },
  '/contact': { title: 'Contact us | AGAI Physiotherapy Centre', description: 'Contact AGAI Physiotherapy Centre and prepare an enquiry about rehabilitation, physiotherapy services or appointments.' },
}

export default function App() {
  const location = useLocation()
  useEffect(() => {
    const path = location.pathname.replace(/\/$/, '') || '/'
    const article = path.startsWith('/blogs/') ? blogArticles.find(item => `/blogs/${item.slug}` === path) : undefined
    const meta = article ? { title: `${article.title} | AGAI Journal`, description: article.excerpt } : pageMeta[path] || { title: 'Page not found | AGAI Physiotherapy Centre', description: 'Find your way back to AGAI Physiotherapy Centre.' }
    document.title = meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description)
  }, [location.pathname])
  const previous = useRef(location)
  useEffect(() => {
    const last = previous.current
    previous.current = location
    // Only the query changed on the same page (e.g. a service filter): leave the scroll position alone.
    if (last !== location && last.pathname === location.pathname && last.hash === location.hash && last.search !== location.search) return
    const frame = requestAnimationFrame(() => {
      let anchor = ''
      try { anchor = decodeURIComponent(location.hash.slice(1)) } catch { /* Ignore malformed URL fragments. */ }
      const target = anchor ? document.getElementById(anchor) : null
      if (target) {
        target.scrollIntoView({ block: 'start', behavior: 'instant' })
        if (target.hasAttribute('tabindex')) target.focus({ preventScroll: true })
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' })
        document.getElementById('main')?.focus({ preventScroll: true })
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [location])

  return <div id="top" className="site-shell"><a className="skip-link" href="#main">Skip to content</a><Header key={location.pathname + location.search + location.hash} /><main id="main" tabIndex={-1}><Routes><Route path="/" element={<HomePage />} /><Route path="/about" element={<AboutPage />} /><Route path="/services" element={<ServicesPage />} /><Route path="/blogs" element={<BlogsPage />} /><Route path="/blogs/:slug" element={<BlogArticlePage />} /><Route path="/contact" element={<ContactPage key={location.search} />} /><Route path="*" element={<section className="section agai-container not-found"><Eyebrow>404 · Page not found</Eyebrow><h1>Let’s get you<br /><span>back on track.</span></h1><p>This page isn’t here. Explore our care or return to the homepage.</p><Link className="agai-button" to="/">Back to home <Arrow /></Link></section>} /></Routes></main><Footer /><ChatAssistant /></div>
}
