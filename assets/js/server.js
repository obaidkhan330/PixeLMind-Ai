// ============================================================
//  PIXELMIND AI - Optional Backend Server
//  Use this ONLY if you want to hide your API key on a server
//  For frontend-only usage, the client calls Gemini directly
// ============================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..'))); // Serve frontend files

// ── POST /generate ────────────────────────────────────────
// Body: { prompt: string, style: string, size: string }
// Response: { imageData: base64string, mimeType: string }
app.post('/generate', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not set in .env file' });
  }

  const { prompt, style, size } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  const fullPrompt = `${style || 'Realistic'} style: ${prompt}, high quality, detailed, ${size || '1024x1024'} resolution`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: { responseModalities: ['TEXT', 'IMAGE'] }
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err?.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];

    for (const part of parts) {
      if (part.inlineData) {
        return res.json({
          imageData: part.inlineData.data,
          mimeType: part.inlineData.mimeType
        });
      }
    }

    return res.status(500).json({ error: 'No image in response. Try a different prompt.' });

  } catch (err) {
    console.error('Generation error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

// ── Health Check ──────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    apiKeySet: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`\n PixelMind AI Server running at http://localhost:${PORT}`);
  console.log(`📁 Serving frontend files from parent directory`);
  console.log(`🔑 API Key: ${process.env.GEMINI_API_KEY ? '✓ Set' : '✕ Not set — add to .env file'}\n`);

});

