"use client";

import type { ComponentType } from "react";
import type { StepProps } from "./types";
import { StepBureauProfile } from "./StepBureauProfile";
import { StepKyc } from "./StepKyc";
import { StepBranchBilling } from "./StepBranchBilling";
import { StepPayment } from "./StepPayment";
import { StepOperatingStyle } from "./StepOperatingStyle";
import { StepDutyOps } from "./StepDutyOps";
import { StepResponsibility } from "./StepResponsibility";
import { StepStaffSkillMatrix } from "./StepStaffSkillMatrix";
import { StepWorkforceSetup } from "./StepWorkforceSetup";
import { StepDigitalIdentity } from "./StepDigitalIdentity";
import { StepTeamRoles } from "./StepTeamRoles";
import { StepPermissionMatrix } from "./StepPermissionMatrix";
import { StepPartnerNetwork } from "./StepPartnerNetwork";
import { StepWorkflowBuilder } from "./StepWorkflowBuilder";
import { StepPublicProfile } from "./StepPublicProfile";
import { StepSubscription } from "./StepSubscription";
import { StepCrmReady } from "./StepCrmReady";
import { StepPlaceholder } from "./StepPlaceholder";

type StepComponent = ComponentType<StepProps>;

const REGISTRY: Record<string, StepComponent> = {
  bureau_profile: StepBureauProfile,
  kyc_verification: StepKyc,
  branch_billing: StepBranchBilling,
  payment_collection: StepPayment,
  operating_style: StepOperatingStyle,
  duty_operations: StepDutyOps,
  responsibility_automation: StepResponsibility,
  staff_skill_matrix: StepStaffSkillMatrix,
  workforce_setup: StepWorkforceSetup,
  digital_identity: StepDigitalIdentity,
  team_roles: StepTeamRoles,
  permission_matrix: StepPermissionMatrix,
  partner_network: StepPartnerNetwork,
  workflow_builder: StepWorkflowBuilder,
  public_profile: StepPublicProfile,
  subscription: StepSubscription,
  crm_ready: StepCrmReady,
};

export function getStepComponent(slug: string): StepComponent {
  return REGISTRY[slug] || ((p) => <StepPlaceholder {...p} slug={slug} />);
}
