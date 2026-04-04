import type { ReactNode } from "react";
import {
  Activity,
  HeartPulse,
  Bell,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Truck,
  CheckCircle,
  FlaskConical,
  MessageSquare,
  Search
} from "lucide-react";
// Define a type for nav items
export interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
}

// Map roles to nav items
export const NAVIGATION_CONFIG: Record<string, NavItem[]> = {
  admin: [
    // Admin
    {
      label: "User Management",
      path: "/dashboard/users",
      icon: <ClipboardList size={20} />,
    },
    {
      label: "Approvals",
      path: "/dashboard/admin/approvals",
      icon: <CheckCircle size={20} />,
    },
    {
      label: "Investigations",
      path: "/dashboard/admin/investigations",
      icon: <FlaskConical size={20} />,
    },
    {
      label: "Payouts",
      path: "/dashboard/admin/payouts",
      icon: <CheckCircle size={20} />,
    },
    {
      label: "Reports",
      path: "/dashboard/reports",
      icon: <FileText size={20} />,
    },
  ],
  patient: [
    // Patient
    {
      label: "Consultations",
      path: "/dashboard/consultations",
      icon: <MessageSquare size={20} />,
    },
    {
      label: "Lab Tests",
      path: "/dashboard/tests",
      icon: <Activity size={20} />,
    },
    {
      label: "Vitals Log",
      path: "/dashboard/vitals",
      icon: <HeartPulse size={20} />,
    },
    {
      label: "Redeem Code",
      path: "/dashboard/patient/investigations/redeem",
      icon: <Search size={20} />,
    },
    {
      label: "Reminders",
      path: "/dashboard/reminders",
      icon: <Bell size={20} />,
    },
  ],
  doctor: [
    // Doctor
    {
      label: "Consultations",
      path: "/dashboard/consultations",
      icon: <MessageSquare size={20} />,
    },
    {
      label: "Prescriptions",
      path: "/dashboard/prescriptions",
      icon: <ClipboardList size={20} />,
    },
    {
      label: "Issue Investigation",
      path: "/dashboard/doctor/investigations/issue",
      icon: <FlaskConical size={20} />,
    },
    {
      label: "Patient Records",
      path: "/dashboard/patient-records",
      icon: <FileText size={20} />,
    },
    {
      label: "My Earnings",
      path: "/dashboard/profile",
      icon: <Activity size={20} />,
    },
  ],
  pharmacy: [
    // Pharmacy
    {
      label: "Prescription Orders",
      path: "/dashboard/orders",
      icon: <ClipboardList size={20} />,
    },
    {
      label: "Inventory",
      path: "/dashboard/inventory",
      icon: <Activity size={20} />,
    },
  ],
  laboratory: [
    // Laboratory
    {
      label: "Test Requests",
      path: "/dashboard/test-requests",
      icon: <Activity size={20} />,
    },
    {
      label: "Results Upload",
      path: "/dashboard/results",
      icon: <FileText size={20} />,
    },
  ],
  logistics: [
    // Logistics
    {
      label: "Deliveries",
      path: "/dashboard/deliveries",
      icon: <Truck size={20} />,
    },
    {
      label: "Earnings",
      path: "/dashboard/earnings",
      icon: <Activity size={20} />,
    },
  ],
  care_agent: [
    // Care Agent
    {
      label: "Field Users",
      path: "/dashboard/field-users",
      icon: <ClipboardList size={20} />,
    },
    {
      label: "Payments",
      path: "/dashboard/payments",
      icon: <Activity size={20} />,
    },
    {
      label: "My Earnings",
      path: "/dashboard/profile",
      icon: <Activity size={20} />,
    },
  ],
  super_admin: [
    // Super Admin
    {
      label: "Admin Tools",
      path: "/dashboard/super-admin/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: "Global Settings",
      path: "/dashboard/super-admin/settings",
      icon: <FileText size={20} />,
    },
  ],
};
