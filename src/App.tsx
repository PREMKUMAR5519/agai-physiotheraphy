import { ServicesProvider, useServices } from './ServicesContext'
import { useEffect, useRef } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router'
import { Header, Footer } from './components/Layout'
import { Arrow, Eyebrow } from './components/UI'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import BookAppointmentPage from './pages/BookAppointmentPage'
import ContactPage from './pages/ContactPage'
import ChatAssistant from './components/ChatAssistant'
import BlogsPage, { BlogArticlePage } from './pages/BlogsPage'
import { getPageMeta } from './meta'
import site from './site.json'
import './App.css'

export default function App() {
  return <ServicesProvider><WebsiteApp/></ServicesProvider>
}
function WebsiteApp() {
  const { services } = useServices()
  const location = useLocation()
  useEffect(() => {
    const meta = getPageMeta(location.pathname)
    const { indexable } = meta
    document.title = meta.title
    for (const [selector, value] of [
      ['meta[name="description"]', meta.description],
      ['meta[property="og:title"]', meta.title],
      ['meta[property="og:description"]', meta.description],
      ['meta[property="og:type"]', meta.type],
      ['meta[property="og:url"]', meta.canonical ?? `${site.url}/`],
    ]) document.querySelector(selector)?.setAttribute('content', value)
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    if (!robots) {
      robots = document.createElement('meta')
      robots.name = 'robots'
      document.head.appendChild(robots)
    }
    robots.content = indexable ? 'index, follow' : 'noindex, follow'
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (indexable) {
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.rel = 'canonical'
        document.head.appendChild(canonical)
      }
      canonical.href = meta.canonical!
    } else {
      canonical?.remove()
    }
  }, [location.pathname])
  const previous = useRef<typeof location | null>(null)
  useEffect(() => {
    const last = previous.current
    previous.current = location
    if (last === location && !location.hash) return
    // Only the query changed on the same page (e.g. a service filter): leave the scroll position alone.
    if (last && last !== location && last.pathname === location.pathname && last.hash === location.hash && last.search !== location.search && location.hash !== '#appointment') return
    const frame = requestAnimationFrame(() => {
      let anchor = ''
      try { anchor = decodeURIComponent(location.hash.slice(1)) } catch { /* Ignore malformed URL fragments. */ }
      const targetId = anchor === 'appointment' && window.matchMedia('(max-width: 767px)').matches ? 'appointment-form' : anchor
      const target = targetId ? document.getElementById(targetId) : null
      if (target) {
        target.scrollIntoView({ block: 'start', behavior: 'instant' })
        if (target.hasAttribute('tabindex')) target.focus({ preventScroll: true })
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' })
        document.getElementById('main')?.focus({ preventScroll: true })
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [location, services])

  return <div id="top" className="site-shell"><a className="skip-link" href="#main">Skip to content</a><Header key={location.pathname + location.search + location.hash} /><main id="main" tabIndex={-1}><Routes><Route path="/" element={<HomePage />} /><Route path="/about" element={<AboutPage />} /><Route path="/services" element={<ServicesPage />} /><Route path="/blogs" element={<BlogsPage />} /><Route path="/blogs/:slug" element={<BlogArticlePage />} /><Route path="/book-appointment" element={<BookAppointmentPage />} /><Route path="/contact" element={<ContactPage key={location.search} />} /><Route path="*" element={<section className="section agai-container not-found"><Eyebrow>404 · Page not found</Eyebrow><h1>Let’s get you<br /><span>back on track.</span></h1><p>This page isn’t here. Explore our care or return to the homepage.</p><Link className="agai-button" to="/">Back to home <Arrow /></Link></section>} /></Routes></main><Footer /><ChatAssistant /></div>
}
