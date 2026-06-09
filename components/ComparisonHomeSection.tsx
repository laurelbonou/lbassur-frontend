"use client";

import { motion } from "framer-motion";
import { Car, Heart, PiggyBank, ShieldCheck, Zap, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

const FAMILIES = [
    {
        icon: Car,
        label: "IARDT",
        sub: "Dommages & Responsabilité",
        desc: "Auto, Moto, Habitation, Flotte, RC…",
        accent: "text-blue-400",
        border: "group-hover:border-blue-500/30",
    },
    {
        icon: Heart,
        label: "Personnes",
        sub: "Santé & Prévoyance",
        desc: "Santé, Accident, Voyage…",
        accent: "text-emerald-400",
        border: "group-hover:border-emerald-500/30",
    },
    {
        icon: PiggyBank,
        label: "Vie & Épargne",
        sub: "Capital & Protection",
        desc: "Retraite, Éducation, Emprunteur, Obsèques…",
        accent: "text-violet-400",
        border: "group-hover:border-violet-500/30",
    },
];

const FEATURES = [
    { Icon: TrendingUp, label: "Taux Actualisés" },
    { Icon: Zap,        label: "Moins de 2 minutes" },
    { Icon: ShieldCheck,label: "Toutes Catégories" },
    { Icon: Car,        label: "10+ Partenaires" },
];

export default function ComparisonHomeSection() {
    return (
        <section id="compare" className="py-32 bg-black text-white border-b border-white/5 relative overflow-hidden">
            {/* HUD accents */}
            <div className="absolute bottom-8 right-8 label text-blue-500/20 font-mono hidden lg:block">
                ALGO : REAL_TIME_v4
            </div>

            <div className="container mx-auto px-6 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center">

                    {/* Left — Copy */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="label text-blue-400 mb-6 block"
                        >
                            Innovation Bénin
                        </motion.span>

                        <h2 className="text-5xl md:text-6xl xl:text-7xl font-bold uppercase font-oswald leading-none mb-8 text-white tracking-tight">
                            Le Premier<br />
                            <span className="text-gradient-blue">Comparateur National</span>
                        </h2>

                        <p className="text-gray-400 text-base mb-10 leading-relaxed font-light max-w-lg">
                            Ne choisissez plus votre assurance au hasard. Notre algorithme analyse en temps réel
                            les offres de tous les assureurs béninois pour vous proposer le contrat idéal.
                        </p>

                        {/* Feature grid */}
                        <div className="grid grid-cols-2 gap-4 mb-12">
                            {FEATURES.map(({ Icon, label }, i) => (
                                <motion.div
                                    key={label}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + i * 0.08 }}
                                    className="flex items-center gap-3 group"
                                >
                                    <div className="w-8 h-8 border border-white/8 flex items-center justify-center group-hover:border-blue-500/40 transition-colors duration-500">
                                        <Icon size={14} className="text-blue-400" />
                                    </div>
                                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 group-hover:text-white transition-colors duration-300">
                                        {label}
                                    </span>
                                </motion.div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/compare"
                                className="px-8 py-4 bg-white text-black text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gray-100 hover:scale-[1.02] active:scale-95 transition-all text-center"
                            >
                                Comparer les Offres
                            </Link>
                            <Link
                                href="/simulation"
                                className="glass px-8 py-4 text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-white/10 hover:scale-[1.02] active:scale-95 transition-all text-center"
                            >
                                Simulation Rapide
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right — Family cards */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="space-y-3 relative"
                    >
                        {FAMILIES.map((fam, i) => (
                            <motion.div
                                key={fam.label}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: i * 0.15 }}
                                viewport={{ once: true }}
                            >
                                <Link
                                    href={`/compare?cat=${fam.label.toLowerCase()}`}
                                    className={`group flex items-center gap-6 p-6 bg-white/[0.02] border border-white/5 ${fam.border} hover:bg-white/[0.05] transition-all duration-500 relative overflow-hidden`}
                                >
                                    {/* Hover shine */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                                    <div className="w-12 h-12 border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-all duration-500 flex-shrink-0">
                                        <fam.icon size={20} className={`${fam.accent} group-hover:scale-110 transition-transform duration-300`} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-baseline gap-3 mb-1">
                                            <span className={`text-[11px] font-black uppercase tracking-[0.3em] ${fam.accent}`}>
                                                {fam.label}
                                            </span>
                                            <span className="text-[10px] text-gray-600">— {fam.sub}</span>
                                        </div>
                                        <p className="text-[11px] text-gray-500 font-light">{fam.desc}</p>
                                    </div>

                                    <ArrowRight
                                        size={14}
                                        className="text-gray-700 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 flex-shrink-0"
                                    />
                                </Link>
                            </motion.div>
                        ))}

                        {/* Background glow */}
                        <div className="absolute -inset-1/4 bg-blue-500/[0.03] rounded-full blur-[100px] -z-10 pointer-events-none" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
