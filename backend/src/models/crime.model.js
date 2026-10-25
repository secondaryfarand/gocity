import mongoose from 'mongoose';

const crimeSchema = new mongoose.Schema({
  category: { type: String, required: true }, // Contoh: 'anti-social-behaviour', 'burglary', dll.
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  streetName: { type: String },
  severity: { type: Number, default: 1 }, // Tingkat keparahan/bobot untuk heatmap
  month: { type: String }
}, { timestamps: true });

export const CrimeModel = mongoose.model('Crime', crimeSchema);