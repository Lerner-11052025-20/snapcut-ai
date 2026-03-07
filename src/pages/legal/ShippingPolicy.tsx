import Navbar from "@/components/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";

const ShippingPolicy = () => {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
            <Navbar />
            <main className="container mx-auto px-6 py-32 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass rounded-[2.5rem] p-8 md:p-12 border-white/5 shadow-2xl"
                >
                    <h1 className="font-display text-4xl md:text-5xl font-black mb-8 tracking-tight gradient-text text-center">
                        Shipping & Delivery
                    </h1>

                    <div className="space-y-8 text-muted-foreground leading-relaxed text-center max-w-2xl mx-auto">
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest text-[13px]">1. Digital Delivery Mode</h2>
                            <p>
                                SnapCut AI is a software-as-a-service (SaaS) platform providing digital image processing. We do not ship physical products to your address.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest text-[13px]">2. Instant Activation</h2>
                            <p>
                                After a successful payment via Razorpay, your "Pro" subscription will be activated instantly on your account.
                            </p>
                            <p className="mt-4">
                                You can immediately access unlimited removals, HD quality output, and other Pro features directly from the workspace.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest text-[13px]">3. Transaction Confirmation</h2>
                            <p>
                                A confirmation of your payment will be sent to your registered email address as soon as it is processed and confirmed by Razorpay.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest text-[13px]">4. Delivery Issues</h2>
                            <p>
                                In the rare case that your account is not upgraded within 10 minutes of a successful payment, please contact us immediately at support@snapcut-ai.com with your transaction details.
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

export default ShippingPolicy;
