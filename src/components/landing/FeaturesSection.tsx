import { motion } from "framer-motion";
import { Zap, Shield, Image, Smartphone, Code, CreditCard } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Remove backgrounds in under 5 seconds with our optimized AI pipeline.",
  },
  {
    icon: Image,
    title: "HD Quality Output",
    description: "Get clean, artifact-free transparent PNGs up to 5000×5000 resolution.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "All images auto-delete after 24 hours. No permanent storage, ever.",
  },
  {
    icon: Smartphone,
    title: "Works Everywhere",
    description: "Fully responsive — works perfectly on desktop, tablet, and mobile.",
  },
  {
    icon: Code,
    title: "Developer API",
    description: "Integrate background removal into your apps with our REST API.",
  },
  {
    icon: CreditCard,
    title: "Flexible Pricing",
    description: "Free tier, subscriptions, or pay-per-image credits. You choose.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Everything You Need
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Professional background removal made simple, fast, and affordable.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-6 hover:shadow-glow transition-all duration-300 group"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon size={24} className="text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
