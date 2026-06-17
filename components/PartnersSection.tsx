"use client";

import { motion } from "framer-motion";

const partners = [
  { name: "Sunu Assurances", logo: "/images/lba/Sanstitre-1_0003_Calque-2.jpg" },
  { name: "NSIA", logo: "/images/lba/Sanstitre-1_0004_Calque-1.jpg" },
  { name: "Allianz", logo: "/images/lba/Sanstitre-1_0002_Calque-3.jpg" },
  { name: "Africaine des Assurances", logo: "/images/lba/Sanstitre-1_0000_Calque-5.jpg" },
  { name: "Sanlam", logo: "/images/lba/Sanstitre-1_0001_Calque-4.jpg" },
];

export default function PartnersSection() {
  return (
    <section className="py-24 bg-gray-50 border-b border-black/5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-16">
          <div className="md:w-1/3">
            <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-3">Écosystème</p>
            <h2 className="text-3xl font-bold text-black tracking-tight">
              Nos Partenaires de Confiance
            </h2>
          </div>
          <div className="md:w-1/2">
            <p className="text-gray-600 font-light text-sm leading-relaxed">
              Nous sélectionnons rigoureusement nos partenaires parmi les meilleures compagnies d'assurance pour vous garantir une solvabilité et une qualité de service irréprochables.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-black/5 border border-black/5 rounded-md overflow-hidden">
          {partners.map((partner, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 flex items-center justify-center h-32 group"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-h-full max-w-full object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
