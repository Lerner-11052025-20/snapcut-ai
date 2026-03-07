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
                    {/* Blue → purple gradient for the icon */}
                    <linearGradient id="snap-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#60a5fa" />
                        <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                    {/* Soft glow filter */}
                    <filter id="snap-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="1.5" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Rounded square background */}
                <rect width="40" height="40" rx="10" fill="#0f172a" />
                <rect width="40" height="40" rx="10" fill="url(#snap-grad)" fillOpacity="0.12" />

                {/* Scissors icon — two blades crossing */}
                <g filter="url(#snap-glow)" stroke="url(#snap-grad)" strokeWidth="2.2" strokeLinecap="round">
                    {/* Top blade */}
                    <line x1="10" y1="12" x2="30" y2="28" />
                    {/* Bottom blade */}
                    <line x1="10" y1="28" x2="30" y2="12" />
                    {/* Left handle ring - top */}
                    <circle cx="9" cy="11" r="3.5" fill="none" />
                    {/* Left handle ring - bottom */}
                    <circle cx="9" cy="29" r="3.5" fill="none" />
                    {/* Cut line dot */}
                    <circle cx="30" cy="20" r="2" fill="url(#snap-grad)" stroke="none" />
                </g>

                {/* Small sparkle top-right */}
                <g fill="url(#snap-grad)" opacity="0.8">
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
                </span>
            )}
        </div>
    );
};

export default Logo;
