"use client";

import { GraduationCap, Plus, Stethoscope } from "lucide-react";
import { Field } from "@/components/ui/FormBits";
import { SectionBlock, StepLayout } from "@/components/onboarding/StepLayout";
import type { StepProps } from "./types";

const SKILLS = [
  "Injection Administration",
  "Wound Dressing",
  "Vital Signs Monitoring",
  "IV Cannulation",
  "ICU Care",
  "Elder Care",
  "Post-Operative Care",
  "Medication Management",
  "Patient Mobility Support",
];

const LEVELS = ["B", "I", "A", "NA"] as const;

export function StepStaffSkillMatrix({ data, onChange, footer }: StepProps) {
  const role = (data.role as string) || "Nurse";
  const minExp = (data.minExp as string) || "1-3";
  const maxExp = (data.maxExp as string) || "5+";
  const certRequired = data.certRequired !== false;

  return (
    <StepLayout
      icon={GraduationCap}
      title="Staff Skill Matrix"
      subtitle="Define skills, experience and certifications required for each role."
      footer={footer}
    >
      <div className="mb-6 flex flex-wrap items-end gap-4">
        <div className="min-w-[200px] flex-1">
          <Field label="Select Role" required>
            <select className="crm-select" value={role} onChange={(e) => onChange({ role: e.target.value })}>
              <option>Nurse</option>
              <option>Semi Nurse</option>
              <option>Attendant</option>
              <option>Physiotherapist</option>
            </select>
          </Field>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-soft">
            <Stethoscope className="h-5 w-5 text-violet-accent" />
          </span>
          <div>
            <p className="text-sm font-bold">{role}</p>
            <p className="text-xs text-gray-500">Clinical care and patient support duties</p>
          </div>
        </div>
        <button type="button" className="btn-outline-purple !py-2 text-xs">
          <Plus className="mr-1 inline h-4 w-4" />
          Add New Role
        </button>
      </div>

      <SectionBlock letter="A" title="Skills & Competencies" subtitle="Set minimum proficiency and mandatory certification per skill.">
        <div className="mb-3 flex flex-wrap gap-3 text-[10px] font-bold uppercase">
          <span className="rounded bg-sky-100 px-2 py-0.5 text-sky-800">B Beginner</span>
          <span className="rounded bg-amber-100 px-2 py-0.5 text-amber-800">I Intermediate</span>
          <span className="rounded bg-emerald-100 px-2 py-0.5 text-emerald-800">A Advanced</span>
          <span className="rounded bg-gray-100 px-2 py-0.5 text-gray-600">NA Not Applicable</span>
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead className="bg-gray-50 text-[10px] font-bold uppercase text-gray-500">
              <tr>
                <th className="px-3 py-3">Skill / Competency</th>
                <th className="px-3 py-3 text-center">Required</th>
                <th className="px-3 py-3 text-center">Proficiency (Min.)</th>
                <th className="px-3 py-3 text-center">Mandatory Cert.</th>
              </tr>
            </thead>
            <tbody>
              {SKILLS.map((skill, i) => (
                <tr key={skill} className="border-t border-gray-100">
                  <td className="px-3 py-2.5 font-medium text-gray-800">{skill}</td>
                  <td className="px-3 py-2.5 text-center">
                    <input type="checkbox" defaultChecked={i < 7} className="accent-violet-accent" />
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex justify-center gap-1">
                      {LEVELS.map((l) => (
                        <label key={l} className="flex h-7 w-7 cursor-pointer items-center justify-center rounded border border-gray-200 text-[10px] font-bold has-[:checked]:border-violet-accent has-[:checked]:bg-violet-soft">
                          <input type="radio" name={`lvl-${i}`} defaultChecked={l === (i % 3 === 0 ? "A" : "I")} className="sr-only" />
                          {l}
                        </label>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <label className="mr-2"><input type="radio" name={`cert-${i}`} defaultChecked={i < 5} /> Yes</label>
                    <label><input type="radio" name={`cert-${i}`} defaultChecked={i >= 5} /> No</label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionBlock>

      <div className="grid gap-8 lg:grid-cols-2">
        <SectionBlock letter="B" title="Experience Requirement">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Minimum Experience">
              <select className="crm-select" value={minExp} onChange={(e) => onChange({ minExp: e.target.value })}>
                <option value="0-1">0 – 1 Years</option>
                <option value="1-3">1 – 3 Years</option>
                <option value="3-5">3 – 5 Years</option>
              </select>
            </Field>
            <Field label="Maximum Experience (Optional)">
              <select className="crm-select" value={maxExp} onChange={(e) => onChange({ maxExp: e.target.value })}>
                <option value="5+">5+ Years</option>
                <option value="10+">10+ Years</option>
              </select>
            </Field>
          </div>
        </SectionBlock>
        <SectionBlock letter="C" title="Certification Requirement">
          <p className="mb-3 text-sm text-gray-600">Is a professional certification mandatory for this role?</p>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" checked={certRequired} onChange={() => onChange({ certRequired: true })} className="accent-violet-accent" /> Yes
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" checked={!certRequired} onChange={() => onChange({ certRequired: false })} className="accent-violet-accent" /> No
            </label>
          </div>
        </SectionBlock>
      </div>
    </StepLayout>
  );
}
