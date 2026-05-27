import type { ReactNode } from "react";

export type StepProps = {
  data: Record<string, unknown>;
  onChange: (patch: Record<string, unknown>) => void;
  slug?: string;
  footer?: ReactNode;
  /** Same as footer “Continue” / “Go live” — used by hero CTAs (e.g. CRM Ready). */
  requestComplete?: () => Promise<void>;
};
