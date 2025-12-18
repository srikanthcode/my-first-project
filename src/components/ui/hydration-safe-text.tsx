"use client";

import { useEffect, useState } from "react";
import { sanitizeTextContent } from "@/lib/hydration-utils";

interface HydrationSafeTextProps {
    children: string;
    className?: string;
    as?: "span" | "p" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    suppressHydration?: boolean;
}

/**
 * A text wrapper component that survives DOM mutations from browser extensions
 * by using suppressHydrationWarning and client-side normalization
 */
export function HydrationSafeText({
    children,
    className,
    as: Component = "span",
    suppressHydration = true,
}: HydrationSafeTextProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Sanitize the text content
    const sanitizedText = sanitizeTextContent(children);

    // During SSR and initial render, use suppressHydrationWarning
    // After mount, we can safely use the client value
    const displayText = mounted ? sanitizedText : children;

    return (
        <Component
            className={className}
            suppressHydrationWarning={suppressHydration}
        >
            {displayText}
        </Component>
    );
}

/**
 * A simpler version that just adds suppressHydrationWarning
 * Use this when you don't need client-side sanitization
 */
export function SafeText({
    children,
    className,
}: {
    children: string;
    className?: string;
}) {
    return (
        <span className={className} suppressHydrationWarning>
            {children}
        </span>
    );
}
