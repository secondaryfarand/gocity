import React, { useEffect } from 'react';
import styles from './SuratTemplate.module.css';

export default function SuratTemplate({ documentData, onClose }) {
  if (!documentData) return null;

  const handlePrint = () => {
    window.print();
  };

  // Tambahkan event listener untuk tombol ESC agar modal bisa ditutup
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Tanggal hari ini
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    /* Klik pada overlay (area gelap di luar kertas) akan menutup modal */
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        
        {/* Tombol Kontrol */}
        <div className={styles.noPrint}>
          <button onClick={onClose} className={styles.closeBtn}>Tutup (Esc)</button>
          <button onClick={handlePrint} className={styles.printBtn}>🖨️ Cetak / Simpan PDF</button>
        </div>

        {/* Lembar Kertas Surat Resmi (Format A4) */}
        <div className={styles.paper}>
          {/* Kop Surat */}
          <div className={styles.kopSurat}>
            <h2>PEMERINTAH KOTA DENPASAR</h2>
            <h3>KECAMATAN DENPASAR UTARA — KELURAHAN GATOT SUBROTO</h3>
            <p>Jalan Gatot Subroto No. 102, Denpasar, Bali | Kode Pos 80111</p>
            <hr className={styles.kopLine} />
          </div>

          {/* Judul & Nomor Surat */}
          <div className={styles.judulSurat}>
            <h4>{documentData.letterType?.toUpperCase() || 'SURAT KETERANGAN'}</h4>
            <p>Nomor: {documentData.officialLetterNumber || '470 / ___ / Kel-Gatsu / X / 2026'}</p>
          </div>

          {/* Isi Surat */}
          <div className={styles.bodySurat}>
            <p>Yang bertanda tangan di bawah ini Lurah Gatot Subroto, Kecamatan Denpasar Utara, Kota Denpasar, dengan ini menerangkan bahwa:</p>
            
            <table className={styles.tableData}>
              <tbody>
                <tr>
                  <td style={{ width: '180px' }}>Nama Lengkap</td>
                  <td>: <strong>{documentData.applicantName}</strong></td>
                </tr>
                <tr>
                  <td>NIK</td>
                  <td>: {documentData.nik}</td>
                </tr>
                <tr>
                  <td>Jenis Surat</td>
                  <td>: {documentData.letterType}</td>
                </tr>
                <tr>
                  <td>Keperluan</td>
                  <td>: {documentData.purpose}</td>
                </tr>
              </tbody>
            </table>

            <p>
              Berdasarkan data dan permohonan yang diajukan melalui sistem pelayanan publik <strong>GoCity</strong>, warga tersebut benar-benar berdomisili dan terdaftar di wilayah kelurahan kami, serta berkelakuan baik.
            </p>
            <p>
              Demikian surat keterangan ini dibuat dengan sebenarnya dan untuk dipergunakan sebagaimana mestinya.
            </p>
          </div>

          {/* Bagian Tanda Tangan & QR Code */}
          <div className={styles.footerSurat}>
            <div className={styles.qrSection}>
              <div className={styles.qrPlaceholder}>
                <span style={{ fontSize: '10px', color: '#555' }}>[QR Code]</span>
              </div>
              <p style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>Scan verifikasi</p>
            </div>

            <div className={styles.ttdSection}>
              <p>Denpasar, {currentDate}</p>
              <p><strong>Lurah Gatot Subroto</strong></p>
              <br /><br /><br />
              <p><u><strong>I Wayan Sudarma, S.Sos</strong></u></p>
              <p style={{ fontSize: '12px', color: '#555' }}>NIP. 19820514 200604 1 002</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}