import Link from "next/link";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer id="footer" className="bg-black text-white pt-20 pb-12 px-6 border-t border-white/5 relative overflow-hidden">
            <div className="container mx-auto max-w-7xl">
                {/* Main row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-16 border-b border-white/5">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-4 mb-5">
                            <img
                                src="/images/logo.jpg"
                                alt="LBASSUR"
                                className="h-9 w-auto object-contain rounded-full grayscale hover:grayscale-0 transition-all duration-700"
                            />
                            <span className="text-lg font-bold uppercase tracking-[0.15em]">LBASSUR</span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed font-light max-w-xs">
                            Votre courtier de confiance au Bénin. Solutions d'assurance sur mesure
                            pour particuliers et entreprises.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <p className="text-[11px] text-gray-600 font-semibold uppercase tracking-widest mb-6">Navigation</p>
                        <div className="space-y-3">
                            {[
                                { label: "Comparer les offres", href: "/compare" },
                                { label: "Simulation",          href: "/simulation" },
                                { label: "Nos services",        href: "/services" },
                                { label: "A propos",            href: "/a-propos" },
                                { label: "Contact",             href: "/#contact-section" },
                            ].map((l) => (
                                <Link
                                    key={l.label}
                                    href={l.href}
                                    className="block text-sm text-gray-400 hover:text-white transition-colors duration-300"
                                >
                                    {l.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Legal */}
                    <div>
                        <p className="text-[11px] text-gray-600 font-semibold uppercase tracking-widest mb-6">Légal</p>
                        <div className="space-y-3">
                            {[
                                { label: "Mentions Légales",          href: "/mentions-legales" },
                                { label: "Politique de Confidentialité", href: "/politique-confidentialite" },
                                { label: "Support",                   href: "#contact-section" },
                            ].map((l) => (
                                <Link
                                    key={l.label}
                                    href={l.href}
                                    className="block text-sm text-gray-400 hover:text-white transition-colors duration-300"
                                >
                                    {l.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom row */}
                <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[12px] text-gray-600">
                        &copy; {year} LBASSUR · Tous droits réservés
                    </p>

                    <div className="flex flex-col items-center gap-1 opacity-40 hover:opacity-80 transition-opacity duration-700">
                        <p className="text-[11px] text-gray-500">
                            Engineered by <span className="text-white font-semibold">floridev07</span>
                        </p>
                        <p className="text-[10px] text-gray-600">
                            A <span className="text-gray-400 font-semibold">Floritech, Inc.</span> brand
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
