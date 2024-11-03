// bm-day-book/app/api/reports/receipt/route.js
import { openDB } from "@/app/services/db.mjs"; // Update the import to match your SQLite connection file

// Named export for the GET method
export const GET = async (req) => {
  const db = await openDB(); // Ensure database connection is established

  try {
    // Get the date from the query parameters
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    let receiptReports;

    // If date is provided, build the SQL query to filter by that date
    if (date) {
      const startOfDay = new Date(date);
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(startOfDay.getDate() + 1);

      // Fetch total receipts and count for the provided date
      receiptReports = await db.all(
        `SELECT 
          DATE(date) as receiptDate,
          SUM(amount) as totalReceipts,
          COUNT(*) as count 
        FROM Receipts 
        WHERE date >= ? AND date < ?
        GROUP BY receiptDate
        ORDER BY receiptDate ASC`,
        startOfDay.toISOString(),
        endOfDay.toISOString()
      );
    } else {
      // If no date is provided, fetch all receipts grouped by date
      receiptReports = await db.all(
        `SELECT 
          DATE(date) as receiptDate,
          SUM(amount) as totalReceipts,
          COUNT(*) as count 
        FROM Receipts 
        GROUP BY receiptDate
        ORDER BY receiptDate ASC`
      );
    }

    return new Response(JSON.stringify(receiptReports), { status: 200 });
  } catch (error) {
    console.error("Error fetching receipt reports:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};

// Named export for the POST method
export const POST = async (req) => {
  const db = await openDB(); // Ensure database connection is established

  try {
    const receiptData = await req.json(); // Parse JSON data from request body
    console.log("Receipt data received:", receiptData);

    // Validate required fields
    if (!receiptData.receiptAmount) {
      return new Response(JSON.stringify({ message: "Amount is required." }), {
        status: 400,
      });
    }

    // Insert the new receipt into the database
    const { lastID } = await db.run(
      `INSERT INTO Receipts (amount, description, date, enteredBy) VALUES (?, ?, ?, ?)`,
      receiptData.receiptAmount,
      receiptData.description,
      new Date().toISOString(), // Set current date for the receipt
      "6723b04af5f8e4297a77062f" // Hardcoded for now, should be dynamic
    );

    // Fetch the newly created receipt
    const newReceipt = await db.get(
      `SELECT * FROM Receipts WHERE id = ?`,
      lastID
    );

    return new Response(JSON.stringify(newReceipt), { status: 201 });
  } catch (error) {
    console.error("Error adding receipt:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};
