"use client";

import { cn, getInitials } from "@/lib/utils";
import { sanitizeClassName } from "@/lib/hydration-utils";
import { UserStatus } from "@/types";
import Image from "next/image";
import { useState, useEffect } from "react";

interface AvatarProps {
    src?: string;
    alt: string;
    size?: "sm" | "md" | "lg" | "xl";
    status?: UserStatus;
    className?: string;
    onClick?: () => void;
}

const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
};

export function Avatar({ src, alt, size = "md", status, className, onClick }: AvatarProps) {
    const [imageError, setImageError] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Generate initials in a stable way
    const initials = getInitials(alt);

    // Sanitize className to prevent extension interference
    const safeClassName = sanitizeClassName(className);

    return (
        <div
            className={cn("relative flex-shrink-0", safeClassName)}
            onClick={onClick}
            suppressHydrationWarning
        >
            <div
                className={cn(
                    "rounded-full overflow-hidden bg-gray-300 dark:bg-gray-600 flex items-center justify-center font-medium text-white",
                    sizeClasses[size]
                )}
                suppressHydrationWarning
            >
                {src && !imageError ? (
                    <Image
                        src={src}
                        alt={alt}
                        width={size === "xl" ? 64 : size === "lg" ? 48 : size === "md" ? 40 : 32}
                        height={size === "xl" ? 64 : size === "lg" ? 48 : size === "md" ? 40 : 32}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                        suppressHydrationWarning
                    />
                ) : (
                    <span suppressHydrationWarning>{initials}</span>
                )}
            </div>

            {status && mounted && (
                <div
                    className={cn(
                        "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-panel dark:border-panel-dark",
                        status === "online" ? "bg-green-500" : "bg-gray-400"
                    )}
                    suppressHydrationWarning
                />
            )}
        </div>
    );
}
