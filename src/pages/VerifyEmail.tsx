import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { AxiosError } from "axios";
import { useAuthStore } from "../store/useAuthStore";
import api from "../lib/api";
import { ROLE_REDIRECT } from "../utils/roleRedirect";
import logoUrl from "../assets/img/logo.jpg";

interface VerifyResponse {
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

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error",
  );
  const [errorMessage, setErrorMessage] = useState(
    token ? "" : "No verification token provided in the URL.",
  );
  const hasAttempted = useRef(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    if (hasAttempted.current) return;
    hasAttempted.current = true;

    const verifyToken = async () => {
      try {
        const response = await api.post<VerifyResponse>("/auth/verify-email", {
          token,
        });

        const {
          access_token,
          requires_onboarding,
          user: verifiedUser,
        } = response.data;

        // Auto-login the user
        setAuth(verifiedUser, access_token, requires_onboarding);

        setStatus("success");

        // Redirect after a short delay so they can see the success message
        setTimeout(() => {
          navigate(ROLE_REDIRECT[verifiedUser.role] ?? "/dashboard");
        }, 2000);
      } catch (err) {
        setStatus("error");
        const error = err as AxiosError<{
          detail?: string;
          title?: string;
          message?: string;
        }>;
        setErrorMessage(
          error.response?.data?.detail ||
            error.response?.data?.title ||
            "Failed to verify email. The link may have expired or is invalid.",
        );
      }
    };

    verifyToken();
  }, [token, navigate, setAuth]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 px-4 sm:px-6 lg:px-8">
      {/* Logo & Branding */}
      <div className="flex flex-col items-center mb-8">
        <img
          src={logoUrl}
          alt="Curexal Logo"
          className="h-20 w-20 rounded-xl object-cover shadow-md border border-slate-100"
        />
        <h1 className="mt-4 text-primary-600 font-bold text-3xl sm:text-4xl">
          Curexal
        </h1>
      </div>

      {/* Verification Card */}
      <div className="w-full max-w-md bg-white py-10 px-8 shadow-xl rounded-2xl border border-slate-100 text-center transition-all">
        {status === "loading" && (
          <div className="flex flex-col items-center animate-pulse">
            <Loader2 className="w-16 h-16 text-primary-500 animate-spin mb-4" />
            <h2 className="text-xl font-semibold text-slate-800">
              Verifying your email...
            </h2>
            <p className="text-slate-500 mt-2 text-sm">
              Please wait a moment while we check your verification link.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-xl font-semibold text-slate-800">
              Email Verified!
            </h2>
            <p className="text-slate-500 mt-2 text-sm">
              Your account is now verified. Redirecting you to your dashboard...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center">
            <XCircle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-slate-800">
              Verification Failed
            </h2>
            <p className="text-slate-500 mt-2 mb-6 text-sm">{errorMessage}</p>
            <Link
              to="/login"
              className="w-full flex justify-center items-center py-2.5 px-4 rounded-md text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 transition"
            >
              Return to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
