import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Shield,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Star,
} from "lucide-react";
import api from "../lib/api";
import logoUrl from "../assets/img/logo.jpg";
import Navbar from "../components/ui/Navbar";
import { motion } from "framer-motion";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(2); // Default to Patient
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get("role");
    if (roleParam === "doctor") setRole(3);
    else if (roleParam === "admin") setRole(1);
    else if (roleParam === "laboratory") setRole(5);
    else if (roleParam === "pharmacy") setRole(4);
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
        role_id: role,
      });

      setSuccessMsg(
        "Registration successful! Check your email to verify your account.",
      );
      setName("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch {
      setError("Registration failed. Email might already be in use.");
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
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-black text-white leading-tight mb-8">
              Join the future <br />
              of <span className="text-primary-400">Digital Health.</span>
            </h2>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[32px] mb-10">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="text-lg text-slate-300 font-medium italic mb-6">
                "Curexal has completely transformed how we manage patient care.
                The AI insights are a game-changer for our clinic."
              </p>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary-400/20 border border-primary-400/30 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=100"
                    alt="Doctor"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">
                    Dr. Sarah Jenkins
                  </h4>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    Medical Director, HealthFront
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Patients", count: "100k+" },
                { label: "Providers", count: "5k+" },
              ].map((stat, i) => (
                <div key={i} className="border-l-2 border-primary-400/30 pl-4">
                  <div className="text-2xl font-black text-white">
                    {stat.count}
                  </div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-8 mt-12">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
            © {new Date().getFullYear()} Curexal Corp
          </p>
          <div className="flex gap-4">
            {/* Small icons or links could go here */}
          </div>
        </div>
      </div>

      {/* Right Column: Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-sm pt-20 pb-12 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
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
              Create Account
            </h1>
            <p className="text-slate-400 font-medium text-sm mb-10">
              Start your journey with Curexal today.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-[10px] font-bold uppercase tracking-widest">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              {successMsg && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3 text-emerald-600 text-[10px] font-bold uppercase tracking-widest">
                  <CheckCircle2 size={16} />
                  {successMsg}
                </div>
              )}

              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all outline-none font-medium text-slate-900 placeholder:text-slate-300"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all outline-none font-medium text-slate-900 placeholder:text-slate-300"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                    Account Type
                  </label>
                  <div className="relative">
                    <Shield
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <select
                      value={role}
                      onChange={(e) => setRole(Number(e.target.value))}
                      className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all outline-none font-medium text-slate-900 appearance-none cursor-pointer"
                    >
                      <option value={2}>Patient</option>
                      <option value={3}>Doctor</option>
                      <option value={5}>Laboratory</option>
                      <option value={4}>Pharmacy</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all outline-none font-medium text-slate-900 placeholder:text-slate-300"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-primary-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-primary-500 transition-all active:scale-[0.98] shadow-xl shadow-primary-600/20 disabled:opacity-50 mt-4"
              >
                {isLoading ? "Creating Account..." : "Join Curexal"}
                <ArrowRight size={20} />
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-slate-400 text-sm font-medium">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary-600 font-black hover:underline ml-1"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
