import FounderSection from '../components/FounderSection'
import PageIntro from '../components/PageIntro'
import { Link } from 'react-router'
import { approach, clinic } from '../content'
import { Arrow, ContactBanner, Eyebrow } from '../components/UI'

export default function AboutPage() {
  return <>
    <PageIntro label="About us" lead="Care that starts" accent="with you." description={`${clinic.name} in ${clinic.address || 'Chennai'} helps people with pain, stiffness, injuries and difficulty moving. We start by understanding what is making everyday life harder, then discuss care that fits your needs.`} />
    <FounderSection />
    <section className="approach-section"><div className="agai-container section">
      <div className="section-heading"><div><Eyebrow>Your first visit</Eyebrow><h2>Understand your needs.<br />Plan your next step.</h2></div><p>You do not need to know the name of a treatment before you visit. Tell us what you are finding difficult and what you would like to get back to.</p></div>
      <div className="approach-grid">{approach.map((step, index) => <article key={step.title}><span className="step-number">0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div>
    </div></section>
    <section className="section agai-container about-next" aria-label="Explore further"><Link className="text-action" to="/services">Find care for your needs <Arrow /></Link><Link className="text-action" to="/contact">Ask us a question <Arrow diagonal /></Link></section>
    <ContactBanner />
  </>
}
