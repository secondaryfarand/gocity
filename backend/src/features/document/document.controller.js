import { DocumentModel } from '../../models/document.model.js';

export const documentController = {
  // 1. Warga mengajukan permohonan surat baru
  createRequest: async (req, res) => {
    try {
      const { applicantName, nik, letterType, purpose, additionalDetails, attachmentUrl } = req.body;
      const userId = req.auth?.userId || req.body.userId; // Mengambil dari Clerk auth middleware

      // Generate nomor tracking unik (Contoh: SRT-Timestamp)
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const trackingNumber = `SRT-${Date.now().toString().slice(-6)}-${randomNum}`;

      const newDoc = await DocumentModel.create({
        trackingNumber,
        userId,
        applicantName,
        nik,
        letterType,
        purpose,
        additionalDetails,
        attachmentUrl
      });

      return res.status(201).json({
        success: true,
        message: 'Permohonan surat berhasil dikirim',
        data: newDoc
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // 2. Staf/Admin melihat seluruh daftar permohonan surat
  getAllRequests: async (req, res) => {
    try {
      const documents = await DocumentModel.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: documents });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // 3. Staf memperbarui status, memberikan nomor surat resmi, dan catatan
  updateDocumentStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, officialLetterNumber, staffResponse } = req.body;

      const updated = await DocumentModel.findByIdAndUpdate(
        id,
        { 
          ...(status && { status }),
          ...(officialLetterNumber !== undefined && { officialLetterNumber }),
          ...(staffResponse !== undefined && { staffResponse })
        },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ success: false, message: 'Dokumen surat tidak ditemukan.' });
      }

      return res.status(200).json({
        success: true,
        message: 'Status dan data surat berhasil diperbarui',
        data: updated
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};