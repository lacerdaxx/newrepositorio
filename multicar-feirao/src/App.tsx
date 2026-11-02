import { useScrollFx } from './hooks/useScrollFx'
import { Header } from './components/sections/Header'
import { Hero } from './components/sections/Hero'
import { Countdown } from './components/sections/Countdown'
import { Offers } from './components/sections/Offers'
import { Showroom } from './components/sections/Showroom'
import { LeadForm } from './components/sections/LeadForm'
import { FinalCta } from './components/sections/FinalCta'
import { Footer } from './components/sections/Footer'

export default function App() {
  useScrollFx()
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Countdown />
        <Offers />
        <Showroom />
        <LeadForm />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
