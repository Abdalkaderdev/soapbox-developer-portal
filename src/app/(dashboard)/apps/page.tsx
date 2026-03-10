"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AppWindow,
  Plus,
  Search,
  Copy,
  Edit,
  Check,
} from "lucide-react";
import Link from "next/link";

interface App {
  id: number;
  clientId: string;
  name: string;
  description: string | null;
  scopes: string[];
  tier: string;
  isActive: boolean;
  requestCount?: number;
  createdAt: string;
}

export default function AppsPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApps() {
      try {
        const response = await fetch("/api/apps");
        if (response.ok) {
          const data = await response.json();
          setApps(data.data || []);
        } else if (response.status === 401) {
          setError("Please sign in to view your apps");
        } else {
          setError("Failed to load apps");
        }
      } catch {
        setError("Failed to load apps");
      } finally {
        setLoading(false);
      }
    }
    fetchApps();
  }, []);

  const filteredApps = apps.filter(
    (app) =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.description && app.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  function copyToClipboard(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  if (loading) {
    return (
      <div>
        <Header title="My Apps" description="Manage your registered applications" />
        <div className="p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse flex gap-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-48" />
                    <div className="h-4 bg-gray-200 rounded w-96" />
                    <div className="h-4 bg-gray-200 rounded w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header title="My Apps" description="Manage your registered applications" />
        <div className="p-6">
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500 mb-4">{error}</p>
              <Link href="/login">
                <Button>Sign In</Button>
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
        title="My Apps"
        description="Manage your registered applications"
      />

      <div className="p-6 space-y-6">
        {/* Actions Bar */}
        <div className="flex items-center justify-between">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Link href="/apps/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New App
            </Button>
          </Link>
        </div>

        {/* Apps Grid */}
        <div className="grid gap-4">
          {filteredApps.map((app) => (
            <Card key={app.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center flex-shrink-0">
                      <AppWindow className="h-6 w-6 text-white" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{app.name}</h3>
                        <Badge
                          variant={app.isActive ? "success" : "secondary"}
                        >
                          {app.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-gray-500">{app.description || "No description"}</p>
                      <div className="flex items-center gap-2 pt-2">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                          {app.clientId}
                        </code>
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() => copyToClipboard(app.clientId, app.clientId)}
                        >
                          {copied === app.clientId ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/apps/${app.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Manage
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Scopes</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {app.scopes?.slice(0, 2).map((scope) => (
                        <Badge key={scope} variant="outline" className="text-xs">
                          {scope}
                        </Badge>
                      ))}
                      {app.scopes && app.scopes.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{app.scopes.length - 2}
                        </Badge>
                      )}
                      {(!app.scopes || app.scopes.length === 0) && (
                        <span className="text-gray-400 text-xs">None</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500">Tier</p>
                    <p className="font-medium mt-1">{app.tier}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Created</p>
                    <p className="font-medium mt-1">{formatDate(app.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Requests (30d)</p>
                    <p className="font-medium mt-1">
                      {(app.requestCount || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredApps.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <AppWindow className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="font-medium text-lg mb-2">No apps found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery
                  ? "Try adjusting your search"
                  : "Create your first app to get started"}
              </p>
              <Link href="/apps/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New App
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
