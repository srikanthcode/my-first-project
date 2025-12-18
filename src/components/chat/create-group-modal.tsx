"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Users,
    Camera,
    Search,
    Check,
    ArrowRight,
    Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface Contact {
    id: string;
    name: string;
    avatar: string;
    phone: string;
    status?: string;
}

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateGroup: (group: { name: string; description: string; members: string[]; image?: string; type: "group" | "supergroup" | "channel" }) => void;
    contacts: Contact[];
}

export function CreateGroupModal({ isOpen, onClose, onCreateGroup, contacts }: CreateGroupModalProps) {
    const [step, setStep] = useState<"details" | "members">("details");
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [groupName, setGroupName] = useState("");
    const [groupDescription, setGroupDescription] = useState("");
    const [groupImage, setGroupImage] = useState<string | null>(null);
    const [groupType, setGroupType] = useState<"group" | "supergroup" | "channel">("group");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone.includes(searchQuery)
    );

    const toggleMember = (id: string) => {
        setSelectedMembers(prev =>
            prev.includes(id)
                ? prev.filter(m => m !== id)
                : [...prev, id]
        );
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setGroupImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreateGroup = () => {
        if (!groupName.trim()) return;

        onCreateGroup({
            name: groupName,
            description: groupDescription,
            members: selectedMembers,
            image: groupImage || undefined,
            type: groupType
        });

        // Reset state
        setStep("members");
        setSelectedMembers([]);
        setGroupName("");
        setGroupDescription("");
        setGroupImage(null);
        onClose();
    };

    const selectedContacts = contacts.filter(c => selectedMembers.includes(c.id));

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-teal-500 to-green-500 p-4 flex items-center gap-3">
                        <button
                            onClick={step === "members" ? () => setStep("details") : onClose}
                            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                        >
                            {step === "members" ? <ArrowRight className="w-5 h-5 rotate-180" /> : <X className="w-5 h-5" />}
                        </button>
                        <div className="flex-1">
                            <h2 className="text-white font-semibold text-lg">
                                {step === "details" ? "New Group" : "Add Members"}
                            </h2>
                            {step === "members" && (
                                <p className="text-white/80 text-sm">
                                    {selectedMembers.length} selected
                                </p>
                            )}
                        </div>
                        {step === "details" && (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCreateGroup}
                                    disabled={!groupName.trim()}
                                    className="bg-white text-teal-600 p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Create Group Now"
                                >
                                    <Check className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => groupName.trim() && setStep("members")}
                                    disabled={!groupName.trim()}
                                    className="bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Add Members"
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                        {step === "members" && (
                            <button
                                onClick={handleCreateGroup}
                                className="bg-white text-teal-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <Check className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    <AnimatePresence mode="wait">
                        {step === "details" ? (
                            <motion.div
                                key="details"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="p-6 space-y-6"
                            >
                                {/* Group Image */}
                                <div className="flex justify-center">
                                    <label className="relative cursor-pointer group">
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-teal-500 to-green-500 p-1">
                                            <div className="w-full h-full rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                                                {groupImage ? (
                                                    <Image
                                                        src={groupImage}
                                                        alt="Group"
                                                        width={96}
                                                        height={96}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <Camera className="w-10 h-10 text-gray-400 group-hover:text-gray-500 transition-colors" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center shadow-lg">
                                            <Plus className="w-4 h-4 text-white" />
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                </div>

                                {/* Type Selection */}
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    {(['group', 'supergroup', 'channel'] as const).map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setGroupType(t)}
                                            className={`p-2 rounded-lg border text-xs font-medium capitalize transition-all ${groupType === t
                                                ? "border-teal-500 bg-teal-50 text-teal-600 dark:bg-teal-900/20"
                                                : "border-border hover:bg-gray-50 dark:hover:bg-gray-800"
                                                }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>

                                {/* Group Details */}
                                <div className="space-y-4">
                                    <Input
                                        value={groupName}
                                        onChange={(e) => setGroupName(e.target.value)}
                                        placeholder="Group name"
                                        maxLength={50}
                                        className="text-lg"
                                        autoFocus
                                    />
                                    <textarea
                                        value={groupDescription}
                                        onChange={(e) => setGroupDescription(e.target.value)}
                                        placeholder="Description (optional)"
                                        className="w-full px-4 py-3 rounded-xl border border-input bg-transparent shadow-sm resize-none h-20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        maxLength={200}
                                    />
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="members"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex flex-col h-full"
                            >
                                {/* Selected Members Horizontal Scroll */}
                                {selectedMembers.length > 0 && (
                                    <div className="p-4 border-b dark:border-gray-800 shrink-0">
                                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                                            {selectedContacts.map(contact => (
                                                <div key={contact.id} className="flex flex-col items-center min-w-[60px]">
                                                    <div className="relative">
                                                        <Image
                                                            src={contact.avatar}
                                                            alt={contact.name}
                                                            width={48}
                                                            height={48}
                                                            className="w-12 h-12 rounded-full"
                                                        />
                                                        <button
                                                            onClick={() => toggleMember(contact.id)}
                                                            className="absolute -top-1 -right-1 bg-gray-500 text-white rounded-full p-0.5"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <span className="text-xs text-center mt-1 truncate w-full">
                                                        {contact.name.split(' ')[0]}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Search */}
                                <div className="p-4 shrink-0">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <Input
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search contacts..."
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                {/* Contacts List */}
                                <div className="flex-1 overflow-y-auto max-h-[300px]">
                                    {filteredContacts.map(contact => (
                                        <motion.button
                                            key={contact.id}
                                            onClick={() => toggleMember(contact.id)}
                                            className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className="relative">
                                                <Image
                                                    src={contact.avatar}
                                                    alt={contact.name}
                                                    width={48}
                                                    height={48}
                                                    className="w-12 h-12 rounded-full"
                                                />
                                                {selectedMembers.includes(contact.id) && (
                                                    <div className="absolute bottom-0 right-0 bg-teal-500 rounded-full p-0.5">
                                                        <Check className="w-3 h-3 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 text-left">
                                                <h3 className="font-medium">{contact.name}</h3>
                                                <p className="text-sm text-gray-500">{contact.status || contact.phone}</p>
                                            </div>
                                        </motion.button>
                                    ))}
                                    {filteredContacts.length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                                <Users className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                                No contacts found
                                            </h3>
                                            <p className="text-sm text-gray-500 max-w-[200px] mb-6">
                                                You can add members later or share an invite link after creating the group.
                                            </p>
                                            <Button
                                                onClick={handleCreateGroup}
                                                variant="outline"
                                                className="border-teal-500 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20"
                                            >
                                                Create Group Now
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
