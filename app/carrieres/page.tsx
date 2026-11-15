import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Briefcase, Clock, ArrowUpRight, Search, FileSearch } from "lucide-react";

/**
 * Liste des offres, rendue côté serveur.
 *
 * Volontairement pas un composant client : une offre d'emploi n'a d'intérêt que
 * si elle se trouve, et Google n'indexe pas ce qui n'apparaît qu'après un appel
 * fetch dans le navigateur. Revalidation toutes les 5 minutes — une offre
 * publiée ne change pas d'une seconde à l'autre.
 */
export const revalidate = 300;

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.length > 0
    ? process.env.NEXT_PUBLIC_API_URL
    : "https://lbassur-backend.onrender.com/api/v1";

type Offre = {
  id: string;
  reference: string;
  slug: string;
  title: string;
  department?: string | null;
  location: string;
  contractType: string;
  remote: boolean;
  summary: string;
  status: "PUBLISHED" | "CLOSED";
  publishedAt?: string | null;
  closingDate?: string | null;
  experienceYears?: number | null;
};

const LIBELLE_CONTRAT: Record<string, string> = {
  CDI: "CDI",
  CDD: "CDD",
  STAGE: "Stage",
  ALTERNANCE: "Alternance",
  FREELANCE: "Freelance",
  CONSULTANT: "Consultant",
};

/**
 * Un backend injoignable ne doit pas rendre une page blanche : on affiche la
 * page avec un message, le reste du site restant navigable.
 */
/**
 * Delai maximum des appels faits pendant le build.
 *
 * Render met en veille les services inactifs : un reveil prend parfois une
 * minute. Sans borne, un build Vercel peut rester suspendu sur cet appel et
 * ne jamais aboutir. Huit secondes suffisent a un service eveille ; au-dela,
 * la page se construit sans les offres plutot que de bloquer la mise en
 * ligne du site entier.
 */
const DELAI_BUILD_MS = 8000;

async function chargerOffres(): Promise<{ offres: Offre[]; erreur: boolean }> {
  try {
    const res = await fetch(`${API_BASE_URL}/recruitment/offers`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(DELAI_BUILD_MS),
    });
    if (!res.ok) return { offres: [], erreur: true };
    return { offres: await res.json(), erreur: false };
  } catch {
    return { offres: [], erreur: true };
  }
}

export default async function CarrieresPage() {
  const { offres, erreur } = await chargerOffres();
  const ouvertes = offres.filter((o) => o.status === "PUBLISHED");
  const closes = offres.filter((o) => o.status === "CLOSED");

  return (
    <main className="bg-black min-h-screen text-white">
      <Navbar />

      {/* En-tête */}
      <section className="pt-32 pb-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-4">
            // Nous rejoindre
          </p>
          <h1 className="text-4xl md:text-6xl font-bold uppercase font-oswald mb-6">
            Carrières
          </h1>
          <p className="text-gray-400 font-light leading-relaxed max-w-2xl">
            LBASSUR accompagne particuliers et entreprises au Bénin depuis 2021. Nous
            recrutons des profils qui partagent notre exigence : défendre l&apos;intérêt
            de l&apos;assuré, avec indépendance et transparence.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/carrieres/suivi"
              className="inline-flex items-center gap-2 border border-white/15 px-5 py-3 text-xs uppercase tracking-widest font-bold hover:border-white/40 transition-colors"
            >
              <FileSearch size={14} />
              Suivre ma candidature
            </Link>
          </div>
        </div>
      </section>

      {/* Offres */}
      <section className="px-6 pb-24">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-baseline justify-between border-b border-white/10 pb-5 mb-10">
            <h2 className="text-lg font-bold uppercase tracking-wider">
              Postes ouverts
            </h2>
            <span className="text-xs text-gray-500 font-medium">
              {ouvertes.length} {ouvertes.length > 1 ? "offres" : "offre"}
            </span>
          </div>

          {erreur && (
            <p className="text-sm text-gray-400 border border-white/10 p-8 text-center">
              Les offres sont momentanément indisponibles. Merci de réessayer dans
              quelques instants, ou écrivez-nous à{" "}
              <a href="mailto:contact@lbassur.bj" className="text-white underline">
                contact@lbassur.bj
              </a>
              .
            </p>
          )}

          {!erreur && ouvertes.length === 0 && (
            <div className="border border-white/10 p-10 text-center">
              <Search size={22} className="mx-auto mb-4 text-gray-600" />
              <p className="text-gray-300 font-medium mb-2">
                Aucun poste ouvert pour le moment.
              </p>
              <p className="text-sm text-gray-500 font-light max-w-md mx-auto">
                Nous étudions néanmoins les candidatures spontanées. Envoyez votre CV
                à{" "}
                <a href="mailto:contact@lbassur.bj" className="text-white underline">
                  contact@lbassur.bj
                </a>{" "}
                en précisant le type de poste recherché.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {ouvertes.map((offre) => (
              <CarteOffre key={offre.id} offre={offre} />
            ))}
          </div>

          {closes.length > 0 && (
            <>
              <h2 className="text-lg font-bold uppercase tracking-wider border-b border-white/10 pb-5 mb-10 mt-20">
                Recrutements clos
              </h2>
              <div className="space-y-4 opacity-50">
                {closes.map((offre) => (
                  <CarteOffre key={offre.id} offre={offre} close />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

function CarteOffre({ offre, close = false }: { offre: Offre; close?: boolean }) {
  const contenu = (
    <>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="text-[10px] uppercase tracking-widest font-bold border border-white/20 px-2.5 py-1">
            {LIBELLE_CONTRAT[offre.contractType] ?? offre.contractType}
          </span>
          {offre.department && (
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
              {offre.department}
            </span>
          )}
          {close && (
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
              Candidatures closes
            </span>
          )}
        </div>

        <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-white transition-colors">
          {offre.title}
        </h3>
        <p className="text-sm text-gray-400 font-light leading-relaxed mb-4 line-clamp-2">
          {offre.summary}
        </p>

        <div className="flex flex-wrap gap-5 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={12} />
            {offre.location}
            {offre.remote && " · Télétravail possible"}
          </span>
          {offre.experienceYears != null && (
            <span className="inline-flex items-center gap-1.5">
              <Briefcase size={12} />
              {offre.experienceYears} an{offre.experienceYears > 1 ? "s" : ""} d&apos;expérience
            </span>
          )}
          {offre.closingDate && !close && (
            <span className="inline-flex items-center gap-1.5">
              <Clock size={12} />
              Jusqu&apos;au{" "}
              {new Date(offre.closingDate).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          )}
        </div>
      </div>

      <ArrowUpRight
        size={18}
        className="text-gray-600 group-hover:text-white transition-colors shrink-0 mt-1"
      />
    </>
  );

  return (
    <Link
      href={`/carrieres/${offre.slug}`}
      className="group flex gap-6 border border-white/10 p-6 md:p-8 hover:border-white/30 hover:bg-white/[0.02] transition-all duration-300"
    >
      {contenu}
    </Link>
  );
}
