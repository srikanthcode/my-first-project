'use client';

import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Search...', className }: SearchBarProps) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div
            className={cn(
                'relative flex items-center bg-[var(--input-bg)] rounded-lg px-3 py-2 transition-all',
                isFocused && 'ring-2 ring-primary/20',
                className
            )}
        >
            <Search size={18} className="text-[var(--icon)] mr-2" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-[var(--icon)]"
            />
            {value && (
                <button
                    onClick={() => onChange('')}
                    className="p-1 hover:bg-[var(--hover)] rounded-full transition"
                >
                    <X size={16} className="text-[var(--icon)]" />
                </button>
            )}
        </div>
    );
}
