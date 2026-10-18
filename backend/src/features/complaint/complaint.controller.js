import { complaintService } from './complaint.service.js';

export const complaintController = {
  create: async (req, res) => {
    try {
      // req.auth atau req.user bisa didapat jika token dikirim, 
      // tapi jika tidak login, nilainya di-set null alih-alih melempar error.
      const currentUser = req.user || req.auth || null; 
      
      const newComplaint = await complaintService.createComplaint(req.body, req.file, currentUser);

      return res.status(201).json({
        success: true,
        message: 'Pengaduan berhasil dikirim!',
        data: newComplaint
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server.',
        error: error.message
      });
    }
  },

  getByTicket: async (req, res) => {
    try {
      const { ticketNumber } = req.params;
      const complaint = await complaintService.getComplaintByTicket(ticketNumber);

      return res.status(200).json({
        success: true,
        data: complaint
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
  },

  getMyComplaints: async (req, res) => {
    try {
      const userId = req.user.clerkId; // Dari middleware auth user login
      const complaints = await complaintService.getUserComplaints(userId);

      return res.status(200).json({
        success: true,
        data: complaints
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const complaints = await complaintService.getAllComplaints();
      return res.status(200).json({
        success: true,
        data: complaints
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  updateStatus: async (req, res) => {
    try {
      const { ticketNumber } = req.params;
      const { status } = req.body;

      const updated = await complaintService.updateComplaintStatus(ticketNumber, status);

      return res.status(200).json({
        success: true,
        message: 'Status pengaduan berhasil diperbarui.',
        data: updated
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
};