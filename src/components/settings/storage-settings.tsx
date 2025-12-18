"use client";

import { useState, useEffect } from "react";
import { HardDrive, Trash2, Download, Image as ImageIcon, Video, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface StorageStats {
    totalSize: number;
    images: number;
    videos: number;
    documents: number;
    audio: number;
}

export function StorageSettings() {
    const [stats, setStats] = useState<StorageStats>({
        totalSize: 0,
        images: 0,
        videos: 0,
        documents: 0,
        audio: 0
    });
    const [autoDownload, setAutoDownload] = useState({
        photos: true,
        videos: false,
        documents: false
    });

    useEffect(() => {
        calculateStorage();
    }, []);

    const calculateStorage = () => {
        // Mock storage calculation
        setStats({
            totalSize: 452 * 1024 * 1024, // 452 MB
            images: 125 * 1024 * 1024,
            videos: 250 * 1024 * 1024,
            documents: 65 * 1024 * 1024,
            audio: 12 * 1024 * 1024
        });
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const handleClearCache = () => {
        toast.success("Cache cleared successfully");
        calculateStorage();
    };

    const handleDeleteMedia = (type: string) => {
        toast.success(`${type} deleted successfully`);
        calculateStorage();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <HardDrive className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">Storage & Data</h2>
            </div>

            {/* Storage Usage */}
            <div className="border rounded-lg p-4 dark:border-gray-700 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-medium">Storage Usage</h3>
                    <span className="text-lg font-semibold">{formatBytes(stats.totalSize)}</span>
                </div>

                {/* Storage Breakdown */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                        <div className="flex items-center gap-3">
                            <ImageIcon className="w-5 h-5 text-blue-500" />
                            <span>Photos</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500">{formatBytes(stats.images)}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteMedia('Photos')}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                        <div className="flex items-center gap-3">
                            <Video className="w-5 h-5 text-purple-500" />
                            <span>Videos</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500">{formatBytes(stats.videos)}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteMedia('Videos')}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                        <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-green-500" />
                            <span>Documents</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500">{formatBytes(stats.documents)}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteMedia('Documents')}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Auto-Download */}
            <div className="space-y-3">
                <h3 className="font-medium flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Auto-Download Media
                </h3>

                <div className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
                    <span>Photos</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={autoDownload.photos}
                            onChange={(e) => setAutoDownload({ ...autoDownload, photos: e.target.checked })}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
                    <span>Videos</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={autoDownload.videos}
                            onChange={(e) => setAutoDownload({ ...autoDownload, videos: e.target.checked })}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
                    <span>Documents</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={autoDownload.documents}
                            onChange={(e) => setAutoDownload({ ...autoDownload, documents: e.target.checked })}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>
            </div>

            <Button
                variant="destructive"
                className="w-full"
                onClick={handleClearCache}
            >
                Clear All Cache
            </Button>
        </div>
    );
}
