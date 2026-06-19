"use client";

import { motion } from "framer-motion";

const stats = [
    { value: "98%", label: "Clients Satisfaits" },
    { value: "15+", label: "Années d'Expertise" },
    { value: "24/7", label: "Assistance" },
    { value: "200+", label: "Contrats Gérés" },
];

export default function StatsSection() {
    return (
        <section className="bg-black border-b border-white/10">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-black py-16 px-6 text-center group hover:bg-neutral-900 transition-colors duration-500"
                        >
                            <div className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tighter">
                                {stat.value}
                            </div>
                            <div className="text-xs font-semibold text-white/60 uppercase tracking-widest">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
