import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";
import ConsoleSignature from "@/components/ConsoleSignature";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lbassur.bj"),
  title: {
    default: "LBASSUR | Meilleur Courtier d'Assurance au Bénin",
    template: "%s | LBASSUR",
  },
  description: "Trouvez et comparez les meilleures offres d'assurance au Bénin avec LBASSUR. Courtier de confiance pour vos assurances auto, santé, vie et habitation.",
  keywords: [
    "assurance", 
    "courtiers", 
    "LBASSUR", 
    "Bénin", 
    "Cotonou", 
    "courtier en assurance bénin", 
    "comparateur assurance bénin",
    "meilleure assurance benin", 
    "assurance auto", 
    "assurance santé",
    "assurance voyage"
  ],
  authors: [{ name: "LBASSUR" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "LBASSUR - Premier Courtier d'Assurance au Bénin",
    description: "Trouvez la meilleure assurance au Bénin avec LBASSUR. Solutions sur mesure pour auto, habitation, santé et entreprises.",
    url: "https://www.lbassur.bj",
    siteName: "LBASSUR",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LBASSUR - Courtier en Assurance",
      },
    ],
    locale: "fr_BJ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LBASSUR - Courtier de Confiance au Bénin",
    description: "Comparez et trouvez la meilleure assurance au Bénin avec LBASSUR.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/icon.jpg",
    shortcut: "/icon.jpg",
    apple: "/icon.jpg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body
        className={`${oswald.variable} ${inter.variable} antialiased bg-black text-white font-sans`}
      >
        <ConsoleSignature />
        {children}
      </body>
    </html>
  );
}
