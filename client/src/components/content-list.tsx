import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { ArrowLeft, Clock, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Content } from "@/types";

interface ContentListProps {
  selectedDay: string;
  selectedCategory: string;
  onContentSelect: (contentId: string) => void;
  onBack: () => void;
}

export default function ContentList({ selectedDay, selectedCategory, onContentSelect, onBack }: ContentListProps) {
  const { t, language } = useLanguage();

  const { data: contents, isLoading } = useQuery({
    queryKey: ['/api/v1/content', selectedDay, selectedCategory],
    queryFn: async () => {
      const response = await fetch(`/api/v1/content?day=${selectedDay}&category=${selectedCategory}`);
      if (!response.ok) throw new Error('Failed to fetch content');
      return response.json() as Promise<Content[]>;
    }
  });

  if (isLoading) {
    return (
      <section className="mb-8">
        <div className="glass-card rounded-2xl p-8 shadow-xl">
          <div className="flex items-center mb-6">
            <Skeleton className="h-10 w-10 rounded-full mr-4" />
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-card-dark rounded-xl p-6">
                <Skeleton className="h-6 w-48 mb-3" />
                <Skeleton className="h-16 w-full mb-4" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!contents?.length) {
    return (
      <section className="mb-8">
        <div className="glass-card rounded-2xl p-8 shadow-xl">
          <div className="flex items-center mb-6">
            <button
              onClick={onBack}
              className="mr-4 p-2 glass-card rounded-full text-white hover:bg-white/20 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-semibold text-white">
              {t(selectedCategory.toLowerCase().replace(' ', ''))} - {selectedDay}
            </h3>
          </div>
          <div className="text-center py-8">
            <p className="text-white/70">No content available for this category.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <motion.div 
        className="glass-card rounded-2xl p-8 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-6">
          <motion.button
            onClick={onBack}
            className="mr-4 p-2 glass-card rounded-full text-white hover:bg-white/20 transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <h3 className="text-2xl font-semibold text-white">
            {t(selectedCategory.toLowerCase().replace(' ', ''))} - {selectedDay}
          </h3>
          <div className="ml-auto text-white/60 text-sm">
            {contents.length} items
          </div>
        </div>
        
        <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
          {contents.map((content, index) => {
            const displayText = language === 'hi' ? content.textHindi : content.textEnglish;
            const preview = displayText.length > 150 ? displayText.substring(0, 150) + '...' : displayText;
            
            return (
              <motion.div
                key={content.id}
                onClick={() => onContentSelect(content.id)}
                className="glass-card-dark rounded-xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-lg font-semibold text-white flex-1">
                    {content.title}
                  </h4>
                  {content.deity && (
                    <span className="ml-3 px-3 py-1 bg-primary/20 text-primary rounded-full text-xs">
                      {content.deity}
                    </span>
                  )}
                </div>
                
                <p className={`text-white/80 text-sm leading-relaxed mb-4 ${
                  language === 'hi' ? 'hindi-font' : ''
                }`}>
                  {preview}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-white/60 text-xs">
                    {content.duration && (
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{content.duration}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <span>🙏 {content.emojiCounts?.['🙏'] || 0}</span>
                      <span>❤️ {content.emojiCounts?.['❤️'] || 0}</span>
                      <span>🌟 {content.emojiCounts?.['🌟'] || 0}</span>
                    </div>
                  </div>
                  <motion.div 
                    className="flex items-center text-primary text-sm"
                    whileHover={{ x: 5 }}
                  >
                    <span className="mr-1">Read</span>
                    <Star className="w-4 h-4" />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}