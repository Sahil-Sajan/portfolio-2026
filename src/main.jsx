import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Error404 from './pages/Error404.jsx'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(ScrollTrigger, CustomEase)

const is404 = window.location.pathname !== '/' && window.location.pathname !== ''

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {is404 ? <Error404 /> : <App />}
  </StrictMode>,
)
