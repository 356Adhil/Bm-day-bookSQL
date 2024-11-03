// bm-day-book/app/services/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'employee'],
    default: 'employee',
  },
  pin: {
    type: String,
    required: true, // 4-digit PIN for "day close" functionality
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);
