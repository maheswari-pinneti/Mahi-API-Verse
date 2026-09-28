"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";

export function LiveGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;
    
    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0.3,
      dark: 0, // Light mode
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [1, 1, 1], // White sphere
      markerColor: [0.1, 0.8, 1], // Glowing blue for activity
      glowColor: [0.9, 0.9, 0.9],
      markers: [
        // US Data Centers
        { location: [37.7595, -122.4367], size: 0.1 }, // SF
        { location: [40.7128, -74.0060], size: 0.1 },  // NY
        // EU Data Centers
        { location: [51.5072, 0.1276], size: 0.08 },   // London
        { location: [50.1109, 8.6821], size: 0.09 },   // Frankfurt
        // APAC Data Centers
        { location: [1.3521, 103.8198], size: 0.1 },   // Singapore
        { location: [35.6762, 139.6503], size: 0.08 }, // Tokyo
        // India
        { location: [19.0760, 72.8777], size: 0.12 },  // Mumbai
        { location: [12.9716, 77.5946], size: 0.11 },  // Bangalore
      ],
      onRender: (state) => {
        // Automatically rotate the globe
        state.phi = phi;
        phi += 0.005;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <div style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: '2rem',
      backgroundColor: '#f9fafb',
      padding: '2rem',
      borderRadius: '16px',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827', margin: 0 }}>
          Global API Traffic Distribution
        </h2>
        <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
          Real-time visualization of 10M+ API requests across international data centers.
        </p>
      </div>
      
      <div style={{
        width: '100%',
        maxWidth: '600px',
        aspectRatio: '1 / 1',
        position: 'relative'
      }}>
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            contain: 'layout paint size',
            opacity: 1,
            transition: 'opacity 1s ease',
          }}
        />
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '2rem', 
        marginTop: '1.5rem',
        padding: '1rem 2rem',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>USA</div>
          <div style={{ fontSize: '0.875rem', color: '#4b5563' }}>45% Traffic</div>
        </div>
        <div style={{ textAlign: 'center', borderLeft: '1px solid #e5e7eb', paddingLeft: '2rem' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>INDIA</div>
          <div style={{ fontSize: '0.875rem', color: '#4b5563' }}>28% Traffic</div>
        </div>
        <div style={{ textAlign: 'center', borderLeft: '1px solid #e5e7eb', paddingLeft: '2rem' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>EU</div>
          <div style={{ fontSize: '0.875rem', color: '#4b5563' }}>15% Traffic</div>
        </div>
      </div>
    </div>
  );
}
