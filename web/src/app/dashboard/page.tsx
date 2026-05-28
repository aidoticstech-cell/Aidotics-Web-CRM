"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe, logout, type AuthUser } from "@/lib/auth-api";
import { ONBOARDING_STEPS } from "@/lib/onboarding-steps";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<(AuthUser & { bureauName?: string }) | null>(null);

  useEffect(() => {
    getMe()
      .then((r) => setUser(r.user))
      .catch(() => router.replace("/login"));
  }, [router]);

  if (!user) {
    return <div className="flex min-h-screen items-center justify-center text-gray-500">Loading…</div>;
  }

  const nextItems = ["Add Your Team", "Import Data", "Start Managing Operations", "Track Performance"];
  const quickLinks = ["Go to Dashboard", "Manage Team", "Add Lead", "View Reports", "Help Center", "Video Tutorials"];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-5 py-5">
            <p className="text-xl font-black text-brand-600">Aidotics</p>
            <p className="text-xs font-semibold text-gray-500">BUREAU CRM</p>
          </div>
          <div className="space-y-1 p-4">
            {ONBOARDING_STEPS.map((step, idx) => (
              <div key={step.slug} className={`rounded-xl border px-3 py-2 ${idx === ONBOARDING_STEPS.length - 1 ? "border-violet-accent bg-violet-soft/60" : "border-transparent bg-white"}`}>
                <p className="text-xs font-semibold text-gray-800">
                  {idx + 1}. {step.title}
                </p>
                <p className={`text-[11px] ${idx === ONBOARDING_STEPS.length - 1 ? "text-violet-accent" : "text-emerald-600"}`}>Completed</p>
              </div>
            ))}
          </div>
          <div className="p-4">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
              <p className="text-[11px] text-gray-500">Onboarding Progress</p>
              <div className="mt-2 h-2 rounded-full bg-gray-200">
                <div className="h-2 w-full rounded-full bg-violet-accent" />
              </div>
              <p className="mt-2 text-[11px] font-semibold text-gray-700">8 of 8 steps completed</p>
            </div>
          </div>
        </aside>

        <main className="p-4 lg:p-6">
          <header className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3">
            <div>
              <p className="text-lg font-bold text-gray-900">Bureau Onboarding</p>
              <p className="text-sm font-semibold text-violet-accent">All Steps Completed</p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="btn-outline-purple !py-2 text-xs">Need Help?</button>
              <button
                type="button"
                className="btn-secondary !py-2 text-xs"
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
              >
                Exit Onboarding
              </button>
            </div>
          </header>

          <div className="grid gap-4 xl:grid-cols-[1fr_300px]">
            <div className="space-y-4">
              <section className="rounded-xl border border-gray-200 bg-gradient-to-r from-emerald-50/70 to-violet-soft/40 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-3xl text-white">✓</div>
                  <div>
                    <h1 className="text-3xl font-black text-gray-900">Congratulations! 🎉</h1>
                    <p className="mt-1 text-base font-semibold text-gray-800">Your bureau CRM is ready to launch.</p>
                    <p className="mt-1 text-sm text-gray-500">You&apos;ve successfully completed all onboarding steps. Your account is active and all systems are configured.</p>
                  </div>
                </div>
              </section>

              <div className="grid gap-4 lg:grid-cols-2">
                <section className="rounded-xl border border-gray-200 bg-white p-4">
                  <h2 className="text-lg font-bold text-gray-900">Your Bureau is Ready</h2>
                  <p className="text-xs text-gray-500">Everything is set up and ready for you to start managing your operations.</p>
                  <div className="mt-3 space-y-2">
                    {ONBOARDING_STEPS.map((step) => (
                      <div key={step.slug} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/60 px-3 py-2">
                        <span className="text-sm font-medium text-gray-700">{step.title}</span>
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">Completed</span>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="space-y-4">
                  <section className="rounded-xl border border-gray-200 bg-white p-4">
                    <h2 className="text-lg font-bold text-gray-900">What&apos;s Next?</h2>
                    <p className="text-xs text-gray-500">Start using your CRM and grow your bureau.</p>
                    <ul className="mt-3 space-y-2">
                      {nextItems.map((item) => (
                        <li key={item} className="rounded-lg border border-gray-100 bg-gray-50/60 px-3 py-2 text-sm font-medium text-gray-700">{item}</li>
                      ))}
                    </ul>
                  </section>

                  <section className="rounded-xl border border-gray-200 bg-slate-50/70 p-4">
                    <h2 className="text-base font-bold text-gray-900">Quick Links</h2>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {quickLinks.map((link) => (
                        <button key={link} type="button" className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-left text-xs font-semibold text-violet-accent">
                          {link} →
                        </button>
                      ))}
                    </div>
                  </section>
                </div>
              </div>

              <section className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-lg font-bold text-gray-900">You&apos;re all set to go live!</p>
                  <button type="button" className="btn-primary" onClick={() => router.push("/dashboard")}>
                    Launch My CRM
                  </button>
                </div>
              </section>
            </div>

            <aside className="space-y-4">
              <section className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="text-sm font-bold text-gray-900">Subscription Details</h3>
                <ul className="mt-3 space-y-2 text-xs text-gray-700">
                  <li className="flex justify-between"><span>Plan</span><span className="font-semibold">Professional</span></li>
                  <li className="flex justify-between"><span>Billing</span><span className="font-semibold">Yearly</span></li>
                  <li className="flex justify-between"><span>Staff Limit</span><span className="font-semibold">250 Staff</span></li>
                  <li className="flex justify-between"><span>Branch Limit</span><span className="font-semibold">15 Branches</span></li>
                  <li className="flex justify-between"><span>Next Billing Date</span><span className="font-semibold">15 May 2025</span></li>
                </ul>
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-center text-[11px] font-semibold text-emerald-700">
                  You Saved ₹19,200 with yearly billing!
                </div>
                <button type="button" className="btn-outline-purple mt-3 w-full !py-2 text-xs">View Subscription</button>
              </section>

              <section className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="text-lg font-bold text-violet-accent">Need Help?</h3>
                <p className="mt-1 text-xs text-gray-500">Our onboarding team is here to help you at every step.</p>
                <div className="mt-3 space-y-2">
                  <button type="button" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-left text-xs font-semibold text-gray-700">Chat with us</button>
                  <button type="button" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-left text-xs font-semibold text-gray-700">Schedule a Call</button>
                  <button type="button" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-left text-xs font-semibold text-gray-700">Email Support</button>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
