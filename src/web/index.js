import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// Append meta
const metaElement = document.createElement('meta')
metaElement.name = 'viewport'
metaElement.content = 'width=device-width,initial-scale=1.0, maximum-scale=1.0'
document.head.appendChild(metaElement)

// Append div id app
const rootElement = document.createElement('div')
rootElement.id = 'app'
document.body.appendChild(rootElement)

// Render your React component instead
const root = createRoot(document.getElementById('app'))
root.render(<App />)
