"use client";

import { useEffect, useState } from "react";

interface LiveMetric {
  apiName: string;
  requestsPerSecond: number;
  totalCalls: number;
  latencyMs: number;
  trend: 'up' | 'down' | 'stable';
}

export function KPICards() {
  const [metrics, setMetrics] = useState<LiveMetric[]>([]);

  useEffect(() => {
    // Simulate live telemetry stream for API Usage
    const generateMetrics = () => [
      {
        apiName: "Stripe API",
        requestsPerSecond: Math.floor(Math.random() * 500) + 1200,
        totalCalls: 14500200,
        latencyMs: Math.floor(Math.random() * 10) + 45,
        trend: 'up' as const
      },
      {
        apiName: "Twilio API",
        requestsPerSecond: Math.floor(Math.random() * 200) + 800,
        totalCalls: 9800500,
        latencyMs: Math.floor(Math.random() * 15) + 60,
        trend: 'stable' as const
      },
      {
        apiName: "OpenAI API",
        requestsPerSecond: Math.floor(Math.random() * 800) + 2500,
        totalCalls: 32000000,
        latencyMs: Math.floor(Math.random() * 50) + 120,
        trend: 'up' as const
      },
      {
        apiName: "GitHub GraphQL",
        requestsPerSecond: Math.floor(Math.random() * 300) + 600,
        totalCalls: 5400000,
        latencyMs: Math.floor(Math.random() * 5) + 30,
        trend: 'down' as const
      }
    ];

    setMetrics(generateMetrics());
    const interval = setInterval(() => {
      setMetrics(generateMetrics());
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem', color: '#111827' }}>
        Live API Usage Analytics
      </h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {metrics.sort((a, b) => b.requestsPerSecond - a.requestsPerSecond).map((api) => (
          <div 
            key={api.apiName}
            style={{
              padding: '1.5rem',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              transition: 'transform 0.2s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#374151', margin: 0 }}>
                {api.apiName}
              </h3>
              <span style={{ 
                padding: '0.25rem 0.5rem', 
                borderRadius: '9999px', 
                fontSize: '0.75rem', 
                fontWeight: 600,
                backgroundColor: api.trend === 'up' ? '#dcfce7' : api.trend === 'down' ? '#fee2e2' : '#f3f4f6',
                color: api.trend === 'up' ? '#166534' : api.trend === 'down' ? '#991b1b' : '#1f2937'
              }}>
                {api.trend === 'up' ? '↗ Rising' : api.trend === 'down' ? '↘ Falling' : '→ Stable'}
              </span>
            </div>
            
            <div style={{ marginTop: '1rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#111827' }}>
                {api.requestsPerSecond.toLocaleString()} <span style={{ fontSize: '1rem', color: '#6b7280', fontWeight: 400 }}>RPS</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb', fontSize: '0.875rem', color: '#4b5563' }}>
                <div>
                  <span style={{ display: 'block', fontWeight: 600 }}>Total Calls</span>
                  {(api.totalCalls / 1000000).toFixed(1)}M
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'block', fontWeight: 600 }}>P99 Latency</span>
                  {api.latencyMs}ms
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
