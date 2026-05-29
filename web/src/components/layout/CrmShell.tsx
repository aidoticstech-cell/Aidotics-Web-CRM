"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  Megaphone,
  Plus,
  Bell,
  MessageSquare,
  Search,
  Calendar,
} from "lucide-react";
import { AidoticsLogo } from "@/components/brand/AidoticsLogo";
import { CRM_NAV } from "@/components/layout/crm-nav";
import type { AuthUser } from "@/lib/auth-api";

export function CrmShell({
  user,
  onSignOut,
  children,
}: {
  user: AuthUser & { bureauName?: string };
  onSignOut: () => void;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [leadsOpen, setLeadsOpen] = useState(pathname.startsWith("/dashboard/leads"));
  const displayName = user.fullName?.split(" ")[0] || "Admin";
  const roleLabel = user.role === "owner" ? "Super Admin" : user.role || "Admin";

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <div className="min-h-screen bg-[#eef1f8]">
      <div className="flex min-h-screen">
        <aside className="hidden w-[248px] shrink-0 flex-col bg-[#0b1230] text-white lg:flex">
          <div className="border-b border-white/10 px-5 py-5">
            <AidoticsLogo height={34} onDarkSurface />
            <p className="mt-2 text-[10px] font-bold tracking-[0.2em] text-white/60">BUREAU WEB CRM</p>
          </div>
          <nav className="flex-1 space-y-0.5 overflow-y-auto p-2.5">
            {CRM_NAV.map((item) => {
              const Icon = item.Icon;
              if (item.children) {
                const groupActive = item.children.some((c) => isActive(c.href));
                return (
                  <div key={item.label}>
                    <button
                      type="button"
                      onClick={() => setLeadsOpen((o) => !o)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition ${
                        groupActive ? "bg-white/10 text-white" : "text-white/75 hover:bg-white/10"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </span>
                      {leadsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                    {leadsOpen && (
                      <div className="ml-3 mt-0.5 space-y-0.5 border-l border-white/10 pl-2">
                        {item.children.map((child) => {
                          const active = isActive(child.href);
                          const ChildIcon = child.Icon;
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-medium transition ${
                                active ? "bg-violet-600 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
                              }`}
                            >
                              {ChildIcon && <ChildIcon className="h-3.5 w-3.5" />}
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }
              const active = item.href ? isActive(item.href) : false;
              if (item.href) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium transition ${
                      active ? "bg-violet-600 text-white shadow-md" : "text-white/75 hover:bg-white/10"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              }
              return (
                <button
                  key={item.label}
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-white/75 hover:bg-white/10"
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 opacity-50" />
                </button>
              );
            })}
          </nav>
          <div className="p-3">
            <div className="rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 p-4 shadow-lg">
              <div className="flex items-center gap-2">
                <Megaphone className="h-4 w-4" />
                <p className="text-sm font-bold">Need Staff Urgently?</p>
              </div>
              <p className="mt-1 text-[11px] text-white/85">Broadcast your requirement to available staff.</p>
              <button
                type="button"
                onClick={() => router.push("/dashboard/leads")}
                className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg bg-white py-2 text-xs font-bold text-violet-700"
              >
                <Plus className="h-3.5 w-3.5" />
                Broadcast Requirement
              </button>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-gray-200/80 bg-white px-4 py-3 shadow-sm lg:px-6">
            <div className="flex flex-wrap items-center justify-end gap-2">
              <button type="button" className="hidden items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 sm:inline-flex">
                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                May 12, 2025
              </button>
              <button type="button" className="hidden rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 sm:inline-block">
                All Branches ▾
              </button>
              <button type="button" className="rounded-lg border border-gray-200 bg-white p-2 text-gray-500">
                <Search className="h-4 w-4" />
              </button>
              <button type="button" className="relative rounded-lg border border-gray-200 bg-white p-2 text-gray-500">
                <Bell className="h-4 w-4" />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">12</span>
              </button>
              <button type="button" className="relative rounded-lg border border-gray-200 bg-white p-2 text-gray-500">
                <MessageSquare className="h-4 w-4" />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[9px] font-bold text-white">5</span>
              </button>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white py-1.5 pl-1.5 pr-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                  {displayName.slice(0, 2).toUpperCase()}
                </span>
                <div className="hidden text-left sm:block">
                  <p className="text-xs font-bold text-gray-900">{displayName}</p>
                  <p className="text-[10px] text-gray-500">{roleLabel}</p>
                </div>
              </div>
              <button type="button" className="btn-secondary !py-2 text-xs" onClick={onSignOut}>
                Sign out
              </button>
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
