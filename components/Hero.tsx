"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
                            <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" />
                            <img
                                src={slide.image}
                                alt={slide.alt}
                                className="absolute inset-0 w-full h-full object-cover brightness-110"
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
                    className="text-5xl md:text-7xl lg:text-8xl font-bold text-black tracking-tight mb-8"
                >
                    {heroSlides[currentSlide].title}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="text-sm text-gray-700 max-w-md leading-relaxed mb-8 tracking-wide font-medium"
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
                        href="#services"
                        className="bg-white/50 text-black border border-black/10 px-8 py-4 text-[13px] font-bold rounded-md hover:bg-white hover:border-black/20 transition-all duration-300 active:scale-95 text-center"
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
                                ? "w-8 h-[3px] bg-black"
                                : "w-4 h-[3px] bg-black/30 hover:bg-black/60"
                        }`}
                        aria-label={`Slide ${i + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
