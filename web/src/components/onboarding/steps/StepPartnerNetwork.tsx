"use client";

import { Share2, Plus, Eye, Pencil, MoreVertical } from "lucide-react";
import { Field, Toggle } from "@/components/ui/FormBits";
import { AsideCard, SectionBlock, StepLayout } from "@/components/onboarding/StepLayout";
import type { StepProps } from "./types";

const CATEGORIES = [
  { id: "verify", label: "Verification Partners", desc: "eKYC and document checks", on: true },
  { id: "pay", label: "Payment Partners", desc: "Gateways and collections", on: true },
  { id: "logistics", label: "Logistics Partners", desc: "Delivery and field ops", on: true },
  { id: "data", label: "Data Providers", desc: "External data sources", on: false },
  { id: "service", label: "Service Partners", desc: "Agencies and vendors", on: false },
  { id: "tech", label: "Technology Partners", desc: "APIs and integrations", on: false },
];

const PARTNERS = [
  { name: "IDVerify Solutions", cat: "Verification", services: "eKYC, Document Verification", status: "Connected", sync: "2 min ago" },
  { name: "PayFast Gateway", cat: "Payment", services: "UPI, Cards, Net Banking", status: "Connected", sync: "5 min ago" },
  { name: "LogiTrack Services", cat: "Logistics", services: "Staff dispatch, routing", status: "Pending", sync: "—" },
  { name: "DataSync API", cat: "Data", services: "Analytics feed", status: "Disconnected", sync: "—" },
];

export function StepPartnerNetwork({ data, onChange, footer }: StepProps) {
  const cats = (data.categories as string[]) || CATEGORIES.filter((c) => c.on).map((c) => c.id);

  return (
    <StepLayout
      icon={Share2}
      title="Partner Network Integration"
      subtitle="Connect and manage third-party partners, agencies and service providers."
      footer={footer}
      aside={
        <>
          <AsideCard title="Integration Health">
            <div className="text-center">
              <p className="text-3xl font-black text-emerald-600">85%</p>
              <p className="text-xs text-gray-500">Healthy</p>
            </div>
            <ul className="mt-4 space-y-1 text-xs">
              <li className="flex justify-between"><span className="text-emerald-600">Connected</span><span>3</span></li>
              <li className="flex justify-between"><span className="text-amber-600">Pending</span><span>1</span></li>
              <li className="flex justify-between"><span className="text-gray-500">Disconnected</span><span>1</span></li>
            </ul>
          </AsideCard>
          <AsideCard title="Recent Activity">
            <ul className="space-y-3 text-xs text-gray-600">
              <li><strong>IDVerify:</strong> Data synced successfully · 2m ago</li>
              <li><strong>PayFast:</strong> Payment webhook received · 15m ago</li>
              <li><strong>LogiTrack:</strong> Connection pending approval · 1h ago</li>
            </ul>
          </AsideCard>
          <AsideCard title="Benefits" className="border-emerald-100 bg-emerald-50/50">
            <ul className="space-y-1 text-xs text-emerald-900">
              {["Seamless data exchange", "Reduced manual work", "Better partner visibility"].map((t) => (
                <li key={t}>✓ {t}</li>
              ))}
            </ul>
          </AsideCard>
        </>
      }
    >
      <SectionBlock letter="A" title="Partner Categories" subtitle="Select the partner categories you want to enable.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => {
            const on = cats.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onChange({ categories: on ? cats.filter((x) => x !== c.id) : [...cats, c.id] })}
                className={`relative rounded-xl border-2 p-4 text-left ${on ? "border-violet-accent bg-violet-soft/40" : "border-gray-200"}`}
              >
                <input type="checkbox" checked={on} readOnly className="absolute right-3 top-3 accent-violet-accent" />
                <p className="text-sm font-bold">{c.label}</p>
                <p className="mt-1 text-xs text-gray-500">{c.desc}</p>
              </button>
            );
          })}
        </div>
      </SectionBlock>

      <SectionBlock
        letter="B"
        title="Connected Partners"
        action={<button type="button" className="btn-outline-purple !py-1.5 text-xs"><Plus className="mr-1 inline h-3 w-3" />Add Partner</button>}
      >
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead className="bg-gray-50 text-[10px] font-bold uppercase text-gray-500">
              <tr>
                <th className="px-3 py-3">Partner Name</th>
                <th className="px-3 py-3">Category</th>
                <th className="px-3 py-3">Services</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Last Synced</th>
                <th className="px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {PARTNERS.map((p) => (
                <tr key={p.name} className="border-t border-gray-100">
                  <td className="px-3 py-2.5 font-semibold">{p.name}</td>
                  <td className="px-3 py-2.5"><span className="rounded-full bg-violet-soft px-2 py-0.5 text-violet-deep">{p.cat}</span></td>
                  <td className="px-3 py-2.5 text-gray-500">{p.services}</td>
                  <td className="px-3 py-2.5">
                    <span className={`inline-flex items-center gap-1 ${p.status === "Connected" ? "text-emerald-600" : p.status === "Pending" ? "text-amber-600" : "text-gray-400"}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${p.status === "Connected" ? "bg-emerald-500" : p.status === "Pending" ? "bg-amber-500" : "bg-gray-400"}`} />
                      {p.status}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-gray-500">{p.sync}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex gap-1">
                      <button type="button" className="rounded p-1 hover:bg-gray-100"><Eye className="h-3.5 w-3.5" /></button>
                      <button type="button" className="rounded p-1 hover:bg-gray-100"><Pencil className="h-3.5 w-3.5" /></button>
                      <button type="button" className="rounded p-1 hover:bg-gray-100"><MoreVertical className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionBlock>

      <SectionBlock letter="C" title="Integration Settings">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Toggle label="Auto Data Sync" checked={data.autoSync !== false} onChange={(v) => onChange({ autoSync: v })} />
          <Toggle label="Data Sharing Consent" checked={data.dataConsent !== false} onChange={(v) => onChange({ dataConsent: v })} />
          <Toggle label="Error Alerts" checked={data.errorAlerts !== false} onChange={(v) => onChange({ errorAlerts: v })} />
          <Field label="Default Data Retention">
            <select className="crm-select" defaultValue="2">
              <option value="1">1 Year</option>
              <option value="2">2 Years</option>
              <option value="5">5 Years</option>
            </select>
          </Field>
        </div>
      </SectionBlock>
    </StepLayout>
  );
}
