import React, { useState } from 'react';

export default function ComplaintForm() {
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

  // Handle perubahan text input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle perubahan file gambar
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Fitur Ambil Lokasi GPS Saat Ini
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
      }
    );
  };

  // Handle Submit Form ke Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
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
        body: data, // Mengirim multi-part form data
      });

      const result = await res.json();
      if (result.success) {
        setResponseTicket(result.data.ticketNumber);
        alert('Pengaduan berhasil dikirim!');
      } else {
        alert('Gagal mengirim pengaduan: ' + result.message);
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi ke server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Buat Pengaduan Layanan Publik</h2>
      <p style={styles.subtitle}>Sampaikan laporan atau fasilitas umum yang rusak di sekitar Anda.</p>

      {responseTicket ? (
        <div style={styles.successBox}>
          <h3>Laporan Berhasil Terkirim! 🎉</h3>
          <p>Nomor Tiket Anda:</p>
          <div style={styles.ticketBadge}>{responseTicket}</div>
          <p style={{ fontSize: '14px', color: '#555' }}>
            Simpan nomor tiket ini untuk melacak status pengaduan Anda.
          </p>
          <button style={styles.buttonPrimary} onClick={() => window.location.reload()}>
            Buat Laporan Lain
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Kategori */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Kategori Pengaduan:</label>
            <select name="category" value={formData.category} onChange={handleChange} style={styles.input}>
              <option value="infrastructure">Infrastruktur (Jalan, Lampu, dll)</option>
              <option value="cleanliness">Kebersihan (Sampah, Saluran Air)</option>
              <option value="public_service">Pelayanan Publik</option>
              <option value="security">Keamanan & Ketertiban</option>
            </select>
          </div>

          {/* Isi Aduan */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Isi Pengaduan / Masalah:</label>
            <textarea
              name="content"
              rows="4"
              value={formData.content}
              onChange={handleChange}
              placeholder="Jelaskan detail masalah secara jelas..."
              required
              style={styles.textarea}
            />
          </div>

          {/* Saran */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Saran / Solusi (Opsional):</label>
            <input
              type="text"
              name="suggestion"
              value={formData.suggestion}
              onChange={handleChange}
              placeholder="Contoh: Mohon segera ditambal..."
              style={styles.input}
            />
          </div>

          {/* Fitur Ambil Lokasi GPS */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Lokasi Kejadian (Koordinat GPS):</label>
            <div style={styles.row}>
              <input
                type="text"
                placeholder="Latitude"
                value={formData.latitude}
                readOnly
                style={{ ...styles.input, flex: 1 }}
              />
              <input
                type="text"
                placeholder="Longitude"
                value={formData.longitude}
                readOnly
                style={{ ...styles.input, flex: 1 }}
              />
              <button
                type="button"
                onClick={handleGetLocation}
                style={styles.buttonSecondary}
                disabled={loadingLocation}
              >
                {loadingLocation ? 'Mencari...' : '📍 Ambil Lokasi Saat Ini'}
              </button>
            </div>
          </div>

          {/* Upload Gambar */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Unggah Foto Bukti:</label>
            <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={handleImageChange} />
            {imagePreview && (
              <div style={{ marginTop: '10px' }}>
                <img src={imagePreview} alt="Preview" style={styles.previewImage} />
              </div>
            )}
          </div>

          {/* Checkbox Anonim */}
          <div style={styles.checkboxGroup}>
            <input
              type="checkbox"
              name="isAnonymous"
              id="isAnonymous"
              checked={formData.isAnonymous}
              onChange={handleChange}
            />
            <label htmlFor="isAnonymous" style={{ marginLeft: '8px', cursor: 'pointer' }}>
              Sembunyikan identitas saya (Kirim sebagai Anonim)
            </label>
          </div>

          {/* Submit Button */}
          <button type="submit" style={styles.buttonPrimary} disabled={submitting}>
            {submitting ? 'Mengirim Laporan...' : 'Kirim Pengaduan'}
          </button>
        </form>
      )}
    </div>
  );
}

// Inline Styles Sederhana
const styles = {
  container: { maxWidth: '600px', margin: '40px auto', padding: '30px', fontFamily: 'Arial, sans-serif', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', background: '#fff' },
  subtitle: { color: '#666', marginBottom: '20px', fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontWeight: 'bold', fontSize: '14px', color: '#333' },
  input: { padding: '10px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' },
  textarea: { padding: '10px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' },
  row: { display: 'flex', gap: '8px', alignItems: 'center' },
  checkboxGroup: { display: 'flex', alignItems: 'center', marginTop: '4px' },
  buttonPrimary: { padding: '12px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
  buttonSecondary: { padding: '10px 14px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' },
  previewImage: { width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ccc' },
  successBox: { textAlign: 'center', padding: '20px', background: '#f8f9fa', borderRadius: '6px' },
  ticketBadge: { display: 'inline-block', background: '#e2e3e5', padding: '8px 16px', fontSize: '18px', fontWeight: 'bold', borderRadius: '4px', margin: '10px 0', letterSpacing: '1px' }
};