import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import Header from "@/components/header";
import FloatingBackground from "@/components/floating-background";
import DayTabs from "@/components/day-tabs";
import ContentCategories from "@/components/content-categories";
import DayCategories from "@/components/day-categories";
import ContentList from "@/components/content-list";
import ContentViewer from "@/components/content-viewer";
import FeaturedContent from "@/components/featured-content";
import PrayerInput from "@/components/prayer-input";
import PrayerFeed from "@/components/prayer-feed";
import { useLanguage } from "@/hooks/use-language";

type ViewMode = 'overview' | 'dayCategories' | 'contentList' | 'contentViewer';

export default function Home() {
  const [selectedDay, setSelectedDay] = useState(() => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[new Date().getDay()];
  });
  
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedContentId, setSelectedContentId] = useState<string>('');
  
  const { t } = useLanguage();

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setViewMode('contentList');
  };

  const handleDaySelect = (day: string) => {
    setSelectedDay(day);
    setViewMode('dayCategories');
  };

  const handleContentSelect = (contentId: string) => {
    setSelectedContentId(contentId);
    setViewMode('contentViewer');
  };

  const handleBackToCategories = () => {
    setViewMode('dayCategories');
  };

  const handleBackToOverview = () => {
    setViewMode('overview');
    setSelectedCategory('');
    setSelectedContentId('');
  };

  const handleCloseViewer = () => {
    setViewMode('contentList');
    setSelectedContentId('');
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <FloatingBackground />
      <Header />
      
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8 pb-24">
        {/* Day Tabs - Always visible */}
        <DayTabs 
          selectedDay={selectedDay} 
          onDaySelect={handleDaySelect} 
        />
        
        {/* Conditional Content Based on View Mode */}
        {viewMode === 'overview' && (
          <>
            <ContentCategories onCategorySelect={handleCategorySelect} />
            <FeaturedContent selectedDay={selectedDay} />
          </>
        )}
        
        {viewMode === 'dayCategories' && (
          <DayCategories 
            selectedDay={selectedDay}
            onCategorySelect={handleCategorySelect}
          />
        )}
        
        {viewMode === 'contentList' && (
          <ContentList
            selectedDay={selectedDay}
            selectedCategory={selectedCategory}
            onContentSelect={handleContentSelect}
            onBack={handleBackToCategories}
          />
        )}
        
        {viewMode === 'contentViewer' && selectedContentId && (
          <ContentViewer
            contentId={selectedContentId}
            onClose={handleCloseViewer}
          />
        )}
        
        {/* Prayer Wall Section - Show in overview and dayCategories modes */}
        {(viewMode === 'overview' || viewMode === 'dayCategories') && (
          <section className="mb-8">
            <motion.div 
              className="glass-card rounded-2xl p-8 shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-2xl font-semibold text-foreground mb-6 text-center flex items-center justify-center space-x-3">
                <img src="/prayer-wall-logo.png" alt="Prayer Wall" className="w-8 h-8 object-contain" />
                <span>{t('prayerWall')}</span>
              </h3>
              
              <PrayerInput />
              <PrayerFeed />
            </motion.div>
          </section>
        )}

        {/* Coming Soon Section - Only show in overview mode */}
        {viewMode === 'overview' && (
          <section className="mb-8">
            <motion.div 
              className="glass-card rounded-2xl p-8 shadow-xl text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-2xl font-semibold text-white mb-4">{t('comingSoon')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <Link href="/game">
                  <motion.div 
                    className="bg-white/5 rounded-xl p-6 cursor-pointer border border-purple-400/20 hover:border-purple-400/40 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="text-primary text-3xl mb-3">🪙</div>
                    <h4 className="text-lg font-semibold text-white mb-2">Sacred Pond Game</h4>
                    <p className="text-white/70 text-sm">Toss coins at divine Charan Paduka</p>
                  </motion.div>
                </Link>
                <motion.div 
                  className="bg-white/5 rounded-xl p-6"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-primary text-3xl mb-3">💎</div>
                  <h4 className="text-lg font-semibold text-white mb-2">{t('rudrakshStore')}</h4>
                  <p className="text-white/70 text-sm">{t('authenticItems')}</p>
                </motion.div>
                <motion.div 
                  className="bg-white/5 rounded-xl p-6"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-primary text-3xl mb-3">👶</div>
                  <h4 className="text-lg font-semibold text-white mb-2">{t('kidsReels')}</h4>
                  <p className="text-white/70 text-sm">{t('spiritualContent')}</p>
                </motion.div>
              </div>
            </motion.div>
          </section>
        )}
      </main>
    </div>
  );
}
