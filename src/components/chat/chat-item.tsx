"use client";

import { Chat } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import { formatChatTime, truncateText } from "@/lib/utils";
import { sanitizeTextContent } from "@/lib/hydration-utils";

import { cn } from "@/lib/utils";
import { Pin, VolumeX, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface ChatItemProps {
    chat: Chat;
    isActive: boolean;
    onClick: () => void;
}

import { useChatStore } from "@/store/useChatStore";

export function ChatItem({ chat, isActive, onClick }: ChatItemProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { getOtherParticipant } = useChatStore();
    const participant = getOtherParticipant(chat.id);
    const displayName = chat.type === "group" ? chat.name : participant?.name;
    const displayAvatar = chat.type === "group" ? chat.avatar : participant?.avatar;
    const lastMessageContent = chat.lastMessage?.content || "No messages yet";
    const isVerified = chat.type === "channel"; // Mock verification for channels

    // Sanitize text to prevent hydration mismatches
    const safeDisplayName = sanitizeTextContent(displayName || "Unknown");
    const safeLastMessage = sanitizeTextContent(truncateText(lastMessageContent, 40));

    return (
        <div
            onClick={onClick}
            className={cn(
                "chat-item flex items-center gap-3 px-4 py-3 cursor-pointer", // Added cursor-pointer
                isActive ? "bg-[#3390ec] text-white" : "hover:bg-gray-100 dark:hover:bg-[#202b36]" // Telegram active color
            )}
            suppressHydrationWarning
        >
            <Avatar
                src={displayAvatar}
                alt={displayName || "Unknown"}
                size="lg"
                status={participant?.status}
            />

            <div className="flex-1 min-w-0" suppressHydrationWarning>
                <div className="flex items-center justify-between mb-1" suppressHydrationWarning>
                    <div className="flex items-center gap-1 min-w-0">
                        <h3
                            className={cn(
                                "font-semibold truncate",
                                isActive ? "text-white" : "text-text-primary dark:text-text-primary-dark"
                            )}
                            suppressHydrationWarning
                        >
                            {safeDisplayName}
                        </h3>
                        {isVerified && <CheckCircle className="w-3 h-3 text-blue-500 fill-blue-500 text-white" />}
                    </div>

                    <div className="flex items-center gap-1" suppressHydrationWarning>
                        {chat.lastMessage && mounted && (
                            <span
                                className={cn(
                                    "text-xs",
                                    isActive ? "text-white/80" : "text-text-secondary dark:text-text-secondary-dark"
                                )}
                                suppressHydrationWarning
                            >
                                {formatChatTime(chat.lastMessage.timestamp)}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between" suppressHydrationWarning>
                    <p
                        className={cn(
                            "text-sm truncate flex-1",
                            isActive ? "text-white/90" : "text-text-secondary dark:text-text-secondary-dark"
                        )}
                        suppressHydrationWarning
                    >
                        {safeLastMessage}
                    </p>

                    <div className="flex items-center gap-2 ml-2" suppressHydrationWarning>
                        {chat.isMuted && mounted && (
                            <VolumeX className={cn("w-4 h-4", isActive ? "text-white/80" : "text-text-secondary")} />
                        )}

                        {chat.isPinned && mounted && (
                            <Pin className={cn("w-4 h-4", isActive ? "text-white/80" : "text-text-secondary")} />
                        )}

                        {chat.unreadCount > 0 && mounted && (
                            <div
                                className={cn(
                                    "flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold",
                                    isActive ? "bg-white text-[#3390ec]" : "bg-[#c4c9cc] text-white dark:bg-[#3f4b59]"
                                )} // Telegram gray for unread unless muted
                                suppressHydrationWarning
                            >
                                {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
