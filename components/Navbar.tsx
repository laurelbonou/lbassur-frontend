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
            ? "bg-white/90 backdrop-blur-md border-b border-black/5 py-4" 
            : "bg-white border-b border-black/5 py-6"
        }`}
      >
        <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight text-black flex items-center gap-2">
            LBASSUR.
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="#expertises" className="text-[13px] font-semibold text-gray-600 hover:text-black transition-colors duration-200">
              Expertise
            </Link>
            <Link href="/services#particuliers" className="text-[13px] font-semibold text-gray-600 hover:text-black transition-colors duration-200">
              Particuliers
            </Link>
            <Link href="/services#entreprises" className="text-[13px] font-semibold text-gray-600 hover:text-black transition-colors duration-200">
              Entreprises
            </Link>
            <a href="https://lb-assurmaladie-staticwebsite.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-[13px] font-semibold text-gray-600 hover:text-black transition-colors duration-200">
              Itoju Santé
            </a>
            
            <div className="w-px h-4 bg-black/10 mx-2" />
            
            <Link 
              href="/simulation"
              className="bg-black text-white px-6 py-2.5 text-[13px] font-semibold rounded-md hover:bg-gray-800 transition-all duration-200 active:scale-95"
            >
              Comparateur
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden text-black p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Nav Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-24 px-6">
          <div className="flex flex-col gap-6">
            <Link 
              href="#expertises" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-bold text-black border-b border-black/5 pb-4"
            >
              Expertise
            </Link>
            <Link 
              href="/services#particuliers" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-bold text-black border-b border-black/5 pb-4"
            >
              Particuliers
            </Link>
            <Link 
              href="/services#entreprises" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-bold text-black border-b border-black/5 pb-4"
            >
              Entreprises
            </Link>
            <a 
              href="https://lb-assurmaladie-staticwebsite.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-bold text-black border-b border-black/5 pb-4"
            >
              Itoju Santé
            </a>
            <Link 
              href="/simulation"
              onClick={() => setIsMobileMenuOpen(false)}
              className="bg-black text-white text-center py-4 text-lg font-bold rounded-md mt-4"
            >
              Comparateur
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
