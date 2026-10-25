import { ClerkExpressRequireAuth, createClerkClient } from '@clerk/clerk-sdk-node';

// Inisialisasi client backend Clerk untuk menarik profil mendalam
const clerkClient = createClerkClient({ 
  secretKey: process.env.CLERK_SECRET_KEY 
});

export const requireAuth = [
  // 1. Satpam resmi Clerk memeriksa apakah token dari React valid
  ClerkExpressRequireAuth({
    secretKey: process.env.CLERK_SECRET_KEY
  }),
  // 2. Jika valid, ambil data profil Google asli Anda langsung dari server Clerk
  async (req, res, next) => {
    try {
      const authData = req.auth;

      if (!authData || !authData.userId) {
        return res.status(401).json({ success: false, error: 'Sesi login tidak valid.' });
      }

      // 🟢 LANGKAH UTAMA: Ambil data profil asli Anda dari server Clerk menggunakan userId token
      const clerkUser = await clerkClient.users.getUser(authData.userId);

      // Cari alamat email utama yang diverifikasi oleh sistem Google
      const primaryEmail = clerkUser.emailAddresses.find(
        (email) => email.id === clerkUser.primaryEmailAddressId
      )?.emailAddress || clerkUser.emailAddresses[0]?.emailAddress;

      // Bungkus data asli Anda ke objek req.user
      req.user = {
        clerkId: clerkUser.id,
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Warga Publik',
        email: primaryEmail || 'tidak_ada_email@clerk.com',
        picture: clerkUser.imageUrl
      };

      next(); // Teruskan data asli Anda ke Controller ➡️ Service ➡️ Simpan ke MongoDB!
    } catch (error) {
      console.error("🔴 Gagal menarik profil dari Clerk:", error.message);
      return res.status(500).json({ success: false, error: 'Gagal memproses profil: ' + error.message });
    }
  }
];
