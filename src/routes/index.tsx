import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import DashboardLayout from "../layouts/DashboardLayout";

// Public Pages
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import VerifyEmail from "../pages/VerifyEmail";

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

import { useAuthStore } from "../store/useAuthStore";

export const AppRoutes = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<Landing />} />
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
            user?.role === 3 ? <DoctorDashboard /> : <PatientDashboard />
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
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
