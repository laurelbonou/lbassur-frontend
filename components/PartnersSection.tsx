"use client";

import { motion } from "framer-motion";

const partners = [
  { name: "Sunu Assurances", logo: "/images/partners/sunu_assurance.png" },
  { name: "NSIA", logo: "/images/partners/nsia-assurance.png" },
  { name: "Sanlam Allianz", logo: "/images/partners/sanlam-allianz.png" },
  { name: "Africaine des Assurances", logo: "/images/partners/africaine-assurance.png" },
  { name: "AFG Assurances", logo: "/images/partners/afg-assurances.png" },
  { name: "CIF Assurances Vie", logo: "/images/partners/cif_assurances_vie.png" },
  { name: "GAB", logo: "/images/partners/gab.png" },
  { name: "Nobila Assurance", logo: "/images/partners/nobila-assurance.png" },
];

// Duplicate the array to create a seamless infinite loop
const duplicatedPartners = [...partners, ...partners, ...partners];

export default function PartnersSection() {
  return (
    <section className="py-24 bg-white overflow-hidden border-b border-black/5">
      <div className="container mx-auto px-6 max-w-7xl mb-16 text-center">
        <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-3"
        >
            Écosystème
        </motion.p>
        <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-black tracking-tight"
        >
            Ils Nous Font Confiance
        </motion.h2>
        <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-gray-500 font-light text-sm max-w-2xl mx-auto mt-4"
        >
            Nous sélectionnons rigoureusement nos partenaires parmi les meilleures compagnies d'assurance pour vous garantir une solvabilité et une qualité de service irréprochables.
        </motion.p>
      </div>

      <div className="relative w-full flex items-center">
        {/* Left and right gradient masks for smooth fading at the edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

        {/* The scrolling container */}
        <motion.div
          className="flex gap-16 items-center w-max"
          animate={{ x: ["0%", "-33.333333%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 30, // Adjust speed here
          }}
        >
          {duplicatedPartners.map((partner, i) => (
            <div
              key={i}
              className="flex items-center justify-center w-40 h-24 shrink-0 group"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-h-full max-w-full object-contain filter grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
