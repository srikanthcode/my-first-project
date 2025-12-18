"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mic,
    MicOff,
    Play,
    Pause,
    Trash2,
    Send,
    X,
} from "lucide-react";

interface VoiceRecorderProps {
    onSend: (audioBlob: Blob, duration: number) => void;
    onCancel: () => void;
}

export function VoiceRecorder({ onSend, onCancel }: VoiceRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackTime, setPlaybackTime] = useState(0);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        };
    }, [audioUrl]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: "audio/webm" });
                setAudioBlob(blob);
                setAudioUrl(URL.createObjectURL(blob));
                stream.getTracks().forEach((track) => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setRecordingTime(0);

            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
    };

    const cancelRecording = () => {
        if (isRecording) {
            mediaRecorderRef.current?.stop();
            setIsRecording(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
        setAudioBlob(null);
        setAudioUrl(null);
        setRecordingTime(0);
        onCancel();
    };

    const togglePlayback = () => {
        if (!audioRef.current || !audioUrl) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSend = () => {
        if (audioBlob) {
            onSend(audioBlob, recordingTime);
            setAudioBlob(null);
            setAudioUrl(null);
            setRecordingTime(0);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-full left-0 right-0 mb-2 mx-4"
        >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-4">
                {!audioUrl ? (
                    // Recording state
                    <div className="flex items-center gap-4">
                        <button
                            onClick={cancelRecording}
                            className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>

                        <div className="flex-1 flex items-center gap-3">
                            {/* Waveform visualization */}
                            <div className="flex-1 flex items-center justify-center gap-1 h-8">
                                {isRecording && (
                                    <>
                                        {[...Array(20)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="w-1 bg-gradient-to-t from-teal-500 to-green-500 rounded-full"
                                                animate={{
                                                    height: isRecording
                                                        ? [4, Math.random() * 24 + 8, 4]
                                                        : 4,
                                                }}
                                                transition={{
                                                    duration: 0.3,
                                                    repeat: Infinity,
                                                    delay: i * 0.05,
                                                }}
                                            />
                                        ))}
                                    </>
                                )}
                            </div>

                            <span className="text-sm font-mono font-medium text-gray-600 dark:text-gray-300 w-12">
                                {formatTime(recordingTime)}
                            </span>
                        </div>

                        {/* Recording indicator */}
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="w-3 h-3 rounded-full bg-red-500"
                        />

                        <button
                            onClick={stopRecording}
                            className="p-3 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-full shadow-lg shadow-teal-500/30"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                ) : (
                    // Preview state
                    <div className="flex items-center gap-4">
                        <button
                            onClick={cancelRecording}
                            className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>

                        <button
                            onClick={togglePlayback}
                            className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full"
                        >
                            {isPlaying ? (
                                <Pause className="w-5 h-5 text-teal-500" />
                            ) : (
                                <Play className="w-5 h-5 text-teal-500" />
                            )}
                        </button>

                        <div className="flex-1">
                            {/* Playback progress */}
                            <div className="h-1 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-teal-500 to-green-500"
                                    animate={{
                                        width: isPlaying ? "100%" : `${(playbackTime / recordingTime) * 100}%`,
                                    }}
                                    transition={{
                                        duration: isPlaying ? recordingTime - playbackTime : 0,
                                    }}
                                />
                            </div>
                        </div>

                        <span className="text-sm font-mono font-medium text-gray-600 dark:text-gray-300">
                            {formatTime(recordingTime)}
                        </span>

                        <button
                            onClick={handleSend}
                            className="p-3 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-full shadow-lg shadow-teal-500/30"
                        >
                            <Send className="w-5 h-5" />
                        </button>

                        <audio
                            ref={audioRef}
                            src={audioUrl}
                            onEnded={() => setIsPlaying(false)}
                            onTimeUpdate={(e) =>
                                setPlaybackTime(Math.floor(e.currentTarget.currentTime))
                            }
                        />
                    </div>
                )}
            </div>
        </motion.div>
    );
}

interface VoiceNotePlayerProps {
    audioUrl: string;
    duration: number;
    isOwn?: boolean;
}

export function VoiceNotePlayer({ audioUrl, duration, isOwn = false }: VoiceNotePlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const togglePlayback = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className={`flex items-center gap-3 min-w-[200px] ${isOwn ? "" : ""}`}>
            <button
                onClick={togglePlayback}
                className={`p-2 rounded-full ${isOwn
                        ? "bg-white/20 hover:bg-white/30"
                        : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                    } transition-colors`}
            >
                {isPlaying ? (
                    <Pause className={`w-4 h-4 ${isOwn ? "text-white" : "text-teal-500"}`} />
                ) : (
                    <Play className={`w-4 h-4 ${isOwn ? "text-white" : "text-teal-500"}`} />
                )}
            </button>

            <div className="flex-1 flex flex-col gap-1">
                {/* Waveform placeholder */}
                <div className="flex items-center gap-0.5 h-4">
                    {[...Array(25)].map((_, i) => (
                        <div
                            key={i}
                            className={`w-1 rounded-full ${i < (progress / 100) * 25
                                    ? isOwn
                                        ? "bg-white"
                                        : "bg-teal-500"
                                    : isOwn
                                        ? "bg-white/40"
                                        : "bg-gray-300 dark:bg-gray-600"
                                }`}
                            style={{
                                height: `${Math.random() * 12 + 4}px`,
                            }}
                        />
                    ))}
                </div>

                <span
                    className={`text-xs ${isOwn ? "text-white/70" : "text-gray-500 dark:text-gray-400"
                        }`}
                >
                    {formatTime(isPlaying ? currentTime : duration)}
                </span>
            </div>

            <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={() => {
                    setIsPlaying(false);
                    setCurrentTime(0);
                }}
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            />
        </div>
    );
}
