"use client";

import { useState, useEffect } from "react";
import { Users, Shield, Settings, Clock, BarChart, UserPlus, UserMinus, Link as LinkIcon, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

interface GroupMember {
    id: string;
    name: string;
    avatar?: string;
    role: 'owner' | 'admin' | 'member';
}

interface Poll {
    id: string;
    question: string;
    options: { text: string; votes: number }[];
    totalVotes: number;
}

interface JoinRequest {
    id: string;
    userId: string;
    name: string;
    avatar?: string;
    requestedAt: Date;
}

interface GroupManagementProps {
    groupId: string;
    isAdmin: boolean;
}

interface GroupSettings {
    whoCanSend: "everyone" | "admins";
    whoCanAddMembers: "everyone" | "admins";
    approveNewMembers: boolean;
    slowMode: number;
    autoDeleteMessages: number;
}

interface MemberPermissions {
    canSendMessages: boolean;
    canSendMedia: boolean;
    canSendStickers: boolean;
    canEmbedLinks: boolean;
    canAddMembers: boolean;
    canPinMessages: boolean;
    canChangeInfo: boolean;
    [key: string]: boolean;
}

interface GroupInfoState {
    name: string;
    description: string;
    memberCount: number;
    privacy: 'public' | 'private';
    inviteLink?: string;
    settings: GroupSettings;
    defaultMemberPermissions: MemberPermissions;
}

export function GroupManagement({ groupId, isAdmin }: GroupManagementProps) {
    const [groupInfo, setGroupInfo] = useState<GroupInfoState>({
        name: "",
        description: "",
        memberCount: 0,
        privacy: 'private',
        settings: {
            whoCanSend: "everyone",
            whoCanAddMembers: "admins",
            approveNewMembers: false,
            slowMode: 0,
            autoDeleteMessages: 0
        },
        defaultMemberPermissions: {
            canSendMessages: true,
            canSendMedia: true,
            canSendStickers: true,
            canEmbedLinks: false,
            canAddMembers: true,
            canPinMessages: false,
            canChangeInfo: false
        }
    });
    const [members, setMembers] = useState<GroupMember[]>([]);
    const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
    const [polls, setPolls] = useState<Poll[]>([]);
    const [activeTab, setActiveTab] = useState<'members' | 'settings' | 'polls' | 'requests'>('members');

    useEffect(() => {
        const fetchGroupData = async () => {
            try {
                const response = await fetch(`/api/groups?id=${groupId}`);
                const data = await response.json();
                if (data.success) {
                    setGroupInfo(data.data);
                    // Fetch members (mock for now)
                    setMembers([
                        { id: '1', name: 'You', role: 'owner' },
                        { id: '2', name: 'John Doe', role: 'admin' },
                        { id: '3', name: 'Jane Smith', role: 'member' }
                    ]);
                }
            } catch (error) {
                console.error('Failed to fetch group data:', error);
            }
        };

        fetchGroupData();
    }, [groupId]);

    const handleGenerateLink = async () => {
        try {
            const res = await fetch('/api/groups', {
                method: 'PATCH',
                body: JSON.stringify({ groupId, userId: 'current-user-id', action: 'generate' })
            });
            const data = await res.json();
            if (data.success) {
                setGroupInfo(prev => ({ ...prev, inviteLink: data.link }));
                toast.success("Link generated");
            }
        } catch (err) { toast.error("Failed"); }
    };

    const handleRevokeLink = async () => {
        try {
            const res = await fetch('/api/groups', {
                method: 'PATCH',
                body: JSON.stringify({ groupId, userId: 'current-user-id', action: 'revoke' })
            });
            if (res.ok) {
                setGroupInfo(prev => ({ ...prev, inviteLink: undefined }));
                toast.success("Link revoked");
            }
        } catch (err) { toast.error("Failed"); }
    };

    const handleUpdateSettings = async () => {
        try {
            const response = await fetch('/api/groups', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    groupId,
                    userId: 'current-user-id', // Replace with actual user ID
                    settings: groupInfo.settings
                })
            });

            if (response.ok) {
                toast.success("Group settings updated");
            }
        } catch (error) {
            toast.error("Failed to update settings");
        }
    };

    const handlePromoteMember = async (memberId: string) => {
        setMembers(members.map(m =>
            m.id === memberId && m.role === 'member'
                ? { ...m, role: 'admin' }
                : m
        ));
        toast.success("Member promoted to admin");
    };

    const handleRemoveMember = async (memberId: string) => {
        setMembers(members.filter(m => m.id !== memberId));
        toast.success("Member removed from group");
    };

    const handleApproveJoinRequest = async (requestId: string) => {
        setJoinRequests(joinRequests.filter(r => r.id !== requestId));
        toast.success("Join request approved");
    };

    const handleRejectJoinRequest = async (requestId: string) => {
        setJoinRequests(joinRequests.filter(r => r.id !== requestId));
        toast.success("Join request rejected");
    };

    const handleCreatePoll = async (question: string, options: string[]) => {
        const newPoll: Poll = {
            id: Date.now().toString(),
            question,
            options: options.map(text => ({ text, votes: 0 })),
            totalVotes: 0
        };
        setPolls([...polls, newPoll]);
        toast.success("Poll created");
    };

    if (!isAdmin) {
        return (
            <div className="p-8 text-center">
                <Shield className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">Admin Access Required</h3>
                <p className="text-gray-500">Only group admins can manage group settings</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">Group Management</h2>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b dark:border-gray-700">
                {[
                    { id: 'members', label: 'Members', icon: Users },
                    { id: 'settings', label: 'Settings', icon: Settings },
                    { id: 'polls', label: 'Polls', icon: BarChart },
                    { id: 'requests', label: 'Requests', icon: UserPlus, badge: joinRequests.length }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as 'members' | 'settings' | 'polls' | 'requests')}
                        className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${activeTab === tab.id
                            ? 'border-primary text-primary'
                            : 'border-transparent hover:text-primary'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                        {tab.badge && tab.badge > 0 && (
                            <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                                {tab.badge}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Members Tab */}
            {activeTab === 'members' && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium">{members.length} Members</h3>
                        <Button size="sm">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Add Members
                        </Button>
                    </div>

                    <div className="space-y-2">
                        {members.map(member => (
                            <div
                                key={member.id}
                                className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                        {member.name[0]}
                                    </div>
                                    <div>
                                        <div className="font-medium">{member.name}</div>
                                        <div className="text-xs text-gray-500 capitalize">{member.role}</div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {member.role === 'member' && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePromoteMember(member.id)}
                                        >
                                            <Shield className="w-4 h-4 mr-1" />
                                            Promote
                                        </Button>
                                    )}
                                    {member.role !== 'owner' && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveMember(member.id)}
                                        >
                                            <UserMinus className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
                <div className="space-y-4">
                    {/* Invite Link Section */}
                    <div className="p-4 border rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h3 className="font-medium flex items-center gap-2">
                                    <LinkIcon className="w-4 h-4" />
                                    Invite Link
                                </h3>
                                <p className="text-sm text-gray-500">Share this link to let people join</p>
                            </div>
                            <Button size="sm" variant={groupInfo.inviteLink ? "destructive" : "outline"} onClick={groupInfo.inviteLink ? handleRevokeLink : handleGenerateLink}>
                                {groupInfo.inviteLink ? "Revoke Link" : "Create Link"}
                            </Button>
                        </div>

                        {groupInfo.inviteLink && (
                            <div className="flex gap-2">
                                <Input
                                    readOnly
                                    value={`${window.location.origin}/chat/join/${groupInfo.inviteLink}`}
                                    className="bg-white dark:bg-gray-900 font-mono text-sm"
                                />
                                <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => {
                                    navigator.clipboard.writeText(`${window.location.origin}/chat/join/${groupInfo.inviteLink}`);
                                    toast.success("Link copied!");
                                }}>
                                    <Copy className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Group Privacy */}
                    <div className="space-y-2">
                        <label className="font-medium">Group Privacy</label>
                        <select
                            value={groupInfo.privacy || 'private'}
                            onChange={(e) => setGroupInfo({
                                ...groupInfo,
                                privacy: e.target.value as 'public' | 'private'
                            })}
                            className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                        >
                            <option value="private">Private (Invite Only)</option>
                            <option value="public">Public (Searchable)</option>
                        </select>
                        <p className="text-xs text-gray-500">
                            {groupInfo.privacy === 'public'
                                ? 'Anyone can find and join this group.'
                                : 'Only people with the invite link can join.'}
                        </p>
                    </div>

                    {/* Who Can Send Messages */}
                    <div className="space-y-2">
                        <label className="font-medium">Who Can Send Messages</label>
                        <select
                            value={groupInfo.settings.whoCanSend}
                            onChange={(e) => setGroupInfo({
                                ...groupInfo,
                                settings: { ...groupInfo.settings, whoCanSend: e.target.value as "everyone" | "admins" }
                            })}
                            className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                        >
                            <option value="everyone">Everyone</option>
                            <option value="admins">Only Admins</option>
                        </select>
                    </div>

                    {/* Who Can Add Members */}
                    <div className="space-y-2">
                        <label className="font-medium">Who Can Add Members</label>
                        <select
                            value={groupInfo.settings.whoCanAddMembers}
                            onChange={(e) => setGroupInfo({
                                ...groupInfo,
                                settings: { ...groupInfo.settings, whoCanAddMembers: e.target.value as "everyone" | "admins" }
                            })}
                            className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                        >
                            <option value="everyone">Everyone</option>
                            <option value="admins">Only Admins</option>
                        </select>
                    </div>

                    {/* Approve New Members */}
                    <div className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
                        <div>
                            <h3 className="font-medium">Approve New Members</h3>
                            <p className="text-sm text-gray-500">New members need admin approval</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={groupInfo.settings.approveNewMembers}
                                onChange={(e) => setGroupInfo({
                                    ...groupInfo,
                                    settings: { ...groupInfo.settings, approveNewMembers: e.target.checked }
                                })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>

                    {/* Slow Mode */}
                    <div className="space-y-2">
                        <label className="font-medium flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Slow Mode
                        </label>
                        <select
                            value={groupInfo.settings.slowMode}
                            onChange={(e) => setGroupInfo({
                                ...groupInfo,
                                settings: { ...groupInfo.settings, slowMode: parseInt(e.target.value) }
                            })}
                            className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                        >
                            <option value="0">Off</option>
                            <option value="10">10 seconds</option>
                            <option value="30">30 seconds</option>
                            <option value="60">1 minute</option>
                            <option value="300">5 minutes</option>
                        </select>
                        <p className="text-xs text-gray-500">Members can send one message per interval</p>
                    </div>

                    {/* Auto-Delete Messages */}
                    <div className="space-y-2">
                        <label className="font-medium">Auto-Delete Messages</label>
                        <select
                            value={groupInfo.settings.autoDeleteMessages}
                            onChange={(e) => setGroupInfo({
                                ...groupInfo,
                                settings: { ...groupInfo.settings, autoDeleteMessages: parseInt(e.target.value) }
                            })}
                            className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                        >
                            <option value="0">Never</option>
                            <option value="3600">1 hour</option>
                            <option value="86400">24 hours</option>
                            <option value="604800">7 days</option>
                        </select>
                    </div>

                    {/* Member Permissions */}
                    <div className="space-y-3 pt-4 border-t dark:border-gray-700">
                        <h3 className="font-medium text-lg">Member Permissions</h3>
                        <p className="text-sm text-gray-500 mb-2">What can regular members do?</p>

                        {[
                            { id: 'canSendMessages', label: 'Send Messages' },
                            { id: 'canSendMedia', label: 'Send Media (Photos, Video, Voice)' },
                            { id: 'canSendStickers', label: 'Send Stickers & GIFs' },
                            { id: 'canEmbedLinks', label: 'Embed Links' },
                            { id: 'canAddMembers', label: 'Add Users' },
                            { id: 'canPinMessages', label: 'Pin Messages' },
                            { id: 'canChangeInfo', label: 'Change Group Info' },
                        ].map((perm) => (
                            <div key={perm.id} className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                                <span className="font-medium text-sm">{perm.label}</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={groupInfo.defaultMemberPermissions[perm.id]}
                                        onChange={(e) => setGroupInfo({
                                            ...groupInfo,
                                            defaultMemberPermissions: {
                                                ...groupInfo.defaultMemberPermissions,
                                                [perm.id]: e.target.checked
                                            }
                                        })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        ))}
                    </div>

                    <Button onClick={handleUpdateSettings} className="w-full mt-4">
                        Save Settings
                    </Button>
                </div>
            )}

            {/* Polls Tab */}
            {activeTab === 'polls' && (
                <div className="space-y-4">
                    <Button
                        onClick={() => {
                            const question = prompt("Enter poll question:");
                            if (question) {
                                const options: string[] = [];
                                for (let i = 0; i < 4; i++) {
                                    const option = prompt(`Option ${i + 1} (leave empty to stop):`);
                                    if (!option) break;
                                    options.push(option);
                                }
                                if (options.length >= 2) {
                                    handleCreatePoll(question, options);
                                }
                            }
                        }}
                    >
                        <BarChart className="w-4 h-4 mr-2" />
                        Create Poll
                    </Button>

                    {polls.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No polls created yet
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {polls.map(poll => (
                                <div key={poll.id} className="border rounded-lg p-4 dark:border-gray-700">
                                    <h4 className="font-medium mb-3">{poll.question}</h4>
                                    <div className="space-y-2">
                                        {poll.options.map((option, idx) => (
                                            <div key={idx} className="flex items-center justify-between">
                                                <span>{option.text}</span>
                                                <span className="text-sm text-gray-500">{option.votes} votes</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-3 text-sm text-gray-500">
                                        Total votes: {poll.totalVotes}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Join Requests Tab */}
            {activeTab === 'requests' && (
                <div className="space-y-3">
                    {joinRequests.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No pending join requests
                        </div>
                    ) : (
                        joinRequests.map(request => (
                            <div
                                key={request.id}
                                className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                        {request.name[0]}
                                    </div>
                                    <div>
                                        <div className="font-medium">{request.name}</div>
                                        <div className="text-xs text-gray-500">
                                            Requested {request.requestedAt.toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => handleApproveJoinRequest(request.id)}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleRejectJoinRequest(request.id)}
                                    >
                                        Reject
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
