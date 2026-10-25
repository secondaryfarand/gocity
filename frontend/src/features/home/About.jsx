import React from 'react';

export default function About() {
  return (
    <div style={{ background: '#ffffff', padding: '40px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
      <div style={{ maxWidth: '800px' }}>
        <span style={{ background: '#e0f2fe', color: '#0284c7', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Tentang E-Office GoCity
        </span>
        <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: '16px 0 12px 0', lineHeight: '1.3' }}>
          Solusi Pintar Layanan Publik & Pengaduan Warga dalam Satu Genggaman.
        </h2>
        <p style={{ fontSize: '15px', color: '#475569', lineHeight: '1.7', marginBottom: '20px' }}>
          Pernah ngerasa ribet kan kalau mau ngurus surat pengantar atau pas mau lapor jalan rusak di lingkungan sekitar tapi bingung harus ngadu ke siapa? Nah, <strong>GoCity</strong> hadir buat memangkas semua keribetan itu. Gak perlu lagi antre lama atau bolak-balik kantor kelurahan cuma buat ngecek status berkas. 
        </p>
        <p style={{ fontSize: '15px', color: '#475569', lineHeight: '1.7', marginBottom: '30px' }}>
          Lewat platform ini, semua keluhan infrastruktur, kebersihan lingkungan, kemacetan, hingga permohonan administrasi kependudukan bisa kamu ajukan secara online. Petugas kelurahan bakal langsung gercep nangani laporanmu secara transparan, real-time, dan bisa dipantau langsung dari HP atau laptop kamu!
        </p>
      </div>

      {/* Grid Penjelasan Fitur Utama */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginTop: '30px', paddingTop: '30px', borderTop: '1px solid #f1f5f9' }}>
        <div>
          <div style={{ color: '#16a34a', fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
            <i className="fa-solid fa-bolt"></i> Cepat & Transparan
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
            Setiap aduan atau surat yang kamu kirim langsung masuk ke sistem pusat. Ada nomor tiket unik buat ngecek progresnya kapan aja tanpa takut nyasar.
          </p>
        </div>

        <div>
          <div style={{ color: '#0284c7', fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
            <i className="fa-solid fa-location-dot"></i> Berbasis Peta & IoT
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
            Dilengkapi pemetaan wilayah interaktif, cek kualitas udara (AQI), hingga pantauan CCTV lalu lintas kota secara langsung untuk keamanan bersama.
          </p>
        </div>

        <div>
          <div style={{ color: '#ca8a04', fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
            <i className="fa-solid fa-file-shield"></i> Aman & Resmi
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
            Pengajuan surat administrasi divalidasi langsung oleh staf berwenang lengkap dengan penomoran resmi surat kelurahan yang sah dan siap cetak.
          </p>
        </div>
      </div>
    </div>
  );
}