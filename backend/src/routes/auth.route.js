import { Router } from "express";

import { requireAuth } from '../middlewares/auth.middleware.js'; 
import { verifyStaffRole } from '../middlewares/rbac.middleware.js'; 

import { authController } from '../features/auth/auth.controller.js'; 
import { MongoUserModel } from '../models/user.model.js'; // <-- TAMBAHKAN IMPOR INI

const authRouter = Router();

authRouter.get('/public-data', (req, res) => {
  res.json({ message: "Ini data publik, semua orang bisa lihat tanpa login." });
});

// RUTE B (Rahasia): Hanya orang yang membawa token Clerk asli yang bisa lolos
authRouter.get('/secret-profile', requireAuth, (req, res) => {
  res.json({
    success: true,
    message: "Selamat! Anda berhasil menembus proteksi rute rahasia.",
    profile: req.user // Menampilkan Nama, Email, & Foto hasil kiriman Clerk
  });
});

authRouter.post('/sync', requireAuth, authController.handleSync);

authRouter.get('/me', requireAuth, async (req, res) => {
  try {
    const clerkId = req.auth?.userId;
    
    let dbUser = await MongoUserModel.findOne({ clerkId });

    if (!dbUser) {
      dbUser = await MongoUserModel.create({
        clerkId: req.user.clerkId,
        name: req.user.name,
        email: req.user.email,
        picture: req.user.picture,
        role: 'warga_publik' 
      });
      console.log(`User baru otomatis terdaftar via /me: ${dbUser.email}`);
    }

    res.json({
      success: true,
      role: dbUser.role
    });
  } catch (error) {
    console.error("Gagal memuat/menyimpan user di /me:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default authRouter;

//sementara sign-up dan log-in ada di route yang sama, beda slah saja, 

// /auth/signup
// authRouter.get("/signup", signUp);
// authRouter.post('/signup', registerNewUser);

// // /auth/login
// authRouter.get("/login", login);
// authRouter.post("/login", loginUser);

// // /auth/logout
// authRouter.get("/logout", logout);

// export default authRouter;