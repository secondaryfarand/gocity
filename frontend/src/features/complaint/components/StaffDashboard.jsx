import React, { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/react';
import ComplaintMap from './ComplaintMap';

export default function StaffDashboard() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isStaff, setIsStaff] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = await getToken();

        const res = await fetch('/api/complaints', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Tangani jika akses ditolak (Unauthorized / Forbidden dari backend)
        if (res.status === 401 || res.status === 403) {
          setIsStaff(false);
          setLoading(false);
          return;
        }

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server mengembalikan respons bukan JSON. Periksa kembali rute backend.");
        }

        const data = await res.json();
        if (data.success) {
          setComplaints(data.data);
        } else {
          setErrorMessage(data.message || 'Gagal memuat data.');
        }
      } catch (err) {
        console.error('Error fetching complaints:', err);
        setErrorMessage('Terjadi kesalahan koneksi ke server.');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
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

  // 🚫 TAMPILAN JIKA BUKAN STAF (Akses Ditolak)
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

  // ✅ TAMPILAN UTAMA JIKA BERHASIL SEBAGAI STAF
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Dashboard Monitoring Staf</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>Kelola dan pantau seluruh laporan pengaduan fasilitas umum masyarakat.</p>

      {errorMessage && (
        <div style={{ padding: '10px', background: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '20px' }}>
          {errorMessage}
        </div>
      )}

      {/* Bagian Peta Interaktif Sebaran Laporan */}
      <div style={{ marginBottom: '30px' }}>
        <h3>Peta Sebaran Titik Aduan</h3>
        <ComplaintMap complaints={complaints} />
      </div>

      {/* Bagian Tabel Daftar Aduan */}
      <h3>Daftar Seluruh Laporan ({complaints.length})</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
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
              <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Belum ada laporan pengaduan dari warga.</td>
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