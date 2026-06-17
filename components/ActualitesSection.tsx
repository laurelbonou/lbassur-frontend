"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const articles = [
    {
        date: "12 Juin 2026",
        title: "Comment la digitalisation transforme l'assurance santé au Bénin",
        desc: "L'émergence des nouvelles technologies permet aujourd'hui une prise en charge médicale instantanée. Décryptage avec le lancement d'Itoju.",
        href: "/actualites/digitalisation-sante"
    },
    {
        date: "28 Mai 2026",
        title: "Entreprises : Les 3 garanties indispensables en 2026",
        desc: "Face aux nouveaux risques climatiques et cybersécuritaires, une mise à jour de vos contrats Multirisques Professionnelles s'impose.",
        href: "/actualites/garanties-entreprises"
    },
    {
        date: "10 Mai 2026",
        title: "LBASSUR élu courtier de l'année pour la 3ème fois consécutive",
        desc: "Une reconnaissance qui vient saluer notre engagement constant envers la satisfaction client et notre politique d'innovation.",
        href: "/actualites/courtier-annee"
    }
];

export default function ActualitesSection() {
    return (
        <section className="py-32 bg-black border-b border-white/5 relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-4">Actualités</p>
                        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                            Dernières Insights
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <Link href="/actualites" className="inline-flex items-center gap-2 text-white text-[13px] font-semibold hover:underline underline-offset-4 transition-all duration-200">
                            Toutes nos actualités <ArrowRight size={14} />
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {articles.map((article, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: i * 0.15 }}
                            viewport={{ once: true }}
                            className="group cursor-pointer flex flex-col h-full"
                        >
                            <p className="text-[11px] text-gray-500 font-medium mb-4">{article.date}</p>
                            <h3 className="text-xl font-bold text-white mb-4 group-hover:text-gray-300 transition-colors duration-300 line-clamp-2">
                                {article.title}
                            </h3>
                            <p className="text-gray-400 font-light text-sm leading-relaxed mb-8 flex-1 line-clamp-3">
                                {article.desc}
                            </p>
                            <Link href={article.href} className="inline-flex items-center gap-2 text-white text-[12px] uppercase tracking-wider font-semibold opacity-60 group-hover:opacity-100 transition-all duration-300">
                                Lire l'article
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
