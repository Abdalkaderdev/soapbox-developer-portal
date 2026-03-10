export default function SDKPage() {
  return (
    <div>
      <h1>SDK</h1>
      <p className="lead">
        Our official TypeScript/JavaScript SDK makes it easy to integrate with the SoapBox API.
      </p>

      <h2>Installation</h2>
      <pre><code>npm install @soapbox/sdk</code></pre>

      <h2>Quick Start</h2>
      <pre><code>{`import { SoapBox } from '@soapbox/sdk';

const soapbox = new SoapBox({
  apiKey: 'your-api-key'
});

// List churches
const churches = await soapbox.churches.list();

// Get upcoming events
const events = await soapbox.events.upcoming();

// Create a prayer request
const prayer = await soapbox.prayers.create({
  churchId: 123,
  content: 'Please pray for my family'
});`}</code></pre>

      <h2>Configuration</h2>
      <pre><code>{`const soapbox = new SoapBox({
  // Required: Your API key or OAuth access token
  apiKey: 'your-api-key',

  // Optional: Custom API URL (for staging)
  baseUrl: 'https://api.staging.soapboxsuperapp.com/api/v1',

  // Optional: Request timeout in ms (default: 30000)
  timeout: 60000
});`}</code></pre>

      <h2>Resources</h2>

      <h3>Churches</h3>
      <pre><code>{`// List churches
const churches = await soapbox.churches.list({
  page: 1,
  limit: 20,
  city: 'Dallas',
  state: 'TX'
});

// Get a specific church
const church = await soapbox.churches.get(123);

// Get member count
const count = await soapbox.churches.getMemberCount(123);`}</code></pre>

      <h3>Events</h3>
      <pre><code>{`// List events
const events = await soapbox.events.list({
  churchId: 123,
  upcoming: true
});

// Get upcoming events
const upcoming = await soapbox.events.upcoming();

// Register for an event
await soapbox.events.register(456);

// Unregister
await soapbox.events.unregister(456);`}</code></pre>

      <h3>Prayers</h3>
      <pre><code>{`// List prayer requests
const prayers = await soapbox.prayers.list({
  churchId: 123
});

// Create a prayer request
const prayer = await soapbox.prayers.create({
  churchId: 123,
  content: 'Please pray for healing',
  isAnonymous: false
});

// Record that you prayed
await soapbox.prayers.pray(456);

// Mark as answered
await soapbox.prayers.markAnswered(456);`}</code></pre>

      <h3>Donations</h3>
      <pre><code>{`// List donations
const donations = await soapbox.donations.list({
  churchId: 123,
  startDate: '2024-01-01',
  endDate: '2024-12-31'
});

// Get summary
const summary = await soapbox.donations.summary({
  churchId: 123
});`}</code></pre>

      <h3>Groups</h3>
      <pre><code>{`// List small groups
const groups = await soapbox.groups.list({
  churchId: 123,
  category: 'Bible Study'
});

// Get group details
const group = await soapbox.groups.get(456);

// Join a group
await soapbox.groups.join(456);

// Leave a group
await soapbox.groups.leave(456);`}</code></pre>

      <h3>Users</h3>
      <pre><code>{`// Get current user
const me = await soapbox.users.me();

// Get user's churches
const myChurches = await soapbox.users.myChurches();`}</code></pre>

      <h2>OAuth Helper</h2>
      <pre><code>{`import { OAuth } from '@soapbox/sdk';

const oauth = new OAuth({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret', // Only for server-side
  redirectUri: 'https://yourapp.com/callback'
});

// Generate authorization URL
const authUrl = oauth.getAuthorizationUrl({
  scope: 'read:churches read:events'
});

// Exchange code for token
const token = await oauth.exchangeCode(code);

// Refresh token
const newToken = await oauth.refreshToken(refreshToken);

// Revoke token (logout)
await oauth.revokeToken(accessToken);`}</code></pre>

      <h3>PKCE for Public Clients</h3>
      <pre><code>{`// Generate PKCE challenge
const pkce = await oauth.generatePKCE();

// Store verifier securely
sessionStorage.setItem('code_verifier', pkce.codeVerifier);

// Generate auth URL with challenge
const authUrl = oauth.getAuthorizationUrl({
  scope: 'read:churches',
  codeChallenge: pkce.codeChallenge
});

// Later, exchange with verifier
const verifier = sessionStorage.getItem('code_verifier');
const token = await oauth.exchangeCode(code, verifier);`}</code></pre>

      <h2>Webhook Verification</h2>
      <pre><code>{`import { Webhooks } from '@soapbox/sdk';

const webhooks = new Webhooks({
  secret: 'your-webhook-secret'
});

// Verify signature
const isValid = await webhooks.verify(requestBody, signature);

// Parse payload
const payload = webhooks.parse(requestBody);

// Check event type
if (webhooks.matchesEvent(payload.type, 'prayer.*')) {
  // Handle prayer events
}`}</code></pre>

      <h2>Error Handling</h2>
      <pre><code>{`import { APIError, TimeoutError, NetworkError } from '@soapbox/sdk';

try {
  const church = await soapbox.churches.get(999);
} catch (error) {
  if (error instanceof APIError) {
    console.log('Status:', error.statusCode);
    console.log('Message:', error.message);

    if (error.isNotFoundError()) {
      // Handle 404
    } else if (error.isRateLimitError()) {
      // Handle 429 - retry later
    } else if (error.isAuthError()) {
      // Handle 401 - refresh token
    }
  } else if (error instanceof TimeoutError) {
    // Request timed out
  } else if (error instanceof NetworkError) {
    // Network issue
  }
}`}</code></pre>

      <h2>TypeScript</h2>
      <p>The SDK includes full TypeScript definitions:</p>
      <pre><code>{`import type {
  Church,
  Event,
  Prayer,
  Donation,
  Group,
  User,
  PaginatedResponse
} from '@soapbox/sdk';

async function getChurchEvents(churchId: number): Promise<Event[]> {
  const response: PaginatedResponse<Event> = await soapbox.events.list({
    churchId
  });
  return response.data;
}`}</code></pre>

      <h2>Requirements</h2>
      <ul>
        <li>Node.js 18+ (uses native fetch)</li>
        <li>TypeScript 5.0+ (for type definitions)</li>
      </ul>

      <h2>Source Code</h2>
      <p>
        The SDK is open source. View on{" "}
        <a href="https://github.com/soapbox-super-app/soapbox-sdk">GitHub</a>.
      </p>
    </div>
  );
}
