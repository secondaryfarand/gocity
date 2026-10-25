import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import styles from './Home.module.css';
import About from './About'; // <-- Mengimpor komponen anak About

export default function Home() {
  const { user } = useUser();
  const userName = user?.firstName || user?.username || 'Warga GoCity';

  return (
    <div className={styles.heroContainer}>
      <div className={styles.heroContentMax}>
        
        {/* Banner Selamat Datang */}
        <div className={styles.welcomeBanner}>
          <div>
            <h1 className={styles.welcomeTitle}>Halo, {userName}! 👋</h1>
            <p className={styles.welcomeSubtitle}>
              Selamat datang di Command Center Warga E-Office GoCity. Ada yang bisa kami bantu bereskan hari ini untuk kenyamanan lingkungan kita?
            </p>
          </div>
          <div className={styles.quickActionPills}>
            <Link to="/create-complaint" className={styles.pillBtn}>
              <i className="fa-solid fa-circle-plus"></i> Buat Aduan
            </Link>
            <Link to="/request-document" className={styles.pillBtn}>
              <i className="fa-solid fa-file-lines"></i> Ajukan Surat
            </Link>
          </div>
        </div>

        {/* Pilihan Menu Utama (Kartu Navigasi Cepat) */}
        <div className={styles.menuGrid}>
          
          {/* Kartu 1: Berikan Pengaduan */}
          <Link to="/" className={styles.menuCard}>
            <div>
              <div className={styles.cardIconBox} style={{ background: '#fee2e2', color: '#dc2626' }}>
                <i className="fa-solid fa-triangle-exclamation"></i>
              </div>
              <h3 className={styles.cardTitle}>Lapor Masalah / Pengaduan</h3>
              <p className={styles.cardDesc}>
                Temui jalan berlubang, sampah menumpuk, lampu jalan mati, atau kemacetan? Laporkan sekarang, sertakan foto dan lokasinya biar langsung ditindaklanjuti tim terkait.
              </p>
            </div>
            <div className={styles.cardLinkText}>
              Mulai Buat Aduan <i className="fa-solid fa-arrow-right"></i>
            </div>
          </Link>

          {/* Kartu 2: Membuat Surat Administrasi */}
          <Link to="/request-document" className={styles.menuCard}>
            <div>
              <div className={styles.cardIconBox} style={{ background: '#e0f2fe', color: '#0284c7' }}>
                <i className="fa-solid fa-file-pen"></i>
              </div>
              <h3 className={styles.cardTitle}>Administrasi & Surat Kelurahan</h3>
              <p className={styles.cardDesc}>
                Mau bikin Surat Keterangan Domisili, Surat Pengantar, atau keperluan administratif lainnya? Ajukan secara online dari rumah, pantau prosesnya, dan ambil jika sudah disetujui.
              </p>
            </div>
            <div className={styles.cardLinkText}>
              Ajukan Permohonan Surat <i className="fa-solid fa-arrow-right"></i>
            </div>
          </Link>

          {/* Kartu 3: Blog / Informasi Kota */}
          <Link to="/track" className={styles.menuCard}>
            <div>
              <div className={styles.cardIconBox} style={{ background: '#dcfce7', color: '#16a34a' }}>
                <i className="fa-solid fa-newspaper"></i>
              </div>
              <h3 className={styles.cardTitle}>Lacak Tiket & Info Kota</h3>
              <p className={styles.cardDesc}>
                Cek status perkembangan laporan atau surat yang pernah kamu buat menggunakan nomor tiket unik, serta pantau informasi seputar aktivitas dan pengumuman penting kota.
              </p>
            </div>
            <div className={styles.cardLinkText}>
              Lacak Status Laporan <i className="fa-solid fa-arrow-right"></i>
            </div>
          </Link>

        </div>

        {/* Memanggil Komponen Anak: About (Penjelasan & Detail Fitur) */}
        <About />

      </div>
    </div>
  );
}