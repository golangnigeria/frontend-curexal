import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, Shield, AlertCircle } from "lucide-react";
import api from "../lib/api";
// import { ThemeToggle } from '../components/ThemeToggle';
import logoUrl from "../assets/img/logo.jpg";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // The link from email should contain ?token=...
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/auth/reset-password", {
        token,
        new_password: password,
      });
      setSuccessMsg("Your password has been reset successfully.");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => navigate("/login"), 3000);
    } catch (_err: unknown) {
      console.error(_err);
      setError("Failed to reset password. The link might have expired.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      {/* <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div> */}

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center flex-col items-center">
          <img
            src={logoUrl}
            alt="Curexal Logo"
            className="h-16 w-16 rounded-xl object-cover shadow-sm border border-slate-100"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Create new password
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Your new password must be different from previous used passwords.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-slate-100 transition-colors duration-300">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!token && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md flex items-start mb-6">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">
                  Missing password reset token in URL.
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {successMsg && (
              <div className="bg-primary-50 border-l-4 border-primary-400 p-4 rounded-md flex items-start">
                <Shield className="h-5 w-5 text-primary-600 mr-2 shrink-0 mt-0.5" />
                <p className="text-sm text-primary-800">{successMsg}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700"
              >
                New Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  disabled={!token || !!successMsg}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-slate-200 rounded-md py-2 px-3 border bg-slate-50 text-slate-800 focus:outline-none disabled:opacity-50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-700"
              >
                Confirm New Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  disabled={!token || !!successMsg}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-slate-200 rounded-md py-2 px-3 border bg-slate-50 text-slate-800 focus:outline-none disabled:opacity-50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={isLoading || !token || !!successMsg}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-primary-600 dark:hover:bg-primary-500 transition-colors"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Resetting Password...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
