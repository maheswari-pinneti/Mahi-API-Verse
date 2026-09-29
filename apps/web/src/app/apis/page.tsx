export const revalidate = 60; // Revalidate every 60 seconds

export default async function APIsPage() {
  let apisList: any[] = [];
  try {
    const res = await fetch(`http://127.0.0.1:3001/v1/apis`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      apisList = data.data || [];
    }
  } catch (err) {
    console.error('Failed to fetch APIs:', err);
  }

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#111827', letterSpacing: '-0.025em' }}>
        API Catalog
      </h1>
      <p style={{ fontSize: '1.25rem', color: '#6b7280', marginTop: '0.5rem', marginBottom: '3rem' }}>
        Browse and search our catalog of verified APIs across every platform.
      </p>

      {apisList.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#f9fafb', borderRadius: '12px' }}>
          <p style={{ color: '#6b7280' }}>No APIs found or API Server is unreachable. Please start the backend API.</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {apisList.map(api => (
            <a href={`/apis/${api.slug}`} key={api.id} style={{ textDecoration: 'none' }}>
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '1.5rem',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                transition: 'box-shadow 0.2s',
                height: '100%'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1.125rem', color: '#111827', margin: 0 }}>{api.name}</h3>
                  <span style={{ 
                    padding: '0.25rem 0.625rem', 
                    borderRadius: '999px', 
                    backgroundColor: api.lifecycle === 'VERIFIED' ? '#dcfce7' : '#f3f4f6', 
                    color: api.lifecycle === 'VERIFIED' ? '#166534' : '#4b5563', 
                    fontSize: '0.75rem', 
                    fontWeight: 600 
                  }}>
                    {api.lifecycle}
                  </span>
                </div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>{api.category || 'Uncategorized'}</p>
                <div style={{ 
                  marginTop: '1rem', 
                  paddingTop: '1rem', 
                  borderTop: '1px solid #f3f4f6', 
                  fontSize: '0.875rem', 
                  color: '#4b5563' 
                }}>
                  v{api.version || '1.0'} &bull; {api.slug}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}
