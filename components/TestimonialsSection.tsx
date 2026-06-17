"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    text: "Une réactivité exceptionnelle. Lors de notre dernier sinistre, LBASSUR a géré tout le dossier avec l'expert en moins de 48h.",
    author: "Marc D.",
    role: "Directeur Logistique",
  },
  {
    text: "L'application Itoju a complètement changé la façon dont mes employés accèdent aux soins. C'est fluide, rapide et transparent.",
    author: "Sophie T.",
    role: "DRH, TechCorp Bénin",
  },
  {
    text: "Leur audit a révélé des failles dans nos anciens contrats. Aujourd'hui, nous sommes mieux couverts et nous avons réduit nos coûts de 15%.",
    author: "Jean-Paul K.",
    role: "Chef d'Entreprise",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-32 bg-gray-50 border-b border-black/5 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-4">Témoignages</p>
          <h2 className="text-4xl md:text-5xl font-bold text-black tracking-tight mb-8">
            La parole à nos clients
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="p-10 border border-black/5 bg-white rounded-md hover:shadow-lg transition-shadow duration-500 relative group"
            >
              <Quote className="text-black/10 absolute top-8 right-8 group-hover:text-black/20 transition-colors duration-500" size={40} />
              <p className="text-gray-600 font-light leading-relaxed mb-8 relative z-10 text-sm">
                "{testimonial.text}"
              </p>
              <div>
                <h4 className="text-black font-bold text-sm">{testimonial.author}</h4>
                <p className="text-gray-500 text-xs mt-1">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
