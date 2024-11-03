// bm-day-book/app/pages/api/auth/me/route.js
import { authMiddleware } from "@/app/utils/authMiddleware";
import { NextResponse } from "next/server";

const handler = async (req, res) => {
  return NextResponse.json({ user: req.user }, { status: 200 });
};

// Exporting a named export for the GET method
export const GET = authMiddleware(handler);
