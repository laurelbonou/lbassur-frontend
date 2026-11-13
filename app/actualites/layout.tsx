import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Actualités & Conseils",
  description: "Restez informés sur les dernières actualités de l'assurance au Bénin et nos conseils d'experts.",
  alternates: { canonical: "/actualites" },
};

export default function ActualitesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
