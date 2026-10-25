import { CrimeModel } from '../../models/crime.model.js';
import { fetchAndShiftCrimeData } from './crime.service.js';

export const crimeController = {
  // Ambil semua data titik kriminalitas untuk peta
  getCrimes: async (req, res) => {
    try {
      // Jika data masih kosong, panggil fungsi fetch otomatis sekali
      const count = await CrimeModel.countDocuments();
      if (count === 0) {
        await fetchAndShiftCrimeData();
      }

      const crimes = await CrimeModel.find();
      return res.status(200).json({
        success: true,
        data: crimes
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Gagal mengambil data kerawanan kriminalitas',
        error: error.message
      });
    }
  }
};