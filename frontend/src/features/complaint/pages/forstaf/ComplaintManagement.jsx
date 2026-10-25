import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import styles from './ComplaintManagement.module.css';
import ComplaintTable from '../../components/ComplaintTable'; // <-- Impor komponen tabel terpisah

export default function ComplaintManagement() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const { getToken } = useAuth();

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await fetch('/api/complaints', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      const dataList = Array.isArray(result) ? result : (result.data || []);
      setComplaints(dataList);
    } catch (error) {
      console.error('Gagal memuat data pengaduan:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleUpdateStatus = async (ticketNumber, newStatus) => {
    try {
      const token = await getToken();
      const target = complaints.find(c => c.ticketNumber === ticketNumber || c._id === ticketNumber);
      if (!target) return;

      const ticketKey = target.ticketNumber || target._id;
      const response = await fetch(`/api/complaints/${ticketKey}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const result = await response.json();
      if (response.ok || result.success) {
        setComplaints(complaints.map(c => 
          (c.ticketNumber === ticketNumber || c._id === ticketNumber) ? { ...c, status: newStatus } : c
        ));
      } else {
        alert('Gagal memperbarui status: ' + (result.message || 'Terjadi kesalahan'));
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Gagal terhubung ke server.');
    }
  };

  // --- LOGIKA FILTER & PENCARIAN ---
  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = 
      (c.ticketNumber && c.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.content && c.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.category && c.category.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'ALL' || (c.status || 'PENDING').toUpperCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Hitung metrik ringkas
  const totalCount = complaints.length;
  const pendingCount = complaints.filter(c => (c.status || 'PENDING').toUpperCase() === 'PENDING').length;
  const progressCount = complaints.filter(c => (c.status || '').toUpperCase() === 'IN_PROGRESS').length;
  const resolvedCount = complaints.filter(c => (c.status || '').toUpperCase() === 'RESOLVED').length;

  return (
    <div className={styles.container} style={{ padding: '30px 18rem', background: '#f8fafc', minHeight: '100vh', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      
      {/* Header Utama */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>
            <i className="fa-solid fa-clipboard-list" style={{ color: '#0284c7', marginRight: '8px' }}></i> 
            Manajemen Pengaduan Warga
          </h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
            Pusat kendali dan verifikasi laporan pengaduan masyarakat secara real-time.
          </p>
        </div>
        <button 
          onClick={fetchComplaints}
          style={{
            padding: '10px 18px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px',
            cursor: 'pointer', fontWeight: '600', fontSize: '13px', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}
        >
          <i className="fa-solid fa-rotate-right"></i> Sinkronisasi Data
        </button>
      </div>

      {/* --- PANEL STATISTIK RINGKAS (KARTU METRIK) --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={metricCardStyle}>
          <div style={{ ...metricIconStyle, background: '#e0f2fe', color: '#0284c7' }}><i className="fa-solid fa-database"></i></div>
          <div>
            <span style={metricLabelStyle}>Total Laporan</span>
            <h3 style={metricValueStyle}>{totalCount}</h3>
          </div>
        </div>
        <div style={metricCardStyle}>
          <div style={{ ...metricIconStyle, background: '#fef9c3', color: '#ca8a04' }}><i className="fa-solid fa-clock"></i></div>
          <div>
            <span style={metricLabelStyle}>Pending / Masuk</span>
            <h3 style={metricValueStyle}>{pendingCount}</h3>
          </div>
        </div>
        <div style={metricCardStyle}>
          <div style={{ ...metricIconStyle, background: '#e0f2fe', color: '#0284c7' }}><i className="fa-solid fa-spinner"></i></div>
          <div>
            <span style={metricLabelStyle}>Dalam Proses</span>
            <h3 style={metricValueStyle}>{progressCount}</h3>
          </div>
        </div>
        <div style={metricCardStyle}>
          <div style={{ ...metricIconStyle, background: '#dcfce7', color: '#16a34a' }}><i className="fa-solid fa-circle-check"></i></div>
          <div>
            <span style={metricLabelStyle}>Selesai (Resolved)</span>
            <h3 style={metricValueStyle}>{resolvedCount}</h3>
          </div>
        </div>
      </div>

      {/* --- TOOLBAR PENCARIAN & FILTER --- */}
      <div style={{ 
        background: '#ffffff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }}>
        {/* Input Pencarian */}
        <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
          <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
          <input 
            type="text" 
            placeholder="Cari nomor tiket, isi aduan, atau kategori..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', padding: '10px 14px 10px 40px', borderRadius: '8px', border: '1px solid #cbd5e1', 
              fontSize: '13px', outline: 'none', background: '#f8fafc', color: '#0f172a'
            }}
          />
        </div>

        {/* Filter Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Filter Status:</span>
          {['ALL', 'PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                border: statusFilter === st ? '1px solid #0284c7' : '1px solid #cbd5e1',
                background: statusFilter === st ? '#0284c7' : '#ffffff',
                color: statusFilter === st ? '#ffffff' : '#475569',
                transition: 'all 0.2s'
              }}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* --- KARTU UTAMA TABEL --- */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '15px', color: '#0f172a', fontWeight: '700' }}>
            Daftar Laporan Warga <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 'normal' }}>({filteredComplaints.length} dari {totalCount} total)</span>
          </h3>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px', color: '#64748b', fontSize: '14px' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '24px', marginBottom: '10px', display: 'block', color: '#0284c7' }}></i>
            Memuat data pengaduan dari server...
          </div>
        ) : (
          <ComplaintTable complaints={filteredComplaints} onUpdateStatus={handleUpdateStatus} />
        )}
      </div>

    </div>
  );
}

// Styling Pendukung Kartu Metrik
const metricCardStyle = {
  background: '#ffffff',
  padding: '20px',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
};

const metricIconStyle = {
  width: '45px',
  height: '45px',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '18px',
  fontWeight: 'bold'
};

const metricLabelStyle = {
  fontSize: '12px',
  color: '#64748b',
  fontWeight: '500',
  display: 'block',
  marginBottom: '4px'
};

const metricValueStyle = {
  fontSize: '20px',
  fontWeight: '800',
  color: '#0f172a',
  margin: 0
};