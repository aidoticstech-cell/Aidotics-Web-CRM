"use client";

import { Suspense } from "react";
import { ClientDetailsPage } from "@/components/clients/ClientDetailsPage";

export default function ClientDetailsRoute() {
  return (
    <Suspense fallback={<div className="state-center p-8 text-sm text-gray-500">Loading client…</div>}>
      <ClientDetailsPage />
    </Suspense>
  );
}
