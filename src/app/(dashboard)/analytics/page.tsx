"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";

interface Analytics {
  totalRequests: number;
  successRate: number;
  avgResponseTime: number;
  errorRate: number;
  requestsByDay: { date: string; count: number }[];
  topEndpoints: { endpoint: string; count: number; avgTime: number; errors: number }[];
  recentErrors: { time: string; endpoint: string; status: number; message: string }[];
}

interface App {
  id: number;
  name: string;
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<AnalyticsLoading />}>
      <AnalyticsContent />
    </Suspense>
  );
}

function AnalyticsLoading() {
  return (
    <div>
      <Header title="Usage & Analytics" description="Monitor your API usage and performance" />
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                  <div className="h-8 bg-gray-200 rounded w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsContent() {
  const searchParams = useSearchParams();
  const appIdParam = searchParams.get("app");

  const [apps, setApps] = useState<App[]>([]);
  const [selectedApp, setSelectedApp] = useState<string | null>(appIdParam);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30d");

  useEffect(() => {
    async function fetchApps() {
      try {
        const response = await fetch("/api/apps");
        if (response.ok) {
          const data = await response.json();
          const appsList = data.data || [];
          setApps(appsList);
          if (!selectedApp && appsList.length > 0) {
            setSelectedApp(appsList[0].id.toString());
          }
        }
      } catch {
        console.error("Failed to fetch apps");
      }
    }
    fetchApps();
  }, [selectedApp]);

  useEffect(() => {
    async function fetchAnalytics() {
      if (!selectedApp) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/apps/${selectedApp}/analytics?period=${period}`);
        if (response.ok) {
          const data = await response.json();
          setAnalytics(data.data);
        } else {
          // Use placeholder data if API not available
          setAnalytics({
            totalRequests: 0,
            successRate: 100,
            avgResponseTime: 0,
            errorRate: 0,
            requestsByDay: [],
            topEndpoints: [],
            recentErrors: [],
          });
        }
      } catch {
        setAnalytics({
          totalRequests: 0,
          successRate: 100,
          avgResponseTime: 0,
          errorRate: 0,
          requestsByDay: [],
          topEndpoints: [],
          recentErrors: [],
        });
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [selectedApp, period]);

  const stats = analytics
    ? [
        {
          name: `Total Requests (${period})`,
          value: analytics.totalRequests.toLocaleString(),
          trend: "up" as const,
        },
        {
          name: "Success Rate",
          value: `${analytics.successRate.toFixed(1)}%`,
          trend: analytics.successRate >= 99 ? ("up" as const) : ("down" as const),
        },
        {
          name: "Avg Response Time",
          value: `${analytics.avgResponseTime}ms`,
          trend: analytics.avgResponseTime <= 200 ? ("up" as const) : ("down" as const),
        },
        {
          name: "Error Rate",
          value: `${analytics.errorRate.toFixed(2)}%`,
          trend: analytics.errorRate <= 1 ? ("up" as const) : ("down" as const),
        },
      ]
    : [];

  return (
    <div>
      <Header
        title="Usage & Analytics"
        description="Monitor your API usage and performance"
      />

      <div className="p-6 space-y-6">
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <select
              value={selectedApp || ""}
              onChange={(e) => setSelectedApp(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              {apps.length === 0 && <option value="">No apps</option>}
              {apps.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.name}
                </option>
              ))}
            </select>
            <div className="flex rounded-md border overflow-hidden">
              {["7d", "30d", "90d"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 text-sm ${
                    period === p
                      ? "bg-orange-500 text-white"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 500);
            }}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                    <div className="h-8 bg-gray-200 rounded w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !selectedApp || apps.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <BarChart3 className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="font-medium text-lg mb-2">No apps to analyze</h3>
              <p className="text-gray-500">Create an app to start seeing analytics</p>
            </CardContent>
          </Card>
        ) : (
          <>
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
                    <div className="mt-2">
                      <p className="text-2xl font-bold">{stat.value}</p>
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
                {analytics && analytics.requestsByDay.length > 0 ? (
                  <div className="h-64 flex items-end gap-1">
                    {analytics.requestsByDay.map((day, idx) => {
                      const max = Math.max(...analytics.requestsByDay.map((d) => d.count));
                      const height = max > 0 ? (day.count / max) * 100 : 0;
                      return (
                        <div
                          key={idx}
                          className="flex-1 bg-orange-500 rounded-t hover:bg-orange-600 transition-colors"
                          style={{ height: `${Math.max(height, 2)}%` }}
                          title={`${day.date}: ${day.count} requests`}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No request data yet</p>
                      <p className="text-sm">Start making API requests to see analytics</p>
                    </div>
                  </div>
                )}
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
                  {analytics && analytics.topEndpoints.length > 0 ? (
                    <div className="space-y-3">
                      {analytics.topEndpoints.map((endpoint, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <code className="text-sm font-mono">{endpoint.endpoint}</code>
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                              <span>{endpoint.count.toLocaleString()} requests</span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {endpoint.avgTime}ms
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
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No endpoint data yet</p>
                    </div>
                  )}
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
                  {analytics && analytics.recentErrors.length > 0 ? (
                    <div className="space-y-3">
                      {analytics.recentErrors.map((error, idx) => (
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
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <p>No recent errors</p>
                    </div>
                  )}
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
                    <p className="text-xl font-bold mt-1">
                      {analytics ? Math.min(analytics.totalRequests, 1000) : 0} / 1,000
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{
                          width: `${analytics ? Math.min((analytics.totalRequests / 1000) * 100, 100) : 0}%`,
                        }}
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
          </>
        )}
      </div>
    </div>
  );
}
