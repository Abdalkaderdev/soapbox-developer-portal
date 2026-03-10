import Link from "next/link";
import { BookOpen, Key, Code, Webhook, Package, LogIn } from "lucide-react";

const navigation = [
  { name: "Getting Started", href: "/docs/getting-started", icon: BookOpen },
  { name: "Authentication", href: "/docs/authentication", icon: Key },
  { name: "OAuth Provider", href: "/docs/oauth-provider", icon: LogIn },
  { name: "API Reference", href: "/docs/api-reference", icon: Code },
  { name: "Webhooks", href: "/docs/webhooks", icon: Webhook },
  { name: "SDK", href: "/docs/sdk", icon: Package },
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b sticky top-0 bg-white z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-orange-500 flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="font-semibold">Docs</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 py-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <nav className="sticky top-24 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 text-gray-700"
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            <article className="prose prose-orange max-w-none">
              {children}
            </article>
          </main>
        </div>
      </div>
    </div>
  );
}
