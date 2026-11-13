import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Souscrire une Assurance en Ligne",
  description: "Souscrivez votre assurance auto, santé, vie, habitation ou voyage en ligne au Bénin. Devis immédiat et accompagnement par les courtiers LBASSUR.",
  alternates: { canonical: "/souscription" },
};

export default function SouscriptionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
