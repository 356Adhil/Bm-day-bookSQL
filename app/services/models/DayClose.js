// bm-day-book/app/services/models/DayClose.js
import mongoose from 'mongoose';

const dayCloseSchema = new mongoose.Schema({
  totalSales: {
    type: Number,
    required: true,
  },
  totalExpenses: {
    type: Number,
    required: true,
  },
  closedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the employee who closed the day
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    unique: true, // Ensures only one entry per day
  },
}, { timestamps: true });

export default mongoose.models.DayClose || mongoose.model('DayClose', dayCloseSchema);
