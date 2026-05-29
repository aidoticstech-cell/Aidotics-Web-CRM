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
    <div className="flex items-start gap-4 border-b border-gray-100 px-6 py-6 sm:px-8 sm:py-7">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-soft">
        <Icon className="h-5 w-5 text-violet-accent" />
      </span>
      <div className="min-w-0 pt-0.5">
        <h1 className="page-title !text-xl sm:!text-2xl">{title}</h1>
        <p className="page-subtitle !mt-1.5">{subtitle}</p>
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
      <div className={`grid gap-6 lg:gap-8 ${aside ? "xl:grid-cols-[1fr_300px]" : ""}`}>
        <div className="onboarding-panel overflow-hidden">
          <StepHero icon={icon} title={title} subtitle={subtitle} />
          {tabs && tabs.length > 0 && (
            <div className="border-b border-gray-100 px-6 py-4 sm:px-8">
              <div className="flex flex-wrap items-center gap-2">
                {tabs.map((tab, idx) => {
                  const selected = idx === activeTab;
                  return (
                    <span
                      key={tab}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                        selected
                          ? "border-violet-accent bg-violet-soft text-violet-deep"
                          : "border-gray-200 bg-white text-gray-500"
                      }`}
                    >
                      <span className="text-[10px] opacity-80">{idx + 1}</span>
                      {tab}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
          <div className="p-6 sm:p-8">{children}</div>
        </div>
        {aside && <aside className="space-y-5">{aside}</aside>}
      </div>
      {footer && (
        <div className="mt-8 border-t border-gray-100 pt-6">
          <div className="px-0 sm:px-1">{footer}</div>
        </div>
      )}
    </div>
  );
}

export function AsideCard({ title, children, className = "" }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`crm-card sticky top-6 !p-5 sm:!p-6 ${className}`}>
      {title && <h3 className="section-label">{title}</h3>}
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
    <section className={`mb-8 last:mb-0 ${className}`}>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="section-label">
            {letter && <span className="text-violet-accent">{letter}. </span>}
            {title}
          </h3>
          {subtitle && <p className="section-hint">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
