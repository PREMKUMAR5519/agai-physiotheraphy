import { StrictMode, useLayoutEffect } from 'react'
import type { ReactNode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
// Prerendered content must remain styled while the published snapshot loads.
import './App.css'
import './pages/BlogsPage.css'
import { loadPublishedContent } from './cms'

const root = document.getElementById('root')!
const loadingScreen = document.getElementById('startup-screen')!

function showStartupError(error: unknown) {
  console.error('Website startup failed.', error)
  root.setAttribute('aria-busy', 'false')
  root.hidden = true
  loadingScreen.hidden = false
  loadingScreen.dataset.error = 'true'
  loadingScreen.setAttribute('role', 'alert')
  const content = document.createElement('div')
  const heading = document.createElement('h1')
  heading.textContent = 'Unable to load the page'
  const message = document.createElement('p')
  message.textContent = 'Please check your connection and try again.'
  const retry = document.createElement('button')
  retry.type = 'button'
  retry.textContent = 'Try again'
  retry.addEventListener('click', () => window.location.reload())
  content.append(heading, message, retry)
  loadingScreen.replaceChildren(content)
  retry.focus()
}

function Ready({ children }: { children: ReactNode }) {
  useLayoutEffect(() => {
    root.setAttribute('aria-busy', 'false')
    loadingScreen.hidden = true
  }, [])
  return children
}

async function start() {
  root.setAttribute('aria-busy', 'true')
  const contentChanged = await loadPublishedContent()
  let timeout: ReturnType<typeof setTimeout> | undefined
  const [{ default: App }, { normalizePath }] = await Promise.race([
    Promise.all([import('./App.tsx'), import('./meta.ts')]),
    new Promise<never>((_, reject) => { timeout = setTimeout(() => reject(new Error('Page loading timed out')), 15_000) }),
  ]).finally(() => clearTimeout(timeout))
  const app = (
    <StrictMode>
      <Ready>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
      </Ready>
    </StrictMode>
  )

// Hydrate only when the static HTML was prerendered for exactly this URL.
// Query strings change what a page shows (filters, preselected service), and a
// host may serve the 404 page or a fallback page here, so render fresh then.
  if (!contentChanged && root.dataset.prerendered === normalizePath(location.pathname) && !location.search) hydrateRoot(root, app, { onUncaughtError: showStartupError })
  else createRoot(root, { onUncaughtError: showStartupError }).render(app)
}
void start().catch(showStartupError)
