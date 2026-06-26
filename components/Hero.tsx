"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const heroSlides = [
    {
        image: "/images/petite fille avec son père en couleur.png",
        alt: "Petite fille avec son père",
        title: "S'assurer Juste,\net non Juste S'assurer.",
    },
    {
        image: "/images/petite fille avec son cerf volant.png",
        alt: "Petite fille avec son cerf volant",
        title: "Votre sérénité,\nnotre priorité.",
    },
    {
        image: "/images/petite fille allant a l'école avec son sac.png",
        alt: "Petite fille allant à l'école",
        title: "L'assurance repensée\npour vous.",
    },
    {
        image: "/images/fille diplomée avec ses parents.png",
        alt: "Fille diplômée avec ses parents",
        title: "Des garanties fiables\npour avancer.",
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
            className="group relative h-screen flex flex-col justify-end overflow-hidden bg-black"
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
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-[1]" />
                            <img
                                src={slide.image}
                                alt={slide.alt}
                                className="absolute inset-0 w-full h-full object-cover brightness-110 transition-all duration-700"
                            />
                        </motion.div>
                    ) : null
                )}
            </AnimatePresence>

            {/* Content — Starlink style */}
            <div className="relative z-10 px-8 md:px-16 lg:px-24 pb-24 md:pb-32 max-w-3xl">
                <motion.h1
                    key={currentSlide + "-title"}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-8 whitespace-pre-line"
                >
                    {heroSlides[currentSlide].title}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="text-sm md:text-base text-gray-300 max-w-md leading-relaxed mb-8 tracking-wide font-medium"
                >
                    Particuliers · Professionnels · Entreprises
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <Link
                        href="/simulation"
                        className="bg-black text-white px-8 py-4 text-[13px] font-bold rounded-md hover:bg-gray-800 transition-all duration-300 active:scale-95 text-center flex items-center justify-center gap-2"
                    >
                        Lancer une simulation
                        <ArrowRight size={16} />
                    </Link>
                    <Link
                        href="/compare"
                        className="bg-white/10 text-white border border-white/20 px-8 py-4 text-[13px] font-bold rounded-md hover:bg-white/20 hover:border-white/40 transition-all duration-300 active:scale-95 text-center"
                    >
                        Découvrir nos offres
                    </Link>
                </motion.div>
            </div>

            {/* Slide indicators — bottom right */}
            <div className="absolute bottom-10 right-8 md:right-16 lg:right-24 z-10 flex items-center gap-3">
                {heroSlides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentSlide(i)}
                        className={`rounded-sm transition-all duration-500 ${
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
