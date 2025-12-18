"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { KiteLogo } from "@/components/ui/kite-logo";
import { useAuthStore } from "@/store/auth-store";
import { useChatStore } from "@/store/useChatStore";
import { ChatList } from "./chat-list";
import { StatusView } from "./status-view";
import { CallsList } from "./calls-list";
import { ChannelsView } from "./channels-view";
import { AIChat } from "./ai-chat";
import { ProfileManagement } from "@/components/settings/profile-management";
import { CreateGroupModal } from "./create-group-modal";
import {
    Search,
    MessageSquarePlus,
    Users,
    Settings,
    Phone,
    CircleDashed,
    Bot,
    Menu,
    PenSquare,
    UserPlus,
    X,
    Plus
} from "lucide-react";

type TabType = "chats" | "status" | "calls" | "channels" | "communities" | "ai" | "settings";

export function Sidebar() {
    const [mounted, setMounted] = useState(false);
    const user = useAuthStore((state) => state.user);
    const users = useChatStore((state) => state.users);
    const searchQuery = useChatStore((state) => state.searchQuery);
    const setSearchQuery = useChatStore((state) => state.setSearchQuery);
    const activeTab = useChatStore((state) => state.activeTab);
    const setActiveTab = useChatStore((state) => state.setActiveTab);
    const [showSettings, setShowSettings] = useState(false);
    const [showNewChatMenu, setShowNewChatMenu] = useState(false);
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [currentTab, setCurrentTab] = useState<TabType>("chats");

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (activeTab) {
            setCurrentTab(activeTab as TabType);
        }
    }, [activeTab]);

    const handleTabChange = (tab: TabType) => {
        setCurrentTab(tab);
        if (tab !== "settings" && tab !== "ai") {
            setActiveTab(tab as "chats" | "status" | "calls" | "communities");
        }
        setShowSettings(tab === "settings");
    };

    const createGroup = useChatStore((state) => state.createGroup);
    const setActiveChat = useChatStore((state) => state.setActiveChat);

    const handleCreateGroup = async (group: {
        name: string;
        description: string;
        members: string[];
        image?: string
    }) => {
        if (!user) return;

        try {
            const newGroup = await createGroup({
                name: group.name,
                description: group.description,
                members: group.members,
                image: group.image,
                createdBy: user.id
            });

            if (newGroup) {
                setShowCreateGroup(false);
                setActiveChat(newGroup.id);
            }
        } catch (error) {
            console.error("Failed to create group", error);
        }
    };

    const contacts = users.map(u => ({
        id: u.id,
        name: u.name,
        phone: u.phone || "",
        avatar: u.avatar || "",
        status: u.about,
    }));

    const tabs = [
        { id: "chats" as TabType, icon: MessageSquarePlus, label: "Chats" },
        { id: "calls" as TabType, icon: Phone, label: "Calls" },
        { id: "channels" as TabType, icon: CircleDashed, label: "Channels" },
        { id: "communities" as TabType, icon: Users, label: "Contacts" },
        { id: "settings" as TabType, icon: Settings, label: "Settings" },
    ];

    const renderContent = () => {
        if (showSettings || currentTab === "settings") {
            return <ProfileManagement />;
        }

        switch (currentTab) {
            case "chats":
                return <ChatList />;
            case "status": // Kept for logic but not in main tabs per request
                return <StatusView />;
            case "calls":
                return <CallsList />;
            case "channels":
                return <ChannelsView />;
            case "ai":
                return <AIChat />;
            case "communities":
                // Using this for "Contacts" view as requested
                return (
                    <div className="flex flex-col h-full items-center justify-center text-center p-4">
                        <Users className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Contacts</h3>
                        <p className="text-gray-500 max-w-xs mx-auto mb-6">
                            Your contacts will appear here.
                        </p>
                        <Button onClick={() => console.log('Sync contacts')}>
                            Access Contacts
                        </Button>
                    </div>
                );
            default:
                return <ChatList />;
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#17212b] border-r border-gray-100 dark:border-black" suppressHydrationWarning>
            {/* Fresh Chat Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#17212b]">
                <Button variant="icon" className="text-gray-500 dark:text-gray-400">
                    <Menu className="w-6 h-6" />
                </Button>

                <div className="flex items-center gap-2 flex-1 ml-4">
                    <KiteLogo className="w-7 h-7" />
                    <h1 className="text-lg font-semibold text-gray-800 dark:text-white">Fresh Chat</h1>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="icon" className="text-gray-500 dark:text-gray-400">
                        <Search className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative">
                {renderContent()}

                {/* New Chat Floating Action Button (Telegram style) */}
                {currentTab === 'chats' && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowNewChatMenu(true)}
                        className="absolute bottom-6 right-6 w-14 h-14 bg-[#3390ec] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-20"
                    >
                        <PenSquare className="w-6 h-6 text-white" />
                    </motion.button>
                )}
            </div>

            {/* Tab Navigation */}
            <div className="flex border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#17212b]">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = currentTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`flex-1 flex flex-col items-center justify-center py-2 relative transition-colors ${isActive
                                ? "text-[#3390ec]"
                                : "text-gray-500 dark:text-gray-400"
                                }`}
                        >
                            <Icon className="w-6 h-6 mb-1" />
                            <span className="text-[10px] font-medium">{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Modals */}
            <CreateGroupModal
                isOpen={showCreateGroup}
                onClose={() => setShowCreateGroup(false)}
                onCreateGroup={handleCreateGroup}
                contacts={contacts}
            />

            {/* New Chat Menu Popup */}
            <AnimatePresence>
                {showNewChatMenu && (
                    <>
                        <div
                            className="fixed inset-0 z-40 bg-black/20"
                            onClick={() => setShowNewChatMenu(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            className="absolute bottom-24 right-6 w-56 bg-white dark:bg-[#17212b] rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 origin-bottom-right"
                        >
                            <button
                                onClick={() => {
                                    setShowNewChatMenu(false);
                                    setShowCreateGroup(true);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                            >
                                <Users className="w-5 h-5 text-gray-500" />
                                <span className="text-sm font-medium">New Group</span>
                            </button>
                            <button
                                onClick={() => {
                                    setShowNewChatMenu(false);
                                    // Handle new secret chat
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                            >
                                <UserPlus className="w-5 h-5 text-gray-500" />
                                <span className="text-sm font-medium">New Contact</span>
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
