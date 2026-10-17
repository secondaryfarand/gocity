import { DB_TYPE } from '../../config/db.config.js';
import { SqlUserModel, MongoUserModel } from '../../models/user.model.js'; 

export const authRepository = {
  findByClerkId: async (clerkId) => {
    if (DB_TYPE === 'mongodb') {
      return await MongoUserModel.findOne({ clerkId });
    }
    if (DB_TYPE === 'mysql' || DB_TYPE === 'postgres') {
      return await SqlUserModel.findOne({ where: { clerkId } });
    }
    return null;
  },

  createUser: async (userData) => {
    const newUserStructure = {
      clerkId: userData.clerkId,
      name: userData.name,
      email: userData.email,
      picture: userData.picture,
      role: 'warga_publik',
      wilayah: 'belum_diatur',
      instansi: 'belum_diatur'
    };

    if (DB_TYPE === 'mongodb') {
      return await MongoUserModel.create(newUserStructure);
    }
    if (DB_TYPE === 'mysql' || DB_TYPE === 'postgres') {
      return await SqlUserModel.create(newUserStructure);
    }
  }
};
