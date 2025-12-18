/**
 * Application constants
 */

export const APP_NAME = "Fresh Chat";
export const APP_DESCRIPTION = "A modern real-time chat application";

// Message status
export const MESSAGE_STATUS = {
    SENT: "sent",
    DELIVERED: "delivered",
    READ: "read",
} as const;

// User status
export const USER_STATUS = {
    ONLINE: "online",
    OFFLINE: "offline",
    TYPING: "typing",
} as const;

// Chat types
export const CHAT_TYPE = {
    PRIVATE: "private",
    GROUP: "group",
} as const;

// Theme modes
export const THEME_MODE = {
    LIGHT: "light",
    DARK: "dark",
} as const;

// File types
export const FILE_TYPES = {
    IMAGE: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    VIDEO: ["video/mp4", "video/webm"],
    DOCUMENT: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    AUDIO: ["audio/mpeg", "audio/wav", "audio/ogg"],
} as const;

// Max file sizes (in bytes)
export const MAX_FILE_SIZE = {
    IMAGE: 5 * 1024 * 1024, // 5MB
    VIDEO: 50 * 1024 * 1024, // 50MB
    DOCUMENT: 10 * 1024 * 1024, // 10MB
    AUDIO: 10 * 1024 * 1024, // 10MB
} as const;

// Color palette
export const COLORS = {
    primary: {
        light: "#25D366",
        dark: "#00A884",
    },
    background: {
        light: "#F0F2F5",
        dark: "#111B21",
    },
    chat: {
        light: "#FFFFFF",
        dark: "#202C33",
    },
    message: {
        sent: {
            light: "#D9FDD3",
            dark: "#005C4B",
        },
        received: {
            light: "#FFFFFF",
            dark: "#202C33",
        },
    },
} as const;
