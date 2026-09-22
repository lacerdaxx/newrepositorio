import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProblemSection from "./components/ProblemSection";
import TransformationSection from "./components/TransformationSection";
import Features from "./components/Features";
import Audience from "./components/Audience";
import Benefits from "./components/Benefits";
import Demo from "./components/Demo";
import Offer from "./components/Offer";
import Bonuses from "./components/Bonuses";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";
import MobileStickyCTA from "./components/MobileStickyCTA";

export default function App() {
  return (
    <div className="overflow-x-hidden bg-ink-950 pb-20 lg:pb-0">
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <TransformationSection />
        <Features />
        <Audience />
        <Benefits />
        <Demo />
        <Offer />
        <Bonuses />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <MobileStickyCTA />
    </div>
  );
}
