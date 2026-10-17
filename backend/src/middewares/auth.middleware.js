import { createClerkClient } from '@clerk/clerk-sdk-node';

// Menginisialisasi Clerk menggunakan kunci rahasia dari file .env
const clerkClient = createClerkClient({ 
  secretKey: process.env.CLERK_SECRET_KEY 
});

export const requireAuth = async (req, res, next) => {
  try {
    // 1. Ambil token token dari header HTTP (Authorization: Bearer <token>)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        error: 'Akses ditolak. Token autentikasi tidak ditemukan.' 
      });
    }

    // Mengambil string token acaknya saja
    const token = authHeader.split(' ')[1];

    // 2. Verifikasi apakah token tersebut asli atau palsu
    const requestState = await clerkClient.authenticateRequest(req);

    // Jika token palsu, tidak valid, atau sudah kedaluwarsa
    if (!requestState.isSignedIn) {
      return res.status(401).json({ 
        success: false, 
        error: 'Sesi login tidak valid atau sudah habis.' 
      });
    }

    // 3. Jika token asli, ambil data profil pengguna dari server Clerk
    const clerkUser = await clerkClient.users.getUser(requestState.toAuth().userId);

    // 4. Bungkus data profil ke objek 'req.user' agar bisa dibaca oleh controller kita nanti
    req.user = {
      clerkId: clerkUser.id,
      name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
      email: clerkUser.emailAddresses[0]?.emailAddress,
      picture: clerkUser.imageUrl
    };

    // Lolos pemeriksaan, silakan lanjut ke rute / controller tujuan
    next();
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: 'Gagal memproses autentikasi: ' + error.message 
    });
  }
};
