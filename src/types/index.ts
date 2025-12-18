/**
 * Type definitions for the WhatsApp clone application
 * Enhanced with advanced features
 */

export type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";
export type UserStatus = "online" | "offline" | "typing" | "away" | "busy";
export type ChatType = "private" | "group" | "ai" | "channel" | "supergroup";
export type ThemeMode = "light" | "dark" | "system";
export type CallType = "audio" | "video";
export type CallStatus = "ringing" | "connecting" | "connected" | "ended" | "missed" | "declined";

// User Types
export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  about?: string;
  status: UserStatus;
  lastSeen?: Date;
  username?: string;
  bio?: string;
  isVerified?: boolean;
  createdAt?: Date;
  settings?: UserSettings;
  twoFactorEnabled?: boolean;
  twoFactorPin?: string;
}

export interface UserSettings {
  privacy: PrivacySettings;
  notifications: NotificationSettings;
  appearance: AppearanceSettings;
}

export interface PrivacySettings {
  lastSeen: "everyone" | "contacts" | "nobody";
  profilePhoto: "everyone" | "contacts" | "nobody";
  about: "everyone" | "contacts" | "nobody";
  readReceipts: boolean;
  disappearingMessages: DisappearingMessageDuration;
}

export type DisappearingMessageDuration = "off" | "24h" | "7d" | "90d";

export interface NotificationSettings {
  messageNotifications: boolean;
  showPreviews: boolean;
  soundEnabled: boolean;
  vibration: boolean;
  groupNotifications: boolean;
  callNotifications: boolean;
}

export interface AppearanceSettings {
  theme: ThemeMode;
  fontSize: "small" | "medium" | "large";
  chatWallpaper?: string;
  bubbleColor?: string;
}

// Message Types
export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  status: MessageStatus;
  type: "text" | "image" | "video" | "audio" | "document" | "voice" | "sticker" | "location" | "contact";
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileDuration?: number; // For audio/video
  thumbnail?: string;
  replyTo?: string;
  reactions?: Record<string, string[]>;
  isForwarded?: boolean;
  isEdited?: boolean;
  editedAt?: Date;
  isDeleted?: boolean;
  deletedAt?: Date;
  expiresAt?: Date; // For disappearing messages
  isStarred?: boolean;
  mentions?: string[]; // User IDs mentioned
  location?: {
    latitude: number;
    longitude: number;
    name?: string;
  };
}

// Chat Types
export interface Chat {
  id: string;
  type: ChatType;
  name?: string;
  avatar?: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  isArchived?: boolean;
  isBlocked?: boolean;
  createdAt: Date;
  updatedAt: Date;
  description?: string;
  admins?: string[];
  settings?: ChatSettings;
  ongoingCall?: GroupCallInfo;
  pinnedMessages?: string[];
}

export interface ChatSettings {
  disappearingMessages: DisappearingMessageDuration;
  onlyAdminsCanMessage?: boolean;
  onlyAdminsCanEditInfo?: boolean;
}

export interface GroupCallInfo {
  id: string;
  type: CallType;
  startedAt: Date;
  participants: string[];
  maxParticipants?: number;
}

// Contact Types
export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  about?: string;
  status: UserStatus;
  lastSeen?: Date;
  username?: string;
  isBlocked?: boolean;
  isFavorite?: boolean;
}

// Status/Stories Types
export interface Status {
  id: string;
  userId: string;
  type: "text" | "image" | "video";
  content: string;
  mediaUrl?: string;
  backgroundColor?: string;
  fontStyle?: string;
  timestamp: Date;
  expiresAt: Date;
  views: string[];
  likes?: string[];
  caption?: string;
  music?: {
    name: string;
    artist: string;
    url?: string;
  };
}

export interface StatusUser {
  user: User;
  statuses: Status[];
  hasUnviewed: boolean;
  lastUpdated: Date;
}

// Call Types
export interface Call {
  id: string;
  type: CallType;
  status: CallStatus;
  callerId: string;
  receiverId?: string; // For private calls
  groupId?: string; // For group calls
  participants: CallParticipant[];
  startedAt?: Date;
  endedAt?: Date;
  duration?: number;
  isGroupCall: boolean;
  missedBy?: string[];
}

export interface CallParticipant {
  id: string;
  name: string;
  avatar: string;
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing?: boolean;
  isSpeaking?: boolean;
  joinedAt: Date;
}

// AI Chat Types
export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  suggestions?: string[];
}

export interface AIConversation {
  id: string;
  messages: AIMessage[];
  createdAt: Date;
  title?: string;
}

// Typing Indicator
export interface TypingIndicator {
  chatId: string;
  userId: string;
  isTyping: boolean;
}

// Voice Note
export interface VoiceNote {
  id: string;
  url: string;
  duration: number;
  waveform?: number[];
}

// Notification Types
export interface Notification {
  id: string;
  type: "message" | "call" | "group" | "status" | "reaction" | "mention";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  data?: Record<string, unknown>;
}

// Call History
export interface CallHistory {
  id: string;
  type: CallType;
  isOutgoing: boolean;
  isMissed: boolean;
  duration?: number;
  timestamp: Date;
  participant: {
    id: string;
    name: string;
    avatar: string;
  };
  groupName?: string;
  participantCount?: number;
}

// Reaction Types
export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[];
  hasReacted: boolean;
}

// Group Invite
export interface GroupInvite {
  id: string;
  groupId: string;
  groupName: string;
  groupAvatar?: string;
  invitedBy: User;
  expiresAt?: Date;
  code: string;
}

// Settings Types (keeping for backward compatibility)
export interface Settings {
  notifications: {
    messageNotifications: boolean;
    showPreviews: boolean;
    soundEnabled: boolean;
  };
  privacy: {
    lastSeen: "everyone" | "contacts" | "nobody";
    profilePhoto: "everyone" | "contacts" | "nobody";
    about: "everyone" | "contacts" | "nobody";
    readReceipts: boolean;
  };
  theme: ThemeMode;
  language: string;
}
