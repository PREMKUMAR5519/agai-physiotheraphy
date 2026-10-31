import { useEffect, useRef, useState } from 'react'
import { services } from '../content'
import { Icon } from './UI'

const options = [...services.map(service => ({ id: service.id as string, label: service.shortTitle as string, icon: service.icon })), { id: 'not-sure', label: 'Not sure yet / help me choose', icon: 'chat' as const }]

export default function ServiceSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const search = useRef({ text: '', time: 0 })
  const selected = options.find(option => option.id === value)

  useEffect(() => {
    if (!open) return
    function dismiss(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', dismiss)
    return () => document.removeEventListener('pointerdown', dismiss)
  }, [open])
  useEffect(() => {
    if (open) document.getElementById(`service-option-${active}`)?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  function show() {
    setActive(Math.max(0, options.findIndex(option => option.id === value)))
    setOpen(true)
  }
  function choose(index: number) {
    onChange(options[index].id)
    setOpen(false)
    trigger.current?.focus({ preventScroll: true })
  }

  return <div className="agai-field appointment-field-wide service-select" ref={root} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) }}>
    <label id="appointment-service-label" htmlFor="appointment-service">Service *</label>
    <button ref={trigger} type="button" id="appointment-service" className={`service-select-trigger${open ? ' is-open' : ''}`} role="combobox" aria-labelledby="appointment-service-label" aria-expanded={open} aria-controls="service-options" aria-haspopup="listbox" aria-required="true" aria-activedescendant={open ? `service-option-${active}` : undefined} onClick={() => open ? setOpen(false) : show()} onKeyDown={event => {
      if (event.key === 'Tab') { setOpen(false) }
      else if (event.key === 'Escape') { event.preventDefault(); setOpen(false) }
      else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        if (!open) show()
        else setActive(index => (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length)
      } else if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault(); setOpen(true); setActive(event.key === 'Home' ? 0 : options.length - 1)
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault(); if (open) choose(active); else show()
      } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault()
        const now = Date.now()
        search.current = { text: now - search.current.time < 700 ? search.current.text + event.key : event.key, time: now }
        const index = options.findIndex(option => option.label.toLowerCase().startsWith(search.current.text.toLowerCase()))
        if (index >= 0) { setOpen(true); setActive(index) }
      }
    }}>
      {selected ? <Icon name={selected.icon} /> : <Icon name="activity" />}
      <span className={selected ? '' : 'service-select-placeholder'}>{selected?.label || 'Select a service'}</span>
      <svg className="service-select-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m7 10 5 5 5-5" /></svg>
    </button>
    {open ? <div className="service-select-menu" id="service-options" role="listbox" aria-labelledby="appointment-service-label">{options.map((option, index) => <div key={option.id} id={`service-option-${index}`} role="option" aria-selected={value === option.id} className={`service-select-option${index === active ? ' is-active' : ''}${value === option.id ? ' is-selected' : ''}`} onPointerMove={() => setActive(index)} onPointerDown={event => event.preventDefault()} onClick={() => choose(index)}>
      <span className="service-option-icon"><Icon name={option.icon} /></span><span>{option.label}</span>{value === option.id ? <Icon name="check" /> : null}
    </div>)}</div> : null}
  </div>
}
