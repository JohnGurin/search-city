import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './App'
import './main.css'
import 'virtual:uno.css'
import { update_url_search_param } from './url'
import { state } from '#/init'


if (!import.meta.env.PROD) {
  await import('@welldone-software/why-did-you-render').then(module => {
    module.default(React, { trackAllPureComponents: true })
  })
}

state.query.subscribe(update_url_search_param)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
