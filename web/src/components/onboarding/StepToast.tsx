"use client";

export function StepToast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[90] max-w-sm rounded-xl border border-gray-200 bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-lg">
      {message}
    </div>
  );
}
