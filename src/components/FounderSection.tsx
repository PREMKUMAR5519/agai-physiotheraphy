import { useLanguage } from '../language'
import FounderDetails from './FounderDetails'
import { founderContent } from '../content'
import { Link } from 'react-router'
import { Arrow, Icon } from './UI'
import './FounderSection.css'

const carePromises = [
  { title: 'Time to be heard', text: 'Explain what is troubling you without feeling rushed.' },
  { title: 'Clarity, not complexity', text: 'Understand your options and why each step matters.' },
  { title: 'A plan made for real life', text: 'Exercises and advice designed around your daily routine.' },
]

export default function FounderSection() {
  const { t, localPath } = useLanguage()
  const credentials = founderContent.credentials.split(/[,·]/).map(value => value.trim()).filter(Boolean)
  const credentialLabels: Record<string, string> = {
    BPT: 'Bachelor of Physiotherapy',
    MPT: 'Master of Physiotherapy',
  }

  return (
    <section className="section founder-showcase" id="founder" tabIndex={-1} aria-labelledby="founder-heading"><div className="agai-container founder-showcase-inner">
      <div className="founder-showcase-story">
        <div className="founder-showcase-labels"><p className="founder-showcase-eyebrow">{t("Meet your physiotherapist")}</p><span className="founder-showcase-badge">{t("Care that fits you")}</span></div>
        <h2 id="founder-heading" className="home-section-title"><span className="home-title-lead">{t("Someone who listens.")}</span><span>{t("Care that fits you.")}</span></h2>
        <FounderDetails />
        <div className="founder-showcase-introduction"><p className="founder-showcase-description">{t(founderContent.description)}</p></div>
        <ul className="founder-showcase-care-tags" aria-label={t("Our approach")}><li><Icon name="chat" />{t("Time to listen")}</li><li><Icon name="person" />{t("Your goals guide your care")}</li><li><Icon name="activity" />{t("Support for daily movement")}</li></ul>
        <div className="founder-showcase-actions"><Link className="founder-showcase-book" to={localPath("/#appointment")}>{t("Book a consultation")} <Arrow /></Link><Link className="founder-showcase-explore" to={localPath("/services")}>{t("Explore our care")} <Arrow /></Link></div>
      </div>
      <aside className="founder-showcase-panel" aria-labelledby="founder-credentials-heading">
        <div className="founder-showcase-panel-top"><span className="founder-showcase-icon"><Icon name="person" /></span><div><p className="founder-showcase-kicker">{t("Meet your care provider")}</p><h3 id="founder-credentials-heading">{t("Practitioner credentials")}</h3></div></div>
        {credentials.length > 0 ? <div className="founder-showcase-education"><h4>{t("Qualifications & focus")}</h4><ul>{credentials.map(credential => <li key={credential}><span className="founder-showcase-credential-symbol"><Icon name="activity" /></span><span>{credentialLabels[credential] ? <>{t(credentialLabels[credential])} <span className="founder-showcase-abbreviation">({credential})</span></> : t(credential)}</span></li>)}</ul></div> : null}
        <div className="founder-showcase-expectations"><h4>{t("What you can expect")}</h4><ul>{carePromises.map(item => <li key={item.title}><span className="founder-showcase-check"><Icon name="check" /></span><div><strong>{t(item.title)}</strong><p>{t(item.text)}</p></div></li>)}</ul></div>
        <div className="founder-showcase-panel-footer"><span>{t("Let’s discuss your next step")}</span><Link className="founder-showcase-link" to={localPath("/contact")}>{t("Talk to us")} <Arrow /></Link></div>
      </aside>
    </div></section>
  )
}
