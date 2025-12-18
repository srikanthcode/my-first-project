import { create } from 'zustand';
import { Chat, Message, User, TypingIndicator } from '@/types';
import { generateId } from '@/lib/utils';

export interface ChatState {
    chats: Chat[];
    messages: { [chatId: string]: Message[] };
    users: User[];
    activeChat: string | null;
    typingIndicators: TypingIndicator[];
    searchQuery: string;
    activeTab: "chats" | "status" | "calls" | "communities";
    isLoading: boolean;

    // Data fetching
    fetchChats: () => Promise<void>;
    fetchMessages: (chatId: string) => Promise<void>;
    fetchUsers: (search?: string) => Promise<void>;

    // UI state
    setSearchQuery: (query: string) => void;
    setActiveTab: (tab: "chats" | "status" | "calls" | "communities") => void;
    getFilteredChats: () => Chat[];
    updateChatUnreadCount: (chatId: string, count: number) => void;
    togglePinChat: (chatId: string) => void;
    toggleMuteChat: (chatId: string) => void;

    // Chat actions
    setActiveChat: (chatId: string | null) => void;
    sendMessage: (chatId: string, content: string, type?: Message['type']) => Promise<void>;
    addMessage: (message: Message) => void;
    updateMessageStatus: (messageId: string, status: Message['status']) => void;
    setTyping: (chatId: string, userId: string, isTyping: boolean) => void;
    getUserById: (userId: string) => User | undefined;
    getChatById: (chatId: string) => Chat | undefined;
    getOtherParticipant: (chatId: string) => User | undefined;
    markChatAsRead: (chatId: string) => void;
    createChat: (participantIds: string[]) => Promise<Chat | null>;
    createGroup: (groupData: { name: string; description: string; members: string[]; image?: string; createdBy: string }) => Promise<Chat | null>;
}

export const useChatStore = create<ChatState>((set, get) => ({
    chats: [],
    messages: {},
    users: [],
    activeChat: null,
    typingIndicators: [],
    searchQuery: "",
    activeTab: "chats",
    isLoading: false,

    // Fetch chats from API
    fetchChats: async () => {
        try {
            set({ isLoading: true });
            const response = await fetch('/api/chats');
            const data = await response.json();

            if (data.success) {
                set({ chats: data.data || [] });
            }
        } catch (error) {
            console.error('Failed to fetch chats:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    // Fetch messages for a specific chat
    fetchMessages: async (chatId: string) => {
        try {
            const response = await fetch(`/api/messages?chatId=${chatId}`);
            const data = await response.json();

            if (data.success) {
                set((state) => ({
                    messages: {
                        ...state.messages,
                        [chatId]: data.data || []
                    }
                }));
            }
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    },

    // Fetch users (with optional search)
    fetchUsers: async (search?: string) => {
        try {
            const url = search ? `/api/users?search=${encodeURIComponent(search)}` : '/api/users';
            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
                set({ users: data.data || [] });
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    },

    // Create new chat
    createChat: async (participantIds: string[]) => {
        try {
            const response = await fetch('/api/chats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ participants: participantIds })
            });
            const data = await response.json();

            if (data.success) {
                set((state) => ({
                    chats: [data.data, ...state.chats]
                }));
                return data.data;
            }
            return null;
        } catch (error) {
            console.error('Failed to create chat:', error);
            return null;
        }
    },

    createGroup: async (groupData: { name: string; description: string; members: string[]; image?: string; createdBy: string; type?: "group" | "supergroup" | "channel" }) => {
        try {
            const response = await fetch('/api/groups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...groupData, type: groupData.type || 'group' })
            });
            const data = await response.json();

            if (data.success) {
                const newGroup = data.data;
                // Ensure the new group matches the Chat interface before adding
                const chatGroup: Chat = {
                    id: newGroup._id || newGroup.id,
                    type: 'group',
                    name: newGroup.name,
                    avatar: newGroup.avatar,
                    participants: newGroup.members.map((m: any) => m.userId),
                    unreadCount: 0,
                    isPinned: false,
                    isMuted: false,
                    lastMessage: undefined, // No message yet
                    createdAt: new Date(),
                    updatedAt: new Date()
                };

                set((state) => ({
                    chats: [chatGroup, ...state.chats]
                }));
                return chatGroup;
            }
            return null;
        } catch (error) {
            console.error('Failed to create group:', error);
            return null;
        }
    },

    setSearchQuery: (query: string) => set({ searchQuery: query }),
    setActiveTab: (tab: "chats" | "status" | "calls" | "communities") => set({ activeTab: tab }),

    getFilteredChats: () => {
        const { chats, searchQuery } = get();
        if (!searchQuery) return chats;

        const query = searchQuery.toLowerCase();
        return chats.filter((chat: Chat) => {
            if (chat.type === "group") {
                return chat.name?.toLowerCase().includes(query);
            }

            const otherParticipant = get().getOtherParticipant(chat.id);
            const name = otherParticipant?.name || chat.name || "Unknown";
            return name.toLowerCase().includes(query);
        });
    },

    updateChatUnreadCount: (chatId: string, count: number) =>
        set((state: ChatState) => ({
            chats: state.chats.map((chat: Chat) =>
                chat.id === chatId ? { ...chat, unreadCount: count } : chat
            ),
        })),

    togglePinChat: (chatId: string) =>
        set((state: ChatState) => ({
            chats: state.chats.map((chat: Chat) =>
                chat.id === chatId ? { ...chat, isPinned: !chat.isPinned } : chat
            ),
        })),

    toggleMuteChat: (chatId: string) =>
        set((state: ChatState) => ({
            chats: state.chats.map((chat: Chat) =>
                chat.id === chatId ? { ...chat, isMuted: !chat.isMuted } : chat
            ),
        })),

    setActiveChat: (chatId: string | null) => {
        set({ activeChat: chatId });
        if (chatId) {
            get().markChatAsRead(chatId);
            // Fetch messages when chat is opened
            get().fetchMessages(chatId);
        }
    },

    sendMessage: async (chatId: string, content: string, type: Message['type'] = 'text') => {
        const currentUserId = 'user-1'; // Will be replaced with real auth user ID

        const newMessage: Message = {
            id: generateId(),
            chatId,
            senderId: currentUserId,
            content,
            timestamp: new Date(),
            status: 'sending',
            type,
        };

        // Optimistically add message to UI
        set((state: ChatState) => ({
            messages: {
                ...state.messages,
                [chatId]: [...(state.messages[chatId] || []), newMessage],
            },
        }));

        try {
            // Send to server
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chatId,
                    senderId: currentUserId,
                    content,
                    type,
                    timestamp: newMessage.timestamp
                })
            });

            const data = await response.json();

            if (data.success) {
                // Update with server response
                get().updateMessageStatus(newMessage.id, 'sent');

                // Update chat's last message
                set((state: ChatState) => ({
                    chats: state.chats.map((chat: Chat) =>
                        chat.id === chatId
                            ? { ...chat, lastMessage: newMessage, updatedAt: new Date() }
                            : chat
                    ),
                }));
            } else {
                get().updateMessageStatus(newMessage.id, 'failed');
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            get().updateMessageStatus(newMessage.id, 'failed');
        }
    },

    addMessage: (message: Message) => {
        set((state: ChatState) => ({
            messages: {
                ...state.messages,
                [message.chatId]: [...(state.messages[message.chatId] || []), message],
            },
            chats: state.chats.map((chat: Chat) =>
                chat.id === message.chatId
                    ? {
                        ...chat,
                        lastMessage: message,
                        unreadCount: chat.id === state.activeChat ? 0 : chat.unreadCount + 1,
                        updatedAt: new Date()
                    }
                    : chat
            ),
        }));
    },

    updateMessageStatus: (messageId: string, status: Message['status']) => {
        set((state: ChatState) => {
            const newMessages = { ...state.messages };
            for (const chatId in newMessages) {
                newMessages[chatId] = newMessages[chatId].map((msg: Message) =>
                    msg.id === messageId ? { ...msg, status } : msg
                );
            }
            return { messages: newMessages };
        });
    },

    setTyping: (chatId: string, userId: string, isTyping: boolean) => {
        set((state: ChatState) => {
            const filtered = state.typingIndicators.filter(
                (t: TypingIndicator) => !(t.chatId === chatId && t.userId === userId)
            );

            if (isTyping) {
                return {
                    typingIndicators: [...filtered, { chatId, userId, isTyping }],
                };
            } else {
                return { typingIndicators: filtered };
            }
        });
    },

    getUserById: (userId: string) => {
        return get().users.find((u: User) => u.id === userId);
    },

    getChatById: (chatId: string) => {
        return get().chats.find((c: Chat) => c.id === chatId);
    },

    getOtherParticipant: (chatId: string) => {
        const chat = get().getChatById(chatId);
        if (!chat) return undefined;

        const currentUserId = 'user-1'; // Will be replaced with real auth user ID
        const otherUserId = chat.participants.find((p: string) => p !== currentUserId);

        if (!otherUserId) return undefined;
        return get().getUserById(otherUserId);
    },

    markChatAsRead: (chatId: string) => {
        set((state: ChatState) => ({
            chats: state.chats.map((chat: Chat) =>
                chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
            ),
        }));
    },
}));
