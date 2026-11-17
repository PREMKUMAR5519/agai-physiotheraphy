import { useLanguage } from '../language'
import OptimizedImage from '../components/OptimizedImage'
import { ServicesStatus, useServices } from '../ServicesContext'
import PageIntro from '../components/PageIntro'
import { Link, useSearchParams } from 'react-router'
import { categories } from '../content'
import { Arrow, ContactBanner, Icon } from '../components/UI'

export default function ServicesPage() {
  const { t, isTamil, localPath } = useLanguage()
  const { services } = useServices()
  const [params, setParams] = useSearchParams()
  const category = categories.some(item => item.id === params.get('category')) ? params.get('category')! : 'all'
  const visibleServices = services.filter(service => category === 'all' || service.category === category)

  return <>
    <PageIntro label={t("Our services")} lead={t("Understand your needs.")} accent={t("Find your next step.")} description={t("Pain, stiffness, an injury or difficulty with everyday movement? Explore who each service is for and how care may help. Your physiotherapist will assess your needs before recommending a plan.")} metric={String(services.length).padStart(2, '0')} metricCaption={<>{t("Areas of care.")}<br />{t("Individual care.")}</>} />
    <section className="section agai-container services-section" aria-labelledby="services-heading"><div className="services-toolbar"><h2 id="services-heading">{t("Find your focus.")}</h2><span className="result-count" role="status">{visibleServices.length} {isTamil ? (visibleServices.length === 1 ? 'சேவை' : 'சேவைகள்') : visibleServices.length === 1 ? 'service' : 'services'}</span></div><div className="service-filters" role="group" aria-label={t("Filter services")}>{categories.map(item => <button type="button" key={item.id} aria-pressed={category === item.id} onClick={() => setParams(item.id === 'all' ? {} : { category: item.id }, { preventScrollReset: true })}>{t(item.label)}</button>)}</div>
      <ServicesStatus/>{!services.length && <p role="status">{t("No services are currently published. Please contact the clinic for help.")}</p>}<div className="service-catalogue">{visibleServices.map(service => <article className="service-detail" key={service.id} id={service.id} tabIndex={-1} aria-labelledby={`${service.id}-title`}>
        <div className="service-detail-image"><OptimizedImage sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1200px) 40vw, 480px" src={service.image} alt="" loading="lazy" width="640" height="800" /><span className="service-photo-icon"><Icon name={service.icon} /></span></div>
        <div className="service-detail-content">
          <div className="service-detail-heading"><span className="service-category">{t(categories.find(item => item.id === service.category)?.label || '')}</span><h3 id={`${service.id}-title`}>{t(service.title)}</h3><p>{t(service.intro)}</p></div>
          <div className="service-for-you"><h4>{t("When to consider this care")}</h4><p>{t(service.forYou)}</p></div>
          <p className="service-description">{t(service.description)}</p>
          <div className="service-detail-bottom"><div className="service-detail-body"><h4>{t("How we can support you")}</h4><ul>{service.focus.map(focus => <li key={focus}><Icon name="check" />{t(focus)}</li>)}</ul></div><Link className="service-enquiry" to={localPath(`/?service=${service.id}#appointment`)} aria-label={`Book Appointment for ${t(service.shortTitle)}`}>{t("Book Appointment")} <span><Arrow diagonal /></span></Link></div>
        </div>
      </article>)}</div>
      <aside className="service-help"><span className="service-icon"><Icon name="chat" /></span><div><h3>{t("Not sure where to start?")}</h3><p>{t("You don’t need to have it all figured out. Tell us what you need help with in your enquiry.")}</p></div><Link className="text-action" to={localPath("/contact")}>{t("Get in touch")} <Arrow /></Link></aside>
    </section>
    <ContactBanner variant="home" />
  </>
}

