import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format message timestamp for display
 */
export function formatMessageTime(date: Date | string): string {
  const messageDate = typeof date === "string" ? new Date(date) : date;
  return format(messageDate, "HH:mm");
}

/**
 * Format chat list timestamp
 */
export function formatChatTime(date: Date | string): string {
  const chatDate = typeof date === "string" ? new Date(date) : date;
  
  if (isToday(chatDate)) {
    return format(chatDate, "HH:mm");
  } else if (isYesterday(chatDate)) {
    return "Yesterday";
  } else {
    return format(chatDate, "dd/MM/yyyy");
  }
}

/**
 * Format last seen timestamp
 */
export function formatLastSeen(date: Date | string): string {
  const lastSeenDate = typeof date === "string" ? new Date(date) : date;
  
  if (isToday(lastSeenDate)) {
    return `today at ${format(lastSeenDate, "HH:mm")}`;
  } else if (isYesterday(lastSeenDate)) {
    return `yesterday at ${format(lastSeenDate, "HH:mm")}`;
  } else {
    return formatDistanceToNow(lastSeenDate, { addSuffix: true });
  }
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

/**
 * Generate random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}
