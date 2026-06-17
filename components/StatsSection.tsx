"use client";

import { motion } from "framer-motion";

const stats = [
    { value: "100%",     label: "Satisfaction Client",   sub: "Engagement total" },
    { value: "24/7",     label: "Support & Assistance",  sub: "Disponibilité permanente" },
    { value: "+50",      label: "Partenaires Assureurs", sub: "Réseau national" },
    { value: "< 48h",    label: "Traitement Sinistres",  sub: "Délai de réponse" },
];

export default function StatsSection() {
    return (
        <section className="bg-black border-b border-white/5 py-32 relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-black p-12 group hover:bg-white/[0.03] transition-colors duration-500 text-center flex flex-col items-center justify-center"
                        >
                            <h3 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-4 group-hover:text-gray-200 transition-colors duration-700">
                                {stat.value}
                            </h3>
                            <div className="h-px w-6 bg-white/10 mb-4 group-hover:w-12 group-hover:bg-white/30 transition-all duration-700" />
                            <p className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold mb-1">
                                {stat.label}
                            </p>
                            <p className="text-[10px] text-gray-600 tracking-wider">
                                {stat.sub}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
