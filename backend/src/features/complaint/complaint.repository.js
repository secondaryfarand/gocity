import { DB_TYPE } from '../../config/db.config.js';
import { SqlComplaintModel, MongoComplaintModel } from '../../models/complaint.model.js';

export const complaintRepository = {
  createComplaint: async (complaintData) => {
    if (DB_TYPE === 'mongodb') {
      return await MongoComplaintModel.create(complaintData);
    }
    if (DB_TYPE === 'mysql' || DB_TYPE === 'postgres') {
      return await SqlComplaintModel.create(complaintData);
    }
  },

  findByTicketNumber: async (ticketNumber) => {
    if (DB_TYPE === 'mongodb') {
      return await MongoComplaintModel.findOne({ ticketNumber });
    }
    if (DB_TYPE === 'mysql' || DB_TYPE === 'postgres') {
      return await SqlComplaintModel.findOne({ where: { ticketNumber } });
    }
    return null;
  },

  findByUserId: async (userId) => {
    if (DB_TYPE === 'mongodb') {
      return await MongoComplaintModel.find({ userId }).sort({ createdAt: -1 });
    }
    if (DB_TYPE === 'mysql' || DB_TYPE === 'postgres') {
      return await SqlComplaintModel.findAll({ 
        where: { userId },
        order: [['createdAt', 'DESC']]
      });
    }
    return [];
  },

  findAllComplaints: async () => {
    if (DB_TYPE === 'mongodb') {
      return await MongoComplaintModel.find().sort({ createdAt: -1 });
    }
    if (DB_TYPE === 'mysql' || DB_TYPE === 'postgres') {
      return await SqlComplaintModel.findAll({
        order: [['createdAt', 'DESC']]
      });
    }
    return [];
  },

  updateStatus: async (ticketNumber, newStatus) => {
    if (DB_TYPE === 'mongodb') {
      return await MongoComplaintModel.findOneAndUpdate(
        { ticketNumber },
        { status: newStatus },
        { returnDocument: 'after' }
      );
    }
    if (DB_TYPE === 'mysql' || DB_TYPE === 'postgres') {
      const complaint = await SqlComplaintModel.findOne({ where: { ticketNumber } });
      if (!complaint) return null;
      complaint.status = newStatus;
      await complaint.save();
      return complaint;
    }
    return null;
  }
};