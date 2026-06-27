"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Globe, MapPin, Phone } from "lucide-react";

export default function InsurerDetailsPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [insurer, setInsurer] = useState<any>(null);
    const [offers, setOffers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ins = await api.getInsurerBySlug(slug);
                setInsurer(ins);
                const offs = await api.getOffers({ insurerSlug: slug });
                setOffers(Array.isArray(offs) ? offs : (offs.data || ins.offers || []));
            } catch (error) {
                console.error("Failed to load insurer data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    if (loading) return <main className="bg-black text-white min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin"></div></main>;
    if (!insurer) return <main className="bg-black text-white min-h-screen flex items-center justify-center"><div>Assureur non trouvé.</div></main>;

    return (
        <main className="bg-black text-white min-h-screen">
            <Navbar />

            <div className="pt-32 pb-24 container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Info */}
                    <div className="lg:w-1/3">
                        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl sticky top-32">
                            <div className="w-24 h-24 bg-white border border-zinc-800 rounded-full flex items-center justify-center mb-6 mx-auto lg:mx-0 overflow-hidden">
                                {insurer.logoUrl ? (
                                    <img src={insurer.logoUrl} alt={`Logo ${insurer.name}`} className="w-full h-full object-contain p-3" />
                                ) : (
                                    <span className="text-xs font-bold text-gray-500">LOGO</span>
                                )}
                            </div>
                            <h1 className="text-3xl font-bold font-oswald uppercase mb-4 text-white">{insurer.name}</h1>
                            <p className="text-gray-400 mb-8 leading-relaxed italic">"{insurer.description}"</p>

                            <div className="space-y-4 pt-8 border-t border-zinc-800 text-sm">
                                {insurer.website && <div className="flex items-center gap-3">
                                    <Globe size={18} className="text-gray-500" />
                                    <a href={insurer.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 hover:underline">{insurer.website.replace(/^https?:\/\//, "")}</a>
                                </div>}
                                <div className="flex items-center gap-3">
                                    <MapPin size={18} className="text-gray-500" />
                                    <span className="text-gray-300">{insurer.address || "Adresse non renseignée"}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone size={18} className="text-gray-500" />
                                    {insurer.phone ? <a href={`tel:${insurer.phone}`} className="text-gray-300 hover:text-white">{insurer.phone}</a> : <span className="text-gray-500">Téléphone non renseigné</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:w-2/3">
                        <h2 className="text-2xl font-bold font-oswald uppercase mb-8 pb-4 border-b border-zinc-800 text-white">Nos Offres Actuelles</h2>

                        <div className="space-y-6">
                            {offers.length > 0 ? offers.map(offer => (
                                <div key={offer.id} className="p-8 border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 transition-all rounded-xl">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-1 block">{offer.insuranceTypeLabel}</span>
                                            <h3 className="text-xl font-bold uppercase text-white">{offer.insuranceSubType || "Garantie Standard"}</h3>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xl font-black text-white">{offer.premium.toLocaleString()} FCFA</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-xs">
                                        <div><span className="text-gray-500 mr-2">Carence:</span> <span className="text-gray-300">{offer.waitingPeriod}</span></div>
                                        <div><span className="text-gray-500 mr-2">Franchise:</span> <span className="text-gray-300">{offer.franchise.toLocaleString()} FCFA</span></div>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-gray-500 italic">Aucune offre détaillée répertoriée pour le moment.</p>
                            )}
                        </div>

                        <div className="mt-16">
                            <h2 className="text-2xl font-bold font-oswald uppercase mb-8 text-white">À propos de {insurer.name}</h2>
                            <div className="prose prose-invert max-w-none text-gray-400 leading-relaxed font-light">
                                <p>
                                    {insurer.name} est présent sur le marché béninois depuis plusieurs décennies, offrant des produits adaptés aux réalités locales.
                                    Reconnue pour la qualité de son service client et sa rapidité d'indemnisation, la compagnie se classe parmi les leaders du secteur {insurer.categories?.join(' & ') || "de l'assurance"}.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
