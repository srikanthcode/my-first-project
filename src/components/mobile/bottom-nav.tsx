"use client";

import { MessageCircle, Users, Phone, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface MobileBottomNavProps {
    onSettingsClick: () => void;
}

export function MobileBottomNav({ onSettingsClick }: MobileBottomNavProps) {
    const [activeTab, setActiveTab] = useState("chats");

    const tabs = [
        { id: "chats", label: "Chats", icon: MessageCircle },
        { id: "status", label: "Status", icon: Users },
        { id: "calls", label: "Calls", icon: Phone },
        { id: "settings", label: "Settings", icon: Settings },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-panel dark:bg-panel-dark border-t border-border dark:border-border-dark z-40">
            <div className="flex items-center justify-around">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            setActiveTab(tab.id);
                            if (tab.id === "settings") {
                                onSettingsClick();
                            }
                        }}
                        className={cn(
                            "flex-1 flex flex-col items-center gap-1 py-2 transition-colors",
                            activeTab === tab.id
                                ? "text-primary"
                                : "text-text-secondary dark:text-text-secondary-dark"
                        )}
                    >
                        <tab.icon className="w-6 h-6" />
                        <span className="text-xs font-medium">{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
