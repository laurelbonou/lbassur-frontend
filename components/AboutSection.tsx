"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Compass, Target, Award, ArrowLeft, ArrowRight } from "lucide-react";

const aboutData = [
    {
        title: "À Propos",
        icon: Users,
        image: "/images/a propos.png",
        description: "Fort de notre expérience au Bénin, notre cabinet s'engage à vous fournir des conseils transparents et des solutions sur mesure. Nous bâtissons des relations de confiance à long terme, basées sur la proximité et l'écoute."
    },
    {
        title: "Notre Vision",
        icon: Compass,
        image: "/images/notre vision.png",
        description: "Devenir le courtier de référence au Bénin et en Afrique de l'Ouest, reconnu pour son innovation, son expertise pointue et des solutions d'assurance adaptées aux réalités locales."
    },
    {
        title: "Nos Missions",
        icon: Target,
        image: "/images/nos-missions.png",
        description: "Défendre vos intérêts avec indépendance, vous accompagner dans la gestion globale de vos risques et vous garantir les meilleures couvertures au prix le plus juste."
    },
    {
        title: "Nos Valeurs",
        icon: Award,
        image: "/images/nos valeurs.png",
        description: "Transparence, intégrité, réactivité et excellence. Nous plaçons systématiquement l'humain au centre de toutes nos décisions et de notre accompagnement au quotidien, pour vous offrir un service inégalé."
    }
];

export default function AboutSection() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScrollButtons = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 5);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
            
            const totalScrollable = scrollWidth - clientWidth;
            if (totalScrollable > 0) {
                setScrollProgress((scrollLeft / totalScrollable) * 100);
            }
        }
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (el) {
            el.addEventListener("scroll", checkScrollButtons);
            // Run initial check
            checkScrollButtons();
            
            // Re-run check on window resize
            window.addEventListener("resize", checkScrollButtons);
        }
        return () => {
            if (el) el.removeEventListener("scroll", checkScrollButtons);
            window.removeEventListener("resize", checkScrollButtons);
        };
    }, []);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            // Scroll by one card's approximate width + gap (approx 450px)
            const scrollAmount = clientWidth < 768 ? clientWidth * 0.85 : 450;
            const scrollTo = direction === "left" 
                ? scrollLeft - scrollAmount 
                : scrollLeft + scrollAmount;
            
            scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    };

    return (
        <section id="apropos" className="py-24 bg-white relative overflow-hidden">
            {/* Background subtle dots grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            
            {/* Decorative subtle top light glow */}
            <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-black/10 to-transparent"></div>

            <div className="container mx-auto px-6 max-w-[1400px] relative z-10">
                <div className="mb-12 relative flex items-center justify-center">
                    <div className="text-center w-full max-w-3xl mx-auto">
                        <p className="text-[11px] text-gray-600 uppercase tracking-widest font-semibold mb-2">Qui Sommes-Nous</p>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900 tracking-tight">
                            L'Humain au cœur du Courtage
                        </h2>
                    </div>
                    
                    {/* Navigation Buttons (visible on md+) */}
                    <div className="hidden md:flex items-center gap-3 absolute right-0">
                        <button
                            onClick={() => scroll("left")}
                            disabled={!canScrollLeft}
                            className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 ${
                                canScrollLeft 
                                    ? "border-black/10 bg-black/5 text-black hover:bg-black hover:text-white hover:border-black cursor-pointer" 
                                    : "border-black/5 text-black/20 cursor-not-allowed"
                            }`}
                            aria-label="Défiler vers la gauche"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            disabled={!canScrollRight}
                            className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 ${
                                canScrollRight 
                                    ? "border-black/10 bg-black/5 text-black hover:bg-black hover:text-white hover:border-black cursor-pointer" 
                                    : "border-black/5 text-black/20 cursor-not-allowed"
                            }`}
                            aria-label="Défiler vers la droite"
                        >
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Carousel Card Container */}
                <div 
                    ref={scrollRef}
                    className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                    {aboutData.map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true, margin: "-50px" }}
                                className="min-w-[85vw] sm:min-w-[50vw] md:min-w-[350px] lg:min-w-[400px] snap-center h-[450px] sm:h-[500px] rounded-3xl overflow-hidden relative group cursor-pointer border border-white/10 bg-zinc-950 flex flex-col justify-between p-8"
                            >
                                {/* Background Image */}
                                <img 
                                    src={item.image} 
                                    alt={item.title} 
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105 z-0 brightness-[0.4] group-hover:brightness-[0.3] grayscale group-hover:grayscale-0"
                                />
                                
                                {/* Dark Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-[1]" />
                                
                                {/* Top Content: Icon badge */}
                                <div className="relative z-10 self-start">
                                    <div className="w-12 h-12 sm:w-14 h-14 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:bg-white group-hover:text-black group-hover:scale-110 transition-all duration-500">
                                        <IconComponent size={24} className="transition-transform duration-500" />
                                    </div>
                                </div>
                                
                                {/* Bottom Content: Text */}
                                <div className="relative z-10">
                                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-3 transition-colors duration-300">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light group-hover:text-white transition-colors duration-300">
                                        {item.description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Progress Scroll Indicator */}
                <div className="w-full max-w-[160px] mx-auto h-[2px] bg-black/10 rounded-full mt-4 overflow-hidden relative">
                    <div 
                        className="absolute top-0 bottom-0 left-0 bg-black/60 rounded-full transition-all duration-150"
                        style={{ width: `${scrollProgress}%` }}
                    />
                </div>
            </div>
        </section>
    );
}

