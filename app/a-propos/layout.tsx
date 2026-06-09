import { Metadata } from "next";

export const metadata: Metadata = {
  title: "À Propos de Nous",
  description: "Découvrez l'histoire, la mission et les valeurs de LBASSUR, votre partenaire de confiance en assurance au Bénin."
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
