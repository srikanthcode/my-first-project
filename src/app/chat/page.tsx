"use client";

import { ChatWindow } from "@/components/chat/chat-window";
import { useChatStore } from "@/store/useChatStore";
import { useEffect } from "react";

export default function ChatPage() {
    const activeChat = useChatStore((state) => state.activeChat);
    const chats = useChatStore((state) => state.chats);
    const setActiveChat = useChatStore((state) => state.setActiveChat);

    // Auto-select first chat if none is selected
    useEffect(() => {
        if (!activeChat && chats.length > 0) {
            setActiveChat(chats[0].id);
        }
    }, [activeChat, chats, setActiveChat]);

    return <ChatWindow chatId={activeChat || ""} />;
}
