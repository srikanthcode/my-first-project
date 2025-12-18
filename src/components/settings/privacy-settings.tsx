"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { Shield, Eye, EyeOff, Users, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PrivacySettings } from "@/types";

export function PrivacySettings() {
    const { user, updatePrivacySettings } = useAuthStore();
    const [settings, setSettings] = useState<PrivacySettings>(user?.settings?.privacy || {
        lastSeen: "everyone",
        profilePhoto: "everyone",
        about: "everyone",
        readReceipts: true,
        disappearingMessages: "off",
    });

    const handleSave = async () => {
        updatePrivacySettings(settings);

        // Sync to backend
        if (user) {
            await fetch('/api/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    settings: { privacy: settings }
                })
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">Privacy Settings</h2>
            </div>

            {/* Last Seen */}
            <div className="space-y-2">
                <label className="flex items-center gap-2 font-medium">
                    <Eye className="w-4 h-4" />
                    Last Seen & Online
                </label>
                <select
                    value={settings.lastSeen}
                    onChange={(e) => setSettings({ ...settings, lastSeen: e.target.value as "everyone" | "contacts" | "nobody" })}
                    className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                >
                    <option value="everyone">Everyone</option>
                    <option value="contacts">My Contacts</option>
                    <option value="nobody">Nobody</option>
                </select>
            </div>

            {/* Profile Photo */}
            <div className="space-y-2">
                <label className="flex items-center gap-2 font-medium">
                    <Users className="w-4 h-4" />
                    Profile Photo
                </label>
                <select
                    value={settings.profilePhoto}
                    onChange={(e) => setSettings({ ...settings, profilePhoto: e.target.value as "everyone" | "contacts" | "nobody" })}
                    className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                >
                    <option value="everyone">Everyone</option>
                    <option value="contacts">My Contacts</option>
                    <option value="nobody">Nobody</option>
                </select>
            </div>

            {/* About */}
            <div className="space-y-2">
                <label className="flex items-center gap-2 font-medium">
                    <Phone className="w-4 h-4" />
                    About
                </label>
                <select
                    value={settings.about}
                    onChange={(e) => setSettings({ ...settings, about: e.target.value as "everyone" | "contacts" | "nobody" })}
                    className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                >
                    <option value="everyone">Everyone</option>
                    <option value="contacts">My Contacts</option>
                    <option value="nobody">Nobody</option>
                </select>
            </div>

            {/* Read Receipts */}
            <div className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
                <div>
                    <h3 className="font-medium">Read Receipts</h3>
                    <p className="text-sm text-gray-500">If turned off, you won&apos;t see read receipts from others</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.readReceipts}
                        onChange={(e) => setSettings({ ...settings, readReceipts: e.target.checked })}
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/50 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
            </div>

            {/* Disappearing Messages */}
            <div className="space-y-2">
                <label className="flex items-center gap-2 font-medium">
                    <EyeOff className="w-4 h-4" />
                    Default Disappearing Messages
                </label>
                <select
                    value={settings.disappearingMessages}
                    onChange={(e) => setSettings({ ...settings, disappearingMessages: e.target.value as "off" | "24h" | "7d" | "90d" })}
                    className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                >
                    <option value="off">Off</option>
                    <option value="24h">24 hours</option>
                    <option value="7d">7 days</option>
                    <option value="90d">90 days</option>
                </select>
            </div>

            <Button onClick={handleSave} className="w-full">
                Save Privacy Settings
            </Button>
        </div>
    );
}
