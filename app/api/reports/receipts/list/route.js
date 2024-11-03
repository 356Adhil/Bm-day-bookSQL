// bm-day-book/app/api/receipts/route.js
import { openDB } from "@/app/services/db.mjs"; // Adjust the import based on your SQLite connection file

// Named export for the GET method to list today's receipt entries
export const GET = async (req) => {
  const db = await openDB(); // Ensure database connection is established

  try {
    const today = new Date();
    const startOfDay = new Date(today.setUTCHours(0, 0, 0, 0)); // Start of the day in UTC
    const endOfDay = new Date(today.setUTCHours(23, 59, 59, 999)); // End of the day in UTC

    // Fetch all receipt entries for today, sorted by date descending
    const receipts = await db.all(
      `SELECT * FROM Receipts 
       WHERE date >= ? AND date <= ? 
       ORDER BY date DESC`,
      startOfDay.toISOString(),
      endOfDay.toISOString()
    );

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
  const db = await openDB(); // Ensure database connection is established

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
    const result = await db.run(
      `UPDATE Receipts 
       SET amount = ?, description = ? 
       WHERE id = ?`,
      receiptData.amount,
      receiptData.description,
      receiptData.id
    );

    // Check if any row was updated
    if (result.changes === 0) {
      return new Response(JSON.stringify({ message: "Receipt not found." }), {
        status: 404,
      });
    }

    // Fetch the updated receipt
    const updatedReceipt = await db.get(
      `SELECT * FROM Receipts WHERE id = ?`,
      receiptData.id
    );

    return new Response(JSON.stringify(updatedReceipt), { status: 200 });
  } catch (error) {
    console.error("Error updating receipt entry:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};
