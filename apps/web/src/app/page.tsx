import { KPICards } from "../components/KPICards";
import { LiveGlobe } from "../components/LiveGlobe";

export default function Home() {
  return (
    <main style={{ padding: '0', fontFamily: 'sans-serif' }}>
      {/* Hero Section */}
      <section style={{ 
        padding: '6rem 2rem', 
        textAlign: 'center', 
        backgroundColor: '#111827', 
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Futuristic Background Element */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-10%',
          width: '120%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, rgba(17,24,39,1) 60%)',
          zIndex: 0
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: '4.5rem', 
            fontWeight: 800, 
            letterSpacing: '-0.05em', 
            margin: '0 0 1.5rem 0',
            background: 'linear-gradient(to right, #60a5fa, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            The Open Universe of APIs.
          </h1>
          <p style={{ fontSize: '1.5rem', color: '#9ca3af', maxWidth: '800px', margin: '0 auto 2.5rem auto', lineHeight: 1.5 }}>
            Explore, connect, and stream our growing catalog of real-world API endpoints across multiple languages instantly. Built for the modern developer ecosystem.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a href="/apis" style={{
              padding: '1rem 2rem',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              borderRadius: '8px',
              fontSize: '1.125rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'background-color 0.2s'
            }}>
              Browse Catalog
            </a>
            <a href="/login" style={{
              padding: '1rem 2rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              borderRadius: '8px',
              fontSize: '1.125rem',
              fontWeight: 600,
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.2)',
              transition: 'background-color 0.2s'
            }}>
              Passkey Sign In
            </a>
          </div>
        </div>
      </section>

      {/* Global Intelligence Section */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#111827', margin: '0 0 1rem 0', letterSpacing: '-0.025em' }}>
            Planet-Scale Intelligence
          </h2>
          <p style={{ fontSize: '1.25rem', color: '#6b7280', maxWidth: '700px', margin: '0 auto' }}>
            Monitor real-time infrastructure throughput across international data centers globally.
          </p>
        </div>

        <KPICards />
        
        <div style={{ marginTop: '4rem' }}>
          <LiveGlobe />
        </div>
      </section>

      {/* Exporter Section */}
      <section style={{ backgroundColor: '#eff6ff', padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '4rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 400px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#111827', margin: '0 0 1rem 0', letterSpacing: '-0.025em' }}>
              Streaming NDJSON Extraction.
            </h2>
            <p style={{ fontSize: '1.25rem', color: '#4b5563', lineHeight: 1.6, marginBottom: '2rem' }}>
              Pull the entire knowledge graph straight into your own pipelines using our memory-safe streaming exports. Say goodbye to rate limits.
            </p>
            <a href="/dashboard" style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#111827',
              color: '#ffffff',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}>
              Download Data Releases
            </a>
          </div>
          <div style={{ flex: '1 1 400px' }}>
            <div style={{ 
              backgroundColor: '#111827', 
              padding: '2rem', 
              borderRadius: '16px', 
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              color: '#10b981',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              lineHeight: 1.5
            }}>
              <div style={{ color: '#6b7280', marginBottom: '1rem' }}>// Extracting rows safely...</div>
              <div>$ pg-cursor pull apis \</div>
              <div style={{ paddingLeft: '1rem' }}>--format=ndjson \</div>
              <div style={{ paddingLeft: '1rem' }}>{'--stream > apis_export.ndjson'}</div>
              <br/>
              <div style={{ color: '#eab308' }}>✓ Export Complete</div>
              <div style={{ color: '#3b82f6' }}>📂 Saved to releases/</div>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}
