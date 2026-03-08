import { motion } from "framer-motion";
import {
  Sparkles,
  Zap,
  ChevronRight,
  Cpu,
  Wand2,
  Image as ImageIcon,
  Crosshair,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLandingActions } from "@/hooks/useLandingActions";

/* ── ease constant ─────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── feature pills ─────────────────────────────────────────────────── */
const PILLS = [
  { icon: Crosshair, label: "Flawless Edge Detection", color: "#60a5fa" },
  { icon: ImageIcon, label: "4K Ultra-HD Export", color: "#a78bfa" },
  { icon: Wand2, label: "Smart Hair & Fur Masking", color: "#67e8f9" },
];

/* ── trust items ───────────────────────────────────────────────────── */
const TRUST = [
  { icon: Sparkles, label: "No Sign-Up Required", color: "#60a5fa" },
  { icon: Zap, label: "Instant Processing", color: "#a78bfa" },
  { icon: Cpu, label: "100% Free", color: "#67e8f9" },
];

const HeroSection = () => {
  const { handleGetStarted } = useLandingActions();
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-16 bg-[#050507] overflow-hidden">

      {/* ── Background FX ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_65%_55%_at_50%_42%,#000_70%,transparent_100%)]" />

        {/* left orb — animated, GPU only */}
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, 24, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[12%] -left-[8%] w-[44%] h-[44%] rounded-full bg-blue-600/10 blur-[130px]"
          style={{ willChange: "transform" }}
        />
        {/* right orb */}
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, -24, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] -right-[8%] w-[38%] h-[38%] rounded-full bg-violet-600/12 blur-[110px]"
          style={{ willChange: "transform" }}
        />
        {/* bottom center faint glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[35%] rounded-full bg-indigo-800/8 blur-[100px]" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-[860px] mx-auto">

          {/* ── V3.0 Engine badge ── */}
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="flex justify-center mb-10"
          >
            <div className="inline-flex items-center gap-2.5 rounded-full border border-blue-500/25 bg-blue-500/8 px-5 py-2 backdrop-blur-md shadow-[0_0_28px_rgba(59,130,246,0.12)]">
              <Cpu size={13} className="text-blue-400" />
              <span className="text-[11px] font-black text-blue-400 tracking-[0.22em] uppercase">
                V3.0 Intelligence Hub Engine Active
              </span>
            </div>
          </motion.div>

          {/* ── Main Headline ── */}
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.08, ease: EASE }}
            className="font-black tracking-tighter leading-[1.02] mb-8 text-white"
            style={{ fontSize: "clamp(3.2rem, 8vw, 6rem)" }}
          >
            Surgical Precision.{" "}
            <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, #60a5fa 0%, #818cf8 35%, #a855f7 70%, #9333ea 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Infinite Scale.
            </span>
          </motion.h1>

          {/* ── Sub-headline ── */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18, ease: EASE }}
            className="text-lg sm:text-xl text-white/45 max-w-[540px] mx-auto mb-10 leading-relaxed font-medium"
          >
            The completely modernized AI background removal engine. Feed it
            your assets and watch the{" "}
            <span className="text-white/70">V3.0 Hub</span> effortlessly
            extract subjects with pixel-perfect accuracy.
          </motion.p>

          {/* ── Feature pills ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.26, ease: EASE }}
            className="flex flex-wrap items-center justify-center gap-3 mb-6 px-4"
          >
            {PILLS.map(({ icon: Icon, label, color }) => (
              <span
                key={label}
                className="flex items-center gap-2 border border-white/[0.08] bg-white/[0.05] rounded-full px-4 py-2 backdrop-blur-sm hover:bg-white/[0.09] transition-colors duration-200 text-[13px] font-bold text-white/80"
              >
                <Icon size={13} style={{ color }} />
                {label}
              </span>
            ))}
          </motion.div>

          {/* ── Trust strip ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.32, ease: EASE }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[11px] font-black text-white/35 uppercase tracking-[0.18em] mb-10 px-4"
          >
            {TRUST.map(({ icon: Icon, label, color }, i) => (
              <span key={label} className="flex items-center gap-1.5">
                {i > 0 && (
                  <span className="w-1 h-1 rounded-full bg-white/15 hidden sm:inline-block mr-3" />
                )}
                <Icon size={12} style={{ color }} />
                {label}
              </span>
            ))}
          </motion.div>

          {/* ── CTA Buttons ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.38, ease: EASE }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4"
          >
            {/* Primary — Engage AI Engine */}
            <button
              onClick={handleGetStarted}
              className="group inline-flex items-center justify-center gap-2.5 min-w-[220px] px-8 h-14 rounded-full text-[15px] font-black text-white tracking-wide transition-all duration-200 hover:scale-[1.04] active:scale-[0.97]"
              style={{
                background:
                  "linear-gradient(135deg,#7c3aed 0%,#6d28d9 40%,#4f46e5 100%)",
                boxShadow:
                  "0 0 0 1px rgba(139,92,246,0.3), 0 8px 40px rgba(109,40,217,0.4)",
              }}
            >
              Engage AI Engine
              <Zap
                size={16}
                className="fill-current transition-transform duration-200 group-hover:scale-110"
              />
            </button>

            {/* Secondary — Explore Features */}
            <a href="#features">
              <button
                className="group inline-flex items-center justify-center gap-2 min-w-[220px] px-8 h-14 rounded-full text-[15px] font-black text-white/75 hover:text-white tracking-wide transition-all duration-200 hover:scale-[1.04] active:scale-[0.97] border border-white/10 bg-white/[0.04] backdrop-blur-sm hover:bg-white/[0.08] hover:border-white/20"
              >
                Explore Features
                <ChevronRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </button>
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
