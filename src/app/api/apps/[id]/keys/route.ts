import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const API_URL = process.env.SOAPBOX_API_URL || "https://api.soapboxsuperapp.com/api/v1";

// User-friendly error messages
function getErrorMessage(status: number, action: string): string {
  const messages: Record<number, string> = {
    401: "Your session has expired. Please sign in again.",
    403: "You don't have permission to manage API keys for this app.",
    404: "This app doesn't exist or has been deleted.",
    422: "Please provide a valid key name and permissions.",
    429: "Too many requests. Please wait a moment and try again.",
    500: "Something went wrong. Please try again later.",
  };
  return messages[status] || `Failed to ${action}. Please try again.`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const accessToken = (session as { accessToken?: string })?.accessToken;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Please sign in to view API keys" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const response = await fetch(`${API_URL}/developer/apps/${id}/keys`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || getErrorMessage(response.status, "load API keys") },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/apps/[id]/keys error:", error);
    return NextResponse.json(
      { error: "Unable to connect to the server. Please try again." },
      { status: 503 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const accessToken = (session as { accessToken?: string })?.accessToken;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Please sign in to create an API key" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const response = await fetch(`${API_URL}/developer/apps/${id}/keys`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || getErrorMessage(response.status, "create API key") },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("POST /api/apps/[id]/keys error:", error);
    return NextResponse.json(
      { error: "Unable to connect to the server. Please try again." },
      { status: 503 }
    );
  }
}
