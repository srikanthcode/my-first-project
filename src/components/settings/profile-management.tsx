"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Camera,
    AtSign,
    Mail,
    Phone,
    Edit2,
    Check,
    X,
    Shield,
    Bell,
    Moon,
    Eye,
    MessageSquare,
    Clock,
    LogOut,
    ChevronRight,
    Palette,
    Lock,
    Smartphone,
    Globe,
    HelpCircle,
    Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth-store";
import { useThemeStore } from "@/store/theme-store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface SettingsSectionProps {
    title: string;
    children: React.ReactNode;
}

function SettingsSection({ title, children }: SettingsSectionProps) {
    return (
        <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 mb-2">
                {title}
            </h3>
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden divide-y divide-gray-100 dark:divide-gray-700">
                {children}
            </div>
        </div>
    );
}

interface SettingsItemProps {
    icon: React.ReactNode;
    label: string;
    value?: string;
    onClick?: () => void;
    toggle?: boolean;
    toggleValue?: boolean;
    onToggle?: (value: boolean) => void;
    danger?: boolean;
}

function SettingsItem({
    icon,
    label,
    value,
    onClick,
    toggle,
    toggleValue,
    onToggle,
    danger,
}: SettingsItemProps) {
    return (
        <button
            onClick={toggle ? () => onToggle?.(!toggleValue) : onClick}
            className={`w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${danger ? "text-red-500" : ""
                }`}
        >
            <div className={`${danger ? "text-red-500" : "text-gray-400"}`}>{icon}</div>
            <div className="flex-1 text-left">
                <p className="font-medium">{label}</p>
                {value && <p className="text-sm text-gray-500">{value}</p>}
            </div>
            {toggle ? (
                <div
                    className={`w-12 h-7 rounded-full relative transition-colors ${toggleValue
                        ? "bg-gradient-to-r from-teal-500 to-green-500"
                        : "bg-gray-200 dark:bg-gray-600"
                        }`}
                >
                    <motion.div
                        animate={{ x: toggleValue ? 20 : 0 }}
                        className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow"
                    />
                </div>
            ) : onClick ? (
                <ChevronRight className="w-5 h-5 text-gray-400" />
            ) : null}
        </button>
    );
}

export function ProfileManagement() {
    const router = useRouter();
    const { user, updateProfile, updatePrivacySettings, updateNotificationSettings, logout } =
        useAuthStore();
    const { theme, toggleTheme } = useThemeStore();
    const isDark = theme === "dark";

    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(user?.name || "");
    const [editedBio, setEditedBio] = useState(user?.bio || user?.about || "");
    const [editedUsername, setEditedUsername] = useState(user?.username || "");
    const [editedEmail, setEditedEmail] = useState(user?.email || "");
    const [editedAvatar, setEditedAvatar] = useState(user?.avatar || "");

    const handleSaveProfile = () => {
        updateProfile({
            name: editedName,
            bio: editedBio,
            username: editedUsername,
            email: editedEmail,
            avatar: editedAvatar,
        });
        setIsEditing(false);
        toast.success("Profile updated successfully!");
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditedAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogout = () => {
        logout();
        router.push("/auth/login");
        toast.success("Logged out successfully");
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 overflow-y-auto">
            {/* Profile Header */}
            <div className="bg-gradient-to-br from-teal-500 to-green-500 px-6 py-8 relative">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-white/20 p-1">
                            <div className="w-full h-full rounded-full overflow-hidden bg-white">
                                {user?.avatar ? (
                                    <Image
                                        src={user.avatar}
                                        alt={user.name || "Profile"}
                                        width={80}
                                        height={80}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                        <User className="w-10 h-10 text-gray-400" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg"
                        >
                            <Edit2 className="w-4 h-4 text-teal-500" />
                        </button>
                    </div>
                    <div className="flex-1 text-white">
                        <h2 className="text-xl font-bold">{user?.name || "User"}</h2>
                        {user?.username && (
                            <p className="text-white/80">@{user.username}</p>
                        )}
                        <p className="text-sm text-white/60 mt-1">
                            {user?.about || user?.bio || "Hey there! I'm using ChatFresh"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Settings */}
            <div className="p-4">
                {/* Account */}
                <SettingsSection title="Account">
                    <SettingsItem
                        icon={<Phone className="w-5 h-5" />}
                        label="Phone"
                        value={user?.phone || "Not set"}
                    />
                    <SettingsItem
                        icon={<Mail className="w-5 h-5" />}
                        label="Email"
                        value={user?.email || "Not set"}
                        onClick={() => setIsEditing(true)}
                    />
                    <SettingsItem
                        icon={<AtSign className="w-5 h-5" />}
                        label="Username"
                        value={user?.username ? `@${user.username}` : "Not set"}
                        onClick={() => setIsEditing(true)}
                    />
                </SettingsSection>

                {/* Privacy */}
                <SettingsSection title="Privacy">
                    <SettingsItem
                        icon={<Eye className="w-5 h-5" />}
                        label="Last Seen"
                        value={user?.settings?.privacy?.lastSeen || "Everyone"}
                        onClick={() => { }}
                    />
                    <SettingsItem
                        icon={<User className="w-5 h-5" />}
                        label="Profile Photo"
                        value={user?.settings?.privacy?.profilePhoto || "Everyone"}
                        onClick={() => { }}
                    />
                    <SettingsItem
                        icon={<MessageSquare className="w-5 h-5" />}
                        label="Read Receipts"
                        toggle
                        toggleValue={user?.settings?.privacy?.readReceipts ?? true}
                        onToggle={(value) => updatePrivacySettings({ readReceipts: value })}
                    />
                    <SettingsItem
                        icon={<Clock className="w-5 h-5" />}
                        label="Disappearing Messages"
                        value="Off"
                        onClick={() => { }}
                    />
                    <SettingsItem
                        icon={<Lock className="w-5 h-5" />}
                        label="Blocked Contacts"
                        value="0 contacts"
                        onClick={() => { }}
                    />
                </SettingsSection>

                {/* Notifications */}
                <SettingsSection title="Notifications">
                    <SettingsItem
                        icon={<Bell className="w-5 h-5" />}
                        label="Message Notifications"
                        toggle
                        toggleValue={user?.settings?.notifications?.messageNotifications ?? true}
                        onToggle={(value) =>
                            updateNotificationSettings({ messageNotifications: value })
                        }
                    />
                    <SettingsItem
                        icon={<Eye className="w-5 h-5" />}
                        label="Show Previews"
                        toggle
                        toggleValue={user?.settings?.notifications?.showPreviews ?? true}
                        onToggle={(value) =>
                            updateNotificationSettings({ showPreviews: value })
                        }
                    />
                    <SettingsItem
                        icon={<Smartphone className="w-5 h-5" />}
                        label="Sound"
                        toggle
                        toggleValue={user?.settings?.notifications?.soundEnabled ?? true}
                        onToggle={(value) =>
                            updateNotificationSettings({ soundEnabled: value })
                        }
                    />
                </SettingsSection>

                {/* Appearance */}
                <SettingsSection title="Appearance">
                    <SettingsItem
                        icon={<Moon className="w-5 h-5" />}
                        label="Dark Mode"
                        toggle
                        toggleValue={isDark}
                        onToggle={() => toggleTheme()}
                    />
                    <SettingsItem
                        icon={<Palette className="w-5 h-5" />}
                        label="Chat Wallpaper"
                        value="Default"
                        onClick={() => { }}
                    />
                    <SettingsItem
                        icon={<Globe className="w-5 h-5" />}
                        label="Language"
                        value="English"
                        onClick={() => { }}
                    />
                </SettingsSection>

                {/* Help & Info */}
                <SettingsSection title="Help">
                    <SettingsItem
                        icon={<HelpCircle className="w-5 h-5" />}
                        label="Help Center"
                        onClick={() => { }}
                    />
                    <SettingsItem
                        icon={<Info className="w-5 h-5" />}
                        label="About"
                        value="ChatFresh v1.0.0"
                        onClick={() => { }}
                    />
                </SettingsSection>

                {/* Logout */}
                <SettingsSection title="">
                    <SettingsItem
                        icon={<LogOut className="w-5 h-5" />}
                        label="Log Out"
                        onClick={handleLogout}
                        danger
                    />
                </SettingsSection>
            </div>

            {/* Edit Profile Modal */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setIsEditing(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">Edit Profile</h2>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Avatar */}
                            <div className="flex justify-center mb-6">
                                <label className="relative cursor-pointer">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-teal-500 to-green-500 p-1">
                                        <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-700">
                                            {editedAvatar ? (
                                                <Image
                                                    src={editedAvatar}
                                                    alt="Profile"
                                                    width={96}
                                                    height={96}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <User className="w-10 h-10 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                                        <Camera className="w-4 h-4 text-white" />
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {/* Form */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <Input
                                            value={editedName}
                                            onChange={(e) => setEditedName(e.target.value)}
                                            className="pl-10"
                                            placeholder="Your name"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Username
                                    </label>
                                    <div className="relative">
                                        <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <Input
                                            value={editedUsername}
                                            onChange={(e) =>
                                                setEditedUsername(
                                                    e.target.value.toLowerCase().replace(/\s/g, "")
                                                )
                                            }
                                            className="pl-10"
                                            placeholder="username"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <Input
                                            type="email"
                                            value={editedEmail}
                                            onChange={(e) => setEditedEmail(e.target.value)}
                                            className="pl-10"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Bio
                                    </label>
                                    <textarea
                                        value={editedBio}
                                        onChange={(e) => setEditedBio(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 resize-none h-20 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                                        placeholder="Tell something about yourself..."
                                        maxLength={150}
                                    />
                                    <p className="text-xs text-gray-500 text-right mt-1">
                                        {editedBio.length}/150
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 mt-6">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSaveProfile}
                                    className="flex-1 bg-gradient-to-r from-teal-500 to-green-500"
                                >
                                    <Check className="w-5 h-5 mr-2" />
                                    Save
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
