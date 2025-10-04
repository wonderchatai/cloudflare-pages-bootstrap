
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/location')
      .then((res) => res.json())
      .then((data) => {
        setLocationData(data);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <div style={{ padding: '2rem', borderRadius: '12px', background: 'white', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.1)' }}>
        <h1 style={{ textAlign: 'center', color: '#333' }}>Your Location Information</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <pre style={{ background: '#fafafa', padding: '1rem', borderRadius: '8px', whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(locationData, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
