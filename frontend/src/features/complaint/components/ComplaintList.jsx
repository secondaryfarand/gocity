import React, { useState } from 'react';
import styles from './ComplaintList.module.css';

export default function ComplaintList() {
  const [ticketInput, setTicketInput] = useState('');
  const [complaintData, setComplaintData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!ticketInput.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setComplaintData(null);

    try {
      const res = await fetch(`/api/complaints/ticket/${ticketInput.trim()}`);
      const result = await res.json();

      if (result.success) {
        setComplaintData(result.data);
      } else {
        setErrorMsg(result.message || 'Tiket pengaduan tidak ditemukan.');
      }
    } catch (err) {
      setErrorMsg('Gagal mengambil data dari server.');
    } finally {
      setLoading(false);
    }
  };

  // Fungsi helper warna status menggunakan variabel atau standar warna UI
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return '#ca8a04';
      case 'IN_PROGRESS': return '#0284c7';
      case 'RESOLVED': return '#16a34a';
      case 'REJECTED': return '#dc2626';
      default: return '#64748b';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <h2 className={styles.title}>Lacak Status Pengaduan</h2>
        <p className={styles.subtitle}>Masukkan nomor tiket unik Anda untuk memantau progres penanganan laporan secara real-time.</p>
      </div>

      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          placeholder="Contoh: TCK-1740000000000"
          value={ticketInput}
          onChange={(e) => setTicketInput(e.target.value)}
          className={styles.input}
          required
        />
        <button type="submit" className={styles.searchBtn} disabled={loading}>
          {loading ? 'Mencari...' : 'Lacak Tiket'}
        </button>
      </form>

      {errorMsg && <div className={styles.errorText}>{errorMsg}</div>}

      {complaintData && (
        <div className={styles.resultCard}>
          <div className={styles.cardHeader}>
            <span className={styles.ticketLabel}>Nomor Tiket: {complaintData.ticketNumber}</span>
            <span className={styles.statusBadge} style={{ background: getStatusColor(complaintData.status) }}>
              {complaintData.status}
            </span>
          </div>

          <div className={styles.cardBody}>
            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Kategori</span>
              <span>{complaintData.category}</span>
            </div>

            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Pengirim</span>
              <span>{complaintData.isAnonymous ? 'Anonim (Dirahasiakan)' : complaintData.senderName}</span>
            </div>

            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Isi Aduan</span>
              <p className={styles.contentBox}>{complaintData.content}</p>
            </div>

            {complaintData.suggestion && (
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>Saran / Solusi</span>
                <p className={styles.suggestionBox}>{complaintData.suggestion}</p>
              </div>
            )}

            {complaintData.latitude && complaintData.longitude && (
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>Lokasi Kejadian</span>
                <a
                  href={`https://www.google.com/maps?q=${complaintData.latitude},${complaintData.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mapLink}
                >
                  Buka Titik Koordinat di Google Maps ({complaintData.latitude}, {complaintData.longitude})
                </a>
              </div>
            )}

            {complaintData.attachment && (
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>Bukti Foto Lapangan</span>
                <img src={complaintData.attachment} alt="Bukti Aduan" className={styles.attachmentImg} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}