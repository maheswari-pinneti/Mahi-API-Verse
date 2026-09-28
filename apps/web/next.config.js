/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * PHASE 18: PERFORMANCE & EDGE COMPUTING
   * 
   * Configures Next.js to aggressively cache the 10 million API pages 
   * at the CDN level to prevent PostgreSQL/OpenSearch meltdowns under heavy load.
   */
  
  // Experimental edge runtime for faster TTFB (Time to First Byte)
  experimental: {
    runtime: 'edge',
  },

  images: {
    domains: ['avatars.githubusercontent.com', 'logo.clearbit.com'],
  },

  async headers() {
    return [
      {
        // Target all API detail pages
        source: '/apis/:slug',
        headers: [
          {
            // Cache in the CDN for 24 hours (86400s), but serve stale content 
            // for up to 12 hours while revalidating in the background.
            key: 'Cache-Control',
            value: 'public, s-maxage=86400, stale-while-revalidate=43200',
          }
        ],
      },
      {
        // Trending feeds update more frequently
        source: '/trending',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=1800',
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
