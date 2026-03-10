import { auth } from "./auth";

const API_URL = process.env.SOAPBOX_API_URL || "https://api.soapboxsuperapp.com/api/v1";

export async function getServerSession() {
  return await auth();
}

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
    this.name = "APIError";
  }
}

// User-friendly error messages for common scenarios
const ERROR_MESSAGES: Record<number, string> = {
  400: "Invalid request. Please check your input and try again.",
  401: "Your session has expired. Please sign in again.",
  403: "You don't have permission to perform this action.",
  404: "The requested resource was not found.",
  409: "This action conflicts with existing data.",
  422: "The provided data is invalid.",
  429: "Too many requests. Please wait a moment and try again.",
  500: "Something went wrong on our end. Please try again later.",
  502: "Service temporarily unavailable. Please try again later.",
  503: "Service temporarily unavailable. Please try again later.",
};

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const session = await getServerSession();
  const accessToken = (session as { accessToken?: string })?.accessToken;

  if (!accessToken) {
    throw new APIError("Authentication required. Please sign in.", 401, "UNAUTHORIZED");
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        ...options.headers,
      },
    });
  } catch (error) {
    // Network error
    throw new APIError(
      "Unable to connect to the server. Please check your internet connection.",
      0,
      "NETWORK_ERROR"
    );
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const userMessage =
      errorData.message ||
      ERROR_MESSAGES[response.status] ||
      `Request failed (${response.status})`;
    throw new APIError(userMessage, response.status, errorData.code);
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}

// Types
export interface App {
  id: number;
  clientId: string;
  clientSecret?: string;
  name: string;
  description: string | null;
  scopes: string[];
  redirectUris: string[];
  tier: string;
  isActive: boolean;
  requestCount?: number;
  createdAt: string;
}

export interface APIKey {
  id: number;
  key?: string;
  keyPrefix: string;
  name: string;
  permissions: string[];
  lastUsedAt: string | null;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface Webhook {
  id: number;
  url: string;
  events: string[];
  secret?: string;
  isActive: boolean;
  lastDeliveryAt: string | null;
  lastDeliveryStatus: number | null;
  failureCount: number;
  createdAt: string;
}

export interface Analytics {
  totalRequests: number;
  successRate: number;
  avgResponseTime: number;
  errorRate: number;
  requestsByDay: { date: string; count: number }[];
  topEndpoints: { endpoint: string; count: number; avgTime: number; errors: number }[];
  recentErrors: { time: string; endpoint: string; status: number; message: string }[];
}

export interface DeveloperProfile {
  id: number;
  email: string;
  name: string;
  organization: string | null;
  tier: string;
  createdAt: string;
}

// API Functions
export const api = {
  // Apps
  async getApps(): Promise<App[]> {
    const res = await apiRequest<{ data: App[] }>("/developer/apps");
    return res.data;
  },

  async getApp(id: number): Promise<App> {
    const res = await apiRequest<{ data: App }>(`/developer/apps/${id}`);
    return res.data;
  },

  async createApp(data: { name: string; description?: string; scopes: string[]; redirectUris: string[] }): Promise<App> {
    const res = await apiRequest<{ data: App }>("/developer/apps", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async updateApp(id: number, data: Partial<{ name: string; description: string; scopes: string[]; redirectUris: string[] }>): Promise<App> {
    const res = await apiRequest<{ data: App }>(`/developer/apps/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async deleteApp(id: number): Promise<void> {
    await apiRequest(`/developer/apps/${id}`, { method: "DELETE" });
  },

  async rotateSecret(id: number): Promise<{ clientSecret: string }> {
    const res = await apiRequest<{ data: { clientSecret: string } }>(`/developer/apps/${id}/rotate-secret`, {
      method: "POST",
    });
    return res.data;
  },

  // API Keys
  async getKeys(appId: number): Promise<APIKey[]> {
    const res = await apiRequest<{ data: APIKey[] }>(`/developer/apps/${appId}/keys`);
    return res.data;
  },

  async createKey(appId: number, data: { name: string; permissions: string[]; expiresAt?: string }): Promise<APIKey> {
    const res = await apiRequest<{ data: APIKey }>(`/developer/apps/${appId}/keys`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async revokeKey(appId: number, keyId: number): Promise<void> {
    await apiRequest(`/developer/apps/${appId}/keys/${keyId}`, { method: "DELETE" });
  },

  // Webhooks
  async getWebhooks(appId: number): Promise<Webhook[]> {
    const res = await apiRequest<{ data: Webhook[] }>(`/developer/apps/${appId}/webhooks`);
    return res.data;
  },

  async createWebhook(appId: number, data: { url: string; events: string[] }): Promise<Webhook> {
    const res = await apiRequest<{ data: Webhook }>(`/developer/apps/${appId}/webhooks`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async deleteWebhook(appId: number, webhookId: number): Promise<void> {
    await apiRequest(`/developer/apps/${appId}/webhooks/${webhookId}`, { method: "DELETE" });
  },

  async testWebhook(appId: number, webhookId: number): Promise<{ success: boolean; statusCode: number }> {
    const res = await apiRequest<{ data: { success: boolean; statusCode: number } }>(
      `/developer/apps/${appId}/webhooks/${webhookId}/test`,
      { method: "POST" }
    );
    return res.data;
  },

  // Analytics
  async getAnalytics(appId: number, period: string = "30d"): Promise<Analytics> {
    const res = await apiRequest<{ data: Analytics }>(`/developer/apps/${appId}/analytics?period=${period}`);
    return res.data;
  },

  // Profile
  async getProfile(): Promise<DeveloperProfile> {
    const res = await apiRequest<{ data: DeveloperProfile }>("/developer/profile");
    return res.data;
  },

  async updateProfile(data: { name?: string; organization?: string }): Promise<DeveloperProfile> {
    const res = await apiRequest<{ data: DeveloperProfile }>("/developer/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return res.data;
  },
};
