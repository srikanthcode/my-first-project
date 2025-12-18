"use client";

import { useChatStore } from "@/store/useChatStore";
import { Pin, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface PinnedMessagesHeaderProps {
    chatId: string;
}

export function PinnedMessagesHeader({ chatId }: PinnedMessagesHeaderProps) {
    const chat = useChatStore(state => state.getChatById(chatId));
    // In a real app, we would fetch the pinned message details here or from store
    // For now we assume we have IDs.
    const [pinnedMessage, setPinnedMessage] = useState<{ id: string, content: string } | null>(null);

    useEffect(() => {
        // Placeholder: Mock fetching pinned message details
        if (chat?.pinnedMessages?.length) {
            // Fetch message content by ID... 
            // For MVP, just show "Pinned Message"
            setPinnedMessage({
                id: chat.pinnedMessages[chat.pinnedMessages.length - 1],
                content: "Pinned Message"
            });
        } else {
            setPinnedMessage(null);
        }
    }, [chat?.pinnedMessages]);

    if (!pinnedMessage) return null;

    return (
        <div className="w-full bg-white dark:bg-[#17212b] border-b border-border dark:border-border-dark px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-[#202b36]">
            <div className="flex items-center gap-3 overflow-hidden">
                <div className="border-l-2 border-teal-500 pl-3">
                    <h4 className="text-teal-500 text-xs font-medium mb-0.5">Pinned Message</h4>
                    <p className="text-sm text-gray-900 dark:text-white truncate max-w-[200px] md:max-w-md">
                        {pinnedMessage.content}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" className="h-8 w-8 p-0 text-gray-500">
                    <Pin className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
