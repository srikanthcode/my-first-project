"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader2, Shield } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import toast from "react-hot-toast";

export default function RegisterPage() {
    const router = useRouter();
    const { loginWithGoogle, isAuthenticated } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.push("/chat");
        }
    }, [isAuthenticated, router]);

    const handleGoogleSignUp = async () => {
        setIsLoading(true);
        try {
            await loginWithGoogle();
            toast.success("Account created successfully!");
            router.push("/chat");
        } catch (error) {
            console.error("Error signing up:", error);
            toast.error("Failed to sign up with Google");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-500 via-green-500 to-emerald-600 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-200/50"
            >
                <div className="text-center space-y-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-green-500 rounded-2xl mx-auto flex items-center justify-center mb-4">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent">
                            Create Account
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Join ChatFresh today
                        </p>
                    </div>

                    <Button
                        onClick={handleGoogleSignUp}
                        disabled={isLoading}
                        className="w-full h-12 bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-3 font-medium transition-all"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
                        ) : (
                            <>
                                <img
                                    src="https://www.google.com/favicon.ico"
                                    alt="Google"
                                    className="w-5 h-5"
                                />
                                Sign up with Google
                            </>
                        )}
                    </Button>

                    <p className="text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <button
                            onClick={() => router.push("/auth/login")}
                            className="text-teal-600 font-semibold hover:underline"
                        >
                            Sign in
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
