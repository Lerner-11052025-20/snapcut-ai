import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Github, Linkedin, Twitter, Sparkles } from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const cardVariants: Variants = {
    hidden: { opacity: 0, y: 36, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } },
};

const TEAM = [
    {
        name: "Arjun Mehta",
        role: "Founder & CEO",
        bio: "Ex-Google ML engineer. Built the V3.0 Intelligence Hub from scratch.",
        avatar: "AM",
        gradient: "linear-gradient(135deg,#7c3aed,#4f46e5)",
        socials: { github: "#", linkedin: "#", twitter: "#" },
    },
    {
        name: "Priya Sharma",
        role: "Head of AI Research",
        bio: "PhD in Computer Vision. Architected our edge-detection neural network.",
        avatar: "PS",
        gradient: "linear-gradient(135deg,#0891b2,#2563eb)",
        socials: { github: "#", linkedin: "#", twitter: "#" },
    },
    {
        name: "Rohan Gupta",
        role: "Lead Full-Stack Engineer",
        bio: "7 years shipping SaaS. Built the real-time processing pipeline.",
        avatar: "RG",
        gradient: "linear-gradient(135deg,#059669,#0891b2)",
        socials: { github: "#", linkedin: "#", twitter: null },
    },
    {
        name: "Sneha Nair",
        role: "Head of Design",
        bio: "Crafted every pixel of SnapCut AI's experience with user-obsession.",
        avatar: "SN",
        gradient: "linear-gradient(135deg,#db2777,#9333ea)",
        socials: { github: null, linkedin: "#", twitter: "#" },
    },
];

const TeamSection = () => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <section id="team" className="relative py-32 bg-[#050507] overflow-hidden">
            <div aria-hidden={true} className="pointer-events-none absolute inset-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-indigo-900/8 blur-[100px]" />
            </div>

            <div ref={ref} className="relative z-10 container mx-auto px-4 max-w-6xl">
                {/* header */}
                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, ease: EASE }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10">
                        <Sparkles size={11} className="text-violet-400" />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-violet-300">The Team</span>
                    </div>
                    <h2 className="font-display text-5xl sm:text-6xl font-black text-white tracking-tight mb-4">
                        Built by Builders
                    </h2>
                    <p className="text-[#a1a1aa] text-lg font-medium max-w-xl mx-auto">
                        A passionate team of AI engineers, designers, and product thinkers — obsessed with pixel-perfect precision.
                    </p>
                </motion.div>

                {/* cards */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {TEAM.map((member) => (
                        <motion.div
                            key={member.name}
                            variants={cardVariants}
                            className="group relative flex flex-col items-center text-center gap-4 p-7 rounded-[24px] border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:-translate-y-1.5 transition-transform duration-300 overflow-hidden"
                            style={{ willChange: "transform" }}
                        >
                            {/* avatar */}
                            <div
                                className="h-20 w-20 rounded-full flex items-center justify-center text-2xl font-black text-white shadow-xl shrink-0 transition-transform duration-300 group-hover:scale-105"
                                style={{ background: member.gradient }}
                            >
                                {member.avatar}
                            </div>

                            <div>
                                <h3 className="text-[17px] font-black text-white tracking-tight mb-0.5">{member.name}</h3>
                                <p className="text-[11.5px] font-black uppercase tracking-widest text-white/35 mb-3">{member.role}</p>
                                <p className="text-[13.5px] text-white/45 font-medium leading-relaxed">{member.bio}</p>
                            </div>

                            {/* socials */}
                            <div className="flex items-center gap-2 mt-auto">
                                {member.socials.github && (
                                    <a href={member.socials.github} className="h-8 w-8 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] flex items-center justify-center transition-all duration-200">
                                        <Github size={14} className="text-white/40 hover:text-white transition-colors" />
                                    </a>
                                )}
                                {member.socials.linkedin && (
                                    <a href={member.socials.linkedin} className="h-8 w-8 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-blue-500/20 flex items-center justify-center transition-all duration-200">
                                        <Linkedin size={14} className="text-white/40 hover:text-blue-400 transition-colors" />
                                    </a>
                                )}
                                {member.socials.twitter && (
                                    <a href={member.socials.twitter} className="h-8 w-8 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-sky-500/20 flex items-center justify-center transition-all duration-200">
                                        <Twitter size={14} className="text-white/40 hover:text-sky-400 transition-colors" />
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default TeamSection;
