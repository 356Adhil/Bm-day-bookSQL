// bm-day-book/app/utils/authMiddleware.js
import { NextResponse } from "next/server";
import { verifyToken } from "../services/auth";
import { openDB } from "../services/db.mjs"; // Import the database connection

export const authMiddleware = (handler) => async (req, res) => {
  const authHeader =
    req.headers.get("authorization") || req.headers.get("Authorization");
  const token = authHeader ? authHeader.split(" ")[1] : null;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = verifyToken(token);
    const db = await openDB(); // Open the database connection

    // Fetch user data from the database
    const user = await db.get("SELECT * FROM Users WHERE id = ?", decoded.id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    req.user = user; // Attach the user data to the request

    return await handler(req, res); // Call the next handler
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 403 });
  }
};
