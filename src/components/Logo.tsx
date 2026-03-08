import { useId } from "react";
import { Crown } from "lucide-react";
import { useSubscriptionStore } from "@/store/subscriptionStore";

interface LogoProps {
    /** Size in px of the icon square */
    size?: number;
    /** Show the text beside the icon */
    showText?: boolean;
    className?: string;
}

/**
 * SnapCut AI — inline SVG logo.
 * Uses no image files + scales perfectly at any resolution.
 */
const Logo = ({ size = 32, showText = true, className = "" }: LogoProps) => {
    const isPro = useSubscriptionStore((state) => state.isPro);
    // Unique IDs per instance to avoid SVG gradient collisions when multiple Logos are on the same page
    const uid = useId().replace(/:/g, "-");

    return (
        <div className={`flex items-center gap-2.5 select-none ${className}`}>
            {/* ── Icon ── */}
            <svg
                width={size}
                height={size}
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <defs>
                    {/* Unique gradient + filter IDs per instance */}
                    <linearGradient id={`snap-grad-${uid}`} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#60a5fa" />
                        <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                    <filter id={`snap-glow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="1.5" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Rounded square background */}
                <rect width="40" height="40" rx="10" fill="#0f172a" />
                <rect width="40" height="40" rx="10" fill={`url(#snap-grad-${uid})`} fillOpacity="0.12" />

                {/* Scissors icon — two blades crossing */}
                <g filter={`url(#snap-glow-${uid})`} stroke={`url(#snap-grad-${uid})`} strokeWidth="2.2" strokeLinecap="round">
                    {/* Top blade */}
                    <line x1="10" y1="12" x2="30" y2="28" />
                    {/* Bottom blade */}
                    <line x1="10" y1="28" x2="30" y2="12" />
                    {/* Left handle ring - top */}
                    <circle cx="9" cy="11" r="3.5" fill="none" />
                    {/* Left handle ring - bottom */}
                    <circle cx="9" cy="29" r="3.5" fill="none" />
                    {/* Cut line dot */}
                    <circle cx="30" cy="20" r="2" fill={`url(#snap-grad-${uid})`} stroke="none" />
                </g>

                {/* Small sparkle top-right */}
                <g fill={`url(#snap-grad-${uid})`} opacity="0.8">
                    <rect x="29" y="9" width="1.5" height="5" rx="0.75" />
                    <rect x="27" y="11" width="5" height="1.5" rx="0.75" />
                </g>
            </svg>

            {/* ── Wordmark ── */}
            {showText && (
                <span
                    style={{
                        fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
                        fontWeight: 700,
                        fontSize: size * 0.56,
                        letterSpacing: "-0.02em",
                        lineHeight: 1,
                    }}
                    className="flex items-center gap-1.5"
                >
                    <span style={{ color: "#f8fafc" }}>Snap</span>
                    <span style={{ color: "#f8fafc" }}>Cut</span>
                    <span
                        style={{
                            background: "linear-gradient(90deg,#60a5fa,#a855f7)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            marginLeft: "0.25em",
                        }}
                    >
                        AI
                    </span>
                    {isPro && (
                        <div className="flex items-center justify-center p-1 rounded-full bg-gradient-to-r from-yellow-400/20 to-amber-500/20 shadow-[0_0_10px_rgba(250,204,21,0.3)] ml-1 border border-yellow-400/30">
                            <Crown size={size * 0.4} className="text-yellow-400" strokeWidth={3} />
                        </div>
                    )}
                </span>
            )}
        </div>
    );
};

export default Logo;
