import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Upload, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div
        className="absolute inset-0 opacity-40"
        style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />

      <div className="container relative z-10 mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary mb-8">
            <Sparkles size={14} />
            AI-Powered Background Removal
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Remove Image Backgrounds{" "}
            <span className="text-gradient">in 1 Click</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Upload any image and get a clean, transparent background in seconds.
            Powered by cutting-edge AI — no design skills needed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button variant="hero" size="xl" asChild>
              <Link to="/app">
                <Upload size={20} />
                Remove Background Now
              </Link>
            </Button>
            <Button variant="outline" size="lg">
              <Zap size={16} />
              See Demo
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-secondary" />
              5 Free Removals/Day
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary" />
              No Signup Required
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-accent" />
              HD Quality
            </span>
          </div>
        </motion.div>

        {/* Upload zone preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <div className="glass rounded-2xl p-8 border-dashed border-2 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer group">
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                <Upload size={28} className="text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-lg">
                  Drag & drop your image here
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  or click to browse • JPG, PNG, WEBP • Max 10MB
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
