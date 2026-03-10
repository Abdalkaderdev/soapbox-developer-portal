"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const organization = formData.get("organization") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, organization }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Registration failed");
        return;
      }

      // Redirect to verify email page with the email as a query parameter
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
            <span className="text-orange-600 font-bold text-xl">S</span>
          </div>
          <CardTitle className="text-2xl">Create Developer Account</CardTitle>
          <CardDescription>
            Register to start building with the SoapBox API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <Input
                type="text"
                name="name"
                placeholder="John Developer"
                required
                autoComplete="name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Organization <span className="text-gray-400">(optional)</span>
              </label>
              <Input
                type="text"
                name="organization"
                placeholder="Your company or church"
                autoComplete="organization"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <Input
                type="password"
                name="password"
                placeholder="Min 8 characters"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">Already have an account? </span>
            <Link href="/login" className="text-orange-600 hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
