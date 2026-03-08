import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence, type Variants } from "framer-motion";
import { Plus, Minus, Sparkles } from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const headerVariants: Variants = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};
const listVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};
const rowVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
};

const FAQS = [
    {
        q: "How does SnapCut AI remove backgrounds?",
        a: "SnapCut AI uses the V3.0 Intelligence Hub — our proprietary deep-learning model trained on 500M+ images. It identifies subjects at the pixel level, handles complex edges like hair and fur, and outputs a clean transparent PNG in under 0.8 seconds.",
    },
    {
        q: "What file formats are supported?",
        a: "We support JPG, JPEG, PNG, WEBP, and BMP. Output is always a lossless transparent PNG. Max upload size is 5 MB on the Free plan and 10 MB on the Pro plan.",
    },
    {
        q: "Is my data safe? Do you store my images?",
        a: "Privacy is our top priority. All images are processed in-memory and automatically deleted within 24 hours. We never use your images to train our models and never share them with third parties.",
    },
    {
        q: "What is the V3.0 Intelligence Hub?",
        a: "The V3.0 Intelligence Hub is our third-generation AI engine — a complete rewrite that achieves 40% sharper edges, 3× faster processing, and handles difficult cases like translucent objects, glasses, and complex hair patterns that older models struggle with.",
    },
    {
        q: "Do you offer a free tier?",
        a: "Yes! The Free plan gives you 5 high-quality background removals per day, no credit card required. Upgrade to Pro for unlimited removals, HD output, priority processing, and batch capabilities.",
    },
    {
        q: "How does billing work for the Pro plan?",
        a: "Pro is billed monthly at ₹499/month. You can cancel anytime — no contracts, no lock-in. We use Razorpay for secure payment processing with 256-bit SSL encryption.",
    },
    {
        q: "Is there a REST API available?",
        a: "Absolutely. The SnapCut AI REST API (V3.0) lets you integrate background removal into any app with a single POST request. API keys are available on the Pro and Enterprise plans. We also offer Python and Node.js SDKs.",
    },
];

const FAQItem = ({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) => (
    <motion.div variants={rowVariants} className="border-b border-white/[0.06] last:border-b-0">
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between gap-4 py-5 text-left group"
        >
            <span className="text-[15.5px] font-semibold text-white/85 group-hover:text-white transition-colors duration-200 leading-snug">
                {q}
            </span>
            <span className="shrink-0 h-7 w-7 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center transition-all duration-200 group-hover:border-violet-500/40 group-hover:bg-violet-500/10">
                {open
                    ? <Minus size={13} className="text-violet-400" />
                    : <Plus size={13} className="text-white/50" />
                }
            </span>
        </button>
        <AnimatePresence initial={false}>
            {open && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                >
                    <p className="pb-5 text-[14.5px] text-white/45 leading-relaxed font-medium">{a}</p>
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
);

const FAQSection = () => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });
    const [openIdx, setOpenIdx] = useState<number | null>(0);

    return (
        <section className="relative py-32 bg-[#050507] overflow-hidden">
            <div aria-hidden={true} className="pointer-events-none absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-violet-900/8 blur-[90px]" />
            </div>

            <div ref={ref} className="relative z-10 container mx-auto px-4 max-w-3xl">
                <motion.div
                    variants={headerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10">
                        <Sparkles size={11} className="text-violet-400" />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-violet-300">FAQ</span>
                    </div>
                    <h2 className="font-display text-5xl sm:text-6xl font-black text-white tracking-tight mb-4">
                        Got Questions?
                    </h2>
                    <p className="text-[#a1a1aa] text-lg font-medium">
                        Everything you need to know about SnapCut AI and the V3.0 Intelligence Hub.
                    </p>
                </motion.div>

                <motion.div
                    variants={listVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="rounded-[24px] border border-white/[0.07] bg-white/[0.02] backdrop-blur-sm px-8 divide-y-0"
                >
                    {FAQS.map((faq, i) => (
                        <FAQItem
                            key={i}
                            q={faq.q}
                            a={faq.a}
                            open={openIdx === i}
                            onToggle={() => setOpenIdx(openIdx === i ? null : i)}
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default FAQSection;
