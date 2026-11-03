import type { ReactNode } from 'react'
import { Breadcrumb, Eyebrow } from './UI'

export default function PageIntro({ label, lead, accent, description, metric, metricCaption }: {
  label: string
  lead: string
  accent: string
  description: string
  metric?: ReactNode
  metricCaption?: ReactNode
}) {
  return <>
    <div className="breadcrumb-bar"><div className="agai-container"><Breadcrumb current={label} /></div></div>
    <section className="page-intro"><div className="agai-container"><div className="page-intro-layout">
      <div><Eyebrow>{label}</Eyebrow><h1 className="page-title"><span className="page-title-lead">{lead}</span><br /><span>{accent}</span></h1><p>{description}</p></div>
      {metric != null ? <div className="services-index page-intro-index"><span>{metric}</span><p>{metricCaption}</p></div> : null}
    </div></div></section>
  </>
}
