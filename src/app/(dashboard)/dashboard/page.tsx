"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AppWindow,
  Key,
  Activity,
  ArrowUpRight,
  Plus,
  Zap,
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    name: "Active Apps",
    value: "3",
    change: "+1 this month",
    icon: AppWindow,
  },
  {
    name: "API Keys",
    value: "5",
    change: "2 active",
    icon: Key,
  },
  {
    name: "API Calls (30d)",
    value: "12,847",
    change: "+23% from last month",
    icon: Activity,
  },
  {
    name: "Rate Limit",
    value: "1,000/min",
    change: "Basic tier",
    icon: Zap,
  },
];

const recentApps = [
  {
    id: "1",
    name: "Church Connect",
    clientId: "sb_app_abc123",
    status: "active",
    lastUsed: "2 hours ago",
  },
  {
    id: "2",
    name: "Event Manager",
    clientId: "sb_app_def456",
    status: "active",
    lastUsed: "1 day ago",
  },
  {
    id: "3",
    name: "Prayer Wall Widget",
    clientId: "sb_app_ghi789",
    status: "inactive",
    lastUsed: "1 week ago",
  },
];

export default function DashboardPage() {
  return (
    <div>
      <Header
        title="Dashboard"
        description="Overview of your SoapBox integrations"
      />

      <div className="p-6 space-y-6">
        {/* Quick Actions */}
        <div className="flex gap-3">
          <Link href="/apps/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New App
            </Button>
          </Link>
          <Link href="/docs">
            <Button variant="outline">
              <ArrowUpRight className="h-4 w-4 mr-2" />
              View Documentation
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {stat.name}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Apps */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your Apps</CardTitle>
            <Link href="/apps">
              <Button variant="ghost" size="sm">
                View all
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApps.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center">
                      <AppWindow className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{app.name}</p>
                      <p className="text-sm text-gray-500 font-mono">
                        {app.clientId}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={app.status === "active" ? "success" : "secondary"}
                    >
                      {app.status}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      Last used {app.lastUsed}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center mb-3">
                  <span className="text-orange-600 font-bold">1</span>
                </div>
                <h3 className="font-medium mb-1">Create an App</h3>
                <p className="text-sm text-gray-500">
                  Register your application to get OAuth credentials.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center mb-3">
                  <span className="text-orange-600 font-bold">2</span>
                </div>
                <h3 className="font-medium mb-1">Generate API Key</h3>
                <p className="text-sm text-gray-500">
                  Create an API key for server-to-server requests.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center mb-3">
                  <span className="text-orange-600 font-bold">3</span>
                </div>
                <h3 className="font-medium mb-1">Make API Calls</h3>
                <p className="text-sm text-gray-500">
                  Start integrating with churches, events, and more.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
