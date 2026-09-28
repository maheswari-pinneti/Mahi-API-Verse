"use client";

import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePasskeyAuth = async (mode: 'login' | 'signup') => {
    setLoading(true);
    setMessage("");

    try {
      // Simulate WebAuthn navigator.credentials.create() / get()
      // In production, this would use @simplewebauthn/browser
      if (!window.PublicKeyCredential) {
        throw new Error("WebAuthn / Passkeys are not supported by this browser.");
      }

      // UX delay for biometric prompt simulation
      await new Promise(resolve => setTimeout(resolve, 1500));

      setMessage(`✅ Successfully authenticated via Passkey! Welcome to the Mahi API Verse.`);
    } catch (err: any) {
      setMessage(`❌ Authentication failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: '#ffffff',
        padding: '2.5rem',
        borderRadius: '16px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          backgroundColor: '#eff6ff',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto'
        }}>
          {/* Fingerprint / FaceID Icon Mock */}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12Z"/>
            <path d="M7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12"/>
            <path d="M9 14.5C9 12.8431 10.3431 11.5 12 11.5C13.6569 11.5 15 12.8431 15 14.5"/>
            <path d="M12 16.5C10.8954 16.5 10 15.6046 10 14.5"/>
          </svg>
        </div>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: '0 0 0.5rem 0' }}>
          Mahi API Verse
        </h1>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '2rem' }}>
          Sign in or create an account using Passkeys. No passwords required.
        </p>

        <button 
          onClick={() => handlePasskeyAuth('login')}
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#111827',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '1rem',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            marginBottom: '1rem',
            transition: 'background-color 0.2s'
          }}
        >
          {loading ? 'Waiting for Biometrics...' : 'Sign in with Passkey'}
        </button>

        <button 
          onClick={() => handlePasskeyAuth('signup')}
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#f3f4f6',
            color: '#374151',
            fontWeight: 600,
            fontSize: '1rem',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: 'background-color 0.2s'
          }}
        >
          Create Account
        </button>

        {message && (
          <div style={{
            marginTop: '1.5rem',
            padding: '0.75rem',
            borderRadius: '8px',
            backgroundColor: message.includes('✅') ? '#dcfce7' : '#fee2e2',
            color: message.includes('✅') ? '#166534' : '#991b1b',
            fontSize: '0.875rem',
            fontWeight: 500
          }}>
            {message}
          </div>
        )}
      </div>
    </main>
  );
}
