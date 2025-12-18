"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Phone,
    PhoneOff,
    Video,
    VideoOff,
    Mic,
    MicOff,
    Volume2,
    VolumeX,
    MoreVertical,
    MessageSquare,
    Users,
    Minimize2,
    Maximize2,
    X,
    FlipHorizontal2,
    ScreenShare,
} from "lucide-react";
import Image from "next/image";

interface CallScreenProps {
    isOpen: boolean;
    onClose: () => void;
    callType: "audio" | "video";
    caller: {
        name: string;
        avatar: string;
        phone?: string;
    };
    isIncoming?: boolean;
    isGroupCall?: boolean;
    participants?: Array<{
        id: string;
        name: string;
        avatar: string;
        isMuted?: boolean;
        isVideoOff?: boolean;
    }>;
}

export function CallScreen({
    isOpen,
    onClose,
    callType,
    caller,
    isIncoming = false,
    isGroupCall = false,
    participants = [],
}: CallScreenProps) {
    const [callStatus, setCallStatus] = useState<"ringing" | "connecting" | "connected" | "ended">(
        isIncoming ? "ringing" : "connecting"
    );
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoEnabled, setIsVideoEnabled] = useState(callType === "video");
    const [isSpeakerOn, setIsSpeakerOn] = useState(true);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Simulate call connection
    useEffect(() => {
        if (!isOpen) return;

        if (callStatus === "connecting") {
            const timer = setTimeout(() => {
                setCallStatus("connected");
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, callStatus]);

    // Call duration timer
    useEffect(() => {
        if (callStatus !== "connected") return;

        const interval = setInterval(() => {
            setCallDuration((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [callStatus]);

    // Format duration
    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const handleAcceptCall = () => {
        setCallStatus("connecting");
    };

    const handleEndCall = () => {
        setCallStatus("ended");
        setTimeout(onClose, 1000);
    };

    const handleRejectCall = () => {
        setCallStatus("ended");
        setTimeout(onClose, 500);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`fixed inset-0 z-50 ${isFullScreen ? "" : "p-4 flex items-center justify-center"
                    }`}
                onClick={() => setShowControls(!showControls)}
            >
                {/* Background */}
                <div
                    className={`absolute inset-0 ${callType === "video" && callStatus === "connected"
                            ? "bg-black"
                            : "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
                        }`}
                />

                {/* Main Content */}
                <motion.div
                    className={`relative ${isFullScreen ? "w-full h-full" : "w-full max-w-lg rounded-3xl overflow-hidden"
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Video Call - Remote Video */}
                    {callType === "video" && callStatus === "connected" && (
                        <div className="absolute inset-0 bg-gray-900">
                            {/* Placeholder for remote video */}
                            <div className="w-full h-full flex items-center justify-center">
                                <Image
                                    src={caller.avatar}
                                    alt={caller.name}
                                    fill
                                    className="object-cover opacity-30"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center text-white">
                                        <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden ring-4 ring-white/20">
                                            <Image
                                                src={caller.avatar}
                                                alt={caller.name}
                                                width={128}
                                                height={128}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <h2 className="text-2xl font-semibold">{caller.name}</h2>
                                        <p className="text-white/60 mt-1">{formatDuration(callDuration)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Self View */}
                            {isVideoEnabled && (
                                <motion.div
                                    drag
                                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                    className="absolute bottom-24 right-4 w-32 h-44 rounded-2xl overflow-hidden bg-gray-800 shadow-2xl border-2 border-white/20"
                                >
                                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                        <Video className="w-8 h-8 text-white/40" />
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}

                    {/* Audio Call UI */}
                    {(callType === "audio" || callStatus !== "connected") && (
                        <div className="p-8 flex flex-col items-center justify-center min-h-[500px]">
                            {/* Caller Info */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center"
                            >
                                {/* Avatar with Ring Animation */}
                                <div className="relative mx-auto mb-6">
                                    {callStatus === "ringing" && (
                                        <>
                                            <motion.div
                                                className="absolute inset-0 rounded-full bg-teal-500/30"
                                                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                            />
                                            <motion.div
                                                className="absolute inset-0 rounded-full bg-teal-500/30"
                                                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                                                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                                            />
                                        </>
                                    )}
                                    <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white/20 relative">
                                        <Image
                                            src={caller.avatar}
                                            alt={caller.name}
                                            width={128}
                                            height={128}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                <h2 className="text-2xl font-semibold text-white mb-1">
                                    {caller.name}
                                </h2>
                                <p className="text-white/60">
                                    {callStatus === "ringing" && (isIncoming ? "Incoming call..." : "Calling...")}
                                    {callStatus === "connecting" && "Connecting..."}
                                    {callStatus === "connected" && formatDuration(callDuration)}
                                    {callStatus === "ended" && "Call ended"}
                                </p>

                                {/* Call Type Indicator */}
                                <div className="flex items-center justify-center gap-2 mt-4">
                                    {callType === "video" ? (
                                        <Video className="w-5 h-5 text-teal-400" />
                                    ) : (
                                        <Phone className="w-5 h-5 text-teal-400" />
                                    )}
                                    <span className="text-sm text-white/60">
                                        {callType === "video" ? "Video Call" : "Voice Call"}
                                        {isGroupCall && ` • ${participants.length + 1} participants`}
                                    </span>
                                </div>
                            </motion.div>

                            {/* Group Participants */}
                            {isGroupCall && participants.length > 0 && (
                                <div className="flex -space-x-3 mt-6">
                                    {participants.slice(0, 4).map((p) => (
                                        <div
                                            key={p.id}
                                            className="w-10 h-10 rounded-full border-2 border-gray-900 overflow-hidden"
                                        >
                                            <Image
                                                src={p.avatar}
                                                alt={p.name}
                                                width={40}
                                                height={40}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                    {participants.length > 4 && (
                                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm font-medium border-2 border-gray-900">
                                            +{participants.length - 4}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Controls */}
                    <AnimatePresence>
                        {showControls && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="absolute bottom-0 left-0 right-0 p-6"
                            >
                                {/* Ringing Controls (Incoming Call) */}
                                {callStatus === "ringing" && isIncoming && (
                                    <div className="flex justify-center gap-12">
                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            onClick={handleRejectCall}
                                            className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30"
                                        >
                                            <PhoneOff className="w-7 h-7 text-white" />
                                        </motion.button>
                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            onClick={handleAcceptCall}
                                            className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30"
                                        >
                                            {callType === "video" ? (
                                                <Video className="w-7 h-7 text-white" />
                                            ) : (
                                                <Phone className="w-7 h-7 text-white" />
                                            )}
                                        </motion.button>
                                    </div>
                                )}

                                {/* In-Call Controls */}
                                {(callStatus === "connecting" || callStatus === "connected") && (
                                    <div className="bg-black/30 backdrop-blur-lg rounded-full p-4">
                                        <div className="flex items-center justify-center gap-4">
                                            {/* Mute */}
                                            <motion.button
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setIsMuted(!isMuted)}
                                                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isMuted ? "bg-red-500" : "bg-white/20 hover:bg-white/30"
                                                    }`}
                                            >
                                                {isMuted ? (
                                                    <MicOff className="w-5 h-5 text-white" />
                                                ) : (
                                                    <Mic className="w-5 h-5 text-white" />
                                                )}
                                            </motion.button>

                                            {/* Speaker */}
                                            <motion.button
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                                                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${!isSpeakerOn ? "bg-red-500" : "bg-white/20 hover:bg-white/30"
                                                    }`}
                                            >
                                                {isSpeakerOn ? (
                                                    <Volume2 className="w-5 h-5 text-white" />
                                                ) : (
                                                    <VolumeX className="w-5 h-5 text-white" />
                                                )}
                                            </motion.button>

                                            {/* Video Toggle (for video calls) */}
                                            {callType === "video" && (
                                                <motion.button
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                                                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${!isVideoEnabled ? "bg-red-500" : "bg-white/20 hover:bg-white/30"
                                                        }`}
                                                >
                                                    {isVideoEnabled ? (
                                                        <Video className="w-5 h-5 text-white" />
                                                    ) : (
                                                        <VideoOff className="w-5 h-5 text-white" />
                                                    )}
                                                </motion.button>
                                            )}

                                            {/* Flip Camera (Video) */}
                                            {callType === "video" && isVideoEnabled && (
                                                <motion.button
                                                    whileTap={{ scale: 0.9 }}
                                                    className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
                                                >
                                                    <FlipHorizontal2 className="w-5 h-5 text-white" />
                                                </motion.button>
                                            )}

                                            {/* End Call */}
                                            <motion.button
                                                whileTap={{ scale: 0.9 }}
                                                onClick={handleEndCall}
                                                className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30"
                                            >
                                                <PhoneOff className="w-6 h-6 text-white" />
                                            </motion.button>

                                            {/* Chat */}
                                            <motion.button
                                                whileTap={{ scale: 0.9 }}
                                                className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
                                            >
                                                <MessageSquare className="w-5 h-5 text-white" />
                                            </motion.button>

                                            {/* Participants (Group) */}
                                            {isGroupCall && (
                                                <motion.button
                                                    whileTap={{ scale: 0.9 }}
                                                    className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
                                                >
                                                    <Users className="w-5 h-5 text-white" />
                                                </motion.button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Outgoing Ringing - End Call Only */}
                                {callStatus === "ringing" && !isIncoming && (
                                    <div className="flex justify-center">
                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            onClick={handleEndCall}
                                            className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30"
                                        >
                                            <PhoneOff className="w-7 h-7 text-white" />
                                        </motion.button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Minimize/Fullscreen Button */}
                    {callStatus === "connected" && (
                        <button
                            onClick={() => setIsFullScreen(!isFullScreen)}
                            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/30 flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                        >
                            {isFullScreen ? (
                                <Minimize2 className="w-5 h-5" />
                            ) : (
                                <Maximize2 className="w-5 h-5" />
                            )}
                        </button>
                    )}

                    {/* Close Button (when not in call) */}
                    {callStatus === "ended" && (
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/30 flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
