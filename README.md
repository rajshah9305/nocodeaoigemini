# 🔥 Forge.AI - Neural Application Generator

![Version](https://img.shields.io/badge/version-3.3.0-orange)
![License](https://img.shields.io/badge/license-MIT-blue)
![React](https://img.shields.io/badge/React-19.2-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6)

**Enterprise-Grade AI-Powered Web Application Builder**

Forge.AI leverages Google Gemini's advanced neural networks to instantly create functional web applications from natural language descriptions.

## ✨ Features

- 🚀 **Instant Generation** - Create complete web apps from simple prompts
- 📦 **Single-File Output** - Self-contained HTML with embedded CSS/JS
- 🔄 **Neural Refinement** - Iteratively improve with natural language
- ⏱️ **Time Travel** - Undo/redo with full version history
- 📱 **Multi-Device Preview** - Mobile and desktop emulation
- 🎨 **Modern UI** - Professional, accessible, responsive interface
- 🔒 **Secure** - Client-side only, API keys stored locally
- ⚡ **Fast** - Built with Vite for optimal performance

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Google Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/forge-ai.git
cd forge-ai

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env and add: VITE_GEMINI_API_KEY=your_api_key_here

# Start development server
npm run dev
```

Open http://localhost:3003

## 📦 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/forge-ai)

1. Click "Deploy" button
2. Connect GitHub account
3. Add environment variable: `VITE_GEMINI_API_KEY` (optional)
4. Deploy

### Manual Build

```bash
npm run build
npm run preview
```

Deploy the `dist` folder to any static hosting provider.

## 🎯 Usage

1. Enter prompt: "Create a todo app with dark mode"
2. Click Generate or use voice input
3. Preview the generated application
4. Refine with additional prompts
5. Export as HTML file

## 🏗️ Project Structure

```
forge-ai/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── views/           # Main application views
│   ├── modals/          # Modal dialogs
│   ├── ErrorBoundary.tsx
│   └── GlobalStyles.tsx
├── services/            # API services
│   └── geminiService.ts
├── utils/               # Utility functions
│   └── index.ts
├── types/               # TypeScript definitions
│   └── index.ts
├── App.tsx              # Main application
├── index.tsx            # Entry point
└── vite.config.ts       # Vite configuration
```

## 🔧 Configuration

Create `.env` file:

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

## 🎨 Tech Stack

- React 19.2
- TypeScript 5.8
- Vite 6.2
- Tailwind CSS (CDN)
- Lucide React
- Google Gemini 2.5 Flash

## 🔒 Security

- Client-side only (no backend)
- API keys stored in browser localStorage
- Sandboxed iframe previews
- Security headers enabled
- Input validation

## 📊 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini for AI capabilities
- React team for the framework
- Lucide for icons
- Tailwind CSS for styling

## 📞 Support

- Issues: [GitHub Issues](https://github.com/yourusername/forge-ai/issues)
- Email: support@forge.ai

---

**Forge.AI © 2025** - Building the future of web development.

Made with ❤️ by the Forge.AI Team
