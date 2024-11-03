// bm-day-book/app/api/reports/expenses/route.js
import { openDB } from "@/app/services/db.mjs";

// Named export for the GET method to list today's expense entries
export const GET = async (req) => {
  const db = await openDB(); // Ensure database connection is established

  try {
    const today = new Date();
    const startOfDay = new Date(today.setUTCHours(0, 0, 0, 0)); // Start of the day in UTC
    const endOfDay = new Date(today.setUTCHours(23, 59, 59, 999)); // End of the day in UTC

    // Fetch all expense entries for today, sorted by date descending
    const expenses = await db.all(
      "SELECT * FROM Expenses WHERE date >= ? AND date <= ? ORDER BY date DESC",
      startOfDay.toISOString(),
      endOfDay.toISOString()
    );

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
  const db = await openDB(); // Ensure database connection is established

  try {
    const expenseData = await req.json(); // Parse JSON data from request body

    // Basic validation
    if (
      !expenseData.id ||
      !expenseData.expenseAmount ||
      !expenseData.description
    ) {
      return new Response(
        JSON.stringify({ message: "Invalid request data." }),
        { status: 400 }
      );
    }

    // Update the expense in the database
    const updatedExpense = await db.run(
      `UPDATE Expenses SET expenseAmount = ?, description = ?, date = ? WHERE id = ?`,
      expenseData.expenseAmount,
      expenseData.description,
      expenseData.date,
      expenseData.id
    );

    if (updatedExpense.changes === 0) {
      return new Response(JSON.stringify({ message: "Expense not found." }), {
        status: 404,
      });
    }

    // Fetch the updated expense entry to return it
    const result = await db.get(
      "SELECT * FROM Expenses WHERE id = ?",
      expenseData.id
    );
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Error updating expense entry:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};
