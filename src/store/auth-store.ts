import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, UserSettings } from "@/types";
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";

const defaultSettings: UserSettings = {
    privacy: {
        lastSeen: "everyone",
        profilePhoto: "everyone",
        about: "everyone",
        readReceipts: true,
        disappearingMessages: "off",
    },
    notifications: {
        messageNotifications: true,
        showPreviews: true,
        soundEnabled: true,
        vibration: true,
        groupNotifications: true,
        callNotifications: true,
    },
    appearance: {
        theme: "system",
        fontSize: "medium",
    },
};

const createDefaultUser = (phone: string): User => ({
    id: `user-${Date.now()}`,
    name: "New User",
    phone,
    status: "online",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
    about: "Hey there! I'm using ChatFresh",
    createdAt: new Date(),
    isVerified: false,
    settings: defaultSettings,
});

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    // confirmationResult: ConfirmationResult | null; // Removed as we use custom backend

    // Authentication methods
    login: (user: User) => void;
    loginWithGoogle: () => Promise<void>;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
    updateProfile: (profile: { name?: string; username?: string; email?: string; bio?: string; avatar?: string }) => void;
    updateSettings: (settings: Partial<UserSettings>) => void;
    updatePrivacySettings: (privacy: Partial<UserSettings['privacy']>) => void;
    updateNotificationSettings: (notifications: Partial<UserSettings['notifications']>) => void;
    updateAppearanceSettings: (appearance: Partial<UserSettings['appearance']>) => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,

            login: (user) =>
                set({
                    user: { ...user, settings: user.settings || defaultSettings },
                    isAuthenticated: true,
                }),

            loginWithGoogle: async () => {
                set({ isLoading: true });
                try {
                    const { signInWithPopup } = await import("firebase/auth");
                    const { googleProvider } = await import("@/lib/firebase");

                    const result = await signInWithPopup(auth, googleProvider);
                    const user = result.user;

                    // Here you would typically sync with your backend
                    // For now, we'll map to our User type
                    const newUser: User = {
                        id: user.uid,
                        name: user.displayName || "Google User",
                        email: user.email || undefined,
                        phone: user.phoneNumber || "",
                        status: "online",
                        avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
                        about: "Hey there! I'm using ChatFresh",
                        createdAt: new Date(),
                        isVerified: true,
                        settings: defaultSettings,
                    };

                    set({
                        user: newUser,
                        isAuthenticated: true,
                        isLoading: false,
                    });

                } catch (error) {
                    console.error("Google Sign-In Error:", error);
                    set({ isLoading: false });
                    throw error;
                }
            },

            logout: () =>
                set({
                    user: null,
                    isAuthenticated: false,
                }),

            updateUser: (updates: Partial<User>) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...updates } : null,
                })),

            updateProfile: (profile: { name?: string; username?: string; email?: string; bio?: string; avatar?: string }) =>
                set((state) => {
                    if (!state.user) return state;
                    return {
                        user: {
                            ...state.user,
                            name: profile.name ?? state.user.name,
                            // username: profile.username ?? state.user.username, // Removed as usually distinct form name
                            email: profile.email ?? state.user.email,
                            // bio: profile.bio ?? state.user.bio ?? state.user.about, // User type might not have bio separate from about
                            about: profile.bio ?? state.user.about,
                            avatar: profile.avatar ?? state.user.avatar,
                        },
                    };
                }),

            updateSettings: (settings: Partial<UserSettings>) =>
                set((state) => {
                    if (!state.user) return state;
                    return {
                        user: {
                            ...state.user,
                            settings: {
                                ...defaultSettings,
                                ...state.user.settings,
                                ...settings,
                            },
                        },
                    };
                }),

            updatePrivacySettings: (privacy: Partial<UserSettings['privacy']>) =>
                set((state) => {
                    if (!state.user) return state;
                    return {
                        user: {
                            ...state.user,
                            settings: {
                                ...defaultSettings,
                                ...state.user.settings,
                                // ...state.user.settings?.privacy, // Fix merging
                                privacy: {
                                    ...defaultSettings.privacy,
                                    ...state.user.settings?.privacy,
                                    ...privacy
                                },
                            },
                        },
                    };
                }),

            updateNotificationSettings: (notifications: Partial<UserSettings['notifications']>) =>
                set((state) => {
                    if (!state.user) return state;
                    return {
                        user: {
                            ...state.user,
                            settings: {
                                ...defaultSettings,
                                ...state.user.settings,
                                notifications: {
                                    ...defaultSettings.notifications,
                                    ...state.user.settings?.notifications,
                                    ...notifications,
                                },
                            },
                        },
                    };
                }),

            updateAppearanceSettings: (appearance: Partial<UserSettings['appearance']>) =>
                set((state) => {
                    if (!state.user) return state;
                    return {
                        user: {
                            ...state.user,
                            settings: {
                                ...defaultSettings,
                                ...state.user.settings,
                                appearance: {
                                    ...defaultSettings.appearance,
                                    ...state.user.settings?.appearance,
                                    ...appearance,
                                },
                            },
                        },
                    };
                }),

            setLoading: (loading: boolean) => set({ isLoading: loading }),
        }),
        {
            name: "chatfresh-auth-storage",
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

