import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AIMessage, AIConversation } from "@/types";
import { v4 as uuidv4 } from "uuid";

interface AIState {
    conversations: AIConversation[];
    activeConversationId: string | null;
    isLoading: boolean;
    error: string | null;

    // Getters
    getActiveConversation: () => AIConversation | null;

    // Actions
    createNewConversation: () => string;
    setActiveConversation: (id: string | null) => void;
    addMessage: (conversationId: string, message: Omit<AIMessage, "id" | "timestamp">) => string;
    updateMessage: (conversationId: string, messageId: string, updates: Partial<AIMessage>) => void;
    deleteConversation: (id: string) => void;
    clearAllConversations: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    // AI interaction
    sendMessage: (content: string) => Promise<void>;
}

export const useAIStore = create<AIState>()(
    persist(
        (set, get) => ({
            conversations: [],
            activeConversationId: null,
            isLoading: false,
            error: null,

            getActiveConversation: () => {
                const { conversations, activeConversationId } = get();
                return conversations.find((c) => c.id === activeConversationId) || null;
            },

            createNewConversation: () => {
                const id = uuidv4();
                const newConversation: AIConversation = {
                    id,
                    messages: [],
                    createdAt: new Date(),
                    title: "New Chat",
                };

                set((state) => ({
                    conversations: [newConversation, ...state.conversations],
                    activeConversationId: id,
                }));

                return id;
            },

            setActiveConversation: (id) => set({ activeConversationId: id }),

            addMessage: (conversationId, message) => {
                const id = uuidv4();
                const newMessage: AIMessage = {
                    ...message,
                    id,
                    timestamp: new Date(),
                };

                set((state) => ({
                    conversations: state.conversations.map((conv) =>
                        conv.id === conversationId
                            ? {
                                ...conv,
                                messages: [...conv.messages, newMessage],
                                title: conv.messages.length === 0 && message.role === "user"
                                    ? message.content.slice(0, 30) + (message.content.length > 30 ? "..." : "")
                                    : conv.title,
                            }
                            : conv
                    ),
                }));

                return id;
            },

            updateMessage: (conversationId, messageId, updates) => {
                set((state) => ({
                    conversations: state.conversations.map((conv) =>
                        conv.id === conversationId
                            ? {
                                ...conv,
                                messages: conv.messages.map((msg) =>
                                    msg.id === messageId ? { ...msg, ...updates } : msg
                                ),
                            }
                            : conv
                    ),
                }));
            },

            deleteConversation: (id) => {
                set((state) => {
                    const newConversations = state.conversations.filter((c) => c.id !== id);
                    return {
                        conversations: newConversations,
                        activeConversationId: state.activeConversationId === id
                            ? (newConversations[0]?.id || null)
                            : state.activeConversationId,
                    };
                });
            },

            clearAllConversations: () => set({
                conversations: [],
                activeConversationId: null
            }),

            setLoading: (loading) => set({ isLoading: loading }),
            setError: (error) => set({ error }),

            sendMessage: async (content) => {
                const { activeConversationId, addMessage, updateMessage, createNewConversation, setLoading, setError } = get();

                let conversationId = activeConversationId;
                if (!conversationId) {
                    conversationId = createNewConversation();
                }

                // Add user message
                addMessage(conversationId, {
                    role: "user",
                    content,
                });

                // Add loading assistant message
                const loadingMsgId = addMessage(conversationId, {
                    role: "assistant",
                    content: "",
                    isLoading: true,
                });

                setLoading(true);
                setError(null);

                try {
                    const response = await fetch("/api/ai/chat", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            message: content,
                            conversationId,
                            history: get().getActiveConversation()?.messages.slice(-10) || [],
                        }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.message || "Failed to get AI response");
                    }

                    // Update the loading message with the actual response
                    updateMessage(conversationId, loadingMsgId, {
                        content: data.response,
                        isLoading: false,
                        suggestions: data.suggestions,
                    });

                } catch (error) {
                    console.error("AI error:", error);
                    setError(error instanceof Error ? error.message : "An error occurred");

                    // Update the loading message with error
                    updateMessage(conversationId, loadingMsgId, {
                        content: "Sorry, I encountered an error. Please try again.",
                        isLoading: false,
                    });
                } finally {
                    setLoading(false);
                }
            },
        }),
        {
            name: "chatfresh-ai-storage",
        }
    )
);
