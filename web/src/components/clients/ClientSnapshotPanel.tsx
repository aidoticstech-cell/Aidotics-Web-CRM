"use client";

import Link from "next/link";
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  UserPlus,
  CalendarPlus,
  IndianRupee,
  ClipboardList,
  ArrowRight,
  Star,
} from "lucide-react";
import { ClientStatusBadge } from "@/components/clients/ClientStatusBadge";
import { DEFAULT_CLIENT_STAFF, type Client } from "@/lib/clients-data";

function formatInr(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export function ClientSnapshotPanel({ client }: { client: Client }) {
  const initials = client.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const staff = DEFAULT_CLIENT_STAFF.slice(0, 2);

  return (
    <aside className="w-full shrink-0 space-y-4 xl:w-[300px]">
      <div className="dash-card sticky top-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900">Client Snapshot</h3>
          <ClientStatusBadge status={client.status} />
        </div>

        <div className="mt-4 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-xl font-bold text-violet-700">{initials}</span>
          <p className="mt-2 text-lg font-bold text-gray-900">{client.name}</p>
          {client.tier === "Premium Client" && (
            <span className="mt-1 inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">{client.tier}</span>
          )}
          <p className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-600">
            <Phone className="h-3 w-3" /> {client.phone}
            <MessageCircle className="h-3 w-3 text-emerald-500" />
          </p>
          <p className="mt-0.5 text-xs text-gray-500">{client.email}</p>
          <p className="mt-1 flex items-start justify-center gap-1 text-[11px] text-gray-500">
            <MapPin className="mt-0.5 h-3 w-3 shrink-0" /> {client.address}
          </p>
        </div>

        <dl className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-xs">
          <div className="flex justify-between"><dt className="text-gray-500">Assigned Coordinator</dt><dd className="font-semibold">{client.coordinator}</dd></div>
          <div className="flex justify-between"><dt className="text-gray-500">Joined Since</dt><dd>{client.joinedDate}</dd></div>
          <div className="flex justify-between"><dt className="text-gray-500">Total Patients</dt><dd className="font-semibold">{client.patientCount}</dd></div>
          <div className="flex justify-between"><dt className="text-gray-500">Total Duties</dt><dd>{client.totalDuties}</dd></div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Outstanding Amount</dt>
            <dd className="font-bold text-red-600">{formatInr(client.outstanding)}</dd>
          </div>
          {client.outstandingDueDays != null && client.outstanding > 0 && (
            <p className="text-right text-[10px] font-semibold text-red-500">Due in {client.outstandingDueDays} days</p>
          )}
          <div className="flex justify-between"><dt className="text-gray-500">Next Renewal Date</dt><dd className="font-semibold">{client.renewalDate}</dd></div>
        </dl>

        {client.primaryService !== "—" && (
          <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50/80 p-3">
            <p className="text-[10px] font-bold uppercase text-gray-500">Current Services</p>
            <p className="mt-1 text-sm font-bold text-gray-900">{client.primaryService}</p>
            <p className="text-[11px] text-gray-500">{client.primaryServiceStart}</p>
            {client.primaryServiceShift && (
              <div className="mt-2 grid grid-cols-2 gap-1 text-[10px] text-gray-600">
                <span>Shift: {client.primaryServiceShift}</span>
                <span>{client.primaryServiceRate}</span>
              </div>
            )}
            {client.primaryServiceMonthly && (
              <p className="mt-1 text-xs font-bold text-violet-accent">{client.primaryServiceMonthly}</p>
            )}
          </div>
        )}

        <div className="mt-4">
          <p className="text-[10px] font-bold uppercase text-gray-500">Current Assigned Staff</p>
          <ul className="mt-2 space-y-2">
            {staff.map((s) => (
              <li key={s.name} className="flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-gray-900">{s.name}</p>
                  <p className="text-[10px] text-gray-500">{s.role}</p>
                </div>
                <div className="text-right">
                  <p className="flex items-center gap-0.5 font-semibold text-amber-600">
                    <Star className="h-3 w-3 fill-amber-400" /> {s.rating}
                  </p>
                  <p className="text-[10px] text-gray-500">{s.attendance}% attendance</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-1.5">
          {[
            { Icon: Phone, label: "Call" },
            { Icon: MessageCircle, label: "WA" },
            { Icon: Mail, label: "Email" },
            { Icon: ArrowRight, label: "View" },
          ].map(({ Icon, label }) => (
            <button key={label} type="button" className="flex flex-col items-center gap-0.5 rounded-lg border border-gray-100 py-2 text-[9px] font-semibold text-gray-600 hover:bg-gray-50">
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        <Link
          href={`/dashboard/clients/details?id=${client.id}`}
          className="btn-primary mt-4 flex w-full !py-2.5 text-sm"
        >
          Open Client Details <ArrowRight className="h-4 w-4" />
        </Link>

        <div className="mt-2 grid grid-cols-3 gap-1.5">
          <button type="button" className="rounded-lg border border-gray-200 py-2 text-[10px] font-semibold text-gray-700 hover:bg-gray-50">
            <ClipboardList className="mx-auto h-3.5 w-3.5" /> Create Duty
          </button>
          <button type="button" className="rounded-lg border border-gray-200 py-2 text-[10px] font-semibold text-gray-700 hover:bg-gray-50">
            <UserPlus className="mx-auto h-3.5 w-3.5" /> Add Patient
          </button>
          <button type="button" className="rounded-lg border border-gray-200 py-2 text-[10px] font-semibold text-gray-700 hover:bg-gray-50">
            <IndianRupee className="mx-auto h-3.5 w-3.5" /> Invoice
          </button>
        </div>
        <button type="button" className="mt-1.5 flex w-full items-center justify-center gap-1 rounded-lg border border-orange-200 bg-orange-50 py-2 text-[10px] font-semibold text-orange-700">
          <CalendarPlus className="h-3.5 w-3.5" /> Extend Service
        </button>
      </div>
    </aside>
  );
}
