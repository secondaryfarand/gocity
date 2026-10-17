import { DataTypes } from 'sequelize';
import mongoose from 'mongoose';
import { dbInstance, DB_TYPE } from '../config/db.config.js';

let SqlUserModel = null;
let MongoUserModel = null;

if (DB_TYPE === 'mysql' || DB_TYPE === 'postgres') {
  SqlUserModel = dbInstance.define('User', {
    clerkId: { type: DataTypes.STRING, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true } },
    picture: { type: DataTypes.STRING, allowNull: true },
    role: { type: DataTypes.STRING, defaultValue: 'warga_publik' },
    wilayah: { type: DataTypes.STRING, defaultValue: 'belum_diatur' },
    instansi: { type: DataTypes.STRING, defaultValue: 'belum_diatur' }
  }, {
    timestamps: true
  });
}
if (DB_TYPE === 'mongodb') {
  const userSchema = new mongoose.Schema({
    clerkId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    picture: { type: String, default: null },
    role: { type: String, default: 'warga_publik' },
    wilayah: { type: String, default: 'belum_diatur' },
    instansi: { type: String, default: 'belum_diatur' }
  }, {
    timestamps: true 
  });

  MongoUserModel = mongoose.models.User || mongoose.model('User', userSchema);
}

export { SqlUserModel, MongoUserModel };
