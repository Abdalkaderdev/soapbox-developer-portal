import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.SOAPBOX_API_URL || "https://api.soapboxsuperapp.com/api/v1";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const response = await fetch(`${API_URL}/oauth/developer/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Registration failed" }));
    return NextResponse.json(
      { error: error.message || "Registration failed" },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}
