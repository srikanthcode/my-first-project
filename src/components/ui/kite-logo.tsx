export function KiteLogo({ className = "w-8 h-8", showGradient = true }: { className?: string; showGradient?: boolean }) {
    return (
        <svg
            className={className}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                {showGradient && (
                    <>
                        <linearGradient id="kiteGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#0EA5E9" />
                            <stop offset="50%" stopColor="#7C3AED" />
                            <stop offset="100%" stopColor="#FF6B35" />
                        </linearGradient>
                        <linearGradient id="kiteGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#FF6B35" />
                            <stop offset="100%" stopColor="#E55A2B" />
                        </linearGradient>
                    </>
                )}
            </defs>

            {/* Kite diamond shape */}
            <path
                d="M50 10 L75 35 L50 75 L25 35 Z"
                fill={showGradient ? "url(#kiteGradient1)" : "currentColor"}
                className={!showGradient ? "text-primary" : ""}
            />

            {/* Center accent */}
            <circle
                cx="50"
                cy="42"
                r="8"
                fill="white"
                opacity="0.3"
            />

            {/* Kite string */}
            <line
                x1="50"
                y1="75"
                x2="50"
                y2="95"
                stroke={showGradient ? "url(#kiteGradient2)" : "currentColor"}
                strokeWidth="2"
                strokeLinecap="round"
                className={!showGradient ? "text-primary" : ""}
            />

            {/* String bows */}
            <circle cx="48" cy="82" r="2" fill={showGradient ? "#FF6B35" : "currentColor"} className={!showGradient ? "text-primary" : ""} />
            <circle cx="52" cy="86" r="2" fill={showGradient ? "#FF6B35" : "currentColor"} className={!showGradient ? "text-primary" : ""} />
            <circle cx="48" cy="90" r="2" fill={showGradient ? "#FF6B35" : "currentColor"} className={!showGradient ? "text-primary" : ""} />
        </svg>
    );
}
