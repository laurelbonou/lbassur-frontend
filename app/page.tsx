import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import OffresTabSection from "@/components/OffresTabSection";
import ExpertiseProcessSection from "@/components/ExpertiseProcessSection";
import ServicesSection from "@/components/ServicesSection";
import PartnersSection from "@/components/PartnersSection";
import StatsSection from "@/components/StatsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ActualitesSection from "@/components/ActualitesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-white min-h-screen text-black font-sans selection:bg-black/10 selection:text-black">
      <Navbar />
      <Hero />
      <AboutSection />
      <OffresTabSection />
      <ExpertiseProcessSection />
      <ServicesSection />
      <PartnersSection />
      <StatsSection />
      <TestimonialsSection />
      <ActualitesSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
