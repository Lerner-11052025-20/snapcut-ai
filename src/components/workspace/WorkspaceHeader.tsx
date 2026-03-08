import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Crown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

interface WorkspaceHeaderProps {
    isPro: boolean;
    activeState: string;
    onToggleHistory: () => void;
    onUpgrade: () => void;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = React.memo(({
    isPro,
    activeState,
    onToggleHistory,
    onUpgrade
}) => {
    return (
        <header className="sticky top-0 z-50 glass border-b border-white/5 h-16">
            <div className="container mx-auto h-full flex items-center justify-between px-6">

                {/* ── INTERACTIVE SAAS LOGO ── */}
                <Link
                    to="/"
                    className="flex items-center gap-2.5 group shrink-0 cursor-pointer"
                >
                    <div className="shrink-0 transition-transform duration-300 group-hover:scale-[1.05]">
                        <Logo size={32} showText={false} />
                    </div>
                    <div className="flex flex-col items-start gap-[2px]">
                        <div className="flex items-center gap-2 leading-none">
                            <span
                                style={{
                                    fontFamily: "'Inter','SF Pro Display',system-ui,sans-serif",
                                    fontWeight: 800,
                                    fontSize: "19px",
                                    letterSpacing: "-0.02em",
                                    color: "#ffffff",
                                }}
                            >
                                SnapCut{" "}
                                <span
                                    style={{
                                        background: "linear-gradient(90deg,#8b5cf6,#d946ef)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}
                                >
                                    AI
                                </span>
                            </span>
                            {/* Pro Crown - ONLY rendered if user is Pro exactly as requested */}
                            {isPro && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="flex items-center justify-center p-[4px] rounded-full bg-gradient-to-br from-yellow-400/10 to-amber-600/10 shadow-[0_0_12px_rgba(250,204,21,0.2)] border border-yellow-400/30 group-hover:shadow-[0_0_15px_rgba(250,204,21,0.4)] transition-all duration-300"
                                >
                                    <Crown size={12} className="text-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.8)]" strokeWidth={2.5} />
                                </motion.div>
                            )}
                        </div>
                        {/* Always present V3.0 Hub Badge */}
                        <span className="inline-flex items-center px-2 py-[2px] rounded bg-blue-500/10 border border-blue-500/20 text-[9px] font-black text-blue-400 tracking-[0.15em] uppercase leading-none shadow-sm group-hover:bg-blue-500/15 transition-colors">
                            V3.0 Intelligence Hub
                        </span>
                    </div>
                </Link>

                <div className="flex items-center">
                    <button
                        onClick={onToggleHistory}
                        className={`text-[13px] font-black uppercase tracking-[0.15em] transition-colors ${activeState === 'history' ? 'text-[#e2e8f0]' : 'text-[#9ca3af] hover:text-[#d1d5db]'}`}
                    >
                        History
                    </button>

                    <div className="h-5 w-px bg-white/[0.08] mx-5" />

                    <div className="flex items-center">
                        {isPro ? (
                            <div className="flex items-center gap-2.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#35342a] border border-[#6b582b] shadow-inner select-none pointer-events-none">
                                <Crown size={16} className="text-[#fcd34d]" strokeWidth={2.5} />
                                <span className="text-[12px] font-black text-[#fde047] uppercase tracking-[0.1em] leading-none pt-[1px]">Pro Member</span>
                            </div>
                        ) : (
                            <Button
                                onClick={onUpgrade}
                                className="rounded-full px-5 h-10 bg-gradient-to-r from-[#60a5fa] via-[#7c3aed] to-[#c084fc] text-white font-black uppercase tracking-[0.15em] text-[11px] flex items-center gap-2 hover:opacity-90 shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all border-none"
                            >
                                Upgrade to Pro
                                <ArrowRight size={14} />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
});
