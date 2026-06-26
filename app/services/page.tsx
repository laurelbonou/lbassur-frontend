"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Activity, Heart, Briefcase, FileText, Anchor, Truck, Home, Car, TrendingDown, Users, AlertTriangle } from "lucide-react";

const categories = [
    { id: "dommages", label: "Dommages", icon: Shield },
    { id: "vie", label: "Vie", icon: Heart },
    { id: "credit", label: "Crédit Caution", icon: Briefcase },
];

const servicesData = {
    dommages: [
        { title: "Automobile", description: "Couverture des véhicules terrestres à moteur, remorques et semi-remorques.", icon: Car },
        { title: "Multirisque Habitation / Pro", description: "Bâtiments et contenu contre incendie, vol, bris de glace, dégâts des eaux...", icon: Home },
        { title: "Bris de Machine", description: "Couverture des machines à forte puissance contre erreurs de manutention, court-circuits...", icon: AlertTriangle },
        { title: "Perte d'Exploitation", description: "Perte de marge durant la cessation d'activité suite à un sinistre garanti.", icon: TrendingDown },
        { title: "RC Décennale", description: "Dommages d'effondrement sur 10 ans après réception définitive de l'ouvrage.", icon: Shield },
        { title: "RC Chef d'entreprise", description: "Dommages causés aux tiers en environnement professionnel.", icon: Briefcase },
        { title: "RC Chef de Famille", description: "Dommages causés aux tiers en environnement privé.", icon: Users },
        { title: "Assurance Transports", description: "Biens contre risques liés aux transports maritime, aérien, terrestre et fluvial.", icon: Anchor },
        { title: "Individuelle Accidents", description: "Frais médicaux, invalidité et décès découlant d'un accident.", icon: Activity },
        { title: "Violence Politique", description: "Dommages matériels et corporels en cas de soulèvement d'ordre politique.", icon: AlertTriangle },
        { title: "Tous Risques Montage", description: "Dommages matériels pendant la période de montage des matériaux.", icon: Shield },
        { title: "Assurance Voyage", description: "Frais de soins liés à maladie ou accident survenus hors du territoire national.", icon: Truck },
    ],
    vie: [
        { title: "Retraite Complémentaire", description: "Épargne destinée à compléter la pension octroyée par la CNSS ou la FNRB à la retraite.", icon: Heart },
        { title: "Prévoyance Décès", description: "Capital versé aux ayants droit désignés en cas de décès de l'assuré.", icon: Shield },
        { title: "Indemnité de Fin de Carrière", description: "Transfert et gestion des fonds de droits acquis pour optimiser la retraite.", icon: Briefcase },
        { title: "Assurance Frais Funéraires", description: "Capital versé en 72h pour la prise en charge des frais funéraires.", icon: Heart },
    ],
    credit: [
        { title: "Cautions sur marchés", description: "Caution de soumission, avance de démarrage, bonne fin d'exécution, retenue de garantie...", icon: FileText },
        { title: "Cautions commerciales", description: "Cautions fournisseur, douanières, fiscales, d'exploitation, locatives...", icon: FileText },
        { title: "Garanties indirectes", description: "Garantie financement de marché et bons de commande via les établissements bancaires.", icon: Briefcase },
    ]
};

export default function ServicesPage() {
    const [activeTab, setActiveTab] = useState("dommages");

    return (
        <main className="bg-white min-h-screen text-black overflow-hidden font-sans">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 px-6 overflow-hidden bg-gray-50 border-b border-black/5">
                <div className="container mx-auto max-w-7xl relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <span className="inline-block py-2 px-6 rounded-full text-[11px] uppercase tracking-widest text-gray-500 font-semibold mb-8">
                            Ce que nous faisons
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black mb-8">
                            Nos Services
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed font-light">
                            Des solutions d'assurance complètes pour particuliers, entreprises et institutions.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Tabs Section */}
            <section className="py-20 px-6 relative z-10 bg-white">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex flex-wrap justify-center gap-4 mb-16">
                        {categories.map((cat) => {
                            const Icon = cat.icon;
                            const isActive = activeTab === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveTab(cat.id)}
                                    className={`flex items-center gap-3 px-8 py-3 rounded-md text-[13px] font-semibold transition-all duration-300 ${
                                        isActive 
                                            ? "bg-black text-white shadow-sm" 
                                            : "bg-gray-50 border border-black/5 text-gray-500 hover:bg-gray-100 hover:text-black"
                                    }`}
                                >
                                    <Icon size={16} />
                                    {cat.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="min-h-[500px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {servicesData[activeTab as keyof typeof servicesData].map((service, idx) => (
                                    <div 
                                        key={idx} 
                                        className="bg-white border border-black/5 p-8 rounded-md hover:bg-gray-50 hover:border-black/10 transition-all duration-300 group"
                                    >
                                        <div className={`w-12 h-12 rounded-md bg-gray-50 border border-black/5 flex items-center justify-center mb-6 group-hover:bg-white transition-colors duration-300`}>
                                            <service.icon className="text-black" size={20} />
                                        </div>
                                        <h3 className="text-lg font-bold text-black mb-3 tracking-tight">
                                            {service.title}
                                        </h3>
                                        <p className="text-gray-500 font-light leading-relaxed text-sm">
                                            {service.description}
                                        </p>
                                    </div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
