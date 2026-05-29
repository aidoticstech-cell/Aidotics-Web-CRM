"use client";

import Image from "next/image";

const WIDTH = 385;
const HEIGHT = 707;

/** Dashboard screenshot — Total Clients 1,248, Duties 832, Caregivers 620, chart & activities. */
export function LoginDashboardPreview() {
  return (
    <div
      aria-hidden
      className="pointer-events-none relative w-[min(100%,385px)] select-none"
    >
      <div className="rotate-[-6deg] overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-[0_32px_80px_-16px_rgba(76,45,120,0.28)]">
        <Image
          src="/login-dashboard-preview.png"
          alt=""
          width={WIDTH}
          height={HEIGHT}
          className="h-auto w-full object-contain object-left-top"
          priority
        />
      </div>
    </div>
  );
}
