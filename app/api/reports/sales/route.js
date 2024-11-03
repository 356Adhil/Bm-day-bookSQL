// bm-day-book/app/api/reports/report/route.js
import { connectDB } from "@/app/services/db";

// Named export for the GET method
export const GET = async (req) => {
  const db = await connectDB(); // Connect to the SQLite database

  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    let reports;
    if (date) {
      // Query to get total sales for a specific date
      const startOfDay = new Date(date).toISOString().split("T")[0];
      const query = `
        SELECT date(date) as date, SUM(amount) as totalSales, COUNT(id) as count 
        FROM Sale
        WHERE date(date) = ?
        GROUP BY date(date)
        ORDER BY date(date);
      `;
      reports = await db.all(query, [startOfDay]);
    } else {
      // Query to get total sales grouped by each date if no specific date is provided
      const query = `
        SELECT date(date) as date, SUM(amount) as totalSales, COUNT(id) as count 
        FROM Sale
        GROUP BY date(date)
        ORDER BY date(date);
      `;
      reports = await db.all(query);
    }

    return new Response(JSON.stringify(reports), { status: 200 });
  } catch (error) {
    console.error("Error fetching sales reports:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};

export const POST = async (req) => {
  const db = await connectDB();

  try {
    const saleData = await req.json();

    if (!saleData.amount || !saleData.date) {
      return new Response(
        JSON.stringify({ message: "Amount and date are required." }),
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO Sale (amount, invoiceNumber, enteredBy, date)
      VALUES (?, ?, ?, ?)
    `;

    await db.run(query, [
      saleData.amount,
      `INV${saleData.invoiceNumber}`,
      1, // Example hardcoded user ID
      saleData.date,
    ]);

    return new Response(
      JSON.stringify({ message: "Sale added successfully." }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding sale:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};
