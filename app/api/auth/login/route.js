// bm-day-book/app/pages/api/auth/login/route.js
import { connectDB } from "@/app/services/db";
import { generateToken } from "@/app/services/auth";
import User from "@/app/services/models/User";

export async function POST(req) {
  await connectDB();

  const { email, password } = await req.json();
  const user = await User.findOne({ email });

  if (!user || user.password !== password) {
    return new Response(
      JSON.stringify({ success: false, message: "Invalid credentials" }),
      { status: 401 }
    );
  }

  // Generate a token after successful login
  const token = generateToken({ id: user._id, role: user.role }); // Adjust payload as needed

  return new Response(
    JSON.stringify({ success: true, user, token }), // Include the token in the response
    { status: 200 }
  );
}
