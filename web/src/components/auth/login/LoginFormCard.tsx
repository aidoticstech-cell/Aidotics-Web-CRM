"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react";
import { AidoticsLogo } from "@/components/brand/AidoticsLogo";
import { ApiError } from "@/lib/api";
import { login } from "@/lib/auth-api";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function MicrosoftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path fill="#f25022" d="M1 1h10v10H1z" />
      <path fill="#00a4ef" d="M13 1h10v10H13z" />
      <path fill="#7fba00" d="M1 13h10v10H1z" />
      <path fill="#ffb900" d="M13 13h10v10H13z" />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.05 20.28c-.98.95-2.05 1.88-3.51 1.88-1.39 0-1.81-.82-3.39-.82-1.57 0-2.04.8-3.32.88-1.33.08-2.34-1.24-3.22-2.19-1.76-2.03-3.1-5.74-1.31-8.25.88-1.28 2.45-2.09 4.15-2.11 1.3-.02 2.52.88 3.32.88.78 0 2.26-1.09 3.81-.93.65.03 2.47.26 3.64 1.98-3.09 1.69-2.58 6.08.98 7.58zM14.03 3.5c.73-.89 1.22-2.12 1.09-3.35-1.05.04-2.32.7-3.08 1.59-.68.78-1.27 2.04-1.11 3.24 1.18.09 2.38-.6 3.1-1.48z" />
    </svg>
  );
}

export function LoginFormCard() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    const saved = localStorage.getItem("crm_remember_email");
    if (saved) setEmail(saved);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email.trim(), password);
      if (remember && typeof window !== "undefined") {
        localStorage.setItem("crm_remember_email", email.trim());
      }
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
    <div className="relative z-20 w-full max-w-[420px] shrink-0">
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_24px_60px_-12px_rgba(92,47,192,0.18)] sm:p-9">
        <div className="flex justify-center">
          <AidoticsLogo height={48} priority centered />
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">Welcome Back!</h2>
        <p className="mt-1 text-center text-sm text-gray-500">Sign in to your Aidotics CRM account</p>

        <div className="mt-6 flex border-b border-gray-200">
          <button
            type="button"
            onClick={() => setTab("signin")}
            className={`flex-1 pb-3 text-sm font-semibold transition ${
              tab === "signin" ? "border-b-2 border-violet-accent text-violet-accent" : "text-gray-400"
            }`}
          >
            Sign In
          </button>
          <Link
            href="/register"
            className={`flex flex-1 items-center justify-center pb-3 text-sm font-semibold transition ${
              tab === "signup" ? "border-b-2 border-violet-accent text-violet-accent" : "text-gray-400"
            }`}
          >
            Sign Up
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="crm-label">Email Address</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                className="crm-input !pl-10"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>
          <div>
            <label className="crm-label">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                className="crm-input !pl-10 !pr-10"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-violet-accent focus:ring-violet-accent/30"
              />
              Remember me
            </label>
            <button type="button" className="text-sm font-semibold text-violet-accent hover:underline">
              Forgot Password?
            </button>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" className="btn-primary w-full !py-3.5" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <p className="relative mx-auto w-fit bg-white px-3 text-xs text-gray-400">or continue with</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Google", Icon: GoogleIcon },
            { label: "Microsoft", Icon: MicrosoftIcon },
            { label: "Apple", Icon: AppleIcon },
          ].map(({ label, Icon }) => (
            <button
              key={label}
              type="button"
              disabled
              title="Coming soon"
              className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white py-2.5 text-xs font-semibold text-gray-600 opacity-60"
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          New to Aidotics?{" "}
          <Link href="/register" className="font-semibold text-violet-accent hover:underline">
            Create your account
          </Link>
        </p>
      </div>
    </div>
  );
}
