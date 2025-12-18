"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MessageReactionsProps {
    reactions: Record<string, string[]>; // emoji -> userIds
    currentUserId: string;
    onReact: (emoji: string) => void;
    isOwn?: boolean;
}

const QUICK_REACTIONS = ["❤️", "👍", "😂", "😮", "😢", "🙏"];

export function MessageReactions({
    reactions,
    currentUserId,
    onReact,
    isOwn = false,
}: MessageReactionsProps) {
    const hasReactions = Object.keys(reactions).length > 0;

    if (!hasReactions) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex gap-1 mt-1 ${isOwn ? "justify-end" : "justify-start"}`}
        >
            {Object.entries(reactions).map(([emoji, userIds]) => {
                const hasReacted = userIds.includes(currentUserId);
                return (
                    <motion.button
                        key={emoji}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onReact(emoji)}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-sm ${hasReacted
                                ? "bg-teal-100 dark:bg-teal-900/30 ring-1 ring-teal-500"
                                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                            }`}
                    >
                        <span>{emoji}</span>
                        {userIds.length > 1 && (
                            <span className="text-xs text-gray-500">{userIds.length}</span>
                        )}
                    </motion.button>
                );
            })}
        </motion.div>
    );
}

interface ReactionPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (emoji: string) => void;
    position?: "top" | "bottom";
}

export function ReactionPicker({
    isOpen,
    onClose,
    onSelect,
    position = "top",
}: ReactionPickerProps) {
    const [showAllEmojis, setShowAllEmojis] = useState(false);

    const ALL_EMOJIS = [
        "❤️", "👍", "👎", "😂", "😮", "😢", "🙏", "🔥",
        "🎉", "💯", "👏", "🤔", "😍", "🥳", "😎", "🤯",
        "💪", "🙌", "✨", "💕", "😊", "😇", "🥰", "😘",
        "👀", "🙈", "🤝", "💀", "😭", "🤣", "😱", "😤",
    ];

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40"
                onClick={onClose}
            />

            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: position === "top" ? 10 : -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: position === "top" ? 10 : -10 }}
                    className={`absolute ${position === "top" ? "bottom-full mb-2" : "top-full mt-2"
                        } left-0 z-50`}
                >
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-2">
                        {/* Quick reactions */}
                        <div className="flex gap-1">
                            {(showAllEmojis ? ALL_EMOJIS : QUICK_REACTIONS).map((emoji) => (
                                <motion.button
                                    key={emoji}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => {
                                        onSelect(emoji);
                                        onClose();
                                    }}
                                    className="w-10 h-10 flex items-center justify-center text-xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                                >
                                    {emoji}
                                </motion.button>
                            ))}
                            {!showAllEmojis && (
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    onClick={() => setShowAllEmojis(true)}
                                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                                >
                                    +
                                </motion.button>
                            )}
                        </div>

                        {/* Expanded emoji grid */}
                        {showAllEmojis && (
                            <button
                                onClick={() => setShowAllEmojis(false)}
                                className="w-full text-center text-sm text-teal-500 hover:underline mt-2"
                            >
                                Show less
                            </button>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        </>
    );
}

interface ReactionSummaryProps {
    reactions: Record<string, string[]>;
    onPress: () => void;
}

export function ReactionSummary({ reactions, onPress }: ReactionSummaryProps) {
    const entries = Object.entries(reactions);
    if (entries.length === 0) return null;

    const totalReactions = entries.reduce((sum, [, users]) => sum + users.length, 0);
    const topEmojis = entries
        .sort((a, b) => b[1].length - a[1].length)
        .slice(0, 3)
        .map(([emoji]) => emoji);

    return (
        <button
            onClick={onPress}
            className="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm hover:shadow-md transition-shadow"
        >
            <span className="text-sm">{topEmojis.join("")}</span>
            <span className="text-xs text-gray-500">{totalReactions}</span>
        </button>
    );
}
