// bm-day-book/app/services/models/Sale.js
import mongoose from "mongoose";

const recieptSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    enteredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the employee who entered the sale
    },
    date: {
      type: Date,
      default: Date.now, // Only allows current date entries for employees
    },
  },
  { timestamps: true }
);

export default mongoose.models.Reciept ||
  mongoose.model("Reciept", recieptSchema);
