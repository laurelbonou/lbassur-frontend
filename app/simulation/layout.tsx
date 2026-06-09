import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulation d'Assurance en Ligne",
  description: "Faites une simulation rapide et gratuite de votre assurance Auto, Santé ou Habitation avec LBASSUR."
};

export default function SimulationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
