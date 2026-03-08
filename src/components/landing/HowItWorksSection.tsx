import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Upload, Cpu, Download } from "lucide-react";

/* ── ease ───────────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ── variants ───────────────────────────────────────────────────────── */
const headerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.1 } },
};

const stepVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.65, ease: EASE },
  },
};

/* ── step data ──────────────────────────────────────────────────────── */
const STEPS = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Your Image",
    description: "Drag & drop or click to upload any JPG, PNG, or WEBP image.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Processes It",
    description:
      "Our V3.0 AI instantly detects and removes the background in seconds.",
  },
  {
    icon: Download,
    step: "03",
    title: "Download Result",
    description: "Get your clean transparent PNG ready for any use case.",
  },
];

/* ── component ──────────────────────────────────────────────────────── */
const HowItWorksSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="how-it-works"
      className="relative py-32 bg-[#050507] overflow-hidden"
    >
      {/* ── subtle ambient glow ── */}
      <div aria-hidden={true} className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] rounded-full bg-violet-900/10 blur-[90px]" />
      </div>

      <div ref={ref} className="relative z-10 container mx-auto px-4">

        {/* ── HEADER ── */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-24"
        >
          <h2 className="font-display text-5xl sm:text-6xl font-black text-white mb-5 tracking-tight">
            How It Works
          </h2>
          <p className="text-[#a1a1aa] text-lg max-w-md mx-auto font-medium">
            Three simple steps to a perfect cutout.
          </p>
        </motion.div>

        {/* ── STEPS ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative grid md:grid-cols-3 gap-10 lg:gap-16 max-w-5xl mx-auto"
        >
          {/* connector lines (desktop only) */}
          <div
            aria-hidden={true}
            className="hidden md:block absolute top-[52px] left-[calc(16.67%+36px)] right-[calc(16.67%+36px)] h-px"
            style={{
              background:
                "linear-gradient(90deg,transparent,rgba(139,92,246,0.35) 20%,rgba(139,92,246,0.35) 80%,transparent)",
            }}
          />

          {STEPS.map((step) => (
            <motion.div
              key={step.step}
              variants={stepVariants}
              className="group flex flex-col items-center text-center"
              style={{ willChange: "transform" }}
            >
              {/* ── icon square + badge ── */}
              <div className="relative mb-9">
                {/* main rounded-square icon */}
                <div
                  className="w-[104px] h-[104px] rounded-[28px] flex items-center justify-center transition-all duration-300 group-hover:scale-[1.07] group-hover:shadow-[0_0_70px_rgba(139,92,246,0.35)]"
                  style={{
                    background:
                      "linear-gradient(145deg,#7c3aed 0%,#6d28d9 50%,#4f46e5 100%)",
                    boxShadow: "0 0 48px rgba(109,40,217,0.25), inset 0 1px 0 rgba(255,255,255,0.12)",
                    willChange: "transform",
                  }}
                >
                  <step.icon
                    size={40}
                    className="text-white drop-shadow-md"
                    strokeWidth={1.6}
                  />
                </div>

                {/* floating step badge — top-right corner */}
                <div
                  className="absolute -top-3 -right-3 h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-black text-white select-none shadow-[0_4px_16px_rgba(168,85,247,0.4)]"
                  style={{
                    background:
                      "linear-gradient(135deg,#a855f7,#7c3aed)",
                    border: "2px solid rgba(10,10,20,0.8)",
                  }}
                >
                  {step.step}
                </div>
              </div>

              {/* ── text ── */}
              <h3 className="font-display font-black text-[21px] text-white mb-3 tracking-tight">
                {step.title}
              </h3>
              <p className="text-[#8a8a93] text-[14.5px] leading-relaxed font-medium max-w-[240px]">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default HowItWorksSection;
