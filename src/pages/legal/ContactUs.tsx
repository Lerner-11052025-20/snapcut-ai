import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/landing/Footer";
import { motion, useInView } from "framer-motion";
import { Mail, MessageSquare, MapPin, Sparkles, Send, Zap } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const ContactUs = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        // Simulate sending
        await new Promise((r) => setTimeout(r, 1500));
        setSending(false);
        setSent(true);
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setSent(false), 4000);
    };

    const contactCards = [
        {
            icon: <Mail size={22} className="text-[#60a5fa]" />,
            label: "Email Us",
            value: "support@snapcutai.com",
            bgColor: "from-[#60a5fa]/10 to-[#60a5fa]/5",
            borderColor: "border-[#60a5fa]/15",
            iconBg: "bg-[#60a5fa]/10 border-[#60a5fa]/20",
        },
        {
            icon: <MessageSquare size={22} className="text-[#a855f7]" />,
            label: "Live Chat",
            value: "Available 9am–9pm IST",
            bgColor: "from-[#a855f7]/10 to-[#a855f7]/5",
            borderColor: "border-[#a855f7]/15",
            iconBg: "bg-[#a855f7]/10 border-[#a855f7]/20",
        },
        {
            icon: <MapPin size={22} className="text-[#34d399]" />,
            label: "Headquarters",
            value: "Bengaluru, India",
            bgColor: "from-[#34d399]/10 to-[#34d399]/5",
            borderColor: "border-[#34d399]/15",
            iconBg: "bg-[#34d399]/10 border-[#34d399]/20",
        },
    ];

    return (
        <div className="min-h-screen bg-[#020617] text-foreground selection:bg-primary/30">
            <Navbar />

            {/* ── Background Ambience ── */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-15%] left-[10%] w-[40%] h-[40%] rounded-full bg-[#60a5fa]/6 blur-[150px]" />
                <div className="absolute bottom-[-10%] right-[5%] w-[35%] h-[35%] rounded-full bg-[#a855f7]/6 blur-[130px]" />
            </div>

            <main
                ref={sectionRef}
                className="relative z-10 container mx-auto px-6 pt-36 pb-24 max-w-5xl"
            >
                {/* ── Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, ease: EASE }}
                    className="text-center mb-16"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#a855f7]/10 border border-[#a855f7]/20 mb-6">
                        <Sparkles size={14} className="text-[#a855f7]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#a855f7]">
                            Contact
                        </span>
                    </div>

                    <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black mb-5 tracking-tight text-white leading-[1.1]">
                        We're Here to Help
                    </h1>
                    <p className="text-[#a1a1aa] font-medium text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                        Have a question, idea, or issue? Reach out to the SnapCut
                        AI team — we reply within 24 hours.
                    </p>
                </motion.div>

                {/* ── Content Grid ── */}
                <div className="grid lg:grid-cols-2 gap-8 items-start">

                    {/* ── Left: Contact Cards ── */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
                        className="space-y-5"
                    >
                        {contactCards.map((card, i) => (
                            <motion.div
                                key={card.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: EASE }}
                                className={`flex items-center gap-5 p-6 rounded-2xl bg-gradient-to-r ${card.bgColor} border ${card.borderColor} backdrop-blur-xl hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-500 group cursor-default`}
                            >
                                <div className={`h-12 w-12 rounded-xl ${card.iconBg} border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                    {card.icon}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">
                                        {card.label}
                                    </p>
                                    <p className="text-[15px] font-bold text-white leading-none">
                                        {card.value}
                                    </p>
                                </div>
                            </motion.div>
                        ))}

                        {/* AI Support Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.55, ease: EASE }}
                            className="flex items-center gap-3 p-4 rounded-xl bg-[#7c3aed]/8 border border-[#7c3aed]/15 backdrop-blur-xl"
                        >
                            <div className="h-8 w-8 rounded-lg bg-[#7c3aed]/15 border border-[#7c3aed]/20 flex items-center justify-center shrink-0">
                                <Zap size={14} className="text-[#a855f7]" />
                            </div>
                            <p className="text-[12px] text-white/50 font-medium leading-snug">
                                <span className="font-black text-[#a855f7]">V3.0 Intelligence Hub</span>{" "}
                                powers our support AI — get instant answers to common questions.
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* ── Right: Contact Form ── */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
                    >
                        <form
                            onSubmit={handleSubmit}
                            className="glass rounded-[2rem] p-8 md:p-10 border border-white/[0.06] bg-[#0a0a12]/80 backdrop-blur-3xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] space-y-6"
                        >
                            {/* Name */}
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-2.5">
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    required
                                    className="w-full px-5 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[14px] font-medium placeholder:text-white/20 focus:outline-none focus:border-[#a855f7]/40 focus:ring-1 focus:ring-[#a855f7]/20 focus:bg-white/[0.06] transition-all duration-300"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-2.5">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full px-5 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[14px] font-medium placeholder:text-white/20 focus:outline-none focus:border-[#a855f7]/40 focus:ring-1 focus:ring-[#a855f7]/20 focus:bg-white/[0.06] transition-all duration-300"
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-2.5">
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    placeholder="Tell us how we can help..."
                                    required
                                    rows={5}
                                    className="w-full px-5 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[14px] font-medium placeholder:text-white/20 focus:outline-none focus:border-[#a855f7]/40 focus:ring-1 focus:ring-[#a855f7]/20 focus:bg-white/[0.06] transition-all duration-300 resize-none"
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={sending}
                                className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#c084fc] text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(124,58,237,0.3)] hover:shadow-[0_15px_40px_rgba(124,58,237,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {sending ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Sending...
                                    </>
                                ) : sent ? (
                                    <>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Message Sent!
                                    </>
                                ) : (
                                    <>
                                        Send Message <Send size={14} strokeWidth={2.5} />
                                    </>
                                )}
                            </button>

                            {sent && (
                                <motion.p
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center text-[12px] font-bold text-[#34d399]"
                                >
                                    Thank you! We'll get back to you within 24 hours.
                                </motion.p>
                            )}
                        </form>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ContactUs;
