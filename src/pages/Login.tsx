import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/useAuthStore";
import api from "../lib/api";
import logoUrl from "../assets/img/logo.jpg";
import { ROLE_REDIRECT } from "../utils/roleRedirect";
import Navbar from "../components/ui/Navbar";

interface LoginResponse {
  access_token: string;
  requires_onboarding: boolean; // account not verified yet
  user: {
    id: string;
    name: string;
    email: string;
    role: number;
    role_name: string;
  };
}

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const [lockout, setLockout] = useState<number | null>(null);

  // REDIRECT LOGIC REMOVED: Handled by PublicRoute and ProtectedRoute to avoid loops

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (lockout) return;

    setIsLoading(true);

    try {
      const response = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      const {
        access_token,
        requires_onboarding,
        user: loggedInUser,
      } = response.data;

      // Save auth state
      setAuth(loggedInUser, access_token, requires_onboarding);

      toast.success("Login successful 🎉");

      // Redirect
      navigate(ROLE_REDIRECT[loggedInUser.role] ?? "/dashboard");
    } catch (err) {
      const error = err as AxiosError<{
        title?: string;
        detail?: string;
        message?: string;
      }>;

      console.error("LOGIN ERROR:", error.response);

      setShake(true);
      setTimeout(() => setShake(false), 500);

      if (error.response?.status === 429) {
        // Rate-limit lockout
        setLockout(30);
        toast.error("Too many attempts. Try again in 30 seconds.");

        const interval = setInterval(() => {
          setLockout((prev) => {
            if (!prev || prev <= 1) {
              clearInterval(interval);
              return null;
            }
            return prev - 1;
          });
        }, 1000);
      } else if (error.response?.status === 403) {
        // User not verified
        const detail =
          error.response?.data?.detail ||
          error.response?.data?.title ||
          "Your account is not verified. Check your email for the verification link.";
        toast.info(detail, { autoClose: 10000 });
      } else if (!error.response) {
        // Network error (server down)
        toast.error(
          "Cannot connect to server. Please check your internet or try again later.",
        );
      } else {
        const fallback = "Invalid email or password";
        toast.error(
          error.response?.data?.detail ||
            error.response?.data?.title ||
            fallback,
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      {/* Scrollable Container */}
      <div className="flex-1 w-full overflow-y-auto pt-24 pb-12 flex flex-col items-center justify-center px-4">
        {/* Logo & Branding */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={logoUrl}
            alt="Curexal Logo"
            className="h-12 w-12 rounded-lg object-cover shadow-sm border border-slate-800"
          />
          <h1 className="mt-2 text-primary-400 font-bold text-2xl">Curexal</h1>
          <p className="text-xs text-slate-500 mt-1 text-center max-w-xs px-4">
            Sign in to access your digital health dashboard.
          </p>
        </div>

        {/* Login Form Card */}
        <div
          className={`w-full max-w-md bg-slate-950 py-6 px-5 shadow-xl rounded-xl border border-slate-800 transition-all ${
            shake ? "animate-shake" : ""
          }`}
        >
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 rounded-md border py-2 px-3 text-xs bg-slate-900 border-slate-700 focus:ring-1 focus:ring-primary-500 focus:outline-none transition text-slate-200"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 rounded-md border py-2 px-3 text-xs bg-slate-900 border-slate-700 focus:ring-1 focus:ring-primary-500 focus:outline-none transition text-slate-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-primary-400 transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Lockout message */}
            {lockout && (
              <div className="text-[10px] text-red-500 flex items-center gap-2">
                <AlertCircle size={14} />
                Try again in {lockout}s
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !!lockout}
              className="w-full flex justify-center items-center py-2 px-4 rounded-md text-xs font-semibold text-white bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-500/20"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Links */}
          <div className="mt-4 flex flex-col sm:flex-row justify-between text-[10px] text-slate-500">
            <Link
              to="/forgot-password"
              className="hover:text-primary-400 transition mb-1 sm:mb-0"
            >
              Forgot password?
            </Link>
            <Link to="/register" className="hover:text-primary-400 transition">
              Don’t have an account? Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
