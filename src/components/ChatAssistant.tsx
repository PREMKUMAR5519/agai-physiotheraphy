import { useEffect, useRef, useState } from 'react'
import type { SubmitEvent } from 'react'
import { Link } from 'react-router'
import { Arrow, Icon } from './UI'
import { getChatReply } from './chatReplies'
import type { ChatReply } from './chatReplies'
import './ChatAssistant.css'
import ChatBotMascot from './ChatBotMascot'

type Message = ChatReply & { id: number; role: 'user' | 'assistant' }
const shortcuts = [
  { label: 'Book a visit', question: 'How do I book an appointment?', icon: 'clock' as const, detail: 'Find your next step' },
  { label: 'Explore care', question: 'What services do you offer?', icon: 'activity' as const, detail: 'Care for your movement' },
  { label: 'Find the clinic', question: 'Where is the clinic?', icon: 'pin' as const, detail: 'Directions & location' },
  { label: 'Talk to the team', question: 'Contact the clinic team', icon: 'chat' as const, detail: 'Continue on WhatsApp' },
]

export default function ChatAssistant() {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const nextId = useRef(0)
  const launcher = useRef<HTMLButtonElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const conversation = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLElement>(null)

  useEffect(() => {
    if (open) input.current?.focus({ preventScroll: true })
  }, [open])
  useEffect(() => {
    const element = conversation.current
    if (element) element.scrollTop = messages.length ? element.scrollHeight : 0
  }, [messages, open])
  useEffect(() => {
    if (!open) return
    function escape(event: KeyboardEvent) {
      if (event.key === 'Escape') { setOpen(false); requestAnimationFrame(() => launcher.current?.focus()) }
    }
    document.addEventListener('keydown', escape)
    return () => document.removeEventListener('keydown', escape)
  }, [open])

  function close(restoreFocus = true) {
    setOpen(false)
    if (restoreFocus) requestAnimationFrame(() => launcher.current?.focus())
  }
  function send(text: string) {
    const message = text.trim().slice(0, 300)
    if (!message) return
    const user: Message = { id: nextId.current++, role: 'user', text: message }
    const reply: Message = { id: nextId.current++, role: 'assistant', ...getChatReply(message) }
    setMessages(current => [...current.slice(-38), user, reply])
    setDraft('')
    input.current?.focus({ preventScroll: true })
  }
  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    send(draft)
  }

  return <div className="care-chat">
    {!open ? <ChatBotMascot /> : null}
    {open ? <section ref={panel} className="care-chat-panel" id="care-chat-panel" role="dialog" aria-labelledby="care-chat-title">
      <header className="care-chat-header">
        <span className="care-chat-avatar" aria-hidden="true"><Icon name="chat" /></span>
        <div><h2 id="care-chat-title">AGAI care guide</h2><p>Automated clinic assistant</p></div>
        <div className="care-chat-controls">
          <button type="button" className="care-chat-icon-button" aria-label="Start a new chat" title="Start a new chat" disabled={!messages.length} onClick={() => { setMessages([]); setDraft(''); input.current?.focus() }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 10a8 8 0 1 1 1 7M4 4v6h6" /></svg></button>
          <button type="button" className="care-chat-icon-button" aria-label="Close chat" onClick={() => close()}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg></button>
        </div>
      </header>
      <div className="care-chat-body" ref={conversation}>
        {messages.length === 0 ? <div className="care-chat-welcome">
          <span className="care-chat-eyebrow">A little help, right here</span>
          <h3>Let’s find your<br /><span>next step.</span></h3>
          <p>Questions about care or your first visit? Start here.</p>
          <div className="care-chat-shortcuts">{shortcuts.map(shortcut => <button key={shortcut.label} type="button" onClick={() => send(shortcut.question)}><Icon name={shortcut.icon} /><strong>{shortcut.label}</strong><span>{shortcut.detail}</span><Arrow diagonal /></button>)}</div>
          <div className="care-chat-note"><Icon name="shield" /><p>Clinic information and booking guidance. For personal care advice, speak with our team.</p></div>
        </div> : null}
        <div className="care-chat-messages" role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions">
          {messages.map(message => <div key={message.id} className={`care-chat-message care-chat-message--${message.role}`}>
            <span className="care-chat-message-label">{message.role === 'user' ? 'You' : 'AGAI guide'}</span>
            <div className="care-chat-bubble"><p>{message.text}</p>{message.actions ? <div className="care-chat-actions">{message.actions.map(action => action.href.startsWith('/') ? <Link key={action.label} to={action.href} onClick={() => close(false)}>{action.label}<Arrow diagonal /></Link> : <a key={action.label} href={action.href} target={action.href.startsWith('https:') ? '_blank' : undefined} rel={action.href.startsWith('https:') ? 'noreferrer' : undefined}>{action.label}<Arrow diagonal /></a>)}</div> : null}</div>
          </div>)}
        </div>
      </div>
      {messages.length > 0 ? <div className="care-chat-suggestions" aria-label="Suggested questions"><button type="button" onClick={() => send('How do I book an appointment?')}>Book a visit</button><button type="button" onClick={() => send('What services do you offer?')}>Services</button><button type="button" onClick={() => send('Contact the clinic team')}>Talk to the team</button></div> : null}
      <footer className="care-chat-footer">
        <form className="care-chat-composer" onSubmit={submit}>
          <label className="visually-hidden" htmlFor="care-chat-input">Your question</label>
          <input ref={input} id="care-chat-input" value={draft} onChange={event => setDraft(event.target.value)} placeholder="Ask about AGAI…" maxLength={300} autoComplete="off" />
          <button type="submit" disabled={!draft.trim()} aria-label="Send message"><Arrow /></button>
        </form>
        <p>Automated guidance · Chat stays in this tab</p>
      </footer>
    </section> : null}
    <button ref={launcher} type="button" className={`care-chat-launcher${open ? ' is-open' : ''}`} aria-expanded={open} aria-controls="care-chat-panel" aria-label={open ? 'Close AGAI chat' : 'Open AGAI chat'} onClick={() => open ? close() : setOpen(true)}><span className="care-chat-launcher-icon"><Icon name="chat" /></span><span>Ask AGAI<span className="care-chat-launcher-caption">Here to guide you</span></span><span className="care-chat-launcher-arrow" aria-hidden="true"><Arrow diagonal /></span></button>
  </div>
}
