import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200 p-4">
      <div className="bg-white w-full max-w-sm border border-gray-200 shadow-xl rounded-xl overflow-hidden ring-1 ring-gray-100">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4 text-orange-600">
             <AlertCircle size={24} />
             <h3 className="font-bold text-lg text-gray-900">{title}</h3>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">{message}</p>
        </div>
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
           <Button variant="secondary" onClick={onCancel}>Cancel</Button>
           <Button variant="primary" onClick={onConfirm}>Confirm</Button>
        </div>
      </div>
    </div>
  );
};