import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Status, StatusUser, User } from "@/types";
import { v4 as uuidv4 } from "uuid";

interface StatusState {
    statuses: Status[];
    statusUsers: StatusUser[];
    myStatuses: Status[];
    viewingStatus: { userId: string; statusIndex: number } | null;
    isCreating: boolean;

    // Actions
    addStatus: (status: Omit<Status, "id" | "timestamp" | "expiresAt" | "views">) => void;
    deleteStatus: (statusId: string) => void;
    viewStatus: (statusId: string, viewerId: string) => void;
    likeStatus: (statusId: string, userId: string) => void;
    setViewingStatus: (data: { userId: string; statusIndex: number } | null) => void;
    setIsCreating: (creating: boolean) => void;
    getStatusesByUser: (userId: string) => Status[];
    getStatusUsers: () => StatusUser[];
    clearExpiredStatuses: () => void;
    initializeMockStatuses: (users: User[]) => void;
}

const STATUS_EXPIRY_HOURS = 24;

export const useStatusStore = create<StatusState>()(
    persist(
        (set, get) => ({
            statuses: [],
            statusUsers: [],
            myStatuses: [],
            viewingStatus: null,
            isCreating: false,

            addStatus: (statusData: Omit<Status, "id" | "timestamp" | "expiresAt" | "views">) => {
                const now = new Date();
                const expiresAt = new Date(now.getTime() + STATUS_EXPIRY_HOURS * 60 * 60 * 1000);

                const newStatus: Status = {
                    ...statusData,
                    id: uuidv4(),
                    timestamp: now,
                    expiresAt,
                    views: [],
                    likes: [],
                };

                set((state: StatusState) => ({
                    statuses: [newStatus, ...state.statuses],
                    myStatuses: statusData.userId === "user-1"
                        ? [newStatus, ...state.myStatuses]
                        : state.myStatuses,
                }));
            },

            deleteStatus: (statusId: string) => {
                set((state: StatusState) => ({
                    statuses: state.statuses.filter((s: Status) => s.id !== statusId),
                    myStatuses: state.myStatuses.filter((s: Status) => s.id !== statusId),
                }));
            },

            viewStatus: (statusId: string, viewerId: string) => {
                set((state: StatusState) => ({
                    statuses: state.statuses.map((s: Status) =>
                        s.id === statusId && !s.views.includes(viewerId)
                            ? { ...s, views: [...s.views, viewerId] }
                            : s
                    ),
                }));
            },

            likeStatus: (statusId: string, userId: string) => {
                set((state: StatusState) => ({
                    statuses: state.statuses.map((s: Status) => {
                        if (s.id !== statusId) return s;
                        const likes = s.likes || [];
                        const hasLiked = likes.includes(userId);
                        return {
                            ...s,
                            likes: hasLiked
                                ? likes.filter((id: string) => id !== userId)
                                : [...likes, userId],
                        };
                    }),
                }));
            },

            setViewingStatus: (data: { userId: string; statusIndex: number } | null) => set({ viewingStatus: data }),
            setIsCreating: (creating: boolean) => set({ isCreating: creating }),

            getStatusesByUser: (userId: string) => {
                return get().statuses.filter(
                    (s: Status) => s.userId === userId && new Date(s.expiresAt) > new Date()
                );
            },

            getStatusUsers: () => {
                const { statuses } = get();
                const now = new Date();
                const activeStatuses = statuses.filter((s: Status) => new Date(s.expiresAt) > now);

                const userMap = new Map<string, Status[]>();
                activeStatuses.forEach((status: Status) => {
                    const existing = userMap.get(status.userId) || [];
                    userMap.set(status.userId, [...existing, status]);
                });

                // This would need user data from another store in real app
                return [];
            },

            clearExpiredStatuses: () => {
                const now = new Date();
                set((state: StatusState) => ({
                    statuses: state.statuses.filter((s: Status) => new Date(s.expiresAt) > now),
                    myStatuses: state.myStatuses.filter((s: Status) => new Date(s.expiresAt) > now),
                }));
            },

            initializeMockStatuses: (users: User[]) => {
                const now = new Date();
                const mockStatuses: Status[] = [];

                // Create mock statuses for some users
                users.slice(0, 5).forEach((user: User, index: number) => {
                    if (user.id === "user-1") return; // Skip current user

                    const statusTypes = ["text", "image"] as const;
                    const type = statusTypes[index % 2];

                    const textContents = [
                        "Having a great day! 🌟",
                        "Working on something exciting! 💪",
                        "Just vibing today 🎵",
                        "Coffee time ☕",
                        "Weekend mode activated! 🎉",
                    ];

                    const backgroundColors = [
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                        "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                        "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                        "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                    ];

                    mockStatuses.push({
                        id: uuidv4(),
                        userId: user.id,
                        type,
                        content: type === "text" ? textContents[index % textContents.length] : "",
                        backgroundColor: type === "text" ? backgroundColors[index % backgroundColors.length] : undefined,
                        mediaUrl: type === "image" ? `https://picsum.photos/seed/${user.id}/400/600` : undefined,
                        caption: type === "image" ? "Check this out! 📸" : undefined,
                        timestamp: new Date(now.getTime() - (index * 2 * 60 * 60 * 1000)), // Stagger by 2 hours
                        expiresAt: new Date(now.getTime() + ((24 - index * 2) * 60 * 60 * 1000)),
                        views: [],
                        likes: [],
                    });
                });

                set({ statuses: mockStatuses });
            },
        }),
        {
            name: "chatfresh-status-storage",
        }
    )
);
