import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import styles from './DocumentForm.module.css';

export default function DocumentForm() {
  const { getToken } = useAuth();
  const [formData, setFormData] = useState({
    applicantName: '',
    nik: '',
    letterType: 'Surat Keterangan Domisili',
    purpose: '',
  });
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    try {
      const token = await getToken();
      const data = new FormData();
      data.append('applicantName', formData.applicantName);
      data.append('nik', formData.nik);
      data.append('letterType', formData.letterType);
      data.append('purpose', formData.purpose);
      if (attachment) {
        data.append('attachment', attachment);
      }

      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      const result = await response.json();
      if (response.ok || result.success) {
        setSuccessMsg(`Berhasil mengajukan permohonan! Nomor Tracking Anda: ${result.data.trackingNumber}`);
        setFormData({ applicantName: '', nik: '', letterType: 'Surat Keterangan Domisili', purpose: '' });
        setAttachment(null);
      } else {
        alert('Gagal mengajukan surat: ' + (result.message || 'Terjadi kesalahan'));
      }
    } catch (error) {
      console.error('Error submitting document request:', error);
      alert('Gagal terhubung ke server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.headerSection}>
          <h2 className={styles.title}>Formulir Permohonan Surat Administrasi</h2>
          <p className={styles.subtitle}>Ajukan surat pengantar atau keterangan resmi secara online dengan mudah.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          
          {successMsg && <div className={styles.successAlert}>{successMsg}</div>}

          {/* Nama Lengkap */}
          <div className={styles.formGroup}>
            <label>Nama Lengkap</label>
            <input 
              type="text" 
              name="applicantName" 
              value={formData.applicantName} 
              onChange={handleChange} 
              required 
              placeholder="Masukkan nama lengkap sesuai KTP"
              className={styles.input}
            />
          </div>

          {/* NIK */}
          <div className={styles.formGroup}>
            <label>NIK (Nomor Induk Kependudukan)</label>
            <input 
              type="text" 
              name="nik" 
              value={formData.nik} 
              onChange={handleChange} 
              required 
              placeholder="16 digit nomor NIK"
              className={styles.input}
            />
          </div>

          {/* Jenis Surat */}
          <div className={styles.formGroup}>
            <label>Jenis Surat</label>
            <select name="letterType" value={formData.letterType} onChange={handleChange} className={styles.select}>
              <option value="Surat Keterangan Domisili">Surat Keterangan Domisili</option>
              <option value="Surat Keterangan Usaha">Surat Keterangan Usaha</option>
              <option value="Surat Pengantar SKCK">Surat Pengantar SKCK</option>
              <option value="Surat Keterangan Tidak Mampu (SKTM)">Surat Keterangan Tidak Mampu (SKTM)</option>
            </select>
          </div>

          {/* Lampiran Berkas (Full Width) */}
          <div className={styles.formGroup}>
            <label>Lampiran Berkas Pendukung (KTP/KK - Opsional)</label>
            <div className={styles.uploadZone}>
              <input type="file" onChange={handleFileChange} className={styles.fileInput} />
              <div className={styles.uploadContent}>
                <span style={{ fontWeight: '600' }}>
                  {attachment ? `Berkas terpilih: ${attachment.name}` : 'Seret file atau klik untuk unggah berkas'}
                </span>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Format PDF, JPG, atau PNG (Maks. 5MB)</span>
              </div>
            </div>
          </div>

          {/* Keperluan Surat (Full Width) */}
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label>Keperluan / Tujuan Pembuatan Surat</label>
            <textarea 
              name="purpose" 
              value={formData.purpose} 
              onChange={handleChange} 
              required 
              placeholder="Contoh: Keperluan melamar pekerjaan / pembukaan rekening bank..."
              className={styles.textarea}
            ></textarea>
          </div>

          {/* Submit Button (Full Width) */}
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Mengirim Permohonan...' : 'Kirim Permohonan Surat'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}