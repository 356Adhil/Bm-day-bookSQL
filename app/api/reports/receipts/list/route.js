import { connectDB } from "@/app/services/db";
import Receipt from "@/app/services/models/Reciepts";

// Named export for the GET method to list today's receipt entries
export const GET = async (req) => {
  await connectDB(); // Ensure database connection is established

  try {
    const today = new Date();
    const startOfDay = new Date(today.setUTCHours(0, 0, 0, 0)); // Start of the day in UTC
    const endOfDay = new Date(today.setUTCHours(23, 59, 59, 999)); // End of the day in UTC

    // Fetch all receipt entries for today, sorted by date descending
    const receipts = await Receipt.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).sort({ date: -1 });

    return new Response(JSON.stringify(receipts), { status: 200 });
  } catch (error) {
    console.error("Error fetching receipt entries:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};

// Named export for the PUT method to update a receipt entry
export const PUT = async (req) => {
  await connectDB(); // Ensure database connection is established

  try {
    const receiptData = await req.json(); // Parse JSON data from request body

    // Basic validation
    if (!receiptData.id || !receiptData.amount || !receiptData.description) {
      return new Response(
        JSON.stringify({ message: "Invalid request data." }),
        { status: 400 }
      );
    }

    // Update the receipt in the database
    const updatedReceipt = await Receipt.findByIdAndUpdate(
      receiptData.id,
      { ...receiptData }, // Ensure you only send the necessary fields to update
      { new: true }
    );

    if (!updatedReceipt) {
      return new Response(JSON.stringify({ message: "Receipt not found." }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(updatedReceipt), { status: 200 });
  } catch (error) {
    console.error("Error updating receipt entry:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};
