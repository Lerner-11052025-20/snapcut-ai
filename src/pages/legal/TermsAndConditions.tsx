import Navbar from "@/components/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";

const TermsAndConditions = () => {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
            <Navbar />
            <main className="container mx-auto px-6 py-32 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass rounded-[2.5rem] p-8 md:p-12 border-white/5 shadow-2xl"
                >
                    <h1 className="font-display text-4xl md:text-5xl font-black mb-8 tracking-tight gradient-text">
                        Terms and Conditions
                    </h1>

                    <div className="space-y-8 text-muted-foreground leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest text-[13px]">1. Acceptance of Terms</h2>
                            <p>
                                By accessing and using SnapCut AI, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest text-[13px]">2. Services Description</h2>
                            <p className="mb-4">
                                SnapCut AI provides an AI-powered image background removal service. We offer both free and subscription-based "Pro" plans.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest text-[13px]">3. Account Registration</h2>
                            <p>
                                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest text-[13px]">4. User Conduct</h2>
                            <p>
                                You agree to use the service only for lawful purposes. You are prohibited from uploading any images that are illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or libellous.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest text-[13px]">5. Payments and Subscriptions</h2>
                            <p className="mb-4">
                                Payments for our Pro plan are processed via Razorpay. By subscribing, you agree to pay the fees associated with the plan as selected.
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Failure to pay any subscription fees will result in the suspension of Pro features.</li>
                                <li>We reserve the right to change our fees at any time with prior notice.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest text-[13px]">6. Limitation of Liability</h2>
                            <p>
                                SnapCut AI shall not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest text-[13px]">7. Governing Law</h2>
                            <p>
                                These Terms shall be governed by and defined following the laws of India. You irrevocably consent that the courts of [Your City/State], India shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest text-[13px]">8. Contact Us</h2>
                            <p>
                                If you have any questions about these Terms, please contact us at support@snapcut-ai.com.
                            </p>
                        </section>

                        <p className="pt-8 text-xs italic text-center">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default TermsAndConditions;
