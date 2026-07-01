import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  // JIKA TIDAK ADA CODE: User baru mau login, arahkan ke Go
  if (!code) {
    return NextResponse.redirect("http://localhost:8080/auth/google");
  }

  // JIKA ADA CODE: Ini adalah callback dari Google yang diteruskan oleh Go
  // Kita fetch ke Go untuk verifikasi dan mendapatkan token
  try {
    const response = await fetch(
      `http://localhost:8080/auth/google/callback?code=${code}&state=${state}`,
      { method: "GET" }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ message: "Auth failed" }, { status: 401 });
    }

    // Set token ke cookie (Go memberikan token, Next.js menyimpan di cookie)
    const res = NextResponse.redirect(new URL("/dashboard", req.url));
    res.cookies.set("token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600,
    });

    return res;
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}