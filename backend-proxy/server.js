// server.js
const express = require('express');
const fetch = require('node-fetch'); // Install this if needed: npm install node-fetch
const cors = require('cors');
require('dotenv').config(); // Load .env variables

const app = express();

app.use(cors());
app.use(express.json());



// Proxy endpoint to handle requests from frontend
app.post('/api/query', async (req, res) => {
  try {
    const userQuery = req.body.query || '';
    const activityType = req.body.activityType || '';
    const intent = req.body.intent || '';
    const scrapedData = req.body.scrapedData || '';

    if (!process.env.API_KEY) {
      console.error('API_KEY is missing!');
      return res.status(500).json({ error: 'API Key not found in environment' });
    }
	const messages = [
      { role: 'system', content: 'You are a helpful assistant.' },
      {
        role: 'user',
        content: `User is currently ${activityType}. Intent: ${intent}\nQuery: ${userQuery}\nScraped data: ${JSON.stringify(scrapedData)}`
      }
    ];

    const promptText = `User is currently ${activityType}. Intent: ${intent}\nQuery: ${userQuery}\nScraped data: ${JSON.stringify(scrapedData)}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages:[
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: promptText }
  ],
	max_tokens:150
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const aiReply = data.choices?.[0]?.message?.content?.trim() || 'No response generated.';


    res.json({ reply: aiReply });
  } catch (error) {
    console.error('❌ Error fetching AI response:', error.message);
    res.status(500).json({ error: 'Failed to fetch response' });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Proxy server running on http://localhost:${PORT}`);
});
setInterval(() => console.log('Server still alive...'), 5000);

