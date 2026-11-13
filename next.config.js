/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Formats servis par <Image /> quand le navigateur les accepte.
    // AVIF pèse encore ~20 % de moins que WebP ; Next bascule tout seul
    // sur le format suivant si le navigateur ne suit pas.
    formats: ["image/avif", "image/webp"],
    // Largeurs générées pour l'attribut srcset. Calées sur les points de
    // rupture Tailwind du site, pour ne pas fabriquer de tailles inutiles.
    deviceSizes: [640, 750, 828, 1080, 1200, 1600],
  },

  async headers() {
    return [
      {
        // Les fichiers de `public/` sont servis par défaut avec
        // `cache-control: public, max-age=0`, donc retéléchargés à chaque
        // visite. Ces visuels de marque ne changent quasiment jamais :
        // un cache d'un jour, puis réutilisation pendant la revalidation,
        // rend la navigation interne et les retours sur le site immédiats.
        //
        // Durée volontairement modérée plutôt qu'un an « immutable » :
        // les noms de fichiers ne portent pas d'empreinte, donc remplacer
        // une image garde le même nom et doit pouvoir se propager vite.
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
