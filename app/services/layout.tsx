import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nos Services d'Assurance",
  description: "Découvrez nos offres d'assurance Santé, Auto, Habitation et Vie adaptées à vos besoins au Bénin."
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
