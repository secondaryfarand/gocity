import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';

export default function DashboardAnalytics() {
  const { getToken } = useAuth();
  const [stats, setStats] = useState({
    totalPopulation: '885,200',
    incomingLetters: '1,420',
    totalComplaints: '342',
    weather: '31°C, Cerah Berawan',
    avgAqi: '48 (Baik)',
  });
  const [loading, setLoading] = useState(false);

  // Simulasi fetch data analitik (bisa disesuaikan endpoint aslinya nanti)
  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const token = await getToken();
        const res = await fetch('/api/analytics/summary', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (err) {
        // Jika endpoint belum ada, gunakan data dummy bawaan secara otomatis
        console.log('Menggunakan data dummy analitik.');
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [getToken]);

  if (loading) return <div style={{ padding: '20px', color: '#666' }}>Memuat analitik kota...</div>;

  return (
    <div style={{ marginBottom: '35px' }}>
      {/* --- GRID KARTU STATISTIK UTAMA --- */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        <div style={cardStyle}>
          <div style={iconBoxStyle}><i className="fa-solid fa-users" style={{ color: '#0284c7' }}></i></div>
          <div>
            <p style={labelStyle}>Total Penduduk</p>
            <h3 style={valueStyle}>{stats.totalPopulation}</h3>
            <span style={{ fontSize: '11px', color: '#16a34a' }}><i className="fa-solid fa-arrow-up"></i> +1.2% tahun ini</span>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={iconBoxStyle}><i className="fa-solid fa-envelope-open-text" style={{ color: '#ca8a04' }}></i></div>
          <div>
            <p style={labelStyle}>Surat Masuk / Arsip</p>
            <h3 style={valueStyle}>{stats.incomingLetters}</h3>
            <span style={{ fontSize: '11px', color: '#16a34a' }}><i className="fa-solid fa-check"></i> Terverifikasi</span>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={iconBoxStyle}><i className="fa-solid fa-triangle-exclamation" style={{ color: '#dc2626' }}></i></div>
          <div>
            <p style={labelStyle}>Total Pengaduan</p>
            <h3 style={valueStyle}>{stats.totalComplaints}</h3>
            <span style={{ fontSize: '11px', color: '#dc2626' }}><i className="fa-solid fa-clock"></i> 14 Pending</span>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={iconBoxStyle}><i className="fa-solid fa-cloud-sun" style={{ color: '#ea580c' }}></i></div>
          <div>
            <p style={labelStyle}>Cuaca & Suhu Kota</p>
            <h3 style={{ ...valueStyle, fontSize: '16px', marginTop: '4px' }}>{stats.weather}</h3>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Denpasar, Bali</span>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={iconBoxStyle}><i className="fa-solid fa-wind" style={{ color: '#16a34a' }}></i></div>
          <div>
            <p style={labelStyle}>Kualitas Udara (AQI)</p>
            <h3 style={{ ...valueStyle, fontSize: '16px', marginTop: '4px' }}>{stats.avgAqi}</h3>
            <span style={{ fontSize: '11px', color: '#16a34a' }}>Kondisi Sehat</span>
          </div>
        </div>
      </div>

      {/* --- BAGIAN VISUALISASI GRAFIK DATA --- */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', 
        gap: '20px' 
      }}>
        {/* Grafik 1: Tren Kejahatan / Insiden per Bulan */}
        <div style={chartCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h4 style={{ margin: 0, fontSize: '15px', color: '#1e293b' }}>📊 Tren Insiden & Kejahatan per Bulan</h4>
            <span style={{ fontSize: '12px', color: '#64748b', background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px' }}>Tahun 2026</span>
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '20px' }}>Statistik penanganan gangguan ketertiban umum wilayah kota.</p>
          
          {/* Visualisasi Bar Chart Sederhana berbasis CSS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { month: 'Jan', count: 45, max: 80 },
              { month: 'Feb', count: 32, max: 80 },
              { month: 'Mar', count: 58, max: 80 },
              { month: 'Apr', count: 28, max: 80 },
              { month: 'Mei', count: 62, max: 80 },
              { month: 'Jun', count: 39, max: 80 },
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ width: '30px', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>{item.month}</span>
                <div style={{ flex: 1, background: '#f1f5f9', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${(item.count / item.max) * 100}%`, 
                    height: '100%', 
                    backgroundColor: '#0284c7', 
                    borderRadius: '5px' 
                  }}></div>
                </div>
                <span style={{ width: '30px', fontSize: '12px', fontWeight: '600', textAlign: 'right', color: '#1e293b' }}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Grafik 2: Kategori Pengaduan Terbanyak */}
        <div style={chartCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h4 style={{ margin: 0, fontSize: '15px', color: '#1e293b' }}>📈 Kategori Aduan Warga</h4>
            <span style={{ fontSize: '12px', color: '#64748b', background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px' }}>Akumulasi</span>
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '20px' }}>Persentase masalah infrastruktur dan layanan publik.</p>

          {/* Visualisasi Progress Bar Persentase */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { label: 'Infrastruktur Jalan & Lampu', percent: 42, color: '#f59e0b' },
              { label: 'Kebersihan & Sampah', percent: 28, color: '#16a34a' },
              { label: 'Kemacetan & Lalu Lintas', percent: 18, color: '#dc2626' },
              { label: 'Administrasi Kependudukan', percent: 12, color: '#0284c7' },
            ].map((cat, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px', fontWeight: '500', color: '#334155' }}>
                  <span>{cat.label}</span>
                  <span>{cat.percent}%</span>
                </div>
                <div style={{ width: '100%', background: '#f1f5f9', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${cat.percent}%`, height: '100%', backgroundColor: cat.color, borderRadius: '4px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Styling Pendukung Objek CSS
const cardStyle = {
  background: '#ffffff',
  padding: '20px',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
};

const iconBoxStyle = {
  width: '45px',
  height: '45px',
  borderRadius: '10px',
  background: '#f8fafc',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '18px',
  border: '1px solid #e2e8f0'
};

const labelStyle = {
  fontSize: '12px',
  color: '#64748b',
  marginBottom: '2px',
  fontWeight: '500'
};

const valueStyle = {
  fontSize: '20px',
  fontWeight: '700',
  color: '#1e293b',
  margin: 0
};

const chartCardStyle = {
  background: '#ffffff',
  padding: '24px',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
};