# PixelMind AI 🎨

**Free AI Image Generator powered by Google Gemini**

> No payment. No watermarks. No limits from us. Use your own free Gemini API key.

---

## 🚀 Quick Start (Frontend Only — Recommended)

1. Download / clone the project
2. Open `index.html` in your browser (or use VS Code Live Server)
3. Go to the **Generate** page
4. Enter your Gemini API key (instructions below)
5. Start generating!

**No installation needed for frontend-only usage.**

---

## 🔑 Getting Your Free Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com)
2. Sign in with your Google account
3. Click **"Get API Key"**
4. Click **"Create API Key"**
5. Copy the key (starts with `AIza...`)
6. Paste it in the **Generate** page API Key box and click **Save Key**

### Free Tier Limits (Google's limits, not ours):
- ~15 images per minute
- ~1500 images per day
- No credit card required

---

## 📁 Project Structure

```
project/
├── index.html          ← Home page
├── generate.html       ← Image generation (main page)
├── gallery.html        ← Gallery with your images
├── dashboard.html      ← Stats & history
├── profile.html        ← Profile & API key settings
├── about.html          ← About page
├── contact.html        ← Contact form
├── login.html          ← Login page
├── signup.html         ← Signup page
│
├── assets/
│   ├── css/style.css   ← All styles
│   └── js/script.js    ← All JavaScript + Gemini API calls
│
└── server/             ← Optional Node.js backend
    ├── server.js       ← Express proxy server
    ├── .env            ← Add your API key here
    └── package.json
```

---

## ⚙️ Optional Backend Setup

Use the backend ONLY if you want to hide your API key server-side:

```bash
cd server
npm install
# Edit .env and add: GEMINI_API_KEY=your_key_here
npm start
# Open http://localhost:3000
```

---

## 🔒 Privacy & Security

- **Frontend mode**: API key stored in browser localStorage only. Never leaves your device.
- **Backend mode**: API key stored in `.env` file on your server. Add `.env` to `.gitignore`.
- We never collect your data, images, or API keys.

---

## 🎨 Features

- ✦ Google Gemini 2.0 Flash image generation
- 🎨 8 art styles (Realistic, Anime, 3D, Digital Art, etc.)
- 💾 LocalStorage image history (up to 50 images)
- ⬇️ One-click HD download
- 📋 Copy prompt button
- 🔄 Regenerate button
- 🌙 Dark / Light mode toggle
- 📱 Fully responsive (mobile, tablet, desktop)
- 🖼️ Gallery with masonry layout
- 📊 Dashboard with stats
- 👤 Profile with avatar upload

---

## 📄 Pages

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Landing page with features, FAQ, testimonials |
| Generate | `generate.html` | Main image generation tool |
| Gallery | `gallery.html` | Your images + sample showcase |
| Dashboard | `dashboard.html` | Stats & history |
| Profile | `profile.html` | Profile & settings |
| About | `about.html` | About the project |
| Contact | `contact.html` | Contact form |
| Login | `login.html` | Login page |
| Signup | `signup.html` | Signup page |

---

© 2025 PixelMind AI · 100% Free · Powered by Google Gemini