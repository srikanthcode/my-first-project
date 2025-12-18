import { create } from 'zustand';

type ThemeMode = 'light' | 'dark';
type ViewMode = 'chats' | 'status' | 'calls' | 'settings' | 'contacts';

interface UIState {
    theme: ThemeMode;
    isSidebarOpen: boolean;
    activeView: ViewMode;
    isNewChatModalOpen: boolean;
    isNewGroupModalOpen: boolean;
    isLogoutModalOpen: boolean;
    isProfileModalOpen: boolean;

    toggleTheme: () => void;
    setTheme: (theme: ThemeMode) => void;
    toggleSidebar: () => void;
    setActiveView: (view: ViewMode) => void;
    openNewChatModal: () => void;
    closeNewChatModal: () => void;
    openNewGroupModal: () => void;
    closeNewGroupModal: () => void;
    openLogoutModal: () => void;
    closeLogoutModal: () => void;
    openProfileModal: () => void;
    closeProfileModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    theme: 'light',
    isSidebarOpen: true,
    activeView: 'chats',
    isNewChatModalOpen: false,
    isNewGroupModalOpen: false,
    isLogoutModalOpen: false,
    isProfileModalOpen: false,

    toggleTheme: () =>
        set((state: UIState) => {
            const newTheme = state.theme === 'light' ? 'dark' : 'light';
            if (typeof document !== 'undefined') {
                document.documentElement.classList.toggle('dark', newTheme === 'dark');
            }
            return { theme: newTheme };
        }),

    setTheme: (theme: ThemeMode) =>
        set(() => {
            if (typeof document !== 'undefined') {
                document.documentElement.classList.toggle('dark', theme === 'dark');
            }
            return { theme };
        }),

    toggleSidebar: () => set((state: UIState) => ({ isSidebarOpen: !state.isSidebarOpen })),

    setActiveView: (view: ViewMode) => set({ activeView: view }),

    openNewChatModal: () => set({ isNewChatModalOpen: true }),
    closeNewChatModal: () => set({ isNewChatModalOpen: false }),

    openNewGroupModal: () => set({ isNewGroupModalOpen: true }),
    closeNewGroupModal: () => set({ isNewGroupModalOpen: false }),

    openLogoutModal: () => set({ isLogoutModalOpen: true }),
    closeLogoutModal: () => set({ isLogoutModalOpen: false }),

    openProfileModal: () => set({ isProfileModalOpen: true }),
    closeProfileModal: () => set({ isProfileModalOpen: false }),
}));
