import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import {
    ShoppingBag,
    User,
    Film,
    Presentation,
    Palette,
    Globe,
    Sparkles,
    ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const gridVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
};
const cardVariants: Variants = {
    hidden: { opacity: 0, y: 32, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } },
};

const USE_CASES = [
    {
        icon: ShoppingBag,
        title: "E-commerce Product Photos",
        description: "Instantly clean white/transparent backgrounds for product listings on Amazon, Flipkart, and Shopify.",
        accent: "#60a5fa",
        glow: "rgba(96,165,250,0.15)",
        tag: "Most Popular",
    },
    {
        icon: User,
        title: "Portrait & ID Photos",
        description: "Remove distracting backgrounds from professional headshots, LinkedIn photos, and ID documents.",
        accent: "#a78bfa",
        glow: "rgba(167,139,250,0.15)",
        tag: null,
    },
    {
        icon: Film,
        title: "Content & Social Media",
        description: "Create thumb-stopping visuals for Instagram, YouTube thumbnails, and TikTok overlays in seconds.",
        accent: "#f472b6",
        glow: "rgba(244,114,182,0.15)",
        tag: null,
    },
    {
        icon: Presentation,
        title: "Presentations & Slides",
        description: "Drop cut-out assets into PowerPoint, Keynote, or Canva decks without any manual masking.",
        accent: "#34d399",
        glow: "rgba(52,211,153,0.15)",
        tag: null,
    },
    {
        icon: Palette,
        title: "Graphic Design",
        description: "Composite objects into new scenes, swap backgrounds, and create advertising creatives at scale.",
        accent: "#fbbf24",
        glow: "rgba(251,191,36,0.15)",
        tag: null,
    },
    {
        icon: Globe,
        title: "Developer & API Workflows",
        description: "Automate background removal in your pipeline using the V3.0 REST API — any language, any platform.",
        accent: "#67e8f9",
        glow: "rgba(103,232,249,0.15)",
        tag: "V3.0 API",
    },
];

const UseCasesSection = () => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <section className="relative py-32 bg-[#050507] overflow-hidden">
            <div aria-hidden={true} className="pointer-events-none absolute inset-0">
                <div className="absolute top-1/3 left-0 w-[350px] h-[350px] rounded-full bg-blue-900/8 blur-[90px]" />
                <div className="absolute bottom-1/3 right-0 w-[350px] h-[350px] rounded-full bg-violet-900/8 blur-[90px]" />
            </div>

            <div ref={ref} className="relative z-10 container mx-auto px-4 max-w-7xl">
                {/* header */}
                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, ease: EASE }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10">
                        <Sparkles size={11} className="text-blue-400" />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-300">
                            Use Cases
                        </span>
                    </div>
                    <h2 className="font-display text-5xl sm:text-6xl font-black text-white tracking-tight mb-4">
                        Background Removal{" "}
                        <span
                            style={{
                                background: "linear-gradient(135deg,#60a5fa,#a78bfa)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            for Everyone
                        </span>
                    </h2>
                    <p className="text-[#a1a1aa] text-lg font-medium max-w-xl mx-auto">
                        Whether you're a solo creator or an enterprise team, the V3.0 Intelligence Hub adapts to your workflow.
                    </p>
                </motion.div>

                {/* grid */}
                <motion.div
                    variants={gridVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12"
                >
                    {USE_CASES.map((uc) => (
                        <motion.div
                            key={uc.title}
                            variants={cardVariants}
                            className="group relative flex flex-col gap-4 p-7 rounded-[24px] border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:-translate-y-1 transition-transform duration-300 overflow-hidden"
                            style={{ willChange: "transform" }}
                        >
                            {/* glow */}
                            <div
                                className="pointer-events-none absolute -top-10 -left-10 w-52 h-52 rounded-full blur-[55px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{ background: uc.glow }}
                            />

                            {/* tag */}
                            {uc.tag && (
                                <span
                                    className="absolute top-5 right-5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                                    style={{ background: `${uc.accent}20`, color: uc.accent, border: `1px solid ${uc.accent}30` }}
                                >
                                    {uc.tag}
                                </span>
                            )}

                            {/* icon */}
                            <div
                                className="h-12 w-12 rounded-[14px] flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                                style={{ background: `${uc.accent}18`, border: `1px solid ${uc.accent}30` }}
                            >
                                <uc.icon size={22} style={{ color: uc.accent }} strokeWidth={1.7} />
                            </div>

                            <h3 className="text-[17px] font-black text-white tracking-tight leading-snug">{uc.title}</h3>
                            <p className="text-[13.5px] text-white/45 font-medium leading-relaxed">{uc.description}</p>

                            {/* bottom highlight */}
                            <div
                                className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{ background: `linear-gradient(90deg,transparent,${uc.accent},transparent)` }}
                            />
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.55, delay: 0.6, ease: "easeOut" }}
                    className="flex justify-center"
                >
                    <Link to="/upload">
                        <button
                            className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-[14.5px] font-black text-white uppercase tracking-[0.14em] transition-all duration-200 hover:scale-[1.04] active:scale-[0.97]"
                            style={{
                                background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                                boxShadow: "0 4px 28px rgba(124,58,237,0.35)",
                            }}
                        >
                            Try It Free — No Sign-up
                            <ArrowUpRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default UseCasesSection;
