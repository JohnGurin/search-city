import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './App'
import './main.css'
import 'virtual:uno.css'
import './url'


if (!import.meta.env.PROD) {
  await import('@welldone-software/why-did-you-render').then(module => {
    module.default(React, { trackAllPureComponents: true })
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
