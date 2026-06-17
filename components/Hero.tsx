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
            {/* Background Images — Cross-fade, bright & clear */}
            <AnimatePresence mode="sync">
                {heroSlides.map((slide, index) =>
                    index === currentSlide ? (
                        <motion.div
                            key={slide.image}
                            initial={{ opacity: 0, scale: 1.03 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1] }}
                            className="absolute inset-0 z-0"
                        >
                            <img
                                src={slide.image}
                                alt={slide.alt}
                                className="absolute inset-0 w-full h-full object-cover brightness-110"
                            />
                        </motion.div>
                    ) : null
                )}
            </AnimatePresence>

            {/* Minimal overlay — keep image very clear */}
            <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
            <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/50 via-transparent to-transparent" />

            {/* Content — Starlink style: bottom-left */}
            <div className="relative z-10 px-8 md:px-16 lg:px-24 pb-24 md:pb-32 max-w-3xl">
                <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-4"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                    S'assurer Juste
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="text-sm md:text-base text-gray-300 mb-2 tracking-wide uppercase"
                >
                    Et non Juste S'assurer
                </motion.p>

                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="text-sm md:text-base text-gray-400 max-w-md leading-relaxed font-light mb-10"
                >
                    Particuliers · Professionnels · Entreprises
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1 }}
                    className="flex flex-wrap gap-3"
                >
                    <a
                        href="#contact-section"
                        className="px-6 py-2.5 bg-white text-black text-[13px] font-semibold rounded-full hover:bg-gray-200 active:scale-95 transition-all duration-300"
                    >
                        Nous Contacter
                    </a>
                    <Link
                        href="/services"
                        className="px-6 py-2.5 border border-white/40 text-white text-[13px] font-semibold rounded-full hover:bg-white/10 active:scale-95 transition-all duration-300 backdrop-blur-sm"
                    >
                        Découvrir Nos Services
                    </Link>
                </motion.div>
            </div>

            {/* Slide indicators — bottom right */}
            <div className="absolute bottom-10 right-8 md:right-16 lg:right-24 z-10 flex items-center gap-3">
                {heroSlides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentSlide(i)}
                        className={`rounded-full transition-all duration-500 ${
                            i === currentSlide
                                ? "w-8 h-[3px] bg-white"
                                : "w-4 h-[3px] bg-white/30 hover:bg-white/60"
                        }`}
                        aria-label={`Slide ${i + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
