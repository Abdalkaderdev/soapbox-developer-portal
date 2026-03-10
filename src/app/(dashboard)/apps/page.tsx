"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AppWindow,
  Plus,
  Search,
  MoreVertical,
  Copy,
  Trash2,
  Edit,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const apps = [
  {
    id: "1",
    name: "Church Connect",
    description: "Mobile app for church members to stay connected",
    clientId: "sb_app_abc123def456",
    status: "active",
    scopes: ["read:churches", "read:events", "read:users"],
    createdAt: "2024-01-15",
    lastUsed: "2 hours ago",
    requests30d: 5420,
  },
  {
    id: "2",
    name: "Event Manager",
    description: "Event registration and management system",
    clientId: "sb_app_def456ghi789",
    status: "active",
    scopes: ["read:events", "write:events", "read:users"],
    createdAt: "2024-02-20",
    lastUsed: "1 day ago",
    requests30d: 3210,
  },
  {
    id: "3",
    name: "Prayer Wall Widget",
    description: "Embeddable prayer request widget for websites",
    clientId: "sb_app_ghi789jkl012",
    status: "inactive",
    scopes: ["read:prayers", "write:prayers"],
    createdAt: "2024-03-10",
    lastUsed: "1 week ago",
    requests30d: 890,
  },
];

export default function AppsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredApps = apps.filter(
    (app) =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                          variant={
                            app.status === "active" ? "success" : "secondary"
                          }
                        >
                          {app.status}
                        </Badge>
                      </div>
                      <p className="text-gray-500">{app.description}</p>
                      <div className="flex items-center gap-2 pt-2">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                          {app.clientId}
                        </code>
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() =>
                            navigator.clipboard.writeText(app.clientId)
                          }
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/apps/${app.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Scopes</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {app.scopes.slice(0, 2).map((scope) => (
                        <Badge key={scope} variant="outline" className="text-xs">
                          {scope}
                        </Badge>
                      ))}
                      {app.scopes.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{app.scopes.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500">Created</p>
                    <p className="font-medium mt-1">{app.createdAt}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Last Used</p>
                    <p className="font-medium mt-1">{app.lastUsed}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Requests (30d)</p>
                    <p className="font-medium mt-1">
                      {app.requests30d.toLocaleString()}
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
