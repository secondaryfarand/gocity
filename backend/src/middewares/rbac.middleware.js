import { MongoUserModel } from '../models/user.model.js';

export const verifyStaffRole = async (req, res, next) => {
  try {
    // 1. Ambil identitas unik user dari token Clerk
    const clerkId = req.auth?.userId || req.user?.sub;

    if (!clerkId) {
      return res.status(401).json({ success: false, message: 'Unauthenticated: Token tidak valid.' });
    }

    // 2. Cari user di MongoDB menggunakan sintaks Mongoose yang benar (tanpa "where:")
    const dbUser = await MongoUserModel.findOne({ clerkId }); 

    if (!dbUser) {
      return res.status(403).json({ success: false, message: 'Akses ditolak: User tidak terdaftar di database.' });
    }

    // 3. Cek apakah role di database lokal bernilai 'staf' atau 'admin'
    if (dbUser.role !== 'staf' && dbUser.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Akses ditolak: Anda bukan staf.' });
    }

    // 4. Lolos! Lanjutkan ke controller
    req.currentUser = dbUser;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};