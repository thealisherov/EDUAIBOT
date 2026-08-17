module.exports = async function handler(req, res) {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    return res.status(400).json({ error: "TELEGRAM_BOT_TOKEN not configured" });
  }

  if (req.method === 'GET') {
    // Get webhook info
    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`);
      const data = await response.json();
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'POST') {
    const { webhookUrl } = req.body;

    if (!webhookUrl) {
      return res.status(400).json({ error: "webhookUrl is required" });
    }

    try {
      // Set webhook
      const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: webhookUrl,
          allowed_updates: ['message', 'callback_query', 'contact']
        })
      });

      const data = await response.json();

      if (data.ok) {
        return res.status(200).json({ 
          success: true, 
          message: "Webhook set successfully",
          data 
        });
      } else {
        return res.status(400).json({ 
          success: false, 
          error: data.description || "Failed to set webhook",
          data 
        });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
};
