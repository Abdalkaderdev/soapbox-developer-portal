"use client";

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
  Eye,
} from "lucide-react";
import { useState } from "react";

const webhooks = [
  {
    id: "1",
    url: "https://myapp.com/webhooks/soapbox",
    events: ["event.created", "event.updated", "prayer.created"],
    status: "active",
    lastDelivery: "2 minutes ago",
    lastStatus: 200,
    failureCount: 0,
  },
  {
    id: "2",
    url: "https://staging.myapp.com/webhooks",
    events: ["donation.completed", "user.joined"],
    status: "failing",
    lastDelivery: "1 hour ago",
    lastStatus: 500,
    failureCount: 3,
  },
];

const availableEvents = [
  { category: "Events", events: ["event.created", "event.updated", "event.deleted", "event.registration"] },
  { category: "Prayers", events: ["prayer.created", "prayer.answered", "prayer.prayed"] },
  { category: "Donations", events: ["donation.completed", "donation.failed", "donation.refunded"] },
  { category: "Users", events: ["user.joined", "user.left", "user.updated"] },
  { category: "Groups", events: ["group.created", "group.member.joined", "group.member.left"] },
];

export default function WebhooksPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div>
      <Header
        title="Webhooks"
        description="Receive real-time notifications when events occur"
      />

      <div className="p-6 space-y-6">
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

        {/* Webhooks List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your Webhooks</CardTitle>
              <CardDescription>
                Endpoints that receive event notifications
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Webhook
            </Button>
          </CardHeader>
          <CardContent>
            {webhooks.length > 0 ? (
              <div className="space-y-4">
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div
                          className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                            webhook.status === "active"
                              ? "bg-green-100"
                              : "bg-red-100"
                          }`}
                        >
                          <Webhook
                            className={`h-5 w-5 ${
                              webhook.status === "active"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <code className="text-sm font-mono">{webhook.url}</code>
                            <Badge
                              variant={
                                webhook.status === "active" ? "success" : "destructive"
                              }
                            >
                              {webhook.status}
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
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Last delivery:</span>
                        <span>{webhook.lastDelivery}</span>
                        {webhook.lastStatus === 200 ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <X className="h-4 w-4 text-red-600" />
                        )}
                        <Badge variant={webhook.lastStatus === 200 ? "success" : "destructive"}>
                          {webhook.lastStatus}
                        </Badge>
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
            ) : (
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
            )}
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
