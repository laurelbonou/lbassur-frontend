import { Metadata } from "next";

/**
 * Cette fiche est une étape de formulaire, pas une page de contenu : son
 * intérêt pour un visiteur venu d'un moteur de recherche est nul, et son
 * contenu varie selon le produit choisi en paramètre d'URL. On la laisse
 * explorable (les liens internes comptent) mais hors de l'index.
 */
export const metadata: Metadata = {
  title: "Fiche de Cotation",
  robots: { index: false, follow: true },
  alternates: { canonical: "/souscription/fiche-cotation" },
};

export default function FicheCotationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
