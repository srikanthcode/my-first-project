"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Tabs replaced with manual buttons
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, User, Settings, Lock, LogOut, Users } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth-store";
import Image from "next/image";

// Mock Tabs if they don't exist, but standard UI usually has them.
// If I can't check, I'll build simple button tabs.

interface GroupSettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    groupId: string;
}

export function GroupSettingsPanel({ isOpen, onClose, groupId }: GroupSettingsPanelProps) {
    const { user: currentUser } = useAuthStore();
    const [activeTab, setActiveTab] = useState("info");
    const [group, setGroup] = useState<any>(null);
    const [members, setMembers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isOpen && groupId) {
            fetchGroupData();
        }
    }, [isOpen, groupId]);

    const fetchGroupData = async () => {
        setIsLoading(true);
        try {
            const [groupRes, membersRes] = await Promise.all([
                fetch(`/api/groups/${groupId}`),
                fetch(`/api/groups/${groupId}/members`)
            ]);

            const groupData = await groupRes.json();
            const membersData = await membersRes.json();

            if (groupData.success) setGroup(groupData.data);
            if (membersData.success) setMembers(membersData.data);

        } catch (error) {
            console.error("Failed to fetch group data", error);
            toast.error("Could not load group info");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePromote = async (userId: string) => {
        try {
            const res = await fetch(`/api/groups/${groupId}/members/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: 'admin' })
            });
            if (res.ok) {
                toast.success("Member promoted to Admin");
                fetchGroupData(); // Refresh
            }
        } catch (error) {
            toast.error("Action failed");
        }
    };

    const handleKick = async (userId: string) => {
        if (!confirm("Are you sure you want to remove this user?")) return;
        try {
            const res = await fetch(`/api/groups/${groupId}/members/${userId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                toast.success("Member removed");
                fetchGroupData();
            }
        } catch (error) {
            toast.error("Action failed");
        }
    };

    if (!isOpen) return null;

    // Simple Tab UI helper
    const TabBtn = ({ id, label, icon: Icon }: any) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex-1 py-3 flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === id
                ? "border-primary text-primary font-medium"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
                }`}
        >
            <Icon className="w-4 h-4" />
            <span className="text-sm">{label}</span>
        </button>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Group Info" size="lg">
            {isLoading ? (
                <div className="h-60 flex items-center justify-center">
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
                </div>
            ) : group ? (
                <div className="flex flex-col h-[500px]">
                    <div className="flex border-b mb-4">
                        <TabBtn id="info" label="Overview" icon={UsersIcon} />
                        <TabBtn id="members" label={`Members (${members.length})`} icon={User} />
                        <TabBtn id="settings" label="Settings" icon={Settings} />
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2">
                        {/* INFO TAB */}
                        {activeTab === "info" && (
                            <div className="space-y-6">
                                <div className="flex flex-col items-center gap-3 py-4">
                                    <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden relative border-4 border-white shadow-lg">
                                        {group.avatar ? (
                                            <Image src={group.avatar} fill alt={group.name} className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white text-3xl font-bold">
                                                {group.name[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-2xl font-bold">{group.name}</h3>
                                        <p className="text-sm text-gray-500 capitalize">{group.type}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Description</label>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
                                        {group.description || "No description provided."}
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <Button variant="destructive" className="w-full flex items-center justify-center gap-2">
                                        <LogOut className="w-4 h-4" />
                                        Leave Group
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* MEMBERS TAB */}
                        {activeTab === "members" && (
                            <div className="space-y-3">
                                {members.map((member: any) => (
                                    <div key={member.userId._id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800/50 border rounded-xl hover:shadow-sm transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative">
                                                {/* Assuming populated user data */}
                                                {member.userId.avatar ? (
                                                    <Image src={member.userId.avatar} fill alt="" className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-indigo-500 flex items-center justify-center text-white text-xs">
                                                        {member.userId.name?.[0]}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{member.userId.name}</p>
                                                <p className="text-xs text-gray-500 capitalize">{member.role}</p>
                                            </div>
                                        </div>

                                        {/* Admin Actions (Only show if current user is admin/owner) */}
                                        {/* Simplified permission logic for UI */}
                                        <div className="flex items-center gap-1">
                                            {member.role === 'member' && (
                                                <Button size="sm" variant="ghost" onClick={() => handlePromote(member.userId._id)} className="text-xs h-7">
                                                    Promote
                                                </Button>
                                            )}
                                            {member.role !== 'owner' && (
                                                <Button size="sm" variant="ghost" onClick={() => handleKick(member.userId._id)} className="text-xs h-7 text-red-500 hover:text-red-700 hover:bg-red-50">
                                                    Kick
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* SETTINGS TAB */}
                        {activeTab === "settings" && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Privacy & Permissions</label>
                                    <div className="space-y-2 rounded-lg border p-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">Send Messages</span>
                                            <input type="checkbox" defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">Slow Mode</span>
                                            <select className="text-sm border rounded p-1 bg-transparent">
                                                <option value="0">Off</option>
                                                <option value="10">10s</option>
                                                <option value="30">30s</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 text-center pt-4">
                                    Only Admins can change settings.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-center py-10">Group not found</div>
            )}
        </Modal>
    );
}

// Icon helper
function UsersIcon(props: any) {
    return <Users {...props} />;
}
