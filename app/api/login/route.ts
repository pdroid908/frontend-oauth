import { NextResponse } from "next/server";
import { validateRegister } from "@/app/api/security/security";
export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username dan password wajib diisi" },
        { status: 400 },
      );
    }

    const validation = validateRegister(username, password);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.message },
        { status: 422 },
      );
    }

    const response = await fetch(
      "https://oauth-go-backend-one.vercel.app/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: validation.data.username,
          password: validation.data.password,
        }),
        credentials: "include",
      },
    );

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: result.message || "Gagal login" },
        { status: response.status },
      );
    }

    // Jika sukses, kita harus meneruskan header 'Set-Cookie' dari Go ke browser

    const finalResponse = NextResponse.json(result, { status: 200 });
    const setCookies = response.headers.getSetCookie();

    if (setCookies && setCookies.length > 0) {
      setCookies.forEach((cookie) => {
        // MODIFIKASI: Menghapus atribut 'Domain' agar browser menyimpan cookie
        // untuk domain tempat Next.js berjalan (frontend kamu)
        let modifiedCookie = cookie.replace(/Domain=[^;]+;?/i, "");

        // Pastikan SameSite=Lax atau None (None butuh Secure=true)
        // Jika masih bermasalah di beberapa browser, pastikan Secure=true
        if (!modifiedCookie.includes("SameSite=")) {
          modifiedCookie += "; SameSite=Lax";
        }

        finalResponse.headers.append("set-cookie", modifiedCookie);
      });
    }

    return finalResponse;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid Data" },
      { status: 500 },
    );
  }
}
