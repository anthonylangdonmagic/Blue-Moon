"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageSquare, Share2, Volume2, VolumeX } from "lucide-react";
import { Comments } from "./Comments";

interface VideoPost {
    id: string;
    title: string | null;
    content: string | null;
    media_url: string;
    allow_comments: boolean;
    slug: string | null;
}

export function VideoFeed({ videos }: { videos: VideoPost[] }) {
    return (
        <div className="fixed inset-0 bg-black z-40 pt-16 md:pt-0">
            <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth">
                {videos.map((video) => (
                    <VideoItem key={video.id} video={video} />
                ))}
            </div>
        </div>
    );
}

function VideoItem({ video }: { video: VideoPost }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [showComments, setShowComments] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    videoRef.current?.play().catch(() => { });
                    setIsPlaying(true);
                } else {
                    videoRef.current?.pause();
                    setIsPlaying(false);
                }
            },
            { threshold: 0.6 }
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (videoRef.current) {
            if (isMuted) {
                videoRef.current.volume = 1.0;
            }
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <div className="h-full w-full snap-center relative flex items-center justify-center bg-black">
            {/* Video Player */}
            <video
                ref={videoRef}
                src={video.media_url}
                className="h-full w-full object-contain md:max-w-md mx-auto"
                loop
                muted={isMuted}
                playsInline
                onClick={togglePlay}
            />

            {/* Overlay Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent md:max-w-md md:mx-auto">
                <div className="flex items-end justify-between">
                    <div className="flex-1 mr-12">
                        <h3 className="text-white font-bold text-lg mb-2">{video.title}</h3>
                        <p className="text-slate-200 text-sm line-clamp-2">{video.content}</p>
                    </div>

                    {/* Side Actions */}
                    <div className="flex flex-col items-center space-y-6 pb-4">
                        <button className="flex flex-col items-center text-white space-y-1">
                            <div className="p-2 bg-slate-800/50 rounded-full">
                                <Heart size={24} />
                            </div>
                            <span className="text-xs">Like</span>
                        </button>

                        <button
                            onClick={() => setShowComments(!showComments)}
                            className="flex flex-col items-center text-white space-y-1"
                        >
                            <div className="p-2 bg-slate-800/50 rounded-full">
                                <MessageSquare size={24} />
                            </div>
                            <span className="text-xs">Chat</span>
                        </button>

                        <button className="flex flex-col items-center text-white space-y-1">
                            <div className="p-2 bg-slate-800/50 rounded-full">
                                <Share2 size={24} />
                            </div>
                            <span className="text-xs">Share</span>
                        </button>

                        <button onClick={toggleMute} className="flex flex-col items-center text-white space-y-1">
                            <div className="p-2 bg-slate-800/50 rounded-full">
                                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                            </div>
                            <span className="text-xs">{isMuted ? "Unmute" : "Mute"}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Comments Drawer */}
            {showComments && (
                <div className="absolute inset-x-0 bottom-0 h-[60vh] bg-slate-900 rounded-t-2xl z-50 p-4 overflow-y-auto md:max-w-md md:mx-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white font-bold">Comments</h3>
                        <button onClick={() => setShowComments(false)} className="text-slate-400">Close</button>
                    </div>
                    <Comments postId={video.id} />
                </div>
            )}
        </div>
    );
}
