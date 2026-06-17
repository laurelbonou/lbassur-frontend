"use client";

import { motion } from "framer-motion";
import { INSURERS } from "@/lib/data";

export default function PartnersSection() {
    return (
        <section className="bg-black border-b border-white/5 py-24">
            <div className="container mx-auto px-6 max-w-7xl">

                {/* Header */}
                <div className="mb-16">
                    <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-4">Écosystème</p>
                    <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-none">
                        Nos Partenaires
                    </h2>
                </div>

                {/* Partners grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-white/5">
                    {INSURERS.map((insurer, i) => (
                        <motion.div
                            key={insurer.id}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.07 }}
                            viewport={{ once: true }}
                            className="bg-black p-8 group hover:bg-white/[0.03] transition-colors duration-500 flex flex-col"
                        >
                            {/* Logo */}
                            <div className="flex-1 flex items-center justify-center mb-6 min-h-[64px]">
                                <img
                                    src={insurer.logo}
                                    alt={insurer.name}
                                    className="h-10 w-auto max-w-[140px] object-contain opacity-40 group-hover:opacity-100 transition-all duration-500 grayscale group-hover:grayscale-0"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(insurer.name)}&background=1a1a1a&color=ffffff&bold=true&length=2&size=64`;
                                    }}
                                />
                            </div>

                            {/* Name */}
                            <p className="text-[11px] font-semibold text-gray-500 group-hover:text-white transition-colors duration-500 text-center leading-tight">
                                {insurer.name}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
