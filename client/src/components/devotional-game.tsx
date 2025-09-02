import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, RotateCcw, Star, Sparkles, Heart, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Link } from 'wouter';
import type { GameSession } from '@shared/schema';
import cherryLakeImage from '@assets/mark-tegethoff-NMLv5HQZnK4-unsplash_1756499329696.jpg';

interface Coin {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  size: number;
  targetX?: number;
  targetY?: number;
  scale?: number;
  opacity?: number;
  phase?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  radius: number;
  opacity: number;
}

const blessings = [
  { 
    text: "May Lord Ganesha remove all obstacles from your path", 
    hindi: "भगवान गणेश आपके मार्ग से सभी बाधाओं को दूर करें" 
  },
  { 
    text: "May Goddess Lakshmi bless you with prosperity", 
    hindi: "मां लक्ष्मी आपको समृद्धि का आशीर्वाद दें" 
  },
  { 
    text: "May your devotion bring you inner peace", 
    hindi: "आपकी भक्ति आपको मानसिक शांति दिलाए" 
  },
  { 
    text: "May divine light illuminate your journey", 
    hindi: "दिव्य प्रकाश आपके मार्ग को प्रकाशित करे" 
  },
  { 
    text: "May your prayers be fulfilled", 
    hindi: "आपकी प्रार्थनाएं पूर्ण हों" 
  }
];

export function DevotionalGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(10);
  const [attempts, setAttempts] = useState(0);
  const [hits, setHits] = useState(0);
  const [blessingPoints, setBlessingPoints] = useState(0);
  const [showBlessing, setShowBlessing] = useState(false);
  const [currentBlessing, setCurrentBlessing] = useState(blessings[0]);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [targetPosition] = useState({ x: 400, y: 300 });
  const [targetSize] = useState(35); // Smaller target for more difficulty
  const [gameStarted, setGameStarted] = useState(false);
  
  const { toast } = useToast();

  // Game mutations
  const saveScoreMutation = useMutation({
    mutationFn: async (gameData: GameSession) => {
      const response = await fetch("/api/v1/game/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gameData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      const accuracy = attempts > 0 ? Math.round((hits / attempts) * 100) : 0;
      toast({
        title: "Sacred Ritual Complete!",
        description: `Score: ${score} | Accuracy: ${accuracy}% | Blessing Points: ${blessingPoints}`,
      });
    },
    onError: (error) => {
      console.error('Failed to save score:', error);
      const accuracy = attempts > 0 ? Math.round((hits / attempts) * 100) : 0;
      toast({
        title: "Sacred Ritual Complete!",
        description: `Score: ${score} | Accuracy: ${accuracy}% | Blessing Points: ${blessingPoints}`,
        variant: "default",
      });
    },
  });

  const { data: leaderboard } = useQuery({
    queryKey: ["/api/v1/game/leaderboard"],
    enabled: gameStarted,
  });

  // Game physics and rendering
  const drawWaterSurface = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Draw simple rectangular pond
    const centerX = width / 2;
    const centerY = height / 2;
    const pondWidth = width * 0.6;
    const pondHeight = height * 0.5;
    const pondX = centerX - pondWidth / 2;
    const pondY = centerY - pondHeight / 2;
    
    // Draw rectangle pond
    ctx.fillStyle = 'rgba(100, 149, 237, 0.8)'; // Simple blue water
    ctx.fillRect(pondX, pondY, pondWidth, pondHeight);
    
    // Add simple border
    ctx.strokeStyle = 'rgba(101, 67, 33, 0.8)';
    ctx.lineWidth = 3;
    ctx.strokeRect(pondX, pondY, pondWidth, pondHeight);
  }, []);

  const drawCharanPaduka = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    // Golden charan paduka with divine aura
    const auraGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 1.5);
    auraGradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
    auraGradient.addColorStop(0.5, 'rgba(255, 165, 0, 0.4)');
    auraGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
    
    ctx.fillStyle = auraGradient;
    ctx.beginPath();
    ctx.arc(x, y, size * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Charan Paduka base
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, 'rgba(255, 215, 0, 1)');
    gradient.addColorStop(0.7, 'rgba(218, 165, 32, 0.9)');
    gradient.addColorStop(1, 'rgba(184, 134, 11, 0.8)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(x, y, size * 0.8, size * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sacred symbols
    ctx.strokeStyle = 'rgba(139, 69, 19, 0.8)';
    ctx.lineWidth = 2;
    ctx.font = `${size * 0.4}px serif`;
    ctx.fillStyle = 'rgba(139, 69, 19, 0.9)';
    ctx.textAlign = 'center';
    ctx.fillText('🕉', x, y + size * 0.15);

    // Gem decorations
    ctx.fillStyle = 'rgba(255, 0, 100, 0.8)';
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      const gemX = x + Math.cos(angle) * size * 0.5;
      const gemY = y + Math.sin(angle) * size * 0.3;
      ctx.beginPath();
      ctx.arc(gemX, gemY, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  const checkCollision = useCallback((coin: Coin, targetX: number, targetY: number, targetRadius: number) => {
    const dx = coin.x - targetX;
    const dy = coin.y - targetY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    // Make hit detection more generous
    const hitRadius = targetRadius * 1.2; // 20% larger hit area
    return distance < hitRadius;
  }, []);

  const createParticles = useCallback((x: number, y: number, isHit: boolean) => {
    const newParticles: Particle[] = [];
    const count = isHit ? 20 : 10;
    const colors = isHit 
      ? ['#FFD700', '#FFA500', '#FF69B4', '#FF1493'] 
      : ['#87CEEB', '#4682B4', '#5F9EA0'];

    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: Date.now() + i,
        x,
        y,
        vx: (Math.random() - 0.5) * (isHit ? 8 : 4),
        vy: (Math.random() - 0.5) * (isHit ? 8 : 4) - (isHit ? 3 : 1),
        life: isHit ? 60 : 30,
        maxLife: isHit ? 60 : 30,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  const createRipple = useCallback((x: number, y: number) => {
    const newRipple: Ripple = {
      id: Date.now(),
      x,
      y,
      radius: 0,
      opacity: 1
    };
    setRipples(prev => [...prev, newRipple]);
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw water surface
    drawWaterSurface(ctx, width, height);

    // Draw charan paduka
    drawCharanPaduka(ctx, targetPosition.x, targetPosition.y, targetSize);

    // Update and draw ripples with enhanced water reflection
    setRipples(prev => prev.map(ripple => ({
      ...ripple,
      radius: ripple.radius + (4 + Math.sin(ripple.radius * 0.1)), // Varied ripple speed
      opacity: Math.max(0, ripple.opacity - 0.025)
    })).filter(ripple => ripple.opacity > 0));

    ripples.forEach(ripple => {
      // Draw multiple concentric ripples for realistic water effect
      for (let i = 0; i < 3; i++) {
        const rippleRadius = ripple.radius - (i * 15);
        if (rippleRadius > 0) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${ripple.opacity * 0.3 * (1 - i * 0.3)})`;
          ctx.lineWidth = 3 - i;
          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, rippleRadius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    });

    // Update and draw coins with enhanced physics
    setCoins(prev => {
      const updated = prev.map(coin => {
        // Enhanced physics simulation
        coin.x += coin.vx;
        coin.y += coin.vy;
        coin.vy += 0.4; // Stronger gravity for level 10
        coin.vx *= 0.96; // More air resistance 
        coin.rotation += 0.3 + coin.vx * 0.1; // Rotation based on velocity

        // Check collision with charan paduka (simple and reliable)
        if (checkCollision(coin, targetPosition.x, targetPosition.y, targetSize)) {
          createParticles(coin.x, coin.y, true);
          createRipple(coin.x, coin.y);
          setScore(prev => prev + (level * 25)); // Higher score for level 10
          setHits(prev => prev + 1);
          setBlessingPoints(prev => prev + (level * 2));
          
          // Show blessing
          const randomBlessing = blessings[Math.floor(Math.random() * blessings.length)];
          setCurrentBlessing(randomBlessing);
          setShowBlessing(true);
          setTimeout(() => setShowBlessing(false), 3000);

          return null; // Remove coin
        }

        // Check if coin hits water (inside oval pond boundary)
        const pondCenterX = width / 2;
        const pondCenterY = height / 2;
        const pondRadiusX = width * 0.4;
        const pondRadiusY = height * 0.35;
        const pondDx = (coin.x - pondCenterX) / pondRadiusX;
        const pondDy = (coin.y - pondCenterY) / pondRadiusY;
        const pondDistance = Math.sqrt(pondDx * pondDx + pondDy * pondDy);
        
        if (pondDistance >= 0.95) {
          // Create water splash particles
          createParticles(coin.x, coin.y, false);
          
          // Create multiple ripple effects for realism
          createRipple(coin.x, coin.y);
          
          // Add secondary ripples for water reflection effect
          setTimeout(() => {
            createRipple(coin.x + (Math.random() - 0.5) * 20, coin.y + (Math.random() - 0.5) * 10);
          }, 100);
          
          setTimeout(() => {
            createRipple(coin.x + (Math.random() - 0.5) * 30, coin.y + (Math.random() - 0.5) * 15);
          }, 200);
          
          return null; // Remove coin
        }

        return coin;
      }).filter(Boolean) as Coin[];

      return updated;
    });

    // Draw coins
    coins.forEach(coin => {
      ctx.save();
      ctx.translate(coin.x, coin.y);
      ctx.rotate(coin.rotation);

      // Coin gradient
      const coinGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, coin.size);
      coinGradient.addColorStop(0, '#FFD700');
      coinGradient.addColorStop(0.7, '#FFA500');
      coinGradient.addColorStop(1, '#FF8C00');

      ctx.fillStyle = coinGradient;
      ctx.beginPath();
      ctx.arc(0, 0, coin.size, 0, Math.PI * 2);
      ctx.fill();

      // Coin border
      ctx.strokeStyle = '#B8860B';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Sacred symbol on coin
      ctx.fillStyle = '#8B4513';
      ctx.font = `${coin.size}px serif`;
      ctx.textAlign = 'center';
      ctx.fillText('₹', 0, coin.size * 0.3);

      ctx.restore();
    });

    // Update and draw particles
    setParticles(prev => prev.map(particle => ({
      ...particle,
      x: particle.x + particle.vx,
      y: particle.y + particle.vy,
      vy: particle.vy + 0.2,
      life: particle.life - 1
    })).filter(particle => particle.life > 0));

    particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      ctx.fillStyle = particle.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [isPlaying, coins, particles, ripples, targetPosition, targetSize, level, checkCollision, createParticles, createRipple, drawWaterSurface, drawCharanPaduka]);

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, animate]);

  const throwCoin = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    
    // Scale coordinates to canvas size for accuracy
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const scaledX = clickX * scaleX;
    const scaledY = clickY * scaleY;

    // Calculate realistic throwing trajectory with level 10 difficulty
    const startX = canvas.width / 2; // Center drop point for realism
    const startY = 60; // Higher drop point
    const dx = scaledX - startX;
    const dy = scaledY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Add wind resistance and unpredictability for level 10 difficulty
    const windX = (Math.random() - 0.5) * 25; // Strong wind effect
    const windY = (Math.random() - 0.5) * 15;
    const powerVariation = 0.7 + Math.random() * 0.6; // Random power variation
    const baseVelocity = Math.min(distance / 25, 8) * powerVariation;

    const coin: Coin = {
      id: Date.now() + Math.random(),
      x: startX,
      y: startY,
      vx: (dx / distance) * baseVelocity + windX * 0.2,
      vy: Math.max(2, (dy / distance) * baseVelocity) + windY * 0.15,
      rotation: Math.random() * Math.PI * 2,
      size: 10 + Math.random() * 4, // Varied coin sizes
      targetX: scaledX,
      targetY: scaledY,
      scale: 0.8 + Math.random() * 0.4,
      opacity: 1,
      phase: 'dropping'
    };

    setCoins(prev => [...prev, coin]);
    setAttempts(prev => prev + 1);

    // Create anticipation ripple where user clicked
    const anticipationRipple: Ripple = {
      id: Date.now() - 1,
      x: scaledX,
      y: scaledY,
      radius: 0,
      opacity: 0.3
    };
    setRipples(prev => [...prev, anticipationRipple]);
  }, [isPlaying]);

  const startGame = () => {
    setIsPlaying(true);
    setGameStarted(true);
    setScore(0);
    setAttempts(0);
    setHits(0);
    setBlessingPoints(0);
    setCoins([]);
    setParticles([]);
    setRipples([]);
  };

  const resetGame = () => {
    setIsPlaying(false);
    setScore(0);
    setAttempts(0);
    setHits(0);
    setBlessingPoints(0);
    setCoins([]);
    setParticles([]);
    setRipples([]);
    setShowBlessing(false);
  };

  const endGame = () => {
    setIsPlaying(false);
    
    // Save score only if there are attempts
    if (attempts > 0) {
      saveScoreMutation.mutate({
        score,
        level,
        hits,
        attempts,
        blessingPoints
      });
    } else {
      toast({
        title: "Sacred Ritual Complete!",
        description: "Thank you for participating in the devotional offering.",
      });
    }
  };

  return (
    <div className="min-h-screen spiritual-gradient p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <Button 
              variant="outline" 
              size="lg"
              className="border-purple-400/30 text-white hover:bg-purple-600/20"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Home
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">
              🪙 Sacred Pond Offering 🪙
            </h1>
            <p className="text-lg text-purple-200">
              Toss coins at the divine Charan Paduka and receive blessings
            </p>
          </div>
          <div className="w-32"></div> {/* Spacer for centering */}
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{score}</div>
              <div className="text-sm text-purple-200">Score</div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{hits}/{attempts}</div>
              <div className="text-sm text-purple-200">Hits</div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{level}</div>
              <div className="text-sm text-purple-200">Level</div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{blessingPoints}</div>
              <div className="text-sm text-purple-200">Blessings</div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {attempts > 0 ? Math.round((hits / attempts) * 100) : 0}%
              </div>
              <div className="text-sm text-purple-200">Accuracy</div>
            </CardContent>
          </Card>
        </div>

        {/* Game Canvas */}
        <div className="relative mb-6">
          <Card className="glass-card">
            <CardContent className="p-4">
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                onClick={throwCoin}
                className="w-full border-2 border-purple-400/30 rounded-lg cursor-crosshair"
                style={{ maxHeight: '60vh' }}
              />
              
              {!isPlaying && !gameStarted && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                  <Button 
                    onClick={startGame}
                    size="lg"
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Start Sacred Ritual
                  </Button>
                </div>
              )}

              {isPlaying && (
                <div className="absolute top-6 left-6">
                  <p className="text-white text-sm bg-black/50 px-3 py-1 rounded">
                    Click to toss coin towards the sacred Charan Paduka
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Flowing Water Effect */}
          <div className="relative w-full h-16 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-400/40 to-blue-600/60">
              <div className="flowing-water h-full w-full relative">
                <div className="absolute inset-0 opacity-60">
                  <div className="water-wave-1"></div>
                  <div className="water-wave-2"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Cherry Blossom Lake Scene */}
          <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-2xl">
            <img 
              src={cherryLakeImage} 
              alt="Cherry Blossom Lake" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent"></div>
            <div className="absolute bottom-4 left-4">
              <p className="text-white text-sm bg-black/50 px-3 py-1 rounded backdrop-blur-sm">
                🌸 Sacred waters flow into the eternal cherry blossom lake 🌸
              </p>
            </div>
          </div>
        </div>

        {/* Game Controls */}
        <div className="flex justify-center gap-4 mb-6">
          {!isPlaying && gameStarted && (
            <Button 
              onClick={startGame}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Play className="mr-2 h-5 w-5" />
              Continue
            </Button>
          )}
          
          {isPlaying && (
            <Button 
              onClick={endGame}
              size="lg"
              className="bg-gradient-to-r from-secondary to-destructive hover:from-secondary/90 hover:to-destructive/90"
            >
              <Star className="mr-2 h-5 w-5" />
              Complete Ritual
            </Button>
          )}
          
          <Button 
            onClick={resetGame}
            size="lg"
            variant="outline"
            className="border-purple-400/30 text-white hover:bg-purple-600/20"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Reset
          </Button>
        </div>

        {/* Blessing Message */}
        <AnimatePresence>
          {showBlessing && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50"
            >
              <Card className="glass-card max-w-md mx-auto">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-3">🙏</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Divine Blessing</h3>
                  <p className="text-purple-200 mb-2">{currentBlessing.text}</p>
                  <p className="text-purple-300 text-sm">{currentBlessing.hindi}</p>
                  <div className="flex justify-center gap-1 mt-3">
                    {[...Array(5)].map((_, i) => (
                      <Sparkles key={i} className="h-4 w-4 text-primary" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Leaderboard */}
        {leaderboard && Array.isArray(leaderboard) && leaderboard.length > 0 && (
          <Card className="glass-card">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Star className="mr-2 h-5 w-5 text-primary" />
                Sacred Leaderboard
              </h3>
              <div className="space-y-2">
                {(leaderboard as any[]).slice(0, 5).map((entry: any, index: number) => (
                  <div key={entry.id} className="flex justify-between items-center py-2 px-3 bg-purple-600/20 rounded">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="bg-primary/20 text-primary">
                        #{index + 1}
                      </Badge>
                      <span className="text-white">Anonymous Devotee</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">{entry.score}</div>
                      <div className="text-purple-200 text-xs">{entry.blessingPoints} blessings</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}