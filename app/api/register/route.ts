import { NextRequest, NextResponse } from "next/server";
import validator from "validator";
export const runtime = "edge";
import { sanitize, validateRegister } from "@/app/api/security/security";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const username = sanitize(body.username ?? "");
    const email = sanitize(body.email ?? "").toLowerCase();
    const password = body.password ?? "";

    if (!validator.isEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Email tidak valid",
        },
        { status: 400 },
      );
    }

    const result = validateRegister(username, password);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        { status: 400 },
      );
    }

    const response = await fetch(
      "https://localhost:8080/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: result.data.username,
          email,
          password: result.data.password,
        }),
        cache: "no-store",
      },
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
