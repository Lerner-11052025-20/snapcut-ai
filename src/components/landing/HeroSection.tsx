import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import heroBg from "@/assets/hero-bg.jpg";
import UploadZone from "@/components/UploadZone";
import Logo from "@/components/Logo";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleHeroFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        sessionStorage.setItem("pendingImage", e.target?.result as string);
        sessionStorage.setItem("pendingFileName", file.name);
        sessionStorage.setItem("pendingFileType", file.type);
      } catch {
        // Handle gracefully
      }
      toast.success("AI model warming up...");
      navigate("/app");
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 pb-12">
      {/* Background Orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] rounded-full bg-accent/10 blur-[100px]"
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-1.5 text-xs font-medium text-blue-400 mb-8 backdrop-blur-md"
          >
            <Sparkles size={12} className="animate-pulse" />
            <span className="tracking-wider uppercase">Next-Gen AI Technology</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl lg:text-8xl font-black tracking-tight leading-[1.1] mb-8"
          >
            Remove Image <br />
            Backgrounds <span className="text-gradient">in 1 Click</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Transform your photos into professional assets instantly.
            High-precision AI cutouts for creators, developers, and businesses.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 px-4"
          >
            <Button variant="hero" size="xl" className="w-full sm:w-auto min-w-[200px]" asChild>
              <Link to="/app">
                Get Started Free
                <Zap size={18} className="ml-2 fill-current" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" className="w-full sm:w-auto border-white/10 bg-white/5 hover:bg-white/10" asChild>
              <a href="#how-it-works">View Demo</a>
            </Button>
          </motion.div>
        </div>

        {/* Upload Zone Wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-3xl mx-auto relative px-4"
        >
          {/* Decorative elements for the upload zone */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl -z-10 opacity-50" />

          <div className="glass rounded-3xl p-2 sm:p-4 shadow-2xl">
            <UploadZone onFile={handleHeroFile} />
          </div>

          <div className="mt-8 flex items-center justify-center gap-8 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
            <span className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-blue-500" />
              Instant Processing
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-purple-500" />
              Unlimited Possibilities
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
