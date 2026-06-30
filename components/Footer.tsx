"use client";

import Link from "next/link";
import { ArrowUpRight, Linkedin, Twitter, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-20 border-t border-white/5 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          
          {/* LEFT SIDE: Links (Top) & Brand (Bottom) */}
          <div className="flex flex-col justify-between h-full">
            
            {/* Top: Links Sub-Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
              {/* Links: Services */}
              <div>
                <h4 className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-6">Nos Offres</h4>
                <ul className="space-y-4">
                  <li><a href="/#offres" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Particuliers</a></li>
                  <li><a href="/#offres" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Entreprises</a></li>
                  <li><Link href="/simulation" className="text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-1 group">Comparateur <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
                  <li><a href="https://itoju.lbassur.bj" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-1 group">Itoju Santé <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" /></a></li>
                </ul>
              </div>

              {/* Links: Agence */}
              <div>
                <h4 className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-6">Le Cabinet</h4>
                <ul className="space-y-4">
                  <li><a href="/#apropos" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Qui sommes-nous</a></li>
                  <li><a href="/#methode" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Notre Méthode</a></li>
                  <li><a href="/#actualites" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Actualités</a></li>
                  <li><a href="/#contact" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Contact</a></li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-6">Contact & Accès</h4>
                <ul className="space-y-4">
                  <li className="text-sm text-gray-400 font-light leading-relaxed">
                      N° DE PARCELLE 238, MAISON FRANCOIS BONOU<br />
                      Agblangandan, Sèmé Kpodji, Ouémé - Bénin
                  </li>
                  <li className="text-sm text-white font-medium">+229 01 52 75 55 55</li>
                  <li className="text-sm text-white font-medium">contact@lbassur.bj</li>
                </ul>
              </div>
            </div>

            {/* Bottom: Brand Info */}
            <div>
              <a href="/" className="block mb-6">
                 <img 
                    src="/images/logo.jpg" 
                    alt="LBASSUR Logo" 
                    className="h-10 w-auto rounded-sm brightness-90"
                 />
              </a>
              <p className="text-gray-400 text-sm font-light leading-relaxed mb-6 max-w-md">
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

          </div>

          {/* RIGHT SIDE: Map */}
          <div className="w-full h-[350px] lg:h-auto min-h-[350px] relative group border border-white/10">
              <iframe 
                  src="https://maps.google.com/maps?width=100%25&height=100%25&hl=fr&q=LBASSUR%20Assurance,%20Agblangandan,%20B%C3%A9nin&t=&z=15&ie=UTF8&iwloc=B&output=embed" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy"
                  className="absolute inset-0 w-full h-full filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
              ></iframe>
          </div>

        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 font-light">
            © {new Date().getFullYear()} LBASSUR SARL. Tous droits réservés.
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
