// bm-day-book/app/api/reports/expense/route.js
import { openDB } from "@/app/services/db.mjs"; // Update the import to match your SQLite connection file

// Named export for the GET method
export const GET = async (req) => {
  const db = await openDB(); // Ensure database connection is established

  try {
    // Get the date from the query parameters
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    let expenseReports;

    // If date is provided, build the SQL query to filter by that date
    if (date) {
      const startOfDay = new Date(date);
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(startOfDay.getDate() + 1);

      // Fetch total expenses and count for the provided date
      expenseReports = await db.all(
        `SELECT 
          DATE(date) as expenseDate,
          SUM(expenseAmount) as totalExpenses,
          COUNT(*) as count 
        FROM Expenses 
        WHERE date >= ? AND date < ?
        GROUP BY expenseDate
        ORDER BY expenseDate ASC`,
        startOfDay.toISOString(),
        endOfDay.toISOString()
      );
    } else {
      // If no date is provided, fetch all expenses grouped by date
      expenseReports = await db.all(
        `SELECT 
          DATE(date) as expenseDate,
          SUM(expenseAmount) as totalExpenses,
          COUNT(*) as count 
        FROM Expenses 
        GROUP BY expenseDate
        ORDER BY expenseDate ASC`
      );
    }

    return new Response(JSON.stringify(expenseReports), { status: 200 });
  } catch (error) {
    console.error("Error fetching expense reports:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};

// Named export for the POST method
export const POST = async (req) => {
  const db = await openDB(); // Ensure database connection is established

  try {
    const expenseData = await req.json(); // Parse JSON data from request body
    console.log("Expense data received:", expenseData);

    // Validate required fields
    if (!expenseData.expenseAmount) {
      return new Response(JSON.stringify({ message: "Amount is required." }), {
        status: 400,
      });
    }

    // Insert the new expense into the database
    const { lastID } = await db.run(
      `INSERT INTO Expenses (expenseAmount, description, date, enteredBy) VALUES (?, ?, ?, ?)`,
      expenseData.expenseAmount,
      expenseData.description,
      new Date().toISOString(), // Set current date for the expense
      2 // Hardcoded for now, should be dynamic
    );

    // Fetch the newly created expense
    const newExpense = await db.get(
      `SELECT * FROM Expenses WHERE id = ?`,
      lastID
    );

    return new Response(JSON.stringify(newExpense), { status: 201 });
  } catch (error) {
    console.error("Error adding expense:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};
