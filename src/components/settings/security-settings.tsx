"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { Lock, Key, Smartphone, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

interface Session {
    id: string;
    deviceName: string;
    location: string;
    lastActive: Date;
    isCurrent: boolean;
}

export function SecuritySettings() {
    const { user } = useAuthStore();
    const [passcodeEnabled, setPasscodeEnabled] = useState(false);
    const [passcode, setPasscode] = useState("");
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.twoFactorEnabled || false);
    const [sessions, setSessions] = useState<Session[]>([]);

    useEffect(() => {
        // Fetch active sessions
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        // Mock sessions for now
        setSessions([
            {
                id: "1",
                deviceName: "Windows PC",
                location: "India",
                lastActive: new Date(),
                isCurrent: true
            }
        ]);
    };

    const handleSetPasscode = () => {
        if (passcode.length >= 4) {
            setPasscodeEnabled(true);
            // Save to local storage or backend
            localStorage.setItem('appPasscode', passcode);
            toast.success("Passcode set successfully");
            setPasscode("");
        } else {
            toast.error("Passcode must be at least 4 digits");
        }
    };

    const handleEnable2FA = async () => {
        try {
            const response = await fetch('/api/auth/enable-2fa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user?.id })
            });

            if (response.ok) {
                setTwoFactorEnabled(true);
                toast.success("2FA enabled successfully");
            }
        } catch (error) {
            toast.error("Failed to enable 2FA");
        }
    };

    const handleLogoutSession = async (sessionId: string) => {
        setSessions(sessions.filter(s => s.id !== sessionId));
        toast.success("Session terminated");
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <Lock className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">Security Settings</h2>
            </div>

            {/* Passcode Lock */}
            <div className="border rounded-lg p-4 dark:border-gray-700 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-medium flex items-center gap-2">
                            <Key className="w-4 h-4" />
                            Passcode Lock
                        </h3>
                        <p className="text-sm text-gray-500">Lock app with PIN or password</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={passcodeEnabled}
                            onChange={(e) => setPasscodeEnabled(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>

                {passcodeEnabled && !localStorage.getItem('appPasscode') && (
                    <div className="flex gap-2">
                        <Input
                            type="password"
                            placeholder="Enter 4-digit PIN"
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                            maxLength={6}
                        />
                        <Button onClick={handleSetPasscode}>Set</Button>
                    </div>
                )}
            </div>

            {/* Two-Factor Authentication */}
            <div className="border rounded-lg p-4 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-medium">Two-Step Verification</h3>
                        <p className="text-sm text-gray-500">Add extra security with password</p>
                    </div>
                    <Button
                        variant={twoFactorEnabled ? "outline" : "default"}
                        onClick={handleEnable2FA}
                        disabled={twoFactorEnabled}
                    >
                        {twoFactorEnabled ? "Enabled" : "Enable"}
                    </Button>
                </div>
            </div>

            {/* Active Sessions */}
            <div className="space-y-3">
                <h3 className="font-medium flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    Active Sessions
                </h3>
                <div className="space-y-2">
                    {sessions.map((session) => (
                        <div
                            key={session.id}
                            className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700"
                        >
                            <div>
                                <div className="font-medium flex items-center gap-2">
                                    {session.deviceName}
                                    {session.isCurrent && (
                                        <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">
                                            Current
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {session.location} • Active {session.lastActive.toLocaleTimeString()}
                                </div>
                            </div>
                            {!session.isCurrent && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleLogoutSession(session.id)}
                                >
                                    <LogOut className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <Button variant="outline" className="w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                Logout All Other Sessions
            </Button>
        </div>
    );
}
