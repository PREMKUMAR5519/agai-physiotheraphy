import { useLanguage } from './language'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { services as initialServices } from './content'
import { contentEndpoint } from './cms-contract'
import { parseServices, type Service } from './services-api'
import { publicData } from './public-data-cache'

type ServicesState = { services: readonly Service[]; loading: boolean; error: string; refresh: () => Promise<void> }
const ServicesContext = createContext<ServicesState | null>(null)

export function ServicesProvider({ children }: { children: ReactNode }) {
  // Snapshot data is identical during SSR and hydration, and remains visible on slow connections.
  const [services, setServices] = useState<readonly Service[]>(initialServices)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const active = useRef<AbortController | null>(null)
  const refresh = useCallback(async (force = true) => {
    active.current?.abort()
    const controller = new AbortController()
    active.current = controller
    setLoading(true); setError('')
    try {
      const contentUrl = contentEndpoint(import.meta.env.VITE_CMS_API_URL)
      if (!contentUrl) return
      const endpoint = contentUrl.replace(/\/content$/, '/services')
      const data = await publicData(endpoint, parseServices, { force, timeout: 8000 })
      if (!controller.signal.aborted) setServices(data)
    } catch {
      if (!controller.signal.aborted) setError('We could not refresh services. Showing the last available information.')
    } finally {
      if (!controller.signal.aborted) setLoading(false)
    }
  }, [])
  useEffect(() => { void refresh(false); return () => active.current?.abort() }, [refresh])
  const value = useMemo(() => ({ services, loading, error, refresh }), [services, loading, error, refresh])
  return <ServicesContext.Provider value={value}>{children}</ServicesContext.Provider>
}
export function useServices() {
  const value = useContext(ServicesContext)
  if (!value) throw new Error('useServices must be inside ServicesProvider')
  return value
}
export function ServicesStatus() {
  const { t } = useLanguage()
  const { loading, error, refresh } = useServices()
  if (loading) return <p role="status" className="services-status">{t('Updating services…')}</p>
  if (error) return <div className="services-status" role="status"><p>{t(error)}</p><button type="button" className="text-action" onClick={() => void refresh()}>{t('Retry loading services')}</button></div>
  return null
}
