import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import styles from './ComplaintForm.module.css';

export default function ComplaintForm() {
  const { getToken } = useAuth();
  const [formData, setFormData] = useState({
    category: 'infrastructure',
    content: '',
    suggestion: '',
    isAnonymous: false,
    latitude: '',
    longitude: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [responseTicket, setResponseTicket] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation tidak didukung oleh browser Anda.');
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoadingLocation(false);
      },
      (error) => {
        alert('Gagal mengambil lokasi: ' + error.message);
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = await getToken();
      const data = new FormData();
      data.append('category', formData.category);
      data.append('content', formData.content);
      data.append('suggestion', formData.suggestion);
      data.append('isAnonymous', formData.isAnonymous);
      if (formData.latitude) data.append('latitude', formData.latitude);
      if (formData.longitude) data.append('longitude', formData.longitude);
      if (imageFile) data.append('attachment', imageFile);

      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data,
      });

      const result = await res.json();
      if (result.success) {
        setResponseTicket(result.data.ticketNumber);
      } else {
        alert('Gagal mengirim pengaduan: ' + (result.message || 'Terjadi kesalahan'));
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi ke server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <h2 className={styles.title}>Buat Pengaduan Layanan Publik</h2>
        <p className={styles.subtitle}>Sampaikan laporan kerusakan fasilitas umum atau gangguan lingkungan di sekitar Anda.</p>
      </div>

      {responseTicket ? (
        <div className={styles.successBox}>
          <div className={styles.successIcon}><i className="fa-solid fa-circle-check"></i></div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', color: '#0f172a' }}>Laporan Berhasil Terkirim!</h3>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Simpan nomor tiket unik Anda untuk melacak status penanganan.</p>
          <div className={styles.ticketBadge}>{responseTicket}</div>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
            Petugas kelurahan akan segera memverifikasi laporan Anda.
          </p>
          <button className={styles.submitBtn} onClick={() => window.location.reload()}>
            Buat Laporan Lain
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          
          {/* Kategori */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Kategori Pengaduan</label>
            <select name="category" value={formData.category} onChange={handleChange} className={styles.select}>
              <option value="infrastructure">Infrastruktur (Jalan, Lampu, dll)</option>
              <option value="cleanliness">Kebersihan (Sampah, Saluran Air)</option>
              <option value="public_service">Pelayanan Publik</option>
              <option value="security">Keamanan & Ketertiban</option>
            </select>
          </div>

          {/* Saran */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Saran / Solusi Warga (Opsional)</label>
            <input
              type="text"
              name="suggestion"
              value={formData.suggestion}
              onChange={handleChange}
              placeholder="Contoh: Mohon segera ditambal..."
              className={styles.input}
            />
          </div>

          {/* Isi Aduan (Full Width) */}
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Detail Pengaduan / Masalah</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Jelaskan kronologi dan detail masalah secara jelas..."
              required
              className={styles.textarea}
            />
          </div>

         <div className={styles.formGroup}>
            <label className={styles.label}>Titik Koordinat Kejadian (GPS)</label>
            <div className={styles.locationBox}>
              <div className={styles.coordinateGrid}>
                <input
                  type="text"
                  name="latitude"
                  placeholder="Latitude (Contoh: -8.6500)"
                  value={formData.latitude}
                  onChange={handleChange}
                  className={styles.input}
                />
                <input
                  type="text"
                  name="longitude"
                  placeholder="Longitude (Contoh: 115.2166)"
                  value={formData.longitude}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
              <button
                type="button"
                onClick={handleGetLocation}
                className={styles.locationBtn}
                disabled={loadingLocation}
              >
                <i className={`fa-solid ${loadingLocation ? 'fa-spinner fa-spin' : 'fa-location-dot'}`}></i>
                {loadingLocation ? 'Mendeteksi GPS...' : 'Ambil Lokasi Saat Ini (Auto-Pin)'}
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Bukti Foto Kondisi Lapangan</label>
            <div className={styles.uploadZone}>
              <input 
                type="file" 
                accept="image/png, image/jpeg, image/jpg" 
                onChange={handleImageChange} 
                className={styles.hiddenFileInput} 
              />
              <div className={styles.uploadContent}>
                <i className={`fa-solid ${imageFile ? 'fa-circle-check' : 'fa-cloud-arrow-up'} ${styles.uploadIcon}`}></i>
                <span>{imageFile ? `Terpilih: ${imageFile.name}` : 'Seret foto atau klik untuk unggah'}</span>
                <span style={{ fontSize: '11px' }}>PNG, JPG (Maks. 5MB)</span>
              </div>
            </div>
            {imagePreview && (
              <div className={styles.previewContainer}>
                <img src={imagePreview} alt="Preview Bukti" className={styles.previewImage} />
              </div>
            )}
          </div>

          {/* Checkbox Anonim & Submit Button (Full Width) */}
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                name="isAnonymous"
                id="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleChange}
                className={styles.checkboxInput}
              />
              <label htmlFor="isAnonymous" className={styles.checkboxLabel}>
                Sembunyikan identitas saya (Kirim pengaduan secara anonim)
              </label>
            </div>
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? 'Mengirim Laporan ke Server...' : 'Kirim Pengaduan Sekarang'}
            </button>
          </div>

        </form>
      )}
    </div>
  );
}