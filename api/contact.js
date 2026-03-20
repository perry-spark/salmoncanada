export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, message, subscribe } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Log submission (visible in Vercel function logs)
    console.log('=== NEW SALMON CANADA SUBMISSION ===');
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      name,
      email,
      message: message || '(no message)',
      subscribe
    }, null, 2));
    console.log('====================================');

    // ──────────────────────────────────────────────
    // TO WIRE UP EMAIL FORWARDING:
    // Option A: Add SENDGRID_API_KEY to Vercel env vars
    //   and uncomment the SendGrid block below.
    // Option B: Add a Zapier/Make webhook URL to
    //   WEBHOOK_URL env var and uncomment that block.
    // ──────────────────────────────────────────────

    // --- Option A: SendGrid ---
    // if (process.env.SENDGRID_API_KEY) {
    //   await fetch('https://api.sendgrid.com/v3/mail/send', {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //       personalizations: [{ to: [{ email: 'info@salmoncanada.ca' }] }],
    //       from: { email: 'noreply@salmoncanada.ca', name: 'Salmon Canada Website' },
    //       subject: `New inquiry from ${name}`,
    //       content: [{
    //         type: 'text/plain',
    //         value: `Name: ${name}\nEmail: ${email}\nSubscribe: ${subscribe ? 'Yes' : 'No'}\n\nMessage:\n${message || '(none)'}`
    //       }]
    //     })
    //   });
    // }

    // --- Option B: Webhook (Zapier / Make / n8n) ---
    // if (process.env.WEBHOOK_URL) {
    //   await fetch(process.env.WEBHOOK_URL, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ name, email, message, subscribe, timestamp: new Date().toISOString() })
    //   });
    // }

    return res.status(200).json({ success: true, message: 'Thank you for your interest in Salmon Canada.' });

  } catch (error) {
    console.error('Form submission error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
