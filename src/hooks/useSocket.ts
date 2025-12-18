import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useChatStore } from '@/store/useChatStore';
import { useAuthStore } from '@/store/auth-store';
import { Message } from '@/types';

let socket: Socket | null = null;

export function useSocket() {
    const socketRef = useRef<Socket | null>(null);
    const { user } = useAuthStore();
    const { addMessage, updateMessageStatus, setTyping, fetchChats } = useChatStore();

    const connect = useCallback(() => {
        if (!user || socketRef.current?.connected) return;

        // Initialize socket connection
        socket = io({
            path: '/api/socket',
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socketRef.current = socket;

        // Connection established
        socket.on('connect', () => {
            console.log('Socket connected:', socket!.id);

            // Register user as online
            socket!.emit('user:online', user.id);
        });

        // Handle incoming messages
        socket.on('message:new', (message: Message) => {
            console.log('New message received:', message);
            addMessage(message);

            // Auto-fetch chats to update last message
            fetchChats();
        });

        // Handle message status updates
        socket.on('message:status', (data: {
            messageId: string;
            status: Message['status'];
        }) => {
            console.log('Message status update:', data);
            updateMessageStatus(data.messageId, data.status);
        });

        // Handle typing indicators
        socket.on('typing:status', (data: {
            chatId: string;
            userId: string;
            isTyping: boolean;
        }) => {
            console.log('Typing status:', data);
            setTyping(data.chatId, data.userId, data.isTyping);
        });

        // Handle user presence updates
        socket.on('user:status', (data: {
            userId: string;
            status: 'online' | 'offline';
            lastSeen?: Date;
        }) => {
            console.log('User status update:', data);
            // Note: You'll need to add a method to update user status in your store
        });

        // Connection errors
        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        // Reconnection attempt
        socket.on('reconnect_attempt', (attempt) => {
            console.log(`Reconnection attempt ${attempt}`);
        });

        // Reconnected successfully
        socket.on('reconnect', () => {
            console.log('Socket reconnected');
            socket!.emit('user:online', user.id);
        });

        // Disconnected
        socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
        });

    }, [user, addMessage, updateMessageStatus, setTyping, fetchChats]);

    const disconnect = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }
    }, []);

    const joinChat = useCallback((chatId: string) => {
        if (socketRef.current) {
            socketRef.current.emit('chat:join', chatId);
        }
    }, []);

    const leaveChat = useCallback((chatId: string) => {
        if (socketRef.current) {
            socketRef.current.emit('chat:leave', chatId);
        }
    }, []);

    const sendMessage = useCallback((data: {
        chatId: string;
        messageId: string;
        senderId: string;
        content: string;
        type: string;
        timestamp: Date;
    }) => {
        if (socketRef.current) {
            socketRef.current.emit('message:send', data);
        }
    }, []);

    const startTyping = useCallback((chatId: string, userId: string) => {
        if (socketRef.current) {
            socketRef.current.emit('typing:start', { chatId, userId });
        }
    }, []);

    const stopTyping = useCallback((chatId: string, userId: string) => {
        if (socketRef.current) {
            socketRef.current.emit('typing:stop', { chatId, userId });
        }
    }, []);

    const markAsDelivered = useCallback((messageId: string, chatId: string) => {
        if (socketRef.current) {
            socketRef.current.emit('message:delivered', { messageId, chatId });
        }
    }, []);

    const markAsRead = useCallback((messageId: string, chatId: string, userId: string) => {
        if (socketRef.current) {
            socketRef.current.emit('message:read', { messageId, chatId, userId });
        }
    }, []);

    // Auto-connect on mount
    useEffect(() => {
        if (user) {
            connect();
        }

        return () => {
            disconnect();
        };
    }, [user, connect, disconnect]);

    return {
        socket: socketRef.current,
        isConnected: socketRef.current?.connected || false,
        connect,
        disconnect,
        joinChat,
        leaveChat,
        sendMessage,
        startTyping,
        stopTyping,
        markAsDelivered,
        markAsRead
    };
}
