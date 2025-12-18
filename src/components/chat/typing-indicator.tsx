"use client";

export function TypingIndicator() {
    return (
        <div className="flex items-center gap-1 px-3 py-2">
            <div className="flex gap-1">
                <div className="w-2 h-2 bg-text-secondary dark:bg-text-secondary-dark rounded-full animate-bounce-dot" />
                <div className="w-2 h-2 bg-text-secondary dark:bg-text-secondary-dark rounded-full animate-bounce-dot [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-text-secondary dark:bg-text-secondary-dark rounded-full animate-bounce-dot [animation-delay:0.4s]" />
            </div>
        </div>
    );
}
