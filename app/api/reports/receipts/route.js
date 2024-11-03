import { connectDB } from "@/app/services/db";
import Receipt from "@/app/services/models/Reciepts";

// Named export for the GET method
export const GET = async (req) => {
  await connectDB(); // Ensure database connection is established

  try {
    // Get the date from the query parameters
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    // Build aggregation pipeline
    const pipeline = [];

    // If date is provided, add a match stage to filter by that date
    if (date) {
      const startOfDay = new Date(date);
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(startOfDay.getDate() + 1);

      pipeline.push({
        $match: {
          date: { $gte: startOfDay, $lt: endOfDay },
        },
      });
    }

    // Group by date and calculate total receipts and count
    pipeline.push(
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalReceipts: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date
      }
    );

    const reports = await Receipt.aggregate(pipeline);
    return new Response(JSON.stringify(reports), { status: 200 });
  } catch (error) {
    console.error("Error fetching receipt reports:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};

export const POST = async (req) => {
  await connectDB();

  try {
    const receiptData = await req.json();
    console.log("Receipt data received:", receiptData);

    const newReceipt = new Receipt({
      amount: receiptData.receiptAmount,
      description: receiptData.description,
      enteredBy: "6723b04af5f8e4297a77062f", // Hardcoded for now, should be dynamic
    });
    await newReceipt.save();

    return new Response(JSON.stringify(newReceipt), { status: 201 });
  } catch (error) {
    console.error("Error adding receipt:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};
