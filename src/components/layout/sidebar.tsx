"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  AppWindow,
  Key,
  BookOpen,
  Webhook,
  Settings,
  BarChart3,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Apps", href: "/apps", icon: AppWindow },
  { name: "API Keys", href: "/api-keys", icon: Key },
  { name: "Webhooks", href: "/webhooks", icon: Webhook },
  { name: "Usage & Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Documentation", href: "/docs", icon: BookOpen },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-gray-800">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">SB</span>
          </div>
          <span className="text-white font-semibold text-lg">Developers</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gray-700 flex items-center justify-center">
            <span className="text-white text-sm font-medium">D</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Developer</p>
            <p className="text-xs text-gray-400 truncate">dev@example.com</p>
          </div>
          <button className="text-gray-400 hover:text-white">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
