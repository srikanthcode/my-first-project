import { Server as HTTPServer } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as NetServer } from 'net';
import Group from '@/models/Group';

export type NextApiResponseServerIO = NextApiResponse & {
    socket: {
        server: HTTPServer & {
            io?: SocketServer;
        };
    };
};

export interface SocketUser {
    userId: string;
    socketId: string;
    status: 'online' | 'offline';
}

// Active users map
const activeUsers = new Map<string, SocketUser>();

export function initSocket(httpServer: HTTPServer) {
    const io = new SocketServer(httpServer, {
        path: '/api/socket',
        addTrailingSlash: false,
        cors: {
            origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket: Socket) => {
        console.log('Client connected:', socket.id);

        // User authentication and registration
        socket.on('user:online', (userId: string) => {
            activeUsers.set(userId, {
                userId,
                socketId: socket.id,
                status: 'online'
            });

            // Join user's personal room
            socket.join(`user:${userId}`);

            // Broadcast user online status
            socket.broadcast.emit('user:status', {
                userId,
                status: 'online',
                lastSeen: new Date()
            });

            console.log(`User ${userId} is now online`);
        });

        // Join chat room
        socket.on('chat:join', (chatId: string) => {
            socket.join(`chat:${chatId}`);
            console.log(`Socket ${socket.id} joined chat ${chatId}`);
        });

        // Leave chat room
        socket.on('chat:leave', (chatId: string) => {
            socket.leave(`chat:${chatId}`);
            console.log(`Socket ${socket.id} left chat ${chatId}`);
        });

        // Slow Mode Cache
        const userLastMessageTime = new Map<string, number>(); // Key: 'chatId:userId'

        // Send message
        socket.on('message:send', async (data: {
            chatId: string;
            messageId: string;
            senderId: string;
            content: string;
            type: string;
            timestamp: Date;
            // In a real app, you might pass permissions/slowMode settings here or fetch from cache/DB
            slowModeDelay?: number;
        }) => {
            // 1. Slow Mode Check
            const key = `${data.chatId}:${data.senderId}`;
            const now = Date.now();
            const slowMode = data.slowModeDelay || 0; // Passed from client or fetched

            if (slowMode > 0) {
                const lastTime = userLastMessageTime.get(key) || 0;
                const timeElapsed = (now - lastTime) / 1000;

                if (timeElapsed < slowMode) {
                    const timeRemaining = Math.ceil(slowMode - timeElapsed);
                    socket.emit('error', {
                        message: `Slow mode is active. Please wait ${timeRemaining}s.`
                    });
                    return;
                }
            }

            // 2. Permission Check (Simplified for Socket - ideally verify with DB/Token)
            // if (!isAllowed(data.senderId, data.chatId, 'canSendMessages')) return;

            try {
                // Ensure DB connection
                await import('@/lib/dbConnect').then(mod => mod.default());
                const Message = (await import('@/models/Message')).default;
                const Chat = (await import('@/models/Chat')).default;

                // Create and save message
                const newMessage = await Message.create({
                    chatId: data.chatId,
                    senderId: data.senderId,
                    content: data.content,
                    type: data.type,
                    timestamp: data.timestamp,
                    status: 'sent',
                    _id: data.messageId // Use client-generated ID or let DB generate? 
                    // Ideally DB generates, but if we want to match optimistically added msg, use same ID if possible or map it.
                    // For now let's trust client ID or rely on client to update it.
                    // Actually, Mongoose _id is typically ObjectId. String ID from client might fail if not ObjectId format.
                    // Let's assume data.messageId is a valid format or ignore it and let Mongo generate.
                    // If we ignore it, we must return the real ID to client.
                });

                // Update last message time
                userLastMessageTime.set(key, now);

                // Update Chat with last message
                await Chat.findByIdAndUpdate(data.chatId, {
                    lastMessageId: newMessage._id,
                    updatedAt: new Date(),
                });

                // Broadcast message into chat room
                io.to(`chat:${data.chatId}`).emit('message:new', {
                    ...newMessage.toObject(),
                    id: newMessage._id.toString(), // Ensure client gets string ID
                });

                console.log(`Message saved & sent in chat ${data.chatId} with slowMode: ${slowMode}`);

            } catch (error) {
                console.error("Error saving message:", error);
                socket.emit('error', { message: "Failed to send message" });
            }
        });

        // Message delivered acknowledgment
        socket.on('message:delivered', (data: {
            messageId: string;
            chatId: string;
        }) => {
            io.to(`chat:${data.chatId}`).emit('message:status', {
                messageId: data.messageId,
                status: 'delivered'
            });
        });

        // Message read acknowledgment
        socket.on('message:read', (data: {
            messageId: string;
            chatId: string;
            userId: string;
        }) => {
            io.to(`chat:${data.chatId}`).emit('message:status', {
                messageId: data.messageId,
                status: 'read',
                readBy: data.userId,
                readAt: new Date()
            });
        });

        // Typing indicator start
        socket.on('typing:start', (data: {
            chatId: string;
            userId: string;
        }) => {
            socket.to(`chat:${data.chatId}`).emit('typing:status', {
                chatId: data.chatId,
                userId: data.userId,
                isTyping: true
            });
        });

        // Typing indicator stop
        socket.on('typing:stop', (data: {
            chatId: string;
            userId: string;
        }) => {
            socket.to(`chat:${data.chatId}`).emit('typing:status', {
                chatId: data.chatId,
                userId: data.userId,
                isTyping: false
            });
        });

        // Pin/Unpin Message
        socket.on('message:pin', async (data: { chatId: string; messageId: string; action: 'pin' | 'unpin' }) => {
            try {
                // In real app: Validate USER PERMISSION from DB/Session here
                const group = await Group.findById(data.chatId);
                const isAllowed = true; // Placeholder: Replace with real permission check

                if (group && isAllowed) {
                    const update = data.action === 'pin'
                        ? { $addToSet: { pinnedMessages: data.messageId } }
                        : { $pull: { pinnedMessages: data.messageId } };

                    await Group.findByIdAndUpdate(data.chatId, update);

                    // Broadcast update
                    io.to(`chat:${data.chatId}`).emit('group:update', {
                        type: 'pin_update',
                        messageId: data.messageId,
                        action: data.action
                    });
                }
            } catch (err) {
                console.error("Error pinning message:", err);
            }
        });

        // Voice/Video call logic continues...

        const getVoiceRoomName = (chatId: string) => `voice:${chatId}`;

        // Join Voice Chat
        socket.on('voice-chat:join', (data: { chatId: string; userId: string }) => {
            const roomName = getVoiceRoomName(data.chatId);
            const clients = io.sockets.adapter.rooms.get(roomName);
            const usersInRoom = clients ? Array.from(clients) : []; // These are socketIDs

            // 1. Join the socket room
            socket.join(roomName);

            // 2. Notify existing users that a new user joined
            // They will initiate the P2P connection to this new user
            socket.to(roomName).emit('voice-chat:user-joined', {
                userId: data.userId,
                socketId: socket.id
            });

            // 3. Send list of existing users to the new joiner
            // The joiner needs to know who to wait for offers from OR initiate offers to.
            // In Mesh, usually the new guy initiates offers to everyone ? 
            // OR everyone initiates to the new guy. Let's stick to: New Joiner initiates.

            // Actually, best practice: New User sends "I am here".
            // Existing users receive "User X joined".
            // Existing users initiate connection to User X.
            // Returns existing users mainly for UI display.

            const existingUsers = usersInRoom.map(sid => {
                // Find userId for this socketId from activeUsers map
                // This is O(N) but activeUsers is huge. 
                // Better to assume client sent their own ID.
                // For now, we will rely on signal exchange to identify.
                return sid;
            });

            socket.emit('voice-chat:existing-users', usersInRoom);

            console.log(`User ${data.userId} joined voice chat ${data.chatId}`);
        });

        // WebRTC Signaling (Direct P2P Routing)
        socket.on('voice-chat:signal', (data: {
            toSocketId: string;
            signal: any;
            fromSocketId: string; // redundant if we check socket.id
        }) => {
            io.to(data.toSocketId).emit('voice-chat:signal', {
                signal: data.signal,
                fromSocketId: socket.id
            });
        });

        // Leave Voice Chat
        socket.on('voice-chat:leave', (data: { chatId: string }) => {
            const roomName = getVoiceRoomName(data.chatId);
            socket.leave(roomName);
            socket.to(roomName).emit('voice-chat:user-left', {
                socketId: socket.id
            });
            console.log(`Socket ${socket.id} left voice chat ${data.chatId}`);
        });

        // Admin: End Call (Kick everyone)
        socket.on('voice-chat:end', (data: { chatId: string }) => {
            const roomName = getVoiceRoomName(data.chatId);
            io.to(roomName).emit('voice-chat:ended');
            io.in(roomName).socketsLeave(roomName);
        });

        // Disconnect
        socket.on('disconnect', () => {
            // Find user by socket ID and mark as offline
            for (const [userId, user] of activeUsers.entries()) {
                if (user.socketId === socket.id) {
                    activeUsers.delete(userId);

                    // Broadcast user offline status
                    io.emit('user:status', {
                        userId,
                        status: 'offline',
                        lastSeen: new Date()
                    });

                    console.log(`User ${userId} went offline`);
                    break;
                }
            }

            console.log('Client disconnected:', socket.id);
        });
    });

    return io;
}

// Helper to get Socket.IO instance
export function getSocket(req: NextApiRequest) {
    const res = req as unknown as { socket: { server: NetServer & { io?: SocketServer } } };
    return res.socket.server.io;
}
