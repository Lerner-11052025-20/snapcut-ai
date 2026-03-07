import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const PricingSection = () => {
  const navigate = useNavigate();

  const handlePayment = (planName: string, amount: number) => {
    // Validation: Verify if Razorpay script is loaded
    if (!(window as any).Razorpay) {
      toast.error("Payment gateway is temporarily unavailable. Please refresh.");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || "your_test_key", // Fallback for safety
      amount: amount * 100, // Amount in paise (499 * 100)
      currency: "INR",
      name: "SnapCut AI",
      description: `Subscription for ${planName} Plan`,
      image: "/logo.png",
      handler: function (response: any) {
        // This is where you would send the response to your backend
        // response.razorpay_payment_id
        // response.razorpay_order_id
        // response.razorpay_signature
        toast.success(`Payment Successful! ID: ${response.razorpay_payment_id}`);
        console.log("Payment details:", response);
        navigate("/upload"); // Redirect to workspace on success
      },
      prefill: {
        name: "User Name",
        email: "user@example.com",
        contact: "9999999999"
      },
      notes: {
        address: "SnapCut AI Corporate Office"
      },
      theme: {
        color: "#6366f1" // primary color
      }
    };

    const rzp1 = new (window as any).Razorpay(options);
    rzp1.on('payment.failed', function (response: any) {
      toast.error(`Payment Failed: ${response.error.description}`);
      console.error("Payment error:", response.error);
    });
    rzp1.open();
  };

  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      features: ["5 removals per day", "Standard quality", "Max 5MB uploads", "Community support"],
      cta: "Get Started",
      featured: false,
      onClick: () => navigate("/register")
    },
    {
      name: "Pro",
      price: "₹499",
      period: "/month",
      features: [
        "Unlimited removals",
        "HD quality output",
        "Max 10MB uploads",
        "Priority processing",
        "Batch processing",
        "Email support",
      ],
      cta: "Start Pro Trial",
      featured: true,
      onClick: () => handlePayment("Pro", 499)
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      features: [
        "Everything in Pro",
        "API access",
        "Custom rate limits",
        "Dedicated support",
        "SLA guarantee",
        "Usage analytics",
      ],
      cta: "Contact Sales",
      featured: false,
      onClick: () => navigate("/contact")
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-[#020617] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-primary/5 blur-[120px] rounded-full -z-10" />

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-primary mb-4">
            <CreditCard size={12} />
            Flexible Plans
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-black mb-4 tracking-tight">
            Simple, Transparent <span className="text-gradient">Pricing</span>
          </h2>
          <p className="text-muted-foreground/80 font-medium text-lg max-w-2xl mx-auto">
            Unlock elite AI features and unlimited background removals with our flexible subscription plans.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`group relative rounded-[2.5rem] p-10 border transition-all duration-500 hover:scale-[1.02] ${plan.featured
                ? "bg-white/[0.03] border-primary/30 shadow-glow"
                : "bg-white/[0.01] border-white/5 hover:border-white/20"
                }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold uppercase tracking-widest text-white/50 mb-4">{plan.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white tracking-tighter">{plan.price}</span>
                  <span className="text-muted-foreground font-bold uppercase tracking-widest text-xs">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-10">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm font-medium text-muted-foreground/80">
                    <div className="h-5 w-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Check size={12} className="text-primary" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.featured ? "hero" : "outline"}
                className={`w-full rounded-2xl h-14 font-black uppercase tracking-widest text-xs transition-all ${plan.featured ? "shadow-glow-accent" : "hover:bg-white/5"}`}
                onClick={plan.onClick}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
