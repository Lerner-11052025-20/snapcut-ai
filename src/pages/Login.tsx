import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TOAST_MESSAGES } from "@/lib/toast-messages";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/Logo";
import {
  Loader2, Mail, Lock, Eye, EyeOff, ArrowRight,
  Zap, Shield, Cpu, Sparkles
} from "lucide-react";

/* ─── Floating Particle (pure CSS animation, no JS per-frame) ─── */
const Particle = ({ style }: { style: React.CSSProperties }) => (
  <div
    className="absolute rounded-full pointer-events-none will-change-transform"
    style={style}
  />
);

/* ─── Left panel feature pills ─── */
const FEATURES = [
  { icon: <Cpu size={14} />, label: "V3.0 Intelligence Engine" },
  { icon: <Shield size={14} />, label: "Enterprise-Grade Security" },
  { icon: <Zap size={14} />, label: "Sub-second Processing" },
  { icon: <Sparkles size={14} />, label: "AI Background Removal" },
];

/* ─── Stagger child variants ─── */
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};
const slideIn = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, isAuthenticated, loading } = useAuth();
  const emailRef = useRef<HTMLInputElement>(null);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  // Auto-focus email on mount
  useEffect(() => {
    const t = setTimeout(() => emailRef.current?.focus(), 800);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    if (!password) {
      toast.error("Please enter your password");
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    const result = await signIn(email, password);
    if (result.success) {
      setShowSuccess(true);
      toast.success(TOAST_MESSAGES.AUTH.LOGIN_SUCCESS);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } else {
      // Provide more specific error messages
      let errorMsg = result.error || TOAST_MESSAGES.ERROR.UNEXPECTED;
      if (errorMsg.includes("Invalid login credentials")) {
        errorMsg = "Invalid email or password. Please try again.";
      } else if (errorMsg.includes("Email not confirmed")) {
        errorMsg = "Please verify your email before logging in.";
      } else if (errorMsg.includes("network") || errorMsg.includes("Network")) {
        errorMsg = TOAST_MESSAGES.ERROR.NETWORK;
      }
      toast.error(errorMsg);
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      console.error("[Login] Google sign-in error:", error);
      let errorMsg = error.message || TOAST_MESSAGES.ERROR.SERVER;
      if (errorMsg.includes("network") || errorMsg.includes("Network")) {
        errorMsg = TOAST_MESSAGES.ERROR.NETWORK;
      }
      toast.error(errorMsg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex overflow-hidden relative">

      {/* ── GLOBAL BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-grid opacity-[0.18] mix-blend-screen" />
        <div className="absolute top-[-15%] left-[-5%] w-[55%] h-[55%] rounded-full bg-[#60a5fa]/8 blur-[180px] will-change-transform" />
        <div className="absolute bottom-[-20%] right-[-5%] w-[45%] h-[45%] rounded-full bg-[#c084fc]/8 blur-[150px] will-change-transform" />
      </div>

      {/* ── FLOATING PARTICLES ── */}
      {[...Array(12)].map((_, i) => (
        <Particle
          key={i}
          style={{
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 2 === 0
              ? "rgba(96,165,250,0.4)"
              : "rgba(192,132,252,0.4)",
            animation: `float-particle ${6 + Math.random() * 8}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}

      {/* ══════════════════════════════════════════
          LEFT PANEL — Feature showcase
      ══════════════════════════════════════════ */}
      <motion.div
        variants={slideIn}
        initial="hidden"
        animate="show"
        className="hidden lg:flex w-[52%] relative flex-col justify-between p-16 overflow-hidden"
      >
        {/* Left panel gradient background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#060d1f] to-[#0a0025]" />
          <div className="absolute top-0 left-0 w-full h-full"
            style={{
              background: "radial-gradient(60% 80% at 30% 40%, rgba(96,165,250,0.06) 0%, transparent 70%)",
            }}
          />
          {/* Right-edge border fade */}
          <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-white/[0.06] to-transparent" />
        </div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative z-10"
        >
          <Link to="/" className="inline-flex items-center gap-3 group">
            <Logo size={44} showText={false} />
            <div className="flex flex-col">
              <span className="text-[22px] font-black tracking-tight text-white leading-none">
                SnapCut <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60a5fa] to-[#c084fc]">AI</span>
              </span>
              <div className="mt-1 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#1e293b]/60 border border-white/[0.07] w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[#60a5fa] animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[#60a5fa]/90">V3.0 Intelligence Hub</span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Centre copy */}
        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-md">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
          >
            {/* Badge */}
            <motion.div variants={item} className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/[0.08] shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Secure Gateway</span>
              </div>
            </motion.div>

            <motion.h1 variants={item}
              className="text-5xl xl:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 leading-[1.05] mb-6"
            >
              Welcome<br />back to the<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60a5fa] to-[#c084fc]">future.</span>
            </motion.h1>

            <motion.p variants={item}
              className="text-[#71717a] text-base font-medium leading-relaxed mb-12 max-w-sm"
            >
              Sign in to access your AI-powered workspace and resume processing images at machine speed.
            </motion.p>

            {/* Feature Pills */}
            <motion.div variants={item} className="flex flex-col gap-3">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl glass border border-white/[0.05] w-fit group hover:border-white/[0.12] transition-all duration-300"
                >
                  <span className="text-[#60a5fa] group-hover:text-[#93c5fd] transition-colors">{f.icon}</span>
                  <span className="text-[12px] font-bold text-white/60 group-hover:text-white/80 tracking-wide transition-colors">{f.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="relative z-10 flex items-center gap-8"
        >
          {[
            { value: "50K+", label: "Active Users" },
            { value: "2M+", label: "Images Processed" },
            { value: "0.8s", label: "Avg Process Time" },
          ].map((s, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-2xl font-black text-white tracking-tight">{s.value}</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#71717a]">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ══════════════════════════════════════════
          RIGHT PANEL — Login form
      ══════════════════════════════════════════ */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 py-12 relative z-10 min-h-screen"
      >
        {/* Logo — always visible above form */}
        <motion.div variants={item} className="mb-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <Logo size={42} showText={false} />
            <div className="flex flex-col">
              <span className="text-[22px] font-black tracking-tight text-white leading-none">
                SnapCut <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60a5fa] to-[#c084fc]">AI</span>
              </span>
              <div className="mt-1.5 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#1e293b]/60 border border-white/[0.07] w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[#60a5fa] animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[#60a5fa]/90">V3.0 Intelligence Hub</span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Form card */}
        <div className="w-full max-w-[420px]">
          {/* Heading */}
          <motion.div variants={item} className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">Sign in</h2>
            <p className="text-[#71717a] text-sm font-medium">Access the V3.0 Intelligence Hub</p>
          </motion.div>

          {/* Card */}
          <motion.form
            variants={item}
            onSubmit={handleSubmit}
            className="glass rounded-[2rem] p-8 space-y-5 border border-white/[0.07] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] relative overflow-hidden"
            style={{ background: "linear-gradient(145deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))" }}
          >
            {/* Card inner glow top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

            {/* Google Login Button */}
            <div className="space-y-4">
              <Button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                variant="outline"
                className="w-full h-12 rounded-xl border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/[0.15] text-white flex items-center justify-center gap-3 transition-all duration-300 group relative overflow-hidden"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-[11px] font-black uppercase tracking-[0.15em]">Continue with Google</span>
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#60a5fa]/30 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </Button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/[0.05]"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 bg-transparent text-[9px] font-black uppercase tracking-widest text-white/20">or secure login</span>
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#71717a] ml-1">
                Email Address
              </label>
              <div className={`relative flex items-center rounded-xl border transition-all duration-300 ${focusedField === "email"
                ? "border-[#60a5fa]/50 shadow-[0_0_0_3px_rgba(96,165,250,0.12)]"
                : "border-white/[0.07] hover:border-white/[0.12]"
                }`}>
                <Mail size={16} className={`absolute left-4 transition-colors duration-300 ${focusedField === "email" ? "text-[#60a5fa]" : "text-white/25"
                  }`} />
                <input
                  ref={emailRef}
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  disabled={isLoading}
                  required
                  className="w-full h-12 bg-transparent pl-11 pr-4 text-sm text-white placeholder:text-white/20 font-medium outline-none rounded-xl"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#71717a]">
                  Password
                </label>
                <a href="#" className="text-[10px] font-bold text-[#60a5fa] hover:text-[#93c5fd] transition-colors uppercase tracking-widest">
                  Forgot?
                </a>
              </div>
              <div className={`relative flex items-center rounded-xl border transition-all duration-300 ${focusedField === "password"
                ? "border-[#60a5fa]/50 shadow-[0_0_0_3px_rgba(96,165,250,0.12)]"
                : "border-white/[0.07] hover:border-white/[0.12]"
                }`}>
                <Lock size={16} className={`absolute left-4 transition-colors duration-300 ${focusedField === "password" ? "text-[#60a5fa]" : "text-white/25"
                  }`} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  disabled={isLoading}
                  required
                  className="w-full h-12 bg-transparent pl-11 pr-12 text-sm text-white placeholder:text-white/20 font-medium outline-none rounded-xl"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-4 text-white/25 hover:text-white/60 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-13 py-3.5 rounded-xl font-black uppercase tracking-[0.15em] text-[11px] text-white relative overflow-hidden group transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #c084fc 100%)",
                boxShadow: isLoading ? "none" : "0 8px 32px rgba(124,58,237,0.35), 0 0 0 1px rgba(255,255,255,0.05) inset",
              }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 skew-x-12 pointer-events-none" />
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Loader2 size={16} className="animate-spin" />
                    Authenticating...
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2"
                  >
                    Establish Connection
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 py-1">
              <div className="flex-1 h-px bg-white/[0.05]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#71717a]">New here?</span>
              <div className="flex-1 h-px bg-white/[0.05]" />
            </div>

            {/* Register link */}
            <Link
              to="/register"
              className="flex items-center justify-center gap-2 w-full h-11 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.12] text-[11px] font-black uppercase tracking-[0.15em] text-white/70 hover:text-white transition-all duration-300"
            >
              Create Free Account
              <ArrowRight size={13} className="opacity-50" />
            </Link>
          </motion.form>

          {/* Footer note */}
          <motion.p
            variants={item}
            className="text-center text-[10px] text-[#71717a] font-medium mt-6 leading-relaxed"
          >
            By signing in, you agree to our{" "}
            <Link to="/terms" className="text-[#60a5fa]/80 hover:text-[#60a5fa] transition-colors">Terms</Link>
            {" & "}
            <Link to="/privacy" className="text-[#60a5fa]/80 hover:text-[#60a5fa] transition-colors">Privacy Policy</Link>.
          </motion.p>
        </div>
      </motion.div>

      {/* ── SUCCESS OVERAL — HIGH PERFORMANCE FEEDBACK ── */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#020617]/60"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="p-10 rounded-[2.5rem] glass border border-blue-500/30 shadow-[0_0_80px_rgba(59,130,246,0.3)] flex flex-col items-center max-w-md text-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-grid opacity-20 mix-blend-screen" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[150%] bg-gradient-to-b from-[#60a5fa]/20 to-transparent pointer-events-none blur-[60px]" />

              <div className="relative z-10 w-full flex flex-col items-center">
                <div className="h-20 w-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 border border-blue-500/30 shadow-lg group-hover:bg-blue-500/20 transition-all duration-500">
                  <Shield size={40} className="text-[#60a5fa] drop-shadow-[0_0_15px_rgba(96,165,250,0.8)]" />
                </div>
                <h3 className="text-3xl font-black text-white tracking-tight mb-3">Connection Established</h3>
                <p className="text-white/60 text-base font-medium leading-relaxed">
                  Your identity has been verified by the V3.0 Intelligence Hub. Redirecting to your workspace...
                </p>
                <div className="mt-8 flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10">
                  <Loader2 size={14} className="animate-spin text-[#60a5fa]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Synchronizing Environment</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Float animation keyframes injected inline ── */}
      <style>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          33% { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
          66% { transform: translateY(10px) translateX(-8px); opacity: 0.2; }
        }
      `}</style>
    </div>
  );
};

export default Login;
