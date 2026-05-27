"use client";

import { InfoBox } from "@/components/ui/FormBits";
import type { StepProps } from "./types";
import { getStepBySlug } from "@/lib/onboarding-steps";

export function StepPlaceholder({ data, onChange, slug }: StepProps & { slug: string }) {
  const def = getStepBySlug(slug);
  const notes = (data.notes as string) || "";

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">{def?.title || "Setup"}</h1>
      <p className="mt-1 text-sm text-gray-500">{def?.description}</p>
      <div className="mt-8">
        <InfoBox>
          <p className="text-sm">
            This step&apos;s detailed UI is coming next. Your progress is saved via drafts — add any notes below for your team.
          </p>
        </InfoBox>
        <label className="crm-label mt-6">Notes (optional)</label>
        <textarea
          className="crm-input min-h-[120px]"
          value={notes}
          onChange={(e) => onChange({ notes: e.target.value })}
          placeholder="Internal notes for this step…"
        />
      </div>
    </div>
  );
}
