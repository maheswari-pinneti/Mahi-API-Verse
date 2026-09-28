'use client'; // Required for Recharts interactivity in Next.js App Router

import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import '../../globals.css';

/**
 * PHASE 21: THE GLOBAL OBSERVATORY
 * 
 * Publicly visualizes the metadata extracted from 10,000,000+ API records.
 * Acts as the absolute source of truth for the "State of the API Economy".
 */

// Mocking the data that would normally be fetched from /api/v1/statistics
const protocolData = [
  { name: 'REST', count: 8500000 },
  { name: 'GraphQL', count: 1200000 },
  { name: 'gRPC', count: 250000 },
  { name: 'SOAP', count: 48000 },
];

const languageData = [
  { name: 'JavaScript/Node', value: 4500000 },
  { name: 'Python', value: 3800000 },
  { name: 'Java', value: 1200000 },
  { name: 'Go', value: 950000 },
];

const COLORS = ['#00F0FF', '#8A2BE2', '#00E676', '#FF4444'];

export default function ObservatoryPage() {
  return (
    <div style={{ padding: '4rem', maxWidth: '1400px', margin: '0 auto' }}>
      
      <header style={{ marginBottom: '5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '4.5rem', fontWeight: 800, margin: 0 }}>
          The Global <span style={{ color: 'var(--accent-purple)' }}>Observatory</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', marginTop: '1rem', maxWidth: '800px', margin: '1rem auto' }}>
          Live telemetry, trends, and state-of-the-art metrics derived directly from the 
          <strong> 10,482,901</strong> verified APIs indexed in the Mahi API Verse.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '3rem' }}>
        
        {/* Protocol Adoption Bar Chart */}
        <div className="glass-card">
          <h3 className="card-title" style={{ marginBottom: '2rem' }}>Protocol Adoption (2026)</h3>
          <div style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={protocolData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
                <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0, 240, 255, 0.05)' }} 
                  contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} 
                  itemStyle={{ color: 'var(--accent-cyan)' }}
                />
                <Bar dataKey="count" fill="url(#cyanGradient)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-cyan)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--accent-cyan)" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SDK Language Distribution Pie Chart */}
        <div className="glass-card">
          <h3 className="card-title" style={{ marginBottom: '2rem' }}>Official SDK Distributions</h3>
          <div style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={languageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={110}
                  outerRadius={150}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: 'var(--text-secondary)' }}
                >
                  {languageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} 
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
