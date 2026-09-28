import { MetadataRoute } from 'next';

/**
 * PHASE 17: SEO PIPELINE (Massive Scale Sitemaps)
 * 
 * Google enforces a strict limit of 50,000 URLs per sitemap. 
 * Because Mahi API Verse has 10,000,000 records, a single sitemap will crash.
 * 
 * We use Next.js `generateSitemaps` to shard our 10M records into 
 * exactly 200 separate XML sitemap files (sitemap/0.xml, sitemap/1.xml).
 */

export async function generateSitemaps() {
  const TOTAL_APIS = 10000000;
  const CHUNK_SIZE = 50000;
  const totalSitemaps = Math.ceil(TOTAL_APIS / CHUNK_SIZE); // 200

  // Returns an array: [{ id: 0 }, { id: 1 }, ... { id: 199 }]
  // Next.js will call the default function below 200 times.
  return Array.from({ length: totalSitemaps }).map((_, i) => ({ id: i }));
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  // In production, we fetch exactly the 50,000 chunk for this ID from PostgreSQL
  // const res = await fetch(`http://api.internal/api/v1/sitemap?page=${id}&limit=50000`);
  // const apis = await res.json();
  
  // Mock data representing the DB fetch
  const mockApis = [
    { slug: 'github-rest-api', updatedAt: new Date() },
    { slug: 'stripe-api', updatedAt: new Date() },
    { slug: 'openweather-api', updatedAt: new Date() }
  ];

  const sitemapEntries: MetadataRoute.Sitemap = mockApis.map(api => ({
    url: `https://mahi-api-verse.com/apis/${api.slug}`,
    lastModified: api.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Append critical top-level pages only to the very first sitemap (id: 0)
  if (id === 0) {
    sitemapEntries.unshift(
      { 
        url: 'https://mahi-api-verse.com/', 
        lastModified: new Date(), 
        changeFrequency: 'always', 
        priority: 1.0 
      },
      { 
        url: 'https://mahi-api-verse.com/observatory', 
        lastModified: new Date(), 
        changeFrequency: 'daily', 
        priority: 0.9 
      },
      { 
        url: 'https://mahi-api-verse.com/trending', 
        lastModified: new Date(), 
        changeFrequency: 'hourly', 
        priority: 0.9 
      }
    );
  }

  return sitemapEntries;
}
