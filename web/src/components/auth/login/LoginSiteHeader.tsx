"use client";

import Link from "next/link";
import { Moon } from "lucide-react";
import { AidoticsLogo } from "@/components/brand/AidoticsLogo";

const NAV = ["Features", "Solutions", "Pricing", "Resources", "About Us"];

export function LoginSiteHeader() {
  return (
    <header className="relative z-30 border-b border-gray-200/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <AidoticsLogo height={36} priority />
          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Bureau Web CRM</p>
        </div>
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <Link key={item} href="#" className="text-sm font-medium text-gray-600 transition hover:text-violet-accent">
              {item}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
          aria-label="Dark mode (coming soon)"
        >
          <Moon className="h-4 w-4" />
          <span className="hidden sm:inline">Dark Mode</span>
        </button>
      </div>
    </header>
  );
}
