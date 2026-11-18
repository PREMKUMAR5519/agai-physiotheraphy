import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, fileURLToPath(new URL('.', import.meta.url)), '')
  const cmsUrl = process.env.CMS_API_URL || env.CMS_API_URL || process.env.VITE_CMS_API_URL || env.VITE_CMS_API_URL || ''
  return {
    plugins: [react()],
    // Prerendering includes every route's styles in the initial HTML. Avoid
    // discovering component CSS only after the CMS request and App import.
    build: { cssCodeSplit: false },
    // Expose only the public CMS URL, never the rest of the server environment.
    define: { 'import.meta.env.VITE_CMS_API_URL': JSON.stringify(cmsUrl) },
  }
})
