import React from 'react';
import '../../globals.css';

/**
 * PHASE 16: ADMIN PANEL (MISSION CONTROL)
 * 
 * Secure internal dashboard for platform operators to monitor ingestion 
 * pipelines, moderate submissions, and view infrastructure health.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  
  // Note: This layout would enforce strict Role-Based Access Control (RBAC)
  // Only users with 'role: ADMIN' can render this route.

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0505' }}>
      
      {/* Admin Sidebar (Distinguished by red/orange alert accents) */}
      <aside style={{ 
        width: '260px', 
        background: '#140a0a', 
        borderRight: '1px solid rgba(255, 50, 50, 0.2)', 
        padding: '2rem' 
      }}>
        <h2 style={{ 
          marginBottom: '2.5rem', 
          color: '#ff4444',
          fontSize: '1.2rem',
          letterSpacing: '1px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          ⚠️ MISSION CONTROL
        </h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', color: 'var(--text-secondary)' }}>
          <a href="/admin" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>📡 System Status</a>
          <a href="/admin/ingestion">🚜 Ingestion Pipeline</a>
          <a href="/admin/moderation">⚖️ Moderation Queue <span style={{ background: '#ff4444', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', marginLeft: 'auto' }}>14</span></a>
          <a href="/admin/users">👥 User Management</a>
          <a href="/admin/clusters">💾 Cluster Health (DB/OS)</a>
        </nav>
      </aside>

      {/* Main Admin Content Area */}
      <main style={{ flex: 1, padding: '3rem 5rem' }}>
        {children}
      </main>

    </div>
  );
}
