import React, { useState, useEffect, useCallback } from 'react';
import { GlobalStyles } from './components/GlobalStyles';
import { LandingView } from './components/views/LandingView';
import { BuilderWorkspace } from './components/views/BuilderWorkspace';
import { SettingsModal } from './components/modals/SettingsModal';
import { ConfirmationModal } from './components/modals/ConfirmationModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { formatErrorMessage } from './utils';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'workspace'>('landing');
  const [prompt, setPrompt] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Persistent API Key
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('forge_api_key') || '';
  });

  const [appError, setAppError] = useState<string | null>(null);

  // Sync API Key to LocalStorage
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('forge_api_key', apiKey);
    } else {
      localStorage.removeItem('forge_api_key');
    }
  }, [apiKey]);

  const handleError = useCallback((error: Error) => {
    const errorMessage = formatErrorMessage(error);
    setAppError(errorMessage);
    console.error('Application error:', error);
  }, []);

  const handleStart = (userPrompt: string) => {
    if (!apiKey) {
      setShowSettings(true);
      return;
    }

    if (!userPrompt || userPrompt.trim().length === 0) {
      setAppError('Prompt cannot be empty');
      return;
    }

    setPrompt(userPrompt);
    setView('workspace');
  };

  const requestGoBack = () => {
    setShowConfirm(true);
  };

  const confirmGoBack = () => {
    setShowConfirm(false);
    setView('landing');
    setPrompt('');
  };

  return (
    <ErrorBoundary onError={handleError}>
      <GlobalStyles />

      {/* Animated Background Layers */}
      <div className="animated-bg-overlay" />
      <div className="mesh-gradient" />

      {view === 'landing' ? (
        <LandingView
          onStart={handleStart}
          hasKey={!!apiKey}
          openSettings={() => setShowSettings(true)}
        />
      ) : (
        <BuilderWorkspace
          initialPrompt={prompt}
          apiKey={apiKey}
          goBack={requestGoBack}
          openSettings={() => setShowSettings(true)}
        />
      )}

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        apiKey={apiKey}
        setApiKey={setApiKey}
      />

      <ConfirmationModal
        isOpen={showConfirm}
        title="Reset Session?"
        message="Going back will clear your current generated code and history. This action cannot be undone."
        onConfirm={confirmGoBack}
        onCancel={() => setShowConfirm(false)}
      />

      {/* Error Notification */}
      {appError && (
        <div className="fixed bottom-4 left-4 z-50">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 shadow-lg max-w-xs">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
              <div>
                <p className="text-xs font-bold text-red-700 mb-1">ERROR</p>
                <p className="text-xs text-gray-700">{appError}</p>
              </div>
              <button
                onClick={() => setAppError(null)}
                className="text-gray-400 hover:text-gray-600 ml-auto flex-shrink-0"
              >
                <span className="text-sm">×</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
};

export default App;