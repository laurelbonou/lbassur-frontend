import { Metadata } from "next";

/** Écran de connexion : aucune valeur en résultat de recherche. */
export const metadata: Metadata = {
  title: "Connexion",
  robots: { index: false, follow: true },
  alternates: { canonical: "/login" },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
