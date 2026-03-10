import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Code,
  Zap,
  Shield,
  Users,
  Calendar,
  Heart,
  DollarSign,
  Webhook,
  ArrowRight,
  Check,
} from "lucide-react";

const features = [
  {
    icon: Code,
    title: "RESTful API",
    description: "Clean, well-documented endpoints following REST best practices",
  },
  {
    icon: Shield,
    title: "OAuth 2.0",
    description: "Secure authentication with authorization code flow and PKCE support",
  },
  {
    icon: Zap,
    title: "Real-time Webhooks",
    description: "Get instant notifications when events occur in your app",
  },
  {
    icon: Users,
    title: "TypeScript SDK",
    description: "Full type safety with our official SDK for JavaScript and TypeScript",
  },
];

const resources = [
  { icon: Users, name: "Users", description: "Access member profiles and preferences" },
  { icon: Calendar, name: "Events", description: "Manage church events and registrations" },
  { icon: Heart, name: "Prayers", description: "Prayer request management" },
  { icon: DollarSign, name: "Donations", description: "Access donation records and analytics" },
  { icon: Webhook, name: "Groups", description: "Small group management" },
];

const tiers = [
  {
    name: "Free",
    price: "$0",
    description: "For hobby projects and testing",
    features: ["100 requests/minute", "3 apps", "Community support", "Basic analytics"],
  },
  {
    name: "Basic",
    price: "$29",
    description: "For small to medium apps",
    features: ["1,000 requests/minute", "10 apps", "Email support", "Full analytics", "Webhooks"],
    popular: true,
  },
  {
    name: "Pro",
    price: "$99",
    description: "For high-traffic applications",
    features: ["10,000 requests/minute", "Unlimited apps", "Priority support", "Advanced analytics", "SLA guarantee"],
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-orange-500 flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <span className="font-semibold text-lg">SoapBox Developers</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/docs" className="text-gray-600 hover:text-gray-900">
                Documentation
              </Link>
              <Link href="/docs/api-reference" className="text-gray-600 hover:text-gray-900">
                API Reference
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
                Pricing
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-6">
            Build apps for
            <span className="text-orange-500"> church communities</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The SoapBox API gives you access to church data, events, donations, prayer requests,
            and more. Build integrations that help communities thrive.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Start Building <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/docs">
              <Button size="lg" variant="outline">
                Read the Docs
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">Free tier available. No credit card required.</p>
        </div>
      </section>

      {/* Code Example */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Simple to integrate</h2>
              <p className="text-gray-600 mb-6">
                Get started in minutes with our official SDK. Full TypeScript support
                with comprehensive type definitions.
              </p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                <code>{`npm install @soapbox/sdk`}</code>
              </pre>
            </div>
            <div>
              <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg text-sm overflow-x-auto">
                <code>{`import { SoapBox } from '@soapbox/sdk';

const soapbox = new SoapBox({
  apiKey: 'your-api-key'
});

// Get upcoming events
const events = await soapbox.events.upcoming();

// Create a prayer request
const prayer = await soapbox.prayers.create({
  churchId: 123,
  content: 'Please pray for...'
});`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything you need</h2>
            <p className="text-gray-600">Built for developers, designed for scale</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">API Resources</h2>
            <p className="text-gray-600">Access all the data your app needs</p>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {resources.map((resource) => (
              <Card key={resource.name} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <resource.icon className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                  <h3 className="font-semibold mb-1">{resource.name}</h3>
                  <p className="text-xs text-gray-500">{resource.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Simple pricing</h2>
            <p className="text-gray-600">Start free, scale as you grow</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <Card key={tier.name} className={tier.popular ? "border-2 border-orange-500 relative" : ""}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-orange-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-1">{tier.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-3xl font-bold">{tier.price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">{tier.description}</p>
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href="/register">
                    <Button className="w-full" variant={tier.popular ? "default" : "outline"}>
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-orange-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to build something amazing?
          </h2>
          <p className="text-orange-100 mb-8">
            Join developers building apps for thousands of church communities
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="gap-2">
              Create Free Account <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-orange-500 flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="font-semibold">SoapBox</span>
              </div>
              <p className="text-sm text-gray-600">
                Building technology for church communities
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Documentation</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/docs" className="hover:text-gray-900">Getting Started</Link></li>
                <li><Link href="/docs/authentication" className="hover:text-gray-900">Authentication</Link></li>
                <li><Link href="/docs/api-reference" className="hover:text-gray-900">API Reference</Link></li>
                <li><Link href="/docs/webhooks" className="hover:text-gray-900">Webhooks</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/docs/sdk" className="hover:text-gray-900">SDK</Link></li>
                <li><a href="https://github.com/soapbox-super-app" className="hover:text-gray-900">GitHub</a></li>
                <li><Link href="/changelog" className="hover:text-gray-900">Changelog</Link></li>
                <li><Link href="/status" className="hover:text-gray-900">Status</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="https://soapboxsuperapp.com" className="hover:text-gray-900">About</a></li>
                <li><a href="mailto:developers@soapboxsuperapp.com" className="hover:text-gray-900">Contact</a></li>
                <li><Link href="/terms" className="hover:text-gray-900">Terms</Link></li>
                <li><Link href="/privacy" className="hover:text-gray-900">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} SoapBox. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
