"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { Bell, Volume2, VolumeX, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotificationSettings() {
    const { user, updateNotificationSettings } = useAuthStore();
    const [settings, setSettings] = useState(user?.settings?.notifications || {
        messageNotifications: true,
        showPreviews: true,
        soundEnabled: true,
        vibration: true,
        groupNotifications: true,
        callNotifications: true,
    });

    const handleSave = async () => {
        updateNotificationSettings(settings);

        if (user) {
            await fetch('/api/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    settings: { notifications: settings }
                })
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <Bell className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">Notification Settings</h2>
            </div>

            {/* Message Notifications */}
            <div className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5" />
                    <div>
                        <h3 className="font-medium">Message Notifications</h3>
                        <p className="text-sm text-gray-500">Show notifications for new messages</p>
                    </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.messageNotifications}
                        onChange={(e) => setSettings({ ...settings, messageNotifications: e.target.checked })}
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
            </div>

            {/* Show Previews */}
            <div className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
                <div>
                    <h3 className="font-medium">Show Message Previews</h3>
                    <p className="text-sm text-gray-500">Display message content in notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.showPreviews}
                        onChange={(e) => setSettings({ ...settings, showPreviews: e.target.checked })}
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
            </div>

            {/* Sound */}
            <div className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
                <div className="flex items-center gap-3">
                    {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    <div>
                        <h3 className="font-medium">Sound</h3>
                        <p className="text-sm text-gray-500">Play notification sounds</p>
                    </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.soundEnabled}
                        onChange={(e) => setSettings({ ...settings, soundEnabled: e.target.checked })}
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
            </div>

            {/* Vibration */}
            <div className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
                <div>
                    <h3 className="font-medium">Vibration</h3>
                    <p className="text-sm text-gray-500">Vibrate on new notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.vibration}
                        onChange={(e) => setSettings({ ...settings, vibration: e.target.checked })}
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
            </div>

            {/* Group Notifications */}
            <div className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
                <div>
                    <h3 className="font-medium">Group Notifications</h3>
                    <p className="text-sm text-gray-500">Get notified for group messages</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.groupNotifications}
                        onChange={(e) => setSettings({ ...settings, groupNotifications: e.target.checked })}
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
            </div>

            {/* Call Notifications */}
            <div className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
                <div>
                    <h3 className="font-medium">Call Notifications</h3>
                    <p className="text-sm text-gray-500">Get notified for incoming calls</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.callNotifications}
                        onChange={(e) => setSettings({ ...settings, callNotifications: e.target.checked })}
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
            </div>

            <Button onClick={handleSave} className="w-full">
                Save Notification Settings
            </Button>
        </div>
    );
}
