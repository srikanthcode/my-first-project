"use client";

import { ChatHeader } from "./chat-header";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";
import { useChatStore } from "@/store/useChatStore";
import { PinnedMessagesHeader } from "./pinned-messages-header";

import { KiteLogo } from "@/components/ui/kite-logo";

interface ChatWindowProps {
    chatId: string;
}

export function ChatWindow({ chatId }: ChatWindowProps) {
    const getChatById = useChatStore((state) => state.getChatById);
    const getOtherParticipant = useChatStore((state) => state.getOtherParticipant);
    const chat = getChatById(chatId);

    if (!chat) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-background-chat dark:bg-background-chat-dark">
                <KiteLogo className="w-24 h-24 mb-4" />
                <h2 className="text-2xl font-semibold text-text-primary dark:text-text-primary-dark mb-2">
                    Fresh Chat
                </h2>
                <p className="text-text-secondary dark:text-text-secondary-dark text-center max-w-md">
                    Send and receive messages without keeping your phone online.
                    <br />
                    Select a chat to start messaging.
                </p>
            </div>
        );
    }

    const participant = getOtherParticipant(chatId);

    if (!participant) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-text-secondary dark:text-text-secondary-dark">
                    Chat not found
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full chat-background">
            <ChatHeader
                user={participant}
                isGroup={chat.type === "group"}
                onBack={() => useChatStore.getState().setActiveChat(null)}
            />
            <PinnedMessagesHeader chatId={chatId} />
            <MessageList chatId={chatId} />
            <MessageInput chatId={chatId} />
        </div>
    );
}
