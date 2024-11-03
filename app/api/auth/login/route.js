// bm-day-book/app/pages/api/auth/login/route.js
import { generateToken } from "@/app/services/auth";
import { openDB } from "@/app/services/db.mjs";

export async function POST(req) {
  const { email, password } = await req.json();

  const db = await openDB();
  const user = await db.get("SELECT * FROM Users WHERE email = ?", email);

  if (user && user.password === password) {
    const token = generateToken({ id: user.id, role: user.role }); // No await here
    console.log("User logged in:", token);
    return new Response(JSON.stringify({ success: true, user, token }), {
      status: 200,
    });
  }

  return new Response(
    JSON.stringify({ success: false, message: "Invalid credentials" }),
    { status: 401 }
  );
}
