"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Briefcase, ChevronRight, FileText, Send, ChevronDown } from "lucide-react";
import Link from "next/link";

function CustomSelect({ options, defaultLabel }: { options: string[], defaultLabel: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(defaultLabel);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={ref} className="relative min-w-[200px]">
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className="bg-black/50 border border-white/10 rounded-xl py-4 px-6 text-white flex justify-between items-center cursor-pointer hover:border-blue-500/30 transition-colors"
            >
                <span className="text-sm">{selected}</span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 w-full mt-2 bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl"
                    >
                        {options.map((opt) => (
                            <div 
                                key={opt}
                                onClick={() => { setSelected(opt); setIsOpen(false); }}
                                className={`px-6 py-3 text-sm cursor-pointer transition-colors ${selected === opt ? "bg-blue-500/20 text-blue-400 font-bold" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
                            >
                                {opt}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const jobs = [
    {
        id: "conseiller-clientele",
        title: "Conseiller Clientèle Assurance (H/F)",
        company: "LBASSUR",
        type: "CDI",
        location: "Cotonou, Bénin",
        deadline: "Immédiat",
        status: "Ouverte",
        description: "Vous avez la fibre commerciale et souhaitez évoluer dans le courtage en assurances ? Rejoignez notre équipe pour conseiller et accompagner nos clients dans leur protection quotidienne."
    }
];

export default function CareersPage() {
    return (
        <main className="bg-black min-h-screen text-white overflow-hidden">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/[0.03] rounded-full blur-[120px] -z-0"></div>
                
                <div className="container mx-auto max-w-5xl relative z-10 text-center">
                    <span className="glass inline-block py-2 px-6 rounded-full text-[10px] uppercase tracking-[0.4em] text-blue-400 font-bold mb-8">
                        Rejoignez-nous
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter font-oswald text-white mb-6">
                        Carrières
                    </h1>
                    <p className="text-gray-400 text-xl font-light">
                        Construisons ensemble l'avenir de l'assurance en Afrique.
                    </p>
                </div>
            </section>

            {/* Search/Filter Section */}
            <section className="py-10 px-6 relative z-10">
                <div className="container mx-auto max-w-5xl">
                    <div className="glass p-4 rounded-2xl flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                            <input 
                                type="text" 
                                placeholder="Rechercher un poste, un mot-clé..." 
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                            />
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0">
                            <CustomSelect 
                                defaultLabel="Tous les contrats" 
                                options={["Tous les contrats", "CDI", "CDD", "Stage"]} 
                            />
                            <CustomSelect 
                                defaultLabel="Toutes les localisations" 
                                options={["Toutes les localisations", "Cotonou", "Porto-Novo", "Parakou"]} 
                            />
                            <CustomSelect 
                                defaultLabel="Tous les statuts" 
                                options={["Tous les statuts", "Ouverte", "Clôturée"]} 
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Job Listings */}
            <section className="py-10 px-6">
                <div className="container mx-auto max-w-5xl">
                    <h2 className="text-xl font-oswald tracking-wide mb-8">{jobs.length} offre(s) trouvée(s)</h2>

                    <div className="space-y-6">
                        {jobs.map((job) => (
                            <motion.div 
                                key={job.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 md:p-8 hover:border-blue-500/30 transition-all duration-300 group"
                            >
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="px-3 py-1 bg-white/10 text-xs uppercase tracking-wider rounded-md font-bold">{job.type}</span>
                                            <span className={`px-3 py-1 text-xs uppercase tracking-wider rounded-md font-bold ${job.status === 'Ouverte' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {job.status}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">{job.title}</h3>
                                        <div className="flex items-center gap-6 text-sm text-gray-400">
                                            <span className="flex items-center gap-2"><Briefcase size={16}/> {job.company}</span>
                                            <span className="flex items-center gap-2"><MapPin size={16}/> {job.location}</span>
                                            <span className="flex items-center gap-2">Clôture : {job.deadline}</span>
                                        </div>
                                    </div>
                                    <Link href={`#`} className="px-6 py-3 bg-white text-black font-bold uppercase tracking-wider text-xs rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                                        Aperçu <ChevronRight size={16} />
                                    </Link>
                                </div>
                                <p className="text-gray-400 font-light leading-relaxed">
                                    {job.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Spontaneous Application */}
            <section className="py-20 px-6">
                <div className="container mx-auto max-w-5xl">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="glass border border-blue-500/20 rounded-3xl p-8 md:p-12 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -z-10"></div>
                        
                        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs uppercase tracking-wider rounded-md font-bold">Ouverte</span>
                                    <span className="text-gray-400 text-sm font-bold uppercase tracking-wider"><FileText size={16} className="inline mr-2" />Candidature Spontanée</span>
                                </div>
                                <h3 className="text-3xl font-bold font-oswald tracking-wide mb-4">Rejoindre LBASSUR</h3>
                                <p className="text-gray-400 font-light leading-relaxed mb-8">
                                    Vous souhaitez faire partie de l'aventure LBASSUR ? Votre profil et vos ambitions nous intéressent. N'hésitez pas à nous transmettre votre candidature spontanée, notre équipe l'étudiera avec attention.
                                </p>
                            </div>
                            <div className="shrink-0">
                                <button className="px-8 py-4 bg-blue-500 text-white font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-blue-400 hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center gap-3">
                                    <Send size={18} />
                                    Postuler
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
