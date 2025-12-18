"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { Palette, Moon, Sun, Type, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import type { ThemeMode, AppearanceSettings as AppearanceSettingsType } from "@/types";

export function AppearanceSettings() {
    const { user, updateAppearanceSettings } = useAuthStore();
    const { theme, setTheme } = useTheme();
    const [settings, setSettings] = useState<AppearanceSettingsType>(
        user?.settings?.appearance || {
            theme: (theme as ThemeMode) || "system",
            fontSize: "medium",
            chatWallpaper: "",
            bubbleColor: ""
        }
    );

    const handleSave = async () => {
        updateAppearanceSettings(settings);

        if (user) {
            await fetch('/api/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    settings: { appearance: settings }
                })
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <Palette className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">Appearance</h2>
            </div>

            {/* Theme Selection */}
            <div className="space-y-3">
                <label className="font-medium flex items-center gap-2">
                    <Moon className="w-4 h-4" />
                    Theme
                </label>
                <div className="grid grid-cols-3 gap-3">
                    {(["light", "dark", "system"] as ThemeMode[]).map((t) => (
                        <button
                            key={t}
                            onClick={() => {
                                setTheme(t);
                                setSettings({ ...settings, theme: t });
                            }}
                            className={`p-4 border-2 rounded-lg capitalize transition-all ${theme === t || settings.theme === t
                                ? "border-primary bg-primary/10"
                                : "border-gray-200 dark:border-gray-700"
                                }`}
                        >
                            {t === "light" && <Sun className="w-6 h-6 mx-auto mb-2" />}
                            {t === "dark" && <Moon className="w-6 h-6 mx-auto mb-2" />}
                            {t === "system" && <Palette className="w-6 h-6 mx-auto mb-2" />}
                            <div className="text-sm font-medium">{t}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Font Size */}
            <div className="space-y-3">
                <label className="font-medium flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    Font Size
                </label>
                <div className="grid grid-cols-3 gap-3">
                    {["small", "medium", "large"].map((size) => (
                        <button
                            key={size}
                            onClick={() => setSettings({ ...settings, fontSize: size as "small" | "medium" | "large" })}
                            className={`p-3 border-2 rounded-lg capitalize ${settings.fontSize === size
                                ? "border-primary bg-primary/10"
                                : "border-gray-200 dark:border-gray-700"
                                }`}
                        >
                            <div className={`font-medium ${size === "small" ? "text-sm" : size === "large" ? "text-lg" : "text-base"
                                }`}>
                                {size}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Wallpaper */}
            <div className="border rounded-lg p-4 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                    <ImageIcon className="w-5 h-5" />
                    <h3 className="font-medium">Chat Wallpaper</h3>
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <button
                            key={num}
                            className="aspect-square rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-primary transition-colors"
                            style={{
                                background: `linear-gradient(${num * 45}deg, hsl(${num * 30}, 70%, 60%), hsl(${num * 30 + 60}, 70%, 60%))`
                            }}
                        />
                    ))}
                </div>
                <Button variant="outline" className="w-full mt-3">
                    Upload Custom Wallpaper
                </Button>
            </div>

            <Button onClick={handleSave} className="w-full">
                Save Appearance Settings
            </Button>
        </div>
    );
}
