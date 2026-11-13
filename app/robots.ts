import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // `/need/` a été retiré : aucune route de ce nom n'existe dans
      // l'application. La règle ne protégeait rien et faisait au contraire
      // remonter une erreur « Bloquée par le fichier robots.txt » dans la
      // Search Console, pour une URL que Google connaît par ailleurs.
      //
      // Les écrans privés (connexion, espace client) ne sont volontairement
      // pas listés ici : ils portent une balise `noindex`. Les interdire au
      // robot l'empêcherait de lire cette balise, et Google les laisserait
      // alors dans ses résultats, sans description.
      disallow: ['/api/'],
    },
    sitemap: 'https://www.lbassur.bj/sitemap.xml',
  };
}
