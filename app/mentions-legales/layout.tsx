import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions Légales",
  description: "Mentions légales de LBASSUR SARL, cabinet de courtage en assurances immatriculé au RCCM sous le numéro RB/PNO/21 B 3312, à Cotonou.",
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegalesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
