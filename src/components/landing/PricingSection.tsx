import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Check, Crown, Zap, Building2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscriptionStore } from "@/store/subscriptionStore";

/* ─── animation variants (GPU-only transforms for 60 fps) ─────────── */
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.1 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 48, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

/* ─── plan data ────────────────────────────────────────────────────── */
const FREE_FEATURES = [
  "5 smart removals per day",
  "Standard V3.0 quality output",
  "Max 5 MB uploads",
  "Community support",
];

const PRO_FEATURES = [
  "Unlimited removals",
  "HD quality V3.0 output",
  "Max 10 MB uploads",
  "Priority V3.0 processing",
  "Batch processing engine",
  "Dedicated email support",
];

const ENTERPRISE_FEATURES = [
  "Everything in Pro",
  "Full REST API access",
  "Custom V3.0 rate limits",
  "Dedicated account manager",
  "SLA guarantee",
  "Advanced usage analytics",
];

import { useLandingActions } from "@/hooks/useLandingActions";

/* ─── component ────────────────────────────────────────────────────── */
const PricingSection = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { handleGetStarted } = useLandingActions();
  const isPro = useSubscriptionStore((s) => s.isPro);

  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-120px" });

  /* payment handler – unchanged logic */
  const handlePayment = () => {
    if (isPro) { toast.success("You are already on the Pro plan! 🌟"); return; }
    if (!user) { toast.info("Please sign in to upgrade to Pro"); navigate("/register"); return; }
    if (!(window as any).Razorpay) {
      toast.error("Payment gateway is temporarily unavailable. Please refresh.");
      return;
    }
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || "your_test_key",
      amount: 499 * 100,
      currency: "INR",
      name: "SnapCut AI",
      description: "Pro Plan — V3.0 Intelligence Hub",
      image: "/logo.png",
      handler: (response: any) => {
        const params = new URLSearchParams({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id || `order_pricing_${Date.now()}`,
          razorpay_signature: response.razorpay_signature || "pricing_flow",
        });
        navigate(`/payment-success?${params.toString()}`);
      },
      prefill: {
        name: profile?.full_name || user?.email?.split("@")[0] || "User",
        email: profile?.email || user?.email || "",
        contact: "9999999999",
      },
      notes: { user_id: user?.id || "" },
      theme: { color: "#7c3aed" },
    };
    const rzp = new (window as any).Razorpay(options);
    rzp.on("payment.failed", (r: any) => toast.error(`Payment failed: ${r.error.description}`));
    rzp.open();
  };

  /* ── JSX ── */
  return (
    <div
      ref={sectionRef}
      className="relative py-32 overflow-hidden bg-[#050507]"
    >
      {/* ── ambient glows (pointer-events-none, GPU-composited) ── */}
      <div
        aria-hidden={true}
        className="pointer-events-none absolute inset-0"
        style={{ willChange: "transform" }}
      >
        {/* left purple haze */}
        <div className="absolute -top-24 -left-32 w-[500px] h-[500px] rounded-full bg-violet-700/10 blur-[110px]" />
        {/* right blue haze */}
        <div className="absolute -bottom-24 -right-32 w-[500px] h-[500px] rounded-full bg-blue-700/10 blur-[110px]" />
        {/* center glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] rounded-full bg-indigo-900/20 blur-[90px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-7xl">

        {/* ── HEADER ── */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-20"
        >
          {/* V3.0 badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 backdrop-blur-sm">
            <Sparkles size={12} className="text-violet-400" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-violet-300">
              V3.0 Intelligence Hub
            </span>
            <Sparkles size={12} className="text-violet-400" />
          </div>

          <h2 className="font-display text-5xl sm:text-6xl font-black tracking-tight text-white mb-5 leading-[1.05]">
            Simple,{" "}
            <span className="relative inline-block">
              <span
                className="relative z-10"
                style={{
                  background: "linear-gradient(135deg, #a78bfa 0%, #60a5fa 60%, #818cf8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Transparent
              </span>
            </span>{" "}
            Pricing
          </h2>

          <p className="text-[#a1a1aa] text-lg max-w-xl mx-auto font-medium leading-relaxed">
            Unlock elite AI features and unlimited background removals with our
            flexible subscription plans powered by the{" "}
            <span className="text-violet-400 font-semibold">V3.0 Intelligence Hub</span>.
          </p>
        </motion.div>

        {/* ── CARDS GRID ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch"
        >

          {/* ════════════ FREE CARD ════════════ */}
          <motion.div
            variants={cardVariants}
            className="group relative flex flex-col rounded-[28px] border border-white/[0.07] bg-white/[0.025] backdrop-blur-md p-8 overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:border-white/[0.14]"
            style={{ willChange: "transform" }}
          >
            {/* subtle inner gradient on hover */}
            <div className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/[0.04] to-transparent" />

            {/* plan label */}
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Zap size={15} className="text-slate-400" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.22em] text-white/40">
                Free
              </span>
            </div>

            {/* price */}
            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-white tracking-tighter">₹0</span>
                <span className="text-xs font-black uppercase tracking-widest text-white/30 pb-1">
                  forever
                </span>
              </div>
              <p className="text-xs text-white/30 mt-2 font-medium">No credit card needed</p>
            </div>

            {/* divider */}
            <div className="h-px w-full bg-white/[0.06] mb-7" />

            {/* features */}
            <ul className="space-y-3.5 flex-1 mb-9">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span className="mt-0.5 h-5 w-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <Check size={11} className="text-slate-400" />
                  </span>
                  <span className="text-sm text-white/55 font-medium leading-snug">{f}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <button
              onClick={handleGetStarted}
              className="relative w-full h-14 py-3.5 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-all duration-200 text-xs font-black uppercase tracking-[0.18em] text-white/70 hover:text-white"
            >
              Get Started
            </button>
          </motion.div>

          {/* ════════════ PRO CARD (featured) ════════════ */}
          <motion.div
            variants={cardVariants}
            className="group relative flex flex-col rounded-[28px] overflow-hidden"
            style={{ willChange: "transform" }}
          >
            {/* MOST POPULAR pill */}
            <div className="absolute -top-px left-1/2 -translate-x-1/2 z-20 px-5 py-1.5 rounded-b-2xl bg-gradient-to-r from-violet-600 to-indigo-500 shadow-[0_4px_24px_rgba(124,58,237,0.5)]">
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-white">
                Most Popular
              </span>
            </div>

            {/* card body — glowing border via box-shadow */}
            <div
              className="relative flex flex-col flex-1 p-8 rounded-[28px] border border-violet-500/40 bg-gradient-to-b from-violet-950/60 to-indigo-950/40 backdrop-blur-md transition-transform duration-300 group-hover:-translate-y-2"
              style={{
                boxShadow: "0 0 0 1px rgba(139,92,246,0.25), 0 8px 64px rgba(109,40,217,0.25)",
                willChange: "transform",
              }}
            >
              {/* ambient inner glow */}
              <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-br from-violet-600/10 via-transparent to-blue-600/5" />

              {/* plan label */}
              <div className="flex items-center gap-2 mb-6 mt-4">
                <div className="h-8 w-8 rounded-xl bg-violet-500/20 border border-violet-400/30 flex items-center justify-center">
                  <Crown size={15} className="text-violet-300" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.22em] text-violet-300">
                  Pro
                </span>
              </div>

              {/* price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-6xl font-black tracking-tighter"
                    style={{
                      background: "linear-gradient(135deg,#c4b5fd,#818cf8)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    ₹499
                  </span>
                  <span className="text-xs font-black uppercase tracking-widest text-violet-400/70 pb-1">
                    /month
                  </span>
                </div>
                <p className="text-xs text-violet-400/60 mt-2 font-medium">Cancel anytime · No hidden fees</p>
              </div>

              {/* divider */}
              <div className="h-px w-full bg-violet-500/20 mb-7" />

              {/* features */}
              <ul className="space-y-3.5 flex-1 mb-9">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="mt-0.5 h-5 w-5 rounded-full bg-violet-500/20 border border-violet-400/30 flex items-center justify-center shrink-0">
                      <Check size={11} className="text-violet-300" />
                    </span>
                    <span className="text-sm text-white/80 font-medium leading-snug">{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {isPro ? (
                <button
                  disabled
                  className="relative w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-[0.18em] cursor-default"
                  style={{
                    background: "linear-gradient(135deg,rgba(250,204,21,0.15),rgba(245,158,11,0.15))",
                    border: "1px solid rgba(250,204,21,0.35)",
                    color: "#fde68a",
                  }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Crown size={14} className="text-yellow-400" />
                    Current Plan
                  </span>
                </button>
              ) : (
                <button
                  onClick={handlePayment}
                  className="relative w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-[0.18em] text-white overflow-hidden transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                    boxShadow: "0 4px 32px rgba(124,58,237,0.45)",
                  }}
                >
                  {/* shine sweep on hover */}
                  <span className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/[0.06] transition-colors duration-300" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Zap size={13} />
                    Start Pro Trial
                  </span>
                </button>
              )}
            </div>
          </motion.div>

          {/* ════════════ ENTERPRISE CARD ════════════ */}
          <motion.div
            variants={cardVariants}
            className="group relative flex flex-col rounded-[28px] border border-white/[0.07] bg-white/[0.025] backdrop-blur-md p-8 overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:border-blue-500/20"
            style={{ willChange: "transform" }}
          >
            <div className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-blue-500/[0.05] to-transparent" />

            {/* plan label */}
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-8 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center">
                <Building2 size={15} className="text-blue-400" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.22em] text-white/40">
                Enterprise
              </span>
            </div>

            {/* price */}
            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-white tracking-tighter">Custom</span>
              </div>
              <p className="text-xs text-white/30 mt-2 font-medium">Volume pricing available</p>
            </div>

            {/* divider */}
            <div className="h-px w-full bg-white/[0.06] mb-7" />

            {/* features */}
            <ul className="space-y-3.5 flex-1 mb-9">
              {ENTERPRISE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span className="mt-0.5 h-5 w-5 rounded-full bg-blue-500/10 border border-blue-400/20 flex items-center justify-center shrink-0">
                    <Check size={11} className="text-blue-400" />
                  </span>
                  <span className="text-sm text-white/55 font-medium leading-snug">{f}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <button
              onClick={() => navigate("/contact")}
              className="relative w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-[0.18em] overflow-hidden transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg,#1e3a5f,#1e40af)",
                border: "1px solid rgba(59,130,246,0.3)",
                boxShadow: "0 4px 24px rgba(37,99,235,0.2)",
                color: "#93c5fd",
              }}
            >
              Contact Sales
            </button>
          </motion.div>

        </motion.div>

        {/* ── BOTTOM TRUST ROW ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.6, delay: 0.55, ease: "easeOut" }}
          className="mt-14 flex flex-wrap items-center justify-center gap-8"
        >
          {[
            "🔒 256-bit SSL encryption",
            "🔄 Cancel anytime",
            "✅ Razorpay secure checkout",
            "⚡ Powered by V3.0 Intelligence Hub",
          ].map((item) => (
            <span
              key={item}
              className="text-xs font-semibold text-white/30 tracking-wide"
            >
              {item}
            </span>
          ))}
        </motion.div>

      </div>
    </div>
  );
};

export default PricingSection;
