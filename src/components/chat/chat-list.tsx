"use client";

import { useChatStore, ChatState } from "@/store/useChatStore";
import { ChatItem } from "./chat-item";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { motion, AnimatePresence } from "framer-motion";
import { slideUp } from "@/components/ui/animations";

export function ChatList() {
    const [mounted, setMounted] = useState(false);
    const activeChat = useChatStore((state: ChatState) => state.activeChat);
    const chats = useChatStore(useShallow((state: ChatState) => state.getFilteredChats()));
    const setActiveChat = useChatStore((state: ChatState) => state.setActiveChat);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Sort chats: pinned first, then by last message time
    const sortedChats = [...chats].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;

        const aTime = a.lastMessage?.timestamp || a.updatedAt;
        const bTime = b.lastMessage?.timestamp || b.updatedAt;

        return new Date(bTime).getTime() - new Date(aTime).getTime();
    });

    if (sortedChats.length === 0) {
        return (
            <div
                className="flex items-center justify-center h-full p-8 text-center"
                suppressHydrationWarning
            >
                <p
                    className="text-text-secondary dark:text-text-secondary-dark"
                    suppressHydrationWarning
                >
                    No chats found
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-y-auto" suppressHydrationWarning>
            <AnimatePresence>
                {mounted && sortedChats.map((chat, index) => (
                    <motion.div
                        key={`chat-${chat.id}-${index}`}
                        layout
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={slideUp}
                        transition={{ delay: index * 0.05 }}
                    >
                        <ChatItem
                            chat={chat}
                            isActive={activeChat === chat.id}
                            onClick={() => setActiveChat(chat.id)}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
