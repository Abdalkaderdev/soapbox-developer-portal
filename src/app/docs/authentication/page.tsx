export default function AuthenticationPage() {
  return (
    <div>
      <h1>Authentication</h1>
      <p className="lead">
        The SoapBox API supports API key authentication for server-to-server requests
        and OAuth 2.0 for user-authorized access.
      </p>

      <h2>API Key Authentication</h2>
      <p>
        API keys are the simplest way to authenticate. Include your key in the
        <code>Authorization</code> header:
      </p>
      <pre><code>{`curl https://api.soapboxsuperapp.com/api/v1/churches \\
  -H "Authorization: Bearer sk_live_xxxxx"`}</code></pre>

      <p>Or use the <code>X-API-Key</code> header:</p>
      <pre><code>{`curl https://api.soapboxsuperapp.com/api/v1/churches \\
  -H "X-API-Key: sk_live_xxxxx"`}</code></pre>

      <h3>Creating API Keys</h3>
      <ol>
        <li>Go to your <a href="/dashboard">Dashboard</a></li>
        <li>Select an app</li>
        <li>Navigate to API Keys</li>
        <li>Click &quot;Create New Key&quot;</li>
      </ol>

      <div className="not-prose bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6">
        <p className="text-yellow-800 font-medium">Security Warning</p>
        <p className="text-yellow-700 text-sm mt-1">
          Never expose API keys in client-side code. They should only be used in server environments.
        </p>
      </div>

      <h2>OAuth 2.0</h2>
      <p>
        OAuth 2.0 allows users to authorize your app to access their data without sharing their password.
        We support the Authorization Code flow with PKCE.
      </p>

      <h3>Authorization Flow</h3>

      <h4>Step 1: Redirect to Authorization</h4>
      <p>Redirect users to our authorization endpoint:</p>
      <pre><code>{`https://api.soapboxsuperapp.com/api/v1/oauth/authorize?
  client_id=YOUR_CLIENT_ID
  &redirect_uri=https://yourapp.com/callback
  &response_type=code
  &scope=read:churches read:events
  &state=random_state_string`}</code></pre>

      <h4>Step 2: Handle the Callback</h4>
      <p>After authorization, we redirect back with a code:</p>
      <pre><code>{`https://yourapp.com/callback?code=AUTH_CODE&state=random_state_string`}</code></pre>

      <h4>Step 3: Exchange Code for Token</h4>
      <pre><code>{`curl -X POST https://api.soapboxsuperapp.com/api/v1/oauth/token \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "grant_type=authorization_code" \\
  -d "code=AUTH_CODE" \\
  -d "client_id=YOUR_CLIENT_ID" \\
  -d "client_secret=YOUR_CLIENT_SECRET" \\
  -d "redirect_uri=https://yourapp.com/callback"`}</code></pre>

      <h4>Response</h4>
      <pre><code>{`{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "dGhpcyBpcyBhIHJlZnJlc2g...",
  "scope": "read:churches read:events"
}`}</code></pre>

      <h3>PKCE (for Public Clients)</h3>
      <p>
        For SPAs and mobile apps, use PKCE to secure the authorization flow:
      </p>
      <pre><code>{`import { OAuth } from '@soapbox/sdk';

const oauth = new OAuth({
  clientId: 'your-client-id',
  redirectUri: 'https://yourapp.com/callback'
});

// Generate PKCE challenge
const pkce = await oauth.generatePKCE();
sessionStorage.setItem('code_verifier', pkce.codeVerifier);

// Build authorization URL
const authUrl = oauth.getAuthorizationUrl({
  scope: 'read:churches read:events',
  codeChallenge: pkce.codeChallenge
});

// Redirect user
window.location.href = authUrl;`}</code></pre>

      <h3>Refreshing Tokens</h3>
      <pre><code>{`curl -X POST https://api.soapboxsuperapp.com/api/v1/oauth/token \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "grant_type=refresh_token" \\
  -d "refresh_token=YOUR_REFRESH_TOKEN" \\
  -d "client_id=YOUR_CLIENT_ID"`}</code></pre>

      <h2>Scopes</h2>
      <p>Scopes control what data your app can access:</p>
      <table>
        <thead>
          <tr>
            <th>Scope</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><code>read:churches</code></td><td>Read church information</td></tr>
          <tr><td><code>read:events</code></td><td>Read events</td></tr>
          <tr><td><code>write:events</code></td><td>Create and manage events</td></tr>
          <tr><td><code>read:users</code></td><td>Read user profiles</td></tr>
          <tr><td><code>read:prayers</code></td><td>Read prayer requests</td></tr>
          <tr><td><code>write:prayers</code></td><td>Create and manage prayers</td></tr>
          <tr><td><code>read:donations</code></td><td>Read donation records</td></tr>
          <tr><td><code>read:groups</code></td><td>Read small groups</td></tr>
          <tr><td><code>write:groups</code></td><td>Manage small groups</td></tr>
        </tbody>
      </table>

      <h2>Error Responses</h2>
      <table>
        <thead>
          <tr>
            <th>Status</th>
            <th>Error</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>401</td><td>Unauthorized</td><td>Missing or invalid credentials</td></tr>
          <tr><td>403</td><td>Forbidden</td><td>Insufficient scope or permissions</td></tr>
          <tr><td>429</td><td>TooManyRequests</td><td>Rate limit exceeded</td></tr>
        </tbody>
      </table>
    </div>
  );
}
