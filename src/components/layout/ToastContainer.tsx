import React from 'react';
import { useFinance, ToastMessage } from '../../context/FinanceContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useFinance();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast: ToastMessage) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl transition-all duration-300 animate-in slide-in-from-bottom-3 ${
            toast.type === 'success'
              ? 'bg-[#0e2118]/90 border-[#00f59b]/40 text-emerald-100'
              : toast.type === 'warning'
              ? 'bg-[#291712]/90 border-rose-500/40 text-rose-100'
              : 'bg-[#151a2e]/90 border-cyan-500/40 text-cyan-100'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#00f59b]" />}
            {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-rose-400" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-cyan-400" />}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold tracking-tight text-white">{toast.title}</h4>
            <p className="text-xs text-white/80 mt-0.5 leading-relaxed">{toast.message}</p>
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="text-white/60 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
