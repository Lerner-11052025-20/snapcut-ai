import { motion } from "framer-motion";
import { Upload, Cpu, Download } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Your Image",
    description: "Drag & drop or click to upload any JPG, PNG, or WEBP image.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Processes It",
    description: "Our AI instantly detects and removes the background in seconds.",
  },
  {
    icon: Download,
    step: "03",
    title: "Download Result",
    description: "Get your clean transparent PNG ready for any use case.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg">
            Three simple steps to a perfect cutout.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <div className="relative mx-auto mb-6">
                <div className="h-20 w-20 rounded-2xl gradient-primary flex items-center justify-center shadow-glow mx-auto">
                  <step.icon size={32} className="text-primary-foreground" />
                </div>
                <span className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center">
                  {step.step}
                </span>
              </div>
              <h3 className="font-display font-semibold text-xl mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
