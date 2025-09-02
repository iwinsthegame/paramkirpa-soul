import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Flame, Calendar, Star, Heart, RotateCcw, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Diya {
  id: number;
  x: number;
  y: number;
  isLit: boolean;
  prayer?: string;
  emoji?: string;
  lightedAt?: Date;
}

interface TempleStates {
  dailyStreak: number;
  blessingPoints: number;
  lastLitDate?: string;
  totalDiyasLit: number;
}

const emojis = ['🙏', '❤️', '🌟', '🕉️', '🪷', '✨', '💫', '🌺', '🧿', '🔱'];

export function TempleDiya({ className = '' }: { className?: string }) {
  const [diyas, setDiyas] = useState<Diya[]>([]);
  const [gameState, setGameState] = useState<TempleStates>({
    dailyStreak: 0,
    blessingPoints: 0,
    totalDiyasLit: 0
  });
  const [selectedDiya, setSelectedDiya] = useState<Diya | null>(null);
  const [prayerText, setPrayerText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🙏');
  const [showPrayerDialog, setShowPrayerDialog] = useState(false);
  const { toast } = useToast();

  // Initialize diyas in temple formation
  useEffect(() => {
    const newDiyas: Diya[] = [];
    
    // Create temple formation with multiple rows
    const formations = [
      // Front row (7 diyas)
      { count: 7, y: 80, spacing: 50 },
      // Second row (5 diyas)
      { count: 5, y: 60, spacing: 60 },
      // Third row (3 diyas)
      { count: 3, y: 40, spacing: 80 },
      // Top diya (1 diya)
      { count: 1, y: 20, spacing: 100 }
    ];

    let diyaId = 0;
    formations.forEach((formation) => {
      const startX = 50 - ((formation.count - 1) * formation.spacing) / 2;
      for (let i = 0; i < formation.count; i++) {
        newDiyas.push({
          id: diyaId++,
          x: startX + i * formation.spacing,
          y: formation.y,
          isLit: false
        });
      }
    });

    setDiyas(newDiyas);
    
    // Load saved state
    const savedState = localStorage.getItem('templeDiyaState');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      setGameState(parsed);
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('templeDiyaState', JSON.stringify(gameState));
  }, [gameState]);

  const lightDiya = (diyaId: number) => {
    const today = new Date().toDateString();
    const isNewDay = gameState.lastLitDate !== today;
    
    setDiyas(prev => prev.map(diya => {
      if (diya.id === diyaId && !diya.isLit) {
        return {
          ...diya,
          isLit: true,
          lightedAt: new Date()
        };
      }
      return diya;
    }));

    // Update game state
    setGameState(prev => {
      const newState = {
        ...prev,
        blessingPoints: prev.blessingPoints + 10,
        totalDiyasLit: prev.totalDiyasLit + 1,
        lastLitDate: today
      };

      if (isNewDay) {
        newState.dailyStreak = prev.dailyStreak + 1;
        newState.blessingPoints += 50; // Bonus for daily streak
        
        toast({
          title: "Daily Blessing!",
          description: `Day ${newState.dailyStreak} streak! +60 blessing points`,
        });
      } else {
        toast({
          title: "Diya Lit!",
          description: "+10 blessing points",
        });
      }

      return newState;
    });
  };

  const openPrayerDialog = (diya: Diya) => {
    if (diya.isLit) {
      setSelectedDiya(diya);
      setPrayerText(diya.prayer || '');
      setSelectedEmoji(diya.emoji || '🙏');
      setShowPrayerDialog(true);
    }
  };

  const savePrayer = () => {
    if (selectedDiya) {
      setDiyas(prev => prev.map(diya => 
        diya.id === selectedDiya.id 
          ? { ...diya, prayer: prayerText, emoji: selectedEmoji }
          : diya
      ));
      setShowPrayerDialog(false);
      setPrayerText('');
      toast({
        title: "Prayer Added",
        description: "Your prayer has been attached to the diya",
      });
    }
  };

  const resetTemple = () => {
    setDiyas(prev => prev.map(diya => ({
      ...diya,
      isLit: false,
      prayer: undefined,
      emoji: undefined,
      lightedAt: undefined
    })));
    toast({
      title: "Temple Reset",
      description: "All diyas have been extinguished",
    });
  };

  return (
    <div className={`relative ${className}`}>
      <Card className="glass-card">
        <CardContent className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">🏛️ Sacred Temple</h2>
            <p className="text-purple-200">Light the diyas and offer your prayers</p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="glass-card border-orange-400/30">
              <CardContent className="p-4 text-center">
                <Calendar className="h-6 w-6 text-orange-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">{gameState.dailyStreak}</div>
                <div className="text-xs text-orange-200">Day Streak</div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-amber-400/30">
              <CardContent className="p-4 text-center">
                <Star className="h-6 w-6 text-amber-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">{gameState.blessingPoints}</div>
                <div className="text-xs text-amber-200">Blessings</div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-yellow-400/30">
              <CardContent className="p-4 text-center">
                <Flame className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">{gameState.totalDiyasLit}</div>
                <div className="text-xs text-yellow-200">Total Lit</div>
              </CardContent>
            </Card>
          </div>

          {/* Temple Background */}
          <div className="relative w-full h-96 bg-gradient-to-b from-amber-900/20 via-orange-800/30 to-red-900/40 rounded-lg overflow-hidden mb-6 border border-amber-400/30">
            {/* Temple Architecture */}
            <div className="absolute inset-0 bg-gradient-to-t from-amber-900/40 to-transparent">
              {/* Temple pillars */}
              <div className="absolute bottom-0 left-8 w-2 h-32 bg-gradient-to-t from-amber-700 to-amber-500 opacity-60"></div>
              <div className="absolute bottom-0 right-8 w-2 h-32 bg-gradient-to-t from-amber-700 to-amber-500 opacity-60"></div>
              
              {/* Temple dome outline */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-32 h-16 border-t-2 border-amber-400/40 rounded-t-full"></div>
            </div>

            {/* Diyas */}
            {diyas.map((diya) => (
              <div
                key={diya.id}
                className="absolute cursor-pointer"
                style={{
                  left: `${diya.x}%`,
                  bottom: `${diya.y}%`,
                  transform: 'translateX(-50%)'
                }}
                onClick={() => diya.isLit ? openPrayerDialog(diya) : lightDiya(diya.id)}
              >
                {/* Diya Base */}
                <div className="relative">
                  <div className={`w-8 h-6 rounded-full transition-all duration-300 ${
                    diya.isLit 
                      ? 'bg-gradient-to-b from-amber-400 to-orange-600 shadow-lg shadow-orange-500/50' 
                      : 'bg-gradient-to-b from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700'
                  }`}>
                    {/* Flame Animation */}
                    {diya.isLit && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 0.9, 1],
                            rotate: [0, 2, -2, 0]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="text-xl"
                        >
                          🔥
                        </motion.div>
                        
                        {/* Glow effect */}
                        <div className="absolute inset-0 w-8 h-8 -top-2 -left-3 bg-orange-400/30 rounded-full blur-md animate-pulse"></div>
                      </div>
                    )}
                    
                    {/* Diya emoji when not lit */}
                    {!diya.isLit && (
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 text-lg">
                        🪔
                      </div>
                    )}
                  </div>

                  {/* Prayer/Emoji Display */}
                  {diya.isLit && (diya.prayer || diya.emoji) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-center"
                    >
                      <div className="bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm max-w-20 truncate">
                        {diya.emoji} {diya.prayer && diya.prayer.substring(0, 10) + (diya.prayer.length > 10 ? '...' : '')}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            ))}

            {/* Ambient particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-amber-300/60 rounded-full"
                  animate={{
                    y: [0, -100],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeOut"
                  }}
                  style={{
                    left: `${Math.random() * 100}%`,
                    bottom: '10%'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="text-center text-white/80 text-sm mb-4">
            Tap diyas to light them • Tap lit diyas to add prayers
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={resetTemple}
              variant="outline"
              className="border-orange-400/30 text-white hover:bg-orange-600/20"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Temple
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Prayer Dialog */}
      <Dialog open={showPrayerDialog} onOpenChange={setShowPrayerDialog}>
        <DialogContent className="glass-card border-orange-400/30">
          <DialogHeader>
            <DialogTitle className="text-white">Add Prayer to Diya</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Emoji Selection */}
            <div>
              <label className="text-white text-sm mb-2 block">Choose Emoji</label>
              <div className="grid grid-cols-5 gap-2">
                {emojis.map((emoji) => (
                  <Button
                    key={emoji}
                    variant={selectedEmoji === emoji ? "default" : "outline"}
                    className="h-12 text-lg"
                    onClick={() => setSelectedEmoji(emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </div>

            {/* Prayer Text */}
            <div>
              <label className="text-white text-sm mb-2 block">Prayer Text (Optional)</label>
              <Input
                value={prayerText}
                onChange={(e) => setPrayerText(e.target.value)}
                placeholder="Enter your prayer..."
                className="bg-white/5 border-white/20 text-white placeholder-white/50"
                maxLength={50}
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={savePrayer} className="flex-1 bg-orange-600 hover:bg-orange-700">
                Add Prayer
              </Button>
              <Button onClick={() => setShowPrayerDialog(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}