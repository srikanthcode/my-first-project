"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: "sm" | "md" | "lg";
    className?: string;
}

const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
};

export function Modal({ isOpen, onClose, title, children, size = "md", className }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
            <div
                ref={modalRef}
                className={cn(
                    "w-full bg-panel dark:bg-panel-dark rounded-lg shadow-xl animate-slide-up",
                    sizeClasses[size],
                    className
                )}
            >
                {title && (
                    <div className="flex items-center justify-between p-4 border-b border-border dark:border-border-dark">
                        <h2 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
                            {title}
                        </h2>
                        <button
                            onClick={onClose}
                            className="btn-icon"
                            aria-label="Close modal"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                <div className="p-4">{children}</div>
            </div>
        </div>
    );
}
