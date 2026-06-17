"use client";

import { motion } from "framer-motion";
import { Eye, Target, Heart, Info } from "lucide-react";

const aboutData = [
    {
        title: "À Propos",
        icon: Info,
        description: "Fort de notre expérience au Bénin, notre cabinet s'engage à vous fournir des conseils transparents et des solutions sur mesure. Nous bâtissons des relations de confiance à long terme, basées sur la proximité et l'écoute."
    },
    {
        title: "Notre Vision",
        icon: Eye,
        description: "Devenir le courtier de référence au Bénin et en Afrique de l'Ouest, reconnu pour son innovation, son expertise pointue et la pertinence de ses solutions d'assurance adaptées aux réalités locales."
    },
    {
        title: "Nos Missions",
        icon: Target,
        description: "Défendre vos intérêts avec indépendance, vous accompagner dans la gestion globale de vos risques et vous garantir les meilleures couvertures possibles au prix le plus juste du marché."
    },
    {
        title: "Nos Valeurs",
        icon: Heart,
        description: "Transparence, intégrité, réactivité et excellence. Nous plaçons systématiquement l'humain au centre de toutes nos décisions et de notre accompagnement au quotidien."
    }
];

export default function AboutSection() {
    return (
        <section className="py-24 bg-white border-b border-black/5 relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-4">Qui Sommes-Nous</p>
                    <h2 className="text-4xl md:text-5xl font-bold text-black tracking-tight mb-8">
                        L'Humain au cœur du Courtage
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {aboutData.map((item, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-gray-50 border border-black/5 p-8 rounded-md hover:bg-gray-100 transition-colors duration-300 flex flex-col items-start group"
                        >
                            <div className="w-12 h-12 bg-white rounded-md border border-black/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <item.icon size={20} className="text-black" />
                            </div>
                            <h3 className="text-xl font-bold text-black tracking-tight mb-4">
                                {item.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed font-light text-sm">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
