"use client";

import { useEffect, useRef, useState } from "react";
import { useCallStore } from "@/store/call-store";
import { useAuthStore } from "@/store/auth-store";
import { useSocket } from "@/hooks/useSocket";
import { Button } from "@/components/ui/button";
import {
    Mic, MicOff, Video, VideoOff, PhoneOff,
    Monitor, Minimize2, Maximize2, Users, Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

interface Peer {
    peerId: string; // The other user's ID
    connection: RTCPeerConnection;
    stream?: MediaStream;
}

export function GroupCallScreen() {
    const { currentCall, isMinimized, toggleMinimize, endCall } = useCallStore();
    const { user } = useAuthStore();
    const { socket } = useSocket();

    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [peers, setPeers] = useState<Map<string, Peer>>(new Map());
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);

    const localVideoRef = useRef<HTMLVideoElement>(null);

    // WebRTC Configuration
    const rtcConfig = {
        iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:global.stun.twilio.com:3478" }
        ]
    };

    // 1. Initialize Local Stream
    useEffect(() => {
        if (!currentCall) return;

        const startLocalStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });
                setLocalStream(stream);
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing media devices:", err);
                toast.error("Could not access camera/microphone");
            }
        };

        startLocalStream();

        return () => {
            localStream?.getTracks().forEach(track => track.stop());
        };
    }, [currentCall?.id]); // Restart if call ID changes (new call)

    // 2. Socket & WebRTC Logic
    useEffect(() => {
        if (!currentCall || !socket || !user || !localStream) return;

        const chatId = currentCall.groupId || currentCall.receiverId;
        // Note: receiverId acts as chatId for DMs, groupId for Groups. 
        // Assuming currentCall.groupId is set for group calls.

        if (!chatId) return;

        // Helper to create a peer connection
        const createPeer = (targetUserId: string, initiator: boolean) => {
            const pc = new RTCPeerConnection(rtcConfig);

            // Add local tracks
            localStream.getTracks().forEach(track => {
                pc.addTrack(track, localStream);
            });

            // Handle ICE candidates
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit('voice-chat:signal', {
                        toSocketId: targetUserId, // Wait, we need socketId? 
                        // My socket-server expected 'toSocketId'. 
                        // BUT, usually we map UserId -> SocketId on server or use Room broadcast.
                        // My server 'voice-chat:signal' uses 'toSocketId'.
                        // The 'voice-chat:user-joined' event delivers 'socketId'.
                        // So I need to store socketId in peers map.
                        signal: { type: 'candidate', candidate: event.candidate }
                    });
                }
            };

            // Handle Remote Stream
            pc.ontrack = (event) => {
                setPeers(prev => {
                    const newPeers = new Map(prev);
                    const peer = newPeers.get(targetUserId); // using socketId as key?
                    if (peer) {
                        peer.stream = event.streams[0];
                        newPeers.set(targetUserId, peer);
                    }
                    return newPeers;
                });
            };

            return pc;
        };

        // EVENT: Existing Users (Received after Join)
        // usersInRoom is Array<string> (SocketIDs)
        socket.on('voice-chat:existing-users', async (usersInRoom: string[]) => {
            const newPeers = new Map<string, Peer>();

            for (const targetSocketId of usersInRoom) {
                if (targetSocketId === socket.id) continue;

                const pc = createPeer(targetSocketId, true);
                newPeers.set(targetSocketId, { peerId: targetSocketId, connection: pc! });

                // Create Offer
                const offer = await pc!.createOffer();
                await pc!.setLocalDescription(offer);

                socket.emit('voice-chat:signal', {
                    toSocketId: targetSocketId,
                    signal: { type: 'offer', sdp: offer }
                });
            }
            setPeers(prev => new Map([...prev, ...newPeers]));
        });

        // EVENT: User Joined (We are existing, they are new)
        socket.on('voice-chat:user-joined', (data: { userId: string, socketId: string }) => {
            // We wait for their Offer. Just invoke createPeer to be ready.
            const pc = createPeer(data.socketId, false);
            setPeers(prev => new Map(prev).set(data.socketId, { peerId: data.socketId, connection: pc! }));
        });

        // EVENT: Signal (Offer/Answer/Candidate)
        socket.on('voice-chat:signal', async (data: { signal: any, fromSocketId: string }) => {
            const peer = peers.get(data.fromSocketId);
            let pc = peer?.connection;

            if (!pc) {
                // Should have been created by 'user-joined', but if race condition:
                pc = createPeer(data.fromSocketId, false)!;
                setPeers(prev => new Map(prev).set(data.fromSocketId, { peerId: data.fromSocketId, connection: pc! }));
            }

            if (data.signal.type === 'offer') {
                await pc.setRemoteDescription(new RTCSessionDescription(data.signal.sdp));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.emit('voice-chat:signal', {
                    toSocketId: data.fromSocketId,
                    signal: { type: 'answer', sdp: answer }
                });
            } else if (data.signal.type === 'answer') {
                await pc.setRemoteDescription(new RTCSessionDescription(data.signal.sdp));
            } else if (data.signal.type === 'candidate') {
                await pc.addIceCandidate(new RTCIceCandidate(data.signal.candidate));
            }
        });

        // EVENT: User Left
        socket.on('voice-chat:user-left', (data: { socketId: string }) => {
            setPeers(prev => {
                const newPeers = new Map(prev);
                const peer = newPeers.get(data.socketId);
                peer?.connection.close();
                newPeers.delete(data.socketId);
                return newPeers;
            });
        });

        // Join the room
        socket.emit('voice-chat:join', { chatId, userId: user.id });

        return () => {
            socket.emit('voice-chat:leave', { chatId });
            socket.off('voice-chat:existing-users');
            socket.off('voice-chat:user-joined');
            socket.off('voice-chat:signal');
            socket.off('voice-chat:user-left');

            peers.forEach(p => p.connection.close());
            setPeers(new Map());
        };
    }, [currentCall, socket, user, localStream]);


    // Toggle Mute/Video Handlers (Local Only for now)
    const handleToggleMute = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
            setIsMuted(!isMuted);
        }
    };

    const handleToggleVideo = () => {
        if (localStream) {
            localStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
            setIsVideoOff(!isVideoOff);
        }
    };

    if (!currentCall) return null;

    // Mini View (PiP)
    if (isMinimized) {
        return (
            <div className="fixed top-20 right-4 w-48 h-32 bg-gray-900 rounded-lg shadow-xl overflow-hidden z-50 border border-gray-700">
                <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 flex gap-1">
                    <Button
                        variant="ghost"
                        className="h-6 w-6 p-0 text-white bg-black/50 hover:bg-black/70"
                        onClick={toggleMinimize}
                    >
                        <Maximize2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        );
    }

    // Full Screen Grid View
    return (
        <div className="fixed inset-0 z-50 bg-[#0f0f0f] text-white flex flex-col">
            {/* Header */}
            <div className="p-4 flex items-center justify-between bg-black/20 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Users className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-lg">{currentCall.isGroupCall ? "Group Call" : "Voice Chat"}</h2>
                        <p className="text-sm text-gray-400">{peers.size + 1} Participants</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" className="w-10 h-10 p-0" onClick={toggleMinimize}>
                        <Minimize2 className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Video Grid */}
            <div className="flex-1 p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto">
                {/* Me */}
                <div className="relative aspect-video bg-gray-800 rounded-xl overflow-hidden ring-2 ring-teal-500/50">
                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 text-xs bg-black/50 px-2 py-1 rounded text-white font-medium">
                        You {isMuted && '(Muted)'}
                    </div>
                </div>

                {/* Peers */}
                {Array.from(peers.values()).map(peer => (
                    <PeerVideo key={peer.peerId} peer={peer} />
                ))}
            </div>

            {/* Footer Controls */}
            <div className="p-6 bg-black/40 backdrop-blur-md flex justify-center gap-4">
                <Button
                    size="lg"
                    variant={isMuted ? "destructive" : "secondary"}
                    className="rounded-full w-14 h-14 p-0 shadow-lg"
                    onClick={handleToggleMute}
                >
                    {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </Button>
                <Button
                    size="lg"
                    variant={isVideoOff ? "destructive" : "secondary"}
                    className="rounded-full w-14 h-14 p-0 shadow-lg"
                    onClick={handleToggleVideo}
                >
                    {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                </Button>
                <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full w-14 h-14 p-0 border-gray-600 hover:bg-white/10"
                    onClick={() => { /* Screen Share Logic */ }}
                >
                    <Monitor className="w-6 h-6" />
                </Button>
                <Button
                    size="lg"
                    variant="destructive"
                    className="rounded-full w-16 h-14 px-6 shadow-lg bg-red-600 hover:bg-red-700"
                    onClick={endCall}
                >
                    <PhoneOff className="w-6 h-6" />
                </Button>
            </div>
        </div>
    );
}

// Sub-component for Peer Video to handle its own ref/stream
function PeerVideo({ peer }: { peer: Peer }) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && peer.stream) {
            videoRef.current.srcObject = peer.stream;
        }
    }, [peer.stream]);

    return (
        <div className="relative aspect-video bg-gray-800 rounded-xl overflow-hidden">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
            />
            {/* Audio Indicator could go here */}
        </div>
    );
}
