"use client";

import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "@/store/theme-store";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
    const theme = useThemeStore((state) => state.theme);
    const toggleTheme = useThemeStore((state) => state.toggleTheme);

    return (
        <Button
            variant="icon"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
            {theme === "light" ? (
                <Moon className="w-5 h-5" />
            ) : (
                <Sun className="w-5 h-5" />
            )}
        </Button>
    );
}
