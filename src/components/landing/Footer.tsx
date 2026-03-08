import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Zap,
  ArrowUpRight,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Crown,
} from "lucide-react";
import Logo from "@/components/Logo";
import { useLandingActions } from "@/hooks/useLandingActions";
import { useSubscriptionStore } from "@/store/subscriptionStore";

/* ── ease ───────────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ── variants ───────────────────────────────────────────────────────── */
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const colVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const bottomVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

/* ── nav data ───────────────────────────────────────────────────────── */
const NAV = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Use Cases", href: "/#use-cases" },
      { label: "How It Works", href: "/#how-it-works" },
      { label: "API", href: "/#api" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/#about" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Legal", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "FAQs", href: "/#faq" },
      { label: "Contact", href: "/contact" },
      { label: "Community", href: "/#about" },
      { label: "Status", href: "/#faq" },
    ],
  },
];

const SOCIALS = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Mail, href: "mailto:hello@snapcutai.com", label: "Email" },
];

/* ── component ──────────────────────────────────────────────────────── */
const Footer = () => {
  const { handleGetStarted } = useLandingActions();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <footer className="relative bg-[#030305] overflow-hidden">

      {/* ── top separator glow ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

      {/* ── ambient glows ── */}
      <div aria-hidden={true} className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 left-1/4 w-[340px] h-[340px] rounded-full bg-violet-800/8 blur-[90px]" />
        <div className="absolute -top-16 right-1/4 w-[280px] h-[280px] rounded-full bg-blue-800/8 blur-[80px]" />
      </div>

      <div ref={ref} className="relative z-10 container mx-auto px-4 max-w-7xl">

        {/* ── UPPER BAND — CTA strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: EASE }}
          className="relative flex flex-col sm:flex-row items-center justify-between gap-6 py-10 border-b border-white/[0.06]"
        >
          {/* left text */}
          <div>
            <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10">
              <Sparkles size={11} className="text-violet-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-300">
                V3.0 Intelligence Hub
              </span>
            </div>
            <p className="text-white/70 font-semibold text-base">
              Ready to remove backgrounds in{" "}
              <span className="text-white">under 0.8s</span>?
            </p>
          </div>

          {/* right CTA */}
          <button
            onClick={handleGetStarted}
            className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-[0.14em] text-white transition-all duration-200 hover:scale-[1.04] active:scale-[0.97] shrink-0"
            style={{
              background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
              boxShadow: "0 4px 28px rgba(124,58,237,0.35)",
            }}
          >
            <Zap size={13} />
            Get Started Free
            <ArrowUpRight
              size={13}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </button>
        </motion.div>

        {/* ── MAIN LINK GRID ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-14"
        >

          {/* ── BRAND COL ── */}
          <motion.div variants={colVariants} className="flex flex-col gap-5">
            {/* logo — identical to Navbar */}
            <Link
              to="/"
              className="flex items-center gap-3 group shrink-0"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/";
              }}
            >
              {/* SVG icon */}
              <div className="shrink-0 transition-transform group-hover:scale-[1.04]">
                <Logo size={36} showText={false} />
              </div>

              {/* Stacked wordmark + V3.0 badge */}
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2 leading-none">
                  <span
                    style={{ fontFamily: "'Inter','SF Pro Display',system-ui,sans-serif" }}
                    className="text-[18px] font-black text-[#f8fafc] tracking-tight"
                  >
                    SnapCut{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                      AI
                    </span>
                  </span>
                  {useSubscriptionStore.getState().isPro && (
                    <div className="flex items-center justify-center p-[3px] rounded-full bg-gradient-to-r from-yellow-400/20 to-amber-500/20 shadow-[0_0_8px_rgba(250,204,21,0.2)] border border-yellow-400/30">
                      <Crown size={12} className="text-yellow-400" strokeWidth={3} />
                    </div>
                  )}
                </div>
                <span className="inline-flex items-center px-2 py-[2px] rounded bg-blue-500/10 border border-blue-500/20 text-[9px] font-bold text-blue-400 tracking-[0.15em] uppercase leading-none">
                  V3.0 Intelligence Hub
                </span>
              </div>
            </Link>

            <p className="text-[13.5px] text-white/40 leading-relaxed font-medium max-w-[200px]">
              AI-powered background removal. Fast, simple, professional —
              built on the{" "}
              <span className="text-violet-400/80 font-semibold">
                V3.0 Intelligence Hub
              </span>
              .
            </p>

            {/* social icons */}
            <div className="flex items-center gap-2.5 mt-1">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="h-8 w-8 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-violet-500/15 hover:border-violet-500/30 flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  <Icon size={14} className="text-white/40 group-hover:text-violet-300" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* ── NAV COLS ── */}
          {NAV.map((col) => (
            <motion.div key={col.heading} variants={colVariants}>
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/50 mb-5">
                {col.heading}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("/") ? (
                      <Link
                        to={link.href}
                        className="group inline-flex items-center gap-1.5 text-[13.5px] text-white/40 hover:text-white font-medium transition-colors duration-200"
                      >
                        <span className="h-px w-0 group-hover:w-3 bg-violet-400 transition-all duration-200 rounded-full" />
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="group inline-flex items-center gap-1.5 text-[13.5px] text-white/40 hover:text-white font-medium transition-colors duration-200"
                      >
                        <span className="h-px w-0 group-hover:w-3 bg-violet-400 transition-all duration-200 rounded-full" />
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

        </motion.div>

        {/* ── BOTTOM BAR ── */}
        <motion.div
          variants={bottomVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-white/[0.05]"
        >
          <p className="text-[12px] text-white/25 font-medium">
            © {new Date().getFullYear()} SnapCut AI. All rights reserved. Powered by{" "}
            <span className="text-violet-400/60">V3.0 Intelligence Hub</span>.
          </p>

          <div className="flex items-center gap-1.5">
            {/* live status dot */}
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.7)]" />
            <span className="text-[11px] text-white/25 font-medium tracking-wide">
              All systems operational · 99.9% uptime
            </span>
          </div>
        </motion.div>

      </div>
    </footer>
  );
};

export default Footer;
