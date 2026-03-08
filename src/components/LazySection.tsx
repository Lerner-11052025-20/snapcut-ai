import React, { Suspense, useRef } from "react";
import { useInView } from "framer-motion";

interface LazySectionProps {
    children: React.ReactNode;
    id?: string;
    threshold?: number;
    rootMargin?: string;
    minHeight?: string;
}

/**
 * Optimized LazySection wrapper to prevent heavy DOM rendering 
 * until the section is close to the viewport.
 */
export const LazySection: React.FC<LazySectionProps> = ({
    children,
    id,
    threshold = 0.05,
    rootMargin = "250px",
    minHeight = "400px"
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, {
        once: true,
        margin: rootMargin as any
    });

    return (
        <div id={id} ref={ref} style={{ minHeight: !isInView ? minHeight : 'auto' }}>
            {isInView ? (
                <Suspense fallback={<div style={{ height: minHeight }} />}>
                    {children}
                </Suspense>
            ) : (
                <div style={{ height: minHeight }} className="flex items-center justify-center">
                    <div className="w-10 h-1 h-px bg-white/5 animate-pulse" />
                </div>
            )}
        </div>
    );
};
