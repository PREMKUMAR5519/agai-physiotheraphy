import PageIntro from '../components/PageIntro'
import { Link, useSearchParams } from 'react-router'
import { categories, services } from '../content'
import { Arrow, ContactBanner, Icon } from '../components/UI'

export default function ServicesPage() {
  const [params, setParams] = useSearchParams()
  const category = categories.some(item => item.id === params.get('category')) ? params.get('category')! : 'all'
  const visibleServices = services.filter(service => category === 'all' || service.category === category)

  return <>
    <PageIntro label="Our services" lead="Care for every" accent="way you move." description="From rehabilitation to performance, explore personalised physiotherapy shaped around your needs and the life you want to get back to." metric={String(services.length).padStart(2, '0')} metricCaption={<>Areas of care.<br />Individual care.</>} />
    <section className="section agai-container services-section" aria-labelledby="services-heading"><div className="services-toolbar"><h2 id="services-heading">Find your focus.</h2><span className="result-count" role="status">{visibleServices.length} {visibleServices.length === 1 ? 'service' : 'services'}</span></div><div className="service-filters" role="group" aria-label="Filter services">{categories.map(item => <button type="button" key={item.id} aria-pressed={category === item.id} onClick={() => setParams(item.id === 'all' ? {} : { category: item.id }, { preventScrollReset: true })}>{item.label}</button>)}</div>
      <div className="service-catalogue">{visibleServices.map(service => <article className="service-detail" key={service.id} id={service.id} tabIndex={-1} aria-labelledby={`${service.id}-title`}>
        <div className="service-detail-image"><img src={service.image} alt="" loading="lazy" width="640" height="800" /><span className="service-photo-icon"><Icon name={service.icon} /></span></div>
        <div className="service-detail-content">
          <div className="service-detail-heading"><span className="service-category">{categories.find(item => item.id === service.category)?.label}</span><h3 id={`${service.id}-title`}>{service.title}</h3><p>{service.intro}</p></div>
          <p className="service-description">{service.description}</p>
          <div className="service-detail-bottom"><div className="service-detail-body"><h4>Care focus</h4><ul>{service.focus.map(focus => <li key={focus}><Icon name="check" />{focus}</li>)}</ul></div><Link className="service-enquiry" to={`/?service=${service.id}#appointment`} aria-label={`Enquire about ${service.shortTitle}`}>Enquire about this service <span><Arrow diagonal /></span></Link></div>
        </div>
      </article>)}</div>
      <aside className="service-help"><span className="service-icon"><Icon name="chat" /></span><div><h3>Not sure where to start?</h3><p>You don’t need to have it all figured out. Tell us what you need help with in your enquiry.</p></div><Link className="text-action" to="/contact">Get in touch <Arrow /></Link></aside>
    </section>
    <ContactBanner />
  </>
}

