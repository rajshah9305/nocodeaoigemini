import React from 'react';

export const GlobalStyles: React.FC = () => (
  <style>{`
    /* Base Styles & Reset */
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root {
      width: 100%;
      height: 100%;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
    }

    /* Theme Variables */
    :root {
      --color-primary: 249, 115, 22; /* orange-500 */
      --color-secondary: 16, 185, 129; /* emerald-500 */
      --color-danger: 239, 68, 68; /* red-500 */
      --color-warning: 251, 146, 60; /* amber-500 */
      --color-info: 59, 130, 246; /* blue-500 */
      --color-dark: 31, 41, 55; /* gray-900 */
      --color-light: 243, 244, 246; /* gray-100 */
    }

    /* Gradient Background - Professional Theme */
    html, body, #root {
      background: linear-gradient(135deg,
        rgba(var(--color-primary), 0.8) 0%,
        rgba(var(--color-secondary), 0.6) 50%,
        rgba(var(--color-info), 0.7) 100%);
      background-size: 400% 400%;
      animation: gradient-shift 20s ease infinite;
    }

    @keyframes gradient-shift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    /* Animated Background Layers */
    .animated-bg-overlay {
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      background:
        radial-gradient(circle at 15% 65%, rgba(var(--color-primary), 0.2) 0%, transparent 50%),
        radial-gradient(circle at 85% 35%, rgba(var(--color-warning), 0.2) 0%, transparent 50%),
        radial-gradient(circle at 50% 80%, rgba(var(--color-info), 0.2) 0%, transparent 50%);
      animation: float-orbs 25s ease-in-out infinite alternate;
    }

    @keyframes float-orbs {
      0% { opacity: 0.4; transform: scale(1) rotate(0deg); }
      50% { opacity: 0.7; transform: scale(1.05) rotate(2deg); }
      100% { opacity: 0.4; transform: scale(1) rotate(-2deg); }
    }

    /* Mesh Gradient - Professional Grid */
    .mesh-gradient {
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      background:
        linear-gradient(45deg, rgba(255,255,255,0.02) 1px, transparent 1px),
        linear-gradient(-45deg, rgba(255,255,255,0.02) 1px, transparent 1px);
      background-size: 60px 60px;
      animation: mesh-pulse 30s linear infinite;
    }

    @keyframes mesh-pulse {
      0%, 100% { opacity: 0.8; }
      50% { opacity: 1; }
    }

    /* Enhanced Animations */
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); filter: blur(4px); }
      to { opacity: 1; transform: translateY(0); filter: blur(0); }
    }

    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; filter: blur(8px); }
      to { transform: translateX(0); opacity: 1; filter: blur(0); }
    }

    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 15px rgba(var(--color-primary), 0.2); }
      50% { box-shadow: 0 0 30px rgba(var(--color-primary), 0.4); }
    }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      25% { transform: translateY(-8px) rotate(1deg); }
      75% { transform: translateY(-4px) rotate(-1deg); }
    }

    /* Animation Classes */
    .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.215, 0.61, 0.355, 1) forwards; }
    .animate-slide-in-right { animation: slideInRight 0.6s cubic-bezier(0.215, 0.61, 0.355, 1) forwards; }
    .animate-text-shimmer {
      background: linear-gradient(90deg,
        rgba(var(--color-primary), 1) 0%,
        rgba(var(--color-warning), 1) 25%,
        rgba(var(--color-secondary), 1) 50%,
        rgba(var(--color-warning), 1) 75%,
        rgba(var(--color-primary), 1) 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shimmer 5s linear infinite;
    }
    .animate-float { animation: float 10s ease-in-out infinite; }
    .animate-pulse-slow { animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

    /* Professional UI Components */
    .glass-panel {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(16px) saturate(180%);
      -webkit-backdrop-filter: blur(16px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      border-radius: 12px;
    }

    .glass-panel-dark {
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    /* Enhanced Scrollbars */
    .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(243, 244, 246, 0.8);
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, rgba(var(--color-primary), 0.6), rgba(var(--color-secondary), 0.6));
      border-radius: 6px;
      border: 2px solid rgba(255, 255, 255, 0.5);
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, rgba(var(--color-primary), 0.8), rgba(var(--color-secondary), 0.8));
    }

    /* Dark mode scrollbars */
    .dark .custom-scrollbar::-webkit-scrollbar-track { background: rgba(31, 41, 55, 0.8); }
    .dark .custom-scrollbar::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, rgba(var(--color-primary), 0.4), rgba(var(--color-secondary), 0.4));
    }

    /* Code Editor Enhancements */
    .code-editor {
      font-family: 'Fira Code', 'Monaco', 'Menlo', 'Consolas', monospace;
      font-variant-ligatures: contextual;
    }

    .code-line-numbers {
      user-select: none;
      color: rgba(var(--color-info), 0.6);
      font-variant-numeric: tabular-nums;
    }

    /* Grid Patterns */
    .bg-grid-pattern {
      background-image:
        linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
      background-size: 50px 50px;
    }

    .bg-dot-pattern {
      background-image: radial-gradient(circle, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
      background-size: 20px 20px;
    }

    /* Professional Typography */
    h1, h2, h3, h4, h5, h6 {
      font-weight: 700;
      letter-spacing: -0.02em;
      line-height: 1.2;
    }

    .font-mono {
      font-family: 'Fira Code', 'SF Mono', 'Roboto Mono', 'Courier New', monospace;
      font-variant-ligatures: contextual;
    }

    /* Focus States - Professional Accessibility */
    :focus-visible {
      outline: 2px solid rgba(var(--color-primary), 0.8);
      outline-offset: 2px;
      box-shadow: 0 0 0 4px rgba(var(--color-primary), 0.2);
    }

    /* Transition Effects */
    .transition-pro {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Button Enhancements */
    .btn-glow {
      position: relative;
      overflow: hidden;
    }

    .btn-glow::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: inherit;
      filter: blur(10px) opacity(0.3);
      z-index: -1;
      transition: opacity 0.3s;
    }

    .btn-glow:hover::after {
      opacity: 0.5;
    }

    /* Responsive Utilities */
    @media (max-width: 768px) {
      .mobile-hidden { display: none !important; }
      .mobile-only { display: block !important; }
    }

    @media (min-width: 769px) {
      .desktop-hidden { display: none !important; }
      .desktop-only { display: block !important; }
    }

    /* Print Styles */
    @media print {
      .no-print { display: none !important; }
      body { background: white !important; color: black !important; }
    }
  `}</style>
);