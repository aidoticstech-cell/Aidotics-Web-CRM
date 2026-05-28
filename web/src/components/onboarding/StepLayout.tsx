"use client";

import type { ComponentType, ReactNode } from "react";

export function StepHero({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-gray-100 px-6 py-5 lg:px-8">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-soft">
        <Icon className="h-5 w-5 text-violet-accent" />
      </span>
      <div>
        <h1 className="text-xl font-bold text-gray-900 lg:text-2xl">{title}</h1>
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}

export function StepLayout({
  icon,
  title,
  subtitle,
  children,
  aside,
  footer,
  tabs,
  activeTab = 0,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  children: ReactNode;
  aside?: ReactNode;
  footer?: ReactNode;
  tabs?: string[];
  activeTab?: number;
}) {
  return (
    <div>
      <div className={`grid gap-6 ${aside ? "xl:grid-cols-[1fr_300px]" : ""}`}>
        <div className="onboarding-panel !overflow-hidden !p-0">
          <StepHero icon={icon} title={title} subtitle={subtitle} />
          {tabs && tabs.length > 0 && (
            <div className="border-b border-gray-100 px-6 py-3 lg:px-8">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {tabs.map((tab, idx) => {
                  const selected = idx === activeTab;
                  return (
                    <span
                      key={tab}
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-semibold ${
                        selected
                          ? "border-violet-accent bg-violet-soft text-violet-deep"
                          : "border-gray-200 bg-white text-gray-500"
                      }`}
                    >
                      <span className="text-[10px]">{idx + 1}</span>
                      {tab}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
          <div className="p-6 lg:p-8">{children}</div>
        </div>
        {aside && <aside className="space-y-4">{aside}</aside>}
      </div>
      {footer && (
        <div className="mt-6 border-t border-gray-100 pt-2">
          <div className="px-1">{footer}</div>
        </div>
      )}
    </div>
  );
}

export function AsideCard({ title, children, className = "" }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`crm-card sticky top-4 !p-5 ${className}`}>
      {title && <h3 className="text-sm font-bold text-gray-900">{title}</h3>}
      <div className={title ? "mt-4" : ""}>{children}</div>
    </div>
  );
}

export function SectionBlock({
  letter,
  title,
  subtitle,
  children,
  action,
  className = "",
}: {
  letter?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <section className={`mb-10 last:mb-0 ${className}`}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-gray-900">
            {letter && <span className="text-violet-accent">{letter}. </span>}
            {title}
          </h3>
          {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
