import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mahi API Verse | The Universal Open API Catalog',
  description: 'The Open Universe of APIs for Every Developer, Every Language, and Every Platform.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Inter, system-ui, sans-serif', backgroundColor: '#f9fafb', color: '#111827' }}>
        
        {/* Persistent Premium Navbar */}
        <nav style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '1.25rem 2rem', 
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <a href="/" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', textDecoration: 'none', letterSpacing: '-0.025em' }}>
              Mahi API Verse
            </a>
            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
              <a href="/apis" style={{ color: '#4b5563', textDecoration: 'none' }}>API Catalog</a>
              <a href="/observatory" style={{ color: '#4b5563', textDecoration: 'none' }}>Live Metrics</a>
              <a href="/dashboard" style={{ color: '#4b5563', textDecoration: 'none' }}>Data Exports</a>
            </div>
          </div>
          <div>
            <a href="/login" style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: '#111827', 
              color: '#ffffff', 
              textDecoration: 'none', 
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: 600
            }}>
              Passkey Sign In
            </a>
          </div>
        </nav>

        {children}

        {/* Persistent Premium Footer */}
        <footer style={{ 
          padding: '4rem 2rem', 
          backgroundColor: '#111827', 
          color: '#d1d5db',
          marginTop: '4rem',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>Mahi API Verse 🌌</div>
            <div style={{ fontSize: '0.875rem' }}>10M+ APIs Indexed. Built for the Global Ecosystem.</div>
          </div>
        </footer>

      </body>
    </html>
  )
}
