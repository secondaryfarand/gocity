import mongoose from 'mongoose';

const cctvSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  streamUrl: { type: String, required: true }, // URL embed YouTube live atau HLS stream publik
  status: { type: String, enum: ['LANCAR', 'PADAT', 'MACET', 'DARURAT'], default: 'LANCAR' }
}, { timestamps: true });

export const CctvModel = mongoose.model('CCTV', cctvSchema);