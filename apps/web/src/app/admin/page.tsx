import React from 'react';

export const revalidate = 0; // Always fresh for admin

export default async function AdminDashboard() {
  let statsData = {
    total_apis_indexed: 0,
    total_endpoints: 0,
    languages_mapped: 0,
    last_updated: new Date().toISOString()
  };

  try {
    const res = await fetch('http://127.0.0.1:3001/v1/stats', { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      statsData = json.data;
    }
  } catch (err) {
    console.error('Failed to load stats:', err);
  }

  return (
    <div>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>System Overview</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Live telemetry for the Mahi API Verse infrastructure. Last updated: {new Date(statsData.last_updated).toLocaleString()}</p>
      </header>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem',
        marginBottom: '3rem'
      }}>
        
        {/* Total Records Counter */}
        <div className="glass-card" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <h3 className="card-title">Total APIs Indexed</h3>
          <div style={{ fontSize: '3rem', fontWeight: 800, margin: '1rem 0', color: '#00E676' }}>
            {statsData.total_apis_indexed.toLocaleString()}
          </div>
          <div className="card-desc">Across all monitored repositories</div>
        </div>

        {/* Total Endpoints Counter */}
        <div className="glass-card" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <h3 className="card-title">Endpoints Discovered</h3>
          <div style={{ fontSize: '3rem', fontWeight: 800, margin: '1rem 0', color: 'var(--accent-cyan)' }}>
            {statsData.total_endpoints.toLocaleString()}
          </div>
          <div className="card-desc">Fully extracted JSON schemas</div>
        </div>

        {/* SDK Language Matrices */}
        <div className="glass-card" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <h3 className="card-title">Languages Mapped</h3>
          <div style={{ fontSize: '3rem', fontWeight: 800, margin: '1rem 0', color: '#B388FF' }}>
            {statsData.languages_mapped.toLocaleString()}
          </div>
          <div className="card-desc">Generated SDK fragments ready</div>
        </div>

        {/* Cluster Health */}
        <div className="glass-card" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <h3 className="card-title">Infrastructure Health</h3>
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>🐘 PostgreSQL (Primary)</span> <span style={{ color: '#00E676' }}>🟢 Online (12ms)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>🔍 OpenSearch Cluster</span> <span style={{ color: '#00E676' }}>🟢 Online (8ms)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>🔴 Redis Cache</span> <span style={{ color: '#ff4444' }}>⚠️ High Load (85%)</span>
            </div>
          </div>
        </div>

      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>🚜 Active Ingestion Crawlers</h2>
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '1rem' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
              <th style={{ padding: '1rem' }}>Target Source</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Discovered</th>
              <th style={{ padding: '1rem' }}>Errors</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '1rem' }}>GitHub (OpenAPI Scan)</td>
              <td style={{ padding: '1rem', color: '#00E676' }}>Running</td>
              <td style={{ padding: '1rem' }}>{statsData.total_apis_indexed.toLocaleString()}</td>
              <td style={{ padding: '1rem' }}>0</td>
            </tr>
            <tr>
              <td style={{ padding: '1rem' }}>SwaggerHub API</td>
              <td style={{ padding: '1rem', color: '#ffb74d' }}>Throttled</td>
              <td style={{ padding: '1rem' }}>0</td>
              <td style={{ padding: '1rem', color: '#ff4444' }}>429 Too Many Requests</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
