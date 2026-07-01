import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// Registrar Service Worker para soporte PWA (instalación en celular)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registrado con éxito:', reg.scope))
      .catch(err => console.error('Error al registrar Service Worker:', err));
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
)
