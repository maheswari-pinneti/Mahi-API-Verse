export default function APIsPage() {
  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#111827', letterSpacing: '-0.025em' }}>
        API Catalog
      </h1>
      <p style={{ fontSize: '1.25rem', color: '#6b7280', marginTop: '0.5rem', marginBottom: '3rem' }}>
        Browse and search over 10,000,000 verified APIs across every platform.
      </p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {[
          { name: 'Stripe API', category: 'Payments', endpoints: 312, status: 'Verified' },
          { name: 'OpenAI API', category: 'Artificial Intelligence', endpoints: 48, status: 'Verified' },
          { name: 'Twilio API', category: 'Communication', endpoints: 204, status: 'Verified' },
          { name: 'GitHub GraphQL', category: 'DevTools', endpoints: 890, status: 'Verified' },
          { name: 'Google Maps API', category: 'Geolocation', endpoints: 156, status: 'Verified' },
          { name: 'Cloudflare API', category: 'Infrastructure', endpoints: 421, status: 'Verified' },
        ].map(api => (
          <div key={api.name} style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            cursor: 'pointer',
            transition: 'box-shadow 0.2s'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3 style={{ fontWeight: 700, fontSize: '1.125rem', color: '#111827', margin: 0 }}>{api.name}</h3>
              <span style={{ 
                padding: '0.25rem 0.625rem', 
                borderRadius: '999px', 
                backgroundColor: '#dcfce7', 
                color: '#166534', 
                fontSize: '0.75rem', 
                fontWeight: 600 
              }}>
                {api.status}
              </span>
            </div>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>{api.category}</p>
            <div style={{ 
              marginTop: '1rem', 
              paddingTop: '1rem', 
              borderTop: '1px solid #f3f4f6', 
              fontSize: '0.875rem', 
              color: '#4b5563' 
            }}>
              {api.endpoints.toLocaleString()} endpoints
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
