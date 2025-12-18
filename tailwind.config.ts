import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Fresh Chat kite-inspired color palette
                primary: {
                    DEFAULT: "#FF6B35",
                    dark: "#E55A2B",
                    light: "#FFE5DC",
                },
                accent: {
                    DEFAULT: "#7C3AED",
                    dark: "#6D28D9",
                    light: "#EDE9FE",
                },
                sky: {
                    DEFAULT: "#0EA5E9",
                    dark: "#0284C7",
                    light: "#E0F2FE",
                },
                background: {
                    DEFAULT: "#F8FAFC",
                    dark: "#0F172A",
                    chat: {
                        DEFAULT: "#F1F5F9",
                        dark: "#1E293B",
                    },
                    hover: {
                        DEFAULT: "#F1F5F9",
                        dark: "#334155",
                    },
                },
                panel: {
                    DEFAULT: "#FFFFFF",
                    dark: "#1E293B",
                    header: {
                        DEFAULT: "#FFFFFF",
                        dark: "#334155",
                    },
                    bg: {
                        DEFAULT: "#FFFFFF",
                        dark: "#0F172A",
                    },
                },
                message: {
                    sent: {
                        DEFAULT: "#FFE5DC",
                        dark: "#E55A2B",
                    },
                    received: {
                        DEFAULT: "#FFFFFF",
                        dark: "#334155",
                    },
                },
                border: {
                    DEFAULT: "#E2E8F0",
                    dark: "#475569",
                },
                text: {
                    primary: {
                        DEFAULT: "#0F172A",
                        dark: "#F1F5F9",
                    },
                    secondary: {
                        DEFAULT: "#64748B",
                        dark: "#94A3B8",
                    },
                },
                icon: {
                    DEFAULT: "#64748B",
                    dark: "#CBD5E1",
                },
                hover: {
                    DEFAULT: "#F8FAFC",
                    dark: "#334155",
                },
            },
            fontFamily: {
                sans: ["var(--font-inter)", "system-ui", "sans-serif"],
            },
            keyframes: {
                "slide-in": {
                    "0%": { transform: "translateX(-100%)" },
                    "100%": { transform: "translateX(0)" },
                },
                "slide-up": {
                    "0%": { transform: "translateY(100%)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
                "fade-in": {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                "bounce-dot": {
                    "0%, 80%, 100%": { transform: "scale(0)" },
                    "40%": { transform: "scale(1)" },
                },
            },
            animation: {
                "slide-in": "slide-in 0.3s ease-out",
                "slide-up": "slide-up 0.3s ease-out",
                "fade-in": "fade-in 0.2s ease-out",
                "bounce-dot": "bounce-dot 1.4s infinite ease-in-out both",
            },
        },
    },
    plugins: [],
};

export default config;
