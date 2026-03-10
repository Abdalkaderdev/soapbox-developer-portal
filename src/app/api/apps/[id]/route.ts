import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const API_URL = process.env.SOAPBOX_API_URL || "https://api.soapboxsuperapp.com/api/v1";

// User-friendly error messages
function getErrorMessage(status: number, action: string): string {
  const messages: Record<number, string> = {
    401: "Your session has expired. Please sign in again.",
    403: "You don't have permission to access this app.",
    404: "This app doesn't exist or has been deleted.",
    422: "Please check your input and try again.",
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
        { error: "Please sign in to view this app" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const response = await fetch(`${API_URL}/developer/apps/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || getErrorMessage(response.status, "load app") },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/apps/[id] error:", error);
    return NextResponse.json(
      { error: "Unable to connect to the server. Please try again." },
      { status: 503 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const accessToken = (session as { accessToken?: string })?.accessToken;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Please sign in to update this app" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const response = await fetch(`${API_URL}/developer/apps/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || getErrorMessage(response.status, "update app") },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("PATCH /api/apps/[id] error:", error);
    return NextResponse.json(
      { error: "Unable to connect to the server. Please try again." },
      { status: 503 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const accessToken = (session as { accessToken?: string })?.accessToken;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Please sign in to delete this app" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const response = await fetch(`${API_URL}/developer/apps/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || getErrorMessage(response.status, "delete app") },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/apps/[id] error:", error);
    return NextResponse.json(
      { error: "Unable to connect to the server. Please try again." },
      { status: 503 }
    );
  }
}
