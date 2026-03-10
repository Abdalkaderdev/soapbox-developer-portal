"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Code,
  Key,
  Webhook,
  Users,
  Calendar,
  Church,
  Heart,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const quickLinks = [
  {
    title: "Getting Started",
    description: "Learn the basics of the SoapBox API",
    href: "/docs/getting-started",
    icon: BookOpen,
  },
  {
    title: "Authentication",
    description: "OAuth 2.0 and API key authentication",
    href: "/docs/authentication",
    icon: Key,
  },
  {
    title: "API Reference",
    description: "Complete endpoint documentation",
    href: "/docs/api-reference",
    icon: Code,
  },
  {
    title: "Webhooks",
    description: "Real-time event notifications",
    href: "/docs/webhooks",
    icon: Webhook,
  },
];

const apiEndpoints = [
  {
    name: "Churches",
    description: "Access church and community data",
    icon: Church,
    endpoints: [
      { method: "GET", path: "/api/v1/churches", description: "List churches" },
      { method: "GET", path: "/api/v1/churches/:id", description: "Get church details" },
      { method: "GET", path: "/api/v1/churches/:id/members/count", description: "Get member count" },
    ],
  },
  {
    name: "Events",
    description: "Manage church events and registrations",
    icon: Calendar,
    endpoints: [
      { method: "GET", path: "/api/v1/events", description: "List events" },
      { method: "GET", path: "/api/v1/events/:id", description: "Get event details" },
      { method: "GET", path: "/api/v1/events/upcoming", description: "Get upcoming events" },
    ],
  },
  {
    name: "Users",
    description: "Access user profiles and memberships",
    icon: Users,
    endpoints: [
      { method: "GET", path: "/api/v1/users/:id", description: "Get user profile" },
      { method: "GET", path: "/api/v1/users/:id/churches", description: "Get user's churches" },
    ],
  },
  {
    name: "Prayers",
    description: "Prayer request management",
    icon: Heart,
    endpoints: [
      { method: "GET", path: "/api/v1/prayers", description: "List prayer requests" },
      { method: "GET", path: "/api/v1/prayers/:id", description: "Get prayer details" },
      { method: "POST", path: "/api/v1/prayers", description: "Create prayer request" },
      { method: "POST", path: "/api/v1/prayers/:id/pray", description: "Record prayer" },
    ],
  },
  {
    name: "Donations",
    description: "Access donation records and analytics",
    icon: DollarSign,
    endpoints: [
      { method: "GET", path: "/api/v1/donations", description: "List donations" },
      { method: "GET", path: "/api/v1/donations/:id", description: "Get donation details" },
      { method: "GET", path: "/api/v1/donations/summary", description: "Get donation summary" },
    ],
  },
];

const methodColors: Record<string, string> = {
  GET: "bg-green-100 text-green-700",
  POST: "bg-blue-100 text-blue-700",
  PUT: "bg-yellow-100 text-yellow-700",
  DELETE: "bg-red-100 text-red-700",
};

export default function DocsPage() {
  return (
    <div>
      <Header
        title="Documentation"
        description="Learn how to integrate with the SoapBox API"
      />

      <div className="p-6 space-y-8">
        {/* Quick Links */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                    <link.icon className="h-5 w-5 text-orange-600" />
                  </div>
                  <h3 className="font-semibold mb-1">{link.title}</h3>
                  <p className="text-sm text-gray-500">{link.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Base URL */}
        <Card>
          <CardHeader>
            <CardTitle>Base URL</CardTitle>
          </CardHeader>
          <CardContent>
            <code className="text-sm bg-gray-900 text-gray-100 px-4 py-3 rounded-md block">
              https://api.soapboxsuperapp.com/api/v1
            </code>
            <p className="text-sm text-gray-500 mt-3">
              All API requests should be made to this base URL. Authentication is required for all endpoints.
            </p>
          </CardContent>
        </Card>

        {/* API Endpoints */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">API Endpoints</h2>

          {apiEndpoints.map((category) => (
            <Card key={category.name}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <category.icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <CardTitle>{category.name}</CardTitle>
                    <p className="text-sm text-gray-500">{category.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {category.endpoints.map((endpoint, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <Badge className={methodColors[endpoint.method]}>
                        {endpoint.method}
                      </Badge>
                      <code className="text-sm font-mono flex-1">{endpoint.path}</code>
                      <span className="text-sm text-gray-500">{endpoint.description}</span>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Code Example */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Example</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`// Fetch churches using fetch API
const response = await fetch('https://api.soapboxsuperapp.com/api/v1/churches', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);

// Response
{
  "data": [
    {
      "id": 1,
      "name": "First Baptist Church",
      "city": "Dallas",
      "state": "TX",
      "memberCount": 1500
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "hasMore": true
  }
}`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
