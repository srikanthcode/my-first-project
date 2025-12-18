"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { KiteLogo } from "@/components/ui/kite-logo";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth-store";




export default function LoginPage() {
    const router = useRouter();
    const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/chat");
        }
    }, [isAuthenticated, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#212121] transition-colors duration-300">
            <div className="w-full max-w-[400px] p-6 flex flex-col items-center">
                {/* Logo Area */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-8"
                >
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#0EA5E9] via-[#7C3AED] to-[#FF6B35] flex items-center justify-center shadow-2xl mb-4 mx-auto p-6">
                        <KiteLogo className="w-20 h-20" showGradient={false} />
                    </div>
                    <h1 className="text-3xl font-bold text-center text-black dark:text-white">
                        Fresh Chat
                    </h1>
                    <p className="text-center text-gray-500 dark:text-[#aaaaaa] mt-2 text-md">
                        Sign in to continue to ChatFresh
                    </p>
                </motion.div>

                <div className="w-full space-y-6">
                    <Button
                        onClick={async () => {
                            try {
                                await loginWithGoogle();
                                toast.success("Logged in with Google!");
                                router.push("/chat");
                            } catch (e: unknown) {
                                const err = e as Error;
                                toast.error("Google Login Failed: " + err.message);
                            }
                        }}
                        variant="outline"
                        className="w-full h-12 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.04-3.71 1.04-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                        Sign in with Google
                    </Button>
                </div>
            </div>
        </div>
    );
}
