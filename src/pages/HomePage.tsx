import FounderSection from '../components/FounderSection'
import { Link } from 'react-router'
import { approach, careNeeds, faqs, services } from '../content'
import { Arrow, ContactBanner, Eyebrow, FAQ, Icon } from '../components/UI'
import AppointmentSection from '../components/AppointmentSection'

export default function HomePage() {
  return <div className="home-page">
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero-visual">
        <img
          className="hero-photo"
          src={`${import.meta.env.BASE_URL}images/home-hero-main.webp`}
          alt=""
          width="1500" height="1000"
          fetchPriority="high"
        />
      </div>
      <div className="hero-inner agai-container">
        <div className="hero-copy">
          <div className="hero-brand"><img src={`${import.meta.env.BASE_URL}images/agai-wordmark-light.svg`} alt="AGAI Physiotherapy Centre" width="1142" height="345" /></div>
          <h1 id="hero-heading"><span>Move Better.</span>{' '}<span>Recover Stronger.</span>{' '}<span>Perform Better.</span></h1>
          <p className="hero-speciality">Sports Rehabilitation &amp; Performance Centre</p>
          <Link className="hero-pill" to="/#appointment">Book appointment <span className="hero-pill-icon"><Arrow /></span></Link>
          <div className="hero-feature">
            <h2>Is movement becoming difficult?</h2>
            <p>If pain, stiffness or weakness is making everyday activities harder, start with an assessment.</p>
            <Link className="hero-help-link" to="/#when-to-visit">When can physiotherapy help? <Arrow /></Link>
          </div>
        </div>
      </div>
    </section>

    <section className="section care-needs-section" id="when-to-visit" tabIndex={-1} aria-labelledby="care-needs-heading"><div className="agai-container">
      <div className="section-heading"><div><Eyebrow>When to visit</Eyebrow><h2 id="care-needs-heading" className="home-section-title"><span className="home-title-lead">Does this sound</span><br /><span>familiar?</span></h2></div><p>Physiotherapy may help when pain or difficulty moving gets in the way of your day. An assessment helps us understand your needs and discuss the right next step.</p></div>
      <div className="care-needs-grid">{careNeeds.map(need => <Link className="care-need" key={need.title} to={`/services#${need.serviceId}`}><span className="care-need-icon"><Icon name={need.icon} /></span><h3>{need.title}</h3><p>{need.description}</p><span className="care-need-link">{need.linkLabel} <Arrow /></span></Link>)}</div>
      <div className="care-needs-footer"><p>Not sure which service you need? Tell us what you are finding difficult.</p><Link className="text-action" to="/#appointment">Start with an assessment <Arrow /></Link></div>
    </div></section>

    <section className="section agai-container home-services" aria-labelledby="home-services-heading"><div className="section-heading"><div><Eyebrow>Our services</Eyebrow><h2 id="home-services-heading" className="home-section-title"><span className="home-title-lead">Care for your needs.</span><br /><span>Support for your next step.</span></h2></div><p>Explore what each service is for and how it may support your daily life, recovery or return to sport.</p></div>
      <div className="service-preview-grid">
        {services.map(service => <Link className="service-preview" key={service.id} to={`/services#${service.id}`}>
          <img
            className="service-preview-image"
            src={service.previewImage}
            alt=""
            loading="lazy"
            decoding="async"
            width="120"
            height="170"
          />
          <div className="service-preview-copy">
            <h3>{service.shortTitle}</h3>
            <p>{service.intro}</p>
          </div>
        </Link>)}
      </div>
      <div className="section-bottom"><span>Seven services. One focus: your movement.</span><Link className="text-action" to="/services">View all services <Arrow /></Link></div>
    </section>

    <section className="approach-section" id="approach"><div className="agai-container section"><div className="section-heading"><div><Eyebrow>Your first visit</Eyebrow><h2 className="home-section-title"><span className="home-title-lead">Know what to expect.</span><br /><span>Feel ready to begin.</span></h2></div><p>Your visit starts with a conversation about your symptoms, daily activities and goals. We explain the options before planning care together.</p></div><div className="approach-grid">{approach.map((step, index) => <article key={step.title}><span className="step-number">0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div></div></section>

    <FounderSection />
    <AppointmentSection />
    <section className="faq-section section home-faq" aria-labelledby="home-faq-heading">
      <div className="agai-container faq-layout">
        <div className="home-faq-intro">
          <div><Eyebrow>A little clarity</Eyebrow><h2 id="home-faq-heading" className="home-section-title"><span className="home-title-lead">Frequently asked</span><br /><span>questions.</span></h2></div>
          <div className="faq-contact-card">
            <h3>Still have a question?</h3>
            <p>We’re here to help you find the right next step.</p>
            <Link className="faq-contact-button" to="/contact">Contact us <Arrow diagonal /></Link>
          </div>
        </div>
        <FAQ items={faqs} numbered />
      </div>
    </section>
    <ContactBanner variant="home" />
  </div>
}
