// utils/roleRedirect.ts

export const ROLE_REDIRECT: Record<number, string> = {
  8: '/super-admin/dashboard',
  1: '/admin/dashboard',
  3: '/doctor/dashboard',
  4: '/pharmacy/dashboard',
  5: '/laboratory/dashboard',
  6: '/logistics/dashboard',
  7: '/care-agent/dashboard',
  2: '/dashboard', // patient (default user)
};