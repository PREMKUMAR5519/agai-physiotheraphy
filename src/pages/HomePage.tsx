import CareNeedsSection from '../components/CareNeedsSection'
import OptimizedImage from '../components/OptimizedImage'
import { ServicesStatus, useServices } from '../ServicesContext'
import FounderSection from '../components/FounderSection'
import HomeFAQSection from '../components/HomeFAQSection'
import TestimonialsSection from '../components/TestimonialsSection'
import { Fragment } from 'react'
import { Link } from 'react-router'
import { approach, homeContent } from '../content'
import { Arrow, ContactBanner } from '../components/UI'
import AppointmentSection from '../components/AppointmentSection'
import heroImage from '../assets/home-hero-main.webp'

export default function HomePage() {
  const { services } = useServices()
  return <div className="home-page">
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero-visual">
        <img
          className="hero-photo"
          src={homeContent.heroImage === '/images/home-hero-main.webp' ? heroImage : homeContent.heroImage}
          alt=""
          width="1500" height="1000"
          fetchPriority="high"
        />
      </div>
      <div className="hero-inner agai-container">
        <div className="hero-copy">
          <div className="hero-brand"><img src={`${import.meta.env.BASE_URL}images/agai-wordmark-light.svg`} alt="AGAI Physiotherapy Centre" width="1142" height="345" /></div>
          <h1 id="hero-heading">{homeContent.headline.map((line, index) => <Fragment key={index}>{index > 0 ? ' ' : null}<span>{line}</span></Fragment>)}</h1>
          <p className="hero-speciality">{homeContent.speciality}</p>
          <Link className="hero-pill" to="/#appointment">Book appointment <span className="hero-pill-icon"><Arrow /></span></Link>
          <div className="hero-feature">
            <h2>{homeContent.featureTitle}</h2>
            <p>{homeContent.featureText}</p>
            <Link className="hero-help-link" to="/#when-to-visit">When can physiotherapy help? <Arrow /></Link>
          </div>
        </div>
      </div>
    </section>

    <CareNeedsSection />

    <section className="section agai-container home-services" aria-labelledby="home-services-heading"><div className="section-heading"><div><p className="home-unified-eyebrow">Our services</p><h2 id="home-services-heading" className="home-unified-title">Care for your needs. <span>Support for your next step.</span></h2></div><p>Explore what each service is for and how it may support your daily life, recovery or return to sport.</p></div>
      <ServicesStatus/><div className="service-preview-grid">
        {services.map(service => <Link className="service-preview" key={service.id} to={`/services#${service.id}`}>
          <span className="service-preview-media"><OptimizedImage
            sizes="120px"
            className="service-preview-image"
            src={service.previewImage}
            alt=""
            loading="lazy"
            decoding="async"
            width="120"
            height="170"
          /></span>
          <div className="service-preview-copy">
            <h3>{service.shortTitle}</h3>
            <p>{service.intro}</p>
          </div>
        </Link>)}
      </div>
      <div className="section-bottom"><span>{services.length} services. One focus: your movement.</span><Link className="text-action" to="/services">View all services <Arrow /></Link></div>
    </section>

    <section className="approach-section" id="approach"><div className="agai-container section"><div className="section-heading"><div><p className="home-unified-eyebrow">Your first visit</p><h2 className="home-unified-title">Know what to expect. <span>Feel ready to begin.</span></h2></div><p>Your visit starts with a conversation about your symptoms, daily activities and goals. We explain the options before planning care together.</p></div><div className="approach-grid">{approach.map((step, index) => <article key={step.title}><span className="step-number">0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div></div></section>

    <FounderSection />
    <TestimonialsSection />
    <AppointmentSection />
    <HomeFAQSection />
    <ContactBanner variant="home" />
  </div>
}
