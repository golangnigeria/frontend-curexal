import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import api from "../lib/api";
import { motion } from "framer-motion";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

interface Role {
  id: string;
  name: string;
}

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string>("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api.get("/auth/roles");
        const fetchedRoles: Role[] = response.data;
        setRoles(fetchedRoles);

        const params = new URLSearchParams(location.search);
        const roleParam = params.get("role")?.toLowerCase();
        
        if (roleParam) {
          const matchedRole = fetchedRoles.find((r: Role) => r.name.toLowerCase() === roleParam);
          if (matchedRole) {
            setRole(matchedRole.id);
            return;
          }
        }

        const patientRole = fetchedRoles.find((r: Role) => r.name.toLowerCase() === "patient");
        if (patientRole) {
          setRole(patientRole.id);
        }
      } catch (err) {
        console.error("Failed to fetch roles:", err);
        setError("Could not load registration roles. Please refresh.");
      }
    };

    fetchRoles();
  }, [location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      setError("Please select an account type.");
      return;
    }
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

      setSuccessMsg("Registration successful! Check your email to verify your account.");
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center md:text-left mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
          Create an account
        </h1>
        <p className="text-slate-500 text-sm">
          Join the Curexal healthcare network
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 text-sm font-medium flex items-center gap-2 rounded-lg border border-red-100">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-green-50 text-green-700 text-sm font-medium flex items-center gap-2 rounded-lg border border-green-100">
            <CheckCircle2 size={16} />
            {successMsg}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 block">
              Full Name
            </label>
            <Input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dr. Alice Smith"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 block">
              Email address
            </label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@curexal.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 block">
              Account Type
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="flex h-12 w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 appearance-none cursor-pointer"
            >
              {!role && <option value="">Select Account Type</option>}
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name.charAt(0).toUpperCase() + r.name.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 block">
              Password
            </label>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full h-12 text-base shadow-sm mt-6"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Register"}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          Already registered?{" "}
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:text-primary-700 hover:underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Register;
