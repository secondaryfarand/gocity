import { Router } from "express";
import { requireAuth } from '../middewares/auth.middleware.js'; 
import { authController } from '../features/auth/auth.controller.js'; 


// import { signUp, registerNewUser, login, loginUser, logout } from '../controllers/auth/auth.controller.js';

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

// authRouter.post('/auth/sync', requireAuth, authController.handleSync);
authRouter.post('/sync', requireAuth, authController.handleSync);


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