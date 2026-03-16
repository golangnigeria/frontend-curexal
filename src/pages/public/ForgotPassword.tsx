import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, Shield, AlertCircle } from "lucide-react";
import api from "../lib/api";
// import { ThemeToggle } from '../components/ThemeToggle';
import logoUrl from "../assets/img/logo.jpg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });
      setSuccessMsg(
        "If an account exists with that email, a recovery link has been sent.",
      );
      setEmail("");
    } catch (_err: unknown) {
      console.error(_err);
      setError("Failed to process request. Please try again later.");
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
        <div
          className="flex justify-center flex-col items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={logoUrl}
            alt="Curexal Logo"
            className="h-16 w-16 rounded-xl object-cover shadow-sm border border-slate-100"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Reset Password
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-slate-100 transition-colors duration-300">
          <form className="space-y-6" onSubmit={handleSubmit}>
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
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-slate-200 rounded-md py-2 px-3 border bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={isLoading}
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
                    Sending link...
                  </span>
                ) : (
                  "Send Recovery Link"
                )}
              </button>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-400">Or</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Back to login
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
