import { useRef, useState, useEffect } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Code2, Terminal, Zap, Copy, Check, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLandingActions } from "@/hooks/useLandingActions";

/* ── typed-out code lines with syntax tokens ─────────────────────── */
const CODE_LINES = [
  {
    tokens: [
      { text: "curl", color: "#c4b5fd" },
      { text: " -X ", color: "#94a3b8" },
      { text: "POST", color: "#60a5fa" },
      { text: " https://api.snapcutai.com/v1/remove-bg \\", color: "#e2e8f0" },
    ],
  },
  {
    tokens: [
      { text: "  -H ", color: "#94a3b8" },
      { text: '"Authorization: ', color: "#86efac" },
      { text: "Bearer ", color: "#fbbf24" },
      { text: 'YOUR_API_KEY" \\', color: "#f472b6" },
    ],
  },
  {
    tokens: [
      { text: "  -F ", color: "#94a3b8" },
      { text: '"image=@photo.jpg" \\', color: "#86efac" },
    ],
  },
  {
    tokens: [
      { text: "  -o ", color: "#94a3b8" },
      { text: "result.png", color: "#60a5fa" },
    ],
  },
];

const RAW_SNIPPET = `curl -X POST https://api.snapcutai.com/v1/remove-bg \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "image=@photo.jpg" \\
  -o result.png`;

/* ── tiny stat badges ─────────────────────────────────────────────── */
const STATS = [
  { label: "Avg. Response", value: "< 800ms" },
  { label: "Uptime SLA", value: "99.9%" },
  { label: "API Version", value: "V3.0" },
];

/* ── animation helpers ────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const slideLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: EASE } },
};
const slideRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: EASE } },
};

/* ── typed cursor component (lightweight) ─────────────────────────── */
const TypedTerminal = () => {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (visibleLines >= CODE_LINES.length) return;
    const t = setTimeout(() => setVisibleLines((v) => v + 1), 420);
    return () => clearTimeout(t);
  }, [visibleLines]);

  return (
    <div className="font-mono text-sm leading-7 select-none">
      {CODE_LINES.slice(0, visibleLines).map((line, li) => (
        <motion.div
          key={li}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.22 }}
          className="flex flex-wrap"
        >
          {line.tokens.map((tok, ti) => (
            <span key={ti} style={{ color: tok.color }}>
              {tok.text}
            </span>
          ))}
        </motion.div>
      ))}
      {/* blinking cursor */}
      {visibleLines < CODE_LINES.length && (
        <span
          className="inline-block w-[2px] h-[1.1em] align-middle bg-violet-400 ml-0.5"
          style={{ animation: "blink 1s step-end infinite" }}
        />
      )}
    </div>
  );
};

/* ── main component ───────────────────────────────────────────────── */
const ApiSection = () => {
  const { handleGetApiKey } = useLandingActions();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(RAW_SNIPPET).catch(() => { });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      ref={ref}
      className="relative py-32 overflow-hidden bg-[#050507]"
    >
      {/* ── global blink keyframe injected once ── */}
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>

      {/* ── ambient glows ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-0 w-[460px] h-[460px] rounded-full bg-violet-700/8 blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[380px] h-[380px] rounded-full bg-blue-700/8 blur-[100px]" />
        {/* horizontal scan line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/15 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ════ LEFT — copy ════ */}
          <motion.div
            variants={slideLeft}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {/* eyebrow */}
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 backdrop-blur-sm">
              <Code2 size={12} className="text-violet-400" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-violet-300">
                Developer API · V3.0
              </span>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-white mb-5 leading-[1.08]">
              Integrate in{" "}
              <span
                style={{
                  background: "linear-gradient(130deg,#a78bfa 0%,#60a5fa 70%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Minutes
              </span>
            </h2>

            <p className="text-[#a1a1aa] text-lg leading-relaxed mb-8 max-w-md">
              Add AI-powered background removal to your apps with a single REST
              call. The{" "}
              <span className="text-violet-400 font-semibold">
                V3.0 Intelligence Hub
              </span>{" "}
              handles edge detection, transparency, and HD output — you just ship
              faster.
            </p>

            {/* stat row */}
            <div className="flex flex-wrap gap-5 mb-10">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.1, ease: "easeOut" }}
                  className="flex flex-col gap-0.5"
                >
                  <span className="text-xl font-black text-white">{s.value}</span>
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-white/30">
                    {s.label}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* CTA button */}
            <button
              onClick={handleGetApiKey}
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm font-black uppercase tracking-[0.15em] text-white transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
              style={{
                background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                boxShadow: "0 4px 32px rgba(124,58,237,0.4)",
              }}
            >
              <Zap size={14} />
              Get API Key
              <ChevronRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </button>
          </motion.div>

          {/* ════ RIGHT — terminal card ════ */}
          <motion.div
            variants={slideRight}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <div
              className="relative rounded-[24px] overflow-hidden border border-white/[0.08]"
              style={{
                background: "linear-gradient(145deg,rgba(15,13,26,0.95),rgba(10,10,20,0.98))",
                boxShadow:
                  "0 0 0 1px rgba(139,92,246,0.12), 0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              {/* ── title bar ── */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  {/* traffic lights */}
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                  <span className="ml-3 text-xs font-semibold text-white/30 flex items-center gap-1.5">
                    <Terminal size={11} />
                    Terminal
                  </span>
                </div>

                {/* copy button */}
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] transition-all duration-150 text-[11px] font-bold text-white/40 hover:text-white/70"
                >
                  {copied ? (
                    <>
                      <Check size={11} className="text-green-400" />
                      <span className="text-green-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={11} />
                      Copy
                    </>
                  )}
                </button>
              </div>

              {/* ── code area ── */}
              <div className="px-6 py-7 min-h-[148px]">
                {/* prompt symbol */}
                <div className="flex items-start gap-3">
                  <span className="text-violet-500 font-mono text-sm mt-0.5 select-none">$</span>
                  <div className="flex-1">
                    {isInView && <TypedTerminal />}
                  </div>
                </div>
              </div>

              {/* ── response preview bar ── */}
              <div className="px-6 py-3.5 border-t border-white/[0.05] flex items-center gap-3 bg-white/[0.02]">
                <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
                <span className="text-[11px] font-mono text-white/30">
                  200 OK · result.png · 842 KB · 0.78s
                </span>
                <div className="ml-auto flex gap-1.5">
                  {["#7c3aed", "#4f46e5", "#60a5fa"].map((c, i) => (
                    <div
                      key={i}
                      className="h-1.5 rounded-full"
                      style={{ width: `${28 - i * 7}px`, background: c, opacity: 0.5 }}
                    />
                  ))}
                </div>
              </div>

              {/* ── corner glow accent ── */}
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-violet-600/15 blur-[40px]"
              />
            </div>

            {/* floating SDK pills below terminal */}
            <div className="flex flex-wrap gap-2.5 mt-5 justify-end">
              {["Python SDK", "Node.js SDK", "REST API", "Webhooks"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-[11px] font-semibold text-white/35 tracking-wide"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ApiSection;
