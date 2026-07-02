import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }

  // Arahkan ke dashboard
  const res = NextResponse.redirect(new URL("/konten-utama/dashboard", req.url));

  // Set cookie di domain Next.js (netizencom.pages.dev)
  res.cookies.set("token", token, {
    httpOnly: true,
    secure: true, // Pastikan true karena sudah HTTPS
    sameSite: "lax",
    maxAge: 3600, // Sesuaikan dengan durasi JWT Anda
    path: "/",
  });

  return res;
}