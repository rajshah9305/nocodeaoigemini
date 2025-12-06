import React from 'react';
import { Loader2, Cpu, BrainCircuit, Network, Code2 } from 'lucide-react';

interface NeuralLoaderProps {
  step: string;
  progress?: number;
  error?: string | null;
}

export const NeuralLoader: React.FC<NeuralLoaderProps> = ({ step, progress = 30, error = null }) => {
  const getLoaderIcon = () => {
    const icons = [Loader2, Cpu, BrainCircuit, Network, Code2];
    const index = Math.floor(Math.random() * icons.length);
    return icons[index];
  };

  const LoaderIcon = getLoaderIcon();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white text-gray-900 rounded-[inherit] relative overflow-hidden">
       {/* Background Grid */}
       <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_50%,transparent_50%),linear-gradient(90deg,rgba(0,0,0,0.01),transparent,rgba(0,0,0,0.01))] z-0 bg-[length:100%_2px,3px_100%] pointer-events-none"></div>

       {/* Error State */}
       {error && (
         <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
           <div className="text-center p-6">
             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <span className="text-red-600 text-2xl font-bold">!</span>
             </div>
             <h3 className="text-lg font-bold text-gray-900 mb-2">Build Error</h3>
             <p className="text-red-600 mb-4">{error}</p>
             <button
               onClick={() => window.location.reload()}
               className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
             >
               Retry
             </button>
           </div>
         </div>
       )}

       <div className="relative z-20 flex flex-col items-center w-64 sm:w-72">
          <div className="relative mb-6 sm:mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative">
              <LoaderIcon className="w-12 h-12 sm:w-16 sm:h-16 text-orange-600 animate-spin relative z-10" />
              <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20" />
            </div>
          </div>

          <div className="w-full bg-gray-200 h-2 sm:h-2.5 rounded-full overflow-hidden mb-4 relative">
             <div
               className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 to-red-500 animate-[progress_3s_ease-in-out_infinite]"
               style={{width: `${progress}%`}}
             ></div>
          </div>

          <div className="h-6 sm:h-8 overflow-hidden relative w-full text-center mb-2">
             <div key={step} className="animate-fade-in-up font-mono text-xs sm:text-sm text-orange-600 tracking-[0.2em] font-bold uppercase">
                {step}
             </div>
          </div>

          <div className="text-[10px] sm:text-xs text-gray-500 font-mono animate-pulse">
            <span className="inline-flex items-center gap-1">
              <BrainCircuit className="w-3 h-3 text-orange-500" />
              Neural Network Active - {progress}%
            </span>
          </div>
       </div>
    </div>
  );
};