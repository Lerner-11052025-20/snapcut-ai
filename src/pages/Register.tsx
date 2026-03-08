import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/Logo";
import {
  Loader2, Mail, Lock, Eye, EyeOff, User, ArrowRight,
  CheckCircle2, XCircle, Globe, Zap, Brain, Shield, Star
} from "lucide-react";

/* ─── Float particle for ambient background ─── */
const Particle = ({ style }: { style: React.CSSProperties }) => (
  <div className="absolute rounded-full pointer-events-none will-change-transform" style={style} />
);

/* ─── Password strength rules ─── */
const RULES = [
  { label: "At least 6 characters", test: (p: string) => p.length >= 6 },
  { label: "Contains a number", test: (p: string) => /\d/.test(p) },
  { label: "Uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
];

/* ─── Right panel features ─── */
const PERKS = [
  {
    icon: <Zap size={20} className="text-[#60a5fa]" />,
    title: "Sub-second AI",
    desc: "Process images in under 0.8 seconds with V3.0 Intelligence Engine.",
  },
  {
    icon: <Brain size={20} className="text-[#a855f7]" />,
    title: "Neural Precision",
    desc: "Our AI understands subjects at the pixel level — hair, fur, transparency.",
  },
  {
    icon: <Shield size={20} className="text-[#34d399]" />,
    title: "Private & Secure",
    desc: "Images are never stored on our servers after processing is complete.",
  },
  {
    icon: <Globe size={20} className="text-[#f59e0b]" />,
    title: "API Access",
    desc: "Integrate SnapCut AI into your pipeline via REST API endpoints.",
  },
];

/* ─── Animated variants ─── */
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};
const slideInRight = {
  hidden: { opacity: 0, x: 30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => nameRef.current?.focus(), 600);
    return () => clearTimeout(t);
  }, []);

  /* Password strength: 0-3 */
  const strength = useMemo(() => RULES.filter(r => r.test(password)).length, [password]);
  const strengthColor = ["bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-emerald-400"][strength];
  const strengthLabel = ["Weak", "Fair", "Good", "Strong"][strength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) { toast.error("Please fill in all fields"); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setIsLoading(true);
    try {
      const result = await signUp(email, password, name);
      console.log("📝 [Register] SignUp Result:", result);

      if (result.success) {
        setShowSuccess(true);
        toast.success("Account created! Initializing protocol...");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        toast.error(result.error || "Failed to create account");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("❌ [Register] Submission error:", err);
      toast.error("An unexpected error occurred during registration.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex overflow-hidden relative">

      {/* ── GLOBAL BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-grid opacity-[0.18] mix-blend-screen" />
        <div className="absolute top-[-15%] right-[-5%] w-[50%] h-[50%] rounded-full bg-[#c084fc]/8 blur-[180px] will-change-transform" />
        <div className="absolute bottom-[-20%] left-[-5%] w-[45%] h-[45%] rounded-full bg-[#60a5fa]/8 blur-[150px] will-change-transform" />
      </div>

      {/* ── FLOATING PARTICLES ── */}
      {[...Array(14)].map((_, i) => (
        <Particle
          key={i}
          style={{
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 3 === 0
              ? "rgba(192,132,252,0.5)"
              : i % 3 === 1
                ? "rgba(96,165,250,0.4)"
                : "rgba(52,211,153,0.3)",
            animation: `float-particle ${5 + Math.random() * 9}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 6}s`,
          }}
        />
      ))}

      {/* ══════════════════════════════════════════
          LEFT PANEL — Register form (reversed layout)
      ══════════════════════════════════════════ */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 py-12 relative z-10 min-h-screen"
      >
        {/* Logo — always visible above form */}
        <motion.div variants={itemVariants} className="mb-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <Logo size={42} showText={false} />
            <div className="flex flex-col">
              <span className="text-[22px] font-black tracking-tight text-white leading-none">
                SnapCut <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] to-[#c084fc]">AI</span>
              </span>
              <div className="mt-1.5 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#1e293b]/60 border border-white/[0.07] w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c084fc] animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[#c084fc]/90">V3.0 Intelligence Hub</span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Form card */}
        <div className="w-full max-w-[420px]">
          {/* Heading */}
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">Create account</h2>
            <p className="text-[#71717a] text-sm font-medium">Join the V3.0 Intelligence Hub — free forever</p>
          </motion.div>

          {/* Card */}
          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="glass rounded-[2rem] p-8 space-y-5 border border-white/[0.07] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] relative overflow-hidden"
            style={{ background: "linear-gradient(145deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))" }}
          >
            {/* Top edge highlight */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#71717a] ml-1">Full Name</label>
              <div className={`relative flex items-center rounded-xl border transition-all duration-300 ${focusedField === "name"
                ? "border-[#c084fc]/50 shadow-[0_0_0_3px_rgba(192,132,252,0.12)]"
                : "border-white/[0.07] hover:border-white/[0.12]"
                }`}>
                <User size={16} className={`absolute left-4 transition-colors duration-300 ${focusedField === "name" ? "text-[#c084fc]" : "text-white/25"
                  }`} />
                <input
                  ref={nameRef}
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  disabled={isLoading}
                  required
                  className="w-full h-12 bg-transparent pl-11 pr-4 text-sm text-white placeholder:text-white/20 font-medium outline-none rounded-xl"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#71717a] ml-1">Email Address</label>
              <div className={`relative flex items-center rounded-xl border transition-all duration-300 ${focusedField === "email"
                ? "border-[#c084fc]/50 shadow-[0_0_0_3px_rgba(192,132,252,0.12)]"
                : "border-white/[0.07] hover:border-white/[0.12]"
                }`}>
                <Mail size={16} className={`absolute left-4 transition-colors duration-300 ${focusedField === "email" ? "text-[#c084fc]" : "text-white/25"
                  }`} />
                <input
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

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#71717a] ml-1">Password</label>
              <div className={`relative flex items-center rounded-xl border transition-all duration-300 ${focusedField === "password"
                ? "border-[#c084fc]/50 shadow-[0_0_0_3px_rgba(192,132,252,0.12)]"
                : "border-white/[0.07] hover:border-white/[0.12]"
                }`}>
                <Lock size={16} className={`absolute left-4 transition-colors duration-300 ${focusedField === "password" ? "text-[#c084fc]" : "text-white/25"
                  }`} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
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

              {/* Strength Meter */}
              <AnimatePresence>
                {password.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 pt-1"
                  >
                    {/* Bar */}
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-500 ${i < strength ? strengthColor : "bg-white/[0.06]"
                            }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#71717a] uppercase tracking-wider">
                        Strength: <span className={strength === 3 ? "text-emerald-400" : strength >= 1 ? "text-yellow-400" : "text-red-400"}>{strengthLabel}</span>
                      </span>
                    </div>

                    {/* Rules */}
                    <div className="space-y-1">
                      {RULES.map((rule, i) => {
                        const passed = rule.test(password);
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center gap-2"
                          >
                            {passed
                              ? <CheckCircle2 size={12} className="text-emerald-400 flex-shrink-0" />
                              : <XCircle size={12} className="text-white/20 flex-shrink-0" />
                            }
                            <span className={`text-[10px] font-medium ${passed ? "text-emerald-400/80" : "text-white/30"}`}>
                              {rule.label}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-black uppercase tracking-[0.15em] text-[11px] text-white relative overflow-hidden group transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #8b5cf6 0%, #c084fc 50%, #f0abfc 100%)",
                boxShadow: isLoading ? "none" : "0 8px 32px rgba(192,132,252,0.35), 0 0 0 1px rgba(255,255,255,0.05) inset",
              }}
            >
              {/* Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 skew-x-12 pointer-events-none" />
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Loader2 size={16} className="animate-spin" />
                    Initializing...
                  </motion.span>
                ) : (
                  <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2"
                  >
                    Create Free Account
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 py-0.5">
              <div className="flex-1 h-px bg-white/[0.05]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#71717a]">Have account?</span>
              <div className="flex-1 h-px bg-white/[0.05]" />
            </div>

            {/* Login link */}
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 w-full h-11 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.12] text-[11px] font-black uppercase tracking-[0.15em] text-white/70 hover:text-white transition-all duration-300"
            >
              Sign In
              <ArrowRight size={13} className="opacity-50" />
            </Link>
          </motion.form>

          {/* Terms */}
          <motion.p variants={itemVariants} className="text-center text-[10px] text-[#71717a] font-medium mt-6 leading-relaxed">
            By registering, you agree to our{" "}
            <Link to="/terms" className="text-[#c084fc]/80 hover:text-[#c084fc] transition-colors">Terms</Link>
            {" & "}
            <Link to="/privacy" className="text-[#c084fc]/80 hover:text-[#c084fc] transition-colors">Privacy Policy</Link>.
          </motion.p>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════
          RIGHT PANEL — Feature showcase
      ══════════════════════════════════════════ */}
      <motion.div
        variants={slideInRight}
        initial="hidden"
        animate="show"
        className="hidden lg:flex w-[50%] relative flex-col justify-between p-16 overflow-hidden"
      >
        {/* Right panel bg */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-bl from-[#020617] via-[#060d1f] to-[#0a0025]" />
          <div className="absolute inset-0"
            style={{
              background: "radial-gradient(60% 80% at 70% 40%, rgba(192,132,252,0.07) 0%, transparent 70%)",
            }}
          />
          <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/[0.06] to-transparent" />
          {/* Decorative grid glow */}
          <div className="absolute inset-0 bg-grid opacity-[0.15] mix-blend-screen" />
        </div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10"
        >
          <Link to="/" className="inline-flex items-center gap-3 group">
            <Logo size={44} showText={false} />
            <div className="flex flex-col">
              <span className="text-[22px] font-black tracking-tight text-white leading-none">
                SnapCut <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] to-[#c084fc]">AI</span>
              </span>
              <div className="mt-1 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#1e293b]/60 border border-white/[0.07] w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c084fc] animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[#c084fc]/90">V3.0 Intelligence Hub</span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Centre content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-md">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/[0.08]">
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Free to Start</span>
              </div>
            </motion.div>

            <motion.h1 variants={itemVariants}
              className="text-5xl xl:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 leading-[1.05] mb-6"
            >
              Remove<br />backgrounds<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] to-[#c084fc]">instantly.</span>
            </motion.h1>

            <motion.p variants={itemVariants}
              className="text-[#71717a] text-base font-medium leading-relaxed mb-12 max-w-sm"
            >
              SnapCut AI V3.0 uses neural networks trained on millions of images to deliver surgical-precision cutouts in milliseconds.
            </motion.p>

            {/* Perk cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 gap-3">
              {PERKS.map((perk, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-start gap-4 p-4 rounded-2xl glass border border-white/[0.05] hover:border-white/[0.1] group transition-all duration-300"
                >
                  <div className="h-9 w-9 rounded-xl bg-white/[0.04] flex items-center justify-center flex-shrink-0 border border-white/[0.05] group-hover:scale-110 transition-transform duration-300">
                    {perk.icon}
                  </div>
                  <div>
                    <h4 className="text-[12px] font-black text-white/90 mb-0.5 tracking-tight">{perk.title}</h4>
                    <p className="text-[11px] font-medium text-[#71717a] leading-relaxed">{perk.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom — social proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-4 p-4 glass rounded-2xl border border-white/[0.06] w-fit">
            {/* Avatar stack */}
            <div className="flex -space-x-2">
              {["#60a5fa", "#a855f7", "#34d399", "#f59e0b"].map((c, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-[#020617] flex items-center justify-center text-[10px] font-black text-white"
                  style={{ background: `linear-gradient(135deg, ${c}44, ${c}88)`, zIndex: 4 - i }}
                >
                  {["J", "A", "S", "M"][i]}
                </div>
              ))}
            </div>
            <div>
              <p className="text-[11px] font-black text-white/80">50,000+ creators trust SnapCut AI</p>
              <p className="text-[10px] text-[#71717a] font-medium">⭐️ 4.9/5 average rating</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── SUCCESS OVERAL — IDENTITY INITIALIZED ── */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(15px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#020617]/70"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="p-10 rounded-[2.5rem] glass border border-[#c084fc]/30 shadow-[0_0_100px_rgba(192,132,252,0.3)] flex flex-col items-center max-w-md text-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-grid opacity-20 mix-blend-screen" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[150%] bg-gradient-to-b from-[#c084fc]/20 to-transparent pointer-events-none blur-[60px]" />

              <div className="relative z-10 w-full flex flex-col items-center">
                <div className="h-24 w-24 bg-[#c084fc]/10 rounded-full flex items-center justify-center mb-8 border border-[#c084fc]/30 shadow-lg group-hover:bg-[#c084fc]/20 transition-all duration-500">
                  <Brain size={48} className="text-[#c084fc] drop-shadow-[0_0_20px_rgba(192,132,252,0.8)]" />
                </div>
                <h3 className="text-3xl font-black text-white tracking-tight mb-4">Identity Initialized</h3>
                <p className="text-white/60 text-base font-medium leading-relaxed">
                  Your profile and Version 3.0 processing license are ready. Prepare for sub-second neural precision.
                </p>
                <div className="mt-8 flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c084fc] animate-ping" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#c084fc]">Authenticating Protocol</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Float animation */}
      <style>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          33% { transform: translateY(-22px) translateX(12px); opacity: 0.6; }
          66% { transform: translateY(12px) translateX(-10px); opacity: 0.2; }
        }
      `}</style>
    </div>
  );
};

export default Register;
