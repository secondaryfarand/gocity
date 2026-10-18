import React, { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/react';
import ComplaintMap from './ComplaintMap';

export default function StaffDashboard() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [complaints, setComplaints] = useState([]);
  
  // 1. Tambahkan state untuk CCTV
  const [cctvList, setCctvList] = useState([]);
  const [activeCCTV, setActiveCCTV] = useState(null);

  const [loading, setLoading] = useState(true);
  const [isStaff, setIsStaff] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [aqiList, setAqiList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();

        // Fetch Complaints & CCTV secara bersamaan agar efisien
        const [resComplaints, resCCTV, resAQI] = await Promise.all([
          fetch('/api/complaints', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/cctv', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/aqi') 
        ]);

        // Cek akses Staff dari complaints response
        if (resComplaints.status === 401 || resComplaints.status === 403) {
          setIsStaff(false);
          setLoading(false);
          return;
        }

        const dataComplaints = await resComplaints.json();
        const dataCCTV = await resCCTV.json();
        const dataAQI = await resAQI.json();

        if (dataComplaints.success) {
          setComplaints(dataComplaints.data);
        }

        if (dataCCTV.success && dataCCTV.data.length > 0) {
          setCctvList(dataCCTV.data);
          setActiveCCTV(dataCCTV.data[0]); // Set default kamera aktif pertama
        }

        if (dataAQI.success) {
          setAqiList(dataAQI.data);
        }

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
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Dashboard Monitoring Staf & Smart City</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>Kelola laporan pengaduan masyarakat dan pantau arus lalu lintas kota secara real-time.</p>

      {errorMessage && (
        <div style={{ padding: '10px', background: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '20px' }}>
          {errorMessage}
        </div>
      )}

      {/* 2. Bagian Live Streaming CCTV & Panel Pilihan */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <div style={{ flex: '2', background: '#000', borderRadius: '8px', overflow: 'hidden', minWidth: '300px' }}>
          <div style={{ background: '#222', color: '#fff', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
            <span>📹 {activeCCTV ? activeCCTV.name : 'Pilih CCTV'}</span>
            <span style={{ color: activeCCTV?.status === 'MACET' ? '#ff4d4d' : '#2ecc71', fontWeight: 'bold' }}>
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

        <div style={{ flex: '1', background: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #ddd', minWidth: '240px' }}>
          <h3>Daftar Titik CCTV</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '280px', overflowY: 'auto', marginTop: '10px' }}>
            {cctvList.map((cam) => (
              <button
                key={cam._id}
                onClick={() => setActiveCCTV(cam)}
                style={{
                  padding: '10px',
                  background: activeCCTV?._id === cam._id ? '#007bff' : '#fff',
                  color: activeCCTV?._id === cam._id ? '#fff' : '#333',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '13px'
                }}
              >
                📍 {cam.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Bagian Peta Interaktif Sebaran Laporan & CCTV (Kirim props cctvList dan onSelectCCTV) */}
      <div style={{ marginBottom: '30px' }}>
        <h3>Peta Sebaran Titik Aduan & CCTV Kota</h3>
        <ComplaintMap 
          complaints={complaints} 
          cctvList={cctvList} 
          aqiList={aqiList} 
          onSelectCCTV={(cam) => setActiveCCTV(cam)} 
        />
      </div>

      {/* 4. Bagian Tabel Daftar Aduan */}
      <h3>Daftar Seluruh Laporan ({complaints.length})</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', background: '#fff' }}>
        <thead>
          <tr style={{ background: '#f1f3f5', textAlign: 'left' }}>
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
              <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Belum ada laporan pengaduan.</td>
            </tr>
          ) : (
            complaints.map((c) => (
              <tr key={c.ticketNumber} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={tableStyle}><strong>{c.ticketNumber}</strong></td>
                <td style={tableStyle}>{c.category}</td>
                <td style={tableStyle}>{c.content ? c.content.substring(0, 50) + '...' : '-'}</td>
                <td style={tableStyle}>
                  <span style={{ padding: '4px 8px', borderRadius: '4px', background: '#e9ecef', fontSize: '12px', fontWeight: 'bold' }}>
                    {c.status}
                  </span>
                </td>
                <td style={tableStyle}>
                  <select 
                    value={c.status} 
                    onChange={(e) => handleUpdateStatus(c.ticketNumber, e.target.value)}
                    style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
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
  );
}

const tableStyle = { padding: '12px', fontSize: '14px' };