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
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white">Loading reels...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <AnimatePresence mode="wait">
        {reels.map((reel: Reel, index: number) => (
          <motion.div
            key={reel.id}
            className={`absolute inset-0 ${index === currentIndex ? 'z-10' : 'z-0'}`}
            initial={{ y: index > currentIndex ? '100%' : '-100%' }}
            animate={{ y: index === currentIndex ? '0%' : index > currentIndex ? '100%' : '-100%' }}
            exit={{ y: index > currentIndex ? '100%' : '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="relative h-full w-full flex items-center justify-center bg-black">
              {/* Video */}
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                src={reel.videoUrl}
                className="h-full w-full object-cover"
                loop
                playsInline
                preload={Math.abs(index - currentIndex) <= 1 ? 'metadata' : 'none'}
                onEnded={() => handleSwipe('up')}
                onClick={() => setIsPlaying(!isPlaying)}
                data-testid={`reel-video-${index}`}
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
                    onClick={() => handleLike(reel.id)}
                    className="flex flex-col items-center"
                    data-testid={`like-button-${index}`}
                  >
                    <div className="bg-white/20 rounded-full p-3">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-white text-xs mt-1">{reel.likes}</span>
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
                <h3 className="text-white font-semibold text-lg mb-2">{reel.title}</h3>
                {reel.description && (
                  <p className="text-white/80 text-sm">{reel.description}</p>
                )}
                <div className="flex items-center mt-2 space-x-4">
                  <span className="text-white/60 text-xs">{reel.views} views</span>
                  {reel.duration && (
                    <span className="text-white/60 text-xs">
                      {Math.floor(reel.duration / 60)}:{(reel.duration % 60).toString().padStart(2, '0')}
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
        ))}
      </AnimatePresence>

      {/* Swipe hint */}
      {reels.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">No Reels Available</h2>
            <p className="text-white/70">Check back later for devotional content</p>
          </div>
        </div>
      )}
    </div>
  );
}