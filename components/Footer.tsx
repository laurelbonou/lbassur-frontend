"use client";

import Link from "next/link";
import { ArrowUpRight, Linkedin, Twitter, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-20 border-t border-white/5 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="block mb-6">
               <img 
                  src="/images/logo.jpg" 
                  alt="LBASSUR Logo" 
                  className="h-10 w-auto rounded-sm brightness-90"
               />
            </Link>
            <p className="text-gray-400 text-sm font-light leading-relaxed mb-6">
              Votre partenaire de confiance en courtage d'assurance au Bénin. Nous défendons vos intérêts avec indépendance et transparence.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-md bg-white/5 border border-white/10 flex items-center justify-center hover:border-white/30 hover:text-white text-gray-400 transition-all duration-300">
                <Linkedin size={14} />
              </a>
              <a href="#" className="w-8 h-8 rounded-md bg-white/5 border border-white/10 flex items-center justify-center hover:border-white/30 hover:text-white text-gray-400 transition-all duration-300">
                <Twitter size={14} />
              </a>
              <a href="#" className="w-8 h-8 rounded-md bg-white/5 border border-white/10 flex items-center justify-center hover:border-white/30 hover:text-white text-gray-400 transition-all duration-300">
                <Facebook size={14} />
              </a>
            </div>
          </div>

          {/* Links: Services */}
          <div>
            <h4 className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-6">Nos Offres</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Particuliers</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Entreprises</Link></li>
              <li><Link href="/simulation" className="text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-1 group">Comparateur <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
              <li><a href="https://lb-assurmaladie-staticwebsite.vercel.app/" target="_blank" className="text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-1 group">Itoju Santé <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" /></a></li>
            </ul>
          </div>

          {/* Links: Agence */}
          <div>
            <h4 className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-6">Le Cabinet</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Qui sommes-nous</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Notre Méthode</Link></li>
              <li><Link href="/actualites" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Actualités</Link></li>
              <li><Link href="#contact" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="text-sm text-gray-400 font-light">Quartier Zongo<br />Cotonou, Bénin</li>
              <li className="text-sm text-white font-medium">+229 21 31 15 15</li>
              <li className="text-sm text-white font-medium">contact@lbassur.com</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 font-light">
            © {new Date().getFullYear()} LBASSUR. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-gray-500 hover:text-white transition-colors duration-200">Mentions Légales</Link>
            <Link href="#" className="text-xs text-gray-500 hover:text-white transition-colors duration-200">Politique de Confidentialité</Link>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
