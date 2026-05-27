"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getMe, logout, type AuthUser } from "@/lib/auth-api";

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <span className="text-xl font-bold text-brand-600">aidotics Bureau CRM</span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.bureauName || user.email}</span>
            <button
              type="button"
              className="btn-secondary text-xs"
              onClick={() => {
                logout();
                router.push("/login");
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl p-8">
        <h1 className="text-2xl font-bold">Welcome, {user.fullName}</h1>
        <p className="mt-2 text-gray-500">Your bureau CRM is active. More modules will appear here as we build them out.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link href="/onboarding" className="crm-card block hover:border-violet-accent">
            <h3 className="font-semibold">Resume onboarding</h3>
            <p className="mt-1 text-sm text-gray-500">Review or update setup steps</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
