import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Pain from "@/components/Pain";
import HowItWorks from "@/components/HowItWorks";
import Included from "@/components/Included";
import TheMath from "@/components/TheMath";
import Testimonials from "@/components/Testimonials";
import ForWho from "@/components/ForWho";
import DiagnosticForm from "@/components/DiagnosticForm";
import Faq from "@/components/Faq";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { BarsDivider } from "@/components/ui/GrowthBars";
import { getLogoSrc } from "@/lib/logo";

export default function Home() {
  const logoSrc = getLogoSrc("header");
  const footerLogoSrc = getLogoSrc("footer");
  return (
    <>
      <Header logoSrc={logoSrc} />
      <main>
        <Hero />
        <Marquee />
        <Pain />
        <BarsDivider />
        <HowItWorks />
        <Included />
        <BarsDivider />
        <TheMath />
        <Testimonials />
        <BarsDivider />
        <ForWho />
        <DiagnosticForm />
        <Faq />
        <FinalCta />
      </main>
      <Footer logoSrc={footerLogoSrc} />
      <WhatsAppFloat />
    </>
  );
}
