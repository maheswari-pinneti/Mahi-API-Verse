import React from 'react';

export default function DashboardOverview() {
  return (
    <div>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0 }}>Welcome back, Developer</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Manage your Mahi API Verse integrations and usage.</p>
      </header>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '2rem' 
      }}>
        
        {/* Usage Analytics Card */}
        <div className="glass-card">
          <h3 className="card-title">Platform Usage (This Month)</h3>
          <div style={{ fontSize: '3.5rem', fontWeight: 800, margin: '1rem 0', color: 'var(--accent-cyan)' }}>
            42,051
          </div>
          <div className="card-desc">Requests made via Playground & auto-generated SDKs. Limit: 100,000.</div>
          
          {/* Progress Bar */}
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', marginTop: '1rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '42%', background: 'var(--accent-cyan)' }}></div>
          </div>
        </div>

        {/* API Keys Management */}
        <div className="glass-card">
          <h3 className="card-title">Production API Keys</h3>
          <p className="card-desc" style={{ flexGrow: 0 }}>Use these keys to access the 10M+ records programmatically.</p>
          
          <div style={{ margin: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <div style={{ 
              background: 'rgba(0,0,0,0.5)', 
              padding: '0.8rem 1rem', 
              borderRadius: '8px', 
              fontFamily: 'monospace',
              border: '1px solid var(--glass-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>mkv_prod_8f92jXvLm...</span> 
              <button style={{ background: 'transparent', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer' }}>Copy</button>
            </div>
          </div>

          <button style={{ 
            width: '100%', 
            padding: '1rem', 
            background: 'linear-gradient(90deg, var(--accent-purple), var(--accent-cyan))', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            + Generate New Secret Key
          </button>
        </div>

      </div>
    </div>
  );
}
