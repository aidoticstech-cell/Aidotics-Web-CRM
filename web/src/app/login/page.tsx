"use client";

import { LoginDashboardPreview } from "@/components/auth/login/LoginDashboardPreview";
import { LoginFormCard } from "@/components/auth/login/LoginFormCard";
import { LoginMarketing } from "@/components/auth/login/LoginMarketing";
import { LoginSiteFooter } from "@/components/auth/login/LoginSiteFooter";
import { LoginSiteHeader } from "@/components/auth/login/LoginSiteHeader";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#faf9fc] via-[#f5f3fa] to-[#ede9f8]">
      <LoginSiteHeader />
      <main className="relative flex-1 overflow-hidden">
        <LoginDashboardPreview />
        <div className="relative z-10 mx-auto grid max-w-[1400px] gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-8 lg:px-8 lg:py-12 xl:gap-12">
          <LoginMarketing />
          <div className="flex justify-center lg:justify-end lg:pt-4">
            <LoginFormCard />
          </div>
        </div>
      </main>
      <LoginSiteFooter />
    </div>
  );
}
