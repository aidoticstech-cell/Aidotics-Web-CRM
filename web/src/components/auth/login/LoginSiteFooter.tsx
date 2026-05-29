import { Lock, Shield, Users } from "lucide-react";
import Link from "next/link";

export function LoginSiteFooter() {
  return (
    <footer className="relative z-30 border-t border-gray-200/60 bg-white/90 backdrop-blur-md">
      <div className="page-container flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-4 text-xs text-gray-600">
          <span className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-violet-accent" />
            SSL Encrypted
          </span>
          <span className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-violet-accent" />
            Secure Access
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-violet-accent" />
            Role Based Access
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
          <span>© 2025 Aidotics Technologies. All rights reserved.</span>
          <Link href="#" className="hover:text-violet-accent">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:text-violet-accent">
            Terms of Service
          </Link>
          <Link href="#" className="hover:text-violet-accent">
            Support
          </Link>
        </div>
      </div>
    </footer>
  );
}
