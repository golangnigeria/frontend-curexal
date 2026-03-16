import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import DashboardLayout from "../layouts/DashboardLayout";

// Public Pages
import Landing from "../pages/public/Landing";
import Features from "../pages/public/Features";
import Doctors from "../pages/public/Doctors";
import About from "../pages/public/About";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import ForgotPassword from "../pages/public/ForgotPassword";
import ResetPassword from "../pages/public/ResetPassword";
import VerifyEmail from "../pages/public/VerifyEmail";

// Patient Pages
import PatientDashboard from "../pages/patient/PatientDashboard";
import PatientAppointments from "../pages/patient/PatientAppointments";
import PatientTests from "../pages/patient/PatientTests";
import PatientVitals from "../pages/patient/PatientVitals";
import PatientReminders from "../pages/patient/PatientReminders";

// Doctor Pages
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import DoctorAppointments from "../pages/doctor/DoctorAppointments";
import DoctorPrescriptions from "../pages/doctor/DoctorPrescriptions";

// Care Agent Pages
import CareAgentDashboard from "../pages/care-agent/CareAgentDashboard";
import ProxyRegistration from "../pages/care-agent/ProxyRegistration";
import PaymentCoordination from "../pages/care-agent/PaymentCoordination";
import MessengerPage from "../pages/messenger/MessengerPage";
import { useAuthStore } from "../store/useAuthStore";

export const AppRoutes = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/features" element={<Features />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/about" element={<About />} />

      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Route>

      {/* Protected Dashboard Routes */}
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
            user?.role === 3 ? (
              <DoctorDashboard />
            ) : user?.role === 7 ? (
              <CareAgentDashboard />
            ) : user?.role === 2 ? (
              <PatientDashboard />
            ) : null
          }
        />

        {/* Patient Only */}
        <Route path="tests" element={<PatientTests />} />
        <Route path="vitals" element={<PatientVitals />} />
        <Route path="reminders" element={<PatientReminders />} />

        {/* Shared */}
        <Route
          path="appointments"
          element={
            user?.role === 3 ? <DoctorAppointments /> : <PatientAppointments />
          }
        />

        {/* Doctor Only */}
        <Route path="prescriptions" element={<DoctorPrescriptions />} />

        {/* Messenger */}
        <Route path="messenger" element={<MessengerPage />} />

        {/* Placeholder Routes for Other Roles to prevent redirect loops */}
        <Route
          path="admin/dashboard"
          element={<div className="p-8">Admin Dashboard - Coming Soon</div>}
        />
        <Route
          path="super-admin/dashboard"
          element={
            <div className="p-8">Super Admin Dashboard - Coming Soon</div>
          }
        />
        <Route
          path="pharmacy/dashboard"
          element={<div className="p-8">Pharmacy Dashboard - Coming Soon</div>}
        />
        <Route
          path="laboratory/dashboard"
          element={
            <div className="p-8">Laboratory Dashboard - Coming Soon</div>
          }
        />
        <Route
          path="logistics/dashboard"
          element={<div className="p-8">Logistics Dashboard - Coming Soon</div>}
        />
        <Route path="field-users" element={<ProxyRegistration />} />
        <Route path="field-users/new" element={<ProxyRegistration />} />
        <Route path="payments" element={<PaymentCoordination />} />
        <Route path="care-agent/dashboard" element={<CareAgentDashboard />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
