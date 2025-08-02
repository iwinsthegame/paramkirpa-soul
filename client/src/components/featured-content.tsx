import { motion } from "framer-motion";
import { Play, Share2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { Skeleton } from "@/components/ui/skeleton";

interface FeaturedContentProps {
  selectedDay: string;
}

export default function FeaturedContent({ selectedDay }: FeaturedContentProps) {
  const { t, language } = useLanguage();

  const { data: featuredContent, isLoading } = useQuery({
    queryKey: ['/api/v1/content/featured', selectedDay],
    queryFn: async () => {
      const response = await fetch(`/api/v1/content/featured?day=${selectedDay}`);
      if (!response.ok) throw new Error('Failed to fetch featured content');
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <section className="mb-8">
        <div className="glass-card rounded-2xl p-8 shadow-xl">
          <Skeleton className="h-8 w-64 mx-auto mb-6" />
          <div className="max-w-3xl mx-auto">
            <Skeleton className="h-6 w-32 mx-auto mb-6" />
            <Skeleton className="h-8 w-48 mx-auto mb-4" />
            <div className="bg-white/5 rounded-xl p-6 mb-4">
              <Skeleton className="h-32 w-full mb-4" />
              <div className="border-t border-white/10 pt-4">
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
            <div className="flex justify-center space-x-4">
              <Skeleton className="h-12 w-24" />
              <Skeleton className="h-12 w-24" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!featuredContent) {
    return (
      <section className="mb-8">
        <div className="glass-card rounded-2xl p-8 shadow-xl">
          <h3 className="text-2xl font-semibold text-white mb-6 text-center">
            {t('featuredDevotion')}
          </h3>
          <div className="text-center">
            <p className="text-white/70">No featured content available for {selectedDay}</p>
          </div>
        </div>
      </section>
    );
  }

  const displayText = language === 'hi' ? featuredContent.textHindi : featuredContent.textEnglish;

  return (
    <section className="mb-8">
      <motion.div 
        className="glass-card rounded-2xl p-8 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-semibold text-white mb-6 text-center">
          {t('featuredDevotion')}
        </h3>
        
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <span className="inline-block px-4 py-2 bg-amber-400/20 text-amber-300 rounded-full text-sm font-medium">
              {t(featuredContent.category.toLowerCase())}
            </span>
          </div>
          
          <h4 className="text-xl font-semibold text-white text-center mb-4">
            {featuredContent.title}
          </h4>
          
          <div className="bg-white/5 rounded-xl p-6 mb-4">
            <p className={`text-lg text-white/90 text-center leading-relaxed mb-4 whitespace-pre-line ${
              language === 'hi' ? 'hindi-font text-xl' : ''
            }`}>
              {displayText}
            </p>
            
            {featuredContent.translation && (
              <div className="border-t border-white/10 pt-4">
                <p className="text-white/70 text-sm text-center italic">
                  {featuredContent.translation}
                </p>
              </div>
            )}
          </div>
          
          <div className="flex justify-center space-x-4">
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
        </div>
      </motion.div>
    </section>
  );
}
