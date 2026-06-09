import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { applyColorMode, getStoredColorMode } from './lib/appearance'
import App from './App.tsx'

applyColorMode(getStoredColorMode())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
