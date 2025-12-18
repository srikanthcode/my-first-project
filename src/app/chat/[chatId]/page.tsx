import { use } from "react";
import { ChatWindow } from "@/components/chat/chat-window";

export default function ChatDetailPage({ params }: { params: Promise<{ chatId: string }> }) {
    const resolvedParams = use(params);
    return <ChatWindow chatId={resolvedParams.chatId} />;
}
