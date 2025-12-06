import React from 'react';
import { Settings, X, AlertTriangle, Check } from 'lucide-react';
import { Button } from '../ui/Button';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  setApiKey: (key: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, apiKey, setApiKey }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200 p-4">
      <div className="bg-white w-full max-w-md border border-gray-200 shadow-xl rounded-xl overflow-hidden ring-1 ring-gray-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <h3 className="text-gray-900 font-mono font-bold text-lg flex items-center gap-2">
            <Settings size={18} className="text-orange-600" /> SYSTEM CONFIGURATION
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={20}/></button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-mono text-gray-700 uppercase tracking-wider font-bold">Google Gemini API Key</label>
            <div className="relative group">
              <input 
                type="password" 
                value={apiKey} 
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 px-4 py-3 font-mono text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-lg transition-all shadow-sm placeholder:text-gray-400"
              />
              <div className="absolute right-3 top-3.5 w-2 h-2 rounded-full bg-gray-300 group-focus-within:bg-orange-500 transition-colors"></div>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Your API key is used directly to communicate with Google's servers. 
              It is stored locally in your browser and never sent to our backend.
            </p>
          </div>

          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg flex gap-3">
             <AlertTriangle size={18} className="text-orange-600 shrink-0 mt-0.5" />
             <div className="text-xs text-orange-800 leading-relaxed">
               <strong>Model:</strong> <code className="text-orange-900 bg-white border border-orange-200 px-1.5 py-0.5 rounded text-[11px] font-mono">gemini-2.5-flash-preview-09-2025</code> <br/>Ensure your key has access to the Vertex AI or Gemini API.
             </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <Button variant="primary" onClick={onClose} icon={Check}>
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
};