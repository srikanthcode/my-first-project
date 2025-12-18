"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "./input";
import { cn } from "@/lib/utils";

interface PhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    onValidate?: (isValid: boolean) => void;
    className?: string;
    placeholder?: string;
}

// Country codes with flags
const countryCodes = [
    { code: "+1", country: "US", flag: "🇺🇸", name: "United States" },
    { code: "+44", country: "UK", flag: "🇬🇧", name: "United Kingdom" },
    { code: "+91", country: "IN", flag: "🇮🇳", name: "India" },
    { code: "+86", country: "CN", flag: "🇨🇳", name: "China" },
    { code: "+81", country: "JP", flag: "🇯🇵", name: "Japan" },
    { code: "+49", country: "DE", flag: "🇩🇪", name: "Germany" },
    { code: "+33", country: "FR", flag: "🇫🇷", name: "France" },
    { code: "+61", country: "AU", flag: "🇦🇺", name: "Australia" },
    { code: "+55", country: "BR", flag: "🇧🇷", name: "Brazil" },
    { code: "+52", country: "MX", flag: "🇲🇽", name: "Mexico" },
];

export function PhoneInput({ value, onChange, onValidate, className, placeholder = "Phone number" }: PhoneInputProps) {
    const [selectedCountry, setSelectedCountry] = useState(countryCodes[2]); // Default to India
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isValid, setIsValid] = useState(false);

    // Format phone number in real-time
    const formatPhoneNumber = (input: string): string => {
        // Remove all non-digit characters
        const digits = input.replace(/\D/g, "");

        // Format based on country
        if (selectedCountry.code === "+1") {
            // US format: (XXX) XXX-XXXX
            if (digits.length <= 3) return digits;
            if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
            return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
        } else if (selectedCountry.code === "+91") {
            // India format: XXXXX-XXXXX
            if (digits.length <= 5) return digits;
            return `${digits.slice(0, 5)}-${digits.slice(5, 10)}`;
        } else {
            // Default format: XXX-XXX-XXXX
            if (digits.length <= 3) return digits;
            if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
            return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
        }
    };

    // Validate phone number - More lenient validation for better UX
    const validatePhoneNumber = (number: string): boolean => {
        const digits = number.replace(/\D/g, "");
        // Accept any phone number with 8 to 15 digits
        return digits.length >= 8 && digits.length <= 15;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const formatted = formatPhoneNumber(input);
        setPhoneNumber(formatted);

        const fullNumber = `${selectedCountry.code}${input.replace(/\D/g, "")}`;
        onChange(fullNumber);

        const valid = validatePhoneNumber(formatted);
        setIsValid(valid);
        onValidate?.(valid);
    };

    const handleCountrySelect = (country: typeof countryCodes[0]) => {
        setSelectedCountry(country);
        setIsDropdownOpen(false);
        setPhoneNumber("");
        onChange(country.code);
        setIsValid(false);
        onValidate?.(false);
    };

    return (
        <div className={cn("relative", className)}>
            <div className="flex gap-2">
                {/* Country Code Dropdown */}
                <div className="relative">
                    <motion.button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:border-primary transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="text-2xl">{selectedCountry.flag}</span>
                        <span className="font-semibold text-gray-700 dark:text-gray-200">
                            {selectedCountry.code}
                        </span>
                        <motion.svg
                            className="w-4 h-4 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </motion.svg>
                    </motion.button>

                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full mt-2 left-0 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden max-h-64 overflow-y-auto w-64"
                            >
                                {countryCodes.map((country) => (
                                    <motion.button
                                        key={country.code}
                                        type="button"
                                        onClick={() => handleCountrySelect(country)}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                                        whileHover={{ x: 5 }}
                                    >
                                        <span className="text-2xl">{country.flag}</span>
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900 dark:text-gray-100">
                                                {country.name}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {country.code}
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Phone Number Input */}
                <div className="flex-1 relative">
                    <Input
                        type="tel"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        placeholder={placeholder}
                        className={cn(
                            "transition-all duration-300",
                            isValid && "border-green-500 dark:border-green-400",
                            phoneNumber && !isValid && "border-red-500 dark:border-red-400"
                        )}
                    />

                    {/* Validation indicator */}
                    <AnimatePresence>
                        {phoneNumber && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                                {isValid ? (
                                    <motion.svg
                                        className="w-5 h-5 text-green-500"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        initial={{ rotate: -180 }}
                                        animate={{ rotate: 0 }}
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </motion.svg>
                                ) : (
                                    <motion.svg
                                        className="w-5 h-5 text-red-500"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        initial={{ rotate: 180 }}
                                        animate={{ rotate: 0 }}
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                        />
                                    </motion.svg>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Helper text */}
            <AnimatePresence>
                {phoneNumber && !isValid && (
                    <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-sm text-red-500 dark:text-red-400 mt-2"
                    >
                        Please enter a valid phone number
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}
