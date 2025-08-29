import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Gamepad2, Trophy, Coins, Heart, MessageCircle, ArrowUp } from 'lucide-react';
import { Link } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { CommunityPost } from '@shared/schema';

export function CommunityPage() {
  const [activeTab, setActiveTab] = useState('feed');
  
  return (
    <div className="min-h-screen spiritual-gradient pb-20">
      <div className="pt-8 px-4 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          🤝 Community 🤝
        </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 glass-card border-purple-400/30">
            <TabsTrigger value="feed" className="data-[state=active]:bg-primary">
              <MessageSquare className="h-4 w-4 mr-2" />
              Prayer Wall
            </TabsTrigger>
            <TabsTrigger value="games" className="data-[state=active]:bg-primary">
              <Gamepad2 className="h-4 w-4 mr-2" />
              Sacred Games
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="mt-6">
            <PrayerWallContent />
          </TabsContent>

          <TabsContent value="games" className="mt-6">
            <SacredGamesContent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function PrayerWallContent() {
  const [newPost, setNewPost] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const { toast } = useToast();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['/api/v1/community/posts'],
  });

  const createPostMutation = useMutation({
    mutationFn: async (postData: { content: string; isAnonymous: boolean }) => {
      return apiRequest('POST', '/api/v1/community/posts', postData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/v1/community/posts'] });
      setNewPost('');
      toast({
        title: "Prayer shared",
        description: "Your prayer has been shared with the community",
      });
    },
  });

  const upvoteMutation = useMutation({
    mutationFn: async (postId: string) => {
      return apiRequest('POST', `/api/v1/community/posts/${postId}/upvote`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/v1/community/posts'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPost.trim()) {
      createPostMutation.mutate({
        content: newPost,
        isAnonymous,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <Card className="glass-card border-purple-400/30">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share your prayers, thoughts, or seek blessings..."
              className="bg-white/5 border-white/20 text-white placeholder-white/50 resize-none"
              rows={3}
              data-testid="new-post-input"
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={isAnonymous}
                  onCheckedChange={setIsAnonymous}
                  id="anonymous"
                />
                <label htmlFor="anonymous" className="text-white/80 text-sm">
                  Post anonymously
                </label>
              </div>
              
              <Button
                type="submit"
                disabled={!newPost.trim() || createPostMutation.isPending}
                className="bg-primary hover:bg-primary/90"
                data-testid="submit-post"
              >
                {createPostMutation.isPending ? 'Sharing...' : 'Share Prayer'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      {isLoading ? (
        <div className="text-center text-white">Loading prayers...</div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {(posts as CommunityPost[]).map((post: CommunityPost) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                layout
              >
                <Card className="glass-card border-purple-400/30">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {post.isAnonymous ? '🙏' : '👤'}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">
                            {post.isAnonymous ? 'Anonymous Devotee' : 'Community Member'}
                          </p>
                          <p className="text-white/60 text-xs">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <Badge variant="outline" className="border-purple-400 text-purple-300">
                        {post.type}
                      </Badge>
                    </div>
                    
                    <p className="text-white/90 mb-4 leading-relaxed">
                      {post.content}
                    </p>
                    
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => upvoteMutation.mutate(post.id)}
                        className="text-white/70 hover:text-primary"
                        data-testid={`upvote-${post.id}`}
                      >
                        <ArrowUp className="h-4 w-4 mr-1" />
                        {post.upvotes}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white/70 hover:text-purple-400"
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Reply
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white/70 hover:text-primary"
                      >
                        <Heart className="h-4 w-4 mr-1" />
                        Bless
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {(posts as CommunityPost[]).length === 0 && (
            <div className="text-center text-white py-8">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-white/50" />
              <h3 className="text-lg font-semibold mb-2">No prayers yet</h3>
              <p className="text-white/70">Be the first to share your thoughts</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SacredGamesContent() {
  const { data: wallet } = useQuery({
    queryKey: ['/api/v1/games/wallet'],
  });

  const { data: leaderboard = [] } = useQuery({
    queryKey: ['/api/v1/games/leaderboard'],
  });

  return (
    <div className="space-y-6">
      {/* Wallet Status */}
      <Card className="glass-card border-purple-400/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold mb-1">Sacred Coins</h3>
              <p className="text-white/70 text-sm">Your spiritual currency</p>
            </div>
            <div className="flex items-center space-x-2">
              <Coins className="h-6 w-6 text-primary" />
              <span className="text-2xl font-bold text-primary">
                {(wallet as any)?.balance || 100}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Games Hub */}
      <Card className="glass-card border-purple-400/30">
        <CardContent className="p-6">
          <h3 className="text-white font-semibold mb-4">Sacred Games</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sacred Pond Game */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card className="glass-card sakura-glow border-primary/30">
                <CardContent className="p-4 text-center">
                  <div className="text-4xl mb-2">🪙</div>
                  <h4 className="text-white font-medium mb-1">Sacred Pond</h4>
                  <p className="text-white/70 text-xs mb-3">Toss coins for blessings</p>
                  <Link href="/game">
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      Play Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Coming Soon Games */}
            <div className="bg-white/5 rounded-lg p-4 text-center border border-white/10">
              <div className="text-4xl mb-2">🔮</div>
              <h4 className="text-white font-medium mb-1">More Games</h4>
              <p className="text-white/70 text-xs">Coming Soon</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card className="glass-card border-purple-400/30">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Trophy className="h-5 w-5 text-primary mr-2" />
            <h3 className="text-white font-semibold">Leaderboard</h3>
          </div>
          
          {(leaderboard as any[]).length > 0 ? (
            <div className="space-y-3">
              {(leaderboard as any[]).slice(0, 10).map((entry: any, index: number) => (
                <div key={entry.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`text-lg font-bold ${
                      index === 0 ? 'text-primary' :
                      index === 1 ? 'text-gray-300' :
                      index === 2 ? 'text-accent' : 'text-white/70'
                    }`}>
                      #{index + 1}
                    </span>
                    <span className="text-white">Anonymous Player</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-primary font-medium">{entry.score}</span>
                    <span className="text-white/60 text-sm">pts</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-white/70 py-4">
              <Trophy className="h-12 w-12 mx-auto mb-2 text-white/50" />
              <p>No scores yet. Be the first to play!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}