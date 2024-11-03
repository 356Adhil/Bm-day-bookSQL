// bm-day-book/app/api/reports/report/route.js
import { openDB } from "@/app/services/db.mjs";

// Named export for the GET method
export const GET = async (req) => {
  const db = await openDB(); // Ensure database connection is established

  try {
    // Get the date from the query parameters
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    console.log(date);

    // If date is provided, build the SQL query to filter by that date
    let salesReports;
    if (date) {
      const startOfDay = new Date(date);
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(startOfDay.getDate() + 1);

      // Fetch total sales and count for the provided date
      salesReports = await db.all(
        `SELECT 
          DATE(date) as saleDate,
          SUM(amount) as totalSales,
          COUNT(*) as count 
        FROM Sales 
        WHERE date >= ? AND date < ?
        GROUP BY saleDate
        ORDER BY saleDate ASC`,
        startOfDay.toISOString(),
        endOfDay.toISOString()
      );
    } else {
      // If no date is provided, fetch all sales (you can modify this as needed)
      salesReports = await db.all(
        `SELECT 
          DATE(date) as saleDate,
          SUM(amount) as totalSales,
          COUNT(*) as count 
        FROM Sales 
        GROUP BY saleDate
        ORDER BY saleDate ASC`
      );
    }

    return new Response(JSON.stringify(salesReports), { status: 200 });
  } catch (error) {
    console.error("Error fetching sales reports:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};

// Named export for the POST method
export const POST = async (req) => {
  const db = await openDB(); // Ensure database connection is established

  try {
    const saleData = await req.json(); // Parse JSON data from request body

    console.log("Sale data received:", saleData);
    // Validate the required fields (amount and date)
    if (!saleData.amount || !saleData.date) {
      return new Response(
        JSON.stringify({ message: "Amount and date are required." }),
        {
          status: 400,
        }
      );
    }

    // Insert the new sale into the database
    await db.run(
      `INSERT INTO Sales (amount, date, invoiceNumber, enteredBy) VALUES (?, ?, ?, ?)`,
      saleData.amount,
      saleData.date,
      `INV${saleData.invoiceNumber}`,
      2 // Hardcoded for now, should be dynamic
    );

    return new Response(
      JSON.stringify({ message: "Sale added successfully." }),
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error adding sale:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};
