"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api";
import { fetchOnboarding } from "@/lib/onboarding-api";

export default function OnboardingIndexPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    fetchOnboarding()
      .then((s) => {
        if (s.isComplete) {
          router.replace("/dashboard");
          return;
        }
        const current = s.steps.find((x) => x.isCurrent) || s.steps[0];
        router.replace(`/onboarding/${current.slug}`);
      })
      .catch((e) => {
        if (e instanceof ApiError && e.status === 401) {
          router.replace("/login");
          return;
        }
        const msg = e instanceof Error ? e.message : "Could not load onboarding";
        setError(msg);
      });
  }, [router]);

  if (error) {
    return (
      <div className="state-center min-h-screen">
        <p className="alert-error max-w-md">{error}</p>
        <p className="max-w-md text-sm leading-relaxed text-gray-500">
          If you just signed in, this is usually the API not running or the Next.js proxy (API_URL) pointing at the wrong host — not a bad password.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button type="button" className="btn-primary" onClick={() => router.refresh()}>
            Retry
          </button>
          <button type="button" className="btn-secondary" onClick={() => router.replace("/login")}>
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="state-center min-h-screen text-sm text-gray-500">Redirecting to your setup…</div>
  );
}
