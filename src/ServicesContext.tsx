import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { services as initialServices } from './content'
import { contentEndpoint } from './cms-contract'
import { parseServices, type Service } from './services-api'

type ServicesState = { services: readonly Service[]; loading: boolean; error: string; refresh: () => Promise<void> }
const ServicesContext = createContext<ServicesState | null>(null)

export function ServicesProvider({ children }: { children: ReactNode }) {
  // Snapshot data is identical during SSR and hydration, and remains visible on slow connections.
  const [services, setServices] = useState<readonly Service[]>(initialServices)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const active = useRef<AbortController | null>(null)
  const refresh = useCallback(async () => {
    active.current?.abort()
    const controller = new AbortController()
    active.current = controller
    setLoading(true); setError('')
    try {
      const contentUrl = contentEndpoint(import.meta.env.VITE_CMS_API_URL)
      if (!contentUrl) return
      const endpoint = contentUrl.replace(/\/content$/, '/services')
      const response = await fetch(endpoint, { credentials: 'omit', cache: 'no-store', signal: AbortSignal.any([controller.signal, AbortSignal.timeout(8000)]) })
      if (!response.ok) throw new Error(`Services returned ${response.status}`)
      const data = parseServices(await response.json(), endpoint)
      if (!controller.signal.aborted) setServices(data)
    } catch {
      if (!controller.signal.aborted) setError('We could not refresh services. Showing the last available information.')
    } finally {
      if (!controller.signal.aborted) setLoading(false)
    }
  }, [])
  useEffect(() => { void refresh(); return () => active.current?.abort() }, [refresh])
  const value = useMemo(() => ({ services, loading, error, refresh }), [services, loading, error, refresh])
  return <ServicesContext.Provider value={value}>{children}</ServicesContext.Provider>
}
export function useServices() {
  const value = useContext(ServicesContext)
  if (!value) throw new Error('useServices must be inside ServicesProvider')
  return value
}
export function ServicesStatus() {
  const { loading, error, refresh } = useServices()
  if (loading) return <p role="status" className="services-status">Updating services…</p>
  if (error) return <div className="services-status" role="status"><p>{error}</p><button type="button" className="text-action" onClick={() => void refresh()}>Retry loading services</button></div>
  return null
}
