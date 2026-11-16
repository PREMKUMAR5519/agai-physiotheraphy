import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
// Prerendered content must remain styled while the published snapshot loads.
import './App.css'
import './pages/BlogsPage.css'
import { loadPublishedContent } from './cms'

async function start() {
  const root = document.getElementById('root')!
  root.setAttribute('aria-busy', 'true')
  if (!root.hasChildNodes()) {
    const loading = document.createElement('p')
    loading.setAttribute('role', 'status')
    loading.textContent = 'Loading website…'
    root.appendChild(loading)
  }
  const contentChanged = await loadPublishedContent()
  const [{ default: App }, { normalizePath }] = await Promise.all([import('./App.tsx'), import('./meta.ts')])
  root.setAttribute('aria-busy', 'false')
  const app = (
    <StrictMode>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </StrictMode>
  )

// Hydrate only when the static HTML was prerendered for exactly this URL.
// Query strings change what a page shows (filters, preselected service), and a
// host may serve the 404 page or a fallback page here, so render fresh then.
  if (!contentChanged && root.dataset.prerendered === normalizePath(location.pathname) && !location.search) hydrateRoot(root, app)
  else createRoot(root).render(app)
}
void start()
