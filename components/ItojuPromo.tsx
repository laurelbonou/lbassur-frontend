"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Users, ExternalLink } from "lucide-react";

export default function ItojuPromo() {
  return (
    <section className="py-32 bg-black relative overflow-hidden border-y border-white/5">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            {/* Left Side: Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-6">Innovation Santé</p>
              
              <h2 className="text-5xl md:text-7xl font-bold mb-8 text-white tracking-tight">
                Découvrez Itoju
              </h2>
              
              <p className="text-gray-400 text-lg font-light mb-10 leading-relaxed">
                Votre santé, notre priorité. <span className="text-white font-medium">Itoju</span> simplifie l'accès aux soins de qualité au Bénin. Souscrivez en 2 minutes, gérez tout depuis votre mobile et profitez de la force du réseau <span className="text-white font-medium">LBAssur</span>.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                <div className="border border-white/10 p-6 hover:border-white/20 transition-all duration-500 bg-white/[0.02] rounded-md">
                  <div className="w-10 h-10 border border-white/10 rounded-md flex items-center justify-center mb-4">
                    <Zap className="text-gray-400" size={18} />
                  </div>
                  <h4 className="text-white font-semibold text-sm mb-2">Validation Instantanée</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">Vérification immédiate des droits pour un accès direct aux soins.</p>
                </div>
                <div className="border border-white/10 p-6 hover:border-white/20 transition-all duration-500 bg-white/[0.02] rounded-md">
                  <div className="w-10 h-10 border border-white/10 rounded-md flex items-center justify-center mb-4">
                    <Shield className="text-gray-400" size={18} />
                  </div>
                  <h4 className="text-white font-semibold text-sm mb-2">Paiements Garantis</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">Sécurité et rapidité des transactions pour tous les prestataires.</p>
                </div>
              </div>

              <a 
                href="https://lb-assurmaladie-staticwebsite.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 text-[13px] font-semibold rounded-md hover:bg-gray-200 active:scale-[0.97] transition-all duration-200"
              >
                Accéder à Itoju <ExternalLink size={14} />
              </a>
            </motion.div>

            {/* Right Side: Professional Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="border border-white/10 p-12 relative group overflow-hidden bg-white/[0.02] rounded-md"
            >
              <h3 className="text-2xl font-bold text-white mb-8 tracking-tight">
                Espace Professionnels & Entreprises
              </h3>
              
              <p className="text-gray-500 mb-10 font-light leading-relaxed text-sm">
                Itoju n'est pas qu'une application pour les assurés. C'est un écosystème complet qui connecte les meilleurs prestataires de soins du Bénin.
              </p>

              <ul className="space-y-5 mb-10">
                {[
                  "Interface de gestion dédiée gratuite",
                  "Visibilité auprès de 10k+ assurés",
                  "Reporting en temps réel des prestations",
                  "Optimisation de la relation client"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 group/item">
                    <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center group-hover/item:border-white/40 transition-colors duration-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                    </div>
                    <span className="text-sm text-gray-400 group-hover/item:text-white transition-colors duration-300">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="p-6 border border-white/10 bg-white/[0.02] text-center rounded-md">
                <Users className="mx-auto mb-3 text-gray-400" size={28} />
                <p className="text-xs font-semibold text-gray-500">Rejoignez le Réseau Itoju</p>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
