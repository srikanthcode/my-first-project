"use client";

import { useEffect, useRef } from "react";
import { useMessageStore, MessageState } from "@/store/message-store";
import { useAuthStore, AuthState } from "@/store/auth-store";
import { useShallow } from "zustand/react/shallow";
import { MessageBubble } from "./message-bubble";
import { TypingIndicator } from "./typing-indicator";
import { format, isToday, isYesterday } from "date-fns";

interface MessageListProps {
    chatId: string;
}

export function MessageList({ chatId }: MessageListProps) {

    const messages = useMessageStore(useShallow((state: MessageState) => state.getMessagesByChatId(chatId)));
    const typingUsers = useMessageStore(useShallow((state: MessageState) => state.getTypingUsers(chatId)));
    const currentUser = useAuthStore((state: AuthState) => state.user);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const getDateSeparator = (date: Date) => {
        if (isToday(date)) return "Today";
        if (isYesterday(date)) return "Yesterday";
        return format(date, "MMMM dd, yyyy");
    };

    const shouldShowDateSeparator = (index: number) => {
        if (index === 0) return true;

        const curr = messages[index];
        const prev = messages[index - 1];
        if (!curr || !prev) return false;

        const currentDate = new Date(curr.timestamp);
        const previousDate = new Date(prev.timestamp);

        return currentDate.toDateString() !== previousDate.toDateString();
    };

    return (
        <div className="flex-1 overflow-y-auto px-4 py-2 chat-background">
            {messages.map((message, index) => (
                <div key={message.id}>
                    {shouldShowDateSeparator(index) && (
                        <div className="flex justify-center my-4">
                            <div className="px-3 py-1 rounded-lg bg-panel dark:bg-panel-dark shadow-sm">
                                <span className="text-xs text-text-secondary dark:text-text-secondary-dark font-medium">
                                    {getDateSeparator(new Date(message.timestamp))}
                                </span>
                            </div>
                        </div>
                    )}

                    <MessageBubble
                        message={message}
                        isSent={message.senderId === currentUser?.id}
                    />
                </div>
            ))}

            {typingUsers.length > 0 && (
                <div className="flex justify-start">
                    <div className="message-bubble message-bubble-received">
                        <TypingIndicator />
                    </div>
                </div>
            )}

            <div ref={messagesEndRef} />
        </div>
    );
}
