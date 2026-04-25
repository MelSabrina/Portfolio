import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Cursor — desktop only
if (!window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
  const cursorEl = document.getElementById('cursor')!
  document.addEventListener('mousemove', e => {
    cursorEl.style.left = e.clientX + 'px'
    cursorEl.style.top  = e.clientY + 'px'
  })
  document.addEventListener('mousedown', () => cursorEl.classList.add('pressed'),    true)
  document.addEventListener('mouseup',   () => cursorEl.classList.remove('pressed'), true)
}

// Theme — default dark
const saved = localStorage.getItem('mel-theme') as 'dark' | 'light' | null
const theme = saved ?? 'dark'
document.documentElement.classList.toggle('dark', theme === 'dark')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
