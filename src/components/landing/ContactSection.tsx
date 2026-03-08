import { useRef, useState } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Mail, MessageSquare, MapPin, Send, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const colVariants: Variants = {
    hidden: { opacity: 0, x: -32 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
};
const formVariants: Variants = {
    hidden: { opacity: 0, x: 32 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
};

const CONTACT_ITEMS = [
    { icon: Mail, label: "Email Us", value: "support@snapcutai.com", href: "mailto:support@snapcutai.com" },
    { icon: MessageSquare, label: "Live Chat", value: "Available 9am–9pm IST", href: "#" },
    { icon: MapPin, label: "Headquarters", value: "Bengaluru, India", href: "#" },
];

const ContactSection = () => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });
    const [sent, setSent] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.message) {
            toast.error("Please fill in all fields.");
            return;
        }
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1200)); // simulate send
        setLoading(false);
        setSent(true);
        toast.success("Message sent! We'll reply within 24 hours.");
    };

    return (
        <section className="relative py-32 bg-[#050507] overflow-hidden">
            <div aria-hidden={true} className="pointer-events-none absolute inset-0">
                <div className="absolute -top-16 left-0 w-[380px] h-[380px] rounded-full bg-blue-900/8 blur-[90px]" />
                <div className="absolute -bottom-16 right-0 w-[380px] h-[380px] rounded-full bg-violet-900/8 blur-[90px]" />
            </div>

            <div ref={ref} className="relative z-10 container mx-auto px-4 max-w-6xl">
                {/* header */}
                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, ease: EASE }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10">
                        <Sparkles size={11} className="text-blue-400" />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-300">Contact</span>
                    </div>
                    <h2 className="font-display text-5xl sm:text-6xl font-black text-white tracking-tight mb-4">
                        We're Here to Help
                    </h2>
                    <p className="text-[#a1a1aa] text-lg font-medium max-w-lg mx-auto">
                        Have a question, idea, or issue? Reach out to the SnapCut AI team — we reply within 24 hours.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* left: contact info */}
                    <motion.div
                        variants={colVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        className="flex flex-col gap-6"
                    >
                        {CONTACT_ITEMS.map(({ icon: Icon, label, value, href }) => (
                            <a
                                key={label}
                                href={href}
                                className="group flex items-center gap-5 p-6 rounded-[20px] border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-blue-500/25 hover:bg-blue-500/5 transition-all duration-300"
                            >
                                <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                                    <Icon size={20} className="text-blue-400" strokeWidth={1.8} />
                                </div>
                                <div>
                                    <p className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-1">{label}</p>
                                    <p className="text-[15px] font-semibold text-white/80 group-hover:text-white transition-colors">{value}</p>
                                </div>
                            </a>
                        ))}

                        {/* V3.0 note */}
                        <div className="p-6 rounded-[20px] border border-violet-500/20 bg-violet-500/5">
                            <p className="text-[13.5px] text-violet-300/70 font-medium leading-relaxed">
                                <span className="text-violet-300 font-bold">V3.0 Intelligence Hub</span> powers our support AI — get instant answers to common questions without waiting for a human agent.
                            </p>
                        </div>
                    </motion.div>

                    {/* right: form */}
                    <motion.div
                        variants={formVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                    >
                        {sent ? (
                            <div className="flex flex-col items-center justify-center gap-4 p-12 rounded-[24px] border border-green-500/20 bg-green-500/5 text-center min-h-[360px]">
                                <CheckCircle2 size={52} className="text-green-400" strokeWidth={1.4} />
                                <h3 className="text-2xl font-black text-white">Message Sent!</h3>
                                <p className="text-white/50 text-[15px] font-medium max-w-xs">
                                    Thanks for reaching out. Our team will get back to you within 24 hours.
                                </p>
                            </div>
                        ) : (
                            <form
                                onSubmit={handleSubmit}
                                className="flex flex-col gap-4 p-8 rounded-[24px] border border-white/[0.07] bg-white/[0.02] backdrop-blur-sm"
                            >
                                {[
                                    { id: "name", label: "Your Name", type: "text", placeholder: "John Doe" },
                                    { id: "email", label: "Email Address", type: "email", placeholder: "you@example.com" },
                                ].map(({ id, label, type, placeholder }) => (
                                    <div key={id} className="flex flex-col gap-1.5">
                                        <label htmlFor={id} className="text-[12px] font-black uppercase tracking-widest text-white/40">{label}</label>
                                        <input
                                            id={id}
                                            type={type}
                                            placeholder={placeholder}
                                            value={form[id as "name" | "email"]}
                                            onChange={(e) => setForm({ ...form, [id]: e.target.value })}
                                            className="w-full h-12 px-4 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white placeholder:text-white/20 text-[14.5px] font-medium focus:outline-none focus:border-violet-500/40 focus:bg-violet-500/5 transition-all duration-200"
                                        />
                                    </div>
                                ))}
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="message" className="text-[12px] font-black uppercase tracking-widest text-white/40">Message</label>
                                    <textarea
                                        id="message"
                                        rows={5}
                                        placeholder="Tell us how we can help..."
                                        value={form.message}
                                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white placeholder:text-white/20 text-[14.5px] font-medium focus:outline-none focus:border-violet-500/40 focus:bg-violet-500/5 transition-all duration-200 resize-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-2 h-12 rounded-xl text-[14px] font-black uppercase tracking-[0.14em] text-white flex items-center justify-center gap-2.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                                    style={{
                                        background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                                        boxShadow: "0 4px 24px rgba(124,58,237,0.35)",
                                    }}
                                >
                                    {loading ? (
                                        <span className="inline-block h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>Send Message <Send size={14} /></>
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
