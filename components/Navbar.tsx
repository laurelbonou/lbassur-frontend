"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-black/95 backdrop-blur-md border-b border-white/10 py-4" 
            : "bg-black border-b border-white/5 py-6"
        }`}
      >
        <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img 
                src="/images/logo.jpg" 
                alt="LBASSUR Logo" 
                className="h-10 w-auto rounded-sm"
            />
            <span className="text-xl font-bold tracking-tight text-white">LBASSUR</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <a href="/" className="text-[13px] font-semibold text-gray-300 hover:text-white transition-colors duration-200">
              Accueil
            </a>
            <Link href="/#apropos" className="text-[13px] font-semibold text-gray-300 hover:text-white transition-colors duration-200">
              À Propos
            </Link>
            <Link href="/#offres" className="text-[13px] font-semibold text-gray-300 hover:text-white transition-colors duration-200">
              Nos Offres
            </Link>
            <Link href="/#methode" className="text-[13px] font-semibold text-gray-300 hover:text-white transition-colors duration-200">
              Notre Méthode
            </Link>
            <Link href="/#actualites" className="text-[13px] font-semibold text-gray-300 hover:text-white transition-colors duration-200">
              Actualités
            </Link>
            <Link href="/#contact" className="text-[13px] font-semibold text-gray-300 hover:text-white transition-colors duration-200">
              Contact
            </Link>
            
            <div className="w-px h-4 bg-white/20 mx-2" />
            
            <Link 
              href="/compare"
              className="text-[13px] font-semibold text-gray-300 hover:text-white transition-colors duration-200"
            >
              Toutes les offres
            </Link>
            <Link 
              href="/simulation"
              className="bg-white !text-black px-6 py-2.5 text-[13px] font-bold rounded-md hover:bg-gray-200 transition-all duration-200 active:scale-95"
            >
              Comparateur
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Nav Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black pt-24 px-6">
          <div className="flex flex-col gap-6">
            <a 
              href="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-bold text-white border-b border-white/10 pb-4"
            >
              Accueil
            </a>
            <Link 
              href="/#apropos" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-bold text-white border-b border-white/10 pb-4"
            >
              À Propos
            </Link>
            <Link 
              href="/#offres" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-bold text-white border-b border-white/10 pb-4"
            >
              Nos Offres
            </Link>
            <Link 
              href="/#methode" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-bold text-white border-b border-white/10 pb-4"
            >
              Notre Méthode
            </Link>
            <Link 
              href="/#actualites" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-bold text-white border-b border-white/10 pb-4"
            >
              Actualités
            </Link>
            <Link 
              href="/#contact" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-bold text-white border-b border-white/10 pb-4"
            >
              Contact
            </Link>
            <Link 
              href="/compare"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-bold text-white border-b border-white/10 pb-4"
            >
              Toutes les offres
            </Link>
            <Link 
              href="/simulation"
              onClick={() => setIsMobileMenuOpen(false)}
              className="bg-white !text-black text-center py-4 text-lg font-bold rounded-md mt-4"
            >
              Comparateur
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
