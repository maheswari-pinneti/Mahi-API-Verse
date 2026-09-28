import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { CodeGenerator } from './CodeGenerator';

/**
 * PHASE 12: API PLAYGROUND
 * 
 * A robust interactive UI for testing APIs directly within Mahi API Verse.
 * Includes Monaco Editor for JSON payloads, status code tracking, and snippet generation.
 */

export const ApiPlayground: React.FC = () => {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://api.github.com/zen');
  const [headers, setHeaders] = useState<Record<string, string>>({ 'Accept': 'application/json' });
  const [authKey, setAuthKey] = useState('');
  const [body, setBody] = useState('{\n  \n}');
  
  const [response, setResponse] = useState<string>('// Hit Send to execute request');
  const [status, setStatus] = useState<number | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [snippetLanguage, setSnippetLanguage] = useState<'curl' | 'javascript' | 'python'>('curl');

  const handleExecute = async () => {
    const startTime = Date.now();
    try {
      const activeHeaders = { ...headers };
      if (authKey) activeHeaders['Authorization'] = `Bearer ${authKey}`;

      const res = await fetch(url, {
        method,
        headers: activeHeaders,
        body: ['POST', 'PUT', 'PATCH'].includes(method) ? body : undefined
      });

      setStatus(res.status);
      setLatency(Date.now() - startTime);

      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const json = await res.json();
        setResponse(JSON.stringify(json, null, 2));
      } else {
        const text = await res.text();
        setResponse(text);
      }
    } catch (error: any) {
      setStatus(0);
      setLatency(Date.now() - startTime);
      setResponse(`Error executing request: ${error.message}`);
    }
  };

  const getActiveSnippet = () => {
    const activeHeaders = { ...headers };
    if (authKey) activeHeaders['Authorization'] = `Bearer ${authKey}`;
    
    if (snippetLanguage === 'curl') return CodeGenerator.generateCurl(method, url, activeHeaders, body);
    if (snippetLanguage === 'javascript') return CodeGenerator.generateFetch(method, url, activeHeaders, body);
    if (snippetLanguage === 'python') return CodeGenerator.generatePython(method, url, activeHeaders, body);
    return '';
  };

  return (
    <div className="playground-container" style={{ display: 'flex', gap: '20px' }}>
      
      {/* LEFT PANEL: Request Configuration */}
      <div className="request-panel" style={{ flex: 1 }}>
        <h3>🚀 Request Config</h3>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
          </select>
          <input 
            type="text" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)} 
            style={{ width: '100%' }} 
          />
          <button onClick={handleExecute} style={{ background: '#007ACC', color: 'white' }}>
            Send
          </button>
        </div>

        <div>
          <h4>Authentication (Bearer)</h4>
          <input type="password" placeholder="API Key..." value={authKey} onChange={(e) => setAuthKey(e.target.value)} />
        </div>

        <h4>Request Body (JSON)</h4>
        <div style={{ height: '300px', border: '1px solid #ccc' }}>
          <Editor
            defaultLanguage="json"
            value={body}
            onChange={(val) => setBody(val || '')}
            theme="vs-dark"
          />
        </div>
      </div>

      {/* RIGHT PANEL: Response & Snippets */}
      <div className="response-panel" style={{ flex: 1 }}>
        <h3>📦 Response</h3>
        {status && (
          <div style={{ marginBottom: '10px' }}>
            <span style={{ color: status < 400 ? 'green' : 'red' }}>Status: {status}</span> | 
            <span> Latency: {latency}ms</span>
          </div>
        )}
        
        <div style={{ height: '400px', border: '1px solid #ccc' }}>
          <Editor
            defaultLanguage="json"
            value={response}
            options={{ readOnly: true }}
            theme="vs-dark"
          />
        </div>

        <h3 style={{ marginTop: '20px' }}>💻 Code Snippet</h3>
        <select value={snippetLanguage} onChange={(e: any) => setSnippetLanguage(e.target.value)}>
          <option value="curl">cURL</option>
          <option value="javascript">JavaScript (Fetch)</option>
          <option value="python">Python (Requests)</option>
        </select>
        <pre style={{ background: '#f4f4f4', padding: '10px' }}>
          {getActiveSnippet()}
        </pre>
      </div>

    </div>
  );
};
