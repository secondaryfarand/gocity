import React, { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import ComplaintMap from '../complaint/components/ComplaintMap';
import DashboardAnalytics from './DashboardAnalitics'; // <-- 1. Impor komponen analitik

export default function StaffDashboard() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [complaints, setComplaints] = useState([]);
  
  const [cctvList, setCctvList] = useState([]);
  const [activeCCTV, setActiveCCTV] = useState(null);

  const [loading, setLoading] = useState(true);
  const [isStaff, setIsStaff] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [aqiList, setAqiList] = useState([]);
  const [crimeList, setCrimeList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();

        const [resComplaints, resCCTV, resAQI, resCrimes] = await Promise.all([
          fetch('/api/complaints', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/cctv', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/aqi'),
          fetch('/api/crimes')
        ]);

        if (resComplaints.status === 401 || resComplaints.status === 403) {
          setIsStaff(false);
          setLoading(false);
          return;
        }

        const dataComplaints = await resComplaints.json();
        const dataCCTV = await resCCTV.json();
        const dataAQI = await resAQI.json();
        const dataCrimes = await resCrimes.json();

        if (dataComplaints.success) setComplaints(dataComplaints.data);
        if (dataCCTV.success && dataCCTV.data.length > 0) {
          setCctvList(dataCCTV.data);
          setActiveCCTV(dataCCTV.data[0]);
        }
        if (dataAQI.success) setAqiList(dataAQI.data);
        if (dataCrimes.success) setCrimeList(dataCrimes.data);

      } catch (err) {
        console.error('Error fetching data:', err);
        setErrorMessage('Terjadi kesalahan koneksi ke server.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getToken]);

  const handleUpdateStatus = async (ticketNumber, newStatus) => {
    try {
      const token = await getToken();
      const res = await fetch(`/api/complaints/${ticketNumber}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const result = await res.json();
      if (result.success) {
        alert('Status berhasil diubah!');
        setComplaints(complaints.map(c => c.ticketNumber === ticketNumber ? { ...c, status: newStatus } : c));
      } else {
        alert('Gagal: ' + result.message);
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi.');
    }
  };

  if (loading) return <p style={{ padding: '20px', fontFamily: 'Arial' }}>Memuat Dashboard Staf...</p>;

  if (!isStaff) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', fontFamily: 'Arial' }}>
        <h2 style={{ color: '#dc3545', marginBottom: '10px' }}>Akses Ditolak 🚫</h2>
        <p style={{ color: '#666', marginBottom: '20px', fontSize: '15px' }}>
          Maaf, akun Anda (<strong>{user?.primaryEmailAddress?.emailAddress}</strong>) tidak memiliki hak akses sebagai Staf atau Admin.
        </p>
        <a 
          href="/" 
          style={{ padding: '10px 20px', background: '#007bff', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}
        >
          Kembali ke Beranda Warga
        </a>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px 5rem', fontFamily: 'Plus Jakarta Sans, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#1e293b' }}>Dashboard Monitoring Staf & Smart City</h2>
        <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Kelola laporan pengaduan masyarakat, pantau data analitik kota, dan kontrol arus lalu lintas secara real-time.</p>
      </div>

      {errorMessage && (
        <div style={{ padding: '12px', background: '#f8d7da', color: '#721c24', borderRadius: '6px', marginBottom: '20px' }}>
          {errorMessage}
        </div>
      )}

      {/* --- 2. SEMATKAN DASHBOARD ANALITICS DI BAGIAN ATAS --- */}
      <DashboardAnalytics />

      {/* Bagian Live Streaming CCTV */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <div style={{ flex: '2', background: '#000', borderRadius: '12px', overflow: 'hidden', minWidth: '300px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <div style={{ background: '#1e293b', color: '#fff', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: '600' }}>📹 {activeCCTV ? activeCCTV.name : 'Pilih CCTV'}</span>
            <span style={{ color: activeCCTV?.status === 'MACET' ? '#f87171' : '#4ade80', fontWeight: 'bold', fontSize: '13px' }}>
              {activeCCTV ? `STATUS: ${activeCCTV.status}` : 'OFFLINE'}
            </span>
          </div>
          {activeCCTV ? (
            <iframe 
              src={`${activeCCTV.streamUrl}?autoplay=1&mute=1&modestbranding=1&rel=0`} 
              title={activeCCTV.name}
              width="100%" 
              height="320px" 
              style={{ border: 'none' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            />
          ) : (
            <div style={{ height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
              Tidak ada CCTV aktif.
            </div>
          )}
        </div>

        <div style={{ flex: '1', background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', minWidth: '240px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#1e293b' }}>Daftar Titik CCTV</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
            {cctvList.map((cam) => (
              <button
                key={cam._id}
                onClick={() => setActiveCCTV(cam)}
                style={{
                  padding: '10px 14px',
                  background: activeCCTV?._id === cam._id ? '#0284c7' : '#f8fafc',
                  color: activeCCTV?._id === cam._id ? '#fff' : '#334155',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '13px',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
              >
                📍 {cam.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bagian Peta Interaktif */}
      <div style={{ marginBottom: '30px', background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#1e293b' }}>Peta Sebaran Titik Aduan & CCTV Kota</h3>
        <ComplaintMap 
          complaints={complaints} 
          cctvList={cctvList} 
          aqiList={aqiList} 
          crimeList={crimeList}
          onSelectCCTV={(cam) => setActiveCCTV(cam)} 
        />
      </div>

      {/* Bagian Tabel Daftar Aduan */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#1e293b' }}>Daftar Seluruh Laporan ({complaints.length})</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                <th style={tableStyle}>Tiket</th>
                <th style={tableStyle}>Kategori</th>
                <th style={tableStyle}>Isi Aduan</th>
                <th style={tableStyle}>Status</th>
                <th style={tableStyle}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {complaints.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>Belum ada laporan pengaduan.</td>
                </tr>
              ) : (
                complaints.map((c) => (
                  <tr key={c.ticketNumber} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={tableStyle}><strong>{c.ticketNumber}</strong></td>
                    <td style={tableStyle}>{c.category}</td>
                    <td style={tableStyle}>{c.content ? c.content.substring(0, 50) + '...' : '-'}</td>
                    <td style={tableStyle}>
                      <span style={{ padding: '4px 10px', borderRadius: '20px', background: '#f1f5f9', color: '#334155', fontSize: '12px', fontWeight: '600' }}>
                        {c.status}
                      </span>
                    </td>
                    <td style={tableStyle}>
                      <select 
                        value={c.status} 
                        onChange={(e) => handleUpdateStatus(c.ticketNumber, e.target.value)}
                        style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff' }}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="RESOLVED">RESOLVED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const tableStyle = { padding: '14px 12px', fontSize: '13px', color: '#334155' };