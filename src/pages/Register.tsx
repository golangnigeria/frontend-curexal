import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock, User, Shield, AlertCircle } from "lucide-react";
import api from "../lib/api";
import logoUrl from "../assets/img/logo.jpg";
import Navbar from "../components/ui/Navbar";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(2); // Default to Patient (role_id 2)
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Check URL params for pre-selected role (e.g., from landing page CTA)
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
        "Registration successful! Please check your email to verify your account.",
      );

      // Clear form
      setName("");
      setEmail("");
      setPassword("");

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (_err: unknown) {
      console.error(_err);
      setError("Registration failed. Email might already be in use.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <div className="flex-1 w-full overflow-y-auto pt-24 pb-12 flex flex-col items-center px-4">
        <div className="w-full max-w-md">
          <div
            className="flex justify-center flex-col items-center cursor-pointer mb-6"
            onClick={() => navigate("/")}
          >
            <img
              src={logoUrl}
              alt="Curexal Logo"
              className="h-10 w-10 rounded-lg object-cover shadow-sm border border-slate-100"
            />
            <div className="mt-1 text-primary-600 font-bold text-lg tracking-wide">
              Curexal
            </div>
          </div>
          <h2 className="text-center text-xl font-extrabold text-slate-900">
            Create an account
          </h2>
          <p className="mt-1 text-center text-xs text-slate-400">
            Or{" "}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
            >
              sign in to your account
            </Link>
          </p>
        </div>

        <div className="mt-6 w-full max-w-md">
          <div className="bg-white py-6 px-5 shadow-xl rounded-xl border border-slate-100">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-900/30 border-l-2 border-red-500 p-3 rounded flex items-start">
                  <AlertCircle className="h-4 w-4 text-red-400 mr-2 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-red-300">{error}</p>
                </div>
              )}

              {successMsg && (
                <div className="bg-accent-900/30 border-l-2 border-accent-500 p-3 rounded flex items-start">
                  <Shield className="h-4 w-4 text-accent-400 mr-2 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-accent-300">{successMsg}</p>
                </div>
              )}

              <div>
                <label
                  htmlFor="name"
                  className="block text-[10px] font-medium text-slate-400 mb-1"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 rounded-md border py-2 px-3 text-xs bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-[10px] font-medium text-slate-400 mb-1"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 rounded-md border py-2 px-3 text-xs bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-[10px] font-medium text-slate-400 mb-1"
                >
                  Account Type
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <select
                    id="role"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(Number(e.target.value))}
                    className="w-full pl-9 rounded-md border py-2 px-3 text-xs bg-slate-50 border-slate-200 text-slate-800 focus:ring-1 focus:ring-primary-500 focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value={2}>Patient</option>
                    <option value={3}>Doctor</option>
                    <option value={5}>Laboratory</option>
                    <option value={4}>Pharmacy</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-[10px] font-medium text-slate-400 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 rounded-md border py-2 px-3 text-xs bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-2 px-4 rounded-md text-xs font-semibold text-white bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-500/20"
                >
                  {isLoading ? (
                    "Registering..."
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create Account
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
