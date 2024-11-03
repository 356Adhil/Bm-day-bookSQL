// bm-day-book/app/api/reports/report/route.js
import { connectDB } from "@/app/services/db";
import Sale from "@/app/services/models/Sale";

// Named export for the GET method
export const GET = async (req) => {
  await connectDB(); // Ensure database connection is established

  try {
    // Get the date from the query parameters
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    console.log(date);

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

    // Group by date and calculate total sales and count
    pipeline.push(
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalSales: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date
      }
    );

    const reports = await Sale.aggregate(pipeline);
    return new Response(JSON.stringify(reports), { status: 200 });
  } catch (error) {
    console.error("Error fetching sales reports:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};

export const POST = async (req) => {
  await connectDB(); // Ensure database connection is established

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

    // Create a new Sale instance and save it to the database
    const newSale = new Sale({
      amount: saleData.amount,
      invoiceNumber: `INV${saleData.invoiceNumber}`,
      enteredBy: "6723b04af5f8e4297a77062f", // Hardcoded for now, should be dynamic
    });

    await newSale.save(); // Save the sale to the database

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
