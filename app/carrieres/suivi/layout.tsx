import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Suivre ma candidature",
  description:
    "Consultez l'avancement de votre candidature chez LBASSUR à l'aide de votre code de suivi et de votre adresse e-mail.",
  alternates: { canonical: "/carrieres/suivi" },
};

export default function SuiviLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
