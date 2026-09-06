export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GROQ_API_KEY not set on server' });
  }

  const { messages, system } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  // Build messages array with system prompt
  const groqMessages = [];
  if (system) {
    groqMessages.push({ role: 'system', content: system });
  }
  groqMessages.push(...messages);

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1024,
        messages: groqMessages,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({
        error: `Groq API error ${response.status}`,
        details: errText.slice(0, 500),
      });
    }

    const data = await response.json();
    // Return in Anthropic-compatible format so frontend doesn't need changes
    res.json({
      content: [{ text: data.choices[0].message.content }],
    });
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Failed to reach Groq API', details: err.message });
  }
}
