"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const heroSlides = [
    {
        image: "/images/01.png",
        alt: "Père et fille regardant les étoiles",
    },
    {
        image: "/images/02.png",
        alt: "Fillette marchant vers l'horizon",
    },
];

export default function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 8000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section
            id="home"
            className="relative h-screen flex flex-col justify-end overflow-hidden bg-black"
        >
            {/* Background Images — Cross-fade */}
            <AnimatePresence mode="sync">
                {heroSlides.map((slide, index) =>
                    index === currentSlide ? (
                        <motion.div
                            key={slide.image}
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1] }}
                            className="absolute inset-0 z-0"
                        >
                            <img
                                src={slide.image}
                                alt={slide.alt}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </motion.div>
                    ) : null
                )}
            </AnimatePresence>

            {/* Overlays for text readability */}
            <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 z-[1] bg-black/20" />

            {/* Content — Starlink style: bottom-left aligned */}
            <div className="relative z-10 px-8 md:px-16 lg:px-24 pb-24 md:pb-32 max-w-4xl">
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="text-[11px] md:text-[13px] uppercase tracking-[0.5em] text-gray-400 font-bold mb-6"
                >
                    Courtier en Assurance · Bénin
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.5 }}
                    className="text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-bold text-white leading-[0.9] tracking-tight mb-8"
                    style={{ fontFamily: "var(--font-oswald), sans-serif" }}
                >
                    S'assurer Juste,<br />
                    <span className="text-gray-400">Vivre Serein</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="text-base md:text-lg text-gray-300 max-w-lg leading-relaxed font-light mb-12"
                >
                    Protection sur mesure pour particuliers, professionnels et entreprises.
                    Votre avenir mérite le meilleur courtier.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <a
                        href="#contact-section"
                        className="group px-10 py-4 bg-white text-black text-[13px] uppercase tracking-[0.15em] font-bold hover:bg-gray-200 active:scale-95 transition-all duration-300 text-center"
                    >
                        Nous Contacter
                    </a>
                    <Link
                        href="/services"
                        className="px-10 py-4 border border-white/30 text-white text-[13px] uppercase tracking-[0.15em] font-bold hover:bg-white/10 active:scale-95 transition-all duration-300 text-center"
                    >
                        Nos Services
                    </Link>
                </motion.div>
            </div>

            {/* Slide indicators — bottom right */}
            <div className="absolute bottom-10 right-8 md:right-16 lg:right-24 z-10 flex items-center gap-3">
                {heroSlides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentSlide(i)}
                        className={`transition-all duration-500 ${
                            i === currentSlide
                                ? "w-8 h-[2px] bg-white"
                                : "w-4 h-[2px] bg-white/30 hover:bg-white/60"
                        }`}
                        aria-label={`Slide ${i + 1}`}
                    />
                ))}
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-3"
            >
                <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
            </motion.div>
        </section>
    );
}
