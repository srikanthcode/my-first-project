"use client";

import { useState, MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Phone,
    Video,
    PhoneIncoming,
    PhoneOutgoing,
    PhoneMissed,
    MoreVertical,
    Search,
    Users,
    Trash2,
    Info,
    X,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useCallStore } from "@/store/call-store";
import { CallHistory } from "@/types";
import Image from "next/image";

export function CallsList() {
    const { callHistory, startCall, setCallModalOpen, clearHistory } = useCallStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCall, setSelectedCall] = useState<CallHistory | null>(null);

    const filteredHistory = callHistory.filter(
        (call: CallHistory) =>
            call.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (call.groupName && call.groupName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const formatDuration = (seconds?: number) => {
        if (!seconds) return "";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        if (mins === 0) return `${secs}s`;
        return `${mins}m ${secs}s`;
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const callDate = new Date(date);
        const diffDays = Math.floor(
            (now.getTime() - callDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 0) {
            return callDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            });
        } else if (diffDays === 1) {
            return "Yesterday";
        } else if (diffDays < 7) {
            return callDate.toLocaleDateString([], { weekday: "long" });
        } else {
            return callDate.toLocaleDateString([], {
                month: "short",
                day: "numeric",
            });
        }
    };

    const getCallIcon = (call: CallHistory) => {
        if (call.isMissed) {
            return <PhoneMissed className="w-4 h-4 text-red-500" />;
        }
        if (call.isOutgoing) {
            return <PhoneOutgoing className="w-4 h-4 text-teal-500" />;
        }
        return <PhoneIncoming className="w-4 h-4 text-teal-500" />;
    };

    const handleCall = (call: CallHistory, type: "audio" | "video") => {
        startCall({
            type,
            receiverId: call.participant.id,
            isGroupCall: !!call.groupName,
            groupId: call.groupName ? "group-1" : undefined,
        });
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Calls</h2>
                    {callHistory.length > 0 && (
                        <button
                            onClick={clearHistory}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        placeholder="Search calls..."
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 flex gap-3">
                <button
                    onClick={() => {
                        startCall({
                            type: "video",
                            isGroupCall: true,
                        });
                    }}
                    className="flex-1 flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-xl hover:shadow-lg hover:shadow-teal-500/30 transition-all"
                >
                    <Video className="w-5 h-5" />
                    <span className="font-medium">Create Video Call</span>
                </button>
                <button
                    onClick={() => {
                        startCall({
                            type: "audio",
                            isGroupCall: true,
                        });
                    }}
                    className="flex-1 flex items-center justify-center gap-2 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                    <Phone className="w-5 h-5 text-teal-500" />
                    <span className="font-medium">Create Voice Call</span>
                </button>
            </div>

            {/* Call History */}
            <div className="flex-1 overflow-y-auto">
                {filteredHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center px-4">
                        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                            <Phone className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">No recent calls</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-xs">
                            Your call history will appear here. Start a call to get started!
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {filteredHistory.map((call: CallHistory) => (
                            <motion.div
                                key={call.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                                onClick={() => setSelectedCall(call)}
                            >
                                {/* Avatar */}
                                <div className="relative">
                                    {call.groupName ? (
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-500 to-green-500 flex items-center justify-center">
                                            <Users className="w-6 h-6 text-white" />
                                        </div>
                                    ) : (
                                        <Avatar
                                            src={call.participant.avatar}
                                            alt={call.participant.name}
                                            size="lg"
                                        />
                                    )}
                                    {/* Call type badge */}
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow">
                                        {call.type === "video" ? (
                                            <Video className="w-3 h-3 text-teal-500" />
                                        ) : (
                                            <Phone className="w-3 h-3 text-teal-500" />
                                        )}
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3
                                            className={`font-medium truncate ${call.isMissed ? "text-red-500" : ""
                                                }`}
                                        >
                                            {call.groupName || call.participant.name}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        {getCallIcon(call)}
                                        <span>
                                            {call.isMissed
                                                ? "Missed"
                                                : call.isOutgoing
                                                    ? "Outgoing"
                                                    : "Incoming"}
                                        </span>
                                        {call.duration && (
                                            <>
                                                <span>•</span>
                                                <span>{formatDuration(call.duration)}</span>
                                            </>
                                        )}
                                        {call.participantCount && (
                                            <>
                                                <span>•</span>
                                                <span>{call.participantCount} participants</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Time & Actions */}
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">
                                        {formatTime(call.timestamp)}
                                    </p>
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={(e: MouseEvent) => {
                                                e.stopPropagation();
                                                handleCall(call, "audio");
                                            }}
                                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                                        >
                                            <Phone className="w-4 h-4 text-teal-500" />
                                        </button>
                                        <button
                                            onClick={(e: MouseEvent) => {
                                                e.stopPropagation();
                                                handleCall(call, "video");
                                            }}
                                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                                        >
                                            <Video className="w-4 h-4 text-teal-500" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Call Details Modal */}
            <AnimatePresence>
                {selectedCall && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedCall(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl"
                            onClick={(e: MouseEvent) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-teal-500 to-green-500 p-6 text-center relative">
                                <button
                                    onClick={() => setSelectedCall(null)}
                                    className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>

                                <div className="w-20 h-20 rounded-full mx-auto bg-white/20 p-1 mb-4">
                                    <Image
                                        src={selectedCall.participant.avatar}
                                        alt={selectedCall.participant.name}
                                        width={80}
                                        height={80}
                                        className="rounded-full"
                                    />
                                </div>
                                <h3 className="text-white font-bold text-lg">
                                    {selectedCall.groupName || selectedCall.participant.name}
                                </h3>
                                <p className="text-white/80">
                                    {selectedCall.type === "video" ? "Video" : "Voice"} Call
                                </p>
                            </div>

                            {/* Details */}
                            <div className="p-4 space-y-3">
                                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                                    <span className="text-gray-500">Status</span>
                                    <span
                                        className={`font-medium ${selectedCall.isMissed ? "text-red-500" : "text-green-500"
                                            }`}
                                    >
                                        {selectedCall.isMissed
                                            ? "Missed"
                                            : selectedCall.isOutgoing
                                                ? "Outgoing"
                                                : "Incoming"}
                                    </span>
                                </div>
                                {selectedCall.duration && (
                                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                                        <span className="text-gray-500">Duration</span>
                                        <span className="font-medium">
                                            {formatDuration(selectedCall.duration)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-500">Date</span>
                                    <span className="font-medium">
                                        {new Date(selectedCall.timestamp).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-4 flex gap-3">
                                <button
                                    onClick={() => {
                                        handleCall(selectedCall, "audio");
                                        setSelectedCall(null);
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    <Phone className="w-5 h-5 text-teal-500" />
                                    <span>Voice</span>
                                </button>
                                <button
                                    onClick={() => {
                                        handleCall(selectedCall, "video");
                                        setSelectedCall(null);
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-xl hover:shadow-lg transition-all"
                                >
                                    <Video className="w-5 h-5" />
                                    <span>Video</span>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
