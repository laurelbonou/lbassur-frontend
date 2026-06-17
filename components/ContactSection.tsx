"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Clock } from "lucide-react";

export default function ContactSection() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("loading");

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.success) {
                setStatus("success");
                setTimeout(() => setStatus("idle"), 8000);
                (e.target as HTMLFormElement).reset();
            } else {
                setStatus("error");
                setTimeout(() => setStatus("idle"), 5000);
            }
        } catch (error) {
            console.error("Erreur envoi:", error);
            setStatus("error");
            setTimeout(() => setStatus("idle"), 5000);
        }
    };

    return (
        <section id="contact-section" className="relative py-32 px-6 bg-black overflow-hidden border-t border-white/5">
            <div className="relative z-10 container mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="mb-20 text-center"
                >
                    <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-4">Ligne Directe</p>
                    <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">
                        Contactez-Nous
                    </h2>
                    <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed font-light">
                        Expertise, Conseil et Réactivité. Notre équipe est à votre disposition pour sécuriser l'avenir de vos projets.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">

                    {/* Form Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                    >
                        {status === "success" ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-full flex flex-col items-center justify-center border border-white/10 p-16 text-center bg-white/[0.02]"
                            >
                                <div className="w-20 h-20 border border-white/20 rounded-full flex items-center justify-center mb-8">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                                <h3 className="text-3xl font-bold mb-4 text-white">Transmission Réussie</h3>
                                <p className="text-gray-400 font-light leading-relaxed">Nous avons bien reçu votre message. <br />Réponse estimée : &lt; 2 heures.</p>
                                <button onClick={() => setStatus("idle")} className="mt-8 text-gray-400 text-sm hover:text-white transition-colors underline underline-offset-4">Envoyer un autre message</button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6 border border-white/10 p-10 md:p-14 bg-white/[0.02]">
                                {status === "error" && (
                                    <div className="p-4 border border-red-500/20 text-red-400 text-xs mb-6 text-center bg-red-500/5">
                                        Une erreur est survenue. Veuillez réessayer ou nous contacter par téléphone.
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Nom</label>
                                        <input name="name" required type="text" className="w-full bg-transparent border border-white/10 focus:border-white/40 p-4 text-white text-sm outline-none transition-all duration-300 placeholder:text-gray-700 rounded-md" placeholder="Nom complet" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Email</label>
                                        <input name="email" required type="email" className="w-full bg-transparent border border-white/10 focus:border-white/40 p-4 text-white text-sm outline-none transition-all duration-300 placeholder:text-gray-700 rounded-md" placeholder="email@exemple.com" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Objet</label>
                                    <input name="subject" required type="text" className="w-full bg-transparent border border-white/10 focus:border-white/40 p-4 text-white text-sm outline-none transition-all duration-300 placeholder:text-gray-700 rounded-md" placeholder="Nature de votre demande" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Message</label>
                                    <textarea name="message" required rows={5} className="w-full bg-transparent border border-white/10 focus:border-white/40 p-4 text-white text-sm outline-none transition-all duration-300 resize-none font-light leading-relaxed placeholder:text-gray-700 rounded-md" placeholder="Comment pouvons-nous vous accompagner ?"></textarea>
                                </div>

                                <button
                                    disabled={status === "loading"}
                                    type="submit"
                                    className="w-full bg-white text-black py-4 text-[13px] font-semibold rounded-md hover:bg-gray-200 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                >
                                    {status === "loading" ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                                            Transmission...
                                        </>
                                    ) : "Envoyer le message"}
                                </button>
                            </form>
                        )}
                    </motion.div>

                    {/* Info Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                        className="flex flex-col justify-center space-y-10"
                    >
                        <div className="flex items-start gap-5 group">
                            <div className="w-12 h-12 border border-white/10 rounded-md flex items-center justify-center transition-all duration-500 group-hover:border-white/30">
                                <MapPin className="text-gray-400" size={20} />
                            </div>
                            <div>
                                <h4 className="text-base font-semibold text-white mb-1">Siège Social</h4>
                                <p className="text-gray-500 text-sm">Cotonou, C/ 238 Le Bélier, Bénin</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-5 group">
                            <div className="w-12 h-12 border border-white/10 rounded-md flex items-center justify-center transition-all duration-500 group-hover:border-white/30">
                                <Phone className="text-gray-400" size={20} />
                            </div>
                            <div>
                                <h4 className="text-base font-semibold text-white mb-1">Téléphone</h4>
                                <p className="text-gray-500 text-sm">+229 XX XX XX XX</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-5 group">
                            <div className="w-12 h-12 border border-white/10 rounded-md flex items-center justify-center transition-all duration-500 group-hover:border-white/30">
                                <Mail className="text-gray-400" size={20} />
                            </div>
                            <div>
                                <h4 className="text-base font-semibold text-white mb-1">Email</h4>
                                <p className="text-gray-500 text-sm">contact@lbassur.com</p>
                            </div>
                        </div>

                        <div className="border border-white/10 p-8 bg-white/[0.02] rounded-md relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                               <Clock className="animate-pulse" size={40} />
                           </div>
                           <h4 className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 mb-6 border-b border-white/5 pb-4">Horaires</h4>
                           <div className="grid grid-cols-1 gap-4">
                               <div className="flex justify-between items-center">
                                   <span className="text-sm font-medium text-white">Lundi — Vendredi</span>
                                   <span className="text-sm text-gray-500">08:00 — 17:00</span>
                               </div>
                               <div className="flex justify-between items-center opacity-40">
                                    <span className="text-sm text-gray-400">W-E & Fériés</span>
                                    <span className="text-sm text-gray-600">Fermé</span>
                               </div>
                           </div>
                        </div>

                    </motion.div>
                </div>
            </div>
        </section>
    );
}
