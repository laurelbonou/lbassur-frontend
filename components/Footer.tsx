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
                  <li><Link href="/#offres" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Particuliers</Link></li>
                  <li><Link href="/#offres" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Entreprises</Link></li>
                  <li><Link href="/simulation" className="text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-1 group">Comparateur <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
                  <li><a href="https://lb-assurmaladie-staticwebsite.vercel.app/" target="_blank" className="text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-1 group">Itoju Santé <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" /></a></li>
                </ul>
              </div>

              {/* Links: Agence */}
              <div>
                <h4 className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-6">Le Cabinet</h4>
                <ul className="space-y-4">
                  <li><Link href="/#apropos" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Qui sommes-nous</Link></li>
                  <li><Link href="/#methode" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Notre Méthode</Link></li>
                  <li><Link href="/#actualites" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Actualités</Link></li>
                  <li><Link href="/#contact" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Contact</Link></li>
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
              <Link href="/" className="block mb-6">
                 <img 
                    src="/images/logo.jpg" 
                    alt="LBASSUR Logo" 
                    className="h-10 w-auto rounded-sm brightness-90"
                 />
              </Link>
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
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31728.89134988086!2d2.4616229!3d6.3719005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x102355c709772ba3%3A0x1d2c6c0e5a6dc60!2sAgblangandan%2C%20Benin!5e0!3m2!1sfr!2sfr!4v1680000000000!5m2!1sfr!2sfr" 
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
