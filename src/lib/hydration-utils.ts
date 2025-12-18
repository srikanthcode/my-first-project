/**
 * Hydration utilities to prevent errors from browser extensions
 * that modify the DOM before React hydrates
 */

/**
 * Sanitizes className by removing unexpected characters injected by extensions
 */
export function sanitizeClassName(className: string | undefined): string {
    if (!className) return "";

    // Remove any non-standard characters that extensions might inject
    return className
        .replace(/[^\w\s\-:[\]()]/g, " ") // Keep valid CSS class characters
        .replace(/\s+/g, " ") // Normalize whitespace
        .trim();
}

/**
 * Sanitizes text content by removing unexpected injections
 */
export function sanitizeTextContent(text: string | undefined): string {
    if (!text) return "";

    // Remove zero-width characters and other invisible unicode that extensions inject
    return text
        .replace(/[\u200B-\u200D\uFEFF]/g, "") // Zero-width characters
        .replace(/\u00A0/g, " ") // Non-breaking spaces
        .trim();
}

/**
 * Normalizes children to prevent hydration mismatches
 */
export function normalizeChildren(children: React.ReactNode): React.ReactNode {
    if (typeof children === "string") {
        return sanitizeTextContent(children);
    }
    return children;
}

/**
 * Checks if we're in the browser (client-side)
 */
export function isClient(): boolean {
    return typeof window !== "undefined";
}

/**
 * Safely gets a value only on client-side to prevent SSR/CSR mismatches
 */
export function getClientValue<T>(value: T, fallback: T): T {
    return isClient() ? value : fallback;
}

/**
 * Creates a stable key for components that might be affected by extensions
 */
export function createStableKey(base: string, index: number): string {
    return `${base}-${index}`;
}
