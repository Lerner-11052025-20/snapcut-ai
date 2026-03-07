import Navbar from "@/components/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";

const RefundPolicy = () => {
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
                        Refund and Cancellation
                    </h1>

                    <div className="space-y-8 text-muted-foreground leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest text-[13px]">1. Payment Processing</h2>
                            <p>
                                All payments for SnapCut AI Pro subscriptions are processed securely through Razorpay.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest text-[13px]">2. Cancellation Policy</h2>
                            <p className="mb-4">
                                You can cancel your subscription at any time. To cancel, please follow these steps:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Log in to your account.</li>
                                <li>Go to the Billing or Settings page.</li>
                                <li>Click on the "Cancel Subscription" button.</li>
                            </ul>
                            <p className="mt-4">
                                Once cancelled, you will continue to have access to Pro features until the end of your current billing period.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest text-[13px]">3. Refund Policy</h2>
                            <p className="mb-4">
                                Since SnapCut AI offers a digital service that is consumed immediately after processing, our refund policy is as follows:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Pro Subscriptions:</strong> Refunds are generally not provided once a subscription has been active for more than 48 hours. If you feel there's a technical error that prevented you from using the service, please contact us for a review.</li>
                                <li><strong>Annual Plans:</strong> Refunds for annual plans will be evaluated on a case-by-case basis.</li>
                                <li><strong>Chargebacks:</strong> We recommend contacting us first before initiating a chargeback through your bank.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest text-[13px]">4. Refund Process</h2>
                            <p>
                                If a refund is approved, it will be processed and automatically applied to your original method of payment within 7–10 business days, as per standard banking procedures via Razorpay.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest text-[13px]">5. Contact for Billing Issues</h2>
                            <p>
                                For any questions or concerns regarding billing, cancellations, or refunds, please reach out directly to support@snapcut-ai.com.
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

export default RefundPolicy;
