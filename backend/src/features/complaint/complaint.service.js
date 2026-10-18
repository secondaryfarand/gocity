import { complaintRepository } from './complaint.repository.js';

export const complaintService = {
  createComplaint: async (bodyData, fileData, currentUser) => {
    // 1. Generate nomor tiket unik (Contoh: TCK-1740000000000)
    const ticketNumber = 'TCK-' + Date.now();

    // 2. Cek apakah user login atau memilih mode anonim dari form
    const isAnonymousReq = bodyData.isAnonymous === 'true' || bodyData.isAnonymous === true;
    
    let userId = null;
    let senderName = 'Anonymous';
    let senderEmail = null;

    if (currentUser && !isAnonymousReq) {
      // Jika user login dan TIDAK memilih anonim
      userId = currentUser.clerkId;
      senderName = currentUser.name;
      senderEmail = currentUser.email;
    } else if (currentUser && isAnonymousReq) {
      // Jika user login TAPI memilih opsi sembunyikan identitas (tetap simpan userId untuk riwayat privat)
      userId = currentUser.clerkId;
    }

    // 3. Mapping data terstruktur
    const complaintPayload = {
      ticketNumber,
      userId,
      senderName,
      senderEmail,
      isAnonymous: isAnonymousReq,
      category: bodyData.category,
      content: bodyData.content,
      suggestion: bodyData.suggestion || '',
      attachment: fileData ? fileData.path : null, // URL dari Cloudinary
      latitude: bodyData.latitude ? parseFloat(bodyData.latitude) : null,
      longitude: bodyData.longitude ? parseFloat(bodyData.longitude) : null,
      region: bodyData.region || 'unassigned',
      status: 'PENDING'
    };

    return await complaintRepository.createComplaint(complaintPayload);
  },

  getComplaintByTicket: async (ticketNumber) => {
    const complaint = await complaintRepository.findByTicketNumber(ticketNumber);
    if (!complaint) {
      throw new Error('Pengaduan dengan nomor tiket tersebut tidak ditemukan.');
    }
    return complaint;
  },

  getUserComplaints: async (userId) => {
    return await complaintRepository.findByUserId(userId);
  },

  getAllComplaints: async () => {
    return await complaintRepository.findAllComplaints();
  },

  updateComplaintStatus: async (ticketNumber, status) => {
    const updated = await complaintRepository.updateStatus(ticketNumber, status);
    if (!updated) {
      throw new Error('Gagal memperbarui status. Tiket tidak ditemukan.');
    }
    return updated;
  }
};