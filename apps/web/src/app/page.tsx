import React from 'react';

// Phase 14: Web Portal Home Page
export default async function HomePage() {
  
  // In a real Next.js app, this would fetch from Phase 11 REST API
  // const trendingApis = await fetch('http://localhost:3000/api/v1/trending').then(r => r.json());
  
  const mockApis = [
    { id: 'api_github', name: 'GitHub REST API', desc: 'Interact with GitHub repositories, pull requests, and issues.', verified: true, tags: ['REST', 'Developer'] },
    { id: 'api_stripe', name: 'Stripe API', desc: 'Payment processing and global financial infrastructure.', verified: true, tags: ['REST', 'Finance', 'Webhooks'] },
    { id: 'api_weather', name: 'OpenWeatherMap', desc: 'Current weather data, forecasts, and historical data for any location.', verified: false, tags: ['REST', 'Free', 'Weather'] },
  ];

  return (
    <div>
      <header className="hero">
        <h1 className="hero-title">The Universe of <br/><span style={{ color: 'var(--accent-cyan)' }}>Machine Readable</span> APIs</h1>
        <p className="hero-subtitle">
          Discover, test, and integrate over 10 million verified APIs, SDKs, MCP servers, and Webhooks in seconds.
        </p>
      </header>

      <section style={{ padding: '0 4rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          🔥 Trending this week
        </h2>
      </section>

      <div className="api-grid">
        {mockApis.map(api => (
          <a href={`/apis/${api.id}`} key={api.id} className="glass-card">
            <div className="card-title">{api.name}</div>
            <div className="card-desc">{api.desc}</div>
            
            <div className="badge-container">
              {api.verified && <span className="badge verified">✓ Verified</span>}
              {api.tags.map(tag => (
                <span key={tag} className="badge">{tag}</span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
