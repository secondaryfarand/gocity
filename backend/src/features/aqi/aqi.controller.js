import { AqiModel } from '../../models/aqi.model.js';

export const aqiController = {
  // Ambil semua data sensor AQI kota
  getAllAqi: async (req, res) => {
    try {
      const aqiData = await AqiModel.find();
      return res.status(200).json({
        success: true,
        data: aqiData
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Gagal mengambil data kualitas udara',
        error: error.message
      });
    }
  }
};