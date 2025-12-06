# 🚀 Setup Instructions

## Quick Setup (3 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure API Key
```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:
```
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

Get your API key: https://makersuite.google.com/app/apikey

### 3. Start Development
```bash
npm run dev
```

Open: http://localhost:3003

## Production Build

```bash
npm run build
npm run preview
```

## Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variable: `VITE_GEMINI_API_KEY`
4. Deploy

Or use one-click deploy:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/forge-ai)

## Troubleshooting

**Build fails?**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**API key not working?**
- Ensure it starts with `AIzaSy`
- Check it's enabled in Google Cloud Console
- Verify it has Gemini API access

**Port 3003 in use?**
Edit `vite.config.ts` and change the port number.

## Project Structure

```
forge-ai/
├── components/       # React components
├── services/         # API services
├── utils/            # Helper functions
├── types/            # TypeScript types
├── public/           # Static assets
├── App.tsx           # Main app
├── index.tsx         # Entry point
└── vite.config.ts    # Build config
```

## Support

- GitHub Issues: https://github.com/yourusername/forge-ai/issues
- Email: support@forge.ai
