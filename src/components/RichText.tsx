import { createElement, Fragment, type ReactNode, type CSSProperties } from 'react'
import './RichText.css'

export type RichNode = {
  type: string
  text?: string
  attrs?: { level?: number; textAlign?: string; href?: string; start?: number }
  marks?: RichNode[]
  content?: RichNode[]
}

function safeLink(href: unknown): href is string {
  if (typeof href !== 'string' || href.length > 2000 || /[\s\u0000-\u001f]/.test(href)) return false
  try { return ['https:', 'http:', 'mailto:'].includes(new URL(href).protocol) } catch { return false }
}

// Render only supported elements and attributes, never raw HTML from the API.
export default function RichText({ body }: { body: RichNode }) {
  function render(node: RichNode, key: string, depth = 0): ReactNode {
    if (!node || depth > 12) return null
    if (node.type === 'text') {
      let text: ReactNode = node.text
      for (const mark of node.marks || []) {
        const tag = ({ bold: 'strong', italic: 'em', underline: 'u', strike: 's' } as Record<string, string>)[mark.type]
        if (tag) text = createElement(tag, null, text)
        else if (mark.type === 'link' && safeLink(mark.attrs?.href)) text = <a href={mark.attrs.href} target="_blank" rel="noopener noreferrer">{text}</a>
      }
      return <Fragment key={key}>{text}</Fragment>
    }
    const tags: Record<string, string> = { doc: 'div', paragraph: 'p', heading: `h${[2, 3, 4].includes(node.attrs?.level || 0) ? node.attrs?.level : 2}`, bulletList: 'ul', orderedList: 'ol', listItem: 'li', blockquote: 'blockquote', hardBreak: 'br', horizontalRule: 'hr' }
    const tag = tags[node.type]
    if (!tag) return null
    const props: { key: string; id?: string; style?: CSSProperties; start?: number } = { key }
    if (node.type === 'heading') props.id = `heading-${key}`
    if (['left', 'center', 'right', 'justify'].includes(node.attrs?.textAlign || '')) props.style = { textAlign: node.attrs?.textAlign as CSSProperties['textAlign'] }
    if (node.type === 'orderedList') props.start = node.attrs?.start || 1
    return createElement(tag, props, ...((node.content || []).map((child, index) => render(child, `${key}-${index}`, depth + 1))))
  }
  return <div className="rich-text">{render(body, 'body')}</div>
}
