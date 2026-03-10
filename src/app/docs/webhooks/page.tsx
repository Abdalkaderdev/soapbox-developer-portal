export default function WebhooksPage() {
  return (
    <div>
      <h1>Webhooks</h1>
      <p className="lead">
        Receive real-time notifications when events occur in SoapBox.
      </p>

      <h2>How Webhooks Work</h2>
      <p>
        When an event occurs (like a new prayer request or event registration), we send an
        HTTP POST request to your configured endpoint with the event details.
      </p>

      <h2>Setting Up Webhooks</h2>
      <ol>
        <li>Go to your app in the <a href="/dashboard">Dashboard</a></li>
        <li>Navigate to the Webhooks section</li>
        <li>Add your endpoint URL</li>
        <li>Select the events you want to receive</li>
        <li>Save your webhook</li>
      </ol>

      <h2>Webhook Payload</h2>
      <pre><code>{`{
  "id": "evt_abc123",
  "type": "prayer.created",
  "timestamp": "2024-03-10T15:30:00Z",
  "data": {
    "id": 456,
    "communityId": 123,
    "content": "Please pray for...",
    "isAnonymous": false,
    "createdAt": "2024-03-10T15:30:00Z"
  }
}`}</code></pre>

      <h2>Available Events</h2>
      <h3>Events</h3>
      <table>
        <thead>
          <tr><th>Event</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>event.created</code></td><td>New event created</td></tr>
          <tr><td><code>event.updated</code></td><td>Event details updated</td></tr>
          <tr><td><code>event.deleted</code></td><td>Event deleted</td></tr>
          <tr><td><code>event.registration</code></td><td>Someone registered for an event</td></tr>
        </tbody>
      </table>

      <h3>Prayers</h3>
      <table>
        <thead>
          <tr><th>Event</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>prayer.created</code></td><td>New prayer request</td></tr>
          <tr><td><code>prayer.answered</code></td><td>Prayer marked as answered</td></tr>
          <tr><td><code>prayer.prayed</code></td><td>Someone prayed for a request</td></tr>
        </tbody>
      </table>

      <h3>Donations</h3>
      <table>
        <thead>
          <tr><th>Event</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>donation.completed</code></td><td>Donation completed</td></tr>
          <tr><td><code>donation.failed</code></td><td>Donation failed</td></tr>
          <tr><td><code>donation.refunded</code></td><td>Donation refunded</td></tr>
        </tbody>
      </table>

      <h3>Users</h3>
      <table>
        <thead>
          <tr><th>Event</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>user.joined</code></td><td>User joined a church</td></tr>
          <tr><td><code>user.left</code></td><td>User left a church</td></tr>
          <tr><td><code>user.updated</code></td><td>User profile updated</td></tr>
        </tbody>
      </table>

      <h3>Groups</h3>
      <table>
        <thead>
          <tr><th>Event</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>group.created</code></td><td>New small group created</td></tr>
          <tr><td><code>group.member.joined</code></td><td>Member joined a group</td></tr>
          <tr><td><code>group.member.left</code></td><td>Member left a group</td></tr>
        </tbody>
      </table>

      <h2>Verifying Webhooks</h2>
      <p>
        All webhooks include a signature in the <code>X-SoapBox-Signature</code> header.
        Verify this signature to ensure the webhook is from SoapBox.
      </p>

      <pre><code>{`import { Webhooks } from '@soapbox/sdk';

const webhooks = new Webhooks({
  secret: 'your-webhook-secret'
});

// Express.js example
app.post('/webhooks/soapbox', async (req, res) => {
  const signature = req.headers['x-soapbox-signature'];
  const isValid = await webhooks.verify(req.rawBody, signature);

  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }

  const payload = webhooks.parse(req.body);

  switch (payload.type) {
    case 'prayer.created':
      console.log('New prayer:', payload.data);
      break;
    case 'event.registration':
      console.log('New registration:', payload.data);
      break;
  }

  res.status(200).send('OK');
});`}</code></pre>

      <h2>Retry Policy</h2>
      <p>
        If your endpoint doesn&apos;t respond with a 2xx status code, we&apos;ll retry:
      </p>
      <ul>
        <li>1st retry: 1 minute after initial attempt</li>
        <li>2nd retry: 5 minutes after 1st retry</li>
        <li>3rd retry: 30 minutes after 2nd retry</li>
        <li>Final retry: 2 hours after 3rd retry</li>
      </ul>
      <p>
        After 4 failed attempts, the webhook is marked as failed and you&apos;ll receive
        an email notification.
      </p>

      <h2>Best Practices</h2>
      <ul>
        <li><strong>Respond quickly</strong> - Return 200 immediately, process async</li>
        <li><strong>Handle duplicates</strong> - Use the event ID for idempotency</li>
        <li><strong>Verify signatures</strong> - Always validate the webhook signature</li>
        <li><strong>Use HTTPS</strong> - Only HTTPS endpoints are supported</li>
      </ul>

      <h2>Testing Webhooks</h2>
      <p>
        Use the &quot;Test&quot; button in your dashboard to send a test webhook to your endpoint.
        You can also use tools like <a href="https://webhook.site">webhook.site</a> for testing.
      </p>
    </div>
  );
}
