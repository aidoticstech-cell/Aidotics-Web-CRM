import {
  BarChart3,
  MessageSquare,
  ShieldCheck,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";

const FEATURES = [
  {
    title: "Lead to Client Management",
    description: "Track leads, convert clients, and manage patient records seamlessly.",
    Icon: Users,
  },
  {
    title: "Caregiver & Duty Management",
    description: "Assign duties, manage schedules, and track caregiver performance.",
    Icon: UserRound,
  },
  {
    title: "Payments & Billing",
    description: "Automated invoicing, payment tracking, and financial reporting.",
    Icon: Wallet,
  },
  {
    title: "Communication Hub",
    description: "Centralized messaging for clients, caregivers, and your team.",
    Icon: MessageSquare,
  },
  {
    title: "Reports & Analytics",
    description: "Real-time insights and comprehensive business analytics.",
    Icon: BarChart3,
  },
  {
    title: "Secure & Compliant",
    description: "Enterprise-grade security with healthcare compliance built-in.",
    Icon: ShieldCheck,
  },
];

export function LoginMarketing() {
  return (
    <div className="relative z-10 max-w-xl py-6 lg:py-10">
      <span className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
        #1 CRM for Care &amp; Support Services
      </span>
      <h1 className="mt-5 text-4xl font-extrabold leading-[1.15] tracking-tight text-gray-900 lg:text-[2.75rem]">
        Manage Clients.{" "}
        <span className="text-violet-accent">Care Better.</span>
        <br />
        Grow Your Bureau.
      </h1>
      <p className="mt-4 max-w-lg text-sm leading-relaxed text-gray-600 lg:text-base">
        Aidotics CRM helps home care and nursing bureaus manage leads, clients, caregivers, duties, payments,
        and operations — all in one powerful platform.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {FEATURES.map(({ title, description, Icon }) => (
          <div key={title} className="flex gap-3 rounded-xl border border-gray-100 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-accent">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-gray-900">{title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-gray-200/80 pt-8">
        <div>
          <p className="text-xs font-semibold text-gray-500">Trusted by 500+ Care Bureaus</p>
          <div className="mt-2 flex -space-x-2">
            {["AK", "PS", "RM", "JD", "NV"].map((initials) => (
              <span
                key={initials}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-violet-400 to-indigo-500 text-[10px] font-bold text-white"
              >
                {initials}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-white px-3 py-2 shadow-sm">
          <BarChart3 className="h-5 w-5 text-emerald-600" />
          <div>
            <p className="text-xs font-bold text-gray-900">99.9% Uptime</p>
            <p className="text-[10px] text-gray-500">&amp; Secure</p>
          </div>
        </div>
      </div>
    </div>
  );
}
