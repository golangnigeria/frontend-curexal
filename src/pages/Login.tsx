import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
  ArrowRight,
  Heart,
} from "lucide-react";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/useAuthStore";
import api from "../lib/api";
import logoUrl from "../assets/img/logo.jpg";
import { ROLE_REDIRECT } from "../utils/roleRedirect";
import Navbar from "../components/ui/Navbar";
import { motion } from "framer-motion";

interface LoginResponse {
  access_token: string;
  requires_onboarding: boolean;
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

      setAuth(loggedInUser, access_token, requires_onboarding);
      toast.success("Login successful 🎉");
      navigate(ROLE_REDIRECT[loggedInUser.role] ?? "/dashboard");
    } catch (err) {
      const error = err as AxiosError<{
        title?: string;
        detail?: string;
        message?: string;
      }>;

      setShake(true);
      setTimeout(() => setShake(false), 500);

      if (error.response?.status === 429) {
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
    <div className="min-h-screen bg-white flex relative overflow-hidden">
      <Navbar />

      {/* Left Column: Branding (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative p-12 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 bg-ai-mesh opacity-20 z-0" />
        <div className="absolute top-0 right-0 w-full h-full bg-linear-to-b from-primary-600/10 to-transparent z-0" />

        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-black text-white leading-tight mb-8">
              The unified <br />
              <span className="text-primary-400">Health OS</span> for <br />
              modern care.
            </h2>

            <div className="space-y-6">
              {[
                {
                  icon: <ShieldCheck size={20} className="text-primary-400" />,
                  text: "HIPAA Compliant Security",
                },
                {
                  icon: <Zap size={20} className="text-primary-400" />,
                  text: "Real-time AI Diagnostics",
                },
                {
                  icon: <Heart size={20} className="text-primary-400" />,
                  text: "Patient-First Experience",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-4 text-slate-300 font-bold uppercase tracking-widest text-[10px]"
                >
                  <div className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    {item.icon}
                  </div>
                  {item.text}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="relative z-10">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
            Trusted by 5,000+ Specialists worldwide
          </p>
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className={shake ? "animate-shake" : ""}
          >
            <div className="mb-10 lg:hidden">
              <Link to="/" className="flex items-center gap-2">
                <img src={logoUrl} className="h-8 w-8 rounded-lg" alt="Logo" />
                <span className="font-black tracking-tight text-slate-900">
                  CUREXAL
                </span>
              </Link>
            </div>

            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-400 font-medium text-sm mb-10">
              Sign in to manage your health ecosystem.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all outline-none font-medium text-slate-900 placeholder:text-slate-300"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-[10px] font-black text-primary-600 uppercase tracking-widest hover:underline"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-14 pl-12 pr-12 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all outline-none font-medium text-slate-900 placeholder:text-slate-300"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {lockout && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-[10px] font-bold uppercase tracking-widest">
                  <AlertCircle size={16} />
                  Account locked. Retry in {lockout}s
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !!lockout}
                className="w-full h-14 bg-primary-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-primary-500 transition-all active:scale-[0.98] shadow-xl shadow-primary-600/20 disabled:opacity-50"
              >
                {isLoading ? "Validating..." : "Sign In to Curexal"}
                <ArrowRight size={20} />
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-slate-400 text-sm font-medium">
                New to Curexal?{" "}
                <Link
                  to="/register"
                  className="text-primary-600 font-black hover:underline ml-1"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
