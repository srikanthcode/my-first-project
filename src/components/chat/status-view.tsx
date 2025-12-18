"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    X,
    ChevronLeft,
    ChevronRight,
    Heart,
    Eye,
    Send,
    Image as ImageIcon,
    Type,
    Camera,
    Palette,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { useStatusStore } from "@/store/status-store";
import { useChatStore } from "@/store/useChatStore";
import Image from "next/image";
import type { User, Status } from "@/types";

const BACKGROUND_GRADIENTS = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
];

const FONT_STYLES = ["normal", "italic", "bold"];

export function StatusView() {
    const user = useAuthStore((state) => state.user);
    const users = useChatStore((state) => state.users);
    const {
        statuses,
        myStatuses,
        viewingStatus,
        isCreating,
        addStatus,
        viewStatus,
        likeStatus,
        setViewingStatus,
        setIsCreating,
        initializeMockStatuses,
    } = useStatusStore();

    const [progress, setProgress] = useState(0);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize mock statuses
    useEffect(() => {
        if (statuses.length === 0 && users.length > 0) {
            initializeMockStatuses(users);
        }
    }, [users, statuses.length, initializeMockStatuses]);

    // Group statuses by user
    const statusesByUser = useMemo(() => users
        .map((u) => {
            const userStatuses = statuses.filter(
                (s) => s.userId === u.id && new Date(s.expiresAt) > new Date()
            );
            if (userStatuses.length === 0) return null;
            return {
                user: u,
                statuses: userStatuses,
                hasUnviewed: userStatuses.some((s) => !s.views.includes("user-1")),
            };
        })
        .filter((item) => item !== null) as { user: User; statuses: Status[]; hasUnviewed: boolean }[], [users, statuses]);

    // Handle status viewing progress
    // We need handleNextStatus definition before the effect that uses it
    const handleViewStatus = useCallback((userId: string, statusIndex: number = 0) => {
        setViewingStatus({ userId, statusIndex });
        const statusUser = statusesByUser.find((su) => su?.user.id === userId);
        if (statusUser) {
            const status = statusUser.statuses[statusIndex];
            if (status && !status.views.includes("user-1")) {
                viewStatus(status.id, "user-1");
            }
        }
    }, [statusesByUser, setViewingStatus, viewStatus]);

    const handleNextStatus = useCallback(() => {
        if (!viewingStatus) return;
        const statusUser = statusesByUser.find((su) => su?.user.id === viewingStatus.userId);
        if (!statusUser) return;

        if (viewingStatus.statusIndex < statusUser.statuses.length - 1) {
            setViewingStatus({
                ...viewingStatus,
                statusIndex: viewingStatus.statusIndex + 1,
            });
            setProgress(0);
        } else {
            // Move to next user
            const currentIndex = statusesByUser.findIndex(
                (su) => su?.user.id === viewingStatus.userId
            );
            if (currentIndex < statusesByUser.length - 1 && statusesByUser[currentIndex + 1]) {
                handleViewStatus(statusesByUser[currentIndex + 1]!.user.id, 0);
            } else {
                setViewingStatus(null);
            }
        }
    }, [viewingStatus, statusesByUser, setViewingStatus, handleViewStatus]);

    useEffect(() => {
        if (!viewingStatus) {
            setProgress(0);
            return;
        }

        progressIntervalRef.current = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    handleNextStatus();
                    return 0;
                }
                return prev + 2;
            });
        }, 100);

        return () => {
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
        };
    }, [viewingStatus, handleNextStatus]);

    const handlePrevStatus = () => {
        if (!viewingStatus) return;
        if (viewingStatus.statusIndex > 0) {
            setViewingStatus({
                ...viewingStatus,
                statusIndex: viewingStatus.statusIndex - 1,
            });
            setProgress(0);
        } else {
            // Move to previous user
            const currentIndex = statusesByUser.findIndex(
                (su) => su?.user.id === viewingStatus.userId
            );
            if (currentIndex > 0 && statusesByUser[currentIndex - 1]) {
                const prevUser = statusesByUser[currentIndex - 1]!;
                handleViewStatus(prevUser.user.id, prevUser.statuses.length - 1);
            }
        }
    };

    const getCurrentStatus = () => {
        if (!viewingStatus) return null;
        const statusUser = statusesByUser.find((su) => su?.user.id === viewingStatus.userId);
        if (!statusUser) return null;
        return {
            status: statusUser.statuses[viewingStatus.statusIndex],
            user: statusUser.user,
            totalCount: statusUser.statuses.length,
        };
    };

    const currentStatusData = getCurrentStatus();

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900">
            {/* Status List */}
            <div className="flex-1 overflow-y-auto">
                {/* My Status */}
                <div
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800"
                    onClick={() => setIsCreating(true)}
                >
                    <div className="relative">
                        <Avatar
                            src={user?.avatar}
                            alt={user?.name || "My Status"}
                            size="lg"
                        />
                        <div className="absolute bottom-0 right-0 bg-gradient-to-r from-teal-500 to-green-500 rounded-full p-1 border-2 border-white dark:border-gray-900">
                            <Plus className="w-3 h-3 text-white" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold">My Status</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {myStatuses.length > 0
                                ? `${myStatuses.length} update${myStatuses.length > 1 ? "s" : ""} today`
                                : "Tap to add status update"}
                        </p>
                    </div>
                </div>

                {/* Recent Updates Header */}
                {statusesByUser.length > 0 && (
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Recent updates
                    </div>
                )}

                {/* Other Users' Statuses */}
                {statusesByUser.map((statusUser) => {
                    if (!statusUser) return null;
                    const { user: statusOwner, statuses: userStatuses, hasUnviewed } = statusUser;
                    const latestStatus = userStatuses[0];

                    return (
                        <motion.div
                            key={statusOwner.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            onClick={() => handleViewStatus(statusOwner.id)}
                        >
                            <div
                                className={`p-[3px] rounded-full ${hasUnviewed
                                    ? "bg-gradient-to-r from-teal-500 to-green-500"
                                    : "bg-gray-300 dark:bg-gray-600"
                                    }`}
                            >
                                <div className="bg-white dark:bg-gray-900 p-[2px] rounded-full">
                                    <Avatar
                                        src={statusOwner.avatar}
                                        alt={statusOwner.name}
                                        size="md"
                                    />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium">{statusOwner.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(latestStatus.timestamp).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                            {userStatuses.length > 1 && (
                                <span className="text-sm text-gray-400">
                                    {userStatuses.length} updates
                                </span>
                            )}
                        </motion.div>
                    );
                })}

                {statusesByUser.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                            <Eye className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="font-semibold mb-2">No status updates</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Status updates from your contacts will appear here
                        </p>
                    </div>
                )}
            </div>

            {/* Status Viewer Modal */}
            <AnimatePresence>
                {viewingStatus && currentStatusData && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black"
                    >
                        {/* Progress bars */}
                        <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 z-10">
                            {Array.from({ length: currentStatusData.totalCount }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
                                >
                                    <div
                                        className="h-full bg-white transition-all duration-100"
                                        style={{
                                            width:
                                                i < viewingStatus.statusIndex
                                                    ? "100%"
                                                    : i === viewingStatus.statusIndex
                                                        ? `${progress}%`
                                                        : "0%",
                                        }}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Header */}
                        <div className="absolute top-6 left-0 right-0 flex items-center gap-3 px-4 z-10">
                            <button
                                onClick={() => setViewingStatus(null)}
                                className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <Avatar
                                src={currentStatusData.user.avatar}
                                alt={currentStatusData.user.name}
                                size="sm"
                            />
                            <div className="flex-1">
                                <p className="text-white font-medium">
                                    {currentStatusData.user.name}
                                </p>
                                <p className="text-white/60 text-sm">
                                    {new Date(
                                        currentStatusData.status.timestamp
                                    ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Status Content */}
                        <div
                            className="absolute inset-0 flex items-center justify-center"
                            style={{
                                background:
                                    currentStatusData.status.type === "text"
                                        ? currentStatusData.status.backgroundColor
                                        : "black",
                            }}
                        >
                            {currentStatusData.status.type === "text" ? (
                                <p className="text-white text-2xl font-medium text-center px-8 max-w-md">
                                    {currentStatusData.status.content}
                                </p>
                            ) : (
                                <Image
                                    src={currentStatusData.status.mediaUrl || ""}
                                    alt="Status"
                                    fill
                                    className="object-contain"
                                />
                            )}
                        </div>

                        {/* Navigation */}
                        <button
                            onClick={handlePrevStatus}
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-1/2 w-1/3"
                        />
                        <button
                            onClick={handleNextStatus}
                            className="absolute right-0 top-1/2 -translate-y-1/2 h-1/2 w-1/3"
                        />

                        {/* Footer */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-4">
                            <div className="flex-1 flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                                <input
                                    type="text"
                                    placeholder="Reply..."
                                    className="flex-1 bg-transparent text-white placeholder-white/60 outline-none"
                                />
                                <button className="p-2 text-white hover:bg-white/20 rounded-full">
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                            <button
                                onClick={() =>
                                    likeStatus(currentStatusData.status.id, "user-1")
                                }
                                className={`p-3 rounded-full transition-colors ${currentStatusData.status.likes?.includes("user-1")
                                    ? "bg-red-500 text-white"
                                    : "bg-white/10 text-white hover:bg-white/20"
                                    }`}
                            >
                                <Heart
                                    className={`w-6 h-6 ${currentStatusData.status.likes?.includes("user-1")
                                        ? "fill-current"
                                        : ""
                                        }`}
                                />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Create Status Modal */}
            <AnimatePresence>
                {isCreating && (
                    <CreateStatusModal onClose={() => setIsCreating(false)} />
                )}
            </AnimatePresence>
        </div>
    );
}

function CreateStatusModal({ onClose }: { onClose: () => void }) {
    const [type, setType] = useState<"text" | "image">("text");
    const [text, setText] = useState("");
    const [selectedBg, setSelectedBg] = useState(0);
    const [imageUrl, setImageUrl] = useState("");
    const [caption, setCaption] = useState("");
    const addStatus = useStatusStore((state) => state.addStatus);

    const handleCreate = () => {
        if (type === "text" && !text.trim()) return;
        if (type === "image" && !imageUrl) return;

        addStatus({
            userId: "user-1",
            type,
            content: type === "text" ? text : caption,
            backgroundColor: type === "text" ? BACKGROUND_GRADIENTS[selectedBg] : undefined,
            mediaUrl: type === "image" ? imageUrl : undefined,
            caption: type === "image" ? caption : undefined,
        });

        onClose();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black"
        >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-10">
                <button
                    onClick={onClose}
                    className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
                <div className="flex gap-2">
                    <button
                        onClick={() => setType("text")}
                        className={`p-2 rounded-full transition-colors ${type === "text"
                            ? "bg-white text-black"
                            : "bg-white/20 text-white"
                            }`}
                    >
                        <Type className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setType("image")}
                        className={`p-2 rounded-full transition-colors ${type === "image"
                            ? "bg-white text-black"
                            : "bg-white/20 text-white"
                            }`}
                    >
                        <ImageIcon className="w-5 h-5" />
                    </button>
                </div>
                <Button
                    onClick={handleCreate}
                    disabled={type === "text" ? !text.trim() : !imageUrl}
                    className="bg-gradient-to-r from-teal-500 to-green-500"
                >
                    Share
                </Button>
            </div>

            {/* Content */}
            <div
                className="absolute inset-0 flex items-center justify-center pt-16 pb-24"
                style={{
                    background:
                        type === "text"
                            ? BACKGROUND_GRADIENTS[selectedBg]
                            : "black",
                }}
            >
                {type === "text" ? (
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type a status..."
                        className="w-full max-w-md bg-transparent text-white text-2xl font-medium text-center resize-none outline-none placeholder-white/60"
                        rows={5}
                        autoFocus
                    />
                ) : imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt="Status preview"
                        fill
                        className="object-contain"
                    />
                ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                            <Camera className="w-10 h-10 text-white" />
                        </div>
                        <p className="text-white text-lg">Tap to add photo</p>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </label>
                )}
            </div>

            {/* Footer - Background selector for text status */}
            {type === "text" && (
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Palette className="w-5 h-5 text-white/60" />
                        <p className="text-white/60 text-sm">Background</p>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {BACKGROUND_GRADIENTS.map((bg, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedBg(i)}
                                className={`w-10 h-10 rounded-full flex-shrink-0 ${selectedBg === i
                                    ? "ring-2 ring-white ring-offset-2 ring-offset-black"
                                    : ""
                                    }`}
                                style={{ background: bg }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Caption for image */}
            {type === "image" && imageUrl && (
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <input
                        type="text"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="Add a caption..."
                        className="w-full bg-white/10 text-white placeholder-white/60 rounded-full px-4 py-3 outline-none"
                    />
                </div>
            )}
        </motion.div>
    );
}
