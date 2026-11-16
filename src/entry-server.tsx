// Build-time only: prerender.js uses this bundle to write static HTML for each route.
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from './App.tsx'

export { getPageMeta, prerenderPaths, socialImage, structuredData } from './meta.ts'

export function render(path: string) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={path} basename={import.meta.env.BASE_URL}>
        <App />
      </StaticRouter>
    </StrictMode>,
  )
}
