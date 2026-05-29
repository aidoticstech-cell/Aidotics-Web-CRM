"use client";

import { Suspense } from "react";
import { LeadDetailsPage } from "@/components/leads/LeadDetailsPage";

export default function LeadDetailsRoute() {
  return (
    <Suspense fallback={<div className="state-center p-8 text-sm text-gray-500">Loading lead…</div>}>
      <LeadDetailsPage />
    </Suspense>
  );
}
