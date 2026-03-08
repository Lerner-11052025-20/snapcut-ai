import { useRef, useState } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const headerVariants: Variants = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};
const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.96, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

const TESTIMONIALS = [
    {
        name: "Akash Verma",
        role: "Product Designer, Flipkart",
        avatar: "AV",
        gradient: "linear-gradient(135deg,#7c3aed,#4f46e5)",
        stars: 5,
        text: "SnapCut AI is hands-down the fastest background removal tool I've used. The V3.0 engine handles hair and complex edges incredibly well — something that used to take me 10 minutes in Photoshop now takes 0.8 seconds.",
    },
    {
        name: "Meera Pillai",
        role: "E-commerce Seller, Amazon",
        avatar: "MP",
        gradient: "linear-gradient(135deg,#db2777,#9333ea)",
        stars: 5,
        text: "I process hundreds of product images a week. SnapCut AI's API integration with my workflow has been a game-changer. The output quality is consistently HD and the batch processing is incredibly reliable.",
    },
    {
        name: "David Chen",
        role: "Photographer, Singapore",
        avatar: "DC",
        gradient: "linear-gradient(135deg,#0891b2,#2563eb)",
        stars: 5,
        text: "I was skeptical at first, but the V3.0 Intelligence Hub genuinely impresses me. It correctly handles translucent fabric and fly-away hair — things that other tools completely butcher.",
    },
    {
        name: "Fatima Al-Rashid",
        role: "Social Media Manager, Dubai",
        avatar: "FA",
        gradient: "linear-gradient(135deg,#d97706,#dc2626)",
        stars: 5,
        text: "We create content daily and speed matters. SnapCut AI processes images faster than any competitor, the free tier is genuinely useful, and the Pro plan is absolutely worth it for teams.",
    },
    {
        name: "Rajesh Kumar",
        role: "Startup CTO, Pune",
        avatar: "RK",
        gradient: "linear-gradient(135deg,#059669,#0891b2)",
        stars: 5,
        text: "The REST API documentation is excellent and the V3.0 endpoint handles edge cases our previous vendor couldn't. Onboarding our engineering team took less than an hour.",
    },
    {
        name: "Sophie Laurent",
        role: "Graphic Designer, Paris",
        avatar: "SL",
        gradient: "linear-gradient(135deg,#7c3aed,#ec4899)",
        stars: 5,
        text: "The results are stunning — I can't believe how clean the output is on complex studio shots. SnapCut AI has completely replaced my manual masking workflow.",
    },
];

const TestimonialsSection = () => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });
    const [page, setPage] = useState(0);
    const PER_PAGE = 3;
    const totalPages = Math.ceil(TESTIMONIALS.length / PER_PAGE);
    const visible = TESTIMONIALS.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

    return (
        <section id="testimonials" className="relative py-32 bg-[#050507] overflow-hidden">
            <div aria-hidden={true} className="pointer-events-none absolute inset-0">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-violet-900/8 blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-blue-900/8 blur-[100px]" />
            </div>

            <div ref={ref} className="relative z-10 container mx-auto px-4 max-w-7xl">
                {/* header */}
                <motion.div
                    variants={headerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10">
                        <Star size={11} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-yellow-300">Testimonials</span>
                    </div>
                    <h2 className="font-display text-5xl sm:text-6xl font-black text-white tracking-tight mb-4">
                        Loved by Creators
                    </h2>
                    <p className="text-[#a1a1aa] text-lg font-medium max-w-lg mx-auto">
                        Join over 2.4 million users who trust SnapCut AI for pixel-perfect results every time.
                    </p>
                </motion.div>

                {/* cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {visible.map((t, i) => (
                        <motion.div
                            key={t.name}
                            variants={cardVariants}
                            initial="hidden"
                            animate={isInView ? "visible" : "hidden"}
                            transition={{ delay: i * 0.1 }}
                            className="group relative flex flex-col gap-5 p-7 rounded-[24px] border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:-translate-y-1 transition-transform duration-300 overflow-hidden"
                            style={{ willChange: "transform" }}
                        >
                            {/* quote icon */}
                            <Quote size={28} className="text-white/8 absolute top-5 right-5" />

                            {/* stars */}
                            <div className="flex gap-0.5">
                                {Array.from({ length: t.stars }).map((_, s) => (
                                    <Star key={s} size={14} className="text-yellow-400 fill-yellow-400" />
                                ))}
                            </div>

                            {/* text */}
                            <p className="text-[14px] text-white/55 font-medium leading-relaxed flex-1">"{t.text}"</p>

                            {/* author */}
                            <div className="flex items-center gap-3">
                                <div
                                    className="h-10 w-10 rounded-full flex items-center justify-center text-[13px] font-black text-white shrink-0"
                                    style={{ background: t.gradient }}
                                >
                                    {t.avatar}
                                </div>
                                <div>
                                    <p className="text-[14px] font-black text-white leading-none mb-0.5">{t.name}</p>
                                    <p className="text-[11.5px] text-white/35 font-medium">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* pagination */}
                <div className="flex items-center justify-center gap-3">
                    <button
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        disabled={page === 0}
                        className="h-10 w-10 rounded-full border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={16} className="text-white/60" />
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i)}
                            className={`h-2 rounded-full transition-all duration-300 ${i === page ? "w-8 bg-violet-400" : "w-2 bg-white/20"
                                }`}
                        />
                    ))}
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                        disabled={page === totalPages - 1}
                        className="h-10 w-10 rounded-full border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={16} className="text-white/60" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
