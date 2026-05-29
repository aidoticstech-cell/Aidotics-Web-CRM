"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

export function FormModal({
  open,
  title,
  children,
  onClose,
  onSubmit,
  submitLabel = "Save",
  wide,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  onSubmit: () => void;
  submitLabel?: string;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/40" aria-label="Close" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative max-h-[90vh] w-full overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-xl ${wide ? "max-w-2xl" : "max-w-md"}`}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" className="btn-secondary !py-2 text-sm" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn-primary !py-2 text-sm" onClick={onSubmit}>
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
