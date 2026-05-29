"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OwnerDashboard } from "@/components/dashboard/OwnerDashboard";
import { getMe, logout, type AuthUser } from "@/lib/auth-api";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<(AuthUser & { bureauName?: string }) | null>(null);

  useEffect(() => {
    getMe()
      .then((r) => setUser(r.user))
      .catch(() => router.replace("/login"));
  }, [router]);

  if (!user) {
    return <div className="state-center min-h-screen text-sm text-gray-500">Loading dashboard…</div>;
  }

  return (
    <OwnerDashboard
      user={user}
      onSignOut={() => {
        logout();
        router.push("/login");
      }}
    />
  );
}
