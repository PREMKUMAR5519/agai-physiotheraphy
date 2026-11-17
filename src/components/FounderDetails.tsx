import { useLanguage } from '../language'
import { clinic, founderContent } from '../content'

export default function FounderDetails() {
  const { t } = useLanguage()
  const credentials = founderContent.credentials.split(/[,·]/).map(value => value.trim()).filter(Boolean)
  return <div className="founder-details">
    <div className="founder-identity"><h3>{clinic.founder}</h3><p>{t(founderContent.role)}</p><ul className="founder-credential-badges" aria-label={t("Qualifications")}>{credentials.map(value => <li key={value}>{t(value)}</li>)}</ul></div>
  </div>
}
