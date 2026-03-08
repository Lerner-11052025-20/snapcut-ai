import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import {
  Zap,
  Shield,
  Image as ImageIcon,
  Smartphone,
  Code2,
  CreditCard,
  Sparkles,
} from "lucide-react";

/* ── ease constant ──────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ── animation variants ─────────────────────────────────────────────── */
const headerVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};

const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: EASE },
  },
};

/* ── feature data ───────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Remove backgrounds in under 5 seconds with our V3.0 optimised AI pipeline. Zero waiting, instant results.",
    accent: "#7c3aed",          // violet
    accentLight: "#a78bfa",
    glowColor: "rgba(124,58,237,0.18)",
    featured: true,             // wide card — occupies 2 cols on desktop
  },
  {
    icon: ImageIcon,
    title: "HD Quality Output",
    description:
      "Crisp, artifact-free transparent PNGs up to 5000×5000. The V3.0 edge model preserves every strand of hair.",
    accent: "#2563eb",
    accentLight: "#60a5fa",
    glowColor: "rgba(37,99,235,0.16)",
    featured: false,
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "All images auto-delete after 24 hours. No permanent storage, ever.",
    accent: "#059669",
    accentLight: "#34d399",
    glowColor: "rgba(5,150,105,0.15)",
    featured: false,
  },
  {
    icon: Smartphone,
    title: "Works Everywhere",
    description:
      "Fully responsive — desktop, tablet, and mobile. One API. Every platform.",
    accent: "#0891b2",
    accentLight: "#22d3ee",
    glowColor: "rgba(8,145,178,0.15)",
    featured: false,
  },
  {
    icon: Code2,
    title: "Developer API",
    description:
      "Integrate background removal into your stack with a single REST call and our V3.0 SDK.",
    accent: "#7c3aed",
    accentLight: "#c4b5fd",
    glowColor: "rgba(124,58,237,0.15)",
    featured: false,
  },
  // {
  //   icon: CreditCard,
  //   title: "Flexible Pricing",
  //   description:
  //     "Free tier, subscriptions, or pay-per-image credits. Scale as you grow, no lock-in.",
  //   accent: "#d97706",
  //   accentLight: "#fbbf24",
  //   glowColor: "rgba(217,119,6,0.15)",
  //   featured: false,
  // },
];

/* ── component ──────────────────────────────────────────────────────── */
const FeaturesSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  /* split: first card is "featured" wide, rest are normal */
  const [featured, ...rest] = FEATURES;

  return (
    <section className="relative py-32 bg-[#050507] overflow-hidden">

      {/* ── ambient glows ── */}
      <div aria-hidden={true} className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-violet-900/10 blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-900/8 blur-[90px]" />
        {/* grid lines */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div ref={ref} className="relative z-10 container mx-auto px-4 max-w-7xl">

        {/* ── HEADER ── */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-20"
        >
          {/* badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 backdrop-blur-sm">
            <Sparkles size={12} className="text-violet-400" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-violet-300">
              V3.0 Intelligence Hub
            </span>
            <Sparkles size={12} className="text-violet-400" />
          </div>

          <h2 className="font-display text-5xl sm:text-6xl font-black text-white mb-5 tracking-tight leading-[1.06]">
            Everything{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#a78bfa 0%,#60a5fa 60%,#818cf8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              You Need
            </span>
          </h2>
          <p className="text-[#a1a1aa] text-lg max-w-xl mx-auto font-medium leading-relaxed">
            Professional AI background removal — simple, instant, and built for
            scale with the{" "}
            <span className="text-violet-400 font-semibold">
              V3.0 Intelligence Hub
            </span>
            .
          </p>
        </motion.div>

        {/* ── BENTO GRID ── */}
        <motion.div
          variants={gridVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >

          {/* ── FEATURED wide card (lg: spans 2 cols) ── */}
          <motion.div
            variants={cardVariants}
            className="group relative lg:col-span-2 rounded-[24px] border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-8 overflow-hidden flex flex-col sm:flex-row gap-8 items-start transition-all duration-300 hover:-translate-y-1"
            style={{ willChange: "transform" }}
          >
            {/* dual glow corners */}
            <div
              aria-hidden={true}
              className="pointer-events-none absolute -top-12 -left-12 w-64 h-64 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: featured.glowColor }}
            />
            <div
              aria-hidden={true}
              className="pointer-events-none absolute -bottom-12 -right-12 w-48 h-48 rounded-full blur-[50px] opacity-0 group-hover:opacity-60 transition-opacity duration-500"
              style={{ background: featured.glowColor }}
            />

            {/* icon area */}
            <div className="shrink-0">
              <div
                className="h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg,${featured.accent}30,${featured.accentLight}15)`,
                  border: `1px solid ${featured.accent}40`,
                  boxShadow: `0 0 24px ${featured.glowColor}`,
                }}
              >
                <featured.icon
                  size={28}
                  style={{ color: featured.accentLight }}
                  strokeWidth={1.6}
                />
              </div>

              {/* V3.0 pill under icon */}
              <div
                className="mt-3 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest"
                style={{
                  background: `${featured.accent}25`,
                  border: `1px solid ${featured.accent}40`,
                  color: featured.accentLight,
                }}
              >
                <Zap size={9} />
                V3.0
              </div>
            </div>

            {/* text */}
            <div className="flex-1">
              <h3 className="text-2xl font-black text-white mb-3 tracking-tight">
                {featured.title}
              </h3>
              <p className="text-[#8a8a93] text-base leading-relaxed font-medium max-w-lg">
                {featured.description}
              </p>

              {/* speed stat */}
              <div className="mt-6 flex items-center gap-3">
                <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-violet-500/40" />
                <span className="text-xs font-black uppercase tracking-widest text-violet-400/60">
                  avg. 0.8s · V3.0 model
                </span>
              </div>
            </div>
          </motion.div>

          {/* ── REMAINING 5 CARDS ── */}
          {rest.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className="group relative rounded-[24px] border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-7 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.12]"
              style={{ willChange: "transform" }}
            >
              {/* hover glow */}
              <div
                aria-hidden={true}
                className="pointer-events-none absolute -top-10 -left-10 w-48 h-48 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: feature.glowColor }}
              />

              {/* icon */}
              <div
                className="h-12 w-12 rounded-[14px] flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 shadow-sm"
                style={{
                  background: `linear-gradient(135deg,${feature.accent}25,${feature.accentLight}12)`,
                  border: `1px solid ${feature.accent}35`,
                }}
              >
                <feature.icon
                  size={20}
                  style={{ color: feature.accentLight }}
                  strokeWidth={1.7}
                />
              </div>

              {/* text */}
              <h3 className="font-display font-black text-[17px] text-white mb-2.5 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-[#8a8a93] text-[13.5px] leading-[1.65] font-medium">
                {feature.description}
              </p>

              {/* bottom accent line on hover */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-b-[24px]"
                style={{
                  background: `linear-gradient(90deg,transparent,${feature.accent},transparent)`,
                }}
              />
            </motion.div>
          ))}

        </motion.div>

        {/* ── bottom trust strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.55, delay: 0.7, ease: "easeOut" }}
          className="mt-14 flex flex-wrap items-center justify-center gap-8"
        >
          {[
            "⚡ 0.8s average processing",
            "🔒 Zero data retention",
            "🖼️ Up to 5000×5000 output",
            "🌐 99.9% uptime SLA",
          ].map((item) => (
            <span
              key={item}
              className="text-xs font-semibold text-white/25 tracking-wide"
            >
              {item}
            </span>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default FeaturesSection;
