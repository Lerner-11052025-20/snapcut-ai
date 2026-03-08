import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Users, Image as ImageIcon, Zap, Star } from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const itemVariants: Variants = {
    hidden: { opacity: 0, y: 32, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } },
};

const STATS = [
    { icon: Users, value: "2.4M+", label: "Active Users", color: "#a78bfa", glow: "rgba(167,139,250,0.2)" },
    { icon: ImageIcon, value: "180M+", label: "Images Processed", color: "#60a5fa", glow: "rgba(96,165,250,0.2)" },
    { icon: Zap, value: "0.8s", label: "Avg. Processing Time", color: "#34d399", glow: "rgba(52,211,153,0.2)" },
    { icon: Star, value: "4.9★", label: "Average Rating", color: "#fbbf24", glow: "rgba(251,191,36,0.2)" },
];

const StatsSection = () => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <section className="relative py-20 bg-[#050507] overflow-hidden">
            {/* top border glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

            <div ref={ref} className="relative z-10 container mx-auto px-4 max-w-6xl">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {STATS.map(({ icon: Icon, value, label, color, glow }) => (
                        <motion.div
                            key={label}
                            variants={itemVariants}
                            className="group relative flex flex-col items-center text-center p-8 rounded-[24px] border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:-translate-y-1 transition-transform duration-300 overflow-hidden"
                            style={{ willChange: "transform" }}
                        >
                            {/* hover glow */}
                            <div
                                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[24px]"
                                style={{ background: `radial-gradient(circle at 50% 0%, ${glow}, transparent 70%)` }}
                            />
                            <div
                                className="h-12 w-12 rounded-2xl flex items-center justify-center mb-4"
                                style={{ background: `${color}18`, border: `1px solid ${color}30` }}
                            >
                                <Icon size={22} style={{ color }} strokeWidth={1.8} />
                            </div>
                            <span className="text-4xl font-black text-white tracking-tight mb-1">{value}</span>
                            <span className="text-[13px] font-semibold text-white/40 uppercase tracking-widest">{label}</span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default StatsSection;
