import { useLanguage } from '../language'
import { Link } from 'react-router'
import { clinic } from '../content'
import { Arrow, Icon } from './UI'
import './AboutClinicSection.css'

export default function AboutClinicSection({ imageSrc }: { imageSrc?: string }) {
  const { t, localPath } = useLanguage()
  return <section className="section about-clinic" aria-labelledby="about-clinic-heading">
    <div className={`agai-container about-clinic-layout${imageSrc ? '' : ' about-clinic-layout--text'}`}>
      {imageSrc ? <figure className="about-clinic-photo"><img src={imageSrc} width="896" height="1193" alt={t("The exterior of AGAI Physiotherapy Centre in Ambattur, Chennai")} loading="lazy" decoding="async" /><figcaption><Icon name="pin" /><span>{clinic.address}</span></figcaption></figure> : null}
      <div className="about-clinic-copy">
        <p className="about-clinic-eyebrow">{t("About AGAI")}</p>
        <h2 id="about-clinic-heading">{t("Based in Chennai.")}<br /><span>{t("Focused on your movement.")}</span></h2>
        <p>{t("We are AGAI Physiotherapy Centre, based in Ambattur, Chennai. We help people with pain, stiffness, injuries and movement difficulties work towards everyday activities and the things they enjoy.")}</p>
        <p>{t("Our services include sports injury rehabilitation, orthopaedic and neurological rehabilitation, women’s fitness and wellness, pelvic floor rehabilitation, and care for older adults.")}</p>
        <div className="about-clinic-approach"><Icon name="chat" /><div><h3>{t("Care starts with a conversation.")}</h3><p>{t("We listen to your concerns, assess your movement and discuss care options with you. Your daily routine and goals help guide the next step.")}</p></div></div>
        <div className="about-clinic-actions"><Link className="agai-button" to={localPath("/services")}>{t("Explore our services")} <Arrow /></Link>{clinic.mapsUrl ? <a className="text-action" href={clinic.mapsUrl} target="_blank" rel="noopener noreferrer">{t("Find us in Ambattur")} <Arrow diagonal /></a> : null}</div>
      </div>
    </div>
  </section>
}
