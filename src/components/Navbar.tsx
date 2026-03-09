import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Crown, LayoutDashboard } from "lucide-react";
import Logo from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { UserDropdown } from "@/components/UserDropdown";
import { useSubscriptionStore } from "@/store/subscriptionStore";

/* ── Cleaned nav links — no chevrons, only essential pages ── */
const NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "Use Cases", href: "/#use-cases" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  { label: "API", href: "/#api" },
  { label: "About", href: "/#about" },
  { label: "FAQs", href: "/#faq" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, loading } = useAuth();
  const { isPro } = useSubscriptionStore();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Handle hash changes on route load (if coming from another page)
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  const isHome = location.pathname === "/";

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#")) {
      const hash = href.replace("/", "");

      if (isHome) {
        e.preventDefault();
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
        // Update URL without jumping
        window.history.pushState(null, "", hash);
      }
      // If not home, the Link component native navigation will take over and hit our useEffect
    } else if (href.startsWith("#")) {
      e.preventDefault();
      const id = href.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      window.history.pushState(null, "", href);
    }
  };

  return (
    <>
      {/* ── FLOATING PILL NAV ── */}
      <motion.div
        initial={isHome ? { y: -80, opacity: 0 } : { y: 0, opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-4 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none"
      >
        <nav
          className={`pointer-events-auto flex items-center justify-between w-full max-w-[1360px] rounded-full transition-all duration-500 border shadow-2xl ${scrolled || !isHome
            ? "bg-[#07070a]/90 border-white/10 backdrop-blur-2xl shadow-black/60 py-1.5 px-6"
            : "bg-[#07070a]/55 border-white/[0.07] backdrop-blur-xl shadow-transparent py-2 px-8"
            }`}
        >
          {/* ── LOGO ── */}
          <Link
            to="/"
            className="flex items-center gap-3 group shrink-0"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/";
            }}
          >
            <div className="shrink-0 transition-transform duration-200 group-hover:scale-[1.04]">
              <Logo size={36} showText={false} />
            </div>
            <div className="flex flex-col items-start gap-[3px]">
              <div className="flex items-center gap-2 leading-none">
                <span
                  style={{
                    fontFamily: "'Inter','SF Pro Display',system-ui,sans-serif",
                    fontWeight: 800,
                    fontSize: "19px",
                    letterSpacing: "-0.02em",
                    color: "#f8fafc",
                  }}
                >
                  SnapCut{" "}
                  <span
                    style={{
                      background: "linear-gradient(90deg,#60a5fa,#a855f7)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    AI
                  </span>
                </span>
                {isPro && (
                  <div className="flex items-center justify-center p-[3px] rounded-full bg-gradient-to-r from-yellow-400/20 to-amber-500/20 shadow-[0_0_8px_rgba(250,204,21,0.2)] border border-yellow-400/30">
                    <Crown size={13} className="text-yellow-400" strokeWidth={3} />
                  </div>
                )}
              </div>
              <span className="hidden sm:inline-flex items-center px-2 py-[2px] rounded bg-blue-500/10 border border-blue-500/20 text-[9px] font-black text-blue-400 tracking-[0.15em] uppercase leading-none">
                V3.0 Intelligence Hub
              </span>
            </div>
          </Link>

          {/* ── DESKTOP CENTER LINKS — no arrows ── */}
          <div className="hidden xl:flex items-center gap-7 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-[13.5px] font-medium text-white/60 hover:text-white transition-colors duration-200 whitespace-nowrap cursor-pointer"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ── DESKTOP RIGHT — auth only, no GitHub badge ── */}
          <div className="hidden lg:flex items-center shrink-0 gap-4">
            {!loading && (
              isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <Link
                    to="/dashboard"
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-black text-[#a855f7] tracking-[0.15em] uppercase hover:bg-purple-500/20 transition-all shadow-[0_0_15px_rgba(168,85,247,0.15)] group"
                  >
                    <LayoutDashboard size={12} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                    Dashboard
                  </Link>
                  <Link
                    to="/upload?tab=history"
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-[#60a5fa] tracking-[0.15em] uppercase hover:bg-blue-500/20 transition-all shadow-[0_0_10px_rgba(59,130,246,0.1)]"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse drop-shadow-[0_0_5px_rgba(96,165,250,0.8)]" />
                    History
                  </Link>
                  <UserDropdown variant="navbar" />
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="text-[13.5px] font-medium text-white/60 hover:text-white transition-colors duration-200"
                  >
                    Sign in
                  </Link>
                  <Button
                    variant="hero"
                    className="rounded-full px-5 h-8 text-[12px] font-black tracking-wide bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 border-none text-white shadow-lg shadow-orange-500/25"
                    asChild
                  >
                    <Link to="/register">Get Started</Link>
                  </Button>
                </div>
              )
            )}
          </div>

          {/* ── MOBILE TOGGLE ── */}
          <button
            className="lg:hidden text-white/60 hover:text-white p-2 shrink-0 transition-transform duration-150 active:scale-90"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </motion.div>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-[76px] left-4 right-4 z-[90] lg:hidden border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-3xl bg-[#0a0a0d]/96"
          >
            <div className="space-y-0.5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="flex items-center w-full text-[15px] font-medium text-white/65 hover:text-white py-3 border-b border-white/[0.05] transition-colors cursor-pointer"
                  onClick={(e) => {
                    setMobileOpen(false);
                    handleNavClick(e, link.href);
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-5">
                {!loading && (
                  isAuthenticated ? (
                    <div className="flex justify-center">
                      <UserDropdown variant="navbar" />
                    </div>
                  ) : (
                    <>
                      <Button
                        variant="hero"
                        size="lg"
                        className="w-full rounded-2xl font-bold tracking-wide bg-gradient-to-r from-orange-500 to-orange-600 border-none text-white"
                        asChild
                      >
                        <Link to="/register">Get Started</Link>
                      </Button>
                      <Button variant="ghost" size="lg" className="w-full text-white/60 hover:text-white" asChild>
                        <Link to="/login">Sign in</Link>
                      </Button>
                    </>
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
