import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Sparkles, Zap, Shield, Brain, Cpu, ArrowUpRight } from "lucide-react";
import { useLandingActions } from "@/hooks/useLandingActions";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const leftVariants: Variants = {
    hidden: { opacity: 0, x: -36 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: EASE } },
};
const rightVariants: Variants = {
    hidden: { opacity: 0, x: 36 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: EASE } },
};
const listVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};
const listItemVariants: Variants = {
    hidden: { opacity: 0, x: -16 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE } },
};

const MILESTONES = [
    { year: "2022", label: "Founded", desc: "SnapCut AI born from a vision to democratise professional-grade image editing." },
    { year: "2023", label: "V1.0 Launch", desc: "First public release. 50,000 sign-ups in the first month." },
    { year: "2024", label: "V2.0 & API", desc: "Launched the developer API. Processed 50 million images." },
    { year: "2025", label: "V3.0 Intelligence Hub", desc: "Complete AI rewrite. 40% sharper edges. 3× faster. 2.4M+ users." },
];

const VALUES = [
    { icon: Brain, title: "AI-First", desc: "Every decision starts with model quality. The V3.0 engine is our crown jewel.", color: "#a78bfa" },
    { icon: Zap, title: "Speed", desc: "0.8s average processing. We obsess over latency so you don't have to.", color: "#fbbf24" },
    { icon: Shield, title: "Privacy", desc: "Zero data retention. Your images are yours — processed and deleted in 24h.", color: "#34d399" },
    { icon: Cpu, title: "Reliability", desc: "99.9% uptime SLA. Built on redundant infrastructure across 3 global regions.", color: "#60a5fa" },
];

const AboutSection = () => {
    const { handleGetStarted } = useLandingActions();
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <section className="relative py-32 bg-[#050507] overflow-hidden">
            <div aria-hidden={true} className="pointer-events-none absolute inset-0">
                <div className="absolute top-0 right-0 w-[440px] h-[440px] rounded-full bg-violet-900/8 blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[440px] h-[440px] rounded-full bg-blue-900/8 blur-[120px]" />
            </div>

            <div ref={ref} className="relative z-10 container mx-auto px-4 max-w-7xl">

                {/* ── PART 1: About + Timeline ── */}
                <div className="grid lg:grid-cols-2 gap-16 items-start mb-28">
                    {/* left */}
                    <motion.div
                        variants={leftVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                    >
                        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10">
                            <Sparkles size={11} className="text-violet-400" />
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-violet-300">About SnapCut AI</span>
                        </div>

                        <h2 className="font-display text-5xl sm:text-6xl font-black text-white tracking-tight leading-[1.06] mb-6">
                            We Believe Great{" "}
                            <span
                                style={{
                                    background: "linear-gradient(135deg,#a78bfa,#60a5fa)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}
                            >
                                AI Should Be Simple
                            </span>
                        </h2>

                        <p className="text-white/50 text-lg font-medium leading-relaxed mb-6">
                            SnapCut AI started with a single frustration: professional background removal required expensive software, manual effort, and hours of time. We set out to change that.
                        </p>
                        <p className="text-white/40 text-[15.5px] font-medium leading-relaxed mb-8">
                            Today, the <span className="text-violet-400 font-semibold">V3.0 Intelligence Hub</span> — our third-generation AI engine — removes backgrounds in under 0.8 seconds with accuracy that rivals hours of manual Photoshop work. It handles hair, fur, glass, and translucent materials that older algorithms miss completely.
                        </p>
                        <p className="text-white/40 text-[15.5px] font-medium leading-relaxed mb-10">
                            We're a team of AI researchers, engineers, and designers headquartered in Bengaluru, India — building tools that empower 2.4 million creators, sellers, and developers worldwide.
                        </p>

                        <button
                            onClick={handleGetStarted}
                            className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-[14px] font-black uppercase tracking-[0.14em] text-white transition-all duration-200 hover:scale-[1.04]"
                            style={{
                                background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                                boxShadow: "0 4px 28px rgba(124,58,237,0.35)",
                            }}
                        >
                            Join 2.4M+ Users Free
                            <ArrowUpRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </button>
                    </motion.div>

                    {/* right — timeline */}
                    <motion.div
                        variants={rightVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        className="relative pl-8"
                    >
                        {/* vertical line */}
                        <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-violet-500/40 via-blue-500/20 to-transparent" />

                        <motion.div
                            variants={listVariants}
                            initial="hidden"
                            animate={isInView ? "visible" : "hidden"}
                            className="flex flex-col gap-8"
                        >
                            {MILESTONES.map((m) => (
                                <motion.div key={m.year} variants={listItemVariants} className="relative">
                                    {/* dot */}
                                    <div className="absolute -left-[33px] top-1 h-4 w-4 rounded-full border-2 border-violet-500/50 bg-[#050507] flex items-center justify-center">
                                        <div className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                                    </div>
                                    <div className="text-[11px] font-black uppercase tracking-widest text-violet-400/70 mb-1">{m.year} · {m.label}</div>
                                    <p className="text-white/50 text-[14.5px] font-medium leading-relaxed">{m.desc}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>

                {/* ── PART 2: Core Values ── */}
                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
                    className="text-center mb-12"
                >
                    <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Our Core Principles</h3>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {VALUES.map(({ icon: Icon, title, desc, color }, i) => (
                        <motion.div
                            key={title}
                            initial={{ opacity: 0, y: 28 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.55, delay: 0.35 + i * 0.1, ease: EASE }}
                            className="group flex flex-col gap-4 p-7 rounded-[24px] border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:-translate-y-1 transition-transform duration-300"
                            style={{ willChange: "transform" }}
                        >
                            <div
                                className="h-11 w-11 rounded-xl flex items-center justify-center"
                                style={{ background: `${color}18`, border: `1px solid ${color}30` }}
                            >
                                <Icon size={20} style={{ color }} strokeWidth={1.8} />
                            </div>
                            <h4 className="text-[16px] font-black text-white tracking-tight">{title}</h4>
                            <p className="text-[13px] text-white/40 font-medium leading-relaxed">{desc}</p>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default AboutSection;
