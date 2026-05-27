"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  Headphones,
  X,
  Building2,
  Shield,
  Landmark,
  CreditCard,
  SlidersHorizontal,
  CalendarClock,
  Bot,
  Users,
  Fingerprint,
  UserCog,
  Lock,
  Share2,
  GitBranch,
  Globe,
  Wallet,
  PartyPopper,
} from "lucide-react";
import type { OnboardingState, StepView } from "@/lib/onboarding-api";
import { TOTAL_STEPS } from "@/lib/onboarding-steps";
import { AidoticsLogo } from "@/components/brand/AidoticsLogo";

const STEP_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  bureau_profile: Building2,
  kyc_verification: Shield,
  branch_billing: Landmark,
  payment_collection: CreditCard,
  operating_style: SlidersHorizontal,
  duty_operations: CalendarClock,
  responsibility_automation: Bot,
  staff_skill_matrix: Users,
  workforce_setup: Users,
  digital_identity: Fingerprint,
  team_roles: UserCog,
  permission_matrix: Lock,
  partner_network: Share2,
  workflow_builder: GitBranch,
  public_profile: Globe,
  subscription: Wallet,
  crm_ready: PartyPopper,
};

export function OnboardingShell({
  state,
  children,
  stepTitle,
  stepDescription,
}: {
  state: OnboardingState;
  children: React.ReactNode;
  stepTitle: string;
  stepDescription?: string;
}) {
  const router = useRouter();
  const current = state.steps.find((s) => s.isCurrent) || state.steps[0];
  const CurrentIcon = STEP_ICONS[current?.slug || ""] || Building2;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-200/80 bg-white px-4 py-4 shadow-sm sm:px-6">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <AidoticsLogo />
            <div className="flex shrink-0 items-center gap-2">
              <button type="button" className="btn-secondary !gap-1.5 !px-3 !py-2 text-xs sm:!px-4">
                <Headphones className="h-4 w-4 text-gray-500" />
                <span className="hidden sm:inline">Need Help?</span>
              </button>
              <button type="button" onClick={() => router.push("/login")} className="btn-secondary !gap-1.5 !px-3 !py-2 text-xs sm:!px-4">
                <X className="h-4 w-4 text-gray-500" />
                <span className="hidden sm:inline">Save & Exit</span>
              </button>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-800">
              Bureau Onboarding
            </p>
            <p className="text-xs text-gray-500">Step {current?.order} of {TOTAL_STEPS}</p>
            <div className="mx-auto mt-3 flex max-w-3xl items-center justify-center gap-0.5 overflow-x-auto pb-1 sm:gap-1">
              {state.steps.map((s, i) => (
                <div key={s.slug} className="flex items-center">
                  <StepDot step={s} />
                  {i < state.steps.length - 1 && (
                    <div
                      className={`mx-0.5 h-0.5 w-2 shrink-0 rounded sm:w-3 ${s.status === "completed" ? "bg-emerald-400" : "bg-gray-200"}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1440px] flex-1 gap-0 px-3 py-4 sm:px-4 lg:px-6">
        <aside className="hidden w-[280px] shrink-0 pr-4 lg:block xl:w-[300px]">
          <div className="sticky top-4 space-y-4">
            <div className="sidebar-step-active">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20">
                  <CurrentIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-white/80">Step {current?.order} of {TOTAL_STEPS}</p>
                  <p className="mt-0.5 text-base font-bold leading-snug">{stepTitle}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/85">{stepDescription || current?.description}</p>
                </div>
              </div>
            </div>

            <nav className="rounded-xl border border-gray-100 bg-white p-2 shadow-sm">
              {state.steps.map((s) => (
                <SidebarItem key={s.slug} step={s} />
              ))}
            </nav>

            <div className="rounded-xl border border-violet-100 bg-violet-soft/80 p-4">
              <div className="flex items-center gap-2 text-violet-deep">
                <Headphones className="h-5 w-5" />
                <p className="text-sm font-bold">Need Assistance?</p>
              </div>
              <p className="mt-1 text-xs text-gray-600">Our team can help you complete setup.</p>
              <button type="button" className="btn-primary mt-3 w-full !py-2.5 text-xs">
                Contact Support
              </button>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

function StepDot({ step }: { step: StepView }) {
  const done = step.status === "completed";
  const current = step.isCurrent;
  return (
    <div
      title={step.title}
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition sm:h-8 sm:w-8 sm:text-xs ${
        done
          ? "bg-emerald-500 text-white shadow-sm"
          : current
            ? "bg-violet-accent text-white shadow-md ring-4 ring-violet-accent/25"
            : "border border-gray-200 bg-white text-gray-400"
      }`}
    >
      {done ? <Check className="h-4 w-4" strokeWidth={3} /> : step.order}
    </div>
  );
}

function SidebarItem({ step }: { step: StepView }) {
  const done = step.status === "completed";
  const current = step.isCurrent;
  const locked = !step.isAccessible;
  const Icon = STEP_ICONS[step.slug];

  const inner = (
    <div
      className={`flex items-start gap-3 rounded-lg px-2 py-2.5 text-sm ${
        current
          ? "bg-violet-soft font-semibold text-violet-deep"
          : locked
            ? "cursor-not-allowed text-gray-300"
            : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center">
        {done ? (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </span>
        ) : current ? (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-accent text-xs font-bold text-white shadow-sm">
            {step.order}
          </span>
        ) : (
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-xs text-gray-400">
            {step.order}
          </span>
        )}
      </span>
      <span className="flex min-w-0 flex-1 items-start gap-2">
        {Icon && !locked && <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />}
        <span className="leading-snug">{step.title}</span>
      </span>
    </div>
  );

  if (locked) return <div className="block opacity-70">{inner}</div>;
  return (
    <Link href={`/onboarding/${step.slug}`} className="block">
      {inner}
    </Link>
  );
}
