import { Router } from "express";

import { upload } from '../middlewares/upload.middleware.js';
import { requireAuth } from '../middlewares/auth.middleware.js'; 
import { verifyStaffRole } from '../middlewares/rbac.middleware.js';

import { complaintController } from '../features/complaint/complaint.controller.js';

const complaintRouter = Router();

// Route untuk membuat pengaduan baru (mendukung upload 1 gambar dengan field name: "attachment")
complaintRouter.post('/', upload.single('attachment'), complaintController.create);

// Route publik untuk melacak pengaduan berdasarkan nomor tiket
complaintRouter.get('/ticket/:ticketNumber', complaintController.getByTicket);

// Route untuk melihat semua pengaduan (biasanya untuk admin/petugas)
complaintRouter.get('/', requireAuth, verifyStaffRole, complaintController.getAll);

// Route untuk mengupdate status pengaduan (oleh admin/petugas)
complaintRouter.patch('/:ticketNumber/status', requireAuth, verifyStaffRole, complaintController.updateStatus);

export default complaintRouter;