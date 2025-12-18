"use client";

import { motion } from "framer-motion";

export function ChatFreshLogo({ className = "w-16 h-16", animated = true }: { className?: string; animated?: boolean }) {
    const bubbleVariants = {
        initial: { scale: 0, opacity: 0 },
        animate: (i: number) => ({
            scale: 1,
            opacity: 1,
            transition: {
                delay: i * 0.1,
                duration: 0.5,
                type: "spring" as const,
                stiffness: 200,
            }
        }),
        hover: { scale: 1.1, transition: { duration: 0.2 } }
    };

    const Container = animated ? motion.svg : "svg";
    const Path = animated ? motion.path : "path";
    const Circle = animated ? motion.circle : "circle";

    return (
        <Container
            className={className}
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            whileHover={animated ? "hover" : undefined}
        >
            <defs>
                <linearGradient id="chatGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#25D366" />
                    <stop offset="100%" stopColor="#128C7E" />
                </linearGradient>
                <linearGradient id="chatGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#34B7F1" />
                    <stop offset="100%" stopColor="#0E8BC9" />
                </linearGradient>
                <linearGradient id="chatGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#5B21B6" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Main chat bubble */}
            <Path
                custom={0}
                variants={animated ? bubbleVariants : undefined}
                initial={animated ? "initial" : undefined}
                animate={animated ? "animate" : undefined}
                d="M70 25C85.464 25 98 37.536 98 53C98 68.464 85.464 81 70 81H60L50 91V81C34.536 81 22 68.464 22 53C22 37.536 34.536 25 50 25H70Z"
                fill="url(#chatGradient1)"
                filter="url(#glow)"
            />

            {/* Secondary bubble */}
            <Path
                custom={1}
                variants={animated ? bubbleVariants : undefined}
                initial={animated ? "initial" : undefined}
                animate={animated ? "animate" : undefined}
                d="M45 50C55.493 50 64 58.507 64 69C64 79.493 55.493 88 45 88H38L31 95V88C20.507 88 12 79.493 12 69C12 58.507 20.507 50 31 50H45Z"
                fill="url(#chatGradient2)"
                opacity="0.9"
            />

            {/* Accent bubble */}
            <Path
                custom={2}
                variants={animated ? bubbleVariants : undefined}
                initial={animated ? "initial" : undefined}
                animate={animated ? "animate" : undefined}
                d="M90 60C98.284 60 105 66.716 105 75C105 83.284 98.284 90 90 90H85L80 95V90C71.716 90 65 83.284 65 75C65 66.716 71.716 60 80 60H90Z"
                fill="url(#chatGradient3)"
                opacity="0.8"
            />

            {/* Chat dots inside main bubble */}
            <Circle
                custom={3}
                variants={animated ? bubbleVariants : undefined}
                initial={animated ? "initial" : undefined}
                animate={animated ? "animate" : undefined}
                cx="55"
                cy="53"
                r="3"
                fill="white"
            />
            <Circle
                custom={4}
                variants={animated ? bubbleVariants : undefined}
                initial={animated ? "initial" : undefined}
                animate={animated ? "animate" : undefined}
                cx="65"
                cy="53"
                r="3"
                fill="white"
            />
            <Circle
                custom={5}
                variants={animated ? bubbleVariants : undefined}
                initial={animated ? "initial" : undefined}
                animate={animated ? "animate" : undefined}
                cx="75"
                cy="53"
                r="3"
                fill="white"
            />
        </Container>
    );
}
