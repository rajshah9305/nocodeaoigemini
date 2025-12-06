import React, { useState, useEffect, useCallback } from 'react';
import { Settings, Code2, Smartphone, Monitor, RotateCw, Undo2, Redo2, Sparkles, History, Download, Copy, PlayCircle, Loader2, Terminal, AlertTriangle, BrainCircuit } from 'lucide-react';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';
import { ToastContainer, ToastItem } from '../ui/Toast';
import { NeuralLoader } from '../ui/Loader';
import { generateAppCode, GeminiServiceError } from '../../services/geminiService';
import { copyToClipboard, formatErrorMessage } from '../../utils';
import { escapeHtml, syntaxHighlight } from '../../utils/syntaxHighlight';

interface BuilderWorkspaceProps {
  initialPrompt: string;
  apiKey: string;
  goBack: () => void;
  openSettings: () => void;
}

interface LogEntry {
  type: 'info' | 'success' | 'error';
  text: string;
  timestamp: string;
}

interface HistoryEntry {
  code: string;
  prompt: string;
  timestamp: number;
}

export const BuilderWorkspace: React.FC<BuilderWorkspaceProps> = ({ initialPrompt, apiKey, goBack, openSettings }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'logs'>('preview');
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isBuilding, setIsBuilding] = useState(false);
  const [loadingStep, setLoadingStep] = useState('Initializing...');
  const [loadingProgress, setLoadingProgress] = useState(10);
  const [buildError, setBuildError] = useState<string | null>(null);
  const [iframeKey, setIframeKey] = useState(0);
  const [refineInput, setRefineInput] = useState('');
  
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addLog = useCallback((type: 'info' | 'success' | 'error', text: string) => {
    setLogs(prev => {
      const isDuplicate = prev.length > 0 && 
        prev[prev.length - 1].text === text && 
        prev[prev.length - 1].type === type;
      if (isDuplicate) return prev;
      return [...prev, { type, text, timestamp: new Date().toLocaleTimeString() }];
    });
  }, []);

  useEffect(() => {
    if (initialPrompt && history.length === 0) {
      handleBuild(initialPrompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt]);

  useEffect(() => {
    if (!isBuilding) return;

    const steps = [
      { text: 'Establishing Neural Link...', progress: 15 },
      { text: 'Parsing Requirements...', progress: 25 },
      { text: 'Drafting HTML Structure...', progress: 40 },
      { text: 'Injecting Tailwind Classes...', progress: 55 },
      { text: 'Compiling JavaScript Logic...', progress: 70 },
      { text: 'Polishing UI Elements...', progress: 85 },
      { text: 'Finalizing Sandbox...', progress: 95 }
    ];

    let i = 0;
    const interval = setInterval(() => {
      const currentStep = steps[i % steps.length];
      setLoadingStep(currentStep.text);
      setLoadingProgress(currentStep.progress);
      i++;
    }, 1000);

    return () => clearInterval(interval);
  }, [isBuilding]);

  const handleBuild = async (promptText: string, isRefinement = false) => {
    setIsBuilding(true);
    if (!isRefinement && history.length === 0) setActiveTab('logs');

    setLogs([]);
    addLog('info', isRefinement ? `Refining: "${promptText}"...` : `Initializing build: "${promptText}"...`);

    const currentCode = (isRefinement && historyIndex >= 0) ? history[historyIndex].code : null;

    try {
      const newCode = await generateAppCode(promptText, currentCode, apiKey, addLog);

      addLog('success', 'Code synthesized successfully.');
      addLog('info', 'Injecting into secure sandbox...');

      const newEntry = { code: newCode, prompt: promptText, timestamp: Date.now() };
      const newHistory = [...history.slice(0, historyIndex + 1), newEntry];

      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);

      setIframeKey(k => k + 1);
      setRefineInput('');
      setIsBuilding(false);

      if(activeTab === 'logs') setActiveTab('preview');
      addToast('success', 'Build Complete', isRefinement ? 'Application updated successfully.' : 'New application generated.');

    } catch (err: any) {
      let errorMessage = 'Unknown error occurred during build process';

      if (err instanceof GeminiServiceError) {
        errorMessage = err.message;
        if (err.code) {
          errorMessage += ` (Code: ${err.code})`;
        }
        if (err.details) {
          errorMessage += `: ${JSON.stringify(err.details)}`;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      addLog('error', `Build Process Failed: ${errorMessage}`);
      setBuildError(errorMessage);
      setIsBuilding(false);
      addToast('error', 'Build Failed', errorMessage);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setIframeKey(k => k + 1);
      addLog('info', 'Time travel: Reverted to previous version.');
      addToast('info', 'Time Travel', 'Reverted to previous version.');
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setIframeKey(k => k + 1);
      addLog('info', 'Time travel: Returned to newer version.');
       addToast('info', 'Time Travel', 'Restored newer version.');
    }
  };

  const handleDownload = () => {
    const currentCode = history[historyIndex]?.code;
    if (!currentCode) return;

    const blob = new Blob([currentCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forge-app-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    addLog('success', 'Application exported to disk.');
    addToast('success', 'Exported', 'HTML file saved to downloads.');
  };

  const handleCopyCode = async () => {
    const currentCode = history[historyIndex]?.code;
    if (!currentCode) return;

    const success = await copyToClipboard(currentCode);
    if (success) {
        addLog('success', 'Source code copied to clipboard.');
        addToast('success', 'Copied', 'Source code copied to clipboard.');
    } else {
        addLog('error', 'Failed to copy to clipboard.');
        addToast('error', 'Error', 'Failed to copy code.');
    }
  };
  const currentCode = history[historyIndex]?.code || '';

  return (
    <div className="h-[100dvh] flex flex-col bg-white/95 backdrop-blur-sm text-gray-700 font-sans overflow-hidden relative">
      {/* Background visual depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/70 to-white/50 z-0 pointer-events-none"></div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Error Banner - shown when there are critical errors */}
      {logs.some(log => log.type === 'error') && (
        <div className="absolute top-16 left-4 right-4 z-30">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 shadow-lg flex items-center gap-3 animate-fade-in-up">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-bold text-red-700 mb-0.5">BUILD ERROR</p>
              <p className="text-xs text-gray-700">Check logs for details and try again</p>
            </div>
            <button
              onClick={() => setLogs(prev => prev.filter(log => log.type !== 'error'))}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
            >
              <span className="text-sm">×</span>
            </button>
          </div>
        </div>
      )}
      
      {/* --- HEADER --- */}
      <header className="h-14 md:h-16 border-b border-gray-200 bg-white/90 backdrop-blur-md flex items-center justify-between px-2 sm:px-3 md:px-4 z-20 shadow-sm relative shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 overflow-hidden min-w-0">
          <button onClick={goBack} className="hover:text-white transition-colors group shrink-0" title="Back to Home">
            <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-orange-600 to-red-600 group-hover:from-orange-500 group-hover:to-red-500 flex items-center justify-center text-white font-bold shadow-lg transition-transform group-active:translate-y-1 rounded-lg border border-white/10">F</div>
          </button>
          <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>
          <div className="flex flex-col overflow-hidden min-w-0 flex-1">
            <h2 className="text-[10px] md:text-xs font-bold text-gray-600 tracking-wide uppercase truncate" title={history[historyIndex]?.prompt}>
              {history[historyIndex]?.prompt || "Initializing..."}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${isBuilding ? 'bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(234,88,12,0.8)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]'}`}></span>
              <span className="text-[9px] md:text-[10px] font-mono text-gray-700">{isBuilding ? 'BUILDING' : 'READY'}</span>
            </div>
          </div>
        </div>

        {/* Central History Controls */}
        <div className="hidden md:flex items-center gap-1.5 lg:gap-2 bg-gray-100 p-1 rounded-lg border border-gray-200 shadow-sm">
          <Tooltip text="Undo">
            <Button variant="icon" onClick={handleUndo} disabled={historyIndex <= 0}><Undo2 size={14} className="md:w-4 md:h-4"/></Button>
          </Tooltip>
          <span className="text-[10px] lg:text-xs font-mono text-gray-600 min-w-[50px] lg:min-w-[60px] text-center select-none">
            v{historyIndex + 1}/{history.length}
          </span>
          <Tooltip text="Redo">
            <Button variant="icon" onClick={handleRedo} disabled={historyIndex >= history.length - 1}><Redo2 size={14} className="md:w-4 md:h-4"/></Button>
          </Tooltip>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Button 
            variant={isBuilding ? 'secondary' : 'success'} 
            icon={isBuilding ? Loader2 : Download}
            className={`!py-1.5 !px-2 sm:!py-2 sm:!px-3 md:!px-4 !text-[10px] sm:!text-xs ${isBuilding ? 'opacity-70' : ''}`}
            onClick={handleDownload}
            disabled={isBuilding || !currentCode}
          >
            <span className="hidden sm:inline">{isBuilding ? 'Building' : 'Export'}</span>
          </Button>
          <Button 
            variant="dark" 
            onClick={openSettings} 
            icon={Settings} 
            className="!py-1.5 !px-2 sm:!py-2 sm:!px-3 md:!px-4 !text-[10px] sm:!text-xs"
            title="Settings"
          >
            <span className="hidden sm:inline">Settings</span>
          </Button>
        </div>
      </header>

      {/* --- MAIN CONTENT SPLIT --- */}
      <div className="flex-1 flex overflow-hidden z-10 relative">
        
        {/* LEFT PANE: PRIMARY VIEW */}
        <div className="flex-1 flex flex-col relative bg-gray-50 transition-all">
          
          {/* Top Tabs */}
          <div className="flex border-b border-gray-200 bg-white/80 backdrop-blur-sm overflow-x-auto hide-scrollbar">
            {['preview', 'code', 'logs'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`
                  flex-1 md:flex-none px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 text-[10px] sm:text-xs font-mono font-bold flex items-center justify-center gap-1.5 sm:gap-2 border-r border-gray-200 transition-colors min-w-[80px] sm:min-w-[100px]
                  ${activeTab === tab ? 'text-gray-900 bg-white border-t-2 border-t-orange-500' : 'text-gray-500 hover:bg-gray-50'}
                `}
              >
                {tab === 'preview' && <PlayCircle size={12} className="sm:w-3.5 sm:h-3.5" />}
                {tab === 'code' && <Code2 size={12} className="sm:w-3.5 sm:h-3.5" />}
                {tab === 'logs' && <Terminal size={12} className="sm:w-3.5 sm:h-3.5" />}
                <span className="hidden xs:inline">{tab.toUpperCase()}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 relative overflow-hidden bg-transparent">
            
            {/* --- CODE VIEW --- */}
            {activeTab === 'code' && (
               <div className="absolute inset-0 flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                 {/* Terminal Header */}
                 <div className="flex items-center justify-between px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 bg-gray-800/50 border-b border-gray-700/50 backdrop-blur-sm">
                   <div className="flex items-center gap-2 sm:gap-3">
                     <div className="flex gap-1 sm:gap-1.5">
                       <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                       <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]"></div>
                       <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                     </div>
                     <Code2 size={12} className="sm:w-3.5 sm:h-3.5 text-gray-400" />
                     <span className="text-[10px] sm:text-xs font-mono text-gray-400 font-semibold">SOURCE CODE</span>
                   </div>
                   <Button variant="dark" icon={Copy} onClick={handleCopyCode} className="!py-1 !px-2 sm:!py-1.5 sm:!px-3 !text-[10px] sm:!text-xs">Copy</Button>
                 </div>

                 {/* Code Content */}
                 <div className="flex-1 overflow-auto custom-scrollbar">
                   <div className="flex">
                     {/* Line Numbers */}
                     <div className="bg-gray-800/50 border-r border-gray-700/50 text-gray-500 text-right py-4 px-3 select-none min-w-[50px] font-mono text-xs">
                       {currentCode.split('\n').map((_, i) => <div key={i} className="leading-6">{i+1}</div>)}
                     </div>
                     {/* Code */}
                     <pre className="flex-1 p-4 text-gray-300 font-mono text-xs leading-6 overflow-x-auto">
                       <code dangerouslySetInnerHTML={{ __html: syntaxHighlight(escapeHtml(currentCode)) }} />
                     </pre>
                   </div>
                 </div>

                 {/* Terminal Footer */}
                 <div className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gray-800/50 border-t border-gray-700/50 backdrop-blur-sm">
                   <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-gray-500">
                     <span>{currentCode.length} CHARS</span>
                     <span className="hidden sm:inline">READ-ONLY</span>
                   </div>
                 </div>
               </div>
            )}

            {/* --- LOGS VIEW --- */}
            {activeTab === 'logs' && (
              <div className="absolute inset-0 flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                {/* Terminal Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-gray-800/50 border-b border-gray-700/50 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                    </div>
                    <Terminal size={14} className="text-orange-400" />
                    <span className="text-xs font-mono text-orange-400 font-semibold">FORGE TERMINAL</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-gray-400">
                      {logs.length} {logs.length === 1 ? 'log' : 'logs'}
                    </span>
                    <div className={`flex items-center gap-1.5 text-[10px] font-mono ${isBuilding ? 'text-orange-400' : 'text-emerald-400'}`}>
                      <div className={`w-2 h-2 rounded-full ${isBuilding ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500'} shadow-[0_0_8px_currentColor]`}></div>
                      {isBuilding ? 'BUILDING' : 'READY'}
                    </div>
                  </div>
                </div>

                {/* Terminal Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
                  {logs.length === 0 && !isBuilding && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4 animate-fade-in-up">
                      <div className="relative">
                        <Terminal size={64} className="opacity-10" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BrainCircuit size={32} className="text-orange-500/30 animate-pulse" />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-mono mb-1 text-gray-400">Terminal Ready</p>
                        <p className="text-xs text-gray-600">Waiting for build commands...</p>
                      </div>
                    </div>
                  )}
                  
                  {logs.map((l, i) => {
                    const isError = l.type === 'error';
                    const isSuccess = l.type === 'success';
                    const isInfo = l.type === 'info';
                    
                    return (
                      <div 
                        key={i} 
                        className={`
                          group relative flex gap-3 p-3 rounded-lg border transition-all duration-200 animate-fade-in-up hover:translate-x-1 cursor-default
                          ${isError ? 'bg-red-500/5 border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40' : ''}
                          ${isSuccess ? 'bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10 hover:border-emerald-500/40' : ''}
                          ${isInfo ? 'bg-orange-500/5 border-orange-500/20 hover:bg-orange-500/10 hover:border-orange-500/40' : ''}
                        `}
                        style={{animationDelay: `${i * 30}ms`}}
                      >
                        {/* Icon */}
                        <div className="flex-shrink-0 mt-0.5">
                          {isError && (
                            <div className="w-6 h-6 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                              <span className="text-red-400 text-sm font-bold">✕</span>
                            </div>
                          )}
                          {isSuccess && (
                            <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                              <span className="text-emerald-400 text-sm font-bold">✓</span>
                            </div>
                          )}
                          {isInfo && (
                            <div className="w-6 h-6 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
                              <Loader2 size={12} className="text-orange-400 animate-spin" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`
                              text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-widest
                              ${isError ? 'bg-red-500/20 text-red-300 border border-red-500/30' : ''}
                              ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : ''}
                              ${isInfo ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' : ''}
                            `}>
                              {l.type}
                            </span>
                            <span className="text-[9px] font-mono text-gray-500">
                              {l.timestamp}
                            </span>
                          </div>
                          <p className={`text-xs font-mono leading-relaxed break-words ${
                            isError ? 'text-red-300' : isSuccess ? 'text-emerald-300' : 'text-orange-300'
                          }`}>
                            {l.text}
                          </p>
                        </div>

                        {/* Accent Line */}
                        <div className={`
                          absolute left-0 top-0 bottom-0 w-1 rounded-l-lg transition-all duration-200
                          ${isError ? 'bg-red-500/50 group-hover:bg-red-500' : ''}
                          ${isSuccess ? 'bg-emerald-500/50 group-hover:bg-emerald-500' : ''}
                          ${isInfo ? 'bg-orange-500/50 group-hover:bg-orange-500' : ''}
                        `}></div>
                      </div>
                    );
                  })}

                  {/* Live Building Indicator */}
                  {isBuilding && (
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-orange-500/30 bg-orange-500/5 animate-pulse">
                      <div className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center">
                        <Loader2 size={14} className="text-orange-400 animate-spin" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-mono text-orange-300 flex items-center gap-2">
                          <span className="inline-block w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping"></span>
                          Processing neural network response...
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Terminal Footer */}
                <div className="px-4 py-2.5 bg-gray-800/50 border-t border-gray-700/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <div className="flex items-center gap-3">
                      <span className="text-orange-400 font-bold">FORGE.AI</span>
                      <span className="text-gray-600">|</span>
                      <span className="text-gray-500">v3.3.0</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${isBuilding ? 'bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.8)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]'}`}></div>
                      <span className={isBuilding ? 'text-orange-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                        {isBuilding ? 'BUILDING' : 'READY'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- PREVIEW VIEW --- */}
            {activeTab === 'preview' && (
              <div className="absolute inset-0 flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                
                {/* Terminal-style Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-gray-800/50 border-b border-gray-700/50 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                    </div>
                    <PlayCircle size={14} className="text-gray-400" />
                    <span className="text-xs font-mono text-gray-400 font-semibold">LIVE PREVIEW</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tooltip text="Mobile View">
                      <button onClick={() => setDevice('mobile')} className={`p-2 rounded transition-all ${device === 'mobile' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}>
                        <Smartphone size={16} />
                      </button>
                    </Tooltip>
                    <Tooltip text="Desktop View">
                      <button onClick={() => setDevice('desktop')} className={`p-2 rounded transition-all ${device === 'desktop' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}>
                        <Monitor size={16} />
                      </button>
                    </Tooltip>
                    <div className="w-px h-6 bg-gray-700"></div>
                    <Tooltip text="Rotate Device">
                      <button onClick={() => setOrientation(p => p === 'portrait' ? 'landscape' : 'portrait')} className={`p-2 rounded transition-all ${orientation === 'landscape' ? 'text-orange-500' : 'text-gray-400 hover:text-white'} hover:bg-gray-700`}>
                        <RotateCw size={16} />
                      </button>
                    </Tooltip>
                  </div>
                </div>

                {/* Device Emulator Frame */}
                <div className="flex-1 flex items-center justify-center overflow-hidden p-4 md:p-8 custom-scrollbar relative bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_100%)]">
                   <div 
                      className={`
                        transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
                        ${device === 'mobile' ? 'origin-center scale-[0.85] sm:scale-90 md:scale-100' : 'w-full h-full'}
                      `}
                   >
                      <div className={`
                        bg-white relative shadow-[0_0_50px_rgba(0,0,0,0.5)] border-[8px] border-gray-900 ring-2 ring-gray-700 overflow-hidden mx-auto
                        ${device === 'mobile' 
                          ? (orientation === 'portrait' ? 'w-[375px] h-[667px] rounded-[3rem]' : 'w-[667px] h-[375px] rounded-[2rem]')
                          : 'w-full h-full max-w-5xl max-h-[700px] rounded-xl'}
                      `}>
                        {/* Notch for Mobile */}
                        {device === 'mobile' && orientation === 'portrait' && (
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-gray-900 rounded-b-xl z-20 pointer-events-none" />
                        )}

                        {/* Content Area */}
                        {isBuilding ? (
                          <NeuralLoader step={loadingStep} progress={loadingProgress} error={buildError} />
                        ) : buildError ? (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-white p-6">
                            <div className="text-center max-w-md">
                              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="w-8 h-8 text-red-600" />
                              </div>
                              <h3 className="text-lg font-bold text-gray-900 mb-2">Build Failed</h3>
                              <p className="text-red-600 mb-4">{buildError}</p>
                              <div className="flex gap-3 justify-center">
                                <Button
                                  variant="primary"
                                  onClick={() => {
                                    setBuildError(null);
                                    handleBuild(history[historyIndex]?.prompt || '', true);
                                  }}
                                  className="!py-2 !px-4"
                                >
                                  <BrainCircuit className="w-4 h-4 mr-2" />
                                  Retry Build
                                </Button>
                                <Button
                                  variant="secondary"
                                  onClick={() => setBuildError(null)}
                                  className="!py-2 !px-4"
                                >
                                  Dismiss
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <iframe
                            key={iframeKey}
                            srcDoc={currentCode}
                            className="w-full h-full bg-white block border-0"
                            sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin"
                            title="App Preview"
                            style={{ overflow: 'auto' }}
                          />
                        )}
                      </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Constant Refinement Bar */}
          <div className="border-t border-gray-200 bg-white/95 backdrop-blur p-2 sm:p-3 md:p-4 shrink-0 z-40">
            <div className="max-w-4xl mx-auto flex gap-2 items-center">
              <div className="flex-1 relative group min-w-0">
                <div className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors">
                  <Sparkles size={14} className="sm:w-4 sm:h-4" />
                </div>
                <input 
                  type="text" 
                  value={refineInput}
                  onChange={(e) => setRefineInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !isBuilding && refineInput && handleBuild(refineInput, true)}
                  placeholder="Refine app..."
                  className="w-full bg-white border border-gray-300 text-gray-900 pl-8 sm:pl-9 md:pl-10 pr-2 sm:pr-3 md:pr-4 py-2 sm:py-2.5 md:py-3 rounded-lg text-sm md:text-base focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-mono transition-all placeholder:text-gray-400 shadow-sm"
                  disabled={isBuilding}
                />
              </div>
              <Button 
                variant="primary" 
                className="!py-2 !px-3 sm:!py-2.5 sm:!px-4 md:!py-3 md:!px-6 shadow-lg whitespace-nowrap !text-xs sm:!text-sm"
                onClick={() => handleBuild(refineInput, true)}
                disabled={isBuilding || !refineInput}
              >
                <span className="hidden xs:inline">Update</span>
                <span className="xs:hidden">Go</span>
              </Button>
            </div>
          </div>
        </div>

        {/* RIGHT PANE: HISTORY */}
        <div className="hidden lg:flex w-[280px] xl:w-[320px] flex-col border-l border-gray-200 bg-white/90 backdrop-blur-md">
           <div className="p-3 xl:p-4 border-b border-gray-200 font-mono text-[10px] xl:text-xs font-bold text-gray-600 flex items-center gap-2 select-none">
            <History size={12} className="xl:w-3.5 xl:h-3.5" /> TIMELINE
           </div>
           <div className="flex-1 overflow-y-auto custom-scrollbar p-2 xl:p-3 space-y-2 xl:space-y-3">
              {history.length === 0 && <div className="text-center text-gray-500 text-[10px] xl:text-xs py-8 xl:py-10">Timeline empty</div>}
              {history.map((entry, idx) => (
                <div 
                  key={idx}
                  onClick={() => { setHistoryIndex(idx); setIframeKey(k => k+1); }}
                  className={`group relative p-2 xl:p-3 rounded-lg cursor-pointer border transition-all duration-200 ${idx === historyIndex ? 'bg-orange-50 border-orange-500 shadow-[0_0_15px_rgba(234,88,12,0.15)]' : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'}`}
                >
                  <div className="flex justify-between items-center mb-1.5 xl:mb-2">
                    <span className={`text-[8px] xl:text-[9px] font-mono px-1.5 py-0.5 rounded font-bold tracking-wider ${idx === 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                      {idx === 0 ? 'GENESIS' : 'ITER'}
                    </span>
                    <span className="text-[9px] xl:text-[10px] text-gray-500 font-mono">{new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <p className="text-[10px] xl:text-xs text-gray-700 line-clamp-2 leading-relaxed font-medium group-hover:text-gray-900 transition-colors">{entry.prompt}</p>
                  
                  {idx === historyIndex && (
                     <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 xl:w-2 h-6 xl:h-8 bg-orange-500 rounded-l"></div>
                  )}
                </div>
              ))}
           </div>

           <div className="p-2 xl:p-4 border-t border-gray-200 bg-gray-50">
             <div className="text-[9px] xl:text-[10px] text-gray-600 text-center">
               <span className="text-orange-500 font-bold">TIP:</span> <span className="hidden xl:inline">Use arrow keys</span><span className="xl:hidden">Arrows</span> to time travel
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};