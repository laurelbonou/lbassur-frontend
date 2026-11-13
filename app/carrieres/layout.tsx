import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carrières",
  description: "Rejoignez LBASSUR, cabinet de courtage en assurances à Cotonou. Découvrez nos offres d'emploi et nos opportunités de carrière au Bénin.",
  alternates: { canonical: "/carrieres" },
};

export default function CarrieresLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
