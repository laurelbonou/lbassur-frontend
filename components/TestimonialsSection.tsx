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
            {/* Background Image with Liquid Glass */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 backdrop-blur-[10px] bg-black/60"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
            </div>

            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(59,130,246,0.04),transparent)] pointer-events-none z-0" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <span className="label text-blue-500/60 mb-4 block">Retours Client</span>
                    <h2 className="text-4xl md:text-6xl font-bold uppercase font-oswald text-white tracking-tight leading-none">
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
                                    <Star key={i} size={13} className="text-blue-500 fill-blue-500" />
                                ))}
                            </div>

                            {/* Content */}
                            <p className="text-gray-300 leading-relaxed font-light text-base flex-1 mb-10 relative z-10">
                                "{t.content}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-4 pt-8 border-t border-white/5">
                                <div className="w-10 h-10 border border-blue-500/20 bg-blue-500/5 flex items-center justify-center font-bold text-sm font-oswald text-blue-400">
                                    {t.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white uppercase tracking-[0.15em]">{t.name}</p>
                                    <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em] mt-0.5">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
