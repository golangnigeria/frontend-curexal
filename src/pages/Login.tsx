import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/useAuthStore";
import api from "../lib/api";
import { ROLE_REDIRECT } from "../utils/roleRedirect";
import { motion } from "framer-motion";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

interface LoginResponse {
  access_token: string;
  requires_onboarding: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
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
      toast.success("Login successful");
      navigate(ROLE_REDIRECT[loggedInUser.role_name] ?? "/dashboard");
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={shake ? "animate-shake" : ""}
    >
      <div className="text-center md:text-left mb-10">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
          Welcome back
        </h1>
        <p className="text-slate-500 text-sm">
          Sign in to your Curexal workspace
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 block">
            Email address
          </label>
          <Input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@curexal.com"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-700 block">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {lockout && (
          <div className="p-4 bg-red-50 text-red-600 text-sm font-medium flex items-center gap-2 rounded-lg border border-red-100">
            <AlertCircle size={16} />
            Access locked. Retry in {lockout}s
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full h-12 text-base shadow-sm"
          disabled={isLoading || !!lockout}
        >
          {isLoading ? "Authenticating..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          New to the platform?{" "}
          <Link
            to="/register"
            className="font-medium text-primary-600 hover:text-primary-700 hover:underline underline-offset-4"
          >
            Create an account
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Login;
