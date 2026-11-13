import { Metadata } from "next";

/**
 * Espace client : s'applique aussi aux sous-pages (profil, déclaration de
 * sinistre). Ces écrans sont réservés aux assurés connectés et n'ont rien à
 * faire dans l'index.
 *
 * `noindex` plutôt qu'un Disallow dans robots.txt : une page interdite au
 * robot ne peut pas être lue, donc Google n'y verrait jamais la consigne de
 * désindexation et la garderait en résultat sans description.
 */
export const metadata: Metadata = {
  title: "Espace Client",
  robots: { index: false, follow: false },
};

export default function CompteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
