import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/useAuthStore";
import api from "../lib/api";
import logoUrl from "../assets/img/logo.jpg";
import { ROLE_REDIRECT } from "../utils/roleRedirect";

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
    <div className="min-h-screen flex flex-col justify-center items-center bg-surface dark:bg-slate-900 px-4 sm:px-6 lg:px-8">
      {/* Logo & Branding */}
      <div className="flex flex-col items-center mb-8">
        <img
          src={logoUrl}
          alt="Curexal Logo"
          className="h-20 w-20 rounded-xl object-cover shadow-md border border-slate-200 dark:border-slate-800"
        />
        <h1 className="mt-4 text-primary-600 dark:text-primary-400 font-bold text-3xl sm:text-4xl">
          Curexal
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2 text-center max-w-xs">
          Sign in to access your dashboard and manage your appointments, tests,
          and reminders.
        </p>
      </div>

      {/* Login Form Card */}
      <div
        className={`w-full max-w-md bg-background dark:bg-slate-950 py-8 px-6 shadow-xl rounded-2xl border border-border dark:border-slate-800 transition-all ${
          shake ? "animate-shake" : ""
        }`}
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email
            </label>
            <div className="mt-1 relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 rounded-md border py-2 px-3 text-sm bg-surface dark:bg-slate-900 border-border dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Password
            </label>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 rounded-md border py-2 px-3 text-sm bg-surface dark:bg-slate-900 border-border dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-primary-500 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Lockout message */}
          {lockout && (
            <div className="text-sm text-red-500 flex items-center gap-2">
              <AlertCircle size={16} />
              Try again in {lockout}s
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || !!lockout}
            className="w-full flex justify-center items-center py-2.5 px-4 rounded-md text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between text-sm text-slate-500 dark:text-slate-400">
          <Link
            to="/forgot-password"
            className="hover:text-primary-500 transition mb-2 sm:mb-0"
          >
            Forgot password?
          </Link>
          <Link to="/register" className="hover:text-primary-500 transition">
            Don’t have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
