/**
 * Adresses des espaces authentifies de LBASSUR.
 *
 * Trois publics, trois surfaces distinctes. Les espaces partenaires et admin
 * vivent sur leurs propres sous-domaines : un cookie de session pose sur
 * partenaires.lbassur.bj n'est jamais envoye au site public, et inversement.
 * C'est cette separation qui fait qu'une faille sur le site grand public ne
 * peut pas exposer la session d'un courtier.
 *
 * L'espace admin n'apparait volontairement pas ici : il n'est lie depuis
 * aucune page publique.
 */

/** Espace client — meme application que le site public, donc un chemin relatif. */
export const ESPACE_CLIENT = "/compte";
export const CONNEXION_CLIENT = "/login";

/**
 * Espace courtiers et agents generaux.
 *
 * Renvoie null tant que NEXT_PUBLIC_ESPACE_PARTENAIRES n'est pas defini : le
 * lien n'apparait donc nulle part avant que l'espace existe reellement. Le
 * jour du deploiement, il suffit de renseigner la variable sur Render.
 */
export function espacePartenaires(): string | null {
  const url = process.env.NEXT_PUBLIC_ESPACE_PARTENAIRES?.trim();
  return url ? url.replace(/\/+$/, "") : null;
}
