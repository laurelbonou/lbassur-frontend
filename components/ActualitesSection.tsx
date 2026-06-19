"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const articles = [
    {
        date: "12 Juin 2026",
        category: "Innovation",
        title: "Comment la digitalisation transforme l'assurance santé au Bénin.",
        href: "/actualites/digitalisation-sante"
    },
    {
        date: "28 Mai 2026",
        category: "Entreprises",
        title: "Les 3 garanties indispensables face aux nouveaux risques en 2026.",
        href: "/actualites/garanties-entreprises"
    },
    {
        date: "10 Mai 2026",
        category: "Distinction",
        title: "LBASSUR élu courtier de l'année pour la 3ème fois consécutive.",
        href: "/actualites/courtier-annee"
    }
];

export default function ActualitesSection() {
    return (
        <section className="py-32 bg-gray-50 border-b border-black/5 relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="max-w-2xl"
                    >
                        <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-4">Actualités</p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black tracking-tight">
                            Dernières Insights
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="shrink-0"
                    >
                        <Link href="/actualites" className="group inline-flex items-center gap-3 px-6 py-3 border border-black/20 rounded-full text-black text-[13px] font-semibold hover:bg-black hover:text-white transition-all duration-300">
                            Toutes nos actualités 
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>

                <div className="flex flex-col border-t border-black/20">
                    {articles.map((article, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Link href={article.href} className="group flex flex-col md:flex-row md:items-center justify-between py-8 md:py-12 border-b border-black/10 hover:border-black transition-colors cursor-pointer">
                                <div className="md:w-1/4 mb-4 md:mb-0 flex flex-col">
                                    <span className="text-xs font-bold uppercase tracking-widest text-black mb-1">{article.category}</span>
                                    <span className="text-sm text-gray-500">{article.date}</span>
                                </div>
                                <div className="md:w-2/4 mb-6 md:mb-0 pr-8">
                                    <h3 className="text-2xl md:text-3xl font-bold text-gray-400 group-hover:text-black transition-colors duration-300">
                                        {article.title}
                                    </h3>
                                </div>
                                <div className="md:w-1/4 flex justify-start md:justify-end">
                                    <div className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300 group-hover:scale-110">
                                        <ArrowRight size={20} className="-rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
