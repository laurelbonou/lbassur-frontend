"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send } from "lucide-react";

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 2000);
  };

  return (
    <section className="py-32 bg-gray-50 border-b border-black/5 relative overflow-hidden" id="contact">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row gap-20">
          
          {/* Left: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full lg:w-5/12"
          >
            <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-4">Contact</p>
            <h2 className="text-4xl md:text-5xl font-bold text-black tracking-tight mb-8">
              Discutons de vos besoins.
            </h2>
            <p className="text-gray-600 font-light leading-relaxed mb-12 text-sm">
              Que vous soyez un particulier ou une entreprise, notre équipe d'experts est à votre disposition pour réaliser un audit gratuit de votre situation.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 border border-black/10 bg-white rounded-md flex items-center justify-center shrink-0">
                  <MapPin className="text-black" size={18} />
                </div>
                <div>
                  <h4 className="text-black font-semibold text-sm mb-1">Notre Agence</h4>
                  <p className="text-gray-500 text-sm font-light">
                    Quartier Zongo, Cotonou<br />
                    Bénin
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 border border-black/10 bg-white rounded-md flex items-center justify-center shrink-0">
                  <Phone className="text-black" size={18} />
                </div>
                <div>
                  <h4 className="text-black font-semibold text-sm mb-1">Téléphone</h4>
                  <p className="text-gray-500 text-sm font-light">+229 21 31 15 15</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 border border-black/10 bg-white rounded-md flex items-center justify-center shrink-0">
                  <Mail className="text-black" size={18} />
                </div>
                <div>
                  <h4 className="text-black font-semibold text-sm mb-1">Email</h4>
                  <p className="text-gray-500 text-sm font-light">contact@lbassur.com</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="w-full lg:w-7/12"
          >
            <div className="bg-white p-10 rounded-md border border-black/5 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Prénom & Nom</label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-50 border border-black/5 text-black px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors rounded-sm"
                      placeholder="Jean Dupont"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Email</label>
                    <input 
                      type="email" 
                      className="w-full bg-gray-50 border border-black/5 text-black px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors rounded-sm"
                      placeholder="jean@entreprise.com"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Sujet</label>
                  <select className="w-full bg-gray-50 border border-black/5 text-black px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors rounded-sm appearance-none cursor-pointer">
                    <option value="">Sélectionnez un sujet</option>
                    <option value="audit">Demande d'Audit Gratuit</option>
                    <option value="devis">Demande de Devis</option>
                    <option value="sinistre">Déclaration de Sinistre</option>
                    <option value="autre">Autre demande</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Message</label>
                  <textarea 
                    rows={4}
                    className="w-full bg-gray-50 border border-black/5 text-black px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors rounded-sm resize-none"
                    placeholder="Comment pouvons-nous vous aider ?"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-black text-white px-8 py-3 text-[13px] font-semibold rounded-md hover:bg-gray-800 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 w-full disabled:opacity-70"
                >
                  {isSubmitting ? "Envoi en cours..." : "Envoyer le message"} <Send size={14} />
                </button>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
