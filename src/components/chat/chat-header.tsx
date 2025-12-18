"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Video, Phone, Search, MoreVertical, ArrowLeft } from "lucide-react";
import { User } from "@/types";
import { formatLastSeen } from "@/lib/utils";
import { useUIStore } from "@/store/useUIStore";
import { useCallStore } from "@/store/call-store";
import { GroupSettingsPanel } from "@/components/groups/group-settings-panel";
import { useState } from "react";

interface ChatHeaderProps {
    user: User;
    isGroup?: boolean;
    onBack?: () => void;
}

export function ChatHeader({ user, isGroup, onBack }: ChatHeaderProps) {
    const startCall = useCallStore(state => state.startCall);
    const [showGroupSettings, setShowGroupSettings] = useState(false);

    return (
        <>
            <div className="flex items-center justify-between px-4 py-2 border-b border-border dark:border-border-dark bg-white dark:bg-[#17212b] shadow-sm">
                <div className="flex items-center gap-3">
                    <Button
                        variant="icon"
                        className="md:hidden text-gray-500 bg-transparent"
                        onClick={onBack}
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Button>

                    <Avatar
                        src={user.avatar}
                        alt={user.name}
                        size="md"
                        status={user.status}
                        className="cursor-pointer"
                        onClick={() => isGroup && setShowGroupSettings(true)}
                    />

                    <div
                        className="cursor-pointer"
                        onClick={() => isGroup && setShowGroupSettings(true)}
                    >
                        <h2 className="font-semibold text-gray-900 dark:text-white text-base hover:underline">
                            {user.name}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user.status === "online"
                                ? <span className="text-blue-400">online</span>
                                : user.lastSeen
                                    ? `last seen ${formatLastSeen(user.lastSeen)}`
                                    : "offline"
                            }
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                    <Button variant="icon" aria-label="Search">
                        <Search className="w-5 h-5" />
                    </Button>
                    {isGroup && (
                        <Button
                            variant="icon"
                            aria-label="Video chat"
                            className="text-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20"
                            onClick={() => startCall({
                                type: 'video',
                                isGroupCall: true,
                                groupId: user.id
                            })}
                        >
                            <Video className="w-5 h-5" />
                        </Button>
                    )}
                    {!isGroup && (
                        <Button variant="icon" aria-label="Audio call">
                            <Phone className="w-5 h-5" />
                        </Button>
                    )}
                    <Button variant="icon" aria-label="Menu">
                        <MoreVertical className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {isGroup && (
                <GroupSettingsPanel
                    isOpen={showGroupSettings}
                    onClose={() => setShowGroupSettings(false)}
                    groupId={user.id}
                />
            )}
        </>
    );
}
