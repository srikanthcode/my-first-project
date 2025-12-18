"use client";

import { motion } from "framer-motion";
import { ChatFreshLogo } from "@/components/ui/chat-fresh-logo";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50 dark:from-gray-900 dark:via-teal-900/20 dark:to-green-900/20">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute bottom-20 right-10 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-400/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear" as const,
                    }}
                />
            </div>

            {/* Floating particles */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-primary/20 rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                    }}
                />
            ))}

            {/* Main content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Logo and branding */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            type: "spring" as const,
                            stiffness: 200,
                            damping: 20,
                        }}
                        className="text-center mb-8"
                    >
                        <div className="flex justify-center mb-6">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: "spring" as const, stiffness: 300 }}
                            >
                                <ChatFreshLogo className="w-24 h-24 sm:w-28 sm:h-28" animated={true} />
                            </motion.div>
                        </div>

                        <motion.h1
                            className="text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-teal-600 via-green-600 to-emerald-600 bg-clip-text text-transparent"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            Chat Fresh
                        </motion.h1>

                        <motion.p
                            className="text-gray-600 dark:text-gray-400 text-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            Connect, Chat, Collaborate
                        </motion.p>

                        {/* Feature pills */}
                        <motion.div
                            className="flex flex-wrap justify-center gap-2 mt-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            {["End-to-End Encrypted", "Real-time", "Secure"].map((feature, index) => (
                                <motion.span
                                    key={feature}
                                    className="px-3 py-1 text-xs font-medium bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50"
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    whileHover={{ scale: 1.1 }}
                                >
                                    {feature}
                                </motion.span>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Login form */}
                    {children}

                    {/* Footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-8 text-center text-sm text-gray-500 dark:text-gray-500"
                    >
                        <p>© 2024 Chat Fresh. All rights reserved.</p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
