import mongoose from 'mongoose';

const aqiSchema = new mongoose.Schema({
  locationName: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  aqi: { type: Number, required: true }, // Indeks Kualitas Udara (misal 1-5 atau skala AQI standar)
  pm25: { type: Number },
  pm10: { type: Number },
  status: { type: String, enum: ['SEHAT', 'SEDANG', 'TIDAK SEHAT', 'BERBAHAYA'], default: 'SEHAT' }
}, { timestamps: true });

export const AqiModel = mongoose.model('AQI', aqiSchema);