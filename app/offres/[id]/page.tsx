"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronRight,
  CircleX,
  Clock3,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  WalletCards,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";

interface Insurer {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  description?: string | null;
  website?: string | null;
  phone?: string | null;
  address?: string | null;
}

interface Offer {
  id: string;
  category: string;
  insuranceTypeLabel: string;
  insuranceSubType?: string | null;
  premium: number | string;
  coverageAmount: number | string;
  franchise: number | string;
  guarantees: string[];
  optionalGuarantees: string[];
  exclusions: string[];
  duration: string;
  waitingPeriod: string;
  terms?: string | null;
  rating: number | string;
  tag?: string | null;
  insurer: Insurer;
}

const money = (value: number | string) =>
  Number(value).toLocaleString("fr-FR");

const subscriptionUrl = (offer: Offer) =>
  `/souscription?offerId=${encodeURIComponent(offer.id)}&type=${encodeURIComponent(offer.insuranceTypeLabel)}&insurer=${encodeURIComponent(offer.insurer.name)}&price=${Number(offer.premium)}&guarantees=${encodeURIComponent((offer.guarantees || []).join(", "))}`;

export default function OfferDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [offer, setOffer] = useState<Offer | null>(null);
  const [similarOffers, setSimilarOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadOffer = async () => {
      setLoading(true);
      setError(false);

      try {
        const currentOffer: Offer = await api.getOffer(id);
        setOffer(currentOffer);

        const response = await api.getOffers({
          category: currentOffer.category,
          type: currentOffer.insuranceTypeLabel,
          limit: 4,
        });
        const list: Offer[] = Array.isArray(response) ? response : response.data || [];
        setSimilarOffers(list.filter((item) => item.id !== currentOffer.id).slice(0, 3));
      } catch (loadError) {
        console.error("Impossible de charger l’offre", loadError);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadOffer();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </main>
    );
  }

  if (error || !offer) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="min-h-[75vh] flex flex-col items-center justify-center px-6 text-center">
          <h1 className="text-3xl font-bold mb-4">Offre introuvable</h1>
          <p className="text-gray-400 mb-8">Cette offre n’est plus disponible ou n’a pas pu être chargée.</p>
          <Link href="/compare" className="bg-white text-black px-6 py-3 font-bold uppercase text-xs tracking-widest">
            Retour au comparateur
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const insurer = offer.insurer;

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="pt-28 pb-14 border-b border-white/10 bg-[#030303]">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/compare" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white mb-10">
            <ArrowLeft size={16} /> Retour aux offres
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="w-28 h-28 bg-white rounded-2xl flex items-center justify-center overflow-hidden shrink-0">
                {insurer.logoUrl ? (
                  <img src={insurer.logoUrl} alt={`Logo ${insurer.name}`} className="w-full h-full object-contain p-4" />
                ) : (
                  <ShieldCheck size={42} className="text-black" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  {offer.tag && <span className="bg-white text-black text-[9px] font-black uppercase tracking-widest px-3 py-1">{offer.tag}</span>}
                  <span className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.25em]">{offer.insuranceSubType || offer.category}</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold font-oswald uppercase tracking-tight">{offer.insuranceTypeLabel}</h1>
                <p className="text-gray-400 mt-3">Proposée par <Link href={`/assureur/${insurer.slug}`} className="text-white hover:underline">{insurer.name}</Link></p>
              </div>
            </div>

            <div className="lg:text-right">
              <span className="block text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Prime annuelle</span>
              <span className="text-4xl md:text-5xl font-black">{money(offer.premium)}</span>
              <span className="text-sm text-gray-400 font-bold ml-2">FCFA</span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid lg:grid-cols-[1fr_340px] gap-12">
          <div className="space-y-12">
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {[
                { label: "Plafond de garantie", value: `${money(offer.coverageAmount)} FCFA`, icon: BadgeCheck },
                { label: "Franchise", value: `${money(offer.franchise)} FCFA`, icon: WalletCards },
                { label: "Délai de carence", value: offer.waitingPeriod, icon: Clock3 },
                { label: "Durée du contrat", value: offer.duration, icon: CalendarDays },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="border border-white/10 bg-white/[0.03] p-5">
                  <Icon size={20} className="text-gray-500 mb-5" />
                  <span className="block text-[9px] text-gray-500 uppercase tracking-widest font-bold mb-2">{label}</span>
                  <span className="font-bold text-sm">{value}</span>
                </div>
              ))}
            </div>

            <DetailList title="Garanties incluses" items={offer.guarantees} icon="check" />
            <DetailList title="Garanties optionnelles" items={offer.optionalGuarantees} icon="check" emptyText="Aucune option supplémentaire indiquée." />
            <DetailList title="Exclusions principales" items={offer.exclusions} icon="exclude" emptyText="Aucune exclusion particulière indiquée." />

            <div>
              <h2 className="text-2xl font-bold font-oswald uppercase mb-5">Conditions de l’offre</h2>
              <div className="border border-white/10 bg-white/[0.02] p-6 text-gray-300 leading-relaxed">
                {offer.terms || "Les conditions détaillées seront précisées par un conseiller avant la souscription."}
              </div>
            </div>
          </div>

          <aside>
            <div className="border border-white/10 bg-zinc-950 p-7 sticky top-28">
              <h2 className="text-xl font-bold uppercase font-oswald mb-2">Contacter et souscrire</h2>
              <p className="text-sm text-gray-500 mb-7">Choisissez l’option qui vous convient pour poursuivre avec cette offre.</p>

              <Link href={subscriptionUrl(offer)} className="flex items-center justify-center gap-2 bg-white text-black py-4 px-5 text-xs font-black uppercase tracking-widest hover:bg-gray-200">
                Souscrire à cette offre <ChevronRight size={16} />
              </Link>

              <div className="space-y-3 mt-5">
                {insurer.phone && (
                  <a href={`tel:${insurer.phone}`} className="flex items-center gap-3 border border-white/10 px-4 py-3 text-sm hover:border-white/30">
                    <Phone size={17} /> {insurer.phone}
                  </a>
                )}
                {insurer.website && (
                  <a href={insurer.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 border border-white/10 px-4 py-3 text-sm hover:border-white/30">
                    <ExternalLink size={17} /> Site de {insurer.name}
                  </a>
                )}
                {insurer.address && (
                  <div className="flex items-start gap-3 border border-white/10 px-4 py-3 text-sm text-gray-400">
                    <MapPin size={17} className="shrink-0 mt-0.5" /> {insurer.address}
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 mt-7 pt-7">
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500 block mb-3">Accompagnement LBASSUR</span>
                <a href="tel:+2290152755555" className="flex items-center gap-3 text-sm mb-3 hover:text-gray-300">
                  <Phone size={16} /> +229 01 52 75 55 55
                </a>
                <a href="mailto:contact@lbassur.bj" className="flex items-center gap-3 text-sm hover:text-gray-300">
                  <Mail size={16} /> contact@lbassur.bj
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {similarOffers.length > 0 && (
        <section className="border-t border-white/10 bg-[#030303] py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between gap-6 mb-8">
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Comparer avant de choisir</span>
                <h2 className="text-3xl font-bold font-oswald uppercase mt-2">Offres similaires</h2>
              </div>
              <Link href="/compare" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white">Voir tout</Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {similarOffers.map((similar) => (
                <Link key={similar.id} href={`/offres/${similar.id}`} className="border border-white/10 bg-black p-6 hover:border-white/30 transition-colors group">
                  <div className="flex items-center justify-between gap-4 mb-7">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-full bg-white overflow-hidden shrink-0 flex items-center justify-center">
                        {similar.insurer.logoUrl ? (
                          <img src={similar.insurer.logoUrl} alt="" className="w-full h-full object-contain p-2" />
                        ) : (
                          <ShieldCheck size={20} className="text-black" />
                        )}
                      </div>
                      <span className="font-bold text-sm truncate">{similar.insurer.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <Star size={13} fill="currentColor" /> {Number(similar.rating).toFixed(1)}
                    </div>
                  </div>
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Prime annuelle</span>
                  <div className="mt-2 flex items-end justify-between gap-4">
                    <span className="text-2xl font-black">{money(similar.premium)} <small className="text-xs text-gray-500">FCFA</small></span>
                    <ChevronRight size={18} className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}

function DetailList({
  title,
  items,
  icon,
  emptyText,
}: {
  title: string;
  items: string[];
  icon: "check" | "exclude";
  emptyText?: string;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold font-oswald uppercase mb-5">{title}</h2>
      {items?.length ? (
        <div className="grid sm:grid-cols-2 gap-3">
          {items.map((item) => (
            <div key={item} className="flex items-start gap-3 border border-white/10 bg-white/[0.02] p-4 text-sm text-gray-300">
              {icon === "check" ? (
                <Check size={17} className="text-green-400 shrink-0 mt-0.5" />
              ) : (
                <CircleX size={17} className="text-red-400 shrink-0 mt-0.5" />
              )}
              {item}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">{emptyText}</p>
      )}
    </div>
  );
}
