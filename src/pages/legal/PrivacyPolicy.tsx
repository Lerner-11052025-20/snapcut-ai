import Navbar from "@/components/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
            <Navbar />
            <main className="container mx-auto px-6 py-32 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-[2.5rem] p-8 md:p-12 border-white/5 shadow-2xl"
                >
                    <h1 className="font-display text-4xl md:text-5xl font-black mb-8 tracking-tight gradient-text">
                        Privacy Policy
                    </h1>

                    <div className="space-y-8 text-muted-foreground leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest text-[13px]">1. Introduction</h2>
                            <p>
                                Welcome to SnapCut AI ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your data when you use our SaaS platform.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest text-[13px]">2. Information We Collect</h2>
                            <p className="mb-4">We collect several types of information to provide and improve our services:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Personal Data:</strong> Name, email address, and billing information when you subscribe to a pro plan.</li>
                                <li><strong>Usage Data:</strong> Information on how you interact with our website and application.</li>
                                <li><strong>Image Data:</strong> Images you upload for background removal are processed on our secure servers and are not stored permanently unless you choose to save them to your history.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest text-[13px]">3. How We Use Your Information</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>To provide and maintain our Service.</li>
                                <li>To manage your Account.</li>
                                <li>To process payments via Razorpay.</li>
                                <li>To notify you about changes to our Service.</li>
                                <li>To provide customer support.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest text-[13px]">4. Data Security</h2>
                            <p>
                                The security of your data is important to us. We implement industry-standard security measures to protect your personal information. However, please remember that no method of transmission over the Internet is 100% secure.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest text-[13px]">5. Third-Party Services</h2>
                            <p>
                                We use Razorpay for payment processing. We do not store or collect your payment card details. That information is provided directly to Razorpay, whose use of your personal information is governed by their Privacy Policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest text-[13px]">6. Contact Us</h2>
                            <p>
                                If you have any questions about this Privacy Policy, please contact us at support@snapcut-ai.com.
                            </p>
                        </section>

                        <p className="pt-8 text-xs italic">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
