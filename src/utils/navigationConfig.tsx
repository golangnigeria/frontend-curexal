import type { ReactNode } from "react";
import {
  Calendar,
  Activity,
  HeartPulse,
  Bell,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Truck,
} from "lucide-react";

// Define a type for nav items
export interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
}

// Map roles to nav items
// 1 = Admin, 2 = Patient, 3 = Doctor
export const NAVIGATION_CONFIG: Record<number, NavItem[]> = {
  1: [
    // Admin
    {
      label: "User Management",
      path: "/dashboard/users",
      icon: <ClipboardList size={20} />,
    },
    {
      label: "Reports",
      path: "/dashboard/reports",
      icon: <FileText size={20} />,
    },
  ],
  2: [
    // Patient
    {
      label: "Appointments",
      path: "/dashboard/appointments",
      icon: <Calendar size={20} />,
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
      label: "Reminders",
      path: "/dashboard/reminders",
      icon: <Bell size={20} />,
    },
  ],
  3: [
    // Doctor
    {
      label: "Appointments",
      path: "/dashboard/appointments", // or /doctor/appointments if you prefer
      icon: <Calendar size={20} />,
    },
    {
      label: "Prescriptions",
      path: "/dashboard/prescriptions",
      icon: <ClipboardList size={20} />,
    },
    {
      label: "Patient Records",
      path: "/dashboard/patient-records",
      icon: <FileText size={20} />,
    },
  ],
  4: [
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
  5: [
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
  6: [
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
  7: [
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
  ],
  8: [
    // Super Admin
    {
      label: "Admin Tools",
      path: "/super-admin/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: "Global Settings",
      path: "/super-admin/settings",
      icon: <FileText size={20} />,
    },
  ],
};
