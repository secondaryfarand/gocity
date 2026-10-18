import { CctvModel } from '../../models/cctv.model.js';

export const cctvController = {
  // Ambil semua daftar CCTV (untuk Staf)
  getAll: async (req, res) => {
    try {
      const cctvs = await CctvModel.find();
      return res.status(200).json({
        success: true,
        data: cctvs
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Gagal mengambil data CCTV',
        error: error.message
      });
    }
  },

  // Tambah titik CCTV baru (Opsional/Admin)
  create: async (req, res) => {
    try {
      const newCctv = await CctvModel.create(req.body);
      return res.status(201).json({
        success: true,
        message: 'CCTV berhasil ditambahkan',
        data: newCctv
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Gagal menambahkan CCTV',
        error: error.message
      });
    }
  }
};