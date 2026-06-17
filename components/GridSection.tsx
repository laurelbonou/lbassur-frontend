"use client";

import { motion } from "framer-motion";
import { Shield, Briefcase, Users, FileText } from "lucide-react";
import Link from "next/link";

const specialties = [
    {
        icon: Briefcase,
        title: "Accompagnement PME & PMI",
        description: "Solutions dédiées aux structures professionnelles pour sécuriser leur activité.",
        href: "/services#indemnisation"
    },
    {
        icon: Shield,
        title: "Courtage en Assurance",
        description: "Intermédiaire expert pour défendre vos intérêts auprès des compagnies.",
        href: "/services#assurance"
    },
    {
        icon: FileText,
        title: "Comparatif Contrats",
        description: "Analyse comparative pour vous obtenir le meilleur rapport qualité / prix.",
        href: "/services#audit"
    },
    {
        icon: Users,
        title: "Particuliers & Pros",
        description: "Une offre globale couvrant tous les besoins, personnels comme professionnels.",
        href: "/services#conseil"
    }
];

export default function GridSection() {
    return (
        <section id="about" className="bg-black border-b border-white/5 py-24">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
                    {specialties.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className="block"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-black p-10 group hover:bg-white/[0.03] transition-colors duration-500 h-full"
                            >
                                <div className="mb-8">
                                    <div className="w-10 h-10 border border-white/10 flex items-center justify-center mb-8 group-hover:border-white/30 transition-colors duration-500 rounded-md">
                                        <item.icon className="text-gray-500 group-hover:text-white transition-colors duration-500" size={18} />
                                    </div>
                                    <h3 className="text-lg font-bold mb-4 text-white">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-400 leading-relaxed text-sm font-light">
                                        {item.description}
                                    </p>
                                </div>
                                <div className="h-[1px] w-0 bg-white/30 group-hover:w-8 transition-all duration-700" />
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
