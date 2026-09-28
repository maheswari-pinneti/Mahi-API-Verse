'use client';

import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Area, AreaChart 
} from 'recharts';

// Mock data for analytics
const usageData = [
  { name: 'Mon', requests: 12000, errors: 400 },
  { name: 'Tue', requests: 19000, errors: 300 },
  { name: 'Wed', requests: 15000, errors: 600 },
  { name: 'Thu', requests: 22000, errors: 200 },
  { name: 'Fri', requests: 28000, errors: 800 },
  { name: 'Sat', requests: 35000, errors: 400 },
  { name: 'Sun', requests: 42051, errors: 500 },
];

const monitoredApis = [
  { id: '1', name: 'Stripe API', status: 'Healthy', latency: '45ms', successRate: '99.9%' },
  { id: '2', name: 'Twilio REST', status: 'Degraded', latency: '412ms', successRate: '92.4%' },
  { id: '3', name: 'GitHub GraphQL', status: 'Healthy', latency: '120ms', successRate: '99.9%' },
];

export default function DashboardOverview() {
  const [keys, setKeys] = useState([
    { id: '1', name: 'Production Application', prefix: 'mkv_prod_8f92', created: '2026-09-01' },
    { id: '2', name: 'Development Testing', prefix: 'mkv_test_3a11', created: '2026-09-15' },
  ]);

  const generateKey = () => {
    const newPrefix = 'mkv_' + (Math.random() > 0.5 ? 'prod_' : 'test_') + Math.random().toString(36).substring(2, 6);
    setKeys([...keys, { id: Date.now().toString(), name: 'New API Key', prefix: newPrefix, created: new Date().toISOString().split('T')[0] }]);
  };

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0 }}>Developer Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Monitor usage, manage keys, and track API health.</p>
        </div>
        <button style={{ 
          padding: '0.8rem 1.5rem', 
          background: 'linear-gradient(90deg, var(--accent-purple), var(--accent-cyan))', 
          color: 'white', 
          border: 'none', 
          borderRadius: '8px',
          fontWeight: 600,
          cursor: 'pointer'
        }} onClick={generateKey}>
          + New Secret Key
        </button>
      </header>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        
        {/* Usage Analytics Card */}
        <div className="glass-card" style={{ gridColumn: '1 / -1' }}>
          <h3 className="card-title">API Request Volume (Last 7 Days)</h3>
          <div style={{ height: '300px', width: '100%', marginTop: '2rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-cyan)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-cyan)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(10,10,15,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="requests" stroke="var(--accent-cyan)" fillOpacity={1} fill="url(#colorReq)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* API Keys Management */}
        <div className="glass-card">
          <h3 className="card-title">Active API Keys</h3>
          <p className="card-desc">Use these keys to access the 10M+ records programmatically.</p>
          
          <div style={{ margin: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {keys.map(key => (
              <div key={key.id} style={{ 
                background: 'rgba(0,0,0,0.5)', 
                padding: '1rem', 
                borderRadius: '8px', 
                border: '1px solid var(--glass-border)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <strong>{key.name}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{key.created}</span>
                </div>
                <div style={{
                  fontFamily: 'monospace',
                  color: 'var(--accent-cyan)',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>{key.prefix}****************</span>
                  <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline' }}>Revoke</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monitored APIs Health */}
        <div className="glass-card">
          <h3 className="card-title">Monitored Services</h3>
          <p className="card-desc">Real-time health status of your most frequently used APIs.</p>
          
          <div style={{ margin: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {monitoredApis.map(api => (
              <div key={api.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '8px'
              }}>
                <div>
                  <strong style={{ display: 'block', marginBottom: '0.2rem' }}>{api.name}</strong>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span>⏱ {api.latency}</span>
                    <span>✓ {api.successRate}</span>
                  </div>
                </div>
                <div style={{
                  padding: '0.3rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  backgroundColor: api.status === 'Healthy' ? 'rgba(46, 213, 115, 0.2)' : 'rgba(255, 71, 87, 0.2)',
                  color: api.status === 'Healthy' ? '#2ed573' : '#ff4757'
                }}>
                  {api.status}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
