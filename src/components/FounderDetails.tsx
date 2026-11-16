import { clinic, founderContent } from '../content'

export default function FounderDetails() {
  return <div className="founder-details">
    <div className="founder-identity"><h3>{clinic.founder}</h3><p>{founderContent.role}</p></div>
    <p className="founder-credentials">{founderContent.credentials}</p>
  </div>
}
