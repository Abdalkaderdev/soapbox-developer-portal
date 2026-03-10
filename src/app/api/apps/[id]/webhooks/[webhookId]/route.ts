import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const API_URL = process.env.SOAPBOX_API_URL || "https://api.soapboxsuperapp.com/api/v1";

// User-friendly error messages
function getErrorMessage(status: number): string {
  const messages: Record<number, string> = {
    401: "Your session has expired. Please sign in again.",
    403: "You don't have permission to delete this webhook.",
    404: "This webhook doesn't exist or has already been deleted.",
    429: "Too many requests. Please wait a moment and try again.",
    500: "Something went wrong. Please try again later.",
  };
  return messages[status] || "Failed to delete webhook. Please try again.";
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; webhookId: string }> }
) {
  try {
    const session = await auth();
    const accessToken = (session as { accessToken?: string })?.accessToken;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Please sign in to delete this webhook" },
        { status: 401 }
      );
    }

    const { id, webhookId } = await params;

    const response = await fetch(`${API_URL}/developer/apps/${id}/webhooks/${webhookId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || getErrorMessage(response.status) },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/apps/[id]/webhooks/[webhookId] error:", error);
    return NextResponse.json(
      { error: "Unable to connect to the server. Please try again." },
      { status: 503 }
    );
  }
}
