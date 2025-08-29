import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Heart, Share2, MessageCircle, Volume2, VolumeX } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { Reel } from '@shared/schema';

export function ReelsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const { data: reels = [], isLoading } = useQuery<Reel[]>({
    queryKey: ['/api/v1/reels'],
  });

  const likeMutation = useMutation({
    mutationFn: async (reelId: string) => {
      return apiRequest('POST', `/api/v1/reels/${reelId}/like`);
    },
  });

  const incrementViewMutation = useMutation({
    mutationFn: async (reelId: string) => {
      return apiRequest('POST', `/api/v1/reels/${reelId}/view`);
    },
  });

  useEffect(() => {
    if (reels.length > 0) {
      // Increment view count for current reel
      incrementViewMutation.mutate(reels[currentIndex]?.id);
    }
  }, [currentIndex, reels]);

  useEffect(() => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      if (isPlaying) {
        currentVideo.play();
      } else {
        currentVideo.pause();
      }
      currentVideo.muted = isMuted;
    }
  }, [currentIndex, isPlaying, isMuted]);

  const handleSwipe = (direction: 'up' | 'down') => {
    if (direction === 'up' && currentIndex < reels.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (direction === 'down' && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleLike = (reelId: string) => {
    likeMutation.mutate(reelId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen spiritual-gradient flex items-center justify-center">
        <div className="glass-card p-8 rounded-2xl">
          <div className="text-foreground font-medium">Loading reels...</div>
          <div className="w-full bg-border rounded-full h-2 mt-4 overflow-hidden">
            <div className="sakura-glow h-full rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="min-h-screen spiritual-gradient flex items-center justify-center">
        <div className="glass-card p-8 rounded-2xl text-center">
          <h2 className="text-2xl font-bold mb-4 text-foreground">No Reels Available</h2>
          <p className="text-muted-foreground">Check back later for devotional content</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen spiritual-gradient relative overflow-hidden flex items-center justify-center">
      <div className="max-w-md w-full h-full">
        <AnimatePresence>
          <motion.div
            key={currentIndex}
            className="absolute inset-0"
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="relative h-full w-full flex items-center justify-center bg-gradient-to-b from-black/50 to-black/80">
            {/* Video */}
            <video
              ref={(el) => (videoRefs.current[currentIndex] = el)}
              src={reels[currentIndex]?.videoUrl}
              className="h-full w-full object-cover"
              loop
              playsInline
              autoPlay
              onEnded={() => handleSwipe('up')}
              onClick={() => setIsPlaying(!isPlaying)}
              data-testid={`reel-video-${currentIndex}`}
            />

            {/* Overlay Controls */}
            <div className="absolute inset-0 flex">
              {/* Left side - tap to go back */}
              <div 
                className="flex-1 flex items-center justify-start pl-4"
                onClick={() => handleSwipe('down')}
              >
                {!isPlaying && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-black/50 rounded-full p-4"
                  >
                    <Play className="h-12 w-12 text-white" fill="white" />
                  </motion.div>
                )}
              </div>

              {/* Right side - actions */}
              <div className="absolute right-4 bottom-20 flex flex-col space-y-6">
                {/* Like */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleLike(reels[currentIndex]?.id)}
                  className="flex flex-col items-center"
                  data-testid={`like-button-${currentIndex}`}
                >
                  <div className="bg-white/20 rounded-full p-3">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-white text-xs mt-1">{reels[currentIndex]?.likes}</span>
                </motion.button>

                {/* Comment */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center"
                >
                  <div className="bg-white/20 rounded-full p-3">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-white text-xs mt-1">0</span>
                </motion.button>

                {/* Share */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center"
                >
                  <div className="bg-white/20 rounded-full p-3">
                    <Share2 className="h-6 w-6 text-white" />
                  </div>
                </motion.button>

                {/* Volume */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMuted(!isMuted)}
                  className="flex flex-col items-center"
                  data-testid="volume-toggle"
                >
                  <div className="bg-white/20 rounded-full p-3">
                    {isMuted ? (
                      <VolumeX className="h-6 w-6 text-white" />
                    ) : (
                      <Volume2 className="h-6 w-6 text-white" />
                    )}
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Content Info */}
            <div className="absolute bottom-4 left-4 right-20">
              <h3 className="text-white font-semibold text-lg mb-2">{reels[currentIndex]?.title}</h3>
              {reels[currentIndex]?.description && (
                <p className="text-white/80 text-sm">{reels[currentIndex]?.description}</p>
              )}
              <div className="flex items-center mt-2 space-x-4">
                <span className="text-white/60 text-xs">{reels[currentIndex]?.views} views</span>
                {reels[currentIndex]?.duration && (
                  <span className="text-white/60 text-xs">
                    {Math.floor(reels[currentIndex].duration / 60)}:{(reels[currentIndex].duration % 60).toString().padStart(2, '0')}
                  </span>
                )}
              </div>
            </div>

            {/* Swipe indicators */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <div className="flex flex-col space-y-2">
                {reels.map((_: any, idx: number) => (
                  <div
                    key={idx}
                    className={`w-1 h-8 rounded-full ${
                      idx === currentIndex ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      </div>
    </div>
  );
}