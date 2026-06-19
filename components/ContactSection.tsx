"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const corporateInfo = [
  { label: "Téléphone", value: "+229 01 52 75 55 55" },
  { label: "Siège social", value: "N° DE PARCELLE 238, MAISON FRANCOIS BONOU, Agblangandan, Sèmé Kpodji, Ouémé - Bénin" },
  { label: "Activité principale", value: "Assurance" },
  { label: "Forme juridique", value: "SARL" },
  { label: "Immatriculation RCCM", value: "RB/PNO/21 B 3312" },
  { label: "Année de création", value: "2021" },
];

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setTimeout(() => setIsSent(false), 5000);
    }, 1500);
  };

  return (
    <section className="py-32 bg-white relative overflow-hidden" id="contact">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left: Contact Info (Black Premium Card) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full lg:w-5/12 bg-black text-white p-10 md:p-14 rounded-3xl shadow-2xl relative overflow-hidden"
          >
            {/* Subtle background decoration */}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-4">// Nous contacter</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-12">
                LBASSUR
              </h2>

              <div className="space-y-6">
                {corporateInfo.map((info, idx) => (
                  <div key={idx} className="flex flex-col border-b border-white/10 pb-4 last:border-0">
                    <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-1">{info.label}</span>
                    <span className="text-sm font-medium leading-relaxed">{info.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Minimalist Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="w-full lg:w-7/12 py-10 flex flex-col justify-center"
          >
            <div className="mb-12">
                <h3 className="text-3xl md:text-4xl font-bold text-black mb-4 tracking-tight">Envoyez-nous un message</h3>
                <p className="text-gray-500 text-sm">Que vous soyez un particulier ou une entreprise, notre équipe est à votre disposition pour vous accompagner.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="relative">
                  <input 
                    type="text" 
                    id="name"
                    className="peer w-full bg-transparent border-b border-black/20 text-black px-0 py-2 text-sm focus:outline-none focus:border-black transition-colors placeholder-transparent"
                    placeholder="Nom complet"
                    required
                  />
                  <label htmlFor="name" className="absolute left-0 -top-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-black">
                    Nom complet
                  </label>
                </div>
                <div className="relative">
                  <input 
                    type="email" 
                    id="email"
                    className="peer w-full bg-transparent border-b border-black/20 text-black px-0 py-2 text-sm focus:outline-none focus:border-black transition-colors placeholder-transparent"
                    placeholder="Adresse email"
                    required
                  />
                  <label htmlFor="email" className="absolute left-0 -top-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-black">
                    Adresse email
                  </label>
                </div>
              </div>
              
              <div className="relative">
                <select 
                  id="subject"
                  className="peer w-full bg-transparent border-b border-black/20 text-black px-0 py-2 text-sm focus:outline-none focus:border-black transition-colors appearance-none cursor-pointer placeholder-transparent"
                  required
                  defaultValue=""
                >
                  <option value="" disabled className="text-gray-400">Sélectionnez un sujet</option>
                  <option value="audit">Demande d'Audit Gratuit</option>
                  <option value="devis">Demande de Devis</option>
                  <option value="sinistre">Déclaration de Sinistre</option>
                  <option value="autre">Autre demande</option>
                </select>
                <label htmlFor="subject" className="absolute left-0 -top-4 text-[10px] font-bold text-black uppercase tracking-widest transition-all">
                  Sujet de votre demande
                </label>
              </div>

              <div className="relative">
                <textarea 
                  id="message"
                  rows={4}
                  className="peer w-full bg-transparent border-b border-black/20 text-black px-0 py-2 text-sm focus:outline-none focus:border-black transition-colors resize-none placeholder-transparent"
                  placeholder="Votre message"
                  required
                />
                <label htmlFor="message" className="absolute left-0 -top-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-black">
                  Votre message
                </label>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={isSubmitting || isSent}
                  className="group bg-black text-white px-8 py-4 text-[13px] font-bold tracking-widest uppercase rounded-full hover:bg-gray-800 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 w-full md:w-auto disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Envoi en cours..." : isSent ? "Message envoyé" : "Envoyer le message"} 
                  {isSent ? <CheckCircle2 size={16} /> : <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
