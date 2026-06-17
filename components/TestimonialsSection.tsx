"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
    {
        name: "Mahoudjro A.",
        role: "Directeur PME, Cotonou",
        rating: 5,
        content: "Grâce à LBASSUR, nous avons réduit nos primes d'assurance de 20% tout en améliorant nos garanties. Un audit d'une précision remarquable.",
    },
    {
        name: "Fatoumata K.",
        role: "Cheffe d'entreprise, Porto-Novo",
        rating: 5,
        content: "Un accompagnement humain et réactif. Lors de notre dernier sinistre, l'équipe a géré l'intégralité du dossier. Une tranquillité d'esprit précieuse.",
    },
    {
        name: "Ibrahim S.",
        role: "Particulier, Parakou",
        rating: 5,
        content: "Enfin un courtier qui prend le temps d'expliquer les clauses complexes. LBASSUR m'a aidé à choisir la meilleure prévoyance pour ma famille.",
    },
];

export default function TestimonialsSection() {
    return (
        <section className="py-32 bg-black border-b border-white/5 relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-4">Retours Client</p>
                    <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-none">
                        Leur Confiance
                    </h2>
                </motion.div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
                    {testimonials.map((t, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.12 }}
                            viewport={{ once: true }}
                            className="bg-black p-10 group hover:bg-white/[0.03] transition-colors duration-500 relative overflow-hidden flex flex-col"
                        >
                            {/* Large quote icon */}
                            <Quote
                                className="absolute -top-2 -right-2 text-white/[0.03] group-hover:text-white/[0.05] transition-colors duration-1000"
                                size={96}
                            />

                            {/* Stars */}
                            <div className="flex gap-1 mb-8">
                                {Array.from({ length: t.rating }).map((_, i) => (
                                    <Star key={i} size={13} className="text-white fill-white" />
                                ))}
                            </div>

                            {/* Content */}
                            <p className="text-gray-300 leading-relaxed font-light text-base flex-1 mb-10 relative z-10">
                                &ldquo;{t.content}&rdquo;
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-4 pt-8 border-t border-white/5">
                                <div className="w-10 h-10 border border-white/20 flex items-center justify-center font-bold text-sm text-white">
                                    {t.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-white">{t.name}</p>
                                    <p className="text-[10px] text-gray-500 mt-0.5">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
