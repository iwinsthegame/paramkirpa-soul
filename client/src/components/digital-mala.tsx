import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Award, Sparkles } from 'lucide-react';

interface DigitalMalaProps {
  className?: string;
}

export function DigitalMala({ className = '' }: DigitalMalaProps) {
  const [currentCount, setCurrentCount] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create audio context for chant sound
  const playChantSound = useCallback(() => {
    try {
      // Create a simple audio context for the Om sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Create Om-like sound frequencies
      oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(110, audioContext.currentTime + 0.3);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Audio not available');
    }
  }, []);

  const handleBeadTap = useCallback(() => {
    if (currentCount < 108) {
      const newCount = currentCount + 1;
      setCurrentCount(newCount);
      playChantSound();
      
      if (newCount === 108) {
        setShowCompletion(true);
        setTimeout(() => {
          setShowBadge(true);
        }, 1000);
      }
    }
  }, [currentCount, playChantSound]);

  const resetMala = useCallback(() => {
    setCurrentCount(0);
    setShowCompletion(false);
    setShowBadge(false);
  }, []);

  // Generate 108 beads in a circle
  const beads = Array.from({ length: 108 }, (_, index) => {
    const angle = (index * 360) / 108;
    const radius = 140;
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;
    const isActive = index < currentCount;
    const isCurrent = index === currentCount;
    
    return {
      id: index,
      x,
      y,
      isActive,
      isCurrent,
      angle
    };
  });

  return (
    <div className={`relative ${className}`}>
      <Card className="glass-card">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">🙏 Digital Mala Japa</h2>
            <p className="text-purple-200">ॐ नमः शिवाय</p>
          </div>

          {/* Mala Circle */}
          <div className="relative w-80 h-80 mx-auto mb-6">
            <svg
              width="320"
              height="320"
              viewBox="0 0 320 320"
              className="absolute inset-0"
              style={{ transform: 'rotate(-90deg)' }}
            >
              {beads.map((bead) => (
                <motion.circle
                  key={bead.id}
                  cx={160 + bead.x}
                  cy={160 + bead.y}
                  r={bead.isCurrent ? "6" : "4"}
                  fill={bead.isActive ? "#fbbf24" : bead.isCurrent ? "#f59e0b" : "#64748b"}
                  stroke={bead.isCurrent ? "#ffffff" : "none"}
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-200"
                  animate={{
                    scale: bead.isCurrent ? 1.5 : 1,
                    fill: bead.isActive ? "#fbbf24" : bead.isCurrent ? "#f59e0b" : "#64748b"
                  }}
                  whileHover={{ scale: 1.2 }}
                  onClick={handleBeadTap}
                />
              ))}
            </svg>

            {/* Center Count Display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  className="text-4xl font-bold text-white mb-2"
                  animate={{ scale: currentCount > 0 ? [1, 1.1, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentCount}
                </motion.div>
                <div className="text-purple-200">/ 108</div>
                <div className="mt-2 text-sm text-purple-300">
                  {currentCount === 0 ? 'Tap to begin' : 'Keep chanting...'}
                </div>
              </div>
            </div>

            {/* Tap Area Overlay */}
            <div
              className="absolute inset-0 cursor-pointer rounded-full"
              onClick={handleBeadTap}
              style={{ zIndex: 10 }}
            />
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-purple-800/30 rounded-full h-2 mb-6">
            <motion.div
              className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentCount / 108) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={resetMala}
              variant="outline"
              className="border-purple-400/30 text-white hover:bg-purple-600/20"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Completion Message */}
      <AnimatePresence>
        {showCompletion && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50"
          >
            <Card className="glass-card max-w-md mx-auto">
              <CardContent className="p-6 text-center">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="text-4xl mb-4"
                >
                  🙏
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">साधना पूर्ण</h3>
                <p className="text-purple-200 mb-4">Your spiritual practice is complete!</p>
                <div className="flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ 
                        duration: 1, 
                        repeat: Infinity, 
                        delay: i * 0.2 
                      }}
                    >
                      <Sparkles className="h-4 w-4 text-amber-400" />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Badge Reward Animation */}
      <AnimatePresence>
        {showBadge && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity 
              }}
            >
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 text-lg">
                <Award className="mr-2 h-5 w-5" />
                Japa Master
              </Badge>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}