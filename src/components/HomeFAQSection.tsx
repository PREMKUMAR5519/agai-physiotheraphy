import { useLanguage } from '../language'
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
  const { t, isTamil, localPath } = useLanguage()
  const [category, setCategory] = useState<Category>('All Questions')
  const items = category === 'All Questions' ? faqs : faqs.filter(item => categoryFor(item.question) === category)

  return <section className="section home-faq" aria-labelledby="home-faq-heading">
    <div className="agai-container">
      <div className="home-faq-filters" role="group" aria-label={t("Filter frequently asked questions")}>
        {categories.map(item => <button key={item} type="button" aria-pressed={category === item} aria-controls="home-faq-results" onClick={() => setCategory(item)}>{t(item)}</button>)}
      </div>
      <div className="home-faq-layout">
        <div className="home-faq-introduction">
          <p className="home-unified-eyebrow">{t("A little clarity")}</p>
          <h2 id="home-faq-heading" className="home-unified-title">{t("Frequently asked")} <span>{t("questions.")}</span></h2>
          <p className="home-faq-description">{t("Clear care begins with answering everyday doubts. Everything you need to know about starting your rehabilitation journey at AGAI.")}</p>
          <div className="home-faq-contact">
            <h3>{t("Still have a question?")}</h3>
            <p>{t("We’re here to help you find the right next step for your recovery and mobility.")}</p>
            <Link className="home-faq-contact-button" to={localPath("/contact")}>{t("Contact us")} <Arrow diagonal /></Link>
            {clinic.phone ? <div className="home-faq-contact-footer"><span>{t("Talk to AGAI")}</span><a href={`tel:${clinic.phone.replace(/[^+\d]/g, '')}`}>{clinic.phone}</a></div> : null}
          </div>
        </div>
        <div id="home-faq-results">
          <p className="visually-hidden" role="status">{isTamil ? `${t(category)}: ${items.length} கேள்விகள்` : `${items.length} questions in ${category}`}</p>
          {items.length > 0 ? <FAQ key={category} items={items.map(item => ({ question: t(item.question), answer: t(item.answer) }))} numbered openFirst /> : <div className="home-faq-empty"><h3>{t("Questions about coverage or fees?")}</h3><p>{t("Please contact AGAI to discuss your questions before booking.")}</p><Link to={localPath("/contact")}>{t("Contact us")} <Arrow diagonal /></Link></div>}
        </div>
      </div>
    </div>
  </section>
}
