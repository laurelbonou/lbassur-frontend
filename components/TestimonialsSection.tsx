"use client";

import { motion } from "framer-motion";

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
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-20 text-center max-w-2xl mx-auto">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[10px] text-black uppercase tracking-widest font-bold mb-4"
          >
            // Témoignages
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold text-black tracking-tighter"
          >
            La parole à nos clients.
          </motion.h2>
        </div>

        {/* Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black border-y border-black">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-10 md:p-12 lg:p-16 relative flex flex-col justify-between group hover:bg-black hover:text-white transition-colors duration-500"
            >
              <div>
                {/* Large Editorial Quote Mark */}
                <span className="text-7xl font-serif leading-none absolute top-6 left-6 opacity-20 group-hover:opacity-100 transition-opacity">
                  "
                </span>
                <p className="font-medium leading-relaxed text-lg relative z-10 mt-6">
                  {testimonial.text}
                </p>
              </div>
              
              <div className="pt-12 mt-12 border-t border-black/20 group-hover:border-white/20 transition-colors">
                <h4 className="font-bold text-xs uppercase tracking-widest">{testimonial.author}</h4>
                <p className="text-sm opacity-60 mt-1 italic">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
