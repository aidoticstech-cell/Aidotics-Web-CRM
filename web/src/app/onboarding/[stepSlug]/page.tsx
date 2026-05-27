import { Suspense } from "react";
import { ONBOARDING_STEPS } from "@/lib/onboarding-steps";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";

export function generateStaticParams() {
  return ONBOARDING_STEPS.map((s) => ({ stepSlug: s.slug }));
}

export default async function OnboardingStepPage({
  params,
}: {
  params: Promise<{ stepSlug: string }>;
}) {
  const { stepSlug } = await params;
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-gray-500">Loading…</div>}>
      <OnboardingWizard stepSlug={stepSlug} />
    </Suspense>
  );
}
