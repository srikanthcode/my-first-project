"use client";

import { Message } from "@/types";
import { formatMessageTime } from "@/lib/utils";
import { sanitizeTextContent } from "@/lib/hydration-utils";
import { Check, CheckCheck, Pin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { messageAnimation } from "@/components/ui/animations";

interface MessageBubbleProps {
    message: Message;
    isSent: boolean;
}

export function MessageBubble({ message, isSent }: MessageBubbleProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const renderStatusIcon = () => {
        if (!isSent || !mounted) return null;

        switch (message.status) {
            case "sent":
                return <Check className="w-4 h-4 text-text-secondary dark:text-text-secondary-dark" />;
            case "delivered":
                return <CheckCheck className="w-4 h-4 text-text-secondary dark:text-text-secondary-dark" />;
            case "read":
                return <CheckCheck className="w-4 h-4 text-[#53bdeb]" />;
            default:
                return null;
        }
    };

    // Sanitize message content
    const safeContent = sanitizeTextContent(message.content || "");

    const { socket } = useSocket();
    const { user } = useAuthStore();

    // Check if user is admin (this should be prop-drilled or from context for better perf)
    // For now, allow UI to trigger, backend will validate.

    const handlePin = async () => {
        if (!socket || !message.id) return;

        // Optimistic update could go here
        socket.emit('message:pin', {
            chatId: message.chatId,
            messageId: message.id,
            action: 'pin' // Toggle logic needed? usually UI shows 'Pin' or 'Unpin'
        });
        toast.success("Message pinned");
    };

    return (
        <motion.div
            layout
            initial="initial"
            animate="animate"
            variants={messageAnimation}
            className={cn("flex w-full mb-1 group relative", isSent ? "justify-end" : "justify-start")}
            suppressHydrationWarning
        >
            {/* Hover Actions */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                className={cn(
                    "opacity-0 group-hover:opacity-100 transition-opacity absolute top-0 flex items-center p-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-lg shadow-sm z-10 gap-2 border border-border dark:border-border-dark",
                    isSent ? "left-0 -ml-16" : "right-0 -mr-16"
                )}>
                <Button
                    variant="ghost"
                    className="h-6 w-6 p-0 hover:bg-black/10 dark:hover:bg-white/10"
                    onClick={handlePin}
                    title="Pin Message"
                >
                    <Pin className="w-3.5 h-3.5 text-gray-500" />
                </Button>
            </motion.div>

            <div
                className={cn("flex max-w-[65%]", isSent ? "flex-row-reverse" : "flex-row")}
                suppressHydrationWarning
            >
                {/* Tail SVG */}
                <div
                    className={cn("relative w-2 overflow-hidden", isSent ? "-mr-1" : "-ml-1")}
                    suppressHydrationWarning
                >
                    <svg
                        viewBox="0 0 8 13"
                        height="13"
                        width="8"
                        preserveAspectRatio="none"
                        className={cn("absolute top-0 w-full h-full fill-current", isSent ? "text-message-sent dark:text-message-sent-dark left-0" : "text-message-received dark:text-message-received-dark right-0")}
                        style={{ transform: isSent ? "scaleX(1)" : "scaleX(-1)" }}
                        suppressHydrationWarning
                    >
                        <path d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z" />
                    </svg>
                </div>

                <div
                    className={cn(
                        "relative shadow-sm rounded-lg overflow-hidden",
                        isSent
                            ? "bg-message-sent dark:bg-message-sent-dark rounded-tr-none"
                            : "bg-message-received dark:bg-message-received-dark rounded-tl-none"
                    )}
                    suppressHydrationWarning
                >
                    {message.type === "image" && message.fileUrl ? (
                        <div className="p-1" suppressHydrationWarning>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={message.fileUrl}
                                alt="Shared photo"
                                className="rounded-lg max-w-full h-auto max-h-[300px] object-cover"
                                suppressHydrationWarning
                            />
                            {message.content && message.content !== "Photo" && (
                                <p
                                    className="text-sm text-text-primary dark:text-text-primary-dark mt-1 px-1"
                                    suppressHydrationWarning
                                >
                                    {safeContent}
                                </p>
                            )}
                        </div>
                    ) : (
                        <p
                            className="text-sm text-text-primary dark:text-text-primary-dark whitespace-pre-wrap break-words leading-relaxed px-2 py-1"
                            suppressHydrationWarning
                        >
                            {safeContent}
                            <span className="inline-block w-16 h-4 select-none"></span> {/* Spacer for time */}
                        </p>
                    )}

                    {mounted && (
                        <div
                            className={cn("absolute bottom-1 right-2 flex items-center gap-1", message.type === "image" ? "bg-black/20 rounded-full px-1" : "")}
                            suppressHydrationWarning
                        >
                            <span
                                className={cn("text-[11px] min-w-fit", message.type === "image" ? "text-white" : "text-text-secondary dark:text-text-secondary-dark")}
                                suppressHydrationWarning
                            >
                                {formatMessageTime(message.timestamp)}
                            </span>
                            {renderStatusIcon()}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
