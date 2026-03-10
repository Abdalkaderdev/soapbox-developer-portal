const API_BASE_URL = process.env.SOAPBOX_API_URL || "https://api.soapboxsuperapp.com/api/v1";

export class APIClient {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.accessToken}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new APIError(error.message || "Request failed", response.status);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  // OAuth Clients (Apps)
  async listApps(): Promise<{ data: App[] }> {
    return this.request("GET", "/developer/apps");
  }

  async getApp(id: number): Promise<{ data: App }> {
    return this.request("GET", `/developer/apps/${id}`);
  }

  async createApp(data: CreateAppRequest): Promise<{ data: App }> {
    return this.request("POST", "/developer/apps", data);
  }

  async updateApp(id: number, data: Partial<CreateAppRequest>): Promise<{ data: App }> {
    return this.request("PATCH", `/developer/apps/${id}`, data);
  }

  async deleteApp(id: number): Promise<void> {
    return this.request("DELETE", `/developer/apps/${id}`);
  }

  async rotateAppSecret(id: number): Promise<{ data: { clientSecret: string } }> {
    return this.request("POST", `/developer/apps/${id}/rotate-secret`);
  }

  // API Keys
  async listKeys(appId: number): Promise<{ data: APIKey[] }> {
    return this.request("GET", `/developer/apps/${appId}/keys`);
  }

  async createKey(appId: number, data: CreateKeyRequest): Promise<{ data: APIKey & { key: string } }> {
    return this.request("POST", `/developer/apps/${appId}/keys`, data);
  }

  async revokeKey(appId: number, keyId: number): Promise<void> {
    return this.request("DELETE", `/developer/apps/${appId}/keys/${keyId}`);
  }

  // Webhooks
  async listWebhooks(appId: number): Promise<{ data: Webhook[] }> {
    return this.request("GET", `/developer/apps/${appId}/webhooks`);
  }

  async createWebhook(appId: number, data: CreateWebhookRequest): Promise<{ data: Webhook }> {
    return this.request("POST", `/developer/apps/${appId}/webhooks`, data);
  }

  async updateWebhook(appId: number, webhookId: number, data: Partial<CreateWebhookRequest>): Promise<{ data: Webhook }> {
    return this.request("PATCH", `/developer/apps/${appId}/webhooks/${webhookId}`, data);
  }

  async deleteWebhook(appId: number, webhookId: number): Promise<void> {
    return this.request("DELETE", `/developer/apps/${appId}/webhooks/${webhookId}`);
  }

  async testWebhook(appId: number, webhookId: number): Promise<{ data: { success: boolean; statusCode: number } }> {
    return this.request("POST", `/developer/apps/${appId}/webhooks/${webhookId}/test`);
  }

  // Analytics
  async getAnalytics(appId: number, params?: AnalyticsParams): Promise<{ data: Analytics }> {
    const query = params ? `?${new URLSearchParams(params as Record<string, string>)}` : "";
    return this.request("GET", `/developer/apps/${appId}/analytics${query}`);
  }

  // Developer Profile
  async getProfile(): Promise<{ data: DeveloperProfile }> {
    return this.request("GET", "/developer/profile");
  }

  async updateProfile(data: UpdateProfileRequest): Promise<{ data: DeveloperProfile }> {
    return this.request("PATCH", "/developer/profile", data);
  }
}

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = "APIError";
  }
}

// Types
export interface App {
  id: number;
  clientId: string;
  name: string;
  description: string | null;
  scopes: string[];
  redirectUris: string[];
  tier: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppRequest {
  name: string;
  description?: string;
  scopes: string[];
  redirectUris: string[];
}

export interface APIKey {
  id: number;
  keyPrefix: string;
  name: string;
  permissions: string[];
  lastUsedAt: string | null;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface CreateKeyRequest {
  name: string;
  permissions: string[];
  expiresAt?: string;
}

export interface Webhook {
  id: number;
  url: string;
  events: string[];
  isActive: boolean;
  secret: string;
  lastDeliveryAt: string | null;
  lastDeliveryStatus: number | null;
  failureCount: number;
  createdAt: string;
}

export interface CreateWebhookRequest {
  url: string;
  events: string[];
}

export interface Analytics {
  totalRequests: number;
  successRate: number;
  avgResponseTime: number;
  errorRate: number;
  requestsByEndpoint: { endpoint: string; count: number; avgTime: number }[];
  requestsByDay: { date: string; count: number }[];
  errorsByType: { type: string; count: number }[];
}

export interface AnalyticsParams {
  startDate?: string;
  endDate?: string;
  period?: "day" | "week" | "month";
}

export interface DeveloperProfile {
  id: number;
  email: string;
  name: string;
  organization: string | null;
  tier: string;
  createdAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  organization?: string;
}
