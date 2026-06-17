"use client";

import { motion } from "framer-motion";
import { Eye, Target, Heart, Info } from "lucide-react";

const aboutData = [
    {
        title: "À Propos",
        icon: Info,
        description: "Fort de notre expérience au Bénin, notre cabinet s'engage à vous fournir des conseils transparents et des solutions sur mesure. Nous bâtissons des relations de confiance à long terme, basées sur la proximité et l'écoute.",
        className: "md:col-span-2 bg-black text-white",
        iconClassName: "bg-white/10 text-white border-white/10",
        textClassName: "text-gray-300"
    },
    {
        title: "Notre Vision",
        icon: Eye,
        description: "Devenir le courtier de référence au Bénin et en Afrique de l'Ouest, reconnu pour son innovation, son expertise pointue et des solutions d'assurance adaptées aux réalités locales.",
        className: "md:col-span-1 bg-gray-50 text-black",
        iconClassName: "bg-white text-black border-black/5 shadow-sm",
        textClassName: "text-gray-600"
    },
    {
        title: "Nos Missions",
        icon: Target,
        description: "Défendre vos intérêts avec indépendance, vous accompagner dans la gestion globale de vos risques et vous garantir les meilleures couvertures au prix le plus juste.",
        className: "md:col-span-1 bg-gray-50 text-black",
        iconClassName: "bg-white text-black border-black/5 shadow-sm",
        textClassName: "text-gray-600"
    },
    {
        title: "Nos Valeurs",
        icon: Heart,
        description: "Transparence, intégrité, réactivité et excellence. Nous plaçons systématiquement l'humain au centre de toutes nos décisions et de notre accompagnement au quotidien, pour vous offrir un service inégalé.",
        className: "md:col-span-2 bg-gradient-to-br from-gray-100 to-gray-50 text-black",
        iconClassName: "bg-white text-black border-black/5 shadow-sm",
        textClassName: "text-gray-600"
    }
];

export default function AboutSection() {
    return (
        <section className="py-32 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="text-center mb-20 max-w-3xl mx-auto">
                    <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-4">Qui Sommes-Nous</p>
                    <h2 className="text-4xl md:text-5xl font-bold text-black tracking-tight mb-8">
                        L'Humain au cœur du Courtage
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {aboutData.map((item, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={`p-10 md:p-12 rounded-[2rem] border border-black/5 hover:-translate-y-2 hover:shadow-xl transition-all duration-500 flex flex-col items-start group ${item.className}`}
                        >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 border ${item.iconClassName}`}>
                                <item.icon size={28} />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
                                {item.title}
                            </h3>
                            <p className={`leading-relaxed font-light text-base md:text-lg ${item.textClassName}`}>
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
