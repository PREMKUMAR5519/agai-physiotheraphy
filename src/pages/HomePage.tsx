import { useLanguage } from '../language'
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
import mobileHeroImage from '../assets/home-hero-main-mobile.webp'

export default function HomePage() {
  const { t, isTamil, localPath } = useLanguage()
  const { services } = useServices()
  return <div className="home-page">
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero-visual">
        <picture>
          <source media="(max-width: 767px)" srcSet={mobileHeroImage} />
          <img
            className="hero-photo"
            src={homeContent.heroImage === '/images/home-hero-main.webp' ? heroImage : homeContent.heroImage}
            alt=""
            width="1500" height="1000"
            fetchPriority="high"
          />
        </picture>
      </div>
      <div className="hero-inner agai-container">
        <div className="hero-copy">
          <div className="hero-brand"><img src={`${import.meta.env.BASE_URL}images/agai-wordmark-light.svg`} alt="AGAI Physiotherapy Centre" width="1142" height="345" /></div>
          <h1 id="hero-heading">{homeContent.headline.map((line, index) => <Fragment key={index}>{index > 0 ? ' ' : null}<span>{t(line)}</span></Fragment>)}</h1>
          <p className="hero-speciality">{t(homeContent.speciality)}</p>
          <Link className="hero-pill" to={localPath("/#appointment")}>{t("Book appointment")} <span className="hero-pill-icon"><Arrow /></span></Link>
          <div className="hero-feature">
            <h2>{t(homeContent.featureTitle)}</h2>
            <p>{t(homeContent.featureText)}</p>
            <Link className="hero-help-link" to={localPath("/#when-to-visit")}>{t("When can physiotherapy help?")} <Arrow /></Link>
          </div>
        </div>
      </div>
    </section>

    <CareNeedsSection />

    <section className="section agai-container home-services" aria-labelledby="home-services-heading"><div className="section-heading"><div><p className="home-unified-eyebrow">{t("Our services")}</p><h2 id="home-services-heading" className="home-unified-title">{t("Care for your needs.")} <span>{t("Support for your next step.")}</span></h2></div><p>{t("Explore what each service is for and how it may support your daily life, recovery or return to sport.")}</p></div>
      <ServicesStatus/><div className="service-preview-grid">
        {services.map(service => <Link className="service-preview" key={service.id} to={localPath(`/services#${service.id}`)}>
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
            <h3>{t(service.shortTitle)}</h3>
            <p>{t(service.intro)}</p>
          </div>
        </Link>)}
      </div>
      <div className="section-bottom"><span>{isTamil ? `${services.length} சேவைகள். ஒரே நோக்கம்: உங்கள் இயக்கம்.` : `${services.length} services. One focus: your movement.`}</span><Link className="text-action" to={localPath("/services")}>{t("View all services")} <Arrow /></Link></div>
    </section>

    <section className="approach-section" id="approach"><div className="agai-container section"><div className="section-heading"><div><p className="home-unified-eyebrow">{t("Your first visit")}</p><h2 className="home-unified-title">{t("Know what to expect.")} <span>{t("Feel ready to begin.")}</span></h2></div><p>{t("Your visit starts with a conversation about your symptoms, daily activities and goals. We explain the options before planning care together.")}</p></div><div className="approach-grid">{approach.map((step, index) => <article key={step.title}><span className="step-number">0{index + 1}</span><h3>{t(step.title)}</h3><p>{t(step.text)}</p></article>)}</div></div></section>

    <FounderSection />
    <TestimonialsSection />
    <AppointmentSection />
    <HomeFAQSection />
    <ContactBanner variant="home" />
  </div>
}
