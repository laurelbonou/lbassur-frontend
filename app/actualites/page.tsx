"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

const news = [
    {
        id: 1,
        title: "LBASSUR annonce son expansion en Afrique de l'Ouest",
        category: "Entreprise",
        date: "12 Mai 2026",
        excerpt: "Dans le cadre de sa vision de devenir le leader africain du courtage, LBASSUR ouvre deux nouveaux bureaux stratégiques.",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
        readTime: "3 min"
    },
    {
        id: 2,
        title: "L'importance de l'audit des contrats d'assurance",
        category: "Expertise",
        date: "05 Mai 2026",
        excerpt: "Découvrez pourquoi une revue annuelle de vos engagements contractuels peut sauver votre entreprise en cas de sinistre inattendu.",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop",
        readTime: "5 min"
    },
    {
        id: 3,
        title: "Nouvelle solution Santé Autofinancement pour les PME",
        category: "Produits",
        date: "28 Avril 2026",
        excerpt: "Nous lançons une nouvelle offre permettant aux entreprises de gérer un budget prévisionnel santé ajusté aux dépenses réelles.",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop",
        readTime: "4 min"
    }
];

export default function NewsPage() {
    return (
        <main className="bg-black min-h-screen text-white overflow-hidden">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/[0.03] rounded-full blur-[120px] -z-0"></div>
                <div className="container mx-auto max-w-7xl relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <span className="glass inline-block py-2 px-6 rounded-full text-[10px] uppercase tracking-[0.4em] text-blue-400 font-bold mb-8">
                            Actualités
                        </span>
                        <h1 className="text-6xl md:text-8xl font-bold uppercase tracking-tighter font-oswald text-white mb-8">
                            Dernières Nouvelles
                        </h1>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed font-light">
                            Restez informé(e) des dernières tendances du marché, des conseils d'experts et des événements de LBASSUR.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* News Grid */}
            <section className="py-20 px-6 relative z-10">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {news.map((item, idx) => (
                            <motion.article 
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden group hover:border-blue-500/30 transition-all duration-500 flex flex-col"
                            >
                                <div className="h-64 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                                    <img 
                                        src={item.image} 
                                        alt={item.title} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4 z-20">
                                        <span className="bg-blue-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-md">
                                            {item.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 font-bold uppercase tracking-wider">
                                        <span className="flex items-center gap-1"><Calendar size={14}/> {item.date}</span>
                                        <span className="flex items-center gap-1"><BookOpen size={14}/> {item.readTime}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-4 font-oswald tracking-wide group-hover:text-blue-400 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-400 font-light leading-relaxed mb-8 flex-1">
                                        {item.excerpt}
                                    </p>
                                    <Link href="#" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white hover:text-blue-400 transition-colors w-fit">
                                        Lire l'article <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="py-24 px-6 border-t border-white/5 bg-zinc-950/50">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-4xl font-bold font-oswald uppercase tracking-wide mb-6">Abonnez-vous à notre Newsletter</h2>
                    <p className="text-gray-400 font-light mb-10 max-w-2xl mx-auto">Recevez directement dans votre boîte mail nos analyses d'experts et les dernières actualités du secteur des assurances.</p>
                    <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
                        <input 
                            type="email" 
                            placeholder="Votre adresse email" 
                            className="bg-black/50 border border-white/10 rounded-xl py-4 px-6 text-white focus:outline-none focus:border-blue-500/50 transition-colors flex-1"
                        />
                        <button className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-gray-200 transition-colors shrink-0">
                            S'inscrire
                        </button>
                    </form>
                </div>
            </section>

            <Footer />
        </main>
    );
}
