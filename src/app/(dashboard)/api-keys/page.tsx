"use client";

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
} from "lucide-react";
import { useState } from "react";
import { formatDate, copyToClipboard } from "@/lib/utils";

const apiKeys = [
  {
    id: "1",
    name: "Production API Key",
    key: "sb_live_abc123def456ghi789jkl012mno345",
    appName: "Church Connect",
    createdAt: "2024-01-15",
    lastUsed: "2 hours ago",
    isActive: true,
  },
  {
    id: "2",
    name: "Development Key",
    key: "sb_test_xyz789uvw456rst123qpo098nml765",
    appName: "Church Connect",
    createdAt: "2024-02-20",
    lastUsed: "5 minutes ago",
    isActive: true,
  },
  {
    id: "3",
    name: "Staging Environment",
    key: "sb_test_def456ghi789jkl012mno345pqr678",
    appName: "Event Manager",
    createdAt: "2024-03-10",
    lastUsed: "3 days ago",
    isActive: false,
  },
];

export default function ApiKeysPage() {
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);

  const toggleKeyVisibility = (keyId: string) => {
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

  const handleCopy = async (key: string, keyId: string) => {
    await copyToClipboard(key);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const maskKey = (key: string) => {
    return key.slice(0, 10) + "•".repeat(20) + key.slice(-4);
  };

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

        {/* Create New Key */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your API Keys</CardTitle>
              <CardDescription>
                API keys allow server-to-server authentication without user interaction
              </CardDescription>
            </div>
            <Button onClick={() => setShowNewKeyModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Key
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {apiKeys.map((apiKey) => (
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
                            {apiKey.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          App: {apiKey.appName}
                        </p>
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
                        onClick={() => handleCopy(apiKey.key, apiKey.id)}
                      >
                        {copiedKey === apiKey.id ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-3">
                    <code className="text-sm bg-gray-100 px-3 py-2 rounded-md block font-mono">
                      {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                    </code>
                  </div>

                  <div className="mt-3 flex items-center gap-6 text-sm text-gray-500">
                    <span>Created: {formatDate(apiKey.createdAt)}</span>
                    <span>Last used: {apiKey.lastUsed}</span>
                  </div>
                </div>
              ))}
            </div>
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
                <code className="text-sm bg-gray-900 text-gray-100 px-4 py-3 rounded-md block">
                  Authorization: Bearer sb_live_your_api_key_here
                </code>
              </div>
              <div>
                <p className="font-medium text-sm mb-2">X-API-Key Header</p>
                <code className="text-sm bg-gray-900 text-gray-100 px-4 py-3 rounded-md block">
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
