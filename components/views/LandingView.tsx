import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Zap, ArrowRight, Mic, MicOff, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

interface LandingViewProps {
  onStart: (prompt: string) => void;
  hasKey: boolean;
  openSettings: () => void;
}

// Extend Window interface for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const LandingView: React.FC<LandingViewProps> = ({ onStart, hasKey, openSettings }) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev ? `${prev} ${transcript}` : transcript);
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) return; 
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) onStart(input);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col relative overflow-hidden font-sans text-gray-900 selection:bg-orange-500/30">
      
      {/* Header */}
      <header className="relative z-10 w-full border-b border-white/20 bg-white/10 backdrop-blur-xl shadow-lg flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-3 md:py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-orange-600 via-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-lg md:text-xl rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 shrink-0">F</div>
            <span className="font-black text-xl md:text-2xl tracking-tighter text-white drop-shadow-lg">FORGE.AI</span>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
             {!hasKey && (
              <button onClick={openSettings} className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs font-mono font-bold text-red-700 bg-gradient-to-r from-red-100 to-red-50 px-2.5 py-1.5 md:px-3 md:py-2 rounded-full border-2 border-red-300 hover:bg-red-200 hover:border-red-400 transition-all shadow-sm hover:shadow-md animate-pulse whitespace-nowrap">
                <AlertTriangle size={12} className="animate-bounce" />
                <span className="hidden sm:inline">CONFIGURE API</span>
                <span className="sm:hidden">API</span>
              </button>
             )}
             <span className="hidden md:block text-xs font-mono font-semibold text-white bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/30 shadow-lg">v3.3.0</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex flex-col justify-center items-center px-4 sm:px-5 md:px-6 lg:px-8 w-full mx-auto">
        <div className="mb-6 sm:mb-7 md:mb-8 lg:mb-10 text-center space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 w-full flex flex-col items-center max-w-6xl">

           <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-md text-white rounded-full text-[10px] sm:text-[11px] md:text-xs font-mono border-2 border-white/30 shadow-lg hover:shadow-xl transition-all animate-fade-in-up">
             <Zap size={12} className="text-amber-300 fill-amber-300 animate-pulse" />
             <span className="tracking-wider font-bold">NEURAL ARCHITECT ONLINE</span>
           </div>

           <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tighter leading-[0.85] animate-fade-in-up max-w-4xl mx-auto px-2 sm:px-4 drop-shadow-2xl" style={{animationDelay: '100ms'}}>
             <span className="text-white block">IMAGINE.</span>
             <span className="text-amber-300 block animate-float">CONSTRUCT.</span>
             <span className="text-white block">DEPLOY.</span>
           </h1>

           <p className="max-w-xl sm:max-w-2xl mx-auto text-sm sm:text-base md:text-lg lg:text-xl text-white font-medium leading-relaxed animate-fade-in-up px-2 sm:px-4 drop-shadow-lg" style={{animationDelay: '200ms'}}>
             Instantaneously generate single-file web applications using advanced Gemini neural models.
             <span className="block mt-2 text-white/80 text-xs sm:text-sm md:text-base lg:text-lg font-normal">No build steps. No boilerplate. Pure creation.</span>
           </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-auto px-3 sm:px-4 relative group animate-fade-in-up" style={{animationDelay: '300ms'}}>

           {/* Glow Effect behind input */}
           <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-amber-400 to-cyan-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 group-focus-within:opacity-60 transition duration-500"></div>

           <div className="relative flex items-center bg-white/95 backdrop-blur-xl border-2 border-white/40 rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-xl sm:shadow-2xl overflow-hidden group-focus-within:border-white/60 group-hover:shadow-2xl sm:group-hover:shadow-3xl transition-all">
            
            <div className="pl-3 md:pl-4 text-gray-400 flex-shrink-0">
              <Sparkles size={18} className="text-orange-500 md:w-5 md:h-5" />
            </div>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your app..."
              className="flex-1 bg-transparent px-2 sm:px-3 py-2.5 sm:py-3 md:px-4 md:py-4 text-sm sm:text-base md:text-lg outline-none text-gray-900 placeholder:text-gray-400 font-medium w-full min-w-0"
              autoFocus
              aria-label="Application description input"
            />
            
            {recognitionRef.current && (
              <button 
                type="button" 
                onClick={toggleVoice}
                className={`p-2 md:p-2.5 mr-1 md:mr-2 rounded-xl transition-all border border-transparent flex-shrink-0 ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse border-red-500/30' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}
                title="Voice Input"
              >
                {isListening ? <MicOff size={18} className="md:w-5 md:h-5" /> : <Mic size={18} className="md:w-5 md:h-5" />}
              </button>
            )}

            <Button onClick={handleSubmit} icon={ArrowRight} className="!py-2.5 !px-4 sm:!py-3 sm:!px-5 md:!py-3.5 md:!px-7 !text-xs sm:!text-sm md:!text-base !rounded-lg sm:!rounded-xl !shadow-lg hover:!shadow-xl sm:hover:!shadow-2xl !border-0 bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 hover:from-orange-500 hover:via-orange-400 hover:to-red-500 text-white flex-shrink-0 transition-all duration-300 hover:scale-105 active:scale-95 font-bold">
              <span className="hidden xs:inline sm:hidden">Go</span>
              <span className="hidden sm:inline md:hidden">Generate</span>
              <span className="hidden md:inline">Generate App</span>
            </Button>
          </div>
        </form>

      </main>

      {/* Footer - Relative positioning to flow with content */}
      <footer className="mt-auto w-full py-3 sm:py-4 md:py-5 text-center text-white/80 text-[8px] sm:text-[9px] md:text-[10px] font-mono font-semibold border-t border-white/20 bg-white/10 backdrop-blur-xl z-10 tracking-wider flex-shrink-0 px-2">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
          <span className="opacity-80">POWERED BY</span>
          <span className="text-amber-300 font-bold">GOOGLE GEMINI</span>
          <span className="opacity-80 hidden sm:inline">•</span>
          <span className="opacity-80">CLIENT-SIDE GENERATION</span>
          <span className="opacity-60 text-[7px] sm:text-[8px] mt-1 sm:mt-0">v3.3.0 • ENTERPRISE EDITION</span>
        </div>
      </footer>
    </div>
  );
};