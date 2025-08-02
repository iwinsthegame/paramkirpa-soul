import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { animateEmojiReaction } from "@/lib/animations";
import { Skeleton } from "@/components/ui/skeleton";
import type { Prayer, EmojiType } from "@/types";

export default function PrayerFeed() {
  const [page, setPage] = useState(1);
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const { data: prayers, isLoading, error } = useQuery({
    queryKey: ['/api/v1/prayers', page],
    queryFn: async () => {
      const response = await fetch(`/api/v1/prayers?page=${page}&limit=10`);
      if (!response.ok) throw new Error('Failed to fetch prayers');
      return response.json() as Promise<Prayer[]>;
    }
  });

  const reactionMutation = useMutation({
    mutationFn: async ({ prayerId, emoji }: { prayerId: string; emoji: EmojiType }) => {
      const response = await fetch(`/api/v1/prayers/${prayerId}/react`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emoji }),
      });
      if (!response.ok) throw new Error('Failed to react to prayer');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/v1/prayers'] });
    }
  });

  const handleEmojiReaction = (prayerId: string, emoji: EmojiType, event: React.MouseEvent) => {
    const button = event.currentTarget as HTMLElement;
    animateEmojiReaction(button);
    reactionMutation.mutate({ prayerId, emoji });
  };

  const formatTimeAgo = (date: Date | string) => {
    const now = new Date();
    const prayerDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - prayerDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} ${t('hoursAgo')}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ${t('dayAgo')}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass-card-dark rounded-xl p-6">
            <Skeleton className="h-20 w-full mb-4" />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-white/70">Failed to load prayers. Please try again.</p>
      </div>
    );
  }

  if (!prayers?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-white/70">No prayers have been shared yet. Be the first to share!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {prayers.map((prayer, index) => (
        <motion.div
          key={prayer.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-card-dark rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
        >
          <p className="text-white/90 mb-4 leading-relaxed">
            {prayer.text}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {(['❤️', '🌟', '🙏'] as EmojiType[]).map((emoji) => (
                <motion.button
                  key={emoji}
                  onClick={(e) => handleEmojiReaction(prayer.id, emoji, e)}
                  className="flex items-center space-x-1 px-3 py-1 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={reactionMutation.isPending}
                >
                  <span>{emoji}</span>
                  <span className="text-white/80 text-sm">
                    {prayer.emojiCounts[emoji] || 0}
                  </span>
                </motion.button>
              ))}
            </div>
            <div className="text-white/50 text-xs">
              {formatTimeAgo(prayer.createdAt)}
            </div>
          </div>
        </motion.div>
      ))}

      <div className="text-center mt-8">
        <motion.button
          onClick={() => setPage(prev => prev + 1)}
          className="px-8 py-3 glass-card rounded-full text-white hover:bg-white/30 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="mr-2">⬇️</span>
          {t('loadMore')}
        </motion.button>
      </div>
    </div>
  );
}
