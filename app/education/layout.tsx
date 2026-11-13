import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lexique de l'Assurance",
  description: "Comprenez les termes de vos contrats : franchise, délai de carence, bonus-malus. Le vocabulaire de l'assurance expliqué simplement par LBASSUR.",
  alternates: { canonical: "/education" },
};

export default function EducationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
