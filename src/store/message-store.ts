import { create } from "zustand";
import { Message, TypingIndicator } from "@/types";
import { generateId } from "@/lib/utils";
import { useChatStore } from "./useChatStore";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface FileData {
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    fileDuration?: number;
    thumbnail?: string;
}

export interface MessageState {
    messages: Record<string, Message[]>; // chatId -> messages
    typingIndicators: TypingIndicator[];
    stompClient: Client | null;

    // Initialization
    connect: () => void;
    disconnect: () => void;

    // Getters
    getMessagesByChatId: (chatId: string) => Message[];

    // Actions
    sendMessage: (chatId: string, content: string, type?: Message["type"], fileData?: FileData) => void;
    receiveMessage: (message: Message) => void;

    // Local Optimistic Updates (legacy/fallback)
    updateMessageStatus: (messageId: string, status: Message["status"]) => void;
    deleteMessage: (chatId: string, messageId: string, deleteForEveryone?: boolean) => void;
    editMessage: (chatId: string, messageId: string, newContent: string) => void;
    addReaction: (chatId: string, messageId: string, emoji: string, userId: string) => void;
    removeReaction: (chatId: string, messageId: string, emoji: string, userId: string) => void;
    starMessage: (chatId: string, messageId: string) => void;

    // Typing
    setTyping: (chatId: string, userId: string, isTyping: boolean) => void;
    getTypingUsers: (chatId: string) => string[];
}

const EMPTY_ARRAY: Message[] = [];

export const useMessageStore = create<MessageState>((set, get) => {
    return {
        messages: {},
        typingIndicators: [],
        stompClient: null,

        connect: () => {
            // Backend WebSocket disabled - using local state only
            console.log("WebSocket connection disabled. Backend is not running.");
            console.log("Install Maven and start backend with: cd backend && mvn spring-boot:run");
            return;

            /* Original WebSocket connection code - disabled
            if (get().stompClient?.active) return;

            console.log("Connecting to WebSocket...");
            const socket = new SockJS("http://localhost:8080/ws");
            const client = new Client({
                webSocketFactory: () => socket,
                onConnect: () => {
                    console.log("Connected to WS");
                    client.subscribe("/topic/public", (message) => {
                        const msgFn = JSON.parse(message.body);
                        get().receiveMessage(msgFn);
                    });
                },
                onStompError: (frame) => {
                    console.error("Broker reported error: " + frame.headers["message"]);
                    console.error("Additional details: " + frame.body);
                }
            });

            client.activate();
            set({ stompClient: client });
            */
        },

        disconnect: () => {
            get().stompClient?.deactivate();
            set({ stompClient: null });
        },

        getMessagesByChatId: (chatId: string) => {
            const { messages } = get();
            return messages[chatId] || EMPTY_ARRAY;
        },

        receiveMessage: (message: Message) => {
            set((state: MessageState) => ({
                messages: {
                    ...state.messages,
                    [message.chatId]: [...(state.messages[message.chatId] || []), message],
                },
            }));
            // Sync with ChatStore
            useChatStore.getState().addMessage(message);
        },

        sendMessage: (chatId: string, content: string, type: Message["type"] = "text", fileData?: FileData) => {
            const newMessage: Message = {
                id: generateId(),
                chatId,
                senderId: "user-1", // Should match logged in user
                content,
                timestamp: new Date(),
                status: "sent",
                type,
                ...fileData,
            };

            const client = get().stompClient;
            if (client && client.active) {
                client.publish({
                    destination: "/app/chat.sendMessage",
                    body: JSON.stringify(newMessage)
                });
            } else {
                console.warn("STOMP Client not connected. Falling back to local state only.");
                // Fallback for demo if backend not running
                get().receiveMessage(newMessage); // Optimistic update
            }
        },

        updateMessageStatus: (messageId: string, status: Message["status"]) =>
            set((state: MessageState) => {
                const updatedMessages = { ...state.messages };
                Object.keys(updatedMessages).forEach((chatId) => {
                    updatedMessages[chatId] = updatedMessages[chatId].map((msg: Message) =>
                        msg.id === messageId ? { ...msg, status } : msg
                    );
                });
                return { messages: updatedMessages };
            }),

        deleteMessage: (chatId: string, messageId: string, deleteForEveryone = false) =>
            set((state: MessageState) => {
                const chatMessages = state.messages[chatId] || [];
                if (deleteForEveryone) {
                    return {
                        messages: {
                            ...state.messages,
                            [chatId]: chatMessages.map((msg: Message) =>
                                msg.id === messageId
                                    ? {
                                        ...msg,
                                        isDeleted: true,
                                        content: "This message was deleted",
                                        deletedAt: new Date()
                                    }
                                    : msg
                            ),
                        },
                    };
                } else {
                    return {
                        messages: {
                            ...state.messages,
                            [chatId]: chatMessages.filter((msg: Message) => msg.id !== messageId),
                        },
                    };
                }
            }),

        editMessage: (chatId: string, messageId: string, newContent: string) =>
            set((state: MessageState) => {
                const chatMessages = state.messages[chatId] || [];
                return {
                    messages: {
                        ...state.messages,
                        [chatId]: chatMessages.map((msg: Message) =>
                            msg.id === messageId
                                ? {
                                    ...msg,
                                    content: newContent,
                                    isEdited: true,
                                    editedAt: new Date()
                                }
                                : msg
                        ),
                    },
                };
            }),

        addReaction: (chatId: string, messageId: string, emoji: string, userId: string) =>
            set((state: MessageState) => {
                const chatMessages = state.messages[chatId] || [];
                return {
                    messages: {
                        ...state.messages,
                        [chatId]: chatMessages.map((msg: Message) => {
                            if (msg.id !== messageId) return msg;

                            const reactions = msg.reactions || {};
                            const emojiReactions = reactions[emoji] || [];

                            if (emojiReactions.includes(userId)) {
                                return msg;
                            }

                            return {
                                ...msg,
                                reactions: {
                                    ...reactions,
                                    [emoji]: [...emojiReactions, userId],
                                },
                            };
                        }),
                    },
                };
            }),

        removeReaction: (chatId: string, messageId: string, emoji: string, userId: string) =>
            set((state: MessageState) => {
                const chatMessages = state.messages[chatId] || [];
                return {
                    messages: {
                        ...state.messages,
                        [chatId]: chatMessages.map((msg: Message) => {
                            if (msg.id !== messageId) return msg;

                            const reactions = msg.reactions || {};
                            const emojiReactions = reactions[emoji] || [];

                            const newEmojiReactions = emojiReactions.filter((id: string) => id !== userId);

                            if (newEmojiReactions.length === 0) {
                                const { [emoji]: _, ...restReactions } = reactions;
                                return { ...msg, reactions: restReactions };
                            }

                            return {
                                ...msg,
                                reactions: {
                                    ...reactions,
                                    [emoji]: newEmojiReactions,
                                },
                            };
                        }),
                    },
                };
            }),

        starMessage: (chatId: string, messageId: string) =>
            set((state: MessageState) => {
                const chatMessages = state.messages[chatId] || [];
                return {
                    messages: {
                        ...state.messages,
                        [chatId]: chatMessages.map((msg: Message) =>
                            msg.id === messageId
                                ? { ...msg, isStarred: !msg.isStarred }
                                : msg
                        ),
                    },
                };
            }),

        setTyping: (chatId: string, userId: string, isTyping: boolean) =>
            set((state: MessageState) => {
                const filtered = state.typingIndicators.filter(
                    (t) => !(t.chatId === chatId && t.userId === userId)
                );

                if (isTyping) {
                    return {
                        typingIndicators: [...filtered, { chatId, userId, isTyping }],
                    };
                }

                return { typingIndicators: filtered };
            }),

        getTypingUsers: (chatId: string) => {
            const { typingIndicators } = get();
            return typingIndicators
                .filter((t: TypingIndicator) => t.chatId === chatId && t.isTyping)
                .map((t: TypingIndicator) => t.userId);
        },
    };
});
