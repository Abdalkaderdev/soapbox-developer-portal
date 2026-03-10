"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { User, CreditCard, Shield, Bell, Check, Loader2 } from "lucide-react";

interface Profile {
  id: number;
  email: string;
  name: string;
  organization: string | null;
  tier: string;
  createdAt: string;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Edit form state
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");

  // Notification preferences
  const [notifications, setNotifications] = useState({
    usageAlerts: true,
    webhookFailures: true,
    securityAlerts: true,
    productUpdates: false,
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/developer/profile");
        if (response.ok) {
          const data = await response.json();
          const profileData = data.data;
          setProfile(profileData);
          setName(profileData.name || "");
          setOrganization(profileData.organization || "");
        } else if (response.status === 401) {
          setError("Please sign in to view settings");
        } else {
          setError("Failed to load profile");
        }
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  async function handleSaveProfile() {
    setSaving(true);
    setSaved(false);
    try {
      const response = await fetch("/api/developer/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, organization: organization || null }),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      const data = await response.json();
      setProfile(data.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div>
        <Header title="Settings" description="Manage your developer account" />
        <div className="p-6 max-w-3xl">
          <div className="animate-pulse space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="h-6 bg-gray-200 rounded w-24 mb-4" />
                <div className="space-y-4">
                  <div className="h-10 bg-gray-200 rounded" />
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div>
        <Header title="Settings" description="Manage your developer account" />
        <div className="p-6">
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  value={profile?.email || ""}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Organization
              </label>
              <Input
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Your company or organization"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleSaveProfile} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : saved ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Saved
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
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
                  <h3 className="font-semibold text-lg">{profile?.tier || "Basic"} Plan</h3>
                  <Badge variant="secondary">Current</Badge>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {profile?.tier === "free" && "100 requests/minute • 3 apps • Community support"}
                  {profile?.tier === "basic" && "1,000 requests/minute • 10 apps • Email support"}
                  {profile?.tier === "pro" && "10,000 requests/minute • Unlimited apps • Priority support"}
                  {!profile?.tier && "1,000 requests/minute • 10 apps • Email support"}
                </p>
              </div>
              <Button variant="outline">Upgrade</Button>
            </div>

            <div className="mt-6 grid md:grid-cols-3 gap-4">
              <div className={`p-4 border rounded-lg text-center ${profile?.tier === "free" ? "border-orange-500 border-2 bg-orange-50" : ""}`}>
                <p className="text-2xl font-bold">Free</p>
                <p className="text-sm text-gray-500">100 req/min</p>
                <p className="text-xs text-gray-400 mt-1">3 apps</p>
              </div>
              <div className={`p-4 border rounded-lg text-center ${profile?.tier === "basic" || !profile?.tier ? "border-orange-500 border-2 bg-orange-50" : ""}`}>
                <p className="text-2xl font-bold">Basic</p>
                <p className="text-sm text-gray-500">1,000 req/min</p>
                <p className="text-xs text-gray-400 mt-1">10 apps</p>
              </div>
              <div className={`p-4 border rounded-lg text-center ${profile?.tier === "pro" ? "border-orange-500 border-2 bg-orange-50" : ""}`}>
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
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                <div>
                  <p className="font-medium text-sm">API usage alerts</p>
                  <p className="text-xs text-gray-500">When you approach rate limits</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.usageAlerts}
                  onChange={(e) => setNotifications({ ...notifications, usageAlerts: e.target.checked })}
                  className="h-4 w-4"
                />
              </label>
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                <div>
                  <p className="font-medium text-sm">Webhook failures</p>
                  <p className="text-xs text-gray-500">When webhook deliveries fail</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.webhookFailures}
                  onChange={(e) => setNotifications({ ...notifications, webhookFailures: e.target.checked })}
                  className="h-4 w-4"
                />
              </label>
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                <div>
                  <p className="font-medium text-sm">Security alerts</p>
                  <p className="text-xs text-gray-500">Unusual activity on your account</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.securityAlerts}
                  onChange={(e) => setNotifications({ ...notifications, securityAlerts: e.target.checked })}
                  className="h-4 w-4"
                />
              </label>
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                <div>
                  <p className="font-medium text-sm">Product updates</p>
                  <p className="text-xs text-gray-500">New features and API changes</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.productUpdates}
                  onChange={(e) => setNotifications({ ...notifications, productUpdates: e.target.checked })}
                  className="h-4 w-4"
                />
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle>Account Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Account ID</p>
                <p className="font-mono">{profile?.id}</p>
              </div>
              <div>
                <p className="text-gray-500">Member Since</p>
                <p>{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "-"}</p>
              </div>
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
