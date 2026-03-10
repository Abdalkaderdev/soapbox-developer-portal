import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.SOAPBOX_API_URL || "https://api.soapboxsuperapp.com/api/v1";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_URL}/oauth/developer/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: body.email }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Failed to send reset email" }));
      return NextResponse.json(
        { error: error.message || "Failed to send reset email" },
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
