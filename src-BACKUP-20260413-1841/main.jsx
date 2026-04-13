import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.jsx'
import { ErrorBoundary } from './components/UI/ErrorBoundary.jsx'
import { bootstrapPublicMeta } from './utils/bootstrapPublicMeta.js'
import { initAnalytics } from './utils/analytics.js'

bootstrapPublicMeta()
initAnalytics()

registerSW({ immediate: true })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
