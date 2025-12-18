'use client';

import dynamic from 'next/dynamic';

//Dynamic import to avoid SSR issues with emoji-picker-react
const Picker = dynamic(() => import('emoji-picker-react'), {
    ssr: false,
    loading: () => <div className="w-80 h-96 bg-[var(--sidebar-bg)] rounded-lg animate-pulse" />,
});

interface EmojiPickerProps {
    onEmojiClick: (emoji: string) => void;
    theme?: 'light' | 'dark';
}

export default function EmojiPicker({ onEmojiClick, theme = 'light' }: EmojiPickerProps) {
    return (
        <div className="emoji-picker-container">
            <Picker
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onEmojiClick={(emojiData: any) => onEmojiClick(emojiData.emoji)}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                theme={theme as any}
                width="100%"
                height={400}
                previewConfig={{ showPreview: false }}
            />
        </div>
    );
}
