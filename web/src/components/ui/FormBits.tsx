"use client";

import { ReactNode } from "react";
import { Info } from "lucide-react";

export function Field({
  label,
  required,
  children,
  hint,
  className = "",
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="crm-label">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs leading-relaxed text-gray-500">{hint}</p>}
    </div>
  );
}

export function Section({
  title,
  letter,
  subtitle,
  children,
}: {
  title: string;
  letter?: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-8 last:mb-0">
      <h3 className="section-label">
        {letter && <span className="text-violet-accent">{letter}. </span>}
        {title}
      </h3>
      {subtitle ? <p className="section-hint">{subtitle}</p> : null}
      <div className={subtitle ? "mt-5" : "mt-4"}>{children}</div>
    </section>
  );
}

export function Toggle({
  label,
  description,
  checked,
  onChange,
  showInfo,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  showInfo?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3.5 transition hover:border-gray-200">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-gray-800">{label}</span>
          {showInfo && <Info className="h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden />}
        </div>
        {description && <p className="mt-1.5 text-xs leading-relaxed text-gray-500">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-violet-accent" : "bg-gray-300"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition ${checked ? "translate-x-5" : ""}`}
        />
      </button>
    </div>
  );
}

export function RadioCard({
  name,
  value,
  selected,
  onChange,
  title,
  description,
  icon,
}: {
  name: string;
  value: string;
  selected: boolean;
  onChange: (v: string) => void;
  title: string;
  description?: string;
  icon?: ReactNode;
}) {
  return (
    <label
      className={`flex cursor-pointer gap-3 rounded-xl border-2 p-4 transition ${
        selected ? "border-violet-accent bg-violet-soft/80 shadow-sm ring-1 ring-violet-accent/20" : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <input type="radio" name={name} value={value} checked={selected} onChange={() => onChange(value)} className="mt-1 accent-violet-accent" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          {icon && <span className="shrink-0">{icon}</span>}
          <div>
            <div className="text-sm font-semibold text-gray-900">{title}</div>
            {description && <p className="mt-1.5 text-xs leading-relaxed text-gray-500">{description}</p>}
          </div>
        </div>
      </div>
    </label>
  );
}

export function InfoBox({ title, children, variant = "violet" }: { title?: string; children: ReactNode; variant?: "violet" | "green" | "blue" }) {
  const styles =
    variant === "green"
      ? "border-emerald-100 bg-emerald-50/70"
      : variant === "blue"
        ? "border-sky-100 bg-sky-50/70"
        : "border-violet-100 bg-violet-light/60";
  return (
    <div className={`rounded-xl border p-4 text-sm leading-relaxed text-gray-700 ${styles}`}>
      {title && <div className="mb-2 font-semibold text-gray-900">{title}</div>}
      {children}
    </div>
  );
}
