import Navbar from "@/components/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Building2 } from "lucide-react";

const ContactUs = () => {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
            <Navbar />
            <main className="container mx-auto px-6 py-32 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass rounded-[2.5rem] p-8 md:p-12 border-white/5 shadow-2xl"
                >
                    <div className="text-center mb-16">
                        <h1 className="font-display text-4xl md:text-5xl font-black mb-4 tracking-tight gradient-text inline-block">
                            Contact Us
                        </h1>
                        <p className="text-muted-foreground font-medium text-lg">
                            We're here to help you with your SnapCut experience.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Information Grid */}
                        <div className="space-y-6">
                            <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all group">
                                <Building2 size={24} className="text-primary mt-1 group-hover:scale-110 transition-transform" />
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-1">Trade Name</h3>
                                    <p className="font-bold text-white text-lg">SnapCut AI Pvt. Ltd.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all group">
                                <Mail size={24} className="text-secondary mt-1 group-hover:scale-110 transition-transform" />
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-1">Email Support</h3>
                                    <p className="font-bold text-white text-lg">support@snapcut-ai.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all group">
                                <Phone size={24} className="text-blue-400 mt-1 group-hover:scale-110 transition-transform" />
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-1">Phone Number</h3>
                                    <p className="font-bold text-white text-lg">+91 [Insert Phone]</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all group">
                                <MapPin size={24} className="text-purple-400 mt-1 group-hover:scale-110 transition-transform" />
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-1">Registered Address</h3>
                                    <p className="font-bold text-white text-lg">
                                        [Insert Full Address]<br />
                                        City, State, Zip – India
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Additional Info Box */}
                        <div className="glass rounded-[2rem] p-8 border-white/5 flex flex-col justify-center">
                            <h2 className="text-2xl font-bold mb-6 tracking-tight text-white">Get in touch</h2>
                            <div className="space-y-4 text-muted-foreground leading-relaxed font-medium">
                                <p>
                                    Have technical questions? Check our FAQ or reach out to our dedicated support team via email for a response within 24 hours.
                                </p>
                                <p>
                                    For business inquiries, partnerships, or API enterprise requests, please use our trade name and registered address in your formal communication.
                                </p>
                                <p className="pt-4 text-xs italic">
                                    Last updated: {new Date().toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default ContactUs;
