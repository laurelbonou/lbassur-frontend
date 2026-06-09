import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/need/'],
    },
    sitemap: 'https://www.lbassur.bj/sitemap.xml',
  };
}
