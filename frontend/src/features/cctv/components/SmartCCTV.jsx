import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';

export default function SmartCCTV() {
  const { getToken } = useAuth();
  const [cctvList, setCctvList] = useState([]);
  const [activeCCTV, setActiveCCTV] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCCTV = async () => {
      try {
        const token = await getToken();
        const res = await fetch('/api/cctv', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setCctvList(data.data);
          setActiveCCTV(data.data[0]); // Set default kamera pertama
        }
      } catch (err) {
        console.error('Gagal memuat data CCTV:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCCTV();
  }, [getToken]);

  if (loading) return <p style={{ padding: '20px' }}>Memuat sistem Smart CCTV...</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Smart City - Live Traffic & CCTV Monitoring</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Pemantauan infrastruktur lalu lintas kota secara terpusat untuk mitigasi kemacetan dan tanggap darurat.
      </p>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* Kolom Pemutar Live Stream */}
        <div style={{ flex: '2', background: '#000', borderRadius: '8px', overflow: 'hidden', minWidth: '320px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <div style={{ background: '#222', color: '#fff', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>📹 {activeCCTV ? activeCCTV.name : 'Pilih Kamera'}</span>
            <span style={{ 
              padding: '4px 8px', 
              borderRadius: '4px', 
              fontSize: '12px', 
              fontWeight: 'bold',
              background: activeCCTV?.status === 'MACET' ? '#dc3545' : '#2ecc71',
              color: '#fff'
            }}>
              {activeCCTV ? `STATUS: ${activeCCTV.status}` : 'OFFLINE'}
            </span>
          </div>

          {activeCCTV ? (
            <iframe 
              src={activeCCTV.streamUrl} 
              title={activeCCTV.name}
              width="100%" 
              height="380px" 
              style={{ border: 'none' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            />
          ) : (
            <div style={{ height: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
              Tidak ada CCTV yang dipilih.
            </div>
          )}
        </div>

        {/* Kolom Daftar Titik Kamera Kota */}
        <div style={{ flex: '1', background: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #ddd', minWidth: '260px' }}>
          <h3 style={{ marginBottom: '10px' }}>Daftar Titik CCTV Kota</h3>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>Klik salah satu titik untuk mengalihkan pandangan kamera.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '350px', overflowY: 'auto' }}>
            {cctvList.map((cam) => (
              <button
                key={cam._id}
                onClick={() => setActiveCCTV(cam)}
                style={{
                  padding: '12px',
                  background: activeCCTV?._id === cam._id ? '#007bff' : '#fff',
                  color: activeCCTV?._id === cam._id ? '#fff' : '#333',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontWeight: '500',
                  transition: 'background 0.2s'
                }}
              >
                📍 {cam.name}
                <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '4px' }}>
                  Kondisi: {cam.status}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}