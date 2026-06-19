"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

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
    <section className="py-32 bg-gray-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-white" />
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-24 max-w-2xl mx-auto">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-4"
          >
            Témoignages
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-black tracking-tight mb-8"
          >
            La parole à nos clients
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 relative group"
            >
              {/* Quote Icon Badge */}
              <div className="absolute -top-6 left-10 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Quote size={20} fill="currentColor" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-6 mt-4 text-black">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={16} fill="currentColor" className="text-black" />
                ))}
              </div>

              <p className="text-gray-600 font-light leading-relaxed mb-8 relative z-10 text-[15px] italic">
                "{testimonial.text}"
              </p>
              
              <div className="pt-6 border-t border-black/5">
                <h4 className="text-black font-bold text-sm uppercase tracking-wide">{testimonial.author}</h4>
                <p className="text-gray-500 text-xs mt-1">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
