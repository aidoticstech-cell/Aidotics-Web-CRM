import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  UserRound,
  BriefcaseMedical,
  ClipboardList,
  CalendarDays,
  IndianRupee,
  Settings2,
  Network,
  BarChart3,
  Shield,
  List,
  FileText,
  Upload,
  LineChart,
} from "lucide-react";

export type CrmNavItem = {
  label: string;
  href?: string;
  Icon: LucideIcon;
  children?: { label: string; href: string; Icon?: LucideIcon }[];
};

export const CRM_NAV: CrmNavItem[] = [
  { label: "Dashboard", href: "/dashboard", Icon: LayoutDashboard },
  {
    label: "Leads",
    Icon: Users,
    children: [
      { label: "Lead List", href: "/dashboard/leads", Icon: List },
      { label: "Lead Details", href: "/dashboard/leads/details?id=1", Icon: FileText },
      { label: "Import Center", href: "/dashboard/leads/import", Icon: Upload },
      { label: "Lead Analytics", href: "/dashboard/leads/analytics", Icon: LineChart },
    ],
  },
  { label: "Clients & Patients", Icon: UserRound },
  { label: "Workforce", Icon: BriefcaseMedical },
  { label: "Duties", Icon: ClipboardList },
  { label: "Attendance & Leave", Icon: CalendarDays },
  { label: "Finance", Icon: IndianRupee },
  { label: "Operations Center", Icon: Settings2 },
  { label: "Partner Network", Icon: Network },
  { label: "Reports & Analytics", Icon: BarChart3 },
  { label: "Administration", Icon: Shield },
];
