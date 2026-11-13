import { MetadataRoute } from 'next';

const baseUrl = 'https://www.lbassur.bj';

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
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: Array<[string, MetadataRoute.Sitemap[number]['changeFrequency'], number]> = [
    ['', 'daily', 1],
    ['/compare', 'daily', 0.9],
    ['/souscription', 'weekly', 0.9],
    ['/simulation', 'weekly', 0.8],
    ['/services', 'weekly', 0.8],
    ['/actualites', 'daily', 0.7],
    ['/a-propos', 'monthly', 0.6],
    ['/education', 'monthly', 0.6],
    ['/carrieres', 'monthly', 0.5],
    ['/mentions-legales', 'yearly', 0.3],
    ['/politique-confidentialite', 'yearly', 0.3],
  ];

  return pages.map(([path, changeFrequency, priority]) => ({
    url: `${baseUrl}${path}`,
    lastModified: LAST_REVIEW,
    changeFrequency,
    priority,
  }));
}
