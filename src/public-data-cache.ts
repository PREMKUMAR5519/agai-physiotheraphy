// Only public CMS content belongs here; never store enquiries or personal data.
const TTL = 60_000
const PREFIX = 'agai:public:v1:'
const pending = new Map<string, Promise<unknown>>()

export async function publicData<T>(endpoint: string, parse: (value: unknown, endpoint: string) => T,
  { force = false, timeout = 4000 }: { force?: boolean; timeout?: number } = {}): Promise<T> {
  const key = PREFIX + endpoint
  if (!force) {
    try {
      const cached = JSON.parse(localStorage.getItem(key) || 'null')
      const age = Date.now() - cached?.savedAt
      if (age >= 0 && age < TTL) return parse(cached.data, endpoint)
    } catch { /* Storage can be unavailable, full, or contain an older schema. */ }
  }
  let request = pending.get(endpoint)
  if (!request) {
    request = (async () => {
      const response = await fetch(endpoint, { credentials: 'omit', cache: 'no-cache', signal: AbortSignal.timeout(timeout) })
      if (!response.ok) throw new Error(`Public content returned ${response.status}`)
      const data: unknown = await response.json()
      parse(data, endpoint) // Never cache malformed responses.
      try { localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), data })) } catch { /* Network data still works without storage. */ }
      return data
    })()
    pending.set(endpoint, request)
    // Both success and failure remove the shared request without an unhandled rejection.
    void request.then(() => pending.delete(endpoint), () => pending.delete(endpoint))
  }
  return parse(await request, endpoint)
}
