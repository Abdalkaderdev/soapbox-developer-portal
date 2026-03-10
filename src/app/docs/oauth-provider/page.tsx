export default function OAuthProviderPage() {
  return (
    <div>
      <h1>Sign in with SoapBox</h1>
      <p className="lead">
        Allow users to sign in to your application using their SoapBox account.
        Implement OAuth 2.0 authentication to provide a seamless, secure login experience.
      </p>

      <h2>Overview</h2>
      <p>
        &quot;Sign in with SoapBox&quot; is an OAuth 2.0-based authentication system that enables
        third-party applications to authenticate users with their existing SoapBox accounts.
        This eliminates the need for users to create new accounts and remember additional passwords.
      </p>

      <h3>Benefits</h3>
      <ul>
        <li><strong>Simplified onboarding</strong> - Users can sign in with one click using their existing SoapBox account</li>
        <li><strong>Increased trust</strong> - Users trust familiar login providers over creating new accounts</li>
        <li><strong>Secure authentication</strong> - Leverage SoapBox&apos;s secure authentication infrastructure</li>
        <li><strong>Access to user data</strong> - With user consent, access profile information like name and email</li>
        <li><strong>Reduced friction</strong> - No password fatigue or forgotten credentials</li>
      </ul>

      <h2>Registration</h2>
      <p>
        Before implementing &quot;Sign in with SoapBox&quot;, you need to register your application
        to obtain client credentials.
      </p>

      <h3>Getting Client Credentials</h3>
      <ol>
        <li>Sign in to the <a href="/dashboard">Developer Dashboard</a></li>
        <li>Create a new application or select an existing one</li>
        <li>Navigate to the <strong>OAuth Settings</strong> section</li>
        <li>Add your authorized redirect URIs</li>
        <li>Copy your <code>client_id</code> and <code>client_secret</code></li>
      </ol>

      <div className="not-prose bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6">
        <p className="text-yellow-800 font-medium">Security Warning</p>
        <p className="text-yellow-700 text-sm mt-1">
          Keep your <code>client_secret</code> confidential. Never expose it in client-side code
          or public repositories. For single-page applications, use PKCE instead.
        </p>
      </div>

      <h2>Authorization Flow</h2>
      <p>
        The authorization flow follows the OAuth 2.0 Authorization Code grant type.
        Here&apos;s how it works:
      </p>

      <h3>Step 1: Redirect to Authorization</h3>
      <p>
        Redirect the user to the SoapBox authorization endpoint with the required parameters:
      </p>
      <pre><code>{`https://soapboxsuperapp.com/oauth/authorize?
  client_id=YOUR_CLIENT_ID
  &redirect_uri=https://yourapp.com/callback
  &response_type=code
  &scope=openid profile email
  &state=random_state_string`}</code></pre>

      <h4>Parameters</h4>
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Required</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>client_id</code></td>
            <td>Yes</td>
            <td>Your application&apos;s client ID from the dashboard</td>
          </tr>
          <tr>
            <td><code>redirect_uri</code></td>
            <td>Yes</td>
            <td>URL to redirect back to after authorization. Must match a registered URI.</td>
          </tr>
          <tr>
            <td><code>response_type</code></td>
            <td>Yes</td>
            <td>Must be <code>code</code> for the authorization code flow</td>
          </tr>
          <tr>
            <td><code>scope</code></td>
            <td>Yes</td>
            <td>Space-separated list of scopes (e.g., <code>openid profile email</code>)</td>
          </tr>
          <tr>
            <td><code>state</code></td>
            <td>Recommended</td>
            <td>Random string to prevent CSRF attacks. Returned unchanged in the callback.</td>
          </tr>
        </tbody>
      </table>

      <h3>Step 2: User Login and Consent</h3>
      <p>
        The user will be presented with the SoapBox login page (if not already logged in)
        and a consent screen showing what data your application is requesting access to.
        Once the user approves, they will be redirected back to your application.
      </p>

      <h3>Step 3: Handle the Callback</h3>
      <p>
        After the user authorizes your application, SoapBox redirects them back to your
        <code>redirect_uri</code> with an authorization code:
      </p>
      <pre><code>{`https://yourapp.com/callback?code=AUTH_CODE&state=random_state_string`}</code></pre>

      <div className="not-prose bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
        <p className="text-blue-800 font-medium">Important</p>
        <p className="text-blue-700 text-sm mt-1">
          Always verify that the <code>state</code> parameter matches the one you sent
          in Step 1 to prevent CSRF attacks.
        </p>
      </div>

      <h2>Token Exchange</h2>
      <p>
        Exchange the authorization code for an access token by making a POST request
        to the token endpoint:
      </p>

      <h3>Request</h3>
      <pre><code>{`POST https://soapboxsuperapp.com/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&code=AUTH_CODE
&client_id=YOUR_CLIENT_ID
&client_secret=YOUR_CLIENT_SECRET
&redirect_uri=https://yourapp.com/callback`}</code></pre>

      <h3>Response</h3>
      <pre><code>{`{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "dGhpcyBpcyBhIHJlZnJlc2g...",
  "scope": "openid profile email",
  "id_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}`}</code></pre>

      <table>
        <thead>
          <tr>
            <th>Field</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>access_token</code></td>
            <td>Token to access protected resources</td>
          </tr>
          <tr>
            <td><code>token_type</code></td>
            <td>Always &quot;Bearer&quot;</td>
          </tr>
          <tr>
            <td><code>expires_in</code></td>
            <td>Token lifetime in seconds (typically 3600)</td>
          </tr>
          <tr>
            <td><code>refresh_token</code></td>
            <td>Token to obtain new access tokens</td>
          </tr>
          <tr>
            <td><code>scope</code></td>
            <td>Granted scopes</td>
          </tr>
          <tr>
            <td><code>id_token</code></td>
            <td>JWT containing user identity claims (when <code>openid</code> scope is requested)</td>
          </tr>
        </tbody>
      </table>

      <h2>Get User Info</h2>
      <p>
        Retrieve the authenticated user&apos;s profile information using the access token:
      </p>

      <h3>Request</h3>
      <pre><code>{`GET https://soapboxsuperapp.com/oauth/userinfo
Authorization: Bearer ACCESS_TOKEN`}</code></pre>

      <h3>Response</h3>
      <pre><code>{`{
  "sub": "user_123456",
  "name": "John Doe",
  "given_name": "John",
  "family_name": "Doe",
  "email": "john.doe@example.com",
  "email_verified": true,
  "picture": "https://soapboxsuperapp.com/avatars/user_123456.jpg"
}`}</code></pre>

      <h2>Available Scopes</h2>
      <p>
        Scopes determine what user information your application can access.
        Request only the scopes you need.
      </p>

      <table>
        <thead>
          <tr>
            <th>Scope</th>
            <th>Description</th>
            <th>Claims Provided</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>openid</code></td>
            <td>Required for OpenID Connect. Returns an ID token.</td>
            <td><code>sub</code></td>
          </tr>
          <tr>
            <td><code>profile</code></td>
            <td>Access to basic profile information</td>
            <td><code>name</code>, <code>given_name</code>, <code>family_name</code>, <code>picture</code></td>
          </tr>
          <tr>
            <td><code>email</code></td>
            <td>Access to the user&apos;s email address</td>
            <td><code>email</code>, <code>email_verified</code></td>
          </tr>
        </tbody>
      </table>

      <h2>Code Examples</h2>

      <h3>JavaScript/TypeScript - Complete Flow</h3>
      <pre><code>{`// Configuration
const config = {
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET', // Server-side only!
  redirectUri: 'https://yourapp.com/callback',
  authorizationEndpoint: 'https://soapboxsuperapp.com/oauth/authorize',
  tokenEndpoint: 'https://soapboxsuperapp.com/oauth/token',
  userinfoEndpoint: 'https://soapboxsuperapp.com/oauth/userinfo'
};

// Step 1: Generate authorization URL
function getAuthorizationUrl(): string {
  const state = crypto.randomUUID();
  // Store state in session for verification
  sessionStorage.setItem('oauth_state', state);

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: 'openid profile email',
    state: state
  });

  return \`\${config.authorizationEndpoint}?\${params.toString()}\`;
}

// Redirect user to SoapBox login
function signInWithSoapBox(): void {
  window.location.href = getAuthorizationUrl();
}`}</code></pre>

      <h3>Handle Callback (Server-side)</h3>
      <pre><code>{`// Express.js example
import express from 'express';

const app = express();

app.get('/callback', async (req, res) => {
  const { code, state } = req.query;

  // Verify state to prevent CSRF
  const storedState = req.session.oauth_state;
  if (state !== storedState) {
    return res.status(403).json({ error: 'Invalid state parameter' });
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch(config.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code as string,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: config.redirectUri
      })
    });

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(tokens.error_description || 'Token exchange failed');
    }

    // Get user info
    const userResponse = await fetch(config.userinfoEndpoint, {
      headers: {
        'Authorization': \`Bearer \${tokens.access_token}\`
      }
    });

    const user = await userResponse.json();

    // Create session or JWT for your app
    req.session.user = {
      id: user.sub,
      name: user.name,
      email: user.email,
      picture: user.picture
    };

    res.redirect('/dashboard');

  } catch (error) {
    console.error('OAuth error:', error);
    res.redirect('/login?error=auth_failed');
  }
});`}</code></pre>

      <h3>React Component Example</h3>
      <pre><code>{`import { useState } from 'react';

function SignInButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = () => {
    setIsLoading(true);

    const state = crypto.randomUUID();
    sessionStorage.setItem('oauth_state', state);

    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_SOAPBOX_CLIENT_ID!,
      redirect_uri: \`\${window.location.origin}/api/auth/callback\`,
      response_type: 'code',
      scope: 'openid profile email',
      state: state
    });

    window.location.href = \`https://soapboxsuperapp.com/oauth/authorize?\${params}\`;
  };

  return (
    <button
      onClick={handleSignIn}
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
    >
      {isLoading ? (
        <span>Redirecting...</span>
      ) : (
        <>
          <SoapBoxLogo className="w-5 h-5" />
          <span>Sign in with SoapBox</span>
        </>
      )}
    </button>
  );
}`}</code></pre>

      <h3>Next.js API Route Example</h3>
      <pre><code>{`// app/api/auth/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  // Exchange code for tokens
  const tokenResponse = await fetch('https://soapboxsuperapp.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code!,
      client_id: process.env.SOAPBOX_CLIENT_ID!,
      client_secret: process.env.SOAPBOX_CLIENT_SECRET!,
      redirect_uri: \`\${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback\`
    })
  });

  const tokens = await tokenResponse.json();

  // Get user info
  const userResponse = await fetch('https://soapboxsuperapp.com/oauth/userinfo', {
    headers: {
      'Authorization': \`Bearer \${tokens.access_token}\`
    }
  });

  const user = await userResponse.json();

  // Set session cookie (implement your own session logic)
  const cookieStore = await cookies();
  cookieStore.set('session', JSON.stringify({
    user: {
      id: user.sub,
      name: user.name,
      email: user.email
    },
    accessToken: tokens.access_token
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: tokens.expires_in
  });

  return NextResponse.redirect(new URL('/dashboard', request.url));
}`}</code></pre>

      <h2>Error Handling</h2>
      <p>Handle errors that may occur during the OAuth flow:</p>

      <table>
        <thead>
          <tr>
            <th>Error</th>
            <th>Description</th>
            <th>Resolution</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>invalid_request</code></td>
            <td>Missing or invalid parameters</td>
            <td>Check all required parameters are present and valid</td>
          </tr>
          <tr>
            <td><code>invalid_client</code></td>
            <td>Client authentication failed</td>
            <td>Verify client_id and client_secret</td>
          </tr>
          <tr>
            <td><code>invalid_grant</code></td>
            <td>Authorization code is invalid or expired</td>
            <td>Request a new authorization code</td>
          </tr>
          <tr>
            <td><code>unauthorized_client</code></td>
            <td>Client not authorized for this grant type</td>
            <td>Check app configuration in dashboard</td>
          </tr>
          <tr>
            <td><code>access_denied</code></td>
            <td>User denied the authorization request</td>
            <td>Handle gracefully, offer alternative login</td>
          </tr>
          <tr>
            <td><code>invalid_scope</code></td>
            <td>Requested scope is invalid or unknown</td>
            <td>Use only supported scopes: openid, profile, email</td>
          </tr>
        </tbody>
      </table>

      <h2>Best Practices</h2>
      <ul>
        <li><strong>Always use HTTPS</strong> - All redirect URIs must use HTTPS in production</li>
        <li><strong>Validate the state parameter</strong> - Prevents CSRF attacks</li>
        <li><strong>Store tokens securely</strong> - Use httpOnly cookies or secure server-side storage</li>
        <li><strong>Request minimal scopes</strong> - Only request the data you actually need</li>
        <li><strong>Handle token expiration</strong> - Implement refresh token logic</li>
        <li><strong>Use PKCE for public clients</strong> - Required for SPAs and mobile apps</li>
      </ul>

      <div className="not-prose bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <p className="text-green-800 font-medium">Need Help?</p>
        <p className="text-green-700 text-sm mt-1">
          If you run into issues implementing &quot;Sign in with SoapBox&quot;, check our{' '}
          <a href="/docs/api-reference" className="underline">API Reference</a> or reach out to our
          developer support team.
        </p>
      </div>
    </div>
  );
}
