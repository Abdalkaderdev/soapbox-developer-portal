"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

const stats = [
  {
    name: "Total Requests (30d)",
    value: "127,482",
    change: "+12.5%",
    trend: "up",
  },
  {
    name: "Success Rate",
    value: "99.8%",
    change: "+0.2%",
    trend: "up",
  },
  {
    name: "Avg Response Time",
    value: "142ms",
    change: "-8ms",
    trend: "up",
  },
  {
    name: "Error Rate",
    value: "0.2%",
    change: "-0.1%",
    trend: "up",
  },
];

const topEndpoints = [
  { endpoint: "GET /churches", requests: 45230, avgTime: "89ms", errors: 12 },
  { endpoint: "GET /events", requests: 32150, avgTime: "112ms", errors: 5 },
  { endpoint: "GET /users/:id", requests: 28940, avgTime: "78ms", errors: 3 },
  { endpoint: "GET /prayers", requests: 12480, avgTime: "156ms", errors: 8 },
  { endpoint: "POST /prayers", requests: 5420, avgTime: "234ms", errors: 2 },
];

const recentErrors = [
  {
    time: "2 minutes ago",
    endpoint: "GET /churches/999",
    status: 404,
    message: "Church not found",
  },
  {
    time: "15 minutes ago",
    endpoint: "POST /prayers",
    status: 400,
    message: "Missing required field: content",
  },
  {
    time: "1 hour ago",
    endpoint: "GET /donations",
    status: 403,
    message: "Insufficient scope: read:donations",
  },
];

export default function AnalyticsPage() {
  return (
    <div>
      <Header
        title="Usage & Analytics"
        description="Monitor your API usage and performance"
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.name}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <span
                    className={`text-sm ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Usage Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              API Requests Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Chart visualization coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Endpoints */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Top Endpoints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topEndpoints.map((endpoint, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <code className="text-sm font-mono">{endpoint.endpoint}</code>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span>{endpoint.requests.toLocaleString()} requests</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {endpoint.avgTime}
                        </span>
                      </div>
                    </div>
                    {endpoint.errors > 0 ? (
                      <Badge variant="destructive">{endpoint.errors} errors</Badge>
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Errors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Recent Errors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentErrors.map((error, idx) => (
                  <div key={idx} className="p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono">{error.endpoint}</code>
                      <Badge variant="destructive">{error.status}</Badge>
                    </div>
                    <p className="text-sm text-red-700 mt-1">{error.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{error.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rate Limits */}
        <Card>
          <CardHeader>
            <CardTitle>Rate Limit Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Current Tier</p>
                <p className="text-xl font-bold mt-1">Basic</p>
                <p className="text-sm text-gray-500 mt-1">1,000 requests/minute</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Current Usage</p>
                <p className="text-xl font-bold mt-1">342 / 1,000</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: "34.2%" }}
                  />
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Rate Limit Hits (24h)</p>
                <p className="text-xl font-bold mt-1">0</p>
                <p className="text-sm text-green-600 mt-1">No limits exceeded</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
