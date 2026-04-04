import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import AuthLayout from "../layouts/AuthLayout";

// Public Pages
import Landing from "../pages/Landing";
import Features from "../pages/Features";
import Doctors from "../pages/Doctors";
import About from "../pages/About";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import VerifyEmail from "../pages/VerifyEmail";


// Shared Pages
import Consultations from "../pages/shared/Consultations";
import ChatPage from "../pages/shared/ChatPage";

import { useAuthStore } from "../store/useAuthStore";

// New Dashboard Pages
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import PatientDashboard from "../pages/patient/PatientDashboard";
import PatientOnboarding from "../pages/patient/PatientOnboarding";
import PatientTests from "../pages/patient/PatientTests";
import PatientVitals from "../pages/patient/PatientVitals";
import PatientReminders from "../pages/patient/PatientReminders";
import DoctorPrescriptions from "../pages/doctor/DoctorPrescriptions";
import AdminApprovals from "../pages/admin/AdminApprovals";
import AdminInvestigations from "../pages/admin/AdminInvestigations";
import LaboratoryOnboarding from "../pages/laboratory/LaboratoryOnboarding";
import DoctorIssueInvestigation from "../pages/doctor/DoctorIssueInvestigation";
import PatientRedeemPrescription from "../pages/patient/PatientRedeemPrescription";
import ProfileSettings from "../pages/shared/ProfileSettings";
import AdminPayouts from "../pages/admin/AdminPayouts";
import VerificationPending from "../pages/doctor/VerificationPending";

export const AppRoutes = () => {
  const { user, requiresOnboarding } = useAuthStore();
  const isDoctor = user?.role_name === "doctor";
  const isVerified = user?.is_verified;

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/features" element={<Features />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/about" element={<About />} />

      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Route>
      </Route>

      {/* Protected Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Isolated routes that aren't part of dashboard layout but require auth */}
        <Route path="/complete-profile" element={<PatientOnboarding />} />
        <Route path="/pending-verification" element={<VerificationPending />} />
      </Route>

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            requiresOnboarding ? (
              <Navigate to="/complete-profile" replace />
            ) : isDoctor && !isVerified ? (
              <Navigate to="/pending-verification" replace />
            ) : isDoctor ? (
              <DoctorDashboard />
            ) : (
              <PatientDashboard />
            )
          }
        />

        {/* Patient Only */}
        <Route path="tests" element={<PatientTests />} />
        <Route path="vitals" element={<PatientVitals />} />
        <Route path="reminders" element={<PatientReminders />} />
        <Route path="patient/investigations/redeem" element={<PatientRedeemPrescription />} />
        <Route path="profile" element={<ProfileSettings />} />

        {/* Shared */}
        <Route path="consultations" element={<Consultations />} />
        <Route path="chats/:matchId" element={<ChatPage />} />

        {/* Doctor Only */}
        <Route path="prescriptions" element={<DoctorPrescriptions />} />
        <Route path="doctor/investigations/issue" element={<DoctorIssueInvestigation />} />

        {/* Placeholder Routes for Other Roles to prevent redirect loops */}
        <Route
          path="admin/approvals"
          element={<AdminApprovals />}
        />
        <Route
          path="admin/investigations"
          element={<AdminInvestigations />}
        />
        <Route
          path="admin/payouts"
          element={<AdminPayouts />}
        />
        <Route
          path="laboratory/onboarding"
          element={<LaboratoryOnboarding />}
        />
        <Route
          path="laboratory/dashboard"
          element={
            <div className="p-8">Laboratory Dashboard - Content Coming Soon</div>
          }
        />
        <Route
          path="logistics/dashboard"
          element={<div className="p-8">Logistics Dashboard - Coming Soon</div>}
        />
        <Route
          path="care-agent/dashboard"
          element={
            <div className="p-8">Care Agent Dashboard - Coming Soon</div>
          }
        />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
