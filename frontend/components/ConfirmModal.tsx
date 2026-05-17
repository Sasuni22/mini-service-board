'use client';

import { AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen, title, message,
  confirmLabel = 'Confirm',
  onConfirm, onCancel, isLoading = false,
}: Props) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-[420px] rounded-2xl bg-white shadow-2xl overflow-hidden animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Body */}
        <div className="p-7">
          {/* Warning icon */}
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          <h2 className="text-[17px] font-bold text-slate-900">{title}</h2>
          <p className="mt-2 text-[13px] leading-relaxed text-slate-500">{message}</p>
        </div>

        {/* Footer — light grey background matching design */}
        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-7 py-4">
          <button onClick={onCancel} className="btn-outline" disabled={isLoading}>
            Cancel
          </button>
          <button onClick={onConfirm} className="btn-danger-solid" disabled={isLoading}>
            {isLoading ? 'Deleting…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
