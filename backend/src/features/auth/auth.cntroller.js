import { authService } from './auth.service.js';

export const authController = {
  handleSync: async (req, res) => {
    try {
      // req.user didapatkan secara otomatis dari file auth.middleware.js kita yang lolos verifikasi
      const syncedUser = await authService.syncUserProfile(req.user);

      return res.status(200).json({
        success: true,
        message: 'Sinkronisasi profil pengguna ke database lokal sukses!',
        user: syncedUser
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Gagal melakukan sinkronisasi data user: ' + error.message
      });
    }
  }
};
