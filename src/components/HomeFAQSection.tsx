import { useState } from 'react'
import { Link } from 'react-router'
import { clinic, faqs } from '../content'
import { Arrow, FAQ } from './UI'
import './HomeFAQSection.css'

const categories = ['All Questions', 'Treatments & Care', 'First Visit & Triage', 'Coverage & Plans'] as const
type Category = typeof categories[number]

function categoryFor(question: string): Category {
  if (/insurance|coverage|payment|fees|cost|pricing|packages/i.test(question)) return 'Coverage & Plans'
  if (/first visit|appointment|when should|unsure|prepare|bring|which service/i.test(question)) return 'First Visit & Triage'
  return 'Treatments & Care'
}

export default function HomeFAQSection() {
  const [category, setCategory] = useState<Category>('All Questions')
  const items = category === 'All Questions' ? faqs : faqs.filter(item => categoryFor(item.question) === category)

  return <section className="section home-faq" aria-labelledby="home-faq-heading">
    <div className="agai-container">
      <div className="home-faq-filters" role="group" aria-label="Filter frequently asked questions">
        {categories.map(item => <button key={item} type="button" aria-pressed={category === item} aria-controls="home-faq-results" onClick={() => setCategory(item)}>{item}</button>)}
      </div>
      <div className="home-faq-layout">
        <div className="home-faq-introduction">
          <p className="home-unified-eyebrow">A little clarity</p>
          <h2 id="home-faq-heading" className="home-unified-title">Frequently asked <span>questions.</span></h2>
          <p className="home-faq-description">Clear care begins with answering everyday doubts. Everything you need to know about starting your rehabilitation journey at AGAI.</p>
          <div className="home-faq-contact">
            <h3>Still have a question?</h3>
            <p>We’re here to help you find the right next step for your recovery and mobility.</p>
            <Link className="home-faq-contact-button" to="/contact">Contact us <Arrow diagonal /></Link>
            {clinic.phone ? <div className="home-faq-contact-footer"><span>Talk to AGAI</span><a href={`tel:${clinic.phone.replace(/[^+\d]/g, '')}`}>{clinic.phone}</a></div> : null}
          </div>
        </div>
        <div id="home-faq-results">
          <p className="visually-hidden" role="status">{items.length} questions in {category}</p>
          {items.length > 0 ? <FAQ key={category} items={items} numbered openFirst /> : <div className="home-faq-empty"><h3>Questions about coverage or fees?</h3><p>Please contact AGAI to discuss your questions before booking.</p><Link to="/contact">Contact us <Arrow diagonal /></Link></div>}
        </div>
      </div>
    </div>
  </section>
}
