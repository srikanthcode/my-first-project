"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Sidebar } from "@/components/chat/sidebar";
import { MobileBottomNav } from "@/components/mobile/bottom-nav";
import { SettingsPanel } from "@/components/settings/settings-panel";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GroupCallScreen } from "@/components/chat/group-call-screen";

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/auth/login");
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background dark:bg-background-dark">
            <GroupCallScreen />
            {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-[400px] border-r border-border dark:border-border-dark">
                <Sidebar />
            </div>

            {/* Mobile Sidebar */}
            {isMobileSidebarOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileSidebarOpen(false)} />
                    <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm animate-slide-in">
                        <Sidebar />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative pb-16 md:pb-0">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border dark:border-border-dark bg-panel dark:bg-panel-dark">
                    <Button
                        variant="icon"
                        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </Button>
                    <h1 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
                        Fresh Chat
                    </h1>
                    <div className="w-10" /> {/* Spacer for centering */}
                </div>

                {children}
            </div>

            {/* Mobile Bottom Navigation */}
            <MobileBottomNav onSettingsClick={() => setShowSettings(true)} />
        </div>
    );
}
