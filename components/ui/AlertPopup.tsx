// @/components/ui/AlertPopup.tsx
"use client";

import { AlertTriangle } from "lucide-react";

interface AlertPopupProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export default function AlertPopup({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = "Hapus", 
  cancelText = "Batal",
  isLoading = false
}: AlertPopupProps) {
  
  if (!isOpen) return null;

  return (
    <div className="modal modal-open modal-bottom sm:modal-middle bg-base-300/60 backdrop-blur-sm z-50">
      <div className="modal-box rounded-[2rem] border border-base-content/5 shadow-2xl">
        <h3 className="font-black text-xl flex items-center gap-3 uppercase tracking-tight">
          <div className="bg-error/10 p-2 rounded-xl">
            <AlertTriangle className="text-error" size={24} />
          </div>
          {title}
        </h3>
        
        <p className="py-6 text-sm opacity-80 font-medium">
          {message}
        </p>
        
        <div className="modal-action mt-0">
          <button 
            onClick={onCancel} 
            disabled={isLoading}
            className="btn btn-ghost rounded-xl font-bold uppercase text-xs"
          >
            {cancelText}
          </button>
          
          <button 
            onClick={onConfirm} 
            disabled={isLoading}
            className="btn btn-error shadow-lg shadow-error/30 rounded-xl font-black text-white uppercase text-xs w-28"
          >
            {isLoading ? <span className="loading loading-spinner loading-xs"></span> : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}