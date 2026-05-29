"use client";

import { LoginDashboardPreview } from "@/components/auth/login/LoginDashboardPreview";
import { LoginFormCard } from "@/components/auth/login/LoginFormCard";
import { LoginMarketing } from "@/components/auth/login/LoginMarketing";
import { LoginSiteFooter } from "@/components/auth/login/LoginSiteFooter";
import { LoginSiteHeader } from "@/components/auth/login/LoginSiteHeader";

export default function LoginPage() {
  return (
    <div className="auth-shell flex min-h-screen flex-col">
      <LoginSiteHeader />
      <main className="relative flex-1 overflow-x-hidden">
        <div className="page-container relative z-10 grid grid-cols-1 items-start gap-10 py-8 sm:py-10 lg:grid-cols-[minmax(0,480px)_minmax(0,1fr)_auto] lg:gap-8 xl:grid-cols-[minmax(0,520px)_minmax(280px,1fr)_420px] xl:gap-10">
          {/* Left: marketing — stays left-aligned, never under the dashboard image */}
          <div className="relative z-20 min-w-0 text-left">
            <LoginMarketing />
          </div>

          {/* Center: dashboard image only in the gutter between columns */}
          <div className="relative z-0 hidden min-h-[320px] items-start justify-center lg:flex lg:justify-start xl:pl-0">
            <div className="absolute left-0 top-4 w-[min(100%,680px)] xl:-left-8">
              <LoginDashboardPreview />
            </div>
          </div>

          {/* Right: sign-in card */}
          <div className="relative z-30 flex justify-center lg:justify-end">
            <LoginFormCard />
          </div>
        </div>
      </main>
      <LoginSiteFooter />
    </div>
  );
}
