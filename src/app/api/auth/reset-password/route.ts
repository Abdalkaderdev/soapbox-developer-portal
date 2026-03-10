import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.SOAPBOX_API_URL || "https://api.soapboxsuperapp.com/api/v1";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.token) {
      return NextResponse.json(
        { error: "Reset token is required" },
        { status: 400 }
      );
    }

    if (!body.password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    if (body.password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_URL}/oauth/developer/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: body.token,
        password: body.password,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Failed to reset password" }));
      return NextResponse.json(
        { error: error.message || "Failed to reset password" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
