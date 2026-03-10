"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Key,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle,
  Check,
  ExternalLink,
} from "lucide-react";
import { formatDate, copyToClipboard } from "@/lib/utils";

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
  appId?: number;
  appName?: string;
}

interface App {
  id: number;
  name: string;
}

export default function ApiKeysPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [keys, setKeys] = useState<APIKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<number>>(new Set());
  const [copiedKey, setCopiedKey] = useState<number | null>(null);

  // New key form
  const [showNewKeyForm, setShowNewKeyForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>([]);
  const [newKeyAppId, setNewKeyAppId] = useState<string>("");
  const [newKey, setNewKey] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const availablePermissions = [
    "read:churches", "write:churches",
    "read:users", "write:users",
    "read:events", "write:events",
    "read:groups", "write:groups",
    "read:donations",
    "read:prayers", "write:prayers",
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const appsRes = await fetch("/api/apps");
        if (appsRes.ok) {
          const appsData = await appsRes.json();
          const appsList = appsData.data || [];
          setApps(appsList);

          // Fetch keys for all apps
          const allKeys: APIKey[] = [];
          for (const app of appsList) {
            try {
              const keysRes = await fetch(`/api/apps/${app.id}/keys`);
              if (keysRes.ok) {
                const keysData = await keysRes.json();
                const appKeys = (keysData.data || []).map((key: APIKey) => ({
                  ...key,
                  appId: app.id,
                  appName: app.name,
                }));
                allKeys.push(...appKeys);
              }
            } catch {
              // Ignore individual app failures
            }
          }
          setKeys(allKeys);

          if (appsList.length > 0) {
            setNewKeyAppId(appsList[0].id.toString());
          }
        }
      } catch {
        console.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredKeys = selectedApp
    ? keys.filter((k) => k.appId?.toString() === selectedApp)
    : keys;

  const toggleKeyVisibility = (keyId: number) => {
    setVisibleKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const handleCopy = async (key: string, keyId: number) => {
    await copyToClipboard(key);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  async function handleCreateKey() {
    if (!newKeyAppId || !newKeyName) return;

    setCreating(true);
    try {
      const response = await fetch(`/api/apps/${newKeyAppId}/keys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newKeyName,
          permissions: newKeyPermissions,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const appName = apps.find((a) => a.id.toString() === newKeyAppId)?.name;
        setNewKey(data.data.key);
        setKeys([...keys, { ...data.data, appId: parseInt(newKeyAppId), appName }]);
        setNewKeyName("");
        setNewKeyPermissions([]);
      }
    } catch {
      console.error("Failed to create key");
    } finally {
      setCreating(false);
    }
  }

  async function handleRevokeKey(appId: number, keyId: number) {
    if (!confirm("Are you sure you want to revoke this API key? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/apps/${appId}/keys/${keyId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setKeys(keys.filter((k) => k.id !== keyId));
      }
    } catch {
      console.error("Failed to revoke key");
    }
  }

  if (loading) {
    return (
      <div>
        <Header title="API Keys" description="Manage API keys for server-to-server authentication" />
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-64 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title="API Keys"
        description="Manage API keys for server-to-server authentication"
      />

      <div className="p-6 space-y-6">
        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800">Keep your API keys secure</p>
            <p className="text-sm text-yellow-700">
              Never expose API keys in client-side code or public repositories.
              Use environment variables to store keys securely.
            </p>
          </div>
        </div>

        {/* New Key Secret Alert */}
        {newKey && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800 mb-2">
              API key created! Copy it now - it won&apos;t be shown again.
            </p>
            <div className="flex items-center gap-2">
              <Input value={newKey} readOnly className="font-mono" />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(newKey)}
              >
                <Check className="h-4 w-4" />
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

        {/* API Keys */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your API Keys</CardTitle>
              <CardDescription>
                API keys allow server-to-server authentication without user interaction
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {apps.length > 1 && (
                <select
                  value={selectedApp || ""}
                  onChange={(e) => setSelectedApp(e.target.value || null)}
                  className="px-3 py-2 border rounded-md text-sm"
                >
                  <option value="">All Apps</option>
                  {apps.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.name}
                    </option>
                  ))}
                </select>
              )}
              <Button onClick={() => setShowNewKeyForm(true)} disabled={apps.length === 0}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Key
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Create Form */}
            {showNewKeyForm && !newKey && (
              <div className="border rounded-lg p-4 mb-4 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">App</label>
                    <select
                      value={newKeyAppId}
                      onChange={(e) => setNewKeyAppId(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-sm"
                    >
                      {apps.map((app) => (
                        <option key={app.id} value={app.id}>
                          {app.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Key Name</label>
                    <Input
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="e.g., Production Server"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Permissions</label>
                  <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {availablePermissions.map((perm) => (
                      <label
                        key={perm}
                        className={`flex items-center gap-2 p-2 border rounded cursor-pointer text-sm ${
                          newKeyPermissions.includes(perm) ? "border-primary bg-primary/5" : "hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={newKeyPermissions.includes(perm)}
                          onChange={() => {
                            setNewKeyPermissions((prev) =>
                              prev.includes(perm)
                                ? prev.filter((p) => p !== perm)
                                : [...prev, perm]
                            );
                          }}
                        />
                        <span>{perm}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateKey} disabled={!newKeyName || creating}>
                    {creating ? "Creating..." : "Create Key"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowNewKeyForm(false);
                      setNewKeyName("");
                      setNewKeyPermissions([]);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {apps.length === 0 ? (
              <div className="text-center py-12">
                <Key className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="font-medium text-lg mb-2">No apps yet</h3>
                <p className="text-gray-500 mb-4">
                  Create an app first to generate API keys
                </p>
                <Link href="/apps/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create App
                  </Button>
                </Link>
              </div>
            ) : filteredKeys.length > 0 ? (
              <div className="space-y-4">
                {filteredKeys.map((apiKey) => (
                  <div
                    key={apiKey.id}
                    className={`p-4 border rounded-lg ${
                      !apiKey.isActive ? "bg-gray-50 opacity-75" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Key className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{apiKey.name}</p>
                            <Badge variant={apiKey.isActive ? "success" : "secondary"}>
                              {apiKey.isActive ? "Active" : "Revoked"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>App: {apiKey.appName}</span>
                            <Link
                              href={`/apps/${apiKey.appId}`}
                              className="text-orange-600 hover:text-orange-700"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                        >
                          {visibleKeys.has(apiKey.id) ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(apiKey.keyPrefix + "...", apiKey.id)}
                        >
                          {copiedKey === apiKey.id ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                          onClick={() => apiKey.appId && handleRevokeKey(apiKey.appId, apiKey.id)}
                          disabled={!apiKey.isActive}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="mt-3">
                      <code className="text-sm bg-gray-100 px-3 py-2 rounded-md block font-mono">
                        {visibleKeys.has(apiKey.id)
                          ? apiKey.key || apiKey.keyPrefix + "..."
                          : apiKey.keyPrefix + "••••••••••••••••••••"}
                      </code>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1">
                      {apiKey.permissions?.slice(0, 4).map((perm) => (
                        <Badge key={perm} variant="outline" className="text-xs">
                          {perm}
                        </Badge>
                      ))}
                      {apiKey.permissions && apiKey.permissions.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{apiKey.permissions.length - 4}
                        </Badge>
                      )}
                    </div>

                    <div className="mt-3 flex items-center gap-6 text-sm text-gray-500">
                      <span>Created: {formatDate(apiKey.createdAt)}</span>
                      <span>
                        Last used:{" "}
                        {apiKey.lastUsedAt ? formatDate(apiKey.lastUsedAt) : "Never"}
                      </span>
                      {apiKey.expiresAt && (
                        <span>Expires: {formatDate(apiKey.expiresAt)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : !showNewKeyForm ? (
              <div className="text-center py-12">
                <Key className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="font-medium text-lg mb-2">No API keys yet</h3>
                <p className="text-gray-500 mb-4">
                  Create an API key to authenticate your server-side applications
                </p>
                <Button onClick={() => setShowNewKeyForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create API Key
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Usage Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Using API Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Include your API key in requests using one of these methods:
            </p>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-sm mb-2">Authorization Header (Recommended)</p>
                <code className="text-sm bg-gray-900 text-gray-100 px-4 py-3 rounded-md block overflow-x-auto">
                  Authorization: Bearer sb_live_your_api_key_here
                </code>
              </div>
              <div>
                <p className="font-medium text-sm mb-2">X-API-Key Header</p>
                <code className="text-sm bg-gray-900 text-gray-100 px-4 py-3 rounded-md block overflow-x-auto">
                  X-API-Key: sb_live_your_api_key_here
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
