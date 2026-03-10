import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const API_URL = process.env.SOAPBOX_API_URL || "https://api.soapboxsuperapp.com/api/v1";

// User-friendly error messages
function getErrorMessage(status: number): string {
  const messages: Record<number, string> = {
    401: "Your session has expired. Please sign in again.",
    403: "You don't have permission to test this webhook.",
    404: "This webhook doesn't exist or has been deleted.",
    429: "Too many requests. Please wait a moment and try again.",
    500: "Something went wrong. Please try again later.",
    502: "Could not reach the webhook endpoint.",
    504: "The webhook endpoint timed out.",
  };
  return messages[status] || "Failed to test webhook. Please try again.";
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; webhookId: string }> }
) {
  try {
    const session = await auth();
    const accessToken = (session as { accessToken?: string })?.accessToken;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Please sign in to test this webhook" },
        { status: 401 }
      );
    }

    const { id, webhookId } = await params;

    const response = await fetch(`${API_URL}/developer/apps/${id}/webhooks/${webhookId}/test`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || getErrorMessage(response.status) },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("POST /api/apps/[id]/webhooks/[webhookId]/test error:", error);
    return NextResponse.json(
      { error: "Unable to connect to the server. Please try again." },
      { status: 503 }
    );
  }
}
