"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api";
import { login } from "@/lib/auth-api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email.trim(), password);
      router.push("/onboarding");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError("Invalid email or password.");
      } else if (err instanceof ApiError && err.status === 0) {
        setError(err.message);
      } else if (err instanceof ApiError) {
        setError(err.message || `Sign-in failed (${err.status})`);
      } else {
        setError(err instanceof Error ? err.message : "Login failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 bg-gradient-to-br from-brand-600 to-brand-800 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="text-2xl font-bold">aidotics</p>
          <p className="mt-2 text-brand-100">Bureau CRM</p>
        </div>
        <div>
          <h1 className="text-3xl font-bold leading-tight">Manage your care bureau in one place</h1>
          <p className="mt-4 text-brand-100">Partners, duties, workforce, and billing — connected to Aidotics.</p>
        </div>
      </div>
      <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <p className="text-2xl font-bold text-brand-600 lg:hidden">aidotics</p>
          <h2 className="mt-8 text-2xl font-bold">Sign in</h2>
          <p className="mt-1 text-sm text-gray-500">Access your bureau CRM portal</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="crm-label">Email</label>
              <input className="crm-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="crm-label">Password</label>
              <input className="crm-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-500">
            New bureau?{" "}
            <Link href="/register" className="font-semibold text-violet-accent hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
