"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuthStore } from "@/store/auth-store";
import { X, Camera, Bell, Lock, Info } from "lucide-react";
import toast from "react-hot-toast";

interface SettingsPanelProps {
    onClose: () => void;
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
    const user = useAuthStore((state) => state.user);
    const updateUser = useAuthStore((state) => state.updateUser);
    const logout = useAuthStore((state) => state.logout);

    const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "privacy" | "theme">("profile");
    const [profileData, setProfileData] = useState({
        name: user?.name || "",
        about: user?.about || "",
    });

    const handleSaveProfile = () => {
        updateUser(profileData);
        toast.success("Profile updated successfully!");
    };

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully!");
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-panel dark:bg-panel-dark rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border dark:border-border-dark">
                    <h2 className="text-xl font-semibold text-text-primary dark:text-text-primary-dark">
                        Settings
                    </h2>
                    <Button variant="icon" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-border dark:border-border-dark">
                    {[
                        { id: "profile", label: "Profile", icon: Camera },
                        { id: "notifications", label: "Notifications", icon: Bell },
                        { id: "privacy", label: "Privacy", icon: Lock },
                        { id: "theme", label: "Theme", icon: Info },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as "profile" | "notifications" | "privacy" | "theme")}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.id
                                ? "text-primary border-b-2 border-primary"
                                : "text-text-secondary dark:text-text-secondary-dark hover:bg-hover dark:hover:bg-hover-dark"
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    {activeTab === "profile" && (
                        <div className="space-y-6">
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative">
                                    <Avatar src={user?.avatar} alt={user?.name || "User"} size="xl" />
                                    <button className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-white hover:bg-primary-dark">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2">
                                    Your Name
                                </label>
                                <Input
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2">
                                    About
                                </label>
                                <Input
                                    value={profileData.about}
                                    onChange={(e) => setProfileData({ ...profileData, about: e.target.value })}
                                    placeholder="Hey there! I am using WhatsApp"
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button onClick={handleSaveProfile} className="flex-1">
                                    Save Changes
                                </Button>
                                <Button onClick={handleLogout} variant="secondary">
                                    Logout
                                </Button>
                            </div>
                        </div>
                    )}

                    {activeTab === "notifications" && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-text-primary dark:text-text-primary-dark">
                                        Message Notifications
                                    </h3>
                                    <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
                                        Show notifications for new messages
                                    </p>
                                </div>
                                <input type="checkbox" defaultChecked className="w-5 h-5" />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-text-primary dark:text-text-primary-dark">
                                        Show Previews
                                    </h3>
                                    <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
                                        Display message content in notifications
                                    </p>
                                </div>
                                <input type="checkbox" defaultChecked className="w-5 h-5" />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-text-primary dark:text-text-primary-dark">
                                        Sound
                                    </h3>
                                    <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
                                        Play sound for notifications
                                    </p>
                                </div>
                                <input type="checkbox" defaultChecked className="w-5 h-5" />
                            </div>
                        </div>
                    )}

                    {activeTab === "privacy" && (
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-medium text-text-primary dark:text-text-primary-dark mb-2">
                                    Last Seen
                                </h3>
                                <select className="input-primary">
                                    <option>Everyone</option>
                                    <option>My Contacts</option>
                                    <option>Nobody</option>
                                </select>
                            </div>

                            <div>
                                <h3 className="font-medium text-text-primary dark:text-text-primary-dark mb-2">
                                    Profile Photo
                                </h3>
                                <select className="input-primary">
                                    <option>Everyone</option>
                                    <option>My Contacts</option>
                                    <option>Nobody</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-text-primary dark:text-text-primary-dark">
                                        Read Receipts
                                    </h3>
                                    <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
                                        Show blue ticks when you read messages
                                    </p>
                                </div>
                                <input type="checkbox" defaultChecked className="w-5 h-5" />
                            </div>
                        </div>
                    )}

                    {activeTab === "theme" && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-text-primary dark:text-text-primary-dark">
                                        Dark Mode
                                    </h3>
                                    <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
                                        Toggle between light and dark theme
                                    </p>
                                </div>
                                <ThemeToggle />
                            </div>

                            <div className="p-4 rounded-lg bg-background dark:bg-background-dark">
                                <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
                                    The theme will be applied across the entire application.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
