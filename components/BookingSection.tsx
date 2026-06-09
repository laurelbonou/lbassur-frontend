"use client";

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, Clock, Video, MessageSquare, ChevronRight, Mail, CheckCircle2, Loader2 } from "lucide-react";

function getNextWorkdays(count: number) {
    const dayNames   = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
    const monthNames = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];
    const result: { label: string; day: string; month: string }[] = [];
    const d = new Date();
    d.setDate(d.getDate() + 1);
    while (result.length < count) {
        const dow = d.getDay();
        if (dow !== 0 && dow !== 6) {
            result.push({
                label: dayNames[dow],
                day:   String(d.getDate()).padStart(2, "0"),
                month: monthNames[d.getMonth()],
            });
        }
        d.setDate(d.getDate() + 1);
    }
    return result;
}

export default function BookingSection() {
    const [step, setStep] = useState(1);
    const [selectedType, setSelectedType] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const formRef = useRef<HTMLFormElement>(null);

    const dates = useMemo(() => getNextWorkdays(5), []);

    const types = [
        { id: "audit",   title: "Audit de Contrat",   desc: "Analyse experte de vos risques",           icon: CalendarIcon },
        { id: "devis",   title: "Demande de Devis",   desc: "Auto, Santé, Habitation, Pro",             icon: Video },
        { id: "contact", title: "Question Générale",  desc: "Demande d'information ou support",         icon: MessageSquare },
    ];

    const timeSlots = ["09:00", "10:30", "14:00", "15:30", "17:00"];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formRef.current) return;

        const data = new FormData(formRef.current);
        setFormStatus("loading");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name:        data.get("name"),
                    phone:       data.get("phone"),
                    email:       data.get("email"),
                    message:     data.get("message"),
                    serviceType: selectedType,
                    date:        selectedDate,
                    time:        selectedTime,
                }),
            });

            setFormStatus(res.ok ? "success" : "error");
        } catch {
            setFormStatus("error");
        }
    };

    const resetForm = () => {
        setFormStatus("idle");
        setStep(1);
        setSelectedType("");
        setSelectedDate("");
        setSelectedTime("");
        formRef.current?.reset();
    };

    if (formStatus === "success") {
        return (
            <section id="booking" className="py-32 bg-black text-white border-b border-white/5 flex items-center justify-center min-h-[600px]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="text-center px-6"
                >
                    <div className="w-20 h-20 border border-blue-500/30 bg-blue-500/5 flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 size={32} className="text-blue-400" />
                    </div>
                    <h2 className="text-4xl font-bold font-oswald uppercase mb-4 tracking-tight">Demande Envoyée</h2>
                    <p className="text-gray-400 max-w-sm mx-auto mb-10 text-sm font-light leading-relaxed">
                        Votre demande a bien été reçue. Notre équipe vous contactera
                        dans les plus brefs délais pour confirmer votre rendez-vous.
                    </p>
                    <button
                        onClick={resetForm}
                        className="px-10 py-4 bg-white text-black text-[11px] font-bold uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        Nouvelle demande
                    </button>
                </motion.div>
            </section>
        );
    }

    return (
        <section id="booking" className="py-32 bg-black text-white border-b border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/[0.03] rounded-full blur-[140px] pointer-events-none" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                {/* Header */}
                <div className="mb-20">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="label text-blue-500/60 mb-4 block"
                    >
                        Réservation Directe
                    </motion.span>
                    <h2 className="text-4xl md:text-6xl font-bold uppercase font-oswald tracking-tight leading-none mb-6">
                        Planifier une <span className="text-gradient-blue">Session</span>
                    </h2>
                    <p className="text-gray-400 max-w-xl text-base leading-relaxed font-light">
                        Accédez à l'expertise LBASSUR instantanément. Sélectionnez votre créneau
                        et laissez-nous sécuriser votre futur.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-16 items-start">

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-4">
                        {/* Progress */}
                        <div className="border border-white/5 bg-white/[0.02] p-8">
                            <p className="label text-gray-600 mb-8 pb-4 border-b border-white/5">Progression</p>
                            <div className="space-y-6">
                                {[
                                    { s: 1, label: "Configuration" },
                                    { s: 2, label: "Planification" },
                                    { s: 3, label: "Validation" }
                                ].map((item) => (
                                    <div key={item.s} className="flex items-center gap-4">
                                        <div className={`w-8 h-8 flex items-center justify-center text-[11px] font-bold transition-all duration-500 ${
                                            step >= item.s
                                                ? "bg-blue-500 text-white"
                                                : "border border-white/10 text-gray-700"
                                        }`}>
                                            {item.s}
                                        </div>
                                        <div>
                                            <span className={`text-[11px] uppercase font-bold tracking-[0.2em] transition-colors duration-500 ${
                                                step >= item.s ? "text-white" : "text-gray-700"
                                            }`}>
                                                {item.label}
                                            </span>
                                            {step === item.s && (
                                                <p className="text-[10px] text-blue-400 mt-0.5">En cours…</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contact card */}
                        <div className="border border-white/5 bg-white/[0.02] p-8 group hover:border-blue-500/20 transition-colors duration-500">
                            <div className="w-8 h-8 border border-white/10 flex items-center justify-center mb-5 group-hover:border-blue-500/30 transition-colors duration-500">
                                <Mail size={14} className="text-gray-600 group-hover:text-blue-400 transition-colors duration-500" />
                            </div>
                            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white mb-2">Ligne Prioritaire</h4>
                            <p className="text-[11px] text-gray-500 leading-relaxed font-light mb-4">
                                Pour une assistance d'urgence ou une entreprise :
                            </p>
                            <span className="text-white font-bold text-sm tracking-widest">+229 XX XX XX XX</span>
                        </div>

                        {/* Agency photo */}
                        <div className="border border-white/5 overflow-hidden group">
                            <div className="relative h-44">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                <div className="absolute bottom-4 left-4 z-10">
                                    <p className="label text-blue-400 mb-1 drop-shadow-md">Votre Courtier de Confiance</p>
                                    <p className="text-xs text-gray-300 font-light drop-shadow-md">Cotonou, Bénin</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main form area */}
                    <div className="lg:col-span-8 border border-white/5 bg-white/[0.02] p-8 md:p-12 relative min-h-[560px] overflow-hidden">
                        <AnimatePresence mode="wait">
                            {/* Step 1 — Service selection */}
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -16 }}
                                    transition={{ duration: 0.4 }}
                                    className="space-y-8"
                                >
                                    <div>
                                        <h3 className="text-xl font-bold uppercase font-oswald text-white mb-2 tracking-wide">
                                            Sélectionner un Service
                                        </h3>
                                        <p className="text-gray-500 text-sm font-light">
                                            Identifiez la nature de votre besoin.
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        {types.map((t) => (
                                            <button
                                                key={t.id}
                                                onClick={() => { setSelectedType(t.id); setStep(2); }}
                                                className={`group w-full flex items-center gap-6 p-6 border transition-all duration-500 text-left ${
                                                    selectedType === t.id
                                                        ? "bg-blue-500/[0.07] border-blue-500/40"
                                                        : "bg-transparent border-white/5 hover:border-white/15 hover:bg-white/[0.02]"
                                                }`}
                                            >
                                                <div className={`w-10 h-10 flex items-center justify-center border transition-all duration-500 ${
                                                    selectedType === t.id
                                                        ? "bg-blue-500 border-blue-500 text-white"
                                                        : "border-white/10 text-gray-600 group-hover:text-white group-hover:border-white/20"
                                                }`}>
                                                    <t.icon size={16} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white mb-1">{t.title}</p>
                                                    <p className="text-[11px] text-gray-500 font-light">{t.desc}</p>
                                                </div>
                                                <ChevronRight
                                                    size={16}
                                                    className={`transition-all duration-400 ${
                                                        selectedType === t.id ? "text-blue-400" : "text-gray-800 opacity-0 group-hover:opacity-100"
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2 — Calendar */}
                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -16 }}
                                    transition={{ duration: 0.4 }}
                                    className="space-y-10"
                                >
                                    <div>
                                        <h3 className="text-xl font-bold uppercase font-oswald text-white mb-2 tracking-wide">
                                            Disponibilités
                                        </h3>
                                        <p className="text-gray-500 text-sm font-light">Calendrier synchronisé en temps réel.</p>
                                    </div>

                                    <div className="flex gap-3 overflow-x-auto pb-2">
                                        {dates.map((d) => {
                                            const key = `${d.label} ${d.day} ${d.month}`;
                                            const active = selectedDate === key;
                                            return (
                                                <button
                                                    key={d.day}
                                                    onClick={() => setSelectedDate(key)}
                                                    className={`flex-shrink-0 w-20 p-4 border flex flex-col items-center gap-2 transition-all duration-500 ${
                                                        active
                                                            ? "bg-blue-500 border-blue-500"
                                                            : "border-white/5 hover:border-white/15 bg-transparent"
                                                    }`}
                                                >
                                                    <span className={`text-[9px] uppercase font-bold tracking-widest ${active ? "text-blue-100" : "text-gray-600"}`}>
                                                        {d.label}
                                                    </span>
                                                    <span className={`text-2xl font-black font-oswald ${active ? "text-white" : "text-gray-400"}`}>
                                                        {d.day}
                                                    </span>
                                                    <span className={`text-[9px] uppercase font-bold tracking-widest ${active ? "text-blue-100" : "text-gray-600"}`}>
                                                        {d.month}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div>
                                        <p className="label text-gray-600 mb-6">Créneaux Horaires</p>
                                        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                                            {timeSlots.map((time) => (
                                                <button
                                                    key={time}
                                                    onClick={() => setSelectedTime(time)}
                                                    className={`py-3 border text-[11px] font-bold tracking-widest transition-all duration-400 ${
                                                        selectedTime === time
                                                            ? "bg-white text-black border-white"
                                                            : "border-white/5 text-gray-500 hover:border-white/20 hover:text-white"
                                                    }`}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-8 border-t border-white/5">
                                        <button
                                            onClick={() => setStep(1)}
                                            className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-600 hover:text-white transition-colors"
                                        >
                                            ← Retour
                                        </button>
                                        <button
                                            disabled={!selectedDate || !selectedTime}
                                            onClick={() => setStep(3)}
                                            className={`px-10 py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all ${
                                                selectedDate && selectedTime
                                                    ? "bg-white text-black hover:scale-[1.02] active:scale-95"
                                                    : "opacity-20 cursor-not-allowed border border-white/10 text-white"
                                            }`}
                                        >
                                            Étape Suivante
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3 — Contact form */}
                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -16 }}
                                    transition={{ duration: 0.4 }}
                                    className="space-y-8"
                                >
                                    <div>
                                        <h3 className="text-xl font-bold uppercase font-oswald text-white mb-2 tracking-wide">
                                            Informations Finales
                                        </h3>
                                        <p className="text-gray-500 text-sm font-light">La sécurité de vos données est notre priorité.</p>
                                    </div>

                                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                                        {/* Booking summary */}
                                        <div className="flex items-center justify-between p-5 border border-blue-500/20 bg-blue-500/[0.03]">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 border border-blue-500/30 flex items-center justify-center">
                                                    <Clock size={14} className="text-blue-400" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] uppercase font-bold text-blue-400/60 tracking-widest mb-1">Configuration Active</p>
                                                    <p className="text-xs font-bold text-white tracking-wider uppercase">{selectedDate} — {selectedTime}</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setStep(2)}
                                                className="text-[9px] font-black uppercase text-blue-400 hover:text-blue-300 tracking-widest transition-colors"
                                            >
                                                Modifier
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase font-bold text-gray-600 tracking-widest">Identité</label>
                                                <input
                                                    required type="text" name="name"
                                                    className="w-full bg-transparent border border-white/8 p-4 text-white text-sm outline-none focus:border-blue-500/40 transition-colors duration-400 placeholder:text-gray-800"
                                                    placeholder="Nom complet"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase font-bold text-gray-600 tracking-widest">Téléphone</label>
                                                <input
                                                    required type="tel" name="phone"
                                                    className="w-full bg-transparent border border-white/8 p-4 text-white text-sm outline-none focus:border-blue-500/40 transition-colors duration-400 placeholder:text-gray-800"
                                                    placeholder="+229 XX XX XX XX"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-bold text-gray-600 tracking-widest">Email</label>
                                            <input
                                                required type="email" name="email"
                                                className="w-full bg-transparent border border-white/8 p-4 text-white text-sm outline-none focus:border-blue-500/40 transition-colors duration-400 placeholder:text-gray-800"
                                                placeholder="exemple@entreprise.com"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-bold text-gray-600 tracking-widest">Précisions</label>
                                            <textarea
                                                rows={4} name="message"
                                                className="w-full bg-transparent border border-white/8 p-4 text-white text-sm outline-none focus:border-blue-500/40 transition-colors duration-400 placeholder:text-gray-800 resize-none font-light leading-relaxed"
                                                placeholder="Quel est le contexte de votre demande ?"
                                            />
                                        </div>

                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative flex-shrink-0">
                                                <input required type="checkbox" className="peer w-4 h-4 opacity-0 absolute cursor-pointer" />
                                                <div className="w-4 h-4 border border-white/20 peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all" />
                                            </div>
                                            <span className="text-[10px] text-gray-600 uppercase font-bold tracking-widest group-hover:text-gray-400 transition-colors">
                                                Accepter la politique de confidentialité
                                            </span>
                                        </label>

                                        {formStatus === "error" && (
                                            <p className="text-xs text-red-400 border border-red-500/20 bg-red-500/5 p-4">
                                                Une erreur est survenue. Veuillez réessayer ou nous contacter directement.
                                            </p>
                                        )}

                                        <div className="flex justify-between items-center pt-6 border-t border-white/5">
                                            <button
                                                type="button"
                                                onClick={() => setStep(2)}
                                                className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-600 hover:text-white transition-colors"
                                            >
                                                ← Retour
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={formStatus === "loading"}
                                                className="px-12 py-4 bg-blue-600 text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-blue-500 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(59,130,246,0.25)] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 flex items-center gap-3"
                                            >
                                                {formStatus === "loading" ? (
                                                    <>
                                                        <Loader2 size={14} className="animate-spin" />
                                                        Envoi en cours…
                                                    </>
                                                ) : "Valider Rendez-vous"}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
