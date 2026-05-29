"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Phone,
  MessageCircle,
  Mail,
  FileText,
  IndianRupee,
  CalendarPlus,
  UserPlus,
  ClipboardList,
  Megaphone,
  AlertTriangle,
  MapPin,
  ArrowLeft,
  Pencil,
} from "lucide-react";
import { ClientStatusBadge } from "@/components/clients/ClientStatusBadge";
import {
  CLIENT_DETAIL_TABS,
  ClientDetailsTabContent,
} from "@/components/clients/ClientDetailsTabContent";
import { MOCK_CLIENTS, type Client } from "@/lib/clients-data";

function formatInr(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

const QUICK_ICONS = [
  { Icon: Phone, label: "Call", color: "bg-sky-100 text-sky-700" },
  { Icon: MessageCircle, label: "WhatsApp", color: "bg-emerald-100 text-emerald-700" },
  { Icon: Mail, label: "Email", color: "bg-violet-100 text-violet-700" },
  { Icon: FileText, label: "Invoice", color: "bg-amber-100 text-amber-700" },
  { Icon: IndianRupee, label: "Payment", color: "bg-green-100 text-green-700" },
  { Icon: CalendarPlus, label: "Extend", color: "bg-orange-100 text-orange-700" },
  { Icon: UserPlus, label: "Patient", color: "bg-cyan-100 text-cyan-700" },
  { Icon: ClipboardList, label: "Duty", color: "bg-indigo-100 text-indigo-700" },
  { Icon: Megaphone, label: "Broadcast", color: "bg-pink-100 text-pink-700" },
  { Icon: AlertTriangle, label: "Escalate", color: "bg-red-100 text-red-700" },
];

export function ClientDetailsPage() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");
  const [clients] = useState(MOCK_CLIENTS);
  const [tab, setTab] = useState<(typeof CLIENT_DETAIL_TABS)[number]>("Overview");

  const client = useMemo(() => {
    if (idParam) return clients.find((c) => c.id === idParam || c.clientId === idParam) ?? clients[0];
    return clients[0];
  }, [clients, idParam]);

  if (!client) {
    return (
      <div className="state-center p-8">
        <p>Client not found.</p>
        <Link href="/dashboard/clients" className="btn-primary mt-4">Back to Client List</Link>
      </div>
    );
  }

  const initials = client.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const patientTabLabel = `Patients (${client.patientCount})`;
  const ratingsTabLabel = `Ratings & Feedback (6)`;

  const tabLabels: Record<(typeof CLIENT_DETAIL_TABS)[number], string> = {
    Overview: "Overview",
    Patients: patientTabLabel,
    "Service History": "Service History",
    Payments: "Payments",
    Documents: "Documents",
    Communication: "Communication",
    Notes: "Notes",
    Timeline: "Timeline",
    "Ratings & Feedback": ratingsTabLabel,
    Agreements: "Agreements",
  };

  return (
    <div className="flex min-h-full flex-col pb-20">
      <div className="p-4 lg:p-6">
        <nav className="mb-2 text-xs text-gray-500">
          <Link href="/dashboard/clients" className="hover:text-violet-accent">Clients & Patients</Link>
          <span className="mx-1.5">›</span>
          <span className="font-medium text-gray-800">Client Details</span>
        </nav>

        <Link href="/dashboard/clients" className="mb-4 inline-flex items-center gap-1 text-xs font-semibold text-violet-accent hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Client List
        </Link>

        <div className="onboarding-panel overflow-hidden">
          <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-5">
            <div className="flex flex-wrap items-start gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-xl font-bold text-violet-700">{initials}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
                  {client.tier === "Premium Client" && (
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">{client.tier}</span>
                  )}
                  <ClientStatusBadge status={client.status} />
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  {client.clientId} · {client.phone} · {client.email}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="h-3 w-3" /> {client.address}
                </p>
              </div>
              <button type="button" className="btn-secondary !gap-1.5 !py-2 text-xs">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-10">
              {QUICK_ICONS.map(({ Icon, label, color }) => (
                <button key={label} type="button" className={`flex flex-col items-center gap-1 rounded-xl p-2 text-[9px] font-semibold ${color}`}>
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <section className="grid gap-3 border-b border-gray-100 bg-white p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {[
              { label: "Active Services", value: String(client.activeServices) },
              { label: "Total Patients", value: String(client.patientCount) },
              { label: "Active Duties", value: String(client.activeDuties) },
              { label: "Outstanding Dues", value: formatInr(client.outstanding), sub: client.outstandingDueDays ? `Due in ${client.outstandingDueDays} days` : undefined, warn: client.outstanding > 0 },
              { label: "Renewal Due", value: client.renewalDate, sub: `In ${client.renewalInDays} days` },
              { label: "Satisfaction Score", value: `${client.satisfaction} / 5`, sub: "Good", good: true },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-gray-100 bg-gray-50/50 p-3">
                <p className="text-[10px] font-semibold text-gray-500">{s.label}</p>
                <p className={`mt-0.5 text-lg font-bold ${s.warn ? "text-red-600" : "text-gray-900"}`}>{s.value}</p>
                {s.sub && <p className={`text-[10px] font-medium ${s.good ? "text-emerald-600" : s.warn ? "text-red-500" : "text-gray-500"}`}>{s.sub}</p>}
              </div>
            ))}
          </section>

          <div className="flex gap-1 overflow-x-auto border-b border-gray-100 px-4">
            {CLIENT_DETAIL_TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`shrink-0 border-b-2 px-3 py-3 text-xs font-semibold whitespace-nowrap ${
                  tab === t ? "border-violet-accent text-violet-accent" : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {tabLabels[t]}
              </button>
            ))}
          </div>

          <div className="grid gap-5 p-6 xl:grid-cols-[1fr_280px]">
            <ClientDetailsTabContent client={client} tab={tab} />

            <aside className="space-y-4">
              <div className="dash-card">
                <h3 className="dash-card-title">Client Health</h3>
                <ul className="mt-2 space-y-2 text-xs">
                  <li className="flex justify-between"><span className="text-gray-500">Renewal</span><span className="font-semibold">{client.renewalDate}</span></li>
                  <li className="flex justify-between"><span className="text-gray-500">Dues</span><span className="font-bold text-red-600">{formatInr(client.outstanding)}</span></li>
                  <li className="flex justify-between"><span className="text-gray-500">Active services</span><span>{client.activeServices}</span></li>
                  <li className="flex justify-between"><span className="text-gray-500">Coordinator</span><span className="font-semibold">{client.coordinator}</span></li>
                </ul>
              </div>
              <div className="dash-card">
                <h3 className="dash-card-title">Quick Actions</h3>
                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  {QUICK_ICONS.slice(0, 8).map(({ Icon, label }) => (
                    <button key={label} type="button" className="flex items-center gap-1.5 rounded-lg border border-gray-100 px-2 py-2 text-[10px] font-semibold text-gray-700 hover:bg-gray-50">
                      <Icon className="h-3.5 w-3.5" /> {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="dash-card">
                <h3 className="dash-card-title">Client Notes Summary</h3>
                <ul className="mt-2 space-y-1.5 text-xs text-gray-600">
                  <li className="flex justify-between"><span>Coordinator Notes</span><span className="font-bold">7</span></li>
                  <li className="flex justify-between"><span>Medical Notes</span><span className="font-bold">5</span></li>
                  <li className="flex justify-between"><span>Billing Notes</span><span className="font-bold">3</span></li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white px-4 py-3 shadow-lg lg:left-[248px]">
        <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-2">
          <button type="button" className="btn-primary !py-2.5 text-sm"><ClipboardList className="h-4 w-4" /> Create Duty</button>
          <button type="button" className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white"><IndianRupee className="mr-1 inline h-4 w-4" /> Record Payment</button>
          <button type="button" className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white"><CalendarPlus className="mr-1 inline h-4 w-4" /> Extend Service</button>
          <button type="button" className="rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white"><UserPlus className="mr-1 inline h-4 w-4" /> Add Patient</button>
          <Link href="/dashboard/clients" className="btn-secondary !py-2.5 text-sm">Close</Link>
        </div>
      </div>
    </div>
  );
}
