"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const heroGradients = [
    "from-blue-950 via-black to-slate-950",
    "from-slate-950 via-black to-blue-900",
    "from-indigo-950 via-black to-slate-900",
    "from-slate-900 via-black to-blue-950",
];

export default function Hero() {
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % heroGradients.length);
        }, 8000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section id="home" className="relative h-screen flex flex-col justify-center items-center text-center overflow-hidden bg-black">
            {/* Background Image with Liquid Glass Overlay */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {/* Liquid Glass Overlay Effect */}
                <div className="absolute inset-0 backdrop-blur-[4px] bg-black/40 z-0"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black/50 to-black mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
            </div>

            {/* Subtle grid */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-screen"
                style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)", backgroundSize: "80px 80px" }}
            />

            {/* Content */}
            <div className="relative z-20 px-6 max-w-5xl mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="mb-10 inline-block"
                >
                    <span className="glass py-2.5 px-8 text-[14px] uppercase tracking-[0.4em] text-blue-400 font-bold">
                        L'Assurance Réinventée
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-bold uppercase mb-6 text-white font-oswald tracking-tighter leading-none"
                >
                    LBASSUR
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.7 }}
                    className="text-base md:text-xl text-gray-400 max-w-xl mx-auto font-light leading-relaxed mb-12"
                >
                    <span className="text-white font-medium">S'assurer Juste</span>
                    <span className="block mt-1 text-gray-500">Particuliers · Professionnels · Entreprises</span>
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.9 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    <a
                        href="#booking"
                        className="group px-10 py-5 bg-white text-black text-[15px] uppercase tracking-[0.2em] font-bold hover:scale-[1.02] active:scale-95 flex items-center gap-2"
                    >
                        Nous Contacter
                        <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </a>
                    <Link
                        href="/services"
                        className="glass px-10 py-5 text-white text-[15px] uppercase tracking-[0.2em] font-bold hover:bg-white/10 hover:scale-[1.02] active:scale-95"
                    >
                        Nos Services
                    </Link>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
            >
                <div className="w-px h-14 bg-gradient-to-b from-blue-500/60 to-transparent" />
                <span className="text-[13px] uppercase tracking-[0.5em] text-gray-600 ml-[0.5em]">Scroll</span>
            </motion.div>

            {/* Bottom fade to black */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
        </section>
    );
}
