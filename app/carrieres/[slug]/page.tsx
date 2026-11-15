import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ApplicationForm from "@/components/recrutement/ApplicationForm";
import { ArrowLeft, MapPin, Briefcase, Clock, Banknote, GraduationCap } from "lucide-react";

export const revalidate = 300;

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.length > 0
    ? process.env.NEXT_PUBLIC_API_URL
    : "https://lbassur-backend.onrender.com/api/v1";

const SITE_URL = "https://www.lbassur.bj";

export type OffreDetail = {
  id: string;
  reference: string;
  slug: string;
  title: string;
  department?: string | null;
  location: string;
  contractType: string;
  remote: boolean;
  salaryMin?: number | null;
  salaryMax?: number | null;
  summary: string;
  description: string;
  missions?: string | null;
  profile?: string | null;
  benefits?: string | null;
  experienceYears?: number | null;
  educationLevel?: string | null;
  status: "PUBLISHED" | "CLOSED";
  publishedAt?: string | null;
  closingDate?: string | null;
  formSchema?: { fields?: ChampOffre[] } | null;
};

export type ChampOffre = {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  help?: string;
};

const LIBELLE_CONTRAT: Record<string, string> = {
  CDI: "CDI",
  CDD: "CDD",
  STAGE: "Stage",
  ALTERNANCE: "Alternance",
  FREELANCE: "Freelance",
  CONSULTANT: "Consultant",
};

/** Correspondance avec les types d'emploi de schema.org, lus par Google Jobs. */
const TYPE_SCHEMA_ORG: Record<string, string> = {
  CDI: "FULL_TIME",
  CDD: "TEMPORARY",
  STAGE: "INTERN",
  ALTERNANCE: "INTERN",
  FREELANCE: "CONTRACTOR",
  CONSULTANT: "CONTRACTOR",
};

async function chargerOffre(slug: string): Promise<OffreDetail | null> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/recruitment/offers/${encodeURIComponent(slug)}`,
      // Borne identique a la liste : un backend endormi ne doit pas suspendre
      // le rendu d'une page.
      { next: { revalidate: 300 }, signal: AbortSignal.timeout(8000) },
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const offre = await chargerOffre(slug);
  if (!offre) return { title: "Offre introuvable" };

  return {
    title: `${offre.title} — ${offre.location}`,
    description: offre.summary,
    alternates: { canonical: `/carrieres/${offre.slug}` },
    openGraph: {
      title: `${offre.title} | LBASSUR`,
      description: offre.summary,
      url: `${SITE_URL}/carrieres/${offre.slug}`,
      type: "article",
    },
  };
}

export default async function OffrePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const offre = await chargerOffre(slug);
  if (!offre) notFound();

  const ouverte =
    offre.status === "PUBLISHED" &&
    (!offre.closingDate || new Date(offre.closingDate) > new Date());

  /**
   * Données structurées JobPosting : c'est ce qui permet à l'offre d'apparaître
   * dans Google Jobs, où se fait l'essentiel des recherches d'emploi. Sans ce
   * balisage, l'annonce n'existe que pour qui visite déjà le site.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: offre.title,
    description: [offre.description, offre.missions, offre.profile]
      .filter(Boolean)
      .join("\n\n"),
    identifier: {
      "@type": "PropertyValue",
      name: "LBASSUR",
      value: offre.reference,
    },
    datePosted: offre.publishedAt ?? undefined,
    validThrough: offre.closingDate ?? undefined,
    employmentType: TYPE_SCHEMA_ORG[offre.contractType] ?? "OTHER",
    hiringOrganization: {
      "@type": "Organization",
      name: "LBASSUR",
      sameAs: SITE_URL,
      logo: `${SITE_URL}/images/logo.jpg`,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: offre.location.split(",")[0]?.trim(),
        addressCountry: "BJ",
      },
    },
    ...(offre.salaryMin
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: "XOF",
            value: {
              "@type": "QuantitativeValue",
              minValue: offre.salaryMin,
              maxValue: offre.salaryMax ?? offre.salaryMin,
              unitText: "MONTH",
            },
          },
        }
      : {}),
  };

  return (
    <main className="bg-black min-h-screen text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <section className="pt-32 pb-12 px-6 border-b border-white/10">
        <div className="container mx-auto max-w-4xl">
          <Link
            href="/carrieres"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={14} />
            Toutes les offres
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="text-[10px] uppercase tracking-widest font-bold border border-white/20 px-2.5 py-1">
              {LIBELLE_CONTRAT[offre.contractType] ?? offre.contractType}
            </span>
            {offre.department && (
              <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                {offre.department}
              </span>
            )}
            <span className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">
              {offre.reference}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold font-oswald uppercase mb-6">
            {offre.title}
          </h1>
          <p className="text-gray-300 font-light leading-relaxed max-w-2xl mb-8">
            {offre.summary}
          </p>

          <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <Fait icone={<MapPin size={13} />} label="Lieu">
              {offre.location}
              {offre.remote && (
                <span className="block text-xs text-gray-500">Télétravail possible</span>
              )}
            </Fait>
            {offre.experienceYears != null && (
              <Fait icone={<Briefcase size={13} />} label="Expérience">
                {offre.experienceYears} an{offre.experienceYears > 1 ? "s" : ""} minimum
              </Fait>
            )}
            {offre.educationLevel && (
              <Fait icone={<GraduationCap size={13} />} label="Formation">
                {offre.educationLevel}
              </Fait>
            )}
            {offre.salaryMin && (
              <Fait icone={<Banknote size={13} />} label="Rémunération">
                {offre.salaryMin.toLocaleString("fr-FR")}
                {offre.salaryMax ? ` – ${offre.salaryMax.toLocaleString("fr-FR")}` : ""} FCFA
              </Fait>
            )}
            {offre.closingDate && (
              <Fait icone={<Clock size={13} />} label="Date limite">
                {new Date(offre.closingDate).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </Fait>
            )}
          </dl>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl space-y-12">
          <Bloc titre="Le poste">{offre.description}</Bloc>
          {offre.missions && <Bloc titre="Vos missions">{offre.missions}</Bloc>}
          {offre.profile && <Bloc titre="Profil recherché">{offre.profile}</Bloc>}
          {offre.benefits && <Bloc titre="Ce que nous offrons">{offre.benefits}</Bloc>}
        </div>
      </section>

      <section id="postuler" className="pb-24 px-6">
        <div className="container mx-auto max-w-4xl">
          {ouverte ? (
            <ApplicationForm offre={offre} />
          ) : (
            <div className="border border-white/10 p-10 text-center">
              <p className="text-gray-300 font-medium mb-2">
                Les candidatures pour ce poste sont closes.
              </p>
              <p className="text-sm text-gray-500 font-light">
                Consultez{" "}
                <Link href="/carrieres" className="text-white underline">
                  nos autres offres
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Fait({
  icone,
  label,
  children,
}: {
  icone: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1.5">
        {icone}
        {label}
      </dt>
      <dd className="text-white font-medium">{children}</dd>
    </div>
  );
}

/**
 * Le texte saisi dans l'administration n'est pas du HTML : on respecte les
 * retours à la ligne via `whitespace-pre-line` plutôt que d'injecter du balisage
 * non filtré avec `dangerouslySetInnerHTML`.
 */
function Bloc({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-bold uppercase tracking-wider border-b border-white/10 pb-4 mb-6">
        {titre}
      </h2>
      <div className="text-gray-300 font-light leading-relaxed whitespace-pre-line">
        {children}
      </div>
    </div>
  );
}
