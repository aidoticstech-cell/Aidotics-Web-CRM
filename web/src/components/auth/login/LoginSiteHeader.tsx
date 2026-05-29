"use client";

import Link from "next/link";
import { Moon } from "lucide-react";
import { AidoticsLogo } from "@/components/brand/AidoticsLogo";

const NAV = ["Features", "Solutions", "Pricing", "Resources", "About Us"];

export function LoginSiteHeader() {
  return (
    <header className="relative z-40 border-b border-gray-200/60 bg-white/90 backdrop-blur-md">
      <div className="page-container flex items-center justify-between gap-4 py-4">
        <Link href="/login" className="block min-w-0 text-left">
          <AidoticsLogo height={40} priority />
          <p className="mt-1 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-[#1b4d2e]">
            Bureau Web CRM
          </p>
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <Link key={item} href="#" className="text-sm font-medium text-gray-600 transition hover:text-violet-accent">
              {item}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
          aria-label="Dark mode (coming soon)"
        >
          <Moon className="h-4 w-4" />
          <span className="hidden sm:inline">Dark Mode</span>
        </button>
      </div>
    </header>
  );
}
