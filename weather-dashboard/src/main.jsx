import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'



createRoot(document.getElementById('root')).render(
  <>
    <meta
      name="referrer"
      content="strict-origin-when-cross-origin"
    />
    <StrictMode>
      <App />
    </StrictMode>
  </>,
)
