import { Badge } from "@/components/ui/badge";

const endpoints = [
  {
    category: "Churches",
    description: "Access church and community data",
    endpoints: [
      { method: "GET", path: "/churches", description: "List all churches", scope: "read:churches" },
      { method: "GET", path: "/churches/:id", description: "Get church details", scope: "read:churches" },
      { method: "GET", path: "/churches/:id/members/count", description: "Get member count", scope: "read:churches" },
    ],
  },
  {
    category: "Events",
    description: "Manage church events and registrations",
    endpoints: [
      { method: "GET", path: "/events", description: "List events", scope: "read:events" },
      { method: "GET", path: "/events/:id", description: "Get event details", scope: "read:events" },
      { method: "GET", path: "/events/upcoming", description: "Get upcoming events", scope: "read:events" },
      { method: "POST", path: "/events/:id/register", description: "Register for event", scope: "write:events" },
      { method: "DELETE", path: "/events/:id/register", description: "Unregister from event", scope: "write:events" },
    ],
  },
  {
    category: "Users",
    description: "Access user profiles and memberships",
    endpoints: [
      { method: "GET", path: "/users/:id", description: "Get user profile", scope: "read:users" },
      { method: "GET", path: "/users/me", description: "Get current user", scope: "read:users" },
      { method: "GET", path: "/users/:id/churches", description: "Get user's churches", scope: "read:users" },
    ],
  },
  {
    category: "Prayers",
    description: "Prayer request management",
    endpoints: [
      { method: "GET", path: "/prayers", description: "List prayer requests", scope: "read:prayers" },
      { method: "GET", path: "/prayers/:id", description: "Get prayer details", scope: "read:prayers" },
      { method: "POST", path: "/prayers", description: "Create prayer request", scope: "write:prayers" },
      { method: "POST", path: "/prayers/:id/pray", description: "Record a prayer", scope: "write:prayers" },
      { method: "POST", path: "/prayers/:id/answered", description: "Mark as answered", scope: "write:prayers" },
    ],
  },
  {
    category: "Donations",
    description: "Access donation records (requires special approval)",
    endpoints: [
      { method: "GET", path: "/donations", description: "List donations", scope: "read:donations" },
      { method: "GET", path: "/donations/:id", description: "Get donation details", scope: "read:donations" },
      { method: "GET", path: "/donations/summary", description: "Get donation summary", scope: "read:donations" },
    ],
  },
  {
    category: "Groups",
    description: "Small group management",
    endpoints: [
      { method: "GET", path: "/groups", description: "List small groups", scope: "read:groups" },
      { method: "GET", path: "/groups/:id", description: "Get group details", scope: "read:groups" },
      { method: "GET", path: "/groups/:id/members", description: "Get group members", scope: "read:groups" },
      { method: "POST", path: "/groups/:id/join", description: "Join a group", scope: "write:groups" },
      { method: "DELETE", path: "/groups/:id/leave", description: "Leave a group", scope: "write:groups" },
    ],
  },
];

const methodColors: Record<string, string> = {
  GET: "bg-green-100 text-green-700",
  POST: "bg-blue-100 text-blue-700",
  PUT: "bg-yellow-100 text-yellow-700",
  PATCH: "bg-orange-100 text-orange-700",
  DELETE: "bg-red-100 text-red-700",
};

export default function APIReferencePage() {
  return (
    <div>
      <h1>API Reference</h1>
      <p className="lead">Complete reference for all SoapBox API endpoints.</p>

      <h2>Base URL</h2>
      <pre><code>https://api.soapboxsuperapp.com/api/v1</code></pre>

      <h2>Common Parameters</h2>
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>page</code></td>
            <td>integer</td>
            <td>Page number (default: 1)</td>
          </tr>
          <tr>
            <td><code>limit</code></td>
            <td>integer</td>
            <td>Items per page (default: 20, max: 100)</td>
          </tr>
        </tbody>
      </table>

      {endpoints.map((category) => (
        <div key={category.category} className="mt-12">
          <h2>{category.category}</h2>
          <p>{category.description}</p>

          <div className="not-prose space-y-3 mt-4">
            {category.endpoints.map((endpoint, idx) => (
              <div key={idx} className="border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Badge className={methodColors[endpoint.method]}>
                    {endpoint.method}
                  </Badge>
                  <code className="text-sm">{endpoint.path}</code>
                </div>
                <p className="text-sm text-gray-600 mt-2">{endpoint.description}</p>
                <div className="mt-2">
                  <span className="text-xs text-gray-500">Scope: </span>
                  <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">{endpoint.scope}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <h2 className="mt-12">Example: List Churches</h2>
      <h3>Request</h3>
      <pre><code>{`curl https://api.soapboxsuperapp.com/api/v1/churches \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</code></pre>

      <h3>Response</h3>
      <pre><code>{`{
  "data": [
    {
      "id": 1,
      "name": "First Baptist Church",
      "description": "A welcoming community...",
      "city": "Dallas",
      "state": "TX",
      "country": "USA",
      "website": "https://firstbaptist.org",
      "memberCount": 1500,
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "hasMore": true
  }
}`}</code></pre>

      <h2 className="mt-12">Example: Create Prayer Request</h2>
      <h3>Request</h3>
      <pre><code>{`curl -X POST https://api.soapboxsuperapp.com/api/v1/prayers \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "communityId": 123,
    "content": "Please pray for my family during this difficult time.",
    "isAnonymous": false
  }'`}</code></pre>

      <h3>Response</h3>
      <pre><code>{`{
  "data": {
    "id": 456,
    "communityId": 123,
    "userId": 789,
    "content": "Please pray for my family during this difficult time.",
    "isAnonymous": false,
    "isAnswered": false,
    "prayerCount": 0,
    "createdAt": "2024-03-10T15:30:00Z"
  }
}`}</code></pre>

      <h2 className="mt-12">Error Handling</h2>
      <p>All errors follow a consistent format:</p>
      <pre><code>{`{
  "error": "NotFound",
  "message": "Church with ID 999 not found",
  "statusCode": 404
}`}</code></pre>

      <table>
        <thead>
          <tr>
            <th>Status Code</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>400</td><td>Bad Request - Invalid parameters</td></tr>
          <tr><td>401</td><td>Unauthorized - Invalid or missing credentials</td></tr>
          <tr><td>403</td><td>Forbidden - Insufficient permissions</td></tr>
          <tr><td>404</td><td>Not Found - Resource doesn&apos;t exist</td></tr>
          <tr><td>429</td><td>Too Many Requests - Rate limit exceeded</td></tr>
          <tr><td>500</td><td>Internal Server Error</td></tr>
        </tbody>
      </table>
    </div>
  );
}
