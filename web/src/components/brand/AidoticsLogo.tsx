export function AidoticsLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
        <circle cx="16" cy="16" r="15" fill="#F3EEFB" />
        <path
          d="M16 6c-1.2 2.4-3.6 4-6 4.8 2.4.8 4.8 2.4 6 4.8 1.2-2.4 3.6-4 6-4.8-2.4-.8-4.8-2.4-6-4.8Z"
          fill="#5c2fc0"
        />
        <path
          d="M16 10.5c-.9 1.8-2.7 3-4.5 3.6 1.8.6 3.6 1.8 4.5 3.6.9-1.8 2.7-3 4.5-3.6-1.8-.6-3.6-1.8-4.5-3.6Z"
          fill="#2d8a4e"
        />
        <circle cx="16" cy="16" r="2.5" fill="#5c2fc0" />
      </svg>
      <span className="text-xl font-extrabold tracking-tight">
        <span className="text-[#2d8a4e]">aid</span>
        <span className="text-brand-600">otics</span>
      </span>
    </div>
  );
}
