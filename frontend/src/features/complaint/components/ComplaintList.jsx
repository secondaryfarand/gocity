import React, { useState } from 'react';

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
        setErrorMsg(result.message || 'Tiket tidak ditemukan.');
      }
    } catch (err) {
      setErrorMsg('Gagal mengambil data dari server.');
    } finally {
      setLoading(false);
    }
  };

  // Fungsi helper warna status
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return '#ffc107';
      case 'IN_PROGRESS': return '#17a2b8';
      case 'RESOLVED': return '#28a745';
      case 'REJECTED': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div style={styles.container}>
      <h2>Lacak Status Pengaduan</h2>
      <p style={styles.subtitle}>Masukkan nomor tiket Anda untuk melihat progres penanganan laporan.</p>

      <form onSubmit={handleSearch} style={styles.searchRow}>
        <input
          type="text"
          placeholder="Contoh: TCK-1740000000000"
          value={ticketInput}
          onChange={(e) => setTicketInput(e.target.value)}
          style={{ ...styles.input, flex: 1 }}
          required
        />
        <button type="submit" style={styles.buttonSearch} disabled={loading}>
          {loading ? 'Mencari...' : '🔍 Lacak Tiket'}
        </button>
      </form>

      {errorMsg && <p style={styles.errorText}>{errorMsg}</p>}

      {complaintData && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.ticketLabel}>Tiket: {complaintData.ticketNumber}</span>
            <span style={{ ...styles.statusBadge, background: getStatusColor(complaintData.status) }}>
              {complaintData.status}
            </span>
          </div>

          <div style={styles.cardBody}>
            <p><strong>Kategori:</strong> {complaintData.category}</p>
            <p><strong>Pengirim:</strong> {complaintData.isAnonymous ? 'Anonim' : complaintData.senderName}</p>
            <p><strong>Isi Aduan:</strong></p>
            <p style={styles.contentBox}>{complaintData.content}</p>

            {complaintData.suggestion && (
              <>
                <p><strong>Saran:</strong></p>
                <p style={styles.suggestionBox}>{complaintData.suggestion}</p>
              </>
            )}

            {complaintData.latitude && complaintData.longitude && (
              <p>
                <strong>Lokasi GPS:</strong>{' '}
                <a
                  href={`https://www.google.com/maps?q=${complaintData.latitude},${complaintData.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#007bff' }}
                >
                  Buka di Google Maps ({complaintData.latitude}, {complaintData.longitude})
                </a>
              </p>
            )}

            {complaintData.attachment && (
              <div style={{ marginTop: '15px' }}>
                <p><strong>Bukti Foto:</strong></p>
                <img src={complaintData.attachment} alt="Bukti Aduan" style={styles.attachmentImg} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Inline Styles Sederhana
const styles = {
  container: { maxWidth: '600px', margin: '40px auto', padding: '30px', fontFamily: 'Arial, sans-serif', border: '1px solid #ddd', borderRadius: '8px', background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  subtitle: { color: '#666', marginBottom: '20px', fontSize: '14px' },
  searchRow: { display: 'flex', gap: '10px', marginBottom: '20px' },
  input: { padding: '10px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' },
  buttonSearch: { padding: '10px 16px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  errorText: { color: '#dc3545', fontSize: '14px', marginTop: '10px' },
  card: { border: '1px solid #e0e0e0', borderRadius: '6px', marginTop: '20px', background: '#fdfdfd' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f1f3f5', padding: '12px 16px', borderTopLeftRadius: '6px', borderTopRightRadius: '6px' },
  ticketLabel: { fontWeight: 'bold', fontSize: '15px', color: '#333' },
  statusBadge: { color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' },
  cardBody: { padding: '16px', fontSize: '14px', color: '#444', display: 'flex', flexDirection: 'column', gap: '8px' },
  contentBox: { background: '#fff', padding: '10px', borderRadius: '4px', border: '1px solid #eee', margin: '0' },
  suggestionBox: { background: '#fff', padding: '10px', borderRadius: '4px', border: '1px solid #eee', margin: '0', fontStyle: 'italic' },
  attachmentImg: { maxWidth: '100%', maxHeight: '250px', borderRadius: '4px', border: '1px solid #ccc', marginTop: '5px' }
};