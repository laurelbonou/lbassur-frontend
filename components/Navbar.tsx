"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const centerLinks = [
    { name: "A Propos", href: "/a-propos" },
    { name: "Services", href: "/services" },
    { name: "Actualités", href: "/actualites" },
    { name: "Carrières", href: "/carrieres" },
];

const allMobileLinks = [
    { name: "Accueil",    href: "/" },
    { name: "A Propos",   href: "/a-propos" },
    { name: "Services",   href: "/services" },
    { name: "Actualités", href: "/actualites" },
    { name: "Carrières",  href: "/carrieres" },
    { name: "Simulation", href: "/simulation" },
    { name: "Rendez-vous",href: "/#booking" },
];

export default function Navbar() {
    const [isScrolled,       setIsScrolled]       = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 30);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
                isScrolled
                    ? "bg-black/80 backdrop-blur-xl border-b border-white/[0.06]"
                    : "bg-transparent"
            }`}
        >
            <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between relative">

                {/* ── Logo ── */}
                <Link href="/" className="flex items-center gap-3 z-10 group">
                    <div className="w-8 h-8 overflow-hidden rounded-full border border-white/10 group-hover:border-white/30 transition-colors duration-500 flex-shrink-0">
                        <img
                            src="/images/logo.jpg"
                            alt="LBASSUR"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <span className="font-oswald font-bold uppercase tracking-[0.2em] text-sm text-white hidden sm:block">
                        LBASSUR
                    </span>
                </Link>

                {/* ── Center nav links (Tesla style) ── */}
                <div className="hidden lg:flex flex-1 justify-center items-center gap-4 xl:gap-8 px-4">
                    {centerLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="relative text-[11px] xl:text-[13px] uppercase tracking-[0.15em] xl:tracking-[0.2em] font-bold text-gray-400 hover:text-white transition-colors duration-300 group whitespace-nowrap"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-400 group-hover:w-full" />
                        </Link>
                    ))}
                </div>

                {/* ── Right — Simulation + CTA ── */}
                <div className="hidden lg:flex items-center gap-6 z-10">
                    <Link
                        href="/simulation"
                        className="text-[13px] uppercase tracking-[0.15em] font-semibold text-gray-400 hover:text-white transition-colors duration-300"
                    >
                        Simulation
                    </Link>
                    <Link
                        href="/#contact-section"
                        className="text-[13px] font-semibold text-white border border-white/30 px-5 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-sm"
                    >
                        Rendez-vous
                    </Link>
                </div>

                {/* ── Mobile burger ── */}
                <button
                    className="lg:hidden text-white z-50 p-1 flex flex-col gap-[5px] group"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Menu"
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {isMobileMenuOpen ? (
                            <motion.div
                                key="close"
                                initial={{ opacity: 0, rotate: -45 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <X size={20} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="open"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex flex-col gap-[5px]"
                            >
                                <span className="block w-5 h-[1.5px] bg-white group-hover:opacity-60 transition-opacity" />
                                <span className="block w-3.5 h-[1.5px] bg-white group-hover:opacity-60 transition-opacity" />
                                <span className="block w-5 h-[1.5px] bg-white group-hover:opacity-60 transition-opacity" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>
            </div>

            {/* ── Mobile fullscreen overlay ── */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                        className="fixed inset-0 bg-black z-40 flex flex-col justify-center items-center lg:hidden"
                    >
                        <div className="flex flex-col items-center gap-10">
                            {allMobileLinks.map((link, i) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.08 + i * 0.06 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`text-2xl uppercase tracking-[0.3em] font-bold transition-colors duration-300 font-oswald ${
                                            link.name === "Rendez-vous"
                                                ? "text-white hover:text-gray-300"
                                                : "text-gray-500 hover:text-white"
                                        }`}
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        <div className="absolute bottom-10 label text-gray-700">
                            LBASSUR &copy; {new Date().getFullYear()}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
