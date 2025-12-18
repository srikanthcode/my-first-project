"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bot,
    Send,
    Sparkles,
    Plus,
    Trash2,
    ChevronLeft,
    Copy,
    Check,
    Loader2,
    MessageSquarePlus,
    History,
    X,
} from "lucide-react";
import { useAIStore } from "@/store/ai-store";
import { Button } from "@/components/ui/button";

export function AIChat() {
    const [input, setInput] = useState("");
    const [showHistory, setShowHistory] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const {
        conversations,
        activeConversationId,
        isLoading,
        getActiveConversation,
        createNewConversation,
        setActiveConversation,
        deleteConversation,
        sendMessage,
    } = useAIStore();

    const activeConversation = getActiveConversation();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeConversation?.messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        const message = input.trim();
        setInput("");
        await sendMessage(message);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleCopy = async (text: string, id: string) => {
        await navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setInput(suggestion);
    };

    return (
        <div className="flex h-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            {/* Sidebar - Conversation History */}
            <AnimatePresence>
                {showHistory && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 280, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden"
                    >
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Chat History</h3>
                            <button
                                onClick={() => setShowHistory(false)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-2">
                            <button
                                onClick={createNewConversation}
                                className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <Plus className="w-5 h-5 text-teal-500" />
                                <span>New Chat</span>
                            </button>
                        </div>
                        <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
                            {conversations.map((conv) => (
                                <div
                                    key={conv.id}
                                    className={`p-3 mx-2 rounded-lg cursor-pointer group flex items-center justify-between ${activeConversationId === conv.id
                                        ? "bg-teal-50 dark:bg-teal-900/30"
                                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                        }`}
                                    onClick={() => setActiveConversation(conv.id)}
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{conv.title}</p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {conv.messages.length} messages
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e: React.MouseEvent) => {
                                            e.stopPropagation();
                                            deleteConversation(conv.id);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg flex items-center gap-3">
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <History className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-green-500 flex items-center justify-center">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="font-semibold flex items-center gap-2">
                                ChatFresh AI
                                <Sparkles className="w-4 h-4 text-yellow-500" />
                            </h2>
                            <p className="text-sm text-gray-500">Always ready to help</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        onClick={createNewConversation}
                        className="flex items-center gap-2"
                    >
                        <MessageSquarePlus className="w-4 h-4" />
                        New Chat
                    </Button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {!activeConversation || activeConversation.messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-green-500 flex items-center justify-center mb-6"
                            >
                                <Bot className="w-10 h-10 text-white" />
                            </motion.div>
                            <h3 className="text-2xl font-bold mb-2">Welcome to ChatFresh AI</h3>
                            <p className="text-gray-500 mb-8 max-w-md">
                                I&apos;m your AI assistant. Ask me anything - from answering questions to
                                helping with creative tasks!
                            </p>
                            <div className="grid grid-cols-2 gap-3 max-w-md">
                                {[
                                    "Tell me a joke",
                                    "What can you help me with?",
                                    "Write a message for me",
                                    "Explain something complex",
                                ].map((suggestion) => (
                                    <motion.button
                                        key={suggestion}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                                    >
                                        {suggestion}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        activeConversation.messages.map((message) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl p-4 ${message.role === "user"
                                        ? "bg-gradient-to-r from-teal-500 to-green-500 text-white"
                                        : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                                        }`}
                                >
                                    {message.role === "assistant" && (
                                        <div className="flex items-center gap-2 mb-2 text-teal-500">
                                            <Bot className="w-4 h-4" />
                                            <span className="text-xs font-medium">ChatFresh AI</span>
                                        </div>
                                    )}
                                    {message.isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Thinking...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="whitespace-pre-wrap">{message.content}</p>
                                            {message.role === "assistant" && (
                                                <div className="mt-3 flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleCopy(message.content, message.id)}
                                                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                    >
                                                        {copiedId === message.id ? (
                                                            <Check className="w-4 h-4 text-green-500" />
                                                        ) : (
                                                            <Copy className="w-4 h-4 text-gray-400" />
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                            {message.suggestions && message.suggestions.length > 0 && (
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {message.suggestions.map((suggestion, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => handleSuggestionClick(suggestion)}
                                                            className="px-3 py-1 text-sm rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors"
                                                        >
                                                            {suggestion}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                            <textarea
                                value={input}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask ChatFresh AI anything..."
                                rows={1}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 resize-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                                style={{ minHeight: "48px", maxHeight: "120px" }}
                            />
                        </div>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className="h-12 w-12 rounded-xl bg-gradient-to-r from-teal-500 to-green-500 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-shadow"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </motion.button>
                    </div>
                    <p className="text-xs text-center text-gray-400 mt-2">
                        ChatFresh AI can make mistakes. Consider checking important information.
                    </p>
                </div>
            </div>
        </div>
    );
}
