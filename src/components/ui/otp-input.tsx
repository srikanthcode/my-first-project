"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface OTPInputProps {
    length?: number;
    value: string;
    onChange: (value: string) => void;
    onComplete?: (value: string) => void;
    className?: string;
}

export function OTPInput({
    length = 6,
    value,
    onChange,
    onComplete,
    className
}: OTPInputProps) {
    const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (value.length === 0) {
            setOtp(new Array(length).fill(""));
        }
    }, [value, length]);

    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;

        // Only allow numbers
        if (!/^\d*$/.test(val)) return;

        const newOtp = [...otp];

        // Handle paste
        if (val.length > 1) {
            const pastedData = val.slice(0, length).split("");
            for (let i = 0; i < length; i++) {
                newOtp[i] = pastedData[i] || "";
            }
            setOtp(newOtp);
            onChange(newOtp.join(""));

            // Focus on the last filled input or first empty
            const lastFilledIndex = newOtp.findIndex((digit) => !digit);
            const focusIndex = lastFilledIndex === -1 ? length - 1 : lastFilledIndex;
            inputRefs.current[focusIndex]?.focus();

            if (newOtp.every((digit) => digit)) {
                onComplete?.(newOtp.join(""));
            }
            return;
        }

        // Handle single character
        newOtp[index] = val;
        setOtp(newOtp);
        onChange(newOtp.join(""));

        // Auto-focus next input
        if (val && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        // Check if complete
        if (newOtp.every((digit) => digit)) {
            onComplete?.(newOtp.join(""));
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
            if (!otp[index] && index > 0) {
                // Move to previous input if current is empty
                inputRefs.current[index - 1]?.focus();
            } else {
                // Clear current input
                const newOtp = [...otp];
                newOtp[index] = "";
                setOtp(newOtp);
                onChange(newOtp.join(""));
            }
        } else if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === "ArrowRight" && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleFocus = (index: number) => {
        inputRefs.current[index]?.select();
    };

    return (
        <div className={cn("flex gap-2 justify-center", className)}>
            {otp.map((digit, index) => (
                <motion.div
                    key={index}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                >
                    <input
                        ref={(ref) => { inputRefs.current[index] = ref; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onFocus={() => handleFocus(index)}
                        className={cn(
                            "w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold",
                            "border-2 rounded-xl",
                            "bg-white dark:bg-gray-800",
                            "transition-all duration-200",
                            "focus:outline-none focus:ring-4",
                            digit
                                ? "border-primary bg-primary/5 dark:bg-primary/10 focus:ring-primary/20"
                                : "border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary/20",
                            "hover:border-primary/50"
                        )}
                    />
                </motion.div>
            ))}
        </div>
    );
}
