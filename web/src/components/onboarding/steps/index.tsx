"use client";

import type { ComponentType } from "react";
import type { StepProps } from "./types";
import { StepBureauProfile } from "./StepBureauProfile";
import { StepBranchBilling } from "./StepBranchBilling";
import { StepOperatingStyle } from "./StepOperatingStyle";
import { StepDutyOps } from "./StepDutyOps";
import { StepWorkforceSetup } from "./StepWorkforceSetup";
import { StepWorkflowBuilder } from "./StepWorkflowBuilder";
import { StepPublicProfile } from "./StepPublicProfile";
import { StepSubscription } from "./StepSubscription";
import { StepPlaceholder } from "./StepPlaceholder";

type StepComponent = ComponentType<StepProps>;

const REGISTRY: Record<string, StepComponent> = {
  profile_verification: StepBureauProfile,
  branches_billing: StepBranchBilling,
  operations_setup: StepOperatingStyle,
  workforce_roles: StepWorkforceSetup,
  duty_engine: StepDutyOps,
  workflow_automation: StepWorkflowBuilder,
  public_brand_profile: StepPublicProfile,
  subscription_go_live: StepSubscription,
};

export function getStepComponent(slug: string): StepComponent {
  return REGISTRY[slug] || ((p) => <StepPlaceholder {...p} slug={slug} />);
}
