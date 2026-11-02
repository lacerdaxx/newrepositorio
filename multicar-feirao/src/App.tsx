import { useEffect } from 'react'
import { ScrollTrigger } from './lib/gsap'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Offers } from './components/Offers'
import { Showroom } from './components/Showroom'
import { Lead } from './components/Lead'
import { Footer } from './components/Footer'

export default function App() {
  useEffect(() => {
    // recalcula pins/parallax quando fontes e imagens terminam de carregar
    const r = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(r)
    window.addEventListener('load', r)
    return () => window.removeEventListener('load', r)
  }, [])
  return (
    <>
      <a href="#cadastro" className="skip">Ir para o cadastro</a>
      <Header />
      <main>
        <Hero />
        <Offers />
        <Showroom />
        <Lead />
      </main>
      <Footer />
    </>
  )
}
