import { connectDB } from "@/app/services/db";
import Expense from "@/app/services/models/Expense";

// Named export for the GET method to list today's expense entries
export const GET = async (req) => {
  await connectDB(); // Ensure database connection is established

  try {
    const today = new Date();
    const startOfDay = new Date(today.setUTCHours(0, 0, 0, 0)); // Start of the day in UTC
    const endOfDay = new Date(today.setUTCHours(23, 59, 59, 999)); // End of the day in UTC

    // Fetch all expense entries for today, sorted by date descending
    const expenses = await Expense.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).sort({ date: -1 });

    return new Response(JSON.stringify(expenses), { status: 200 });
  } catch (error) {
    console.error("Error fetching expense entries:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};

// Named export for the PUT method to update an expense entry
export const PUT = async (req) => {
  await connectDB(); // Ensure database connection is established

  try {
    const expenseData = await req.json(); // Parse JSON data from request body

    // Basic validation
    if (!expenseData.id || !expenseData.amount || !expenseData.description) {
      return new Response(
        JSON.stringify({ message: "Invalid request data." }),
        { status: 400 }
      );
    }

    // Update the expense in the database
    const updatedExpense = await Expense.findByIdAndUpdate(
      expenseData.id,
      { ...expenseData }, // Ensure you only send the necessary fields to update
      { new: true }
    );

    if (!updatedExpense) {
      return new Response(JSON.stringify({ message: "Expense not found." }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(updatedExpense), { status: 200 });
  } catch (error) {
    console.error("Error updating expense entry:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};
