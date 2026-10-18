import { Router } from 'express';
import { requireAuth } from '../middewares/auth.middleware.js'; // Sesuaikan path path middleware Anda
import { verifyStaffRole } from '../middewares/rbac.middleware.js';
import { cctvController } from '../features/cctv/cctv.controller.js';

const cctvRouter = Router();

// Route untuk mengambil semua data CCTV (Dilindungi autentikasi & role staf)
cctvRouter.get('/', requireAuth, verifyStaffRole, cctvController.getAll);

// Route untuk menambah titik CCTV baru
cctvRouter.post('/', requireAuth, verifyStaffRole, cctvController.create);

export default cctvRouter;