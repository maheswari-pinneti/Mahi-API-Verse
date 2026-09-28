import React from 'react';

export default function AdminDashboard() {
  return (
    <div>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>System Overview</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Live telemetry for the Mahi API Verse infrastructure.</p>
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
            10,482,901
          </div>
          <div className="card-desc">Across 112 Categories & 720 Languages</div>
        </div>

        {/* Ingestion Pipeline Velocity */}
        <div className="glass-card" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <h3 className="card-title">Ingestion Velocity</h3>
          <div style={{ fontSize: '3rem', fontWeight: 800, margin: '1rem 0', color: 'var(--accent-cyan)' }}>
            +4,205 / hr
          </div>
          <div className="card-desc">1,802 duplicates safely merged (Phase 6 engine)</div>
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
              <td style={{ padding: '1rem' }}>142,000</td>
              <td style={{ padding: '1rem' }}>12</td>
            </tr>
            <tr>
              <td style={{ padding: '1rem' }}>SwaggerHub API</td>
              <td style={{ padding: '1rem', color: '#ffb74d' }}>Throttled</td>
              <td style={{ padding: '1rem' }}>85,410</td>
              <td style={{ padding: '1rem', color: '#ff4444' }}>429 Too Many Requests</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
