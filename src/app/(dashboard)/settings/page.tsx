"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Building, CreditCard, Shield, Bell } from "lucide-react";

export default function SettingsPage() {
  return (
    <div>
      <Header title="Settings" description="Manage your developer account" />

      <div className="p-6 space-y-6 max-w-3xl">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile
            </CardTitle>
            <CardDescription>Your developer account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input defaultValue="John Developer" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input type="email" defaultValue="john@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Organization
              </label>
              <Input defaultValue="Acme Church Tech" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Subscription
            </CardTitle>
            <CardDescription>Your current plan and usage limits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">Basic Plan</h3>
                  <Badge variant="secondary">Current</Badge>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  1,000 requests/minute • 10 apps • Email support
                </p>
              </div>
              <Button variant="outline">Upgrade</Button>
            </div>

            <div className="mt-6 grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <p className="text-2xl font-bold">Free</p>
                <p className="text-sm text-gray-500">100 req/min</p>
                <p className="text-xs text-gray-400 mt-1">3 apps</p>
              </div>
              <div className="p-4 border-2 border-orange-500 rounded-lg text-center bg-orange-50">
                <p className="text-2xl font-bold">Basic</p>
                <p className="text-sm text-gray-500">1,000 req/min</p>
                <p className="text-xs text-gray-400 mt-1">10 apps</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-2xl font-bold">Pro</p>
                <p className="text-sm text-gray-500">10,000 req/min</p>
                <p className="text-xs text-gray-400 mt-1">Unlimited apps</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>
              Protect your account and API access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">
                  Add an extra layer of security
                </p>
              </div>
              <Button variant="outline">Enable</Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Change Password</p>
                <p className="text-sm text-gray-500">
                  Update your account password
                </p>
              </div>
              <Button variant="outline">Change</Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">API Key Rotation</p>
                <p className="text-sm text-gray-500">
                  Automatically rotate keys every 90 days
                </p>
              </div>
              <Button variant="outline">Configure</Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure email notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: "API usage alerts", description: "When you approach rate limits" },
                { label: "Webhook failures", description: "When webhook deliveries fail" },
                { label: "Security alerts", description: "Unusual activity on your account" },
                { label: "Product updates", description: "New features and API changes" },
              ].map((item, idx) => (
                <label
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div>
                <p className="font-medium">Delete Account</p>
                <p className="text-sm text-gray-500">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
