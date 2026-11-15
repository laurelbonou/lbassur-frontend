import { MetadataRoute } from 'next';

const baseUrl = 'https://www.lbassur.bj';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.length > 0
    ? process.env.NEXT_PUBLIC_API_URL
    : 'https://lbassur-backend.onrender.com/api/v1';

/**
 * Offres d'emploi ouvertes, ajoutees au sitemap.
 *
 * Une annonce a une duree de vie courte : si Google la decouvre trois semaines
 * apres sa publication, le recrutement est deja clos. On la lui soumet donc
 * directement. Un backend injoignable renvoie une liste vide — le sitemap
 * reste valide avec les pages fixes plutot que de faire echouer le build.
 */
async function offresEmploi(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(`${API_BASE_URL}/recruitment/offers`, {
      next: { revalidate: 300 },
      // Un sitemap ampute des offres reste un sitemap valide ; un build
      // suspendu empeche toute mise en ligne.
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const offres = await res.json();
    return (Array.isArray(offres) ? offres : [])
      .filter((o: { status?: string }) => o.status === 'PUBLISHED')
      .map((o: { slug: string; publishedAt?: string | null }) => ({
        url: `${baseUrl}/carrieres/${o.slug}`,
        lastModified: o.publishedAt ? new Date(o.publishedAt) : LAST_REVIEW,
        changeFrequency: 'daily' as const,
        priority: 0.7,
      }));
  } catch {
    return [];
  }
}

/**
 * Date de dernière révision éditoriale du site.
 *
 * Volontairement figée plutôt que `new Date()` : un sitemap qui annonce
 * « modifié aujourd'hui » à chaque déploiement, sans que le contenu ait
 * bougé, apprend à Google à ignorer ce champ. À avancer à la main quand le
 * contenu change réellement.
 */
const LAST_REVIEW = new Date('2026-11-09');

/**
 * Seules les URL publiques renvoyant un 200 et se déclarant elles-mêmes
 * canoniques figurent ici. Les écrans privés (connexion, espace client) et
 * les étapes de formulaire en sont exclus : ils portent une balise `noindex`,
 * et soumettre une page non indexable est signalé comme une anomalie.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: Array<[string, MetadataRoute.Sitemap[number]['changeFrequency'], number]> = [
    ['', 'daily', 1],
    ['/compare', 'daily', 0.9],
    ['/souscription', 'weekly', 0.9],
    ['/simulation', 'weekly', 0.8],
    ['/services', 'weekly', 0.8],
    ['/actualites', 'daily', 0.7],
    ['/a-propos', 'monthly', 0.6],
    ['/education', 'monthly', 0.6],
    ['/carrieres', 'daily', 0.7],
    ['/carrieres/suivi', 'yearly', 0.3],
    ['/mentions-legales', 'yearly', 0.3],
    ['/politique-confidentialite', 'yearly', 0.3],
  ];

  const fixes = pages.map(([path, changeFrequency, priority]) => ({
    url: `${baseUrl}${path}`,
    lastModified: LAST_REVIEW,
    changeFrequency,
    priority,
  }));

  return [...fixes, ...(await offresEmploi())];
}
