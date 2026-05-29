"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AidoticsLogo } from "@/components/brand/AidoticsLogo";
import { ApiError } from "@/lib/api";
import { register } from "@/lib/auth-api";
import { fetchOnboarding } from "@/lib/onboarding-api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    bureauCode: "",
    bureauName: "",
    fullName: "",
    email: "",
    password: "",
    mobile: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function set(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register({
        ...form,
        bureauCode: form.bureauCode.trim(),
        bureauName: form.bureauName.trim(),
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        mobile: form.mobile.trim() || undefined,
      });
    } catch (err) {
      if (err instanceof ApiError && err.status === 0) {
        setError(`${err.message} If the API is running, check Next.js API_URL / port 4100.`);
      } else if (err instanceof ApiError && err.status === 409) {
        setError("That email is already registered. Try signing in instead.");
      } else if (err instanceof ApiError) {
        setError(err.message || `Registration failed (${err.status})`);
      } else {
        setError(err instanceof Error ? err.message : "Registration failed");
      }
      setLoading(false);
      return;
    }

    try {
      const onboarding = await fetchOnboarding();
      if (onboarding.isComplete) {
        router.replace("/dashboard");
        return;
      }
      const slug = onboarding.currentStepSlug || "profile_verification";
      router.replace(`/onboarding/${slug}`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError("Account may have been created but session expired. Try signing in.");
      } else if (err instanceof ApiError && err.status === 0) {
        setError(`Account created, but onboarding could not load: ${err.message}`);
      } else {
        setError(
          err instanceof Error
            ? `Account created, but setup redirect failed: ${err.message}`
            : "Account created, but setup redirect failed."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <div className="auth-card max-w-lg">
        <div className="text-left">
          <AidoticsLogo height={44} priority />
          <p className="page-eyebrow mt-2 !text-[#1b4d2e]">Bureau Web CRM</p>
        </div>
        <h1 className="page-title mt-6">Create your bureau account</h1>
        <p className="page-subtitle">You&apos;ll complete an 8-step setup wizard right after registration.</p>

        <form onSubmit={handleSubmit} className="form-stack mt-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="crm-label">Bureau code</label>
              <input
                className="crm-input"
                value={form.bureauCode}
                onChange={(e) => set("bureauCode", e.target.value)}
                placeholder="DELHI-NCR-01"
                required
              />
            </div>
            <div>
              <label className="crm-label">Bureau name</label>
              <input className="crm-input" value={form.bureauName} onChange={(e) => set("bureauName", e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="crm-label">Your full name</label>
            <input className="crm-input" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} required />
          </div>
          <div>
            <label className="crm-label">Work email</label>
            <input className="crm-input" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
          </div>
          <div>
            <label className="crm-label">Mobile (optional)</label>
            <input className="crm-input" value={form.mobile} onChange={(e) => set("mobile", e.target.value)} />
          </div>
          <div>
            <label className="crm-label">Password</label>
            <input
              className="crm-input"
              type="password"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              minLength={8}
              required
            />
            <p className="mt-1.5 text-xs text-gray-500">Minimum 8 characters</p>
          </div>
          {error && <p className="alert-error">{error}</p>}
          <button type="submit" className="btn-primary w-full !py-3.5" disabled={loading}>
            {loading ? "Creating…" : "Create account & start setup"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-violet-accent hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
