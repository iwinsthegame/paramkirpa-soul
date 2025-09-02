import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, RefreshCw, Lightbulb, Trophy, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MantraCard {
  id: number;
  content: string;
  type: 'mantra' | 'meaning';
  pairId: number;
  isFlipped: boolean;
  isMatched: boolean;
  emoji?: string;
}

interface GameState {
  score: number;
  level: number;
  streak: number;
  hints: number;
  moves: number;
  matchedPairs: number;
}

// Mantra database with increasing difficulty
const mantraDatabase = [
  // Level 1 - Basic (4 pairs)
  {
    level: 1,
    mantras: [
      {
        pairId: 1,
        mantra: "ॐ नमः शिवाय",
        meaning: "I bow to Lord Shiva",
        emoji: "🕉️"
      },
      {
        pairId: 2,
        mantra: "राम राम",
        meaning: "Chanting Lord Rama's name",
        emoji: "🏹"
      },
      {
        pairId: 3,
        mantra: "हरे कृष्णा",
        meaning: "Oh Lord Krishna",
        emoji: "🦚"
      },
      {
        pairId: 4,
        mantra: "जय गणेश",
        meaning: "Victory to Lord Ganesha",
        emoji: "🐘"
      }
    ]
  },
  // Level 2 - Medium (6 pairs)
  {
    level: 2,
    mantras: [
      {
        pairId: 1,
        mantra: "गायत्री मंत्र",
        meaning: "Sacred prayer to divine light",
        emoji: "☀️"
      },
      {
        pairId: 2,
        mantra: "सरस्वती वंदना",
        meaning: "Prayer to Goddess Saraswati",
        emoji: "🪷"
      },
      {
        pairId: 3,
        mantra: "महामृत्युंजय",
        meaning: "Great victory over death",
        emoji: "⚡"
      },
      {
        pairId: 4,
        mantra: "लक्ष्मी मंत्र",
        meaning: "Prayer for prosperity",
        emoji: "💰"
      },
      {
        pairId: 5,
        mantra: "दुर्गा स्तुति",
        meaning: "Praise to Goddess Durga",
        emoji: "🗡️"
      },
      {
        pairId: 6,
        mantra: "शांति मंत्र",
        meaning: "Peace mantra for harmony",
        emoji: "🕊️"
      }
    ]
  },
  // Level 3 - Advanced (8 pairs)
  {
    level: 3,
    mantras: [
      {
        pairId: 1,
        mantra: "ॐ गं गणपतये नमः",
        meaning: "Om, salutations to Lord Ganesha",
        emoji: "🐘"
      },
      {
        pairId: 2,
        mantra: "ॐ श्री गुरवे नमः",
        meaning: "Om, salutations to the Guru",
        emoji: "🙏"
      },
      {
        pairId: 3,
        mantra: "सर्वे भवन्तु सुखिनः",
        meaning: "May all beings be happy",
        emoji: "🌍"
      },
      {
        pairId: 4,
        mantra: "असतो मा सद्गमय",
        meaning: "Lead me from untruth to truth",
        emoji: "✨"
      },
      {
        pairId: 5,
        mantra: "वसुधैव कुटुम्बकम्",
        meaning: "The world is one family",
        emoji: "🤝"
      },
      {
        pairId: 6,
        mantra: "अहिंसा परमो धर्मः",
        meaning: "Non-violence is supreme dharma",
        emoji: "☮️"
      },
      {
        pairId: 7,
        mantra: "सत्यमेव जयते",
        meaning: "Truth alone triumphs",
        emoji: "🏆"
      },
      {
        pairId: 8,
        mantra: "योग: चित्त वृत्ति निरोधः",
        meaning: "Yoga is controlling mind fluctuations",
        emoji: "🧘"
      }
    ]
  }
];

export function MantraMemory({ className = '' }: { className?: string }) {
  const [cards, setCards] = useState<MantraCard[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    level: 1,
    streak: 0,
    hints: 3,
    moves: 0,
    matchedPairs: 0
  });
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const { toast } = useToast();

  // Initialize game
  useEffect(() => {
    initializeLevel(gameState.level);
  }, []);

  // Sound effect for matches
  const playMatchSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Create a pleasant chime sound
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Audio not available');
    }
  };

  const initializeLevel = (level: number) => {
    const levelData = mantraDatabase.find(l => l.level === level);
    if (!levelData) return;

    const gameCards: MantraCard[] = [];
    let cardId = 0;

    // Create pairs of cards (mantra + meaning)
    levelData.mantras.forEach((item) => {
      gameCards.push({
        id: cardId++,
        content: item.mantra,
        type: 'mantra',
        pairId: item.pairId,
        isFlipped: false,
        isMatched: false,
        emoji: item.emoji
      });
      
      gameCards.push({
        id: cardId++,
        content: item.meaning,
        type: 'meaning',
        pairId: item.pairId,
        isFlipped: false,
        isMatched: false,
        emoji: item.emoji
      });
    });

    // Shuffle cards
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setSelectedCards([]);
    setGameComplete(false);
    setShowCelebration(false);
    setGameState(prev => ({
      ...prev,
      matchedPairs: 0,
      moves: 0
    }));
  };

  const handleCardClick = (cardId: number) => {
    if (isChecking || selectedCards.length >= 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    // Flip the card
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    const newSelected = [...selectedCards, cardId];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setIsChecking(true);
      checkForMatch(newSelected);
    }
  };

  const checkForMatch = (selected: number[]) => {
    setTimeout(() => {
      const [firstId, secondId] = selected;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        // Match found!
        playMatchSound();
        setCards(prev => prev.map(c => 
          selected.includes(c.id) ? { ...c, isMatched: true } : c
        ));

        const newMatchedPairs = gameState.matchedPairs + 1;
        const newStreak = gameState.streak + 1;
        const newScore = gameState.score + (10 * newStreak);

        setGameState(prev => ({
          ...prev,
          score: newScore,
          streak: newStreak,
          matchedPairs: newMatchedPairs,
          moves: prev.moves + 1
        }));

        toast({
          title: "Perfect Match! 🎉",
          description: `+${10 * newStreak} points (${newStreak}x streak)`,
        });

        // Check if level complete
        const levelData = mantraDatabase.find(l => l.level === gameState.level);
        if (levelData && newMatchedPairs === levelData.mantras.length) {
          setGameComplete(true);
          setShowCelebration(true);
          setTimeout(() => {
            toast({
              title: "Level Complete! 🏆",
              description: "Ready for the next challenge?",
            });
          }, 1000);
        }
      } else {
        // No match
        setCards(prev => prev.map(c => 
          selected.includes(c.id) ? { ...c, isFlipped: false } : c
        ));
        setGameState(prev => ({
          ...prev,
          streak: 0,
          moves: prev.moves + 1
        }));
      }

      setSelectedCards([]);
      setIsChecking(false);
    }, 1000);
  };

  const useHint = () => {
    if (gameState.hints <= 0) return;

    // Find an unmatched pair and flip one card briefly
    const unmatchedCards = cards.filter(c => !c.isMatched && !c.isFlipped);
    if (unmatchedCards.length > 0) {
      const randomCard = unmatchedCards[Math.floor(Math.random() * unmatchedCards.length)];
      
      setCards(prev => prev.map(c => 
        c.id === randomCard.id ? { ...c, isFlipped: true } : c
      ));

      setTimeout(() => {
        setCards(prev => prev.map(c => 
          c.id === randomCard.id ? { ...c, isFlipped: false } : c
        ));
      }, 2000);

      setGameState(prev => ({ ...prev, hints: prev.hints - 1 }));
      
      toast({
        title: "Hint Used! 💡",
        description: "Card revealed for 2 seconds",
      });
    }
  };

  const nextLevel = () => {
    if (gameState.level < 3) {
      const newLevel = gameState.level + 1;
      setGameState(prev => ({
        ...prev,
        level: newLevel,
        hints: prev.hints + 1
      }));
      initializeLevel(newLevel);
    }
  };

  const resetGame = () => {
    setGameState({
      score: 0,
      level: 1,
      streak: 0,
      hints: 3,
      moves: 0,
      matchedPairs: 0
    });
    initializeLevel(1);
  };

  const currentLevelData = mantraDatabase.find(l => l.level === gameState.level);
  const progress = currentLevelData ? (gameState.matchedPairs / currentLevelData.mantras.length) * 100 : 0;

  return (
    <div className={`relative ${className}`}>
      <Card className="glass-card">
        <CardContent className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">🧠 Mantra Memory</h2>
            <p className="text-purple-200">Match mantras with their meanings</p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <Card className="glass-card border-purple-400/30">
              <CardContent className="p-3 text-center">
                <Trophy className="h-5 w-5 text-purple-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-white">{gameState.score}</div>
                <div className="text-xs text-purple-200">Score</div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-blue-400/30">
              <CardContent className="p-3 text-center">
                <Star className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-white">{gameState.level}</div>
                <div className="text-xs text-blue-200">Level</div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-orange-400/30">
              <CardContent className="p-3 text-center">
                <Heart className="h-5 w-5 text-orange-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-white">{gameState.streak}</div>
                <div className="text-xs text-orange-200">Streak</div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-yellow-400/30">
              <CardContent className="p-3 text-center">
                <Lightbulb className="h-5 w-5 text-yellow-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-white">{gameState.hints}</div>
                <div className="text-xs text-yellow-200">Hints</div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-white/80 mb-2">
              <span>Progress</span>
              <span>{gameState.matchedPairs}/{currentLevelData?.mantras.length || 0} pairs</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Game Board */}
          <div className={`grid gap-3 mb-6 ${
            gameState.level === 1 ? 'grid-cols-4' : 
            gameState.level === 2 ? 'grid-cols-4' : 'grid-cols-4'
          }`}>
            {cards.map((card) => (
              <motion.div
                key={card.id}
                className="aspect-square cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCardClick(card.id)}
              >
                <motion.div
                  className="relative w-full h-full preserve-3d"
                  animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Card Back */}
                  <div className="absolute inset-0 w-full h-full backface-hidden">
                    <Card className="w-full h-full glass-card border-purple-400/30 flex items-center justify-center">
                      <CardContent className="p-2 text-center">
                        <div className="text-2xl mb-1">🕉️</div>
                        <div className="text-xs text-purple-200">Tap to reveal</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Card Front */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                    <Card className={`w-full h-full flex items-center justify-center ${
                      card.isMatched 
                        ? 'bg-green-500/20 border-green-400/50' 
                        : card.type === 'mantra' 
                          ? 'glass-card border-amber-400/30' 
                          : 'glass-card border-blue-400/30'
                    }`}>
                      <CardContent className="p-2 text-center">
                        {card.emoji && (
                          <div className="text-lg mb-1">{card.emoji}</div>
                        )}
                        <div className={`text-xs font-medium ${
                          card.type === 'mantra' ? 'text-amber-200' : 'text-blue-200'
                        }`}>
                          {card.content}
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`mt-1 text-xs ${
                            card.type === 'mantra' 
                              ? 'border-amber-400/30 text-amber-300' 
                              : 'border-blue-400/30 text-blue-300'
                          }`}
                        >
                          {card.type === 'mantra' ? 'मंत्र' : 'Meaning'}
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-3">
            <Button
              onClick={useHint}
              disabled={gameState.hints <= 0}
              variant="outline"
              size="sm"
              className="border-yellow-400/30 text-white hover:bg-yellow-600/20"
            >
              <Lightbulb className="mr-2 h-4 w-4" />
              Hint ({gameState.hints})
            </Button>
            
            {gameComplete && gameState.level < 3 && (
              <Button
                onClick={nextLevel}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                <Star className="mr-2 h-4 w-4" />
                Next Level
              </Button>
            )}
            
            <Button
              onClick={resetGame}
              variant="outline"
              size="sm"
              className="border-purple-400/30 text-white hover:bg-purple-600/20"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50"
          >
            <Card className="glass-card max-w-md mx-auto">
              <CardContent className="p-6 text-center">
                <motion.div
                  animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: 2 }}
                  className="text-4xl mb-4"
                >
                  🎉
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Level {gameState.level} Complete!
                </h3>
                <p className="text-purple-200 mb-4">
                  Score: {gameState.score} • Moves: {gameState.moves}
                </p>
                <div className="flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        scale: [1, 1.3, 1], 
                        rotate: [0, 180, 360],
                        opacity: [0.5, 1, 0.5] 
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity, 
                        delay: i * 0.2 
                      }}
                    >
                      <Star className="h-5 w-5 text-amber-400" />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}