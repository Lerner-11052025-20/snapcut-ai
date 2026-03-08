import { useRef, useState } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Mail, Send, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const PERKS = [
    "V3.0 model release notes",
    "Early access to new features",
    "Exclusive Pro discounts",
    "AI & design tips every week",
];

const NewsletterSection = () => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !email.includes("@")) {
            toast.error("Please enter a valid email address.");
            return;
        }
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1000));
        setLoading(false);
        setSubmitted(true);
        toast.success("You're subscribed! 🎉 Check your inbox.");
    };

    return (
        <section className="relative py-32 bg-[#050507] overflow-hidden">
            {/* top line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

            {/* glow */}
            <div aria-hidden={true} className="pointer-events-none absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full bg-violet-900/10 blur-[110px]" />
            </div>

            <motion.div
                ref={ref}
                variants={sectionVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="relative z-10 container mx-auto px-4 max-w-3xl"
            >
                {/* card */}
                <div
                    className="relative rounded-[32px] border border-white/[0.08] overflow-hidden p-10 sm:p-14 text-center"
                    style={{
                        background: "linear-gradient(145deg,rgba(15,13,26,0.95),rgba(10,10,20,0.98))",
                        boxShadow: "0 0 0 1px rgba(139,92,246,0.10), 0 32px 80px rgba(0,0,0,0.5)",
                    }}
                >
                    {/* corner glows */}
                    <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-violet-600/10 blur-[70px]" />
                    <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-blue-600/8 blur-[70px]" />

                    <div className="relative z-10">
                        {/* badge */}
                        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10">
                            <Sparkles size={11} className="text-violet-400" />
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-violet-300">
                                V3.0 Newsletter
                            </span>
                        </div>

                        {submitted ? (
                            <div className="flex flex-col items-center gap-4">
                                <CheckCircle2 size={56} className="text-green-400" strokeWidth={1.3} />
                                <h2 className="text-3xl font-black text-white">You're In!</h2>
                                <p className="text-white/50 text-[15px] font-medium max-w-sm">
                                    Welcome aboard. Check your inbox for a confirmation and your first issue of the V3.0 digest.
                                </p>
                            </div>
                        ) : (
                            <>
                                <h2 className="font-black text-4xl sm:text-5xl text-white tracking-tight mb-4 leading-tight">
                                    Stay Ahead with{" "}
                                    <span
                                        style={{
                                            background: "linear-gradient(135deg,#a78bfa,#60a5fa)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                        }}
                                    >
                                        V3.0 Updates
                                    </span>
                                </h2>
                                <p className="text-white/45 text-lg font-medium mb-8 max-w-xl mx-auto">
                                    Get release notes, AI tips, and exclusive discounts from the SnapCut AI team — straight to your inbox.
                                </p>

                                {/* perks row */}
                                <div className="flex flex-wrap justify-center gap-3 mb-8">
                                    {PERKS.map((p) => (
                                        <span
                                            key={p}
                                            className="flex items-center gap-1.5 text-[12px] font-semibold text-white/40 border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 rounded-full"
                                        >
                                            <Mail size={10} className="text-violet-400" />
                                            {p}
                                        </span>
                                    ))}
                                </div>

                                {/* form */}
                                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="flex-1 h-12 px-5 rounded-full border border-white/[0.08] bg-white/[0.05] text-white placeholder:text-white/25 text-[14.5px] font-medium focus:outline-none focus:border-violet-500/40 focus:bg-violet-500/5 transition-all duration-200"
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="h-12 px-6 rounded-full text-[13.5px] font-black uppercase tracking-[0.14em] text-white flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.04] active:scale-[0.97] disabled:opacity-60 shrink-0"
                                        style={{
                                            background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                                            boxShadow: "0 4px 20px rgba(124,58,237,0.35)",
                                        }}
                                    >
                                        {loading
                                            ? <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                            : <><Send size={13} /> Subscribe</>
                                        }
                                    </button>
                                </form>
                                <p className="mt-4 text-[11.5px] text-white/25 font-medium">
                                    No spam, ever. Unsubscribe anytime. 100% free.
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default NewsletterSection;
