import React from 'react';
import '../../globals.css';

/**
 * PHASE 15: DEVELOPER DASHBOARD
 * 
 * Authenticated layout for developers to manage their API Keys, usage, 
 * and platform integrations.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  
  // Note: In production, this layout would use NextAuth (or similar) 
  // to enforce strict authentication before rendering children.

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      
      {/* Dashboard Sidebar */}
      <aside style={{ 
        width: '260px', 
        background: 'var(--bg-secondary)', 
        borderRight: '1px solid var(--glass-border)', 
        padding: '2rem' 
      }}>
        <h2 style={{ 
          marginBottom: '2.5rem', 
          color: 'var(--accent-cyan)',
          fontSize: '1.2rem',
          letterSpacing: '1px'
        }}>
          DEVELOPER HUB
        </h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', color: 'var(--text-secondary)' }}>
          <a href="/dashboard" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>📊 Overview</a>
          <a href="/dashboard/keys">🔑 API Keys</a>
          <a href="/dashboard/submit">🚀 Submit API</a>
          <a href="/dashboard/claims">🛡️ Claim Ownership</a>
          <a href="/dashboard/webhooks">🔗 Webhooks</a>
          <a href="/dashboard/settings">⚙️ Settings</a>
        </nav>
      </aside>

      {/* Main Dashboard Content Area */}
      <main style={{ flex: 1, padding: '3rem 5rem' }}>
        {children}
      </main>

    </div>
  );
}
