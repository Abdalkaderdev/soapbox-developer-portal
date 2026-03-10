"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Webhook,
  Plus,
  Check,
  X,
  AlertCircle,
  RefreshCw,
  Trash2,
} from "lucide-react";

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

interface App {
  id: number;
  name: string;
}

const availableEvents = [
  { category: "Events", events: ["event.created", "event.updated", "event.deleted", "event.registration"] },
  { category: "Prayers", events: ["prayer.created", "prayer.answered", "prayer.prayed"] },
  { category: "Donations", events: ["donation.completed", "donation.failed", "donation.refunded"] },
  { category: "Users", events: ["user.joined", "user.left", "user.updated"] },
  { category: "Groups", events: ["group.created", "group.member.joined", "group.member.left"] },
];

export default function WebhooksPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [webhooks, setWebhooks] = useState<WebhookData[]>([]);
  const [loading, setLoading] = useState(true);

  // New webhook form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newEvents, setNewEvents] = useState<string[]>([]);
  const [newSecret, setNewSecret] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    async function fetchApps() {
      try {
        const response = await fetch("/api/apps");
        if (response.ok) {
          const data = await response.json();
          const appsList = data.data || [];
          setApps(appsList);
          if (appsList.length > 0) {
            setSelectedApp(appsList[0].id.toString());
          }
        }
      } catch {
        console.error("Failed to fetch apps");
      } finally {
        setLoading(false);
      }
    }
    fetchApps();
  }, []);

  useEffect(() => {
    async function fetchWebhooks() {
      if (!selectedApp) return;

      try {
        const response = await fetch(`/api/apps/${selectedApp}/webhooks`);
        if (response.ok) {
          const data = await response.json();
          setWebhooks(data.data || []);
        }
      } catch {
        console.error("Failed to fetch webhooks");
      }
    }
    fetchWebhooks();
  }, [selectedApp]);

  async function handleCreateWebhook() {
    if (!selectedApp || !newUrl || newEvents.length === 0) return;

    setCreating(true);
    try {
      const response = await fetch(`/api/apps/${selectedApp}/webhooks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: newUrl, events: newEvents }),
      });

      if (response.ok) {
        const data = await response.json();
        setNewSecret(data.data.secret);
        setWebhooks([...webhooks, data.data]);
        setNewUrl("");
        setNewEvents([]);
      }
    } catch {
      console.error("Failed to create webhook");
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteWebhook(webhookId: number) {
    if (!selectedApp || !confirm("Are you sure you want to delete this webhook?")) return;

    try {
      const response = await fetch(`/api/apps/${selectedApp}/webhooks/${webhookId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setWebhooks(webhooks.filter((w) => w.id !== webhookId));
      }
    } catch {
      console.error("Failed to delete webhook");
    }
  }

  async function handleTestWebhook(webhookId: number) {
    if (!selectedApp) return;

    try {
      const response = await fetch(`/api/apps/${selectedApp}/webhooks/${webhookId}/test`, {
        method: "POST",
      });

      const data = await response.json();
      if (data.data?.success) {
        alert("Webhook test successful!");
      } else {
        alert(`Webhook test failed with status ${data.data?.statusCode || "unknown"}`);
      }
    } catch {
      alert("Failed to test webhook");
    }
  }

  if (loading) {
    return (
      <div>
        <Header title="Webhooks" description="Receive real-time notifications when events occur" />
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 rounded" />
            <div className="h-64 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Webhooks"
        description="Receive real-time notifications when events occur"
      />

      <div className="p-6 space-y-6">
        {/* App Selector */}
        {apps.length > 0 && (
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Select App:</label>
            <select
              value={selectedApp || ""}
              onChange={(e) => setSelectedApp(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              {apps.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-800">How webhooks work</p>
            <p className="text-sm text-blue-700">
              When events occur in SoapBox, we&apos;ll send an HTTP POST request to your
              endpoint with event details. Make sure your endpoint responds with a 2xx status code.
            </p>
          </div>
        </div>

        {/* New Webhook Secret Alert */}
        {newSecret && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800 mb-2">
              Webhook created! Copy the signing secret now - it won&apos;t be shown again.
            </p>
            <div className="flex items-center gap-2">
              <Input value={newSecret} readOnly className="font-mono" />
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigator.clipboard.writeText(newSecret)}
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => {
                setNewSecret(null);
                setShowCreateForm(false);
              }}
            >
              Dismiss
            </Button>
          </div>
        )}

        {/* Webhooks List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your Webhooks</CardTitle>
              <CardDescription>
                Endpoints that receive event notifications
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateForm(true)} disabled={!selectedApp}>
              <Plus className="h-4 w-4 mr-2" />
              Add Webhook
            </Button>
          </CardHeader>
          <CardContent>
            {/* Create Form */}
            {showCreateForm && !newSecret && (
              <div className="border rounded-lg p-4 mb-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Endpoint URL</label>
                  <Input
                    type="url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://myapp.com/webhooks/soapbox"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Events to subscribe</label>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                    {availableEvents.flatMap((cat) =>
                      cat.events.map((event) => (
                        <label
                          key={event}
                          className={`flex items-center gap-2 p-2 border rounded cursor-pointer text-sm ${
                            newEvents.includes(event) ? "border-primary bg-primary/5" : "hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={newEvents.includes(event)}
                            onChange={() => {
                              setNewEvents((prev) =>
                                prev.includes(event)
                                  ? prev.filter((e) => e !== event)
                                  : [...prev, event]
                              );
                            }}
                          />
                          <span className="font-mono text-xs">{event}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleCreateWebhook}
                    disabled={!newUrl || newEvents.length === 0 || creating}
                  >
                    {creating ? "Creating..." : "Create Webhook"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewUrl("");
                      setNewEvents([]);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {apps.length === 0 ? (
              <div className="text-center py-12">
                <Webhook className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="font-medium text-lg mb-2">No apps yet</h3>
                <p className="text-gray-500 mb-4">
                  Create an app first to add webhooks
                </p>
              </div>
            ) : webhooks.length > 0 ? (
              <div className="space-y-4">
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div
                          className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                            webhook.isActive && webhook.failureCount === 0
                              ? "bg-green-100"
                              : webhook.failureCount > 0
                              ? "bg-red-100"
                              : "bg-gray-100"
                          }`}
                        >
                          <Webhook
                            className={`h-5 w-5 ${
                              webhook.isActive && webhook.failureCount === 0
                                ? "text-green-600"
                                : webhook.failureCount > 0
                                ? "text-red-600"
                                : "text-gray-600"
                            }`}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <code className="text-sm font-mono">{webhook.url}</code>
                            <Badge
                              variant={
                                webhook.isActive && webhook.failureCount === 0
                                  ? "success"
                                  : webhook.failureCount > 0
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {webhook.failureCount > 0 ? "Failing" : webhook.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {webhook.events.map((event) => (
                              <Badge key={event} variant="outline" className="text-xs">
                                {event}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
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

                    <div className="mt-4 pt-4 border-t flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Last delivery:</span>
                        <span>
                          {webhook.lastDeliveryAt
                            ? new Date(webhook.lastDeliveryAt).toLocaleString()
                            : "Never"}
                        </span>
                        {webhook.lastDeliveryStatus && (
                          <>
                            {webhook.lastDeliveryStatus >= 200 && webhook.lastDeliveryStatus < 300 ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <X className="h-4 w-4 text-red-600" />
                            )}
                            <Badge
                              variant={
                                webhook.lastDeliveryStatus >= 200 && webhook.lastDeliveryStatus < 300
                                  ? "success"
                                  : "destructive"
                              }
                            >
                              {webhook.lastDeliveryStatus}
                            </Badge>
                          </>
                        )}
                      </div>
                      {webhook.failureCount > 0 && (
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertCircle className="h-4 w-4" />
                          <span>{webhook.failureCount} consecutive failures</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : !showCreateForm ? (
              <div className="text-center py-12">
                <Webhook className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="font-medium text-lg mb-2">No webhooks configured</h3>
                <p className="text-gray-500 mb-4">
                  Add a webhook endpoint to receive real-time event notifications
                </p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Webhook
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Available Events */}
        <Card>
          <CardHeader>
            <CardTitle>Available Events</CardTitle>
            <CardDescription>
              Events you can subscribe to with webhooks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableEvents.map((category) => (
                <div key={category.category} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">{category.category}</h4>
                  <div className="space-y-1">
                    {category.events.map((event) => (
                      <code key={event} className="text-xs block text-gray-600">
                        {event}
                      </code>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
