export type LeadStatus =
  | "new"
  | "discussion"
  | "qualified"
  | "proposal"
  | "converted"
  | "lost";

export type Lead = {
  id: string;
  leadId: string;
  name: string;
  phone: string;
  email?: string;
  language?: string;
  city: string;
  address?: string;
  requirement: string;
  service: string;
  shift?: string;
  duration?: string;
  urgency?: "low" | "medium" | "high";
  patientAge?: string;
  budget?: string;
  medicalConditions?: string;
  source: string;
  sourceIcon?: "website" | "referral" | "justdial" | "facebook" | "google" | "phone" | "whatsapp";
  status: LeadStatus;
  assignedTo: string;
  assignedRole?: string;
  branch: string;
  priority?: "low" | "medium" | "high";
  campaign?: string;
  followUpDate?: string;
  followUpTime?: string;
  followUpOverdue?: boolean;
  followUpNotRequired?: boolean;
  createdOn: string;
  createdTime: string;
  leadAgeDays?: number;
};

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  discussion: "Discussion",
  qualified: "Qualified",
  proposal: "Proposal",
  converted: "Converted",
  lost: "Lost",
};

export const LEAD_STATUS_STYLES: Record<LeadStatus, string> = {
  new: "bg-violet-100 text-violet-800",
  discussion: "bg-sky-100 text-sky-800",
  qualified: "bg-cyan-100 text-cyan-800",
  proposal: "bg-amber-100 text-amber-800",
  converted: "bg-emerald-100 text-emerald-800",
  lost: "bg-red-100 text-red-800",
};

export const MOCK_LEADS: Lead[] = [
  {
    id: "1",
    leadId: "LID-1258",
    name: "Rahul Sharma",
    phone: "+91 98765 43210",
    email: "rahul.sharma@email.com",
    language: "Hindi, English",
    city: "Gurgaon",
    address: "Sector 45, Gurgaon, Haryana",
    requirement: "ICU Nurse (12H)",
    service: "ICU Nurse",
    shift: "12 Hours",
    duration: "30 Days",
    urgency: "high",
    patientAge: "65 Years",
    budget: "₹1,800 - 2,000 / day",
    medicalConditions: "Post-surgery care, mobility support",
    source: "Website",
    sourceIcon: "website",
    status: "discussion",
    assignedTo: "Neha Patel",
    assignedRole: "Coordinator",
    branch: "Gurgaon",
    priority: "high",
    campaign: "Home Care May 2025",
    followUpDate: "May 13, 2025",
    followUpTime: "10:30 AM",
    followUpOverdue: true,
    createdOn: "May 11, 2025",
    createdTime: "09:15 AM",
    leadAgeDays: 2,
  },
  {
    id: "2",
    leadId: "LID-1257",
    name: "Priya Verma",
    phone: "+91 98112 33445",
    city: "Noida",
    requirement: "Attendant (24H)",
    service: "Patient Attendant",
    source: "Referral",
    sourceIcon: "referral",
    status: "qualified",
    assignedTo: "Rahul Sharma",
    branch: "Noida (HQ)",
    followUpDate: "May 14, 2025",
    followUpTime: "02:00 PM",
    createdOn: "May 10, 2025",
    createdTime: "04:22 PM",
    leadAgeDays: 3,
  },
  {
    id: "3",
    leadId: "LID-1256",
    name: "Amit Kumar",
    phone: "+91 99887 66554",
    city: "Delhi",
    requirement: "Nursing Care (8H)",
    service: "Nursing Care",
    source: "Justdial",
    sourceIcon: "justdial",
    status: "new",
    assignedTo: "Vikram Yadav",
    branch: "Delhi",
    followUpDate: "May 12, 2025",
    followUpTime: "11:00 AM",
    createdOn: "May 12, 2025",
    createdTime: "08:05 AM",
    leadAgeDays: 1,
  },
  {
    id: "4",
    leadId: "LID-1255",
    name: "Sunita Devi",
    phone: "+91 98700 11223",
    city: "Faridabad",
    requirement: "Baby Care / Nanny",
    service: "Baby Care",
    source: "Facebook",
    sourceIcon: "facebook",
    status: "proposal",
    assignedTo: "Neha Patel",
    branch: "Faridabad",
    followUpNotRequired: false,
    followUpDate: "May 15, 2025",
    followUpTime: "09:00 AM",
    createdOn: "May 9, 2025",
    createdTime: "11:40 AM",
    leadAgeDays: 4,
  },
  {
    id: "5",
    leadId: "LID-1254",
    name: "Rajesh Gupta",
    phone: "+91 98100 99887",
    city: "Gurgaon",
    requirement: "Physiotherapy",
    service: "Physiotherapy",
    source: "Google Ads",
    sourceIcon: "google",
    status: "converted",
    assignedTo: "Rahul Sharma",
    branch: "Gurgaon",
    followUpNotRequired: true,
    createdOn: "May 5, 2025",
    createdTime: "03:18 PM",
    leadAgeDays: 8,
  },
  {
    id: "6",
    leadId: "LID-1253",
    name: "Kavita Singh",
    phone: "+91 98989 77665",
    city: "Noida",
    requirement: "Elder Care (12H)",
    service: "Elder Care",
    source: "Phone Call",
    sourceIcon: "phone",
    status: "lost",
    assignedTo: "Neha Patel",
    branch: "Noida (HQ)",
    followUpNotRequired: true,
    createdOn: "May 3, 2025",
    createdTime: "01:55 PM",
    leadAgeDays: 10,
  },
  {
    id: "7",
    leadId: "LID-1252",
    name: "Mohit Jain",
    phone: "+91 98765 11122",
    city: "Delhi",
    requirement: "ICU Nurse (24H)",
    service: "ICU Nurse",
    source: "WhatsApp",
    sourceIcon: "whatsapp",
    status: "discussion",
    assignedTo: "Vikram Yadav",
    branch: "Delhi",
    followUpDate: "May 13, 2025",
    followUpTime: "04:30 PM",
    createdOn: "May 11, 2025",
    createdTime: "02:10 PM",
    leadAgeDays: 2,
  },
  {
    id: "8",
    leadId: "LID-1251",
    name: "Anjali Mehta",
    phone: "+91 98123 44556",
    city: "Gurgaon",
    requirement: "GDA (8H)",
    service: "General Duty Assistant",
    source: "Website",
    sourceIcon: "website",
    status: "qualified",
    assignedTo: "Neha Patel",
    branch: "Gurgaon",
    followUpDate: "May 14, 2025",
    followUpTime: "12:00 PM",
    createdOn: "May 10, 2025",
    createdTime: "10:20 AM",
    leadAgeDays: 3,
  },
];

export const LEAD_KPI = [
  { title: "New Leads", value: 58, trend: "+18.2%", up: true, tone: "text-violet-600 bg-violet-50" },
  { title: "Follow-ups Due", value: 42, trend: "+12.6%", up: true, tone: "text-sky-600 bg-sky-50" },
  { title: "Hot Leads", value: 28, trend: "+15.3%", up: true, tone: "text-orange-600 bg-orange-50" },
  { title: "Proposal Sent", value: 17, trend: "+8.7%", up: true, tone: "text-amber-700 bg-amber-50" },
  { title: "Converted", value: 31, trend: "+10.4%", up: true, tone: "text-emerald-600 bg-emerald-50" },
  { title: "Lost", value: 12, trend: "-6.1%", up: false, tone: "text-red-600 bg-red-50" },
];
