import { MetadataRoute } from 'next';

/**
 * PHASE 17: SEO PIPELINE
 * 
 * Programmatically generates the robots.txt file to guide search engine crawlers.
 * Ensures Googlebot aggressively indexes the API catalog while explicitly 
 * blocking access to private dashboards and mission control.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',          // Phase 16: Mission Control
        '/dashboard/',      // Phase 15: Developer Hub
        '/api/internal/'    // Private API routes
      ],
    },
    // Points to the massive paginated sitemap index we build dynamically
    sitemap: 'https://mahi-api-verse.com/sitemap.xml',
  };
}
