import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { X, Share2, Play, Heart, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { animateEmojiReaction } from "@/lib/animations";
import type { Content, EmojiType } from "@/types";

interface ContentViewerProps {
  contentId: string;
  onClose: () => void;
}

export default function ContentViewer({ contentId, onClose }: ContentViewerProps) {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();

  const { data: content, isLoading } = useQuery({
    queryKey: ['/api/v1/content', contentId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/content/${contentId}`);
      if (!response.ok) throw new Error('Failed to fetch content');
      return response.json() as Promise<Content>;
    }
  });

  const reactionMutation = useMutation({
    mutationFn: async ({ emoji }: { emoji: EmojiType }) => {
      const response = await fetch(`/api/v1/content/${contentId}/react`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emoji }),
      });
      if (!response.ok) throw new Error('Failed to react to content');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/v1/content'] });
    }
  });

  const handleEmojiReaction = (emoji: EmojiType, event: React.MouseEvent) => {
    const button = event.currentTarget as HTMLElement;
    animateEmojiReaction(button);
    reactionMutation.mutate({ emoji });
  };

  if (isLoading) {
    return (
      <AnimatePresence>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-hidden glass-card rounded-2xl shadow-2xl"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
              <Skeleton className="h-64 w-full mb-6" />
              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-10 w-20" />
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-10 w-16" />
                  <Skeleton className="h-10 w-16" />
                  <Skeleton className="h-10 w-16" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  if (!content) {
    return (
      <AnimatePresence>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="w-full max-w-md glass-card rounded-2xl shadow-2xl p-8 text-center"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Content Not Found</h3>
            <p className="text-white/70 mb-6">The requested content could not be loaded.</p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Close
            </button>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  const displayText = language === 'hi' ? content.textHindi : content.textEnglish;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="w-full max-w-4xl max-h-[90vh] overflow-hidden glass-card rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-white">{content.title}</h2>
              {content.deity && (
                <span className="px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-sm">
                  {content.deity}
                </span>
              )}
            </div>
            <motion.button
              onClick={onClose}
              className="p-2 glass-card rounded-full text-white hover:bg-white/20 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium mb-4">
                {t(content.category.toLowerCase().replace(' ', ''))}
              </span>
            </div>
            
            <div className="bg-white/5 rounded-xl p-6 mb-6">
              <p className={`text-lg text-white/90 leading-relaxed whitespace-pre-line ${
                language === 'hi' ? 'hindi-font text-xl' : ''
              }`}>
                {displayText}
              </p>
            </div>

            {content.translation && (
              <div className="bg-white/5 rounded-xl p-6 mb-6">
                <h4 className="text-white/80 font-medium mb-3">Translation:</h4>
                <p className="text-white/70 italic leading-relaxed">
                  {content.translation}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-white/10">
            <div className="flex items-center space-x-4">
              <motion.button 
                className="flex items-center space-x-2 px-6 py-3 glass-card rounded-full text-white hover:bg-white/30 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-4 h-4" />
                <span>{t('listen')}</span>
              </motion.button>
              <motion.button 
                className="flex items-center space-x-2 px-6 py-3 glass-card rounded-full text-white hover:bg-white/30 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 className="w-4 h-4" />
                <span>{t('share')}</span>
              </motion.button>
            </div>

            {/* Emoji Reactions */}
            <div className="flex items-center space-x-2">
              {(['🙏', '❤️', '🌟'] as EmojiType[]).map((emoji) => (
                <motion.button
                  key={emoji}
                  onClick={(e) => handleEmojiReaction(emoji, e)}
                  className="flex items-center space-x-1 px-4 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={reactionMutation.isPending}
                >
                  <span className="text-xl">{emoji}</span>
                  <span className="text-white/80 text-sm font-medium ml-1">
                    {content.emojiCounts?.[emoji] || 0}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}