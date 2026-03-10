import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.SOAPBOX_API_URL || "https://api.soapboxsuperapp.com/api/v1";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and verification code are required" },
        { status: 400 }
      );
    }

    // Validate code format (6 digits)
    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: "Invalid verification code format" },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_URL}/oauth/developer/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Verification failed" }));
      return NextResponse.json(
        { error: error.message || "Verification failed. Please check your code and try again." },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
