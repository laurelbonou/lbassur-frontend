import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ExpertiseSection from "@/components/ExpertiseSection";
import AboutSection from "@/components/AboutSection";
import OffresParticuliersSection from "@/components/OffresParticuliersSection";
import OffresEntreprisesSection from "@/components/OffresEntreprisesSection";
import ServicesSection from "@/components/ServicesSection";
import ProcessSection from "@/components/ProcessSection";
import PartnersSection from "@/components/PartnersSection";
import StatsSection from "@/components/StatsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ActualitesSection from "@/components/ActualitesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-black min-h-screen text-white font-sans selection:bg-white/20 selection:text-white">
      <Navbar />
      <Hero />
      <ExpertiseSection />
      <AboutSection />
      <OffresParticuliersSection />
      <OffresEntreprisesSection />
      <ServicesSection />
      <ProcessSection />
      <PartnersSection />
      <StatsSection />
      <TestimonialsSection />
      <ActualitesSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
