"use client";

import { useState, useRef, KeyboardEvent, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Smile,
    Paperclip,
    Send,
    Mic,
    Image as ImageIcon,
    FileText,
    MapPin,
    User,
    Sticker,
    Vote,
} from "lucide-react";

import { useMessageStore, MessageState } from "@/store/message-store";
import { VoiceRecorder } from "./voice-note";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import toast from "react-hot-toast";

interface MessageInputProps {
    chatId: string;
}

export function MessageInput({ chatId }: MessageInputProps) {
    const [message, setMessage] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showAttachMenu, setShowAttachMenu] = useState(false);
    const [isRecording, setIsRecording] = useState(false);

    const sendMessage = useMessageStore((state: MessageState) => state.sendMessage);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    /* --------------------------------------------
       AUTO RESIZE TEXTAREA
    ---------------------------------------------*/
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height =
                Math.min(textareaRef.current.scrollHeight, 120) + "px";
        }
    }, [message]);

    /* --------------------------------------------
       SEND TEXT MESSAGE
    ---------------------------------------------*/
    const handleSend = () => {
        if (!message.trim()) return;

        sendMessage(chatId, message.trim(), "text");
        setMessage("");
        setShowEmojiPicker(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    /* --------------------------------------------
       EMOJI HANDLER
    ---------------------------------------------*/
    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setMessage((prev) => prev + emojiData.emoji);
        textareaRef.current?.focus();
    };

    /* --------------------------------------------
       FILE UPLOAD
    ---------------------------------------------*/
    const openFilePicker = (type: "file" | "image") => {
        if (type === "image") imageInputRef.current?.click();
        else fileInputRef.current?.click();

        setShowAttachMenu(false);
    };

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        isImage = false
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const fileUrl = URL.createObjectURL(file);
        const type = isImage || file.type.startsWith("image/") ? "image" : "document";

        sendMessage(
            chatId,
            type === "image" ? "📷 Photo" : `📎 ${file.name}`,
            type,
            {
                fileUrl,
                fileName: file.name,
                fileSize: file.size,
            }
        );

        toast.success(`${type === "image" ? "Photo" : "File"} sent!`);
        e.target.value = "";
    };

    /* --------------------------------------------
       VOICE NOTE
    ---------------------------------------------*/
    const handleVoiceNote = (blob: Blob, duration: number) => {
        const audioUrl = URL.createObjectURL(blob);

        sendMessage(chatId, "🎤 Voice message", "voice", {
            fileUrl: audioUrl,
            fileDuration: duration,
        });

        setIsRecording(false);
        toast.success("Voice message sent!");
    };

    /* --------------------------------------------
       ATTACHMENT MENU OPTIONS
    ---------------------------------------------*/
    const attachmentOptions = [
        {
            icon: ImageIcon,
            label: "Photo / Video",
            color: "from-purple-500 to-pink-500",
            action: () => openFilePicker("image"),
        },
        {
            icon: FileText,
            label: "File",
            color: "from-blue-500 to-cyan-500",
            action: () => openFilePicker("file"),
        },
        {
            icon: MapPin,
            label: "Location",
            color: "from-green-500 to-emerald-500",
            action: () => toast.success("Location sharing coming soon!"),
        },
        {
            icon: Vote,
            label: "Poll",
            color: "from-yellow-400 to-orange-400",
            action: () => toast.success("Polls coming soon!"),
        },
        {
            icon: User,
            label: "Contact",
            color: "from-blue-400 to-indigo-500",
            action: () => toast.success("Contact sharing coming soon!"),
        },
    ];

    /* --------------------------------------------
       RENDER
    ---------------------------------------------*/
    return (
        <div className="relative px-4 py-2 bg-white dark:bg-[#17212b] border-t border-gray-100 dark:border-black/20">
            {/* Hidden Inputs */}
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, false)} />

            <input
                ref={imageInputRef}
                type="file"
                className="hidden"
                accept="image/*,video/*"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, true)}
            />

            { }
            <AnimatePresence>
                {showAttachMenu && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setShowAttachMenu(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute bottom-full left-2 mb-3 bg-white dark:bg-[#17212b] rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 p-2 z-50 min-w-[200px]"
                        >
                            {attachmentOptions.map((opt) => (
                                <button
                                    key={opt.label}
                                    onClick={opt.action}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition w-full"
                                >
                                    <div
                                        className={`w-8 h-8 rounded-full bg-gradient-to-r ${opt.color} flex items-center justify-center`}
                                    >
                                        <opt.icon className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-sm text-gray-700 dark:text-gray-200">
                                        {opt.label}
                                    </span>
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* --------------------------------------------
                EMOJI PICKER
            ---------------------------------------------*/}
            <AnimatePresence>
                {showEmojiPicker && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setShowEmojiPicker(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute bottom-full left-4 mb-2 z-50 shadow-xl rounded-2xl overflow-hidden"
                        >
                            <EmojiPicker
                                onEmojiClick={handleEmojiClick}
                                autoFocusSearch={false}
                                theme={
                                    document.documentElement.classList.contains("dark")
                                        ? Theme.DARK
                                        : Theme.LIGHT
                                }
                                width={320}
                                height={400}
                            />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* --------------------------------------------
                VOICE RECORDER
            ---------------------------------------------*/}
            <AnimatePresence>
                {isRecording && (
                    <VoiceRecorder
                        onSend={handleVoiceNote}
                        onCancel={() => setIsRecording(false)}
                    />
                )}
            </AnimatePresence>

            {/* --------------------------------------------
                INPUT BAR
            ---------------------------------------------*/}
            <div className="flex items-end gap-2">
                {/* Attach Button */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                        setShowAttachMenu((s) => !s);
                        setShowEmojiPicker(false);
                    }}
                    className={`p-2 rounded-full transition ${showAttachMenu
                        ? "text-teal-500"
                        : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        }`}
                >
                    <Paperclip className="w-6 h-6 rotate-45" />
                </motion.button>

                {/* Text Input */}
                <div className="flex-1 relative bg-gray-100 dark:bg-black/20 rounded-2xl flex items-center px-2">
                    {/* Emoji Button */}
                    <button
                        onClick={() => {
                            setShowEmojiPicker((s) => !s);
                            setShowAttachMenu(false);
                        }}
                        className={`p-2 ${showEmojiPicker
                            ? "text-teal-500"
                            : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            }`}
                    >
                        <Smile className="w-6 h-6" />
                    </button>

                    <textarea
                        ref={textareaRef}
                        value={message}
                        placeholder="Message"
                        rows={1}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full py-3 bg-transparent border-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none resize-none max-h-[120px] leading-6"
                    />

                    {/* Sticker Button */}
                    <button
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <Sticker className="w-6 h-6" />
                    </button>
                </div>

                {/* Send / Mic Button */}
                {message.trim() ? (
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleSend}
                        className="p-3 rounded-full bg-[#3390ec] text-white shadow-lg"
                    >
                        <Send className="w-5 h-5 ml-0.5" />
                    </motion.button>
                ) : (
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsRecording(true)}
                        className="p-3 rounded-full bg-[#3390ec] text-white shadow-lg"
                    >
                        <Mic className="w-5 h-5" />
                    </motion.button>
                )}
            </div>
        </div>
    );
}
