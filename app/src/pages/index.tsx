
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head'; // Import Head for title

export default function HomePage() {
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/location')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setLocationData(data.data);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Failed to fetch location data:", e);
        setError(e.message);
        setLoading(false);
      });
  }, []);

  const renderData = () => {
    if (loading) {
      return <p style={{ textAlign: 'center', fontSize: '1.2em' }}>Loading location data...</p>;
    }
    if (error) {
      return <p style={{ textAlign: 'center', color: '#e74c3c', fontSize: '1.2em' }}>Error: {error}</p>;
    }
    if (!locationData) {
      return <p style={{ textAlign: 'center', fontSize: '1.2em' }}>No location data available.</p>;
    };

    const { clientIp, country, city, region, latitude, longitude, timezone } = locationData;

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={dataCardStyle}><strong>IP Address:</strong> {clientIp || 'N/A'}</div>
        <div style={dataCardStyle}><strong>Country:</strong> {country || 'N/A'}</div>
        <div style={dataCardStyle}><strong>City:</strong> {city || 'N/A'}</div>
        <div style={dataCardStyle}><strong>Region:</strong> {region || 'N/A'}</div>
        <div style={dataCardStyle}><strong>Latitude:</strong> {latitude || 'N/A'}</div>
        <div style={dataCardStyle}><strong>Longitude:</strong> {longitude || 'N/A'}</div>
        <div style={dataCardStyle}><strong>Timezone:</strong> {timezone || 'N/A'}</div>
      </div>
    );
  };

  const dataCardStyle = {
    background: '#fff',
    padding: '1.5rem',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    borderLeft: '5px solid #3498db',
    fontSize: '1.1em',
    color: '#333',
  };

  return (
    <div style={{
      fontFamily: "'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      lineHeight: '1.6',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(to right, #ece9e6, #ffffff)',
      padding: '2rem',
      boxSizing: 'border-box'
    }}>
      <Head>
        <title>Prompting Cloudflare App using WonderChat</title>
      </Head>
      <div style={{
        maxWidth: '800px',
        width: '100%',
        padding: '2.5rem',
        borderRadius: '15px',
        background: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(10px)',
        boxSizing: 'border-box'
      }}>
        <h1 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '2rem', fontSize: '2.5em' }}>
          <span style={{ color: '#3498db' }}>Geo</span>Location <span style={{ color: '#2ecc71' }}>Info</span>
        </h1>
        {renderData()}

        {/* Link to Summary Page */}
        
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link href="/summary" style={{ display: 'inline-block', padding: '0.8rem 1.5rem', background: '#2ecc71', color: 'white', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
            View LLM Conversation Log
          </Link>
        </div>
        
      </div>
      <footer style={{ marginTop: '2rem', textAlign: 'center', color: '#666' }}>
        Built with <a href="https://wonderchat.dev" target="_blank" rel="noopener noreferrer" style={{ color: '#3498db', textDecoration: 'none' }}>WonderChat</a>
      </footer>
    </div>
  );
}
