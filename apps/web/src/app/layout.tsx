import './globals.css';

export const metadata = {
  title: 'Mahi API Verse | The Global API Directory',
  description: 'Search, discover, and test over 10 million APIs.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="navbar">
          <div className="nav-brand">Mahi API Verse</div>
          <input 
            type="text" 
            className="search-bar" 
            placeholder="Search 10,000,000+ APIs (e.g. 'GraphQL weather')..." 
          />
          <div className="nav-links" style={{ display: 'flex', gap: '1.5rem', fontWeight: 500 }}>
            <a href="/categories">Categories</a>
            <a href="/verified" style={{ color: '#00E676' }}>Verified</a>
            <a href="/playground">Playground</a>
          </div>
        </nav>
        
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
