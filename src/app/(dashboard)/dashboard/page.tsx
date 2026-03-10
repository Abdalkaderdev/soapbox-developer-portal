"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Plus,
  Key,
  BarChart3,
  ArrowRight,
  BookOpen,
  Code,
  Webhook,
} from "lucide-react";

interface App {
  id: number;
  clientId: string;
  name: string;
  description: string | null;
  tier: string;
  isActive: boolean;
  requestCount?: number;
  createdAt: string;
}

interface Stats {
  totalApps: number;
  totalRequests: number;
  activeKeys: number;
}

export default function DashboardPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [stats, setStats] = useState<Stats>({ totalApps: 0, totalRequests: 0, activeKeys: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/apps");
        if (response.ok) {
          const data = await response.json();
          const appsList = data.data || [];
          setApps(appsList);
          setStats({
            totalApps: appsList.length,
            totalRequests: appsList.reduce((sum: number, app: App) => sum + (app.requestCount || 0), 0),
            activeKeys: appsList.filter((a: App) => a.isActive).length,
          });
        } else if (response.status === 401) {
          setError("Please sign in to view your dashboard");
        }
      } catch {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const quickLinks = [
    { title: "Create New App", href: "/apps/new", icon: Plus, description: "Set up a new application" },
    { title: "View Documentation", href: "/docs", icon: BookOpen, description: "Learn the API" },
    { title: "API Reference", href: "/docs/api-reference", icon: Code, description: "Explore endpoints" },
    { title: "Configure Webhooks", href: "/webhooks", icon: Webhook, description: "Real-time events" },
  ];

  return (
    <div>
      <Header title="Dashboard" description="Welcome to your developer dashboard" />

      <div className="p-6 space-y-6">
        {error ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500 mb-4">{error}</p>
              <Link href="/login">
                <Button>Sign In</Button>
              </Link>
            </CardContent>
          </Card>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-24" />
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Apps</p>
                      <p className="text-3xl font-bold">{stats.totalApps}</p>
                    </div>
                    <LayoutDashboard className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">API Requests (30d)</p>
                      <p className="text-3xl font-bold">{stats.totalRequests.toLocaleString()}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Active Keys</p>
                      <p className="text-3xl font-bold">{stats.activeKeys}</p>
                    </div>
                    <Key className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                          <link.icon className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium">{link.title}</p>
                          <p className="text-xs text-gray-500">{link.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Apps List */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Your Apps</CardTitle>
                  <CardDescription>Manage your applications</CardDescription>
                </div>
                <Link href="/apps/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New App
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {apps.length > 0 ? (
                  <div className="space-y-4">
                    {apps.slice(0, 5).map((app) => (
                      <Link key={app.id} href={`/apps/${app.id}`}>
                        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                              <LayoutDashboard className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                              <p className="font-medium">{app.name}</p>
                              <p className="text-sm text-gray-500">
                                {app.description || "No description"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge variant={app.isActive ? "success" : "secondary"}>
                              {app.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      </Link>
                    ))}
                    {apps.length > 5 && (
                      <Link href="/apps" className="block text-center">
                        <Button variant="outline" className="w-full">
                          View All Apps
                        </Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <LayoutDashboard className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="font-medium text-lg mb-2">No apps yet</h3>
                    <p className="text-gray-500 mb-4">
                      Create your first app to start using the SoapBox API
                    </p>
                    <Link href="/apps/new">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First App
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Getting Started */}
            {apps.length === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Getting Started</CardTitle>
                  <CardDescription>Follow these steps to integrate with SoapBox</CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-4">
                    <li className="flex items-start gap-4">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-medium">
                        1
                      </span>
                      <div>
                        <p className="font-medium">Create an app</p>
                        <p className="text-sm text-gray-500">
                          Set up your first application to get API credentials
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 font-medium">
                        2
                      </span>
                      <div>
                        <p className="font-medium">Install the SDK</p>
                        <p className="text-sm text-gray-500">
                          <code className="bg-gray-100 px-1 rounded">npm install @soapbox/sdk</code>
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 font-medium">
                        3
                      </span>
                      <div>
                        <p className="font-medium">Make your first request</p>
                        <p className="text-sm text-gray-500">
                          Follow the <Link href="/docs" className="text-orange-600 hover:underline">documentation</Link> to get started
                        </p>
                      </div>
                    </li>
                  </ol>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
