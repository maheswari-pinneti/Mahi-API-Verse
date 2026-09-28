export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Mahi API Verse</h1>
      <p>The universal catalog of 10M+ APIs and 700+ language SDKs.</p>
      
      <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>⚠️ Development Notice</h2>
        <p>
          Per our architectural roadmap, the Web Portal is currently scaffolding. 
          Everything is displayed directly on the GitHub repository natively. 
          No public website is deployed yet until the ingestion pipeline has 
          populated the core database with verified API signatures.
        </p>
      </div>
    </main>
  )
}
