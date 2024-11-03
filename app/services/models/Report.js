// bm-day-book/app/services/models/Report.js
import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  dateRange: {
    type: String,
    required: true,
    enum: ['daily', 'weekly', 'monthly'],
  },
  startDate: Date,
  endDate: Date,
  totalSales: Number,
  totalExpenses: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export default mongoose.models.Report || mongoose.model('Report', reportSchema);
