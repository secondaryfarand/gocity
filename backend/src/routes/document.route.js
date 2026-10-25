import { Router } from "express";

import { upload } from '../middlewares/upload.middleware.js';
import { requireAuth } from '../middlewares/auth.middleware.js'; 
import { verifyStaffRole } from '../middlewares/rbac.middleware.js';

import { documentController } from '../features/document/document.controller.js';

const documentRouter = Router();

// Route untuk mengajukan permohonan surat baru (mendukung upload berkas/lampiran pendukung)
documentRouter.post('/', upload.single('attachment'), requireAuth, documentController.createRequest);

// Route untuk melihat semua permohonan surat (khusus admin/petugas)
documentRouter.get('/', requireAuth, verifyStaffRole, documentController.getAllRequests);

// Route untuk mengupdate status permohonan surat & nomor resmi (oleh admin/petugas)
documentRouter.patch('/:id/status', requireAuth, verifyStaffRole, documentController.updateDocumentStatus);

export default documentRouter;