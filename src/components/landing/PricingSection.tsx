import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    features: ["5 removals per day", "Standard quality", "Max 5MB uploads", "Community support"],
    cta: "Get Started",
    featured: false,
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
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground text-lg">
            Start free. Upgrade when you're ready.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl p-8 ${
                plan.featured
                  ? "glass border-primary/40 shadow-glow relative"
                  : "glass"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="font-display font-bold text-xl mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-display text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check size={16} className="text-secondary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.featured ? "hero" : "outline"}
                className="w-full"
                size="lg"
                asChild
              >
                <Link to="/register">{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
