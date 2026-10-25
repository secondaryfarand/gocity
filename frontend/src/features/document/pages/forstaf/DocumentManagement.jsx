import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import styles from './DocumentManagement.module.css';

import SuratTemplate from '../../components/SuratTemplate';

export default function DocumentManagement() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const { getToken } = useAuth();

  // State untuk Modal Update Status & Nomor Surat Resmi
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [officialNumber, setOfficialNumber] = useState('');
  const [staffResponse, setStaffResponse] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printableDoc, setPrintableDoc] = useState(null);

  const handleOpenPrint = (doc) => {
    setPrintableDoc(doc);
    setIsPrintModalOpen(true);
  };

  // Ambil data permohonan surat
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await fetch('/api/documents', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      const dataList = Array.isArray(result) ? result : (result.data || []);
      setDocuments(dataList);
    } catch (error) {
      console.error('Gagal memuat data surat:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleOpenModal = (doc) => {
    setSelectedDoc(doc);
    setNewStatus(doc.status || 'PENDING');
    setOfficialNumber(doc.officialLetterNumber || '');
    setStaffResponse(doc.staffResponse || '');
    setIsModalOpen(true);
  };

  const handleQuickStatusUpdate = async (docId, newStatusValue) => {
    try {
      const token = await getToken();
      const response = await fetch(`/api/documents/${docId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatusValue })
      });

      const result = await response.json();
      if (response.ok || result.success) {
        setDocuments(documents.map(item => 
          item._id === docId ? result.data : item
        ));
      } else {
        alert('Gagal mengubah status: ' + (result.message || 'Terjadi kesalahan'));
      }
    } catch (error) {
      console.error('Error quick updating status:', error);
      alert('Gagal terhubung ke server.');
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoc) return;

    try {
      const token = await getToken();
      const response = await fetch(`/api/documents/${selectedDoc._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatus,
          officialLetterNumber: officialNumber,
          staffResponse: staffResponse
        })
      });

      const result = await response.json();
      if (response.ok || result.success) {
        setDocuments(documents.map(item => 
          item._id === selectedDoc._id ? result.data : item
        ));
        setIsModalOpen(false);
        alert('Permohonan surat berhasil diperbarui!');
      } else {
        alert('Gagal memperbarui: ' + (result.message || 'Terjadi kesalahan'));
      }
    } catch (error) {
      console.error('Error updating document:', error);
      alert('Gagal terhubung ke server.');
    }
  };

  // --- LOGIKA FILTER & PENCARIAN ---
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      (doc.trackingNumber && doc.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doc.applicantName && doc.applicantName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doc.nik && doc.nik.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doc.letterType && doc.letterType.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'ALL' || (doc.status || 'PENDING').toUpperCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Metrik Statistik
  const totalCount = documents.length;
  const pendingCount = documents.filter(d => (d.status || 'PENDING').toUpperCase() === 'PENDING').length;
  const progressCount = documents.filter(d => (d.status || '').toUpperCase() === 'IN_PROGRESS').length;
  const approvedCount = documents.filter(d => (d.status || '').toUpperCase() === 'APPROVED').length;

  const tableStyle = { padding: '14px 16px', borderBottom: '1px solid #f1f5f9', textAlign: 'left', fontSize: '13px', color: '#334155' };

  return (
    <div className={styles.container}>
      
      {/* Header Utama */}
      <div className={styles.headerSection}>
        <div>
          <h2 className={styles.headerTitle}>
            <i className="fa-solid fa-file-shield" style={{ color: '#0284c7', marginRight: '8px' }}></i>
            Manajemen Administrasi & Surat Warga
          </h2>
          <p className={styles.headerDesc}>Verifikasi permohonan surat, terbitkan nomor surat resmi, dan kelola arsip digital.</p>
        </div>
        <button className={styles.syncBtn} onClick={fetchDocuments}>
          <i className="fa-solid fa-rotate-right"></i> Sinkronisasi Data
        </button>
      </div>

      {/* --- PANEL STATISTIK RINGKAS (KARTU METRIK) --- */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={`${styles.metricIcon}`} style={{ background: '#e0f2fe', color: '#0284c7' }}><i className="fa-solid fa-folder-open"></i></div>
          <div>
            <span className={styles.metricLabel}>Total Permohonan</span>
            <h3 className={styles.metricValue}>{totalCount}</h3>
          </div>
        </div>
        <div className={styles.metricCard}>
          <div className={`${styles.metricIcon}`} style={{ background: '#fef9c3', color: '#ca8a04' }}><i className="fa-solid fa-clock"></i></div>
          <div>
            <span className={styles.metricLabel}>Pending / Masuk</span>
            <h3 className={styles.metricValue}>{pendingCount}</h3>
          </div>
        </div>
        <div className={styles.metricCard}>
          <div className={`${styles.metricIcon}`} style={{ background: '#e0f2fe', color: '#0284c7' }}><i className="fa-solid fa-spinner"></i></div>
          <div>
            <span className={styles.metricLabel}>Dalam Proses</span>
            <h3 className={styles.metricValue}>{progressCount}</h3>
          </div>
        </div>
        <div className={styles.metricCard}>
          <div className={`${styles.metricIcon}`} style={{ background: '#dcfce7', color: '#16a34a' }}><i className="fa-solid fa-circle-check"></i></div>
          <div>
            <span className={styles.metricLabel}>Disetujui (Approved)</span>
            <h3 className={styles.metricValue}>{approvedCount}</h3>
          </div>
        </div>
      </div>

      {/* --- TOOLBAR PENCARIAN & FILTER --- */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <i className={`fa-solid fa-magnifying-glass ${styles.searchIcon}`}></i>
          <input 
            type="text" 
            placeholder="Cari nomor tracking, nama pemohon, NIK, atau jenis surat..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Filter Status:</span>
          {['ALL', 'PENDING', 'IN_PROGRESS', 'APPROVED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={styles.filterBtn}
              style={{
                border: statusFilter === st ? '1px solid #0284c7' : '1px solid #cbd5e1',
                background: statusFilter === st ? '#0284c7' : '#ffffff',
                color: statusFilter === st ? '#ffffff' : '#475569',
              }}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* --- TABEL DATA --- */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h3 style={{ margin: 0, fontSize: '15px', color: '#0f172a', fontWeight: '700' }}>
            Daftar Permohonan Masuk <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 'normal' }}>({filteredDocuments.length} dari {totalCount} total)</span>
          </h3>
        </div>

        {loading ? (
          <div className={styles.loadingState}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '24px', marginBottom: '10px', display: 'block', color: '#0284c7' }}></i>
            Memuat data permohonan surat...
          </div>
        ) : (
          <div className={styles.tableResponsive}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
              <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={tableStyle}><i className="fa-solid fa-ticket"></i> Tracking ID</th>
                  <th style={tableStyle}><i className="fa-solid fa-user"></i> Pemohon / NIK</th>
                  <th style={tableStyle}><i className="fa-solid fa-tag"></i> Jenis Surat</th>
                  <th style={tableStyle}><i className="fa-solid fa-circle-info"></i> Keperluan</th>
                  <th style={tableStyle}><i className="fa-solid fa-file-lines"></i> No. Surat Resmi</th>
                  <th style={tableStyle}><i className="fa-solid fa-chart-line"></i> Status</th>
                  <th style={tableStyle}><i className="fa-solid fa-gears"></i> Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                      <i className="fa-solid fa-folder-open" style={{ fontSize: '32px', marginBottom: '10px', display: 'block', color: '#cbd5e1' }}></i>
                      Tidak ada permohonan surat yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredDocuments.map((doc) => (
                    <tr key={doc._id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                      <td style={tableStyle}>
                        <strong style={{ color: '#0f172a' }}>{doc.trackingNumber}</strong>
                      </td>
                      <td style={tableStyle}>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{doc.applicantName}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>NIK: {doc.nik}</div>
                      </td>
                      <td style={tableStyle}>
                        <span className={styles.categoryBadge}>{doc.letterType}</span>
                      </td>
                      <td style={tableStyle}>
                        <div style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={doc.purpose}>
                          {doc.purpose}
                        </div>
                      </td>
                      <td style={tableStyle}>
                        {doc.officialLetterNumber || <span style={{ color: '#94a3b8', fontSize: '12px' }}>Belum terbit</span>}
                      </td>
                      <td style={tableStyle}>
                        <span className={`${styles.statusBadge} ${styles[doc.status?.toLowerCase() || 'pending']}`}>
                          <i className={`fa-solid ${doc.status === 'APPROVED' ? 'fa-circle-check' : doc.status === 'IN_PROGRESS' ? 'fa-spinner fa-spin' : doc.status === 'REJECTED' ? 'fa-circle-xmark' : 'fa-clock'}`}></i>
                          {doc.status || 'PENDING'}
                        </span>
                      </td>
                      <td style={tableStyle}>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <button 
                            className={styles.actionBtn}
                            onClick={() => handleOpenModal(doc)}
                          >
                            <i className="fa-solid fa-pen-to-square"></i> Edit
                          </button>

                          {doc.status !== 'APPROVED' && (
                            <button 
                              onClick={() => handleQuickStatusUpdate(doc._id, 'APPROVED')}
                              style={{ background: '#16a34a', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}
                              title="Setujui Cepat"
                            >
                              <i className="fa-solid fa-check"></i> Approve
                            </button>
                          )}

                          {doc.status === 'APPROVED' && (
                            <button 
                              onClick={() => handleOpenPrint(doc)}
                              style={{ background: '#0284c7', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}
                            >
                              <i className="fa-solid fa-print"></i> Cetak
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- MODAL PROSES SURAT --- */}
      {isModalOpen && selectedDoc && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#0f172a' }}>Validasi & Terbitkan Surat</h3>
            <p className={styles.modalSub}>Pemohon: <strong>{selectedDoc.applicantName}</strong> ({selectedDoc.letterType})</p>
            
            <form onSubmit={handleUpdateSubmit}>
              <div className={styles.formGroup}>
                <label>Status Permohonan</label>
                <select 
                  value={newStatus} 
                  onChange={(e) => setNewStatus(e.target.value)}
                  className={styles.selectInput}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="APPROVED">APPROVED (Disetujui)</option>
                  <option value="REJECTED">REJECTED (Ditolak)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Nomor Surat Resmi Kelurahan (Jika Disetujui)</label>
                <input 
                  type="text" 
                  value={officialNumber}
                  onChange={(e) => setOfficialNumber(e.target.value)}
                  placeholder="Contoh: 470/12/Kel-Gatsu/X/2026"
                  className={styles.textInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Catatan / Pesan untuk Warga</label>
                <textarea 
                  rows="3"
                  value={staffResponse}
                  onChange={(e) => setStaffResponse(e.target.value)}
                  placeholder="Contoh: Silakan ambil cetakan fisik di kantor kelurahan membawa KTP asli..."
                  className={styles.textareaInput}
                ></textarea>
              </div>

              <div className={styles.modalActions}>
                <button 
                  type="button" 
                  className={styles.cancelBtn}
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </button>
                <button type="submit" className={styles.saveBtn}>
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL CETAK SURAT --- */}
      {isPrintModalOpen && printableDoc && (
        <SuratTemplate 
          documentData={printableDoc} 
          onClose={() => setIsPrintModalOpen(false)} 
        />
      )}
    </div>
  );
}