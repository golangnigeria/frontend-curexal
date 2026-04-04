// utils/roleRedirect.ts

export const ROLE_REDIRECT: Record<string, string> = {
  super_admin: "/dashboard/super-admin/dashboard",
  admin: "/dashboard/admin/dashboard",
  doctor: "/dashboard",
  pharmacy: "/dashboard/pharmacy/dashboard",
  laboratory: "/dashboard/laboratory/dashboard",
  logistics: "/dashboard/logistics/dashboard",
  care_agent: "/dashboard/care-agent/dashboard",
  patient: "/dashboard", // patient (default user)
};