import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
  // Nomor Registrasi Unik (Contoh: SRT-2026-0001)
  trackingNumber: {
    type: String,
    required: true,
    unique: true
  },
  // ID Pengguna / Warga yang mengajukan (menggunakan ID Clerk atau User ID lokal)
  userId: {
    type: String,
    required: true
  },
  applicantName: {
    type: String,
    required: true
  },
  nik: {
    type: String,
    required: true
  },
  // Jenis Surat (Contoh: Surat Domisili, SKTM, Surat Usaha, dll)
  letterType: {
    type: String,
    required: true
  },
  // Keperluan / Alasan pengajuan surat
  purpose: {
    type: String,
    required: true
  },
  // Data tambahan dinamis (misal: alamat usaha, penghasilan, dll)
  additionalDetails: {
    type: Map,
    of: String,
    default: {}
  },
  // URL Dokumen Lampiran Pendukung dari Cloudinary (KTP/KK)
  attachmentUrl: {
    type: String,
    default: ''
  },
  // Status Permohonan
  status: {
    type: String,
    enum: ['PENDING', 'IN_PROGRESS', 'APPROVED', 'REJECTED'],
    default: 'PENDING'
  },
  // Nomor Surat Resmi Kelurahan yang diterbitkan saat disetujui (Contoh: 470/12/Kel-Gatsu/X/2026)
  officialLetterNumber: {
    type: String,
    default: ''
  },
  // Tanggapan atau Catatan dari Staf/Kelurahan
  staffResponse: {
    type: String,
    default: ''
  }
}, {
  timestamps: true // Otomatis mencatat createdAt dan updatedAt
});

export const DocumentModel = mongoose.model('Document', DocumentSchema);