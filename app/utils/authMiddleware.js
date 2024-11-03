// bm-day-book/app/utils/authMiddleware.js
import { NextResponse } from "next/server";
import { verifyToken } from "../services/auth";

export const authMiddleware = (handler, role) => async (req, res) => {
  const authHeader =
    req.headers.get("authorization") || req.headers.get("Authorization");
  const token = authHeader ? authHeader.split(" ")[1] : null;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // Attach the decoded user data to the request

    // Check role after the user has been decoded
    if (!req.user.role) {
      // Change 'expected_role' to your required role
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return await handler(req, res); // Call the next handler
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 403 });
  }
};
