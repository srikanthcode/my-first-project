"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Hash, Users, TrendingUp, Bell, BellOff, X } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Channel {
    id: string;
    name: string;
    description: string;
    subscribers: number;
    avatar?: string;
    unreadCount?: number;
    verified?: boolean;
    category?: string;
}

const MOCK_CHANNELS: Channel[] = [
    {
        id: "1",
        name: "Tech News Daily",
        description: "Latest technology news and updates",
        subscribers: 125000,
        verified: true,
        unreadCount: 5,
        category: "Technology"
    },
    {
        id: "2",
        name: "Programming Tips",
        description: "Daily coding tips and best practices",
        subscribers: 98000,
        verified: true,
        unreadCount: 12,
        category: "Education"
    },
    {
        id: "3",
        name: "Design Inspiration",
        description: "Beautiful designs from around the world",
        subscribers: 250000,
        verified: true,
        category: "Design"
    },
    {
        id: "4",
        name: "AI & Machine Learning",
        description: "Latest in artificial intelligence",
        subscribers: 185000,
        verified: true,
        category: "Technology"
    },
    {
        id: "5",
        name: "Startup News",
        description: "Entrepreneurship and startup ecosystem",
        subscribers: 67000,
        category: "Business"
    },
    {
        id: "6",
        name: "Web Development",
        description: "Modern web development tutorials",
        subscribers: 143000,
        verified: true,
        unreadCount: 3,
        category: "Education"
    },
];

type TabType = "chats" | "channels" | "apps" | "posts" | "media" | "links";

export function ChannelsView() {
    const [activeTab, setActiveTab] = useState<TabType>("channels");
    const [searchQuery, setSearchQuery] = useState("");
    const [showSearch, setShowSearch] = useState(false);

    const tabs: { id: TabType; label: string }[] = [
        { id: "chats", label: "Chats" },
        { id: "channels", label: "Channels" },
        { id: "apps", label: "Apps" },
        { id: "posts", label: "Posts" },
        { id: "media", label: "Media" },
        { id: "links", label: "Links" },
    ];

    const filteredChannels = useMemo(() => {
        return MOCK_CHANNELS.filter((channel) =>
            channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            channel.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const formatSubscribers = (count: number) => {
        if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
        if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
        return count.toString();
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#0e1621]">
            {/* Search Header */}
            <AnimatePresence mode="wait">
                {showSearch ? (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="px-4 py-3 bg-white dark:bg-[#17212b] border-b border-gray-100 dark:border-gray-800"
                    >
                        <div className="flex items-center gap-2">
                            <Search className="w-5 h-5 text-gray-400" />
                            <Input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search channels..."
                                className="flex-1 bg-transparent border-none outline-none text-gray-800 dark:text-white"
                                autoFocus
                            />
                            <button
                                onClick={() => {
                                    setShowSearch(false);
                                    setSearchQuery("");
                                }}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="px-4 py-3 bg-white dark:bg-[#17212b] border-b border-gray-100 dark:border-gray-800"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Channels</h2>
                            <Button
                                variant="icon"
                                onClick={() => setShowSearch(true)}
                                className="text-gray-500 dark:text-gray-400"
                            >
                                <Search className="w-5 h-5" />
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tabs */}
            <div className="flex items-center overflow-x-auto px-2 py-2 bg-white dark:bg-[#17212b] border-b border-gray-100 dark:border-gray-800 scrollbar-hide">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id
                                ? "bg-[#3390ec] text-white"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                    >
                        {tab.label}
                        {tab.id === "posts" && (
                            <span className="ml-1 px-1.5 py-0.5 bg-[#3390ec] text-white text-xs rounded">NEW</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Channels List */}
            <div className="flex-1 overflow-y-auto">
                {activeTab === "channels" && (
                    <>
                        {/* Joined Channels Section */}
                        <div className="px-4 py-2">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    Channels you joined
                                </h3>
                                <button className="text-xs text-[#3390ec] font-medium">Show More</button>
                            </div>

                            <div className="space-y-1">
                                {filteredChannels.map((channel) => (
                                    <motion.div
                                        key={channel.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                                        className="flex items-center gap-3 px-2 py-3 rounded-lg cursor-pointer dark:hover:bg-gray-800/50 transition-colors"
                                    >
                                        <div className="relative">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3390ec] to-[#2f83d6] flex items-center justify-center">
                                                <Hash className="w-6 h-6 text-white" />
                                            </div>
                                            {channel.verified && (
                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#3390ec] rounded-full flex items-center justify-center border-2 border-white dark:border-[#17212b]">
                                                    <svg
                                                        className="w-3 h-3 text-white"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-medium text-gray-800 dark:text-white truncate">
                                                    {channel.name}
                                                </h4>
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                {formatSubscribers(channel.subscribers)} subscribers
                                            </p>
                                        </div>

                                        {channel.unreadCount && channel.unreadCount > 0 && (
                                            <div className="flex items-center gap-2">
                                                <div className="px-2 py-0.5 bg-[#3390ec] text-white text-xs font-medium rounded-full min-w-[24px] text-center">
                                                    {channel.unreadCount > 99 ? "99+" : channel.unreadCount}
                                                </div>
                                                <Bell className="w-4 h-4 text-gray-400" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Similar Channels Section */}
                        <div className="px-4 py-2 mt-4">
                            <div className="flex items-center gap-2 mb-3">
                                <TrendingUp className="w-4 h-4 text-gray-500" />
                                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    Similar channels
                                </h3>
                            </div>

                            <div className="space-y-1">
                                {MOCK_CHANNELS.slice(0, 3).map((channel) => (
                                    <motion.div
                                        key={`similar-${channel.id}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex items-center gap-3 px-2 py-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                            <Hash className="w-6 h-6 text-white" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-gray-800 dark:text-white truncate">
                                                {channel.name}
                                            </h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                {formatSubscribers(channel.subscribers)} subscribers
                                            </p>
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-xs bg-[#3390ec] text-white border-none hover:bg-[#2f83d6]"
                                        >
                                            Join
                                        </Button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {activeTab !== "channels" && (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                            <Users className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                            {activeTab === "chats" && "No Chats"}
                            {activeTab === "apps" && "No Apps"}
                            {activeTab === "posts" && "No Posts"}
                            {activeTab === "media" && "No Media"}
                            {activeTab === "links" && "No Links"}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-xs">
                            Content from this tab will appear here
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
