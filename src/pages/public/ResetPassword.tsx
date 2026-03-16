import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Lock,
  Shield,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import api from "../lib/api";
import logoUrl from "../assets/img/logo.jpg";
import Navbar from "../components/ui/Navbar";
import { motion } from "framer-motion";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

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
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-ai-mesh opacity-5 z-0" />
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-600/5 blur-[120px] rounded-full z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full z-0" />

      <div className="flex-1 flex items-center justify-center p-6 relative z-10 pt-24">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-10">
              <Link
                to="/"
                className="inline-flex flex-col items-center gap-3 group"
              >
                <div className="h-14 w-14 rounded-2xl bg-white p-0.5 overflow-hidden border border-slate-200 shadow-xl transition-transform group-hover:scale-110">
                  <img
                    src={logoUrl}
                    alt="Logo"
                    className="h-full w-full object-cover rounded-xl"
                  />
                </div>
                <span className="text-lg font-black tracking-tighter text-slate-900">
                  CURE<span className="text-primary-600">XAL</span>
                </span>
              </Link>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-8 mb-2">
                Secure Reset
              </h1>
              <p className="text-slate-500 font-medium text-sm">
                Enter your new credentials below to regain access.
              </p>
            </div>

            <div className="bg-white p-8 rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                {!token && (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-600 text-[10px] font-bold uppercase tracking-widest">
                    <AlertCircle size={16} className="shrink-0" />
                    Reset token is missing from URL.
                  </div>
                )}

                {error && (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-600 text-[10px] font-bold uppercase tracking-widest">
                    <AlertCircle size={16} className="shrink-0" />
                    {error}
                  </div>
                )}

                {successMsg && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-3 text-emerald-600 text-[10px] font-bold uppercase tracking-widest">
                    <CheckCircle2 size={16} className="shrink-0" />
                    {successMsg}
                  </div>
                )}

                <div className="space-y-5">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <input
                        type="password"
                        required
                        disabled={!token || !!successMsg}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all outline-none font-medium text-slate-900 placeholder:text-slate-300 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Shield
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <input
                        type="password"
                        required
                        disabled={!token || !!successMsg}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all outline-none font-medium text-slate-900 placeholder:text-slate-300 disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !token || !!successMsg}
                  className="w-full h-14 bg-primary-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-primary-500 transition-all active:scale-[0.98] shadow-xl shadow-primary-600/20 disabled:opacity-50"
                >
                  {isLoading ? "Updating..." : "Confirm New Password"}
                  <ArrowRight size={20} />
                </button>
              </form>
            </div>

            <div className="mt-10 text-center">
              <Link
                to="/login"
                className="text-slate-400 text-xs font-black uppercase tracking-widest hover:text-primary-600 transition-colors"
              >
                Back to Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
