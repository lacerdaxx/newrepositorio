import { useEffect, useRef } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Offers from './components/Offers'
import Showroom from './components/Showroom'
import LeadForm from './components/LeadForm'
import Footer from './components/Footer'
import { initMotion } from './lib/motion'

export default function App() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!root.current) return
    return initMotion(root.current)
  }, [])

  return (
    <div ref={root}>
      <a href="#ofertas" className="skip-link">Ir para o conteúdo</a>
      <Header />
      <main>
        <Hero />
        <Offers />
        <Showroom />
        <LeadForm />
      </main>
      <Footer />
    </div>
  )
}
