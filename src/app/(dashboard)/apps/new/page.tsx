"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, X, Info } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const availableScopes = [
  { id: "read:churches", name: "Read Churches", description: "Read church and community information" },
  { id: "write:churches", name: "Write Churches", description: "Create and update church settings" },
  { id: "read:users", name: "Read Users", description: "Read user profiles and membership" },
  { id: "write:users", name: "Write Users", description: "Update user profiles" },
  { id: "read:events", name: "Read Events", description: "Read events and registrations" },
  { id: "write:events", name: "Write Events", description: "Create and manage events" },
  { id: "read:groups", name: "Read Groups", description: "Read small groups and membership" },
  { id: "write:groups", name: "Write Groups", description: "Create and manage small groups" },
  { id: "read:donations", name: "Read Donations", description: "Read donation records" },
  { id: "read:prayers", name: "Read Prayers", description: "Read prayer requests" },
  { id: "write:prayers", name: "Write Prayers", description: "Create and respond to prayer requests" },
];

export default function NewAppPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [redirectUri, setRedirectUri] = useState("");
  const [redirectUris, setRedirectUris] = useState<string[]>([]);
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);

  const addRedirectUri = () => {
    if (redirectUri && !redirectUris.includes(redirectUri)) {
      setRedirectUris([...redirectUris, redirectUri]);
      setRedirectUri("");
    }
  };

  const removeRedirectUri = (uri: string) => {
    setRedirectUris(redirectUris.filter((u) => u !== uri));
  };

  const toggleScope = (scopeId: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scopeId)
        ? prev.filter((s) => s !== scopeId)
        : [...prev, scopeId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit to API
    console.log({ name, description, websiteUrl, redirectUris, selectedScopes });
  };

  return (
    <div>
      <Header
        title="Create New App"
        description="Register a new application to access the SoapBox API"
      />

      <div className="p-6">
        <Link href="/apps" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Apps
        </Link>

        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                General information about your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  App Name *
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Awesome App"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A brief description of what your app does..."
                  className="w-full h-24 px-3 py-2 border rounded-md text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Website URL
                </label>
                <Input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://myapp.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* OAuth Settings */}
          <Card>
            <CardHeader>
              <CardTitle>OAuth Settings</CardTitle>
              <CardDescription>
                Configure redirect URIs for OAuth authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Redirect URIs
                </label>
                <div className="flex gap-2">
                  <Input
                    type="url"
                    value={redirectUri}
                    onChange={(e) => setRedirectUri(e.target.value)}
                    placeholder="https://myapp.com/callback"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRedirectUri())}
                  />
                  <Button type="button" onClick={addRedirectUri} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {redirectUris.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {redirectUris.map((uri) => (
                      <Badge key={uri} variant="secondary" className="pr-1">
                        {uri}
                        <button
                          type="button"
                          onClick={() => removeRedirectUri(uri)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Add all URLs where users will be redirected after authorization
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Scopes */}
          <Card>
            <CardHeader>
              <CardTitle>API Scopes</CardTitle>
              <CardDescription>
                Select the permissions your app needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {availableScopes.map((scope) => (
                  <label
                    key={scope.id}
                    className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedScopes.includes(scope.id)
                        ? "border-primary bg-primary/5"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedScopes.includes(scope.id)}
                      onChange={() => toggleScope(scope.id)}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium text-sm">{scope.name}</p>
                      <p className="text-xs text-gray-500">{scope.description}</p>
                      <code className="text-xs text-gray-400 mt-1">{scope.id}</code>
                    </div>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex items-center gap-4">
            <Button type="submit" size="lg" disabled={!name}>
              Create App
            </Button>
            <Link href="/apps">
              <Button type="button" variant="outline" size="lg">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
