"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  Plus,
  Trash2,
  Key,
  Webhook,
  BarChart3,
  Settings,
  AlertTriangle,
  Check,
  X,
} from "lucide-react";

interface App {
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

interface APIKey {
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

interface WebhookData {
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

const availableScopes = [
  { id: "read:churches", name: "Read Churches" },
  { id: "write:churches", name: "Write Churches" },
  { id: "read:users", name: "Read Users" },
  { id: "write:users", name: "Write Users" },
  { id: "read:events", name: "Read Events" },
  { id: "write:events", name: "Write Events" },
  { id: "read:groups", name: "Read Groups" },
  { id: "write:groups", name: "Write Groups" },
  { id: "read:donations", name: "Read Donations" },
  { id: "read:prayers", name: "Read Prayers" },
  { id: "write:prayers", name: "Write Prayers" },
];

export default function AppDetailPage() {
  const params = useParams();
  const router = useRouter();
  const appId = params.id as string;

  const [app, setApp] = useState<App | null>(null);
  const [keys, setKeys] = useState<APIKey[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSecret, setShowSecret] = useState(false);
  const [showNewSecret, setShowNewSecret] = useState<string | null>(null);
  const [rotatingSecret, setRotatingSecret] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Edit mode states
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editScopes, setEditScopes] = useState<string[]>([]);
  const [editRedirectUri, setEditRedirectUri] = useState("");
  const [editRedirectUris, setEditRedirectUris] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // New API key form
  const [showNewKeyForm, setShowNewKeyForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>([]);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [creatingKey, setCreatingKey] = useState(false);

  // New webhook form
  const [showNewWebhookForm, setShowNewWebhookForm] = useState(false);
  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  const [newWebhookEvents, setNewWebhookEvents] = useState<string[]>([]);
  const [newWebhookSecret, setNewWebhookSecret] = useState<string | null>(null);
  const [creatingWebhook, setCreatingWebhook] = useState(false);

  useEffect(() => {
    fetchAppData();
  }, [appId]);

  async function fetchAppData() {
    try {
      const [appRes, keysRes, webhooksRes] = await Promise.all([
        fetch(`/api/apps/${appId}`),
        fetch(`/api/apps/${appId}/keys`),
        fetch(`/api/apps/${appId}/webhooks`),
      ]);

      if (!appRes.ok) {
        if (appRes.status === 404) {
          router.push("/apps");
          return;
        }
        throw new Error("Failed to load app");
      }

      const appData = await appRes.json();
      setApp(appData.data);
      setEditName(appData.data.name);
      setEditDescription(appData.data.description || "");
      setEditScopes(appData.data.scopes || []);
      setEditRedirectUris(appData.data.redirectUris || []);

      if (keysRes.ok) {
        const keysData = await keysRes.json();
        setKeys(keysData.data || []);
      }

      if (webhooksRes.ok) {
        const webhooksData = await webhooksRes.json();
        setWebhooks(webhooksData.data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load app");
    } finally {
      setLoading(false);
    }
  }

  async function handleRotateSecret() {
    if (!confirm("Are you sure you want to rotate the client secret? The old secret will stop working immediately.")) {
      return;
    }

    setRotatingSecret(true);
    try {
      const response = await fetch(`/api/apps/${appId}/rotate-secret`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to rotate secret");
      }

      const data = await response.json();
      setShowNewSecret(data.data.clientSecret);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to rotate secret");
    } finally {
      setRotatingSecret(false);
    }
  }

  async function handleSaveChanges() {
    setSaving(true);
    try {
      const response = await fetch(`/api/apps/${appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          description: editDescription || null,
          scopes: editScopes,
          redirectUris: editRedirectUris,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update app");
      }

      const data = await response.json();
      setApp(data.data);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update app");
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateKey() {
    setCreatingKey(true);
    try {
      const response = await fetch(`/api/apps/${appId}/keys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newKeyName,
          permissions: newKeyPermissions,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create API key");
      }

      const data = await response.json();
      setNewKey(data.data.key);
      setKeys([...keys, data.data]);
      setNewKeyName("");
      setNewKeyPermissions([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create API key");
    } finally {
      setCreatingKey(false);
    }
  }

  async function handleRevokeKey(keyId: number) {
    if (!confirm("Are you sure you want to revoke this API key? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/apps/${appId}/keys/${keyId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to revoke key");
      }

      setKeys(keys.filter(k => k.id !== keyId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to revoke key");
    }
  }

  async function handleCreateWebhook() {
    setCreatingWebhook(true);
    try {
      const response = await fetch(`/api/apps/${appId}/webhooks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: newWebhookUrl,
          events: newWebhookEvents,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create webhook");
      }

      const data = await response.json();
      setNewWebhookSecret(data.data.secret);
      setWebhooks([...webhooks, data.data]);
      setNewWebhookUrl("");
      setNewWebhookEvents([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create webhook");
    } finally {
      setCreatingWebhook(false);
    }
  }

  async function handleDeleteWebhook(webhookId: number) {
    if (!confirm("Are you sure you want to delete this webhook?")) {
      return;
    }

    try {
      const response = await fetch(`/api/apps/${appId}/webhooks/${webhookId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete webhook");
      }

      setWebhooks(webhooks.filter(w => w.id !== webhookId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete webhook");
    }
  }

  async function handleTestWebhook(webhookId: number) {
    try {
      const response = await fetch(`/api/apps/${appId}/webhooks/${webhookId}/test`, {
        method: "POST",
      });

      const data = await response.json();
      if (data.data.success) {
        alert("Webhook test successful!");
      } else {
        alert(`Webhook test failed with status ${data.data.statusCode}`);
      }
    } catch {
      alert("Failed to test webhook");
    }
  }

  async function handleDeleteApp() {
    if (!confirm(`Are you sure you want to delete "${app?.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/apps/${appId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete app");
      }

      router.push("/apps");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete app");
    }
  }

  function copyToClipboard(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  function addRedirectUri() {
    if (editRedirectUri && !editRedirectUris.includes(editRedirectUri)) {
      setEditRedirectUris([...editRedirectUris, editRedirectUri]);
      setEditRedirectUri("");
    }
  }

  if (loading) {
    return (
      <div>
        <Header title="Loading..." description="" />
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-48" />
            <div className="h-32 bg-gray-200 rounded" />
            <div className="h-32 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div>
        <Header title="App Not Found" description="" />
        <div className="p-6">
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500 mb-4">This app does not exist or you don&apos;t have access to it.</p>
              <Link href="/apps">
                <Button>Back to Apps</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title={app.name}
        description={app.description || "No description"}
      />

      <div className="p-6 space-y-6">
        <Link href="/apps" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Apps
        </Link>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            {error}
            <button onClick={() => setError(null)} className="ml-auto">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Credentials Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              OAuth Credentials
            </CardTitle>
            <CardDescription>
              Use these credentials to authenticate with the SoapBox API
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Client ID</label>
              <div className="flex items-center gap-2">
                <Input value={app.clientId} readOnly className="font-mono" />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(app.clientId, "clientId")}
                >
                  {copied === "clientId" ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Client Secret</label>
              {showNewSecret ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 mb-2">
                    New secret generated. Copy it now - it won&apos;t be shown again.
                  </p>
                  <div className="flex items-center gap-2">
                    <Input value={showNewSecret} readOnly className="font-mono" />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(showNewSecret, "newSecret")}
                    >
                      {copied === "newSecret" ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => setShowNewSecret(null)}
                  >
                    Dismiss
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    value={showSecret && app.clientSecret ? app.clientSecret : "••••••••••••••••••••••••"}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowSecret(!showSecret)}
                  >
                    {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleRotateSecret}
                    disabled={rotatingSecret}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${rotatingSecret ? "animate-spin" : ""}`} />
                    Rotate
                  </Button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Redirect URIs</label>
              <div className="flex flex-wrap gap-2">
                {app.redirectUris?.map((uri) => (
                  <Badge key={uri} variant="secondary" className="font-mono text-xs">
                    {uri}
                  </Badge>
                ))}
                {(!app.redirectUris || app.redirectUris.length === 0) && (
                  <span className="text-sm text-gray-500">No redirect URIs configured</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* App Details Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                App Details
              </CardTitle>
              <CardDescription>
                Configure your application settings
              </CardDescription>
            </div>
            {!editing && (
              <Button variant="outline" onClick={() => setEditing(true)}>
                Edit
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full h-24 px-3 py-2 border rounded-md text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Redirect URIs</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      type="url"
                      value={editRedirectUri}
                      onChange={(e) => setEditRedirectUri(e.target.value)}
                      placeholder="https://myapp.com/callback"
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRedirectUri())}
                    />
                    <Button type="button" onClick={addRedirectUri} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {editRedirectUris.map((uri) => (
                      <Badge key={uri} variant="secondary" className="pr-1">
                        {uri}
                        <button
                          onClick={() => setEditRedirectUris(editRedirectUris.filter(u => u !== uri))}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Scopes</label>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {availableScopes.map((scope) => (
                      <label
                        key={scope.id}
                        className={`flex items-center gap-2 p-2 border rounded cursor-pointer ${
                          editScopes.includes(scope.id) ? "border-primary bg-primary/5" : "hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={editScopes.includes(scope.id)}
                          onChange={() => {
                            setEditScopes(prev =>
                              prev.includes(scope.id)
                                ? prev.filter(s => s !== scope.id)
                                : [...prev, scope.id]
                            );
                          }}
                        />
                        <span className="text-sm">{scope.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSaveChanges} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setEditing(false);
                    setEditName(app.name);
                    setEditDescription(app.description || "");
                    setEditScopes(app.scopes || []);
                    setEditRedirectUris(app.redirectUris || []);
                  }}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <Badge variant={app.isActive ? "success" : "secondary"}>
                      {app.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tier</p>
                    <p className="font-medium">{app.tier}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-medium">{new Date(app.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Requests (30d)</p>
                    <p className="font-medium">{(app.requestCount || 0).toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Scopes</p>
                  <div className="flex flex-wrap gap-2">
                    {app.scopes?.map((scope) => (
                      <Badge key={scope} variant="outline">{scope}</Badge>
                    ))}
                    {(!app.scopes || app.scopes.length === 0) && (
                      <span className="text-sm text-gray-500">No scopes configured</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* API Keys Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Keys
              </CardTitle>
              <CardDescription>
                Server-side API keys for backend integrations
              </CardDescription>
            </div>
            <Button onClick={() => setShowNewKeyForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Key
            </Button>
          </CardHeader>
          <CardContent>
            {newKey && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-green-800 mb-2">
                  API key created. Copy it now - it won&apos;t be shown again.
                </p>
                <div className="flex items-center gap-2">
                  <Input value={newKey} readOnly className="font-mono" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(newKey, "newKey")}
                  >
                    {copied === "newKey" ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    setNewKey(null);
                    setShowNewKeyForm(false);
                  }}
                >
                  Dismiss
                </Button>
              </div>
            )}

            {showNewKeyForm && !newKey && (
              <div className="border rounded-lg p-4 mb-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Key Name</label>
                  <Input
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g., Production Server"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Permissions</label>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {availableScopes.map((scope) => (
                      <label
                        key={scope.id}
                        className={`flex items-center gap-2 p-2 border rounded cursor-pointer ${
                          newKeyPermissions.includes(scope.id) ? "border-primary bg-primary/5" : "hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={newKeyPermissions.includes(scope.id)}
                          onChange={() => {
                            setNewKeyPermissions(prev =>
                              prev.includes(scope.id)
                                ? prev.filter(s => s !== scope.id)
                                : [...prev, scope.id]
                            );
                          }}
                        />
                        <span className="text-sm">{scope.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateKey} disabled={!newKeyName || creatingKey}>
                    {creatingKey ? "Creating..." : "Create Key"}
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setShowNewKeyForm(false);
                    setNewKeyName("");
                    setNewKeyPermissions([]);
                  }}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {keys.length > 0 ? (
              <div className="space-y-3">
                {keys.map((key) => (
                  <div key={key.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{key.name}</p>
                        <Badge variant={key.isActive ? "success" : "secondary"}>
                          {key.isActive ? "Active" : "Revoked"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 font-mono">{key.keyPrefix}...</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {key.permissions?.slice(0, 3).map((perm) => (
                          <Badge key={perm} variant="outline" className="text-xs">{perm}</Badge>
                        ))}
                        {key.permissions?.length > 3 && (
                          <Badge variant="outline" className="text-xs">+{key.permissions.length - 3}</Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600"
                      onClick={() => handleRevokeKey(key.id)}
                      disabled={!key.isActive}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : !showNewKeyForm && (
              <div className="text-center py-8">
                <Key className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">No API keys yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Webhooks Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Webhooks
              </CardTitle>
              <CardDescription>
                Receive real-time event notifications
              </CardDescription>
            </div>
            <Button onClick={() => setShowNewWebhookForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Webhook
            </Button>
          </CardHeader>
          <CardContent>
            {newWebhookSecret && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-green-800 mb-2">
                  Webhook created. Copy the signing secret now - it won&apos;t be shown again.
                </p>
                <div className="flex items-center gap-2">
                  <Input value={newWebhookSecret} readOnly className="font-mono" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(newWebhookSecret, "webhookSecret")}
                  >
                    {copied === "webhookSecret" ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    setNewWebhookSecret(null);
                    setShowNewWebhookForm(false);
                  }}
                >
                  Dismiss
                </Button>
              </div>
            )}

            {showNewWebhookForm && !newWebhookSecret && (
              <div className="border rounded-lg p-4 mb-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Endpoint URL</label>
                  <Input
                    type="url"
                    value={newWebhookUrl}
                    onChange={(e) => setNewWebhookUrl(e.target.value)}
                    placeholder="https://myapp.com/webhooks/soapbox"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Events</label>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {["event.created", "event.updated", "prayer.created", "prayer.answered", "donation.completed", "user.joined", "group.created"].map((event) => (
                      <label
                        key={event}
                        className={`flex items-center gap-2 p-2 border rounded cursor-pointer ${
                          newWebhookEvents.includes(event) ? "border-primary bg-primary/5" : "hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={newWebhookEvents.includes(event)}
                          onChange={() => {
                            setNewWebhookEvents(prev =>
                              prev.includes(event)
                                ? prev.filter(e => e !== event)
                                : [...prev, event]
                            );
                          }}
                        />
                        <span className="text-sm font-mono">{event}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateWebhook} disabled={!newWebhookUrl || newWebhookEvents.length === 0 || creatingWebhook}>
                    {creatingWebhook ? "Creating..." : "Create Webhook"}
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setShowNewWebhookForm(false);
                    setNewWebhookUrl("");
                    setNewWebhookEvents([]);
                  }}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {webhooks.length > 0 ? (
              <div className="space-y-3">
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <code className="text-sm">{webhook.url}</code>
                          <Badge variant={webhook.isActive ? "success" : "secondary"}>
                            {webhook.isActive ? "Active" : "Inactive"}
                          </Badge>
                          {webhook.failureCount > 0 && (
                            <Badge variant="destructive">{webhook.failureCount} failures</Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {webhook.events.map((event) => (
                            <Badge key={event} variant="outline" className="text-xs">{event}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTestWebhook(webhook.id)}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                          onClick={() => handleDeleteWebhook(webhook.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : !showNewWebhookForm && (
              <div className="text-center py-8">
                <Webhook className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">No webhooks configured</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Link href={`/analytics?app=${appId}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium">View Analytics</p>
                  <p className="text-sm text-gray-500">See usage statistics</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/docs/api-reference">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Settings className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">API Reference</p>
                  <p className="text-sm text-gray-500">View documentation</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div>
                <p className="font-medium">Delete this app</p>
                <p className="text-sm text-gray-500">
                  Permanently delete this application and all its data
                </p>
              </div>
              <Button variant="destructive" onClick={handleDeleteApp}>
                Delete App
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
