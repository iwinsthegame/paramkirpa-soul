import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { X, Share2, Play, Heart, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { animateEmojiReaction } from "@/lib/animations";
import type { Content, EmojiType } from "@/types";
import { useEffect } from "react";

interface ContentViewerProps {
  contentId: string;
  onClose: () => void;
}

export default function ContentViewer({ contentId, onClose }: ContentViewerProps) {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();

  // Auto-scroll to top and prevent body scroll when modal opens
  useEffect(() => {
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Cleanup: restore body scroll when modal closes
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [contentId]);

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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-8">
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-8">
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
              className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all duration-300"
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
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-8">
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
                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
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

          {/* Content - Ancient Manuscript Style */}
          <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium mb-4">
                {t(content.category.toLowerCase().replace(' ', ''))}
              </span>
            </div>
            
            {/* Ancient Book Style Content Display */}
            <div className="relative">
              {/* Manuscript Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border-2 border-primary/20" />
              <div className="absolute top-4 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              
              {/* Left margin decoration */}
              <div className="absolute left-2 top-8 bottom-8 w-1 bg-gradient-to-b from-primary/40 via-secondary/30 to-primary/40 rounded-full" />
              
              {/* Main Content */}
              <div className="relative p-8 pl-12">
                {/* Decorative Header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center space-x-2 text-primary/80">
                    <div className="w-8 h-px bg-gradient-to-r from-transparent to-primary/60" />
                    <span className="text-2xl">॥</span>
                    <div className="w-8 h-px bg-gradient-to-l from-transparent to-primary/60" />
                  </div>
                </div>

                {/* Sanskrit/Hindi Text */}
                <div className="mb-6">
                  <p className={`text-lg text-white/95 leading-relaxed whitespace-pre-line ${
                    language === 'hi' ? 'hindi-font text-xl' : 'sanskrit-font'
                  } text-center`} style={{
                    fontFamily: language === 'hi' ? '"Noto Sans Devanagari", "Sanskrit 2003", serif' : '"Sanskrit 2003", "Noto Sans Devanagari", serif',
                    lineHeight: '1.8',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                  }}>
                    {displayText}
                  </p>
                </div>

                {/* Decorative Footer */}
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2 text-primary/80">
                    <div className="w-8 h-px bg-gradient-to-r from-transparent to-primary/60" />
                    <span className="text-2xl">॥</span>
                    <div className="w-8 h-px bg-gradient-to-l from-transparent to-primary/60" />
                  </div>
                </div>
              </div>
            </div>

            {content.translation && (
              <div className="mt-6 bg-white/5 rounded-xl p-6 border border-white/10">
                <h4 className="text-primary font-medium mb-3 flex items-center">
                  <span className="mr-2">📖</span> 
                  Translation & Significance:
                </h4>
                <p className="text-white/80 italic leading-relaxed text-sm">
                  {content.translation}
                </p>
              </div>
            )}

            {/* Additional Devotional Context */}
            {(content.category === 'Chalisas' || content.category === 'Stotrams') && (
              <div className="mt-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-4 border border-purple-400/20">
                <div className="flex items-center text-purple-300 text-sm font-medium mb-2">
                  <span className="mr-2">🕉️</span>
                  Traditional Practice
                </div>
                <p className="text-purple-200/80 text-sm leading-relaxed">
                  {content.category === 'Chalisas' 
                    ? 'Recite daily in the morning or evening with devotion. Light a lamp or incense while chanting for enhanced spiritual benefits.'
                    : 'This ancient Sanskrit hymn should be chanted with proper pronunciation and devotion, preferably during sunrise or sunset hours.'
                  }
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