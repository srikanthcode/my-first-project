"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "icon" | "outline" | "default" | "destructive";
    size?: "sm" | "md" | "lg" | "icon";
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "hover:bg-hover dark:hover:bg-hover-dark",
    icon: "btn-icon",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white dark:border-primary dark:text-primary dark:hover:bg-primary dark:hover:text-white",
    default: "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700",
    destructive: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700"
};

const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    icon: "h-9 w-9 p-0", // Common icon button size
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    variantClasses[variant],
                    variant !== "icon" && sizeClasses[size],
                    className
                )}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                )}
                {leftIcon && !isLoading && leftIcon}
                {children}
                {rightIcon && !isLoading && rightIcon}
            </button>
        );
    }
);

Button.displayName = "Button";
