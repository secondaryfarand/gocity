import { authRepository } from './auth.repository.js';

export const authService = {
  syncUserProfile: async (clerkUserData) => {
    // Logika Bisnis: Cek dulu apakah Clerk ID ini sudah ada di database kita
    let user = await authRepository.findByClerkId(clerkUserData.clerkId);

    // Jika user belum terdaftar di database lokal, buatkan akunnya otomatis
    if (!user) {
      console.log(`[Auth Service] User baru terdeteksi (${clerkUserData.email}). Mendaftarkan otomatis ke DB lokal...`);
      user = await authRepository.createUser(clerkUserData);
    } else {
      console.log(`[Auth Service] User lama login (${clerkUserData.email}). Sinkronisasi sesi sukses.`);
    }

    return user;
  }
};
