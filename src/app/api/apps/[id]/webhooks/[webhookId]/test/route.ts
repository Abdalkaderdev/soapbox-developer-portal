import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const API_URL = process.env.SOAPBOX_API_URL || "https://api.soapboxsuperapp.com/api/v1";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; webhookId: string }> }
) {
  const session = await auth();
  const accessToken = (session as { accessToken?: string })?.accessToken;

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, webhookId } = await params;

  const response = await fetch(`${API_URL}/developer/apps/${id}/webhooks/${webhookId}/test`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Failed to test webhook" }));
    return NextResponse.json({ error: error.message || "Failed to test webhook" }, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json(data);
}
