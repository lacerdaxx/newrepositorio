import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Offers } from './components/Offers'
import { Showroom } from './components/Showroom'
import { LeadForm } from './components/LeadForm'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <>
      <a href="#ofertas" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-ember focus:px-4 focus:py-2 focus:text-ink">
        Ir para o conteúdo
      </a>
      <Header />
      <main>
        <Hero />
        <Offers />
        <Showroom />
        <LeadForm />
      </main>
      <Footer />
    </>
  )
}
