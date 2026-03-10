export default function GettingStartedPage() {
  return (
    <div>
      <h1>Getting Started</h1>
      <p className="lead">
        Welcome to the SoapBox API! This guide will help you get up and running in minutes.
      </p>

      <h2>Quick Start</h2>

      <h3>1. Create an Account</h3>
      <p>
        First, <a href="/register">create a developer account</a>. This gives you access to the
        developer dashboard where you can create apps, manage API keys, and view analytics.
      </p>

      <h3>2. Create an App</h3>
      <p>
        In the dashboard, create a new app to get your API credentials:
      </p>
      <ul>
        <li><strong>Client ID</strong> - Identifies your application</li>
        <li><strong>Client Secret</strong> - Keep this secure, never expose in client-side code</li>
        <li><strong>API Key</strong> - For server-to-server requests</li>
      </ul>

      <h3>3. Install the SDK</h3>
      <p>Install our official TypeScript/JavaScript SDK:</p>
      <pre><code>npm install @soapbox/sdk</code></pre>

      <h3>4. Make Your First Request</h3>
      <pre><code>{`import { SoapBox } from '@soapbox/sdk';

const soapbox = new SoapBox({
  apiKey: 'your-api-key'
});

// Get a list of churches
const churches = await soapbox.churches.list();
console.log(churches.data);`}</code></pre>

      <h2>Base URL</h2>
      <p>All API requests should be made to:</p>
      <pre><code>https://api.soapboxsuperapp.com/api/v1</code></pre>

      <h2>Authentication</h2>
      <p>
        The API supports two authentication methods:
      </p>
      <ul>
        <li><strong>API Keys</strong> - Best for server-to-server communication</li>
        <li><strong>OAuth 2.0</strong> - Best for user-authorized access</li>
      </ul>
      <p>
        See the <a href="/docs/authentication">Authentication guide</a> for details.
      </p>

      <h2>Rate Limits</h2>
      <p>Rate limits vary by plan:</p>
      <table>
        <thead>
          <tr>
            <th>Plan</th>
            <th>Requests/minute</th>
            <th>Apps</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Free</td>
            <td>100</td>
            <td>3</td>
          </tr>
          <tr>
            <td>Basic</td>
            <td>1,000</td>
            <td>10</td>
          </tr>
          <tr>
            <td>Pro</td>
            <td>10,000</td>
            <td>Unlimited</td>
          </tr>
        </tbody>
      </table>

      <h2>Response Format</h2>
      <p>All responses are JSON with a consistent structure:</p>
      <pre><code>{`// Success response
{
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "hasMore": true
  }
}

// Error response
{
  "error": "NotFound",
  "message": "Resource not found",
  "statusCode": 404
}`}</code></pre>

      <h2>Next Steps</h2>
      <ul>
        <li><a href="/docs/authentication">Set up authentication</a></li>
        <li><a href="/docs/api-reference">Explore the API Reference</a></li>
        <li><a href="/docs/sdk">Use the SDK</a></li>
        <li><a href="/docs/webhooks">Configure webhooks</a></li>
      </ul>
    </div>
  );
}
