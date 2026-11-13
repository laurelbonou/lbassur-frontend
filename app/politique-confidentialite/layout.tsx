import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité",
  description: "Comment LBASSUR collecte, utilise et protège vos données personnelles dans le cadre de ses activités de courtage en assurances au Bénin.",
  alternates: { canonical: "/politique-confidentialite" },
};

export default function PolitiqueConfidentialiteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
