// Login Page - Zendue authentication with multiple providers
import { useState } from "react";
import { Mail, Lock, Loader2, Zap, ArrowRight, Sparkles } from "lucide-react";
import { supabase } from "../lib/supabase";

interface LoginProps {
  onSwitchToSignup: () => void;
}

export function Login({ onSwitchToSignup }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"password" | "magic">("password");

  const handleEmailLogin = async () => {
    if (!email || !password) return setError("Please fill in all fields.");
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleMagicLink = async () => {
    if (!email) return setError("Please enter your email address.");
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setError(error.message);
    else setMagicLinkSent(true);
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) setError(error.message);
  };

  const handleGithubLogin = async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: window.location.origin },
    });
    if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-12">
      {/* Background glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 mb-4 shadow-lg shadow-indigo-500/25">
            <Zap size={32} className="text-white" fill="currentColor" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Zendue
          </h1>
          <p className="text-zinc-400 mt-2 text-sm">Stay focused. Never miss a deadline.</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
          <p className="text-zinc-400 text-sm mb-6">Sign in to your account</p>

          {/* Magic link success state */}
          {magicLinkSent ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles size={32} className="text-emerald-400" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Check your email</h3>
              <p className="text-zinc-400 text-sm mb-4">
                We sent a magic link to <span className="text-indigo-400">{email}</span>. Click it to sign in instantly.
              </p>
              <button
                onClick={() => { setMagicLinkSent(false); setEmail(""); }}
                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <>
              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={handleGoogleLogin}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl text-white text-sm font-medium transition-all"
                >
                  {/* Google SVG Icon */}
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                    <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
                    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
                  </svg>
                  Google
                </button>
                <button
  onClick={handleGithubLogin}
  className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl text-white text-sm font-medium transition-all"
>
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
  GitHub
</button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-zinc-500 text-xs">or continue with email</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Mode Toggle */}
              <div className="flex gap-2 mb-5 p-1 bg-white/5 rounded-xl">
                <button
                  onClick={() => setMode("password")}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    mode === "password"
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Password
                </button>
                <button
                  onClick={() => setMode("magic")}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    mode === "magic"
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  ✨ Magic Link
                </button>
              </div>

              {/* Email Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-zinc-300 mb-2">Email</label>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/30 rounded-2xl px-4 py-3 transition-all">
                  <Mail size={18} className="text-zinc-500 flex-shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && mode === "password" && handleEmailLogin()}
                    placeholder="you@example.com"
                    className="bg-transparent text-white placeholder-zinc-500 focus:outline-none w-full text-sm"
                  />
                </div>
              </div>

              {/* Password Field (only in password mode) */}
              {mode === "password" && (
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-zinc-300">Password</label>
                    <button className="text-indigo-400 hover:text-indigo-300 text-xs transition-colors">
                      Forgot password?
                    </button>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 border border-white/10 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/30 rounded-2xl px-4 py-3 transition-all">
                    <Lock size={18} className="text-zinc-500 flex-shrink-0" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleEmailLogin()}
                      placeholder="••••••••"
                      className="bg-transparent text-white placeholder-zinc-500 focus:outline-none w-full text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={mode === "password" ? handleEmailLogin : handleMagicLink}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : mode === "password" ? (
                  <>Sign In <ArrowRight size={18} /></>
                ) : (
                  <>Send Magic Link <Sparkles size={18} /></>
                )}
              </button>
            </>
          )}
        </div>

        {/* Switch to signup */}
        <p className="text-center text-zinc-400 text-sm mt-6">
          Don't have an account?{" "}
          <button
            onClick={onSwitchToSignup}
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            Create one free
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
