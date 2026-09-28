import { KPICards } from "../components/KPICards";
import { LiveGlobe } from "../components/LiveGlobe";

export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Mahi API Verse</h1>
      <p style={{ color: '#4b5563', fontSize: '1.125rem' }}>
        The universal catalog of 10M+ APIs and 700+ language SDKs.
      </p>
      
      <KPICards />
      <LiveGlobe />

      <div style={{ marginTop: '3rem', padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '12px', backgroundColor: '#f9fafb' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>⚠️ Development Notice</h2>
        <p style={{ color: '#6b7280', lineHeight: 1.6 }}>
          Per our architectural roadmap, the Web Portal is currently scaffolding. 
          Everything is displayed directly on the GitHub repository natively. 
          No public website is deployed yet until the ingestion pipeline has 
          populated the core database with verified API signatures.
        </p>
      </div>
    </main>
  )
}
