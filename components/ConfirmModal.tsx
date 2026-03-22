"use client";

import React from "react";
import { X, AlertTriangle, HelpCircle, CheckCircle2, Info } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "success" | "info";
  isLoading?: boolean;
  showCancel?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
  isLoading = false,
  showCancel = true,
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          icon: <AlertTriangle className="text-rose-500" size={32} />,
          button: "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20",
          bg: "bg-rose-50",
        };
      case "success":
        return {
          icon: <CheckCircle2 className="text-emerald-500" size={32} />,
          button: "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20",
          bg: "bg-emerald-50",
        };
      case "info":
        return {
          icon: <Info className="text-blue-500" size={32} />,
          button: "bg-blue-500 hover:bg-blue-600 shadow-blue-500/20",
          bg: "bg-blue-50",
        };
      default:
        return {
          icon: <HelpCircle className="text-amber-500" size={32} />,
          button: "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20",
          bg: "bg-amber-50",
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={isLoading ? undefined : onClose}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className={`w-14 h-14 rounded-2xl ${styles.bg} flex items-center justify-center`}>
              {styles.icon}
            </div>
            <button 
              onClick={onClose}
              disabled={isLoading}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <h3 className="text-2xl font-bold text-slate-900 mb-2">{title}</h3>
          <p className="text-slate-600 leading-relaxed mb-8">
            {message}
          </p>
          
          <div className="flex items-center gap-3">
            {showCancel && (
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-6 py-3 rounded-2xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all duration-300 disabled:opacity-50"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 px-6 py-3 rounded-2xl font-bold text-white transition-all duration-300 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 ${styles.button}`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
