import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import GridSection from "@/components/GridSection";
import ComparisonHomeSection from "@/components/ComparisonHomeSection";
import PartnersSection from "@/components/PartnersSection";
import ProcessSection from "@/components/ProcessSection";
import StatsSection from "@/components/StatsSection";
import FeatureSection from "@/components/FeatureSection";
import ItojuPromo from "@/components/ItojuPromo";
import GlossarySection from "@/components/GlossarySection";
import BookingSection from "@/components/BookingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-black min-h-screen text-white">
      <Navbar />
      <Hero />
      <GridSection />
      <ComparisonHomeSection />
      <PartnersSection />
      <ProcessSection />
      <StatsSection />

      <div id="services">
        <FeatureSection
          title="L'Audit"
          subtitle="Analyse & Expertise"
          description="Étude approfondie de vos risques et de vos contrats en cours pour identifier clairement les éventuels vides ou insuffisances de couverture. Nous garantissons une analyse précise pour une protection optimale."
          backgroundClass="bg-gradient-to-br from-blue-900 via-indigo-950 to-black"
          align="left"
          href="/services#audit"
        />
        <FeatureSection
          title="L'Assurance"
          subtitle="Solutions Sur Mesure"
          description="Nous offrons un panorama représentatif des meilleurs contrats du marché, sélectionnés par nos soins pour tous types de risques. Simplifiez votre processus d'assurance avec nos solutions adaptées."
          backgroundClass="bg-gradient-to-tr from-slate-900 via-blue-950 to-black"
          align="right"
          href="/services#assurance"
        />
        <FeatureSection
          title="Conseil & Accompagnement"
          subtitle="Support Continu"
          description="LBASSUR et son équipe vous apportent conseil, écoute et accompagnement durant toute la durée de votre contrat. Une réelle prise en compte de chaque assuré pour suivre l'évolution des risques."
          backgroundClass="bg-gradient-to-bl from-blue-950 via-slate-900 to-black"
          align="left"
          href="/services#conseil"
        />
        <FeatureSection
          title="Indemnisation Rapide"
          subtitle="Engagement Qualité"
          description="En cas de sinistre, comptez sur nous pour une indemnisation rapide et équitable. Nous prenons en charge toutes les démarches administratives pour garantir votre tranquillité d'esprit."
          backgroundClass="bg-gradient-to-tl from-slate-900 via-gray-900 to-black"
          align="right"
          href="/services#indemnisation"
        />
      </div>

      <ItojuPromo />

      <GlossarySection />
      <BookingSection />
      <TestimonialsSection />
      <Footer />
    </main>
  );
}
