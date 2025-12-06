import React from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export interface ToastItem {
  id: number;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  removeToast: (id: number) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
   return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div 
          key={toast.id} 
          className="pointer-events-auto flex items-center gap-3 p-4 min-w-[300px] bg-white border border-gray-200 text-gray-900 rounded-lg shadow-lg animate-slide-in-right ring-1 ring-gray-100"
        >
          {toast.type === 'success' && <CheckCircle className="text-emerald-500" size={20} />}
          {toast.type === 'error' && <XCircle className="text-red-500" size={20} />}
          {toast.type === 'info' && <Info className="text-blue-500" size={20} />}
          <div className="flex-1">
            <h4 className="font-bold text-xs uppercase tracking-wider mb-0.5 text-gray-900">{toast.title}</h4>
            <p className="text-xs text-gray-600">{toast.message}</p>
          </div>
          <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-gray-600">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};