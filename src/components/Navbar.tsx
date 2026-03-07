import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Logo from "@/components/Logo";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  { label: "History", href: "/app?tab=history" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] glass border-b border-white/5">
      <div className="container mx-auto flex items-center justify-between h-20 px-6">
        <Link to="/" className="flex items-center gap-2 group transition-transform hover:scale-105">
          <Logo size={36} />
        </Link>

        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <Button variant="ghost" size="sm" className="text-[13px] font-bold uppercase tracking-widest text-white/70 hover:text-white" asChild>
            <Link to="/login">Sign In</Link>
          </Button>
          <Button variant="hero" size="sm" className="rounded-full px-6 text-[11px] font-black uppercase tracking-widest" asChild>
            <Link to="/app">Start Cutting</Link>
          </Button>
        </div>

        <button
          className="lg:hidden text-white/70 hover:text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden glass border-t border-white/5 p-6 space-y-4 absolute top-20 left-0 right-0 shadow-2xl backdrop-blur-3xl"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary py-3 border-b border-white/5"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-3 pt-4">
            <Button variant="hero" size="lg" className="w-full rounded-2xl font-black uppercase tracking-widest text-xs" asChild>
              <Link to="/app">Get Started Now</Link>
            </Button>
            <Button variant="ghost" size="lg" className="w-full text-white/40" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
