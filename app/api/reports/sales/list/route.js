// bm-day-book/app/api/reports/sales/route.js
import { openDB } from "@/app/services/db.mjs";

// Named export for the GET method to list today's sale entries
export const GET = async (req) => {
  const db = await openDB(); // Ensure database connection is established

  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Set time to the start of the day
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // Set time to the end of the day

    // Fetch all sales entries for today, sorted by date descending
    const sales = await db.all(
      "SELECT * FROM Sales WHERE date >= ? AND date <= ? ORDER BY date DESC",
      startOfDay.toISOString(),
      endOfDay.toISOString()
    );

    return new Response(JSON.stringify(sales), { status: 200 });
  } catch (error) {
    console.error("Error fetching sales entries:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};

export const PUT = async (req, { params }) => {
  const db = await openDB(); // Ensure database connection is established

  try {
    const saleData = await req.json(); // Parse JSON data from request body

    console.log("Updating sale entry:", saleData.id, saleData);
    // Update the sale in the database
    const updatedSale = await db.run(
      `UPDATE Sales SET amount = ?, date = ? WHERE id = ?`,
      saleData.amount,
      saleData.date || new Date().toISOString(),
      saleData.id
    );

    if (updatedSale.changes === 0) {
      return new Response(JSON.stringify({ message: "Sale not found." }), {
        status: 404,
      });
    }

    // Fetch the updated sale entry to return it
    const result = await db.get(
      "SELECT * FROM Sales WHERE id = ?",
      saleData.id
    );
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Error updating sale entry:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};
