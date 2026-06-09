"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { CheckCircle2, Target, Heart, Award, Lightbulb, Map, Star, ShieldCheck, Zap } from "lucide-react";

const values = [
    {
        title: "L'EXCELLENCE",
        description: "Engagement permanent à faire vivre à nos clients les meilleures expériences, soutenue par des processus internes d'amélioration continue.",
        icon: Award,
        bgClass: "bg-blue-500/10",
        textClass: "text-blue-400"
    },
    {
        title: "Le PROFESSIONNALISME",
        description: "Experts et talents, dotés du savoir-faire technique et des qualités personnelles, répondant aux standards très élevés de qualité de service.",
        icon: Target,
        bgClass: "bg-blue-500/10",
        textClass: "text-blue-400"
    },
    {
        title: "L'INTÉGRITÉ",
        description: "Honnêteté et respect des intérêts de nos clients, ainsi que des engagements pris envers toutes les parties prenantes.",
        icon: ShieldCheck,
        bgClass: "bg-slate-500/10",
        textClass: "text-slate-400"
    },
    {
        title: "L'INNOVATION",
        description: "L'innovation guide nos décisions pour créer de la valeur tout en étant compétitif et en optimisant les coûts.",
        icon: Lightbulb,
        bgClass: "bg-sky-500/10",
        textClass: "text-sky-400"
    }
];

const missions = [
    "Audit et revues de vos engagements contractuels",
    "Audit de vos polices d'assurances",
    "Cartographie de vos risques opérationnels et stratégiques",
    "Plan de Prévention",
    "Plan de Gestion de Crise",
    "Plan de Reprise d'activités",
    "Risk Management",
    "Placement rationnel de vos programmes d'assurances",
    "Modèles alternatifs de transferts de risques : auto assurances, captives, Fonds de Roulement",
    "Coassurance et Réassurance",
    "Conseils, Pilotage et Coordination Internationale",
    "Gestion de la Fraude",
    "Outils, Reporting et Data Analytics",
    "Veille assurantielle et règlementaire"
];

export default function AboutPage() {
    return (
        <main className="bg-black min-h-screen text-white overflow-hidden">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-500/[0.03] rounded-full blur-[120px] -z-0"></div>
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/[0.03] rounded-full blur-[100px] -z-0"></div>
                
                <div className="container mx-auto max-w-7xl relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <span className="glass inline-block py-2 px-6 rounded-full text-[10px] uppercase tracking-[0.4em] text-blue-400 font-bold mb-8">
                            Notre Vision
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter font-oswald text-white mb-8">
                            Leader Africain <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-sky-400">du Courtage</span>
                        </h1>
                        <p className="text-gray-400 text-lg leading-relaxed font-light">
                            À l'instar des groupes bancaires, industriels et d'autres secteurs d'activités qui font la fierté du continent africain, nous avons l'ambition de devenir le leader africain du courtage en assurances.
                        </p>
                    </motion.div>
                </div>
            </section>



            {/* Values Section */}
            <section className="py-24 px-6 relative">
                <div className="container mx-auto max-w-7xl">
                    <div className="text-center mb-16">
                        <span className="text-blue-500 text-sm font-bold tracking-[0.2em] uppercase mb-4 block">Notre ADN</span>
                        <h2 className="text-4xl md:text-5xl font-bold uppercase font-oswald tracking-tighter">Nos Valeurs</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {values.map((val, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                                className="glass p-10 flex gap-6 items-start group hover:bg-white/[0.05] transition-colors"
                            >
                                <div className={`w-14 h-14 shrink-0 rounded-xl ${val.bgClass} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                                    <val.icon className={val.textClass} size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-3 tracking-wide">{val.title}</h3>
                                    <p className="text-gray-400 font-light leading-relaxed">{val.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Missions Section */}
            <section className="py-24 px-6 relative bg-zinc-950/50 border-t border-white/5">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold uppercase font-oswald tracking-tighter mb-4">Nos Missions</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">Une expertise complète pour vous accompagner dans la gestion et le transfert de vos risques.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {missions.map((mission, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: idx * 0.05 }}
                                viewport={{ once: true }}
                                className="flex items-start gap-3 p-4 bg-black border border-white/5 hover:border-blue-500/30 transition-colors rounded-lg"
                            >
                                <CheckCircle2 className="text-blue-500 shrink-0 mt-0.5" size={18} />
                                <span className="text-gray-300 text-sm font-light leading-snug">{mission}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
