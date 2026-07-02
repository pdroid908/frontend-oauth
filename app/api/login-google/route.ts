import { NextResponse } from "next/server";
export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  // JIKA TIDAK ADA CODE: User baru mau login
  if (!code) {
    return NextResponse.redirect(
      "http://oauth-go-backend-one.vercel.app/auth/google",
    );
  }

  try {
    // 1. Fetch ke Go Backend
    const response = await fetch(
      `http://oauth-go-backend-one.vercel.app/auth/google/callback?code=${code}&state=${state}`,
      {
        method: "GET",
        // Penting: agar backend bisa mengirim cookie sesi jika ada
        headers: { Accept: "application/json" },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ message: "Auth failed" }, { status: 401 });
    }

    // 2. Siapkan Redirect ke Dashboard
    const res = NextResponse.redirect(new URL("/dashboard", req.url));

    // 3. OPSI A: Jika backend memberikan token dalam JSON (seperti kode kamu sebelumnya)
    if (data.token) {
      res.cookies.set("token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 3600,
      });
    }

    // 4. OPSI B: Jika kamu ingin meneruskan 'set-cookie' dari Go secara utuh
    // (Gunakan ini jika Go yang mengatur nama cookie/path/secure-nya)
    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
      // Parse atau langsung set jika formatnya sederhana
      // Catatan: Edge Runtime memiliki limitasi dalam memanipulasi header set-cookie yang kompleks
      res.headers.set("set-cookie", setCookieHeader);
    }

    return res;
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
