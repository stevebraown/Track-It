import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const APP_VERSION = __APP_VERSION__
const VERSION_STORAGE_KEY = 'trackit_app_version'

const ensureLatestVersion = () => {
  try {
    const storedVersion = localStorage.getItem(VERSION_STORAGE_KEY)
    if (storedVersion && storedVersion !== APP_VERSION) {
      localStorage.setItem(VERSION_STORAGE_KEY, APP_VERSION)
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => registration.unregister())
        }).finally(() => {
          window.location.reload()
        })
        return
      }
      window.location.reload()
      return
    }
    if (!storedVersion) {
      localStorage.setItem(VERSION_STORAGE_KEY, APP_VERSION)
    }
  } catch (error) {
    console.warn('Version check failed:', error)
  }
}

ensureLatestVersion()

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration.scope)
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error)
      })
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
