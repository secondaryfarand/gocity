import { DataTypes } from 'sequelize';
import mongoose from 'mongoose';
import { dbInstance, DB_TYPE } from '../config/db.config.js';

let SqlComplaintModel = null;
let MongoComplaintModel = null;

if (DB_TYPE === 'mysql' || DB_TYPE === 'postgres') {
  SqlComplaintModel = dbInstance.define('Complaint', {
    ticketNumber: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true 
    },
    userId: { 
      type: DataTypes.STRING, 
      allowNull: true 
    },
    senderName: { 
      type: DataTypes.STRING, 
      defaultValue: 'Anonymous', 
      allowNull: false 
    },
    senderEmail: {
      type: DataTypes.STRING,
      allowNull: true 
    },
    isAnonymous: {
      type: DataTypes.BOOLEAN,
      defaultValue: false 
    },
    category: { 
      type: DataTypes.STRING, 
      allowNull: false,
      validate: {
        isIn: [['infrastructure', 'cleanliness', 'public_service', 'security']]
      }
    },
    content: { 
      type: DataTypes.TEXT, 
      allowNull: false 
    },
    suggestion: { 
      type: DataTypes.TEXT, 
      allowNull: true,
      defaultValue: '' 
    },
    status: { 
      type: DataTypes.STRING, 
      defaultValue: 'PENDING',
      validate: {
        isIn: [['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED']]
      }
    },
    // Fitur Lampiran Gambar (Cloudinary URL)
    attachment: {
      type: DataTypes.STRING,
      allowNull: true 
    },
    // Fitur Koordinat Lokasi Fasilitas Umum
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    region: {
      type: DataTypes.STRING,
      defaultValue: 'unassigned'
    }
  }, {
    timestamps: true
  });
}

if (DB_TYPE === 'mongodb') {
  const complaintSchema = new mongoose.Schema({
    ticketNumber: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true
    },
    userId: { 
      type: String, 
      default: null 
    },
    senderName: { 
      type: String, 
      default: 'Anonymous', 
      trim: true 
    },
    senderEmail: {
      type: String,
      default: null,
      trim: true
    },
    isAnonymous: {
      type: Boolean,
      default: false
    },
    category: { 
      type: String, 
      required: true, 
      enum: ['infrastructure', 'cleanliness', 'public_service', 'security'] 
    },
    content: { 
      type: String, 
      required: true, 
      trim: true 
    },
    suggestion: { 
      type: String, 
      default: '', 
      trim: true 
    },
    status: { 
      type: String, 
      enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'], 
      default: 'PENDING' 
    },
    attachment: {
      type: String,
      default: null
    },
    latitude: {
      type: Number,
      default: null
    },
    longitude: {
      type: Number,
      default: null
    },
    region: {
      type: String,
      default: 'unassigned'
    }
  }, {
    timestamps: true 
  });

  MongoComplaintModel = mongoose.models.Complaint || mongoose.model('Complaint', complaintSchema);
}

export { SqlComplaintModel, MongoComplaintModel };