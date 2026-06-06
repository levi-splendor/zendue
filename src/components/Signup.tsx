import { useState } from "react";
import {
  Mail,
  Lock,
  Loader2,
  Zap,
  ArrowRight,
  CheckCircle2,
  User,
} from "lucide-react";
import { supabase } from "../lib/supabase";

interface SignupProps {
  onSwitchToLogin: () => void;
}

export function Signup({ onSwitchToLogin }: SignupProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPasswordStrength = (): {
    label: string;
    color: string;
    width: string;
  } => {
    if (password.length === 0) return { label: "", color: "", width: "0%" };
    if (password.length < 6)
      return { label: "Too short", color: "bg-red-500", width: "25%" };
    if (password.length < 8)
      return { label: "Weak", color: "bg-orange-500", width: "50%" };
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password))
      return { label: "Fair", color: "bg-yellow-500", width: "75%" };
    return { label: "Strong", color: "bg-emerald-500", width: "100%" };
  };

  const handleSignup = async () => {
    setError(null);
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (authError) setError(authError.message);
    else setSuccess(true);

    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    setError(null);
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (authError) setError(authError.message);
  };

  const handleGithubSignup = async () => {
    setError(null);
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: window.location.origin },
    });
    if (authError) setError(authError.message);
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 mb-4 shadow-lg">
            <Zap size={32} className="text-white" fill="currentColor" />
          </div>
          <h1 className="text-4xl font-bold text-white">Zendue</h1>
          <p className="text-zinc-400 mt-2 text-sm">
            Stay focused. Never miss a deadline.
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
          {success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} className="text-emerald-400" />
              </div>
              <h3 className="text-white font-semibold text-xl mb-2">
                Account created!
              </h3>
              <p className="text-zinc-400 text-sm mb-6">
                We sent a confirmation email to{" "}
                <span className="text-indigo-400 font-medium">{email}</span>.
              </p>
              <button
                onClick={onSwitchToLogin}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-semibold transition-all flex items-center justify-center gap-2"
              >
                Go to Login <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Create account
              </h2>
              <p className="text-zinc-400 text-sm mb-6">
                Start your productivity journey
              </p>

              {/* Social Logins */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={handleGoogleSignup}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl text-white text-sm font-medium transition-all"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="#4285F4"
                      d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                    />
                    <path
                      fill="#34A853"
                      d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
                    />
                    <path
                      fill="#EA4335"
                      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"
                    />
                  </svg>
                  Google
                </button>

                <button
                  onClick={handleGithubSignup}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl text-white text-sm font-medium transition-all"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub
                </button>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-zinc-500 text-xs">
                  or sign up with email
                </span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Full Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Full Name
                </label>
                <div className="flex items-center gap-3 bg-gray rounded-2xl px-4 py-3 border border-white/10 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/30 transition-all">
                  <User size={18} className="text-zinc-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Johnson"
                    className="bg-transparent text-gray-900 placeholder-zinc-400 focus:outline-none w-full text-sm font-medium"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Email
                </label>
                <div className="flex items-center gap-3 bg-gray rounded-2xl px-4 py-3 border border-white/10 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/30 transition-all">
                  <Mail size={18} className="text-zinc-400 flex-shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="bg-transparent text-gray placeholder-zinc-400 focus:outline-none w-full text-sm font-medium"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Password
                </label>
                <div className="flex items-center gap-3 bg-gay rounded-2xl px-4 py-3 border border-white/10 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/30 transition-all">
                  <Lock size={18} className="text-zinc-400 flex-shrink-0" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-transparent text-black placeholder-zinc-400 focus:outline-none w-full text-sm font-medium"
                  />
                </div>
                {password.length > 0 && (
                  <div className="mt-2">
                    <div className="h-1 bg-gray/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${strength.color} rounded-full transition-all duration-300`}
                        style={{ width: strength.width }}
                      />
                    </div>
                    <p
                      className={`text-xs mt-1 ${strength.color.replace("bg-", "text-")}`}
                    >
                      {strength.label}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Confirm Password
                </label>
                <div
                  className={`flex items-center gap-3 bg-gray rounded-2xl px-4 py-3 border transition-all focus-within:ring-1 ${confirmPassword && password !== confirmPassword ? "border-red-500/50 focus-within:border-red-500 focus-within:ring-red-500/30" : "border-white/10 focus-within:border-indigo-500 focus-within:ring-indigo-500/30"}`}
                >
                  <Lock size={18} className="text-zinc-400 flex-shrink-0" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSignup();
                    }}
                    placeholder="••••••••"
                    className="bg-transparent text-black placeholder-zinc-400 focus:outline-none w-full text-sm font-medium"
                  />
                  {confirmPassword && password === confirmPassword && (
                    <CheckCircle2
                      size={18}
                      className="text-emerald-400 flex-shrink-0"
                    />
                  )}
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleSignup}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    Create Account <ArrowRight size={18} />
                  </span>
                )}
              </button>

              <p className="text-zinc-500 text-xs text-center mt-4">
                By signing up, you agree to our Terms of Service and Privacy
                Policy.
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-zinc-400 text-sm mt-6">
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}

export default Signup;
