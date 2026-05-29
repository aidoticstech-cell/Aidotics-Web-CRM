"use client";

import { useState } from "react";
import { MapPin, Plus, FileText, Phone, Mail, MessageCircle } from "lucide-react";
import { Field } from "@/components/ui/FormBits";
import { LEAD_STATUS_LABELS, type Lead, type LeadStatus } from "@/lib/leads-data";

export type LeadExtras = {
  notes: { id: string; text: string; at: string; by: string }[];
  followUps: { id: string; date: string; time: string; note: string; done: boolean }[];
  communications: { id: string; type: string; summary: string; at: string }[];
  documents: { id: string; name: string; size: string }[];
  history: { id: string; action: string; at: string; by: string }[];
};

const DEFAULT_EXTRAS: LeadExtras = {
  notes: [
    { id: "1", text: "Client prefers Hindi-speaking nurse. Discussed budget range.", at: "May 11, 10:30 AM", by: "Neha Patel" },
    { id: "2", text: "Sent quotation via WhatsApp.", at: "May 11, 02:15 PM", by: "Neha Patel" },
  ],
  followUps: [
    { id: "1", date: "May 13, 2025", time: "10:30 AM", note: "Call to confirm ICU nurse availability", done: false },
    { id: "2", date: "May 14, 2025", time: "02:00 PM", note: "Share updated quotation", done: false },
  ],
  communications: [
    { id: "1", type: "WhatsApp", summary: "Shared service brochure and pricing", at: "May 11, 09:20 AM" },
    { id: "2", type: "Call", summary: "15 min discussion on patient condition", at: "May 11, 11:05 AM" },
    { id: "3", type: "Email", summary: "Sent formal quotation PDF", at: "May 11, 02:30 PM" },
  ],
  documents: [
    { id: "1", name: "Quotation_LID-1258.pdf", size: "245 KB" },
    { id: "2", name: "Patient_Prescription.jpg", size: "1.2 MB" },
  ],
  history: [
    { id: "1", action: "Lead created from Website form", at: "May 11, 09:15 AM", by: "System" },
    { id: "2", action: "Assigned to Neha Patel", at: "May 11, 09:16 AM", by: "Auto Assignment" },
    { id: "3", action: "Status changed to Discussion", at: "May 11, 11:00 AM", by: "Neha Patel" },
    { id: "4", action: "Follow-up scheduled", at: "May 11, 02:00 PM", by: "Neha Patel" },
  ],
};

export function LeadDetailsTabContent({
  lead,
  tab,
  extras,
  onExtrasChange,
}: {
  lead: Lead;
  tab: string;
  extras: LeadExtras;
  onExtrasChange: (extras: LeadExtras) => void;
}) {
  const [noteDraft, setNoteDraft] = useState("");

  if (tab === "Overview") {
    return (
      <div className="space-y-5">
        <section>
          <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500">Client Information</h4>
          <dl className="mt-2 space-y-2 text-sm">
            <div className="flex justify-between gap-2"><dt className="text-gray-500">Name</dt><dd className="font-medium text-gray-900">{lead.name}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-gray-500">Phone</dt><dd className="font-medium text-gray-900">{lead.phone}</dd></div>
            {lead.email && <div className="flex justify-between gap-2"><dt className="text-gray-500">Email</dt><dd>{lead.email}</dd></div>}
            {lead.language && <div className="flex justify-between gap-2"><dt className="text-gray-500">Language</dt><dd>{lead.language}</dd></div>}
            <div className="flex justify-between gap-2"><dt className="text-gray-500">City</dt><dd>{lead.city}</dd></div>
            {lead.address && (
              <div>
                <dt className="text-gray-500">Address</dt>
                <dd className="mt-0.5 text-gray-800">{lead.address}</dd>
                <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-violet-accent"><MapPin className="h-3 w-3" /> View on Map</span>
              </div>
            )}
          </dl>
        </section>
        <section>
          <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500">Lead Information</h4>
          <dl className="mt-2 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-gray-500">Source</dt><dd>{lead.source}</dd></div>
            {lead.campaign && <div className="flex justify-between"><dt className="text-gray-500">Campaign</dt><dd className="text-right text-xs">{lead.campaign}</dd></div>}
            <div className="flex justify-between"><dt className="text-gray-500">Branch</dt><dd>{lead.branch}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Assigned To</dt><dd>{lead.assignedTo}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Priority</dt>
              <dd><span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${lead.priority === "high" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}>{lead.priority === "high" ? "High" : "Medium"}</span></dd>
            </div>
            <div className="flex justify-between"><dt className="text-gray-500">Lead Age</dt><dd>{lead.leadAgeDays ?? 0} Days</dd></div>
          </dl>
        </section>
        <section>
          <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500">Requirement Snapshot</h4>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            {[
              ["Service", lead.service],
              ["Shift", lead.shift || "—"],
              ["Duration", lead.duration || "—"],
              ["Urgency", lead.urgency === "high" ? "High" : "Medium"],
              ["Patient Age", lead.patientAge || "—"],
              ["Budget", lead.budget || "—"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg border border-gray-100 bg-gray-50/80 px-2.5 py-2">
                <p className="text-[10px] text-gray-500">{k}</p>
                <p className="font-semibold text-gray-800">{v}</p>
              </div>
            ))}
          </div>
          {lead.medicalConditions && <p className="mt-2 text-xs text-gray-600"><span className="font-semibold">Conditions:</span> {lead.medicalConditions}</p>}
        </section>
      </div>
    );
  }

  if (tab === "Requirement") {
    return (
      <div className="space-y-4 text-sm">
        <Field label="Service Required"><input className="crm-input" defaultValue={lead.service} readOnly /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Shift"><input className="crm-input" defaultValue={lead.shift || ""} /></Field>
          <Field label="Duration"><input className="crm-input" defaultValue={lead.duration || ""} /></Field>
          <Field label="Patient Age"><input className="crm-input" defaultValue={lead.patientAge || ""} /></Field>
          <Field label="Budget Range"><input className="crm-input" defaultValue={lead.budget || ""} /></Field>
        </div>
        <Field label="Medical Conditions / Special Notes">
          <textarea className="crm-input min-h-[100px]" defaultValue={lead.medicalConditions || ""} />
        </Field>
        <Field label="Location / Address">
          <textarea className="crm-input min-h-[60px]" defaultValue={lead.address || lead.city} />
        </Field>
      </div>
    );
  }

  if (tab === "Notes") {
    return (
      <div className="space-y-3">
        <div className="flex gap-2">
          <textarea className="crm-input min-h-[72px] flex-1 text-sm" placeholder="Add a note…" value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} />
        </div>
        <button
          type="button"
          className="btn-primary w-full !py-2 text-xs"
          onClick={() => {
            if (!noteDraft.trim()) return;
            onExtrasChange({
              ...extras,
              notes: [{ id: String(Date.now()), text: noteDraft, at: "Just now", by: "You" }, ...extras.notes],
            });
            setNoteDraft("");
          }}
        >
          Save Note
        </button>
        <ul className="space-y-2">
          {extras.notes.map((n) => (
            <li key={n.id} className="rounded-lg border border-gray-100 bg-gray-50/80 p-3 text-xs">
              <p className="text-gray-800">{n.text}</p>
              <p className="mt-1 text-[10px] text-gray-500">{n.by} · {n.at}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (tab === "Follow-ups") {
    return (
      <div className="space-y-3">
        <button type="button" className="btn-outline-purple w-full !py-2 text-xs"><Plus className="mr-1 inline h-3 w-3" /> Schedule Follow-up</button>
        <ul className="space-y-2">
          {extras.followUps.map((f) => (
            <li key={f.id} className="flex items-start gap-2 rounded-lg border border-gray-100 p-3 text-xs">
              <input type="checkbox" className="mt-0.5 accent-violet-accent" checked={f.done} onChange={() => onExtrasChange({ ...extras, followUps: extras.followUps.map((x) => (x.id === f.id ? { ...x, done: !x.done } : x)) })} />
              <div>
                <p className="font-semibold text-gray-900">{f.date} · {f.time}</p>
                <p className="text-gray-600">{f.note}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (tab === "Communication") {
    return (
      <ul className="space-y-2">
        {extras.communications.map((c) => {
          const Icon = c.type === "Call" ? Phone : c.type === "Email" ? Mail : MessageCircle;
          return (
            <li key={c.id} className="flex gap-3 rounded-lg border border-gray-100 p-3 text-xs">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-soft text-violet-accent"><Icon className="h-4 w-4" /></span>
              <div>
                <p className="font-semibold text-gray-900">{c.type}</p>
                <p className="text-gray-600">{c.summary}</p>
                <p className="mt-0.5 text-[10px] text-gray-400">{c.at}</p>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  if (tab === "Documents") {
    return (
      <div className="space-y-3">
        <label className="flex cursor-pointer flex-col items-center rounded-xl border border-dashed border-gray-200 py-6 text-xs text-gray-500">
          <FileText className="mb-2 h-8 w-8 text-gray-400" />
          Upload document
          <input type="file" className="sr-only" />
        </label>
        <ul className="space-y-2">
          {extras.documents.map((d) => (
            <li key={d.id} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2 text-xs">
              <span className="font-medium text-violet-accent">{d.name}</span>
              <span className="text-gray-500">{d.size}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (tab === "History") {
    return (
      <ul className="relative space-y-0 border-l-2 border-gray-100 pl-4">
        {extras.history.map((h) => (
          <li key={h.id} className="relative pb-4 text-xs">
            <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-violet-accent" />
            <p className="font-semibold text-gray-800">{h.action}</p>
            <p className="text-[10px] text-gray-500">{h.by} · {h.at}</p>
          </li>
        ))}
      </ul>
    );
  }

  return null;
}

export function getDefaultLeadExtras(): LeadExtras {
  return { ...DEFAULT_EXTRAS, notes: [...DEFAULT_EXTRAS.notes], followUps: [...DEFAULT_EXTRAS.followUps], communications: [...DEFAULT_EXTRAS.communications], documents: [...DEFAULT_EXTRAS.documents], history: [...DEFAULT_EXTRAS.history] };
}
