import { create } from "zustand";
import { Call, CallParticipant, CallHistory, CallType, CallStatus } from "@/types";
import { v4 as uuidv4 } from "uuid";

interface CallState {
    currentCall: Call | null;
    callHistory: CallHistory[];
    isCallModalOpen: boolean;
    incomingCall: Call | null;
    isMinimized: boolean;

    // Call Actions
    startCall: (params: {
        type: CallType;
        receiverId?: string;
        groupId?: string;
        isGroupCall: boolean;
    }) => void;
    answerCall: () => void;
    rejectCall: () => void;
    endCall: () => void;
    toggleMute: (participantId: string) => void;
    toggleVideo: (participantId: string) => void;
    toggleScreenShare: (participantId: string) => void;
    addParticipant: (participant: CallParticipant) => void;
    removeParticipant: (participantId: string) => void;

    // Incoming Call
    setIncomingCall: (call: Call | null) => void;

    // Modal
    setCallModalOpen: (open: boolean) => void;
    toggleMinimize: () => void;

    // History
    addToHistory: (call: Omit<CallHistory, "id">) => void;
    clearHistory: () => void;
}

export const useCallStore = create<CallState>((set, get) => ({
    currentCall: null,
    callHistory: [
        // Mock call history
        {
            id: "1",
            type: "video",
            isOutgoing: true,
            isMissed: false,
            duration: 320,
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            participant: {
                id: "user-2",
                name: "Sarah Wilson",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
            },
        },
        {
            id: "2",
            type: "audio",
            isOutgoing: false,
            isMissed: true,
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
            participant: {
                id: "user-3",
                name: "Mike Johnson",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
            },
        },
        {
            id: "3",
            type: "video",
            isOutgoing: false,
            isMissed: false,
            duration: 180,
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            participant: {
                id: "user-4",
                name: "Emily Davis",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
            },
            groupName: "Project Team",
            participantCount: 4,
        },
    ],
    isCallModalOpen: false,
    incomingCall: null,
    isMinimized: false,

    toggleMinimize: () => set((state) => ({ isMinimized: !state.isMinimized })),

    startCall: ({ type, receiverId, groupId, isGroupCall }) => {
        const call: Call = {
            id: uuidv4(),
            type,
            status: "connecting",
            callerId: "user-1",
            receiverId,
            groupId,
            participants: [
                {
                    id: "user-1",
                    name: "You",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=me",
                    isMuted: false,
                    isVideoOff: type === "audio",
                    joinedAt: new Date(),
                },
            ],
            startedAt: new Date(),
            isGroupCall,
        };

        set({
            currentCall: call,
            isCallModalOpen: true
        });

        // Simulate connection
        setTimeout(() => {
            set((state) => ({
                currentCall: state.currentCall
                    ? { ...state.currentCall, status: "connected" as CallStatus }
                    : null,
            }));
        }, 2000);
    },

    answerCall: () => {
        const { incomingCall } = get();
        if (!incomingCall) return;

        set({
            currentCall: {
                ...incomingCall,
                status: "connected",
                startedAt: new Date(),
            },
            incomingCall: null,
            isCallModalOpen: true,
        });
    },

    rejectCall: () => {
        const { incomingCall, addToHistory } = get();
        if (incomingCall) {
            addToHistory({
                type: incomingCall.type,
                isOutgoing: false,
                isMissed: true,
                timestamp: new Date(),
                participant: {
                    id: incomingCall.callerId,
                    name: "Caller",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=caller",
                },
            });
        }
        set({ incomingCall: null });
    },

    endCall: () => {
        const { currentCall, addToHistory } = get();
        if (currentCall?.status === "connected" && currentCall.startedAt) {
            const duration = Math.floor(
                (Date.now() - new Date(currentCall.startedAt).getTime()) / 1000
            );
            addToHistory({
                type: currentCall.type,
                isOutgoing: currentCall.callerId === "user-1",
                isMissed: false,
                duration,
                timestamp: new Date(),
                participant: {
                    id: currentCall.receiverId || "group",
                    name: "Contact",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=contact",
                },
            });
        }
        set({
            currentCall: null,
            isCallModalOpen: false
        });
    },

    toggleMute: (participantId) => {
        set((state) => {
            if (!state.currentCall) return state;
            return {
                currentCall: {
                    ...state.currentCall,
                    participants: state.currentCall.participants.map((p) =>
                        p.id === participantId ? { ...p, isMuted: !p.isMuted } : p
                    ),
                },
            };
        });
    },

    toggleVideo: (participantId) => {
        set((state) => {
            if (!state.currentCall) return state;
            return {
                currentCall: {
                    ...state.currentCall,
                    participants: state.currentCall.participants.map((p) =>
                        p.id === participantId ? { ...p, isVideoOff: !p.isVideoOff } : p
                    ),
                },
            };
        });
    },

    toggleScreenShare: (participantId) => {
        set((state) => {
            if (!state.currentCall) return state;
            return {
                currentCall: {
                    ...state.currentCall,
                    participants: state.currentCall.participants.map((p) =>
                        p.id === participantId ? { ...p, isScreenSharing: !p.isScreenSharing } : p
                    ),
                },
            };
        });
    },

    addParticipant: (participant) => {
        set((state) => {
            if (!state.currentCall) return state;
            return {
                currentCall: {
                    ...state.currentCall,
                    participants: [...state.currentCall.participants, participant],
                },
            };
        });
    },

    removeParticipant: (participantId) => {
        set((state) => {
            if (!state.currentCall) return state;
            return {
                currentCall: {
                    ...state.currentCall,
                    participants: state.currentCall.participants.filter(
                        (p) => p.id !== participantId
                    ),
                },
            };
        });
    },

    setIncomingCall: (call) => set({ incomingCall: call }),
    setCallModalOpen: (open) => set({ isCallModalOpen: open }),

    addToHistory: (call) => {
        set((state) => ({
            callHistory: [{ ...call, id: uuidv4() }, ...state.callHistory],
        }));
    },

    clearHistory: () => set({ callHistory: [] }),
}));
